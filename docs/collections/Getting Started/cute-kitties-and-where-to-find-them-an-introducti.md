---
title: Cute Kitties and Where to Find Them — An Introduction to Non-Fungible Tokens 
summary: A History of Exchange We’re all familiar with currency exchanges. They come in various online and offline forms and are what people often use for trading one currency to another when speculating or traveling to a new country. Currency exchange has its roots in ancient times, the Byzantine government, for example, maintained a monopoly on currency exchange. Modern exchanges started during the 15th century when the Italian banking family Medici opened banks to exchange currencies in foreign nation
authors:
  - Shayan Shokrgozar (@transcendent)
date: 2019-03-12
some_url: 
---

# Cute Kitties and Where to Find Them — An Introduction to Non-Fungible Tokens 


### A History of Exchange

We’re all familiar with currency exchanges. They come in various online and offline forms and are what people often use for trading one currency to another when speculating or traveling to a new country.

Currency exchange has its roots in ancient times, the Byzantine government, for example, maintained a monopoly on currency exchange. Modern exchanges started during the 15th century when the Italian banking family Medici opened banks to exchange currencies in foreign nations. There are ledgers dating back to 1704 in Amsterdam that show the existence of an active [Forex market](https://www.investopedia.com/terms/forex/f/forex-market.asp). Nowadays, [fiat](https://en.wikipedia.org/wiki/Fiat_money) exchanges are often performed through banks, brokers, and online.

With the advent of CryptoAssets, the world witnessed an abundance of new exchanges for exchanging fiat currencies to CryptoAssets or swapping one CryptoAsset to another. Some of these exchanges (i.e., [Binance](https://www.binance.com/en), [Coinbase](https://www.coinbase.com)) are centralized, while others (i.e., [IDEX](https://idex.market/), [Waves](https://wavesplatform.com)) are decentralized. While each approach has its limitations and fallibilities, one of the concerns with CryptoAssets is the vulnerability of token ownership and exchange as a result of centralization—vulnerabilities such as censorship and hacking. At the same time, decentralized exchanges have traditionally struggled with issues such as illiquidity and fees associated with requiring every new order or adjustment to go through the blockchain (on-chain transactions), resulting in slower transaction times and extra fees.

Projects such as [0x](https://0x.org/) have provided a solution for some of the limitations of decentralized exchanges. By creating a standard protocol on the Ethereum blockchain, they allow third-party relayers to build decentralized exchanges that host orders off-chain and bring them on-chain to settle the order. As a result, it’s an ideal protocol for platforms such as video games that exchange digital collectibles, art, and other CryptoAssets.

A collectible is an item that is often unique in characteristics and valued by collectors. The history of collecting special items date back to ancient history, and it’s also seen in other animals, such as Bowerbirds. Modern day collectors often collect items for their future value, but many do it as a hobby. There are items that are manufactured, specifically, to be collected. Cigarette cards in the late nineteenth century were one of the first manufactured collectibles, then came the era of sports cards representing favorite players, and in the 90’s the different designs of Beanie Babies. Digital collectibles are the most recent form of valued items.

### Non-Fungible Tokens and Ethereum Improvement Proposals

In the early days of Ethereum, it wasn’t possible to create collectibles, because digital items were fungible and replicable, but thanks to an [Ethereum Improvement Proposal (EIP)](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1.md), and the [EIP-721 token standard proposal](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md), it became possible to create non-fungible digital items.

The Ethereum foundation has a process for suggesting modifications to the Ethereum protocol. Anyone wanting to change or add a feature to the protocol can do so through submitting an EIP. If the community approves an EIP, it’s incorporated into the protocol. EIP-721 allowed for the creation of Non-fungible Tokens (NFTs), an authentic digital scarcity that is verifiable within the network without needing any intermediaries, such as central exchanges.

### ERC-721 Contracts

Here is a basic example of an ERC-721 contract, borrowed from <https://gist.github.com/aunyks/2d148a77150247f6f9745286ff46fc53#file-erc721-definitions-sol>:

```solidity
contract ERC721 {
   // ERC20 compatible functions
   function name() constant returns (string name);
   function symbol() constant returns (string symbol);
   function totalSupply() constant returns (uint256 totalSupply);
   function balanceOf(address _owner) constant returns (uint balance);
   // Functions that define ownership
   function ownerOf(uint256 _tokenId) constant returns (address owner);
   function approve(address _to, uint256 _tokenId);
   function takeOwnership(uint256 _tokenId);
   function transfer(address _to, uint256 _tokenId);
   function tokenOfOwnerByIndex(address _owner, uint256 _index) constant returns (uint tokenId);
   // Token metadata
   function tokenMetadata(uint256 _tokenId) constant returns (string infoUrl);
   // Events
   event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
   event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
}
```

For a full overview of the fields and what they mean, read Gerald Nash’s essay on [The Anatomy of ERC-721](https://medium.com/crypto-currently/the-anatomy-of-erc721-e9db77abfc24). Here’s a brief overview of the main functions and events:

- `name`: The full name of your token (e.g., MountainGoatMutineer)
- `symbol`: An abbreviation for your token (e.g., MGM)
- `totalSupply`: Returns the number of coins available on the ledger
- `balanceOf`: Shows how many tokens are on a particular address
- `ownerOf`: Returns the address of a token’s owner
- `approve`: Grants authority to another entity to transfer tokens on behalf of the owner
- `takeOwnership`: Acts like a withdraw function. It allows a new owner to withdraw tokens from another account and into their account.
- `transfer`: Allows the owner of a token to transfer their token to another user.
- `tokenOfOwnerByIndex`: Though optional, this function allows users to retrieve individual tokens by its index in the list of tokens they own
- `tokenMetadata`: Though optional, this function allows us to find information on an NFT (e.g., through an HTTP link or IPFS hash)
- `Transfer`: This event broadcasts the sending and receiving addresses, and the token ID that was transferred
- `Approval`: This event fires whenever another user is approved to take ownership of a token

In the words of the creators, the rationale for ERC-721 is that:

> There are many proposed uses of Ethereum smart contracts that depend on tracking distinguishable assets. Examples of existing or planned NFTs are [LAND in Decentraland](https://market.decentraland.org), [the eponymous punks in CryptoPunks](https://www.larvalabs.com/cryptopunks), and in-game items using systems like [DMarket](https://dmarket.com) or [EnjinCoin](https://enjincoin.io). Future uses include tracking real-world assets, like real-estate (as envisioned by companies like [Ubitquity](https://www.ubitquity.io) or [Propy](https://propy.com). It is critical in each of these cases that these items are not "lumped together" as numbers in a ledger, but instead, each asset must have its ownership individually and atomically tracked.

### NFTs and Games

You might be familiar with the game [CryptoKitties](https://www.cryptokitties.co/) where people can buy a unique Kittie with Ether, the native currency of the Ethereum protocol. Each Kittie is an NFT, meaning that each Kittie is unique in shape, characteristics, and thus value.

Ideally, those who want to buy, sell, or exchange NFTs should be able to without relying on a central exchange to perform their transactions. In addition to problems such as censorship and hacking caused by centralization, people might want to exchange NFTs tens of times a year, buying, selling, exchanging, and so forth. Multiple intermediaries that take a cut each time a trade occurs wouldn’t be as fluid as a peer-to-peer asset trading experience. Another advantage offered by decentralization is that if a hostile state decides to impose its power on exchanges that operate in its country, it would have an easy time doing so with a centralized exchanges, but not with decentralized ones. By taking intermediaries out of the picture, we can solve the vulnerability of centralization and remove the rent-seeker in the middle. In practice, a digital game with various characters can use the 0x protocol to create an exchange that allows their gamers to trade with one another directly and sell them on the exchange for Ether.

For example, the [Origin project has partnered with Dig Star](https://medium.com/originprotocol/origin-metaps-to-build-a-decentralized-marketplace-for-non-fungible-tokens-nfts-387e5d29c437), a character creation game built on Ethereum to do something similar. Anyone can download the game and exchange digital characters on the Origin exchange. In the game, there is a mineral called “Cp” which only creatures traded on the exchange can mine. Gamers can sell the minerals they mine with them for Ether on the same ecosystem.

Another game called, [God’s Unchained](https://godsunchained.com/), is using 0x to sell players unique cards, including limited edition ones, while they’re on presale. Because the cards comply with ERC-721, players can prove the rarity of their cards, and trade them for Ether.

Historically, game publishers were a centralized authority that owned the objects players bought on the game, but that’s no longer the case. With NFTs, players can own the token and if the code permits, take it from one game to another. If the game shuts down, the players still have their token. 0x makes it possible for peer-to-peer transfers, the same as trading baseball cards with friends, but without strict digital-rights-management policies.

### ERC-1155, the Future?

While ERC-721 allows for a new class of assets to exist and give collectors the opportunity to collect digital items, it has some limitation. For this reason, developers have proposed [ERC-1155](https://github.com/ethereum/eips/issues/1155), perhaps the topic for an upcoming article.


---

- **Kauri original link:** https://kauri.io/cute-kitties-and-where-to-find-them-an-introducti/028ff6bf2fa0432191371e6d39398ba6/a
- **Kauri original author:** Shayan Shokrgozar (@transcendent)
- **Kauri original Publication date:** 2019-03-12
- **Kauri original tags:** erc721, nft
- **Kauri original hash:** QmYVfsjo9GmxR9BTRyRBYKrqjgLxgWtpwEv9i5XLtNkVz7
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



