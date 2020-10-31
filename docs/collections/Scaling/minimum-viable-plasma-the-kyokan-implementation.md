---
title: Minimum Viable Plasma - The Kyokan Implementation
summary: The issues around scaling Ethereum to high-throughput production use cases are well known. There are many solutions to this problem in progress, from state channels to side chains, but an additional complexity is safely transferring transactions between the Ethereum mainchain and these other locations. Plasma is a framework proposed by Joseph Poon and Vitalik Buterin to address this, and a handful of projects rapidly emerged to try and implement this proposal. Following this was a post from Vita
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-01-14
some_url: 
---

# Minimum Viable Plasma - The Kyokan Implementation

![](https://ipfs.infura.io/ipfs/QmWBCKBgWdsphqVaix1sAZ5ZZeAqwEPMBqf8zjUDDQLSnd)


The issues around scaling Ethereum to high-throughput production use cases are well known. There are many solutions to this problem in progress, from state channels to side chains, but an additional complexity is safely transferring transactions between the Ethereum mainchain and these other locations.

[Plasma](https://plasma.io) is a framework proposed by Joseph Poon and Vitalik Buterin to address this, and a handful of projects rapidly emerged to try and implement this proposal.

Following this [was a post](https://ethresear.ch/t/minimal-viable-plasma/426) from Vitalik outlining a minimal viable plasma (MVP) implementation that helped developers start working on a handful of programming language implementations of MVP.

[Plasma MVP](https://plasma.kyokan.io) by Kyokan is one of these implementations, written in Golang. For now, the project is focusing purely on payment use cases, and they may move onto generalized smart contracts in the future.

As the project is in development, you may experience problems installing and running it. You can find [full installation instructions](https://plasma.kyokan.io/docs/installation/) in the documentation, but at time of writing here's how you install on a Debian-based Linux distribution:

```
sudo apt-key adv --keyserver pgp.mit.edu --recv-keys 21052518
echo "deb <https://dl.bintray.com/kyokan/oss-deb> any main" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install plasma
```

Next deploy the [Plasma smart contract](https://github.com/kyokan/plasma/blob/develop/contracts/contracts/Plasma.sol) to an Ethereum node using [Truffle](https://truffleframework.com/) (or another method you prefer):

```
cd <KYOKAN_PLASMA_DIR>/contracts/
PRIVATE_KEY=<PRIVATE_KEY_HEX> HOST=<ETHEREUM_NODE> trufle migrate --network <NETWORK_NAME>
```

A plasma chain has of one root node that receives transactions (mints new blocks every 500 milliseconds), and running the `plasma start` command packages them into blocks to pass to the Ethereum blockchain. The creator of a Dapp typically runs this node, but [more hosted options](https://plasma.kyokan.io/docs/hosted-nodes/) are likely to emerge in the future.

You configure the Plasma node with command line arguments, or a YAML file and options include database location (LevelDB), keys, addresses, and ports. You can find [full details](https://plasma.kyokan.io/docs/configuration/) in the documentation. For example, the default which you can find in _/etc/plasma/config.yaml_:

```
db: "./database"
node-url: "http://localhost:9545"
contract-addr: "<CONTRACT_ADDRESS>"
private-key: "<PRIVATE_KEY>"
```

Pass any modified files with the `--config` parameter:

```
plasma --config ./local-config.yaml start
```

A plasma chain also contains any number of validator nodes responsible for verifying blocks that the root node emits and passing transactions from Dapp users to the root node. You start these nodes with the `plasma validate` command as processes part of the Dapp, or by 3rd parties for ultimate decentralized governance. The two node types communicate by a standard gRPC API.

Kyokan's Plasma MVP is planning to integrate the Plasma MVP smart contracts from [Fourth State](https://github.com/fourthstate/plasma-mvp-rootchain) once they have completed an audit by [Authio](https://authio.org). They also plan to start work on language SDKs in 2019, making it easier and more secure to integrate into your Dapps. Keep an eye on progress in the [Plasma MVP GitHub repository](https://github.com/kyokan/plasma).



---

- **Kauri original title:** Minimum Viable Plasma - The Kyokan Implementation
- **Kauri original link:** https://kauri.io/minimum-viable-plasma-the-kyokan-implementation/7f9e1c04f3964016806becc33003bdf3/a
- **Kauri original author:** Chris Ward (@chrischinchilla)
- **Kauri original Publication date:** 2019-01-14
- **Kauri original tags:** Plasma, Level-2
- **Kauri original hash:** QmU8LYz2tcJAcvLJVwWkH5hMZLfbvH1tSYBiwuQoz97ej1
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



