---
title: Plapps and Predicates  Understanding the Generalized Plasma Architecture
summary: We recently published an article that describes our new work on a more generalized plasma architecture . This post goes into more detail about the architecture for those who are interested in how things work under the hood. We’ll go over how everything fits together at a high level, then we’ll jump into the sample implementation in Python. You can scroll forward to the diagrams if you’re already very familiar with plasma. Introduction The main takeaways from our previous article are- It’s hard t
authors:
  - Plasma Group (@plasma)
date: 2019-04-22
some_url: 
---

# Plapps and Predicates  Understanding the Generalized Plasma Architecture


We recently published 
[an article](https://medium.com/plasma-group/towards-a-general-purpose-plasma-f1cc4d49c1f4)
 that describes our new work on a more generalized plasma 
[architecture](https://pigi.readthedocs.io/en/latest/src/specs/generalized-plasma-state.html)
 . 
**This post goes into more detail about the architecture for those who are interested in how things work under the hood.**
 We’ll go over how everything fits together at a high level, then we’ll jump into the 
[sample implementation](https://github.com/plasma-group/research/tree/master/gen-plasma)
 in Python. You can scroll forward to the diagrams if you’re already very familiar with plasma.

### Introduction
The main takeaways from our previous article are:



 * It’s hard to keep up with plasma research: those who are familiar with plasma have likely heard of all the different plasma flavors. Each flavor has a different sent of tradeoffs, and keeping up with rapidly evolving research is a full time job.

 * Most developers just want simple and easy ways to scale their dapps. People want good tools and well documented libraries. They certainly don’t want to build entire blockchains from scratch to run a single app.
So we set out to create a platform that makes it easy to build scalable blockchain applications without having to be a plasma expert. We ended up with a general purpose plasma chain you can build apps (or “plapps”) on. Sound weird yet? Plapp. Plaaapp. Plappp. Yup.

![](https://ipfs.infura.io/ipfs/QmNm8cUS2YrEXmdUTbEFpP8YVLaMfFaAmxXHVHV5n8Uy7j)


### Layer 2: Claims about State
The core idea behind “Layer 2” is that we can use data outside of a main blockchain (“off-chain data”) to provide guarantees about assets sitting on the main blockchain (“on-chain data”). For example, that off-chain data might give you the right to withdraw an asset held in an on-chain escrow contract on Ethereum. But the 
_ownership_
 of that asset changed hands without touching Ethereum.
Of course, the off-chain data isn’t useful unless it’s possible for something to eventually happen on the main blockchain. This is usually achieved by allowing users to submit “claims” about the off-chain data to an on-chain smart contract where the assets being claimed are held. This claim might be something like “I have this signed message that says I’m allowed to withdraw asset X.”
But what happens if after submitting the claim, the person making the aforementioned claim 
_also_
 sings a message sending asset X to 
_someone else_
 ? This would invalidate the above withdrawal. To ensure that any such invalid withdrawals are unsuccessful, we add a dispute period to every claim. Anyone may challenge the claim before the end of the dispute period. Otherwise, the claim is considered valid. Simple enough!
Let’s quickly relate this back to plasma. Plasma chains consist of a series of blocks, and each block consists of a series of transactions. Whenever a new plasma chain block is created, a 
[cryptographic commitment](https://en.wikipedia.org/wiki/Commitment_scheme)
 to that block is published to the main chain. These commitments can be used to prove that something was inside that block. In our case, this commitment is a merkle root created from all state updates in the block.
The plasma smart contract on Ethereum records the order in which plasma blocks are committed by the operator, and prevents commitments from ever being overwritten. Thus, these block commitments give us a sense of time. When users want to make claims about something that happened on plasma chain, they have to also reference 
_when_
 that thing happened through the block number. For example, a user might say, “Here’s transaction X 
_in block Y_
 that gave me asset Z.” This extra time dimension is also important for disputes because you sometimes want to know whether something happened before or after something else!

### Abstract Offchaindataism
So as we’ve just seen, Layer 2 is primarily about using some off-chain data to affect things sitting on-chain. So far, off-chain data has mostly been used to represent 
_ownership_
 — who owns what, and whether it changed hands.
Alice will deposit an asset into a smart contract on Ethereum and she will become the owner of that asset. She can then sign an off-chain message that transfers ownership of the asset to Bob. Bob can then withdraw the asset back on Ethereum by making a claim using that signed message.
We can also represent more complex things than ownership. Let’s say Alice deposits a CryptoKitty and signs a bunch of messages that change the kitty’s fur color. Just like in the example above, she can eventually make a claim on Ethereum about the kitty’s fur color using the last message she signed!

![](https://ipfs.infura.io/ipfs/QmV8LgRYMX2yVSiHoascgF8gri3rm8udWefwFnoKV1DTWs)

Whether it’s changing the kitty’s fur color or eye color, the smart contract back on Ethereum needs to have a way of understanding these changes. Each new piece of functionality — or new type of “state transition” — requires a change to the logic followed by the plasma contract. In previous plasma specs, adding a feature like this meant that one would have to re-deploy the *entire* plasma contract and migrate everyone’s assets from the old plasma chain to the new one. This is not secure, scalable, or upgradeable.

### Predicates: Making Plasma Useful
We ran into this upgradeability problem once we got far enough into our plasma chain design that we wanted to add new functionality. After some brainstorming, we realized there was an easy way to add new functionality without changing the main plasma chain contract.
All of the various scenarios we’ve talked about so far have something in common — the off chain data is always for the purpose of “disputing” incorrect on-chain claims. The dispute for a particular claim is basically just some proof that the state referenced in the claim is outdated. A dispute about ownership proves that the user making the claim later transferred ownership to someone else. A dispute about kitty fur color requires proving that the kitty’s fur color has been changed.
Our primary breakthrough was realizing that dispute conditions don’t need to be checked in the main smart contract. Instead, we could have other smart contracts implement a function that would tell us if the dispute was valid or not. We could add new functionality by creating a new contract that implemented the necessary logic for that functionality and then have our main contract reference the new one. We call these external contracts 
**‘predicates’**
 .
Now it was really easy to add new functionality, but we still needed a way to know 
_which_
 predicate to use for a particular state update. A claim about a kitty’s fur color can’t be disputed by a change in the kitty’s eye color. So how do we know which predicate to use?
Simple! We just add the requirement that the state update also says which predicate it’s subject to. Now the update message that changes a kitty’s fur color could be, “I’m making this kitty’s fur color blue and disputes can be handled by the predicate sitting at ( 
`0x123…`
 )”
Since users can specify any predicate address they want, anyone can add new functionality to the plasma chain at any time by deploying a new predicate on Ethereum. There’s a little more to predicates than just handling disputes, but we’ll get into that later. What’s important is that predicates just have to implement a standard interface, defined in this next section.

### Predicates in Practice

#### State Objects
Now let’s dive into the details of how this all works in practice. The building block of our plasma chain design is the ‘state object’. A state object is just a piece of data with two attributes:



 *  `predicateAddress` : The on-chain address that controls the object.

 *  `parameters` : Some arbitrary blob of data that describes the object.

![](https://ipfs.infura.io/ipfs/QmYgPVUVMmHtQgnfiiXKyuuLrs2pwuprtogdZNcSenBnBY)

State objects are effectively assets — a generalization of the concept of the non-fungible “coins” in Plasma Cash. Just like each unique coin had a 
`coinID`
 in Cash, each state object has a 
`stateID`
 .
That’s it! The 
`stateID`
 s are assigned sequentially based on deposits into the plasma chain, but there aren’t any rules about what 
`parameters`
 or 
`predicate`
 can be. Each plasma block is a collection of “state updates,” which define new 
`stateObjects`
 s at particular 
`stateID`
 s.

![](https://ipfs.infura.io/ipfs/QmSXgqfBBmfJcE99MwCaKPjtYsntQxRZPcTgbTSi91htGZ)

Because we use a 
[range-based Cash variant](https://medium.com/plasma-group/plasma-spec-9d98d0f2fccf)
 , 
`stateUpdate`
 s are actually specified over ranges of 
`stateObject`
 IDs:

```
stateUpdate = {
   start: uint,
   end: uint,
   plasmaBlockNumber: uint,
   stateObject: stateObject
}
```


The plasma chain contract on Ethereum, where the operator submits plasma blockhashes, implements a 
`verifyUpdate(update: stateUpdate, updateWitness:bytes[]) -> bool`
 which checks a Merkle inclusion proof ( 
`updateWitness`
 ) that the state update was indeed committed.

#### The Predicate Interface
Predicates need to implement a standard contract interface. Let’s go over those functions.
The most important thing thing the plasma contract does is determine the validity of state updates. Particularly, we need to prevent the operator (who has full control over blocks) from being able to “sneak in” a valid state update which has its 
`stateObject.parameters.owner == operator`
 — this would be theft!
To accomplish this, we introduce the concept of “state deprecation.” We say that the valid state for a given 
`stateID`
 is that of the earliest update which has not yet been “deprecated.” State deprecation is analogous to an 
**Unspent**
 Transaction Output becoming a 
**Spent**
 Transaction Output for UTXO blockchains.
This way, even if the operator sneaks in a later update where 
`stateObject.parameters.owner == operator`
 , an earlier update with 
`stateObject.parameters.owner == alice`
 will prevail, as only she can deprecate the state.
Thus, the most important function in the predicate defines the grounds by which its state may be deprecated:

```
verifyDeprecation(stateID: uint, update: stateUpdate, deprecationWitness: bytes)
```


 
`verifyDeprecation`
 returns 
`true`
 or 
`false`
 depending on whether the committed 
`stateUpdate`
 has been deprecated for a particular 
`stateID`
 . 
`deprecationWitness`
 is any arbitrary data that the predicate uses to check whether or not the 
`stateObject`
 has been deprecated. For example, by requiring that the 
`deprecationWitness`
 includes a valid signature from the 
`update.stateObject.parameters.owner`
 , we guarantee only the owner can approve a deprecation.
Remember, this function 
**doesn’t actually do any deprecation**
 as it regards to plasma’s exits games, disputes, and so on. Rather, the plasma contract 
_calls the function_
 when it needs to know whether a 
`stateObject`
 is deprecated to evaluate a dispute.
There are three other functions in the predicate interface — in order of importance, they are:

```
finalizeExit(exit: bytes)
```


When an exit is redeemed, the plasma contract sends any assets associated with the claim to the predicate address and then calls this function.

```
canInitiateExit(stateUpdate: bytes, initiationWitness: bytes) -> bool
```


This function allows the predicate to restrict who may initiate a claim on the committed state. For example, an ownership predicate probably wants to restrict 
`canInitiateExit`
 to the owner of the asset.

```
getAdditionalDisputePeriod(stateUpdate: bytes) -> uint
```


This function allows the predicate to increase the dispute period of a claim. We only really use this for complex predicates (e.g. atomic swaps) that might require a longer dispute resolution process. This function usually just returns 
`0`
 .

#### Predicates by Example: Ownership Predicate
Everything is easier with examples, so let’s take a look at one. The simplest predicate is the ownership predicate. This state allows its current 
`parameters.owner`
 to exit at any time, or approve any state update.
The first step to creating our predicate is to design our state object. Luckily that’s pretty simple, the only data inside the object’s 
`parameters`
 is the address of the current owner. A state object using the ownership predicate might look like this:

```
OwnedByAlice = {
  parameters: {
    owner: '0xAliceAddress...',
  },
  predicate: '0xOwnershipPredicateAddress...'
}
```


The most important function to implement is 
`verifyDeprecated`
 , which receives some arbitrary 
`deprecationWitness`
 . In the case of the ownership predicate, a valid 
`deprecationWitness`
 consists of:



 * A signature from `state.parameters.owner` agreeing to a new `stateUpdate` .

 * A proof that the new `stateUpdate` was committed in a later plasma block.
 
`verifyDeprecated`
 needs to check that these things are valid, which means checking a signature and a Merkle proof.

![](https://ipfs.infura.io/ipfs/QmfVkWVXXNZt5b65g1SLDbatDpFEVib2jobVR65eCdeFeU)

Putting it all together, we see how the owner can deprecate its ownership state by approving a new update:

![](https://ipfs.infura.io/ipfs/QmZnz2MSMPga5S1A1ZLbA5taHrs9AZYkejYmtqic5ZacaT)

The remaining functions are pretty simple. 
`canInitiateExit`
 needs to check that the claimant is the owner, 
`finalizeExit`
 forwards the assets over to the owner, and 
`getAdditionalDisputePeriod`
 can return 
`0`
 .
Here’s what that actually looks like in code! Below we’ve included a Python implementation of the simple ownership predicate. We wrote it in Python for simplicity, but it’s pretty easy to do in Solidity or Vyper as well.

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/ben-chain/44dbb78841db2a96cf7145114e81ee7b.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
class OwnershipDeprecationWitness:
    def __init__(self, next_state_update, signature, inclusion_witness):
        self.next_state_update = next_state_update
        self.signature = signature
        self.inclusion_witness = inclusion_witness

class OwnershipPredicate:

    def __init__(self, parent_plasma_contract):
        self.parent = parent_plasma_contract

    def can_initiate_exit(self, state_update, initiation_witness):
        # Only the owner can submit a claim
        assert state_update.state.owner == initiation_witness
        return True

    def verify_deprecation(self, state_id, state_update, deprecation_witness):
        # Check the state_id is in the deprecation_witness state update
        assert deprecation_witness.next_state_update.start &lt;= state_id \ 
            and deprecation_witness.next_state_update.end &gt; state_id
        # Check inclusion proof for more recent state update
        assert self.parent.commitment_chain.verify_inclusion \
            (deprecation_witness.next_state_update,
                self.parent.address,
                deprecation_witness.inclusion_witness)
        # Check that the previous owner signed off on the change
        assert state_update.state.owner == deprecation_witness.signature
        return True

    def finalize_exit(self, exit):
        # Transfer funds to the owner
        self.parent.erc20_contract.transferFrom \
            (self, exit.state_update.state.owner, \
                exit.state_update.end - exit.state_update.start)

    def get_additional_lockup(self, state):
        return 0

```


As you can see, we’ve implemented the entire interface described above. Not too difficult :-).
And there we have it! A predicate that represents transferable ownership of an asset. Most of the logic here is identical to what was already being done in plasma contracts. We even managed to 
[prototype the change](https://twitter.com/plasma_group/status/1097983085855965185)
 over the course of 
[ETHDenver](https://www.ethdenver.com/)
 . It was mostly a matter of moving around code that we’d already written.

### Back to the Future
This architecture is a significant step forward in our understanding of plasma. It is analogous to the jump from payment channels to generalized state channels–we are able to fit new features and functionalities in the plasma architecture without upgrading the plasma protocol itself.
Further, we believe the predicate design space presents a rich new area of research for plasma. It’s still early days, but some of the predicates we think are possible include:



 * State channels

 * DEX predicates of various types

 *  [Defragmentation](https://ethresear.ch/t/plasma-cash-defragmentation-take-3) predicates

 * Nested plasma (predicate is itself a plasma contract)

 *  [P2P options and CDP contracts](https://rainbownet.work/RainbowNetwork.pdf) 
However, it’s important to remember that predicates are not a panacea–they are still constrained within the plasma design space. More generalization is likely yet to be found. Nevertheless, predicates are very powerful, and seem useful for pretty much all plasma implementations–including those which are not based on Plasma Cash.
We think this represents an opportunity for standardization within the entire plasma ecosystem. Any plasma implementation which shares this state-deprecation architecture can share predicates and interoperate in new ways.
Layer 2 scaling solutions are all about using off-chain data to guarantee future on-chain state. Whether old state is deprecated through signatures (state channels), commitments (plasma), or something else, these tools are ultimately accomplishing the same thing. We hope that this advancement is a step towards a unified, shared language which encompasses all layer 2 solutions. We envision a future where wallets can connect to any layer 2 solution through utilizing a standard interface, rather than writing custom integration each time. All for interoperability, and interoperability for all!

### Resources
Python simulation:  
  
[https://github.com/plasma-group/research/tree/master/gen-plasma](https://github.com/plasma-group/research/tree/master/gen-plasma)
   
 Technical specification: 
[https://pigi.readthedocs.io/en/latest/src/specs/generalized-plasma-state.html](https://pigi.readthedocs.io/en/latest/src/specs/generalized-plasma-state.html)
 
 
**Join our Plasma Contributors telegram chat:**
  
[https://t.me/plasmacontributors](https://t.me/plasmacontributors)
 

### Our Thanks to:
Alex Attar  
 Dan Robinson  
 Dan Tsui  
 Georgios Konstantopoulos  
 Jeff Coleman  
 Mark Tyneway  
 Matt Slipper  
 Vitalik Buterin  
 Xuanji Li



---

- **Kauri original title:** Plapps and Predicates  Understanding the Generalized Plasma Architecture
- **Kauri original link:** https://kauri.io/plapps-and-predicates:-understanding-the-generali/d817df6443194a2684bee248a1a20cbd/a
- **Kauri original author:** Plasma Group (@plasma)
- **Kauri original Publication date:** 2019-04-22
- **Kauri original tags:** plapps, ethereum, scaling, predicates, layer-2, plasma, generalized-plasma
- **Kauri original hash:** QmNYgchK2Unz7bMvyKj7mQ16kcy2G43WZge8xa1dejMyML
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



