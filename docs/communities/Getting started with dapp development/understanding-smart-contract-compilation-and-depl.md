---
title: Understanding smart contract compilation and deployment
summary: As discussed earlier in the series, when developing dApps, and especially writing smart contracts, there are many repetitive tasks you will undertake. Such as compiling source code, generating ABIs, testing, and deployment. Development frameworks hide the complexity of these tasks and enable you as a developer to focus on developing your dApp/idea. Before we take a look at these frameworks such as truffle, embark and populous, we’re going to take a detour and have a look at the tasks performed a
authors:
  - Josh Cassidy (@joshorig)
date: 2019-05-02
some_url: 
---

# Understanding smart contract compilation and deployment



As discussed earlier in the series, when developing dApps, and especially writing smart contracts, there are many repetitive tasks you will undertake. Such as compiling source code, generating ABIs, testing, and deployment.

Development frameworks hide the complexity of these tasks and enable you as a developer to focus on developing your dApp/idea.

Before we take a look at these frameworks such as [truffle] (https://truffleframework.com/), [embark] (https://embark.status.im/) and [populous] (https://github.com/ethereum/populus), we’re going to take a detour and have a look at the tasks performed and hidden by these frameworks.

Understanding whats happening under the hood is particularly useful when you run into issues or bugs with these frameworks.

So this article will walk you through how to manually compile and deploy your Bounties.sol smart contract from the command line, to a local development blockchain.

### Steps

Before deployment, a smart contract needs to be encoded into EVM friendly binary called bytecode, much like a compiled Java class.
The following steps typically need to take place before a contract is deployed:

1. Smart contract is written in a human friendly language (e.g Solidity)
2. The code is compiled into bytecode and a set of function descriptors (Application Binary Interface, known as ABI) by a compiler (e.g Solc)
3. The bytecode is packed with other parameters into a transaction
4. The transaction is signed by the account deploying the contract
5. The signed transaction is sent to the blockchain and mined

So for step 1, will we use the [Bounties.sol] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/blob/master/manual-compilation-and-deploy/Bounties.sol) contract we have written previously in this series.

### Solc Compiler

