---
title: ETH/ZIL/BTC Atomic Swaps
summary: Project Name ETH/ZIL/BTC Atomic Swaps Project Tagline/Description (140 Characters Max. Will be used on table card for judging) Peer-to-peer exchange of ETH, ZIL, and BTC on their native chains, utilizing hashed timelock contracts. No wrapping required! Team Members. First and Last Names Matthew Black Tony Cai Status.im ID for Each Team Member (we will use this to contact you and your team) Tricky Familiar Widowspider 0x04eac6ad3adfde5f86308bd3269e989ddbe14536f2e106d0dde2fa6cd7a51c64e0c7cad45e8b6
authors:
  - Tony Cai (@runrafter)
date: 2019-02-17
some_url: 
---

# ETH/ZIL/BTC Atomic Swaps


## Project Name
ETH/ZIL/BTC Atomic Swaps

## Project Tagline/Description (140 Characters Max. Will be used on table card for judging)
Peer-to-peer exchange of ETH, ZIL, and BTC on their native chains, utilizing hashed timelock contracts. No wrapping required!

## Team Members. First and Last Names
- Matthew Black
- Tony Cai

## Status.im ID for Each Team Member (we will use this to contact you and your team)
- Tricky Familiar Widowspider
0x04eac6ad3adfde5f86308bd3269e989ddbe14536f2e106d0dde2fa6cd7a51c64e0c7cad45e8b60fec70aa41a52dfacfd31618dd9ec49dada95eb4811839e151042
- Deepskyblue Crazy Harrierhawk
0x0474c02b0eb1bfd388c62b4a63c652b2b52202fb290a7f924d9f45b1702fff8a79e2f238f885e2e1fd56ccb491387af27cf5c4e63519be0f3c63b5114ab575bfb7

## Detailed Project Description (no more than 3-4 sentences)
The ETH/ZIL/BTC Atomic Swaps project enables trustless swapping of ZIL, ETH, and BTC (using BIP 199 for BTC, ERC 1630 for ETH, and the first ZIL Hashed Timelock Contract (HTLC) written in Scilla (https://github.com/mattBlackDesign/chainabstractionlayer/blob/master/src/providers/zilliqa/ZilliqaSwapProvider.js#L5)). We did this by forking the Chain Abstraction Layer, and adding Zilliqa as an asset, enabling the trustless swapping of any of the three pairs (ETH-ZIL, BTC-ZIL, BTC-ETH). We use the typical HTLC method of locking funds using a secret hash, where the counterparty is able to claim once they receive the secret. We ran into a limitation of not being able to use timestamps for the timelocks in Scilla, and resorted to using blocktimes instead, but once https://github.com/Zilliqa/scilla/issues/311 is implemented, this can be done with timestamps. 

## Describe your tech stack (e.g., protocols, languages, API’s, etc.)
- Atomic swap technology
- Javascript
- EVM Opcodes
- BTC Opcodes
- Scilla (ZIL smart contract language)
- Chain Abstraction Layer (https://github.com/liquality/chainabstractionlayer)

## Track for which you’re submitting (Open or Impact)
Open

## All Bounties Completed/Incorporated
- Zilliqa Bounty 1: Cross-chain atomic swap between Zilliqa and Ethereum blockchains
- Zerion Bounty 1: The best financial product for DeFi

## A link to all your source code on a public repo (i.e. Github)

https://github.com/mattBlackDesign/chainabstractionlayer
https://github.com/mattBlackDesign/chainabstractionlayer/tree/master/src/providers/zilliqa




---

- **Kauri original title:** ETH/ZIL/BTC Atomic Swaps
- **Kauri original link:** https://kauri.io/ethzilbtc-atomic-swaps/7c3b7e1a4d78437d923a666f50f4c7e2/a
- **Kauri original author:** Tony Cai (@runrafter)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission, bounty-zilliqa-2019, bounty-zerion-2019
- **Kauri original hash:** QmaJZWUQC7myq29Mq6CgWaTMZJWYHe6cAEtnNeUdRUJu61
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



