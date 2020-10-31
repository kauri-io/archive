---
title: SKALE  Ethereum-compatible sidechains
summary: SKALEs elastic sidechains provide all benefits of standard full-capacity sidechains alongside the security guarantees of truly decentralized networks. Elastic sidechains are highly performant, configurable, and Ethereum / Web3 Compatible. Follow the steps below to start using SKALE. If you have your SKALE Chains (S-Chain) already set up and you are looking for examples, please see Code Samples. 1. Connect to your S-Chain For SKALE Innovator Program participants, access to your S-Chain will be pr
authors:
  - Kauri Team (@kauri)
date: 2019-04-17
some_url: 
---

# SKALE  Ethereum-compatible sidechains

![](https://ipfs.infura.io/ipfs/QmYM6J6iRfCSU1YozYfv62xT2hB5wR5Bqqzs4UR6FK6jAK)


> SKALE's elastic sidechains provide all benefits of standard full-capacity sidechains alongside the security guarantees of truly decentralized networks. Elastic sidechains are highly performant, configurable, and Ethereum / Web3 Compatible. 

Follow the steps below to start using SKALE. If you have your SKALE Chains (S-Chain) already set up and you are looking for examples, please see Code Samples. 

## 1. Connect to your S-Chain

> For SKALE Innovator Program participants, access to your S-Chain will be provided by your Account Manager. Please reach out to your Account Manager directly.

SKALE Chains on the devnet will already be configured for you, and will not require any updates to get started with deploying your Smart Contracts onto SKALE. 

### Connect MetaMask to SKALE

You will need to connect MetaMask to your SKALE Chain, by creating a Custom RPC connection to your SKALE Chain. Make sure to use the SKALE Chain endpoint provided to you by the SKALE team.
‍
MetaMask will be used to sign all transactions, including the initial deployment of your contracts onto SKALE.

![](https://ipfs.infura.io/ipfs/QmPMx2w5e9gU9SywMGdbcgqBVAivr9PxSr7nQJJi2uruVP)

### Fund Your Wallet

In order to use your SKALE Chain, you will need to fund your MetaMask wallet account with the SKALE devnet Ether tokens. This can be accomplished by providing your devnet wallet address and your team name to our discord channel. We will transfer 1 devnet Ether to your account within 2 hours.

> For SKALE Innovator Program participants, your Account Manager will provide a private discord channel for receiving testnet Ether.

<div class="button-container" style="height: 100px;"><a href="https://discord.gg/vrtVXNt" data-w-id="350e333d-25e5-72c8-f5f1-ec950776d26c" target="_blank" class="button-docs w-button" style="border-color: rgb(0, 0, 181); background-color: rgb(0, 0, 181); transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; border-radius: 2px; color: white!important; padding: 10px 15px 10px 15px">Get Test ETH</a></div>

## 2. Migrate Smart Contracts to S-Chain
SKALE is able to process smart contracts written in Solidity. This makes migrating your smart contracts from Ethereum fast and easy. Some smart contract updates or changes may be needed to enable certain features in SKALE such as transferring money and saving state. Please reference the respective sections within [Code Samples](https://developers.skalelabs.com/code-samples).

You can point your deployment scripts for your existing smart contracts to your S-Chain’s address and deploy using existing tooling (e.g.: Truffle). An example truffle deployment command is:
```
truffle deploy --reset --network [ENTER_YOUR_NETWORK] --compile-all
```
See [Code Samples](https://developers.skalelabs.com/code-samples) for more deployment script examples.

![](https://ipfs.infura.io/ipfs/QmXGFVF26dGd1pXyweks5CRAwzMp9nvkfX3gX64FHH4kQ8)
<br>
## 3. Send a Transaction
Once your smart contracts have been moved over to your SKALE Chain, you can test sending out a new transaction.


---

- **Kauri original title:** SKALE  Ethereum-compatible sidechains
- **Kauri original link:** https://kauri.io/skale-ethereumcompatible-sidechains/1695fa6d727347e58af02ba7c36a0581/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2019-04-17
- **Kauri original tags:** scaling, sidechain
- **Kauri original hash:** QmZnbS72HCD9AMVz8Vhj5NCLj6maoQpdFVEPGotMMF5tHw
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



