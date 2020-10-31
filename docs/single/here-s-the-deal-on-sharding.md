---
title: Here’s The Deal on Sharding
summary: Blockchains suck. They’re really slow, the fees are high, and right now nearly nothing built on them can scale, as evidenced by Cryptokitties and every single Ethereum stress test since then. In fact, blockchains are so bad that there’s an infamous “scalability trilemma” to sum up their biggest cons- as they are right now, they can’t exist without having to trade off either decentralization, scalability, or security. For example- if your blockchain is truly decentralized like Bitcoin, then it’ll
authors:
  - Ramy Zhang (@ramyjzhang)
date: 2019-03-07
some_url: 
---

# Here’s The Deal on Sharding

![](https://ipfs.infura.io/ipfs/QmWYCz2aar8wqVJQfiVFfvDskb8f4nXJbcnb9gLXYc41nJ)


Blockchains **suck**.

They’re really slow, the fees are high, and right now nearly nothing built on them can scale, as evidenced by Cryptokitties and every single Ethereum stress test since then.

In fact, blockchains are so bad that there’s an infamous “scalability trilemma” to sum up their biggest cons: as they are right now, they can’t exist without having to trade off either **decentralization**, **scalability**, or **security**.

For example: if your blockchain is truly decentralized like Bitcoin, then it’ll have to trade off either scalability or security; in Bitcoin’s case, it’s **scalability**. Bitcoin is really secure due to the amount of hashing power invested into that one chain, as well as the sheer number of nodes. However, because there’s so many nodes, it ends up taking a really long time to process even one transaction since every single node has to verify it in sequence.

Some of the general scalability solutions that have been presented so far are increasing 
[block size](https://en.bitcoin.it/wiki/Block_size_limit_controversy), creating more individual _altcoins_ to deal with separate tasks, and [merged mining](https://www.cryptocompare.com/mining/guides/what-is-merged-mining-bitcoin-namecoin-litecoin-dogecoin/). However, they all have their own pitfalls; block size (or the block gas limit in ETH’s case) cannot be increased indefinitely (increased block size will cause a network to [become centralized](https://www.newsbtc.com/2017/11/12/61408/) around a handful of miners), altcoins will spread out hashing power across multiple blockchains which sharply decreases security, and merged mining increases miners’ computational burden.

#### ELI5 on Sharding… Kinda

Sharding is one of the in-protocol solutions that have been proposed to help Ethereum scale. Sharding splits up the **state** of the network into multiple _shards_ or pieces, where each piece has its own transaction history and portion of the network’s state. (The state is composed of all the information on what the network looks like at one specific moment, for example the amount of transactions that have been processed, the balances at each address, etc.)

![](https://ipfs.infura.io/ipfs/QmThKpRX6Q8qBRXYV2Gx985wWSw8f9uMi5VciVBN1K29nU)

For example, in one sharding mechanism, a certain amount of addresses could be confined to a certain shard. In other words, all addresses beginning with 0x00 could go into shard 1, all addresses beginning with 0x01 could go into shard 2, and so on and so forth. Each new transaction on each individual shard would change the state of _that_ shard only. Inter-shard communication would be facilitated through [some fancy functionalities](https://github.com/ethereum/wiki/wiki/Sharding-FAQs#how-can-we-facilitate-cross-shard-communication), which I’ll explain later.

Every single shard processes its own portion of the _state_ of the network, which allows multiple transactions to be verified in parallel instead of one transaction having to be processed by every single node. In this way, the network would be able to process transactions much, much faster.
With a protocol such as this, we would now have two dimensions of operation instead of just one. Let’s zoom in and start with the first dimension, that of the shards. Check out the diagram below:

![](https://ipfs.infura.io/ipfs/QmV5TRFgogCHBmR1KohXBLtqVf2fdG9BLHvufdbjmYTkrR)

Instead of making blocks of transactions, certain nodes called _proposers_ native to each shard build _collations_, which are basically groups of transactions.
Each collation has a collation _header_ as seen above, which contains information about the collation — which shard it belongs to, the state of the shard before the transactions were processed, the state of the shard after, and the receipt root after all the transactions are verified. The right side of the header with all the <sig #0000> elements represents _notary_ nodes or _collators_ that are meant to download and verify the collation. These notaries are randomly assigned to each shard, and the assigned shards get shuffled after a set period.

Then, in the body of the collation, we see the collection of all the transaction IDs to be processed.
 
_So quick_ **TL;DR**_: proposer nodes build collations that are groups of transactions. Collations have headers that contain information about the state of the shard and the nodes that will verify them. The collation bodies contain the transactions._
 
Let’s zoom out a bit to the **2nd dimension of operation** — the “main chain”.

Instead of storing full blocks of transaction, now the main chain — the Proof of Work chain — pretty much solely serves to store the collation headers from each shard that have been properly verified.

![](https://ipfs.infura.io/ipfs/Qma7xkvDYxyt7f9XkiXq5kbga3bRMwHAh3pVpmsyf4CwfC)

So in the diagram above, we can see sort of the “top level” of the protocol, where in each block we store two roots; one that describes the state of the network, which is divided into shards, and one that contains the information about all the verified collation headers. This means that the “longest chain” of each shard is the longest chain that contains every single collation that has been put onto the main chain.

#### Cross-Shard Communication

One of the most important aspects of sharding would be to implement some method of cross-shard communication. What good would it be if you couldn’t send a transaction from address X in shard 1 to address Y in shard 3?

This capability will be constructed via receipts. Remember the receipt root that’s stored in every collation’s header? Those receipts can be easily accessed through the transaction group [Merkle root](https://brilliant.org/wiki/merkle-tree/) in the main chain’s “block”. You can think of receipts as byproducts of a transaction stored in a separate data structure (a Merkle tree). They can be easily called by a node to check the existence of a transaction without the node having to download the entire blockchain. Shards will be able to communicate with each other through these receipts. This is a sample process explained on the [Ethereum Sharding FAQ](https://github.com/ethereum/wiki/wiki/Sharding-FAQs#how-can-we-facilitate-cross-shard-communication), where account A from shard M wants to send 100 coins to account B on shard N.

> 1. Send a transaction on shard M which (i) deducts the balance of A by 100 coins, and (ii) creates a receipt. A receipt is an object which is not saved in the state directly, but where the fact that the receipt was generated can be verified via a Merkle proof.
> 2. Wait for the first transaction to be included (sometimes waiting for finalization is required; this depends on the system).
> 3. Send a transaction on shard N which includes the Merkle proof of the receipt from (1). This transaction also checks in the state of shard N to make sure that this receipt is “unspent”; if it is, then it increases the balance of B by 100 coins, and saves in the state that the receipt is spent.
> 4. Optionally, the transaction in (3) also saves a receipt, which can then be used to perform further actions on shard M that are contingent on the original operation succeeding.

Essentially there are two processes happening here: one “transaction” simply deducts account A’s balance, and then another transaction, being matched with the receipt from the deduction transaction, adds to account B’s balance the amount that was deducted from A. In this way we can effectively construct a full cross-shard transaction.
If you’re a more visual learner, here’s a diagram describing the same process:

![](https://ipfs.infura.io/ipfs/QmbSbpfAGBDBcaL41K1FRSZe92zfxw8i69muzhJztcEtvL)

#### Vulnerabilities
So sharding sounds amazing and all, but you must be thinking that there _has_ to be a catch somewhere. Well, you’re right. 

The biggest issue the sharding solution might have to face is the single-shard takeover attack. A blockchain insures security through the validation of each transaction by every single node in the network. However, when the state of the network is sharded, each node will only process a certain portion of each transaction. This will make it more difficult to keep the information secure. It will be comparatively easy to take over all the proposers, collators and notaries in a shard in order to submit false collations.

![](https://ipfs.infura.io/ipfs/QmXrQBwH91CqZ8CmDeWQrse2YqdwsCVD44w1PoFJ1hyA4f)

The primary way Ethereum aims to solve this issue is through **random sampling**. A certain number of _notaries_ are assigned to each shard to verify the collations, and as mentioned before, the assigned shards will shuffle after a set period of time.

There are two ways this can happen. Notaries may be **explicitly** **chosen** and grouped into _committees_ to vote on whether collations are valid or not. They can also be **implicitly** expected to go back through the chain and verify a certain number of older parent collations with each new collation that they process.
With this restriction, even though there’s only a fraction of the total nodes that are processing new transactions on each shard, the level of security will still relatively remain the same. We can apply the theory of binomial distribution here:

![](https://ipfs.infura.io/ipfs/QmekAgKMUHKA4qPDj7Pi34FgVb9uTmCLjgdmgZx229K3Hr)

The total area under each dotted line represents the total number of nodes in the network. The portions under the humps show where the majority of the nodes are. The numbers on the x-axis represent the number of honest nodes out of the total set. The more the hump leans towards the right of the diagram, the more nodes in the network are honest. The more the hump leans towards the left, the less nodes are honest. The blue line represents a 50–50 chance of a node being honest with a 20-node sample size, the green represents a 70–30 chance of the node being honest with a 20-node sample size, and so on and so forth.

For this reason, if we go along with statistic probability and assume that the majority of the nodes, around 67%, will be honest, that means the “hump” of our binomial distribution will skew more towards the right. Because of this, if we take a smaller sample (say 150 nodes) representing 1 shard out of the total number of nodes, we will see that there’s [practically a 100% probability](https://github.com/ethereum/wiki/wiki/Sharding-FAQs#how-can-we-solve-the-single-shard-takeover-attack-in-an-uncoordinated-majority-model) that the shard will have a majority of honest nodes.
In this way, attackers will have to actually control 100% - 67% = 33% of the network to actually present a real threat if the sharding solution were implemented.

#### Putting It All Together

So now we have all of these excellent capabilities that present a solid attempt to patch up some of the biggest challenges sharding presents. We can actually implement and connect all of them through two things; the **Proof of Stake beacon chain**, and the **Validator Manager Contract**.

Remember when I talked about how the sharding proposal will split Ethereum into 2 dimensions of operation? Instead of using the main Proof of Work chain as the “top-level” element for storing validated collations and state information, Ethereum is actually looking towards transitioning to use a Proof of Stake chain (their Casper chain) to replace this function. Also called a beacon chain, this one will manage and store the set of notaries and collators chosen to validate each collation during a given period of time. On the PoS chain, these nodes will be known as _validators_.
Furthermore, instead of storing transaction group roots, the beacon chain will be composed of elements called **cross-links.** These are types of transactions that contain the hash of a recently validated collation on a certain shard, and prove that the 2/3 of the selected validators have approved that collation.

Currently, in order to become a validator on the Proof of Stake chain, you must submit a stake of 32 ethers onto the Validator Manager Contract (VMC), which essentially keeps track of which validator is doing what. If you do not validate the appropriate collations, your stake will not be returned by the VMC. It’s kinda like a security deposit. The VMC’s role is essentially to do the random sampling of validators, verify collation header hashes, and facilitate cross-shard communication via receipts.

#### It’s Not Perfect

It may seem like a super comprehensive solution, and in most ways it is, but the sharding proposal still has a lot that needs to be figured out. First of all, we actually have no idea how well this will be pulled off and what issues we haven’t taken into account because [Casper hasn’t been fully implemented yet](https://www.infoq.com/news/2018/06/Ethereum-Casper-First-Release). A lot of rough knots also need to be worked out in the cross-communication scheme, because 
[atomic operations](https://github.com/ethereum/wiki/wiki/Sharding-FAQs#what-is-the-train-and-hotel-problem) (where if one transaction fails, then all of the rest must be cancelled as well) still haven’t been figured out. There’s also a lot of other problems in terms of the logistics of verification, and how to carry out certain security mechanisms.

If you’d like to continue onto learning about the sharding proposal in more depth, I recommend going through the links sprinkled throughout this article, as well as reading the 
[official doc](https://github.com/ethereum/sharding/blob/develop/docs/doc.md).

> I hope this was helpful! Please let me know any questions you may have, and any feedback as well if I’ve misrepresented any information. Thank you for reading! Be sure to follow me for more articles like this. Note: this article was originally written in July 2018, and may not be up to date in certain areas.




---

- **Kauri original title:** Here’s The Deal on Sharding
- **Kauri original link:** https://kauri.io/heres-the-deal-on-sharding/04b66cfa4382448c93440ebf3da26224/a
- **Kauri original author:** Ramy Zhang (@ramyjzhang)
- **Kauri original Publication date:** 2019-03-07
- **Kauri original tags:** ethereum, casper, sharding, scalability
- **Kauri original hash:** QmZHMuNVnJP3cid6Nwgac4pLfrHd6WHuRgZMtPaMk73aKD
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



