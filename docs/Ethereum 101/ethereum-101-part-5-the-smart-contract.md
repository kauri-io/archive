---
title: Ethereum 101 - Part 5 - The Smart Contract
summary: Quick Overview The term smart contract is an ubiquitous term with varying definitions across the greater blockchain ecosystem. Smart contracts are just computer programs. In the context of Ethereum, smart contracts refer to the source code of EVM-specific, special-purpose programming languages  Solidity, Vyper, LLL, Bamboo, and Serpent. There are good reasons for using built-for-purpose languages to write smart contracts, but they will not be discussed in this documentation. To make an attempt a
authors:
  - Wil Barnes (@wil)
date: 2019-02-13
some_url: 
---

# Quick Overview 
The term smart contract is an ubiquitous term with varying definitions across the greater blockchain ecosystem. 

Smart contracts are just computer programs. In the context of Ethereum, smart contracts refer to the source code of EVM-specific, special-purpose programming languages: Solidity, Vyper, LLL, Bamboo, and Serpent. 

There are good reasons for using built-for-purpose languages to write smart contracts, but they will not be discussed in this documentation. To make an attempt at summarizing, due to the minimalistic and constrained nature of the EVM, it's easier to build a special-purpose language from the ground up than it is to bend a general-purpose language to the intricate needs of the EVM. 

# The High-Level Languages

Smart contract developers have multiple high level language options at their disposal. In an earlier section, we highlighted the diverse range of Ethereum clients, yet explained that two clients, Geth and Parity, remain the most salient and widely used. The state of Ethereum high-level languages is slightly similar. Solidity is the de facto and most widely used language, while Vyper is emerging as a competitive alternative. 

# Table Comparison of the High-Level Languages



| High-Level Language | Syntactic similarities | Link to Documentation |
| -------- | -------- | -------- |
| Solidity    | JavaScript / Java / C++     |  https://solidity.readthedocs.io/en/latest/  |
| Vyper   | Python |  https://vyper.readthedocs.io/en/latest/  |
| LLL    | Lisp     |  https://lll-docs.readthedocs.io/en/latest/   |
| Bamboo    | Erlang     |  https://github.com/CornellBlockchain/bamboo   |
| Serpent, outdated    | Python     |  https://github.com/ethereum/serpent   |


# Solidity Quick Example

Solidity is the de facto language of Ethereum smart contracts, so for the next few paragraphs we'll work solely with Solidity source code.

Below you will find the source code of a Solidity contract (helpful information is commented out to the right '//'):

```
pragma solidity 0.5.3; // Solidity version 0.5.3, pragma used to enable certain compiler features or checks

contract HelloWorld // defining the contract
{
    string greeting; // defining the state string variable 'greeting'
    
    constructor() // constructor function, optional, executed once upon deployment and cannot be called again
    public
    {
        greeting = "Hello, World.";
    }
    
    function printGreeting() // defining a function
    public // this function is callable by anyone 
    view // dictates that this function promises to not modify the state
    returns (string memory) // function returns a string variable from memory
    {
        return greeting;
    }
    
    function setGreeting(string memory _greeting)
    public 
    // notice that this function contains no "view" -- it modifies the state
    {
        greeting = _greeting;
    }
}
```

