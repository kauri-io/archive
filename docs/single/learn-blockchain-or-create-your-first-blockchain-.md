---
title: Learn Blockchain | Create Your First Blockchain | Blocks & Consensus
summary: The best way to for a developer to fully understand blockchain technology is to get underneath the hood and build one themselves! Learn by doing The aim of this
authors:
  - Josh Cassidy (@joshorig)
date: 2019-12-13
some_url: 
---

# Learn Blockchain | Create Your First Blockchain | Blocks & Consensus

> The best way to for a developer to fully understand blockchain technology is to get underneath the hood and build one themselves!

## Learn by doing 

The aim of this series of tutorials is to help the reader / implementer get to grips with and learn blockchain fundamentals by understanding how to implement them. It is important to note that we will only build a proof of concept blockchain for the purposes of learning.

**NOTE: Our implementation will not be a ready for production implementation**

This series is aimed at developers and so assumes familiarity with basic programming concepts, this version is implemented in JavaScript so you should be comfortable reading and writing basic JavaScript. Also an understanding of how a basic rest API works since we use an API to allow communication between our blockchain instances.

## Final source code

The [source code is available here](https://github.com/kauri-io/kauri-learn-to-build-a-blockchain/tree/master/nodejs/part1), feel free to refer to the final example code any time you get stuck during the tutorial. Also if anything is unclear, feel free to leave a comment, or make an update to the tutorial and I will happily review and approve updates!

## Setting up

Since we are implementing our blockchain in JavaScript you need to have the following installed:

-   Nodejs
-   NPM
-   An IDE or TextEditor (I'll be using Atom in this tutorial)

## Part 1: Blocks and Consensus (Proof of Work)

In part 1 we:

-   Create a basic **blockchain** (list of blocks linked by cryptographic signatures)
-   Implement an API so multiple instances can communicate with each other (allow our instances to form a blockchain network)
-   Implement a simple Consensus algorithm, a simple version of Proof of Work (let our instances agree on a shared state)

At any point during this tutorial you can refer to [**the final source code here**](https://github.com/kauri-io/kauri-learn-to-build-a-blockchain/tree/master/nodejs/part1)

## What is a blockchain?

A blockchain is a sequential list of records which we call blocks. Each block contains data, this can be any form of data, files or in the case of most blockchains a list of transactions. These blocks are **chained** together sequentially using cryptographic hashes.

![Chain of blocks](https://api.kauri.io:443/ipfs/QmR2wDW8Ua1f4ipry9JmYWUsUDUcWTsKUMLDqboMP8r9qN)

These hashes are fundamental to how blockchains are secured, if you are unfamiliar with hashes, [get clued up here!](https://medium.com/@ConsenSys/blockchain-underpinnings-hashing-7f4746cbd66b)

Each block has a hash which is derived from the data it holds and the previous blocks hash. This means that if the previous blocks data is changed then the previous blocks hash also change, which means our current block hash also changes and thus all subsequent block hashes also change. **This allows us to prove that our blockchain is valid or invalid by calculating and comparing the hashes.**

## Step 1: Representing a Block

First let's create our Block object.

-   Create the file `src/block.js` and add the following code

```javascript
"use strict";

(async () => {

  const Consensus   = require('./consensus')
  const parse       = require('url-parse');
  const Utils = require("./utils");

    function Block(blockNumber,data,nonce,previousBlockHash){
        this.blockNumber = blockNumber;
        this.data = data;
        this.nonce = nonce;
        this.previousBlockHash = previousBlockHash
        this.timestamp = Date.now()
        this.hash = "";
    }

    module.exports = Block;

})();
```

Our constructor sets the following properties in our Block object:

-   **blockNumber:** the index number of this block in the list of blocks
-   **data:** the data contained in this block, this can be a file, list of transactions, or in this example a simple string
-   **nonce:** a random number - this is important in our implementation and we will come back to it later
-   **previousBlockHash:** the hash of the previous block
-   **timestamp:** the unix timestamp when this block was created
-   **hash:** the hash of this block

Essentially our `Block` object is timestamped on creation and hold its data in variable `data`. It references the hash of the previous block in `previousBlockHash` and stores its own cryptographic signature in the variable `hash`

## Step 2: Generating our blocks cryptographic signature

Now that we have the data construct for our block we now need to generate its cryptographic signature. To do this we need to use a crypto library for an implementation of our hashing algorithm. Remember if you are unfamiliar with hashes [you can get clued up here!](https://medium.com/@ConsenSys/blockchain-underpinnings-hashing-7f4746cbd66b)

Since we're developing in Javascript we use the following [crypto-js library](https://www.npmjs.com/package/crypto-js)

Install crypto-js by running the following commands:

```shell
npm install
npm install crypto-js --save
```

Now create a `src/utils.js` file with the following content:

```javascript
"use strict";

(async () => {

    const SHA256  = require("crypto-js/sha256");

    function getSHA256HexString(input) {
    return SHA256(input).toString();
    }

    function calculateHash(block) {
    let blockDetails = {
        previousBlockHash: block.previousBlockHash,
        data: block.data,
        blockNumber: block.blockNumber,
        timestamp: block.timestamp,
        nonce: block.nonce
    }
    return getSHA256HexString(JSON.stringify(blockDetails, Object.keys(blockDetails).sort()));
    }


    module.exports = {
    getSHA256HexString,
    calculateHash
    };

})();
```

We use the **sha256 hashing algorithm**, which is the algorithm used in most blockchain implementations today, SHA (Secure Hashing algorithm) takes any size input and produces a 32 bytes or 64 character hexadecimal string (the hash).

One of the important things about this algorithm is that it is impossible with current technology to derive the inputs from the hash, but easy to verify the inputs produce the resulting hash. We'll come back to this later in the tutorial.

First we import the SHA256 function from the [crypto-js library](https://www.npmjs.com/package/crypto-js)

```javascript
const SHA256  = require("crypto-js/sha256");
```

To make things clean we add a function `getSHA256HexString` which returns the output of `SHA256` as a string

```javascript
function getSHA256HexString(input) {
    return SHA256(input).toString();
}
```

We then use the `getSHA256HexString` function to generate a sha256 hash of our block object in the function `calculateHash`

```javascript
function calculateHash(block) {
    let blockDetails = {
        previousBlockHash: block.previousBlockHash,
        data: block.data,
        blockNumber: block.blockNumber,
        timestamp: block.timestamp,
        nonce: block.nonce
    }
    return getSHA256HexString(JSON.stringify(blockDetails, Object.keys(blockDetails).sort()));
    }
```

Notice that we first sort our block details so we can ensure the inputs are always in the same order when hashed, and we use `JSON.stringify` to produce a JSON string which represents our block before hashing.

## Step 3: Representing a blockchain and mining blocks with POW (proof of work)

Now that we have our `block` object and can generate its `hash` we're now ready to represent our blockchain!

Create a `src/blockchain.js` file with the following content:

```javascript
"use strict";

(async () => {

    const Consensus   = require('./consensus')
    const Utils = require("./utils");

    function Blockchain(consensus,blocks){
    this.blocks = [] //the chain of blocks!
    if(blocks)
    {
        this.blocks = blocks;
    }
    this.consensus = consensus;
    //Create the genesis block
    this.newBlock("I am genesis!")
    }

    Blockchain.prototype.newBlock = function(data) {
    let previousBlockHash = "";
    let newBlockNumber = 0
    if(this.blocks.length>0) {
        previousBlockHash = this.blocks[this.blocks.length-1].hash;
        newBlockNumber = this.blocks.length;
    }
    let block = this.consensus.mineBlock(newBlockNumber,data,previousBlockHash);
    this.blocks.push(block);
    return block;
    }

    Blockchain.prototype.isValid = function() {
    let currentblockNumber = 1; //start after the genesis block (blockNumber=0)
    while(currentblockNumber < this.blocks.length) {
        const currentBlock = this.blocks[currentblockNumber];
        const previousBlock = this.blocks[currentblockNumber - 1];

        // Check that previousBlockHash is correct
        if (currentBlock.previousBlockHash !== previousBlock.hash) {
        return false;
        }

        // check that the current blockHash is correct
        if(currentBlock.hash !== Utils.calculateHash(currentBlock)) {
        return false;
        }

        // Check that the nonce (proof of work result) is correct
        if (!this.consensus.validHash(currentBlock.hash)) {
        return false;
        }
        currentblockNumber++;
    }

    return true;
    }

    module.exports = Blockchain;
})();
```

First we import the files we need

```javascript
const Consensus   = require('./consensus')
const Utils = require("./utils");
```

We use `Utils` to have access to our `calculateHash` function we defined earlier, and we'll come back to `Consensus` a little later.

Next we define our constructor:

```javascript
function Blockchain(consensus,blocks){
    this.blocks = [] //the chain of blocks!
    if(blocks)
    {
        this.blocks = blocks;
    }
    this.consensus = consensus;
    //Create the genesis block
    this.newBlock("I am genesis!")
}
```

Since **a blockchain is essentially an ordered list of blocks** we define a variable `blocks` which is an array of block objects.

### Genesis Block

The first block in a blockchain is called the genesis block, it is the foundation block on which additional blocks in the blockchain are added.

In our constructor we need to generate the genesis block. Add a function in our blockchain object called `newBlock` and in our constructor we add the line:

```javascript
this.newBlock("I am genesis!");

Blockchain.prototype.newBlock = function(data) {
    let previousBlockHash = "";
    let newBlockNumber = 0
    if(this.blocks.length>0) {
        previousBlockHash = this.blocks[this.blocks.length-1].hash;
        newBlockNumber = this.blocks.length;
    }
    let block = this.consensus.mineBlock(newBlockNumber,data,previousBlockHash);
    this.blocks.push(block);
    return block;
}
```

Since it is the first block it does not have a `previousBlockHash` to link to, so we define this as `""` (empty string). We know it is the first block because the length of our blockchain is 0.

If we are not adding the **genesis block**, the length of our blocks array is greater than 0

```javascript
if(this.blocks.length>0)
```

then we set the `previousBlockHash` to the hash of the previous block in the blocks array

```javascript
previousBlockHash = this.blocks[this.blocks.length-1].hash;
```

and we set the `newBlockNumber` to the next index value in the blocks array

```javascript
newBlockNumber = this.blocks.length
```

### Mining a block

We have the data ready to create a block, the **genesis block** has the following data:

-   **data:** "I am genesis!"
-   **newBlockNumber:** 0
-   **previousBlockHash:** ""

At this point we need to add this new block to our blockchain. However since our blockchain will exist in a network we need to have some method to determine:

-   When a new block is allowed to be added to the chain, and by whom
-   Which chain is correct when there are conflicts (a conflict meaning 2 or more instances in the network have different chains)

This brings us back to the `Consensus` class we saw earlier. In a blockchain we use a consensus algorithm to determine the two points above. In this tutorial we implement a simple version of the POW (proof of work) consensus algorithm.

In POW you must prove that you completed some computationally intensive work in order to gain the right to add a new block to the blockchain. Because of the intensive work the term "mining" was coined and so in the POW adding a new block required you to `mine` a new block.

More on this later but for now lets add a line in our `newBlock` function where we defer to our `Consensus` object to `mineBlock`

```javascript
let block = this.consensus.mineBlock(newBlockNumber,data,previousBlockHash);
```

Once the block has been mined we can go ahead and add it to the blockchain or `blocks` array.

```javascript
this.blocks.push(block);
return block;
```

### Consensus

Create a `src/consensus.js` file with the following content:

```javascript
"use strict";

(async () => {

    function Consensus(){
    this.difficulty = 5;
    this.difficultyRegex = new RegExp('^0{'+this.difficulty+'}')
    }

    Consensus.prototype.mineBlock = function(blockNumber,data,previousBlockHash) {
    let block = new Block(blockNumber,data,0,previousBlockHash); //start the nonce at 0
    //while we have not got the correct number of leadings 0's (difficulty * 0) in our blockHash, keep incrementing the blocks nonce
    while(!this.validHash(block.hash))
    {
        block.incrementNonce();
    }
    console.log("Mined new block: "+block.toString());
    return block;
    }

    Consensus.prototype.validHash = function(hash) {
    return this.difficultyRegex.test(hash);
    }

    module.exports = Consensus;
})();
```

### Proof of Work (POW)

We are implementing a basic version of the proof of work consensus algorithm. As discussed earlier, in POW you must prove that you completed some computationally intensive work in order to gain the right to add a new block to the blockchain.

This computation work is defined as a mathematical problem.

> Find the number **n** (the `nonce`) which when hashed with the block data `X` gives `Y` number of leading 0's

So here:

-   **X**: is our block data not including the `nonce`
-   **n**: is the `nonce` we hash with the block data X, we need to try random values for `n` or increment `n` until we find a solution
-   **Y**: is the difficulty setting for the mathematical problem. The large Y the longer it takes to find the correct value of `n`

| Nonce  | Difficulty | Data                 | Nonce + Data               | Hash                                                             |
| ------ | ---------- | -------------------- | -------------------------- | ---------------------------------------------------------------- |
| 0      | 1          | Kauri.io is awesome! | 0Kauri.io is awesome!      | 9e7225648a50be4478bf262e952a2e67b0debfe43599f0a3ffbfbaa9575a8d45 |
| 2      | 1          | Kauri.io is awesome! | 2Kauri.io is awesome!      | 05dadbb490bfda5aab50a396d60c218edba243e7bc9f65f9198a5500a3736a19 |
| 369    | 3          | Kauri.io is awesome! | 369Kauri.io is awesome!    | c9d975ec74deb18dedf6af92382fbde3fe0b93b997c8c5f717161f41c29db29e |
| 370    | 3          | Kauri.io is awesome! | 370Kauri.io is awesome!    | 000ab0ae9cff46f2ade79d246db2437d99d76db2514c64d804f9e4458f82e557 |
| 29147  | 4          | Kauri.io is awesome! | 29147Kauri.io is awesome!  | d7fe610204d725fa3eb6902f7ed5f563c278caba2041f228f8922f75f763c2ac |
| 29148  | 4          | Kauri.io is awesome! | 29148Kauri.io is awesome!  | 0000346ceb6ef446b9f3189bc19921789ef0c216d95a7ac9c3634b9fec88f641 |
| 350729 | 5          | Kauri.io is awesome! | 350729Kauri.io is awesome! | 00000a6fac62ae5f26c1919c9a03a087f5e49f6a4e12e1fa57cb7a17d7e8d284 |

The hash (nonce + input string), SHA256(0Kauri.io is awesome!), does not start with zero. We increment the nonce by 1. Finally on the 3rd attempt we find the hash value such that it starts with zero.

The hash of the input is ‘2Kauri.io is awesome!’. The number of zeroes that the output has to start with is known as the `Difficulty`.

From the above table we can see that as the difficulty increases, the value of the nonce also increases dramatically.
A difficulty of 3 resulted in 371 iterations to get the correct nonce value where as a difficulty of 5 resulted in 350730 iterations.

This means that it is more difficult to solve the math problem and so takes more time.

**It is important for the POW algorithm to find it difficult to find the solution to the problem, but easy to verify when given a solution to the problem that it is correct.**

We need to easily and more importantly quickly be able to verify our blockchain is correct. We'll come back to this point a little later.

### Implementing Proof of Work

First we import the `block` and `utils` dependencies:

```javascript
const Block   = require('./block');
const Utils   = require('./utils');
```

Next in our `consensus` constructor we set our `difficulty` value and setup our `difficultyRegex` test

```javascript
function Consensus(){
    this.difficulty = 5;
    this.difficultyRegex = new RegExp('^0{'+this.difficulty+'}')
}
```

The `difficultyRegex` checks for `difficulty` number of leading 0s in the data, where the data is the computed hash.

Next we add a function `validHash`, which takes a computed hash and uses the `difficultyRegex` to test its validity. Which is "Does the hash contain the right number of leading 0s?"

```javascript
Consensus.prototype.validHash = function(hash) {
    return this.difficultyRegex.test(hash);
}
```

Now we add our `mineBlock` function

```javascript
Consensus.prototype.mineBlock = function(blockNumber,data,previousBlockHash) {
    let block = new Block(blockNumber,data,0,previousBlockHash); //start the nonce at 0
    //while we have not got the correct number of leadings 0's (difficulty * 0) in our blockHash, keep incrementing the blocks nonce
    while(!this.validHash(block.hash))
    {
        block.incrementNonce();
    }
    console.log("Mined new block: "+block.toString());
    return block;
}
```

-   First we create a new `block` object starting with the nonce at 0
-   Whilst we do not have a valid hash (not the correct number of leading 0s) increment the nonce value and compute the new hash

**Remember since the nonce is part of the block data, when its updated the block hash also changes!**

One last thing, we have not implemented the function `incrementNonce` in our Block class. Add the following function to the `block.js` class

```javascript
Block.prototype.incrementNonce = function() {
    this.nonce++;
    this.hash = Utils.calculateHash(this);
}
```

This increments the nonce and then recalculates the hash.

Also add a `toString` method to the `Block` class to help with tests

```javascript
Block.prototype.toString = function() {
    let blockDetails = {
    previousBlockHash: this.previousBlockHash,
    data: this.data,
    blockNumber: this.blockNumber,
    timestamp: this.timestamp,
    nonce: this.nonce,
    blockHash: this.hash
    }
    return JSON.stringify(blockDetails, Object.keys(blockDetails).sort());
};
```

There you have it, we now have a Blockchain node which uses the POW algorithm to mine new blocks, and is initialised with a genesis block. However, we're not quite done with the Blockchain class, we still need a way to ensure our blockchain data has not been tampered with!

## Validating Our Blockchain

To recap a blockchain is simply a sequential list of records which we call blocks. Each block contains data, this can be any form of data, files, or in the case of most blockchains, a list of transactions. These blocks are **chained** together sequentially using cryptographic hashes.

> If data is tampered with in any of our blocks then the block hashes change.

To validate our blockchain or list of blocks, we must check the following things in each block:

-   Check that the block in question is referencing the hash of the previous block in the list (ensure that our _chain_ is maintained
-   Check that the hash of the data in the current block is equal to its block hash
-   Check that the nonce or proof of work result is valid

The `isValid` function in our `Blockchain` class look this:

```javascript
Blockchain.prototype.isValid = function() {
    let currentblockNumber = 1; //start after the genesis block (blockNumber=0)
    while(currentblockNumber < this.blocks.length) {
        const currentBlock = this.blocks[currentblockNumber];
        const previousBlock = this.blocks[currentblockNumber - 1];

        // Check that previousBlockHash is correct
        if (currentBlock.previousBlockHash !== previousBlock.hash) {
            return false;
        }

        // check that the current blockHash is correct
        if(currentBlock.hash !== Utils.calculateHash(currentBlock)) {
            return false;
        }

        // Check that the nonce (proof of work result) is correct
        if (!this.consensus.validHash(currentBlock.hash)) {
            return false;
        }
        currentblockNumber++;
    }

    return true;
}
```

## Testing Our Blockchain

We're now ready to test our blockchain, we use mocha to write our test, lets install it:

```shell
npm install mocha --save
```

Next we create a test file `test/blockchain.js` with the following content:

```javascript
"use strict";

(async () => {
    // ########################################################################################################
    // ########################################################################################################
    // IMPORTS
    const assert      = require('assert');
    const Blockchain  = require('../src/blockchain');
    const Consensus   = require('../src/consensus');
    const Block       = require('../src/block');

    // ########################################################################################################
    // ########################################################################################################
    //
    var blockchain;
    var consensus;
    const BLOCK_TIMEOUT = 60000;

    // ########################################################################################################
    // ########################################################################################################
    // TESTS
    describe('Blockchain tests',  function() {
    this.timeout(BLOCK_TIMEOUT*4);

    beforeEach(async function() {
        consensus = new Consensus();
        blockchain = new Blockchain(consensus);
    });

    it('Should create a genesis block when created',  function() {

        assert.strictEqual(blockchain.blocks.length, 1);
        assert.strictEqual(blockchain.blocks[0].data, "I am genesis!");
        assert.strictEqual(blockchain.blocks[0].blockNumber, 0);
    });

    it('Should add new valid block',  function() {
        blockchain.newBlock("some data");
        assert.strictEqual(blockchain.blocks.length, 2);
        assert.strictEqual(blockchain.blocks[1].data, "some data");
        assert.strictEqual(blockchain.blocks[1].blockNumber, 1);
        assert.strictEqual(blockchain.isValid(), true);
        blockchain.newBlock("some more data");
        assert.strictEqual(blockchain.blocks.length, 3);
        assert.strictEqual(blockchain.blocks[2].data, "some more data");
        assert.strictEqual(blockchain.blocks[2].blockNumber, 2);
        assert.strictEqual(blockchain.isValid(), true);
    });

    it('Should fail to validate blockchain if new block addded with incorrect previous hash',  function() {
        blockchain.newBlock("some data");
        assert.strictEqual(blockchain.isValid(), true);
        let block = consensus.mineBlock(3,"some more data","INVALID_HASH");
        blockchain.blocks.push(block);
        assert.strictEqual(blockchain.isValid(), false);
    });

    it('Should fail to validate blockchain if data in a previous block is changed',  function() {
        blockchain.newBlock("some data");
        assert.strictEqual(blockchain.isValid(), true);
        blockchain.newBlock("some more data");
        assert.strictEqual(blockchain.isValid(), true);
        blockchain.blocks[1].data = "invalid data";
        assert.strictEqual(blockchain.isValid(), false);
    });

    it('Should fail to validate blockchain if a previous block is swapped for another',  function() {
        blockchain.newBlock("some data");
        assert.strictEqual(blockchain.isValid(), true);
        blockchain.newBlock("some more data");
        assert.strictEqual(blockchain.isValid(), true);
        let block = consensus.mineBlock(1,"some data",blockchain.blocks[0].hash); //regenerating the block should result in a different block hash
        blockchain.blocks[1] = block;
        assert.strictEqual(blockchain.isValid(), false);
    });

    });
})();
```

We want to test the following things:

-   Our genesis block is created when our test starts
-   New blocks can be mined with our blockchain state being valid
-   Adding a new block with an invalid previous hash causes the blockchain state to become invalid
-   Changing data in a previous block causes the blockchain state to become invalid
-   Swapping a previous block in the chain causes the blockchain state to become invalid

Let's give it a try! Run `mocha test` in the root of the project:

```shell
./node_modules/mocha/bin/mocha test
```

![mocha test results](https://api.kauri.io:443/ipfs/QmPVJ1YEhCv9oPQZFxxr5qNzzT4iRtHpwh8TNEkDhcGVxf)

Hopefully you should have 5 tests passing as shown above!

If so, awesome! You have created a simple blockchain which implements proof of work mining

![awesome gif](https://api.kauri.io:443/ipfs/QmW8kcCqxE1w1UqnXHi7XTnxeu6wVATF2vL1JNSBXWxNf6)

We're not done yet! We still need to create our blockchain network and let our nodes agree on a shared state!

## Step 4: Creating a blockchain network

Now that we have a working blockchain node, we need to set up an API, so multiple nodes can communicate with each other.

To enable our API we use [express](https://expressjs.com/) so lets install it via npm

```shell
npm install express --save
```

Our API also implements the `post` method so we also use `multer` and `body-parser` to parse request arguments.

Install [multer](https://github.com/expressjs/multer) and [body-parser](https://www.npmjs.com/package/body-parser) via npm:

```shell
npm install body-parse --save
npm install multer --save
```

We need four methods to create our API:

1.  `/mine` a post which takes a single argument `data` and creates and mines a new block
2.  `/blocks` a get which returns all the blocks in our node
3.  `/peers/add` a post which takes a single argument `peers` and registers the peers with our node
4.  `/peers` a get which returns all the peers added to our node

Create a `src/api.js` file with the following content:

```javascript
"use strict";

(async () => {

    const express     = require('express');
    const bodyParser  = require('body-parser');
    const multer      = require('multer');

    function getAPI(blockchain) {
    var app = express();
    const requestParser = multer();
    app.use(bodyParser.json());

    app.post('/mine', requestParser.array(), (req, res) => {
        const { data }  = req.body || {};

        if (!data) {
        res.status(400).send('Error: Must set data in request');
        return;
        }

        let block = blockchain.newBlock(data);

        const response = {
        message: 'Mined new block',
        ...block
        };

        res.status(201).send(response);
    });

    app.get('/blocks', (req, res) => {
        const response = {
        blocks: blockchain.blocks,
        count: blockchain.blocks.length
        };

        res.send(response);
    });

    app.get('/peers', (req, res) => {
        const response = {
        peers: blockchain.peers,
        count: blockchain.peers.length
        };

        res.send(response);
    });

    app.post('/peers/add', requestParser.array(), (req, res) => {
        const { peers } = req.body || [];

        if (!peers) {
        res.status(400).send('Error: Must supply list of peers in field peers');
        return;
        }

        peers.forEach((peer) => {
        blockchain.registerPeer(peer);
        });

        const response = {
        message: 'New peers have been added',
        peers: JSON.stringify([...blockchain.peers]),
        count: blockchain.peers.size
        };

        res.status(201).send(response);
    });

    return app;
    }

    module.exports = {
    getAPI
    }
})();
```

### Setting up Express & Request Parsing

First we import our dependencies as follows:

```javascript
const express     = require('express');
const bodyParser  = require('body-parser');
const multer      = require('multer');
```

Next we implement a `getAPI` function which takes our `blockchain` class and creates the API endpoints which our node server uses.

Here we also create our express app and then use `multer` and `bodyParser` to setup our `json` request parser

```javascript
function getAPI(blockchain) {
    var app = express();
    const requestParser = multer();
    app.use(bodyParser.json());
}
```

### Mine Endpoint

Inside our `getAPI` function we add a `/mine` post endpoint to our express app:

```javascript
app.post('/mine', requestParser.array(),  (req, res) => {
    const { data }  = req.body || {};

    if (!data) {
    res.status(400).send('Error: Must set data in request');
    return;
    }

    let block = blockchain.newBlock(data);

    const response = {
    message: 'Mined new block',
    ...block
    };

    res.status(201).send(response);
});
```

After checking our request parameters are valid and `data` is not empty, we use our `blockchain` object create and mine a new block using the `newBlock` function we developed earlier.

```javascript
let block = blockchain.newBlock(data);
```

We then set the response of the request to be the contents of our block object and send the response:

```javascript
const response = {
    message: 'Mined new block',
    ...block
    };

res.status(201).send(response);
```

### Blocks Endpoint

Inside our `getAPI` function we add a `/blocks` `get` endpoint to our express app:

```javascript
app.get('/blocks', (req, res) => {
    const response = {
    blocks: blockchain.blocks,
    count: blockchain.blocks.length
    };

    res.send(response);
});
```

We construct a `response` object which returns the blocks array in our blockchain object and also the length for convenience. We then send the response.

### Peers Endpoint

Inside our `getAPI` function we add a `/peers` `get` endpoint to our express app:

```javascript
app.get('/peers', (req, res) => {
    const response = {
    peers: blockchain.peers,
    count: blockchain.peers.length
    };

    res.send(response);
});
```

We construct a `response` object which returns the `peers` array in our `blockchain` object and also the length for convenience. We then send the response.

At this point our blockchain object has no concept of a peer! We need to update our blockchain object in `src/blockchain.js` to:

1.  Maintain a unique list of peers
2.  Add a function to add peers to our node.

In our constructor we add the following line to represent our set of peers:

```javascript
this.peers = new Set(); //list of unique peers in the network
```

Now our constructor should be as follows:

```javascript
function Blockchain(consensus,blocks){
    this.blocks = [] //the chain of blocks!
    if(blocks)
    {
        this.blocks = blocks;
    }
    this.peers = new Set(); //list of unique peers in the network
    this.consensus = consensus;
    //Create the genesis block
    this.newBlock("I am genesis!")
}
```

We also add a `registerPeer` function to allow peers to be added to our node:

```javascript
Blockchain.prototype.registerPeer = function(address) {
    const host = parse(address).host;
    this.peers.add(host);
    console.log("Registered peer: "+host)
}
```

Each node in the network has its own express endpoints and we use the [url-parse](https://www.npmjs.com/package/url-parse) package to parse the peer and add its host to the `peers` set.

Add url-parse via npm:

```shell
npm install url-parse --save
```

Import the `url-parse` dependency to the blockchain class:

```javascript
const parse  = require('url-parse');
```

### Add Peers Endpoint

Inside our `getAPI` function we add a `/peers/add` `post` endpoint to our express app:

```javascript
app.post('/peers/add', requestParser.array(), (req, res) => {
    const { peers } = req.body || [];

    if (!peers) {
    res.status(400).send('Error: Must supply list of peers in field peers');
    return;
    }

    peers.forEach((peer) => {
        blockchain.registerPeer(peer);
    });

    const response = {
        message: 'New peers have been added',
        peers: JSON.stringify([...blockchain.peers]),
        count: blockchain.peers.size
    };

    res.status(201).send(response);
});
```

After checking our request parameters are valid, and that peers is not empty, we use our `blockchain` object to register each peer to our node by calling the `registerPeer` function

```javascript
peers.forEach((peer) => {
    blockchain.registerPeer(peer);
});
```

We then set the response of the request to be the contents of our `block.peers` object and send the response:

```javascript
const response = {
    message: 'New peers have been added',
    peers: JSON.stringify([...blockchain.peers]),
    count: blockchain.peers.size
    };
```

### The Server

Now we have all the components ready for our API we can create the server. Create a `src/server.js` file with the following content:

```javascript
"use strict";

(async () => {

    const Utils       = require("./utils");
    const Api         = require("./api");
    const Blockchain  = require('../src/blockchain');
    const Consensus   = require('../src/consensus');

    const DEFAULT_PORT = 5000;
    const args = Utils.parseArgs();

    const port = args.port || DEFAULT_PORT;

    let app = Api.getAPI(new Blockchain(new Consensus()));
    app.listen(port)
    console.log("Blockchain server listening on port: "+port)


})();
```

The server creates our `API`, passing it a newly created `blockchain` and then starts the `API` listening on the supplied port `5000` by default:

```javascript
const DEFAULT_PORT = 5000;
const args = Utils.parseArgs();

const port = args.port || DEFAULT_PORT;

let app = Api.getAPI(new Blockchain(new Consensus()));
app.listen(port)
```

We use the helper function `Utils.parseArgs()` to parse command line arguments from the user when the server is started, so we need to add the `parseArgs()` function to the Utils class in `src/utils.js`.

```javascript
function parseArgs() {
return process.argv
    .slice(2)
    .map(arg => arg.split('='))
    .reduce((args, [value, key]) => {
        args[value] = key;
        return args;
    }, {});
}

…

module.exports = {
    getSHA256HexString,
    calculateHash,
    parseArgs
};
```

This enables the user to pass command line arguments as follows:

```shell
server.js port=5001
```

## Testing Our Network of Nodes

Let's take our network for a spin!

In order to test our blockchain network we need to be able to connect to the API over HTTP. I use `curl` in this tutorial however you could also use a tool like [Postman](https://www.getpostman.com/)

Start the node/server:

```shell
node src/server.js
```

Since this creates a new blockchain which mines the genesis block this may take a few minutes, however you should see something like this when complete:

![start first server](https://api.kauri.io:443/ipfs/QmTcFYS7aFqbxKypavJ4HSmAnxcET6AusgCiM523BeC1Pr)

Great, so we now have a node with an API exposed at `http://localhost:5000`.

A genesis block was mined with the block hash `00000bc11abd23a7254dd93216e81f04f4a48010e04f6b7910e54775cc845f2d`.

To mine a new block we call our `/mine` endpoint. In a new terminal tab run the following `curl` command

```shell
curl -X POST "localhost:5000/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine block no 1"
}
'
```

![mine a block](https://api.kauri.io:443/ipfs/QmV2K36xWDMXqtjtYpejZyqrXL5mEvWhAwHoGJiLFVmNvq)

You should see output similar to the above, we should now have 2 or in my case 3 blocks in our blockchain, since from the above you can see I ran the command twice!

We can use our `/blocks` endpoint to confirm this by running the following curl command:

```shell
curl -X GET "localhost:5000/blocks" -H 'Content-Type: application/json'
```

![get blocks](https://api.kauri.io:443/ipfs/QmYWWUorXgqrw9rkFrCHph3NgauDqQRtkQhnZZy1hB1f14)

From the image above we can see there are 3 blocks in the node:

-   The genesis block
-   The 2 blocks I created via the API

This is great but, we do not yet have a network, this is one node running on a machine with 3 blocks, let's spin up another server on a different port. In a new terminal tab run the following:

```shell
node src/server.js port=5001
```

![start second server](https://api.kauri.io:443/ipfs/QmbtLm9xc3VpTqvSA4Knm592SFD8oVyxCgE5Vp6NpwitET)

Now lets add our first node to this new server as a peer using the `/peers/add` endpoint:

```shell
curl -X POST "localhost:5001/peers/add"  -H 'Content-Type: application/json' -d'
{
    "peers":  ["http://localhost:5000"]
}
'
```

![Add peer](https://api.kauri.io:443/ipfs/Qme8kunkuT4j3Lykk2nerrQycRc3ztkVmxYSfB2oa6Ssbj)

Mine a new block on our second node:

```shell
curl -X POST "localhost:5001/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine block on second server"
}
'
```

![New block on second server](https://api.kauri.io:443/ipfs/QmdPNrq3osXVCGMSCAanJPv44DQtqqE1iN4ewnnK1uyJnZ)

Here we have an issue, we 2 nodes in our network:

-   **Node 1**: Has 3 blocks, the genesis blocks and then 2 blocks mined via the API
-   **Node 2**: Has 2 blocks, its own genesis block and then 1 block mined via the API

Which is a fork in our blockchain network from the genesis block.

![](https://api.kauri.io:443/ipfs/QmX1sgDBSPTwcSAt5dtcUvqoMP2A9LzzqEzY1Rbg9ujLUF)

What the fork! But we have a consensus mechanism, proof of work! Why are the nodes in the network not reaching consensus! Has consensus failed! No not quite.

## Step 5: Coordinating our blockchain network: coming to consensus with longest valid chain rule

Proof of Work accounts for this scenario with the _longest chain rule_ which we have not yet implemented.

Actually the above scenario can occur when the proof of work algorithm is solved by multiple nodes in the network simultaneously, or in isolation (yet to receive a message via network propagation that the block has been mined).

The longest chain rule ensures that in the network the valid chain with the most work is recognised as the main chain. All new blocks would thus be added to this by any other node in the network!

We need to add a way for a node to check the longest chain in the network, and then if it is not theirs, replace their blocks with the longest and thus main chain. To do this we must add:

1.  A new endpoint to our API `/peers/check`
2.  A new function to our blockchain class `checkLongestChain` which is called via the API and return `true` if our set of blocks is the longest chain
3.  A new function in our consensus implementation `checkLongestChain` which called the `/blocks` endpoint for each peer and checks the length of their chain

### Add Peers Check EndPoint

Add the `/peers/check` endpoint to the `/src/api.js` file:

```javascript
app.get('/peers/check', async (req, res) => {
    let response;
    let result = await blockchain.checkLongestChain();
    if(result) {
        response = {
            message: 'Chain is longest',
            newChain: blockchain.blocks
        };
    }
    else {
        response = {
            message: 'Chain updated',
            newChain: blockchain.blocks
        };
    }
    res.send(response);

});
```

Since we know we need to make a call to our peers API to get their block info, we define `/peers/check` as `async` so the application `await`s the result before responding.

```javascript
app.get('/peers/check', async (req, res) => {
```

We await the result of a call to `blockchain.checkLongestChain`

```javascript
let result = await blockchain.checkLongestChain();
```

Set the response to either `Chain is longest` or `Chain updated` depending on the result of the call to `blockchain.checkLongestChain`, and send it:

```javascript
response = {
    message: 'Chain is longest',
    newChain: blockchain.blocks
};
}
else {
response = {
    message: 'Chain updated',
    newChain: blockchain.blocks
};
}
res.send(response);
```

### Blockchain: Check Longest Chain

Now add the `checkLongestChain` function to our `blockchain.js` class:

```javascript
Blockchain.prototype.checkLongestChain = async function () {
    let result = await this.consensus.checkLongestChain(this.peers, this.blocks.length);
    if (result.newBlocks) {
        this.blocks = result.newBlocks;
        console.log("Chain replaced: " + this.blocks)
    }
    return result.isLongestChain;
}
```

Again we define the function as `async` and delegate the responsibility of checking which node has the longest chain to our consensus class, passing it our list of peers and the length of our blockchain:

```javascript
Blockchain.prototype.checkLongestChain = async function() {
let result = await this.consensus.checkLongestChain(this.peers,this.blocks.length);
```

If we get a set of new blocks back from the call, then we update our list of blocks with the new list of blocks returned by consensus:

```javascript
if(result.newBlocks) {
    this.blocks = result.newBlocks;
    console.log("Chain replaced: "+this.blocks)
}
```

We also must return the result of the call whether the node is indeed the longest chain or not

```javascript
return result.isLongestChain;
```

## Consensus: Check Longest Chain

First install the [node-fetch](https://www.npmjs.com/package/node-fetch) package

```shell
npm install node-fetch --save
```

And add it to the class dependencies

```shell
const Block = require('./block');
const Utils = require('./utils');
const fetch = require('node-fetch');
```

Add the `checkLongestChain` function to the `consensus.js` class:

```javascript
Consensus.prototype.checkLongestChain = function (peers, length) {
    let promises = [];

    peers.forEach((host) => {
        promises.push(
            fetch('http://' + host + '/blocks')
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(json => json)
        );
    });

    return Promise.all(promises).then((chains) => {
        let newBlocks = null;
        let longestLength = length;

        chains.forEach(({ blocks }) => {
            // Check if the length is longer and the chain is valid
            if (blocks.length > longestLength && this.isChainValid(blocks)) {
                longestLength = blocks.length;
                newBlocks = blocks;
            }
        });

        return { isLongestChain: !newBlocks, newBlocks: newBlocks };
    });
}
```

For each peer we registered, we call the `/blocks` endpoint to retrieve their list of blocks. We wait for all the calls to return before we run the checks, so add a fetch call for each peer to a list of promises which we resolve.

```javascript
let promises = [];

peers.forEach((host) => {
    promises.push(
    fetch('http://'+host+'/blocks')
        .then(res => {
        if (res.ok) {
            return res.json();
        }
        })
        .then(json => json)
    );
});
```

Then use `Promise.all` to resolve the list of promises and for each returned set of blocks, we check:

-   If peer had a longer list of blocks
-   If the peers list of blocks is valid

If both of the above are true then we return `false` since our list of blocks is not the longest and we return the longest list of blocks so they our node can assume this as its valid chain

```javascript
return Promise.all(promises).then((chains) => {
    let newBlocks = null;
    let longestLength = length;

    chains.forEach(({ blocks }) => {
    // Check if the length is longer and the chain is valid
    if (blocks.length > longestLength && this.isChainValid(blocks)) {
        longestLength = blocks.length;
        newBlocks = blocks;
    }
});
```

We have a list of blocks from our peers, but the blockchain class does not call the `isValid` function so we must add a `isChainValid` function which does the same, but instead takes a list of blocks as an argument to our `consensus.js` class:

```javascript
Consensus.prototype.isChainValid = function (blocks) {
    let currentblockNumber = 1; //start after the genesis block (blockNumber=0)
    while (currentblockNumber < blocks.length) {
        const currentBlock = blocks[currentblockNumber];
        const previousBlock = blocks[currentblockNumber - 1];

        // Check that previousBlockHash is correct
        if (currentBlock.previousBlockHash !== previousBlock.hash) {
            return false;
        }
        // check that the current blockHash is correct
        if (currentBlock.hash !== Utils.calculateHash(currentBlock)) {
            return false;
        }
        // Check that the nonce (proof of work result) is correct
        if (!this.validHash(currentBlock.hash)) {
            return false;
        }
        currentblockNumber++;
    }
    return true;
}
```

## Testing Our Network of Nodes

Let's take our network for a spin!

Start the node 1 server:

```shell
node src/server.js
```

![start first node](https://api.kauri.io:443/ipfs/QmYD3Y5rsh51fG1DhmMmqqW4K9fJBejCCH4v9totDrwdYo)

Mine a few blocks

```shell
curl -X POST "localhost:5000/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine a block on node 1"
}
'
```

![Blocks mined on node 1](https://api.kauri.io:443/ipfs/QmYurZSDQ2871FphJUEdyvyqdYRR4TbjpzWkRsXBB3pPTA)

Start node 2 server:

```shell
node src/server.js port=5001
```

![start second node](https://api.kauri.io:443/ipfs/QmSeJgEu3vxJ5115CkryyUC3wPJ4fWrEJGNHAJW8YVx7t4)

Mine a block on node 2

```shell
curl -X POST "localhost:5001/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine a block on node 2"
}
'
```

![Block mined on node 2](https://api.kauri.io:443/ipfs/QmdNYQrvHKNhn3RdmGa21yzNxDR9nifJ8XaNapRiuVaZcz)

Now add our nodes as peers of each other:

```shell
curl -X POST "localhost:5000/peers/add"  -H 'Content-Type: application/json' -d'
{
    "peers":  ["http://localhost:5001"]
}
'
curl -X POST "localhost:5001/peers/add"  -H 'Content-Type: application/json' -d'
{
    "peers":  ["http://localhost:5000"]
}
'
```

![Add peers](https://api.kauri.io:443/ipfs/QmWSLUyLGzxGE6gFDy2gJg36X1Vs2LmUGUqw3dHKmjSiDV)

Again where we have a fork, so calling `/peers/check` on node 2 results in the chain on node 2 being replaced with the chain on node 1:

```shell
curl -X GET "localhost:5001/peers/check"
```

![Check peers](https://api.kauri.io:443/ipfs/QmSGM1bCdk6fEvMtoy5WZUTb9eVi1TLPGQkBVQGvQ9MGus)

From the image above we can see that our chain on node 2 was updated and replaced with the list of blocks from node 1.

Now when we mine a new block on node 2, we add a new block to this chain which would mean we add block number 4

```shell
curl -X POST "localhost:5001/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine a block on node 2"
}
'
```

![Mine new block on node2](https://api.kauri.io:443/ipfs/QmSz8t33JJh66y7dn1vj9uPjYeshUbjZBFaig4QhPGaYXr)

And there you have it!

We have reached consensus between node 1 and node 2 in network and then added a new block!

## Success

In this tutorial we built a basic blockchain network with node.js.

![Well done](https://api.kauri.io:443/ipfs/Qma4tkh6boiQ8kEXiA3rQkKZZsqicHw9Fh54pPkrSGJEjg)

Our blockchain:

-   Has a list of blocks which stores data
-   Uses SHA256 hashing algorithm to link blocks together
-   Uses proof of work to mine/create new blocks
-   Has an API which allows nodes in the network to communicate over http
-   Uses the longest chain rule to resolve forks/chain conflicts

For the next instillment (part 2), we'll extend our blockchain to process transactions, create wallets, and require signatures from account holders to submit transactions!

**[Subscribe to the Kauri newsletter](https://kauri.us17.list-manage.com/subscribe?u=e46233ccfd6bb938ab7cbb5a3&id=f49f81a2a9) to be notified when part 2 of this tutorial is available**

**If you enjoyed this guide, or have any suggestions or questions, let me know in the comments.**

If you have found any errors, update this tutorial by selecting the **Suggest Edit** option in the top menu, and/or [update the code](https://github.com/kauri-io/kauri-learn-to-build-a-blockchain/tree/master/nodejs/part1)

