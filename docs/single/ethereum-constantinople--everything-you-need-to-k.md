---
title: Ethereum Constantinople  Everything You Need To Know
summary: Edit- Ethereum Constantinople has been delayed out of an abundance of caution. Learn more about it here- https-//medium.com/mycrypto/ethereum-constantinople-postponed-out-of-an-abundance-of-caution-a2d6db454fea The Ethereum Constantinople fork is coming soon, and many of you have been asking what that means and if you’ll have to do anything to prepare. TL;DR- If you’re simply an owner of ETH, you do not need to do anything to prepare for this update. What is a fork? Most simply, a fork is an upd
authors:
  - MyCrypto (@mycrypto)
date: 2019-02-04
some_url: 
---

# Ethereum Constantinople  Everything You Need To Know


 
_Edit: Ethereum Constantinople has been delayed out of an abundance of caution. Learn more about it here:_
  
[https://medium.com/mycrypto/ethereum-constantinople-postponed-out-of-an-abundance-of-caution-a2d6db454fea](https://medium.com/mycrypto/ethereum-constantinople-postponed-out-of-an-abundance-of-caution-a2d6db454fea)
 
The Ethereum Constantinople fork is coming soon, and many of you have been asking what that means and if you’ll have to do anything to prepare.

### TL;DR: If you’re simply an owner of ETH, you do not need to do anything to prepare for this update.

#### What is a fork?
Most simply, a fork is an 
**update**
 to the network. It is very similar to how you update your computer or your applications to be more secure or have new features.
Have you ever tried to open a Word document or other file and it looked all wonky because it was created in a newer version of Word? Perhaps comments were lost or displayed in a weird font? A hard fork is similar to that. If people are running the old software and the new software and try to talk to each other, things may be missing or get wonky.
This is because the blockchain is decentralized and running on a ton of computers simultaneously. Instead of emailing that Word document from one person to another, everyone can access the most up-to-date “Word document” (aka the blockchain) simultaneously.
So, to make sure things don’t get wonky, everyone running a the blockchain software (aka a “node”) must update. That way everyone has the same new features and security features and is playing by the same rules.

![](https://ipfs.infura.io/ipfs/QmSbC12ETgBrGMB4QtHqH1ouoesQszuK3FdVkhwQiYGszb)


#### Why is it called a fork?
It’s referred to as a fork because, similar to a fork in the road, a single chain of blocks splits into two chains separate of blocks. One path, or chain, is the people playing by the old rules. The second chain the people playing by the new rules.
With non-contentious hard-forks, most people stop running the old software. No one adds new blocks to that chain. The chain naturally slows and then dies. There is no value to the coins on the old chain.
However, if an update fork is contentious (meaning there are people who don’t agree with the changes being made), both “paths” of the fork may continue to live and have value. This is how ETC was spawned from ETH and BCH from BTC.

![](https://ipfs.infura.io/ipfs/QmdvkbkXJRKPUKy5vmDHy8hzZ2cJefrkoCiGCgSxdGgGLp)


#### What is Constantinople?
Constantinople is simply a name given to this update to the Ethereum network. The updates (below) are non-contentious and it is expected that everyone is in agreement on taking the Ethereum blockchain on this new path.
As a result, like the non-contentious updates that have come before (Homestead in 2016 and Byzantium in 2017), this hard fork will result in two chains with the old chain dying almost immediately. Also, like the updates that have come before, the average person will not notice any changes or that there was a fork in the road.
This new ETH blockchain includes a handful of new Ethereum Improvement Proposal (EIP) implementations that are all intended to… improve Ethereum.

![](https://ipfs.infura.io/ipfs/QmfE65uhwZftSknAcYJ5waicijjSc9VTSJ5F4bjFLuzpR5)


#### Do I have to do anything with this new blockchain, or move my ETH?
 
**No.**
 Your ETH will exist simultaneously on the new ETH blockchain and the old ETH blockchain. All of the exchanges (Coinbase, Kraken, ShapeShift), services ( 
[MyCrypto](https://www.mycrypto.com)
 , MetaMask, Trust Wallet), and node providers ( 
[Infura](https://infura.io/)
 , 
[Etherscan](https://etherscan.io)
 , 
[Quiknode](https://quiknode.io/)
 ) will update their nodes so you will simply use the updated nodes / software without even noticing.
If 
**you**
 run a node (e.g. you work for Infura or are running Geth or Parity on your home computer), you will need to update to the latest and greatest software. Again, for average users, you will not need to do anything & this will be a painless and smooth transition.
If the hard fork was contentious, that would be a different story.

#### Which EIPs are being included?
 
[EIP 145: Bitwise shifting instructions in EVM](https://eips.ethereum.org/EIPS/eip-145)
 



 * To provide native bitwise shifting with cost on par with other arithmetic operations.

 * EVM is lacking bitwise shifting operators, but supports other logical and arithmetic operators. Shift operations can be implemented via arithmetic operators, but that has a higher cost and requires more processing time from the host. Implementing SHL and SHR using arithmetics cost each 35 gas, while the proposed instructions take 3 gas.

 *  _TL;DR: Adds native functionality to protocol so that it is cheaper & easier to do certain things on chain._ 😉
 
[EIP 1014: Skinny CREATE2](https://eips.ethereum.org/EIPS/eip-1014)
 



 * Adds a new opcode at 0xf5, which takes 4 stack arguments: endowment, memory_start, memory_length, salt. Behaves identically to CREATE, except using `keccak256( 0xff ++ address ++ salt ++ keccak256(init_code)))[12:]` instead of the usual sender-and-nonce-hash as the address where the contract is initialized at.

 * Allows interactions to be made with addresses that do not exist yet on-chain but can be relied on to only possibly eventually contain code that has been created by a particular piece of init code.

 * Important for state-channel use cases that involve counterfactual interactions with contracts.

 *  _TL;DR: Makes it so you can interact with addresses that have yet to be created because state-channels._ 😉
 
[EIP 1052: EXTCODEHASH opcode](https://eips.ethereum.org/EIPS/eip-1052)
 



 * This EIP specifies a new opcode, which returns the keccak256 hash of a contract’s code.

 * Many contracts need to perform checks on a contract’s bytecode, but do not necessarily need the bytecode itself. For instance, a contract may want to check if another contract’s bytecode is one of a set of permitted implementations, or it may perform analyses on code and whitelist any contract with matching bytecode if the analysis passes.

 * Contracts can presently do this using the EXTCODECOPY opcode, but this is expensive, especially for large contracts, in cases where only the hash is required. As a result, we propose a new opcode, EXTCODEHASH, which returns the keccak256 hash of a contract’s bytecode.

 *  _TL;DR: Makes it cheaper (less gas is needed) to do certain things on chain._ 😉
 
[EIP 1283: Net gas metering for SSTORE without dirty maps](https://eips.ethereum.org/EIPS/eip-1283)
 



 * This EIP proposes net gas metering changes for SSTORE opcode, enabling new usages for contract storage, and reducing excessive gas costs where it doesn’t match how most implementation works.

 *  _TL;DR: Makes it cheaper (less gas is needed) to do certain things on chain, especially things that are currently “excessively” expensive._ 😉
 
[EIP 1234: Constantinople Difficulty Bomb Delay and Block Reward Adjustment](https://eips.ethereum.org/EIPS/eip-1234)
 



 * The average block times are increasing due to the difficulty bomb (also known as the “ice age”) slowly accelerating. This EIP proposes to delay the difficulty bomb for approximately 12 months and to reduce the block rewards with the Constantinople fork, the second part of the Metropolis fork.

 *  _TL;DR: Make sure we don’t freeze the blockchain before proof of stake is ready & implemented._ 😉
 
[Here’s a short video that describes 4 of the 5 EIP updates](https://www.youtube.com/watch?v=rfg408lSAj0)
 



 * The video was released before the Ethereum foundation added a 5th EIP to the update, [EIP-1283](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1283.md) .

#### Will this affect transaction/confirmation time?



 * Block time should stay ~15 secs. Full PoS (in the future) may change that, but with PoW there’s some latency involved and a faster transaction speed may create blocks with unreliable transactions. [ETH currently uses uncle blocks to deal with this.](https://forum.ethereum.org/discussion/2262/eli5-whats-an-uncle-in-ethereum-mining) 

#### Will this affect cost of transaction?



 * The cost depends on the quantity of transactions. Some of the EIP’s will optimize smart contract interactions, so, hopefully, the cost of transacting with a smart contract will decrease. However, we don’t know if another dapp like CryptoKitties will show up, congesting the network and increasing fees.

#### Will this affect the number of transactions per second?



 *  [https://www.reddit.com/r/ethereum/comments/9edwkk/how_many_transactions_per_second_will_we_have/](https://www.reddit.com/r/ethereum/comments/9edwkk/how_many_transactions_per_second_will_we_have/) 

 * There will be the same average Tx’s/second, but with how EIP-1024 will optimize state channels, we should see some second-layer solutions starting to come into play (think OmiseGo, Loom Network, Raiden, etc.)

#### Is this the Proof of Stake update?



 * Not yet, there’s a lot of testing still going on with this. One of the reasons of EIP-1234 is to reduce block rewards in order to delay the difficulty bomb. [Eventually, we’ll have a beacon chain and sharding chains](https://www.mangoresearch.co/ethereum-casper-v2-beacon-chain-sharding-explained-simply/) .
Here’s a 
[progress tracker used for Constantinople](https://github.com/ethereum/pm/wiki/Constantinople-Progress-Tracker)
 . This is a great resource if you’re looking to learn about the EIP’s on a technical level.
Thank you to redditor 
[/u/cartercarlson](https://old.reddit.com/user/cartercarlson)
 , who wrote a 
[summary](https://old.reddit.com/r/ethereum/comments/abv70c/heres_a_summary_of_the_constantinople_update/)
 and graciously gave us permission to borrow from it. We’ve modified and added a lot.
Any questions? Feel free to reach out to us on 
[Twitter](https://www.twitter.com/mycrypto)
 or via 
[email](mailto:support@mycrypto.com)
 .
Thanks for reading! See you on the 16th!



---

- **Kauri original title:** Ethereum Constantinople  Everything You Need To Know
- **Kauri original link:** https://kauri.io/ethereum-constantinople:-everything-you-need-to-k/374b4ffa522d4bf2aea5d3100cfbc1b2/a
- **Kauri original author:** MyCrypto (@mycrypto)
- **Kauri original Publication date:** 2019-02-04
- **Kauri original tags:** cryptocurrency, blockchain, Ethereum
- **Kauri original hash:** QmYQwmaRXfcistKXbstzCCKq2HR6A4LYD1NxmXwCaDgUbN
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