Step 2 requires us to compile our smart contract, in order to compile Solidity we need to use the Solc compiler. Typically frameworks such as [truffle] (https://truffleframework.com/), [embark] (https://embark.status.im/) and [populous] (https://github.com/ethereum/populus) come with a version of solc preconfigured, however since we will be compiling without a framework, we will need to install solc manually.

#### Installing Solc

We can install solc using homebrew:
```
$ brew update
$ brew upgrade
$ brew tap ethereum/ethereum
$ brew install solidity
```

Or on ubuntu like so:
```
$ sudo add-apt-repository ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install solc
```

Or on Windows like this:

`npm install solc`

Read more about [installing solc here] (http://solidity.readthedocs.io/en/latest/installing-solidity.html)

One installed double check its installed by checking the compiler version like so:
```
$ solc --version

solc, the solidity compiler commandline interface
Version: 0.5.1+commit.c8a2cb62.Linux.g++
```

#### Installing JQ

To help with processing json content, during compilation and deployment lets install JQ
Using homebrew:
```
brew install jq
```
Or on ubuntu like so:
```
sudo apt-get install jq
```
Read more about [installing jq here] (https://stedolan.github.io/jq/download/)

Windows users should also read the link above.

#### Compiling Solidity

Once solc is installed we can now compile our smart contract. Here we want to generate

* The bytecode (binary)to be deployed to the blockchain
* The ABI (Application Binary Interface) which tells us how to interact with the deployed contract

So lets setup our directory to work from and copy our Bounties.sol smart contract

```
mkdir dapp-series-bounties
cd dapp-series-bounties
touch Bounties.sol
```

Now copy the contents of [Bounties.sol] (https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/blob/master/manual-compilation-and-deploy/Bounties.sol) which we previously developed into the Bounties.sol file.

The command to compile would be:
```
$ solc --combined-json abi,bin Bounties.sol > Bounties.json
```
This command tells the compiler to combine both the abi and binary output into one json file, Bounties.json

We can view the output using jq:
```
$ cat Bounties.json| jq

{
"contracts": {
"Bounties.sol:Bounties": {
"abi": "[{\"constant\":false,\"inputs\..."]}",
"bin": "6080604052348015..."
}
},
"version": "0.5.1+commit.c8a2cb62.Linux.g++"
}
```
The above output has been trimmed down since the abi and bin outputs are quite large, however from the output above we can see the structure of the compiled json output:

* The name of the Solidity file and the name of the contract specified within it *Bounties*
* The ABI
* The bytecode (bin)
* The version of the compiler

### Development Blockchain: Geth & Ganache-CLI

In order to deploy our smart contract we’re going to need an Ethereum environment to deploy to. For this, we will use Ganache-CLI to run a local development blockchain environment.

#### Installing Ganache-CLI

NOTE: If you have a windows machine you will need to install the windows developer tools first
```
npm install -g windows-build-tools
```
```
$ npm install -g ganache-cli
```

#### Installing Geth

We will also install [Geth] (https://github.com/ethereum/go-ethereum/wiki/geth), which is the Go implementation of an Ethereum node. You can run Geth to setup your own private network by following these [instructions] (https://github.com/ethereum/go-ethereum/wiki/Private-network). However, we will only be using Geth in this tutorial as a helper since it provides a nice Javascript console environment with web3 installed which we can use to interact with Ganache-CLI.

Using homebrew:
```
$ brew tap ethereum/ethereum
$ brew install ethereum
```
Or on ubuntu like so:
```
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install ethereum
```
Read more about [installing Geth here] (https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)

*Windows users should check out the link above.

#### Starting Ganache-CLI & attaching Geth Console

So lets start our local development blockchain environment:
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
Mnemonic: attend frost dignity wheat shell field comic tooth include enter border theory
Base HD Path: m/44'/60'/0'/0/{account_index}
Gas Price
==================
20000000000
Gas Limit
==================
6721975

Listening on localhost:8545
```
The above output shows ganache-cli has started and is listening on *localhost:8545*

Now lets attach the Geth Javascript console to our environment:
```
$ geth attach http://localhost:8545

Welcome to the Geth JavaScript console!

instance: EthereumJS TestRPC/v2.3.1/ethereum-js
coinbase: 0x5d297b105fcc3a635b7f3b35eec353a6aacb2e9a
at block: 0 (Mon, 10 Dec 2018 17:00:39 UTC)
 modules: eth:1.0 evm:1.0 net:1.0 personal:1.0 rpc:1.0 web3:1.0
>
```
#### Deployment preparation

In order to deploy we first need to load our compiled json output into our Geth console.

In a separate terminal, we’ll first prepare a .js script which we can load into the Geth console.

Navigate to the directory where the compiled Bounties.json output is located.

Run the following:
```
$ echo "var bountiesOuput=" > Bounties.js
$ cat Bounties.json >> Bounties.js
```
This should setup a variable named `bountiesOuput` which is equal to the compiled json file we produced earlier.
```
$ cat Bounties.js

var bountiesOutput=
{"contracts":{"Bounties.sol:Bounties":{
"abi":"[{\"constant\":false,\"inputs\":[{\"name\":\"_bountyId\",\"type\":\"uint256\..."}]"}]",
"bin":"608060405234801561001057600080fd5b506..."}},
"version":"0.5.1+commit.c8a2cb62.Linux.g++"}
```
*Note:* the output above has been trimmed down since the abi and bin outputs are quite large.

Now in our Geth console terminal, we run the following to load the Bounties.js script and thus the `bountiesOuput` variable into our console environment:
```
> loadScript('Bounties.js')
true
> bountiesOutput
{
contracts: {
Bounties.sol:Bounties: {
abi: "[{\"constant\":false,\"inputs\":[{\"name\":\"_bountyId\",\"type\":\"uint256\..."}]"}],
bin: "608060405234801561001057600080fd5b506..."
}
},
version: "0.4.24+commit.e67f0147.Darwin.appleclang"
}
```
Let’s prepare the object that will help us interact with the contract. We give it the ABI that, among other things, defines the available methods. However, since the ABI interface was created in stringified form, we need to parse it first:
```
> typeof bountiesOutput.contracts["Bounties.sol:Bounties"].abi
"string"
> var bountiesContract = eth.contract(JSON.parse(bountiesOutput.contracts["Bounties.sol:Bounties"].abi));
undefined
> bountiesContract
{
abi: [{
constant: false,
inputs: [{...}, {...}],
name: "fulfillBounty",
outputs: [],
payable: false,
stateMutability: "nonpayable",
type: "function"
}, {
constant: false,
inputs: [{...}, {...}],
name: "issueBounty",
outputs: [{...}],
payable: true,
stateMutability: "payable",
type: "function"
}, {
....
at: function(address, callback),
getData: function(),
new: function()
```
*bountiesContract* is our *web3* contract object, we take a further look into web3 later on in this series. This web3 contract object is not an instance, it is a factory class which can be used to create contract instances with the **.at()** and **.new()** functions.

Lets also now prepare the bin (compiled binary bytecode) into a variable. Notice that in order to have the expected hex value we need to add `"0x"` to the beginning.
```
> var bountiesBin = "0x" + bountiesOutput.contracts["Bounties.sol:Bounties"].bin
undefined
> bountiesBin
"Ox608060405234801561001057600080fd5b50611040806100206000396000f30060806040526004361061006d576000357c01000000000000000000000000000000000000000...."
```

### Deployment

Now its time to deploy our smart contract!

We first construct our **deployTransactionObject**:
```
> var deployTransationObject = { from: eth.coinbase, data: bountiesBin, gas: 3000000 };
undefined
```
We set the following paramaters in our transaction object.

* **from: eth.coinbase:** the transaction should be sent from the coinbase account
* **data: bountiesBin:** set the binary of our compliled contract as the data input of our transaction
* **gas: 3000000:** we set enough gas for our contract to be deployed

We then invoke our BountiesContract factory function **.new()** passing in our **deployTransationObject** as an argument.
```
> var bountiesInstance = bountiesContract.new(deployTransationObject);
> bountiesInstance
{
abi: [{
constant: false,
inputs: [{...}, {...}],
name: "fulfillBounty",
outputs: [],
payable: false,
stateMutability: "nonpayable",
type: "function"
}, {
constant: false,
inputs: [{...}, {...}],
name: "issueBounty",
outputs: [{...}],
payable: true,
stateMutability: "payable",
type: "function"
}, {
...}],
address: undefined,
transactionHash: "0xbeee5a5db59504c289e30a9843d8bf05bd0dcd66831993fde6a3986e2f022a52"
}
```

So **bountiesInstance** is a web3 object which represents the bounties contract instance deployed to our development environment.

Depending on the version of Geth you are using, you may or may not have the address field set, in the contract instance. Usually this will be set when the transaction to deploy the contract has been mined.

If not, as above address field is set to **undefined**, we will have to manually set the contract address

We can find the contract address by viewing the transaction receipt of the deploy contract transaction. Our **bountiesInstance** object will have a reference to the transactionHash.
```
eth.getTransactionReceipt(bountiesInstance.transactionHash);
{
blockHash: "0x565c4ebb83d9036518c33634d425f37b9ef3aa125e9b09386fbbdd44099892d9",
blockNumber: 1,
contractAddress: "0x1f81f1dd0de1670eac0bfa9e00a854733470d646",
cumulativeGasUsed: 911612,
gasUsed: 911612,
logs: [],
logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
status: "0x1",
transactionHash: "0xbeee5a5db59504c289e30a9843d8bf05bd0dcd66831993fde6a3986e2f022a52",
transactionIndex: 0
}
```
We can see the contract address above is: **“0x1f81f1dd0de1670eac0bfa9e00a854733470d646”**

We can save this as a variable for later use:
```
> var bountiesAddress = eth.getTransactionReceipt(bountiesInstance.transactionHash).contractAddress;
undefined

> bountiesAddress
"0x1f81f1dd0de1670eac0bfa9e00a854733470d646"
```
We now override our existing **bountiesInstance** object using the .at() function of the **bountiesContract** factory to create a bountiesInstance pointing at the correct contract address:
```
> var bountiesInstance = bountiesContract.at(bountiesAddress)
undefined
> bountiesInstance
{
abi: [{
constant: false,
inputs: [{...}, {...}],
name: "fulfillBounty",
outputs: [],
payable: false,
stateMutability: "nonpayable",
type: "function"
}, {
constant: false,
inputs: [{...}, {...}],
name: "issueBounty",
outputs: [{...}],
payable: true,
stateMutability: "payable",
type: "function"
}, {
...}],
address: "0x1f81f1dd0de1670eac0bfa9e00a854733470d646",
transactionHash: null,
BountyCancelled: function(),
BountyFulfilled: function(),
BountyIssued: function(),
FulfillmentAccepted: function(),
acceptFulfillment: function(),
allEvents: function(),
bounties: function(),
cancelBounty: function(),
fulfillBounty: function(),
issueBounty: function()
```
Above now you notice the **bountiesInstance** object now references the correct contract address: **“0x1f81f1dd0de1670eac0bfa9e00a854733470d646”**

Also, we can see the list available functions which are provided by our smart contract.

### Interacting with our contract

In our console, it is also possible to interact with our Bounties contract.

Lets attempt to issue a bounty. To do this we’ll need to set the `string _data` argument to some string “some requirements” and set the `uint64 _deadline` argument to a unix timestamp in the future e.g “1691452800” August 8th 2023.
```
> bountiesInstance.issueBounty("some requirements","1691452800",{ from: eth.accounts[0], value: web3.toWei(1, "ether"), gas: 3000000 });
"0xb3a41fa36c09010abbfa9bf80c3cd11242e4476506d6bf8b363b8feeb3cf946d"

> eth.getTransactionReceipt("0xb3a41fa36c09010abbfa9bf80c3cd11242e4476506d6bf8b363b8feeb3cf946d")
{
blockHash: "0x8acd35b251c3f1c23a6276540e73b958de28686a89367ed108bef9f614771099",
blockNumber: 5,
contractAddress: null,
cumulativeGasUsed: 133594,
gasUsed: 133594,
logs: [{
address: "0x1f81f1dd0de1670eac0bfa9e00a854733470d646",
blockHash: "0x8acd35b251c3f1c23a6276540e73b958de28686a89367ed108bef9f614771099",
blockNumber: 5,
data: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c74a4fba809c8f0e6b410b349f2908a4dbb881230000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000011736f6d6520726571756972656d656e7473000000000000000000000000000000",
logIndex: 0,
topics: ["0xba1576d8891bfe57a45ac4b986d4a4aa912c62f44771d4eec8ab2ce06e3be5b7"],
transactionHash: "0xb3a41fa36c09010abbfa9bf80c3cd11242e4476506d6bf8b363b8feeb3cf946d",
transactionIndex: 0,
type: "mined"
}],
logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000040000000000000000000000000000004000000000000010000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
status: "0x1",
transactionHash: "0xb3a41fa36c09010abbfa9bf80c3cd11242e4476506d6bf8b363b8feeb3cf946d",
transactionIndex: 0
}
```
Above is log output of both the transaction to issue a bounty and the transaction receipt showing the transaction has been successfully mined.

Because this was the first bounty issued, we know from our contract code that the issueBounty function will create this bounty with bountyId of 0.

Also if we inspect the data element of the logs element from the results of the transaction receipt. We will see that the first part of the data ouput is indeed the bountyId of our newly issued bounty:
```
logs: [{
address: "0x1f81f1dd0de1670eac0bfa9e00a854733470d646",
blockHash: "0x8acd35b251c3f1c23a6276540e73b958de28686a89367ed108bef9f614771099",
blockNumber: 5,
data: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c74a4fba809c8f0e6b410b349f2908a4dbb881230000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000011736f6d6520726571756972656d656e7473000000000000000000000000000000",
logIndex: 0,
topics: ["0xba1576d8891bfe57a45ac4b986d4a4aa912c62f44771d4eec8ab2ce06e3be5b7"],
transactionHash: "0xb3a41fa36c09010abbfa9bf80c3cd11242e4476506d6bf8b363b8feeb3cf946d",
transactionIndex: 0,
type: "mined"
}]
```
Now we know the bountyId, we can call the *bounties* function of our *bountiesInstance* web3 object to double check the issueBounty function stored our data correctly:
```
> bountiesInstance.bounties.call(0)
["0xc74a4fba809c8f0e6b410b349f2908a4dbb88123", 1691452800, "some requirements", 0, 1000000000000000000]
```
Here we confirm from the output that our bounty with bountyId=0 has the following data:

* Issuer: “0xc74a4fba809c8f0e6b410b349f2908a4dbb88123”
* deadline: 1691452800
* data: “some requirements”
* bountyId: 0
* amount: 1000000000000000000 (Weis)

Success!

There you have it, we have successfully:

* Compiled out Bounties.sol smart contract
* Deployed it to a local development blockchain
* Issued a bounty by sending a transaction
* Checked out bounty data by making a call to the contract

Now that we have done it the hard way, the next part of the series will look at home development frameworks such as [truffle] (https://truffleframework.com/), [embark] (https://embark.status.im/) and [populous] (https://github.com/ethereum/populus) hide the complexity of this process from us, and allow us to focus on writing smart contracts when developing our dApps!

### Next Steps
- Read the next guide: [Truffle: Smart Contract Compilation & Deployment](https://kauri.io/article/cbc38bf09088426fbefcbe7d42ac679f/truffle:-smart-contract-compilation-and-deployment)
- Learn more about the Truffle suite of tools from the [website](https://truffleframework.com/)

>If you enjoyed this guide, or have any suggestions or questions, let me know in the comments. 

>If you have found any errors, feel free to update this guide by selecting the **'Update Article'** option in the right hand menu, and/or [update the code](https://github.com/kauri-io/kauri-fullstack-dapp-tutorial-series/tree/master/truffle-compilation-and-deploy)


---

- **Kauri original link:** https://kauri.io/understanding-smart-contract-compilation-and-depl/973c5f54c4434bb1b0160cff8c695369/a
- **Kauri original author:** Josh Cassidy (@joshorig)
- **Kauri original Publication date:** 2019-05-02
- **Kauri original tags:** smart-contract, ethereum, abi, deploy, solidity
- **Kauri original hash:** Qmd5yizBatsxkSz1XiwX23HEsX3JAA5PGDCWddHvBcqrhV
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



