---
title: Remix IDE - Your first smart contract
summary: The easiest place to start writing smart contracts in Solidity in with the online Remix IDE. As its an online IDE, no installation or development environment setup is required, you can navigate to the site and get started! Remix also provides good tools for debugging, static analysis, and deployment all within the online environment. You can find the source code used in this tutorial in this GitHub repository. Before we get started, a quick reminder of what we are building- A dApp which allows a
authors:
  - Josh Cassidy (@joshorig)
date: 2019-11-20
some_url: 
---

# Remix IDE - Your first smart contract

![](https://ipfs.infura.io/ipfs/QmNQCiD3aQgUrnRS7ApCEBY2ydXBoVvfjx2BjTnUh3vMvU)


The easiest place to start writing smart contracts in Solidity in with the [online Remix IDE.](https://remix.ethereum.org/)

As it's an online IDE, no installation or development environment setup is required, you can navigate to the site and get started!

Remix also provides good tools for debugging, static analysis, and deployment all within the online environment.

[You can find the source code used in this tutorial in this GitHub repository](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/remix-bounties-smartcontract).

Before we get started, a quick reminder of what we are building: A dApp which allows any user to issue a bounty in ETH

-   Any user with an Ethereum account can issue a bounty in ETH along with some requirements
-   Any user can submit a fulfilment of the bounty along with some evidence
-   The bounty issuer can accept a fulfilment which would result in the fulfiller being paid out

In Remix, create a new file by selecting the "+" icon in the upper left-hand corner. Name the file: _Bounties.sol_

![The Remix file explorer](https://ipfs.infura.io/ipfs/QmSZV9mbP1LUsdimZvoRxwxs3D2fmV4kJx3zWZix5X8bes)

In the first line of our Solidity Smart Contract, we tell the compiler which version of Solidity to use:

```
pragma solidity ^0.5.0;
```

This line says Solidity compiler version 0.5.0 and above, up to version 0.6.0, can compile the code. The ^ character limits the compiler version up to the next breaking change, being 0.6.0.

To create the contract class, we add the following:

```
contract Bounties {

}
```

Next, we add a constructor so that our contract can be instantiated:

```
constructor() public {}
```

At this stage, we have the basic skeleton of a Smart Contract, and we can now test it compiles in the Remix IDE.

Your _Bounties.sol_ file should look like this:

```
pragma solidity ^0.5.0;

contract Bounties {

    constructor() public {}
}
```

In Remix, select the "Compile" tab in the top right-hand side of the screen, and start the compiler by selecting the "Start to Compile" option.

![Compile tab in Remix](https://ipfs.infura.io/ipfs/QmfTNZVoHzTBWwF3Nz9Dd8jkYxqD3MTWzXJ4cq1A2oK8mT)

If everything is ok, you should see a green label with the name of your contract: "Bounties", this indicates the compilation was successful.

### Issuing a Bounty

Now that we have the basic skeleton of our smart contract, we can start adding functions. First, we tackle allowing a user to issue a bounty.

#### Declare state variables

What are state variables in Solidity? A smart contract instance can maintain a state, which the EVM keeps in a storage area. This state consists of one or more variables of the solidity types. These state variables can only be modified via a function call invoked within a transaction.

[You can see a full list of solidity types in the solidity types documentation](http://solidity.readthedocs.io/en/latest/types.html)

First, let's declare an enum which we use to keep track of a bounties state:

```
enum BountyStatus { CREATED, ACCEPTED, CANCELLED }
```

Next, we define a struct which defines the data held about an issued bounty:

```
struct Bounty {
 address issuer;
 uint deadline;
 string data;
 BountyStatus status;
 uint amount;
}
```

What is a struct? Structs allow us to define custom composite types which allow us to aggregate/organise data.

Now, let's define an array where we store data about each issued bounty:

```
Bounty[] public bounties;
```

#### Issue Bounty Function

Now that we have declared our state variables we can now add functions to allow users to interact with our smart contract

```
function issueBounty(
    string memory _data,
    uint64 _deadline
)

public payable hasValue() validateDeadline(_deadline) returns (uint)
{
    bounties.push(Bounty(msg.sender, _deadline, _data,
    BountyStatus.CREATED, msg.value));
    return (bounties.length - 1);
}
```

The function `issueBounty` receives a string memory `_data` and an integer `_deadline` as arguments (the requirements as a string, and the deadline as a UNIX timestamp)

As of Solidity version, 0.5.0 explicit data location for all variables of struct, array or mapping types is now mandatory. Read more about [Solidity 0.5.0 breaking changes here](https://solidity.readthedocs.io/en/v0.5.0/050-breaking-changes.html)

Since `string` is an array of bytes, we must explicitly specify the data location of the argument `_data`. We specify `memory` since we do not want to store this data when the transaction has completed.

Solidity requires that you define the return type(s) We specify: `returns(uint)` Which means we are returning a uint (the array index of the bounty as the ID)

We define the visibility of this function as `public`.Read more about [solidity function visibility](https://solidity.readthedocs.io/en/latest/contracts.html#visibility-and-getters)

In order to send ETH to our contract we need to add the payable keyword to our function. Without this payable keyword, the contract will reject all attempts to send ETH to it via this function.

The body of our function has two lines:

```
bounties.push(Bounty(msg.sender, _deadline, _data,
BountyStatus.CREATED, msg.value));
```

First, we insert a new Bounty struct to out bounties array, setting the BountyStatus to CREATED.

In Solidity, `msg.sender` is automatically set as the address of the sender, and `msg.value` is set to the amount of Weis ( 1 ETH = 1000000000000000000 Weis).

We set the `msg.sender` as the issuer and the `msg.value` as the bounty amount.

```
return (bounties.length - 1);
```

### Validation with Modifiers

Modifiers in Solidity allow you to attach additional pieces of code to run before or after the execution of a function. It is a common practice in Solidity to use modifiers to perform argument validation for functions.

### Validate Deadline

`validateDeadline(_deadline)` is added to ensure the deadline argument is in the future; it should not be possible for a user to issue a bounty with a deadline in the past.

```
modifier validateDeadline(uint _newDeadline) {
 require(_newDeadline > now);
 _;
}
```

We use the `modifier` keyword to declare a modifier, modifiers like functions can receive arguments of their own.

The position of the `_;` symbol is key within a modifier. This body of the function modified is inserted where this symbol appears.

The `validateDeadline` modifier essentially says, execute this line:

```
require(_newDeadline > now);
```

Then execute the main function.

For validation, the `require` keyword allows you to set conditionals If they are not met, the execution is halted, reverted, and remaining gas returned to the user.

In general `require` should be used to validate user inputs, responses from external contracts, and state conditions before execution.

You can read more about [assert, require, and revert here](http://solidity.readthedocs.io/en/latest/control-structures.html#error-handling-assert-require-revert-and-exceptions).

The modifier `validateDeadline` reads as follows:

If the `deadline > now` continue and execute function body, else revert and refund remaining gas to the caller.

#### Has Value

`hasValue()` is added to ensure `msg.value` is a non zero value. Even though as previously discussed, the `payable` keyword ensures `msg.value` is set, it can still be sent as zero.

Similar to `validateDeadline` we use `require` to ensure `msg.value` input is valid e.g `>0`

```
modifier hasValue() {
 require(msg.value > 0);
 _;
}
```

`payable` is a pre-defined modifier in Solidity. It validates that ETH is sent when calling a function which requires the smart contract to be funded.

You can read more about how modifiers can be used to restrict access and guard against incorrect usage in the [solidity documentation](https://solidity.readthedocs.io/en/latest/common-patterns.html?highlight=modifier#restricting-access)

#### Issue Bounty Event

It is best practice when modifying state in Solidity to emit an event. Events allow blockchain clients to subscribe to state changes and perform actions based on those changes.

For example, a user interface showing a list of transfers in and out of an account, i.e., [etherscan](https://etherscan.io/address/0x69a70e299367ff4c3ba1fe8c93fbddd9b5b4771a), could listen to a "transfer" event to update the user on the latest transfers in and out of an account.

Read more about [solidity events here](https://solidity.readthedocs.io/en/latest/contracts.html#events).

Since when issuing a bounty, we change the state of our _Bounties.sol_ contract, we issue a `BountyIssued` event.
First, we need to declare our event:

```
event BountyIssued(uint bounty_id, address issuer, uint amount, string data);
```

Our `BountyIssued` event emits the following information about the bounty data stored:

-   _bountyId:_ The id of the issued bounty
-   _issuer:_ The account of the user who issued the bounty
-   _amount:_ The amount in Weis allocated to the bounty
-   _data:_ The requirements of the bounty as a string

Then in our `issueBounty` function, we need to emit the `BountyIssued` event:

```
bounties.push(Bounty(msg.sender, _deadline, _data, BountyStatus.CREATED, msg.value));
*emit BountyIssued(bounties.length - 1,msg.sender, msg.value, _data);*
return (bounties.length - 1);
```

Now that we have added our `issueBounty` function our _Bounties.sol_ file should look like the following:

```
pragma solidity ^0.5.0;
/**
* @title Bounties
* @author Joshua Cassidy- <joshua.cassidy@consensys.net>
* @dev Simple smart contract which allows any user to issue a bounty in ETH linked to requirements
* which anyone can fulfil by submitting the evidence of their fulfilment
*/
contract Bounties {
    /*
    * Enums
    */
    enum BountyStatus { CREATED, ACCEPTED, CANCELLED }

    /*
    * Storage
    */
    Bounty[] public bounties;

    /*
    * Structs
    */
    struct Bounty {
        address issuer;
        uint deadline;
        string data;
        BountyStatus status;
        uint amount; //in wei
    }
    /**
    * @dev Contructor
    */
    constructor() public {}

    /**
    * @dev issueBounty(): instantiates a new bounty
    * @param _deadline the unix timestamp after which fulfillments will no longer be accepted
    * @param _data the requirements of the bounty
    */
    function issueBounty(
    string memory _data,
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

    /**
    * Modifiers
    */
    modifier hasValue() {
        require(msg.value > 0);
        _;
    }
    modifier validateDeadline(uint _newDeadline) {
        require(_newDeadline > now);
        _;
    }

    /**
    * Events
    */
    event BountyIssued(uint bounty_id, address issuer, uint amount, string data);
}
```

### Deploy & interact in Remix

Now that we have our smart contract we can deploy to a local development blockchain running in the RemixIDE (browser), and test our `issueBounty` function.

First, let's compile our _Bounties.sol_ contract to ensure we have no errors. In Remix, select the "Compile" tab in the top right-hand side of the screen, and start the compiler by selecting the "Start to Compile" option.

You will notice a few static analysis warnings in the static analysis tab of the IDE. Remix runs a set of static analysers to help avoid known security vulnerabilities and follow best practices. You can read more about [Remix Analysis here.](https://remix-ide.readthedocs.io/en/latest/static_analysis.html) We can ignore these warnings for now and move on to deploying and interacting with our smart contract.

In Remix, select the `Run` tab in the top right-hand side of the screen. Within the `Environment` dropdown section, select the `Javascript VM` option.

![Deploy and run panel in Remix](https://ipfs.infura.io/ipfs/QmeNPZCm5rQMKn9feQh9zAjoT8C62LYMySER91scTP56dK)

The "JavaScript VM" option, runs a Javascript VM blockchain within the browser, this allows you to deploy and send transactions to a blockchain within the RemixIDE in the browser. This is particularly useful for prototyping, especially since no dependencies are required to be installed locally. [You can read more about running transactions within Remix here](https://remix-ide.readthedocs.io/en/latest/run.html).

Within the `Run` tab in Remix, with the `JavaScript VM` environment option selected. Click the `Deploy` button.

This button executes a transaction to deploy the contract to the local blockchain environment running in the browser. We'll talk more about contract creation transactions later on in the series.

Within the RemixIDE console, which is located directly below the editor panel, you will see the log output of the contract creation transaction.

![Log output in Remix](https://ipfs.infura.io/ipfs/QmcLv2bWgZHj4rggjwAgic99wivND9G7ZsmPqfH5iHfdrj)

The "green" tick indicates that the transaction itself was successful.

Within the "Run" tab in Remix, we can now select our deployed Bounties contract so that we can invoke the `issueBounty` function. Under the "Deployed Contracts" section, we see a list of function which can be invoked on the deployed smart contract.

Here we have the following options:

-   `issueBounty` the colour of this button "pink" indicates that invocation would result in a transaction
-   `bounties` the colour of this button "blue" indicates that invocation would result in a call

![Deploy and run panel in Remix](https://ipfs.infura.io/ipfs/QmRnPSACBzP561kkKNEa4G5jboPrWWQ9LdmVTHQbAEXjMf)

To invoke the `issueBounty` function, we need to first set the arguments in the "issueBounty" input box.

Set the `string _data` argument to some string "some requirements" and set the `uint64 _deadline` argument to a UNIX timestamp in the future e.g. "1691452800" August 8th 2023.

Since our `issueBounty` function is `payable` we must ensure `msg.value` is set, we do this by setting the values at the top of the "Run" tab with the RemixIDE.

Here we have the following options:

-   _Environment:_ As previously alluded to, sets the blockchain environment to interact with.
-   _Account:_ Allows the selection of an account to send the transaction from, and also to see the amount of ETH available in each account.
-   _Gas Limit:_ Set the max amount of gas used by execution of the transaction
-   _Value:_ The amount to send in `msg.value` here you can also select the denomination in "Wei, Gwei, Finney and Ether"

Go ahead and set "Value" to some number > 0, but less than the current amount available in the selected account. In this example, we set it to `1 ETH`

Clicking the "issueBounty" button in the "Deployed Contracts" section, within the "Run" tab, sends a transaction invoking the `issueBounty` function, on the deployed `Bounties` contract.

Within the console, you will see the log output of the issueBounty transaction.

![Console output in Remix](https://ipfs.infura.io/ipfs/QmXLonrP7pnMfW6BurbwavW6w28usWf8d66HDRnS4EnX4t)

The "Green" tick indicates the transaction was successful.

The decoded output gives you the return value of the function call, here it is `0`.

This should be the index of our "Bounty" data within the bounties array in our smart contract data store. We can double-check the storage was correct by invoking the "bounties" method in the "Deployed Contracts" section.

Set the `uint256` argument of the bounties function to `0` and click the "blue" bounties button.

![Set arguments in Remix](https://ipfs.infura.io/ipfs/QmUPZF54AToDSsm8sMy3r9BueGKArPgHx3jRdU5vyqBbiG)

Here we confirm that the data inputs for our issuedBounty are retrieved correctly from the "bounties" array with deployed smart contracts storage.

#### Try it yourself

Now that you have seen how to add a function to issue a bounty, try adding the following functions to the Bounties contract:

-   `fulfilBounty(uint _bountyId, string _data)` This function should store a fulfilment record attached to the given bounty. The `msg.sender` should be recorded as the fulfiller.
-   `acceptFulfilment(uint _bountyId, uint _fulfilmentId)` This function should accept the given fulfilment if a record of it exists against the given bounty. It should then pay the bounty to the fulfiller.
-   `function cancelBounty(uint _bountyId)` This function should cancel the bounty, if it has not already been accepted, and send the funds back to the issuer

**Note**: For `acceptFulfilment` you need to use the `address.transfer(uint amount)` function to send the ETH to the `fulfiller`. You can read more about the [address.transfer member here](https://solidity.readthedocs.io/en/latest/units-and-global-variables.html#address-related).

You can find the [complete Bounties.sol file here for reference](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/blob/master/remix-bounties-smartcontract/Bounties-complete.sol).

### Next Steps

-   Read the next guide: [Understanding smart contract compilation and deployment](https://kauri.io/article/973c5f54c4434bb1b0160cff8c695369/understanding-smart-contract-compilation-and-deployment)
-   Learn more about Remix-IDE from the [documentation](https://remix-ide.readthedocs.io/en/latest/) and [github](https://github.com/ethereum/remix-ide)

> If you enjoyed this guide, or have any suggestions or questions, let me know in the comments.
>
> If you have found any errors, feel free to update this guide by selecting the **'Update Article'** option in the right-hand menu, and/or [update the code](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/remix-bounties-smartcontract)



---

- **Kauri original link:** https://kauri.io/remix-ide-your-first-smart-contract/124b7db1d0cf4f47b414f8b13c9d66e2/a
- **Kauri original author:** Josh Cassidy (@joshorig)
- **Kauri original Publication date:** 2019-11-20
- **Kauri original tags:** ethereum, remix, solidity
- **Kauri original hash:** QmXczsudavLX1QxncEivoEsLTTc4CZEd7Wf4sJBXQPYS4j
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



