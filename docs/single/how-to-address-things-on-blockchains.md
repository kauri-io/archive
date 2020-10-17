---
title: How to address things on blockchains
summary: Generally, addressing something means to unambiguously identify it. The address should also contain some information that helps to find the addressed thing. An email inbox is identified by an email address, the server is noted after the @-sign, a paper letter is addressed with name of recipient, street, number, ZIP-Code, city and country. In this example, the goal is to ensure that a message sent to an address can in principle reach its target and won’t accidentally go anywhere else. Additionall
authors:
  - Johannes Pfeffer (@oaeee)
date: 2019-04-25
some_url: 
---

# How to address things on blockchains


![](https://api.kauri.io:443/ipfs/QmZaWmWPwkuvpzQ5zasUmWRARm8dss6cJ3SNDqZrhtTfVd)

Generally, 
_addressing_
 something means to unambiguously identify it. The address should also contain some information that helps to find the addressed thing. An email inbox is identified by an email address, the server is noted after the @-sign, a paper letter is addressed with name of recipient, street, number, ZIP-Code, city and country.
In this example, the goal is to ensure that a message sent to an address can in principle reach its target and won’t accidentally go anywhere else. Additionally, when talking about a thing, addressing it unambiguously makes sure everyone is talking about the same. Addressing becomes identifying.
**In case of the ACTUS protocol, a protocol for finance on blockchain, unambiguous addressing is important to reference an asset across chains, in legal documents and compliance procedures.**

At the first glance it’s an easy one, at least for Ethereum: just provide the address of a contract or an externally owned wallet and you’re good.
**But, unfortunately, it’s not that easy if we assume a multi-chain, multi-fork future.**

Here are some of the challenges:



 * How to address a blockchain, e.g. Ethereum vs. Bitcoin?

 * How to address a [fork](https://vitalik.ca/general/2017/03/14/forks_and_markets.html) , e.g. ETH vs. ETC, BTC vs. BCH?

 * How to address in case of network splits, e.g. Russia [separates its internet](https://wapo.st/2SL1Ubc?tid=ss_tw&utm_term=.022ca0c92047) from the rest of the world?

 * Finality related challenges, e.g. reorgs, 50% attacks, etc.

 * Sub contract addressing, e.g. a contract that implements a registry of assets.

 * How to deal with upcoming concepts like storage rent?
Let’s go on a quick journey that will lead us to a working approach.

## Today’s solution
Let’s take an interesting ERC-20 compatible token, the DAI stable coin, as an example and build and address schema for it.



 * Blockchain: DAI lives on Ethereum _mainnet_.

 * Address: The token is implemented by a contract at address _0x89d2...0359_
Using the 
[URL Format for transaction requests](https://eips.ethereum.org/EIPS/eip-681)
 as a starting point, we could construct a naive address scheme for a universal crypto asset identifier:
 
_protocol:some-on-chain-identifier_
 
This becomes variant #1:
 
_ethereum:0x89d2...0359_

 (the dots are there for readability and represent the missing hex characters, 
[ENS](http://ens.domains)
 could also be used)

This is basically what is done today. You select the name of the blockchain in a tool like MetaMask and then send Ether to an account with a certain address.

**It works today, because ambiguity is still limited. In a multi-chain, multi-fork ecosystem, this won’t be the case.**

## The challenge
Darn! Ethereum and Bitcoin have already forked several times! Even though only one alternative Ethereum history has been long term sustainable (Ethereum Classic), there may and likely will be others in future. If I say: pay 5 ETH to my address 0x… on "Ethereum" — can you be sure to what fork it should go?
Ethereum has concepts to separate different Ethereum based chains: 
[chain IDs](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)
 and 
[network IDs](https://github.com/ethereum/wiki/wiki/Ethereum-Wire-Protocol)
 . Chain IDs are mainly a measure against 
[replay-attacks](https://en.wikipedia.org/wiki/Replay_attack)
 . They are part of transaction signing and will make sure that a transaction is only valid on a network with the specified chain ID. Ethereum’s mainnet chain ID is 
_1_, ETC’s chain ID is _61_. The network ID is _1_ on both networks, though.
This gives us a new way to address the DAI token contract for variant #2:
 
_ethereum:0x89d2...0359?network-id=1&chain-id=1_
 
This is a bit better — but there are some new problems which lead us to discard this solution:



 * Chain ID and network ID are Ethereum specific concepts and won’t work for other blockchain stacks

 * Anyone can start another public blockchain or testnet with the same IDs

 * A contentious fork cannot be forced to change/not change these IDs.

### Hash based addressing
So we need a more universal solution.
Ethereum mainnet is a blockchain that started on July 30th, 2015 with the block number _0_ and block hash _0xd4e5...8fa3_ .
The 
[block hash](https://ethon.consensys.net/prop-blockhash.html)
 in Ethereum is the 
[Keccac 256](https://crypto.stackexchange.com/questions/15727/what-are-the-key-differences-between-the-draft-sha-3-standard-and-the-keccak-sub)
 hash of the block’s header data. It’s (near) impossible to create a different piece of data that will result in the same hash.
Thus, we can identify a blockchain with the security level of that blockchain by referring to a hash of a data item in the chain, e.g a block hash, or a transaction hash.
 
_protocol:some-on-chain-identifier?with-block-hash=0x..._
 
 
_ethereum:0x89d2...0359?with-block-hash=0x91b3...1aa8_
 
Variant #3 states:
> I’m addressing an Ethereum blockchain that contains a block with the hash 0x91b3...1aa8. On that blockchain I specifically refer to the contract with the address 0x89d2...0359.


### The annoying phenomenon of forks

![](https://api.kauri.io:443/ipfs/QmemJWEq8wVcrj4nczn19tXzjh1NmMaE81WmmPxtpLUuLa)

In the above illustration of a fork it’s visible that 
_contract A_
 is part of the history of both, the yellow and the purple chain while 
_contract B_
 is only part of the purple chain. If you address 
_contract A_
 as shown in Variant A, the asset it represents, e.g. a token, will exist on both chains. Its balances and execution rules may be different, though.
To make this unambiguous, one could address the following way:
 
_protocol:some-on-chain-identifier?recent-blockhash=0x..._
 
 
_ethereum:0x89d2...0359?recent-blockchash=0x455b...7578_
 
This variant #4 ensures that only a blockchain is addressed that contains a hash which exists at a recent state of 
[https://medium.com/at-par](https://medium.com/at-par)
 the chain. The 
_recent-block-hash_
 parameter must be as up to date as possible (but as final as necessary) to minimize the ambiguity risk.

### Resolving addresses
The above schemes 3 & 4 lead to addresses consisting of multiple hashes, each 256 byte long (on Ethereum). Unfortunately, these hashes don’t contain any information to help identify the blockchain fork actually containing them.
One way to solve this is a resolve service. It can be done by centralized provider like 
[ITSA](http://itsa.global)
 that provides the necessary information to identify and asset. Or it can be a key-value store on a decentralized service (e.g. IPFS) that takes a hash and resolves it to a blockchain including a proof of its existence there.
The resolve service becomes more efficient by adding the first block hash of a chain to the address. This reduces the search space to forks of the blockchain with that 
[genesis block](https://ethon.consensys.net/class-genesisblock.html) .

## Fork-resistant addresses
We have reduced the problem to finding the earliest block hash on a chain, the latest known block hash on that chain which is believed to be final and an identifier, e.g. a transaction hash or a smart contract address. The age of the latest hash is a parameter to the fork risk of the address.


**Addressing the DAO token on Ethereum mainnet**

a) Address of item:        0x89d2...0359
b) Earliest known hash:    0xd4e5...8fa3
c) Latest known hash:      0x3743...3348

Variant 5: ethereum:0x89d2...0359?early-block-hash=0xd4e5...8fa3&recent-block-hash=0x3743...3348


![](https://api.kauri.io:443/ipfs/QmZaWmWPwkuvpzQ5zasUmWRARm8dss6cJ3SNDqZrhtTfVd)

Revisiting the illustration from the beginning of this article we can unambiguously address 
_contract A_
 in the purple fork at block time of block #5 by referencing



 *  addressOf(contract A)
 *  hashOf(block 0) 
 *  hashOf(block 5)

To verify the address there needs to exist a valid hash-chain from 
_hashOf(block 0)_
 to 
_hashOf(block 5)_
 AND 
_addressOf(contract A)
_ must exist in that chain’s history.
However, the purple chain may fork again some time in the future and could make the address ambiguous, again.

## Using the address
Say you have received an address for a blockchain asset and have successfully resolved it to a debt token contract (e.g. an ACTUS Principal at Maturity contract or a Dharma debt token) on mainnet Ethereum, using an IPFS or 
[ITIN](https://itsa.global/what-we-do/#ITIN)
 based resolver.
In order to buy a share of that contract you will have to actually interact with the correct network. The tool that you use to make the transaction could do the following to assist you:



 * The tool will look the address up at a resolve service and present the result to the user

 * Before executing the transaction it will verify that _early-block-hash_ and _recent-block-hash_ exist on the chain

 * In case the newest hash in the address is older than a certain threshold time it will warn the user to check for forks

## Conclusion
Addressing on blockchains is far from solved. None of the approaches known to me are satisfactory, yet. If we don’t solve this properly, there could be instances of “blockchain fishing” in the future — a new branch of scams that impersonates a whole chain.
To deal with this proactively, we need to raise awareness and cooperate on solutions. We look forward to and are actively supporting standardization efforts such as ITSA and 
[multiaddr](https://multiformats.io/multiaddr/) .

In this article we looked at addressing blockchains and accounting for forks. Intentional or unintentional network splits, finality related challenges, sub contract addressing and connecting to the nodes network are further challenges that will be investigated in another post. 

**[Subscribe to the at par blog](https://medium.com/at-par) to be notified.**
 

### Disclaimer
The author is affiliated with 
_ConsenSys AG_
 and 
_atpar AG_
 . All opinions are his own an not opinions of the companies. No investment advice.
