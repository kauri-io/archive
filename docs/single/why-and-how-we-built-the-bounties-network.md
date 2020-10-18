---
title: Why and How We Built the Bounties Network
summary: We began building the Bounties Network in early 2017, and quickly realized that whether it was social media, bugs, or code, across different platforms, there was a very good reason for a standard to exist across all variations. Enter, StandardBounties- a community driven implementation for bounties on Ethereum, which is a collaborative effort among freelancing & incentivization platforms that rely on Ethereum. Although data storage was (and still is) extremely expensive on the Ethereum Mainnet,
authors:
  - Will Villanueva (@will)
date: 2018-11-30
some_url: 
---

# Why and How We Built the Bounties Network


![](https://ipfs.infura.io/ipfs/QmSDT3XWamqMKK2qvhtvDr2Mc3RxBTTY7jfzkQxDPGxiHx)

We began building the Bounties Network in early 2017, and quickly realized that whether it was social media, bugs, or code, across different platforms, there was a very good reason for a standard to exist across all variations.
Enter, [StandardBounties](https://github.com/Bounties-Network/StandardBounties): a community driven implementation for bounties on Ethereum, which is a collaborative effort among freelancing & incentivization platforms that rely on Ethereum.

Although data storage was (and still is) extremely expensive on the Ethereum Mainnet, we used IPFS to store the data pertaining to bounty specifications and submissions in a decentralized manner. This meant that any platform or user on Ethereum can easily access all relevant data, thereby avoiding a replication of the walled-garden architectures we saw with existing freelancing platforms in the web2.0 world.

![](https://ipfs.infura.io/ipfs/QmbYiX4PG72KaMDxkBiYVTJ7iotZ29aB5HLJzotmC9MMGa)

Because most users aren’t comfortable interacting with smart contracts through command line tools, we realized the need to build a front-end interface — a **Bounties Explorer**. This would serve as an open-source, generalized platform for bounties across Ethereum, which could provide a reference client for new developers building on StandardBounties, as well as a website which end-users could employ to quickly begin **building a world on bounties.**
 
In the interest of building the system to be as decentralized as possible, we wanted the Bounties Explorer to be a fat client, one which managed as much logic in the front-end as possible,  **so there would be no need for a back-end server at all.** This meant the Bounties Explorer could be deployed & accessed using decentralized storage services like IPFS and Swarm, and would only rely on data stored on the Ethereum network (along with those storage services). And to make it even easier for Ethereum novices, we also deployed it using existing web server practises to the beta.bounties.network domain.

![](https://ipfs.infura.io/ipfs/QmThyoeDYkU4ncUxvR2kXkckHqArU9zDiZbmKt4xQnVfJK)

Over time, as the Bounties Network grew and began being used to pay out real bounties to developers, writers, and creators in the ecosystem, we ran into some technical challenges. Because we didn’t cache any data off-chain, the entire state of the bounties registry, including all bounties and submissions on the network, needed to be loaded from the blockchain on page-load, which not only provided a diminished user experience for our users (through some really awful load times), but also added an undue load on [Infura](https://infura.io), through the substantial number of _eth_calls_ required to pull all the data. Because the data was stored in IPFS, we didn’t have access to search functionality, pagination for quicker response times, analytics processing, and more. 
_We sincerely thank [Infura](https://infura.io/%5C) for their support in happily scaling their server infrastructure as usage of the Bounties Network and other Ethereum applications continues to grow._
 
To solve all these issues, we’ve decided to transition to an architecture which  **does** use some off-chain caching to improve user experiences, without sacrificing the open nature of the Bounties Network, and maintaining the interoperability benefits we were initially seeking.

For our [caching API](https://github.com/Bounties-Network/BountiesAPI), we had a few priorities in place. We wanted to achieve the following:

#### Openness and ease of use for other open source developers and users of the StandardBounties contract
We found our users faced roadblocks as they tested integration with the Rinkeby contract. They would have to repeat a lot of code just to parse through the IPFS stores, contract transactions, etc. to confirm they used the StandardBounties contract correctly and confirm the integrity of the data.

As a result, we wanted to have an easily accessible [API](https://api.bounties.network) with a good interface (using 
[swagger](https://swagger.io)), so anyone integrating with the contract could just load the API in real time and confirm all the data integrated correctly.

#### A realtime, fail-proof mechanism to cache the contract data
We also wanted to make it easy to filter, parse, and explore the data. As a result, the API we built returns a combination of everything written in IPFS and the on-chain contract, in addition to providing stats, profile data, searching, and more. It also provides all the endpoints necessary to build a reliable, fast, and stable bounties site (think bounties around stack overflow questions, translations, design, etc.).

#### Structured data to build open analytics tools for the community to participate in
We found it crucial to build the API to work in realtime and be as fail proof as possible. In order to accomplish this, we had to put a stable, solid architecture together.

![](https://ipfs.infura.io/ipfs/QmUybhpT8p4cb2Pah38So6sz7jQwAFjtNQmeuxtr9qxrRu)

All the services we built are containerized using [docker](https://www.docker.com), and managed by [kubernetes](http://kubernetes.io). Containerization makes it easy for us to build multiple systems with a clear and distinct separation of concerns. Also, it allows for easy testing, deployment repeatability, simple local setup (one command runs everything), and scaling. For example, kubernetes integrates with AWS and provides auto-scaling if server loads increase, and will automatically restart failed containers. This automatic restart helps with error management and also helps to simplify the codebase.

Next, we chose to build a contract subscriber and a bounties subscriber as two separate services. The contract subscriber listens directly to the ethereum contract for any new emitted events. When an event emits, it immediately grabs the relevant data and puts it into a job queue (SQS). The bounties subscriber listens to the job queue and writes to the database. Separating out the two jobs was an easy choice for a number of reasons:

1. The node.js web3 client is much more advanced and further along than the python client — this way we use a Django server to write to the DB and node.js to listen to the contract.
2. It separates concerns and it can just emit a contract event. It shouldn’t have to know what happens next. In the future, we may have multiple services that respond to each of the events (not just a bounties subscriber).
3. Having a job service like SQS running before writing to the database blocks duplications and manages failures easily.
4. It simplifies code, making it easier for new developers to easily begin contributing to our open source repo.

As the bounties subscriber listens to the job queue, it reads from IPFS, structures the data appropriately, and writes everything to a psql database. After the bounties subscriber does its work, the data is readily available in the 
[API](https://api.bounties.network). In the current system, we have a 1 second gap in time between the original event and its availability in the API. So far we consider this to be fast enough, but there are plenty of ways we can make it even quicker in the future, should the need arise.

Finally, our third priority centered around providing structured data, allowing our community to easily build analytics or real time services using bounties. Having this data readily available makes it possible to build many tools such as a pricing suggestion engine, reputation engine, or matching engine. It can also help with decentralization and openness around conflicts or disputes. Our priority was to make the data easy to download, access, and integrate with. As we continue to build out the Bounties Network, we’d like to have these additional services (reputation, pricing, etc.) built directly into the API.

----

As the Bounties Network continues to grow, we hope to continue sharing the lessons we learn about our development with our [community](https://join.slack.com/t/bountiesnetwork/shared_invite/enQtMzA2Mjk3MzAzODQwLTZjN2UxMmU5MWYxZTVmMmM4OGNjZDRiMDgwYTVhOTIwYmQ4MjVlMjNkZjYzOTE4MWI4OTFhOWE4ZTUzN2MyNWY), to make it even easier for new devs to build robust decentralized applications on top of Ethereum. We’re also excited to have the community join us in building the Bounties Network, and this process is already underway thanks to [Gitcoin](https://gitcoin.co).
 
_My thanks to [Mark Beylin](https://medium.com/@mark.beylin) and others for their feedback and encouragement._

- Join our [Bounties Slack community](https://join.slack.com/t/bountiesnetwork/shared_invite/enQtMzA2Mjk3MzAzODQwLTZjN2UxMmU5MWYxZTVmMmM4OGNjZDRiMDgwYTVhOTIwYmQ4MjVlMjNkZjYzOTE4MWI4OTFhOWE4ZTUzN2MyNWY)
- [sign up to learning sessions](http://eepurl.com/dpTC-5)
- [follow us on Twitter](https://twitter.com/ethbounties) to see what we’re up to!



---

- **Kauri original link:** https://kauri.io/why-and-how-we-built-the-bounties-network/1d5500b865fe4e2fa0b06e535216d233/a
- **Kauri original author:** Will Villanueva (@will)
- **Kauri original Publication date:** 2018-11-30
- **Kauri original tags:** none
- **Kauri original hash:** QmQdKQKTXeaH9R5G5rtf6BvyuKHvFEzPe983haPVtWBPFN
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



