---
title: Clique  cross-client Proof-of-authority algorithm for Ethereum
summary: Most popular cryptocurrencies use Proof-of-work algorithms to achieve consensus. While some of them might eventually switch to Proof-of-stake, PoW is a standard for now. But there are other options. One of them is Proof-of-authority. Here, we will have a look at the general idea of the protocol, as well as one of the implementation called Clique, with its properties and current applications. We will also cover two testnets that currently implement Clique- Rinkeby and Görli. Proof-of-authority ha
authors:
  - Timur Badretdinov (@destiner)
date: 2018-12-19
some_url: 
---

# Clique  cross-client Proof-of-authority algorithm for Ethereum

![](https://ipfs.infura.io/ipfs/QmU6GAqwt3zTT33fCrtnCrDCwzDWSJ3VcUVLtDWMRHkKgY)



Most popular cryptocurrencies use Proof-of-work algorithms to achieve consensus. While some of them might eventually switch to Proof-of-stake, PoW is a standard for now. But there are other options. One of them is Proof-of-authority. Here, we will have a look at the general idea of the protocol, as well as one of the implementation called Clique, with its properties and current applications. We will also cover two testnets that currently implement Clique: Rinkeby and Görli.

Proof-of-authority has one distinctive feature: only approved signers can seal the blocks. That’s it, a valid block doesn’t require hash mining, or staking coins; the only requirement is to be included in the list of approved signers. This list can be static or dynamic. In the first case, a list of sealers is defined in the genesis block and can’t be changed. In the second case, current signers have the ability to add new signers or remove existing ones in case they act maliciously.

Currently, PoA consensus actively used for the Ethereum testnets. The reason is that PoW testnets are usually insecure, as they lack hash power. Miners don’t receive anything for securing the test network, so adding hash power to the testnet is usually a volunteer activity. And though the attacker doesn’t earn money by 51%-ing the testnet, he can disrupt the network and damage user experience rather cheap. However, if the network uses Proof-of-authority, an attacker will have a hard time controlling the network.

Ropsten, the PoW testnet, went under several 51% attacks, which resulted in the network bloated with meaningless transactions. Eventually, the chain cleaned from the bloat 
[forked away into Ropsten Revival](https://github.com/ethereum/ropsten/blob/master/revival.md), but in the meantime, user experience was suffered. While Proof-of-work testnets are still necessary to test Ethash-related features and discover potential consensus issues, Proof-of-authority test networks serve as a reliable and convenient alternative for developers to test their dapps and don’t worry much about possible attacks and reorgs.

Clique is one such PoA algorithm. In Clique, all blocks are mined, or sealed, by approved signers. The process of sealing a block is pretty straightforward. Unlike in Ethash (Ethereum’s PoW algorithm), there is no mining, and sealers don’t spend time brute-forcing hashes, so the task is computationally light.

Besides the absence of mining, making a block in Clique is similar to the Ethash. Miner collects transactions, executes them, updates the network state, calculates a hash of the block, and signs the block using his private key. To limit the number of processed transactions, Clique allows creating one block per defined period of time. In Ethereum testnets, block time is set as 15 seconds to mimic the mainnet.

Generally speaking, miners can seal blocks in any order. However, Clique introduces a few rules that incentivize signing blocks in the right order. These rules also help to minimize the number of chain reorgs.

> It will help to define what exactly “signing blocks in order” means. In Clique, list of signers is lexicographically sorted. The current signer is selected as `BLOCK_NUMBER % SIGNER_COUNT`. An example of a signer list is `[0xaaa...a, 0xbbb...b, 0xccc...c]`. In the network with such list, signer with index 1 (`0xbbb...b`) should sign block 1, signer with index 2 (`0xccc...c`) should sign block 2, signer with index 0 (`0xaaa...a`) should sign block 3, and so on.

First, the difficulty of a block depends on whether the block was signed in turn or out of turn. “In turn” blocks have difficulty 2, and “out of turn” blocks have difficulty 1. In the case of small forks, the chain with most of the signers sealing blocks “in turn” will accumulate the most difficulty and win.

Second, out of `FLOOR(SIGNER_COUNT / 2) + 1` consecutive blocks each signer can sign only once. For example, if there are 5 signers, a signer can’t sign more than one block in a series of 3 blocks. This means that at least 51% of signers should participate in block sealing, otherwise the network will stall.

Now, as we learned before, the list of the sealers can be dynamic. For Clique, that’s the case. Current signers can vote in or vote out other signers by writing their wallet addresses to the block header during sealing. A proposal that receives a majority of votes comes into effect immediately.

Now, let’s talk about testnets. Where is Clique actually used? In short, there are currently 3 widely used testnets: Ropsten, Kovan, and Rinkeby. Ropsten uses the same consensus algorithm as the mainnet, Ethash. Kovan uses 
[Aura](https://wiki.parity.io/Aura), which is another Proof-of-authority algorithm. Finally, Rinkeby uses Clique.

There is also Görli, which is relatively new testnet but is rapidly growing in development activity and adoption. Görli uses Clique too. Actually, one of the reasons to make Görli was to make a fresh testnet where clients developers can easily test the implementation of Clique and therefore make the algorithm work across as many clients as possible.

This is just a short summary of what is PoA and how does Clique work. If you want more, you can check specs at the 
[corresponding EIP](https://github.com/ethereum/EIPs/issues/225), or go 
[straight to the sources](https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/clique.go) of Geth. There are also sources available for [Nethermind](https://github.com/NethermindEth/nethermind/tree/master/src/Nethermind/Nethermind.Clique) and [Pantheon](https://github.com/PegaSysEng/pantheon/tree/master/consensus/clique/src/main/java/tech/pegasys/pantheon/consensus/clique) clients. You can also learn more about [Görli testnet](https://github.com/goerli/testnet).



---

- **Kauri original title:** Clique  cross-client Proof-of-authority algorithm for Ethereum
- **Kauri original link:** https://kauri.io/clique-cross-client-proof-of-authority-algorithm-f/7f44cd9ea79043bc902070e6e6f3cf98/a
- **Kauri original author:** Timur Badretdinov (@destiner)
- **Kauri original Publication date:** 2018-12-19
- **Kauri original tags:** none
- **Kauri original hash:** QmRX1RyhMr6gMhj6jn7tjVoMXKKZr2wCdqvc1JrEypKXny
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



