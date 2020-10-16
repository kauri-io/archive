---
title: Ethereum 101 - Part 7 - Decentralized Apps
summary: Developing on the Ethereum Platform It is relatively easy to establish an Ethereum node, send and receive transactions, trade cryptocurrencies, and bring test environments online, though understanding the moving parts and complexities of such a fledgling technology is a formidable task. It takes time. This section will introduce consumers and developers to the decentralized app ecosystem. Basic Decentralized Infrastructure Stack (non-exhaustive) How an End-User Interacts with Your Decentralized
authors:
  - Wil Barnes (@wil)
date: 2019-02-13
some_url: 
---

# Developing on the Ethereum Platform

It is relatively easy to establish an Ethereum node, send and receive transactions, trade cryptocurrencies, and bring test environments online, though understanding the moving parts and complexities of such a fledgling technology is a formidable task. It takes time. This section will introduce consumers and developers to the decentralized app ecosystem. 

# Basic Decentralized Infrastructure Stack 
![](https://api.beta.kauri.io:443/ipfs/QmRvq7e67HBEa3zDKLHwn1GcSk96yuachXxoQMtevui4ZN)
_(non-exhaustive)_

# How an End-User Interacts with Your Decentralized App

Using ethereumjs to execute a raw transaction is code-heavy process for such a simple task, not many users will want to do that for every transaction. 

MetaMask is a wallet that serves to improve the user experience of transacting on the Ethereum network while protecting the end-user's private keys. 

Let’s send a simple transaction using MetaMask. First, if you haven’t added the app to your Chrome or Firefox browser, go ahead and do that now at the following link: [https://metamask.io/](https://metamask.io/) then move through the steps and setup a password. 

![](https://api.beta.kauri.io:443/ipfs/Qmen7cYubP4VBcVDYivwaqfVieK1Eno18RhEZhKcHWCM6v)

The above is what a MetaMask end-user sees when sending a transaction. It’s immensely more intuitive.

In the top left corner you can see that this transaction was broadcast onto the Rinkeby testnet. The 18.750 ETH is not real ether, as it was obtained using Rinkeby’s faucet @ [https://faucet.rinkeby.io/](https://faucet.rinkeby.io/).

# Web3 Libraries

Web3.js is the Ethereum compatible JavaScript API which implements the Generic JSON RPC spec. The Web3.js library is available on npm as a node module, for browsers and components it is available as an embeddable js, and is further available as a meteor.js package. Web3js communicates via RPC with the local node or test node. 

Although Web3.js is the de facto JavaScript Ethereum API, developers have access to a plethora of other libraries and tools. Among these are web3j (a more lightweight, reactive type safe Java and Android API), ethereum-js (the simple library we used above to execute a raw transaction), Web3.py (Python library), eth.js (maintained by Nick Dodson), and many others. 

Ethereum can be accessed by a browser, a server, and in general anything that can correctly interpret the protocol. An example of a client-side browser interface is ConsenSys’ MetaMask browser extension, which uses the Web3.js API. An example of a server-side service is etherscan.io, a service that many in the ethereum community see as a generally reliable source for information on ethereum addresses, address balances, and smart contracts. 


# Developer Environment
This section includes a brief showcase of the various integrated development environments in the Ethereum ecosystem. Despite being frontier technology, there is a strong developer contingent and a diverse set of open source tools available that aid in the development and deployment of secure smart contracts.

There are several development environments and frameworks available to Ethereum developers. This documentation will highlight the more popular and widely known frameworks. Starting out, Remix and MetaMask would serve as a good springboard into decentralized app development. 

# Zeppelin Open Source Smart Contract Security Framework

An open source framework for developing secure smart contracts, Zeppelin provides users a collection of reusable, community-vetted smart contracts to assist users in developing secure dapps. 

It is often advised, if such options are available, that existing proven and tested open source code should be reused when developing applications of any type. In the Ethereum space this advice should be duly noted, as smart contracts are inherently immutable once written to the blockchain. A unknowingly flawed smart contract written to the mainnet and operating in a live production environment can be and often are exploited by malicious actors, potentially resulting in lost or locked funds or inoperative smart contracts. OpenZeppelin saw this need and has provided a library of secure smart contracts that can be inherited by solidity. 

Let’s install the OpenZeppelin open source framework and explore its functionality: 
```
$ npm install zeppelin-solidity
```

Using Solidity’s inheritance we can edit our smart contracts to inherit Zeppelin’s open source contracts, and then re-compiling and migrating back to the blockchain:

```
pragma solidity ^0.4.17;

Import ‘zeppelin-solidity/contracts/token/StandardToken.sol';’

contract NameOfMyProject is StandardToken {

}
```

The example ‘NameOfMyProject’ contract will now inherit all of the ‘StandardToken.sol’ variables and functions. For official Zeppelin documentation, please reference: [https://zeppelin-solidity.readthedocs.io/en/latest/](https://zeppelin-solidity.readthedocs.io/en/latest/)

_Additional reading:_
- Solidity Documentation: [https://solidity.readthedocs.io/en/develop/index.html](https://solidity.readthedocs.io/en/develop/index.html)
- Zeppelin Documentation: [https://github.com/OpenZeppelin/zeppelin-solidity](https://github.com/OpenZeppelin/zeppelin-solidity)
- Truffle’s Solidity Testing Documentation:
[http://truffleframework.com/docs/getting_started/solidity-tests](https://github.com/OpenZeppelin/zeppelin-solidity)

# Building the Right Development Environment for Your Decentralized Application Needs

Lastly, as you move onto move beyond Remix and onto Truffle and other development environments, you may find that you need the ability to rapidly deploy customizable ethereum networks. If you need this functionality, then Puppeth may be the appropriate tool. Using Puppeth you can spin up a full Ethereum network, including a bootnode, sealers (or also called validators), network statistics, wallet, dashboard, and even a faucet to dispense ether. 

Integrated development environments all generally serve the same purpose: to streamline your development experience by allowing you to compile, migrate, deploy, and test your smart contracts. However, the various development environments all have their own flavors and opinions when it comes to how a decentralized app should be build. Knowing your personal development processes and your work style, it’s worth taking some time to review the varying nuances of some of the prominent environments we’ve listed below as you seek to find an optimal collection of tools to serve your development needs. 

# Additional Information

## Development Environments / Plugins: 
- ConsenSys Ethereum Developer Tools List - "A guide to available tools, components, patterns, and platforms for developing applications on Ethereum." [https://github.com/ConsenSys/ethereum-developer-tools-list](https://github.com/ConsenSys/ethereum-developer-tools-list)
- Embark - development environment primarily for trustless applications; easier to develop front-end applications, but significantly less support backend support. May not be the best choice for developers intending on building hybrid front end / back end dapps. [https://embark.readthedocs.io/en/2.5.2/](https://embark.readthedocs.io/en/2.5.2/)
- IntelliJ-Solidity: [https://plugins.jetbrains.com/plugin/9475-intellij-solidity](https://plugins.jetbrains.com/plugin/9475-intellij-solidity)
- VisualStudio: [https://marketplace.visualstudio.com/items?itemName=ConsenSys.Solidity](https://marketplace.visualstudio.com/items?itemName=ConsenSys.Solidity)
- EtherAtom package for Atom Editor: [https://github.com/0mkara/etheratom](https://github.com/0mkara/etheratom)

## Linters: 
- Solhint: [https://github.com/protofire/solhint](https://github.com/protofire/solhint)
- Ethereum Solidity Language for Visual Studio Code: [http://juan.blanco.ws/solidity-contracts-in-visual-studio-code/](http://juan.blanco.ws/solidity-contracts-in-visual-studio-code/)
