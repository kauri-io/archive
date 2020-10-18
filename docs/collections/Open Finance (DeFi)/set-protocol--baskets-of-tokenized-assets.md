---
title: Set Protocol  Baskets of tokenized assets
summary: Set Protocol allows grouping multiple tokens into one asset. Each set is a deployed smart contract with each set being fully-collateralized. Anyone can deposit a token to the set contract and withdraw them back, which makes the sets permissionless. Sets comply with the ERC20 standard, so they can be transferred and traded on exchanges. This also means that sets can be grouped into other sets. This article originally appeared on the Set Protocol Docs Portal Welcome Settler of Tokan 👋 setprotocol
authors:
  - Kauri Team (@kauri)
date: 2019-04-08
some_url: 
---

# Set Protocol  Baskets of tokenized assets


> Set Protocol allows grouping multiple tokens into one asset. Each set is a deployed smart contract with each set being fully-collateralized. Anyone can deposit a token to the set contract and withdraw them back, which makes the sets permissionless. Sets comply with the ERC20 standard, so they can be transferred and traded on exchanges. This also means that sets can be grouped into other sets.

_This article originally appeared on the [Set Protocol Docs Portal](https://docs.setprotocol.com/#/getting-started)_

Welcome Settler of Tokan 👋 setprotocol.js is a Javascript library for interacting with Set Protocol.

**Warning:** This is Alpha software, and is subject to non-backwards compatible changes. Please develop at your own risk of major changes.

Now that we got that out of the way, let’s get started 🚀

## Concepts
#### Typescript
[setprotocol.js](https://www.npmjs.com/package/setprotocol.js) and [set-protocol-contracts](https://www.npmjs.com/package/set-protocol-contracts) utilize Typescript to enforce strong static typing throughout our code bases. This makes typing checking and schema validation seamless which is particularly useful when working with financial products where there are many conversions and abstractions used.

You can find more about Typescript [here](https://www.typescriptlang.org/).

#### Async / Await
`setprotocol.js` is a promised-based library and makes heavy use of asynchronous calls. We recommend using the latest async / await syntax for clean asynchronous code without having to use a third party coroutine implementation. It looks something like this:
```
const getUserBalance = async function(userAddress) {
  return await setProtocol.erc20.balanceOf(userAddress);
};
```
You can learn more about async / await [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

#### BigNumber
Our libraries utilize the `bignumber.js` library for representations of large numbers in Javascript. This is due to Javascript’s inability to handle large numbers properly (more on this later). When passing numerical figures into `setprotocol.js` functions, we require that they be instances of BigNumber:
```
const quantityToIssue = new BigNumber(1000000);
```
If you’re having issues with BigNumber, it may be that you are using the wrong version. Try using BigNumber `v5.0.0` vs the latest.

## Installation
#### setprotocol.js
The Javascript SDK can be installed via `yarn` or `npm`.

#### BigNumber.js @ ^5.0.0
`setprotocol.js` uses BigNumber to represent large numbers. The latest stable version we use is `BigNumber@^5.0.0`.

#### Web3 1.0
This newest 1.1.0 release candidate of `setprotocol.js` uses Web3 1.0. If you want to use the older versions of web3, you will need to use an older version of setprotocol.js (i.e. v1.2.0-rc12).

```
// Recommended method
yarn add setprotocol.js
yarn add bignumber.js@^5.0.0
yarn add web3@1.0.0-beta.36
​
// or
npm install --save setprotocol.js
npm install --save bignumber.js@^5.0.0
npm install --save web3@1.0.0-beta.36
```

## Usage
Let’s initialize our `setProtocol` instance. We need to first import our library like this:
```
import SetProtocol from 'setprotocol.js';
```
#### Config
When instantiating an instance of `setProtocol`, the constructor requires a provider and config object.

The configuration object requires inputs of the suite of Set smart contract addresses: Core, Transfer Proxy, Vault, RebalanceAuctionModule, Set Token Factory, Rebalancing Set Token Factory, Exchange Issue Module, Issuance Order Module, Rebalancing Token Issuance Module, and Payable Exchange Issue. The following external contract addresses are also required: Kyber Network Wrapper and Wrapped Ether.
```
const config = {
  coreAddress: '0xxxx'
  transferProxyAddress: '0x...',
  vaultAddress: '0x...',
  rebalanceAuctionModuleAddress: '0x...',
  kyberNetworkWrapperAddress: '0x...',
  setTokenFactoryAddress: '0x...',
  rebalancingSetTokenFactoryAddress: '0x...',
  exchangeIssueModuleAddress: '0x...',
  issuanceOrderModuleAddress: '0x...',
  rebalancingTokenIssuanceModule: '0x...',
  payableExchangeIssue: '0x...',
  wrappedEtherAddress: '0x...',
};
```
For reference, we’ve provided the contract addresses below across multiple networks. We recommend using `Kovan` TestNet since it contains the 0x exchange contract which is required to build a Set relayer that consumes 0x orders for liquidity (more on this later).

The rest of the contracts can be found in the Smart Contract section [here](https://docs.setprotocol.com/#/contracts/#deployed-contracts).

| Network | Contract                       | Address                                    | 
|---------|--------------------------------|--------------------------------------------| 
| MainNet | [Core](https://etherscan.io/address/0x75FBBDEAfE23a48c0736B2731b956b7a03aDcfB2)                          | 0x75FBBDEAfE23a48c0736B2731b956b7a03aDcfB2 | 
|         | [ExchangeIssueModule](https://etherscan.io/address/0x38E5462BBE6A72F79606c1A0007468aA4334A92b)            | 0x38E5462BBE6A72F79606c1A0007468aA4334A92b | 
|         | [IssuanceOrderModule](https://etherscan.io/address/0x8440f6a2c42118bed0D6E6A89Bf170ffd13e21c0)            | 0x8440f6a2c42118bed0D6E6A89Bf170ffd13e21c0 | 
|         | [KyberNetworkWrapper](https://etherscan.io/address/0x3700414Bb6716FcD8B14344fb10DDd91FdEA59eC)           | 0x3700414Bb6716FcD8B14344fb10DDd91FdEA59eC | 
|         | [PayableExchangeIssue](https://etherscan.io/address/0x18B739aabC019d9eF160D44BA8A9dD6a717372Af)           | 0x18B739aabC019d9eF160D44BA8A9dD6a717372Af | 
|         | [RebalanceAuctionModule](https://etherscan.io/address/0x1db929398958082d2080AA1B501e460503f60467)         | 0x1db929398958082d2080AA1B501e460503f60467 | 
|         | [RebalancingSetTokenFactory](https://etherscan.io/address/0x4c4C649455c6433dC48ff1571C9e50aC58f0CeFA)     | 0x4c4C649455c6433dC48ff1571C9e50aC58f0CeFA | 
|         | [RebalancingTokenIssuanceModule](https://etherscan.io/address/0x1F6eE9CE38E6BEEB968BB91f755998548D3165e0) | 0x1F6eE9CE38E6BEEB968BB91f755998548D3165e0 | 
|         | [SetTokenFactory](https://etherscan.io/address/0x14f0321be5e581abF9d5BC76260bf015Dc04C53d)                | 0x14f0321be5e581abF9d5BC76260bf015Dc04C53d | 
|         | [TransferProxy](https://etherscan.io/address/0x25C499e7306248C308cef403D9824110817b305C)                  | 0x25C499e7306248C308cef403D9824110817b305C | 
|         | [Vault](https://etherscan.io/address/0x5ecd8E3b059BC5A69E2d7a73c60Bd4E9788972FF)                          | 0x5ecd8E3b059BC5A69E2d7a73c60Bd4E9788972FF | 
|         | [Wrapped Ether](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)                  | 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 | 
| Kovan   | [Core](https://etherscan.io/address/0x79c9eCb5c9a34d5FFd2aDc956AdCaFcC6F983234)                           | 0x79c9eCb5c9a34d5FFd2aDc956AdCaFcC6F983234 | 
|         | [ExchangeIssueModule](https://etherscan.io/address/0x5507dB57A67C029a33F0CC89B641C1963F4c9a4c)            | 0x5507dB57A67C029a33F0CC89B641C1963F4c9a4c | 
|         | [IssuanceOrderModule](https://etherscan.io/address/0x2De291709980Dd2640c33e614E97D4e0aB4F1a27)            | 0x2De291709980Dd2640c33e614E97D4e0aB4F1a27 | 
|         | [KyberNetworkWrapper](https://etherscan.io/address/0x40c39C462264ff8E0C372d3F18b6F0444d048e43)            | 0x40c39C462264ff8E0C372d3F18b6F0444d048e43 | 
|         | [PayableExchangeIssue](https://etherscan.io/address/0x6E9C790fE4329e012BBd7DF93AbcA42276aCE374)           | 0x6E9C790fE4329e012BBd7DF93AbcA42276aCE374 | 
|         | [RebalanceAuctionModule](https://etherscan.io/address/0x2C229EE3aD3fdC0e581d51BaA6b6f45CC9A6Ca39)         | 0x2C229EE3aD3fdC0e581d51BaA6b6f45CC9A6Ca39 | 
|         | [RebalancingSetTokenFactory](https://etherscan.io/address/0x5A736e0706066B4C3F91dbD1599A2C83b1Efe6f7)     | 0x5A736e0706066B4C3F91dbD1599A2C83b1Efe6f7 | 
|         | [RebalancingTokenIssuanceModule](https://etherscan.io/address/0x806E2a3e6dfB2387a4FfB7A44D8756b2EaFA574f) | 0x806E2a3e6dfB2387a4FfB7A44D8756b2EaFA574f | 
|         | [SetTokenFactory](https://etherscan.io/address/0x8F43Ee43cE545193A79466642BC5FfF381036908)                | 0x8F43Ee43cE545193A79466642BC5FfF381036908 | 
|         | [TransferProxy](https://etherscan.io/address/0x640f4F4AA4e4449F630d37801CAF5452b9462AC4)                  | 0x640f4F4AA4e4449F630d37801CAF5452b9462AC4 | 
|         | [Vault](https://etherscan.io/address/0xb53A6593169A2974282f5690928FAe897A738571)                          | 0xb53A6593169A2974282f5690928FAe897A738571 | 
| TestRPC | Core                           | 0x5315e44798395d4a952530d131249fe00f554565 | 
|         | SetTokenFactory                | 0xdff540fe764855d3175dcfae9d91ae8aee5c6d6f | 
|         | Vault                          | 0x72d5a2213bfe46df9fbda08e22f536ac6ca8907e | 
|         | TransferProxy                  | 0x2ebb94cc79d7d0f1195300aaf191d118f53292a8 | 
|         | RebalancingSetTokenFactory     | 0xc1be2c0bb387aa13d5019a9c518e8bc93cb53360 | 

## Blockchain Setup
**We recommend using the TestNet smart contracts**, but we support developing on TestRPC here as well.

**If you’re going to run on TestNet, you can go ahead and skip this section.**

We have an Ethereum blockchain snapshot set up for you with `setprotocol.js` that is preloaded with all of the Set Protocol contracts.

First, create your `set-chain` script that runs your TestRPC locally.
```
// package.json
"scripts": {
  "set-chain": "set-chain"
}
```
Then open a new terminal tab in the same directory and run the following command.
```
yarn set-chain
```
This runs a blockchain locally using [Ganache-cli](https://github.com/trufflesuite/ganache-cli) with the snapshots at `http://localhost:8545`.

## Web3
Next, we need to instantiate the web3 `provider` to pass into the `SetProtocol` constructor. If you’re developing using a local node or TestRPC, the chain can be found at port 8545. If no instance is passed in (for instance when Metamask is injected into the global scope), we’ll attempt to use the Metamask Web3 object.

#### TestNet Method
When trying to connect to TestNet, use the web3 `provider` injected by MetaMask or Mist.
```
import * as Web3 from 'web3';
​
const injectedWeb3 = window.web3 || undefined;
let provider;
try {
  // Use MetaMask/Mist provider
  provider = injectedWeb3.currentProvider;
} catch (err) {
  // Throws when user doesn't have MetaMask/Mist running
  throw new Error(`No injected web3 found when initializing setProtocol: ${err}`);
}
```
#### Local TestRPC Method
```
import * as Web3 from 'web3';
​
const web3 = new Web3();
​
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
```
#### Typescript
If you’re using Typescript, you’ll need to declare your `web3` module. To do this, we’ll borrow from 0x who have generously exported Web3 typings for our use. Run:
```
yarn add @0xproject/typescript-typings
```
And add the following to your `tsconfig.json`:
```
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "typeRoots": [
      "node_modules/@0xproject/typescript-typings/types",
      "node_modules/setprotocol.js/src/types",
      "node_modules/@types"
    ],
    "paths": {
      "*": [
        "node_modules/@0xproject/typescript-typings/types/*",
      ]
    }
  }
}
```
This tells Typescript to look inside of the `node_modules/@0xproject/typescript-typings/types` and `node_modules/setprotocol.js/src/types` for type definitions, alongside the default `@types` folder.

Next, you‘ll need to declare web3 on the Window object if you‘re using web3 on the front-end:
```
declare global {
  // tslint:disable-next-line
  interface Window { web3: any; }
}
```
#### Instantiation
Finally, we can instantiate our setProtocol instance by passing in the provider and configuration.
```
const setProtocol = new SetProtocol(provider, config);
```
## Summary
With our packages imported, config set up, web3 initialized, and `setProtocol` instantiated, it should look like this:
```
import SetProtocol from 'setprotocol.js';
import * as Web3 from 'web3';
​
// Kovan Config
const config = {
  coreAddress: '0x79c9eCb5c9a34d5FFd2aDc956AdCaFcC6F983234',
  exchangeIssueModuleAddress: '0x5507dB57A67C029a33F0CC89B641C1963F4c9a4c',
  issuanceOrderModuleAddress: '0x2De291709980Dd2640c33e614E97D4e0aB4F1a27',
  kyberNetworkWrapperAddress: '0x40c39C462264ff8E0C372d3F18b6F0444d048e43',
  payableExchangeIssueAddress: '0x6E9C790fE4329e012BBd7DF93AbcA42276aCE374',
  rebalanceAuctionModuleAddress: '0x2C229EE3aD3fdC0e581d51BaA6b6f45CC9A6Ca39',
  rebalancingSetTokenFactoryAddress: '0x5A736e0706066B4C3F91dbD1599A2C83b1Efe6f7',
  rebalancingTokenIssuanceModuleAddress: '0x806E2a3e6dfB2387a4FfB7A44D8756b2EaFA574f',
  setTokenFactoryAddress: '0x8F43Ee43cE545193A79466642BC5FfF381036908',
  transferProxyAddress: '0x640f4F4AA4e4449F630d37801CAF5452b9462AC4',
  wrappedEtherAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  vaultAddress: '0xb53A6593169A2974282f5690928FAe897A738571',
};
​
const injectedWeb3 = window.web3 || undefined;
let provider;
try {
  // Use MetaMask/Mist provider
  provider = injectedWeb3.currentProvider;
} catch (err) {
  // Throws when user doesn't have MetaMask/Mist running
  throw new Error(`No injected web3 found when initializing setProtocol: ${err}`);
}
​
const setProtocol = new SetProtocol(provider, config);
```
We can now start calling functions on the `setProtocol` instance like this:
```
// Example of calling createSetAsync method
const txHash = await setProtocol.createSetAsync(/* args */);
```
## 🎉 Congrats!
Now you’re ready to start building! Try your hand at some of our tutorials:

* [Create a Set](https://docs.setprotocol.com/#/tutorials#create-a-stable-set)
* [Issuing a Set](https://docs.setprotocol.com/#/tutorials#issuing-a-set)
* [Redeeming a Set](https://docs.setprotocol.com/#/tutorials#redeeming-a-set)
* [Create and Fill Issuance Order](https://docs.setprotocol.com/#/tutorials#create-and-fill-issuance-order)
* [Fill Issuance Order with 0x](https://docs.setprotocol.com/#/tutorials#0x-protocol-issuance-order-fill)