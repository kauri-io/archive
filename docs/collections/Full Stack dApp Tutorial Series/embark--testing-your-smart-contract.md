---
title: Embark  Testing Your Smart Contract
summary: Earlier in the series, we took a look at how to setup Embark and use it to compile, deploy and interact with our Bounties.sol smart contract. This article will walk through the steps required to write tests for our smart contract within the Embark framework. Tests in Embark projects are written in Javascript. Embark uses the Mocha testing framework to provide an easy way to write tests in Javascript and uses Node.js for assertions. You can read more about testing in Embark here. Source code for
authors:
  - Josh Cassidy (@joshorig)
date: 2018-09-12
some_url: 
---

# Embark  Testing Your Smart Contract



Earlier in the series, we took a look at how to setup Embark and use it to compile, deploy and interact with our Bounties.sol smart contract.

This article will walk through the steps required to write tests for our smart contract within the Embark framework. 
Tests in Embark projects are written in [Javascript] (http://truffleframework.com/docs/getting_started/javascript-tests).

Embark uses the [Mocha] (https://mochajs.org/) testing framework to provide an easy way to write tests in Javascript and uses [Node.js] (https://nodejs.org/api/assert.html/) for assertions. You can read more about [testing in Embark here] (https://truffleframework.com/docs/truffle/testing/testing-your-contracts).

[Source code for this tutorial can be found here] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/embark-writing-tests)

### Prerequisites

**NODEJS 7.6+**

Since web3.js and truffle executions are asynchronous, we'll be using [async/await] (https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9) to simplify our test code. You’ll have to upgrade to Node 7.6 or higher. 

**Embark**

```
npm install -g embark
```

**Note: On linux systems you may see an error when you attempt to run embark. If you see the following error:**

```
$ embark --version
env: node\r: No such file or directory
```

This is a common issue with Node.js when using files with Windows line endings. [See: npm/npm#12371] (https://github.com/npm/npm/issues/12371)

To resolve we’re going to have to use `dos2unix` to convert the embark js file to Unix format

1. Find the location embark js file on your system
```
$ which embark
/usr/local/bin/embark
cd /usr/local/bin/
ls -lrt | grep embark
lrwxr-xr-x  1 joshuacassidy  admin        37 15 Aug 21:41 embark -> *../lib/node_modules/embark/bin/embark*
```
From the output above we see that on my machine, the relative path of the embark js file is located here:`../lib/node_modules/embark/bin/embark`

2. Install dos2unix
```
$ brew install dos2unix
```
3. Convert the file
```
$ sudo dos2unix ../lib/node_modules/embark/bin/embark
dos2unix: converting file ../lib/node_modules/embark/bin/embark to Unix format...
```
That's it! Now when you run embark — version you should see something like the following:
```
$ embark --version
3.1.9
```

**Embark Project**

In order to test our Bounties.sol smart contract we'll need to have a truffle project set up to compile and deploy our smart contract. Let's start with the truffle project we created earlier in the series:
```
$ git clone https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series.git
$ cd kauri-fullstack-dapp-tutorial-series
$ cp -R embark-compilation-and-deploy dapp-series-bounties
$ cd dapp-series-bounties
```

**Development Blockchain: Ganache-CLI**

In order to deploy our smart contract, we’re going to need an Ethereum environment to deploy to. For this, we will use Ganache-CLI to run a local development environment
```
$ npm install -g ganache-cli
```

### Setting up a test file

Now that we have our project setup we'll create our first test:

* First, we need to create a file named bounties_spec,js  inside the **/test** folder
* Within our bounties_spec.js file we need to import the Bounties.sol artifact so we can use it within our tests
```
const Bounties = embark.require('Embark/contracts/Bounties');
```
* We now also define our config, this tells the test which contracts to deploy and returns in a callback the accounts from the deployment environment
```
let accounts;

config({

}, (err, theAccounts) => {
  accounts = theAccounts;
});
```
* We'll also now define a contract container which where our tests for this contract will live, usually set this to the name of the contract, however, this is not required, you can use any text you like.
```
contract("Bounties", function () {
  this.timeout(0);

  let bountiesInstance;


  beforeEach(async () => {
      bountiesInstance = await Bounties.deploy().send()
  })

});
```
* Within the contract container, we also define a variable to hold the contract instance being tested *bountiesInstance*, and a **beforeEach** block
* The **beforeEach** block will execute before each test and will deploy an instance of the Bounties.sol smart contract. This ensures each test is executed against a clean contract state

![](https://api.beta.kauri.io:443/ipfs/QmYG7ATMCzjLjSLMP3Pd1r9xHdKzyahVkgtDyU1kSdUSku)

At this point, we have the basic skeleton of our test file and we can test everything is set up correctly by executing the following:

First in a separate window run `embark simulator`:
```
$ embark simulator

running: ganache-cli -p 8555 -a 10 -e 100 -l 8000000 --mnemonic "example exile argue silk regular smile grass bomb merge arm assist farm"
Ganache CLI v6.1.3 (ganache-core: 2.1.2)
```

Next, run the embark test command:
```
$ embark test

Compiling contracts


  0 passing (0ms)



  0 passing (0ms)

 > All tests passed
```

Running embark test executes all tests in your truffle projects **/test** folder. This does the following:

1. Compiles your contracts
2. Deploys the contracts to the network
3. Runs tests against the contracts deployed on the network

### Writing a Test

Let's take a look at the issueBounty function:
```
function issueBounty(
  string _data,
  uint64 _deadline
)
  public
  payable
  hasValue()
  validateDeadline(_deadline)
  returns (uint)
{
  bounties.push(Bounty(msg.sender, _deadline, _data, BountyStatus.CREATED, msg.value));
  emit BountyIssued(bounties.length - 1,msg.sender, msg.value, _data);
  return (bounties.length - 1);
}
```
There are a few things we would want to test within this function:

* **happy path**: Issuing a bounty should emit a BountyIssued event
* **happy path:** Calling issueBounty should return an integer
* **payable** keyword: Issuing a bounty without sending a value should fail
* **hasValue** modifier: Issuing a bounty with a value of 0 should fail
* **validateDeadline** modifier: Issuing a bounty with a deadline not greater than now should fail

**Helper Functions**

Where we are expecting the input validation to fail, we expect to get a *revert* error from the EVM. You can [read more about error handling in Solidity here] (https://solidity.readthedocs.io/en/v0.4.24/control-structures.html?highlight=revert#error-handling-assert-require-revert-and-exceptions)

Also to create our bounty, we'll need to pass in a deadline which is greater than the current timestamp on the EVM.

To do this we'll need to write some helper functions to assist us in writing our tests:

* First, create a folder in the **/test** directory named **utils** and create the file **time.js**
* Copy the following extract into **time.js**
```
function getCurrentTime() {
  var block = web3.eth.getBlock("latest");
  return block.timestamp;
}

Object.assign(exports, {
  getCurrentTime
});
```

![](https://api.beta.kauri.io:443/ipfs/QmPj67qKz1WKQKndejXdtMs5XtYDoh4J6jd4XHCKutMdpb)

The above extract uses the web3 library to get the **latest** block from the EVM and from that return its timestamp. 

* Create a file named **assertRevert.js** inside the **/test/utils** directory
* Copy the following extract into **assertRevert.js**
```
var assertRevert = async (promise, message) => {
  let noFailureMessage;
  try {
    await promise;
    
    if (!message) { 
      noFailureMessage = 'Expected revert not received' 
    } else {
      noFailureMessage = message;
    }

    assert.fail();
  } catch (error) {
    if (noFailureMessage) {
      assert.fail(0, 1, message);
    }
    const revertFound = error.message.search('revert') >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
};

Object.assign(exports, {
  assertRevert
});
```

![](https://api.beta.kauri.io:443/ipfs/QmWaFwv1udeBqcEwHixre55igXssD9RaLNPeuQyvirwsmX)

The above extract takes a promise as its first argument, which would be a web3 transaction, and an assertion fail message as the next. It wraps the promise in a try and catches the error,  if the promise fails it checks if the error message contains the string **"revert”**.

We can now import our helper function into our bounties.js test file, by adding the following lines:
```
const getCurrentTime = require('./utils/time').getCurrentTime;
const assertRevert = require('./utils/assertRevert').assertRevert;
const dayInSeconds = 86400;
```
We also added a **dayInSeconds** constant, to help us add days.

#### Happy Path

The test for our first happy path looks like this:
```
it("Should allow a user to issue a new bounty", async () => {

    let currentTime = await getCurrentTime();
    let tx = await bountiesInstance.methods.issueBounty("data",
                              currentTime + (dayInSeconds * 2)).send({from: accounts[0], value: 500000000000000000});

    assert.strictEqual(Object.keys(tx.events).length, 1, "issueBounty() call did not log 1 event");
    const logBountyIssued = tx.events.BountyIssued;
    assert.equal(logBountyIssued.returnValues.bounty_id,0, "BountyIssued event logged did not have expected bounty_Id");
    assert.equal(logBountyIssued.returnValues.issuer, accounts[0], "BountyIssued event logged did not have expected issuer");
    assert.equal(logBountyIssued.returnValues.amount,500000000000000000, "BountyIssued event logged did not have expected amount");

});
```

There is alot going on here but its quite simple:

* Each test starts with the function `it()` which takes a description of the test as its first arguments and a callback function as the next. We use `async()` as the callback so we can use `await`.

* We then use our `getCurrentTime()` helper to get the current timestamp from the EVM

* We then invoke an `issueBounty` transaction on our `bountyInstance` object, we use the `.send` funtion to send a transation setting passing our transaction parameters as arguements.

* The transaction is sent from `account[0]` with a value of `500000000000000000`

* We then assert that our transaction receipt contains a log of exactly 1 event.

* We then assert that the details of the event are as expected

Our second happy path which tests making a call to issueBounty rather than sending a transaction looks like this:

```
it("Should return an integer when calling issueBounty", async () => {

    let currentTime = await getCurrentTime();
    let result = await bountiesInstance.methods.issueBounty("data",
                          currentTime + (dayInSeconds * 2)).call(
                          {from: accounts[0], value: 500000000000000000});

    assert.equal(result, 0, "issueBounty() call did not return correct id");
});
```
Above we add `.call` to `issueBounty` to make a call to the function rather than issuing a transaction. This returns the return value of the function rather than a transaction receipt.

### Error Path

Our error path tests will involve us sending a transaction with invalid inputs as an argument to our `assertRevert` helper function

To test our `payable` keyword, we invoke a transaction without a value being set:
```
it("Should not allow a user to issue a bounty without sending ETH", async () => {

    let currentTime = await getCurrentTime();

    assertRevert(bountiesInstance.methods.issueBounty("data",
                          currentTime + (dayInSeconds * 2)).send(
                          {from: accounts[0]}), "Bounty issued without sending ETH");

});
```
To test our `hasValue()` modifier, we invoke our transaction with a value of 0:
```
it("Should not allow a user to issue a bounty when sending value of 0", async () => {

    let currentTime = await getCurrentTime();

    assertRevert(bountiesInstance.methods.issueBounty("data",
                        currentTime + (dayInSeconds * 2))
                        .send({from: accounts[0], value: 0}), "Bounty issued when sending value of 0");

});
```
To test our `validateDeadline` modifier, we need to send two transactions, one with a deadline set in the past, and another with a deadline set as now:
```
it("Should not allow a user to issue a bounty with a deadline in the past", async () => {

 let currentTime = await getCurrentTime();

 assertRevert(bountiesInstance.methods.issueBounty("data",
                        currentTime - 1).send({from: accounts[0], value: 0}), "Bounty issued with deadline in the past");

});

it("Should not allow a user to issue a bounty with a deadline of now", async () => {

 let currentTime = await getCurrentTime();

 assertRevert(bountiesInstance.methods.issueBounty("data",
                        currentTime)
                        .send({from: accounts[0], value: 0}), "Bounty issued with deadline of now");

});
```

So now if we run the embark test command we should see the following:
```
$ embark test

Compiling contracts


  Bounties
    ✓ Should allow a user to issue a new bounty (120ms)
    ✓ Should return an integer when calling issueBounty (83ms)
    ✓ Should not allow a user to issue a bounty without sending ETH
    ✓ Should not allow a user to issue a bounty when sending value of 0
    ✓ Should not allow a user to issue a bounty with a deadline in the past
    ✓ Should not allow a user to issue a bounty with a deadline of now


  6 passing (666ms)



  0 passing (0ms)

 > All tests passed
```

#### Time travel

One of the main tests is to check that a fulfilment should not be accepted if the deadline has passed. In order to test this, we will need to add a helper function which advances the timestamp of the EVM:

In the **/test/utils/time.js** file add the following:

```
function increaseTimeInSeconds(increaseInSeconds) {
    return new Promise(function(resolve) {
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [increaseInSeconds],
            id: new Date().getTime()
        }, resolve);
    });
};
```
This function calls the `evm_increaseTime` RPC function of the ganache EVM to increase the EVM block timestamp.

Add the new `increaseTimeInSeconds` function to the exports section of the file:
```
Object.assign(exports, {
  increaseTimeInSeconds,
  getCurrentTime
});
```
In the **bounties.js** test file add the following line to import our new helper function:
```
const increaseTimeInSeconds = require('./utils/time').increaseTimeInSeconds;
```
We can then use this in our test as follows:

```
it("Should not allow a user to fulfil an existing bounty where the deadline has passed", async () => {
         
     let currentTime = await getCurrentTime();
     await bountiesInstance.issueBounty("data",
                     currentTime).send({from: accounts[0], value: 500000000000000000});
                      
    await increaseTimeInSeconds((dayInSeconds * 2)+1)

    assertRevert(bountiesInstance.fulfillBounty(0,"data").send({from: accounts[1]}), "Fulfillment accepted when deadline has passed");

});
```

### Try it yourself

Now that you have seen how to test the issueBounty function, try adding tests for the following functions:

* fulfilBounty
* acceptFulfilment
* cancelBounty

You can find the [complete bounties.js test file here for reference] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/blob/master/truffle-writing-tests/test/bounties.complete.js).









