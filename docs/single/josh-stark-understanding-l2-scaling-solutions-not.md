---
title: Josh Stark - Understanding L2 scaling solutions [notes]
summary: Josh Stark - L4, Counterfactual DEVCON 4 MainStage, October 31st 2018 Recording- Starts at 3 hours and 33 mins, https-//slideslive.com/38911427/devcon4-day-1 Goal of talk Leave you with a clear conceptual understanding of what Layer 2 means and why it matters. Fundamental limits of blockchains What is Layer 2 State Channels Plasma Context Blockchains are expensive and slow FB ~175,000 tps Visa 2,000 - 45,000 tps PayPal 200 tps Ethereum 20 tps Ethereum is made of many individual nodes which are s
authors:
  - Andreas Wallendahl (@andreaswallend1)
date: 2018-10-31
some_url: 
---

# Josh Stark - Understanding L2 scaling solutions [notes]


_Josh Stark - L4, Counterfactual_  
_DEVCON 4 MainStage, October 31st 2018_  
**_Recording:_** Starts at 3 hours and 33 mins, https://slideslive.com/38911427/devcon4-day-1

## Goal of talk
**Leave you with a clear conceptual understanding of what Layer 2 means and why it matters.**

1. Fundamental limits of blockchains
2. What is Layer 2
3. State Channels
4. Plasma

## Context
Blockchains are **expensive** and **slow**

FB ~175,000 tps  
Visa 2,000 - 45,000 tps  
PayPal 200 tps  
Ethereum 20 tps  

> Ethereum is made of many individual nodes which are separately processing everything that is happening on the blockchain and this is the fundamental limitation. Nodes don’t have to trust others as they process everything themselves

Simple ways to overcome are everyone processes more transactions say 2x, but it is more expensive to run a node and less can participate.  
Fewer nodes, less decentralized, less secure… 

## Two ways to scale
We want to break that trade-off and there are two ways  
1) Don’t have every node process every transaction
 - A nodes and B nodes can separately process transactions and double the processing power of the network
 - Base insight behind sharing or serenity, the L1 improvement pathway for Ethereum 2.0

2) Instead of changing layer 1, use it radically more effectively
 - hard kernel of certainty that will execute code as written
 - Do everything on top and leverage that base layer of security, retaining as many of those security properties as possible 

## Layer 2 solutions
**_Definition:_** Off chain techniques where a user does not have to trust a separate environment  

![](https://api.beta.kauri.io:443/ipfs/QmRAyKuDDWADM3zCSjVWcukZy2Xsxmq3FiSxSvjNHyoysK)

1. Build apps where most of the “work” is done off-chain
2. Only use layer 1 to build anchors that tie the off-chain environment to layer 1s security 
3. Preserve same risk model as Layer 1 (or preserve as much as possible)

All without changing layer 1 - it’s all just smart contracts and software that refer back to layer 1 when necessary  
Layer 2 is not: Just any technique that moves operations to an off-chain environment, in order to obtain performance enhancements (e.g. a naive side chain that does not anchor back in some way to preserve the risk model of Layer 1) 

> Apps can use ethereum even when they rarely interact with layer 1. Layer 1 is expensive and slow but is reliable and authoritative. The fact that they could retreat to Layer 1 at any time is enough.  

## State channels
**_Foundational layer 2 technique_**  
Messages over any communication protocol that have fields and signatures of a transaction   
Pay out based on last transaction, which has been signed by both parties   

IF one of them lies 
 - Rule 1 most recent update is true
 - Rule 2 punish someone who tries to lie

#### Benefits
 - Can pay each other instantly for free
 - Worst case submit on chain transaction to resolve
 - Privacy! Outside observer can only see unchain multi-sig but no information of what is happening off chain in the channel

#### State channel vs payment channel 
Same technique for payments can let us do arbitrary state updates rather than just the balance of payments, and can be used for anything e.g. games or complex financial contracts

1. Most of work done off chain: Txs exchanged in off-chain message
2. Only use L1 for anchor: Only on-chain piece is the multisig, which is used to create channels, withdraw, or dispute.  
3. Preserve L1 risk model: Users have rules they can rely on that are coded in the multi-sig to resolve disputes and can always submit txs to main-chain maintaining the security of L1

## Plasma 
**_Framework for building scalable applications on Ethereum_**
 - Side-chains are cool! But they are trusting that side chains security 
 - What if we had a side chain that was layer2-ified
 - If something goes wrong on the side chain can withdraw and maintain the security of L1

#### How it works
 - Root and side chain which can communicate back and forth  
 - Alice and Bob transact on the side chain  
 - Games or exchanges could live on side chains  
 - Plasma root needs to know what is happening on side chain - report the state to the root  
 - This is important for when people want to exit and move their assets on main chain  
 - Root checks the chain and waits for any challenges then lets Alice withdraw

1. Most of work done off chain: Everything happens on plasma chain not main chain
2. Only use L1 for anchor: On chain root ensures that users can always withdraw 
3. Preserve L1 risk model: If users follow protocol and layer 1 is available there are no additional risks

#### Three primary versions of plasma

 - Plasma MVP - UTXO for payments only, not smart contracts
 - Plasma Cash - NFTs which are traded but cannot use fractions
 - Plasma Debit - Like cash, assets are NFTs but assets are also payment channels between user and master-validator

![](https://api.beta.kauri.io:443/ipfs/QmXmDuqP5eBbewstQRuNGr72HxacYx7RShrZkUerwABBSi)
