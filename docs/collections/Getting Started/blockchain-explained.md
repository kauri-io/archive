---
title: Blockchain Explained
summary: What is blockchain anyway? In this article, I will try to provide an in-depth yet simple to understand explanation. I will tell you about what is a blockchain, what features it has, which groups of users exist in blockchain network, and how they interact with each other. Note- this article mostly covers public blockchains, and of that public blockchains, it’s mostly about their use for cryptocurrencies. There are other uses of public blockchains, and there are also private blockchains. Private (
authors:
  - Timur Badretdinov (@destiner)
date: 2018-11-29
some_url: 
---

# Blockchain Explained



----


![](https://ipfs.infura.io/ipfs/QmWRdtskZTBhm39uQjaphrQcc4sXdTeUVuZ2s3ZWfdZ42m)

What is blockchain anyway? In this article, I will try to provide an in-depth yet simple to understand explanation. I will tell you about what is a blockchain, what features it has, which groups of users exist in blockchain network, and how they interact with each other.
 
_Note: this article mostly covers public blockchains, and of that public blockchains, it’s mostly about their use for cryptocurrencies. There are other uses of public blockchains, and there are also private blockchains. Private (or permissioned) blockchains have a similar structure, but different functions and mechanics._
 

### Overview
The blockchain is just a bunch of blocks. Each block contains pieces of information. In cryptocurrencies, the information is usually a set of transactions. Each block is connected to the previous one.
To date, the main usage of blockchain is cryptocurrencies. Cryptocurrency is an electronic cash system that runs without a central authority. Cryptocurrencies got adoption because they solved a problem of double-spending — a situation when a dishonest user of a decentralized cash system spends same coins twice. In Bitcoin, Ethereum, and other cryptocurrencies spending the same coins twice is almost impossible.
The blockchain is a method of organizing and storing data. There are other methods, of course, though blockchain has several unique features.

### Features
Why use blockchain? Why not use traditional storage methods, like SQL database or key-value storage? Blockchain provides 2 features that make it a great use for cryptocurrencies: it’s distributed and trustless.
Even if a company uses data replication, it is usually 2–5 copies. In blockchain, the number of copies can be hundreds or thousands. In that way, the blockchain is 
**distributed**
 . The number of copies of Bitcoin ledger is equal to the number of full nodes. To wipe the information about transactions from existence, you need to delete it from each full node around the globe. To stop the blockchain, you can’t just hack the single computer or even a whole country. You need to break computers from different locations, running different operating systems and taking different security measures. Stopping the blockchain by hacking each full node is practically impossible.
In PayPal, you believe that all transactions will complete and you’ll able to withdraw the money from your balance at any moment. In blockchain, you don’t need to trust any corporation. You don’t need to trust any particular user either. Instead, you believe that most of the users will behave honestly. In that sense, the blockchain is a 
**trustless**
 system. One of the features of trustless systems is fair rules for everyone. For example, PayPal is a monopoly in digital money, so it can increase the commission, lock your funds, and delay withdrawals. Basically, it can do everything with your money. In blockchain, no one has the power to make their own rules. Instead, it is driven by the majority and the free market.

### Drawbacks
The blockchain is not a silver bullet, and it has its own drawbacks. Most of them are partially fixable and negligible, though some of them might become a problem.
Note that this is just an overview of possible problems; the list is not exhaustive.

### Sybil Attack
The first problem is a possibility of Sybil Attack. It is a situation where a single person controls few nodes and persuades another user that all these nodes belong to different users. Basically, when succeeded, this attack allows a user to block another user from the network completely. This can result in transaction censoring when the attacker can decide which transactions to show you and which not. An attacker can also block your transactions from the network by not broadcasting them to other users. It can lead to double-spending and can block you from the rest of the network. To protect from Sybil Attack, nodes can limit the outbound connections to one per subnet. Another way to mitigate attack is to look for nodes with suspiciously-low hashrate.

### Denial-of-Service Attack
Another possible problem is a Denial-of-Service (DoS) attack. An attacker can overload a node by sending a lot of data to it. For example, it can send a really big block or transactions with scripts that take too long to execute. Bitcoin and other cryptocurrencies have some protection from DoS attacks. For example, many cryptocurrencies have a maximum possible block size.

### Scalability
Public blockchain systems are hard to scale. Hard means neither easy nor impossible. It is not impossible, because there aren’t any technological barriers to increase the throughput of the network. It is not easy, because just increasing it would make the system more centralized. Increasing the capacity of the blockchain means increasing hardware requirements of running a full node, and that means fewer people want and be able to maintain nodes.
It is a question of whether a blockchain should be hugely scalable in the first place. First, blockchain is not a silver bullet — no need to use it for everything, even if it’s related to money and finance. Second, blockchain can be scaled by off-chain solutions. For example, Bitcoin throughput can be increased via Lightning Network.

### Block content
Each block is made of two parts: header and data.
Block header is a metadata. Usually, it contains such information as block number, timestamp (the record of when the block was created), block hash, and nonce.

![](https://ipfs.infura.io/ipfs/QmcM7hwg6HU9kzB3LgCXzdSAMqZQKegksTfBqSkHRAgz9Y)

Block data is a payload. It is the useful information that we need to store. The data usually contains multiple pieces of information that share the same structure. In Bitcoin, each block contains about a hundred of such pieces. Each piece is a transaction. To simplify, each transaction is sender address, recipient address, amount of transaction, and fee. In Ethereum, each transaction also contains “input data” field, which is used to pass data to smart contracts.

![](https://ipfs.infura.io/ipfs/QmPLLGmY7T75rjGGHvbSEr71ZBE2xUqdDCGy3tnmdeLXtZ)


### Genesis block
Genesis block is the block number zero, the first block that is ever created in the blockchain. Genesis block is the same block as others, except it doesn’t have a link to the previous block.
Genesis block in Bitcoin: 
[Bitcoin Block #0](https://blockchain.info/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f)
 .

![](https://ipfs.infura.io/ipfs/QmVfrPPnqYxzJahKTtmrfrDBoHWgpFTWfdEkwYHP6EtLxp)


### Block generation
The only way to add new information to the blockchain is to add a block to the end of it.
The amount of added information is usually limited by software, otherwise, it may become bloated, and impossible for most of the users to keep the whole history of the blockchain. The general idea is to add new blocks in equal periods of time. Qualified users create blocks and send them to other network participants. If the block is valid, other users accept it. If it’s invalid, they ignore it and may punish block creator. The valid block propagates through the network in a few seconds.

### Proof-of-Work
In proof-of-work (PoW) systems, adding new block is usually called “ 
**mining**
 ”. Each miner independently tries to find a valid hash with the desired difficulty. This difficulty is automatically defined by software to control the number of new blocks. The first miner who finds the correct hash becomes the creator of a new block.
As more and more miners join the network, the total hash rate — the combined computing power of all miners — increases. If there would be no constraints, miners would find hashes, and therefore blocks, more and more often. But most of the coins seek constant rate of finding new blocks, so they change a difficulty of mining based on the hash rate.
The difficulty tells users how many hashes miners should find to get a correct one. The higher the difficulty, the more hashes is required. The difficulty increases when the hash rate increases. In that way, mining difficulty counterbalances ever-increasing computing power of miners. The difficulty of the network is rebalanced based on how often new blocks are mined in past. In can readjust after each block or after several blocks. In Bitcoin, for example, the difficulty readjusts every 2016 blocks, which takes about 2 weeks.

### Proof-of-Stake
In proof-of-stake (PoS), block producers are selected based on how many coins they have. This selection can be made randomly or by choosing those who get the most votes. The more coins you have, the higher the probability that you’ll be selected as the next producer or the bigger voting power you have. Selected producers then make blocks in specified time.
To stop nodes from voting on wrong blocks, a punishment can be introduced. One way is to punish those nodes who vote on multiple blocks in the same round. Another way is to punish those nodes who voted for the unpopular choice, assuming that block that got few votes is incorrect.
The process of staking can be delegated to other nodes. For example, if a user has a large number of coins, but he doesn’t want to or can’t vote regularly, he can delegate staking to another user. That user will have the voting power combined with the coins of the other user. After earning a profit, the delegate can then share part of his earnings. The whole process of delegation and sharing profits can be done automatically.

### Hashing
The hash is like a footprint of a digital file. Different files produce different hashes, and equal files produce equal hashes. You can easily find a hash of each file, but it’s very hard to find the original file by its hash. Moreover, slightly different files produce very different hashes, so you can’t tell how different are two files based on their hashes.
In blockchain, each block contains the hash of the previous block. That way, if some block will be changed even slightly, its hash will also change, and the hash of all subsequent blocks will change too.
The hash of each transaction is based on the previous hash and the block data. It can also contain a timestamp. If blocks are created by mining, network difficulty and nonce are also included in the hash.

### Immutability
Immutability means that something can’t be changed. When people say that blockchain is immutable, they mean that changing old blocks is impractical. If you change a transaction, the hash of this transaction will also change, which in turn will change the hash of the Merkle root, and that will change block’s hash. As each block keeps the hash of the previous block, all blocks that come after changed block will also become invalid.
Imagine an attacker wants to change a transaction that was made 1 hour ago. The attacker will need to mine all blocks from the one that was changed to the latest one. Moreover, he will also need to mine all future blocks that will be created while he mines previous blocks.
It is indeed possible to change even the earliest blocks, but it would require controlling more than a half of total mining power, hence the meaning of 51% attack. In general, the older the block, the less probable that an attacker will successfully change it. Merchants often wait for 6 blocks to ensure that they will get the money, hence the 6 confirmations rule.

### Nodes
Nodes are computers that read and write to the blockchain. Different types of nodes have different roles and abilities.

### Mining node
Mining nodes are nodes that produce blocks. They usually have huge computing resources. Miners usually don’t validate the blocks, as they don’t store the blockchain. To make new blocks, all they need is a set of recent transactions and a hash of the last block.

### Full node
Full nodes are the nodes that store the entire copy of the blockchain. They validate the blocks that they receive, and propagate validated blocks to the network. They can also send their own transactions to the pool.

### Light node
Light nodes don’t store the whole blockchain. They usually store block headers and a very small set of transactions. Light nodes can’t validate blocks and need to trust full nodes. Light nodes, however, can connect to other nodes, receive new blocks, and send the transactions.

### Web “node”
Web nodes are not nodes at all. They are wallets that connect to the centralized servers. They don’t store any parts of the blockchain. Web wallets can’t connect to other nodes, receive blocks, or send the transactions. They can only ask a server to do that and expect that the server will provide correct information. They trust entirely to the server that they are connected to. Mobile wallets that don’t store blockchain data also belong there.

![](https://ipfs.infura.io/ipfs/QmNMqRhHk3JyXgHvNtgrFwK8PAhL2yd2YQWhbfXEFmnTwW)


### Network
In decentralized systems, nodes come and go. There isn’t any guarantee that some particular node will be online today or tomorrow. That fact heavily affects the methods of connecting to and interacting with nodes.

### Peer discovery
Peer discovery is a process of getting to know other network participants. When a user launches a node for the first time, it doesn’t have a track of peers to connect. To interact with the network, it should find peers and keep them in memory.
There are several methods of discovering other peers, including hardcoded addresses, user input, DNS lookup, and others.
The most primitive way is to connect to the addresses that are hardcoded in the wallet program. These addresses represent nodes that were initially set up by developers to grow the network in the first few days or weeks. While this is a simple method, it is usually not very spread in mature networks. For example, 
**hardcoded addresses**
 in Bitcoin is used only as a last resort, when other methods don’t work.
Users can also 
**manually**
 provide the list of nodes they got elsewhere. A user can either write them into a text file, provide as command-line arguments, or enter them via the graphic user interface.
Another method to discover peers is a 
**DNS lookup**
 . There are DNS servers that keep lists of nodes. These lists are updated by maintainers of these servers. Usually, there are several DNS servers so if one of the servers go down others will still be serving.
Once a node found at least one peer, he can connect it. If the connection is successful, they can 
**exchange**
 information about peers that they collected.
When discovered, node addresses are stored in a database to get them on the next computer launch. Nodes with newer client software version are preferred. Addresses of old, inactive nodes are removed.

### Blockchain download
Once a node is connected to other peers, it can start to download a blockchain block by block.
The first way to do that is to simply let the node to download the blocks from other peers. It can be slow because it depends not only on your Internet connection speed but also on how broad the bandwidth of the peers is. But it is a decentralized method, meaning that it doesn’t depend on a single site or server.
Another way to download blockchain data is to download it from some external source on the Internet. It can be some random website, torrent file, or an archive sent to you by your friend. That might be faster than downloading it via p2p-connection, but it is also centralized and requires to trust the source that you download it from. Not only that, many links that once led to the blockchain archive might be dead by now.
Whatever method the blockchain is downloaded, it should be validated, and that might take even longer time. The computer should validate each block from the genesis one. The validation process includes checking proof-of-work, ensuring that all transactions in a block are correct, checking that Merkle Tree root calculated correctly, etc. While the speed of downloading depends on bandwidth, the validation relies on the CPU power.
Sometimes, it is possible to skip the process of the validation of the whole blockchain and just check those blocks that contain wallet transaction, i. e. transactions sent to or from the selected wallet. The availability of such light validation depends on the wallet software that you use.

### Sending a transaction
When it comes to spreading new transactions and blocks, cryptocurrencies usually use something called 
**Gossip protocol**
 . It’s like many people spreading the gossip until everyone knows it.
It starts with a node making a transaction to send money. After the transaction is signed, the node sends it to the neighbor nodes.
When these nodes receive the transaction, they will check it. If the transaction is properly structured (has the correct format, has a signature, etc) and is not a double spend, they will, in turn, send it to their peers.
Of course, a node might already have the transaction when its peer is trying to send it. Because of that, the nodes first send the hash of the transaction. If the receiving node has the transaction with that hash, it will not download it again. If the receiving node doesn’t have the transaction, it will download it and send it further.
Eventually, all connected nodes, including miners, will receive the transaction.

![](https://ipfs.infura.io/ipfs/QmR2vq4RYzdkDsgcdwFUob8XyT4DcFeHLSqpuMQoccMcXM)


### Block propagation
Miners and mining pools that actively make blocks collect all incoming transactions. It is economically viable for them to include as many transactions as possible in the next block because they will receive all transaction fees.
After a miner or a mining pool found correct hash, he will send the block to his peers. After that, the process is the same as sending a transaction. Nodes that received the new block send it to their peers, and after some time, everyone has the block.
In case of PoS systems, the process is almost the same. When it is time for a block producer to make a block, he collects all transactions, puts them into his block, and sends the block to the peers.

### Achieving consensus
To work properly, a decentralized system like a cryptocurrency should constantly try to achieve a consensus. This basically means that each node should have the same set of blocks and transactions, which are stored in the same order.
Most of the time, the consensus will be achieved without any problems. The correct transactions and blocks will spread, and incorrect ones will die off.
However, it is possible that at some stage, two blocks will point to the same parent block. In other words, the chain will be forked in two chains. 
**Forks**
 can happen both in PoW and PoS systems. In proof-of-work chains, two miners can find a hash at the same time, and both will refer to the same block, the one that was mined before. In proof-of-stake, a block producer can pick an older, not the last block as its parent.
To resolve a fork, the whole network should agree on which fork will become the main one and which will die. The rule of thumb is “the longest chain wins”. In PoS chain, that simply means that eventually, one fork will be longer than other, by at least one block, and all honest nodes and block producers will work on that fork, and drop the other one. In PoW chain, the “longest” usually means “more proof-of-work done”, so the fork that wins is not the one that has the biggest block number, but the one that more miners work on.

### Dealing with attacks
But how to achieve consensus when there are fraudulent nodes try to overwrite the history or censor the network? There are three possible scenarios.
First, an attacker doesn’t have a majority. The majority is either in mining rig (PoW) or coins (PoS). In that case, his possibilities are quite limited. He can try to conduct a 51% attack but has a high chance of failure. He is also risking wasting money on electricity, mining computers, or getting a stake by buying coins.
Second, an attacker controls a majority. In that situation, he can pretty much control the network. However, even if some authority will control the network, it will likely to lose money. The beauty of cryptocurrencies is that they were built with game theory principles in mind. In cryptocurrencies, having power always means having something at stake. It can be GPUs, ASICs, staked coins, or something else. The attack will likely harm many network participants, and it will affect the price. Mining rigs and staked coins owned by the attacker will lose in value if will be valuable at all.
It may be dangerous for someone to control the majority of power without even trying to make an attack. If the fact will become known, it will spread quickly and likely affect the price.
Third, a majority of nodes behaves badly. In fact, the majority doesn’t even need to be coordinated by some person. Simply by behaving wrong, they would be unlikely to make a double spend, but they can stop the network. This is the very unlikely event, as the majority usually obey laws, though it is possible in theory. As in the second scenario, the misbehaving majority will likely be punished by market forces.



---

- **Kauri original link:** https://kauri.io/blockchain-explained/d55684513211466da7f8cc03987607d5/a
- **Kauri original author:** Timur Badretdinov (@destiner)
- **Kauri original Publication date:** 2018-11-29
- **Kauri original tags:** none
- **Kauri original hash:** QmWBJJJt641GFFPif6umEnYPSWgQR2qn24PnMNb2E4AjYt
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



