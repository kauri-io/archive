---
title: Truffle 101 - Development Tools for Smart Contracts
summary: Truffle is a suite of tools to help Dapp developers build, deploy and manage their applications. The three tools provide a stack for managing the development lifecycle of an application similar to those you may have used with other languages and frameworks. These are- Ganache, for starting a personal test Ethereum blockchain on your machine. Truffle, for managing the lifecycle of smart contracts and the artifacts your contracts need. Drizzle, a collection of front-end libraries for standardizing
authors:
  - Chris Ward (@chrischinchilla)
date: 2018-12-04
some_url: 
---

# Truffle 101 - Development Tools for Smart Contracts

Truffle is a suite of tools to help Dapp developers build, deploy and manage their applications. The three tools provide a stack for managing the development lifecycle of an application similar to those you may have used with other languages and frameworks. These are:

- [Ganache](https://truffleframework.com/ganache), for starting a personal test Ethereum blockchain on your machine.
- [Truffle](https://truffleframework.com/truffle), for managing the lifecycle of smart contracts and the artifacts your contracts need.
- [Drizzle](https://truffleframework.com/drizzle), a collection of front-end libraries for standardizing Dapp front-ends.

Each tool has its own features and functionality summarized below, for full details read [the Truffle documentation](https://truffleframework.com/docs).

## Ganache

Available as a cross-platform GUI application or command line tool (`ganache-cli`), Ganache starts a local and personal Ethereum blockchain on your machine useful for testing, and other aspects of the Truffle Suite. Alongside this are tabs for details on settings, accounts, blocks, transactions, and logs.

![The Ganache Interface](https://api.beta.kauri.io:443/ipfs/QmZxcN6LHeoP28KeGuVM9aXywhHuiH7a5C3QVF3M4tJLMe)

## Truffle

Truffle packs a lot of features that follow familiar patterns and paradigms. I'll highlight a couple in this guide, and you can find a full guide in [the Truffle documentation](https://truffleframework.com/docs/truffle/overview).

### Truffle Boxes

Similar to Vagrant machines, Docker containers, or Yeoman generators, [Truffle boxes](https://truffleframework.com/boxes) contain pre-defined smart contract and other dependencies for Dapps. Even better each box ships with specific instructions on how to get started with it.

### Compiling

Truffle's `truffle compile` command adds to the solidity compilation process by only compiling changes to contracts located in the _contracts_ folder and placing the resulting artifacts into a _build_ folder ready for use in Dapps.

### Migrations

Unlike migrations from other web frameworks (such as Ruby on Rails), [Truffle migrations](https://truffleframework.com/docs/truffle/getting-started/running-migrations) are settings to help you deploy contracts between development and production networks.

Migrations are _.js_ files inside the _migrations_ folder and run them with the `truffle migrate` command. Each migration file defines artifacts you need, contracts to deploy and the order the steps need to run in. You need an initial _contracts/Migrations.sol_ contract that defines an interface for future migrations and this is created when you create a Truffle project.

### Tests

The Truffle suite provides a testing suite for your Dapps where you can write your tests in two ways:

- In Solidity for testing token focussed functionality such as balance transfers.
- In JavaScript for testing how a user interacts with your Dapp and the underlying smart contracts.

Whichever language(s) you use, you place all your tests inside the _test_ folder and run them with the `truffle test` command. This command runs your tests and displays the success or failure results.

### Debug

Debugging is an essential part of any development process, and Truffle's `debug` command helps you investigate what happened in the execution that lead to a transaction. The command opens an interface in your terminal that is similar to other debuggers that lets you step through the code.

### Interacting with a contract

Similar to consoles provided by Ruby and Python, Truffle lets you test potential interactions with your contracts via the `truffle console` command and receive instant feedback.

## Drizzle

Based on popular JavaScript framework, [Redux](https://redux.js.org), Drizzle is a collection of reactive libraries to build Dapp front-ends that stay in sync with your contract and transaction data. It borrows a lot of concepts from frameworks such as React and brings them to the Web3 word ecosystem.
