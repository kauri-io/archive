---
title: Building and Working with Facebook’s Cryptocurrency Libra
summary: EDIT- I work at ConsenSys Academy, creating educational content similar to this. I teach developers and non-developers on how to use the Ethereum Blockchain. If you enjoy this content on Libra and want to learn more about blockchain, I highly recommend you sign up for the Developer Program On-Demand. Even though Facebooks name is hard to find on the Libra website, the long term plan is for it to integrate with their forthcoming Calibra wallet, and then, the whole game plan might make more sense.
authors:
  - Coogan (@cooganb)
date: 2019-07-02
some_url: 
---

# Building and Working with Facebook’s Cryptocurrency Libra

_EDIT: I work at ConsenSys Academy, creating educational content similar to this. I teach developers and non-developers on how to use the Ethereum Blockchain. If you enjoy this content on Libra and want to learn more about blockchain, I highly recommend you sign up for [the Developer Program On-Demand.](https://learn.consensys.net/catalog/info/id:141?utm_source=kauri&utm_medium=post&utm_campaign=libra)_

Even though Facebook's name is hard to find on [the Libra website](https://libra.org), the long term plan is for it to integrate with their forthcoming [Calibra wallet](https://newsroom.fb.com/news/2019/06/coming-in-2020-calibra/), and then, the whole game plan might make more sense. For now, the intention of Libra appears to a global currency, maybe for those who have little access to banks, or maybe for the global citizens of Facebook.

With partnerships with major "old finance" enterprises on board such as Mastercard, PayPal, Stripe and Visa, it's hard to know if Libra will be the injection that cryptocurrencies have always needed or the end of cryptocurrencies as we all know them.

We don't know for now, but in this post, we take a quick look through the getting started guide for the project and what we can accomplish with it. This is early days for the project, and we tested quickly, so some details are missing.

## Setup

![](https://api.kauri.io:443/ipfs/QmVQ4zYoysUEc4bB1U59eVBF284NVT7hEbBhCiFVQmV9Zo)

We followed [the setup instructions in the documentation](https://developers.libra.org/docs/my-first-transaction#clone-and-build-libra-core) on macOS which worked with out any issues and downloaded any dependencies missing from our local system.

We noticed that Libra is using [rocksdb](https://rocksdb.org) for storage, which is unsurprising as it's a popular option and also created by Facebook. There are other dependencies, mostly used for cryptography and storage, you can see the full list in the various _Cargo.toml_ files in the repository. Which also shows that most of Libra is written in Rust. Interestingly we noticed that Libra uses the [Rust Bitcoin hashes](https://github.com/rust-bitcoin/bitcoin_hashes) project for hashing, plus a handful of Parity labs modules.

![](https://api.kauri.io:443/ipfs/QmYkHTwBEuNrEJD9VpPJySN5VRPbvm9naoioQ3We2tQCr7)

![](https://api.kauri.io:443/ipfs/QmVeFKQwJoKAGzmPbqx8ZwbbiJkKzhYCc5Vke7n1cRATab)

## Build and connect

After setup, [you can build the CLI client and connect to the testnet](https://developers.libra.org/docs/my-first-transaction#build-libra-cli-client-and-connect-to-the-testnet). This takes some time and uses a reasonable amount of your computer resources, but again completed with no issues. At the end of the build process, your local machine connects to a validator node and provides you with an interface to the node.

![](https://api.kauri.io:443/ipfs/QmQ8yfWSAaw9VcfQgAEFzBe6QdyJrVtaKLXM9s8VoN2789)

[Next, we tried creating accounts](https://developers.libra.org/docs/my-first-transaction#create-alice-s-and-bob-s-account), which worked fine. There are three main functions: `account`, `query`, `transfer`; all of which are relatively self-explanatory. In this step of the tutorial, we create two accounts, each of which has their own index and hex address. You can use the index value instead of the address in other CLI commands to reference the account you want to interact with.

## Add coins

[Next, we add Libra coins using a time-honored faucet](https://developers.libra.org/docs/my-first-transaction#add-libra-coins-to-alice-s-and-bob-s-accounts). We noticed that the testnet faucet has a limit of 5 requests per minute, which is not realistic for a real-world payment option, hopefully, this is just testnet rate limiting.

![](https://api.kauri.io:443/ipfs/QmUtmEMhSd97NF7s7fqAfNJuZuMix3kgW8DGLAKCaYM4XY)

At this point, we also noticed that using the `query account_state 0` command returned a couple of interesting field values, including a `Blockchain version` value, a "sequence number" (kind of like a nonce). The account also had a state before we have yet pushed the account values to the blockchain. This is different from Ethereum or Bitcoin and means that either account generation must also have an event which pings testnet or that if it's a valid account number, Libra returns its balance as "none", but validates it's a compliant address.

![](https://api.kauri.io:443/ipfs/QmbbYY1b1iv2WgH8oAM4ZBDSVTJ1PpjC5dmAMvRwTU1ayi)

_Update 1: [Reading the technical whitepaper](chrome-extension://oemmndcbldboiebfnladdacbdfmadadm/https://developers.libra.org/docs/assets/papers/the-libra-blockchain.pdf) found this:_

_"The new account is created in the ledger state when a transaction sent from an existing account invokes the
`create_account(a)` Move [ed: Libra’s blockchain VM language] instruction. This typically happens when a transaction attempts to send Libra to an account at address a that has not yet been created"_

_Update 2: Blockchain Version seems more similar to block number. From the whitepaper:_

_"All data in the Libra Blockchain is stored in a single versioned database. A version number is an unsigned 64-bit integer **that corresponds to the number of transactions the system has executed."**_

## Submit transaction

[Next, we tried sending a transaction between accounts](https://developers.libra.org/docs/my-first-transaction#submit-a-transaction). This step reintroduces the sequence value mentioned above, as you can query the sequence to understand the number of transactions on each account so far. Once you have submitted the transaction, you can query for the status to find out when the validator node has accepted it. You can also use a "blocking transfer" to only return to the client when a validator node has validated a transaction.

## Summary

What's most interesting about Libra is that we're seeing how another set of engineers maybe not so steeped in the crypto-world would build a blockchain. That's not to say their choices are better or worse, but it's interesting.

Who knows what Facebook (sorry Libra's) aim with this new crypto currency is, but in the meantime, if you're working on a DeFi project, it may be a well engineered solution that's worth investigating.
