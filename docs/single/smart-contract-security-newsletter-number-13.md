---
title:   === Smart Contract Security Newsletter - Number 13 ===
summary: This is my weekly newsletter, on Kauri for the first time. Get them in your inbox every weekend. Lots of interesting conferences this week, the Aragon Foundations AraCon, GörliCon for the release of the Görli testnet (POA across Geth and Parity), and the Stanford Blockchain Conference (SBC). I admit to having a lot of FOMO about SBC, so this newsletter is pretty focused on it. Distilled NewsStanford Blockchain Conference 2019 Ive been fortunate to catch some of the livestream from the Stanford B
authors:
  - Maurelian (@maurelian)
date: 2019-02-02
some_url: 
---

#   === Smart Contract Security Newsletter - Number 13 ===


This is my weekly newsletter, on Kauri for the first time. [Get them in your inbox every weekend](https://tinyletter.com/smart-contract-security).

Lots of interesting conferences this week, the Aragon Foundation's [AraCon](https://aracon.one/), GörliCon for the release of the Görli testnet (POA across Geth and Parity), and the Stanford Blockchain Conference (SBC).

I admit to having a lot of FOMO about SBC, so this newsletter is pretty focused on it.


### Distilled News

#### [Stanford Blockchain Conference 2019](https://cyber.stanford.edu/sbc19) 

I've been fortunate to catch some of the livestream from the Stanford Blockchain Conference this week, and the content is really fantastic. Here are a few of the talks that I've really enjoyed, or that someone smart has told me is really great:

##### Dan Robinson, HTLCs Considered Harmful [[video](https://youtu.be/sQOfnsW6PTY?t=2741) / [slides](https://cyber.stanford.edu/sites/default/files/htlcs_considered_harmful.pdf)]

Hashed timelocked contracts are used to implement cross chain swaps. There's a few things wrong with them ([also outlined here](https://medium.com/crypto-economics/an-illustrated-primer-on-cross-currency-swaps-in-htlcs-da90a90b60a9)), ie. if the counterparty pulls out of the transaction, you've been grieffed, and you didn't have access to your funds for some period of time.

Dan describes "Packetized Payments", which are a bit more like a cross chain payment channel.

##### Patrick McCorry, State Channels as a Scaling Solution for Cryptocurrencies [[video](https://youtu.be/sQOfnsW6PTY?t=4563)]

Patrick does a nice job of describing (application specific) state channels with a game of Battleship as an example. He describes the problem of the "Always online assumption", ie. all parties must remain online to detect and defend against cheating. That's a pretty strong assumption, especially when the other parties have an incentive to take you offline. 

The proposed solution is "Pisa" ([whitepaper](http://www0.cs.ucl.ac.uk/staff/P.McCorry/pisa.pdf)), a protocol for incentivizing 3rd parties to do the monitoring for you, and to punish them if they don't. You might not be surprised to hear that it involves staking and slashing. 

##### Building, and Building on, BulletProofs ([part 1](https://youtu.be/XckwEw8FyEA?t=2062) / [part 2](https://youtu.be/XckwEw8FyEA?t=2752) / [slides](https://cyber.stanford.edu/sites/default/files/bulletproofs_sbc19.pdf))

Full disclosure, I have not yet watched this talk, but my colleague Dean was super excited about the second half, which described a zero knowledge virtual machine (and thus zk smart contracts).

##### Formal verification: the road to complete security of smart contracts ([video](https://youtu.be/sQOfnsW6PTY?t=18863) / [slides](https://docs.google.com/presentation/d/1-NkTBnE8P48BUllwkrz8Dey2BPApQ3-RFi_clSA68M4/edit#slide=id.g33c747f0ce_0_5))

There's nothing like a good taxonomy to clarify your thinking. For me at least, Martin's "Four flavors of dapp behavior" were particularly illuminating, they are: 

1. Smart contract bytecode verification – What can happen over the course of one tx?
2. Dapp/system invariants- What can happen over the course of a list of tx?
3. “Blockchain specific” problems - What will happen in the case of eclipse attacks, frontrunning, chain reorderings, replay attacks, etc?
4. Incentive reasoning - How will a self-interested, rational economic actor use this dapp?

Another great nugget on slide 14 are his suggestions for "[how to write provable smart contracts](https://docs.google.com/presentation/d/1-NkTBnE8P48BUllwkrz8Dey2BPApQ3-RFi_clSA68M4/edit#slide=id.g4ddfd94cc3_0_95)". 

And finally, he introduces [Klab act](https://github.com/dapphub/klab/blob/master/acts.md), a specification language that abstracts away much of the boilerplate in the K-Framework's specification language.


##### Vlad and Vitalik, Ethereum's future

I haven't watch these yet, they were the last sessions today, but they start around [here](https://youtu.be/U5fEvfAFs_o?t=18356).


### News
* [Fuzzing Smart Contracts Using Multiple Transactions](https://medium.com/consensys-diligence/fuzzing-smart-contracts-using-multiple-transactions-51471e4b3c69) - Dilligence
* [Solving Software’s Oldest Problem: Good Tech is Not Enough](https://medium.com/@wadeAlexC/solving-softwares-oldest-problem-good-tech-is-not-enough-2377cf810419) - Authio
* [Statistical modeling of PoS systems with Tarun Chitra
](https://www.zeroknowledge.fm/61) - ZeroKnowledgeFM
* [Defeating Front-Running on Ethereum with Submarine Sends](https://www.youtube.com/watch?v=N8PDKoptmPs) - IC3
* [Uncovering a Game Of Stakes cartel](https://medium.com/certus-one/uncovering-a-game-of-stakes-cartel-f895d9591da1) - Certus One

----

Thanks again to everyone for reading. I hope you found something useful in here.

Cheers,
Maurelian



Want to help make this newsletter better? Join the ['#maurelians-newsletter channel' in the MythX](https://discord.gg/X4u2aT) discord chat.

----

This newsletter is supported by [ConsenSys Diligence](https://consensys.net/diligence), where I work. We can help with all things smart contract security; auditing, secure development guidance, and training.

![](https://i.imgur.com/EyNCiSx.png)


#### We're hiring!

<a href="https://consensys.net/open-roles/1129067/">Developer - Security Analysis Tools</a>
<a href="https://consensys.net/open-roles/1401943/">Frontend and Dapp Engineer, MythX</a>
<a href="https://consensys.net/open-roles/1420298/">Marketing and Brand Manager, MythX</a>
<a href="https://consensys.net/open-roles/609611/">Security Engineer and Auditor - Smart Contracts</a>
<a href="https://consensys.net/open-roles/1401927/">Senior Technical Recruiter</a>
<a href="https://consensys.net/open-roles/902518/">Smart Contract Security Business Development Lead</a>
<a href="https://consensys.net/open-roles/1401931/">Technical Product Manager, MythX</a>

----

I know, I know, there's a crazy amount of whitespace at the bottom of this newsletter. Proably time to move off of TinyLetter anyways.


---

- **Kauri original title:**   === Smart Contract Security Newsletter - Number 13 ===
- **Kauri original link:** https://kauri.io/smart-contract-security-newsletter-number-13/41a7720bc6ce4b6983cf252976fcb7ff/a
- **Kauri original author:** Maurelian (@maurelian)
- **Kauri original Publication date:** 2019-02-02
- **Kauri original tags:** security
- **Kauri original hash:** QmP8onKX3PFvvEfThW5ccXymGEygG6LoN2tX3ApTwLvUdE
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



