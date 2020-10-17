---
title: Ethereum 101 - Part 6 - Mainnet & Testnets
summary: Quick Overview Mainnet - the live public Ethereum production blockchain, where actual valued transactions occur on the distributed ledger. Public Testnet(s) - public Ethereum blockchain(s) designed for testing, running on valueless ether available from faucets, that mock the mainnet environment as best as possible. Examples- Ropsten, Kovan, Rinkeby, Görli Local Testnet(s) - local, running on your machine or on a small scale, private Ethereum blockchains. Examples- Ganache, eth-tester, private cl
authors:
  - Wil Barnes (@wil)
date: 2019-02-13
some_url: 
---

# Ethereum 101 - Part 6 - Mainnet & Testnets

# Quick Overview 

* **Mainnet** - the live public Ethereum production blockchain, where actual valued transactions occur on the distributed ledger.

* **Public Testnet(s)** - public Ethereum blockchain(s) designed for testing, running on valueless ether available from "faucets," that mock the mainnet environment as best as possible.
    - Examples: Ropsten, Kovan, Rinkeby, Görli
* **Local Testnet(s)** - local, running on your machine or on a small scale, private Ethereum blockchains.
    - Examples: Ganache, eth-tester, private client network clusters (e.g. Geth with custom genesis file, Parity with '--dev' argument)

Generally speaking, consumers will interact with the Ethereum mainnet. Developers, projects, and researchers will use testnets to experiment new features, test transactions, and calibrate gas costs without paying gas fees. 

# Table Overview of the Testnets 

| Network | Mainnet | Ropsten | Kovan | Rinkeby | Görli |
|---|---|---|---|---|---|
| **Consensus Protocol** | Proof of Work (ethash) | Proof of Work <br>(best emulates mainnet environment) | Proof of Authority | Proof of Authority (Clique) | Proof of Authority (Clique) |
| **Supported Clients** | Multi-client | Both Geth / Parity | Parity only | Geth only | Multi-client |
| **Average Block Times** | ~15 sec. | ~15 sec. | ~4 sec. | ~15 sec. | ~16 sec. |
| **Mineable / Faucet** | Mineable / Ether purchased on exchanges | Mineable <br>(ether can also be requested via fauced | Not mineable <br>(ether is requested via faucet) | Not mineable <br>(ether is requested via faucet) | Not mineable<br>(ether is requested via faucet) |
| **Website** | [Link](https://ethstats.net/) | [Link](https://github.com/ethereum/ropsten) | [Link](https://github.com/kovan-testnet/proposal) | [Link](https://www.rinkeby.io/) | [Link](https://goerli.net/) |

* Source: https://www.ethnews.com/ropsten-to-kovan-to-rinkeby-ethereums-testnet-troubles
* Source: https://ethereum.stackexchange.com/questions/27048/comparison-of-the-different-testnets

## Ropsten using Proof of Work
The Ropsten testnet, by virtue of using a Proof of Work consensus protocol and being mineable, generally best emulates the current Ethereum production network. 

## Rinkeby and Kovan using Proof of Authority
Kovan and Rinkeby both utilize a Proof of Authority (PoA) protocol. Instead of nodes solving arbitrarily difficult mathematical proof of work puzzles, a set of authorities (called ‘sealers’) are given the explicit permission to create new blocks and update the state of the test blockchain. 

Under a Proof of Authority protocol, adversaries operating from an unwanted connection are unable to overwhelm or spam the network. The implementation of Proof of Authority testnets was the result of a series of attacks exploiting the proof of work algorithm on prior testnets (originating on Morden, which has since been voluntarily deactivated). To learn more of the historical details surrounding the testnets, please see the additional reading section. 

### Single client testnets
Single client testnets also offer auxiliary debugging information. If Rinkeby is experiencing issues, a reasonable assumption can be made that there is a bug in the Geth client. Diagnosing issues on the mainnet can be more nebulous due to the multitude of different clients maintaining sync. 

### Multi client testnets
Likewise, multi client testnets create environments that allow for testing of client interoperability. Ropsten supports both Geth and Parity clients. Görli, a new testnet with its genesis block starting Jan. 31, 2019, supports Parity, Geth, Nethermind, Pantheon, and EthereumJS. 

# I'm a consumer, I want to use real Ether and use DApps, what network do I use?
* Mainnet. Be vigilant, you will be using real digital assets!

# I'm a developer, what network do I use?
* Are you simply testing small, private transactions? Try starting with Ganache or a private Geth or Parity chain. 
* Are you working with a DApp? Try deploying to a public testnet suitable to your needs (e.g. single client, multi-client, or do you need a specific blocktime? Check the table above.) 
* Full faith and confidence in your DApp? Deploy to mainnet and expect some attention.  

# Additional Reading: 
- “Ropsten to Kovan to Rinkeby: Ethereum’s Testnet Troubles:’ [https://www.ethnews.com/ropsten-to-kovan-to-rinkeby-ethereums-testnet-troubles](https://www.ethnews.com/ropsten-to-kovan-to-rinkeby-ethereums-testnet-troubles)
- Ropsten Revival, Ethereum Github: [https://github.com/ethereum/ropsten/blob/master/revival.md](https://github.com/ethereum/ropsten/blob/master/revival.md)
