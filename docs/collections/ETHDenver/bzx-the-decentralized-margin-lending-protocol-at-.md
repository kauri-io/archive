---
title: Bzx - the Decentralized Margin Lending Protocol at ETHDenver
summary: bZx is a fully decentralized protocol for margin lending and margin trading on the Ethereum blockchain. It is a financial primitive, a fundamental building block of the decentralized finance software stack. The bZx protocol works alongside exchange protocols like 0x and KyberNetwork to allow critical functionalities like shorting and leverage. You can understand the bZx stack in terms of two layers- the base layer and the liquidation layer. The base layer of the protocol is a series of smart con
authors:
  - KyleKistner (@bzx)
date: 2019-02-11
some_url: 
---

# Bzx - the Decentralized Margin Lending Protocol at ETHDenver


bZx is a fully decentralized protocol for margin lending and margin trading on the Ethereum blockchain. It is a financial primitive, a fundamental building block of the decentralized finance software stack. The bZx protocol works alongside exchange protocols like 0x and KyberNetwork to allow critical functionalities like shorting and leverage. You can understand the bZx stack in terms of two layers: the base layer and the liquidation layer. The base layer of the protocol is a series of smart contracts which governs the logic of escrow and interest disbursement. The liquidation layer contains the logic used to execute margin calls on the escrowed funds. This layer also governs the valuation of assets within margin accounts and determines where liquidity is sourced in the event of a margin call.

The protocol is fully functional on mainnet, powering the funding order book at BambooRelay.com, and on the roadmap of half a dozen other 0x relays including Ethfinex.

### Getting Started