This contract compiles using solidity compiler version 0.5.3. Try it yourself at [remix.ethereum.org](https://remix.ethereum.org). 

Reproduce the contract, deploy it to a JavaScript test blockchain (Javascript VM), and interact with the functions: 
1. Copy and paste the above source code into the text editor at [remix.ethereum.org](https://remix.ethereum.org)
2. In the 'Compile' tab, set the compiler version to '0.5.3+commit.10d17f24...' to match our contract version 0.5.3. 
3. Switch to the 'Run' tab, and adjust the 'Environment' drop-down box to 'JavaScript VM.'
4. In the box directly below, find our "Hello World" contract and use the light red push button to deploy the contract to the JavaScript test blockchain. 
5. Two boxes directly below, find the 'Deployed contracts' section. Within you'll see two buttons: 
    * 'printGreeting' will print the current greeting (the button is blue because of the view declaration!)
    * 'setGreeting' will change the current greeting to a string of your choosing, just ensure you enclose it within quotation marks "" (the button is read because this function changes state!)

We just used Remix to write, deploy, and interact with our 'HelloWorld' smart contract. Remix is a powerful tool for smart contract development. 

# Vyper Quick Example

```
greeting: public(bytes[32]) # defining greeting state variable, just like Solidity

@public
def __init__(): # initialization function, same as Solidity's constructor function
    self.greeting = "Hello, World."
    
@public # function can be called internally and externally
@constant # function will not change state
def printGreeting() -> bytes[32]:
    return self.greeting

@public
def setGreeting(_greeting: bytes[32]): # a state changing function
    self.greeting = _greeting

```

We're going to use MyEtherWallet for the Vyper contract: 
1. Open up two tabs:
    * https://vyper.online
    * https://www.myetherwallet.com/#contracts
2. Copy & paste the above source code into the Vyper Online Compiler, and compile. 
3. On MyEtherWallet, navigate to 'Deploy Contract' and populate the fields using the output from the 'Bytecode' and 'ABI' tabs on the Vyper Online Compiler. 
4. Use MetaMask to connect to the Rinkeby network and sign the transaction. 
    * Test ETH available @ https://faucet.rinkeby.io/
6. Use MyEtherWallet to view the state variables and MetaMask to make state changes using our "setGreeting(bytes[32])"
7. Gas costs are expensive, but this is for demonstration purposes. 
8. Use a Hex to ASCII text converter to convert function inputs:
    * https://www.rapidtables.com/convert/number/hex-to-ascii.html or something similar from Google


# Tooling to get started

## General Solidity tutorials on Kauri: 
*Up-to-date tutorials, using real code, written by active web3 developers.* 
* [Tools for Working With Solidity](https://beta.kauri.io/article/7a27a1c1fbdc428b8058f14db1a227aa/v1/tools-for-working-with-solidity)


# Remix Solidity 

From the [Remix documentation](https://remix.readthedocs.io/en/latest/), verbatim: 

> Remix is a powerful, open source tool that helps you write Solidity contracts straight from the browser. Written in JavaScript, Remix supports both usage in the browser and locally. <br /><br />Remix also supports testing, debugging and deploying of smart contracts and much more. 

## Remix tutorials on Kauri: 
*Up-to-date tutorials, using real code, written by active web3 developers.* 
* [Remix IDE - Your first smart contract](https://beta.kauri.io/article/124b7db1d0cf4f47b414f8b13c9d66e2)

## Links & additional information
* Website: [https://remix.ethereum.org/](https://remix.ethereum.org/)
* Documentation: [https://remix.readthedocs.io/en/latest/](https://remix.readthedocs.io/en/latest/)


# Truffle Development Framework

From the [Truffle documentation](https://truffleframework.com/docs/truffle/overview), verbatim: 

> A world class development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM), aiming to make life as a developer easier. 

## Truffle tutorials on Kauri:
*Up-to-date tutorials, using real code, written by active web3 developers.* 

* [Truffle: Smart Contract Compilation & Deployment](https://beta.kauri.io/article/cbc38bf09088426fbefcbe7d42ac679f/v5/truffle:-smart-contract-compilation-and-deployment)
* [Truffle: Testing your smart contract](https://beta.kauri.io/article/f95f956261494090be1aaa8227464773/v7/truffle:-testing-your-smart-contract) 
* [Truffle: Adding a frontend with react box](https://beta.kauri.io/article/86903f66d39d4379a2e70bd583700ecf/v14/truffle:-adding-a-frontend-with-react-box)

## Links & additional information
* Website: [https://truffleframework.com/](https://truffleframework.com/)
* Documentation: [https://truffleframework.com/docs](https://truffleframework.com/docs)
* Community: [https://truffleframework.com/community](https://truffleframework.com/community)


# Embark Framework

From the [Embark documentation](https://embark.status.im/docs/), verbatim: 

> Embark is a fast, easy to use, and powerful developer environment to build and deploy decentralized applications, also known as “DApps”. It integrates with Ethereum blockchains, decentralized storages like IPFS and Swarm, and decentralized communication platforms like Whisper. <br /><br />Embark’s goal is to make building decentralized applications as easy as possible, by providing all the tools needed and staying extensible at the same time. 


## Embark tutorials on Kauri:
*Up-to-date tutorials, using real code, written by active web3 developers.* 

* [Embark: Smart Contract Compilation & Deployment](https://beta.kauri.io/article/13758d60f21648a1897fad1fa5b78237/v1/embark:-smart-contract-compilation-and-deployment)
* [Embark: Testing your Smart Contract](https://beta.kauri.io/article/e8f18d0643c14756b43d698122bba9d9/v1/embark:-testing-your-smart-contract)

## Links & additional information
* Website: https://embark.status.im/
* Documentation: https://embark.status.im/docs/



