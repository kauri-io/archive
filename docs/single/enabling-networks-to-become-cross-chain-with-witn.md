---
title: Enabling networks to become cross-chain with Witnet
summary: For a quick primer on Witnet, check out this post- (3 minute read)](https-//medium.com/witnet/witnet-smart-contracts-with-real-power-f79e326da3a4). The Aragon Network aims to be a fully digital jurisdiction. By running entirely on the blockchain, it allows DAOs to interact with each other with notable guarantees. These include a decentralized arbitration system and mutual staking just in case any of the arbitration participants needs to be compensated. Without going into much further detail, the
authors:
  - Witnet (@witnet)
date: 2018-11-13
some_url: 
---

# Enabling networks to become cross-chain with Witnet



----

For a quick primer on Witnet, check out this post: (3 minute read)](https://medium.com/witnet/witnet-smart-contracts-with-real-power-f79e326da3a4).

![](https://cdn-images-1.medium.com/max/2000/1*5quZiEFOGAy-NE67saKEoA.png)

The [Aragon Network](https://aragon.one/network/) aims to be a fully digital jurisdiction. By running entirely on the blockchain, it allows DAOs to interact with each other with notable guarantees. These include a decentralized arbitration system and mutual staking just in case any of the arbitration participants needs to be compensated.
Without going into much further detail, the Aragon Network (AN) is, in the end, a crypto network fueled by a token. There are many others with similar needs, such as the [district0x network](http://district0x.io/) , the [0x network](https://0xproject.com/) , or the [Keep network](https://keep.network/) .
These networks are built upon a blockchain, in this case Ethereum.
But how can other entities in other blockchains interact with an Ethereum-based network?
Or, if for some reason the blockchain they are built upon stops serving their needs, how can the network migrate to another blockchain?
> Instead of thinking of building our crypto networks on top of just one chain, maybe we should be thinking of making them cross-chain by default.

In the end, if we want crypto networks to be a success, with blockchains still being a bleeding edge technology, we need to hedge our bets.

### Cross-chain asset transfer
Crypto networks usually require some form of staking or payment using their native token. The AN requires DAOs to stake into the network’s deposit in order for the DAO to build up reputation, being able to interact with other DAOs, or even offer their token in the network’s liquidity pool.
To truly achieve Aragon’s core proposition (unstoppable organizations), the AN will need to endure any kind of “crypto calamities” that may occur. This is only feasible by allowing the AN to cross over the boundaries of the Ethereum network and become blockchain agnostic.
The Witnet oracle network provides a secure and trustless way to bridge the gap between Ethereum and any other blockchain with smart contract capability. Thanks to its “bridge nodes”, tokens and assets can be transferred atomically from one chain to another without relying on any single point of failure.
Discover more about ETH<>WIT bridge nodes in this other post:

#### Practical example: transferring ANT from ETH to RSK
Let’s say that we want to transfer 1 ANT from the Ethereum network to the [Rooststock](https://www.rsk.co/) network:



 * The ANT needs to be first sent to the _Witnet Bridge Interface_ (WBI) Ethereum contract, which removes the tokens from circulation. In this transaction, senders must specify which chain they want their tokens transferred to (RSK) and a destination address. We shall also pay a fee to incentivize all parties involved in the transfer. The locking contract acts as an escrow for this fee.

 * ETH<>WIT bridge nodes collect the most recent locking transactions, and for each of them, they publish a request on the Witnet network containing a PoLock ( _“proof-of-locking”_ , an SPV of the Ethereum locking transaction). These transactions also contain a special reward output that will be spent later.

 * As Witnet is aware of every Ethereum block header, it can verify that the locking transaction actually happened and that it is buried under (confirmed by) a minimum number of blocks.

 * ETH<>WIT bridge nodes generate a PoI ( _“proof-of-inclusion”_ , a Witnet SPV proof) for each of the requests they posted, and use these proofs to claim the fee from the escrow in the WBI Ethereum contract. As the WBI is aware of every Witnet block, these proofs can be verified inside the contract.

 * RSK<>WIT bridge nodes then discover those Witnet requests directed towards Rootstock. They also create their own PoI for each and publish them into Rootstock by calling a method in Rootstock’s own WBI contract.

 * The WBI Rootstock contract is capable of internally validating the PoI coming from Witnet (as it is aware of all Witnet block headers) and tell the ANT smart contract in Rootstock to credit 1 ANT to the destination address (this is the _“crediting transaction”_ ).

 * Once the ANT is credited and the transaction doing so is sufficiently confirmed in the Rootstock blockchain, the bridge nodes from step 5 will generate a PoI for each Rootstock ANT crediting transaction, and use them to claim the fee from the output in step 2 by spending it.
The reverse process can be easily achieved by locking the Rootstock ANT in the WBI Rootstock contract and specific Ethereum as the destination chain. This will trigger the whole process in the opposite direction and end up unlocking the ANT tokens that were originally locked in the WBI Ethereum contract.

### Cross-chain contract calls
The Aragon Network is a network of DAOs, which can be from traditional companies, to non-profit entities, to other crypto networks, or just individuals.
They need to transact with each other, including cross-chain interactions.
All DAOs are based on aragonOS, which has a very powerful Access Control List of which entities can call certain functions on certain apps.
Just like with cross-chain asset transfers, Ethereum smart contracts will be able to call contracts in a different chain by delegating their calls through the _Witnet Bridge Interface_ (WBI).
This case is even simpler than cross-chain asset transfer: from an Ethereum smart contract’s perspective, all that’s needed is calling a certain function in the WBI while specifying the address of the contract in the destination chain and the parameters we want to call it with. Everything else works just the same!
Thanks to [aragonOS](https://github.com/aragon/aragonos) , the changes required for any app in the AN ecosystem to support this mechanism would be minimal and wouldn’t even cause app developers any breaking changes in their existing code.
All apps in the AN use aragonOS for authentication, thanks to the [ACL](https://github.com/aragon/aragonOS/blob/dev/contracts/acl/ACL.sol) . The ACL checks _msg.sender_ to identify the sender of the transaction. If instead of doing that, the ACL would check signatures, that would enable aragonOS to verify that a transaction was authorized from another chain, and instead of pointing its origin from the WBI, it would point its origin from the account that sent it in another chain.

### Cross-chain contract upgradeability
All Aragon entities run on aragonOS, which offers secure and flexible smart contract upgradeability by default. Upgradeability is especially important for crypto networks and protocols, where the canonical version of the rules that are enforced to all token holders needs to be consensuated. Consensus happens via any governance mechanism, and that’s why an Access Control List is so important too, so that only certain governance mechanisms can execute certain changes to the protocol.
aragonOS achieves this model by taking advantage of proxies. Let’s explore this process:



 * We dispatch a call to the App Proxy (and not the app itself)

 * The App Proxy asks the Kernel where’s the actual App with its actual code

 * The Kernel replies back with its address

 * Then the App Proxy delegates the call to the actual App

 * The App asks the Kernel whether the sender of the call is authorized to perform it

 * If it is, the code is executed

![](https://cdn-images-1.medium.com/max/1600/0*QVWeO3zuaQzarlYI.)

Now let’s imagine how an upgrade to the Aragon Network would be executed:



 * Someone who wants to propose an upgrade (the proposer) would deploy a new set of contracts for the network or for any of its features. Let’s say the contracts are located at address 0xNEWVERSION

 * The proposer creates a new voting (or goes through whichever governance mechanism that the Network has) and proposes 0xNEWVERSION as the next version

 * The governance of the Network votes and decides. Let’s assume that the vote is approved

 * The Kernel would update its reference for the contracts that have just been upgraded (which would be an App)

 * All the new calls would come in via the App Proxy, and would be directed towards the new version of the code instead of the old one. Boom!
In a scenario in which ANT has become truly cross-chain and the AN contracts live on multiple blockchains, preserving contract upgradability across chains is also necessary.
Again, Witnet will make these cross-chain contract upgrades nearly as easy to perform as if everything was happening in the same chain, and the changes required for existing dApps to support this mechanism will be minimal and cause no headache to developers willing to make their smart contracts truly chain agnostic.

### Security concerns
In the blockchain space, there’s a generally accepted precept that the maximum value that a network can support and secure is proportional to the cost of rewriting its history of transactions.
This notion comes from the fact that the security of Proof-of-Work schemes is not based on making it impossible for anyone to tamper with the transactions ledger, but on making it extremely expensive.
As long as the total network value is lower than the cost of hacking the blockchain (e.g. by means of a majority attack), we can rest assured that no one will try to break it. But in the same moment that the network value goes over the hacking cost, you’ve just created a bounty for any (incredibly powerful) attacker to go and try to to loot everyone’s wallets.
But, if Witnet doesn’t use PoW, when people start to use it for moving assets from chain A to chain B, how much value will it be able to handle without becoming attractive to attackers?
In Witnet, mining power is not correlated to computing power. Instead, each of the miners’ likeliness to come with a valid block is proportional to their reputation, which they earn or lose over time depending on their honesty when performing _retrieve-attest-deliver_ (RAD) tasks as requested to the distributed oracle network by smart contracts.
Witnet moves away from putting a (high) price to owning a majority of power in the network. Instead, the Witnet protocol makes it mathematically impossible for any player in the network to hoard a majority of the reputation by imposing a progressive demurrage policy on reputation scores.
Under this policy, the more reputation points you have, the faster you lose them without any possible countermeasure other than remaining honest and performing RAD tasks to earn more points.
The catch is that, beyond a certain reputation score threshold, this policy is applied so harshly that it’s impossible to earn more reputation points than the amount you are losing because of demurrage.
This means that there’s a consensus-enforced roof to reputation score, which in practice translates to infeasibility of any kind of majority attack at the same time that guarantees power decentralization.
Summing up, on a network like Witnet, assets of any value can be transferred securely without being limited to a maximum network value defined by the total work committed to the chain.

----

 **Thanks to**  [Luis Cuende](https://medium.com/@lic)  **and**  [Jorge Izquierdo](https://medium.com/@izqui9)  **from the Aragon team for their contributions to this post.** 

----


### Want to know more about the use cases of Witnet?
Don’t miss the next article in the series:
You can also:



 *  [Read the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) 📃

 *  [Read the FAQ](https://witnet.io/#/faq) ❓

 *  [Join the community Telegram group](https://t.me/witnetio) 💬

 *  [Follow @witnet_io on Twitter](https://twitter.com/witnet_io) 🐦

 *  [Discover other Witnet community channels](https://witnet.io/#/contact) 👥
