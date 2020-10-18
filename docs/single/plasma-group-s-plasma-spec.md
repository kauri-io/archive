---
title: Plasma Group’s Plasma Spec
summary: TLDR- We created a spec for a Plasma Cash variant and implemented it in Node.js and Vyper. This document covers the design specification, providing references to the implementation along the way. Our code supports deploying a new chain to testnet, an on-chain registry of other plasma chains and their block explorers, and transacting via a command-line wallet. Introduction The vision of a network of blockchains as a scalability solution has been spreading rapidly. A multi-chain approach for paral
authors:
  - Plasma Group (@plasma)
date: 2019-04-22
some_url: 
---

# Plasma Group’s Plasma Spec


 
_TLDR: We created a spec for a Plasma Cash variant and implemented it in Node.js and Vyper. This document covers the design specification, providing references to the implementation along the way. Our code supports deploying a new chain to testnet, an on-chain registry of other plasma chains and their block explorers, and transacting via a command-line wallet._
 

### Introduction
The vision of a network of blockchains as a scalability solution has been spreading rapidly. A multi-chain approach for parallelizing transactions is a promising way to increasing throughput… unfortunately, it also imposes significant challenges:



 * We don’t want to divide security, e.g. 100 chains with 1% of total security each.

 * Advanced solutions like sharding are promising, but not yet ready.
We need a solution to scalability that:



 * Provides similar levels of security to the Ethereum mainnet, without paying millions of dollars in mining fees.

 *  **Can be implemented on Ethereum as it exists today.** 
We believe that the strongest candidate to meet these criteria is a network of chains, each secured to mainnet via the Plasma framework.
Plasma is a family of protocols which allow individuals to easily deploy high-throughput, secure blockchains. A smart contract on Ethereum’s main chain can ensure that users’ funds are secure, even if the “plasma chain” acts fully maliciously. This eliminates the need for a trusted pegging mechanism like that of sidechains. Plasma chains are non-custodial, allowing the prioritization of scalability without sacrificing security.
We envision a future with many Plasma chains, giving users choice over where they transact. So, along with releasing our plasma chain implementation, we have created a 
`PlasmaRegistry.vy`
 . The registry allows new chains to join the network by listing their IP/DNS address, a custom “name” string, and their contract address. The registry contract does the verifies trusted deployment, so users can be assured that any contract on that registry is safe to deposit into — 
_even if its operator is malicious_
 .

### Properties of our Plasma Chain Implementation
This post specifies Plasma Group’s current protocol and implementation, which draws from recent developments within the research community.
 
