---
title: Truffle  Smart Contract Compilation & Deployment
summary: Truffle- Smart Contract Compilation & Deployment This article covers the steps required to setup Truffle and use it to compile, deploy and interact with our Bounties.vy smart contract. You should see that this is a much easier process than the manual steps we learned in the previous article. __ You can find the source code used in this tutorial here What is Truffle? To recap, Truffle is a Node based development framework which is currently the most used and actively maintained smart contract dep
authors:
  - Onuwa Nnachi Isaac (@iamonuwa)
date: 2019-08-29
some_url: 
---

# Truffle  Smart Contract Compilation & Deployment


## Truffle: Smart Contract Compilation & Deployment

This article covers the steps required to setup Truffle and use it to compile, deploy and interact with our _Bounties.vy_ smart contract. You should see that this is a much easier process than the manual steps we learned in the previous article.
__
[You can find the source code used in this tutorial here](https://github.com/iamonuwa/bounties)

### What is Truffle?

To recap, [Truffle](https://truffleframework.com) is a Node based development framework which is currently the most used and actively maintained smart contract deployment tool.

#### Installing Truffle

You need to have NodeJS 11.0+ installed, and then run:

```shell
npm install -g truffle
```

Read more on [installing truffle](https://truffleframework.com/docs/truffle/getting-started/installation).

### Vyper Compiler

With Vyper smart contracts, truffle uses the vyper compiler. Earlier in the series we learnt how to install the vyper compiler and compile our smart contract manually. Truffle already comes prepackaged with a version of the vyper compiler:

```shell
$ truffle version
Truffle v5.0.0-beta.2 (core: 5.0.0-beta.2)
Solidity v0.5.0 (vyper-js)
Node v11.4.0
```

Above we see truffle version v5.0.0-beta.2 comes packaged with vyper compiler v0.5.0.

### Creating a Truffle Project

To use most Truffle commands, you need to run them against an existing Truffle project. First create a Truffle project:

```shell
$ mkdir truffle-vyper
$ cd truffle-vyper
$ truffle init
Downloading...
Unpacking...
Setting up...
Unbox successful. Sweet!

Commands:

  Compile:        truffle compile
  Migrate:        truffle migrate
  Test contracts: truffle test
```

The `truffle init` command sets up a truffle project with the standard project directory structure:

![](https://ipfs.infura.io/ipfs/QmZkbLeZiw7CNh9VFg2cLXhRuM1MYrg5whCnGmXHr5ZHVV)

-   **contracts/**: store original codes of the smart contract. We will place our Bounties.vy file here.
-   **migrations/**: instructions for deploying the smart contract(s) in the **contracts** folder.
-   **test/**: tests for your smart contract(s), truffle supports tests written in Javascript, we cover writing tests in the next article.
-   **truffle.js**: configuration file.
-   **truffle-config.js**: configuration document for windows users.

**Note For Windows Users**: The **truffle.js** configuration file is not created. Whenever the tutorial updates **truffle.js**, apply the changes to the **truffle-config.js** file instead.

Create a **Bounties.vy** file in the **contracts** folder and copy the contents of [Bounties.vy](https://github.com/iamonuwa/Bounties/blob/master/contracts/Bounties.vy) which we previously developed.

![](https://ipfs.infura.io/ipfs/QmW2Rv8J5EP5eEDbxtp5LKCyskM8CXmMZ3WRYNBRoikpqB)

### Compile

We’re now ready to compile our smart contract.

```shell
$ truffle compile
Compiling ./contracts/Migrations.sol...
Writing artifacts to ./build/contracts

Compiling ./contracts/Bounties.vy...
Writing artifacts to ./build/contracts
```

That's it! The 2 smart contracts in the **contracts** folder were both compiled and the artifacts written to **./build/contracts**.

![](https://ipfs.infura.io/ipfs/QmTApNdhmZ7wxd2HwvZN9ynHcjFuqXhUkuTBF8y5NmwqNL)

The **Bounties.json** file stores the ABI and also the bytecode for deployment and linking, however, this truffle artifact contains additional features that make interacting with and deploying smart contracts using truffle a smoother experience. You can read more about the [truffle-artifactor here](https://github.com/trufflesuite/truffle/tree/develop/packages/truffle-artifactor).

### Deployment

#### Development Blockchain: Ganache-CLI

In order to deploy our smart contracts, we need an Ethereum environment to deploy to. For this, we use [Ganache-CLI](https://github.com/trufflesuite/ganache-cli) to run a local development environment.

##### Installing Ganache-CLI

**NOTE**: If you have a windows machine you need to install the windows developer tools first:

```shell
npm install -g windows-build-tools
```

Then run:

```shell
npm install -g ganache-cli
```

Start the local development blockchain environment:

```shell
$ ganache-cli
Ganache CLI v6.3.0 (ganache-core: 2.4.0)

Available Accounts
==================
(0) 0x00b627e81d8abb29872729efaa999baef422e62a (~100 ETH)
(1) 0xa21f7a04f7cdd94a62d31380645e217ea83c5200 (~100 ETH)
(2) 0xa6052ae97e996d3eff54edf43c6d51165133690e (~100 ETH)
(3) 0xb94939ab58ea26bcf8f7f30e41274dda608db46c (~100 ETH)
(4) 0x95103adb218f5bf34af39056b0f95198ea9fb0bf (~100 ETH)
(5) 0x93e897c52b4cfe3f3919c87555001a56a9a51e41 (~100 ETH)
(6) 0xbd00518e1ef249124d981aa29b3dc89551e14e6f (~100 ETH)
(7) 0x81e90cac7a1b99e497540b958f0a1b44c7cbef35 (~100 ETH)
(8) 0xa98a571368af8e4f4ac75ef068751fdd82d5c7b4 (~100 ETH)
(9) 0x6fd147510a20004b582ad77c2f559b4aa111e068 (~100 ETH)

Private Keys
==================
(0) 0xdb11b72ecca77a37ba0951c6677dcd1ad3eaff1614cc12102e951636990cfc35
(1) 0x0d4c985351a3ceeaee7276ce2195dd5e2c510f3fc5122a53b28d52d54a7faf83
(2) 0x1f7c0ad5c96e42297a6819589cad6f8a7224c195370a24da13e2edc45c8841e7
(3) 0x42752d30c3668602484ebc56f67289674ee01ad1aa8726559b63911e6f6f2083
(4) 0x5f3366c028eadf8632e0e82f81e173e42f7ef1130043b89a6af2b76843053622
(5) 0x2022a5354441461903cf1ba953d0e44b499ec9d4746a1da635e81e583cf794d7
(6) 0x19ccfb7db8e2f53c8f1f767d5951027677a5d5553d9a2e9ff632a759814d52e9
(7) 0x045c90d4e38e12e9135b3658abe764f06bc990551afa6ada6672ef4dd1a3881a
(8) 0x0664d4849521b93ef1c545b164994460b465bae938500f8377f81a882e012b08
(9) 0xf25afab4cae6cd8a59b5555167a79e17b6f262bea62c5cff301b20a556ff2d8f

HD Wallet
==================
Mnemonic:      music female happy coconut census mix october supply pact indoor nothing rely
Base HD Path:  m/44'/60'/0'/0/{account_index}

Gas Price
==================
20000000000

Gas Limit
==================
6721975

Listening on localhost:8545
```

The above output shows ganache-cli has started and is listening on `localhost:8545`.

#### Migrations

In order to deploy to our local development environment, we need to configure truffle. If we take a look at the existing file **1_initial_migration.js**, it contains the following:

```javascript
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
```

This is the first step in the migration or deployment process. It tells truffle to first deploy the Migrations contract.

Migrations contract record the history of previous run migrations/deployments on chain, this enables truffle to incrementally update deployments to a specified environment.

You can read more about [truffle migrations here](https://truffleframework.com/docs/truffle/getting-started/running-migrations).

#### Configuring Truffle

First, we need to create a file in the **migrations** folder with the name **2_deploy_contracts.js**

The **2** indicates that this is the second step run in the migration process.

Copy the following extract into the **2_deploy_contracts.js** file:

```javascript
var Bounties = artifacts.require("Bounties");

module.exports = function(deployer) {
  deployer.deploy(Bounties);
};
```

![](https://ipfs.infura.io/ipfs/QmV88d8DHY1dt9gXi4rDdDHpokts3HixjfW695kisLQJUU)

Update the **truffle-config.js** configuration file with the following extract:

```javascript
module.exports = {
  networks: {
    development: {
      network_id: "*",
      host: 'localhost',
      port: 8545
    }
  }
};
```

This tells truffle that the default development environment to deploy to is located at `localhost:8545`, this is the address of our ganache-cli local development environment.

![](https://ipfs.infura.io/ipfs/QmQJthzhQYDNWRyahwkvqQc929ZpE9pXe94bvyiC6RUcKy)

That's it, Truffle is now configured to deploy to your local ganache-cli development environment.

#### Deploy

To deploy run the `truffle migrate` command:

```javascript
$ truffle migrate

Starting migrations...
======================
> Network name:    'development'
> Network id:      1561664364036
> Block gas limit: 6721975


1_initial_migration.js
======================

    Deploying 'Migrations'
    ----------------------
    > transaction hash:    0x1b726b8c67c078d8ad873d56f4a0a8255249821e071d6cdb3a999e5a252170fb
    > Blocks: 0            Seconds: 0
    > contract address:    0x88C18644EdDf0511Ae2E068DdA89626bBA64dC42
    > account:             0x00b627E81d8abb29872729efAa999BAef422e62A
    > balance:             99.97728622
    > gas used:            284908
    > gas price:           20 gwei
    > value sent:          0 ETH
    > total cost:          0.00569816 ETH


    > Saving migration to chain.
    > Saving artifacts
    -------------------------------------
    > Total cost:          0.00569816 ETH


2_deploy_contracts.js
=====================

    Deploying 'Bounties'
    --------------------
    > transaction hash:    0xb2b29164f7f1595c7a6f726cdedc2d1688b5595569240beabef58f93203a2447
    > Blocks: 0            Seconds: 0
    > contract address:    0xBfaCF6de455c68DfeCa3d235dDd5cdd202C75ee7
    > account:             0x00b627E81d8abb29872729efAa999BAef422e62A
    > balance:             99.96650944
    > gas used:            496805
    > gas price:           20 gwei
    > value sent:          0 ETH
    > total cost:          0.0099361 ETH


    > Saving migration to chain.
    > Saving artifacts
    -------------------------------------
    > Total cost:           0.0099361 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.01563426 ETH
```

The above output show the `transactionHash` of the deployment of the **Bounties.vy** contract as `0xb2b29164f7f1595c7a6f726cdedc2d1688b5595569240beabef58f93203a2447`, and the address of the Bounties smart contract as `0xBfaCF6de455c68DfeCa3d235dDd5cdd202C75ee7`.

We can double check the transaction receipt via the truffle console:

```shell
$ truffle console

truffle(development)> web3.eth.getTransactionReceipt('0xb2b29164f7f1595c7a6f726cdedc2d1688b5595569240beabef58f93203a2447')
{ transactionHash:
    '0xb2b29164f7f1595c7a6f726cdedc2d1688b5595569240beabef58f93203a2447',
  transactionIndex: 0,
  blockHash:
    '0x55a7cb82ecf12a0df6435632cdc383a511d2847eae719ea409529da4fb27d5ae',
  blockNumber: 7,
  from: '0x00b627e81d8abb29872729efaa999baef422e62a',
  to: null,
  gasUsed: 496805,
  cumulativeGasUsed: 496805,
  contractAddress: '0xBfaCF6de455c68DfeCa3d235dDd5cdd202C75ee7',
  logs: [],
  status: true,
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  v: '0x1c',
  r:
    '0x40d0580d30e1df87d2b2c32a17ef7a250d152031f268d792d755dcf45199ded5',
  s:
    '0x0e15df16152ceea4ff6af203eceae1d1bc69bbf545ed7fc1816a9dc208486afa' }
```

### Interacting With the Contract

We can use the truffle console to interact with our deployed smart contract.

Lets attempt to issue a bounty. To do this we need to set the `string _data` argument to some bytes32 equivalent of “some requirements", prepend 0x to it (0x736f6d6520726571756972656d656e7473) and set the `timestamp _deadline` argument to a unix timestamp in the future e.g “1691452800” August 8th 2023.

```shell
Bounties.deployed().then(instance => { instance.issueBounty('0x736f6d6520726571756972656d656e7473', '1691452800', { value: 100000, gas: 3000000}).then(tx => console.log(tx))});
undefined
truffle(development)> { tx:
    '0x7689bc977e6510724043a44a4cca31b9bc81e06b646d279340a873dc13900ae4',
  receipt:
    { transactionHash:
      '0x7689bc977e6510724043a44a4cca31b9bc81e06b646d279340a873dc13900ae4',
      transactionIndex: 0,
      blockHash:
      '0x2c14d6f9e6a192a4b0dd44eb80d49a0f461e0cf1749aefbc4f6d7b79716d555f',
      blockNumber: 9,
      from: '0x00b627e81d8abb29872729efaa999baef422e62a',
      to: '0xbfacf6de455c68dfeca3d235ddd5cdd202c75ee7',
      gasUsed: 125674,
      cumulativeGasUsed: 125674,
      contractAddress: null,
      logs:
      [ { logIndex: 0,
          transactionIndex: 0,
          transactionHash:
            '0x7689bc977e6510724043a44a4cca31b9bc81e06b646d279340a873dc13900ae4',
          blockHash:
            '0x2c14d6f9e6a192a4b0dd44eb80d49a0f461e0cf1749aefbc4f6d7b79716d555f',
          blockNumber: 9,
          address: '0xBfaCF6de455c68DfeCa3d235dDd5cdd202C75ee7',
          type: 'mined',
          id: 'log_d9f37d2d',
          event: 'BountyIssued',
          args: [Result] } ] }
```

In the above extract we use the `Bounties.deployed()` method to return an instance of the latest deployed Bounties contract on the network.

```shell
Bounties.deployed().then(function(instance) {});
```

We can then call the `issueBounty` function on the retrieved instance.

```shell
instance.issueBounty("0x736f6d6520726571756972656d656e7473","1691452800",{ from: web3.eth.accounts[0], value: web3.utils.toWei('1', "ether"), gas: 3000000 }).then(function(tx) { console.log(tx) });
```

### Test Network: Rinkeby

We can also configure truffle to deploy to one of the public test Ethereum networks rather than a local development environment. Earlier in the series, we introduced the following public Ethereum test networks:

-   Rinkeby
-   Kovan
-   Ropsten

This part of the article covers deployment to the **Rinkeby** environment, however, you can use the instructions to deploy to either **Kovan** or **Ropsten**.

#### Infura

In order to send transactions to a public network, you need access to a network node. [Infura](https://infura.io) is a public hosted Ethereum node cluster, which provides access to its nodes via an API

If you do not already have an Infura account, [register for an account](https://infura.io/register).

Once logged in, create a new project to generate a project ID, this allows you to track the usage of each individual dApp you deploy.

![](https://ipfs.infura.io/ipfs/QmYMAmUQavX3Dkzj9CUWonGRzTj7JEZZbpfNtJNs9pDiL8)

Once your project is created, select the environment to deploy to, in this case **Rinkeby**, from the _Endpoint_ drop down and copy the endpoint URL for future reference:

![](https://ipfs.infura.io/ipfs/QmdkpNG8CAJnFjRZcC616JY1CXDFoWMQiRREdyryRBkX6p)

Make sure you save this token and keep it private!

#### HDWallet Provider

Infura, for security reasons, does not manage your private keys. We need to add the [Truffle HDWallet Provider](https://github.com/trufflesuite/truffle-hdwallet-provider) so that Truffle can sign deployment transactions before sending them to an Infura node.

We can install the HDWallet provider via npm into our project directory:

```shell
npm install truffle-hdwallet-provider@web3-one --save
```

#### Generate Mnemonic

To configure the HDWallet Provider we need to provide a mnemonic which generates the account used for deployment.

If you already have a mnemonic, skip this part, or you can generate a mnemonic using an [online mnemonic generator](https://iancoleman.io/bip39/).

In the BIP39 Mnemonic code form:

1.  Select “ETH — Ethereum” from the “Coin” drop down
2.  Select a minimum of “12” words
3.  Click the “Generate” button to generate the mnemonic
4.  Copy and save the mnemonic located in the field “BIP39”, **remember to keep this private as it is the seed that can generate and derive the private keys to your ETH accounts**

![](https://ipfs.infura.io/ipfs/Qmc1DM8UoVLFaBaYb5Yo27kSgWhD52xgiGKune1NybZYNg)

5.  Scroll down the page to the _Derived Addresses_ section and copy and save the _Address_ this is your Ethereum deployment account.

![](https://ipfs.infura.io/ipfs/Qmd7EKVWCuC7rRWGJeVf2RBtptSbjjgZ6Dmkqw8GQyEmd7)

Above the address we are using is: **0x56fB94c8C667D7F612C0eC19616C39F3A50C3435**

#### Configure Truffle For Rinkeby

Now we have all the pieces set up, we need to configure truffle to use the HDWallet Provider to deploy to the **Rinkeby** environment. To do this we will need to edit the **truffle.js** configuration file.

First let's create a **secrets.json** file, this file stores your mnemonic and Infura API key so the HDWallet provider can load it.

**NOTE: Remember not to check this file into any public repository!**

![](https://ipfs.infura.io/ipfs/QmQ2dyEGmqJXV3epH8yrfqpDcNKYU8FzXYqHrFcq6vcE23)

Next in the **truffle.js** configuration file add the following lines to define HDWalletProvider and load our mnemonic from our **secrets.json** file:

```javascript
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
let secrets;
if (fs.existsSync('secrets.json')) {
  secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
}
```

Next also in **truffle.js** we add a new network configuration so Truffle understands where to find the **Rinkeby** network.

```javascript
rinkeby: {
      provider: new HDWalletProvider(secrets.mnemonic, 'https://rinkeby.infura.io/v3/'+secrets.infuraApiKey),
      network_id: '4'
}
```

Here we define a provider, which instantiates a HDWalletProvider for the **Rinkeby** network. The HDWalletProvider takes two arguments:

1.  **mnemonic:** The mnemonic required to derive the private key to the deployment account
2.  **network endpoint:** The http endpoint of the required network

We also set the network ID of the environment, in this case we set it to 4 which is **Rinkeby**.

![](https://ipfs.infura.io/ipfs/Qmc99mzUYiTgAjdciqMvEK3VzZXW79dnUcBgHKYEgaMFct)

#### Fund Your Account

We’re almost ready to deploy! We need to make sure we have enough funds in our account to complete the transaction. We can fund our **Rinkeby** test account using the [Rinkeby ETH faucet](https://faucet.rinkeby.io/).

To request ETH from the faucet we need to complete the following steps:

1.  Post publicly our Ethereum deployment address from one of the following social network accounts: Twitter, Google+ or Facebook, in this example we use Twitter
2.  Copy the link to the social media post

![](https://ipfs.infura.io/ipfs/QmNbxv36FC2VPufEiD5dT44QEem4f8oH6RvA3rXAUfwWiy)

3.  Paste the link into the [Rinkeby ETH faucet](https://faucet.rinkeby.io/) and select the amount of ETH to send.

![](https://ipfs.infura.io/ipfs/Qme6jfEALdVa9TeyN3dTp4toRqajhKszTHHgmoup3326QK)

4.  Check the Rinkeby etherscan for the status of the transaction.

[https://rinkeby.etherscan.io/address/<YOUR ETHEREUM DEPLOYMENT ADDRESS>](https://rinkeby.etherscan.io/address/0x56fB94c8C667D7F612C0eC19616C39F3A50C3435)

![](https://ipfs.infura.io/ipfs/QmSXhyga6tHcjjwascZcuWknrVL12CGRyeFpmtaEmXmWj6)

#### Deploy

To deploy run the `truffle migrate` command whilst specifying the network to deploy to. The networks are defined in the **truffle.js** configuration file we configured earlier :

```shell
$ truffle migrate --network rinkeby

Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 7002047


1_initial_migration.js
======================

    Deploying 'Migrations'
    ----------------------
    > transaction hash:    0x813f4fce67c5520a78f8ccac95f5f50ad2cbb8d0eaea40fdbf337191adcfa838
    > Blocks: 0            Seconds: 8
    > contract address:    0xC8419C85db7BE10AEf7FcDA7017968B6A0f92995
    > account:             0x56fB94c8C667D7F612C0eC19616C39F3A50C3435
    > balance:             18.436499104
    > gas used:            283300
    > gas price:           20 gwei
    > value sent:          0 ETH
    > total cost:          0.005666 ETH


    > Saving migration to chain.
    > Saving artifacts
    -------------------------------------
    > Total cost:            0.005666 ETH


2_deploy_contracts.js
=====================

    Deploying 'Bounties'
    --------------------
    > transaction hash:    0xd1d82ac79006b6704d4f822e41f95d9561ffc2b249d6687dad8d9b84257c505a
    > Blocks: 2            Seconds: 28
    > contract address:    0x584EC00989488fBC3A10e4114B57C3246D557b48
    > account:             0x56fB94c8C667D7F612C0eC19616C39F3A50C3435
    > balance:             18.411356704
    > gas used:            1215092
    > gas price:           20 gwei
    > value sent:          0 ETH
    > total cost:          0.02430184 ETH


    > Saving migration to chain.
    > Saving artifacts
    -------------------------------------
    > Total cost:          0.02430184 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.02996784 ETH
```

And that's it! We have now finally deployed our _Bounties.vy_ contract to the public testnet environment Rinkeby.

Later in the series, we’ll cover how to write tests within the Truffle framework, and how we can also add a frontend to our dApp so users can interact with our smart contract on the public network!

### Next Steps

<!-- TODO: Update -->

-   Read the next guide: [Truffle: Testing Your Smart Contract](https://kauri.io/article/ebc4a29cc1c044fdba99631796ffbd93/v2/truffle:-testing-your-smart-contract)
-   Learn more about the Truffle suite of tools from the [website](https://truffleframework.com/)

> If you enjoyed this guide, or have any suggestions or questions, let me know in the comments.
>
> If you have found any errors, feel free to update this guide by selecting the **'Update Article'** option in the right hand menu, and/or [update the code](https://github.com/iamonuwa/Bounties)



---

- **Kauri original title:** Truffle  Smart Contract Compilation & Deployment
- **Kauri original link:** https://kauri.io/truffle:-smart-contract-compilation-and-deploymen/1ac9d10358b94945b06b9c893cd5bfcf/a
- **Kauri original author:** Onuwa Nnachi Isaac (@iamonuwa)
- **Kauri original Publication date:** 2019-08-29
- **Kauri original tags:** smart-contract, truffle, vyper
- **Kauri original hash:** QmVdaJPKMoyp2RVeoz2CGXFxWvH7JWvd5VbyPmqXbEhdkX
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



