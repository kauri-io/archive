---
title: Ethereum 101 - Part 3 - Consensus Protocols
summary: Quick Overview The engine that drives consensus among the nodes on the Ethereum network. Ethereum is currently operating on a Proof-of-Work consensus protocol, but in the future will be shifting to a Proof-of-Stake protocol. Current Protocol  Proof of Work (Ethash) The current Ethereum blockchain uses a consensus algorithm built specifically for the Ethereum blockchain called Ethash. The Ethash PoW algorithm introduces the property of “Memory Hardness” to the Ethereum blockchain. Memory hardness
authors:
  - Wil Barnes (@wil)
date: 2019-02-13
some_url: 
---

# Quick Overview
 
The engine that drives consensus among the nodes on the Ethereum network. Ethereum is currently operating on a Proof-of-Work consensus protocol, but in the future will be shifting to a Proof-of-Stake protocol. 

# Current Protocol: Proof of Work (Ethash)

The current Ethereum blockchain uses a consensus algorithm built specifically for the Ethereum blockchain called Ethash. The Ethash PoW algorithm introduces the property of “Memory Hardness” to the Ethereum blockchain. 

Memory hardness dictates that your computational performance is limited by how fast your machine can move data around in memory, as opposed to how rapidly it can perform computations. By doing this, the Ethereum blockchain aims to prevent large organizations and large mining pools from obtaining undue influence over the network. Reference documentation: 
- https://github.com/ethereum/wiki/wiki/Ethash

# Target Protocol: Proof of Stake (called Casper or rolled up into the greater Ethereum 2.0)

In a Proof-of-Stake consensus algorithm, users who desire to validate blocks are required to deposit a stake of their own ether (right now, that stake is estimated to be 32 ether). That stake is locked, and a consensus algorithm is then used that only these staked users can participate in. 

> Proof of Stake (PoS) is a category of consensus algorithms for public blockchains that depend on a validator's economic stake in the network.

Citation: https://github.com/ethereum/wiki/wiki/Proof-of-Stake-FAQs#what-is-proof-of-stake

There are two types of Proof-of-Stake algorithms, a chain-based proof and a Byzantine Fault Tolerance-style proof:

- A chain-based Proof-of-Stake staked users are selected pseudo-randomly during a set time block, that user is given the right to create a single block, and that block that is created must be pointed to a previous block. 
- A Byzantine Fault Tolerance-style (BFT-style) proof randomly assigns users the right to propose blocks. However, obtaining agreement on the canonical block takes place through a multiple round process where each validator party to the network places a vote for a specific block during that round, and in the final round, the validators will have arrived at a permanent block to add to the chain. 

The Ethereum roadmap includes a transition to Proof of Stake at an indefinite time in the future. The Ethereum Proof of Stake FAQ is a good reference point for more in-depth discussion: 
- https://github.com/ethereum/wiki/wiki/Proof-of-Stake-FAQs
