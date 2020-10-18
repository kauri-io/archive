---
title: Reducing Mainnet Transactions with a Sidechain
summary: At Kauri, we think its important that article attribution is open and permanent on the immutable Ethereum blockchain, but we also believe that limiting the numb
authors:
  - Craig Williams (@craig)
date: 2019-12-13
some_url: 
---

# Reducing Mainnet Transactions with a Sidechain

![](https://ipfs.infura.io/ipfs/QmZe6PFEZx9y9LAMSYDeYkeGWH73Nt9ZP2bpG69u8YGrDP)


At Kauri, we think its important that article attribution is open and permanent on the immutable Ethereum blockchain, but we also believe that limiting the number of transactions that a user has to send when interacting with the platform is critical to a great user experience.  These two somewhat conflicting goals left us with a tricky dilemma; not requiring a transaction to be sent for every article that is published, but also providing a timestamped way to prove ownership on the Ethereum mainnet for every article.

## Why Care About Transactions?
Before explaining our approach we should first cover why we want to reduce the number of transactions in the first place. 

To send a transaction, a gas fee must be paid in ether, which adds friction into the system.  Users really aren't used to using a product where they have to pay actual money (albeit a small amount) per interaction, and this can make them feel uncomfortable.  They may not even currently own any cryptocurrency, and will have to go through the process of depositing fiat to an exchange in order to buy Ether before they can fully use your application.  Some people just won't bother, and turn away.

Also, there is the issue of fluctuating gas costs during network congestion.  There are times when the cost of sending a transaction is significantly higher than average, such as during the infamous [CryptoKitties](https://www.cryptokitties.co/) network spike towards the end of 2017.  If / when this happens again, users of your application will probably see their transactions stuck in the mempool for hours or days, which could cause confusion and a negative perception of your application if they don't fully understand what's going on behind the scenes.  Experienced users will end up having to pay exorbitant fees to interact with your DApp, or will simply refuse to use it until the average gas price lowers to an acceptable amount.

![](https://ipfs.infura.io/ipfs/QmWiL7u78CTbQWegkyRwZV9d7eFiJWTgK6CRWqtUtVQe6A)
_Peak Cryptokitties Network Congestion_

The Ethereum space is quite unique in the software development space because of the fact that backend architecture decisions can significantly affect the overall UX of the entire application.

> Fewer transactions == Less usage friction!

## What Options Did We Consider?

There were a number of approaches that we considered, when trying to come up with a solution that reasonably balances decentralization and UX.

### Completely Off-Chain Articles

We briefly flirted with the idea of storing article data completely off-chain.  As the content is stored in IPFS, we would need to store links between article id's and IPFS hashes in a centralized database.  However, this is obviously not very open, and to counterbalance this, we would be required to publish our centralized index publicly at certain intervals.  Besides the fact that article authorship cannot be verified on chain, this index publication brings up further issues: Where should the index be published?  How can a third party be sure that the data hasn't been censored or modified by us? The requirement of trust was way too large in this approach.

### Batching Article Transactions

A strategy that has been utilised successfully by [Peepeth](https://peepeth.com), batching is the process of combining data that would otherwise be sent in multiple transactions into a single transaction in order to save on gas costs.  This involves storing the article data in a centralized database for a period of time, until the user decides to commit the articles to the Ethereum network in a single transaction.  

Batching only provides significant cost savings if the base transaction cost (21,000 gas) is higher than the cost of 'storing each article'.  This is the case in Peepeth because 'peeps' are stored by emitting an event, rather than by storing anything in the EVM state.  Although this means that data is cheap to store, the flipside is that this data cannot be verified on-chain, as smart contracts do not have access to events.  Within the Kauri smart contracts, we want to be able to verify article id against IPFS content hash and author address on-chain (at a bare minimum), which would require 3 32 byte words of storage at 20,000 gas each.  If publishing 10 articles in a batch, the cost would be 621,000 in gas, vs 810,000 for sending individual transactions.  This is a around a 25% saving, which, whilst not a terrible saving, is not cheap enough for our use case.

### A Sidechain

A sidechain is a blockchain that runs in parallel with the main Ethereum blockchain (the mainchain), coupled with a mechanism that allows data (usually tokens) to be transferred from this sidechain to the mainchain and vice versa.  As fees for transactions sent to a sidechain are either free or extremely low depending on the implementation, articles can be published to a sidechain cost effectively.  The tricky part is ensuring that there is a system in place for 'transferring' these articles to the mainchain.  This is required because there are tasks that involve monetary value, such as tipping articles and claiming bounties, which we want to occur on the mainchain and so proof of article authorship must also be possible on the main Etheruem network.

#### Trusted Relayer

The most basic approach would be to build a trusted relayer service that sits in-between the mainchain and the sidechain.  The job of this relayer is to retrieve the article details from the sidechain, and then return a signed message back to the user, confirming these details.

##### Steps

1. Alice decides that she wants to move her sidechain article onto the mainchain.
1. The article id in question is passed to the trusted relayer service by Alice.
1. The trusted relayer obtains the details of the article in question from the sidechain.
1. The relayer signs the article details and returns this signature to Alice.
1. Alice now has proof of the article details and authorship, and can send this signature to a mainchain smart contract function in order to 'claim' the article on the mainchain.

With this trusted relay approach, the trusted relayer is of great importance for the entire duration of the lifecycle of a side-chain article.  As far as the mainnet smart contract is concerned, a user will not ‘own’ an article until the article has been relayed to the mainnet.  If the relay goes down, they will have no way to prove authorship of an article on the mainnet until it comes back up.  If the relay never comes back up (or we decide to turn off our servers and move to New Zealand!) then the ownership of the article can never be proven on-chain.  

A user that cares about decentralization and not losing the ownership of their article would therefore be inclined to send a relay transaction per article, securing their ownership on the main network.  We are then back to the one-transaction-per-article situation that we want to try and avoid.

We could rectify the single point of failure partially by allowing third parties to apply to be a trusted relayer, but this opens up a different can of worms (community governance, incentivization of running a relay and punishment of malicious relayer actions).

#### Plasma Cash

Plasma Cash is an implementation of Plasma geared towards Non-Fungible assets.  It allows these assets to be transferred between the mainchain and the sidechain and provides guarantees that a user can always 'exit' their assets from the sidechain regardless of the behaviour of the 'operator'.  Amongst other things, the operator is responsible for creating a Sparse Merkle Tree with each leaf containing details of Non-Fungible assets transferred in this period on the sidechain.  The hash of this tree must be published by the operator to the mainchain at specified intervals.  

I'm not going into specific details about how Plasma Cash works; for more information I recommend you check out [this](https://blog.ujomusic.com/a-plasma-cash-primer-27dcfd1d5ddc) excellent primer by Simon De La Rouviere, or watch Vitalik Buterin explain the concepts below:

<div align="center"><iframe width="560" height="315" src="https://www.youtube.com/embed/uyuA11PDDHE" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></div>

Although Plasma Cash sidechains have not been proven in the wild yet, they should provide an excellent scaling solution for implementations where there is a lot of monetary value at stake on the sidechain, such as in a decentralized exchange.  However, there are a few caveats which makes it tricky to implement and provide a reasonable user experience:

- **The Challenge Period**: A user has to wait for a fixed period of time before being able to complete a transfer from the sidechain to the mainchain.  This is called the challenge period and exists so that another user can block the transfer if they can prove that they are the rightful owner of the asset, not the intiating user.
- **Storing tx history**: In order to challenge false exits, a user must store the transaction history of the assets which they own.
- **Monitoring for exits**: Asset owners must also continuously monitor the mainchain plasma contract for any malicious exits for assets in which they are the rightful owner.

#### Somewhere In-Between...

We realised that most of the awkward implementation intricacies of the Plasma Cash specification were due to the fact that it is assumed that the ownership of entities can be transferred on the sidechain.  The challenge period predominantly exists so that a user cannot maliciously attempt to exit the sidechain with an entity that they used to own, but don't any longer.  In our use case, by enforcing that articles cannot be transferred in the sidechain smart contracts, then challenges and the challenge period are not needed.

## The Kauri Sidechain Design

Influenced by the Plasma specification, by utilising Merkle Trees to ‘checkpoint’ the sidechain-only articles to the main Ethereum network we can reduce both the reliance on a trusted relay for proof of ownership, along with the gas cost of these sidechain-to-mainnet article transfers.  As articles cannot be transferred on the sidechain, assuming the checkpointer is trusted, a user can prove that they have authored an article if they can provide a Merkle Proof that their article exists within a checkpoint root hash.

If you are unfamilar with the concept of Merkle Trees, its worth reading [this](https://media.consensys.net/ever-wonder-how-merkle-trees-work-c2f8b7100ed3) excellent primer by ConsenSys.

### The Checkpointer

Analogous to an operator in Plasma, the checkpointers job is to gather up all the sidechain articles that have not yet been committed to the mainchain and create a Merkle tree of these articles.  They must also publish a 'checkpoint document' to IPFS, which is essentially all the data required to reconstruct the Merkle tree, in order to create a Merkle proof.

![](https://ipfs.infura.io/ipfs/QmcxXuwa5jPdsQDZroZ2t3hvBE6cRXFPKMSFwbKbY5nZ1S)

### Article Lifecycle

#### Publication

1. An article is written by a user, Alice.
1. A transaction is sent to the sidechain with the details of this article (along with a signature of these details, signed by the creators private key)
1. This article is added to the sidechain state.

#### Moving an Article from Side-chain to Mainnet

1. At a later time, a user, Bob, decides that they want to move Alice’s article to mainnet, in order to tip the article. (Note: this could also be performed by Alice, or anyone!)
1. They make a call to the trusted checkpointer to initiate an escalation to mainnet.
1. The checkpointer establishes a list of ALL articles that do not yet exist within a Merkle Root on the main Ethereum network.
1. Details of these articles (id, owner, version, content hash) are included within a checkpoint document, and then pinned to IPFS (this is an important document so should be pinned in multiple places and backed up).
1. A binary Merkle Tree is then constructed by the checkpointer, with each leaf being a hash of:
`articleid:articleVersion:articleOwner:contentHash:timestamp`
1. The Merkle Root and checkpoint document are returned to Bob, along with a signature of these values, signed by the checkpointers trusted key.
1. Bob then sends a transaction to a Kauri smart contract on the Ethereum main network, with the details from the checkpointer.
1. The smart contract verifies that the signature has been signed by a trusted checkpointer, the Merkle Root is stored, and an ArticlesCheckpointed event is emitted containing the Merkle Root and IPFS hash of the checkpoint document.
1. The checkpointer listens for the ArticlesCheckpointed event, and sets the checkpoint IPFS hash on all sidechain articles included within the checkpoint (they are then considered 'checkpointed').

![](https://ipfs.infura.io/ipfs/QmeSS7priz6SfLW6Z93daCpVM8nQhZtaf6NUZdyZtgK51h)

#### Proving Article Authorship

1. Sometime afterwards, Alice wants to claim a request bounty for the article that she wrote in step 1.
1. In order to do, she must first obtain the checkpoint document containing the article in question.
1. The binary Merkle Tree is constructed from the articles within the checkpoint document, and the Merkle Root calculated.
1. She can then calculate the minimum number of values required to prove that her article was included in the Merkle Tree, the Merkle Proof.
1. This Merkle Proof should be provided to the function within the Kauri smart contract that allows the claiming of a bounty.
1. The smart contract confirms that the Merkle Proof hashes to a known Merkle Root in state.  If so, the contract can be certain (assuming the trusted checkpointer is not acting maliciously) that the article with the specified id exists, and is indeed owned by Alice.

_Note: Steps 2 - 4 will generally be performed by the Kauri middleware on behalf of the user for efficiency, but this is not a necessity, and could be done in the browser._

_Proving Authorship using Kauri Middleware to Generate Proof_
![](https://ipfs.infura.io/ipfs/QmX8xE4JyfjdkqL9vbsp9tQSVbA5KrRcxhFHhNKqGKthff)

### Automatic Checkpointing

This description assumes that it will always be a Kauri user that instigates the checkpointing, but it would be great if we could provide some guarantees on how long it will take for a written article to be relayed to the mainnet.  Therefore, we are planning on building a service that is scheduled to checkpoint every 24 hours, which will allow us to provide guarantees around article ownership after that time frame.  In theory, as network activity grows on the Kauri platform, this service will become less useful as checkpointing will occur naturally at more regular intervals.

### Benefits

- **Enabling proof of ownership for all non-checkpointed articles on the sidechain will only cost the price of storing a single bytes32 value and emitting an event, regardless of how many articles are to be checkpointed.**
- Although there still needs to be the concept of a trusted ‘relayer’, it does not play as vital a role in the proof of ownership of an article over time, as it is expected that a Merkle Root containing a published article will be sent to the mainnet within 24 hours.  
- We are less reliant on the sidechain and our middleware layer, because details about all articles that have been checkpointed to the mainnet can be obtained in a decentralized manner by iterating over the ArticlesCheckpointed smart contract events and obtaining the article data from the checkpoint documents in IPFS.

### The Importance of Checkpoint Documents

Having access to the checkpoint documents is vital in order to prove ownership of an article.  As mentioned earlier, this should therefore be pinned in multiple places, and the checkpointer should keep a backup, centralized copy in a database so that it can be re-added to IPFS if it somehow gets unpinned everywhere.  It would also be a good idea to provide a way for users to download all checkpoint documents for articles that they have written.  If they store these securely then article ownership can always be proven.  If even more decentralization is required, then a Kauri client could be created for running on a users desktop machine, which would constantly listen for ArticlesCheckpointed events, and store any checkpoint documents for articles that the user is interested in.

![](https://ipfs.infura.io/ipfs/QmVebkZqyx3DVhWGsgLAWwNPsuVSRp8YSedwv6CzX1cNRT)

### What Can Go Wrong?

#### Malicious Checkpointing

The checkpointer is inherently a trusted party in this system, which will initially be operated by Kauri.  What is stopping us from lying whilst checkpointing, and changing the article details so that they do not match the data within the sidechain?  On the flipside to this question, what is there to gain by Kauri acting in this way?  As all the data is open and transparent, this abuse can be easily proven off-chain.  Kauri has substantial skin-in-the-game; we are a known entity with reputation on the line (a similar argument is made for node operators in a POA network), and it is also in our best interests for this platform to succeed.  No one will want to use the Kauri platform or protocol if it is proven that we have been acting maliciously.  In a Plasma chain, users are guaranteed to be able to exit with their funds if an operator is a bad actor; no funds are at risk in the Kauri sidechain, but article writers will 'exit' by simply refusing to use the platform anymore.

That being said, for resilience and availability sake, in the future we would love to see third parties running checkpointer nodes, but this requires a tightly aligned incentive model and we aren't there yet.

#### Kauri Disbanding 

*In a worst case scenario, where we decide to turn all our servers off and quit, record of authorship on the mainnet will only be lost for articles written in the last 24 hours.*  There would also be the issue of an address under our control being set as the ‘trusted checkpointer’ within the smart contracts, which would mean that no further articles can be added to the mainnet.  If a user or group of users wanted to continue the Kauri efforts, they could deploy a new version of the smart contract (which will be open sourced) and change the ‘trusted checkpointer’ address, then manage multiple contracts in their frontend and middleware (also open sourced).  This pattern is already used by some DAPPS for upgrades (Ether/Fork Delta for example).  Also, it should be noted that we never intend for this scenario to happen, but its worth mentioning.

## Summary

To summarise, by enforcing that articles on the Kauri sidechain cannot be transferred, exiting from the sidechain to the mainchain is made much simpler, with a better user experience compared to Plasma Cash.  We do not require a challenge period, and there is no concept of a transaction history for the articles, meaning that custom client software is not needed in order to track these transactions.  By introducing a trusted checkpointer who’s job is to create Merkle trees from non-checkpointed articles which can then be committed to the mainchain (by a third party with signature verification), article authorship can be proven on the mainchain by providing a Merkle proof.  

One further benefit of this approach is that when a checkpointing is instigated by a user, all non-checkpointed articles will be committed to the mainchain, not just articles for the instigating user.  This does not cost any extra gas, as only a single bytes32 value (the Merkle root) regardless of how many articles are included within the checkpoint.

The checkpointer actor does introduce a layer of trust.  The checkpointer(s) should be known parties with skin-in-the-game, so that it is in their best interests to function fairly and correctly.  All data is transparent and open, so any misbehaviour can be easily proven off-chain, and as there is no monetary value held in the sidechain, the main thing that will be lost is trust in the Kauri platform and protocol.

## Thanks

Thanks to the entire Kauri team, for helping with the design and suggesting edits to this article.  A special shoutout to Gregoire "Diagram Master" Jeanmart for producing the images in the article.


---

- **Kauri original link:** https://kauri.io/reducing-mainnet-transactions-with-a-sidechain/a66d50655f8746edb7df90de4b8eb416/a
- **Kauri original author:** Craig Williams (@craig)
- **Kauri original Publication date:** 2019-12-13
- **Kauri original tags:** scaling, dapp, kauri, sidechain
- **Kauri original hash:** QmdTJXDrQnFK4sSd4yHrKEbeuoShwgw2LnExttiw7TsPPs
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



