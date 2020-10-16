---
title: Tools for dApp development
summary: This article will introduce you to the relevant tools required for developing a simple dApp. We will introduce tools in the following areas  Smart Contract Programming Languages Web3 Libraries Development frameworks IDEs Development blockchains Ethereum Networks Wallets (Key Stores) SaaS / Cloud Infra Data Storage Smart Contract Programming Languages Because a smart contract is deployed on the blockchain in its bytecode form, any language that comes with an EVM compiler could be used to write a
authors:
  - Josh Cassidy (@joshorig)
date: 2019-01-16
some_url: 
---


This article will introduce you to the relevant tools required for developing a simple dApp. We will introduce tools in the following areas:

* Smart Contract Programming Languages
* Web3 Libraries
* Development frameworks
* IDEs
* Development blockchains
* Ethereum Networks
* Wallets (Key Stores)
* SaaS / Cloud Infra
* Data Storage

# Smart Contract Programming Languages

Because a smart contract is deployed on the blockchain in its bytecode form, any language that comes with an EVM compiler could be used to write a smart contract. Nobody really wants to write bytecode!

**Solidity**

Currently, Solidity is the preferred/most used language used to write smart contracts for the Ethereum platform. For this reason it has the most examples, tutorials and references available. Its the recommended place to start for any new smart contract developer.

It is a statically typed language heavily influenced by C++ and Javascript with the aim being to reduce the onboarding time for developers more familiar with these types of languages.

https://github.com/ethereum/solidity

Documentation: http://solidity.readthedocs.io/en/v0.4.24/

**LLL**

LLL, “Low-level Lisp-Like Language”, is an alternative language for writing smart contracts. As the name suggests it is a lower-level language than Solidity.

LLL operators translate directly to EVM opcodes and developers have direct access to both memory and storage.

[Include a link to the LLL project page]

Documentation: https://readthedocs.org/projects/lll-docs/


**VYPER**

Vyper is an experimental language which is still in alpha. It imposes strict rules which aim to increase both the security and auditability of smart contracts.

Note: Vyper is still alpha software, it is not recommended to write smart contracts for production software with it just yet.

https://github.com/ethereum/vyper

Documentation: https://vyper.readthedocs.io/en/latest/installing-vyper.html


# Web3 Libraries

Ethereum nodes expose a JSON-RPC API (a stateless, lightweight remote procedure call) protocol which clients can use to interact with a node.

Web3 libraries are convenient wrappers around this JSON-RPC protocol which provide an interface for interacting with an Ethereum node in the language of your choice.

Later in the series, we’ll see how we can use these web3 libraries to build clients/UIs which users can use to interact with our dApp.

https://github.com/ethereum/wiki/wiki/JSON-RPC

Below is a list of web3 libraries that can be used to interface with your preferred programming language.

**Javascript**

####WEB3.js

https://github.com/ethereum/web3.js/

Documentation: https://web3js.readthedocs.io/en/1.0/

####ETHERS.js

https://github.com/ethers-io/ethers.js/

Documentation: https://docs.ethers.io/ethers.js/html/

**Java**

####WEB3J

https://github.com/web3j/web3j

Documentation: https://docs.web3j.io/

**Python**

####WEB3.PY

https://github.com/ethereum/web3.py

Documentation: https://web3py.readthedocs.io/en/stable/

**.NET**

####Nethereum

https://github.com/Nethereum/Nethereum

Documentation: https://nethereum.readthedocs.io/en/latest/

# Development frameworks

When developing dApps, and especially writing smart contracts, there are many repetitive tasks you will undertake. Such as compiling source code, generating ABIs, testing, and deployment. Development frameworks hide the complexity of these tasks and enable you as a developer to focus on developing your dApp/idea.

**Truffle**

Node based framework which is currently the most used and actively maintained in the space.

https://truffleframework.com/

Documentation: https://truffleframework.com/docs


**Embark**

Node based framework

https://embark.status.im/

Documentation: https://embark.status.im/docs/


**Populous**

Python based framework

https://github.com/ethereum/populus

Documentation: https://populus.readthedocs.io/en/latest/

