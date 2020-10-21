---
title: Top 5 ways to scale your Ethereum blockchain application (dApp)
summary: General article outlining the relative trade-offs of existing solutions for scaling solutions on the Ethereum. If you would like to contribute tutorials or how tos for scalability solutions please reach out @kauri_io or @AndreasWallend1 and we will feature your project in kauris scalability collection! Scalability solutions are here now! This article explores some of the solutions that can be implemented today and the relative trade-offs of different approaches, as well as highlighting developer
authors:
  - Andreas Wallendahl (@andreaswallend1)
date: 2019-04-23
some_url: 
---

# Top 5 ways to scale your Ethereum blockchain application (dApp)

![](https://ipfs.infura.io/ipfs/QmX77iTZW68cU9Eozxhmc55eTTpPnUsjUyjJExP2wfvCGv)


***General article outlining the relative trade-offs of existing solutions for scaling solutions on the Ethereum. If you would like to contribute tutorials or how to's for scalability solutions please reach out [@kauri_io](https://twitter.com/kauri_io) or [@AndreasWallend1](https://twitter.com/andreaswallend1) and we will feature your project in kauri's scalability collection!***

Scalability solutions are here now! This article explores some of the solutions that can be implemented today and the relative trade-offs of different approaches, as well as highlighting developer resources so you can start BUIDLing.

### CONTEXT: Scalability issues

> Why is scalability so hard? I often talk about the ‘scalability trilemma’, where I say that blockchain systems have to trade off between different properties. And it’s very hard for them to have three things at the same time, where one of them is decentralization. The other is scalability, and the third is security.                     -- _**Vitalik Buterin, November 2017**_

Public permissionless blockchains like Bitcoin and Ethereum have opted to optimize security and decentralization over high transaction throughput at layer 1. Anyone willing to become a validator can participate and being a validator requires a reasonably low time and capital commitment. Thousands of mining nodes participating in Proof of Work secure these blockchains from 51% attacks  which [cost](https://www.crypto51.app/) ~$100,000 /hr on Ethereum blockchain and >$350,000 /hr on Bitcoin blockchain at today's, _April, 2019_, prices. 

The truly permissionless decentralized nature and high security of Ethereum are two features of many that make it the top choice for a trust layer for the global economy and securing blockchain applications that facilitate those transactions.

However, security and decentralization come at the expense of scalability. Today Ethereum is processing ~5 transaction per second and would be overloaded at ~6 transaction per second, with a  theoretical limit of 14-15 transactions per second for simple transactions. This is [orders of magnitude too small](https://cointelegraph.com/news/cryptocurrency-still-a-long-journey-ahead) for any mainstream existing consumer or financial applications. 

> The core limitation is that public blockchains like ethereum require every transaction to be processed by every single node in the network.                     -- _**Josh Stark, February 2018 [Making Sense of Ethereum’s Layer 2 scaling solutions] (https://medium.com/l4-media/making-sense-of-ethereums-layer-2-scaling-solutions-state-channels-plasma-and-truebit-22cb40dcc2f4)**_

The Ethereum Foundation has an advanced roadmap to upgrade the base infrastructure of the Ethereum blockchain in Ethereum 2.0, and [will greatly improve scalability in the coming years](https://media.consensys.net/state-of-ethereum-protocol-1-d3211dd0f6). However, we're building applications now and need to scale now! In addition, as I will discuss later, depending on your use case it is likely you will not want all transactions running on mainnet / L1 but opt for second layer solutions even once Serenity has arrived.

#### Primary challenges today
 - **Slow** - low transaction throughput and and network latency dependent in the case of full blocks
 - **Expensive** - user must pay gas fees on each transaction, spikes in gas and ethereum prices
 - **Suboptimal User Experience** - user must sign each transaction and wait for it to confirm before the next can be executed

### SUMMARY of scalability solutions

Summary of scalability solutions that can be implemented today to scale transaction throughput. There are other solutions to scalability which include off-chain compute and other scaling vectors, which can also be considered, but will not be directly covered here. 

 - **Off-chain message signing (Meta transactions)** - sign messages off-chain using ethereum key pairs, store and emit events or pass them p2p to then update an onchain state based on the content and signatures on those messages (e.g. increase # votes, update price oracle)
 - **Payment channels** - off-chain channel between counter-parties to exchange value and transact the resulting net in one on-chain transaction
 - **State channels** - off-chain channel between counter-parties to update states multiple times and update the final state with one on-chain transaction
 - **Side chains x bridges** - fully featured side chain anchored to the Ethereum mainnet via bridge contracts and a relay mechanism
 - **Plasma chains** - fully featured child chains that periodically commit the differential of their state tree to the root chain (e.g. Ethereum mainnet)

### Trade-offs of scalability solutions

![](https://ipfs.infura.io/ipfs/QmWesgCWeUdKkMLdqWukkf1zn1jEbz51XGvingwMxuvn1x)

## Description and implementation of scalability solutions

The following are implementations are OpenSource and available to build into your application, though _**all scaling solutions are still under development and a security audit is highly recommended before deploying anything to mainnet**_. Projects that are yet to release a useable product or code repos have not been included. 

### Message signing
- User signs a message off chain with their public private key pair (using keccak256 hashing algorithm)
- Messages can be stored in IPFS or a DB and then be batched into one on chain transaction 
- e.g. claiming ownership on mainnet for your peeps in a batch rather than executing a transaction each peep
- The messages can also be passed p2p via scuttlebot and once verified (via public key) that they are from the valid or authorized party, can be taken as an oracle input to a mainnet smart contract
- That smart contract then takes the message and can execute as it has been written to do so
- MakerDAO proposed a solution for off-chain price oracles using this methodology at ETH Berlin

#### Resources:

- Karl Floersch - Hashing and message signing basics https://cryptoeconomics.study/
- Mario Conti - Price oracles via offchain signed messages https://view.ly/v/Rt275OYzLCI1
- Vitalik Buterin - Oracles https://blog.ethereum.org/2014/07/22/ethereum-and-oracles/

### Payment and State channels
#### State channels have three primary steps:
- Two users lock the initial blockchain state (e.g., each party's balance) into a smart contract closely resembling a multi-signature wallet. This ensures that the funds in the wallet can't be used elsewhere or removed until unlocked with an update that both parties have signed.
- The two parties transact by passing state updates (e.g., balance updates) amongst themselves. If both parties agree on a state update by "signing" it, it could be submitted to the smart contract at any time to unlock funds.
- When parties have finished transacting, they each submit state updates to the smart contract. If the state updates match, the blockchain state (e.g., each party's balance) is unlocked, typically in a different configuration than the initial state.

#### Payment channels:
- Constrained state channel solutions limited to payments denominated in ETH or ERC20. Simplified structure allows for greater throughput and and more efficient design as only one (or few) states are being updated: the net balance

#### Dispute resolution:
- Each state update that is signed by both parties is assigned a "nonce", or a number that uniquely identifies that update. More recent nonces trump older nonces.
- As soon as Party A submits a state update, a challenge period starts. During this period, Party B has the opportunity to submit an update with a more recent nonce. When the challenge timer expires, the update with the most recent nonce is used to unlock the blockchain state and distribute funds appropriately.

#### Existing projects and implementations

**Raiden** a payment channel solution, enabling near-instant, low-fee and scalable payments. It’s complementary to the Ethereum blockchain and works with any ERC20 compatible token [Getting started](https://kauri.io/article/e875bf0e94444f86b3dcdebc730f6c7f/v1/raiden:-generalized-state-channels)

**Connext** is building open source, p2p micropayment infrastructure. Their first product uses payment channels on the Ethereum blockchain. Payment channels allow many off-chain transactions to be aggregated into a much smaller number of on-chain transactions [Getting started](https://kauri.io/article/ea598e8c666c413e8df0a6dd106a1c28/v1/connext:-peer-to-peer-payment-channels)

### Side chains x bridges
Bridge (or relay) relays information from side chain running its own consensus algorithm to mainnet. Either lock value or state on mainnet (or both) and run Dapp on sidechain gathering and processing transactions
- User deposits Ether/ERC20 from the mainnet to bridge contract
- ÐApp runs for as long as required, then user withdraws their Ether/ERC20 back on the mainnet
- Users pay only the gas for two transactions – the deposit and the withdrawal
- User may also pay smaller transaction fees on side chain (Loom and POA  both have running costs - Loom charges the Dapp in loom tokens, POA requires users to pay gas in POA tokens on the side chain) 
- Dapp can also operate a private chain and remove gas costs on side chain - however incentivizing many independent validators may be a challenge

####Resources
- See video: Parity Bridge Ropsten-Kovan Ether-ERC20 Test Deployment 
- Melonport and Colony are already working on implementing and testing Parity Bridge, with Swarm.City and Giveth helping test arbitrary message passing
- https://wiki.parity.io/Bridge; https://github.com/poanetwork/poa-bridge-contracts

####Existing projects and implementations

**POA Network** is an Ethereum-based platform that offers an open-source framework for smart contracts. POA Network is a sidechain to Ethereum utilizing Proof of Authority as its consensus mechanism [Getting started](https://kauri.io/article/549b50d2318741dbba209110bb9e350e/v12/poa-part-1-develop-and-deploy-a-smart-contract)

**Loom** is a Layer 2 scaling solution for Ethereum focusing on social and gaming dApps that require a very high throughput. Loom SDK enables to generate a sidechain called dAppChain using a dPoS consensus optimised for high-scalability [Getting started] (https://kauri.io/article/6f807cc4fe01479b8b14bd5625b68191/v5/loom-part-1-develop-and-deploy-a-smart-contract)

**SKALE**'s elastic sidechains provide all benefits of standard full-capacity sidechains alongside the security guarantees of truly decentralized networks. Elastic sidechains are highly performant, configurable, and Ethereum / Web3 Compatible [Getting started] (https://kauri.io/article/1695fa6d727347e58af02ba7c36a0581/v1/skale:-ethereum-compatible-sidechains)

### Plasma chains

![](https://ipfs.infura.io/ipfs/QmQWgWLpbFW1uHVoV1UXjk8VDZyfrMVXCviowoFv5872tb)

#### Overview
- Initialize the Plasma blockchain. Write the contracts, submit it to the root blockchain
- Localized computation. Only periodic commitments (Plasma blockchain blockhashes) submitted to the blockchain
- Consensus rules defined in fraud proofs. If any of the blocks are invalid, anyone can submit proof of fraudulent state transition to roll back blockchain
- Unique rules per Plasma blockchain. Chains are special-purpose decentralized applications.

####Existing projects and implementations
**Summary of development:** Including FourthStateLabs, OmiseGo, Kyokan, Plasma Group. [Summary] (https://kauri.io/article/3103de2a3a874f348013b96d157451be/v7/plasma-roundup:-from-mvp-to-mainnet)

**Kyokan Minimum Viable Plasma** implementation of minimal viable plasma (MVP) focused purely on payment use cases so that app developers can experience plasma today [Getting Started] (https://kauri.io/article/7f9e1c04f3964016806becc33003bdf3/v4/minimum-viable-plasma-the-kyokan-implementation)

**Plasma Group** is dedicated to the creation of an open plasma implementation for the greater Ethereum community. It’s our mission to push layer 2 scaling forward by exploring the full potential of the plasma framework. [Learn More] (https://kauri.io/public-profile/4c1f7c394b9fdbe23dcbe64e7b537b5354c71b24)












---

- **Kauri original title:** Top 5 ways to scale your Ethereum blockchain application (dApp)
- **Kauri original link:** https://kauri.io/top-5-ways-to-scale-your-ethereum-blockchain-appli/7ccaaa2fe7f344d5bf53807cb5c01530/a
- **Kauri original author:** Andreas Wallendahl (@andreaswallend1)
- **Kauri original Publication date:** 2019-04-23
- **Kauri original tags:** scaling, dapp, payment-channels, meta-transactions, state-channels, plasma, sidechain
- **Kauri original hash:** QmXvT3gP4bEUtJmTzp6tpGRx7FR2BrAXkNWQATQyYFWn5C
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



