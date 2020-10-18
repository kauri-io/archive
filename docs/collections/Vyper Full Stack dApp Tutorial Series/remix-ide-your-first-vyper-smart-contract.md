---
title: Remix IDE - Your first Vyper smart contract
summary: Remix IDE - Your first Vyper smart contract The easiest place to start writing smart contracts in Vyper in with the online Remix IDE. As its an online IDE, theres no need for installation or development environment setup, you can open the site and get started! Remix provides tools for debugging, static analysis, and deployment all within the online environment. To use Remix with Vyper, you first need to enable the Vyper plugin from the Plugin Manager tab. You can find the source code used in thi
authors:
  - Onuwa Nnachi Isaac (@iamonuwa)
date: 2019-08-29
some_url: 
---

# Remix IDE - Your first Vyper smart contract


## Remix IDE - Your first Vyper smart contract

The easiest place to start writing smart contracts in Vyper in with the online [Remix IDE](https://remix.ethereum.org/).

As it's an online IDE, there's no need for installation or development environment setup, you can open the site and get started!

Remix provides tools for debugging, static analysis, and deployment all within the online environment. To use Remix with Vyper, you first need to enable the Vyper plugin from the _Plugin Manager_ tab.

[You can find the source code used in this tutorial on GitHub.](https://github.com/iamonuwa/Bounties)

Before we get started, a quick reminder of what we are building:

-   A dapp which allows any user to issue a bounty in ETH
-   Any user with an Ethereum account can issue a bounty in ETH along with some requirements
-   Any user can submit a fulfilment of the bounty along with some evidence
-   The bounty issuer can accept a fulfilment which would result in the fulfiller being paid out

Clear the content of the editor, and name the file _Bounty.vy_.

<!-- TODO: Update -->

![](https://api.kauri.io:443/ipfs/QmYMV1Xu841fpMpyqSaVYQAvnJ5xuXHKmpn9DjeUtsXpac)

We first define structs for the contract.

> Structs are custom defined types that can group several variables.

```vyper
struct Bounty:
    issuer: address
    deadline: timestamp
    data: bytes32
    status: uint256
    amount: wei_value

struct Fulfillment:
    accepted: bool
    fulfiller_address: address
    data: bytes32
```

To test if everything is working, click the _Compile_ button to compile the contract.

![](https://api.kauri.io:443/ipfs/QmNQH4ytWiWeHSRgLTQofbnkzYRRuiRtmwLguVTWXHCKoS)

If everything is ok, you should see output in the _Bytecode_, _Runetime Bytecode_ and _LLL_ tabs, this indicates the compilation was successful.

![](https://api.kauri.io:443/ipfs/QmTLoPwXJ1TooRbC9hagxHcBXkPNAJsFULvCnhfUBzWpdg)

If there is an error, you should see an error message when you open any of the tab links.

![](https://api.kauri.io:443/ipfs/QmcTdx9ifH6nipE2KeaWjkz6EtDMgk3m3ib4zGCX1vyipM)

### Issuing a Bounty

Now that we have the basic skeleton of our smart contract, we can start adding functions. First we tackle allowing a user to issue a bounty.

#### Declare state variables

Just like in Solidity, Vyper has state variables. State variables are values which are permanently stored in a contract storage.

[You can read a full list of Vyper types in the documentation ](https://vyper.readthedocs.io/en/latest/types.html)

Next we define events for the contract. Vyper can log events caught during runtime and display it for the user.

```vyper
BountyIssued: event({_id: int128, _issuer: indexed(address), _amount: wei_value, data: bytes32 })
BountyCancelled: event({ _id: int128, _issuer: indexed(address), _amount: uint256 })
BountyFulfilled: event({ _bountyId: int128, _issuer: indexed(address), _fulfiller: indexed(address), _fulfillmentId: int128, _amount: uint256})
FulfillmentAccepted: event({ _bountyId: int128, _issuer: indexed(address), _fulfiller: indexed(address), _fulfillmentId: int128, _amount: uint256 })
```

We have four events that have different fields. A client may want to listen to the events for changes on the contract.

Declare constant values which we use to keep track of a bounties state:

```vyper
CREATED: constant(uint256) = 0
ACCEPTED: constant(uint256) = 1
CANCELLED: constant(uint256) = 2
```

Define 2 arrays where we store data about each issued bounty and the fulfillment:

```vyper
bounties: map(int128, Bounty)
fulfillments: map(int128, Fulfillment)
```
Define indexes for each fulfillment and bounty. We need this to get the current position of the fulfillment and bounty that exists.

```
nextBountyIndex: int128
nextFulfillmentIndex: int128
```

**Note**: If you fail to define the indexes, you'll encounter this error at the end when you attempt test the contract.

`Persistent variable undeclared: nextBountyIndex`


Define indexes for each fulfillment and bounty. We need this to get the current position of the fulfillment and bounty that exists.

```vyper
nextBountyIndex: int128
nextFulfillmentIndex: int128
```

#### Issue Bounty Function

Now that we have declared our state variables we can add functions to allow users to interact with our smart contract

Add the `public` decorator to the function so that external users can call it from the contract. In order to send ETH to our contract we need to add the `payable` keyword to the function. Without this `payable` keyword the contract rejects all attempts to send ETH to it via this function. Read more about [decorators](https://vyper.readthedocs.io/en/latest/structure-of-a-contract.html#functions).

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

The function `issueBounty` receives a `bytes32` variable called `_data` and a `timestamp` `_deadline` as arguments.

```vyper
assert msg.value > 0
assert _deadline > block.timestamp
```

Since Vyper does not support modifiers, we use the `assert` keyword check to ensure that the every condition is met. The function returns an error if any of the conditions are not met.

```vyper
bIndex: int128 = self.nextBountyIndex
```

We define a variable of `int128` to hold the current `Index` position of the bounty. This is necessary because we need to use it to store the new bounty on the bounties list.

The body of our function has two lines:

```vyper
self.bounties[bIndex] = Bounty({ issuer: msg.sender, deadline: _deadline, data: _data, status: 0, amount: msg.value })
self.nextBountyIndex = bIndex + 1
```

First we insert a new `Bounty` into our `bounties` array using the `bIndex`, setting the `BountyStatus` to `CREATED`.

In Vyper, `msg.sender` is automatically set as the address of the sender, and `msg.value` is set to the amount of Wei (1 ETH = 1000000000000000000 Wei).

We set the `msg.sender` as the issuer and the `msg.value` as the bounty amount.

```vyper
log.BountyIssued(bIndex, msg.sender, msg.value, _data)
```

Finally, we log the event `BountyIssued` for the user to subscribe to.

#### Try it yourself

Now that you have seen how to add a function to issue a bounty, try adding the following functions to the Bounties contract:

-   `fulfilBounty(uint _bountyId, string _data)` This function stores a fulfilment record attached to the given bounty. The `msg.sender` should be recorded as the fulfiller.
-   `acceptFulfilment(uint _bountyId, uint _fulfilmentId)` This function accepts the given fulfilment, and if a record of it exists against the given bounty. It should then pay the bounty to the fulfiller.
-   `function cancelBounty(uint _bountyId)` This function cancels the bounty, if it has not already been accepted, and send the funds back to the issuer

You can find the [complete Bounties.vy file here for reference](https://github.com/iamonuwa/Bounties/blob/master/contracts/Bounties.vy).

### Next Steps

<!-- TODO: Update -->

-   Read the next guide: [Understanding smart contract compilation and deployment](https://kauri.io/article/195c5784663e4963b16d914900ba5cf5/v1/understanding-smart-contract-compilation-and-deployment)
-   Learn more about Remix-IDE from the [documentation](https://remix.readthedocs.io/en/latest/) and [github](https://github.com/ethereum/remix-ide)

> If you enjoyed this guide, or have any suggestions or questions, let me know in the comments.
>
> If you found any errors, feel free to update this guide by selecting the **'Update Article'** option in the right hand menu, and/or [update the code](https://github.com/iamonuwa/Bounties)
