---
title: Embark  Smart Contract Compilation & Deployment
summary: Earlier in the series, we took a look at how to manually deploy and interact with our Bounties.sol smart contract on a local development blockchain. We also briefly touched on development frameworks which hide the complexity of these repetitive tasks and allow us to focus on developing dApps. This article will walk through the steps required to setup Embark and use it to compile, deploy and interact with our Bounties.sol smart contract. You should see that this is a much easier process than the
authors:
  - null (@iurimatias)
date: 2018-09-19
some_url: 
---

# Embark  Smart Contract Compilation & Deployment



Earlier in the series, we took a look at how to manually deploy and interact with our Bounties.sol smart contract on a local development blockchain.

We also briefly touched on development frameworks which hide the complexity of these repetitive tasks and allow us to focus on developing dApps.

This article will walk through the steps required to setup Embark and use it to compile, deploy and interact with our Bounties.sol smart contract. You should see that this is a much easier process than the manual steps we learned in the previous article.

[The source code for this tutorial can be found here.] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/embark-writing-tests)

### What is Embark?

Embark is a Node based framework which can be used to develop and deploy dApps.

[https://embark.status.im](https://embark.status.im)

[Documentation] https://embark.status.im/docs/index.html

### Installing Embark

You can install Embark using NPM, you will need to have NodeJS 6.9.5+ installed
```
npm install -g embark
```

**Note: On linux systems you may see an error when you attempt to run embark. If you see the following error:**

```
$ embark --version
env: node\r: No such file or directory
```

This is a common issue with Node.js when using files with Windows line endings. [See: npm/npm#12371] (https://github.com/npm/npm/issues/12371)

To resolve we’re going to have to use `dos2unix` to convert the embark js file to Unix format

1. Find the location embark js file on your system
```
$ which embark
/usr/local/bin/embark
cd /usr/local/bin/
ls -lrt | grep embark
lrwxr-xr-x  1 joshuacassidy  admin        37 15 Aug 21:41 embark -> *../lib/node_modules/embark/bin/embark*
```
From the output above we see that on my machine, the relative path of the embark js file is located here:`../lib/node_modules/embark/bin/embark`

2. Install dos2unix
```
$ brew install dos2unix
```
3. Convert the file
```
$ sudo dos2unix ../lib/node_modules/embark/bin/embark
dos2unix: converting file ../lib/node_modules/embark/bin/embark to Unix format...
```
That's it! Now when you run embark — version you should see something like the following:
```
$ embark --version
3.1.9
```

### Creating an Embark Project

To use embark commands you need to run them against an existing project. So the first step is to create an embark project:
```
$ embark new dapp-series-bounties

Initializing Embark Template....
Init complete
App ready at dapp-series-bounties
```

The **embark new** command sets up an embark project with the standard project directory structure:

![](https://api.beta.kauri.io:443/ipfs/QmfK33bTriMgaSKKCikPQTTaR5oMA7Na4daWtKBxzSnKWU)

* **app/**: store the webapp code for our dApp here, we won’t be focusing on the webapp until later in the series
* **config/**: configuration files for embark components
* **blockchain.js**: configure local development node(s)
* **contracts.js**: configure contracts, specify deployments, constructor arguments and dependancies
* **storage.js**: configure storage components (e.g IPFS)
* **communication.js**: configure communication component (e.g Whisper)
* **webserver.js**: configure a dev web server for the webapp
* **contracts/**: store original codes of the smart contract. We will place our Bounties.sol file here
* **test/**: tests for your smart contract(s), well learn about writing tests in the next article
* **chain.json**: tracks deployed contracts across environments
* **embark.json**: customise embark, and setup embark plugin

Now let's create a Bounties.sol file in the contracts folder and copy the contents of [Bounties.sol] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/blob/master/remix-bounties-smartcontract/Bounties-complete.sol) which we previously developed.

![](https://api.beta.kauri.io:443/ipfs/QmXxac4JwMSQRXF1JtJF1xM1NmYeQ3FRDUN8URUv2hxBw9)

### Deployment

**Development Blockchain: Ganache-CLI**

In order to deploy our smart contracts we’re going to need an Ethereum environment to deploy to. For this we will use Ganache-CLI to run a local development

**Installing Ganache-CLI**
```
$ npm install -g ganache-cli
```
We can start our local development blockchain environment by running the `embark simulator` command:
```
$ embark simulator

running: ganache-cli -p 8555 -a 10 -e 100 -l 8000000 --mnemonic "example exile argue silk regular smile grass bomb merge arm assist farm"
Ganache CLI v6.1.3 (ganache-core: 2.1.2)
Available Accounts
==================
(0) 0xb8d851486d1c953e31a44374aca11151d49b8bb3
(1) 0xf6d5c6d500cac10ee7e6efb5c1b479cfb789950a
(2) 0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f
(3) 0xfbaf82a227dcebd2f9334496658801f63299ba24
(4) 0x774b5341944deac70199a4750556223cb008949b
(5) 0x4801428dad07e7c2401d033d195116011fc4e400
(6) 0xcf08befbc01a5b02ea09d840797d6b4565d4d535
(7) 0x1a2f3b98e434c02363f3dac3174af93c1d690914
(8) 0x4a17f35f0a9927fb4141aa91cbbc72c1b31598de
(9) 0xdf18cb4f2005bc52f94e9bd6c31f7b0c6394e2c2
Private Keys
==================
(0) f942d5d524ec07158df4354402bfba8d928c99d0ab34d0799a6158d56156d986
(1) 88f37cfbaed8c0c515c62a17a3a1ce2f397d08bbf20dcc788b69f11b5a5c9791
(2) f4ebc8adae40bfc741b0982c206061878bffed3ad1f34d67c94fa32c3d33eac8
(3) ca67021a16478270ede4fddd65d0c031c75cd36c13b6a56bcb767928c1c2cf86
(4) 9955b1e01b2a7d8c22df41754d48b08dff3c0f3dd79d43e091c6311f97f0605a
(5) 130137aa9a7fbc7cadc98c079cda47a999ff41931d9feaab621855beceed71f7
(6) ead83d04f741d2b3ab50be1299c18aa1a82c241606861a9a6d3122443496522d
(7) e6e893ac9f1c1db066a8a83a376554084b0a786e4cdcd91559d68bd4a1dac396
(8) f1023ac6c8695f6ceb5331a382be8846bfe078b22c18ad7ef4fc3ea6e1cc59e4
(9) 4aef59c2cf29479b2c27a5f208e6b89d65d16f4977988151e135460db8274fdb
HD Wallet
==================
Mnemonic:      example exile argue silk regular smile grass bomb merge arm assist farm
Base HD Path:  m/44'/60'/0'/0/{account_index}
Gas Price
==================
20000000000
Gas Limit
==================
8000000
Listening on localhost:8555
```

The above output shows ganache-cli has started and is listening on *localhost:8555*

**Deploy**

To deploy simply run the embark run command in a separate window

**NOTE: You may come across the following error when you attempt to run ebmark**
```
$ embark run

Error: Cannot find module 'perf_hooks'
    at Function.Module._resolveFilename (module.js:489:15)
    at Function.Module._load (module.js:439:25)
    at Module.require (module.js:517:17)
    at require (internal/module.js:11:18)
    at Object.<anonymous> (/usr/local/lib/node_modules/embark/lib/versions/npmTimer.js:1:106)
    at Module._compile (module.js:573:30)
    at Object.Module._extensions..js (module.js:584:10)
    at Module.load (module.js:507:32)
    at tryModuleLoad (module.js:470:12)
    at Function.Module._load (module.js:462:3)
```

The above error is due to having an outdated node version. To resolve:

1. Update node version: `npm i -g node`
2. Find the location embark node module file on your system
```
$ which embark

/usr/local/bin/embark
cd /usr/local/bin/
ls -lrt | grep embark
lrwxr-xr-x  1 joshuacassidy  admin        37 15 Aug 21:41 embark -> ../lib/node_modules/embark/bin/embark
```
From the output above we see that on my machine, the relative path of the embark js file is located here:`../lib/node_modules/embark`

3. Delete and rebuild the embark npm dependencies
```
$ cd /usr/lib/node_modules/embark
$ rm -rf node_modules
$ npm i
```

Now back in your project directory:

1. Restart the simulator embark simulator
2. Run embark embark run

![](https://api.beta.kauri.io:443/ipfs/QmS2XbJ9aUAG9PzvFp89q4E71MusuCuRiuWPr3jSGmDfrE)

The above image shows the embark dashboard, we can see from the “contracts” section that our Bounties.sol contract has been deployed and now has a contract address of:

`0x04D45b51fe4f00b4478F8b0719Fa779f14c8A194`

Embark both compiles and deploys contracts with the embark run command. The build output of our dApp is stored in the **dist** folder.

Bounties.sol was compiled and the artifact were written to *./dist/contracts*

![](https://api.beta.kauri.io:443/ipfs/QmTocEvJBkEwxceFdDxr1FWcQC6sMp5oMscyfFzKn3ndSJ)

If you review the **Bounties.json** file, you will find it is similar to the output we got when we manually compiled our Bounties.sol smart contract the previous article. It stores the ABI and also the bytecode for deployment and linking, however, this embark artifact contains additional features that make interacting with and deploying smart contracts using embark a smoother experience.

As mentioned earlier, embark keeps a `chains.json` configuration file which tracks deployed contracts across environments. Once a deployment is complete this file is updated automatically by embark:

![](https://api.beta.kauri.io:443/ipfs/QmXMBM1mYnkqUUuJQgGxiHc5mkaqEJGnWw57iMWq9peZHs)

### Interacting with our contract

When running embark we’re provided with a console loaded with web3.js

> web3.js is a javascript library, a convenient wrapper around the JSON-RPC protocol which provide an interface for interacting with an Ethereum node in javascript. We’ll talk more about web3 later in the series.

Lets attempt to issue a bounty. To do this we’ll need to set the `string _data` argument to some string “some requirements” and set the `uint64 _deadline` argument to a unix timestamp in the future e.g “1691452800” August 8th 2023.

Since embark 3.1 uses web3.js 1.0 our syntax for issuing a bounty is:
```
Bounties.methods.issueBounty("some requirements",1691452800).send({value: 1000000, gas: 3000000})
```

![](https://api.beta.kauri.io:443/ipfs/QmUJoMdKAp4ZsJVKs3jJ1BiD9CPdEJBKW6TubNSkKCCTvx)

The image above shows the output of the `issueBounty` function in the embark console. The output logs part of the transaction receipt. We can see from that status `0x1` thats the transaction was successful.

Read more about [web3.js transaction receipt here] (https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt).

### Test Network: Rinkeby

We can also configure Embark to deploy to one of the public test Ethereum networks rather than a local development environment. Earlier in the series, we introduced the following public Ethereum test networks:

* Rinkeby
* Kovan
* Ropsten

This part of the article will discuss deployment to the **Rinkeby** environment, however, the instructions can be used to deploy to either **Kovan** or **Ropsten** also.

#### Infura

In order to send transactions to a public network, you need access to a network node. Infura is a public hosted Ethereum node cluster, which provides access to its nodes via an API

[https://infura.io](https://infura.io)

If you do not already have an Infura account, the first thing you need to do is [register for an account] (https://infura.io/register).

Once logged in, create a new project to generate an API key, this allows you to track the usage of each individual dApp you deploy.

![](https://api.beta.kauri.io:443/ipfs/QmYMAmUQavX3Dkzj9CUWonGRzTj7JEZZbpfNtJNs9pDiL8)

Once your project is created, select the environment we will be deploying to, in this case **Rinkeby**, from the *Endpoint* drop down and copy the endpoint URL for future reference:

![](https://api.beta.kauri.io:443/ipfs/QmdkpNG8CAJnFjRZcC616JY1CXDFoWMQiRREdyryRBkX6p)

Make sure you save this token and keep it private!

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

**Configure Embark**

Now we have all the pieces setup, we need to configure embark to use a wallet to deploy our contracts to the **Rinkeby** environment. To do this we will need to edit the `config/contracts.js` configuration file.

First lets create a `secrets.json` file, this file will store your mnemonic and Infura API key so that it can be loaded by embark.

*NOTE: Remember not to check this file into any public repository!*

![](https://api.beta.kauri.io:443/ipfs/QmeUy9K6wfHzssQKDyhZaHJtiTgiQabmJixgGFU2gV8LKE)

Next, in the `config/contracts.js` configuration file add the following lines to load our mnemonic and api key from our `secrets.json` file:
```
const fs = require('fs');
let secrets;
if (fs.existsSync('secrets.json')) {
  secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
}
```
![](https://api.beta.kauri.io:443/ipfs/QmfFc9fSZM9bvwYxGYQkaoeqUdpCmUj3TBLJHEDZz5MV9y)

Add the following extract to the the config/contracts.js file:

rinkeby: {
    deployment:{
      accounts: [
        {
          "mnemonic": secrets.mnemonic
        }
      ],
      host: "rinkeby.infura.io/v3/"+secrets.infuraApiKey,
      port: false,
      protocol: 'https',
      type: "rpc"
    }
}

Here we define a new environment **rinkeby** which:

1. Uses the **mnemonic** loaded into the **secrets** variable for its accounts.
2. Sets the **rinkeby** infura endpoint as its host
3. Since infura uses https, we define the protocol to be used
4. Sets the type of the endpoint to **rpc**

![](https://api.beta.kauri.io:443/ipfs/QmYbBD7eqMbWWW6CCuQeRS9XboWPWR1EMEdkjgZpYhB8vY)

#### Fund Your Account

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

To deploy simply run the `embark run` command whilst specifying the environment to deploy to. The environments are defined in the `config/contracts.js` configuration file we configured earlier in this article:

```
$ embark run rinkeby
```
![](https://api.beta.kauri.io:443/ipfs/QmVFcL9Lu7F3EGi9etEEUJeFXKKVs8qwbFKwHmB84Kajvf)

And that's it! We have now finally deployed our Bounties.sol contract to the public testnet environment Rinkeby
.
Later in the series, we’ll discuss how to write tests within the Embark framework, and how we can also add a frontend to our dApp so users can interact with our smart contract on the public network!