**Our specification has the following properties:**
 



 * Single transactions over large ranges of coins, solving the [“fixed-denomination” problem](https://ethresear.ch/t/plasma-cash-was-a-transaction-format/4261) in Plasma Cash.

 * Block size which scales with the number of transactions, not the number of deposits.

 * Light client proofs which scale in the logarithm of the block size and linear in blocks since deposit, making the operator the system’s only (computational) bottleneck.

 * A simplified, optimistic exit procedure that allows exits to specify only the most recent transaction, instead of [both a transaction and its parent](https://ethresear.ch/t/plasma-cash-plasma-with-much-less-per-user-data-checking/1298) .

 * Interchain atomic swaps, which lay the groundwork for decentralized exchange protocols.

 * Unlimited deposit capacity.
 
**Our implementation follows the above specification, providing the following:**
 



 * A command line [plasma chain operator](https://github.com/plasma-group/plasma-chain-operator) written in Javascript.

 * A [plasma client implementation](https://github.com/plasma-group/plasma-core) written in Javascript with a command-line wallet.

 * A [smart contract](https://github.com/plasma-group/plasma-contracts) supporting ETH and ERC20 tokens written in Vyper.

 * An integrated JSON RPC which allows clients to download and verify [light client proofs](https://github.com/plasma-group/plasma-node) and transact.

 * A [block explorer](https://github.com/plasma-group/plasma-explorer) hosted by the plasma operator.

 * A [simulated client swarm](https://github.com/plasma-group/plasma-chain-operator) which generates transactions to load test.

 * A Plasma “registry” contract which lists a set of verified-as-safe contracts and operator IP addresses for users to explore.
If you’re interested in checking out the protocol and the code implementation, you’ve come to the right place!
 
**However, a few disclaimers before we dig in:**
 



 * Our plasma implementation is beta software currently only suitable for testnet use. **There are surely critical bugs at this time.** 

 * The main difference (explained below!) between this protocol and other Plasma implementations is the block structure: a Merkle _sum_ tree. This has significant benefits, but adds complexity. Plasma is already complex in comparison to sidechains.

 * Code has yet to be audited or formally verified, and has not undergone any optimization.

 * While the operator is the only _computational_ bottleneck, the primary performance limit today remains bandwidth. Custody proofs require downloads which are linear in the number of blocks. Our code is an improvement per block, but still linear. This [active](https://ethresear.ch/t/rsa-accumulators-for-plasma-cash-history-reduction/3739)  [area](https://ethresear.ch/t/log-coins-sized-proofs-of-inclusion-and-exclusion-for-rsa-accumulators/3839/7) of [research](https://ethresear.ch/t/plasma-prime-design-proposal/4222) is yet unready for implementation.

 * Though our safety mechanisms and exit games are both implemented and tested, we have not yet built an automated guard service, meaning challenges and responses must be manually constructed.
With that out of the way, let’s jump in! The rest of this post will take comprehensive dive into our spec, where the code lives, and what it does.

### Table of Contents



 *  [General Definitions and Data Structures](https://medium.com/p/9d98d0f2fccf#4d91) a. [Coin ID Assignment](https://medium.com/p/9d98d0f2fccf#3d22) b. [Denominations](https://medium.com/p/9d98d0f2fccf#db53) 

 *  [Transactions over ranges of coins](https://medium.com/p/9d98d0f2fccf#2bda) a. [Transfers](https://medium.com/p/9d98d0f2fccf#b6ad) b. [Typed and Untyped Bounds](https://medium.com/p/9d98d0f2fccf#ae5f) c. [Multisends and Transfer/Transaction Atomicity](https://medium.com/p/9d98d0f2fccf#012f) d. [Serialization](https://medium.com/p/9d98d0f2fccf#6f99) 

 *  [Block Structure Specification](https://medium.com/p/9d98d0f2fccf#d8b0) a. [Sum Tree Node Specification](https://medium.com/p/9d98d0f2fccf#ac79) b. [Parent Calculation](https://medium.com/p/9d98d0f2fccf#6122) c. [Calculating a Branch’s Range](https://medium.com/p/9d98d0f2fccf#6b7b) d. [Parsing Transfers as Leaves](https://medium.com/p/9d98d0f2fccf#c8c9) e. [Branch Validity and Implicit NoTx](https://medium.com/p/9d98d0f2fccf#54db) f. [Atomic Multisends](https://medium.com/p/9d98d0f2fccf#762f) 

 *  [Proof Structure and Checking](https://medium.com/p/9d98d0f2fccf#8c86) a. [Proof Format](https://medium.com/p/9d98d0f2fccf#e963) b. [Transaction Proofs](https://medium.com/p/9d98d0f2fccf#b697) c. [Transfer Proofs](https://medium.com/p/9d98d0f2fccf#f3a8) d. [Proof Steps](https://medium.com/p/9d98d0f2fccf#eb52) e. [Snapshot Objects](https://medium.com/p/9d98d0f2fccf#9862) f. [Deposit records](https://medium.com/p/9d98d0f2fccf#8056) g. [TransactionProof Validity](https://medium.com/p/9d98d0f2fccf#239c) 

 *  [Contract and Exit Games](https://medium.com/p/9d98d0f2fccf#6eff) a. [Keeping track of deposits and exits](https://medium.com/p/9d98d0f2fccf#3b74) b. [Exit games’ relationship to vanilla Plasma Cash](https://medium.com/p/9d98d0f2fccf#bb29) c. [Blocknumber-specified transactions](https://medium.com/p/9d98d0f2fccf#a4d4) d. [Per-coin transaction validity](https://medium.com/p/9d98d0f2fccf#a8f0) e. [How the contract handles transaction checking](https://medium.com/p/9d98d0f2fccf#600f) f. [Challenges which immediately cancel exits](https://medium.com/p/9d98d0f2fccf#20c2) g. [Optimistic exits and inclusion challenges](https://medium.com/p/9d98d0f2fccf#8de1) h. [Invalid History Challenges](https://medium.com/p/9d98d0f2fccf#eb3a) 

 *  [The Future](https://medium.com/p/9d98d0f2fccf#2078) a. [Missing pieces in implementation](https://medium.com/p/9d98d0f2fccf#487d) b. [Missing pieces in the spec](https://medium.com/p/9d98d0f2fccf#c7f3) 

### Repos & Architecture
 
[Our Github](https://github.com/plasma-group/)
 offers all of our implementations under the MIT License:



 *  `plasma-chain-operator` : spin up your own plasma chain and deploy to testnet.

 *  `plasma-core` : Core plasma client functionality —portable meat of the logic.

 *  `plasma-node` : Node.js wrapper for `plasma-core` implementing a CLI

 *  `plasma-js-lib` : JS helper for building web applications integrating plasma transactions.

 *  `plasma-contracts` : The `PlasmaChain.vy` and `PlasmaRegistry.vy` Vyper contracts.

 *  `plasma-explorer` : A block explorer hosted by the operator.

 *  `plasma-utils` : Shared utilities for building on our plasma spec.

 *  `plasma` : Integration testing for the above components.
Here’s the architecture that 
`plasma-core`
 implements:

![](https://api.kauri.io:443/ipfs/QmVKbwL35B1Pc1d5tABZTSygmFsgkFRaqcd8xjAMmg4mUj)

Here’s the architecture that 
`plasma-chain-operator`
 implements:

![](https://api.kauri.io:443/ipfs/QmWsoXsxmebL4DvM9q5vWq4bG4fyMpUzpdoEjSXza6nZQJ)


### 1. General Definitions and Data Structures
This section will cover terminology and intuitions for the protocol’s components. These data structures are encoded and decoded by 
`plasma-utils`
 ’ library 
`serialization`
 . The exact byte-per-byte binary representations of all data structures for each structure can be found in 
[schemas](https://github.com/plasma-group/plasma-utils/tree/master/src/serialization/schemas)
 .

#### Coin ID Assignment
The base unit of any plasma asset is represented as a coin. Like in standard Plasma Cash, these coins are non-fungible, and we call the index of a coin its 
`coinID`
 , which is 16 bytes. They are assigned in order of deposit on a per-asset (ERC 20/ETH) basis. Notably, all assets in the chain share the same ID-space, even if they are different ERC20s or ETH. This means that transactions across all asset classes (which we refer to as the 
`tokenType`
 or 
`token`
 ) share the same tree, providing maximum compression.
We achieve this by having the first 4 bytes refer to the 
`tokenType`
 of a coin, and the next 12 represent all possible coins of that specific 
`tokenType`
 .
For example: the 0th 
`tokenType`
 is always 
`ETH`
 , so the first 
`ETH`
 deposit will give spending rights for coin 
`0x00000000000000000000000000000000`
 to the depositer.
The total coins received per deposit is precisely 
`(amount of token deposited)/(minimum token denomination)`
 many.
For example: let’s say that 
`tokenType`
 1 is 
`DAI`
 , the coin denomination is 
`0.1 DAI`
 , and the first depositer sends 
`0.5 DAI`
 . That means its 
`tokenType == 1`
 , so the first depositer will recieve the 
`coinID`
 s from 
`0x00000001000000000000000000000000`
 up to and including coin 
`0x00000001000000000000000000000004`
 .

![](https://api.kauri.io:443/ipfs/QmZFEWnCuXykXdbyqSE1zcjuDAhXa74Dh96k7DyQzZho5h)


#### Denominations
In practice, denominations will be much lower than 
`0.1`
 . Instead of storing denominations directly in the contract, it stores a 
`decimalOffset`
 mapping for each 
`tokenType`
 which represents the shift in decimal places between the amount of deposited 
`ERC20`
 (or 
`wei`
 for ETH) and the number of received plasma coins. These calculations can be found in the 
`depositERC20`
 , 
`depositETH`
 , and 
`finalizeExit`
 functions in the 
[smart contract](https://github.com/plasma-group/plasma-contracts/blob/master/contracts/PlasmaChain.vy)
 
 
_//Note:_
  
`decimalOfset`
  
_s are hardcoded to 0 for this release, as we lack support in the client/operator code._
 

### 2. Transactions over ranges of coins

#### Transfers
A transaction consists of a specified 
`block`
 number and an array of 
`Transfer`
 objects, which describe the details of each range of the transaction. From the 
[schema](https://github.com/plasma-group/plasma-utils/blob/master/src/serialization/schemas/transfer.js)
 in 
`plasma-utils`
 ( 
`length`
 s in bytes):

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/ben-chain/2c3818f78846289a15be1aa175f35ca5.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
...
const TransferSchema = new Schema({
 sender: {
   type: Address,
   required: true
 },
 recipient: {
   type: Address,
   required: true
 },
 token: {
   type: Number,
   length: 4,
   required: true
 },
 start: {
   type: Number,
   length: 12,
   required: true
 },
 end: {
   type: Number,
   length: 12,
   required: true
 }
...

```


We can see that each 
`Transfer`
 in a 
`Transaction`
 specifies a 
`tokenType`
 , 
`start`
 , 
`end`
 , 
`sender`
 , and 
`recipient`
 .

#### Typed and Untyped Bounds
One thing to note above is that the 
`start`
 and 
`end`
 values are not 16 bytes, as 
`coinID`
 s are, but rather 12. This should make sense in the context of the above sections on deposits. To get the actual 
`coinID`
 s described by the transfer, we concatenate the 
`token`
 field’s 4 bytes to the left of 
`start`
 and 
`end`
 . We generally refer to the 12-byte versions as a 
`transfer`
 ’s 
`untypedStart`
 and 
`untypedEnd`
 , with the concatenated version being called 
`typedStart`
 and 
`typedEnd`
 . These values are 
[also exposed by the serializer](https://github.com/plasma-group/plasma-utils/blob/master/src/serialization/models/transfer.js)
 .
Another note: in any transfer the corresponding 
`coinID`
 s are defined with 
`start`
 inclusive and 
`end`
 exclusive. That is, the exact 
`coinID`
 s transferred are 
`[typedStart, typedEnd)`
 . For example, the first 100 ETH coins can be sent with a 
`Transfer`
 with 
`transfer.token = 0`
 , 
`transfer.start = 0`
 , and 
`transfer.end = 100`
 . The second 100 would have 
`transfer.start = 100`
 and 
`transfer.end = 200`
 .

#### Multisends and Transfer/Transaction Atomicity
The 
`Transaction`
 schema consists of a 4-byte 
`block`
 number (the transaction is only valid if included in that particular plasma block), and an 
_array_
 of 
`Transfer`
 objects. This means that a transaction can describe several transfers, which are either all atomically executed or not depending on the 
_entire transaction’s_
 inclusion and validity. This will form the basis for both decentralized exchange and 
[defragmentation](https://ethresear.ch/t/plasma-cash-defragmentation-take-3/3737)
 in later releases.

#### Serialization
As exemplified above, 
`plasma-utils`
 implements a custom serialization library for data structures. Both the JSON RPC and the smart contract use the byte arrays as encoded by the serializer.
The encoding is quite simple, being the concatenation of each value fixed to the number of bytes defined by the schema.
For encoding which involve variable-sized arrays, such as 
`Transaction`
 objects which contain 1 or more 
`Transfer`
 s, a single byte precedes for the number of elements. Tests for the serialization library can be found 
[here](https://github.com/plasma-group/plasma-utils/blob/master/test/serialization/test-serialization.js)
 .
Currently, we have schemas for the following objects:



 *  `Transfer` 

 *  `UnsignedTransaction` 

 *  `Signature` 

 *  `SignedTransaction` 

 *  `TransferProof` 

 *  `TransactionProof` 

### 3. Block Structure Specification
One of the most important improvements Plasma Cash introduced was “light proofs.” Previously, plasma constructions required that users download the entire plasma chain to ensure safety of their funds. With Plasma Cash, they only have to download the branches of a Merkle tree relevant to their own funds.
This was accomplished by introducing a 
_new transaction validity condition_
 : transactions of a particular 
`coinID`
 are only valid at the 
`coinID`
 th leaf in the Merkle tree. Thus, it is sufficient to download just that branch to be confident no 
_valid_
 transaction exists for that coin. The problem with this scheme is that transactions are “stuck” at this denomination: if you want to transact multiple coins, you need multiple transactions, one at each leaf.
Unfortunately, if we put the range-based transactions into branches of a regular Merkle tree, light proofs would become insecure. This is because having one branch does not guarantee that others don’t intersect:

![](https://api.kauri.io:443/ipfs/QmUrLWkfu1au3ksPpN1U2nzbhH2eMEnf8Mj8LUgg3W921h)

With a regular Merkle tree, the 
_only_
 way to guarantee no other branches intersect is to download them 
_all_
 and check. But that’s no longer a light proof!
At the heart of our plasma implementation is a 
_new block structure_
 , and an accompanying 
_new transaction validity condition_
 , which allows us to get light proofs for range-based transactions. The block structure is called a Merkle 
_sum_
 tree, where next to each hash is a 
`sum`
 value.
The new validity condition uses the 
`sum`
 values for a particular branch to compute a a 
`start`
 and 
`end`
 range. This calculation is specially crafted so that it is 
**impossible**
  
**for two branches’ computed ranges to overlap.**
 A 
`transfer`
 is only valid if its own range is within that range, so this gets us back our light clients!
This section will specify the exact spec of the sum tree, what the range calculation actually is, and how we actually construct a tree which satisfies the range calculation. For a more detailed background and motivation on the research which led us to this spec, feel free check out 
[this](https://ethresear.ch/t/plasma-cash-was-a-transaction-format/4261)
 post.
We have written two implementations of the plasma Merkle sum tree: one done in a 
[database](https://github.com/plasma-group/plasma-operator/blob/master/src/block-manager/leveldb-sum-tree.js)
 for the operator, and another in-memory for testing 
[in](https://github.com/plasma-group/plasma-utils/tree/master/src/sum-tree)
  
`plasma-utils`
 .

#### Sum Tree Node Specification
Each node in the Merkle sum tree is 48 bytes, as follows:  
  
`[32 byte hash][16 byte sum]`
   
 It’s not a coincidence that the 
`sum`
 ’s 16 bytes length is the same as a 
`coinID`
 !
We have two helper properties, 
`.hash`
 and 
`.sum`
 , which pull out these two parts. For example, for some 
`node = 0x1b2e79791f28c27ed669f257397e1deb3e522cf1f27024c161b619d276a25315ffffffffffffffffffffffffffffffff`
 , we have  
  
`node.hash == 0x1b2e79791f28c27ed669f257397e1deb3e522cf1f27024c161b619d276a25315`
 and 
`node.sum == 0xffffffffffffffffffffffffffffffff`
 .

#### Parent Calculation
In a regular Merkle tree, we construct a binary tree of hash nodes, up to a single root node. Specifying the sum tree format is a simple matter of defining the 
`parent(left, right)`
 calculation function which accepts the two siblings as arguments. For example, a regular Merkle sum tree has:  
  
`parent = function (left, right) { return Sha3(left.concat(right)) }`
 Where 
`Sha3`
 is the hash function and 
`concat`
 appends the two values together.
To create a Merkle 
_sum_
 tree, the 
`parent`
 function must also concatenate the result of an addition operation on its children’s own 
`.sum`
 values:

```
parent = function (left, right) { 
 return Sha3(left.concat(right)).concat(left.sum + right.sum) 
}
```


For example, we might have

```
parent(0xabc…0001, 0xdef…0002) ===
hash(0xabc…0001.concat(0xdef…0002)).concat(0001 + 0002) ===
0x123…0003
```


Note that the 
`parent.hash`
 is a commitment to each 
`sibling.sum`
 as well as the hashes: we hash the full 96 bytes of both.

#### Calculating a Branch’s Range
The reason we use a Merkle sum tree is because it allows us to calculate a specific range which a branch describes, and be 100% confident that no other valid, overlapping branches exist.
We calculate this range by adding up a 
`leftSum`
 and 
`rightSum`
 going up the branch. Initializing both to 0, at each parent calculation, if the inclusion proof specifies a sibling to the right, we take 
`rightSum += right.sum`
 , and if to the left, we add 
`leftSum += left.sum`
 .
Then, the range the branch describes is 
`[leftSum, root.sum — rightSum)`
 . See the following example:

![](https://api.kauri.io:443/ipfs/QmWJbC7gN1wjfxHVDFVhMx5GsCb1hNztJ9deNgTq9vZPsD)

In this example, branch 6’s valid range is 
`[21+3, 36–5) == [24, 31)`
 . Notice that 
`31–24=7`
 , which is the sum value for leaf 6! Similarly, branch 5’s valid range is 
`[21, 36-(7+5)) == [21, 24)`
 . Notice that its end is the same as branch 6’s start!
If you play around with it, you’ll see that it’s impossible to construct a Merkle sum tree with two different branches covering the same range. At some level of the tree, the sum would have to be broken! Go ahead, try to “trick” leaf 5 or 6 by making another branch that intersects the range (4.5,6). Filling in only the 
`?`
 s in grey boxes:

![](https://api.kauri.io:443/ipfs/QmQ79WU9kjp4D6S3iDJ8qpfDo4SB5ab7gXvknTsqMsvwCx)

You’ll see it’s always impossible at some level of the tree:

![](https://api.kauri.io:443/ipfs/Qma8vbEY42btUsVPvaoHPBUsKYKJpzhZ2co7H7MXfLC5dX)

This is how we get light clients. We call the branch range bounds the 
`implicitStart`
 and 
`implicitEnd`
 , because they are calculated “implicitly” from the inclusion proof. We have a branch checker implemented in 
`plasma-utils`
 via 
`calculateRootAndBounds()`
 for testing and client-side proof checking:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/ben-chain/33e276589d41ed47919aed70b3c0ded5.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
(...)
let leftSum = new BigNum(0)
let rightSum = new BigNum(0)
for (let i = 0; i &lt; inclusionProof.length; i++) {
  let encodedSibling = inclusionProof[i]
  (...)
  if (path[i] === '0') {
    computedNode = PlasmaMerkleSumTree.parent(computedNode, sibling)
    rightSum = rightSum.add(sibling.sum)
  } else {
    computedNode = PlasmaMerkleSumTree.parent(sibling, computedNode)
    leftSum = leftSum.add(sibling.sum)
  }
}
(...)

```


as well as in Vyper for the smart contract via

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/ben-chain/0806a9b45835a319a3e22070a75852bd.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
def checkTransferProofAndGetTypedBounds(
    leafHash: bytes32,
    blockNum: uint256,
    transferProof: bytes[1749]
) -&gt; (uint256, uint256): # typedimplicitstart, typedimplicitEnd
    parsedSum: bytes[16] = Serializer(self.serializer).decodeParsedSumBytes(transferProof)
    numProofNodes: int128 = Serializer(self.serializer).decodeNumInclusionProofNodesFromTRProof(transferProof)
    leafIndex: int128 = Serializer(self.serializer).decodeLeafIndex(transferProof)

    computedNode: bytes[48] = concat(leafHash, parsedSum)
    totalSum: uint256 = convert(parsedSum, uint256)
    leftSum: uint256 = 0
    rightSum: uint256 = 0
    pathIndex: int128 = leafIndex
    
    for nodeIndex in range(MAX_TREE_DEPTH):
        if nodeIndex == numProofNodes:
            break
        proofNode: bytes[48] = Serializer(self.serializer).decodeIthInclusionProofNode(nodeIndex, transferProof)
        siblingSum: uint256 = convert(slice(proofNode, start=32, len=16), uint256)
        totalSum += siblingSum
        hashed: bytes32
        if pathIndex % 2 == 0:
            hashed = sha3(concat(computedNode, proofNode))
            rightSum += siblingSum
        else:
            hashed = sha3(concat(proofNode, computedNode))
            leftSum += siblingSum
        totalSumAsBytes: bytes[16] = slice( #This is all a silly trick since vyper won't directly convert numbers to bytes[]...classic :P
            concat(EMPTY_BYTES32, convert(totalSum, bytes32)),
            start=48,
            len=16
        )
        computedNode = concat(hashed, totalSumAsBytes)
        pathIndex /= 2
    rootHash: bytes[32] = slice(computedNode, start=0, len=32)
    rootSum: uint256 = convert(slice(computedNode, start=32, len=16), uint256)
    assert convert(rootHash, bytes32) == self.blockHashes[blockNum]
    return (leftSum, rootSum - rightSum)

```


Note that the ranges are 
_typed_
 starts and ends, the full 16 bytes.

#### Parsing Transfers as Leaves
In a regular Merkle tree, we construct the bottom layer of nodes by hashing the “leaves”:

![](https://api.kauri.io:443/ipfs/QmSrhxrYuhvGHX3yqgVxTKWTA8pB152XtVLAVBDCWFxLeK)

In our case, we want the leaves to be the transactions. So, the hashing is straightforward, but we still need a 
`.sum`
 value for the tree’s bottom level.
Given some 
`txA`
 with a single 
`transferA`
 , what should the sum value be? It turns out, 
_not_
 just 
`transferA.end — transferA.start`
 . The reason for this is that it screws up branches’ ranges if the transfers are not touching. We need to “pad” the sum values to account for this gap, or the 
`root.sum`
 will be too small.
Interestingly, this is a non-deterministic choice because you can pad either the node to the right or left of the gap. We’ve chosen the following “left-aligned” scheme for parsing leaves into blocks:

![](https://api.kauri.io:443/ipfs/QmVH6Wx3MSWRQKH57AYCLSXBUVmFY71hnsKhERUVcxvVF6)

We call the bottommost 
`.sum`
 value the 
`parsedSum`
 for that branch, and the 
`TransferProof`
 schema includes a 
`.parsedSum`
 value which is used to reconstruct the bottom node.

#### Branch Validity and Implicit NoTx
Thus, the validity condition for a branch as checked by the smart contract is as follows: 
`implicitStart <= transfer.typedStart < transfer.typedEnd <= implicitEnd`
 . Note that, in the original design of the sum tree in “Plasma Cashflow,” some leaves were filled with a special “NoTx” transaction to represent that ranges were not transacted. With this format, the coins which are not transacted are simply those in the ranges 
`[implicitStart, transfer.typedStart)`
 and 
`[transfer.typedEnd, implicitEnd)`
 . The smart contract guarantees that no coins in these ranges can be used in any challenge or response to an exit.

#### Atomic Multisends
Often (to support transaction fees and exchange) transactions require multiple transfers to occur or not, atomically, to be valid. The effect is that a valid transaction needs to be included once for each of its 
`.transfers`
 — each with a valid sum in relation to that particular 
`transfer.typedStart`
 and 
`.typedEnd`
 . However, for each of these inclusions, it’s still the hash of the full 
`UnsignedTransaction`
 — NOT the individual 
`Transfer`
 — that is parsed to the bottom 
`.hash`
 .

### 5. Proof Structure and Checking
Unlike traditional blockchain systems, full plasma nodes don’t store every single transaction, they only ever need to store information relevant to assets they own. This means that the 
`sender`
 has to 
_prove_
 to the 
`recipient`
 that the sender actually owns the given range. A complete proof contains all the information sufficient to guaranteed that, if the Ethereum chain itself does not fork, tokens are redeemable on the main chain.
Proofs primarily consist of the inclusion and non-inclusion of transactions, which update the chain of custody for those coins. The inclusion roots must be checked against the block hashes submitted by the operator to the smart contract on the main chain. By tracing the chain of custody as verified in the proof scheme, from a token’s initial deposit into the contract through to the present, ability to redeem is guaranteed.
 
`plasma-core`
 follows a relatively simple methodology for verifying incoming transaction proofs. This section describes that methodology.

#### Proof Format
History proofs consist of a set of 
_deposit records_
 and long list of relevant 
`Transaction`
 s with corresponding 
`TransctionProof`
 s.
 
`plasma-utils`
  
[exposes](https://github.com/plasma-group/plasma-utils/blob/13ab042d8962852cf8c1905727d616448923764d/src/sum-tree/plasma-sum-tree.js#L281)
 a 
`static checkTransactionProof(transaction, transactionProof, root)`
 method, which is used by 
`plasma-core`
  
[here](https://github.com/plasma-group/plasma-core/blob/3caa359681db62106ba703eb0fd99171ebb86365/src/services/proof/snapshot-manager.js#L117)
 via calls to the 
`ProofService`
 .

#### Transaction Proofs
A 
`TransactionProof`
 object contains all the necessary information to check the validity of a given 
`Transaction`
 . Namely, it is 
[simply](https://github.com/plasma-group/plasma-utils/blob/master/src/serialization/schemas/transaction-proof.js)
 an array of 
`TransferProof`
 objects. As per the above section on atomic multisends, a given 
`TransactionProof`
 is valid if and only if all its 
`TransferProofs`
 are valid.

#### Transfer Proofs
 
`TransferProofs`
 contain all the necessary information required to recover the inclusion of a valid branch corresponding to the given 
`Transfer`
 in the 
`Transaction`
 at the correct block number. This constitutes:



 * The actual nodes of the Merkle sum tree which represent the branch’s full `inclusionProof`

 * The index of the leaf to calculate the binary path traced by the branch

 * The parsed bottom `.sum` as described in the sum tree spec above

 * The `signature` for that particular sender.
Right from the 
`plasma-utils`
  
[schema](https://github.com/plasma-group/plasma-utils/blob/master/src/serialization/schemas/transfer-proof.js)
 :

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/ben-chain/73e16cd5e1fa4c9afc426112b1965078.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
const TransferProofSchema = new Schema({
 parsedSum: {
   type: Number,
   length: 16
 },
 leafIndex: {
   type: Number,
   length: 16
 },
 signature: {
   type: SignatureSchema
 },
 inclusionProof: {
   type: [Bytes],
   length: 48
 }
})

```


Note that the 
`inclusionProof`
 is a variable-length array whose size depends on the depth of the tree.

#### Proof Steps
The core of the verification process involves applying each proof element to the current “verified” state, starting with the deposit. If any proof element doesn’t result in a valid state transition, we must reject the proof.
The process for applying each proof element is intuitive; we simply apply the transactions at each block as the contract’s custody rules dictate.

#### Snapshot Objects
The way in which we keep track of historically owned ranges is called a 
`snapshot`
 .  
 Quite simply, it represents the verified owner of a range at a block:

```
{
  typedStart: Number,
  typedEnd: Number,
  block: Number,
  owner: address
}
```



#### Deposit records
Every received range has to come from a corresponding deposit.  
 A deposit record consists of its 
`token`
 , 
`start`
 , 
`end`
 , 
`depositer`
 , and 
`blockNumber`
 .
For each deposit record, the verifier 
_must_
 double-check with Ethereum to verify that the claimed deposit did indeed occur, and that no exits have happened in the meantime.
If so, a 
`verifiedSnapshots`
 array is initialized to these deposits with each 
`snapshot.owner`
 being the depositer.
Next, we apply all given 
`TransactionProof`
 s, updating 
`verifiedSnapshots`
 accordingly. For each 
`transaction`
 and corresponding 
`transactionProof`
 , the verifier performs the following steps:



 * Verify that the given proof element is valid. If not, throw an error.

 * For each `transfer` in the `transaction` , do the following:a. “Split” any snapshots which were updated above at `transfer.typedStart` , `transfer.typedEnd` , `implicitStart` , and `implicitEnd` b. Increment the `.block` number for all resulting `verifiedSnapshots` which have a `block` equalling `transaction.blockNumber — 1` c. For each split `snapshot` which fell between `transfer.start` and `transfer.end` :i. verify that `snapshot.owner === transfer.from` . If not, throw an error.ii. set `snapshot.owner = transfer.sender` .
The 
`TransactionProofs`
 must be applied in ascending 
`blockNumber`
 .
Once this operation has been recursively applied for all 
`TransactionProof`
 s, the client may check for herself which new coins she now owns, by searching for all elements in 
`verifiedSnapshots`
 with a 
`blockNumber`
 equalling the current plasma block, and the 
`owner`
 equalling her address.

#### TransactionProof Validity
The transaction validity check in step 1. above is equivalent to checking the smart contract’s validity condition. The basic validity check, based on the sum tree specification above, is as follows:
1. Check that the transaction encoding is well-formed.  
 2. For each 
`transfer`
 and corresponding 
`transferProof`
 :  
 a. Check that the 
`signature`
 resolves to its 
`transfer.sender`
 address  
 b. verify that the 
`inclusionProof`
 has a root equal to the root hash for that plasma block, with the binary path defined by the 
`leafIndex`
   
 c. calculate the 
`implicitStart`
 and 
`implicitEnd`
 of the branch, and verify that 
`implicitStart <= transfer.start < transfer.end <= implicitEnd`
 

### 4. Contract and Exit Games
Of course, the proof for a chain of custody isn’t useful unless it can also be passed to the main chain to keep funds secure. The mechanism which accepts proofs on-chain is the core of plasma’s security model, and it is called the “exit game.”
When a user wants to move their money off a plasma chain, they make an “exit”, which opens a dispute period. At the end of the dispute period, if there are no outstanding disputes, the money is sent from the plasma contract on the main chain to the exiter. During the dispute period, users may submit “challenges” which claim the money being exited isn’t rightfully owned by the person exiting. The proofs described above guarantee that a “response” to these challenges is always calculable.
The goal of the exit game is to keep money secured, even in the case of a maximally adversarial operator. Particularly, there are three main attacks which we must mitigate:



 *  **Data withholding:** the operator may publish a root hash to the contract, but not tell anybody what the contents of the block are.

 *  **Including a forged/invalid transaction** : the operator may include a transaction in a block whose `sender` was not the previous `recipient` in the chain of custody.

 *  **Censorship:** after someone deposits their money, the operator may refuse to publish any transactions sending the money.
In all of these cases, the challenge/response protocol of the exit game makes sure these behaviors do not allow theft, in at most 1 challenge followed by 1 response.

#### Keeping track of deposits and exits
 
**Deposits mapping**
   
 Each time a new set of coins is deposited, the contract updates a mapping which each contain a 
`deposit`
 struct. From the contract:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/ben-chain/d2911e2bda35f94f841eea8b5f98259f.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
struct deposit:
 untypedStart: uint256
 depositer: address
 precedingPlasmaBlockNumber: uint256

```


Note that this struct contains neither the 
`untypedEnd`
 or 
`tokenType`
 for the deposit. That’s because the contract uses those values as the keys in a mapping of mappings. Accessing, for example, accessing the depositer of a given deposit looks like this: 
`someDepositer: address = self.deposits[tokenType][untypedEnd].depositer`
 
This choice saves a little gas, and also makes some of the code cleaner since we don’t need to store any sort of deposit ID to reference a deposit.
 
**Exitable ranges mapping**
   
 In addition to adding 
`self.deposits`
 entries each time there’s a deposit, the contract needs to somehow keep track of historical exits to prevent multiple exits on the same range. This is a little trickier because exits do not occur in order like deposits, and it would be expensive to search through a list of exits.
Our contract implements a constant-sized solution, which instead stores a list of exitable ranges, updating the list as new exits occur. From the smart contract:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/ben-chain/8586a536c65117b2c9e5ddd554cfba04.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
struct exitableRange:
 untypedStart: uint256
 isSet: bool

```


Again, we use a double-nested mapping with keys 
`tokenType`
 and 
`untypedEnd`
 so that we may call 
`self.exitable[tokenType][untpyedEnd].untypedStart`
 to access the start of the range. Note that Vyper returns 0 for all unset mapping keys, so we need an 
`isSet`
 bool so that users may not “trick” the contract by passing an unset 
`exitableRange`
 .
The contract’s 
`self.exitable`
 ranges are split and deleted based on successful calls to 
`finalizeExit`
 via a helper function called 
`removeFromExitable`
 . Note that exits on a previously exited range do not even need to be challenged; they will never pass the 
`checkRangeExitable`
 test called in 
`finalizeExit`
 . You can find that code 
[here](https://github.com/plasma-group/plasma-contracts/blob/068954a8584e4168daf38ebeaa3257ec08caa5aa/contracts/PlasmaChain.vy#L380)
 .

#### Exit games’ relationship to vanilla Plasma Cash
At heart, the exit games in our spec are very similar to the original Plasma Cash design. Exits are initiated with calls to the function

```
beginExit(tokenType: uint256, blockNumber: uint256, untypedStart: uint256, untypedEnd: uint256) -> uint256:
```


To dispute an exit, all challenges specify a particular 
`coinID`
 called into question, and a Plasma Cash-style challenge game is carried out on that particular coin. Just a single coin needs to be proven invalid to cancel the entire exit.
Both exits and the two types of respondable challenges are given an 
`exitID`
 and 
`challengeID`
 which are assigned in order via an incrementing 
`challengeNonce`
 and 
`exitNonce`
 .

#### Blocknumber-specified transactions
In the original Plasma Cash spec, the exiter is required to specify both the exited transaction and its previous “parent” transaction to prevent the “in-flight” attack where the operator delays including a valid transaction and inserts an invalid one in the block between.
This poses a problem for our range-based schemes, because a transaction may have multiple parents. For example, if Alice sends 
`(0, 50]`
 to Carol, and Bob sends 
`(50, 100]`
 to Carol, Carol can now send 
`(0, 100]`
 to Dave. But, if Dave wants to exit that, both the 
`(0, 50]`
 and 
`(50, 100]`
 are parents.
Though specifying multiple parents is definitely doable, this specification would be gas-expensive and seemed more complex to implement. So, we opted for the simpler alternative, in which each transaction specifies the `block` its senders intend for it to go in and is invalidated if included in a different block. This solves the in-flight attack and means the contract does not need a transaction’s parents. For those interested in a formal writeup and safety proof for this scheme, it’s worth giving 
[this great post](https://ethresear.ch/t/plasma-cash-with-smaller-exit-procedure-and-a-general-approach-to-safety-proofs/1942)
 a look.

#### Per-coin transaction validity
An unintuitive property of our exit games worth noting up front is that a certain transaction might be “valid” for some of the coins in its range, but not on others.
For example, imagine that Alice sends 
`(0, 100]`
 to Bob, who in turn sends 
`(50, 100]`
 to Carol. Carol 
_does not_
 need to verify that Alice was the rightful owner of the full 
`(0, 100]`
 . Carol only needs an assurance that Alice owned 
`(50, 100]`
 — the part of the custody chain which applies to her receipt. Though the transaction might in a sense be “invalid” if Alice didn’t own 
`(0, 50]`
 , the smart contract 
_does not care about that_
 for the purposes of disputes around exits for the coins 
`(50, 100]`
 . So long as the received coins’ ownership is verified, the rest of the transactions don’t matter.
This is a very important requirement to preserve the size of light client proofs. If Carol had to check the full 
`(0, 100]`
 , she might also have to check an overlapping parent of 
`(0, 10000]`
 , and then all of its parents, and so on. This “cascading” effect could massively increase the size of proofs if transactions were very interdependent.
Note that this property also applies to atomic multisends which describe multiple ranges being swapped. If Alice trades 1 ETH for Bob’s 1 DAI, it is Alice’s responsibility to check that Bob owns the 1 Dai before signing. However, after, if Bob then sends the 1 ETH to Carol, Carol 
**need not verify**
 that Bob owned the 1 DAI, only that Alice owned the 1 ETH she sent to Bob. Alice incurred the risk, so Carol doesn’t have to.
From the standpoint of the smart contract, this property is a direct consequence of challenges always being submitted for a particular 
`coinID`
 within the exit.

#### How the contract handles transaction checking
Note that, to be used in exit games at all, 
`Transaction`
 s must pass the 
`TransactionProof`
 check described in the proofs section above(valid signatures, branch bounds, etc). This check is performed at the contract level in the function

```
def checkTransactionProofAndGetTypedTransfer(
   transactionEncoding: bytes[277],
   transactionProofEncoding: bytes[1749],
   transferIndex: int128
 ) -> (
   address, # transfer.to
   address, # transfer.from
   uint256, # transfer.start (typed)
   uint256, # transfer.end (typed)
   uint256 # transaction plasmaBlockNumber
 ):
```


An important note here is the 
`transferIndex`
 argument. Remember, a transaction may contain multiple transfers, and must be included once in the tree for each transfer. However, since challenges refer to a specific 
`coinID`
 , only a single transfer will be relevant. So, challengers and responders gives a 
`transferIndex`
 — whichever of the transfers relates to the coin being disputed. The check decodes and checks all the 
`TransferProof`
 s in the 
`TransactionProof`
 , and then checks inclusion for each with the function

```
def checkTransferProofAndGetTypedBounds(
 leafHash: bytes32,
 blockNum: uint256,
 transferProof: bytes[1749]
) -> (uint256, uint256): # typedimplicitstart, typedimplicitEnd
```


Once all 
`TransferProof`
 s are verified, the dispute-relevant values for the 
`transferIndex`
 th 
`Transfer`
 are returned to the exit game functions: namely the 
`sender`
 , 
`recipient`
 , 
`typedStart`
 , 
`typedEnd`
 , and 
`plasmaBlockNumber`
 .
With that out of the way, we can specify the full set of challenge/response games for exits.

#### Challenges which immediately cancel exits
Two kinds of challenges immediately cancel exits: those on spent coins and those on exits before the deposit occurred.
 
**Spent coin challenge**
   
 This challenge is used to demonstrate that the exiter of a transaction already sent the coins to someone else.

```
@public
def challengeSpentCoin(
 exitID: uint256,
 coinID: uint256,
 transferIndex: int128,
 transactionEncoding: bytes[277],
 transactionProofEncoding: bytes[1749],
):
```


It uses 
`checkTransactionProofAndGetTypedTransfer`
 and then checks the following:



 * The challenged coinID lies within the specified exit.

 * The challenged coinID lies within the `typedStart` and `typedEnd` of the `transferIndex` th element of `transaction.transfers` .

 * The `plasmaBlockNumber` of the challenge is greater than that of the exit.

 * The `transfer.sender` is the exiter.
The introduction of atomic swaps does mean one thing: the spent coin challenge period must be strictly less than others, because of an edge case in which the operator withholds an atomic swap between two or more parties. In this case, those parties must exit their pre-swapped coins, forcing the operator to make a a spent coin challenge and reveal whether the swap was included or not. BUT, if we allowed the operator to do that at the last minute, it would make for be a race condition where the parties have no time to use the reveal to cancel other exits. Thus, the timeout is made shorter (1/2) than the regular challenge window, eliminating “last-minute response” attacks.
 
**Before deposit challenge**
   
 This challenge is used to demonstrate that an exit comes from an earlier 
`plasmaBlockNumber`
 than that coin was actually deposited for.

```
@public
def challengeBeforeDeposit(
 exitID: uint256,
 coinID: uint256,
 depositUntypedEnd: uint256
):
```


The contract looks up 
`self.deposits[self.exits[exitID].tokenType][depositUntypedEnd].precedingPlasmaBlockNumber`
 and checks that it is later than the exit’s block number. If so, it cancels.

#### Optimistic exits and inclusion challenges
Our contract allows an exit to occur without doing any inclusion checks at all in the optimistic case. To allow this, any exit may be challenged directly via

```
@public
def challengeInclusion(exitID: uint256):
```


To which the exiter must directly respond with either the transaction or deposit they are exiting from.

```
@public
def respondTransactionInclusion(
 challengeID: uint256,
 transferIndex: int128,
 transactionEncoding: bytes[277],
 transactionProofEncoding: bytes[1749],
):
```



```
...
```



```
@public
def respondDepositInclusion(
 challengeID: uint256,
 depositEnd: uint256
):
```


The second case allows users to get their money out if the operator censored all transactions after depositing.
Both responses cancel the challenge if:



 * The deposit or transaction was indeed at the exit’s plasma block number.

 * The depositer or recipient is indeed the exiter.

 * The start and end of the exit were within the deposit or transfer’s start and end

#### Invalid History Challenges
The most complex challenge-response game, for both vanilla Plasma Cash and this spec, is the case of history invalidity. This part of the protocol mitigates the attack in which the operator includes an forged “invalid” transaction whose sender is not the previous recipient. The solution is called an invalid history challenge: because the rightful owner has not yet spent their coins, they attest to this and challenge: “oh yeah, that coin is yours? Well it was mine earlier, and you can’t prove I ever spent it.”
Both invalid history challenges and responses can be either deposits or transactions.
 
**Challenging**
 
There are two ways to challenge depending on the current rightful owner:

```
@public
def challengeInvalidHistoryWithTransaction(
 exitID: uint256,
 coinID: uint256,
 transferIndex: int128,
 transactionEncoding: bytes[277],
 transactionProofEncoding: bytes[1749]
):
```


and

```
@public
def challengeInvalidHistoryWithDeposit(
 exitID: uint256,
 coinID: uint256,
 depositUntypedEnd: uint256
):
```


These both call a

```
@private
def challengeInvalidHistory(
 exitID: uint256,
 coinID: uint256,
 claimant: address,
 typedStart: uint256,
 typedEnd: uint256,
 blockNumber: uint256
):
```


function which does the legwork of checking that the 
`coinID`
 is within the challenged exit, and that the 
`blockNumber`
 is earlier than the exit.
 
**Responding to invalid history challenges**
 
Of course, the invalid history challenge may be a grief, where really the challenger did spend their coin, and the chain of custody is indeed valid. We must allow this response. There are two kinds.
The first is to respond with a transaction showing the challenger’s spend:

```
@public
def respondInvalidHistoryTransaction(
 challengeID: uint256,
 transferIndex: int128,
 transactionEncoding: bytes[277],
 transactionProofEncoding: bytes[1749],
):
```


The smart contract then performs the following checks:



 * The `transferIndex` th `Transfer` in the `transactionEncoding` covers the challenged `coinID` .

 * The `transferIndex` th `transfer.sender` was indeed the claimant for that invalid history challenge.

 * The transaction’s plasma block number lies between the invalid history challenge and the exit.
The other response is to show the challenge came before the coins were actually deposited — making the challenge invalid. This is similar to the 
`challengeBeforeDeposit`
 for exits themselves.

```
@public
def respondInvalidHistoryDeposit(
 challengeID: uint256,
 depositUntypedEnd: uint256
):
```


In this case, there is no check on the sender being the challenge recipient, since the challenge was invalid. So the contract must simply check:



 * The deposit covers the challenged `coinID` .

 * The deposit’s plasma block number lies between the challenge and the exit.
If so, the exit is cancelled.
This concludes the complete exit game specification. With these building blocks, funds can be kept safe even in the case of a maximally malicious plasma chain.

### 6. The Future
Plasma Group is dedicated to the creation of an open plasma implementation for the greater Ethereum community. It’s our mission to push layer 2 scaling forward by exploring the full potential of the plasma framework. There’s certinaly much more to push forward! Here are some of the things we hope to work on next.

#### Missing pieces in implementation
 
**Automated Guarding**
   
 While a good start, many improvements are needed to fulfill the true potential of Plasma, for this spec and beyond. Currently, the most glaring missing piece in our implementation is guarding, the automated process which submits challenges and responses on behalf of users. Thankfully, the exit games themselves are implemented and have been manually 
[tested](https://github.com/plasma-group/plasma-contracts/blob/master/test/test-plasma.js)
 , so that client software can be updated after a chain is deployed. We felt this was sufficient for a testnet release, but is the most pressing addition the code needs.
 
**P2P History Proofs**
 
Currently, when a user recieves a transaction, they ask the operator and re-download the full proof. This introduces a massive increase in operator overhead. What should really happen is that the sender directly transmits their locally stored proof to the recipient, bypassing the operator and making it much cheaper to run a plasma chain.
 
**Defragmentation Strategies**
   
 Since we support atomic swaps, our current spec is compatible with any defragmentation strategy without any upgrades to the contract. However, it remains to be seen what the right approach will be, especially since we require transactions to specify a Plasma block number. We hope the plasma community can build an extensible defragmentation abstraction library which allows operators and users to try out different approaches.
 
**Front-end wallet integration**
   
 We have some designs for a front-end wallet, but currently the client only supports command-line transacting, with no support for trading different ERC20s. Having a nice UI to give to testnet users will be a major step up in terms of UX and accessibility.
 
**Operator fees**
   
 Because we support atomic multisends, we can support transaction fees without any protocol modifications. However, we’ve not currently implemented anything for this testnet launch.
 
**Networked operator**
   
 Something we’re not taking advantage of yet is that merkle tree construction is highly parallelizable. If the operator was deployed as a networked cluster, we could increase block size by constructing subtrees in parallel.

![](https://api.kauri.io:443/ipfs/QmYW557y9866JmahujnLhhPCvhH4FNPxE2aDQzRLnmcsj4)

 
**Code review**
   
 It’s 
**very likely**
 that all of the client, contract, and operator implementations have critical bugs at this time. We’re hoping that part of this public launch will be an opportunity for external contributors to help point out many mistakes!

#### Missing pieces in the spec
 
**Succinct Proof Schemes**
   
 As mentioned in the introduction, the most active area of Plasma research is a scheme to reduce the history proof size. P2P or not, an old (say, 1 year+) coin might have a significant amount of associated proof data, making transactions cumbersome. This is because the history proof contains, at minimum, one branch per block.
RSA accumulator constructions and STARKS/SNARKS which batch branch proofs over many blocks are currently the most likely candidates. Both would require protocol changes: for RSA (which also introduces a trusted setup), an entirely new validity condition must be added to the exit game. For the latter, the tree needs to be constructed using a SNARK/STARK friendly hashing algorithm, which has not been implemented in EVM.
 
**Mass Exit/Deposit Schemes**
 If the operator does turn malicious, users must (eventually, no rush!) exit their funds. The concept of “mass exits”, in which many users consent to exiting together via a single on-chain transaction, would be a significant scalability increase. Ideally, the exit would be able to auto-deposit funds directly into a different plasma chain via a merkle root of balances. This would enable many users to switch chains, without individual balances ever being resolved on the main chain — a significant improvement in the “networkability” of multiple plasma chains.
 
**Multi-operator networks**
   
 Though the operator cannot steal funds, they can censor transactions at will. One mitigation to this would be to replace the single-operator model with a set of operators, so that the existence of just a single honest operator is sufficient for clients to transact.
 
**Improved exit records**
   
 Our exitable range construction allows for constant-sized checks on exited ranges. However, since each finalization updates this mapping, we will have a race condition if exits on the same range aren’t processed in ascending order. This is because the first exit’s finalization splits the range, changing the key to the 
`self.exitable`
 mapping and causing 
`checkRangeExitable`
 to fail for exits referencing the unsplit range. Those exits will revert and have to be re-submitted in the next Ethereum block. A gas-efficient alternative may exist, possibly using some sort of tree, queue, or some 
`batchFinalizeExits`
 method.
 
**State channels and scripting**
   
 Recently, there’s been some great progress in the research community which suggests state channels and scripting with covenants are feasible on Plasma. Our current spec does not support either of these features, and will require a significant upgrade to the smart contract to support.
Together, we’ll build towards realizing the vision of a more decentralized future.
