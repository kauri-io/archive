---
title: Piñata Overlay
summary: Pinata Overlay is a system consisting of a smart contract and IPFS oracles that allows for decentralized funding of IPFS storage. The smart contract overlay allows dApp companies to have access to and utilize decentralized IPFS nodes without the need to build and host their own IPFS infrastructure. Pinata Overlay is built using Solidity for the funding smart contracts along with an IPFS oracle that watches smart contracts that desire storage. - Mitch Kosowski (ETHPrize) https-//devpost.com/softw
authors:
  - Kauri Team (@kauri)
date: 2018-09-20
some_url: 
---

Pinata Overlay is a system consisting of a smart contract and IPFS oracles that allows for decentralized funding of IPFS storage. The smart contract overlay allows dApp companies to have access to and utilize decentralized IPFS nodes without the need to build and host their own IPFS infrastructure. Pinata Overlay is built using Solidity for the funding smart contracts along with an IPFS oracle that watches smart contracts that desire storage. - Mitch Kosowski (ETHPrize)

https://devpost.com/software/project-overlay

![](https://api.beta.kauri.io:443/ipfs/Qmc9BHYv9H93nEUkJLVH3kPh8xfjU4XHCMLbwfyWhLAp9W)

### Inspiration
DApp companies hate the current state of IPFS infrastructure. These companies are unhappy with the centralization associated with hosting their own IPFS node and are forced to waste dev resources building and managing their own nodes. These IPFS obstacles prevent dApps from being truly decentralized applications and prevent the dApp companies from being able to focus on solveing their customer's problems. At #ETHBerlin, we talked with people from Gitcoin, Gnosis, Kauri, ConsenSys and Colony who formed and strengthened these assumptions.

### What it does
Pinata Overlay is a system consisting of a smart contract and IPFS oracles that allows for decentralized funding of IPFS storage. Our smart contract overlay allows dApp companies to have access and utilize decentralized IPFS nodes without the need to build and host their own IPFS infrastructure. This solution provides the necessary IPFS infrastructure that dApp companies desire, decentralizes IPFS hosting through a smart contract, and allows them to focus on solving their customer's problems.

### How We built it
We built Pinata Overlay using solidity for the funding smart contracts and developed an IPFS oracle that watches smart contracts that desire storage.

### More Technical Details
Pinata Overlay consists of two main features:

- A smart contract where anybody in the ecosystem can register a smart contract, and pay for all of its IPFS hashes to be stored by a decentralized network of hosting providers.
- A decentralized network of hosting providers running Pinata Overlay's open source node software. These providers are constantly watching the Pinata Overlay smart contract for registrations. When a provider is registered and funded to pin a specific smart contract, it automatically pulls a configuration file that was created for the funded contract via IPFS, and proceeds to pin all tagged IPFS content for the funded contract.

### Accomplishments that we are proud of

- We're very proud of the ability for users to automatically upload their smart contract's ABI and select which event values contain IPFS values. This makes registering a smart-contract a breeze for developers and provide visual confirmation that you have the correct settings.
- We are proud of Pinata Overlay's ability to decentralize IPFS hosting as it has been a dirty little secret in the ecosystem that this was a massive liability in terms of time, cost, and centralization.
- We are proud that our entire project is hosted on IPFS at: https://ipfs.io/ipfs/QmaCNPYvsEWZnxdJKgnGvs6BxrWFtPFhiFJWVdDfqRc4at/

**NOTE - THE ADDRESS ABOVE IS UPLOADED TO THE KOVAN TESTNET
**

### What's next for Pinata Overlay
We will continue building out Pinata Overlay for #ETHSanFransisco where we intend to launch and provide the service to dApp companies.

### Built With

- solidity
- ipfs
- react
- node.js
- truffle
- web3

### Try it out
[ipfs.io](https://ipfs.io/ipfs/QmaCNPYvsEWZnxdJKgnGvs6BxrWFtPFhiFJWVdDfqRc4at/)

[Smart Contracts Repo](https://github.com/obo20/ETHBerlin-Pinata-SmartContracts)

[Oracle Node Repo](https://github.com/obo20/ETHBerlin-Pinata-Oracle-Node)

[Frontend Demo Repo](https://github.com/obo20/ETHBerlin-Front-End-Demo)
