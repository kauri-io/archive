---
title: MythX is Upping the Smart Contract Security Game
summary: Ethereum is in a dire situation. No, I’m not talking about the price of ETH. I’m talking about the prevalence of high-profile hacks that are harming trust towards decentralized applications and providing talking points for Bitcoin maximalists and blockchain skeptics. What’s especially frustrating is that most, if not all, of the recent hacks that have impeded the growth of the Ethereum ecosystem could have been prevented. Security analyzers like Mythril Classic — an open-source tool for bug hunt
authors:
  - MythX (@mythx)
date: 2019-04-04
some_url: 
---

# MythX is Upping the Smart Contract Security Game

Ethereum is in a dire situation. No, I’m not talking about the price of ETH. I’m talking about the prevalence of high-profile hacks that are harming trust towards decentralized applications and 
[providing talking points for Bitcoin maximalists](https://medium.com/@jimmysong/the-truth-about-smart-contracts-ae825271811f)
 and blockchain skeptics. What’s especially frustrating is that most, if not all, of the recent hacks that have impeded the growth of the Ethereum ecosystem could have been prevented.

Security analyzers like 
[Mythril Classic](https://github.com/ConsenSys/mythril-classic)
 — 
[an open-source tool for bug hunting in smart contracts](https://hackernoon.com/scanning-ethereum-smart-contracts-for-vulnerabilities-b5caefd995df)
 — could have detected 
[batchOverflow](https://techcrunch.com/2018/04/25/overflow-error-shuts-down-token-trading/)
 , the Rubixi vulnerability, and the 
[Parity “Accidental Suicide” bug](https://github.com/paritytech/parity-ethereum/issues/6995)
 . If only the developers had run a free tool on their code, a whole lot of pain would have been prevented.
Let’s be honest: Existing smart contract security tools aren’t optimal for developers. They’re difficult to install, use and keep updated and don’t integrate well with development environments and build pipelines. False positive rates are high, and the reported results are only comprehensible to security experts. Techniques such as symbolic execution and input fuzzing are resource-intensive, resulting in long analysis times and further reducing usability.

The Mythril team and community are attempting to solve this problem. We’re creating an ecosystem of tools that bring advanced security analysis into development environments and build pipelines everywhere. Whether you’re using Truffle on a Mac, Sublime Text on Linux, Visual Studio Code, emacs, CircleCI, or any combination of the above, you’ll soon have a turnkey solution that will allow you to verify smart contracts using the most advanced analysis engine on the market. Our mission is to raise the baseline security level of all smart contracts deployed on the Ethereum blockchain.

This project has been under wraps for a long time, and I’m super excited to finally write about it. In this article, I’ll give a brief high-level overview of the system. Detailed articles about different aspects of the project will follow.

## Smart Contract Security 2.0
MythX was developed by the team who built 
[Mythril](https://github.com/ConsenSys/mythril)
 (now named “Mythril Classic”), a popular smart contract analyzer. With a total of 300,000+ downloads from the official Dockerhub and Pypi repositories, Mythril Classic is widely used by developers and 
[auditors throughout the Ethereum ecosystem](https://consensys.net/diligence/)
 .
Unbeknownst to the public, our team has spent the last six months cooking up the next generation of analyzers, including:


 *  **Harvey** , a dynamic analyzer and input fuzzer developed by [Valentin Wüstholz](http://www.wuestholz.com) ;
 *  **Maru** , a static code analyzer and linter developed by a team around [Gerhard Wagner](https://www.linkedin.com/in/gerhard-wagner-04852b31/) ;
 *  **Mythril++** , an improved version of the Mythril symbolic analyzer built by [Joran Honig](http://about.joranhonig.nl) , [Nikhil Parasaram](https://www.linkedin.com/in/nikhil-parasaram-1956b5134/) and others.
We’re also building composite analysis tech that orchestrates the various components. For example, static analysis informs symbolic analysis, and the result of both are used to configure dynamic analysis. This allows us to produce highly accurate results with a minimum of false positives. The result is far beyond what any standalone tool on the market can deliver.

![](https://api.kauri.io:443/ipfs/QmPUn1Yp5PLSDFH7D7ZpUBvFUJi6EJqrLZUR8LWyGSwoav)

All of this will be packaged into a SaaS solution called 
[MythX](https://mythx.io)
 . The service will be free for casual use, but professional users will require licenses to unlock the full functionality (more on this below).
Mythril Classic will remain available under a MIT license and we’ll continue maintaining it. Anyone is free to use it however they like, including for commercial purposes.

## MythX Tools Marketplace
Having the best security analysis tech is great. Unfortunately, if it comes in the form of a slow and clunky command line tool, only security enthusiasts will use it. Ethereum devs in the real world don’t have time to mess around with this stuff.
We can’t possibly account for the individual preferences of every Ethereum developer. Therefore, we’re enabling our community and partners to build a whole ecosystem of security tools on top of our platform. These tools will be available in package managers, app stores, and products everywhere. MythX tool developers will earn a share of the revenue generated through the use of their tools. To make this happen, we’re working closely with partners like 
[Gitcoin](https://gitcoin.co)
 , 
[TopCoder](https://www.topcoder.com)
 and 
[MadDevs](https://maddevs.io)
 .
We’re currently running a closed alpha of the API and the community has already come up with some cool prototypes. Join our 
[Discord server](https://discord.gg/kktn8Wt)
 for updates.

## Third-Party Integration
Besides building a tools marketplace, we’re also 
[signing up partners](https://media.consensys.net/powered-by-mythril-introducing-the-mythril-partner-program-8acbca470503)
 that want to use the MythX stack in their own products and services. For example, MythX technology will be integrated into the 
[Quantstamp](https://quantstamp.com)
 protocol. By leveraging Quantstamp’s distributed computing infrastructure, we‘ll enable “deep” security verification that wouldn’t be possible on a standalone system.

## Become Active in the Mythril Community
Whether you have an idea for a MythX tool, have developed a novel analysis technique, or want add value to the project in some other way, now is the best time to get involved.
The best way to get in contact is to ping the team on 
[Discord](https://discord.gg/kktn8Wt)
 . There are also a whole lot of 
[partner programs](https://mythril.ai/faq-partners)
 that companies can apply for. Check out the FAQ section on our 
[website](https://mythril.ai)
 and the 
[whitepaper](https://mythril.ai/files/whitepaper.pdf)
 for more information.