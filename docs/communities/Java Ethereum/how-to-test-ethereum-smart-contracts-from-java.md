---
title: How to test Ethereum smart contracts from Java
summary: As a developer, I’m sure you strive to test what you develop, and in most established programming languages you have a box full of tools to pick from. In the wo
authors:
  - Christian Felde (@cfelde)
date: 2020-01-10
some_url: 
---

# How to test Ethereum smart contracts from Java

As a developer, I’m sure you strive to test what you develop, and in most established programming languages you have a box full of tools to pick from. In the world of blockchain, the box is still being built however, and the maturity of the available tools reflects this.

Here at Web3 Labs, we do our best to help accelerate the quality of these tools. In this blog post I’ll dive into what we can offer you as a Java developer writing Ethereum smart contracts. 

First, let’s establish the landscape. 

The Ethereum blockchain is the world computer on to which you’d like to deploy and interact with your smart contract code. The smart contracts themselves can be written in the Solidity programming language because you wouldn’t run Java directly on the Ethereum blockchain. This already brings with it some challenges, as we now spread our focus onto two separate stacks. Web3j can bridge this gap by helping you generate type-safe contract wrappers with easy access to protocol functionality. 

That’s great, but there’s still a lot of moving parts. Firstly you need to be able to connect to an Ethereum node. Of course, you don’t need to do this against the Ethereum mainnet, but even a testnet brings with it external configuration and setup that needs managing. 

## There’s a library for that

All these moving parts scream out for a bit of tooling, so we wrapped it all up into a nice library called [web3j-unit](https://github.com/web3j/web3j-unit). It allows you to write tests in Java, and automatically start and interact with a local Ethereum node. This node is started by the web3j-unit library and managed behind the scenes. 

Rather than figuring out how to install, configure and run a local Ethereum node, this is now fully automated. You don’t even need to know there is one running. And when the tests have finished, the node is automatically terminated with nothing left behind unintentionally. 

![Easily test Ethereum smart contracts using Web3j-unit](https://api.kauri.io:443/ipfs/QmPWzjAnYFEnagm5Mj2R4puXAdJmYDGkTcHKAiu2Xtik8D)

What makes the above otherwise simple test special is the @EVMTest class annotation you see on line 11. This highlights the test for our web3j-unit library to pick up, and lets us create and inject the required Web3j instance, in addition to a transaction manager and gas calculator. On the annotation itself you’ll notice the type parameter. This defines which type of node will get started, with current support for Geth, Besu and our embedded EVM implementation we’ll cover below. 

With these injected you have a preconfigured and good to go connection to the Ethereum blockchain. We’re off to a great start with web3j-unit as it’s never been easier to test and interact with Ethereum smart contracts from Java. 

![EVM + JVM = true](https://api.kauri.io:443/ipfs/QmckEVDxj4LkNkEyw6geobAuaGRzYKryp6uUcUM2xXmYyU)

## Running EVM code in the JVM

Wouldn’t it be nice if you could deploy and interact with Solidity smart contracts within the Java process you’re already running? Instead of dockerized nodes, just a library you can directly interact with? 

This is what we’re currently developing in the [web3j-evm](https://github.com/web3j/web3j-evm) library, and it brings with it several benefits. 

Firstly, there is no need to start a docker image, which improves upon startup time and communication lag. Instead, just use the @EVMTest annotation with the default type = NodeType.EMBEDDED. 

Secondly, because we now run the Solidity bytecode within an EVM running inside the JVM, we don’t need to cross process boundaries. This lets us inspect all the details of what’s happening within your smart contract, which is great for providing context and debugging tools. 

![Stepping through EVM byte code for that true low level experience](https://api.kauri.io:443/ipfs/QmTmfTszpp1FbCp4VZLPak1RZju5o9YK85DTNZzUF75M3t)

The above gif is showing an early demo of this in action, where we’re stepping through the individual EVM opcodes that are executed as part of normal contract deployment and interaction. While this might be a bit low level, it does show the potential for higher-level tools. We’ll be sharing more details on this as it becomes available.

## Testing against testnets

While the @EVMTest annotation lets you get up and running with local Ethereum nodes from a single annotation, we also want you to just as easily get going on a testnet. There are times when testing your contracts on a testnet makes more sense than simply within an isolated local node, especially when doing integration testing. 

But there are additional things needed when using a testnet, specifically a prefunded wallet address and somewhere you can connect. Sure, it isn’t that difficult getting free test Ether, but it does bring with it some additional steps we’d like to eliminate. 

We’ll return with more on this as well when we have something to offer around the tooling of this in the near future, but the idea is to extend the @EVMTest annotation with additional types covering these. 
