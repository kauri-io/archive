---
title: Kyber Network  On-chain liquidity protocol
summary: Kyber Network builds a liquidity pool of tokens to facilitate token swaps. Different parties, including Kyber itself, maintain their own pools called reserves. Each reserve is a smart contract that is controlled by reserve admin who deployed it. Reserves vary in supported tokens, liquidity and conversion prices. When a user wants to exchange one token for another, Kyber scans all reserves to pick the cheapest one. This article originally appeared on the Kyber Developer site Kyber is building an
authors:
  - Kauri Team (@kauri)
date: 2019-04-08
some_url: 
---

# Kyber Network  On-chain liquidity protocol

> Kyber Network builds a liquidity pool of tokens to facilitate token swaps. Different parties, including Kyber itself, maintain their own pools called reserves. Each reserve is a smart contract that is controlled by reserve admin who deployed it. Reserves vary in supported tokens, liquidity and conversion prices. When a user wants to exchange one token for another, Kyber scans all reserves to pick the cheapest one.

_This article originally appeared on the [Kyber Developer](https://developer.kyber.network/docs/Start/) site_

Kyber is building an on-chain liquidity protocol that allows open contribution of liquidity from token holders. Our protocol enables a whole new class of decentralized applications, including [payments in multiple tokens](https://developer.kyber.network/docs/VendorsUseCase/), [transparent portfolio rebalancing](https://developer.kyber.network/docs/DappsUseCase/), [in-wallet token swap](https://developer.kyber.network/docs/WalletsUseCase/) and many more.

![](https://api.kauri.io:443/ipfs/QmS3Pq31WhoQhDQTLdQoAC7B3GZeaVRFaBF86am51UsjeP)

Kyber's design offers 3 important properties that are essential to consumer facing applications.

* Instant confirmation. A transaction happens with instant confirmation if it's sent from on-chain entities like smart contracts. Otherwise, once the transaction is included on the blockchain, the execution triggered by the transaction is immediately confirmed.
* Operation certainty, There are no transactional risks. Users know the rate and how much liquidity is available before they commit their transaction. There is no settlement uncertainty or counterparty risk.
* Global and diverse pool of different tokens. Kyber welcomes token holders to contribute their token to the liquidity pool. By having their token made available to the liquidity pool, the token will be available in all services integrated with the Kyber protocol.

Our design principle is to focus on the ease of integration, security and transparency for both liquidity providers (i.e. reserves) and projects that want to tap into the liquidity pool to utilise it for their own needs. The protocol is powered by Ethereum smart contract and runs entirely on-chain. Reserves also keep and contribute liquidity for their token via smart contracts that they control (source code prepared, tested and provided by us). At no point does Kyber control the funds of our users hence, users' funds will not be affected even in hacking incidents. All operations that occur on the Kyber protocol can be publicly verified on the blockchain.

To integrate with the Kyber protocol is as simple as initiating a transaction or message call to our smart contracts via the public APIs. This makes the integration to on-chain entities like smart contracts seamless and hassle-free, compared to other off-chain or hybrid solutions. In addition, there is no trusted third party introduced in the integration process.

![](https://api.kauri.io:443/ipfs/QmUmwbtw7KMny7j2w24vQErx1espxhjRmV1ZH9qsb8pcGv)

At Kyber, we believe in working together with other players in the ecosystem so we built the Kyber protocol to be application agnostic. Hence, allowing developers to create their own unique applications but still be able to easily leverage our liquidity pool by interacting with the Kyber protocol.

The details about the Kyber protocol specifications and integration guides are available on this website. Should you have any question, feel free to join our telegram group at https://t.me/KyberDeveloper or shoot us an email at hello@kyber.network.

Happy building!