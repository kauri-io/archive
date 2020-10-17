---
title: Truffle- Smart Contract Compilation & Deployment
summary: Intro Earlier in the series, we took a look at how to manually deploy and interact with our Bounties.sol smart contract on a local development blockchain. We also briefly touched on development frameworks which hide the complexity of these repetitive tasks and allow us to focus on developing dApps. This article will walk through the steps required to setup Truffle and use it to compile, deploy and interact with our Bounties.sol smart contract. You should see that this is a much easier process th
authors:
  - Josh Cassidy (@joshorig)
date: 2019-05-03
some_url: 
---

##Intro

Earlier in the series, we took a look at how to manually deploy and interact with our Bounties.sol smart contract on a local development blockchain.

We also briefly touched on development frameworks which hide the complexity of these repetitive tasks and allow us to focus on developing dApps.

This article will walk through the steps required to setup Truffle and use it to compile, deploy and interact with our Bounties.sol smart contract. You should see that this is a much easier process than the manual steps we learned in the previous article.

[The source code used in this tutorial can be found here] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/truffle-compilation-and-deploy)

## What is Truffle?

Just to recap, Truffle is a Node based development framework which is currently the most used and actively maintained in the space.

[https://truffleframework.com](https://truffleframework.com)

[Documentation] (https://truffleframework.com/docs)

**Installing Truffle**

You will need to have NodeJS 11.0+ installed
```
npm install -g truffle
```
Read more on [installing truffle here] (https://truffleframework.com/docs/truffle/getting-started/installation)

## Solc Compiler

When compiling our smart contracts truffle uses the solc compiler, earlier in the series we learnt have to install the solc compiler and compile our smart contract manually. However, Truffle already comes prepackaged with a version of the solc compiler:
```
$ truffle version
Truffle v5.0.0-beta.2 (core: 5.0.0-beta.2)
Solidity v0.5.0 (solc-js)
Node v11.4.0
```
Above we see truffle version v5.0.0-beta.2 comes packaged with solc compiler v0.5.0.

## Creating a Truffle Project

To use most Truffle commands, you need to run them against an existing Truffle project. So the first step is to create a Truffle project:
```
$ mkdir dapp-series-bounties
$ cd dapp-series-bounties
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
The **truffle init** command sets up a truffle project with the standard project directory structure:

![](https://api.beta.kauri.io:443/ipfs/QmZkbLeZiw7CNh9VFg2cLXhRuM1MYrg5whCnGmXHr5ZHVV)

* **contracts/**: store original codes of the smart contract. We will place our Bounties.sol file here.
* **migrations/**: instructions for deploying the smart contract(s) in the “contracts” folder.
* **test/**: tests for your smart contract(s), truffle supports tests written in both Javascript and Solidity, well learn about writing tests in the next article
* **truffle.js**: configuration file.
* **truffle-config.js**: configuration document for windows user.

*Note For Windows Users: The **truffle.js** configuration file will not appear. Whenever **truffle.js** is updated in the tutorial, apply it to the **truffle-config.js** file instead. 

Now let's create a Bounties.sol file in the contracts folder and copy the contents of [Bounties.sol] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/blob/master/remix-bounties-smartcontract/Bounties-complete.sol) which we previously developed.

![](https://api.beta.kauri.io:443/ipfs/QmW2Rv8J5EP5eEDbxtp5LKCyskM8CXmMZ3WRYNBRoikpqB)

## Compile

We’re now ready to compile our smart contract.
```
$truffle compile
Compiling ./contracts/Bounties.sol...
Compiling ./contracts/Migrations.sol...
Writing artifacts to ./build/contracts
```
That's it! The 2 smart contracts in the **contracts** folder:

* Bounties.sol
* Migrations.sol

We’re both compiled and the artifacts were written to *./build/contracts*

![](https://api.beta.kauri.io:443/ipfs/QmTApNdhmZ7wxd2HwvZN9ynHcjFuqXhUkuTBF8y5NmwqNL)

If you review the **Bounties.json** file, you will find it is similar to the output we got when we manually compiled our Bounties.sol smart contract the previous article. It stores the ABI and also the bytecode for deployment and linking, however, this truffle artifact contains additional features that make interacting with and deploying smart contracts using truffle a smoother experience. You can read more about the [truffle-artifactor here.](https://github.com/trufflesuite/truffle/tree/develop/packages/truffle-artifactor)

## Deployment

**Development Blockchain: Ganache-CLI**

In order to deploy our smart contracts, we’re going to need an Ethereum environment to deploy to. For this, we will use Ganache-CLI to run a local development environment.

**Installing Ganache-CLI**

NOTE: If you have a windows machine you will need to install the windows developer tools first

```
npm install -g windows-build-tools
```
```
npm install -g ganache-cli
```
So let's start our local development blockchain environment:
```
$ ganache-cli
Ganache CLI v6.1.3 (ganache-core: 2.1.2)
Available Accounts
==================
(0) 0x11541c020ab6d85cb46124e1754790319f6d8c75
(1) 0xc44914b445ced4d36f7974ec9b07545c6b39d58d
(2) 0x443078060573a942bbf61dcdae9c711c9e0f3426
(3) 0x509fc43d6b95b570d31bd1e76b57046131e815ab
(4) 0xaf3464e80e8981e868907e39df4db9116518b0b8
(5) 0x9894e6253606ee0ce9e0f32ae98cacf9cedc580c
(6) 0x8dc4480b3d868bbeb6caf7848f60ff2866d5e98d
(7) 0x5da85775ca3cdf0048bff35e664a885ed2e02ff7
(8) 0x1acc13d7d69ac44a96c7ee60aeee13af6b001783
(9) 0x9c112d3a812b47909c2054a14fefbbb7a87fb721
Private Keys
==================
(0) 08f8aaea81590cea30e780666c8bdc6a3a17144130dcf20b07b55229b2d5996b
(1) b8ef92de39bcaf83eb7622ba62c2dd055f0d0c62053ab381aa5902fdd8698f91
(2) 8d0a626a420f68c6a1c99025fe4c17e02b8853feefd82a908bebdb994c589e31
(3) 7d6a122d935f9244b47919a24e218d9bb6d54eff63de5eb120405e3194bf7658
(4) 738d3ddcd659cc45ddf4044bc512ff841717af3cd0f27f77338bc759d6a9769d
(5) e9f82c125a8b9ca386b7cd59101ba4105a7c25d30727fdb937391798a01211ef
(6) 2c70bd342bf610cbc974b24ec6f11260cebd537cdde65d7922971a7d4858cc5b
(7) 8f27ce51b5b4784a75cddc2428861dc07c3dd4ceac81c2f32eb4d8f86ff51ca0
(8) 377ab95e5c5fbe97f8a298b4a108062b063e9ce5fa7e513691494f5458419f7a
(9) 4919c7b8934160a1ec197cf19474d326486d63ced25dfb65f0a692bdba3d2208
HD Wallet
==================
Mnemonic:      attend frost dignity wheat shell field comic tooth include enter border theory
Base HD Path:  m/44'/60'/0'/0/{account_index}
Gas Price
==================
20000000000
Gas Limit
==================
6721975
Listening on localhost:8545
```
The above output shows ganache-cli has started and is listening on **localhost:8545**

**Migrations**

In order to deploy to our local development environment, we’ll need to configure truffle:

If we take a look at the existing file **1_initial_migration.js**
```
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
```
This will be the first step in the migration or deployment process. It tells truffle to first deploy the Migrations contract.

Migrations contract record the history of previous run migrations/deployments on chain, this enables truffle to incrementally update deployments to a specified environment.

You can read more about [truffle migrations here] (https://truffleframework.com/docs/truffle/getting-started/running-migrations)

**Configuring Truffle**

1. First, we need to create a file in the **migrations** folder with the name **2_deploy_contracts.js**

The **2** indicates that this is the second step to be run in the migration process.

Copy the following extract into the **2_deploy_contracts.js** file:
```
var Bounties = artifacts.require("./Bounties.sol");

module.exports = function(deployer) {
  deployer.deploy(Bounties);
};
```
![](https://api.beta.kauri.io:443/ipfs/QmV88d8DHY1dt9gXi4rDdDHpokts3HixjfW695kisLQJUU)

2. Update the **truffle.js** configuration file with the following extract:
```
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
This tells truffle that the default development environment to deploy to is located at **host: localhost port: 8545** this is the address of our ganache-cli local development environment.

![](https://api.beta.kauri.io:443/ipfs/QmQJthzhQYDNWRyahwkvqQc929ZpE9pXe94bvyiC6RUcKy)

That's it, Truffle is now configured to deploy to your local ganache-cli development environment.

**Deploy**

To deploy simply run the **truffle migrate** command:
```
$ truffle migrate

Starting migrations...
======================
> Network name:    'development'
> Network id:      1544483960336
> Block gas limit: 6721975


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xe0b762d2bcd04328acb850a968ccddf9840d679069b9fb3afad8ff18baa12c57
   > Blocks: 0            Seconds: 0
   > contract address:    0x3e2823FCace78ffb5dbCA001541CD58F38837B10
   > account:             0xba342be2268F9eFd0415709d974957241E8EAE76
   > balance:             99.994334
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
   > transaction hash:    0xa3739a6d7e1609a1c48cbc805fb85553929574481c32206291e9b10d512f11ca
   > Blocks: 0            Seconds: 0
   > contract address:    0x2e9aC61B93149f62c88657eE84155b5AA6ba43cE
   > account:             0xba342be2268F9eFd0415709d974957241E8EAE76
   > balance:             99.9691916
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
The above output show the transactionHash of the deployment of the Bounties.sol contract as:

**0xa3739a6d7e1609a1c48cbc805fb85553929574481c32206291e9b10d512f11ca**

Also the address of the Bounties smart contract as:

**0x2e9aC61B93149f62c88657eE84155b5AA6ba43cE**

We can double check the transaction receipt via the truffle console
```
$ truffle console

truffle(development)> web3.eth.getTransactionReceipt("0x1cfa32323e31aa262ea61580cb544772a47b05c2b498544a1805d00eb530a27a")web3.eth.getTransactionReceipt("0xa3739a6d7e1609a1c48cbc805fb85553929574481c32206291e9b10d512f11ca")
{ transactionHash:
   '0xa3739a6d7e1609a1c48cbc805fb85553929574481c32206291e9b10d512f11ca',
  transactionIndex: 0,
  blockHash:
   '0x30e8b5e73fafb6a72ffe4feb0c8e1be76f339310dcb1a67c1a684e0219ea36d6',
  blockNumber: 3,
  gasUsed: 1215092,
  cumulativeGasUsed: 1215092,
  contractAddress: '0x2e9aC61B93149f62c88657eE84155b5AA6ba43cE',
  logs: [],
  status: true,
  logsBloom:
   '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' }
```
## Interacting With Our Contract

We can use the truffle console to interact with our deployed smart contract.

Lets attempt to issue a bounty. To do this we’ll need to set the `string _data` argument to some string “some requirements” and set the `uint64 _deadline` argument to a unix timestamp in the future e.g “1691452800” August 8th 2023.
```
Bounties.deployed().then(function(instance) { instance.issueBounty("some requirements","1691452800", { value: 100000, gas: 3000000}).then(function(tx) { console.log(tx) }) });
undefined
truffle(development)> { tx:
   '0x1d0178b09bda576fe5ff982cfffd9e8afef4c342c2508a37d3cc2a0ca852505a',
  receipt:
   { transactionHash:
      '0x1d0178b09bda576fe5ff982cfffd9e8afef4c342c2508a37d3cc2a0ca852505a',
     transactionIndex: 0,
     blockHash:
      '0xa6276bbd3598e7e1907960901b3475319288d90005031942dcc39947e8de71ce',
     blockNumber: 10,
     gasUsed: 118839,
     cumulativeGasUsed: 118839,
     contractAddress: null,
     logs: [ [Object] ],
     status: true,
     logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000040000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     rawLogs: [ [Object] ] },
  logs:
   [ { logIndex: 0,
       transactionIndex: 0,
       transactionHash:
        '0x1d0178b09bda576fe5ff982cfffd9e8afef4c342c2508a37d3cc2a0ca852505a',
       blockHash:
        '0xa6276bbd3598e7e1907960901b3475319288d90005031942dcc39947e8de71ce',
       blockNumber: 10,
       address: '0x2e9aC61B93149f62c88657eE84155b5AA6ba43cE',
       type: 'mined',
       id: 'log_6a11d837',
       event: 'BountyIssued',
       args: [Result] } ] }
```
In the above extract we use the Bounties.deployed() method to return an instance of the latest deployed Bounties contract on the network.
```
Bounties.deployed().then(function(instance) {});
```
We can then call the issueBounty function on the retrieved instance.
```
instance.issueBounty("some requirements","1691452800",{ from: web3.eth.accounts[0], value: web3.utils.toWei('1', "ether"), gas: 3000000 }).then(function(tx) { console.log(tx) });
```
We can call the **bounties** function with bountyId of 0 to double check the issueBounty function stored our data correctly:
```
Bounties.deployed().then(function(instance) { instance.bounties.call(0).then(function(result) { console.log(result) }) })
undefined
truffle(development)> Result {
  '0': '0xba342be2268F9eFd0415709d974957241E8EAE76',
  '1':
   BN {
     negative: 0,
     words: [ 13731200, 25, <1 empty item> ],
     length: 2,
     red: null },
  '2': 'some requirements',
  '3':
   BN {
     negative: 0,
     words: [ 0, <1 empty item> ],
     length: 1,
     red: null },
  '4':
   BN {
     negative: 0,
     words: [ 100000, <1 empty item> ],
     length: 1,
     red: null },
  issuer: '0xba342be2268F9eFd0415709d974957241E8EAE76',
  deadline:
   BN {
     negative: 0,
     words: [ 13731200, 25, <1 empty item> ],
     length: 2,
     red: null },
  data: 'some requirements',
  status:
   BN {
     negative: 0,
     words: [ 0, <1 empty item> ],
     length: 1,
     red: null },
  amount:
   BN {
     negative: 0,
     words: [ 100000, <1 empty item> ],
     length: 1,
     red: null } }
```

## Test Network: Rinkeby

We can also configure truffle to deploy to one of the public test Ethereum networks rather than a local development environment. Earlier in the series, we introduced the following public Ethereum test networks:

* Rinkeby
* Kovan
* Ropsten

This part of the article will discuss deployment to the **Rinkeby** environment, however, the instructions can be used to deploy to either **Kovan** or **Ropsten** also.

### Infura

In order to send transactions to a public network, you need access to a network node. Infura is a public hosted Ethereum node cluster, which provides access to its nodes via an API

[https://infura.io](https://infura.io)

If you do not already have an Infura account, the first thing you need to do is [register for an account] (https://infura.io/register).

Once logged in, create a new project to generate an API key, this allows you to track the usage of each individual dApp you deploy.

![](https://api.beta.kauri.io:443/ipfs/QmYMAmUQavX3Dkzj9CUWonGRzTj7JEZZbpfNtJNs9pDiL8)

Once your project is created, select the environment we will be deploying to, in this case **Rinkeby**, from the *Endpoint* drop down and copy the endpoint URL for future reference:

![](https://api.beta.kauri.io:443/ipfs/QmdkpNG8CAJnFjRZcC616JY1CXDFoWMQiRREdyryRBkX6p)

Make sure you save this token and keep it private!

Note: In updated versions of Infura, Api Key is now called 'project ID' and Api Secret is called 'project secert'.

**HDWallet Provider**

Infura, for security reasons, does not manage your private keys.We need to add the Truffle HDWallet Provider so that Truffle can sign deployment transactions before sending them to an Infura node.

[https://github.com/trufflesuite/truffle-hdwallet-provider](https://github.com/trufflesuite/truffle-hdwallet-provider)

We can install the HDWallet Priovider via npm
```
npm install truffle-hdwallet-provider@web3-one --save
```
Note: You should install the wallet provider inside your project directory. 

**Generate Mnemonic**

To configure the HDWallet Provider we need to provide a mnemonic which generates the account to be used for deployment.

If you already have a mnemonic, feel free to skip this part.

You can generate a mnemonic using an [online mnemonic generator](https://iancoleman.io/bip39/).

[https://iancoleman.io/bip39](https://iancoleman.io/bip39/)

In the BIP39 Mnemonic code form:

1. Select “ETH — Ethereum” from the “Coin” drop down
2. Select a minimum of “12” words
3. Click the “Generate” button to generate the mnemonic
4. Copy and save the mnemonic located in the field “BIP39”, **remember to keep this private as it is the seed that can generate and derive the private keys to your ETH accounts**

![](https://api.beta.kauri.io:443/ipfs/Qmc1DM8UoVLFaBaYb5Yo27kSgWhD52xgiGKune1NybZYNg)

5. Scroll down the page to the *Derived Addresses* section and copy and save the *Address* this will be your Ethereum deployment account.

**NOTE: Your private key will be displayed here, please keep this private.**

![](https://api.beta.kauri.io:443/ipfs/Qmd7EKVWCuC7rRWGJeVf2RBtptSbjjgZ6Dmkqw8GQyEmd7)

Above the address we’ll be using is: **0x56fB94c8C667D7F612C0eC19616C39F3A50C3435**

### Configure Truffle For Rinkeby

Now we have all the pieces set up, we need to configure truffle to use the HDWallet Provider to deploy to the **Rinkeby** environment. To do this we will need to edit the `truffle.js` configuration file.

First let's create a `secrets.json` file, this file will store your mnemonic and Infura API key so that it can be loaded by the hdwallet provider.

**NOTE: Remember not to check this file into any public repository!**

![](https://api.beta.kauri.io:443/ipfs/QmQ2dyEGmqJXV3epH8yrfqpDcNKYU8FzXYqHrFcq6vcE23)

Next in the `truffle.js` configuration file add the following lines to define HDWalletProvider and load our mnemonic from our `secrets.json` file:
```
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
let secrets;
if (fs.existsSync('secrets.json')) {
 secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
}
```
Next also in truffle.js we add a new network configuration so Truffle understands where to find the **Rinkeby** network.
```
rinkeby: {
      provider: new HDWalletProvider(secrets.mnemonic, 'https://rinkeby.infura.io/v3/'+secrets.infuraApiKey),
      network_id: '4'
}
```
Here we define a provider, which instantiates a HDWalletProvider for the **Rinkeby** network. The HDWalletProvider takes two arguments:

1. **mnemonic:** The mnemonic required to derive the private key to the deployment account
2. **network endpoint:** The http endpoint of the required network

We also set the network ID of the environment, in this case we set it to 4 which is **Rinkeby**.

![](https://api.beta.kauri.io:443/ipfs/Qmc99mzUYiTgAjdciqMvEK3VzZXW79dnUcBgHKYEgaMFct)

### Fund Your Account

We’re almost ready to deploy! However we need to make sure we have enough funds in our account to complete the transaction. We can fund our **Rinkeby** test account using the [**Rinkeby** ETH faucet] (https://faucet.rinkeby.io/):

To request ETH from the faucet we need to complete the following steps:

1. Post publicly our Ethereum deployment address from one of the following social network accounts: Twitter, Google+or Facebook, in this example we’ll be using Twitter

2. Copy the link to the social media post

![](https://api.beta.kauri.io:443/ipfs/QmNbxv36FC2VPufEiD5dT44QEem4f8oH6RvA3rXAUfwWiy)

3. Paste the link into the [*Rinkeby* ETH faucet] (https://faucet.rinkeby.io/) and select the amount of ETH to be sent

![](https://api.beta.kauri.io:443/ipfs/Qme6jfEALdVa9TeyN3dTp4toRqajhKszTHHgmoup3326QK)

4. Check the Rinkeby etherscan for the status of the transaction

 [https://rinkeby.etherscan.io/address/<YOUR ETHEREUM DEPLOYMENT ADDRESS>] (https://rinkeby.etherscan.io/address/0x56fB94c8C667D7F612C0eC19616C39F3A50C3435)

![](https://api.beta.kauri.io:443/ipfs/QmSXhyga6tHcjjwascZcuWknrVL12CGRyeFpmtaEmXmWj6)

**Deploy**

To deploy simply run the `truffle migrate` command whilst specifying the network to deploy to. The networks are defined in the `truffle.js` configuration file we configured earlier in this article:
```
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

And that's it! We have now finally deployed our Bounties.sol contract to the public testnet environment Rinkeby.

Later in the series, we’ll discuss how to write tests within the Truffle framework, and how we can also add a frontend to our dApp so users can interact with our smart contract on the public network!

## Next Steps
- Read the next guide: [Truffle: Testing Your Smart Contract](https://kauri.io/article/f95f956261494090be1aaa8227464773/truffle:-testing-your-smart-contract)
- Learn more about the Truffle suite of tools from the [website](https://truffleframework.com/)

>If you enjoyed this guide, or have any suggestions or questions, let me know in the comments. 

>If you have found any errors, feel free to update this guide by selecting the **'Update Article'** option in the right hand menu, and/or [update the code](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/truffle-writing-tests)





























