---
title: Tools for dApp development
summary: This article will introduce you to the relevant tools required for developing a simple dApp. We will introduce tools in the following areas- Smart Contract Programming Languages Web3 Libraries Development frameworks IDEs Development blockchains Ethereum Networks Wallets (Key Stores) SaaS / Cloud Infra Data Storage Smart Contract Programming Languages Because a smart contract is deployed on the blockchain in its bytecode form, any language that comes with an EVM compiler could be used to write a
authors:
  - Josh Cassidy (@joshorig)
date: 2019-01-16
some_url: 
---

# Tools for dApp development



This article will introduce you to the relevant tools required for developing a simple dApp. We will introduce tools in the following areas:

* Smart contract programming languages
* Web3 libraries
* Development frameworks
* IDEs
* Tutorials & developer tools
* Ethereum networks
* Wallets
* SaaS / cloud infra
* Data storage

## Smart Contract Programming Languages

Because a smart contract is deployed on the blockchain in its bytecode form, any language that comes with an EVM compiler could be used to write a smart contract. Nobody really wants to write bytecode!

- **Solidity**

  Currently, Solidity is the preferred/most used language used to write smart contracts for the Ethereum platform. For this reason it has the most examples, tutorials and references available. Its the recommended place to start for any new smart contract developer.

  It is a statically typed language heavily influenced by C++ and Javascript with the aim being to reduce the onboarding time for developers more familiar with these types of languages.

  https://github.com/ethereum/solidity

  Documentation: http://solidity.readthedocs.io/en/v0.4.24/

- **LLL**

  LLL, “Low-level Lisp-Like Language”, is an alternative language for writing smart contracts. As the name suggests it is a lower-level language than Solidity. LLL operators translate directly to EVM opcodes and developers have direct access to both memory and storage.

  Documentation: https://readthedocs.org/projects/lll-docs/


- **VYPER**

  Vyper is an experimental language which is still in alpha. It imposes strict rules which aim to increase both the security and auditability of smart contracts. Vyper is still alpha software, it is not recommended to write smart contracts for production software with it just yet.

  https://github.com/ethereum/vyper

  Documentation: https://vyper.readthedocs.io/en/latest/installing-vyper.html


## Web3 Libraries

Ethereum nodes expose a JSON-RPC API (a stateless, lightweight remote procedure call) protocol which clients can use to interact with a node.

Web3 libraries are convenient wrappers around this JSON-RPC protocol which provide an interface for interacting with an Ethereum node in the language of your choice.

Later in the series, we’ll see how we can use these web3 libraries to build clients/UIs which users can use to interact with our dApp.

https://github.com/ethereum/wiki/wiki/JSON-RPC

Below is a list of web3 libraries that can be used to interface with your preferred programming language.


*Javascript*

- **Alchemy SDK** (Superset of several Ethers.js libraries)

  https://github.com/alchemyplatform/alchemy-sdk-js

  Documentation: https://docs.alchemy.com/reference/alchemy-sdk-quickstart

- **ethers.js**

  https://github.com/ethers-io/ethers.js/

  Documentation: https://docs.ethers.io/ethers.js/html/

- **web3.js**

  https://github.com/ethereum/web3.js/

  Documentation: https://web3js.readthedocs.io/en/1.0/

*Java*

- **Web3j**

  https://github.com/web3j/web3j

  Documentation: https://docs.web3j.io/

*Python*

- **Web3.py**

  https://github.com/ethereum/web3.py

  Documentation: https://web3py.readthedocs.io/en/stable/

*.NET*

- **Nethereum**

  https://github.com/Nethereum/Nethereum

  Documentation: https://nethereum.readthedocs.io/en/latest/

## Development frameworks

