---
title: Manage ERC20 tokens in Java with Web3j
summary: In this article, we learn how to manage ERC20 (Fungible) tokens in Java with the Web3j library. ERC20 is an Ethereum Smart Contract standard for implementing tokens in a compliant way, so it is easy to interact and integrate tokens with any application (dapps, wallets, exchanges, etc.). For more details about ERC20, see the article ERC-20 Token Standard. Prerequisites To follow this tutorial, you need the following software installed on your computer- Java programming language (> 8) A package an
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-08-20
some_url: 
---


In this article, we learn how to manage [ERC20 (Fungible)](https://en.wikipedia.org/wiki/ERC-20) tokens in Java with the [Web3j](https://web3j.io/) library.

[ERC20](https://kauri.io/article/d3e24cbf13fd4af9892773552555c480/v1/erc-20-token-standard) is an Ethereum Smart Contract standard for implementing tokens in a compliant way, so it is easy to interact and integrate tokens with any application (dapps, wallets, exchanges, etc.).

For more details about ERC20, see the article [ERC-20 Token Standard](https://kauri.io/article/d3e24cbf13fd4af9892773552555c480).

## Prerequisites

To follow this tutorial, you need the following software installed on your computer:

-   [Java programming language](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (> 8)
-   A package and dependency manager, for example [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/install/)
-   An IDE (Integrated development environment), for this tutorial, we use [Eclipse](https://www.eclipse.org/downloads/)
-   [Truffle](https://www.trufflesuite.com/ganache): a development framework to develop, test and deploy Ethereum smart contract
-   [Ganache-cli](https://github.com/trufflesuite/ganache-cli): your local personal blockchain for Ethereum development.

Start ganache by running the command:

```shell
ganache-cli
```

## Contract deployment

Before starting, we need an ERC20 token contract deployed on the Ethereum blockchain (Ganache in our case). There are many ways to do this (Read [Develop your ERC-20 Tokens explained](https://kauri.io/article/d3e24cbf13fd4af9892773552555c480) and [OpenZeppelin Part 3: Token Standards](https://kauri.io/article/cbd1b524cd284bf6ae6ab76e71f5ea56)). For the sake of this tutorial, we use the simplest solution using [OpenZeppelin](https://openzeppelin.com/contracts/) reusable contracts, Truffle and Ganache.

**1. First create a project folder for our ERC20 called JVM and initialize a Truffle project**

```shell
$ mkdir JVM
$ cd JVM
$ truffle init
```

**2. Then we install the Open-Zeppelin Solidity library which contains a lot of high-quality, fully tested and audited reusable smart contracts**

Import the OpenZeppelin smart contracts using npm packages.

```shell
$ npm init -y
$ npm install openzeppelin-solidity --save-exact
```

**3. Create a contract file `./contracts/JavaToken.sol`**

The smart contract inherits all the functionality and rules from the reusable OpenZeppelin contract `ERC20Mintable`. We only need to configure the following constant variables as below:

```solidity
// JavaToken.sol
pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract JavaToken is ERC20Mintable {
 string public constant name = "Java Token";
 string public constant symbol = "JVM";
 uint8 public constant decimals = 18;
}
```

**4. Deploy the smart contract on our local Ganache network**

We need to first complete the migration script. Create a file called `./migrations/2_deploy_contract.js`, and add the code below to the file:

```javascript
// 2_deploy_contract.js
const JavaToken = artifacts.require("./JavaToken.sol");

module.exports = function(deployer, network, accounts) {
 // Deploy the smart contract
 deployer.deploy(JavaToken, {from: accounts[0]}).then(function(instance) {
 // Mint 100 tokens
 return instance.mint(accounts[0], web3.utils.toBN("100"), {from: accounts[0]});
 });
};
```

The migration script deploys the contract, mints and distributes 100 JVM tokens to the deployer account (the Ganache first account).

The next step is to configure a connection to the Ganache network in order to deploy a smart contract. Change the file `./truffle-config.js`to the code below:

```javascript
// truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    }
  }
};
```

To deploy the smart contracts on the Ganache network, run the command below (do not forget to start ganache-cli beforehand):

```shell
$ truffle migrate --network development

Compiling your contracts...
===========================
> Compiling ./contracts/JavaToken.sol
> Compiling ./contracts/Migrations.sol
> Compiling openzeppelin-solidity/contracts/access/Roles.sol
> Compiling openzeppelin-solidity/contracts/access/roles/MinterRole.sol
> Compiling openzeppelin-solidity/contracts/math/SafeMath.sol
> Compiling openzeppelin-solidity/contracts/token/ERC20/ERC20.sol
> Compiling openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol
> Compiling openzeppelin-solidity/contracts/token/ERC20/IERC20.sol
> Artifacts written to /home/gjeanmart/workspace/tutorials/kauri-content/java-erc20/JVM/build/contracts
> Compiled successfully using:
 - solc: 0.5.8+commit.23d335f2.Emscripten.clang


Starting migrations...
======================
> Network name: 'development'
> Network id: 1565778588423
> Block gas limit: 0x6691b7


1_initial_migration.js
======================

 Deploying 'Migrations'
 ----------------------
 > transaction hash: 0x6161e15461a5c748a532b2191600986b8798be4842e78791238e9e77af5e1310
 > Blocks: 0 Seconds: 0
 > contract address: 0xC59fC6035859Dd35871c5d9211a0713ed608d59D
 > block number: 6
 > block timestamp: 1565778631
 > account: 0xB0C24796Fc9212AB371c8Caf1ea3F33cC1d4c8a0
 > balance: 99.95438236
 > gas used: 261393
 > gas price: 20 gwei
 > value sent: 0 ETH
 > total cost: 0.00522786 ETH


 > Saving migration to chain.
 > Saving artifacts
 -------------------------------------
 > Total cost: 0.00522786 ETH


2_deploy_contract.js
====================

 Deploying 'JavaToken'
 ---------------------
 > transaction hash: 0xfc5b214cbd56ecd4d24795aacefe1fdaf27b1b223ebff78299fd47f302cb374c
 > Blocks: 0 Seconds: 0
 > contract address: 0x9339a071cB9C1E3BbBA50E5E298f234c5095f012
 > block number: 8
 > block timestamp: 1565778631
 > account: 0xB0C24796Fc9212AB371c8Caf1ea3F33cC1d4c8a0
 > balance: 99.92109908
 > gas used: 1622141
 > gas price: 20 gwei
 > value sent: 0 ETH
 > total cost: 0.03244282 ETH


 > Saving migration to chain.
 > Saving artifacts
 -------------------------------------
 > Total cost: 0.03244282 ETH


Summary
=======
> Total deployments: 2
> Final cost: 0.03767068 ETH
```

**Note the contract address after the command completes.**

_If you wish to learn more about this step, I recommend reading the following articles about Truffle and Ganache for deploying smart contracts: [Truffle: Smart Contract Compilation & Deployment](https://kauri.io/article/cbc38bf09088426fbefcbe7d42ac679f)_ and [Truffle 101 - Development Tools for Smart Contracts](https://kauri.io/article/2b10c835fe4d463f909915bd75597d6b)

## Load the contract with Web3j

Now we have deployed an ERC20 smart contract on our Ganache local blockchain, and we can start interacting with it in Java using the Web3j ERC20 utility class.

### 1. Create a new project and import the Web3j dependency

Create a new Maven project in your favorite IDE and import Web3j dependencies (`core` and `contracts` for EIP support):

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>io.kauri.tutorials.java-ethereum</groupId>
  <artifactId>java-erc20</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <properties>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.source>1.8</maven.compiler.source>
    <web3j.version>4.2.0</web3j.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.web3j</groupId>
      <artifactId>core</artifactId>
      <version>${web3j.version}</version>
    </dependency>
    <dependency>
      <groupId>org.web3j</groupId>
      <artifactId>contracts</artifactId>
      <version>${web3j.version}</version>
    </dependency>
  </dependencies>

</project>
```

### 2. Create a new class to load an ERC20 Smart Contract wrapper

ERC20 is a standard, so there is no need to manually generate a [Smart Contract wrapper](https://kauri.io/article/84475132317d4d6a84a2c42eb9348e4b), Web3j includes it by default.

However, you do need to connect Web3j to an Ethereum blockchain and configure a wallet to sign transactions.

In this article, we connect to a local Ganache blockchain (exposed by default on `http://localhost:8545`) and use the first Ganache test account (read the Ganache startup logs to find this information) which received 100 JVM tokens during deployment.

```java
// Connect Web3j to the Blockchain
String rpcEndpoint = "http://localhost:8545";
Web3j web3j = Web3j.build(new HttpService(rpcEndpoint));

// Prepare a wallet
String pk = "0x5bbbef76458bf30511c9ee6ed56783644eb339258d02656755c68098c4809130";
// Account address: 0x1583c05d6304b6651a7d9d723a5c32830f53a12f
Credentials credentials = Credentials.create(pk);

// Load the contract
String contractAddress = "0xe4F275cE131eF87Cb8bF425E02D9215055e9F875";
ERC20 javaToken = ERC20.load(contractAddress, web3j, credentials, new DefaultGasProvider());
```

For more complex scenarios, you can load the contract with a specific `TransactionManager` and Gas parameters using `ERC20.load(contractAddress, web3j, transactionManager, gasPrice, gasLimit)`

### 3. Get token information

Once we have loaded our ERC20 token contract, we can start requesting information stored on this contract such as the number of decimal or the balance of an account in JVM tokens.

The following code retrieves the information we configured in our contract earlier.

```java
String symbol = javaToken.symbol().send();
String name = javaToken.name().send();
BigInteger decimal = javaToken.decimals().send();

System.out.println("symbol: " + symbol);
System.out.println("name: " + name);
System.out.println("decimal: " + decimal.intValueExact());
```

![](https://i.imgur.com/LP872u8.png)

More importantly, we can retrieve the token balance of an account.

```java
BigInteger balance1 = javaToken.balanceOf("0x1583c05d6304b6651a7d9d723a5c32830f53a12f").send();
System.out.println("balance (0x1583c05d6304b6651a7d9d723a5c32830f53a12f)="+balance1.toString());

BigInteger balance2 = javaToken.balanceOf("0x0db6b797e64666d4b36b13e5dc6fcd4661893ac8").send();
System.out.println("balance (0x0db6b797e64666d4b36b13e5dc6fcd4661893ac8)="+balance2.toString());
```

![](https://i.imgur.com/02ImlCO.png)

The account `0x1583c05d6304b6651a7d9d723a5c32830f53a12f` is Ganache's first account, the one that deployed the contract and received 100 tokens during deployment. While `0x0db6b797e64666d4b36b13e5dc6fcd4661893ac8` represents Ganache's second account that didn't receive any token.

## Transfer tokens

To interact with the token, the `ERC20` class offers all the functionalities needed like `transfer`, `transferFrom` and `approve`.

For example, we can transfer 25 JVM tokens to `0x0db6b797e64666d4b36b13e5dc6fcd4661893ac8` by signing and sending a transaction from our account configured as Credentials (`0x1583c05d6304b6651a7d9d723a5c32830f53a12f`).

```java
TransactionReceipt receipt = javaToken.transfer("0x0db6b797e64666d4b36b13e5dc6fcd4661893ac8", new BigInteger("25")).send();
System.out.println("Transaction hash: "+receipt.getTransactionHash());

BigInteger balance1 = javaToken.balanceOf("0x1583c05d6304b6651a7d9d723a5c32830f53a12f").send();
System.out.println("balance (0x1583c05d6304b6651a7d9d723a5c32830f53a12f)="+balance1.toString());

BigInteger balance2 = javaToken.balanceOf("0x0db6b797e64666d4b36b13e5dc6fcd4661893ac8").send();
System.out.println("balance (0x0db6b797e64666d4b36b13e5dc6fcd4661893ac8)="+balance2.toString());
```

![](https://i.imgur.com/hlknQTK.png)

## Get notified of transfer events

Finally, we cover how to subscribe to specific events generated by the ERC20 contract so we can react to any activity from it.

You can retrieve specific events for a given transaction via the method `getTransferEvents`:

```java
List<ERC20.TransferEventResponse> events = javaToken.getTransferEvents(receipt);
events.forEach(event
 -> System.out.println("from: " + event._from + ", to: " + event._to + ", value: " + event._value));
```

![](https://i.imgur.com/sHkle8C.png)

We can also add [RxJava](https://github.com/ReactiveX/RxJava) as a dependency to subscribe continuously to any new events via `transferEventFlowable`.

```java
javaToken.transferEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
 .subscribe(event
 -> System.out.println("from: " + event._from + ", to: " + event._to + ", value: " + event._value));
```

![](https://i.imgur.com/9zomWIV.png)

For more information about subscribing to events with Web3j, I highly recommend reading this article: [Interacting with an Ethereum Smart Contract in Java](https://kauri.io/article/14dc434d11ef4ee18bf7d57f079e246e)