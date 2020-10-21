---
title: Truffle  Testing your smart contract
summary: Earlier in the series, we took a look at how to setup Truffle and use it to compile, deploy and interact with our Bounties.sol smart contract. This article will walk through the steps required to write tests for our smart contract within the Truffle framework. Tests in Truffle projects can be written in Javascript or Solidity, however, this article will focus on the Javascript tests. Truffle uses the Mocha testing framework to provide an easy way to write tests in Javascript and uses Chai for as
authors:
  - Josh Cassidy (@joshorig)
date: 2019-05-02
some_url: 
---

# Truffle  Testing your smart contract



Earlier in the series, we took a look at how to setup Truffle and use it to compile, deploy and interact with our Bounties.sol smart contract.

This article will walk through the steps required to write tests for our smart contract within the Truffle framework. Tests in Truffle projects can be written in [Javascript] (http://truffleframework.com/docs/getting_started/javascript-tests) or [Solidity] (http://truffleframework.com/docs/getting_started/solidity-tests), however, this article will focus on the Javascript tests.

Truffle uses the [Mocha] (https://mochajs.org/) testing framework to provide an easy way to write tests in Javascript and uses [Chai] (http://www.chaijs.com/api/assert/) for assertions. You can read more about [testing in Truffle here] (https://truffleframework.com/docs/truffle/testing/testing-your-contracts).

[Source code for this tutorial can be found here.] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/truffle-writing-tests)

### Prerequisites

**NODEJS 7.6+**

Since web3.js and truffle executios are asynchronous, we'll be using [async/await] (https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9) to simplify our test code. You’ll have to upgrade to Node 7.6 or higher. 

**TRUFFLE**
```
$ npm install -g truffle
```
Read more on [installing truffle here] (https://truffleframework.com/docs/truffle/getting-started/installation).

**Truffle Project**

In order to test our Bounties.sol smart contract we'll need to have a truffle project set up to compile and deploy our smart contract. Let's start with the truffle project we created earlier in the series:
```
$ git clone https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series.git
$ cd kauri-fullstack-dapp-tutorial-series
$ cp -R truffle-compilation-and-deploy dapp-series-bounties
$ cd dapp-series-bounties
```
We'll also need to install the **truffle-hdwallet-provider** dependency, to ensure the project compiles:
```
$ npm install truffle-hdwallet-provider@web3-one --save
```

**Development Blockchain: Ganache-CLI**

In order to deploy our smart contract, we’re going to need an Ethereum environment to deploy to. For this, we will use Ganache-CLI to run a local development environment

NOTE: If you have a windows machine you will need to install the windows developer tools first
```
npm install -g windows-build-tools
```
```
$ npm install -g ganache-cli
```

**Note For Windows Users:**

You should install promise and bindings to ensure there are no errors later on. 

`npm install mz`   

`npm install bindings`

### Setting up a test file

Now that we have our project setup we'll create our first test:


* First, we need to create a file named bounties.js  inside the **/test** folder
* Within our bounties.js file we need to import the Bounties.sol artifact so we can use it within our tests
```
const Bounties = artifacts.require("./Bounties.sol");
```
* We'll also now define a contract container which where our tests for this contract will live, usually set this to the name of the contract, however, this is not required, you can use any text you like.
```
contract('Bounties', function(accounts) {

  let bountiesInstance;

  beforeEach(async () => {
      bountiesInstance = await Bounties.new()
   })
   
});
```
* Within the contract container, we also define a variable to hold the contract instance being tested **bountiesInstance**, and a **beforeEach** block
* The **beforeEach** block will execute before each test and will deploy a new instance of the Bounties.sol smart contract. This ensures each test is executed against a clean contract state

Your bounties.js file should look as follows:

![](https://ipfs.infura.io/ipfs/QmcFV9NNxnKaxa2kGxj3kRpC59Yhf9TCmqVcHvidRudjxb)

At this point, we have the basic skeleton of our test file and we can test everything is set up correctly by executing the following:

First in a separate window start ganache-cli:
```
$ ganache-cli
```
Next, run the **truffle test** command:
```
$ truffle test
```


Running truffle test executes all tests in your truffle projects **/test** folder. This does the following:

1. Compiles your contracts
2. Runs migrations to deploy the contracts to the network
3. Runs tests against the contracts deployed on the network

### Writing a Test

Let's take a look at the issueBounty function:
```
function issueBounty(
  string _data,
  uint64 _deadline
)
  external
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

Where we are expecting the input validation to fail, we expect to get a *revert* error from the EVM. You can [read more about error handling in Solidity here] (https://solidity.readthedocs.io/en/v0.4.24/control-structures.html?highlight=revert#error-handling-assert-require-revert-and-exceptions).

Also to create our bounty, we'll need to pass in a deadline which is greater than the current timestamp on the EVM.

To do this we'll need to write some helper functions to assist us in writing our tests:

* First, create a folder in the **/test** directory named **utils** and create a file **time.js**
* Copy the following extract into **time.js**
```
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

![](https://ipfs.infura.io/ipfs/QmWaFwv1udeBqcEwHixre55igXssD9RaLNPeuQyvirwsmX)

The above extract takes a promise as its first argument, which would be a web3 transaction, and an assertion fail message as the next. It wraps the promise in a try and catches the error,  if the promise fails it checks if the error message contains the string **"revert”**.

We can now import our helper function into our bounties.js test file, by adding the following lines:
```
const getCurrentTime = require('./utils/time').getCurrentTime;
const assertRevert = require('./utils/assertRevert').assertRevert;
const dayInSeconds = 86400;
```
We also added a **dayInSeconds** constant, to help us add days.

#### Happy Path

**Note: all the following tests should be placed in the bounties.js file**

The test for our first happy path looks like this:
```
  it("Should allow a user to issue a new bounty", async () => {
   let time = await getCurrentTime()
   let tx = await bountiesInstance.issueBounty("data",
                               time + (dayInSeconds * 2),
                               {from: accounts[0], value: 500000000000});

   assert.strictEqual(tx.receipt.logs.length, 1, "issueBounty() call did not log 1 event");
   assert.strictEqual(tx.logs.length, 1, "issueBounty() call did not log 1 event");
   const logBountyIssued = tx.logs[0];
   assert.strictEqual(logBountyIssued.event, "BountyIssued", "issueBounty() call did not log event BountyIssued");
   assert.strictEqual(logBountyIssued.args.bounty_id.toNumber(),0, "BountyIssued event logged did not have expected bounty_Id");
   assert.strictEqual(logBountyIssued.args.issuer, accounts[0], "BountyIssued event logged did not have expected issuer");
   assert.strictEqual(logBountyIssued.args.amount.toNumber(),500000000000, "BountyIssued event logged did not have expected amount");

 });
```

There is a lot going on here but its quite simple:

* Each test starts with the function `it()` which takes a description of the test as its first arguments and a callback function as the next. We use `async()` as the callback so we can use `await`

* We then invoke an `issueBounty` transaction on our `bountiesInstance` object, using our `getCurrentTIme()` helper to ensure our deadline is valid

* The transaction is sent from `account[0]` with a value of `500000000000000000`

* We then `assert` that our transaction receipt contains a log of exactly 1 event.

* We then assert that the details of the event are as expected


Our second happy path which tests making a call to `issueBounty` rather than sending a transaction looks like this:

```
 it("Should return an integer when calling issueBounty", async () => {
   let time = await getCurrentTime()
   let result = await bountiesInstance.issueBounty.call("data",
                               time + (dayInSeconds * 2),
                               {from: accounts[0], value: 500000000000});

   assert.strictEqual(result.toNumber(), 0, "issueBounty() call did not return correct id");
 });
```

Above we add `.call` to issueBounty to make a call to the function rather than issuing a transaction. This returns the return value of the function rather than a transaction receipt.

**NOTE: Because our result is a BigNumber, we need to call .toNumber() in our assert function.**

#### Error Path

Our error path tests will involve us sending a transaction with invalid inputs as an argument to our `assertRevert` helper function

To test our payable keyword, we invoke a transaction without a value being set:

```
it("Should not allow a user to issue a bounty without sending ETH", async () => {
     let time = await getCurrentTime()
     assertRevert(bountiesInstance.issueBounty("data",
                                 time + (dayInSeconds * 2),
                                 {from: accounts[0]}), "Bounty issued without sending ETH");

   });
```

To test our hasValue() modifier, we invoke our transaction with a value of 0:

```
it("Should not allow a user to issue a bounty when sending value of 0", async () => {
      let time = await getCurrentTime()
      assertRevert(bountiesInstance.issueBounty("data",
                                  time + (dayInSeconds * 2),
                                  {from: accounts[0], value: 0}), "Bounty issued when sending value of 0");

    });
```

To test our validateDeadline modifier, we need to send two transactions, one with a deadline set in the past, and another with a deadline set as now:

```
it("Should not allow a user to issue a bounty with a deadline in the past", async () => {
        let time = await getCurrentTime()
        assertRevert(bountiesInstance.issueBounty("data",
                                    time - 1,
                                    {from: accounts[0], value: 0}), "Bounty issued with deadline in the past");

      });

  it("Should not allow a user to issue a bounty with a deadline of now", async () => {
          let time = await getCurrentTime()
          assertRevert(bountiesInstance.issueBounty("data",
                                      time,
                                      {from: accounts[0], value: 0}), "Bounty issued with deadline of now");
        });
```
So now if we run the truffle test command we should see the following:
```
$ truffle test

Compiling ./contracts/Bounties.sol...
Compiling ./contracts/Migrations.sol...


  Contract: Bounties
    ✓ Should allow a user to issue a new bounty (207ms)
    ✓ Should return an integer when calling issueBounty (142ms)
    ✓ Should not allow a user to issue a bounty without sending ETH (116ms)
    ✓ Should not allow a user to issue a bounty when sending value of 0 (100ms)
    ✓ Should not allow a user to issue a bounty with a deadline in the past (109ms)
    ✓ Should not allow a user to issue a bounty with a deadline of now (110ms)


  6 passing (1s)
```
 
#### Time travel

One of the main tests is to check that a fulfilment should not be accepted if the deadline has passed. In order to test this, we will need to add a helper function which advances the timestamp of the EVM:

In the **/test/utils/time.js** file add the following:

```
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
   let time = await getCurrentTime()
   await bountiesInstance.issueBounty("data",
                     time+ (dayInSeconds * 2),
                     {from: accounts[0], value: 500000000000});

   await increaseTimeInSeconds((dayInSeconds * 2)+1)

   assertRevert(bountiesInstance.fulfillBounty(0,"data",{from: accounts[1]}), "Fulfillment accepted when deadline has passed");

 });
```

### Try it yourself

Now that you have seen how to test the issueBounty function, try adding tests for the following functions:

* fulfilBounty
* acceptFulfilment
* cancelBounty

You can find the [complete bounties.js test file here for reference]  (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/blob/master/truffle-writing-tests/test/bounties.complete.js)

### Next Steps
- Read the next guide: [Truffle: Adding a Frontend with React Box](https://kauri.io/article/86903f66d39d4379a2e70bd583700ecf/truffle:-adding-a-frontend-with-react-box)
- Learn more about the Truffle suite of tools from the [website](https://truffleframework.com/)

>If you enjoyed this guide, or have any suggestions or questions, let me know in the comments. 

>If you have found any errors, feel free to update this guide by selecting the **'Update Article'** option in the right hand menu, and/or [update the code](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/truffle-react-box-frontend)









---

- **Kauri original title:** Truffle  Testing your smart contract
- **Kauri original link:** https://kauri.io/truffle-testing-your-smart-contract/f95f956261494090be1aaa8227464773/a
- **Kauri original author:** Josh Cassidy (@joshorig)
- **Kauri original Publication date:** 2019-05-02
- **Kauri original tags:** testing, tutorial, truffle, solidity
- **Kauri original hash:** QmehCtt8tfEjFhUnwaGE1SDcaVsuBcUaiud4rfVkNEKhfV
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



