---
title: MakerDAO  Decentralized stablecoin and collateral loans
summary: Dai is an asset-backed stable currency created by the Maker Decentralized Autonomous Organization (MakerDAO). The Dai Stablecoin system maintains the stable value of Dai by ensuring that each Dai is always backed by a collateralized asset of more value. Single collateral Dai requires that each Dai is backed by at least 150% Ether. If at anytime, the amount of collateral backing Dai falls below 150%, watchers (community run bots) will call functions within the MakerDAO smart contracts that trigge
authors:
  - Kauri Team (@kauri)
date: 2019-04-08
some_url: 
---

# MakerDAO  Decentralized stablecoin and collateral loans


> Dai is an asset-backed stable currency created by the Maker Decentralized Autonomous Organization (MakerDAO). The Dai Stablecoin system maintains the stable value of Dai by ensuring that each Dai is always backed by a collateralized asset of more value. Single collateral Dai requires that each Dai is backed by at least 150% Ether. If at anytime, the amount of collateral backing Dai falls below 150%, "watchers" (community run bots) will call functions within the MakerDAO smart contracts that trigger liquidation of enough collateral to payback the debt.

_This article originally appeared on the [MakerDAO blog](https://blog.makerdao.com/dai-developer-documentation/)_

![](https://api.kauri.io:443/ipfs/QmVn4Ef6r7dgViSiFnvg9FVJCysb8e3jq7EjFBBdwFnHqk)

The MakerDAO ecosystem is designed as an elegant solution for an endless number of applications enabling decentralized finance. A critical part of that is fostering our developer community and supporting a wide network of open finance applications building on the Dai Credit System. This past year, we’ve seen incredible use cases and examples of powerful tools that integrate Dai.

These include projects like:

- [Request.Network](https://request.network) is building a decentralized network for payment requests.
- [Compound.finance](https://compound.finance) is tackling efficient interest rates and creating a market for unutilized virtual currency.
- [Maecenas](https://maecanas.co) is building a blockchain network for fine art.
In this post, we will share more on where you can find documentation that will guide developers through the process. These guides and tutorials enable you to understand the various approaches to integrating with MakerDAO through smart contracts, SDKs, APIs and other products. These cover pertinent topics like CDP creation, Dai, Governance, Keepers, Oracles, and more.

### Integrating with Maker
We’re proud to see a wide range of products and services integrate with Maker. The more projects integrate Dai, the faster we can get to scale and sooner we will be able to deliver on our promise of enabling economic empowerment for all.

There are many important constituents that touch our ecosystem, and we’ve outlined specific methodology depending on if you’re a centralized exchange, ddex, keeper, Dai holder, custodial wallet, relayer, or CDP owner.

At a high-level, you can find [documentation here](https://github.com/makerdao/awesome-makerdao#developer-resources) on our website and our developer integration guides in our [dedicated Github repo here](https://github.com/makerdao/developerguides).

To dive in further, we’ve put together a series of guides for specific partner types to access relevant documentation:

#### Upgrading to Multi-Collateral Dai
This guide shares an overview on the steps necessary to migrate from Single-Collateral Dai (SCD) to Multi-Collateral Dai. Depending on your platform and use case for Dai, we’ve outlined various approaches to upgrading to MCD.

- Read more: [Upgrading to Multi-Collateral Dai](https://github.com/makerdao/developerguides/tree/master/mcd)
#### Exchanges
This is a one-stop shop for information necessary for exchanges, such as our token contracts for both Mainnet and Kovan Testnet, listing symbols, token libraries and documentation for DSToken, the standard for Maker tokens.

- Check out more here: [Exchanges](https://github.com/makerdao/developerguides/tree/master/exchanges)
#### Wallets
Use this guide to integrate the DAI and MKR ERC-20 tokens into a wallet. Find easy access to our token contracts, source code and libraries.

- Read more here: [Wallets](https://github.com/makerdao/developerguides/tree/master/wallets)
#### Remittance Services
This guide is for remittance services seeking to integrate with Maker products. We share helpful resources from our partners which provide on-off ramps for Dai liquidity and easy Dai to fiat currency conversion. Our partners include Wyre, Ripio, Buenbit and Orionx. Fiat on-off ramps are valuable for remittance, commerce and for users just seeking to cash out Dai holdings in local currencies. Check out this guide if you’re looking to drive user adoption and bridge the gap between fiat and crypto.

- Check out more here: [Remittance services](https://github.com/makerdao/developerguides/tree/master/remittance)
#### Keepers
This guide is for partners interested in implementing Keepers: programs that automatically monitor and interact with CDPs and the Dai Credit System. Learn more about automatic interaction with CDP auctions and managing your CDPs.

- Learn more here: [Keepers](https://github.com/makerdao/developerguides/tree/master/keepers)
#### Market Makers
If you’re looking for market making resources, this guide gives insight into the various repositories to create custom Keepers or run a Keeper node. Here you’ll be able to find access to our repo on Market Maker statistics which provides tools for visualizing market making data, as well as our repo on a set of keepers that have been implemented to facilitate market making for ddexs.

- Read more here: [Market Makers](https://github.com/makerdao/developerguides/tree/master/market-makers)
