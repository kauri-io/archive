---
title: Connext  Peer-to-Peer Payment Channels
summary: Connext is building open source, p2p micropayment infrastructure. Their first product uses payment channels on the Ethereum blockchain. Payment channels allow many off-chain transactions to be aggregated into a much smaller number of on-chain transactions. Introduction This guide aims to provide just enough information to get started building an application with Connext. If youre already familiar with Connext and how payment channels work, feel free to skip down to the Components section. These
authors:
  - Kauri Team (@kauri)
date: 2019-05-13
some_url: 
---

# Connext  Peer-to-Peer Payment Channels

![](https://ipfs.infura.io/ipfs/QmW9QFTyAUnd4NwfNiehLpNQsow2e8W1sn2Aq6EVrzKDX9)


> Connext is building open source, p2p micropayment infrastructure. Their first product uses payment channels on the Ethereum blockchain. Payment channels allow many off-chain transactions to be aggregated into a much smaller number of on-chain transactions.

## Introduction

This guide aims to provide just enough information to get started building an application with Connext. If you're already familiar with Connext and how payment channels work, feel free to skip down to the [Components](#Connext-Components) section. These examples are high-level and intended only to get users started; if you're looking for more detailed technical guides please refer to the READMEs of individual components (linked below). 

If you're unfamiliar with terms like smart contract and private key, please refer to a more general developer guide such as [this one, compiled by the Ethereum community](https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial), before continuing.


## Table of Contents
* [Payment Channels](#Payment-Channels)
    * [How It Works](#How-It-Works)
    * [Disputes](#Disputes)
    * [Hubs](#Hubs)
    * [Custodial vs. Noncustodial](#Custodial-vs.-Noncustodial)
* [Connext Components](#Connext-Components)
    * [Architecture Overview](#Architecture-Overview)
    * [Indra](#Indra)
    * [Client](#Client)
    * [Contracts](#Contracts)
    * [Card](#Card)
* [Integration Guide](#Integration-Guide)

### Payment Channels

Payment channels underpin our architecture. They allow many off-chain transactions to be aggregated into just a few onchain transactions. Here, we described the basic tenets of payment channels. If you're looking for more information, here are a few digestible resources:

- [LearnChannels](https://learnchannels.org/)
- [State Channels for Dummies Series](https://medium.com/blockchannel/counterfactual-for-dummies-part-1-8ff164f78540)
- [State Channels for Babies Series](https://medium.com/connext/state-channels-for-babies-c39a8001d9af)
 

#### How It Works

1. Two users lock the initial blockchain state (i.e., each party's balance) into a smart contract closely resembling a multisig wallet. This ensures that the funds in the wallet can't be used elsewhere or removed until unlocked with an update that both parties have signed.

2. The two parties transact by passing state updates (i.e., balance updates) amongst themselves. If both parties agree on a state update by "signing" it, it could be submitted to the smart contract at any time to unlock funds.

3. When parties have finished transacting, they each submit state updates to the smart contract. If the state updates match, the blockchain state (i.e., each party's balance) is unlocked, typically in a different configuration than the initial state.


#### Disputes

Each state update that is signed by both parties is assigned a "nonce", or a number that uniquely identifies that update. More recent nonces trump older nonces.

As soon as Party A (let's call her Alice) submits a state update, a challenge period starts. During this period, Party B (let's call him Bob) has the opportunity to submit an update with a more recent nonce. When the challenge timer expires, the update with the most recent nonce is used to unlock the blockchain state and distribute funds appropriately.

If the challenge period expires and Bob hasn't submitted a more recent state update than Alice, funds are disbursed according to the most recent double-signed state update (in this case, the one submitted by Alice). In this case, Bob isn't actually cheated out of any money--he misses out on the more recent state update (which is likely beneficial to him). Everyone gets paid the amount that they most recently agreed upon.

Obviously, that's a situation most people would like to avoid, especially since a party who intentionally submits an old state probably lost money in a later state update. There are a few potential solutions to this; one is the challenge timer itself, which at the very least allows Bob some time to submit his state update. Another is a third-party "watchtower" system, which would automatically monitor the channel and (for a small fee) submit the most recent update for Bob even if he's offline.

#### Hubs

Single channels (i.e., Party A connected to Party B) work well if you have a financial relationship with some entity or person where you make payments frequently or in metered amounts. Most payments between two specific users, however, are relatively infrequent; few payment paradigms entail repeated payments between the same counterparties. Consider an ecosystem of Parties A, B, C, and D: Party A might not pay any individual counterparty with sufficient frequency to justify a channel, but they might pay Parties B, C, and D often enough for onchain transactions to become prohibitively costly. 

There are several solutions to this: one, as implemented by Bitcoin's Lightning Network, is to find a route from Party A to Party B, C, or D through a network of peers. Our solution is to have those all users connect to a Hub, typically run by a business that needs to facilitate P2P payments. Once connected to the Hub, users are able to pay any other user that is also connected to that Hub.

Here's how it works: the Hub translates a single state transition (Party A pays Party B 1ETH) into two: Party A pays the Hub 1ETH, then the Hub pays Party B 1ETH. Under the hood, this is a simple calculation on the hub's behalf: decrement the balance of Party A by 1ETH and increment the balance of PartyA by 1ETH.

#### Custodial vs. Noncustodial

Our current release is custodial, meaning that the Hub briefly takes ownership of the funds that Party A pays Party B. This means that users currently rely on the Hub to forward the payment; because of demand from the community, we made the decision to ship a usable product and iteratively improve on trustlessness and decentralization. 

In our noncustodial release (coming in late January 2019), peer-to-peer transactions will be conducted in threads rather than channels. When two parties (who each have a channel open with the Hub) want to open a thread, they each send a signed request to the hub recording the funds that they are committing to the thread. Those funds are locked for use in the thread and cannot be spent elsewhere until they are withdrawn from the thread.

Once the hub has recorded the initial thread state, it no longer needs to observe interactions between the two parties. In a bidirectional paradigm (i.e. payments can flow in either direction), they can pass signed state updates back and forth until they wish to stop transacting and close the thread; at that point, they submit their most recent state update to the hub. The hub compares the balances in that update to the initial state and, after a challenge period and if they make sense, distributes funds between the two parties in accordance with the new state. Then, it decomposes the transaction into two payments as described above.

In this paradigm, the hub doesn't need to take money from Party A, hold it, and pass it to Party B. The Hub is never actually moving around user money; rather, it's just rebalancing the funds with which it has collateralized the users' channels. Moreover, it will be possible to conduct all off-chain state transitions that the hub facilitates, on-chain via the contract. As a result, users will not need to trust the Hub.

### Connext Components

#### Architecture Overview

Connext is composed of three components that interoperate. At the core of the platform is our [ChannelManager](https://github.com/ConnextProject/contracts), which handle the onchain complexities of depositing to and withdrawing from payment channels, as well as disputing outcomes. 

The [Client package](https://github.com/ConnextProject/connext-client) enables easy interaction with onchain functionality, in addition to allowing end users to make offchain payments amongst themselves. Specifically, it creates and validates offchain state updates, and helps users interact with our ChannelManager contract and the Hub.

Our [Hubs](https://github.com/ConnextProject/indra) can be thought of as an automated implementation of the Client package: once launched, their logic allows the Hub operator to manage many open channels and threads and facilitate payments between the users that are connected to that Hub.

![Architecture diagram](https://github.com/ConnextProject/docs/blob/master/ConnextArchitecture.png)



#### Indra

Indra is the core implementation repository for Connext. Indra contains ready-for-deployment code for our core contracts and the scripts needed to set up your own Hub. Indra and accompanying documentation are fully available [here](https://github.com/ConnextProject/indra).

Indra contains source code for the Hub, supporting services and associated infrastructure. In deployment, however, the code needed to set up a Hub is programmatically pulled from our docker repositories when calling the deploy script. This is done for ease of use and stability.

#### Client
The Connext Client package is a Typescript interface which is used to communicate with deployed Connext contracts and with other clients. The client package is available through [NPM](https://www.npmjs.com/package/connext).

Clients are typically integrated into client-side code: either the frontend of your application or directly into the wallet layer (see [Wallet](#Wallet) for more). While you can use a combination of the Client and the contracts as a hot wallet, we recommend that you use an inpage wallet to autosign transactions. This allows you to abstract away many of the complexities of payment channels for your users and reduce UX friction.

Clients contain the following functionality:

* Depositing to a channel
* Opening a thread to any counterparty 
* Closing a thread and automatically submitting the latest available mutually agreed update.
* Withdrawing from a channel and automatically submitting the latest available mutually agreed update.
* Handling a dispute.
* Generating/signing/sending and validating/receiving state updates over HTTPs. The Client takes in the address of the server that is being used to pass messages in the constructor.

Payment channel implementations need a communication layer where users can pass signed state updates to each other. The initial implementation of Connext does this through traditional server-client HTTPS requests. While this is the simplest and most effective mechanism for now, we plan to move to a synchronous message passing layer that doesn't depend on a centralized server as soon as possible.

An overview of how to integrate the client can be found in [Wallet](#Wallet).

#### Contracts 

Our payment channel contracts. Our implementation relies on a combination of the research done by a variety of organizations, including Spankchain, Finality, Althea, Magmo and CounterFactual. Contracts and comprehensive documentation are fully open source and are available [here](https://github.com/ConnextProject/contracts).

The contracts repository should only be used for development purposes. The latest stable version of the contracts which works with Hub and Client will always be kept in Indra. For contributor documentation, check the repository.

#### Card 

The [card](https://github.com/ConnextProject/card/) is designed to help you bootstrap an application that integrates Connext. It contains a simple inpage wallet and payment interface, as well as a custom Web3 injection that automatically signs transactions using the inpage wallet. For developers just beginning to build their application, the wallet is a great way to get started; for developers looking to integrate with existing an existing app, it's a good instructive resource for implementation and includes some components that you can easily copy over.

Repo Link: https://github.com/ConnextProject/card
Card Integration Guide: https://github.com/ConnextProject/card/blob/master/README.md

### Integration Guide

Integrating Connext and the hosted Dai hub allows you to make instant, trust-minimized, off-chain payments to anyone else connected to the hub. In this guide, we assume that you're familiar with the basics of payment channels (as outlined in the first few sections of this documentation). 


#### Contents:

- [Setting Up](#setting-up)
  - [Local Development](#local-development)
  - [Connecting to Other Networks](#connecting-to-other-networks)
  - [Hosting a Hub](#Hosting-a-Hub)
- [Integrating the Client](#integrating-the-client)
  - [Basic Example](#basic-example)
- [Core Concepts](#core-concepts)
  - [Signing State Updates](#signing-state-updates)
  - [Collateral](#collateral)
  - [Availability](#availability)
  - [Trust Assumptions](#trust-assumptions)

### Setting Up

Before getting started integrating connext, make sure you have the following prerequisites installed:

- Node 9+
- Docker (if not using docker for local development)
- Make (if not using docker for local development)

#### Local Development

When developing locally, you will also need to make sure you have a local hub deployed. Make sure you get the hub up and running, according to the instructions found in the [indra repository](https://github.com/ConnextProject/indra).

After your hub is running locally, install the client in your frontend:

```javascript
npm install connext
```

and configure your environment.

##### With Docker (recommended)

Add the following variables to your `.env`:

```bash
HUB_URL=http://localhost:3000/api/hub
RPC_URL=http://localhost:3000/api/eth
```

To easily send tokens or wei from Metamask to your local network, mport the following private key (hub's key):
```659CBB0E2411A44DB63778987B1E22153C086A95EB6B18BDF89DE078917ABC63```

Additionally, create a custom RPC with the url: `http://localhost:3000/api/eth`.

##### Without Docker

Add the following variables to your `.env`:

```bash
HUB_URL=http://localhost:8080
RPC_URL=http://localhost:8545
```

To easily send tokens or wei from Metamask to your local network, mport the following private key (hub's key):
```09CD8192C4AD4DD3B023A8EF381A24D29266EBD4AF88ECDAC92EC874E1C2FED8```

Your Metamask should use the traditional ganache RPC url: `http://localhost:8545`

#### Connecting to Other Networks

If you are ready to test on rinkeby or on mainnet, update your `.env` variables:

```bash
## Rinkeby Hub
HUB_URL=https://daicard.io/api/rinkeby/hub
RPC_URL=https://eth-rinkeby.alchemyapi.io/jsonrpc/SU-VoQIQnzxwTrccH4tfjrQRTCrNiX6w
## Mainnet Hub
HUB_URL=https://daicard.io/api/mainnet/hub
RPC_URL=https://eth-mainnet.alchemyapi.io/jsonrpc/rHT6GXtmGtMxV66Bvv8aXLOUc6lp0m_-
```

#### Hosting a Hub

Interested in hosting a hub? Check out the [indra repository](https://github.com/ConnextProject/indra) for more information on running, deploying, and hosting your own hub.

### Integrating the Client

#### Basic Example

To start using a channel, just deposit from the signing wallet into the ChannelManger contract and start making payments!

```javascript
// Import the client and environment
require('dotenv').config()
import { getConnextClient } from "connext/dist/Connext.js";
const Web3 = require("web3");

// instantiate web3, get signer
const web3 = new Web3(process.env.RPC_URL)
const accounts = await web3.eth.getAccounts()

// set the client options
const connextOptions = {
  web3,
  hubUrl: process.env.HUB_URL,
  user: accounts[0],
  origin: 'localhost' // the host url of your app
}

// instantiate a new instance of the client
const connext = await getConnext(connextOptions)

// the connext client is an event emitter
// start the app, and register a listener
connext.on('onStateChange', connext => {
  console.log('Connext:', connext)
}
// start connext
await connext.start()

// Now that the client is started, you can make a deposit into the channel.
// Channels can accept deposits in both ETH and tokens. However, when depositing tokens,
// ensure the user has sufficient ETH remaining in their wallet to afford the gas
// of the deposit transaction.

// make a deposit in ETH
await connext.deposit({
  amountWei: "1500",
  amountToken: "0", // assumed to be in wei units
})

// Congratulations! You have now opened a payment channel with the hub,
// and you are ready to start updating your state. Connext facilitates
// in channel exchanges, token payments, and channel withdrawals in wei.

// exchange wei for dai
await connext.exchange("1000", "wei");

// make a dai payment
// payments made can be retrieved using the returned purchase id,
// which ties together all payment channel updates initiated in the array.
const purchaseId = await connext.buy({
  meta: {

  },
  payments: [
    {
      recipient: "0x7fab....", // payee  address
      amount: {
        amountToken: "10",
        amountWei: "0" // only token payments are facilitated
      },
      type: "PT_CHANNEL", // the payment type, see the client docs for more
    },
  ]
})

// Note: The hub is responsible for collateralizing all payments
// If the hub does not have funds to forward the payment in the
// payment recipient's channel, the payment will fail until the
// hub is able to deposit more tokens into the channel.
// See the Collateral section to learn more

// withdraw funds from channel as wei
// the token funds that are in your channel are exchanged for
// wei on chain as part of the withdrawal
await connext.withdraw({
  // address to receive withdrawal funds
  // does not need to have a channel with connext to receive funds
  recipient: "0x8cef....",
  // USD price if using dai
  exchangeRate: "139.35",
  // wei to transfer from the user's balance to 'recipient'
  withdrawalWeiUser: "500",
  // tokens from channel balance to sell back to hub
  tokensToSell: "990",
})
```

Further documentation on the client can be found [here](https://docs.connext.network/en/latest/develop/client.html). Check out the [Dai Card](https://daicard.io) live, and its [source](https://github.com/ConnextProject/card) for a more detailed example.

### Core Concepts

#### Signing State Updates

The signing wallet is the ethereum address that is used to sign the state updates within the channel. The signing wallet can be any ethereum account you have access to (such as Metamask), however, it is important to understand how signing affects user experience.

When using a Metamask account as the signer, for instance, your users will have to explicitly approve any signature requested of them. The resultant signature pop-ups must be resolved before the channel state can be advanced, and often significantly detract from UX.

To avoid this, you can implement a custom provider that defaults to approving and signing messages without requiring explicit user input (i.e. a signing pop-up). An example autosigner implmentation can be found [here](https://github.com/ConnextProject/card/blob/master/src/utils/ProviderOptions.ts). Error checks against malformed state updates are performed before signing, and any application-specific errors should be checked before calling Connext functions to avoid an improper state update.

#### Collateral

If you are using trust-minimized payments, you will only be able to make payments if the hub at least that amount in the payee's channel. For example, if Alice pays Bob 10 DAI through the hub, the hub must have at least 10 DAI in its channel with Bob to facilitate the payment. If Alice and Chris want to pay Bob 10 DAI each, as tips during videogame streaming for example, the hub must have at least 20 DAI in it's channel with Bob.

##### Custodial payments don't need collateral

Collateral requirements only apply if you are using non-custodial payments. To bypass these requirements completely, use trusted hub payments by inserting the payment type `PT_CUSTODIAL`. This allows the hub to forward along payments it receives, without having the collateral in the recipients channel.

##### Autocollateralization

The hub handles these requirements by using an autocollateralization mechanism that is triggered by any payment made, whether or not the payment was successful. Hubs determine amount of collateral needed in a channel based on the number and value of recent payments made to the recipient. Additionally, there are floors and ceilings implemented by hub operators to minimize the amount of collateral that is locked in hub channels, as well as set a minimum amount of collateral to be maintained in each channel.

Typically, hub balances below 10 DAI will trigger recollateralization. Hubs will put up to 170 DAI in any one channel. These values are configurable, so contact your hub operator for more details.

##### Implementer considerations

As an implementer, this can have several important consequences. First, you should expect payments to fail if there is not sufficient collateral, and retry them after monitoring the hubs collateral in the recipients channel via `connext.recipientNeedsCollateral`. Additionally, you should expect to see payments fail if they are uncharacteristically large, occur right after a withdrawal or dispute, or are the first payments in a long time.

This means if you do not send a failing payment to trigger collateraliztion, it will not account for that payment amount when recollateralizing. Deposits where the hub is recollateralizing a channel who's balance is below the floor should not be blocking updates, so long as the hub still has sufficient `balanceTokenHub` in the recipient's channel.

The hub can reclaim collateral by disputing the channel, or by the client submitting a withdrawal request with 0 value to allow the hub to withdraw excess collateral from the channel. By minimizing the hub collateral, you also reduce the amount of user channels the hub disputes (lowering user gas costs and wait times) and help payments pass more smoothly through the network.

#### Availability

The wallet must acknowledge every state update by cosigning that state. This means in order to update your channel, the user must be online.

Again, availability requirements only apply if you are using non-custodial payments and using the payment type `PT_CUSTODIAL` will relax these, and rely on a trusted hub.

#### Trust Assumptions

While the underlying protocol is completely noncustodial, there are trust assumptions to the Dai Card implementation which we want to make explicit. We plan to address these assumptions over the next few months.

##### Hub can intercept payments

For now, the payments themselves are trusted. In other words, a hub can steal your payment value while the transaction is in-flight. You would usually notice if this happened and leave the system with the rest of your funds, so the risk is limited to your payment itself.

The code for fully noncustodial payments is already in our codebase and is functional. We have left it deactivated for now to reduce complexity while we work on improving logic for channel collateralization. We plan on reactivating it within the next couple of weeks.

##### You don’t always have access to your state

Right now, if you go offline, the hub is the only entity that persists your channel’s state. From a usability perspective, this is great because it allows for easy cross-device support and keeps state in sync. Obviously, this is bad in the event that the hub goes down and you need to recover your funds from the contract directly using your latest state.

“Data availability” is a known problem for channels. To solve it, we need access to a highly reliable/available decentralized data store. Within the next 2–4 weeks, we plan to backup user state on IPFS as a temporary fix. We’re still researching a solution that would be effective long term and at scale.

##### Link payments and other async payments are trusted

Link payments and other async/offline payments are currently done by having the hub hold the payment until some condition for the payment can be proven to be resolved by the recipient.

This can be partly trust-minimized by allowing for conditional resolution of payments (i.e. “generalized state channels”) in our contract. The specification to do this has already been completed and will only require a change to <10 lines of the ChannelManager code (est. 4–6 weeks to ship). However, some service provider may need to be available to “receive” the state here, which we’re still researching how to resolve — everything in time, we’re working quickly.

##### Hub is centralized and can censor payments

Our hub is currently operated by us (Connext) and is centralized off-chain similar to how 0x relayers like Radar Relay work. This means that our hub could be censored, DDoS’d or shut down, which would mean that our payment service could go offline.

Hosting a hub is an interim solution to solve cheap, fast payments now while we work on building out the remaining pieces needed for a decentralized state channel network. We can fix our own centralization by allowing other Connext hubs (at that point, nodes) to be networked together, by making it easy for anyone to run a node, and by moving to sending state updates over some P2P messaging protocol rather than over https. These changes will require some quality of life improvements to our contract functions, however, so we expect to only start work on them after our next contract iteration is deployed.


---

- **Kauri original title:** Connext  Peer-to-Peer Payment Channels
- **Kauri original link:** https://kauri.io/connext-peertopeer-payment-channels/ea598e8c666c413e8df0a6dd106a1c28/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2019-05-13
- **Kauri original tags:** scaling, state-channels
- **Kauri original hash:** QmXNh3DMbGsymeorreYLeydbGoH9gbmxit2pmpcJVWC93r
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



