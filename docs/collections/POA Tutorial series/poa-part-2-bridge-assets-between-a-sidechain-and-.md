---
title: POA - Part 2 - Bridge assets between a sidechain and a mainchain
summary: This article is part of a POA tutorial series- POA - Part 1 - Develop and deploy a smart contract POA - Part 2 - Bridge assets between a sidechain and a maincha
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-01-21
some_url: 
---

# POA - Part 2 - Bridge assets between a sidechain and a mainchain

![](https://ipfs.infura.io/ipfs/QmbbW1gkfPqjgggfF96byCijSjT2QAeNwGkpj6yaHMNoT2)



This article is part of a **POA tutorial series**:

- [POA - Part 1 - Develop and deploy a smart contract]( https://kauri.io/article/549b50d2318741dbba209110bb9e350e)
- [POA - Part 2 - Bridge assets between a sidechain and a mainchain](https://kauri.io/article/19072f7340184628b47c0d86e7feac6d)
- POA - Part 3 - Meta-transaction [Coming soon]

-----------------------------------------------------

### Introduction 

[The POA Bridge](https://bridge.poa.net/) is a solution to transfer asset tokens (Native and ERC20/ERC677 tokens) between two Ethereum chains. 

An asset token usually has two purposes:

- A monetary use where a token can be traded, exchanged or just kept as a long term investment
- An application use where a token can be employed on a Dapp (voting, stacking, playing, etc...)

Both usages require different network properties to enable the best experience, the monetary use may need a strong  network security and liveness and an access to a large network of assets to facilitate trade while the application use needs faster and cheaper transactions for a better user experience.

As part of the layer 2 scalability solutions, sidechain and bridges implement this paradigm of two chains for two usages and try to solve the scalability and UX issues due to the Ethereum mainnet being usually considered too slow (15 tx/sec) and too expensive on gas fees to enable a good user experience for most of the use cases (games or social apps). In this context, the general flow is the following:

1. User buys token on the mainchain
2. User transfers his tokens to the sidechain via the bridge (double representation: locked on the mainchain and minted on the sidechain)
3. User uses the tokens in a fast and efficient way. Perhaps earn or lose some tokens from other users
4. User decides to exit his tokens from the sidechain and transfer them back to the mainchain via the bridge (tokens unlocked on the mainchain and burned on the sidechain)
5. User sells his tokens on the mainchain

![](https://ipfs.infura.io/ipfs/QmWH44b3xpJk1yEiLok7xPZw991J3SgxGaoQ6nj6a8GUhn)

In this tutorial, we will learn how to deploy a token on the two networks (RinkeBy network as mainchain and POA Sokol as sidechain) and then deploy and use the bridge (ERC20 to ERC20) to let a user transfers his assets from one network to another.

-----------------------------------------------------

### Requirements

In order to start, you will need the following programs installed on your machine:

- Git
- NodeJS/NPM
- Yarn
- Docker and Docker-Compose
- [Metamask](https://metamask.io/) (Browser extension)
- [Truffle](https://truffleframework.com/)

```shell
$ npm install -g truffle

$ truffle version
Truffle v5.0.20 (core: 5.0.20)
Solidity v0.5.0 (solc-js)
Node v8.15.1
Web3.js v1.0.0-beta.37
```


<br />
### Step 1: Deploy an ERC20 token called BRidge Token `BRT` on the mainchain (Rinkeby network)

1. Let's first create a project folder for our ERC20 `BRT` and initialize a Truffle project.

```shell
$ mkdir token
$ cd token
$ truffle init
```

<br />

2. Then we will install the [Open-Zeppelin Solidity library](https://github.com/OpenZeppelin/openzeppelin-solidity) which contains a lot of high-quality, fully tested and audited reusable smart contracts

```shell
$ npm init -y
$ npm install openzeppelin-solidity --save-exact
```

<br />

3. Create a contract file `./contacts/BridgeToken.sol` containing

```
// BridgeToken.sol
pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract BridgeToken is ERC20Mintable {
    string public constant name = "Bridge Token";
    string public constant symbol = "BRT";
    uint8 public constant decimals = 18;
}
```

That's it and a big Thanks to the Zeppelin team for all the work they done for Ethereum. Basically our smart contract inherits from [MintableToken](https://openzeppelin.org/api/docs/token_ERC20_MintableToken.html) which offers all the ERC-20 standard functionalities as well as functions to mint tokens. We only need to specify our token name "Bridge Token", its symbol "BRT" and the number of decimals (divisibility).

To make sure your smart contract compiles, you can execute the command `truffle compile`.

<br />

4. Deploy the smart contract on the RinkeBy network

*Note:* Make sure the account used to deploy the contract is funded with RinkeBy ethers (see [faucet](https://faucet.rinkeby.io/)).

Once our smart contracts compile, we need to deploy it. To do so, we need first to complete the migration script, create a file `./migrations/2_deploy_contract.js`

```javascript
// 2_deploy_contract.js
const BridgeToken = artifacts.require("./BridgeToken.sol");

module.exports = function(deployer, network, accounts) {
    // Deploy the smart contract
    deployer.deploy(BridgeToken, {from: accounts[0]}).then(function(instance) {
        // Mint 100 tokens
        return instance.mint(accounts[0], web3.utils.toBN("100000000000000000000"), {from: accounts[0]});
    }); 
};
```

The migration script deploys the contract and additionally mint and distribute 100 BRT tokens to the deployer account.


Next step consists in configuring a connection to the RinkeBy network in order to deploy a smart contract.

Install the following dependencies ([dotenv](https://www.npmjs.com/package/dotenv) to manage environment variables and [truffle-hdwallet-provider](https://github.com/trufflesuite/truffle-hdwallet-provider) to sign transactions from an account derived from a mnemonic)

```shell
$ npm install --save dotenv truffle-hdwallet-provider
```

Create a file `./.env` to store some private information, we do not want to share anywhere (**gitignore this file**)

- [Infura](https://infura.io/) is a public gateway to Ethereum. If you don't already have an account, I recommend you to create one and past your API key (PROJECT ID) in this file.
- A mnemonic a 12 words phrase that symbolize a private key. You can find it in Metamask (_Settings / Reveal seed words_)

```
// .env
INFURA_API_KEY=044443611111111e19e03433333309923
MNEMONIC=twelve words you can find in metamask/settings/reveal seed words 
```

Finally let's configure the connection to the RinkeBy network. Edit the file `./truffle.js`

```javascript
// truffle.js
require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
        provider: new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
        network_id: 4,
        gas: 4500000
    }
  }
};
```

To deploy the smart contracts on the RinkeBy network, run the command (this might take a little while) :

```shell
$ truffle migrate --network rinkeby

Compiling your contracts...
===========================
> Compiling ./contracts/BridgeToken.sol
> Compiling ./contracts/Migrations.sol
> Compiling openzeppelin-solidity/contracts/access/Roles.sol
> Compiling openzeppelin-solidity/contracts/access/roles/MinterRole.sol
> Compiling openzeppelin-solidity/contracts/math/SafeMath.sol
> Compiling openzeppelin-solidity/contracts/token/ERC20/ERC20.sol
> Compiling openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol
> Compiling openzeppelin-solidity/contracts/token/ERC20/IERC20.sol
> Artifacts written to /home/gjeanmart/workspace/tutorials/bridge_token/build/contracts
> Compiled successfully using:
   - solc: 0.5.8+commit.23d335f2.Emscripten.clang


Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 0x7244c0


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        4502550
   > block timestamp:     1559667907
   > account:             0xF0f15Cedc719B5A55470877B0710d5c7816916b1
   > balance:             33.578282390129999997
   > gas used:            246393
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.000492786 ETH

   -------------------------------------
   > Total cost:         0.000492786 ETH


2_deploy_contract.js
====================

   Deploying 'BridgeToken'
   -----------------------
   > block number:        4502552
   > block timestamp:     1559667919
   > account:             0xe9B0E206C8cA079bca49F0120abfD02760093612
   > balance:             99.996785462
   > gas used:            1607269
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.003214538 ETH

   -------------------------------------
   > Total cost:         0.003214538 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.003707324 ETH


Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 0x724802


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x44dbbf18d316adb29143d1b3341c1e28b297d144411ee98cb23017270f77b9ed
   > Blocks: 1            Seconds: 9
   > contract address:    0xAC96dc3AC9baB86c7d89a5868096394CB708a6a0
   > block number:        4502551
   > block timestamp:     1559667943
   > account:             0xF0f15Cedc719B5A55470877B0710d5c7816916b1
   > balance:             33.573547316129999997
   > gas used:            261393
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00522786 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00522786 ETH


2_deploy_contract.js
====================

   Deploying 'BridgeToken'
   -----------------------
   > transaction hash:    0x80dc122178131cbd040e90b667cc1d11a47d21abf8ebf17c80232b1c4c5f33df
   > Blocks: 2            Seconds: 21
   > contract address:    0x40A6a864133985E1146DDfEb48c7391CD07596F5
   > block number:        4502554
   > block timestamp:     1559667988
   > account:             0xF0f15Cedc719B5A55470877B0710d5c7816916b1
   > balance:             33.540261476129999997
   > gas used:            1622269
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03244538 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.03244538 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.03767324 ETH

```

As a result, we can identify our Smart Contract `BridgeToken` as been deployed at the address `0x40A6a864133985E1146DDfEb48c7391CD07596F5` (see [block explorer](https://rinkeby.etherscan.io/address/0x40A6a864133985E1146DDfEb48c7391CD07596F5))


<br />
### Step 2: Initialise the monorepo `tokenbridge`

In this second step, we will initialise the GitHub mono-repository in order to install each component in the following steps.

1. Clone the repo

```shell
$ cd ../
$ git clone --recursive https://github.com/poanetwork/tokenbridge
$ cd ./tokenbridge/
```

2. Install the depandancies

```shell
$ yarn install && yarn install:deploy
```

<br />
### Step 3: Configure and Deploy the bridge contracts 

In this third step, we will deploy the necessary contracts to enable a ERC20 to ERC20 bridge.

![](https://ipfs.infura.io/ipfs/QmaVm2rdtf78fHsG7pRh2GYGXeRdos6tNkWrWtU2AZAT8w)

1. Go to the `contracts` folder

```shell
$ cd ./contracts/
```

<br />
2. Compile the smart contracts

```shell
$ npm run compile
```

<br />
3. Create a configuration file in `./deploy/.env`

*Note 1* : the following properties to change

- `PRIVATE_KEY` Account responsible for deploying, administrating the contracts and validating transfers
- `ACCOUNT_ADMIN` Account responsible for deploying, administrating the contracts and validating transfers.
- `ERC20_TOKEN_ADDRESS` Address of the ERC20 token deployed above.

*Note 2* : For the reason of the tutorial, we decided to simplify the configuration as much as possible (one account administrating and validating)

*Note 3* : Make sure the account `ACCOUNT_ADMIN` is funded with **RinkeBy ethers** and **POA Sokol ethers**.

*Note 4* : No block reward (rewardable token) has been configured.

```
BRIDGE_MODE=ERC_TO_ERC
##BRIDGE_MODE=NATIVE_TO_ERC

## If Home network does not support byzantium fork, should use contracts compiled for spuriousDragon
##HOME_EVM_VERSION=spuriousDragon

## If Foreign network does not support byzantium fork, should use contracts compiled for spuriousDragon
##FOREIGN_EVM_VERSION=spuriousDragon

DEPLOYMENT_ACCOUNT_PRIVATE_KEY=PRIVATE_KEY

DEPLOYMENT_GAS_LIMIT_EXTRA=0.2
HOME_DEPLOYMENT_GAS_PRICE=10000000000
FOREIGN_DEPLOYMENT_GAS_PRICE=10000000000
GET_RECEIPT_INTERVAL_IN_MILLISECONDS=3000

BRIDGEABLE_TOKEN_NAME="Bridge Token"
BRIDGEABLE_TOKEN_SYMBOL=BRT
BRIDGEABLE_TOKEN_DECIMALS=18

HOME_RPC_URL=https://sokol.poa.network
HOME_BRIDGE_OWNER=ACCOUNT_ADMIN
HOME_VALIDATORS_OWNER=ACCOUNT_ADMIN
HOME_UPGRADEABLE_ADMIN=ACCOUNT_ADMIN
HOME_DAILY_LIMIT=30000000000000000000000000
HOME_MAX_AMOUNT_PER_TX=1500000000000000000000000
HOME_MIN_AMOUNT_PER_TX=500000000000000000
HOME_REQUIRED_BLOCK_CONFIRMATIONS=1
HOME_GAS_PRICE=1000000000

BLOCK_REWARD_ADDRESS=0x0000000000000000000000000000000000000000

FOREIGN_RPC_URL=https://rinkeby.infura.io
FOREIGN_BRIDGE_OWNER=ACCOUNT_ADMIN
FOREIGN_VALIDATORS_OWNER=ACCOUNT_ADMIN
FOREIGN_UPGRADEABLE_ADMIN=ACCOUNT_ADMIN
FOREIGN_DAILY_LIMIT=15000000000000000000000000
FOREIGN_MAX_AMOUNT_PER_TX=750000000000000000000000
FOREIGN_MIN_AMOUNT_PER_TX=500000000000000000
FOREIGN_REQUIRED_BLOCK_CONFIRMATIONS=8
FOREIGN_GAS_PRICE=10000000000
##for bridge erc_to_erc and erc_to_native mode
ERC20_TOKEN_ADDRESS=ERC20_TOKEN_ADDRESS
## Only for for erc_to_erc mode
ERC20_EXTENDED_BY_ERC677=false

REQUIRED_NUMBER_OF_VALIDATORS=1
##If several validators are used, list them separated by space without quotes
##E.g. VALIDATORS=0x 0x 0x
VALIDATORS=ACCOUNT_ADMIN
##Set to ONE_DIRECTION or BOTH_DIRECTIONS if fee will be charged on home side, set to false otherwise
HOME_REWARDABLE=false
## Valid only for rewards on erc_to_native mode. Supported values are BRIDGE_VALIDATORS_REWARD and POSDAO_REWARD
HOME_FEE_MANAGER_TYPE=
##Set to ONE_DIRECTION or BOTH_DIRECTIONS if fee will be charged on foreign side, set to false otherwise
FOREIGN_REWARDABLE=false
##If HOME_REWARDABLE or FOREIGN_REWARDABLE set to true, list validators accounts were rewards should be transferred separated by space without quotes
##E.g. VALIDATORS_REWARD_ACCOUNTS=0x 0x 0x
VALIDATORS_REWARD_ACCOUNTS=0x

## Fee to be taken for every transaction directed from the Home network to the Foreign network
## E.g. 0.1% fee
HOME_TRANSACTIONS_FEE=0.001
## Fee to be taken for every transaction directed from the Foreign network to the Home network
FOREIGN_TRANSACTIONS_FEE=0.001
##for bridge native_to_erc, erc_to_erc mode
DEPLOY_REWARDABLE_TOKEN=false
DPOS_STAKING_ADDRESS=0x0000000000000000000000000000000000000000
```

<br />
4. Deploy the Bridge configuration

```shell
$ ./deploy.sh
(...)
Deployment has been completed.

[   Home  ] HomeBridge: 0xc4e7cA947521f331969e41CC7c99ADa22F2C7F9C at block 9044640
[   Home  ] ERC677 Bridgeable Token: 0xEa3acD04DdaF1F1A5Ae1B9f5f690123aA4E19B36
[ Foreign ] ForeignBridge: 0xeb2dbC5AB9380A3517AcA9d8CA0c39873e569a93 at block 4503560
[ Foreign ] ERC20 Token: 0x40A6a864133985E1146DDfEb48c7391CD07596F5
Contracts Deployment have been saved to `bridgeDeploymentResults.json`
{
    "homeBridge": {
        "address": "0xc4e7cA947521f331969e41CC7c99ADa22F2C7F9C",
        "deployedBlockNumber": 9044640,
        "erc677": {
            "address": "0xEa3acD04DdaF1F1A5Ae1B9f5f690123aA4E19B36"
        }
    },
    "foreignBridge": {
        "address": "0xeb2dbC5AB9380A3517AcA9d8CA0c39873e569a93",
        "deployedBlockNumber": 4503560
    }
}
```

**Save the JSON information above.**


<br />
### Step 4: Configure and deploy the Bridge Oracle

1. Go to the `oracle folder

```shell
$ cd ../oracle
```

<br />
2. Create a configuration file in `./.env`

*Note 1* : Open the saved JSON file `bridgeDeploymentResults.json` to get the home and foreign bridge contract address and deployment block numbers.

```javascript
{
    "homeBridge": {
        "address": "0xc4e7cA947521f331969e41CC7c99ADa22F2C7F9C",
        "deployedBlockNumber": 9044640,
        "erc677": {
            "address": "0xEa3acD04DdaF1F1A5Ae1B9f5f690123aA4E19B36"
        }
    },
    "foreignBridge": {
        "address": "0xeb2dbC5AB9380A3517AcA9d8CA0c39873e569a93",
        "deployedBlockNumber": 4503560
    }
}

```

*Note 2* : the following properties to change

- `PRIVATE_KEY` Account responsible for deploying, administrating the contracts and validating transfers
- `ACCOUNT_ADMIN`  Account responsible for deploying, administrating the contracts and validating transfers
- `ERC20_TOKEN_ADDRESS` Address of the ERC20 token deployed above.

*Note 3* : For the reason of the tutorial, we decided to simplify the configuration as much as possible (one account administrating and validating)

*Note 4* : Make sure the account `ACCOUNT_ADMIN` is funded with RinkeBy ethers and POA sokol ethers.

```
BRIDGE_MODE=ERC_TO_ERC
HOME_POLLING_INTERVAL=5000
FOREIGN_POLLING_INTERVAL=1000
ALLOW_HTTP=yes
HOME_RPC_URL=https://sokol.poa.network
FOREIGN_RPC_URL=https://rinkeby.infura.io
HOME_BRIDGE_ADDRESS=bridgeDeploymentResults.json / homeBridge / address
FOREIGN_BRIDGE_ADDRESS=bridgeDeploymentResults.json / foreignBridge / address
ERC20_TOKEN_ADDRESS=ERC20_TOKEN_ADDRESS

VALIDATOR_ADDRESS=ACCOUNT_ADMIN
VALIDATOR_ADDRESS_PRIVATE_KEY=PRIVATE_KEY

HOME_GAS_PRICE_ORACLE_URL=https://gasprice.poa.network/
HOME_GAS_PRICE_SPEED_TYPE=standard
HOME_GAS_PRICE_FALLBACK=1000000000
HOME_GAS_PRICE_UPDATE_INTERVAL=600000

FOREIGN_GAS_PRICE_ORACLE_URL=https://gasprice.poa.network/
FOREIGN_GAS_PRICE_SPEED_TYPE=standard
FOREIGN_GAS_PRICE_FALLBACK=1000000000
FOREIGN_GAS_PRICE_UPDATE_INTERVAL=600000

QUEUE_URL=amqp://rabbit
REDIS_URL=redis://redis:6379
REDIS_LOCK_TTL=1000

HOME_START_BLOCK=bridgeDeploymentResults.json / homeBridge / deployedBlockNumber
FOREIGN_START_BLOCK=bridgeDeploymentResults.json / foreignBridge / deployedBlockNumber

LOG_LEVEL=info
MAX_PROCESSING_TIME=20000
```

<br />
3. Build and run the Bridge Oracle (using [Docker](https://www.docker.com/) and Docker-compose)

This docker package is composed of a Reddit database, Rabbit MQ broker and NodeJS workers.

```shell
$ docker-compose up --build
```

*Use the flag `-d` to run the Bridge Oracle in the background (daemon)*

![](https://imgur.com/Hgow8Fl.gif)

<br />
### Step 5: Configure and Deploy the bridge UI

Last step consist in deploying a User Interface to transfer tokens between the sidechain and the mainchain.

1. Navigate to the folder `ui`

```shell
$ cd ../ui
```

<br />
2. Create a configuration file in `./.env`

*Note 1*: Open the saved JSON file `bridgeDeploymentResults.json` to get the home and foreign bridge contract address and deployment block numbers.

```javascript
{
    "homeBridge": {
        "address": "0xc4e7cA947521f331969e41CC7c99ADa22F2C7F9C",
        "deployedBlockNumber": 9044640,
        "erc677": {
            "address": "0xEa3acD04DdaF1F1A5Ae1B9f5f690123aA4E19B36"
        }
    },
    "foreignBridge": {
        "address": "0xeb2dbC5AB9380A3517AcA9d8CA0c39873e569a93",
        "deployedBlockNumber": 4503560
    }
}
```

```
REACT_APP_HOME_BRIDGE_ADDRESS=bridgeDeploymentResults.json / homeBridge / address
REACT_APP_FOREIGN_BRIDGE_ADDRESS=bridgeDeploymentResults.json / foreignBridge / address

REACT_APP_HOME_HTTP_PARITY_URL=https://sokol.poa.network
REACT_APP_FOREIGN_HTTP_PARITY_URL=https://rinkeby.infura.io/mew
```

<br />
3. Run Bridge UI

```shell
$ npm start
```

<br />
4. Open your Internet Browser, unlock Metamask on the Rinkeby network with the account used to deploy BRT token and go to [http://localhost:3000/](http://localhost:3000/)

![](https://ipfs.infura.io/ipfs/QmPNXRHicnw5ZVFiyiZVN7rDEwR8rtVtWsMYq1bLEMovor)

If you are on the RinkeBy network, you should see that you own 100 BRT token on the mainchain (RinkeBy) and 0 on the sidechain (POA Sokol)

![](https://ipfs.infura.io/ipfs/QmPbXEgc9q2xZ31hJjLJS4mvbFUy5fLj8SoFP89v25AMeq)

You can now transfer BRT token between the mainchain and the sidechain:

![](https://imgur.com/lPYryIU.gif)


<br />
<br />
-----------------------------------------------------

### References:

- [poa-bridge-contracts GitHub](https://github.com/poanetwork/poa-bridge-contracts)
- [token-bridge (monorepo) GitHub](https://github.com/poanetwork/tokenbridge)
- [Introducing the ERC20 to ERC20 TokenBridge](https://medium.com/poa-network/introducing-the-erc20-to-erc20-tokenbridge-ce266cc1a2d0) (November 2018)  
- [Introducing POA Bridge and POA20](https://medium.com/poa-network/introducing-poa-bridge-and-poa20-55d8b78058ac) (April 2018) 




---

- **Kauri original title:** POA - Part 2 - Bridge assets between a sidechain and a mainchain
- **Kauri original link:** https://kauri.io/poa-part-2-bridge-assets-between-a-sidechain-and-/19072f7340184628b47c0d86e7feac6d/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-01-21
- **Kauri original tags:** poa, bridge, sidechain
- **Kauri original hash:** QmZWFdH1EZodsLeXvHDhQSgfnTv5zvtYe4SwmXjBkJr7w3
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



