---
title: Ethereum 101 - Part 1 - What is Ethereum?
summary: Purpose of Document The purpose of this documentation is to serve as a springboard for anyone looking to gain utility from the Ethereum network. What is Ethereum? Ethereum can be explained many different ways. Ethereum also means different things to different people, and by the end of this document it will also mean something to you. To be prudent and concise, I want to cite an author, Andreas M. Antonopoulos, that I feel does a great job summarizing what Ethereum is from both a computer science
authors:
  - Wil Barnes (@wil)
date: 2019-02-13
some_url: 
---

# Ethereum 101 - Part 1 - What is Ethereum?

# Purpose of Document
The purpose of this documentation is to serve as a springboard for anyone looking to gain utility from the Ethereum network. 


# What is Ethereum? 
Ethereum can be explained many different ways. Ethereum also means different things to different people, and by the end of this document it will also mean something to you. To be prudent and concise, I want to cite an author, Andreas M. Antonopoulos, that I feel does a great job summarizing what Ethereum is from both a computer science perspective and a practical perspective. 

From the book "[Mastering Ethereum](https://github.com/ethereumbook/ethereumbook)" by authors Andreas Antonopoulos and Gavin Wood Ph.D. 

> Ethereum is often described as "the world computer.” But what does that mean? Let’s start with a computer science–focused description, and then try to decipher that with a more practical analysis of Ethereum’s capabilities and characteristics, while comparing it to Bitcoin and other decentralized information exchange platforms (or "blockchains" for short). <br /><br />From a computer science perspective, Ethereum is a deterministic but practically unbounded state machine, consisting of a globally accessible singleton state and a virtual machine that applies changes to that state. <br /><br />From a more practical perspective, Ethereum is an open source, globally decentralized computing infrastructure that executes programs called smart contracts. It uses a blockchain to synchronize and store the system’s state changes, along with a cryptocurrency called ether to meter and constrain execution resource costs. <br /><br />The Ethereum platform enables developers to build powerful decentralized applications with built-in economic functions. While providing high availability, auditability, transparency, and neutrality, it also reduces or eliminates censorship and reduces certain counterparty risks.

Citation: "[Mastering Ethereum, Section 1 - What is Ethereum?](https://github.com/ethereumbook/ethereumbook/blob/develop/01what-is.asciidoc)" authors Andreas Antonopoulos and Gavin Wood Ph.D. 


### Ethereum as a "World Computer"

Antonopoulus' primer explanation of Ethereum above includes some interesting terms: world computer, blockchains, deterministic, state, state machine, decentralized computing infrastructure, smart contracts, decentralized apps, and others. 

We'll explore these terms, but before we do let's look at the last sentence of his last paragraph: 

> While providing high availability, auditability, transparency, and neutrality, it also reduces or eliminates censorship and reduces certain counterpary risk. 

This is noteworthy. Keep this in mind as we work through this document together. 

Let's look at some of those terms we say earlier and, just as a thought exercise, let's loosely match definitions to them: 
* World Computer -- a computer available to all, with no geographic restrictions
* Blockchains -- chained blocks of data, Ethereum is a blockchain 
* Deterministic -- no matter which node runs the program, the resulting computation will be the same
* State -- the remembered information of a program or system
* State machine -- mechanism that changes the aforementioned state, while maintaining consensus
* Decentralized computer infrastructure -- decentralized infrastructure where each node supporting the network is equally privileged and equipotent
* Smart contracts -- code that can be expected to execute in a decentralized computing infrastructure
* Decentralized apps -- applications that touch decentralized computing infrastucture or utilize smart contracts, or both

Individuals, projects, and businesses generally prefer to build on firm, stable systems that can be relied upon to act as expected. This is what Ethereum affords to its developers. 

Ethereum is fault tolerant, meaning that nodes can drop offline with negligible impact to the security and throughput of transactions on the network. Nodes synchronize to the current state upon coming back online. 

Ethereum allows developers to write and deploy immutable programs to the blockchain. When deployed, these programs can be trusted to execute without interference from external non-blockchain events. These programs are colloquially known as "smart contracts."

# Ethereum's Native Currency and Beyond 

To be concise, let's look at tried and true definitions:


> Because Ethereum strives not primarily at the currency application, but at all applications, there is a fundamental network cost unit used to mitigate the possibility of abusing the network with excessive computational expenditures. This is called gas
, ...""

Author: Micah Dameron, ["Beigepaper: An Ethereum Technical Specification"](https://github.com/chronaeon/beigepaper/blob/master/beigepaper.pdf) Section 1.1 Native Currency

To use the Ethereum network, to send value from account to account, or to deploy a smart contract to the blockchain, we pay a gas fee to the miners that secure the network. 

To pay this gas fee, we use Ether, the native currency of the Ethereum blockchain. We're starting to segue into a more technical discussion on units of value, so to summarize the table below highlights the denominations. 


| Unit | Ether | Wei |
| -------- | -------- | -------- |
| Ether     | Ξ1.00000000000000000     | 1,000,000,000,000,000,000     |
| Finney     | Ξ0.001000000000000000     | 1,000,000,000,000,000     |
| Ether     | Ξ0.000001000000000000     | 1,000,000,000,000     |
| Ether     | Ξ0.000000000000000001     | 1     |

Credit: 
["Beigepaper: An Ethereum Technical Specification"](https://github.com/chronaeon/beigepaper/blob/master/beigepaper.pdf)

# Decentralized Apps (DApps)

In the most narrow definition, a decentralized application is a smart contract with a frontend. In the context of this documentation, a decentralized application is one which distributes its logic, data storage, or messaging using the Ethereum protocol, or any neighboring web3 protocol. 

* The term "web3" is a colloquial term for a decentralized web. 
* The term "web2" is a colloquial term for the internet's current state of affairs. 

# Reasons for using a DApp

A sample of decentralized apps that have surfaced over the past several years includes, but is not limited to: 

* decentralized exchanges,
* prediction markets,
* decentralized knowledge bases (like Kauri),
* open source identity systems,
* casinos, 
* games, 
* and a litany of other use cases. This is not exhaustive. 

A quick internet search will return a long list of ongoing, more theoretical work-in-progress decentralized applications, many of which are working to solve real-world problems. For a more curated list, please reference: https://www.stateofthedapps.com/ 

