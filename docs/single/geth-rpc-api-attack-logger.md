---
title: Geth RPC-API Attack Logger
summary: Project Name Geth RPC-API Attack Logger (graal?) Project Tagline/Description (140 Characters Max. Will be used on table card for judging) An Ethereum RPC-API medium-interaction honeypot for gathering attack information. Team Members. Todd Garrison Marcus Tetreault Cameron Merrick Status.im ID Right Uniform Grayling https-//get.status.im/user/0x04fb2e877483e93d1b3cbb55db5e1dc67baf0f47f4b7226fa51d48c408dc101204714345d9a2fc381f7ae48e8c775a94a0ac5985b374e6f02a24152645f819f140 (Todd) Detailed Project
authors:
  - Todd Garrison (@frameloss)
date: 2019-02-17
some_url: 
---

# Geth RPC-API Attack Logger



## Project Name
Geth RPC-API Attack Logger (graal?)

## Project Tagline/Description (140 Characters Max. Will be used on table card for judging)
An Ethereum RPC-API medium-interaction honeypot for gathering attack information.

## Team Members.
* Todd Garrison
* Marcus Tetreault
* Cameron Merrick

## Status.im ID
* `Right Uniform Grayling` https://get.status.im/user/0x04fb2e877483e93d1b3cbb55db5e1dc67baf0f47f4b7226fa51d48c408dc101204714345d9a2fc381f7ae48e8c775a94a0ac5985b374e6f02a24152645f819f140 (Todd)

## Detailed Project Description (no more than 3-4 sentences)

At some point many of us have left an RPC-API port open, perhaps by accident, or just out of curiosity. This is a project to assist in gathering data around what attacks take place when that happens, including the IP addresses involved, and the destination addresses the attackers use. 

## Describe your tech stack (e.g., protocols, languages, API’s, etc.)

* Docker is used to start a geth light client, and a custom proxy.
* The proxy is a simple golang service that provides logging, uses a kvs (bboltdb) to keep a running count of request types, and rewrites a few API calls that attackers find enticing, such as having an unlocked wallet. 
* The logs are intended to be ingested into elasticsearch for more analysis.
* A simple stats.json file is created by the proxy, with the intent that this could be pushed into s3. This json file drives a (very simple) vue2 dashboard to show information about what IP addresses, what RPC methods, or the destination addresses for attempted outgoing transfers.

## Track: Open

## No bounties

## A link to all your source code on a public repo (i.e. Github)

https://github.com/frameloss/ethdenver2019









---

- **Kauri original title:** Geth RPC-API Attack Logger
- **Kauri original link:** https://kauri.io/geth-rpc-api-attack-logger/737d186d4a074d6d8a696ab75805cc14/a
- **Kauri original author:** Todd Garrison (@frameloss)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission
- **Kauri original hash:** Qme9VMd1HzN228HiTFb8MiCnxJGrq3rgJWAPqQK8yzGbHV
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



