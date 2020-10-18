---
title: Ethereum ❤ Witnet
summary: Ethereum smart contract developers know that smart contracts are self-contained in their own supporting blockchain. Contracts have very little capability to interact with other blockchains, the Internet and the rest of the world . Currently, external information can only be fed into Ethereum contracts by trusted authorities (probably, the developer of the contract) who need to sign claims about the state of the world. These are called “ oracles ”. But relying on a single oracle completely defeat
authors:
  - Witnet (@witnet)
date: 2018-11-13
some_url: 
---

# Ethereum ❤ Witnet



----


![](https://cdn-images-1.medium.com/max/2000/1*6acpDniTjhGNx4y5OwQ7Ig.png)

Ethereum smart contract developers know that smart contracts are self-contained in their own supporting blockchain. Contracts have **very little capability to interact with other blockchains, the Internet and the rest of the world** .
Currently, external information can only be fed into Ethereum contracts by **trusted authorities** (probably, the developer of the contract) who need to sign claims about the state of the world. These are called “ **oracles** ”.
But **relying on a single oracle completely defeats the point why smart contracts are used** in the first place. It’s not “trustless” and leaves too much space to contestation, repudiation and tampering.
> Mission-critical smart contracts aren’t viable without decentralized and trustless oracles.

That’s exactly why we started building [Witnet](https://witnet.io) : a **decentralized oracle network** whose claims are reliable not because any kind of authority but because they’re made by combining all the claims coming from a number of anonymous players who are **incentivized** to be honest and **compete** against each other for **rewards** .
Those rewards are paid by the requesting parties using the Witnet blockchain’s native token: **Wit** .
Now you’ll be wondering: **“If this Witnet thing has its own blockchain, how on Earth will Ethereum contracts interact with it?”** 

### Ethereum bridges, a quick overview

The [Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) explains that Ethereum bridges are:
> “Witnet nodes which also run an Ethereum node, have full access to the Ethereum blockchain and have the capability to operate with ether and make contract calls”.

In the Witnet ecosystem, Ethereum bridges are in charge of two missions:



 *  **Requests introduction** . Ethereum bridges monitor the Ethereum blockchain in search for Witnet requests codified inside transactions. When they find one of these, they read the payload and convert it into a valid Witnet request that they can broadcast to the Witnet network. In exchange for performing this work and spending their own Wits, bridges are rewarded by the Ethereum clients using ether (or any ERC20 token!)

 *  **Results reporting** . Ethereum bridges are also in charge of reporting the results of those requests back to the originating contracts. In exchange for performing this work and spending their own ether, they are rewarded with Wit tokens that were allocated for such purpose in the request transaction.

![](https://cdn-images-1.medium.com/max/1600/1*-Kua2raeFSgSfkMrfGgJ3w.png)


### Ethereum bridges, in practice

#### An example use case
Let’s say Alice and Bob want to create a smart contract **paying one or the other** depending on how’s the weather like tomorrow at noon in London, UK.



 * If it’s sunny, the contract will transfer all available funds to Alice.

 * If it rains, the contract will transfer all available funds to Bob.

 * In any other case, the contract will split the funds and return them to Alice and Bob.
All that Alice and Bob will need to do is writing an Ethereum smart contract that includes a **Witnet request** querying any publicly available weather API, extract the weather condition and report it. The request can even use **several data sources** and specify how to normalize and aggregate the results.
For convenience, there’ll be a library that will allow Ethereum contract developers to **build Witnet requests using Solidity** inside their own projects and include them into their existing workflows thanks to [Truffle](http://truffleframework.com/) .
Then, when the Ethereum contract is deployed and funded, the “weather contract” will post the request and register itself to the **Witnet Bridge Interface contract** .

#### The Witnet Bridge Interface contract

![](https://cdn-images-1.medium.com/max/1600/1*Q5aHXJBGzibUo3f-wyt62g.png)

The **WBI contract** helps the bridge nodes **discover new Witnet requests** in the Ethereum blockchain without the need to interpret every transaction in the network. It also **correlates the requests with the results** and acts as a **escrow for the rewards** offered to the bridges.
In their call to the WBI contract, Alice and Bob will **attach enough ether to bear the cost of the Witnet request** . They must also specify the Witnet _“replication factor”._ This is, how many witness nodes to employ for the request. The higher the replication factor, the greater the certainty but also the higher the price.
The WBI contract will mantain an index of all the requests made through it so that when they get resolved it can route the results back to their requesting parties.
Using the same _“miner selection algorithm”_ explained in [the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) , **during each Witnet epoch** (every 90 seconds) a different __ bridge node (an **“eth-to-wit epoch leader”** ) **wins the right** to self-assign all the unasigned requests, post them into the Witnet blockchain and claim the ether reward:



 * A bridge node **realizes its leadership position**  _(Witnet nodes can easily calculate if they’re leaders for the current block, but they can’t predict their leadership for future blocks)_ .

 * The bridge node then **reads all the unassigned requests** that have been posted to the WBI contract and __  **“cross-post” them into the Witnet blockchain** .

 * As soon as the **requests get included into a Witnet block** , the node will be able to generate a **“Proof of Inclusion”** for each of them. These proofs irrefutably **prove that the request was published in a certain block** in a similar way to how Bitcoin’s SPV works for transactions.

 * Finally, the bridge node makes a call to the WBI contract including both the _Proof of Inclusion_ and a _Proof of Leadership_ . The WBI contract **internally verifies both proofs** and, if valid, **sends the ether reward** to the contract caller.
Now you’re surely wondering: _“_  **How can an Ethereum smart contract verify transactions from other blockchains?**  _Is that even possible?”._ 
Sure it is! All thanks to block header relaying.

#### Block header relaying
In order for the WBI contract to verify Witnet _Proofs of Inclusion_ and _Proofs of Leadership_ , **it needs to be aware of all the Witnet blocks to date** .
That’s possible also thanks to bridge nodes. For every Witnet epoch, one bridge node **wins the right to act as a block header relayer** .
Block header relayers are in charge of **disclosing new Witnet blocks to the WBI** contract. In doing so, **they’ll get a percentage of the ether fees attached to all the eth-to-wit requests** that ended up being published in that block.
This scheme is expected to consume a significant amount of gas, as proof verification will likely require quite a bunch of hashing rounds. But it completely succeeds achieving its purpose of **allowing the WBI contract to trustlessly verify that the request was published to Witnet** by the contract caller.

#### Reporting the results

![](https://cdn-images-1.medium.com/max/1600/1*l1HxRVdvKmpVq6uYGm2Y4Q.png)

 **Once a request has been resolved** by the Witnet decentralized oracle network, **we get a single result value** . To continue with the weather contract example, let’s say the result value is _“sunny”_ .
Again, using the same _“miner selection algorithm”_ explained in [the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) , **during each Witnet epoch** a different bridge node is elected as **“wit-to-eth epoch leader”** . It’ll be in charge of calling the WBI with the result value as a parameter.
When calling the WBI, **any competent bridge node holding epoch leadership** should be able to provide the following parameters:



 *  `requestId` : the **identifier of the request** so that the WBI can correlate the result with the original request and report it to the requester.

 *  `result` : the **value returned by Witnet** from resolving the request.

 *  `proofOfLeadership` : proof that the **reporting node holds epoch leadership** .

 *  `proofOfInclusion` : proof that **the reported value was actually included in the Witnet blockchain** as a result for the original request.
As the WBI contract will be aware of all Witnet blocks to date, it’ll be capable of **validating** all those means of evidence. It’ll also **ascertain** without a doubt that the reported value is **exactly the same as published in the Witnet blockchain** .
Then the WBI will use the `requestId` to **look for the address of the requesting contract** in an internal `mapping(uint => address)` and report the value ( _“sunny”_ , in this case) to that contract address **** by calling a `reportResultFromWitnet` function in the contract.
The `reportResultFromWitnet` function will need to include a `require(msg.sender == WBI_ADDRESS)` guard so that **only the WBI can call it** . To keep gas consumption as low as possible for the bridge node, **this function should just store the reported value** and do nothing else.
Then, there should be a **separate function** (let’s call it `triggerResolution` ) that either Alice or Bob should call to **trigger the resolution** of the contract, **evalulate** the reported result value and **release the funds** accordingly.
If immediate or **unmaned resolution** of the contract is strictly required, the `reportResultFromWitnet` function can be written to directly call the `triggerResolution` function. However, this will increase gas consumption for the bridge node. Thus, if Alice and Bob designed their contract in this way, **the ether reward attached to the Witnet request will need to be enough to compensate** for the extra cost.
 **Question:**  _What if the amount of ether that Alice and Bob attached to their Witnet request_  **wasn’t enough to reward**  _the three employed bridge nodes (eth-to-wit, block relayer and wit-to-eth) because of a sudden gas price rise or for any other reason?_ 
Don’t panic — the WBI contract will provide an `upgradeReward` function for **increasing the reward at any time** . Once this function is called providing enough funds, the escrowed reward will be released to the reporting _wit-to-eth_ bridge node and the call to the `reportResultFromWitnet` function in Alice and Bob’s contract will finally progress just as expected.
> Boom. Ethereum contracts now have real power!


----


### Want to know more about the use cases of Witnet?
Don’t miss the next article in the series:
You can also:



 *  [Read the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) 📃

 *  [Read the FAQ](https://witnet.io/#/faq) ❓

 *  [Join the community Telegram group](https://t.me/witnetio) 💬

 *  [Follow @witnet_io on Twitter](https://twitter.com/witnet_io) 🐦

 *  [Discover other Witnet community channels](https://witnet.io/#/contact) 👥



---

- **Kauri original title:** Ethereum ❤ Witnet
- **Kauri original link:** https://kauri.io/ethereum-witnet/8386be0c5e084542a11276fe13fa02c5/a
- **Kauri original author:** Witnet (@witnet)
- **Kauri original Publication date:** 2018-11-13
- **Kauri original tags:** none
- **Kauri original hash:** QmQZEue9E7TwCaZ2Q8N19wm6KDEWqNmxpkXCJQcEQju4Du
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