When you first start playing around with contracts, you should avoid using a framework until you understand the value it provides, much in the same way you shouldn’t start learning how to write HTML with rails new . The easiest thing to do at first is use Remix (https://remix.ethereum.org/) to play around with the language and ideas.


#IDEs

Many developers have their IDE of choice where they are most comfortable developing. There are plugins available which can help you develop dApps in your natural habitat!

###REMIX

https://remix.ethereum.org/

Remix in an online IDE developed and maintained by the Ethereum Foundation. It’s an easy to use development environment which requires no installation/setup.
This is a great place to quickly prototype and play around with Solidity smart contacts.

###ETHERATOM (ATOM PLUGIN)

https://github.com/0mkara/etheratom

###INTELLIJ-SOLIDITY (INTELLIJ PLUGIN)

https://github.com/intellij-solidity/intellij-solidity

###SOLIDITY (VISUAL STUDIO EXTENSION)

https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity

# Development Blockchains

When developing dApps, and especially writing smart contracts in your local development environment. It can be useful to spin up a development blockchain where you can quickly deploy your contracts, and run tests, whilst being in control of how the chain operates.

**Ganache**

Part of the truffle suite family, ganache allows you to quickly run a development blockchain on your local machine.
It comes in 2 parts:

* **ganache-cli** formally known as testrpc, a Node.js based Ethereum client
* **ganache** a frontend on top of the Node.js client, which provides a blockexplorer for visualising transactions, blocks, and contracts deployed to the test client.

https://truffleframework.com/ganache


#Ethereum Networks

**Mainnet** — the main Ethereum network, think of this as the production network. ETH here has real world fiat value.

**Test Networks**

As these are test networks, ETH here has no real world fiat value. You can use the provided faucet links to request test ETH from each network.

**Rinkeby**— A geth-client only testnet which seems to be the most reliable and consistent

[https://faucet.rinkeby.io] (https://faucet.rinkeby.io/)

**Kovan**— A parity-client only testnet

https://github.com/kovan-testnet/faucet

**Ropsten** — The primary Ethereum testnet using Proof of Work. This network, seems to be the most inconsistent/unrealisable out of the 3

[https://faucet.ropsten.be] (https://faucet.ropsten.be/)

#dApp Browsers

**Metamask** —  Metamask is a crypto wallet that allows you to run Ethereum dApps in your browser without running a full Ethereum node. We use Metamask on Kauri. 

https://metamask.io/

Documentation: https://metamask.github.io/metamask-docs/

**Toshi(Coinbase Wallet)** — Crypto wallet that can store multiple different kinds of tokens. 

https://www.toshi.org/

**Cipher Browser** — Mobile Web3 dApp browser and wallet for Ethereum.

https://www.cipherbrowser.com/

# SaaS / Cloud Infra

**Infura** — A public hosted Ethereum node cluster, which provides access to its nodes via an API.

https://infura.io/

Documentation: https://infura.io/docs

**The Graph** — A protocol for building dApps using GraphQL.

https://thegraph.com/

# DataStorage

**IPFS** —  IPFS (InterPlanetary File System) is a peer to peer protocol for distributing files. Think of it as a filesystem using the ideas behind **bittorrent**and **git** where data is content-addressable and immutable.

https://ipfs.io/

Documentation: https://docs.ipfs.io/

**SWARM** — Swarm is a decentralised storage network being developed within the Ethereum ecosystem. It is similar to IPFS, however, uses a different protocol and aims to provide an incentives layer to encourage nodes to persist data indefinitely.

https://swarm-gateways.net/bzz:/theswarm.eth (https://swarm-gateways.net/bzz:/theswarm.eth/)

Documentation: https://swarm-guide.readthedocs.io/en/latest/introduction.html

Read Swarm and IPFS comparison (https://github.com/ethersphere/go-ethereum/wiki/IPFS-&-SWARM)


#Ethereum Developer Tools List

Consensys Labs along with the Ethereum developer community, have been aggregating a list of open source tools, frameworks, and components, to help developers get started with building on Ethereum. This will be a useful resource to bookmark as you continue your journey into dApp development!

[ConsenSysLabs/ethereum-developer-tools-list] (https://github.com/ConsenSysLabs/ethereum-developer-tools-list)