- [Documentation](https://bzx.network/docs)
- [bZx.js javascript library for relay integration](https://bzx.network/docs/bzx.js/)
- [bZx starter project](https://github.com/bZxNetwork/bZx-monorepo/tree/development/packages/starter_project)
- [bZx contract documentation](https://bzx.network/docs/contracts/)
- [BambooRelay bZx Standard API](https://sra.bamboorelay.com/bzx.html)

### Prizes Offered

8 ETH to the best project that integrates bZx. 

### ETHDenver Wishlist

#### Relays

##### 1. Create Your Own Generic Relay

The first and most obvious way to take advantage of the bZx protocol is to start your own relay. Starting your own relay is as easy as creating a UI and connecting it to the bZx smart contracts using bZx.js. A relay can be standalone; it doesn’t necessarily have to be a 0x relay. If you want to create a relay dedicated specifically to hosting a funding orderbook, individuals can manage their positions using the liquidity from Kyber Swap.

##### 2. Dark Pool Relays

Using a matching order system, an opaque orderbook, and providing just in time quotes can allow an enterprising individual to create a funding orderbook that functions like a dark pool. Typically dark pools are a way for individuals with larger volumes of assets to participate in the market without signaling their trades. Likewise, individuals looking to loan out or short large amounts of assets may wish to utilize a dark pool to carry out their actions.

##### 3. One Click Shorting and Leverage

This could be built as an independent project, bringing a Shapeshift-like experience to shorting and leverage using the bZx.js library to connect to the bZx smart contracts. It is also possible to build this as an interface that sits on top of BambooRelay and utilizes their Relay API.

##### 4. An IPFS Hosted Relay

It’s possible to host the front-end and UI on IPFS and connect to the bZx smart contracts through Infura, creating a relay more decentralized than most.

##### 5. Relay for Mobile or Mobile Widget

Currently there are several 0x DEXs that feature mobile interfaces, but the area is wide open for innovation. There are many ways to build out the ecosystem in this area. You could create your own standalone bZx relay for mobile. You could build an integration for an existing mobile-based 0x relay such as imToken. Lastly, you could create a widget for relays that could be adopted broadly by the ecosystem. There are certainly many avenues to explore in this area.

##### 6. iToken front-end

bZx has recently released iTokens on the testnet. They can be found in the portal at https://portal.bzx.network on the Kovan testnet. The contracts can be found here: https://github.com/bZxNetwork/bZx-monorepo/tree/development/packages/contracts/contracts/tokens/loanTokenization Build a frontend for wrapping ERC20s in the iToken contract. iTokens can be minted by simply sending ETH or ERC20s to the iToken contract. Interest yields are determined algorithmically. The front end should include a way to mint iTokens, redeem iTokens, and view current interest rates, along with any other information deemed necessary. 

#### Integrations

##### 1. Fetch, Airswap, Totle Integrations


Once a trader has borrowed assets from a lender, they’re able to manage their position from inside their margin account. Currently, they can accomplish this by presenting the bZx.sol contract with a 0x order or by authorizing trades via Kyber Swap. However, the protocol is extensible enough to allow for liquidity to be sourced from many pools. Totle and Fetch are projects which fabricate orderbooks constructed from the aggregation of many liquidity sources. It may be most productive to integrate Totle or Fetch, since Airswap is one source of liquidity they are tapping. However, it is always better for traders to have as many options as possible.

##### 2. Create a Trade Execution Coordinator for bZx

Trade execution coordinators allow relays using matching orderbooks to share liquidity. This is important because matching orderbooks prevent order collision and front running. Centralized TECs have yet to be developed, and decentralized TECs are still a ways off. One interesting approach to creating a decentralized TEC that could enforce price-time priority would be to combine Keep’s t-ECDSA protocol to create a decentralized Time Stamp Authority (dTSA) with a Loopring-like system of miners that batch transactions to a coordinator contract. The dTSA could provide a digital timestamp that would allow the coordinator contract to determine time priority. One downside of this proposed approach is that since the coordinator contract can only verify that orders have been placed according to price-time priority, this model would be vulnerable to censorship; a full solution to the dTEC problem would be equivalent to solving the double-spend problem itself.

##### 3. Paradigm.Market Wrapper Contract

Paradigm has created a decentralized relay protocol that functions to create a generalized forwarding contract interface system and global liquidity pool that abstracts away liquidity from centralized venues. It is possible to write a simple wrapper contract that would allow easy integration of Paradigm’s middleware protocol with the bZx protocol. The primary repository you’ll be working with is SubContractSDK. It contains the base SubContract and interface definition, as well as some documentation describing how to implement existing (or new) settlement logic. To get a feel for how to use this library, SubContractExamples may be instructive.

##### 4. Automated Trading Interface

This application could use Bamboo Relay or any other bZx relay that adopts the bZx Standard Relay API on the backend, providing automated lending and borrowing functionality. On the lending side, the application would automatically queue up the approvals necessary to lend ETH and other ERC20 tokens out at the Flash Return Rate (FRR). On the borrow side, the application would automatically take loans at the FRR in order to maintain a prescribed level of exposure. This could be useful for market makers looking to manage their inventory risk in an automated fashion.

##### 5. DutchX Integration and Chainlink Integration

Currently there is only one set of smart contracts operating on the Liquidation Layer. This current set of smart contracts rely on Kyber Swap for secure price feeds and liquidity in the event of a margin call. However, it is possible to execute margin calls using Gnosis’ DutchX contract or by integrating a series of Chainlink oracles. The main challenge of executing margin calls is figuring out a way to value the assets inside the margin accounts, driving liquidity to the traders and lenders in the event of a margin call, and creating a sustainable incentive structure for calling in to initiate the margin call. These issues can be addressed using DutchX or Chainlink, but there are of course many ways to approach the problem with these tools.

##### 6. Aztec Protocol Integration

The transparency of the blockchain can have undesirable impacts on financial privacy. It was recently discovered that the individual driving up DAI interest rates on Compound was a very large REP holder taking out loans to collateralize a CDP that they held. Large traders use Dark Pools to place large orders on orderbooks in a way that prevents the market from reacting. However, it’s not enough that orders are obscured with Dark Pools. Once a large position is executed, the trader behind it can quickly be deanonymized. A successful integration of Aztec into the bZx protocol promises to allow traders to discreetly enter into large short or leveraged positions.

### Tips

If you're building a relay, it's not necessary to integrate a 0x orderbook. It can be a standalone KyberSwap based relay. 

### Need Help

If you need help, please contact us on Telegram at t.me/b0xNet. Direct any technical questions to @tcb101. 