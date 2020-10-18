---
title: Loom - Part 1 - Develop and deploy a smart contract
summary: Loom Network is a Layer 2 scaling solution for Ethereum focusing on social and gaming dApps that require a very high throughput. Loom SDK enables to generate a sidechain called dAppChain using a dPoS consensus optimised for high-scalability. Loom is contributing on Plasma which is a mechanism to securely transfer a digital asset (ERC20 or ERC721) to a mainchain. You can run your own DAppChain using the Loom software or connect to a public one (plasma-chain, social-chain or gaming-chain) running
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-07-05
some_url: 
---

# Loom - Part 1 - Develop and deploy a smart contract


[Loom Network](https://loomx.io/) is a Layer 2 scaling solution for Ethereum focusing on social and gaming dApps that require a very high throughput. Loom SDK enables to generate a sidechain called dAppChain using a dPoS consensus optimised for high-scalability. Loom is contributing on Plasma which is a mechanism to securely transfer a digital asset (ERC20 or ERC721) to a mainchain.

You can run your own DAppChain using the Loom software or connect to a public one (plasma-chain, social-chain or gaming-chain) running under a dPoS Ethereum blockchain to enable scalable dApps.

For this tutorial, we will create and fund a Loom account, deploy a contract on the External Dev Plasma network called **extdev** and interact with it from a frontend application.

### Step 1 - Install Loom on your machine and fund an account

In the first, we will install Loom software on your machine to generate a keypair and fund the account with the Loom faucet.

1. Download the executable

```
$ wget https://private.delegatecall.com/loom/osx/stable/loom
$ chmod +x loom
```

2. Generate a key pair

```
$ ./loom genkey -k priv_key -a pub_key
local address: 0xc69c707D6bFDfeC42FE221a334b8DAb2A2DD4Cef
local address base64: xpxwfWv9/sQv4iGjNLjasqLdTO8=

$ ls -l | grep key
-rw-rw-r-- 1 gjeanmart gjeanmart        88 Oct 24 16:35 priv_key
-rw-rw-r-- 1 gjeanmart gjeanmart        44 Oct 24 16:35 pub_key
```

*The keypair is created under the same folder.*

3. Go to the [Loom Faucet](https://faucet.dappchains.com/)

4. Enter your address generated above

5. Click on *Request* and wait until you see **100 faucet-karma**

![](https://api.beta.kauri.io:443/ipfs/QmVvPTJktFDRBxyzSmFJzPXaVgWtG83JvUTLdsWKU5uadK)

### Step 2: Deploy a contract on the Loom extdev network

The second step consists in writing a very simple Smart Contract in Solidity and deploy it on the Loom extdev network using Truffle framework.

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

*You can verify that your code compiles correctly with the following command* `$ truffle compile` 

4. Now, we need to create a deployment script

  Create a file in `migrations/2_deploy_contracts.js` and paste the following code

```
var Counter = artifacts.require("./Counter.sol");

module.exports = function(deployer) {
  deployer.deploy(Counter);
};
```

5. Finally we need to configure the connection to the Loom extdev network as well as our wallet info

  Install the following JavaScript dependencies:

  * [truffle-hdwallet-provider](https://github.com/trufflesuite/truffle-hdwallet-provider) enables to sign transactions for addresses derived from a 12-word mnemonic
  * [loom-truffle-provider](https://github.com/loomnetwork/loom-truffle-provider) is an adapter that allows Truffle Suite to communicate with Loom DappChain 
  * [dotenv](https://www.npmjs.com/package/dotenv) is a module to configure environment variables

```
$ npm install truffle-hdwallet-provider loom-truffle-provider dotenv --save-dev
```

6. Copy your private key from the file previously generated (priv_key)

7. Create a `.env` in the Truffle project and copy the private key like this

```
PRIVATE_KEY="0kwCi...iWNNw=="
```

8. Open the file `truffle.js` and add the following configuration

```
require('dotenv').config();
const LoomTruffleProvider = require('loom-truffle-provider');
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    extdev: {
      provider: function() {
          const privateKey = process.env.PRIVATE_KEY;
          const chainId = 'extdev-plasma-us1';
          const writeUrl = 'http://extdev-plasma-us1.dappchains.com:80/rpc';
          const readUrl = 'http://extdev-plasma-us1.dappchains.com:80/query';;
          return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
      },
      network_id: 'extdev-plasma-us1'
    }
  }
}
```

9. Run the deployment to the Loom extdev network

```
$ truffle migrate --network extdev

Using network 'extdev'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x67143bb5194d210fcdd5a45fd2d0230662b662689417bc6aee069fc6ddab1341
  Migrations: 0x93bf3a8a616d4e097d6dfcb12ec868284b1c7624
Saving successful migration to network...
  ... 0x4d9c5b64a3bbfe2f57bcd8a069243e212fe050d3ba2f1e72898525d6651b8a04
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying Counter...
  ... 0x7e790260e05487577d5922326d2646d2268456eb750a368b9bf651bfc56d6478
  Counter: 0xc6f28cf3303e7246b91d98222e3912b2b87472a0
Saving successful migration to network...
  ... 0x8491e69910d78ea4b24e37aaf444920754828eccbc0aeb67a460cccaef3c1d88
Saving artifacts...
```

### Step 3: Interact with the contract from the web app

In the next step, we will develop a simplistic dApp using React, Web3 and Loom-js to interact with the Smart Contract previously deployed on the Loom extdev network

1. Initialise a React project

```
$ npx create-react-app frontend
$ cd frontend
```

2. Install the necessary dependencies

  * [web3 (1.0.0-beta.34)](https://github.com/ethereum/web3.js/) This is the Ethereum compatible JavaScript API which implements the Generic JSON RPC spec
  * [loom-js](https://github.com/loomnetwork/loom-js) is a JavaScript library for building browser apps & NodeJS services that interact with Loom 

```
$ npm install web3@1.0.0-beta.34 loom-js --save
```

3. Edit `frontend/package.json` and add the following line under the scripts section to access the Truffle contract artifacts from the webapp 

```
"link-contracts": "run-script-os",
"link-contracts:linux:darwin": "cd src && ln -s ../../build/contracts contracts",
"link-contracts:win32": "cd src && mklink \\D contracts ..\\..\\build\\contracts"
```

*The full code of this file is available here: [package.json](https://github.com/gjeanmart/kauri-content/blob/master/loom_tutorial_extdev_part1/frontend/package.json)*

4. Open an edit `frontend/src/App.js`

  * Imports

```
import Web3 from 'web3'
import { Client, LocalAddress, CryptoUtils, LoomProvider } from 'loom-js'
import Counter from './contracts/Counter.json'
```


  * Connect to the Loom network with web3 and loom-js
  
```
// Read the user private key (from browser storage or input)
let privateKey = '0kwCiGaBdTxy...OTCwKcu+5oj1O23uP1uTqqR47liWNNw=='

// Convert the private key into a public key/account address 
this.publicKey = CryptoUtils.publicKeyFromPrivateKey(CryptoUtils.B64ToUint8Array(privateKey));
this.currentUserAddress = LocalAddress.fromPublicKey(this.publicKey).toString();

// Connect to a Loom extdev network node
this.client = new Client(
  'extdev-plasma-us1',
  'wss://extdev-plasma-us1.dappchains.com/websocket',
  'wss://extdev-plasma-us1.dappchains.com/queryws'
);
this.client.on('error', msg => {
  console.error('Error on connect to client', msg)
});

// Instantiate a Loom Web3Provider to sign and send transaction
this.web3Provider = new LoomProvider(this.client, CryptoUtils.B64ToUint8Array(privateKey));
this.web3 = new Web3(this.web3Provider)
```


* Use web3 to load the smart contract Truffle artifacts

```

// Load the contract instance
this.counter = new this.web3.eth.Contract(Counter.abi, Counter.networks['extdev-plasma-us1'].address, {
  from: this.currentUserAddress
})
```


* Interaction with the smart contract 

```
// Get the counter value
this.counter.methods.getCounter().call().then((value) => {
  return this.setState({ value, loading: false })
})

// Increment the counter 
increment() {
  this.setState({ loading: true })
    this.counter.methods.increment().send({ from: this.currentUserAddress }).then((r) => {
      this.counter.methods.getCounter().call().then((value) => {
        return this.setState({ value, loading: false })
    })
  })
}
```

*The full code of this file is available here: [App.js](https://github.com/gjeanmart/kauri-content/blob/master/loom_tutorial_extdev_part1/frontend/src/App.js)*

5. Create a link to the Truffle JSON artefacts

```
$ npm run link-contracts:linux:darwin
```

6. Start the webserver

```
$ npm start
```

7. Result

After copy-pasting our private key in the input field, the application is able to connect to the Loom extdev node to interact with the contract (read and increment the counter).

![](https://i.imgur.com/gMKzcX0.gif)

### Notes

**Key Management**: There is currently no wallet (such as Metamask) with Loom network, the enduser has to handle the private key manually (browser storage) and the dAppChain provider must most likely provide a way to recover a private key.

You can generate and manipulate a private key using loom-js like this:

```
// Generate a private key
const privateKey = CryptoUtils.generatePrivateKey(); 

// Retrieve the public key
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey); 

// Convert public key to address
const address = LocalAddress.fromPublicKey(publicKey).toString(); 
```

**karma** : is a ERC20 token, sybil resistant, that can be used to prevent spam attack via a reputation-based transaction limiting system.

###  Links and resources
**extdev**
* Network ID: extdev-plasma-us1
* Faucet: https://faucet.dappchains.com/
* Documentation: https://loomx.io/developers/docs/en/phaser-sdk-demo-websocket.html

**Code**: https://github.com/gjeanmart/kauri-content/tree/master/loom_tutorial_extdev_part1

