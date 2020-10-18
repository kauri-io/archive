---
title: OpenZeppelin Part 1  Introductory
summary: Introductory To OpenZeppelin What Is OpenZeppelin? OpenZeppelin is a library of reusable smart contracts to use with Ethereum and other EVM and eWASM blockchains. The contracts focus on secure and simple open source code. They are continuously tested and community reviewed to ensure they follow the best industry standards and security practices. As a developer its difficult to create any piece of code from scratch; especially a contract. Through the use of OpenZeppelins inheritable contracts, yo
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-11
some_url: 
---

# OpenZeppelin Part 1  Introductory

![](https://ipfs.infura.io/ipfs/QmXpNnBRArmx3E36X5niZXricpaMk4QHX9GnJaeP8VCbZG)


## Introductory To OpenZeppelin

### What Is OpenZeppelin?

OpenZeppelin is a library of reusable smart contracts to use with Ethereum and other EVM and eWASM blockchains. The contracts focus on secure and simple open source code. They are continuously tested and community reviewed to ensure they follow the best industry standards and security practices. As a developer it's difficult to create any piece of code from scratch; especially a contract. Through the use of OpenZeppelin's inheritable contracts, you have a base to start from and build complex features with little to, or no effort.

### OpenZeppelin vs ZeppelinOS

Zeppelin solutions provides two different frameworks that are often confused to be the same thing. [OpenZeppelin](https://openzeppelin.org) is a series of open source contracts to inherit into your code. In contrast, [ZeppelinOS](https://zeppelinos.org) is a platform of utilities to securely manage your smart contracts. Ideally you use them together. In this tutorial series, we focus on OpenZeppelin.

### Types of Contracts

OpenZeppelin has a variety of contracts to meet your needs divided into the following categories:

1.  **Access**: Roles and privileges.
2.  **Crowdsale**: Creating a smart contract for use in a crowdsale.
3.  **Cryptography**: Protecting your information.
4.  **Drafts**: Contracts that are currently in testing by the OpenZeppelin team.
5.  **Introspection**: Interface support.
6.  **Lifecycle**: Managing the behaviour of your contract.
7.  **Math**: Perform operations without overflow errors.
8.  **Ownership**: Manage ownership throughout your contract.
9.  **Payment**: How your contract releases tokens.
10. **Tokens**: Creating tokens and protecting them.
11. **Utilities**: Other contracts to assist you.

You inherit or combine OpenZeppelin contracts with your own contracts, serving as a base for you to build from. Later in the series, we will explore the uses of each of these contracts.

### How To Download

To begin, you need to have [Node.js](https://nodejs.org/en/download/) and [Truffle](https://kauri.io/article/2b10c835fe4d463f909915bd75597d6b/v1/truffle-101-development-tools-for-smart-contracts) installed on your machine. To work with OpenZeppelin you should be familiar with Solidity, the programming language for smart contracts. The ["Remix IDE - Your first smart contract"](https://kauri.io/article/124b7db1d0cf4f47b414f8b13c9d66e2/v6/remix-ide-your-first-smart-contract) article is a good place to start.

In a directory of your choice make a new project folder and initialize Truffle in it.

```shell
mkdir myproject
cd myproject
truffle init
```

Now install the OpenZeppelin library into your projects root directory. Use the `--save-exact` option to ensure that all dependencies configure with an exact version, since breaking changes (change in software that can potentially make other components fail) might occur when versions are updated.

```shell
npm init -y
npm install --save-exact openzeppelin-solidity
```

OpenZeppelin is now installed. The library of contracts are stored in the _node___modules/openzeppelin-solidity/contracts_ folder path within your project.

To use the library, add an import statement at the beginning of the contract specifying which one you want to use.

```
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
```

### Conclusion

OpenZeppelin allows you to write more complex and secure contracts using their variety of base contracts. Less time spent building the foundation and more time to optimize details.

Documentation and Next Steps:

- <https://github.com/OpenZeppelin/openzeppelin-solidity>
- <https://openzeppelin.org/>
- [Examples of contracts that use the OpenZeppelin library](https://github.com/OpenZeppelin/openzeppelin-solidity/tree/2c34cfbe0ea5b2969ca5a13710694f44c1be3e6a/contracts/mocks)


---

- **Kauri original title:** OpenZeppelin Part 1  Introductory
- **Kauri original link:** https://kauri.io/openzeppelin-part-1:-introductory/c3ef30099d1e404180067ed4f656aad2/a
- **Kauri original author:** Juliette Rocco (@jmrocco)
- **Kauri original Publication date:** 2019-03-11
- **Kauri original tags:** smart-contract, openzeppelin, zeppelin, solidity
- **Kauri original hash:** QmTgSJ69J6KmHojB1DZdb2nrudnjcvPn2udwWmXgXjexgk
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



