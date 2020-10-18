---
title: Sharding PoC
summary: While Casper FFG (the “friendly finality gadget,” a.k.a. Vitalik’s casper, which provides finality on top of the existing proof-of-work-based system) is the primary proof of concept candidate in the Shasper “Ethereum 2.0” roadmap, Vlad has been diligently at work for some time on his own Casper workstream, titled Casper CBC (“correct by construction”), which entirely replaces proof of work with a new, provably correct block proposal and fork choice scheme. Until now, that work has been largely t
authors:
  - Kauri Team (@kauri)
date: 2018-09-20
some_url: 
---

# Sharding PoC


While Casper FFG (the “friendly finality gadget,” a.k.a. Vitalik’s casper, which provides finality on top of the existing proof-of-work-based system) is the primary proof of concept candidate in the Shasper “Ethereum 2.0” roadmap, Vlad has been diligently at work for some time on his own Casper workstream, titled Casper CBC (“correct by construction”), which entirely replaces proof of work with a new, provably correct block proposal and fork choice scheme. Until now, that work has been largely theoretical and has consisted primarily of equations and diagrams (see the whitepaper, released last year). So it’s really exciting to see the rubber hit the road and to see some of these ideas be proven out in actual, running code, which is a lot easier for most developers to digest! - Lane "McShardface" Rettig

https://devpost.com/software/ethshardingpoc

This is a proof of concept for a sharded Ethereum blockchain, that supports multiple validators per shards, cross-shard messages and state updates to the EVM.

`simulator.py` simulates and provides a visualisation for this.

#### Setup
```
$ pipenv install
$ pipenv shell
```

#### Built With

- python

#### Try it out
 [GitHub Repo](https://github.com/smarx/ethshardingpoc)


---

- **Kauri original link:** https://kauri.io/sharding-poc/0193c7d7a1d34604880adedae157c09d/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2018-09-20
- **Kauri original tags:** none
- **Kauri original hash:** QmPp3WrJipiNYL4RmV1TBgZfTQ7K9j21S4E2t6rvrTE5tJ
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



