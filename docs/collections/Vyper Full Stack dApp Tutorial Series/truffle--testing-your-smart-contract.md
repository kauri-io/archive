---
title: Truffle  Testing your smart contract
summary: Truffle- Testing your smart contract Earlier in this series, we took a look at how to setup Truffle and use it to compile, deploy and interact with our Bounties.vy smart contract. This article covers the steps required to write tests for our smart contract within the Truffle framework. You can write tests in Truffle projects using Javascript thanks to the Mocha testing framework and Chai for assertions. This article focuses on the Javascript tests. You can find source code for this tutorial on G
authors:
  - Onuwa Nnachi Isaac (@iamonuwa)
date: 2019-08-29
some_url: 
---

# Truffle  Testing your smart contract


## Truffle: Testing your smart contract

Earlier in this series, we took a look at how to setup Truffle and use it to compile, deploy and interact with our _Bounties.vy_ smart contract.

This article covers the steps required to write tests for our smart contract within the Truffle framework. You can write tests in Truffle projects using [Javascript](http://truffleframework.com/docs/getting_started/javascript-tests) thanks to the [Mocha](https://mochajs.org/) testing framework and [Chai](http://www.chaijs.com/api/assert/) for assertions. This article focuses on the Javascript tests.

[You can find source code for this tutorial on GitHub](https://github.com/iamonuwa/Bounties).

### Prerequisites

#### NodeJS 7.6

Since web3.js and truffle executions are asynchronous, we use [async/await](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9) to simplify our test code and you need Node 7.6 or higher.

#### Truffle

```shell
npm install -g truffle
```

Read more on [installing truffle in their docs](https://truffleframework.com/docs/truffle/getting-started/installation).

#### Truffle Project

In order to test our _Bounties.vy_ smart contract we need to have a truffle project set up to compile and deploy our smart contract. Let's start with the truffle project we created earlier in the series:

<!-- TODO: Update -->

```shell
$ git clone https://github.com/iamonuwa/Bounties.git
$ cd Bounties
```

<!-- TODO: No package.json at this time -->

#### Development Blockchain: Ganache-CLI

In order to deploy our smart contract, we need an Ethereum environment to deploy to. For this, we use Ganache-CLI to run a local development environment

**NOTE**: If you have a windows machine you need to install the windows developer tools first:

```shell
npm install -g windows-build-tools
```

Windows users should also install promise and bindings to ensure there are no errors later:

```shell
npm install mz
npm install bindings
```

Then run:

```shell
npm install -g ganache-cli
```

### Setting up a test file

Now that we have our project setup we can create our first test:

-   First, create a file named **bounties.js** inside the **/test** folder
-   Within our **bounties.js** file we need to import the **Bounties.vy** artifact so we can use it within our tests

```javascript
const Bounties = artifacts.require("Bounties");
```

-   Now define a contract container where our tests for this contract live, usually this is the name of the contract, however, this is not required, you can use any text you like.

```javascript
contract('Bounties', function(accounts) {

  let bountiesInstance;

  beforeEach(async () => {
      bountiesInstance = await Bounties.new()
    })

});
```

-   Within the contract container, we define the `bountiesInstance` variable to hold the contract instance we are testing, and a `beforeEach` block
-   The `beforeEach` block executes before each test and deploys a new instance of the _Bounties.vy_ smart contract. This ensures each test is executed against a clean contract state

Your _bounties.js_ file should look as follows:

<!-- TODO: Code better -->

![](https://ipfs.infura.io/ipfs/QmbcpryjzGpp6pVT7J8iw8VxqNvKyQk3e4gwpUrDZHENQh)

At this point, we have the basic skeleton of our test file and we can test everything is set up correctly by executing the following.

First in a separate window start ganache-cli:

```shell
ganache-cli
```

Next, run the test command:

```shell
truffle test
```

Running truffle test executes all tests in your truffle projects **/test** folder. This does the following:

1.  Compiles your contracts
2.  Runs migrations to deploy the contracts to the network
3.  Runs tests against the contracts deployed on the network

### Writing a Test

Let's take a look at the `issueBounty` function:

```vyper
@public
@payable
def issueBounty(_data: bytes32, _deadline: timestamp):
    assert msg.value > 0
    assert _deadline > block.timestamp

    bIndex: int128 = self.nextBountyIndex

    self.bounties[bIndex] = Bounty({ issuer: msg.sender, deadline: _deadline, data: _data, status: 0, amount: msg.value })
    self.nextBountyIndex = bIndex + 1

    log.BountyIssued(bIndex, msg.sender, msg.value, _data)
```

There are a few things we want to test within this function:

-   Issuing a bounty should emit a `BountyIssued` event
-   Calling `issueBounty` should return an empty object
-   `payable` keyword: Issuing a bounty without sending a value should fail
-   `validationZero`:  Issuing a bounty with a value of 0 should fail
-   `validateDeadline`: Issuing a bounty with a deadline less than or equal to now should fail

#### Helper Functions

To create our bounty, we need to pass in a deadline which is greater than the current timestamp on the EVM.

To do this we need to write some helper functions to assist us in writing our tests:

-   First, create a folder in the **/test** directory named **utils** and create a file **time.js**
-   Copy the following extract into **time.js**

```javascript
function getCurrentTime() {
  return new Promise(function(resolve) {
    web3.eth.getBlock("latest").then(function(block) {
      resolve(block.timestamp)
    });
  })
}

Object.assign(exports, {
  getCurrentTime
});
```

The above extract uses the web3 library to get the latest block from the EVM and from that return its timestamp.

-   Create a file named **assertRevert.js** inside the **/test/utils** directory
-   Copy the following extract into **assertRevert.js**

```javascript
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

![](https://ipfs.infura.io/ipfs/QmPCxstBZ9dsJVyhZUvUc1zbzSppJkAiQCfTUEGtfphTR3)

The above extract takes a promise as its first argument, which would be a web3 transaction, and an assertion fail message as the next. It wraps the promise in a try and catches the error, if the promise fails it checks if the error message contains the string "revert”.

We can now import our helper function into our **bounties.js** test file, by adding the following lines:

```javascript
const getCurrentTime = require('./utils/time').getCurrentTime;
const assertRevert = require('./utils/assertRevert').assertRevert;
const dayInSeconds = 86400;
```

We also added a `dayInSeconds` constant to help us add days.

#### Happy Path for tests

**Note: all the following tests should be placed in the bounties.js file**

The test for our first happy path looks like this:

```javascript
it("Should allow a user to issue a new bounty", async () => {
    let time = await getCurrentTime();
    let tx = await bountiesInstance.issueBounty(
      "0x736f6d6520726571756972656d656e7473",
      1691452800,
      { from: accounts[0], value: 500000000000 }
    );
    assert.strictEqual(
      tx.receipt.logs.length,
      1,
      "issueBounty() call did not log 1 event"
    );
    assert.strictEqual(
      tx.logs.length,
      1,
      "issueBounty() call did not log 1 event"
    );
    const logBountyIssued = tx.logs[0];
    assert.strictEqual(
      logBountyIssued.event,
      "BountyIssued",
      "issueBounty() call did not log event BountyIssued"
    );
    expect(logBountyIssued.args._id).to.eq.BN(0);
    assert.strictEqual(
      logBountyIssued.args._issuer,
      accounts[0],
      "BountyIssued event logged did not have expected issuer"
    );
    assert.strictEqual(
      logBountyIssued.args._amount.toNumber(),
      500000000000,
      "BountyIssued event logged did not have expected amount"
    );
  });
```

There is a lot going on here, so let's break it down:

-   Each test starts with the function `it()` which takes a description of the test as its first arguments and a callback function as the next. We use `async()` as the callback so we can use `await`.
-   We then invoke an `issueBounty` transaction on our `bountiesInstance` object, using our `getCurrentTIme()` helper to ensure our deadline is valid.
-   The transaction is sent from `account[0]` with a value of `500000000000000000`.
-   We then `assert` that our transaction receipt contains a log of exactly 1 event.
-   We then assert that the details of the event are as expected.
-   Notice, we used `expect` to check if the `id` is equal to BigNumber 0. You cannot use the `Assert` keyword in this case because `BN` is not a function in it. To test for `BN`, we had to install `bignumber.js`, `chai`, `bn-chai` using npm and add the following at the beginning of the file:

```javascript
const BN = require("bignumber.js");
const chai = require("chai");
const bnChai = require("bn-chai");
const { expect } = chai;
chai.use(bnChai(BN));
```

Our second happy path tests making a call to `issueBounty` rather than sending a transaction:

```javascript
it("Should not allow a user to issue a bounty without sending ETH", async () => {
    let time = await getCurrentTime()
    assertRevert(bountiesInstance.issueBounty('0x736f6d6520726571756972656d656e7473',
                                time + (dayInSeconds * 2),
                                {from: accounts[0]}), "Bounty issued without sending ETH");

  });
```

Above we add `.call` to `issueBounty` to make a call to the function rather than issuing a transaction. This returns the return value of the function rather than a transaction receipt.

**NOTE: Because our result is a `BigNumber`, we need to call `.toNumber()` in our assert function.**

#### Error Path

Our error path tests involve sending a transaction with invalid inputs as an argument to our `assertRevert` helper function. To test our `payable` keyword, we invoke a transaction without setting a value:

```javascript
it("Should not allow a user to issue a bounty without sending ETH", async () => {
      let time = await getCurrentTime()
      assertRevert(bountiesInstance.issueBounty("data",
                                  time + (dayInSeconds * 2),
                                  {from: accounts[0]}), "Bounty issued without sending ETH");

    });
```

To test `msg.value > 0` we invoke our transaction with a value of 0:

```javascript
it("Should not allow a user to issue a bounty when sending value of 0", async () => {
    let time = await getCurrentTime()
    assertRevert(bountiesInstance.issueBounty('0x736f6d6520726571756972656d656e7473',
                                time + (dayInSeconds * 2),
                                {from: accounts[0], value: 0}), "Bounty issued when sending value of 0");

  });
```

To test our `_deadline > block.timestamp`, we need to send two transactions, one with a deadline set in the past, and another with a deadline set as now:

```javascript
it("Should not allow a user to issue a bounty with a deadline in the past", async () => {
    let time = await getCurrentTime()
    assertRevert(bountiesInstance.issueBounty('0x736f6d6520726571756972656d656e7473',
                                time - 1,
                                {from: accounts[0], value: 0}), "Bounty issued with deadline in the past");

  });

  it("Should not allow a user to issue a bounty with a deadline of now", async () => {
    let time = await getCurrentTime()
    assertRevert(bountiesInstance.issueBounty('0x736f6d6520726571756972656d656e7473',
                                time,
                                {from: accounts[0], value: 0}), "Bounty issued with deadline of now");

  });
```

If we run the `truffle test` command we should see the following:

```shell
$ truffle test

Contract: Bounties
    ✓ Should allow a user to issue a new bounty (92ms)
    ✓ Should return an integer when calling issueBounty (46ms)
    ✓ Should not allow a user to issue a bounty without sending ETH
    ✓ Should not allow a user to issue a bounty when sending value of 0
    ✓ Should not allow a user to issue a bounty with a deadline in the past
    ✓ Should not allow a user to issue a bounty with a deadline of now
    ✓ Should not allow a user to fulfil an existing bounty where the deadline has passed (103ms)


  7 passing (1s)
```

#### Time travel

One of the main tests is to check that a fulfilment should not be accepted if the deadline has passed. In order to test this, we need to add a helper function which advances the timestamp of the EVM.

In the **/test/utils/time.js** file add the following:

```javascript
function increaseTimeInSeconds(increaseInSeconds) {
    return new Promise(function(resolve) {
        web3.currentProvider.send({
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

```javascript
Object.assign(exports, {
  increaseTimeInSeconds,
  getCurrentTime
});
```

In the **bounties.js** test file add the following line to import our new helper function:

```javascript
const increaseTimeInSeconds = require('./utils/time').increaseTimeInSeconds;
```

We can then use this in our test as follows:

```javascript
it("Should not allow a user to fulfil an existing bounty where the deadline has passed", async () => {
  let time = await getCurrentTime()
  await bountiesInstance.issueBounty("data",
                    time+ (dayInSeconds * 2),
                    {from: accounts[0], value: 500000000000});

  await increaseTimeInSeconds((dayInSeconds * 2)+1)

  assertRevert(bountiesInstance.fulfillBounty(0,"data",{from: accounts[1]}), "Fulfillment accepted when deadline has passed");

});
```

### Try it yourself

Now that you have seen how to test the `issueBounty` function, try adding tests for the following functions:

-   `fulfilBounty`
-   `acceptFulfilment`
-   `cancelBounty`

You can find the [complete bounties.js test file here for reference](https://github.com/iamonuwa/Bounties/blob/master/test/bounties.js)

### Next Steps

-   Read the next guide: [Truffle: Adding a Frontend with React Box](https://kauri.io/article/86903f66d39d4379a2e70bd583700ecf/truffle:-adding-a-frontend-with-react-box)
-   Learn more about the Truffle suite of tools from the [website](https://truffleframework.com/)

> If you enjoyed this guide, or have any suggestions or questions, let me know in the comments.
>
> If you have found any errors, feel free to update this guide by selecting the **'Update Article'** option in the right hand menu, and/or [update the code](https://github.com/iamonuwa/Bounties)



---

- **Kauri original title:** Truffle  Testing your smart contract
- **Kauri original link:** https://kauri.io/truffle-testing-your-smart-contract/ebc4a29cc1c044fdba99631796ffbd93/a
- **Kauri original author:** Onuwa Nnachi Isaac (@iamonuwa)
- **Kauri original Publication date:** 2019-08-29
- **Kauri original tags:** smart-contract, testing, vyper
- **Kauri original hash:** QmX6Cjg1tiFC6RcCrXGodStwSP2t6CsjmYPA2FxvMRYBLo
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



