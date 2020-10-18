---
title: An Introduction to Smart Contracts with Vyper
summary: Vyper is a smart contract-oriented, pythonic programming language that targets the Ethereum Virtual Machine (EVM). It aims to follow the similar simplicity, security and readability principles of Python and provides the following features- Bounds and overflow checking- On array accesses as well as on arithmetic level. Support for signed integers and decimal fixed point numbers Decidability- It should be possible to compute a precise upper bound for the gas consumption of any function call. Stron
authors:
  - Kauri Team (@kauri)
date: 2019-04-30
some_url: 
---

# An Introduction to Smart Contracts with Vyper

![](https://ipfs.infura.io/ipfs/QmUUT6kMFq1jqXJQPKizRqq9ziGKSBejSjAG7yFjgPAotD)


Vyper is a smart contract-oriented, pythonic programming language that targets the Ethereum Virtual Machine (EVM).

It aims to follow the similar simplicity, security and readability principles of Python and provides the following features:

-   **Bounds and overflow checking**: On array accesses as well as on arithmetic level.
-   **Support for signed integers and decimal fixed point numbers**
-   **Decidability**: It should be possible to compute a precise upper bound for the gas consumption of any function call.
-   **Strong typing**: Including support for units (e.g., timestamp, timedelta, seconds, wei, wei per second, meters per second squared).
-   **Small and understandable compiler code**
-   **Limited support for pure functions**: Anything marked constant is not allowed to change the state.

And to follow similar principles, Vyper does not support:

-   **Modifiers**
-   **Class inheritance**
-   **Inline assembly**
-   **Function overloading**
-   **Operator overloading**
-   **Recursive calling**
-   **Infinite-length loops**
-   **Binary fixed point**

### Introductory Open Auction Example

As an introductory example of a smart contract written in Vyper, we begin with an open auction contract. All Vyper syntax is valid Python3 syntax, however not all Python3 functionality is available in Vyper.

In this contract, participants can submit bids during a limited time period. When the auction period ends, a predetermined beneficiary receives the amount of the highest bid.

```python
## Open Auction

## Auction params
## Beneficiary receives money from the highest bidder
beneficiary: public(address)
auctionStart: public(timestamp)
auctionEnd: public(timestamp)

## Current state of auction
highestBidder: public(address)
highestBid: public(wei_value)

## Set to true at the end, disallows any change
ended: public(bool)

## Keep track of refunded bids so we can follow the withdraw pattern
pendingReturns: public(map(address, wei_value))

## Create a simple auction with `_bidding_time`
## seconds bidding time on behalf of the
## beneficiary address `_beneficiary`.
@public
def __init__(_beneficiary: address, _bidding_time: timedelta):
    self.beneficiary = _beneficiary
    self.auctionStart = block.timestamp
    self.auctionEnd = self.auctionStart + _bidding_time

## Bid on the auction with the value sent
## together with this transaction.
## The value will only be refunded if the
## auction is not won.
@public
@payable
def bid():
    # Check if bidding period is over.
    assert block.timestamp < self.auctionEnd
    # Check if bid is high enough
    assert msg.value > self.highestBid
    # Track the refund for the previous high bidder
    self.pendingReturns[self.highestBidder] += self.highestBid
    # Track new high bid
    self.highestBidder = msg.sender
    self.highestBid = msg.value

## Withdraw a previously refunded bid. The withdraw pattern is
## used here to avoid a security issue. If refunds were directly
## sent as part of bid(), a malicious bidding contract could block
## those refunds and thus block new higher bids from coming in.
@public
def withdraw():
    pending_amount: wei_value = self.pendingReturns[msg.sender]
    self.pendingReturns[msg.sender] = 0
    send(msg.sender, pending_amount)

## End the auction and send the highest bid
## to the beneficiary.
@public
def endAuction():
    # It is a good guideline to structure functions that interact
    # with other contracts (i.e. they call functions or send Ether)
    # into three phases:
    # 1. checking conditions
    # 2. performing actions (potentially changing conditions)
    # 3. interacting with other contracts
    # If these phases are mixed up, the other contract could call
    # back into the current contract and modify the state or cause
    # effects (Ether payout) to be performed multiple times.
    # If functions called internally include interaction with external
    # contracts, they also have to be considered interaction with
    # external contracts.

    # 1. Conditions
    # Check if auction endtime has been reached
    assert block.timestamp >= self.auctionEnd
    # Check if this function has already been called
    assert not self.ended

    # 2. Effects
    self.ended = True

    # 3. Interaction
    send(self.beneficiary, self.highestBid)
```

This example only has a constructor, two methods to call, and variables to manage the contract state. This is all we need for a basic implementation of an auction smart contract.

Let’s get started!

```python
## Auction params
## Beneficiary receives money from the highest bidder
beneficiary: public(address)
auctionStart: public(timestamp)
auctionEnd: public(timestamp)

## Current state of auction
highestBidder: public(address)
highestBid: public(wei_value)

## Set to true at the end, disallows any change
ended: public(bool)
```

We begin by declaring variables to keep track of our contract state. We initialize a global variable beneficiary by calling `public` on the datatype `address`. The beneficiary will be the receiver of money from the highest bidder. We also initialize the variables `auctionStart` and `auctionEnd` with the datatype `timestamp` to manage the open auction period and `highestBid` with datatype `wei_value`, the smallest denomination of ether, to manage auction state. The variable `ended` is a boolean to determine whether the auction is officially over.

All the variables are passed into the public function. By declaring the variable public, the variable is callable by external contracts. Initializing the variables without the public function defaults to a private declaration and thus only accessible to methods within the same contract. The public function additionally creates a ‘getter’ function for the variable, accessible through an external call such as `contract.beneficiary()`.

Now, the constructor.

The contract is initialized with two arguments: `_beneficiary` of type `address` and `_bidding_time` with type `timedelta`, the time difference between the start and end of the auction. We store these two pieces of information into the contract variables `self.beneficiary` and `self.auctionEnd`. We have access to the current time by calling `block.timestamp`. `block` is an object available within any Vyper contract and provides information about the block at the time of calling. Similar to block, another important object available to us within the contract is `msg`, which provides information on the method caller.

With initial setup out of the way, lets look at how our users can make bids.

The `@payable` decorator allows a user to send some ether to the contract in order to call the decorated method. In this case, a user wanting to make a bid calls the `bid()` method while sending an amount equal to their desired bid (not including gas fees). When calling any method within a contract, we are provided with a built-in variable `msg` and we can access the public address of any method caller with `msg.sender`. Similarly, the amount of ether a user sends can be accessed by calling `msg.value`.

We first check whether the current time is before the auction’s end time using the `assert` function which takes any boolean statement. We also check to see if the new bid is greater than the highest bid. If the two assert statements pass, we can safely continue to the next lines; otherwise, the `bid()` method throws an error and reverts the transaction. If the two assert statements and the check that the previous bid is not equal to zero pass, we can safely conclude that we have a valid new highest bid. We send back the previous `highestBid` to the previous `highestBidder` and set our new `highestBid` and `highestBidder`.

With the `endAuction()` method, we check whether our current time is past the `auctionEnd` time we set upon initialization of the contract. We also check that `self.ended` had not previously been set to `True`. We do this to prevent any calls to the method if the auction had already ended, which could potentially be malicious if the check had not been made. We then officially end the auction by setting `self.ended` to `True` and sending the highest bid amount to the beneficiary.

### Next Steps

This introduction and example was taken from [the official Vyper documentation](https://vyper.readthedocs.io/), which is your best resource. Recommended next steps are:

-   [Vyper by example](https://vyper.readthedocs.io/en/latest/vyper-by-example.html)
-   [Structure of a contract](https://vyper.readthedocs.io/en/latest/structure-of-a-contract.html)



---

- **Kauri original link:** https://kauri.io/an-introduction-to-smart-contracts-with-vyper/af913a853eaf4db88627b3ff9572b770/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2019-04-30
- **Kauri original tags:** ethereum, smart-contracts, vyper
- **Kauri original hash:** QmZy9DsHhcRGeR3QsnsRPinxQv56YdXoRirYu9wYANDjLk
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



