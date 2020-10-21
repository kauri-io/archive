---
title: ENS  Beginner's Guide
summary: ENS User experience is a key challenge when developing a dapp. Ethereum has complexities that should be hidden away to enable broad adoption. One such complexity, is an Ethereum address, it is long, unwieldy, and hard to remember. The Ethereum Name Service (ENS) is a useful tool for dapp developers. ENS is like DNS, in that it maps a memorable shortcut to an address. Using ENS we can map the friendly name ethereum.eth to the rather unfriendly 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359. Subsequen
authors:
  - Darren Langley (@darren-langley)
date: 2019-04-09
some_url: 
---

# ENS  Beginner's Guide

![](https://ipfs.infura.io/ipfs/QmQeaL2TQP73ZY9vy4cf9BbbsSCeaDKjPMQTQ96RnuAFEV)


## ENS

User experience is a key challenge when developing a dapp. Ethereum has complexities that should be hidden away to enable broad adoption. One such complexity, is an Ethereum address, it is long, unwieldy, and hard to remember.

The Ethereum Name Service (ENS) is a useful tool for dapp developers. ENS is like DNS, in that it maps a memorable shortcut to an address. Using ENS we can map the friendly name _ethereum.eth_ to the rather unfriendly _0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359_. Subsequently, we can use the friendly name in-place of the address, making it easier to remember, and reducing the chance of errors.

An ENS name has a root name _ethereum.eth_ which can contain sub-names like _wallet.ethereum.eth_. Whoever successfully bid for the root name in a [Vickrey auction](https://medium.com/the-ethereum-name-service/a-beginners-guide-to-buying-an-ens-domain-3ccac2bdc770 "Vickrey auction") owns it. The auction will be replaced with an [instant registration process](https://medium.com/the-ethereum-name-service/dns-permanent-registrar-and-hackathons-ens-development-summary-03-2019-401a30e6316d "instant registration process") set for launch 4th May.

ENS doesn't just map to addresses. ENS is highly extensible and supports many types of mappings. It is possible to map the same friendly name to multiple endpoints at the same time.

For example the _ethereum.eth_ name could point to:

-   A multisig wallet contract address
-   Public encryption keys for secure communication
-   Website content (via IPFS hash or multihash)

## Code Example

Many Ethereum libraries, including Web3.js now support ENS lookups out-of-the-box. Using ENS is not as intuitive as the library documentation suggests, there are a number of things to look out for.

To show how to lookup ENS names we create a simple Node.js command-line tool called _enslookup_. Given an ENS name as an argument it queries the ENS registry for information about that name.

### Prerequisites

First install Node.js and npm by following the install instructions on the [Node.js website](https://nodejs.org/ "Node.js").

If you are not running a full mainnet Ethereum node, [you need to setup an Infura endpoint](https://kauri.io/article/9113c37841e5451fbb2cf2477a3a63e5/v1/infura-101-infrastructure-for-dapps). This is easy to do - just sign up on the [infura.io](https://infura.io) website, create a new project and copy the mainnet URL. It should be something like "mainnet.infura.io/v3/{your project id}".

Now set your Infura URL including _https://_ at the beginning, as an environment variable. This sets it for the current session so if you close your terminal window you need to do it again.

On Linux or macOS:

```shell
export INFURA_URL=https://mainnet.infura.io/v3/{your project id}
```

On Windows:

```powershell
set INFURA_URL=https://mainnet.infura.io/v3/{your project id}
```

Create a new project directory called _enslookup_ and change directory into it.

```shell
mkdir enslookup
cd enslookup
```

### Web3.js

We are using Web3.js to interact with the ENS registry. To install Web3.js use the Node.js package manager.

Create a _package.json_ file.

```shell
npm init -y
```

Then install the Web3.js package.

```shell
npm install web3 --save
```

### Enslookup

Create a new file called _enslookup_ (notice there is no file extension).

If you are on a Linux or macOS, make the file executable:

```shell
chmod +x enslookup
```

Edit the file in your favorite editor - don't worry too much about the code here but it:

-   Allows Node.js to execute the file
-   Allows us to use JavaScript async/await syntax
-   Gets the ENS name from the command's parameters
-   Checks that you have set the Infura URL environment variable

```js
##!/usr/bin/env node

(async () => {

    // get the ens name to lookup as the first argument to the command
    const [,,name] = process.argv;
    // bail if no name provided
    if(!name){
        console.error('No name provided for lookup\nUsage: enslookup <name>')
        return;
    }
    // bail if no infura url provided as environment variable
    if(!process.env.INFURA_URL){
        console.error(`Missing INFURA_URL environment variable`);
        return;
    }
    console.log(`Name:\t\t${name}`);

    // Remaining code goes here

})();
```

Next, we setup Web3.js to connect to Ethereum:

```js
// load web3 library
const Web3 = require('web3');

// connect to an Infura endpoint to connect to Ethereum (passed as Environment Variable)
// feel free to use your own mainnet node
const web3 = new Web3(process.env.INFURA_URL);
```

Now, it is tempting to jump right in and lookup an address using _web3.eth.ens.getAddress(EnsName)_ but there is something important to consider first.

To resolve an address, the ENS name's owner must have configured a resolver smart contract. It is likely that a resolver smart contract has not been configured for the ENS name. If you call _web3.eth.ens.getAddress(EnsName)_ on an ENS name that has no resolver smart contract configured, Web3.js gives you an [unhelpful error message](https://github.com/ethereum/web3.js/issues/2656 "unhelpful error message"). UPDATE: As of Web3 version beta.52 this issue has been resolved - go Web3.js team!

First, we check the existence of the resolver smart contract for the ENS name:

```js
 // get the resolver contract
const resolver = await web3.eth.ens.resolver(name);

// get the resolver contract address
const resolverAddress = resolver.address;
console.log(`Resolver:\t${resolverAddress}`);

// bail if resolver does not exist
if(resolverAddress === '0x0000000000000000000000000000000000000000'){
    return;
}
```

Surely we are ready to lookup an ENS address... right? Yes, kinda...

Looking up addresses has been part of ENS from day 1 but other types of mapping have been added later. Consequently, the resolver smart contracts configured for each ENS name, may differ in what they support because they were deployed at different times.

The ENS team have implemented [standard interface detection](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md "ERC-165 - Standard Interface Detection") to allow checking which mapping types a resolver smart contract supports.

Here is a list of the currently available interfaces (_there are more but some are deprecated_):

```js
const ensInterface = {
    address: '0x3b3b57de',
    contentHash: '0xbc1c58d1',
    pubKey: '0xc8690233'
}
```

Here is how you look up an address and its balance:

```js
if(await web3.eth.ens.supportsInterface(name, ensInterface.address)){
    const address = await web3.eth.ens.getAddress(name);
    const balanceWei = await web3.eth.getBalance(address);
    console.log(`Address:\t${address} (${web3.utils.fromWei(balanceWei, 'ether')} ether)`);
}
```

Here is how you look up a public encryption key:

```js
if(await web3.eth.ens.supportsInterface(name, ensInterface.pubKey)){
    const {x, y} = await web3.eth.ens.getPubkey(name);
    console.log(`Public Key:`);
    console.log(`\t\tx = ${x}`);
    console.log(`\t\ty = ${y}`);
}
```

Here is how you look up a content hash (see [EIP-1577](https://eips.ethereum.org/EIPS/eip-1577) for format):

```js
if(await web3.eth.ens.supportsInterface(name, ensInterface.contentHash)){
    const contentHash = await web3.eth.ens.getContenthash(name);
    console.log(`Content hash:\t${contentHash}`);
}
```

Before you run the _enslookup_ command make sure you set your Infura URL environment variable, as described above.

When running the _enslookup_ command on _ethereum.eth_:

```shell
$ ./enslookup ethereum.eth

Name:		ethereum.eth
Resolver:	0x1da022710dF5002339274AaDEe8D58218e9D6AB5
Address:	0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359 (3295.179176904502385668 ether)
Public Key:
		x = 0x0000000000000000000000000000000000000000000000000000000000000000
		y = 0x0000000000000000000000000000000000000000000000000000000000000000
```

_Note on Windows you have to run node enslookup_

The full code for the enslookup example is available on [github](https://github.com/darrenlangley/enslookup).

## Future of ENS

The ENS team are restlessly adding new features and expanding ENS's capabilities.

For example, they are adding two new mappings:

-   [ABI Definitions](http://eips.ethereum.org/EIPS/eip-205) - for storing smart contract ABI's in ENS (handy)
-   [Text](http://eips.ethereum.org/EIPS/eip-634) - storing of key/value text items against an ENS name

We have only scratched the surface of ENS and its ability to improve user experience.

_How will you use ENS in your dapp?_

**Thank you to [Nick Johnson](https://twitter.com/nicksdjohnson "Nick Johnson") for his great feedback.**




---

- **Kauri original title:** ENS  Beginner's Guide
- **Kauri original link:** https://kauri.io/ens-beginners-guide/e7f098b57fd24afe9b70506517dd5a63/a
- **Kauri original author:** Darren Langley (@darren-langley)
- **Kauri original Publication date:** 2019-04-09
- **Kauri original tags:** ethereum, ens
- **Kauri original hash:** QmWsRZSizLAMLCYw1ttwwFvHELWQtC7nNHtd8iTeKYRnnc
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



