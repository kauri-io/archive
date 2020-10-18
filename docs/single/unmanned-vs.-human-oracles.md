---
title: Unmanned vs. Human Oracles
summary: Smart contracts can only connect with information directly available on their own blockchain. This is known as the oracle problem. Decentralized oracles make smart contracts truly smart by supplying them data points from external sources. Who won the elections? What was the price of BTC on May 14th? What was the result of a football game? How much does a file weigh? An oracle gives smart contracts answers to questions about the external world. If an oracle doesn’t feed a smart contract informati
authors:
  - Witnet (@witnet)
date: 2018-11-19
some_url: 
---

# Unmanned vs. Human Oracles



----


![](https://cdn-images-1.medium.com/max/2000/1*Fcr4RtRWU4Wa7yrdQUfL2Q.png)

Smart contracts can only connect with information directly available on their own blockchain. This is known as 
the oracle problem.
 
[Decentralized oracles](https://medium.com/@peterhaymond/why-decentralized-oracles-matter-7920ad04ee37)
 make smart contracts truly smart by supplying them data points from external sources.

Who won the elections? What was the price of BTC on May 14th? What was the result of a football game? How much does a file weigh? An oracle gives smart contracts answers to questions about the external world. If an oracle doesn’t feed a smart contract information, it won’t be able to know what it needs in order to execute its desired actions.

Oracles are key for the future of the decentralized systems we’re building. A lot has been written about networks trying to solve the oracle problem, but we need to make a clear distinction between the two main approaches: 
**human and unmanned oracles**
 . Let’s look into both and how their nature is 
**not restrictive, but actually complementary.**
 

### Human Oracles
Human oracles basically rely on people voting on the truth. The truth can refer to the outcome of an event, like in 
[Augur’s oracle](http://docs.augur.net/)
 , which works to provide Augur’s prediction market with the outcome of all the markets opened in the platform.
Depending on the mechanism chosen for reporting the truth, these oracles will tell smart contracts the answer to a specific question. They do so by letting humans (either one specific person, or groups of people) vote and achieve a consensus.
 
**Human oracles are especially useful in decisions where subjectivity is involved**
 . Imagine creating a prediction market with the question “Will Edward Snowden betray his country?” in 2012. The answer to this question, once resolved and whatever it is, can’t be retrieved from data, and therefore it is tough for smart contracts to get it without the intervention of a human oracle.
These type of oracle can also have a strong impact on governance, as mentioned in 
[Aragon Network’s new whitepaper](https://github.com/aragon/whitepaper)
 . The Aragon Network has the aim of acting as a digital jurisdiction for decentralized organizations; a decentralized court system.
> “Courts are the native enforcement mechanism for the Aragon Network, they provide users with a neutral shared context for Arbitration. Each court produces an oracle feed of judgments on subjective disputes. Over time, as disputes are successfully resolved and jurors earn reputation, the judgments of a court will become more consistent as precedents are set and reinforced”. — Aragon Network whitepaper

Either way, 
**human oracles feed smart contracts data (decisions, outcomes…) through the actions of people working for a network**
 . Now that we’ve looked at why and how they are useful, let’s look at why and how unmanned oracles are needed.

### Unmanned Oracles
 **Unmanned oracles provide a way to feed smart contracts data without the need for human intervention**. [Witnet is an example of a Decentralized Oracle Network](https://medium.com/witnet/witnet-smart-contracts-with-real-power-f79e326da3a4) that connects smart contracts to data points available outside the contracts’ own blockchain.

> “The core functionality of Witnet as a DON provides an efficient way to retrieve, attest and deliver verified web contents. This alone is enough to enable the creation of countless novel applications capable of reacting to the outer world without human intervention or relying on single, centralized — thus corruptible or hackable — sources of information.” — Witnet whitepaper

Unmanned oracles are a very efficient way to provide data to smart contracts in a decentralized, trustless manner. 
**In contrast to human oracles, they are purely objective**; anonymous computer nodes working for the network retrieve data from the place they’ve been precisely told and deliver it to the requester independently.

When specific data must be given to a smart contract in order for it to execute any action, unmanned oracles are the most efficient provider possible. The more specific the data point, the more useful they become compared to human oracles.

One of the great advantages of unmanned oracles is the speed at which they provide answers. Human oracles need a certain latency for their answers to achieve consensus. This is necessary for some use cases, as there must be a period where participants in the network can challenge others’ decisions. Yet some applications can’t bear this latency for their every day operations. A smart contract tracking the price of an asset every five minutes, for example, shouldn’t have to wait days or weeks for a verified response.

Scalability is another challenge unmanned oracles can take on swiftly. The more requests per second that have to be assessed, the more computing power the network will be provided from its nodes, as they are incentivized to do so. Human oracle networks’ input is people’s time, which might prove not so scalable in the long term.

### There Is No Battle
Contradicting the title of this post, 
**there really is no fight between unmanned an human oracles**
 . An unmanned oracle is a necessary base layer for other kinds of oracles to be able to work in the long term. As we’ve seen, human oracles’ very much needed activity can itself be optimized with the use of an unmanned oracle.
On the other hand, unmanned oracles are the optimal way for human oracles to feed their decisions into smart contracts. Lots of human oracles will be created, since any DAO can work as a human oracle if it’s designed to do so. Smart contracts from any blockchain will be able to access information coming from these human oracles in a decentralized, trustless way using a unmanned oracle network.
> Human oracles will act as another source available for smart contracts to retrieve data from using an unmanned oracle.

Unmanned oracles like 
[Witnet](http://witnet.io)
 will also have layers built on top of them to facilitate the tasks performed by human oracles. It’s a great match, and developers will be able to work with existing human oracles and to create new ones to help make them more efficient. Networks matter, and a solid base layer where to build any kind of decentralized oracle will make specific applications benefit from network effects as well.

----

Smart contracts are key to not only the future of Ethereum, but that of the crypto ecosystem as a whole. They are driving developers and entrepreneurs all over the world to think about the possibilities of decentralization. To make smart contracts achieve their full potential, we must connect them to information coming from outside their blockchain. We must open their eyes to the real world. Oracles do just that. Solving this challenging problem will take smart contracts’ possibilities to a whole new level.

----
####Thanks a lot for reading! You can also:



 *  [Read the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) 📃

 *  [Read the FAQ](https://witnet.io/#/faq) ❓

 *  [Join the community Telegram group](https://t.me/witnetio) 💬

 *  [Follow @witnet_io on Twitter](https://twitter.com/witnet_io) 🐦

 *  [Discover other Witnet community channels](https://witnet.io/#/contact) 👥



---

- **Kauri original link:** https://kauri.io/unmanned-vs.-human-oracles/f1a6b5651969494fa592ca44573d5a7b/a
- **Kauri original author:** Witnet (@witnet)
- **Kauri original Publication date:** 2018-11-19
- **Kauri original tags:** none
- **Kauri original hash:** QmSN5Wi3QMMyL6RgzqLJZZjTRziKPVXz2aTdppcmRP8D2m
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



