---
title: Improving IPFS Decentralization - Introducing Ahken
summary: The IPFS Elephant-In-The-Room IPFS is a popular peer-to-peer protocol for storing and sharing data in a distributed fashion, and is heavily used behind the scenes in Ethereum applications. It is often claimed that storing important dApp data in IPFS is a silver bullet that inherently makes the data decentralized and accessible, but is this really the case? Pinning in IPFS In order for content to be permanently accessible, an IPFS node in the network must permanently pin the data (referenced by t
authors:
  - Craig Williams (@craig)
date: 2018-12-20
some_url: 
---

# Improving IPFS Decentralization - Introducing Ahken

# The IPFS Elephant-In-The-Room
IPFS is a popular peer-to-peer protocol for storing and sharing data in a distributed fashion, and is heavily used behind the scenes in Ethereum applications.  It is often claimed that storing important dApp data in IPFS is a silver bullet that inherently makes the data decentralized and accessible, but is this really the case? 

## Pinning in IPFS
In order for content to be permanently accessible, an IPFS node in the network must permanently 'pin' the data (referenced by the hash of the content), and this node must be permanently online.  If all pinning nodes happen to go down, then the content in question cannot be accessed until the pinning node comes back up (assuming no node has the data in their cache).  Worse still, if the node fails to ever come back up, or its filesystem becomes corrupted in some way, then there is a chance that this data could be lost forever, unless someone re-pins it!

## Where are dApps Pinning Data?
In reality, dApps usually either pin to the popular [Infura](https://infura.io/) gateway, or run their own IPFS node (or cluster of nodes).  If no other nodes pin this data, then the application is dependent on the reliability of these nodes to retrieve the data, and having permanent access relies on the node pinning the data forever, and never getting corrupted.

# Introducing Ahken
It can be argued that IPFS data CAN become decentralized as it is possible to pin your own data, along with pinning any other data that you are interested in storing permanently.  This is not a simple task right now, which is why I've decided to start building Ahken, an Ethereum dApp aware automatic IPFS pinner, designed to be run on personal machines with a local IPFS node.  Whilst very much a work in progress right now (I've only spent a few evenings in total building out a PoC), the initial planned features are:

## Scriptable IPFS Pinning Triggered by Ethereum Events
Many Ethereum smart contracts either emit IPFS hashes of application data via events within events, or store the IPFS hash in EVM state, and subsequently emit an event after storing.  The context in which this data is stored is also more often than not associated with a public address.  The end-game is for application specific, customisable scripts to be loaded into Ahken which define a specific pinning criteria.  It is hoped that in the future, dApps will provide a link from their site that allows a user to download a script that instructs Ahken to automatically pin any IPFS dApp data that is relevant to them.

Using [bounties.network](https://bounties.network/) `StandardBounty` contract as an example, a script could be created that instructs Ahken to:

*1-* Listen for the emission of a `BountyIssued' event from the smart contract.
```
event BountyIssued(uint bountyId)
```

*2-* Call the `getBounty(...)` function, passing in the `bountyId` from the event.
```
function getBounty(uint _bountyId)
      public
      constant
      validateBountyArrayIndex(_bountyId)
      returns (address, uint, uint, bool, uint, uint)
  {
      return (bounties[_bountyId].issuer,
              bounties[_bountyId].deadline,
              bounties[_bountyId].fulfillmentAmount,
              bounties[_bountyId].paysTokens,
              uint(bounties[_bountyId].bountyStage),
              bounties[_bountyId].balance);
  }
```

*3-* Check if the bounty issuer equals the public key of the Ahken user.<br>
*4-* If so, retrieve the IPFS hash of the bounty data via `getBountyData(...)`, and pin this data to the local IPFS node.

## Script Publishing and Subscribing
Whilst pinning your data locally helps keep a permanent record of that data, to guarantee availability, your machine must always be running and connected to the internet.  It would be much more decentralized if we could easily enable other people to also pin your data.

Another planned feature of Ahken is to provide an option for users to publish their current configured script setup to IPFS, and to allow other third party users to choose to also run these scripts in their own local instances of Ahken, thus increasing the number of pinning nodes for this data.  For example, I may like to pin all the data that are associated with my friends or colleagues, influential people, or I may even want to pin all the data from a dApp that I use regularly, to show my support.

# Where's the Code??
Its very raw and bare bones right now (ie. its not fully working and ready to be run by end users yet!), but the code is open source (Apache 2.0 licensed) and available [here.](https://github.com/craigwilliams84/ahken)

# Let Me Know Your Thoughts!
Like I said previously, this project is in its very early stages so it would be great to hear some feedback around if you think it's a good or terrible idea (or if something similar already exists)!  Get in touch on twitter [@craig_williams1](https://twitter.com/craig_williams1), or post a comment here.
