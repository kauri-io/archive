---
title: Plasma Roundup  From MVP to Mainnet
summary: Ethereum second layer scaling technology has come a long way in a short period of time. Second layer solutions, innovations beyond the layer one protocol level, include State Channels, Side Chains, and Plasma. Taken together, layer two technologies present a wide scope of possibility for scaling the Ethereum blockchain. In August 2017, Plasma creators Joseph Poon and Vitalik Buterin proposed this framework for scaling Ethereum transaction throughput to a significant amount of state updates per s
authors:
  - Chris Spannos (@chrisspannos)
date: 2019-04-09
some_url: 
---

# Plasma Roundup  From MVP to Mainnet

Ethereum second layer scaling technology has come a long way in a short period of time. Second layer solutions, innovations beyond the layer one protocol level, include State Channels, Side Chains, and Plasma. Taken together, layer two technologies present a wide scope of possibility for scaling the Ethereum blockchain.

In August 2017, Plasma creators Joseph Poon and Vitalik Buterin [proposed this framework](https://plasma.io/plasma.pdf) for scaling Ethereum transaction throughput to a "significant amount of state updates per second," potentially more than Paypal, Visa or other widely used merchant service providers.

Aside from offering comparable, if not more, transactions per second, Plasma stakes its security in the value of Ethereum’s decentralized mainchain rather than in centralized merchant services.

The current promise of Plasma lays in its potential to help scale blockchain technology by processing a substantial amount of decentralized financial applications worldwide.

In January 2018, Vitalik posted the [“Minimal Viable Plasma” (MVP) specification to the Ethereum Research Forums](https://ethresear.ch/t/minimal-viable-plasma/426). The specification was designed to offer simplicity and basic security properties to kickstart development. Teams immediately began building their implementations.

This overview is not meant to be exhaustive. Instead, by highlighting in progress implementations, it aims to be indicative of the progress that Plasma has made over the past year.

Although none of the Plasma models reviewed here are production ready, they show that the technology is not just theory. Taken together, the implementations suggest that Plasma is moving rapidly toward realizing the scaling potential that its creators and implementers envision.

## Prerequisites

For most of these projects you need [Truffle](https://kauri.io/article/2b10c835fe4d463f909915bd75597d6b/v1/truffle-101-development-tools-for-smart-contracts), [Ganache](https://kauri.io/article/2b10c835fe4d463f909915bd75597d6b/v1/truffle-101-development-tools-for-smart-contracts) and [npm](https://www.npmjs.com) installed.

## FourthState Labs

Among the earliest Plasma implementations was [FourthState Labs](https://github.com/FourthState/plasma-mvp-rootchain), whose design includes a rootchain contract according to the Plasma MVP. This rootchain, which other projects have also incorporated, is a series of Solidity smart contracts. This implementation may be an excellent place to start if you are considering building your own Plasma chain. It is designed to maintain a mapping from block number to merkle root, processing deposits, withdrawals and resolving transaction disputes. FourthState has written tests that emulate running these features which you can run by following these steps:

```shell
git clone https://github.com/fourthstate/plasma-mvp-rootchain
cd plasma-mvp-rootchain
npm install
ganache-cli // In seperate terminal window
npm test
```

![](https://api.kauri.io:443/ipfs/QmbDKcmsdeVqnY3abxsJAAnJakrP3bFeFgwKNL6A4oCATX)

## OmiseGO

Other notable early MVPs include [OmiseGO's implementation](https://github.com/omisego/plasma-contracts). OmiseGO aspires to enable financial inclusion and interoperability through a public, decentralized OMG network. A key component of this network is Plasma. OMG's implementation has a root chain, child chain and a client to interact with the Plasma chain, and is different from the MVP specification. For instance, OMG has added protection against the threat of chain re-organization (which can result from 51% attacks). Among other additions, it has built-in support for ERC20 token handling.

You can run the tests that emulate running the implementation with the following commands:

```shell
git clone https://github.com/omisego/plasma-contracts
cd plasma-contracts
make init
make dev
make test
```

## Kyokan

Making the significant jump from MVP to mainnet is [Kyokan](https://github.com/kyokan/plasma). Kyokan is a Golang implementation [extending the original MVP specification](https://kauri.io/article/7f9e1c04f3964016806becc33003bdf3/v4/minimum-viable-plasma-the-kyokan-implementation). Their architecture uses the FourthState rootchain contract from above and includes root nodes to process transactions and package them into blocks, broadcast blocks to validator nodes, process exits and more. The team has been working steadily since March 2018 to build a production-ready Plasma implementation.

Last month, Kyokan announced that they had achieved [two critical milestones on the way to that goal](https://medium.com/kyokan-llc/announcing-our-plasma-mvp-alpha-23a8bc9673fc): the launch of their MVP mainnet alpha (capable of an initial 1,000 transactions per second) and the completion of their security audit. To help test how their implementation behaves now that they have released it into the wild, Kyokan has launched a game of Capture the Flag, inviting people to break the system and keep the funds, "just let us know how you did it so that the rest of the community can benefit." Successful denial of service attacks and attacks that lead to a loss of funds in [the smart contract](https://etherscan.io/address/0x0cdd78c34a4305234898864c1daccdbb326a520d) will also be paid $1,000.

While Plasma’s arrival on mainnnet is a notable milestone, the technology’s evolution needs more work and time before it is ready for mass adoption.

It's possible to test and run all the component infrastructure Kyokan needs, but you may run into various dependency and build issues. However, if you get past those, you have the chance to test a mostly functional Plasma implementation. [Find full instructions in the project read me](https://github.com/kyokan/plasma#local-development-installation-and-setup).

## Plasma Group

At the end of 2018, the [Plasma Group](https://plasma.group/) [announced the release of their implementation](https://medium.com/plasma-group/plasma-spec-9d98d0f2fccf) aimed at the greater Ethereum community. It includes a Plasma chain operator, a client and command line wallet, support for ERC20 tokens, a block explorer, transaction load testing and more. While their implementation includes properties such as scalable light client proofs and the possibility for interchain atomic swaps, the group has moved quickly to offer a [general purpose plasma design](https://medium.com/plasma-group/towards-a-general-purpose-plasma-f1cc4d49c1f4). This general purpose design aims to overcome constraints in old design patterns which were not upgradeable nor generalizable.

The purpose is to create a Plasma design space that allows the development of applications on a Plasma chain in the same way that developers build dapps on the Ethereum blockchain. Hence the Plasma Group has recently offered Plasma apps, special types of smart contracts called ‘[predicate contracts](https://github.com/plasma-group/plasma-predicates)’ which are deployed to Ethereum, where users can interact with the contract, and the Plasma chain carries out the computation where it is less expensive than if it were to occur on the Ethereum main chain.

To spin up Plasma Group's block explorer, do the following:

```shell
git clone https://github.com/plasma-group/plasma-explorer
cd plasma-explorer
npm install
npm run serve
```

View the local block explorer at _<http://127.0.0.1:8000>_. If that does not work you may need to forward traffic from port 80 to port 3000 with this command:

```shell
sudo iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport 80 -j REDIRECT --to-ports 3000
```

![](https://api.kauri.io:443/ipfs/Qmcq47SvmNBkmTukfridq4f7UwskLSwTe519VvtRwyeQyw)

## Summary

Overall, Plasma is making great leaps forward, but there are still obstacles to overcome. Implementations need to be audited and tested. With mass adoption and the potential for global application, the stakes are high for these chains which, if all goes according to plan, will be processing a significant number of states per second, each state possibly holding high values. These implementations may suggest that layer two Plasma technology is right around the corner, but careful engineering to protect users and avoid risk takes time.
