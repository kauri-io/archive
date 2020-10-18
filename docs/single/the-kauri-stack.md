---
title: The Kauri Stack
summary: The Kauri team has been heads down in research and development, exploring how we can launch and scale a knowledge network that is curated not by a central moder
authors:
  - Kauri Team (@kauri)
date: 2019-12-17
some_url: 
---

# The Kauri Stack

![](https://ipfs.infura.io/ipfs/QmUgWuHdZo6M7Bcpqfq7fK7uDZEs9q1zx7whxWPH71UURW)



The Kauri team has been heads down in research and development, exploring how we can launch and scale a knowledge network that is curated not by a central moderator, but by the community itself. This article, while technical in nature, is intended to provide the community with an overview of how Kauri was designed, how it was built, how the application and protocol layers interact, and how the smart contracts function. We believe that making this information open to the larger Ethereum ecosystem is vital to Kauri’s success, as we pursue the long-term goal of a community-curated body of knowledge.

### Kauri Architecture Overview
We don’t want Kauri to own or store your content. Instead, we aim to provide a decentralized, trustless, and community-based network to share and curate knowledge. To do this, we separated the network into two layers: the protocol layer and the application layer. The protocol layer is a collection of decentralized technologies that guarantee openness and transparency, while the application layer is a traditional application that serves primarily to improve user experience.

#### Kauri Protocol Layer
 _Core Decentralized Technologies_ 
The protocol layer contains the core decentralized functions, and was built using the Ethereum blockchain, Solidity smart contracts for all trustless interaction and payments, and IPFS as distributed storage for content, images, and other materials used on the network.

Due to the nascent stage of blockchain development, we realized that decentralizing the core business logic, trustless interactions and payments, and file storage mechanisms while maintaining a traditional application layer was the best approach at this time. This in turn creates an open by default API from which anyone can build on top of. The benefits of this are threefold: trustless interactions and payments on the Ethereum blockchain, security of existence via IPFS storage, and true community ownership of content.

 _Smart Contracts: Trustless Interactions and Payments_ 
The Kauri smart contracts contain all the business logic for submitting and requesting articles, and adding and increasing bounties on articles. The current contract set resides on the Rinkeby testnet, with many publicly facing key domain functions. Kauri’s smart contracts have been written to include an upgradeable storage mechanism, so in the event a flaw is found within the current contract set, new versions of the core contracts can be deployed and still be pointed at the persisting storage contract. More detailed information on the key domain entities are highlighted at the end of this article.

 _IPFS: Security of Existence and Distributed Content_ 
With Kauri’s open by default API, anyone can access the IPFS data, as well as any related information via the Kauri smart contracts, as everything on the Ethereum mainnet is publicly available. However, IPFS content on Kauri and moderation of that content is controlled using elliptic curve cryptography.

Kauri tracks content ownership and moderation via signature. Essentially, users will sign a string with their private key, this string consisting of the IPFS_hash + article_id, and in return this signature is stored in the IPFS reference document. This IPFS reference document contains the proof of ownership of the content. To validate the content owner, the address received from recovering the signature is compared with the address of the author for a match.

#### Kauri Application Layer

![](https://cdn-images-1.medium.com/max/1600/0*4DyqUyEAYrh3bltx.)

Kauri’s Application Layer stack is straightforward, and is all deployed using Kubernetes:



 *  **Frontend** is built using ReactJS, which utilizes MetaMask and the Web3.js library to interact with the Ethereum blockchain.

 *  **API Gateway** is built using Spring Boot and is split into three main components: a synchronously executed query mechanism, an asynchronously executed command mechanism, and a push notification event mechanism.

 *  **Passwordless Authentication Module,** which generates a JSON Web Token that isn’t based on any central authority or storage.

 *  **Kafka Message Bus** that manages the asynchronous nature of blockchain contract events, queuing all events coming from the Ethereum blockchain and API gateway.

 *  **Core Service** are the Java and Spring Boot components responsible for off-chain logic (e.g. who has the right to submit a comment) and reconciliation, as well as event / command processors, and a query handler.

 *  **Broadcaster,** which is a smart contract event listener that listens for events and triggers corresponding messages on the Kafka Message Bus.

 *  **Email Service** that sends email notifications to the end user.

 *  **Database Layer** that stores JSON documents on IPFS and uses ElasticSearch to index content and provide full text search capabilities.

 _Advantages Provided by Application Layer_ 
Due to the nascent nature of blockchain development, we feel that although Kauri’s application layer introduces minor points of centralization at this point in time, it does provide a practical and cost-effective user experience while also introducing key application features, namely notifications, votes, comments, search capabilities, and monitoring.

### Kauri Smart Contracts Overview

![](https://cdn-images-1.medium.com/max/1600/0*jrQoFj25elMLoUCl.)

There are four key domain entities within the Kauri smart contract system:



 *  **Request:** a request for a new knowledge article to be created within the system.

 *  **Topic:** a topic within the Kauri system is a specific category by which requests and articles are siloed.

 *  **Bounty:** an amount of ether associated with a request that is awarded to an accepted article submitter. Anyone can decide to contribute to a request, but it is not a requirement that a request must have a bounty amount.

 *  **Article:** useful content within the Kauri network, such as a tutorial or best practices guide. An article can be created in response to a request for knowledge or submitted standalone and not associated with a request.

The smart contracts were designed with four distinct actors in mind: regular users, article submitters, topic moderators, and the Kauri Team. Topic Moderators and the Kauri Team are points of centralization in the MVP that we hope to disintermediate as we continue to develop the network. At the outset of the Kauri MVP launch, **Topic Moderators** will currently retain control over deciding which articles should be accepted or rejected, while the **Kauri Team** will retain control over upgrading of contracts, changing of contract configuration parameters, and adding new topic moderators.

#### Kauri’s Smart Contract Architecture
There are four separate but cohesive deployable contracts within the Kauri smart contract system, with distinct bounded contexts. Interaction between these contracts is achieved via function calls at the interface level, with no dependency on the actual implementation details.



 *  **KauriCore:** where almost all of the business logic of the smart contract system is located. It includes all the functions for request, bounty, and article manipulations. It does not store data locally however (with the exception of contract configuration data), and instead delegates to the storage contract when retrieving and writing data.

 *  **Wallet:** manages the holding, allocation, and withdrawal of funds from the Kauri system. It is the only contract that is designed to hold ether. The KauriCore contract forwards all received ether to this contract when a bounty or tip function is called.

 *  **TopicModerator:** handles creation of topics and the assignment of moderators (by their public ethereum address) to these topics. The KauriCore contract delegates to this contract for access control when deciding if an account should be able to call moderator-only functions.

 *  **Storage:** focused purely on storing key value pair data, used by the TopicModerator and KauriCore contracts in order to provide a highly flexible data model whilst also enabling the system logic to be upgraded without losing valuable data.

### Kauri’s Data Storage Mechanism
Logic and storage within Kauri smart contracts are separated to ensure that there is a clear path to upgrading, in the event that a flaw is found in the logic of the code. In traditional smart contract design, the data is tightly coupled to the logic, and an upgrade could mean a potentially expensive — and because of gas constraints — sometimes impossible data migration.

Both the KauriCore and TopicModerator contracts hold a reference to the address of the storage contract, meaning that a new version of KauriCore or TopicModerator can be deployed that still points to the existing storage contract and thus preserving the data.

It should be noted that the Wallet contract does not use external Storage. This is because the Wallet data is tightly coupled to the amount of funds that the Wallet currently holds, and so deploying a new Wallet contract using previous data would not make sense.

More information on our smart contracts will be made available on Kauri following our May 3rd Rinkeby launch!

#### IPFS Store
The IPFS Store mechanism provides an API to link an IPFS node with ElasticSearch and allows advanced search capabilities, including full text search and pagination. Being part of the application layer, it allows network users faster access to search results instead of sending requests to the blockchain. These off-chain caching solutions are the current industry standard, and are also used for similar purposes by the Bounties Network.

#### Password-less Authentication Module
The Kauri authentication and authorization module generates a JSON Web Token for a user, which serves to authenticate and authorize the caller to an API resource server. The authentication is proven without a password using cryptographic signature, and depends on a decentralized policy smart contract deployed on the Ethereum blockchain. The API access control mechanism isn’t based on any central authority or storage, though it is possible to attach some information (e.g. username, email) to the User ID (ethereum account address).

The passwordless authentication module process is as follows: first a user will obtain a piece of data to share, the user will then sign that data (currently using MetaMask, though future methods may use uPort or other mechanisms), the user will then call the API (using “POST /auth”) with their account address, signature, and personal information. The server will check the signature against the address via ecrecover, generate a JSON Web Token, and then store the personal information. At this point, the user can access the resource by passing an X-Auth-Token HTTP header.




---

- **Kauri original link:** https://kauri.io/the-kauri-stack/774f8a80d2584bebb46ac7dbde8b51cd/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2019-12-17
- **Kauri original tags:** kauri
- **Kauri original hash:** QmWRFrwHhvz8pgSemWVHPCxLTCm6KxwbAX9b1HL5jRYNjB
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