When developing dApps, and especially writing smart contracts, there are many repetitive tasks you will undertake. Such as compiling source code, generating ABIs, testing, and deployment. Development frameworks hide the complexity of these tasks and enable you as a developer to focus on developing your dApp/idea. Note: When you first start playing around with contracts, you should avoid using a framework until you understand the value it provides, much in the same way you shouldn’t start learning how to write HTML with rails new . The easiest thing to do at first is use Remix (https://remix.ethereum.org/) to play around with the language and ideas.

- **Truffle**

  Node based framework which is currently the most used and actively maintained in the space.

  https://truffleframework.com/

  Documentation: https://truffleframework.com/docs

- **Ganache**

  Part of the truffle suite family, ganache allows you to quickly run a development blockchain on your local machine.
  It comes in 2 parts:

  *ganache-cli** formally known as testrpc, a Node.js based Ethereum client
  *ganache** a frontend on top of the Node.js client, which provides a blockexplorer for visualising transactions, blocks, and contracts deployed to the test client.

  https://truffleframework.com/ganache

- **Embark**

  Node based framework

  https://embark.status.im/

  Documentation: https://embark.status.im/docs/

- **Populous**

  Python based framework

  https://github.com/ethereum/populus

  Documentation: https://populus.readthedocs.io/en/latest/


## IDEs

Many developers have their IDE of choice where they are most comfortable developing. There are plugins available which can help you develop dApps in your natural habitat!

- **Remix**

  https://remix.ethereum.org/

  Remix in an online IDE developed and maintained by the Ethereum Foundation. It’s an easy to use development environment which requires no installation/setup.
  This is a great place to quickly prototype and play around with Solidity smart contacts.

- **Etheratom** (Atom plugin)

  https://github.com/0mkara/etheratom

- **Intellij-Solidity** (Intellij plugin)

  https://github.com/intellij-solidity/intellij-solidity

- **Solidity** (visual studio extension)

  https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity


## Tutorials & Developer Tools

Some of the most popular development-focused spaces with experienced Ethereum developers: 

- [Alchemy University](https://university.alchemy.com/#starter_code)

- [Chainlink](https://blog.chain.link/learn-blockchain-full-stack-web3-javascript-smart-contract-development/)

- [ConsenSysLabs](https://github.com/ConsenSysLabs/ethereum-developer-tools-list)

- [Ethereum StackExchange](https://ethereum.stackexchange.com/)

- [Nader Dabit](https://naderdabit.notion.site/Nader-s-web3-Resources-for-Developers)

- [StackOverflow](https://stackoverflow.com/questions/tagged/web3)

- [Web3 University](https://www.web3.university/)


## Ethereum Networks 

**Mainnet** — the main Ethereum network, think of this as the production network. ETH here has real world fiat value.

**Test Networks**

As these are test networks, ETH here has no real world fiat value. You can use the provided faucet links to request test ETH from each network.

- **Goerli** — Ethereum's only supported testnet (all others have been deprecated since the Ethereum Merge)

  [https://goerlifaucet.com](https://goerlifaucet.com)

## dApp Browsers

- **Metamask** —  Metamask is a crypto wallet that allows you to run Ethereum dApps in your browser without running a full Ethereum node. We use Metamask on Kauri. 

  https://metamask.io/

  Documentation: https://metamask.github.io/metamask-docs/

- **Toshi(Coinbase Wallet)** — Crypto wallet that can store multiple different kinds of tokens. 

  https://www.toshi.org/

- **Cipher Browser** — Mobile Web3 dApp browser and wallet for Ethereum.

  https://www.cipherbrowser.com/

## SaaS / Cloud Infra

These type of tools make it easy to read and write to the blockchain with their suite of products and APIs. 

- **Alchemy** – Alchemy offers web3 infrastructure-as-a-service. Put simply, this means it provides a full suite of tools for web3 developers to build more reliably, faster, and easier. Beyond running nodes and providing core API, Alchemy has an ethers.js SDK and enhanced APIs like NFT APIs. Alchemy powers millions of users and billions of dollars of transactions for companies like OpenSea, The Graph, Meta, and Shopify. It also has a robust web3 education system that includes developer docs and its free Alchemy University program. 

  https://www.alchemy.com/
  
  Docuemntation: https://docs.alchemy.com/

- **The Graph** — A protocol for building dApps using GraphQL.

    https://thegraph.com/
    
- **Infura** — A public hosted Ethereum node cluster, which provides access to its nodes via an API.

  https://infura.io/

  Documentation: https://infura.io/docs

## DataStorage

- **IPFS** —  IPFS (InterPlanetary File System) is a peer to peer protocol for distributing files. Think of it as a filesystem using the ideas behind  bittorrent and git where data is content-addressable and immutable.

  https://ipfs.io/

  Documentation: https://docs.ipfs.io/

- **SWARM** — Swarm is a decentralised storage network being developed within the Ethereum ecosystem. It is similar to IPFS, however, uses a different protocol and aims to provide an incentives layer to encourage nodes to persist data indefinitely.

  https://swarm-gateways.net/bzz:/theswarm.eth (https://swarm-gateways.net/bzz:/theswarm.eth/)

  Documentation: https://swarm-guide.readthedocs.io/en/latest/introduction.html

  Read Swarm and IPFS comparison (https://github.com/ethersphere/go-ethereum/wiki/IPFS-&-SWARM)





---

- **Kauri original title:** Tools for dApp development
- **Kauri original link:** https://kauri.io/tools-for-dapp-development/9a7d8927c9484f879d761981d70a42df/a
- **Kauri original author:** Josh Cassidy (@joshorig)
- **Kauri original Publication date:** 2019-01-16
- **Kauri original tags:** Ethereum
- **Kauri original hash:** QmVfRNCi22Lrz5MvHnY4pYoWyUP2zE8nVgMgawu1xyafSy
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



