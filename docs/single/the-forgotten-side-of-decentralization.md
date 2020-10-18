---
title: The Forgotten Side of Decentralization
summary: Where should content live on Web3? One of the most challenging, and overlooked, aspects of decentralization is storage. Where should content live in Web3, and how should we securely and efficiently distribute it? The Kauri knowledge network is designed to curate a high volume of long-form documentation, which may include graphs, pictures, videos, and other data rich file formats. Theoretically, you could store anything on the Ethereum blockchain, though gas costs increase substantially as the fi
authors:
  - Wil Barnes (@wil)
date: 2018-09-14
some_url: 
---

# The Forgotten Side of Decentralization


##Where should content live on Web3?

One of the most challenging, and overlooked, aspects of decentralization is storage. Where should content live in Web3, and how should we securely and efficiently distribute it?

The Kauri knowledge network is designed to curate a high volume of long-form documentation, which may include graphs, pictures, videos, and other data rich file formats. Theoretically, you could store anything on the Ethereum blockchain, though gas costs increase substantially as the file size grows (at our current mid-September 2018 gas prices, 1 MB of storage would cost several hundreds dollars). 

To handle this long-form documentation more economically, we’ve leveraged the [InterPlanetary File System](https://ipfs.io/) (IPFS) as a distributed storage layer. However, handling both an index of the Ethereum address of the documentation author and the IPFS hash where that documentation is stored is still a challenge. 

We’ve distilled our research down into essentially three decentralized solutions: on-chain index, side-chain index, and an IPFS read-only public index––the on-chain index being the most decentralized and the IPFS read-only public index being the least decentralized of the three options. 

The core data required on the Kauri network is an index of at least the author address and the article hash. This index allows timestamping of user article submissions to the decentralized environment. The advantages and disadvantages of each option is discussed in greater detail below. 

##Storage Option #1: On-chain Index 

_Setup_ 

With an on-chain index, our data is stored on IPFS (though you can use Swarm, Storj, Sia, or any other distributed storage solution), and the fixed-length unique IPFS hash that points to the data is stored on the Ethereum blockchain via a transaction. 

_Advantages_ 

By keeping the index on the main chain, a user can prove article ownership globally. The article is on the main chain and can be used by other dApps for a multitude of purposes: building on top of Kauri, creating and collecting badges, distributing your content, creating a global reputation. Imagine a global professional profile gathering your Kauri technical publications, [Gitcoin](https://gitcoin.co/) solutions, [Peepeth](https://peepeth.com/welcome) feeds, attendance at [blockchain events and meetups](https://media.consensys.net/mesh-news-09-13-18-this-is-why-we-buidl-f9991f8883e1), and so forth. On-chain storage is the most decentralized option of the three. 

_Disadvantages_ 

The primary disadvantage is the cost of storing data to the main chain, which can be quite volatile. To alleviate costs, we’ve considered using a batching mechanism similar to Peepeth, where up to 15 actions are stored off-chain before being written as a batch to the main chain. Presumably, this 15 action limit is a figure based on the 280 character limit per “peep” and other Peepeth features such as following another user. There are some innate differences between Kauri and Peepeth, namely that Kauri is geared towards long-form documentation while Peepeth is geared towards tweet-like actions. 

_Cost-Reducing Batch Escalation_ 

Escalating a batch of articles on Kauri requires storing and later retrieving the list of non-escalated articles from a MongoDB database prior to writing the data to the blockchain. Upon obtaining the non-escalated articles, a checkpoint file is generated and the root hash and checkpoint hash is signed, the checkpoint file is then uploaded to IPFS, the root hash, checkpoint hash, and trustee signature is returned to the frontend. The frontend then submits all the prior information to the smart contract which then generates an event. Following successful smart contract submission, the checkpoint file in IPFS is updated. 

For the batch escalation solution, all the content is still stored on IPFS, though the index is centralized until someone either triggers the on-chain escalation or all articles are escalated periodically (e.g. every 24 hours, every other day, once a week). One issue with this batching solution is that while a user is storing their articles off-chain, someone could steal the original author’s work and claim ownership of an article that does not belong to them. 

##Storage Option #2: Sidechain Index 

_Setup_ 

With a sidechain index, our data is stored on a “layer two” sidechain with the Ethereum blockchain as its base layer. That sidechain would use its own consensus rulesets specific to the use case, whether it be proof of stake (POS), delegated proof of stake (DPOS), proof of authority (POA), or other protocol. [Loom Network](https://loomx.io/) and [POA Network](https://poa.network/) are two sidechain implementations we’ve researched for viability. 

_Advantages_ 

By migrating article data to a sidechain, a user will enjoy only some of the benefits provided by the main chain (e.g. security, accessibility, transparency, multi-participants), but not all (e.g. loss of fault tolerance). A Kauri sidechain would be fast and free by definition, as it would presumably run in a less global environment with a POA or DPOS consensus protocol. The sidechain communicates bi-directionally with the main chain, allowing users to transfer an asset from the sidechain to the main chain. Lastly, other sidechain participants would be able to build on top of Kauri and its sidechain.

_Disadvantages_ 

For the uptick in speed and significantly decreased on-chain data storage costs made possible by a POS/DPOS/POA consensus ruleset on the sidechain, users forfeit decentralization, although the option to exit to the main chain should theoretically always remain available. Additionally, the sidechain can also experience data loss in the event that all participants shut down. It is also likely that at the outset a Kauri sidechain would be a single node implementation. 


##Storage Option #3: Read-only Public Index on IPFS

_Setup_ 

Within the current Kauri environment, a read-only public index would be uploaded to IPFS periodically, presumably by the Kauri team, the current maintainers of the Kauri network. This is easy enough to implement, as the index could be scheduled for upload nightly, every-other-night, or weekly. 

_Advantages_ 
 
By utilizing a public index on IPFS, users can still verify the consistency of the data served by the Kauri network. It’s also readily accessible via IPNS to anyone with the hash. 

_Disadvantages_ 
 
On IPFS, only one participant can publish the index under a static unique name. Consequently, this solution is not censorship resistant (as it is maintained solely by Kauri). A read-only public index on IPFS also suffers with regard to speed, as publishing to IPNS currently takes approximately two minutes. 


##The Ask Required of Kauri Users For Each Storage Option 

_Option #1 On-chain index - Cost_ 

For on-chain articles, Kauri users trust and transact directly with the main chain and pay the associated gas costs. The primary ask to the user is the transaction cost. Once the index is written to the blockchain, it can be extended to any other dApp and any other user in the blockchain. 

_Option #2 Sidechain index - Time & effort_ 

For sidechain articles, in the case of a Loom or POA Network sidechain implementation, users do not pay main chain storage costs but are heavily leaned upon and must be positioned to immediately request exit from the sidechain in the event of any malicious activity. Exits from the sidechain are not instantaneous as challenge periods exist. 

_Option #3 Read-only Public Index on IPFS - Time & effort, with diminished ‘decentralization’_ 

For an IPFS read-only index, users would need to verify the consistency of the data served by the Kauri middleware API against the public index. In short, users will not be able to solely trust the main chain or the sidechain implementation with the expectation that the Kauri maintainers consistently and reliably publish the index in a timely manner. 


##Best Bet: Why Levying Storage Costs to the User is Wise

Option #1, an on-chain index, remains the most promising decentralized storage solution for Web3. The price paid by users ensures that the index is persistent on the main chain and that data is reliably extensible to any other dApp or any other user browsing the Ethereum blockchain. Sidechains, with a reliable implementation, offer some of the benefits of decentralization but introduce further complexity to the user, as data must be transferred from the main chain to the sidechain and the user must monitor the sidechain for malfeasance. A read-only public index on IPFS moves away from chain-related decentralization, instead distributing the index across IPFS nodes––a centralized environment in which only one participant under a static unique name can publish the index.

A secure, efficient, and elegant storage solution remains an ongoing challenge for the Ethereum ecosystem. The trilemma between security, decentralization, and scaling exists as much for handling transaction volume as for managing longer-form content. But between batching and sidechains, a number of compelling and decentralized storage options have emerged.

As developers test drive these Layer 2 solutions over the coming months––for both scaling and storage––the Kauri team looks forward to not just documenting their progress, but counting ourselves among the dApps who are also actively building these solutions for Web3. 



---

- **Kauri original link:** https://kauri.io/the-forgotten-side-of-decentralization/1dce7ead0840458d930e5980ce879728/a
- **Kauri original author:** Wil Barnes (@wil)
- **Kauri original Publication date:** 2018-09-14
- **Kauri original tags:** none
- **Kauri original hash:** Qma31dqtG726FBttTs1DpRjQhx58FhfrAk4aaNGfx3FQuV
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



