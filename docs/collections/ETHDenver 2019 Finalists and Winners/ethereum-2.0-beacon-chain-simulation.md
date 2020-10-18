---
title: Ethereum 2.0 Beacon Chain Simulation
summary: Project Name Beacon Thugs n Harmony Project Tagline/Description Ethereum 2.0 Beacon Chain Simulation. Team Members. First and Last Names Richard Ma, Nathan Frenette, Poming Lee, Derek Alia Status.im ID for Each Team Member https-//get.status.im/user/0x04eb427697caf4cf2334aa814657801b1f138f908f180cc4f60a7e87d5fd45fc0963416a91aa943cd8edfd232c866b0bd0eaab1a9c6168ee781f8bf79c85a821c9 Detailed Project Description Implements a simulation for the sharded pos ethereum 2.0. The Eth 2.0 Spec is very diffi
authors:
  - Richard Ma (@rtmqsp)
date: 2019-02-17
some_url: 
---

# Ethereum 2.0 Beacon Chain Simulation

![](https://ipfs.infura.io/ipfs/QmU12FsHAKYo8qVVKwqsw4KGtaqrwQccNfRUVQhSZXjM4m)


## Project Name
Beacon Thugs n Harmony

## Project Tagline/Description
Ethereum 2.0 Beacon Chain Simulation. 

## Team Members. First and Last Names
Richard Ma, Nathan Frenette, Poming Lee, Derek Alia

## Status.im ID for Each Team Member
https://get.status.im/user/0x04eb427697caf4cf2334aa814657801b1f138f908f180cc4f60a7e87d5fd45fc0963416a91aa943cd8edfd232c866b0bd0eaab1a9c6168ee781f8bf79c85a821c9

## Detailed Project Description
Implements a simulation for the sharded pos ethereum 2.0.

The Eth 2.0 Spec is very difficult to understand and we thought making it easier to visualize is one of the most impactful things we could do to drive scalability development forward for the community, and make it easier for people to use Dapps

The challenging research task involved pulling together incomplete outlines and disparate sources, including ethresear.ch, presentations from Justin Drake, as well as papers from Vitalik.

The React web app at www.beacon-chain.com created using the simulator allows a developer to step forwards and backwards through 2.0 ETH Beacon Chain randomness generation, and see how it feeds into the shard validator selection at each epoch.

<img src="https://i.imgur.com/WL1MwSS.png" alt="Beacon Chain Web App Image">

## Describe your tech stack (e.g., protocols, languages, API’s, etc.)
Python,  Apache Server, Javascript, React, pycrypto, RSA library

## Track for which you’re submitting (Open or Impact)
Open

## Bounties
This is a pure ETH 2.0 research project, so it didn't fit the project bounties

## A link to all your source code on a public repo (i.e. Github)
https://github.com/beacon-thugs-harmony/beacon_chain_simulator

https://github.com/beacon-thugs-harmony/beacon_thugs_frontend

Web Application:
http://www.beacon-chain.com/

## Important note
We found a potential attack vector to the beacon chain while we were building the simulation 
- a malicious actor can DDoS the validator during their RANDAO slot, between the hash submission and the reveal - and cause them to lose money via the penalty.
This shows the value of having a simulation






---

- **Kauri original link:** https://kauri.io/ethereum-2.0-beacon-chain-simulation/135a5720b9d44104bfbc44a5f69f9f20/a
- **Kauri original author:** Richard Ma (@rtmqsp)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission, bounty-ideasbynature-2019, sponsor-bounty, bounty-mainframe-2019
- **Kauri original hash:** QmSjrD73sTSFWyLovKcZqVbJq4gBCCQHq6LAqQn2kjJBfL
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



