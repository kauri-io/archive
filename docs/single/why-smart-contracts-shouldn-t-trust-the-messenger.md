---
title: Why Smart Contracts Shouldn’t Trust the Messenger
summary: Blockchains are deterministic by design. Delivering data into smart contracts is the reason why smart contracts need oracles. However, there are several types of oracles with a variety of technical architectures. Some rely on a central authority (API providers, data carrier companies) to provide data verification. Much thought has been put into how to best design oracles and blockchains to work together and we feel it is an important conversation to revisit to make sure we remain vigilant in our
authors:
  - Witnet (@witnet)
date: 2018-11-20
some_url: 
---

# Why Smart Contracts Shouldn’t Trust the Messenger



----

Blockchains are 
[deterministic](https://ethereum.stackexchange.com/questions/3557/why-do-smart-contract-languages-need-to-be-deterministic)
 by design. Delivering data into smart contracts is the reason 
[why smart contracts need oracles](https://medium.com/witnet/why-do-we-need-a-decentralized-oracle-network-91ba455d074d). However, 
**there are several types of oracles**
 with a variety of technical architectures. Some rely on a central authority (API providers, data carrier companies) to provide data verification. Much thought has been put into how to best design oracles and blockchains to work together and we feel it is an important conversation to revisit to make sure we remain vigilant in our development.

At a basic level, oracles should be as trustless as the blockchains they provide data to. 
**End-to-end trustless computation is the reason why smart contracts need a Decentralized Oracle Network.**
 For smart contracts to fulfill their mission, they can’t keep trusting the messenger.
> Oracles should be as trustless as the blockchains they provide data to.

Witnet’s Decentralized Oracle Network acts as a trustless data carrier for smart contracts. A decentralized network of nodes, called 
_witnesses_, run a headless browser to retrieve the desired data point(s), which are then agreed upon by the protocol’s consensus algorithm.

While some projects are exploring on-chain data oracle solutions, let’s take a look into the reasons why Witnet has taken a different approach to making truly trustless oracles from a fundamental level.

#### Trusting the Messenger
In earlier times, before the advent of the printing press and telecommunications, the flow of information relied on word of mouth. Some 
[people](https://en.wikipedia.org/wiki/Marathon#Origin)
 were even tasked to fulfill the task of transmitting information from one person to another, or from one place to another.

![](https://cdn-images-1.medium.com/max/1600/1*1mOhlYav-SNLNB-yfARkHA.png)

When someone like a monarch, an army officer, or a noble received information from a messenger coming from another kingdom, an enemy’s war camp or another family, they had to trust that this messenger was telling the truth. The original source of information was unreachable by the recipient of the news, so the only party responsible for its veracity was the messenger.

Nowadays we’re seeing problems associated with trusting the messenger more than ever. Fake news is all about certain messengers and intermediaries manipulating information at their will, often programatically, and spreading it to the masses, few of whom check if there are any real sources to back up the news they’re consuming.

In all cases where smart contracts are limited by the “oracle problem,” the messenger, or the transmitter of information, is a trusted third party. Whether a person or smart contract are executing a decision based off of their judgment (programming), 
**if the data they are processing to make an ultimate outcome is bad or corrupt, the entire process is corrupt**.

#### Smart Contracts
The purpose of smart contract code is to execute the terms agreed between parties 
**without the need of oversight from a trusted third party**. If we look more deeply at 
[their definition in Wikipedia](https://en.wikipedia.org/wiki/Smart_contract)
 we find a simple condition:
 
> _“A smart contract is a computer protocol intended to digitally facilitate, verify, or enforce the negotiation or performance of a_ [contract](https://en.wikipedia.org/wiki/Contract)_. Smart contracts allow the performance of credible transactions_ **without third parties**_.”_
 
Looking at 
[Nick Szabo’s definition of a smart contract](http://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/smart.contracts.html), the one the 
[Ethereum whitepaper](https://github.com/ethereum/wiki/wiki/White-Paper)
 links to when first mentioning the term, we find the same requirement:
 
> “A smart contract is a computerized transaction protocol that executes the terms of a contract. The general objectives of smart contract design are to satisfy common contractual conditions (such as payment terms, liens, confidentiality, and even enforcement), minimize exceptions both malicious and accidental, and_ **minimize the need for trusted intermediaries**.”
 
For smart contracts to achieve their 
[reason of being](https://en.wikipedia.org/wiki/Raison_d%27%C3%AAtre), they must be able to execute desired actions without trusting a third party. Yet, as of today, when smart contracts need to access data from outside their native blockchain, they must rely on a trusted third party to deliver that data.

#### The Last Mile In Peer to Peer Networks
Looking at definition of smart contracts we can understand why trusting a third party to access information potentially defeats their whole purpose. Let’s look at a use-case to illustrate this.

A simple example of this would be home or disaster insurance. Let’s imagine a person in Thailand is having trouble finding a company to cover her home insurance. She is told about a p2p insurance Dapp that connects her with other peers willing to provide that insurance in a fully decentralized, peer to peer way. The smart contract is set up and she’s now part of an insurance agreement with other peers willing to take that insurance risk (peers she might not even know or identify).

Once an event happens, like a flood, who’s to report that flood’s existence, magnitude and consequences to the smart contract? The p2p insurance dapp would have to rely on a central provider of data, which would act as a single point of failure, as it might have incentives to provide data which met their own interests.

Established insurance corporations have no real need for smart contracts. They set the terms, and clients agree upon them or not. 

**Smart contracts enable decentralized networks with peer to peer value transactions to capture opportunities**
 like the one in the previous example. Without a trustless oracle as a data provider, these networks are inherently flawed.

----

“Don’t shoot the messenger” is a saying that we hear often when we get information about something important to us that doesn’t meet our needs or expectations. This is inherently a cop out when building decentralized and trustless systems. Up until recently this hasn’t been an articulated problem that anyone was holistically trying to solve for. When building any sort of decentralized application that aims to harness the full power of smart contracts, relying on trusted data providers diminishes its whole purpose.

Smart contract platforms grant us much power to create entirely new ways of doing business with each other. Dapp users don’t need to trust people on the other end of the system to conduct transactions or any sort of peer to peer interaction. But the last bit of the life cycle of these ideas, commonly called “the Oracle Problem” sheds light on how important it is to broaden the scope of trustlessness in these systems in relation to real world data. 

**Once a Dapp is connected to Witnet’s Decentralized Oracle Network, participants in the decentralized web will be able to retrieve data from different sources, aggregate it through trustless consensus and deliver it to smart contracts**
 so that they won’t have to trust data providers fairness or accuracy anymore.

----


#### Thank you for your time! You can also:



 *  [Read the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) 📃

 *  [Read the FAQ](https://witnet.io/#/faq) ❓

 * Join the community [Telegram](https://t.me/witnetio), [Discord](https://discord.gg/QKEa5gU) and [Discourse Chat](https://community.witnet.io/) 💬

 *  [Follow @witnet_io on Twitter](https://twitter.com/witnet_io) 🐦

 *  [Discover other Witnet community channels](https://witnet.io/#/contact) 👥



---

- **Kauri original title:** Why Smart Contracts Shouldn’t Trust the Messenger
- **Kauri original link:** https://kauri.io/why-smart-contracts-shouldn-t-trust-the-messenger/9d97c9aa9bff4424ad47a803f02ace86/a
- **Kauri original author:** Witnet (@witnet)
- **Kauri original Publication date:** 2018-11-20
- **Kauri original tags:** none
- **Kauri original hash:** QmNYEL7chi5g57YV8oySeZvSGD2xMXu21LhehsZSSjzQWS
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



