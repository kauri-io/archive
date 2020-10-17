---
title: Gorli Testnet
summary: Görli is a Proof of Authority testnet that can support popular Ethereum clients such as Parity and Geth. Görli bridges the isolation between clients due to using the PoA consensus mechanism. The team managed to have the testnet implemented in Parity and with the Aura PoA consensus work initiated in Geth. You can check it out here.The end of the hackathon is only the beginning of the team’s journey of creating one PoA testnet for all clients- after ETHBerlin the team plans to solidify their curre
authors:
  - Kauri Team (@kauri)
date: 2018-09-24
some_url: 
---

# Gorli Testnet

Görli is a Proof of Authority testnet that can support popular Ethereum clients such as Parity and Geth. Görli bridges the isolation between clients due to using the PoA consensus mechanism. The team managed to have the testnet implemented in Parity and with the Aura PoA consensus work initiated in Geth. You can check it out here.The end of the hackathon is only the beginning of the team’s journey of creating one PoA testnet for all clients: after ETHBerlin the team plans to solidify their current Go implementation of Aura in Geth, launch the first cross client PoA testnet for the Ethereum network and begin work on implementing Clique (Geth’s PoA mechanism) in Parity to allow for two cross-client PoA testnets. - Cassandra Shi (ECF)

[PDF Slides](https://github.com/ethberlin-hackathon/Talks-presentations/blob/master/resources/goerli-testnet/goerli-testnet.pdf)

https://devpost.com/software/gorli-testnet

![](https://api.beta.kauri.io:443/ipfs/QmcgaLe43UHUAzX6UhVmz7RS6NhstoAeqBt3cHwvkHLjzV)

### Inspiration
To build a cross client Proof of Authority testnet. Currently there is a reliance on testnets that are completely isolated from interacting with other clients due to the differing PoA consensus mechanisms.

### What it does
Currently we have our testnet implemented in Parity --chain=goerli , with the Aura consensus mechanism implemented in Geth with --goerli initiated.

### How we built it
We built it by writing an EIP that defined the Aura specification in detail, while implementing the spec in Go. Currently you can view the nodes at http://ethstats.goerli.ethberl.in:3000.

### Challenges we ran into
The major challenged came with creating a genesis block that is identical in both clients. The block hashes of the headers were the major challenge.

### Accomplishments that we're proud of
Beginning the journey of creating one PoA testnet for all clients. We plan on continuing with the project and creating a cross-client PoA testnet.

### What we learned
We learned a lot about PoA consensus algorithms and the difficulty with syncing two clients that implement different features.

### What's next for Görli Testnet
Next we plan on solidifying our current Go implementation of Aura in Geth. From there we plan on launching the first cross client PoA testnet for the Ethereum network. After that, we will begin work on implementing Clique (Geth's PoA mechanism) in Parity to allow for two cross-client PoA testnets.

### Try It Out
[http://ethstats.goerli.ethberl.in:3000/](http://ethstats.goerli.ethberl.in:3000/)

[GitHub Repo](https://github.com/goerli)