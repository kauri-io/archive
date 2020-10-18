---
title: Making P2P marketplaces trustless 
summary: The holy grail of smart contracts and e-commerce, finally made possible Why you need a peer-to-peer marketplace at all A peer-to-peer marketplace is a market where sellers and buyers trade without intermediaries. One of the largest communities and most exciting projects working towards enabling p2p marketplaces is district0x , a network of decentralized markets created, operated, and governed on top of Ethereum and Aragon . These kind of marketplaces leverage one of the more famous blockchain ax
authors:
  - Witnet (@witnet)
date: 2018-11-15
some_url: 
---

# Making P2P marketplaces trustless 



----
##The holy grail of smart contracts and e-commerce, finally made possible


![](https://cdn-images-1.medium.com/max/600/1*9j0ewpT7YoSZJ63Ab3MgoA.png)


### Why you need a peer-to-peer marketplace at all
> A peer-to-peer marketplace is a market where sellers and buyers trade without intermediaries.

One of the largest communities and most exciting projects working towards enabling p2p marketplaces is [district0x](https://district0x.io/) , a network of decentralized markets created, operated, and governed on top of **Ethereum** and [Aragon](https://aragon.one/) .
These kind of marketplaces leverage one of the more famous blockchain axioms: removing intermediaries reduces **costs** and facilitates **free trade** .
But it also introduces a large degree of **counterparty risk** . One of the parties in the trade can lose money if the other doesn’t live up to their contractual obligations.
If Alice pays Bob for some merchandise but she never receives it, she loses it all. She can’t enforce a **penalty** on Bob, who gets away with his fraud.
Alice will prefer to pay only after she receives the merchandise. But that’s even riskier for Bob, especially when trading **physical goods** . If Bob sends the merchandise upfront, he needs some way to enforce payment upon delivery.
This is why marketplaces exist in the first place. They act as **trusted** arbiters providing **escrow** and **insurance** services at a cost. They remove risk from trade and **enforce** penalties on misbehaving actors.
Marketplaces also play an important role as “merchant **rating** agencies”. Customers’ comments and ratings are a crowdsourced assessment of each seller’s honesty.
These reputation metrics **incentivice** merchants to remain honest in the long term. But they aren’t effective against [exit scams](https://en.wikipedia.org/wiki/Exit_scam) . Merchants can become corrupt at any time. They can deceive a few customers before their reputation is significantly damaged.
In peer-to-peer marketplaces, there is no intermediary to assume the economic impact of exit scams. **Counterparty risk is unavoidable.**  **Or is it?** 

### Smart contracts as decentralized escrows for peer-to-peer marketplaces
> Escrows are independent trusted entities acting as custodians for funds in a trade. They release those funds depending on conditions agreed upon by the transacting parties.

 **Smart contracts** are the perfect way to automatize escrows. They **remove the need for trust** from the equation. As long as their code is faithful to the agreed conditions, no deception is possible.
Escrows are indeed one of the most popular use cases for smart contracts. But the problem comes when physical goods enter the formula. Current blockchain technology won’t allow you to create smart contracts that can check the delivery status of a parcel in order to decide whether the funds in a escrow should be released or refunded.
This is the ugly truth about smart contracts’ state of the art: **smart contracts are still completely isolated from the rest of the world.** They have no means to retrieve information from websites and APIs in a trustless way.
> Relying on a single trusted party to feed external information into your smart contract completely defeats the point of using a smart contract in the first place.


### Decentralized escrows on distric0x
This is where **Witnet** comes into play. Witnet is a **decentralized oracle network** . It allows smart contracts to read information from websites and APIs.
Using Witnet, the **district0x communities** —the _districts_ — can finally build **the holy grail of e-commerce** : decentralized _Amazon-like_ marketplaces for physical goods.
In these marketplaces, customers will send their payments to the underpinning smart contracts, which will act as a trustless escrow service.
These contracts will then use Witnet to **interact with the courier company’s API** and check the **delivery status of the parcel** .
As soon as the parcel is delivered, the funds will be **released** to the merchant. If on the contrary the parcel isn’t delivered before an agreed deadline, the funds will be **refunded** to the customer immediately.

### Cross-chain payments for district0x marketplaces
Decentralized applications are currently limited by their inability to allow for payments in a variety of currencies. While a broad ecosystem of tokens has already been deployed on the Ethereum network in the form of **ERC-20 tokens** , there are hundreds of other blockchains whose native assets can not be easily integrated for payments in a decentralized marketplace built on Ethereum at present.
Witnet will change this, making it possible for blockchains to **interoperate** with one another. Witnet will give a smart contract on the Ethereum blockchain the ability to check a transaction on other blockchains, granting smart contracts the ability to **verify payment on a separate platform** and to act accordingly once completed.
By leveraging Witnet, users will be able to **purchase goods** from markets deployed on the district0x Network with Bitcoin, Ethereum, or virtually any other cryptocurrency of their choosing.
Here’s more info on how Witnet enables **cross-chain operations** :

### The endgame
These decentralized and cross-chain ecosystems powered by Witnet will offer the possibility for the participants in **district0x** districts to share and govern their own marketplaces not focusing merely on consumption but rather on **peer-to-peer production** and **active participation** .
Projects like [Aragon](https://aragon.one/) will be the cornerstone of how those markets will **govern themselves** . The Witnet team is also working side by side with the Aragon team to [make the Aragon Network work across different chains](https://medium.com/witnet/enabling-crypto-networks-to-become-cross-chain-using-witnet-2c8d3731fcb5) .
A new **decentralized economy** is being born, and the Witnet team is proud to be building one of its **key building blocks** .
 _Want to be part of this revolution?_  [Join us, we are hiring!](https://angel.co/witnet-foundation-1/jobs) 

----

 _( I’d like to thank_  **[Joe Urgo](https://medium.com/@JoeUrgo)**  from the  **district0x**  team for his contributions to this post. )

----


### Want to know more about the use cases of Witnet?
Don’t miss the next article in the series:
You can also:



 *  [Read the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) 📃

 *  [Read the FAQ](https://witnet.io/#/faq) ❓

 *  [Join the community Telegram group](https://t.me/witnetio) 💬

 *  [Follow @witnet_io on Twitter](https://twitter.com/witnet_io) 🐦

 *  [Discover other Witnet community channels](https://witnet.io/#/contact) 👥
