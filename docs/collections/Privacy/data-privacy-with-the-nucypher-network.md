---
title: Data Privacy with the NuCypher Network
summary: The NuCypher network uses the Umbral threshold proxy re-encryption scheme to provide cryptographic access controls for distributed apps and protocols. This article is adapted from the NuCypher documentationOverview Alice, the data owner, grants access to her encrypted data to anyone she wants by creating a policy and uploading it to the NuCypher network. Using her policy’s public key, any entity can encrypt data on Alice’s behalf. This entity could be an IoT device in her car, a collaborator ass
authors:
  - Kauri Team (@kauri)
date: 2019-06-06
some_url: 
---

# Data Privacy with the NuCypher Network


> The NuCypher network uses the Umbral threshold proxy re-encryption scheme to provide cryptographic access controls for distributed apps and protocols.

This article is adapted from the [NuCypher documentation](https://docs.nucypher.com/en/latest/)

###Overview

1. Alice, the data owner, grants access to her encrypted data to anyone she wants by creating a policy and uploading it to the NuCypher network.

2. Using her policy’s public key, any entity can encrypt data on Alice’s behalf. This entity could be an IoT device in her car, a collaborator assigned the task of writing data to her policy, or even a third-party creating data that belongs to her – for example, a lab analyzing medical tests. The resulting encrypted data can be uploaded to IPFS, Swarm, S3, or any other storage layer.

3. A group of Ursulas, which are nodes of the NuCypher network, receive the access policy and stand ready to re-encrypt data in exchange for payment in fees and token rewards. Thanks to the use of proxy re-encryption, Ursulas and the storage layer never have access to Alice’s plaintext data.

4. Bob, a data recipient, sends an access request to the NuCypher network. If the policy is satisfied, the data is re-encrypted to his public key and he can decrypt it with his private key.

More detailed information about the NuCypher network can be found here:

[GitHub](https://www.github.com/nucypher/nucypher)

[nucypher.com](https://www.nucypher.com/)

###Read the NuCypher whitepapers

#### Network

https://github.com/nucypher/whitepaper/blob/master/whitepaper.pdf

“NuCypher - A proxy re-encryption network to empower privacy in decentralized systems” by Michael Egorov, David Nuñez, and MacLane Wilkison - NuCypher

####Economics

https://github.com/nucypher/mining-paper/blob/master/mining-paper.pdf

“NuCypher - Mining & Staking Economics” by Michael Egorov, MacLane Wilkison - NuCypher

####Cryptography

https://github.com/nucypher/umbral-doc/blob/master/umbral-doc.pdf

“Umbral A Threshold Proxy Re-Encryption Scheme” by David Nuñez - NuCypher

###Guides

- [Nucypher Quickstart](https://docs.nucypher.com/en/latest/guides/quickstart.html)
- [NuCypher Federated Testnet (NuFT) Setup Guide](https://docs.nucypher.com/en/latest/guides/federated_testnet_guide.html)
- [Installation Guide](https://docs.nucypher.com/en/latest/guides/installation_guide.html)
- [Ursula Configuration Guide](https://docs.nucypher.com/en/latest/guides/ursula_configuration_guide.html)
- [Contributing](https://docs.nucypher.com/en/latest/guides/contribution_guide.html)
- [NuCypher Character Control Guide](https://docs.nucypher.com/en/latest/guides/character_control_guide.html)
- [NuCypher Staking Guide](https://docs.nucypher.com/en/latest/guides/staking_guide.html)
- [Deployment Guide](https://docs.nucypher.com/en/latest/guides/deployment_guide.html)

###Demos

- [Local Development Fleet Testing](https://docs.nucypher.com/en/latest/demos/local_fleet_demo.html)
- [Finnegan’s Wake Demo](https://docs.nucypher.com/en/latest/demos/finnegans_wake_demo.html)
- [Heartbeat Demo](https://docs.nucypher.com/en/latest/demos/heartbeat_demo.html)
