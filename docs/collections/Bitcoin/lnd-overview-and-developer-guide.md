---
title: LND Overview and Developer Guide
summary: This article originally appeared on the Lighting Labs developer blog Introduction The LND Overview and Developer Guide aims to provide just enough information about LND to enable readers to build applications. It start with a conceptual review of the Lightning Network, before jumping into the important aspects of working with specifically LND. If you are already comfortable with how the Lightning Network works, feel free to skip down to the Components section. The command line examples are for i
authors:
  - Kauri Team (@kauri)
date: 2019-05-29
some_url: 
---

# LND Overview and Developer Guide

_This article originally appeared on the Lighting Labs [developer blog](https://dev.lightning.community/overview/)_
### Introduction

The LND Overview and Developer Guide aims to provide _just_ enough information about LND to enable readers to build applications. It start with a conceptual review of the Lightning Network, before jumping into the important aspects of working with specifically LND. If you are already comfortable with how the Lightning Network works, feel free to skip down to the [Components](#components) section. The command line examples are for illustrative purposes only and will be covered in more depth in the [installation guide](https://dev.lightning.community/guides/installation/) and [tutorial](https://dev.lightning.community/guides/installation/tutorial/).

#### Preliminaries

This overview assumes basic knowledge of Bitcoin mechanics. If terms like “UTXO” and “locktime” are unfamiliar to you, you should refer to the [Bitcoin developer guide](https://bitcoin.org/en/developer-guide), which serves a similar purpose.

### Table of Contents

*   [Lightning Network](#lightning-network)
*   [Payment Channels](#payment-channels)
    *   [Channel Updates](#channel-updates)
*   [Multihop payments](#multihop-payments)
*   [Network Topology](#network-topology)
*   [Integration Guidelines](#integration-guidelines)
*   [Components](#components)
    *   [Network Layers](#network-layers)
    *   [Software Components](#software-components)
    *   [LND Interfaces](#lnd-interfaces)
*   [Channel Lifecycle](#channel-lifecycle)
*   [Payment Lifecycle](#payment-lifecycle)
    *   [Payment Requests](#payment-requests)
    *   [Payment flow](#payment-flow)
*   [Conclusion](#conclusion)

![Lightning Network Graph](http://imgur.com/xqfllBI.png)

### Lightning Network

The Lightning Network scales blockchains and enables trustless instant payments by keeping most transactions off-chain and leveraging the security of the underlying blockchain as an arbitration layer.

This is accomplished primarily through “payment-channels”, wherein two parties commit funds and pay each other by updating the balance redeemable by either party in the channel. This process is instant and saves users from having to wait for block confirmations before they can render goods or services.

Payment channels are trustless, since any attempt to defraud the current agreed-upon balance in the channel results in the complete forfeiture of funds by the liable party.

By moving payments off-chain, the cost of opening and closing channels (in the form of on-chain transaction fees) is ammortized over the volume of payments in that channel, enabling micropayments and small-value transactions for which the on-chain transaction fees would otherwise be too expensive to justify. Furthermore, the Lightning Network scales not with the transaction throughput of the underlying blockchain, but with modern data processing and latency limits - payments can be made nearly as quickly as packets can be sent.

Hash Time-Locked Contracts (HTLCs) allow transactions to be sent between parties who do not have a direct channels by routing it through multiple hops, so anyone connected to the Lightning Network is part of a single, interconnected global financial system.

In short, the Lightning Network enables scalable blockchains through a high-volume of instant transactions not requiring custodial delegation.

### Payment Channels

Payment channels are the main workhorse of the Lightning Network. They allow multiple transactions to be aggregated into just a few on-chain transactions.

In the vast majority of cases, someone only needs to broadcast the first and last transaction in the channel.

*   The Funding Transaction creates the channel. During this stage, funds are sent into a multisig address controlled by both Alice and Bob, the counterparties to the channel. This address can be funded as a single-payer channel or by both Alice and Bob.
*   The Closing Transaction closes the channel. When broadcast, the multisig address spends the funds back to Alice and Bob according to their agreed-upon channel amount.

![Commitment transaction Alice 5BTC Bob 5BTC](http://imgur.com/rqHWEoC.png)

In the case where either party attempts to defraud the other, a third transaction, which punishes the attacker, will end up being broadcasted on-chain. Let’s investigate how this is possible by the way Lightning does channel updates.

#### Channel Updates

In between the opening and closing transactions broadcast to the blockchain, Alice and Bob can create a near infinite number of intermediate closing transactions that gives different amounts to the two parties.

For example, if the initial state of the channel credits both Alice and Bob with 5BTC out of the 10BTC total contained in the multisig address, Alice can make a 1BTC payment to Bob by updating the closing transaction to pay 4BTC/6BTC, where Alice is credited with 4BTC and Bob with 6BTC. Alice will give the signed transaction to Bob, which is equivalent to payment, because Bob can broadcast it at any time to claim his portion of the funds. Similarly, Alice is also able to broadcast the closing transaction at any time to claim her funds.

![Channel Update Alice 4BTC Bob 6BTC](http://imgur.com/auACasH.png)

To prevent an attack where Alice voids her payment by broadcasting the initial state of 5BTC/5BTC, there needs to be a way to revoke prior closing transactions. Payment revocation roughly works like the following.

When Alice broadcasts a closing transaction to the blockchain, she is attesting to the current state of the chain. But since there may be millions of closing transactions in a channel, all of which are valid, the blockchain itself can’t tell if what Alice attested to was indeed the correct state. Therefore, Alice must wait 3 days after broadcasting the closing transaction before she can redeem her funds. During this time, Bob is given a chance to reveal a secret that will allow him to sweep Alice’s funds immediately. Alice can thus revoke her claim to the money in some state by giving Bob the secret to the closing transaction. This allows Bob to take all of Alice’s money, but only if Alice attest to this old state by broadcasting the corresponding closing transaction to the blockchain.

Channel updates are thus fully trustless. When making an update, both parties exchange the secrets for the prior state, so that all prior states will have been revoked except for the current state. Both parties will never broadcast an old state, because they know the other party can take all their money if they do so.

### Multihop payments

Single channels work well if you have a financial relationship with some entity where you make payments frequently or in metered amounts. But most payments, like purchasing an umbrella from a corner store because you lost it again, are one-off. For Lightning to help Bitcoin scale for general use cases, there needs to be a way for the whole network to forward payments through channels that already exist. Furthermore, this process should retain the trustless nature of individual channels, otherwise it becomes too hard to identify dishonest actors amongst a large number of hops.

Once you don’t have to trust the intermediaries, you no longer even care who they are. This allows Lightning nodes to be fully anonymous, which is a huge win for privacy.

Concretely, Suppose Alice has a channel with Bob, who has a channel with Carol, who has a channel with Dave: `A<->B<->C<->D`. How can Alice pay Dave?

Alice first notifies Dave that she wants to send him some money.

In order for Dave to accept this payment, he must generate a random number `R`. He keeps `R` secret, but hashes it and gives the hash `H` to Alice.

![Dave gives hash H to Alice](http://imgur.com/sXuL8Tn.png)

Alice tells Bob: “I will pay you if you can produce the preimage of `H` within 3 days.” In particular, she signs a transaction where for the first three days after it is broadcast, only Bob can redeem it with knowledge of R, and afterwards it is redeemable only by Alice. This transaction is called a Hash Time-Locked Contract (HTLC) and allows Alice to make a conditional promise to Bob while ensuring that her funds will not be accidentally burned if Bob never learns what R is. She gives this signed transaction to Bob, but neither of them broadcast it, because they are expecting to clear it out later.

![Alice creates HTLC with Bob](http://imgur.com/aNQoA9Z.png)

Bob, knowing that he can pull funds from Alice if he knows R, now has no issue telling Carol: “I will pay you if you can produce the preimage of H within _2_ days.”

Carol does the same, making an HTLC that will pay Dave if Dave can produce R within 1 day. However, Dave does in fact know R. Because Dave is able to pull the desired amount from Carol, Dave can consider the payment from Alice completed. Now, he has no problem telling R to Carol and Bob so that they are able to collect their funds as well.

![Dave distributes R](http://imgur.com/nTLWBbm.png)

Now, everyone can clear out, because they have a guaranteed way to pull their deserved funds by broadcasting these HTLCs onto Bitcoin’s network (i.e. on-chain). They would prefer not to do that though, since broadcasting on-chain is more expensive, and instead settle each of these hops off chain. Alice knows that Bob can pull funds from her since he has `R`, so she tells Bob: “I’ll pay you, regardless of `R`, and in doing so we’ll terminate the HTLC so we can forget about R.” Bob does the same with Carol, and Carol with Dave.

![Everyone terminates their HTLCs](http://imgur.com/iRx4bf5.png)

Now, what if Dave is uncooperative and refuses to give `R` to Bob and Carol? Note that Dave must broadcast the transaction from Carol within 1 day, and in doing so must reveal R in order to redeem the funds. Bob and Carol can simply look at the blockchain to determine what R is and settle off-chain as well.

We have shown how to make a payment across the Lightning Network using only off-chain transactions, without requiring direct channel links or trusting any intermediaries. As long as there is a path from the payer to the payee, payments can be routed, just like the Internet.

### Network Topology

The expected shape / network topology of the Lightning Network will depend on behavior implemented in the varying Lightning implementations as well as actual usage. Users do not have to manually manage their channels, since `lnd` has an ‘autopilot’ feature including settings optimizing for both everyday use and fee revenue. And of course, channels can be opened on demand via the standard command line, gRPC, and REST interfaces.

### Integration guidelines

When integrating `lnd`, hot and cold storage must be considered. To maximize security, we generally want to keep as little as possible in hot wallets, and as much as possible in cold wallets.

It is possible to construct Lightning channels where the keys are cold, but they would need to be brought back online you conduct a channel update. Only with hot wallets can the Lightning Network attain a high volume of transactions.

This is only a surface level introduction to Lightning integration. For a more illustrative example of how Lightning Network may work in production, check out the “Integration Components” and “Security Considerations” sections of the [Exchange Integration Document](https://docs.google.com/document/d/1r38-_IgtfOkhJh4QbN7l6bl7Rol05qS-i7BjM3AjKOQ/edit) maintained by Bryan Vu.

### Components

#### Network Layers

The Lightning Network is an _overlay_ network on top of another blockchain. To avoid confusion it is crucial to differentiate between the following network layers we encounter when reasoning about `lnd`:

*   Bitcoin/Litecoin Network: This is the underlying blockchain that `lnd` rests on top of. `lnd` needs a way to communicate with the underlying blockchain in order to send on-chain payments, create channel open/close transactions, and watch for events on the blockchain.
*   P2P Network: This is the peer layer where `lnd` nodes add each other as peers so they can send messages between one another via an [encrypted connection](https://github.com/lightningnetwork/lightning-rfc/blob/master/08-transport.md). For example, the `lncli connect` adds a peer, which are identified by identity pubkey and IP address.
*   Payment channel network: This is the layer where nodes are connected by payment channels. For example, the `lncli openchannel` command opens a channel with a node that was already connected at the peer layer, and the `lncli describegraph` command returns the list of edges and vertices of the payment channel graph.

#### Software Components

There are distinct software components we should be aware of when developing on

*   `btcd` / `btcutil`: `lnd` currently uses [`btcd` roasbeef fork](https://github.com/roasbeef/btcd) to interface with the underlying blockchain. `btcd` comes with `btcutil`, also [roasbeef fork](https://github.com/Roasbeef/btcutil), that allows us to drive `btcd` from the command line.
*   `lnd` / `lncli`: LND stands for Lightning Network Daemon and serves as the main software component driving the Lightning Network. It manages a database, connects to peers, opens / closes channels, generates payment invoices, sends, forwards, and revokes payments, responds to potential breaches, and more. `lncli` opens up a command line interface for driving `lnd`.
*   [Neutrino](https://github.com/lightninglabs/neutrino) is an experimental Bitcoin light client designed to support Lightning mobile clients. This is a wallet UI usable with `lnd`. Neutrino is not required from an application development standpoint, but can be regarded as the primary way the LND end user interacts with the Lightning Network and thus and applications built on top of it.

#### LND Interfaces

There are several ways to drive `lnd`.

*   `lncli` is the `lnd` command line tool. All commands are executed instantaneously. A full list of commands can be viewed with `lncli --help`. To see a breakdown of the parameters for a particular command, run `lncli <command> --help`
*   gRPC is the preferred programmatic way interact with `lnd`. It includes simple methods that return a response immediately, as well as response-streaming and bidrectional streaming methods. Check out the guides for working with gRPC for [Python](https://dev.lightning.community/guides/installation/guides/python-grpc/) and [Javascript](https://dev.lightning.community/guides/installation/guides/javascript-grpc/)
*   LND also features a REST proxy someone can use if they are accustomed to standard RESTful APIs. However, gRPC is higher performance and can provide real-time notifications.

All of these LND interfaces are documented in the [API Reference](https://api.lightning.community), featuring a description of the parameters, responses, and code examples for Python, Javascript, and command line arguments if it exists.

### Channel Lifecycle

To better understand the development workflow around Lightning channels, it is worthwhile to examine step by step the lifecycle of a payment channel. It contains roughly 4 steps:

1.  **Adding a peer.** Before a channel can be opened between two Lightning nodes, they must first be able to securely communicate with each other. This is accomplished with the `ConnectPeer` RPC method or `connect` on `lncli`.

```
lncli connect <PUBKEY>@<HOST>:<PORT>
```

2.  **Initiating Channel Opening.** The `OpenChannel` method begins the channel opening process with a connected peer. Lightning assumes that this is led by a single party. The opening party can specify a local amount, representing the funds they would like to commit to the channel, and a “push” amount, the amount of money that they would like to give to the other side as part of an initial commitment state. One could imagine that instead of sending a standard Bitcoin transaction to pay a merchant, they could instead open a channel with the push amount representing the amount they want to pay, and optionally add some funds of their own, so that both parties can benefit from having a channel available for payments in the future.

```
lncli openchannel --node_key=<ID_PUBKEY> --local_amt=<AMOUNT>
```

![Lightning Wallet App Open Channel](http://i.imgur.com/d5a7DBn.png)

3.  **Wait for confirmations.** To prevent double spending attacks on the channel opening transaction, users should specify the `--block` `lncli` command line argument. So after initializing the channel opening process, it is often required to mine a few blocks:

```
btcctl generate 6
```

4.  **Close Channel.** If either party in a channel no longer wants to keep it open, they can close it at any time with the `CloseChannel` method.

```
lncli closechannel --funding_txid=<funding_txid> --output_index=<output_index>
```

### Payment Lifecycle

Because Lightning payments are instant, its API tends to be much simpler, since there is no need to wait for block confirmations before a payment is considered accepted. It resembles a fairly standard payment flow, but there are a few additional things to keep in mind.

#### Payment Requests

Payment requests, often also referred to as Invoices, are a simple, extensible protocol compatible with QR-codes. It includes a 6-character checksum in case there is a mistake with copy/paste or manual entry.

Payment requests are composed of two sections:

1.  **Human readable part:** Contains a prefix `ln` followed by an optional amount.
2.  **Data part**: Contains a UTC Unix timestamp and optionally some tagged parts, as well as a signature over the human readable and data parts.
    *   Tagged parts include a payment hash, the pubkey of the payee node, a description of the purpose of payment, an expiration time (default to 1 hour if not specified), and extra routing information. Some tagged parts are required and others are not.

Because the payment request contains the payment hash, **payment requests must be strictly single use**. After an invoice is fulfilled, the hash preimage becomes publically known. An attacker could save the preimages they’ve seen and reuse it for another payment that is reusing the invoice. Therefore, **failure to generate new payment requests means that an on-path attacker can steal the payment en route.**

Another detail worth noting is that payees should not accept payments after the payment request has expired (`timestamp` + `expiry`), and payers likewise should not attempt them. This will affect any web application with `lnd` integration, since if an invoice for a good or service is not fulfilled within the given timeframe, a new one should be generated.

Other possibly unexpected rules include that the payee should accept up the twice the amount encoded in the transaction, so that the payer can make payments harder to track by adding in small variations.

A full specification of the payment request data format, required and optional parts, and required behavior can be found in [BOLT 11](https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md).

#### Payment flow

Let’s now see what an ideal payment flow looks like.

1.  **Create Invoice:** The recipient creates an invoice with a specified value, expiration time, and an optional memo. If there was already an invoice created for this good and it expired, or a sufficient amount of time has elapsed, a fresh invoice should be generated.

```
lncli addinvoice --amt=6969 --memo="A coffee for Roger"
```

    ![Lightning Wallet Generate Payment Request](http://i.imgur.com/1xYB9Yq.png)

2.  **Check invoice:** The payer decodes the invoice to see the destination, amount and payment hash. This way, they can validate that the invoice was legitimate, and that they aren’t being defrauded or overcharged. At this stage, the user should also check that the expiration time of the invoice has not passed

```
lncli decodepayreq --pay_req=<PAY_REQ>
```

3.  **Send payment:** The payer sends their payment, possibly routed through the Lightning Network. Developers can do this through an LND interface and end users can use the desktop or mobile app.

```
lncli sendpayment --pay_req=<PAY_REQ>
```

    ![Lightning Wallet send payment screen](http://i.imgur.com/AQMRsZ3.png)

4.  **Check payment:** The recipient checks that their invoice has been fulfilled. They make a call to the `LookupInvoice` command, which returns this information in the `settled` field.

```
lncli lookupinvoice --rhash=<R_HASH>
```

    ![Lightning Wallet 5BTC Received](http://i.imgur.com/Yu8EaBf.png)

We have now covered the basic workflow for generating invoices and sending/receiving payments.

### Conclusion

You have completed the conceptual overview of LND and a high level primer on the components and workflows. To get started on developing, check out the [installation guide](https://dev.lightning.community/guides/installation/guides/installation/) and [tutorial](https://dev.lightning.community/guides/installation/tutorial/).
