---
title: What’s the difference between Monero, Zcash, and BEAM?
summary: First, we would like to emphasize that we have a lot of respect for our friends at Zcash and Monero and the activities that these projects have completed so far in order to promote the needed financial confidentiality in crypto. We will organize our comparison by looking at three parameters- confidentiality, scalability, and auditability. The comparison is quite advanced and does not claim to be complete — there are other played factors besides the three we have chosen to address. Monero- Confid
authors:
  - Beni Issembert (@bissembert)
date: 2019-06-23
some_url: 
---

# What’s the difference between Monero, Zcash, and BEAM?



![](https://ipfs.infura.io/ipfs/QmVLn7MBpxbL1MoDWmmj8ZA1fvDaEGy1opxwZKQ7nbS1SE)

First, we would like to emphasize that we have a lot of respect for our friends at Zcash and Monero and the activities that these projects have completed so far in order to promote the needed financial confidentiality in crypto.
We will organize our comparison by looking at three parameters: confidentiality, scalability, and auditability. The comparison is quite advanced and does not claim to be complete — there are other played factors besides the three we have chosen to address.

### Monero: Confidentiality
Monero enables confidentiality by using 
**Ring Confidential Transactions**
 (a combination of Confidential Transactions and Ring Signatures) and 
**Stealth Addresses**
 . In addition, Kovri (currently in pre-alpha) is used to obfuscate peer-to-peer communication. Confidential Transactions hide the transferred amounts. With Ring Signatures, at least six “decoy” coins are added to each transaction, each looking equally likely to be the actual one spent in the transaction, thus making the actual source and destination next to impossible to trace. That said, there are certain claims (see this 
[study](https://arxiv.org/pdf/1704.04299/)
 , for example) stating that there are ways to trace transactions on Monero network. We do not aim to confirm or contradict those claims.

### Monero: Scalability
Due to the use of Ring Signatures, additional data is attached to each transaction, significantly increasing the size of the blockchain. At the time of this writing, Monero blockchain size is around 48GB and will continue to grow with wider adoption, hurting usability. We estimate that in Monero, the size of an average transaction is about 14Kb which is almost 25 times greater than in Bitcoin. Simply put, when Monero reaches Bitcoin’s current scale concerning the total number of transactions, its blockchain will be about 5 terabytes — hardly sustainable for a regular PC, let alone on smaller devices. It should be noted that Monero team is 
[currently implementing](https://hacked.com/kovri-bulletproofs-how-monero-is-improving-privacy/)
 bulletproofs that should improve scalability by up to 80% (which is still about 5 times more than Bitcoin).

### Monero: Auditability
Monero offers a 
[ViewKey](https://getmonero.org/resources/moneropedia/viewkey.html)
 feature to let a third party review the user’s transactions. However, it only allows seeing incoming transactions, not the outgoing ones, making it not very usable to auditors. Also, there doesn’t seem to be a way to prove that the list of incoming transactions is complete.

### Monero: Summary
Monero scores very well on confidentiality, poorly on scalability, and poorly on auditability as well.

### Zcash: Confidentiality
Zcash uses zk-SNARKs — a novel and very advanced form of 
**zero-knowledge cryptography**
 . Some people call zk-SNARKs “Moon Math” — that’s how arcane and presumably beautiful they are. With zk-SNARKs, all transaction amounts, inputs, and outputs on the blockchain are entirely hidden. However, transactions on Zcash are not private by default. Since zk-SNARKs are computationally heavy to create (it takes 1–3 minutes on a regular PC to create a private transaction on Zcash), most users do not enable them, hurting overall privacy of the network. At the time of writing, the percentage of fully shielded (i.e., entirely private) transactions on Zcash is below 1% (see 
[here](https://explorer.zcha.in/statistics/usage)
 ).
The upcoming 
[Sapling](https://z.cash/upgrade/sapling/)
 network upgrade should make the performance of shielded transactions much more efficient, and hopefully increase the amount of private transaction on the Zcash network.
In addition, zk-SNARKs require a special secret key to set up the entire system. If this key leaks, the perpetrator can print money and thus destroy the coin. Zcash carries out intricate multi-person ceremonies to create this key, and we have no reason to doubt the integrity of the people involved. However, this is still a valid concern.

### Zcash: Scalability
At the time of writing, ZCash blockchain size is around 19GB, while the total number of transactions is approximately 3.5 million, giving an average of 5.3KB per transaction — almost 9 times higher than Bitcoin. While it is better than Monero, it is still much heavier than Bitcoin, which is also not scalable enough in that respect.

### Zcash: Auditability
Similar to Monero, Zcash also has 
[Viewing Keys](https://blog.z.cash/viewing-keys-selective-disclosure/)
 , that allow an external viewer to track incoming transactions. In addition, there is a “payment disclosure” feature, beneficial when proving that a payment to an address was sent. There is no proof of completeness of the transactions.

### Zcash: Summary
Zcash has excellent privacy features, but they are computationally heavy and see little use so far. Zcash scalability is better than Monero’s, but still poor, and the auditability is poor as well, although Zcash has plans to improve it.

### BEAM: Confidentiality
 
[BEAM](https://www.beam.mw)
 is built on Mimblewimble, a very elegant protocol that allows for both confidentiality and scalability. Transaction amount, sender and receiver are hidden using Confidential Transactions, and there are no “addresses” in the system — each user just holds private keys to the UTXOs she owns.
Privacy in 
[BEAM](https://www.beam.mw)
 is enabled by default. Actually, there are no “open” transactions at all. Reading the blockchain would not yield any information to the observer.
In addition to Mimblewimble’s default privacy, 
[BEAM](https://www.beam.mw)
 also implements 
[Dandelion](https://arxiv.org/pdf/1701.04439.pdf)
 , a networking policy which significantly improves anonymity. Dandelion prevents someone observing the network traffic to infer any valuable information.

### BEAM: Scalability
In 
[BEAM](https://www.beam.mw)
 , the Mimblewimble cut-through mechanism is used to keep the blockchain small. The cut-through removes all the intermediate states of UTXOs, essentially leaving only unspent outputs on the blockchain. Thus, the blockchain size does not grow with the number of transactions, but with the number of UTXOs, which is overall much slower.
We estimate that BEAM Blockchain size will be around 30% of Bitcoin’s, so the blockchain size should be below 70GB when BEAM reaches Bitcoin’s scale, making it possible to run a full node on smaller devices. We are actively researching additional improvements to Mimblewimble to make the blockchain even smaller (see 
[Eliminating Transaction Kernels](https://github.com/beam-mw/beam/wiki/Thoughts:-eliminating-transaction-kernels)
 )

### BEAM: Auditability
BEAM introduces the optional Auditability feature. BEAM users can create one or more Auditor keys that can be distributed to the parties of their choice, such as accountants, auditors, and even tax authorities. Using those keys, the auditing party can review the transactions recorded on the blockchain, and also verify that the list of transactions is complete. 
**Auditability is strictly optional and cannot be enabled retrospectively**
 . See more in “What is Auditability” below.

### BEAM: Summary
By implementing Mimblewimble, BEAM achieves excellent confidentiality and scalability, and our extensions to the protocol allow for excellent Auditability as well. We believe that BEAM has the features that any currency should strive to have if it has aspirations for wide adoption, and we are working hard to get there soon.
You can also read 
[another piece of ours](https://medium.com/beam-mw/comparing-privacy-coins-is-hard-2d617f931682)
 comparing Bitcoin, Monero, Zcash, and BEAM.

### Appendix — Scalability comparison methodology
To assess scalability, we used public data on the total number of transactions in Bitcoin, Zcash, and Monero, and divided the total blockchain size by the number of transactions. The data for the time of writing is summarized in the table below:

![](https://ipfs.infura.io/ipfs/QmdRETk5W7fuaBoHZpF4fdGPdspCwMzt17xJysXTKrtKG8)


### BEAM blockchain size estimation
In Mimblewimble and thus in BEAM, the blockchain needs to store the header of each block, the kernel of each transaction, and all the UTXOs. The sizes for each element are in the table below:

![](https://ipfs.infura.io/ipfs/QmcPXRV85cWsr1eNoE12MVEPHYoxwW9t8YwpMWGnwVrj18)

Now let’s assess what BEAM’s blockchain size will be when BEAM reaches the scale Bitcoin has at the time of writing this (October 2018). Bitcoin’s numbers are below:



 * Chain height: 543,431 blocks.

 * Number of UTXOs: 56,503,620

 * Number of transactions: 346,109,884
For the time being, we can assume that BEAM will have the same UTXO/transaction ratio as Bitcoin. However, BEAM block is generated every minute and not every 10 minutes, so BEAM’s number of blocks will be 10 times higher.
Now, let’s calculate BEAM’s blockchain size:
Block Headers : 543,431*10 * 136B = 704MB
Kernels : 346,109,884 * 110B = 36,3GB
UTXOs : 56,503,620 * 704B = 37,7GB
Total : 74.9GB
Per transaction: 0.22 KB

#### Data sources:
 
_[1]_
  
[https://www.blockchain.com/](https://www.blockchain.com/)
 
 
_[2]_
  
[https://coinmetrics.io](https://coinmetrics.io)
 
 
_[3]_
  
[https://bitinfocharts.com/](https://bitinfocharts.com/)
 
Note: for Zcash, Bitinfochart shows about 10% more transactions than coinmetrics.io. We used the larger number.
Team BEAM wishes to thank Oded Leiba for his thorough review and good suggestions. If you liked this article, please follow his Twitter: 
[@odedleiba](http://twitter.com/odedleiba)
 .
 
**Learn more about BEAM**
 on our 
[website](http://beam-mw.com)
 
 
**Join our developer community:**
  
[Gitter](https://gitter.im/beamprivacy/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
 — 
[https://gitter.im/beamprivacy/Lobby?](https://gitter.im/beamprivacy/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
 
 
**Telegram:**
  
__
  
[t.me/BeamPrivacy](https://t.me/BeamPrivacy)
 
 
**Reddit:**
  
__
  
[reddit.com/r/beamprivacy/](https://www.reddit.com/r/beamprivacy/)
 
 
**Twitter:**
  
[twitter.com/beamprivacy](http://twitter.com/beamprivacy)
 
 
**Discord**
 : 
[discord.gg/BHZvAhg](https://discord.gg/BHZvAhg)
 



---

- **Kauri original link:** https://kauri.io/what-s-the-difference-between-monero-zcash-and-be/86aba6d03b05423088d273057c576a82/a
- **Kauri original author:** Beni Issembert (@bissembert)
- **Kauri original Publication date:** 2019-06-23
- **Kauri original tags:** mimblewimble, zcash, monero, privacy, privacy-blockchain, privacy-coin
- **Kauri original hash:** QmR43q5epSu3K7Wf4rB31oScNM4rg5ksSNg6DTadBzGAuD
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



