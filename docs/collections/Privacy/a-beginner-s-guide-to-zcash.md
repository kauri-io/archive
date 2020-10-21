---
title: A beginner’s guide to Zcash
summary: This article was originally published on Medium What is Zcash? According to the Zcash website, “Zcash is the first open, permissionless cryptocurrency that can fully protect the privacy of transactions using zero-knowledge cryptography.” Bitcoin is an open and permissionless cryptocurrency but there is a common misconception that bitcoin transactions are anonymous. A history of every bitcoin transaction is displayed on a public ledger called the blockchain. Sophisticated software can be used to
authors:
  - Linda Xie (@ljxie)
date: 2019-05-03
some_url: 
---

# A beginner’s guide to Zcash


 This article was originally published on [Medium](https://medium.com/@linda.xie/a-beginners-guide-to-zcash-3b37190affc) 

**What is Zcash?**
 
According to the 
[Zcash](https://z.cash/)
 website,
> “Zcash is the first open, permissionless cryptocurrency that can fully protect the privacy of transactions using zero-knowledge cryptography.”

Bitcoin is an open and permissionless cryptocurrency but there is a common misconception that bitcoin transactions are anonymous. A history of every bitcoin transaction is 
[displayed](https://blockchain.info/)
 on a public ledger called the blockchain. Sophisticated software can be used to determine who is responsible for a significant number of these transactions. In response to this lack of privacy, there have been a number of cryptocurrencies that have focused on adding 
[privacy functionality](https://hackernoon.com/privacy-on-the-blockchain-7549b50160ec)
 . This post should help those who are new to Zcash to understand how it is different than other cryptocurrencies like bitcoin.

![](https://ipfs.infura.io/ipfs/QmUdKrD7XcrVWHzsQt6LA7sTQFm2PLfBDWjVGMRCvqjTwn)

 
**Similarities and differences from Bitcoin**
 
Zcash (ZEC) uses a new technology involving zero-knowledge proofs which allow one to prove something (e.g. prover owns greater than 10 ZEC) without requiring the prover to reveal any sensitive information (e.g. the total number of ZEC owned by prover). It gets its name from the fact that zero knowledge is revealed to the verifier in the process. The anonymous transactions produced from this technology are referred to as shielded transactions in Zcash.
This is in sharp contrast to Bitcoin where if your bitcoin address is ever shared publicly, anyone can view your balance and all other bitcoin addresses you have ever transacted with. Even if you don’t share your address publicly, companies such as 
[Chainalysis](https://www.chainalysis.com/)
 and 
[Elliptic](https://www.elliptic.co/)
 have built software that can de-anonymize your address if you have transacted with other addresses that are not anonymous. Imagine if everyone you knew, and even strangers, could know how much money you had in your bank account, and how you spent your money. Despite perfectly legitimate transactions, you likely do not want the entire world to know this information.

![](https://ipfs.infura.io/ipfs/QmSBVKKnFtxcSvmgcoWFJ7KvKboGrFrBbhdTXfyfN7K8ez)

Zcash and Bitcoin both have a total supply of 21 million units and are released through a process called mining. One unique aspect of Zcash is that the corporate development team (the Zcash Company, CEO 
[Zooko Wilcox](https://twitter.com/zooko)
 ) and the non-profit Zcash Foundation (Chair of the Board, 
[Andrew Miller](https://twitter.com/socrates1024)
 ), are funded directly from the blockchain. To achieve this, 20% of the mining reward for Zcash for the first 4 years goes to the stakeholders of the Zcash company (founders, employees, advisors, investors) resulting in 10% of the overall total supply. This “ 
[Founders’ Reward](https://z.cash/blog/funding.html)
 ” provides funding and incentive-alignment for the continued support and improvement of Zcash.

![](https://ipfs.infura.io/ipfs/Qmdr3PKTU9iJSV33bdGLQsSZW8e6oV88kqz8SGEWn8hKzu)

 
**Technology**
 
Zcash uses a specific cutting edge form of zero knowledge verification called 
[zk-SNARKs](https://z.cash/technology/zksnarks.html)
 (zero knowledge succinct non-interactive arguments of knowledge). This technology was pioneered by a number of 
[researchers](https://z.cash/team.html)
 including professors 
[Eli Ben-Sasson](http://eli.net.technion.ac.il/)
 and 
[Alessandro Chiesa](http://people.eecs.berkeley.edu/~alexch/)
 .
Zcash allows for public and private transactions with the option for the user to selectively disclose information about their private transactions. Optional transparency can be beneficial for situations where an entity needs to be audited or submit information for tax purposes.
A user can share a “view key” with others to allow transaction details to be selectively viewed by certain individuals. This “view key” is separate from the “spend key” used to spend funds. This separation into 
[two different keys](https://github.com/zcash/zcash/wiki/Concepts-in-Zcash)
 ensures that one may allow a third party to view transaction details without allowing the viewer to spend all of their funds. Drawing an analogy to the existing financial system: the bank login information needed to access your funds is similar to a spend key while accessing a copy of your bank account statement is similar to a view key.
Zcash also provides 
[encrypted memo fields](https://z.cash/blog/encrypted-memo-field.html)
 , which allows a secret message to be sent from the sender to receiver. This can be compared to writing a note on a check but instead of anyone handling the check being able to see it, only the holder of the view key is able to. This can be used for a variety of purposes such as including a payment code or sending a message to the recipient.
 
**Future Work**
 
Zcash’s technology isn’t without limitations. Future work aims to address the main two limitations of zk-SNARKS — setup and computation.
The tradeoff to zk-SNARKs is that it requires the generation of public parameters where a group of individuals must perform a multi-party computation ceremony as part of the initial creation of Zcash. To maintain an accurate total of the Zcash monetary base you need to trust that at least one member in the group has successfully completed their part without being compromised. Note that this parameter does not affect Zcash privacy guarantees. Given this tradeoff, there is already research happening with a newer technology called 
[zk-STARKs](https://www.youtube.com/watch?v=HJ9K_o-RRSY)
 that enables privacy but doesn’t require a trusted setup.
Generating shielded transactions in Zcash requires a relatively significant amount of computer memory and time which makes it inconvenient for regular use. As a result currently not all transactions are shielded in Zcash which affects fungibility. This means that some coins may be more valuable than others because they don’t have a tainted history associated with it. However, the team has focused on 
[performance improvements](https://z.cash/blog/cultivating-sapling-faster-zksnarks.html)
 in a future update which will significantly reduce the amount of time and memory required. Even mobile phones will be capable of generating proofs. This means that a greater percentage of Zcash transactions will be shielded, increasing overall privacy. The development team has even alluded to a future plan for deprecating transparent addresses altogether.

![](https://ipfs.infura.io/ipfs/QmYtSjKdYPUYWcXd63PRpsvHQ3i8ViqFRT1rgTq7aQiwNu)

 
**Resources**
 
Zcash, founded in Oct 2016, is a relatively new cryptocurrency with powerful technology and a strong focus on development. Below are some links that may help you understand Zcash further and keep up with the development.
 
_Understanding Zcash_
 



 *  [Website](https://z.cash/) 

 *  [FAQ](https://z.cash/support/faq.html) 

 *  [Radiolab podcast](http://www.radiolab.org/story/ceremony/) 

 *  [Zero-knowledge proofs, Zcash, and Ethereum](https://blog.keep.network/zero-knowledge-proofs-zcash-and-ethereum-f6d89fa7cba8) 
 
_Keeping up with Zcash_
 



 *  [Forum](https://forum.z.cash/) 

 *  [Twitter](https://twitter.com/zcashco) 

 *  [Blog](https://z.cash/blog/index.html?page=0) 

 *  [Reddit](https://www.reddit.com/r/zec/) 

Thank you to 
[Will Warren](https://medium.com/@willwarren89), 
[Jordan Clifford](https://medium.com/@jcliff), and Linda Lee for reviewing this post.
 
_Disclaimer: I own Zcash._
 



---

- **Kauri original title:** A beginner’s guide to Zcash
- **Kauri original link:** https://kauri.io/a-beginners-guide-to-zcash/c38a4e3859eb47f09879f8b115d2e81c/a
- **Kauri original author:** Linda Xie (@ljxie)
- **Kauri original Publication date:** 2019-05-03
- **Kauri original tags:** privacy
- **Kauri original hash:** QmbPKi2aNRDGav57VMJkKx4QCoBrQD5YKiAuVMYUmUnXBg
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



