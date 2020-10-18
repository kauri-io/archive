---
title: Trustless.Health
summary: Trustless.Health (+ WebAssembly interpreter with Fully Homomorphic Encryption) Tagline- We present a WebAssembly interpreter with Fully Homomorphic Encryption to power a DApp for zero-knowledge analysis of sensitive medical data Team Members Jeppe Hallgren Andreas Rasmussen Mads Broegger Status.im ID for Each Team MemberJeppe- https-//get.status.im/user/0x042b65a02cd4b4081f3c5f9cc70dcb2df6a2573a74015190ea9ebad045d8e23de95d1c432f138cf3ec6e0be32bbc2613f53046d33db84e40897fbf2d1698746ea3 Andreas- ht
authors:
  - null (@null)
date: 2019-02-17
some_url: 
---

# Trustless.Health

![](https://ipfs.infura.io/ipfs/QmdHGyjmVbvZ5RsfoPNbg7ugzqxktpzMaxQmwGHR5MtC8L)


## Trustless.Health (+ WebAssembly interpreter with Fully Homomorphic Encryption)

**Tagline:** We present a WebAssembly interpreter with Fully Homomorphic Encryption to power a DApp for zero-knowledge analysis of sensitive medical data

### Team Members
- Jeppe Hallgren
- Andreas Rasmussen
- Mads Broegger

## Status.im ID for Each Team Member

```
Jeppe: https://get.status.im/user/0x042b65a02cd4b4081f3c5f9cc70dcb2df6a2573a74015190ea9ebad045d8e23de95d1c432f138cf3ec6e0be32bbc2613f53046d33db84e40897fbf2d1698746ea3
Andreas: https://get.status.im/user/0x04a86f7621a579e68c3615004ed1e9f5648ed1b0c171789171641093055a684b10b25ae945361bf10919c8e9b66180a4fdd4758686e885d5cd8b84994c075d6292
Mads: https://get.status.im/user/0x04866f5d2f6cdff75c6b24ee357d9647cadc7339ac342395c10bf20e6d8a30240d0930228a7d8021f6abb8c0fee3774353a41e53a9d07a4f5dfb044ed358f63213
```

## Detailed Project Description
Today, we are experiencing rapid growth in the amount of medical data collected - full genome sequencing, microbiome data, etc - and this presents an opportunity for machine learning algorithms to significantly improve health care. However, the current services require you to upload your medical data in clear text (unacceptable with regards to privacy) and lacks proper bench-marking. We introduce **Trustless.Health**, a decentralised and transparent platform for machine analysis of medical data based on top of Ethereum. We also present **fhe-wasm**, a WebAssembly interpreter with support for full homomorphic encryption, that backs all models on Trustless.Health meaning no user data (including the results of the analysis!) is ever revealed to the model service providers.

## Tech Stack
The core of Trustless.Health is the compute engine which runs all models using fully homomorphic encryption. To make sure the platform would support as many languages as possible, an interpreter, written on top of NuCypher's nuFHE package, was achieved that can execute models compiled for WebAssembly under FHE. In the **rust-example** directory, we show how a DNA analysis model written in Rust is compiled to WASM and then executed on encrypted input data using fhe-wasm.

The front-end, hosted at [https://trustless.health](https://trustless.health), is a React/Redux DApp written in typescript with ts-lint for strong type-safety. The web app uses axios to query a local Python server, which uses the nuFHE package to generate encryption keys as well as encrypting/decrypting of messages. Users should run this locally (see the client-server directory). The webapp is web3 compatible and should work out of the box with Metamask.

## Track
Open Track
## All Bounties Completed/Incorporated
NuCypher Bounty 1, using the NuCypher fully homomorphic encryption (nuFHE) library.
## Github
https://github.com/hallex/trustless-health


___



---

- **Kauri original title:** Trustless.Health
- **Kauri original link:** https://kauri.io/trustless.health/e129ae9b7863409e86ce18dbaf905d30/a
- **Kauri original author:** null (@null)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission, bounty-nucypher-2019
- **Kauri original hash:** QmeN2CKHpxtdpbL8M48sQuN4vJRhySdCFd7y3CJAtMsPC8
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



