---
title: Fluree  Blockchain, GraphQL, and more all in one database
summary: FlureeDB is a database purpose-built to fit the requirements of modern enterprise applications while providing blockchain capabilities for data security, workflow efficiency, and industry interoperability. Sound intriguing? I thought the same, and if the team behind Fluree delivers everything its promising, the results could be staggering. To find out more about Fluree, I spoke with its Co-CEO, Brian Platz. Hear the full interview below. For over two decades, Brian Platz and Flip Filipowski have
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-09-11
some_url: 
---

# Fluree  Blockchain, GraphQL, and more all in one database


> "FlureeDB is a database purpose-built to fit the requirements of modern enterprise applications while providing blockchain capabilities for data security, workflow efficiency, and industry interoperability."

Sound intriguing? I thought the same, and _if_ the team behind Fluree delivers everything it's promising, the results could be staggering.

To find out more about Fluree, I spoke with its Co-CEO, Brian Platz. Hear the full interview below.

<iframe frameborder="0" height="102px" scrolling="no" src="https://anchor.fm/theweeklysqueak/embed/episodes/Brian-Platz-of-Fluree--the-Feature-Packed-Blockchain-based-Database-e3crt8" width="400px"></iframe>

For over two decades, [Brian Platz](https://www.linkedin.com/in/brianplatz/) and [Flip Filipowski](https://www.linkedin.com/in/andrewflipfilipowski/) have been building software companies together. They oversaw two IPOs - one of which involved the 8th largest company in the world - and have secured the largest cash sale of a software company ever. Suffice it to say; they have experience working with software.

[Fluree](https://flur.ee/index.html) is Brian and Flip's latest project, conceived just over four years ago. It's a new type of data platform for modern apps, and they created it because they frequently found themselves struggling with database limitations.

Brian and Flip felt that while software and software delivery (think SaaS) has moved in leaps and bounds over the years, the DBs that underpin software haven't evolved - despite the increased importance of data.

One of Fluree's most significant differentiating factors is that it decouples the processes involved with updating data and querying it. Furthermore, a blockchain records every single DB change ever made, allowing for limitless querying of a potentially infinite number of versions.

Fluree has the concept of "Fuel", which is similar to Ethereum Gas and is calculated based on every DB query that's performed, as well as the three current Fluree interfaces: [GraphQL](https://graphql.org/), FlureeQL (a JSON query interface), and SPARQL.

Fluree released a licensed version last December and, so far, early adopters have tended to be other tech start-ups - blockchain-based apps that are using Fluree as the foundational pinning. That's because, with Fluree, you can write custom blockchain logic without having to fork another blockchain, i.e., you can get your project off the ground in a significantly shorter space of time.

Two such early adopters are [IdeaBlock](https://ideablock.io/) - which is looking to disrupt the digital patent system - and Fabric - which is challenging the traditional advertiser ecosystem and looking to help people monetize their data (rather than having it sold by the likes of Facebook).

Brian also mentions that the biggest beacon on the 6-month Fluree roadmap is that it will be fully open sourcing this quarter. It's APIs are stabilized and good to go.

All in all, there's no question that Fluree is jam-packed with features and heaps of potential, let's take it for a test drive.

### Hands-On

You can [download and unpack a hosted zip file](https://s3.amazonaws.com/fluree-releases-public/flureeDB-latest.zip).

Then run the following command to start a Fluree instance:

```shell
./fluree_start.sh
```

And there are [Homebrew taps](https://docs.flur.ee/docs/getting-started/installation#download-fluree-with-homebrew) and [Docker images](https://docs.flur.ee/docs/getting-started/installation#fluree-with-docker) available.

Once started, Fluree runs on port 8080 and has a GUI and [REST endpoints](https://docs.flur.ee/api/signed-endpoints/overview) for most operations you need.

After installing and starting, I followed the "[Examples](https://docs.flur.ee/docs/examples/cryptocurrency)" section of the documentation, that walks you through creating a cryptocurrency. With Fluree, you always have the choice of using FlureeQL, GraphQL, SparQL, or curl. For example, to create a schema with curl, use the commands below:

```bash
curl \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $FLUREE_TOKEN" \
   -d '[{
    "_id": "_collection",
    "name": "wallet"
},
{
    "_id": "_attribute",
    "name": "wallet/balance",
    "type": "int"
},
{
    "_id": "_attribute",
    "name": "wallet/user",
    "type": "ref",
    "restrictCollection": "_user"
},
{
    "_id": "_attribute",
    "name": "wallet/name",
    "type": "string",
    "unique": true
}]' \
   [HOST]/api/db/transact
```

The authorization token is one of the interesting parts of Fluree, as it is tied to a keypair, something familiar to any Blockchain users. [Read the documentation for more details](https://docs.flur.ee/docs/getting-started/installation#setting-your-own-private-key), but I used `./fluree_start.sh :keygen` to get me started with an autogenerated pair and user id, and [derived a token from that](https://docs.flur.ee/docs/identity/public-private-keys).

You might have noticed that Fluree is not a NoSQL or schemaless database, which means that you need to cope with schema changes, I couldn't find any official mention in the documentation on any specific functionality on how to handle these changes.

Next, you add sample data, again with the four methods available to you. As Fluree is a somewhat relational database, you can add "relations" using what Fluree calls ["predicates"](https://docs.flur.ee/docs/getting-started/basic-schema#adding-predicates). Fluree also bundles a set of [predicate types](https://docs.flur.ee/docs/infrastructure/system-collections#_predicate-types) to define what data type the relationship is, or you can use functions to define the predicate, which is where Fluree gets interesting. For instance, with the Cryptocurrency example from the docs, you can define predicates that are somewhat like Solidity (the Ethereum smart contract language) functions, for checking balances or protecting against double spends.

### Final thoughts

Fluree is fascinating, but the multitude of bundled features overwhelming, sometimes too much choice can be a little daunting and confusing. It's kind of like a database engine, plus a semblance of an application layer bundle into one. I know that many older, relational databases have packed these sorts of features in the past, but it's been a while since I have used a relational database, and have got used to the simplicity of NoSQL offerings. The different interface options are welcome, but I wonder if maybe picking and sticking to one might have been a better engineering decision, especially FlureeQL, which is unique to Fluree. Adding "blockchain" to the tech stack is a choice I am unsure about. [I covered BigchainDB before](https://www.sitepoint.com/bigchaindb-blockchain-data-storage/), which attempted to do the same, albeit in a different way. I'm unsure if Fluree's blockchain features comprise and actual blockchain, or just blockchain-like features, but that's fine, if you have a use case for them, it doesn't matter what you call them.

I was also unable to test anything like performance or reliability metrics of Fluree thoroughly, so whether all the features add much overhead I'm unsure. All in all, I strongly suggest you test Fluree and see how it may work for your application use case.
