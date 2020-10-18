---
title: Smart Contract Utilities with ZeppelinOS  Introduction
summary: 
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-06
some_url: 
---

# Smart Contract Utilities with ZeppelinOS  Introduction


### What is It?

ZeppelinOS is a development platform of utilities to help manage and operate smart contract projects in Ethereum. Its counterpart _OpenZeppelin_ , comprises of a library of reusable and secure smart contracts. In this tutorial series, we are primarily focusing on ZeppelinOS.

ZeppelinOS is a command line tool with a multitude of built-in features to assist you with developing contracts. They are responsible for creating a feature called the EVM Package.

EVM packages are collections of upgradeable on-chain smart contract code that is reusable. For understanding purposes, think of it as a dependency that you can update without having to deploy. As a result, whenever there's a bug that needs fixing, or a new feature to add, you have the ability to upgrade your contract without deploying a new one. Before ZeppelinOS this was impossible, your contracts would forever be frozen on the blockchain.

Upgradeability is a feature that every developer needs to use, and without ZeppelinOS it's impossible. EVM packages are accessible through inheriting and take up little to no code. Writing contracts takes less time which allows for increased quality and complexity of contracts. In the next tutorial, [Deploying & Upgrading](#) we cover how to use ZeppelinOS but for now we cover what it has to offer.

Here are a couple definitions to make this introduction easier to understand:

- **EVM**: Ethereum Virtual Machine. The algorithm that powers the entire Ethereum platform. It's the program that connects all the nodes/blocks together in the network.
- **EVM Packages**: Piece of on-chain code that's reusable.
- **On-chain**: Transactions that happen **on** the Ethereum/cryptocurrency blockchain.
- **Off-chain**: Transactions that happen **off** the Ethereum/cryptocurrency blockchain.
- **Dependency**: Piece of code that makes other code ex) software, work properly.
- **ZEP**: A token created for ZeppelinOS.
- **dApp**: Decentralized application.

### Features

ZeppelinOS has great features to get you started:

- **Deploying & Upgrading**: Once your contract deploys onto the network, you have the option of upgrading it through EVM packages. Before these packages, your deployed contracts would not be upgrade-able.
- **Publishing**: Developers have the option of publishing their EVM packages to the blockchain for others to integrate into their projects.
- **Linking**: Any project can link to an EVM package that is already deployed on the blockchain. This establishes a database of packages that everyone can use.
- **Vouching**: To support the creators of EVM packages and promote authenticity, vouching is possible with ZEP tokens. This confirms the reliability of a package. Thus you can earn ZEP by auditing and developing packages.

### Future Features

ZeppelinOS has more features rolling out in the new year to make development and maintenance even easier. According to their [road map](https://blog.zeppelinos.org/zeppelinos-development-roadmap-pt-one/) we can expect to see the following.

#### Kernel Standard Libraries

This is an on-chain set of upgradeable libraries that you can inherit into your smart contracts. This stage of the project is active and available to users in the form of [OpenZeppelin](https://openzeppelin.org/).

Although as per the [whitepaper](https://zeppelinos.org/zeppelin_os_whitepaper.pdf), it sounds as though ZeppelinOS will be receiving its own separate version of a kernel sometime soon.

#### Development Tools

A set of tools that makes development and maintenance hassle-free. Examples include:

- **Attack Management system**: To deal with emergency attacks. This allows the user to perform actions such as pause, revert to the previous states, or fork the contract.
- **Upgrade Management**: Manage progressive deployment of features, security patch maintenance, and updating.

#### Interaction

Various utilities to enhance inter-contract communications and networking.

- **Scheduling**: Allows you to interfere with the execution time of your contract. An example would be enabling your contract to perform asynchronous execution on a function so that anyone can pay the gas cost instead of one specific person.
- **Marketplace**: A hub where users can browse and sell services. Hence it's a market place for contracts. Zeppelin reviews submissions to the marketplace to ensure high quality and best security practices.
- **Blockchain Information Provider**: This feature allows you to have access to information such as current ETH price, gas price, transaction pool size, average mining block times, and more.

#### Off-chain Tools

Off-chain tools aim to simplify the development process. Assisting with debugging, testing, deploying and monitoring of smart contract dApps.

- **Analytic Dashboard**: Help you to track the health of your dApp smart contracts.
- **Interface**: An interface designed to perform security analysis, manage upgrades, and interpret data about contracts once they deploy.

### Next Steps

ZeppelinOS expect to roll out new features in the future, in the meantime, we have plenty to get us started. The ZeppelinOS framework is designed to make creating contracts as easy as possible. They've resolved a fundamental issue in providing the ability to upgrade an already deployed contract. Once the rest of the features are launched, creating smart contracts will have never been easier.

- [ZeppelinOS](https://zeppelinos.org/)
- [Technical details](https://blog.zeppelin.solutions/technical-details-of-zeppelinos-d3cf4da591f7)
- [White paper](https://zeppelinos.org/zeppelin_os_whitepaper.pdf)
- [Introducing ZeppelinOS](https://blog.zeppelin.solutions/introducing-zeppelinos-the-operating-system-for-smart-contract-applications-82b042514aa8)


---

- **Kauri original link:** https://kauri.io/smart-contract-utilities-with-zeppelinos:-introdu/a054c697f68c434bb657f070cad83e98/a
- **Kauri original author:** Juliette Rocco (@jmrocco)
- **Kauri original Publication date:** 2019-03-06
- **Kauri original tags:** smart-contract, evm-packages, zeppelinos, zeppelin, deploy
- **Kauri original hash:** QmV7N5Maa3U6YjSyKbkXZq755d2FnjetvSiuhJD43n2r9H
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



