---
title: POA - Part 1 - Develop and deploy a smart contract
summary: This article is part of a POA tutorial series- POA - Part 1 - Develop and deploy a smart contract POA - Part 2 - Bridge assets between a sidechain and a maincha
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-01-21
some_url: 
---

# POA - Part 1 - Develop and deploy a smart contract

![](https://ipfs.infura.io/ipfs/QmbNpbky6U4N7B5BmyiNvLKNTFeBN4RcMhgp84UuHpSDbu)


This article is part of a **POA tutorial series**: 

- [POA - Part 1 - Develop and deploy a smart contract]( https://kauri.io/article/549b50d2318741dbba209110bb9e350e)
- [POA - Part 2 - Bridge assets between a sidechain and a mainchain](https://kauri.io/article/19072f7340184628b47c0d86e7feac6d)
- POA - Part 3 - Meta-transaction [Coming soon]

-----------------------------------------------------------------------------------------------------------------

[POA Network](https://poa.network/) is an Ethereum-based platform that offers an open-source framework for smart contracts. POA Network is a sidechain to Ethereum utilizing Proof of Authority as its consensus mechanism. POA provides developers with the flexibility to code in Ethereum standards with the added benefits of POA Network's solutions to scalability and interoperability in blockchain networks.

POA has transaction fees just like the Ethereum mainnet, but in comparison to the Ethereum mainnet where fees are paid in Ether, the POA blockchain requires fees in its native currency called POA Token, this token can be obtained on a Crypto Trading platform like Binance.

POA currently has two networks up and running:
* POA Core: The main network requiring POA token
* POA Sokol: A test network requiring POA Sokol token

For the purpose of this tutorial, we will use the POA Sokol network.

### Step 1: Connect Metamask to POA Sokol and fund your account

In this first step, we’re going to learn how to connect our Metamask wallet to a POA test network called Sokol and how to fund the account with Test POA tokens.

1. Unlock your [Metamask](https://metamask.io/) extension

2. Go to Settings, enter the following new RPC URL https://sokol.poa.network and click on Save

![](https://ipfs.infura.io/ipfs/QmSZNDxcCSmVwvxxWkzLz9Z2kEj6TTgYCBEYU4VJE2XusP)

  *Metamask should switch to this new private network*

  **Note**: A dedicated Browser extension (only Chrome) for POA and very similar to Metamask can also be used: [Nifty](https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid?hl=en)

3. In Metamask, copy your account address

4. Go to the [POA Sokol Faucet](https://faucet-sokol.herokuapp.com/)

5. Click on Request 0.5 POA

![](https://ipfs.infura.io/ipfs/QmbNrvNNVdysPjLYDC1hVMfhT7u2azCvsPT5Sp2tBJT45G)

6. You can your account balance in Metamask or also see in the [POA Sokol Explorer](https://blockscout.com/poa/sokol/) if the transaction went through.

### Step 2: Deploy a contract on the POA Sokol network

The second step consists in writing a very simple Smart Contract in Solidity and deploy it on the POA Sokol Network using Truffle framework.

1. Install [Truffle](https://truffleframework.com/) on your machine

```
$ npm install -g truffle
```

2. Initialise your Truffle project

```
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

3. Let’s now write a simple Smart Contract that increments and store a counter

  Create a file in `contracts/Counter.sol` and paste the following Solidity code

```
pragma solidity ^0.4.20;

contract Counter {
  uint counter;

  constructor() public {
    counter = 0; // Initialise the counter to 0
  }

  function increment() public {
    counter++;
  }

  function getCounter() public view returns (uint) {
    return counter;
  }
}
```

*You can verify that your code compiles correctly with the following command* `$ truffle compile `

4. Now, we need to create a deployment script

  Create a file in `migrations/2_deploy_contracts.js` and paste the following code

```
var Counter = artifacts.require("./Counter.sol");

module.exports = function(deployer) {
  deployer.deploy(Counter);
};
```

5. Finally we need to configure the connection to the POA Sokol network as well as our wallet info

Install the following JavaScript dependencies:

* [truffle-hdwallet-provider](https://github.com/trufflesuite/truffle-hdwallet-provider) enables to sign transactions for addresses derived from a 12-word mnemonic
* [dotenv](https://www.npmjs.com/package/dotenv) is a module to configure environment variables

```
$ npm install truffle-hdwallet-provider dotenv --save-dev
```

6. Copy your mnemonic from your Metamask wallet: Settings / Reveal Seed Words

**DO NOT SHARE THOSE 12 WORDS WITH ANYBODY**

7. Create a `.env` in the Truffle project and copy the mnemonic like this

```
MNEMONIC="COPY HERE YOUR 12 MNEMONIC WORDS YOU DO NOT WANT TO SHARE"
```

8. Open the file `truffle.js` and add the following configuration

```
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    poa: {
          provider: function() {
                return new HDWalletProvider(
               process.env.MNEMONIC,
               "https://sokol.poa.network")
          },
          network_id: 77,
          gas: 500000,
          gasPrice: 1000000000
    },
    development: {
          host: "127.0.0.1",
          port: 8545,
          network_id: "*" // Match any network id
    }
  }
};
```

9. Run the deployment to the POA Sokol network

```
$ truffle migrate --network poa
Using network 'poa'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x3a2e4be0c784bf5df3ca4251d27dc724ae5863d5de0e1eae4babb0c636b8c571
  Migrations: 0xb497ad71c0168d040027cfdcf9a44c7f8f270d0d
Saving successful migration to network...
  ... 0x8ebbf70d5a162ba46e2fa4266aafe360d9f32e32c30ed17a083045d2afeeaf46
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying Counter...
  ... 0xdf3009e60daec1217237661b4b10298b5f4504efef8a6f93cdc8198486260766
  Counter: 0xfbc93e43a6a95c1cee79aa8ec2382a4edd5ad2bc
Saving artifacts...
```

### Step 3: Interact with the contract from the web app

In the next step, we will develop a dApp using React, Web3 and Truffle to interact with the Smart Contract previously deployed on the POA Sokol network.

1. Initialise a React project

```
$ npx create-react-app frontend
$ cd frontend
```

2. Install the necessary dependencies

* [truffle-contract](https://github.com/trufflesuite/truffle/tree/next/packages/truffle-contract): is an Ethereum Smart Contract abstraction library
* [web3](https://github.com/ethereum/web3.js/): This is the Ethereum compatible JavaScript API which implements the Generic JSON RPC spec

```
$ npm install truffle-contract web3 --save
```


3. Edit package.json and add the following line under the scripts section to access the Truffle contract artifacts from the webapp 

```
"link-contracts": "run-script-os",
"link-contracts:linux:darwin": "cd src && ln -s ../../build/contracts contracts",
"link-contracts:win32": "cd src && mklink \\D contracts ..\\..\\build\\contracts"
```

*The full code of this file is available here: [package.json](https://github.com/gjeanmart/kauri-content/blob/master/poa_tutorial_sokol_part1/frontend/package.json)*


4. Open an edit src/App.js

  * Connect to the node with web3

```
import Web3 from 'web3'

class App extends Component {

  constructor(props) {
    super(props)

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
    }
    this.web3 = new Web3(this.web3Provider)
  }

(...)

}
```

  * Use truffle-contract to load the Truffle artefacts and interact with the smart contract

```
import TruffleContract from 'truffle-contract'
import Counter from './contracts/Counter.json'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      value: '',
      loading: true
    }

    (... web3 ...)
  }

  componentDidMount() {
    const counter = TruffleContract(Counter)
    counter.setProvider(this.web3Provider)

    this.web3.eth.getAccounts((error, accounts) => {
    const account = accounts[0]
    this.setState({ account})

    counter.deployed().then((instance) => {
      this.counter = instance
        return this.counter.getCounter.call()
      }).then((value) => {
        return this.setState({ value: value.toNumber(), loading: false })
      })
    })
  }

  setValue(value) {
    this.setState({ loading: true })
    this.counter.increment({ from: this.state.account, gas: 50000 }).then((r) => {
      this.setState({ value: value.toNumber(), loading: false })
    })
  }
(...)

}
```


*The full code of this file is available here: [App.js](https://github.com/gjeanmart/kauri-content/blob/master/poa_tutorial_sokol_part1/frontend/src/App.js)*


5. Create a link to the Truffle JSON artefacts

```
$ npm run link-contracts:linux:darwin
```

6. Start the webserver

```
$ npm start
```

7. Result

If Metamask is unlocked and connected to the Solok network, The web3 provider connects automatically to the node and retrieves the counter value. When the user clicks on “Increment”, Metamask pops up to sign a transaction and send it to the POA Solok network.

![](https://media.giphy.com/media/3D5uh6uTIT9K68zrVa/giphy.gif)

### Links and resources

**Sokol**

* Network ID: 77

* JSON-RPC Endpoint: https://sokol.poa.network

* Block Explorers: 
    * https://blockscout.com/poa/sokol/ 
    * https://sokol-explorer.poa.network/

* Network Status: https://sokol-netstat.poa.network/

* Faucet: https://faucet-sokol.herokuapp.com/

**Core**

* Network ID: 99

* JSON-RPC Endpoint: 
    * https://core.poa.network 
    * https://poa.infura.io/

* Block Explorers: 
    * https://blockscout.com/poa/core
    * https://core-explorer.poa.network/

* Network Status: https://core-netstat.poa.network/

------

**Inspired by** https://www.youtube.com/watch?time_continue=313&v=fezh2buFAt4

**Code**: https://github.com/gjeanmart/kauri-content/tree/master/poa_tutorial_sokol_part1








---

- **Kauri original title:** POA - Part 1 - Develop and deploy a smart contract
- **Kauri original link:** https://kauri.io/poa-part-1-develop-and-deploy-a-smart-contract/549b50d2318741dbba209110bb9e350e/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-01-21
- **Kauri original tags:** poa, sokol, sidechain
- **Kauri original hash:** QmSJGfnQfdCjeijf47eaDy4te9Gx4zCiaxcdzj1eDA3Hfa
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



