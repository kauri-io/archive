---
title: Towards A General Purpose Plasma
summary: TL;DR We created a general purpose plasma design that allows you to build a broad class of smart contracts on plasma. Reach out to learn how- https-//t.me/plasmacontributors Imagine a world where every time you wanted to build a dapp, you had to build Ethereum from scratch… including the entire client, all of the networking, all of the data structures, and everything else . Until now, that’s what plasma app development was like. Each deployed plasma chain was application-specific due to constrai
authors:
  - Plasma Group (@plasma)
date: 2019-04-22
some_url: 
---

# Towards A General Purpose Plasma



![](https://ipfs.infura.io/ipfs/QmaU2gy4bgn1EuA1TdK7GMpzbKJWHUwe9XdnsSQj9qVa9a)

 
**TL;DR**
  
_We created a general purpose plasma design that allows you to build a broad class of smart contracts on plasma. Reach out to learn how:_
  
[https://t.me/plasmacontributors](https://t.me/plasmacontributors)
 
Imagine a world where every time you wanted to build a dapp, you had to build Ethereum from scratch… including the entire client, all of the networking, all of the data structures, and 
_everything else_
 .
Until now, that’s what plasma app development was like. Each deployed plasma chain was application-specific due to constraints in the old plasma architecture. Not upgradeable, not generalizable.
What we really needed was a way for people to build applications 
_on top_
 of a general-purpose plasma chain in the same way you build dapps on a general-purpose blockchain like Ethereum.

### Clap for the Plapps
We’ve devised a new architecture for building 
**plapps**
 (plasma apps) on one generalized plasma chain. It establishes a clean separation between the plasma layer and the application layer.
Writing a new plapp is as simple as writing a special type of smart contract, called a 
**predicate contract**
 , and deploying it to Ethereum. Anyone can use your plapp by interacting with your predicate contract, and it all happens 
_on the plasma chain —_
 where it’s much, much cheaper.

![](https://ipfs.infura.io/ipfs/QmaGRXm2WioGgfU3wbV6KkqTc4t3b9Aq5sSPYtP9v161LY)

Of course, these applications still live in the plasma design space. Plapps need to implement a standard predicate contract interface, and individual transactions must still fit within the ethereum gas limit.
In other words, plasma isn’t magical infinite Ethereum. However, most existing dapps (bounties, games, decentralized finance…) easily fulfill the above requirements. And, as a plapp, they get the benefits of plasma: low cost scalability, and frictionless onboarding — new users can join without ever touching Ethereum.

### Where We‘re At
At ETH Denver, we used this new framework to create 
_bitcoin lightning contracts_
 in a predicate contract on our plasma chain:

<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>Check it out: We implemented payment channel contracts on plasma at ETH Denver. And it's not just any channel... it's a 🔮⚡️Bitcoin Lightning channel⚡️🔮! <a href="https://t.co/2LSnxVfOu9" rel="nofollow">https://t.co/2LSnxVfOu9</a> <a href="http://twitter.com/EthereumDenver" target="_blank" title="Twitter profile for @EthereumDenver">@EthereumDenver</a></p><p> — <a href="https://twitter.com/plasma_group/status/1097983085855965185">@plasma_group</a></p></blockquote>

Since then, we built a 
[python proof-of-concept](https://github.com/plasma-group/research/tree/master/gen-plasma)
 that demonstrates how things work under the hood.
We then 
[upgraded our existing client code](https://github.com/plasma-group/plasma-core/tree/refactor-ts)
 to support plapps. It uses a new library we built that 
[allows clients to run predicate contracts](https://github.com/plasma-group/plasma-verifier)
 .

### Where We’re Going

![](https://ipfs.infura.io/ipfs/QmexiWUkjWdzTbA4smdACuyVnMRibJVG8T5aQcMSEHzKa5)

Come build a plapp! We need your help. As we implement various parts of the architecture and distill our learnings into a detailed writeup, we need early adopters like you to help us understand your needs. We are building this for you, and we want to make it everything it can be.
We designed all of this with the goal of making plapp development as easy as possible, but implementation always teaches you something new. This understanding will allow us to build better tooling for developers.
 
**Build a plapp.**
 Reach out to us on:



 *  [Twitter](https://twitter.com/plasma_group) 

 *  [Telegram](https://t.me/plasmacontributors) 

 *  [Email](mailto:projects@plasma.group) 
We’d love to hear from all of you. ❤



---

- **Kauri original link:** https://kauri.io/towards-a-general-purpose-plasma/9df6bb07a0dc40c5b2334931cb336491/a
- **Kauri original author:** Plasma Group (@plasma)
- **Kauri original Publication date:** 2019-04-22
- **Kauri original tags:** ethereum, scaling, layer-2, plasma
- **Kauri original hash:** Qmd2tq3xde3NKd1L1mqwAhDm4sUjK9KqqAsUF9PcEN7pKo
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



