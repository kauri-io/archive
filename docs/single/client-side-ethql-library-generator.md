---
title: Client-Side EthQL Library Generator
summary: Project Name Client-Side EthQL Library Generator Project Tagline/Description (140 Characters Max. Will be used on table card for judging) Buidl JavaScript libraries that interact with contracts via EthQL without custom servers Team Members. First and Last Names Scott Street, Ryan Christoffersen Status.im ID for Each Team Member (we will use this to contact you and your team) Scott - 0x04dde0f58253647e40db2008df0fcc5cbae10afa426fd15e00565ecb5e3edd6a3189c1be450f0b406e9a51f1a9b740b9869a30b232ac2694
authors:
  - Scott Street (@sprusr)
date: 2019-02-17
some_url: 
---

# Client-Side EthQL Library Generator



## Project Name

Client-Side EthQL Library Generator

## Project Tagline/Description (140 Characters Max. Will be used on table card for judging)

Buidl JavaScript libraries that interact with contracts via EthQL without custom servers

## Team Members. First and Last Names

Scott Street, Ryan Christoffersen

## Status.im ID for Each Team Member (we will use this to contact you and your team)

Scott - 0x04dde0f58253647e40db2008df0fcc5cbae10afa426fd15e00565ecb5e3edd6a3189c1be450f0b406e9a51f1a9b740b9869a30b232ac2694d2d7d6eacfce907163
Ryan - 0x04b6a985dfad67a11e5be0838c3502ddbe49052fd1e78fdc9b78d7bb811b4ba2e2f064dea6b04ef086072a6ad4c770bd23577decd338d2860c7697d8c90b6e4f56


## Detailed Project Description (no more than 3-4 sentences)

Run a command to generate an `apollo-client` based library for interacting with EthQL which includes human friendly client-side handling of contracts.

```sh
buidl --contracts ./contracts --output ./build
```

```gql
{
  CryptoKitties {
    totalSupply
    ownerOf(id: 1337) {
      address
      balance
    }
  }
}
```

(NB: the join-like feature for getting info about the owner above is not quite implemented yet! But very much doable in more time)

## Describe your tech stack (e.g., protocols, languages, API’s, etc.)

JavaScript throughout, generator uses ABI parser from [Tailor](https://github.com/JoinColony/tailor/), generated library uses `apollo-client` GraphQL library with `SchemaLink` middleware to intercept and transform queries - an entire GQL execution environment included!

## Track for which you’re submitting (Open or Impact)

Open

## All Bounties Completed/Incorporated

* Infura EthQL bounty

## A link to all your source code on a public repo (i.e. Github)

https://github.com/ryanchristo/lil-buidl



