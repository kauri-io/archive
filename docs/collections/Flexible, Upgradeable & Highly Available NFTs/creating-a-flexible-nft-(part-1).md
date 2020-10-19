---
title: Creating a Flexible NFT (Part 1)
summary: Creating a Flexible Non-fungible token The first part of this tutorial shows you how to deploy a Non-fungible token (NFT) using a technique that makes it easy to update details about your token as infrastructure and your needs change. The second part of this tutorial will show how to create a serverless solution for serving your token details as metadata. This is a widely used web2 infrastructure solution that is cheap and scaleable. It is not decentralized; This is a solution for using the Inte
authors:
  - Billy Rennekamp (@okwme)
date: 2019-06-25
some_url: 
---

# Creating a Flexible NFT (Part 1)

![](https://ipfs.infura.io/ipfs/QmQw83abtCE6d8eac7vhrU6ijJCKRbR6gTY1URTzoZWkeM)


![](https://ipfs.infura.io/ipfs/QmQw83abtCE6d8eac7vhrU6ijJCKRbR6gTY1URTzoZWkeM)
## Creating a Flexible Non-fungible token

The first part of this tutorial shows you how to deploy a [Non-fungible token (NFT)](https://en.wikipedia.org/wiki/Non-fungible_token) using a technique that makes it easy to update details about your token as infrastructure and your needs change.

The second part of this tutorial will show how to create a serverless solution for serving your token details as metadata. This is a widely used web2 infrastructure solution that is cheap and scaleable. It is not decentralized; This is a solution for using the Internet as it exists today.

### Step 1: Setup Environment

I'm using `node v9.11.2` and `yarn v1.7.0` for this tutorial. NPM and other versions of node should work.

First, make a new project folder:

```bash
mkdir ./workshop && cd ./workshop
```

I have a [truffle box](https://kauri.io/article/2b10c835fe4d463f909915bd75597d6b/v1/truffle-101-development-tools-for-smart-contracts) called "truffle box" preinstalled with [solium](https://www.npmjs.com/package/solium), [linguist](https://github.com/github/linguist), [zeppelin](https://openzeppelin.org), migrations, tests, and more.

Unbox truffle shavings and install dependencies using `npx` (included with recent versions of npm).

```bash
npx truffle unbox okwme/truffle-shavings

yarn
```

Create a _.env_ file and open the project in your editor to add the different network specific mnemonic phrases and Infura API key:

```conf
TRUFFLE_MNEMONIC=word1 ... word12
GANACHE_MNEMONIC=word1 ... word12
TESTNET_MNEMONIC=word1 ... word12
INFURA_API_KEY={YOUR_API_KEY}
```

If you don't have an account with Rinkeby ETH you can use the account I made for this tutorial. Be careful as if you're using it at the same time as someone else and try to run transactions, there will be nonce collisions which prevent some transactions from going through.

```conf
TESTNET_MNEMONIC=flash gravity sister tip question story slam square resemble intact require voyage
```

And you're welcome to use the Infura key I made for this tutorial:

```conf
INFURA_API_KEY=85939c42711147b291a40dc3a77177f8
```

For reference, the 'develop' network uses the truffle development network, and the value of `TRUFFLE_MNEMONIC`, which you can find from the output of the `truffle develop` command.

Check the boilerplate contracts compile, deploy and pass the dummy test locally:

```bash
$ yarn test --network develop
Using network 'develop'.

Compiling ./contracts/Migrations.sol...
Compiling ./contracts/Sample.sol...
        Sample deployed at: 0x345cA3e014Aaf5dcA488057592ee47305D9B3e10


  Contract: Sample
        68922 - Deploy sample
        -----------------------
        68,922 - Total Gas
    Sample.sol
      ✓ should pass


  1 passing (171ms)
```

To make sure our testnet account has gas let's try rinkeby:

```bash
$ yarn test --network rinkeby
Using network 'rinkeby'.

Compiling ./contracts/Migrations.sol...
Compiling ./contracts/Sample.sol...
        Sample deployed at: 0x345cA3e014Aaf5dcA488057592ee47305D9B3e10


  Contract: Sample
        68922 - Deploy sample
        -----------------------
        68,922 - Total Gas
    Sample.sol
      ✓ should pass


  1 passing (171ms)
```

### Step 2: Make ERC-721

Rename _contracts/Sample.sol_ to _contracts/Token.sol_ or whatever you want to call your NFT and change the content inside to reflect the change.

```bash
mv ./contracts/Sample.sol ./contracts/Token.sol
```

```
pragma solidity ^0.5.0;

/**
 * The Token contract does this and that...
 */
contract Token {
    constructor () public {}
}
```

Import the [open zeppelin ERC-721 library](https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/token/ERC721), add it to the contract class, then alter the constructor:

```
pragma solidity ^0.5.0;
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

/**
 * The Token contract does this and that...
 */
contract Token is ERC721Full {
    constructor(string memory name, string memory symbol) public
        ERC721Full(name, symbol)
    { }
}
```

### Step 3: Make Metadata

Create a file called _/contracts/Metadata.sol_ and add the contract basics:

```bash
touch ./contracts/Metadata.sol
```

```
pragma solidity ^0.5.0;
/**
* Metadata contract is upgradeable and returns metadata about Token
*/
contract Metadata {

}
```

Create a file called  _/contracts/helpers/strings.sol_  and add this [modified strings library from Nick Johnson](https://github.com/Arachnid/solidity-stringutils/blob/master/src/strings.sol):

```bash
mkdir ./contracts/helpers
touch ./contracts/helpers/strings.sol
```

```
/*
 * @title String & slice utility library for Solidity contracts.
 * @author Nick Johnson <arachnid@notdot.net>
 */

pragma solidity ^0.5.0;

library strings {
    struct slice {
        uint _len;
        uint _ptr;
    }

    function memcpy(uint dest, uint src, uint len) private pure {
        // Copy word-length chunks while possible
        for (; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }

        // Copy remaining bytes
        uint mask = 256 ** (32 - len) - 1;
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }
    }

    /*
     * @dev Returns a slice containing the entire string.
     * @param self The string to make a slice from.
     * @return A newly allocated slice containing the entire string.
     */
    function toSlice(string memory self) internal pure returns (slice memory) {
        uint ptr;
        assembly {
            ptr := add(self, 0x20)
        }
        return slice(bytes(self).length, ptr);
    }

    /*
     * @dev Returns a newly allocated string containing the concatenation of
     *      `self` and `other`.
     * @param self The first slice to concatenate.
     * @param other The second slice to concatenate.
     * @return The concatenation of the two strings.
     */
    function concat(slice memory self, slice memory other) internal pure returns (string memory) {
        string memory ret = new string(self._len + other._len);
        uint retptr;
        assembly {
            retptr := add(ret, 32)
        }
        memcpy(retptr, self._ptr, self._len);
        memcpy(retptr + self._len, other._ptr, other._len);
        return ret;
    }
}
```

Import the library into _Metadata.sol_ and use the strings library for all types:

```
pragma solidity ^0.5.0;
/**
* Metadata contract is upgradeable and returns metadata about Token
*/

import "./helpers/strings.sol";

contract Metadata {
    using strings for *;
}
```

Add the `tokenURI` function that accepts a `uint256 tokenId` and returns a `string` to _Metadata.sol_ inside the contract definition:

```
function tokenURI(uint _tokenId) public pure returns (string memory _infoUrl) {
    string memory base = "https://domain.com/metadata/";
    string memory id = uint2str(_tokenId);
    return base.toSlice().concat(id.toSlice());
}
```

Add the function `uint2str` modified from [oraclize](https://github.com/oraclize):

```
function uint2str(uint i) internal pure returns (string memory) {
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0) {
        length++;
        j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0) {
        uint _uint = 48 + i % 10;
        bstr[k--] = toBytes(_uint)[31];
        i /= 10;
    }
    return string(bstr);
}
function toBytes(uint256 x) public pure returns (bytes memory b) {
    b = new bytes(32);
    assembly { mstore(add(b, 32), x) }
}
```

This code takes a number and converts it into the UTF8 string value of that number. You can see the part that says `48 + i % 10`, that's where the magic happens. The modulo operation (`%`) converts the number to a single digit, and adds it to 48, which is where [the number characters begin inside of UTF8 character encoding](https://www.utf8-chartable.de/unicode-utf8-table.pl?utf8=dec).

Run `yarn compile` to make sure there are no errors. Your final _Metadata.sol_ should look like this:

```
pragma solidity ^0.5.0;
/**
* Metadata contract is upgradeable and returns metadata about Token
*/

import "./helpers/strings.sol";

contract Metadata {
    using strings for *;

    function tokenURI(uint _tokenId) public pure returns (string memory _infoUrl) {
        string memory base = "https://domain.com/metadata/";
        string memory id = uint2str(_tokenId);
        return base.toSlice().concat(id.toSlice());
    }

    function uint2str(uint i) internal pure returns (string memory) {
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length - 1;
        while (i != 0) {
            uint _uint = 48 + i % 10;
            bstr[k--] = toBytes(_uint)[31];
            i /= 10;
        }
        return string(bstr);
    }

    function toBytes(uint256 x) public pure returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }
}
```

### Step 4: Add Metadata to ERC-721

Import the _Metadata.sol_ contract into the header of your ERC-721 token contract, add a new parameter to the contract called `metadata`, and set the parameter with the constructor

```
pragma solidity ^0.5.0;
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "./Metadata.sol";

/**
 * The Token contract does this and that...
 */
contract Token is ERC721Full {
    Metadata metadata;
    constructor(string memory name, string memory symbol, Metadata _metadata) public
        ERC721Full(name, symbol)
    {
        metadata = _metadata;
    }
}
```

Add a `tokenURI` function that hands the call to the metadata contract. We're handing off the call because we want that function to be upgradeable in the future.

```
function tokenURI(uint _tokenId) external view returns (string memory _infoUrl) {
    return metadata.tokenURI(_tokenId);
}
```

Run `truffle compile` to make sure there are no errors. Your token contract should look like the below:

```
pragma solidity ^0.5.0;
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "./Metadata.sol";

/**
 * The Token contract does this and that...
 */
contract Token is ERC721Full {
    Metadata metadata;
    constructor(string memory name, string memory symbol, Metadata _metadata) public
        ERC721Full(name, symbol)
    {
        metadata = _metadata;
    }

    function tokenURI(uint _tokenId) external view returns (string memory _infoUrl) {
        return metadata.tokenURI(_tokenId);
    }
}
```

### Step 5: Create Migrations

Open the migrations file called _2_deploy_contracts.js_ and replace `Sample` with `Token`, or whatever you called your token.

```javascript
var Token = artifacts.require('./Token.sol')
let _ = '        '

module.exports = (deployer, helper, accounts) => {

  deployer.then(async () => {
    try {
      // Deploy Token.sol
      await deployer.deploy(Token)
      let token = await Token.deployed()
      console.log(_ + 'Token deployed at: ' + token.address)

    } catch (error) {
      console.log(error)
    }
  })
}
```

Import the Metadata at the top of the file, duplicate the token deployment code, and replace it with Metadata so Metadata is imported first. Then change the Token deploy parameters to match the constructor arguments.

```javascript
var Metadata = artifacts.require('./Metadata.sol')
var Token = artifacts.require('./Token.sol')

let _ = '        '

module.exports = (deployer, helper, accounts) => {

  deployer.then(async () => {
    try {
      // Deploy Metadata.sol
      await deployer.deploy(Metadata)
      let metadata = await Metadata.deployed()
      console.log(_ + 'Metadata deployed at: ' + metadata.address)

     // Deploy Token.sol
      await deployer.deploy(Token, 'Token Name', 'Token Symbol', metadata.address)
      let token = await Token.deployed()
      console.log(_ + 'Token deployed at: ' + token.address)

    } catch (error) {
      console.log(error)
    }
  })
}
```

To run the migration first start a local testnet with truffle using the `truffle develop` command in another terminal window. Then run the migration from the original window with the local test network to make sure there are no errors

```bash
$ yarn migrate --network develop --reset
Using network 'develop'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x6baaa7955d7815f8629b969c7a33da9ee5d13657e623c19fd0f9f592a8d68e87
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
Saving successful migration to network...
  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Running step...
  Deploying Metadata...
  ... 0xed77a8f6e9e3157a9166dbafab94308b470e2d1679e6b3f0946e2534da02b461
  Metadata: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
        Metadata deployed at: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
  Deploying Token...
  ... 0xff932f6634ac4fb800abd8e3421564013397edaa1d0701a28744d28e02c1998c
  Token: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf
        Token deployed at: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf
Saving successful migration to network...
  ... 0x059cf1bbc372b9348ce487de910358801bbbd1c89182853439bec0afaee6c7db
Saving artifacts...
```

If you get errors, try deleting the _build_ folder that truffle creates when compiling or migrating, or add the `--reset` flag to the command.

### Step 6: Make Tests

Rename _/test/Sample.test.js_ to _/test/Token.test.js_ or whatever you called your token contract, then replace all references to "Sample".

```bash
mv ./test/Sample.test.js ./test/Token.test.js
```

```javascript
var Token = artifacts.require('./Token.sol')
var BigNumber = require('bignumber.js')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

contract('Token', async function(accounts) {
  let token

  before(done => {
    ;(async () => {
      try {
        var totalGas = new BigNumber(0)

        // Deploy Token.sol
        token = await Token.new()
        var tx = await web3.eth.getTransactionReceipt(token.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy Token')
        token = await Token.deployed()

        console.log(_ + '-----------------------')
        console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
        done()
      } catch (error) {
        console.error(error)
        done(false)
      }
    })()
  })

  describe('Token.sol', function() {
    it('should pass', async function() {
      assert(
        true === true,
        'this is true'
      )
    })

  })
})
```

Import the Metadata at the top of the file then duplicate the token test code and replace it with Metadata so Metadata is imported first.

Don't forget to set the deploy parameters for the token, including the `metadata.address`:

```javascript
var Metadata = artifacts.require('./Metadata.sol')
var Token = artifacts.require('./Token.sol')
var BigNumber = require('bignumber.js')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

contract('Token', async function(accounts) {
  let token, metadata

  before(done => {
    ;(async () => {
      try {
        var totalGas = new BigNumber(0)

        // Deploy Metadata.sol
        metadata = await Metadata.new()
        var tx = await web3.eth.getTransactionReceipt(metadata.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy Metadata')
        metadata = await Metadata.deployed()

        // Deploy Token.sol
        token = await Token.new("Token", "TKN", metadata.address)
        var tx = await web3.eth.getTransactionReceipt(token.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy Token')
        token = await Token.deployed()

        console.log(_ + '-----------------------')
        console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
        done()
      } catch (error) {
        console.error(error)
        done(false)
      }
    })()
  })

  describe('Token.sol', function() {
    it('should pass', async function() {
      assert(
        true === true,
        'this is true'
      )
    })
  })
})
```

Replace the dummy test called `should pass` inside the `describe` block to confirm the `tokenURI` returns strings of numbers correctly:

```javascript
it('should return metadata uints as strings', async function() {
    const URI = 'https://domain.com/metadata/'

    let tokenURI_uint = 12
    let tokenURI_result = await token.tokenURI(tokenURI_uint)
    assert(
        URI + tokenURI_uint.toString() === tokenURI_result,
        'incorrect value "' + tokenURI_result + '" returned'
    )
})
```

Run the test to confirm it works

```bash
$ yarn test
Using network 'test'.

Compiling ./contracts/Metadata.sol...
Compiling ./contracts/Token.sol...
Compiling ./contracts/helpers/strings.sol...
Compiling zeppelin-solidity/contracts/AddressUtils.sol...
Compiling zeppelin-solidity/contracts/introspection/ERC165.sol...
Compiling zeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol...
Compiling zeppelin-solidity/contracts/math/SafeMath.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721Full.sol...

....

        Metadata deployed at: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
        Token deployed at: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf


  Contract: Token
        319325 - Deploy Metadata
        2147381 - Deploy Token
        -----------------------
        2,466,706 - Total Gas
    Token.sol
      âœ“ should return metadata uints as strings (182ms)


  1 passing (667ms)
```

Add some random numbers too, and run the test again to confirm it works:

```javascript
describe('Token.sol', function() {
  it('should return metadata uints as strings', async function() {
    const URI = 'https://domain.com/metadata/'

    let tokenURI_uint = 0
    let tokenURI_result = await token.tokenURI(tokenURI_uint)
    assert(
      URI + tokenURI_uint.toString() === tokenURI_result,
      'incorrect value "' + tokenURI_result + '" returned'
    )

    tokenURI_uint = 2345
    tokenURI_result = await token.tokenURI(tokenURI_uint)
    assert(
      URI + tokenURI_uint.toString() === tokenURI_result,
      'incorrect value "' + tokenURI_result + '" returned'
    )

    tokenURI_uint = 23452345
    tokenURI_result = await token.tokenURI(tokenURI_uint)
    assert(
      URI + tokenURI_uint.toString() === tokenURI_result,
      'incorrect value "' + tokenURI_result + '" returned'
    )

    tokenURI_uint = 134452
    tokenURI_result = await token.tokenURI(tokenURI_uint)
    assert(
      URI + tokenURI_uint.toString() === tokenURI_result,
      'incorrect value "' + tokenURI_result + '" returned'
    )
  })
})
})
```

### Step 7: Make Migration for Updates

If you change your schema, or endpoints, or the `tokenURI` standard changes, you need to update your migration contract. Let's make a migration file that we can run for that need.

Inside _Token.sol_ import the _Ownable.sol_ contract from open-zeppelin, inherit it in your token, and define your contract as `Ownable`. Then add a function that can update the `metadata` contract address and restrict the access with the `onlyOwner` modifier. We're referring to `metadata` as the type `Metadata` but for all practical purposes this is just an `address`.

```
pragma solidity ^0.5.0;
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Metadata.sol";

/**
 * The Token contract does this and that...
 */
contract Token is ERC721Full, Ownable {
    Metadata metadata;
    constructor(string memory name, string memory symbol, Metadata _metadata) public
        ERC721Full(name, symbol)
    {
        metadata = _metadata;
    }

    function updateMetadata(Metadata _metadata) public onlyOwner {
        metadata = _metadata;
    }

    function tokenURI(uint _tokenId) external view returns (string memory _infoUrl) {
        return metadata.tokenURI(_tokenId);
    }

}
```

Duplicate the file  _2_deploy_contracts.js_ and call it  _3_update_metadata.js_:

```bash
cp ./migrations/2_deploy_contracts.js  ./migrations/3_update_metadata.js
```

Change the metadata `deploy` in _3_update_metadata.js_ so that it contains an object that specifies this contract will be replaced:

```javascript
await deployer.deploy(Metadata, {replace: true})
```

Then remove the deployment of the token, and make the already deployed token findable:

```javascript
// Deployed Token.sol
// await deployer.deploy(Token, 'Token Name', 'Token Symbol', metadata.address)
let token = await Token.deployed()
console.log(_ + 'Token deployed at: ' + token.address)
```

Then update the token with the new metadata address:

```javascript
await token.updateMetadata(metadata.address)
console.log(_ + 'Token metadata updated to ' + metadata.address)
```

Run the migration to make sure it worked. If you get an error about incorrect nonces this might be due to an out of sync truffle build. Try deleting the _build_ directory and running it again.

```bash
$ yarn migrate --network develop --reset
Compiling ./contracts/Metadata.sol...
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/Token.sol...
Compiling ./contracts/helpers/strings.sol...
Compiling zeppelin-solidity/contracts/AddressUtils.sol...
Compiling zeppelin-solidity/contracts/introspection/ERC165.sol...
Compiling zeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol...
Compiling zeppelin-solidity/contracts/math/SafeMath.sol...
Compiling zeppelin-solidity/contracts/ownership/Ownable.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol...
Compiling zeppelin-solidity/contracts/token/ERC721/ERC721Full.sol...

...

Using network 'develop'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x7184b833b0437ab2f71b7d081c43974c4f92a7a3f9f71d3617f2e0e6cada163f
  Migrations: 0x30753e4a8aad7f8597332e813735def5dd395028
Saving successful migration to network...
  ... 0xffbca182e82402c9ad7c75c7625270725c565fd54b8e69d673e44f6a6d3e17ab
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Running step...
  Deploying Metadata...
  ... 0x07dfc916e1b333c3b9bdd7d7570d15539580a5c80c620eb9bfd1e78ea15daea5
  Metadata: 0xaa588d3737b611bafd7bd713445b314bd453a5c8
        Metadata deployed at: 0xaa588d3737b611bafd7bd713445b314bd453a5c8
  Deploying Token...
  ... 0x13c33499116a456afd5ce282feb19e5a5c64a1e7d35140033aedf40e9bad7526
  Token: 0xf204a4ef082f5c04bb89f7d5e6568b796096735a
        Token deployed at: 0xf204a4ef082f5c04bb89f7d5e6568b796096735a
Saving successful migration to network...
  ... 0xbe915fd410713e530bce5c53fd25e8d3a25b7fca593f32d5ae1d0131d3a1375c
Saving artifacts...
Running migration: 3_update_metadata.js
  Running step...
  Replacing Metadata...
  ... 0xf5523deea43659d73a3344d61952a63d1e001e3bc040e3683736e412480d6e38
  Metadata: 0x82d50ad3c1091866e258fd0f1a7cc9674609d254
        Metadata deployed at: 0x82d50ad3c1091866e258fd0f1a7cc9674609d254
        Token deployed at: 0xf204a4ef082f5c04bb89f7d5e6568b796096735a
  ... 0x9771108c608ec65cd120660337e286e4d5d007e79f4ec30865ed754af0179dd8
        Token metadta updated to 0x82d50ad3c1091866e258fd0f1a7cc9674609d254
Saving successful migration to network...
  ... 0x345372f43457f3ab10a972f82d68a6c25436cbb5c42a28c88f14c79ea7c25ceb
Saving artifacts...
```

You can see that the Token address didn't change but the metadata did. If you have to update the metadata more than once you can tell truffle explicitly which migrations to run with the following options:

```bash
yarn migrate --network develop -f 3 --to 3
```

This only runs **from** (`-f`) migration number 3 **until** (`--to`) migration 3 (i.e., it only runs migration 3)

### Step 8: Update ERC-721 and Tests

Since we want to mint tokens, let's add a public function for minting to our Token contract and protect it with the `onlyOwner` modifier:

```
pragma solidity ^0.5.0;
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Metadata.sol";

/**
 * The Token contract does this and that...
 */
contract Token is ERC721Full, Ownable {
    address public metadata;
    constructor(string memory name, string memory symbol, address _metadata) public ERC721Full(name, symbol) {
        metadata = _metadata;
    }
    function mint(address recepient) public onlyOwner {
        _mint(recepient, totalSupply() + 1);
    }
    function updateMetadata(address _metadata) public onlyOwner {
        metadata = _metadata;
    }
    function tokenURI(uint _tokenId) external view returns (string memory _infoUrl) {
        return Metadata(metadata).tokenURI(_tokenId);
    }
}
```

The example above mints incrementally (current total supply plus one). You can create your own restrictions or patterns for minting your tokens.

Now we can add a test to _Token.test.js_ to make sure that it is minting correctly:

```javascript
it('should mint a token from the owner account', async function() {
  // begin with zero balance
  let zeroBalance = await token.totalSupply()
  assert(
    zeroBalance.toString(10) === '0',
    "Contract should have no tokens at this point"
  )

  // try minting a new token and checking the totalSupply
  try {
    await token.mint(accounts[0])
  } catch (error) {
    console.log(error)
    assert(false, error)
  }
  let totalSupply = await token.totalSupply()
  assert(
    totalSupply.toString(10) === '1',
    "Contract should have balance of 1 instead it has " + totalSupply.toString(10)
  )

  // check that the balance increased to 1
  let ownerBalance = await token.balanceOf(accounts[0])
  assert(
    ownerBalance.toString(10) === '1',
    "Owner account should have 1 token instead it has " + ownerBalance.toString(10)
  )

  // make sure the token at index 0 has id 1
  let tokenId = await token.tokenOfOwnerByIndex(accounts[0], "0")
  assert(
    tokenId.toString(10) === '1',
    "Token at index 0 is " + tokenId.toString(10)
  )
})
```

Run the tests to make sure they pass:

```bash
$ yarn test
Using network 'test'.

...

        Metadata deployed at: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
        Token deployed at: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf
        Metadata deployed at: 0x9fbda871d559710256a2502a2517b794b482db40
        Token deployed at: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf
        Token metadta updated to 0x9fbda871d559710256a2502a2517b794b482db40


  Contract: Token
        319325 - Deploy Metadata
        2372607 - Deploy Token
        -----------------------
        2,691,932 - Total Gas
    Token.sol
      âœ“ should return metadata uints as strings (173ms)
      âœ“ should mint a token from the owner account (129ms)


  2 passing (776ms)
```

### Step 9: Deploy

Now that we have tests in place that prove out metadata works and our token can be minted let's deploy it to our local network, then deploy it to Rinkeby.

Run the deploy command in another terminal window. We set it to be the first two migrations so that we don't update the metadata contract on this deploy.

Again, if you get strange results, it could be because of the _build_ folder, it helps speed up compiles, but it's often a pain, you can use `rm -r build` to get rid of it. It's fine to remove until you've deployed to a network where you care that it remains, as the contract address is stored in the `build` folder.

```bash
$ yarn migrate --network develop -f 1 --to 2

...


Writing artifacts to ./build/contracts

Using network 'develop'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0x6baaa7955d7815f8629b969c7a33da9ee5d13657e623c19fd0f9f592a8d68e87
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
Saving successful migration to network...
  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Running step...
  Replacing Metadata...
  ... 0xe3772c4b0d577fe44ee19414a124ef24f1d2a16ad3c98931253279dad8e4fd56
  Metadata: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
        Metadata deployed at: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
  Replacing Token...
  ... 0x4c3b1d9db3970110fa8d0396ae7f3d446a9aad619449f736e92fa60cd2cf0676
  Token: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf
        Token deployed at: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf
Saving successful migration to network...
  ... 0x059cf1bbc372b9348ce487de910358801bbbd1c89182853439bec0afaee6c7db
Saving artifacts...
```

This command says "Replacing" because it can see from the previous artifacts that we have deployed these contracts before. Now let's try deploying to Rinkeby, make sure that the mnemonic phrase you set earlier has some ether in it.

```bash
$ yarn migrate --network rinkeby -f 1 --to 2
Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0xcc78688c19e982cb493b99db2252daa074287e9fbe22906f105801700550bab7
  Migrations: 0xd1aaf438955055c35aeb46b4bd695997bcd21abd
Saving successful migration to network...
  ... 0xaa69e3196f1928c6dfc0f91dd58e65e1217a6d4a560a7636d17b6e56bf52aeb3
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Running step...
  Deploying Metadata...
  ... 0x19e5eaa13843cea2178792c57fd1f35c99d563a1aec4b7f2b1613209c1e5a930
  Metadata: 0x61bda2050eafa50fb46ebeb39c75fbe4781bdf55
        Metadata deployed at: 0x61bda2050eafa50fb46ebeb39c75fbe4781bdf55
  Deploying Token...
  ... 0x9f74c46ffd6c339246baee70b4b90f649d43de5d274ccdcc82ee10bc680c010d
  Token: 0x1170a2c7d4913d399f74ee5270ac65730ff961bf
        Token deployed at: 0x1170a2c7d4913d399f74ee5270ac65730ff961bf
Saving successful migration to network...
  ... 0xb650e010b55dab9cf82a3fc2074ce75b1987015cad8e44d93bb0546df5f411d8
Saving artifacts...
```

If you're feeling brave and have a mnemonic phrase with some mainnet ether feel free to go big. : )

### Step 10: Verify Contracts on Etherscan

Now you are able to see your contracts on the block explorer [etherscan.io](https://etherscan.io). What you don't see is the code you used to generate the contract. To add that and provide a user the security of knowing what this code does (and to provide a place to track the token), you can verify the contract. The easiest method is with a flattener, which imports every referenced file and combines them into one single file.

A good option is "[truffle-flattener](https://github.com/nomiclabs/truffle-flattener)" because it works with the truffle framework in mind. We installed it earlier so you should be able to use it from your project directory and generate the files. Begin by making a folder to store the output, and then flatten the files.

```bash
mkdir flat
npx truffle-flattener contracts/Token.sol > flat/Token.sol
npx truffle-flattener contracts/Metadata.sol > flat/Metadata.sol
```

Now visit the etherscan.io endpoint for your deployed contracts. You may need to scroll back up to your deploy messages which tell you the address of your contract. Use this address and go to `https://rinkeby.etherscan.io/address/_CONTACT_ADDRESS_`

Open the "Code" tab and click "Verify And Publish".  Enter "Token" under contract name, and select the compiler version you used. You can confirm the compiler in the _./build/Token.json_ file by searching for "network". This shows you a record of the deployment of your contract relevant to each network (rinkeby is number 4) alongside the compiler version. Mine is `0.5.0+commit.1d4f565a`, so I select that on the drop down on etherscan. I turn "Optimization" to off, since by default truffle does not run the compiler with optimization turned on. Then copy and paste the contents of _./flat/Token.sol_ into the text box.

![](https://www.dropbox.com/s/403vw7lrskvty09/Screenshot%202018-12-13%2016.04.22.png?dl=1)
(screenshot is out of date and uses an older compiler)

Confirm you are not a robot and then click "Verify and Publish". If everything worked you see a success message like this:

![](https://www.dropbox.com/s/wrs6mabjzrmypg8/Screenshot%202018-12-13%2016.06.37.png?dl=1)

If you click your address link you now see that your contract has a lot more information on it:

![](https://www.dropbox.com/s/ooh5fzd18elyr3y/Screenshot%202018-12-13%2016.08.44.png?dl=1)

Now via the "Write Contract" tab you can directly access the "mint" function, and if your metamask has the same seed phrase as your deploy account you can mint from the browser. Since your contract is a compliant ERC-721 you can also look at it via the lens of a token account. To do so, change the word "address" in the URL to "token", for example [https://rinkeby.etherscan.io/token/_CONTRACT_ADDRESS_](https://rinkeby.etherscan.io/token/_CONTRACT_ADDRESS_)

You may notice it doesn't have a name yet, or is called ERC-20 even though it is ERC-721, this is because there hasn't been any transactions yet and etherscan isn't that smart.

End of part 1, celebrate by minting a token or two.


---

- **Kauri original title:** Creating a Flexible NFT (Part 1)
- **Kauri original link:** https://kauri.io/creating-a-flexible-nft-part-1/27640de6baba4aa99d57fd158af5c019/a
- **Kauri original author:** Billy Rennekamp (@okwme)
- **Kauri original Publication date:** 2019-06-25
- **Kauri original tags:** netlify, metadata, lambda, upgradeable, serverless, truffle, nft
- **Kauri original hash:** QmPTcBpLNQobhpqSNJ737dvtLo1hfDKLh3s8JdVfTL7h2t
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



