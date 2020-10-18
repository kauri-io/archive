---
title: Weird quirks we found in Ethereum nodes
summary: At TokenAnalyst we are experts at hosting, running, and extracting valuable information from blockchain nodes. Through our time working with Ethereum, we encountered some interesting quirks that we’d love to share with the broader community. We work with the two top most-used Ethereum clients, namely Geth ( go-ethereum ), built mainly by the Ethereum Foundation , and Parity, built by Parity Technologies . The following quirks have been found by my coworkers Ankit , Sid and myself . If you have a
authors:
  - null (@eca41677558025c76bfd20e9289283cb4ca85f46)
date: 2018-12-20
some_url: 
---

# Weird quirks we found in Ethereum nodes


![](https://api.beta.kauri.io:443/ipfs/QmdDSza1PPqfpKDRkKsMekYCzE8TeFLowEj71LPBCE3nBw)
At TokenAnalyst we are experts at hosting, running, and extracting valuable information from blockchain nodes. Through our time working with Ethereum, we encountered some interesting quirks that we’d love to share with the broader community. We work with the two top most-used Ethereum clients, namely Geth ( 
[go-ethereum](https://github.com/ethereum/go-ethereum)
 ), built mainly by the 
[Ethereum Foundation](https://www.ethereum.org/foundation)
 , and Parity, built by 
[Parity Technologies](https://www.parity.io/)
 .
The following quirks have been found by my coworkers 
[Ankit](https://twitter.com/ankitchiplunkar)
  
[, Sid](https://twitter.com/sidshekhar24)
 and 
[myself](https://twitter.com/madewithtea)
 . If you have any questions regarding the following findings, we would be happy to help. There are not too many people trying to get data from nodes, but if they do, they’ll inevitably encounter these quirks at some point. The following list is anecdotal, for further references links are supplied. The first two points are particularly important to know when you set up your own node.
 * Magnetic hard-drives are not optimal for running nodes; they are just too slow. SSD is a much better option. We started our full nodes on AWS t3.xlarge instances, having EBS storage attached. However, it turned out, that NVMe ( [https://en.wikipedia.org/wiki/NVM_Express](https://en.wikipedia.org/wiki/NVM_Express) ) instance storage in RAID-0 is much more cost-effective, with a 30x improvement on I/O throughput when writing files.
 * When Geth is not in sync with the latest block, the RPC interface is unresponsive, meaning you cannot query for e.g. blocks, transactions, receipts etc. This works in Parity.
 * Even though there is a standard what kind of RPC methods and parameters exist. There are no standard error responses across nodes. Hence, if you want to write software that integrates with different clients you have to parse responses dependent on the client. Ongoing discussions about this point can be found, [here](https://ethereum-magicians.org/t/eip-remote-procedure-call-specification/1537/21) and [here](https://github.com/ethereum/EIPs/pull/1474) .
 * The fields, r, s, v of a transaction are not consistent on different clients. They’re different on Geth, Parity and Infura. ( [https://twitter.com/sidshekhar24/status/1052896205724893184](https://twitter.com/sidshekhar24/status/1052896205724893184) ).
 * Running the latest versions of Geth and Parity on the same AWS t3.xlarge instance types with EBS storage, in the same regions, Geth is more out-of-sync than Parity. This is particularly unfortunate since Geth is unresponsive while syncing. The comparison was pre-1.8.19. After we updated to [1.8.19](https://github.com/ethereum/go-ethereum/releases/tag/v1.8.19) we experienced better performance.
 * The JSON-RPC interface is not type-safe. That means, for data pipelines building on top of this data source, post-processing e.g. validation and typecasting is required. The “standard” on [https://github.com/ethereum/wiki/wiki/JSON-RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) is not very enforcing.
 * For data like internal transactions, state diffs, there is not an RPC standard yet. Geth is not supporting them yet, Parity has implemented them: [https://wiki.parity.io/JSONRPC-trace-module.html](https://wiki.parity.io/JSONRPC-trace-module.html) . The state diff result format is a bit weird, and it’s not fully consistent: [https://github.com/paritytech/parity-ethereum/issues/8937](https://github.com/paritytech/parity-ethereum/issues/8937) .
 * There are two ways of retrieving the latest blocks. Through HTTP polling or a kept alive web socket connection. For both ways block re-organization (a wrong block is forwarded and later discarded) is not correctly implemented on Geth and Parity, see [https://github.com/paritytech/parity-ethereum/issues/9865](https://github.com/paritytech/parity-ethereum/issues/9865) .
 * Multiple smaller differences between the interfaces of Geth and Parity include: Uncle size is null in Parity, but does exist in Geth. Filter IDs on Geth and Parity are different. Geth assigns random IDs, and Parity uses an incremental counter.
 * The consensus rules among clients have to match in order to make Ethereum work, but everything else, e.g. the exposed API, or RPC interface can be totally different. Take each client with a grain of salt.
 
**To sum it up.**
 
Through the process of setting up our infrastructure. We learned that when building fault-tolerant, highly reliable, and mission-critical application on top of Ethereum, it is not enough to rely on the functionality of specific Ethereum clients. An extremely deep understanding of how nodes work, what they need, and how to orchestrate them is required to ensure effectively zero downtime along the whole data pipeline.
 
[TokenAnalyst](https://www.tokenanalyst.io/)
  
_parses and classifies every on-chain transaction (currently from the Ethereum blockchain) with the goal of deriving fundamental insights to understand crypto-assets._
 
<iframe allowfullscreen="" frameborder="0" height="300" scrolling="no" src="https://upscri.be/618d25" width="512"></iframe>