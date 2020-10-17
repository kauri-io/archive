---
title: Nethereum - An open source .NET integration library for blockchain
summary: Nethereum is the .Net integration library for Ethereum, simplifying the access and smart contract interaction with Ethereum nodes both public or permissioned like Geth, Parity or Quorum. Features Nethereum provides- JSON RPC / IPC Ethereum core methods. Geth management API (admin, personal, debugging, miner). Parity management API. Quorum integration. Simplified smart contract interaction for deployment, function calling, transaction, event filtering and decoding of topics. Unity 3d integration.
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-03-01
some_url: 
---

Nethereum is the .Net integration library for Ethereum, simplifying the
access and smart contract interaction with Ethereum nodes both public or
permissioned like Geth, [Parity](https://www.parity.io/)
or [Quorum](https://www.jpmorgan.com/global/Quorum).

## Features

Nethereum provides:

- JSON RPC / IPC Ethereum core methods.
- Geth management API (admin, personal, debugging, miner).
- [Parity](https://www.parity.io/) management API.
- [Quorum](https://www.jpmorgan.com/global/Quorum) integration.
- Simplified smart contract interaction for deployment, function calling, transaction, event filtering and decoding of topics.
- [Unity 3d](https://unity3d.com/) integration.
- ABI to .Net type encoding and decoding, including attribute based for complex object deserialization.
- HD wallet
- Transaction, RLP and message signing, verification and recovery of accounts.
- Libraries for standard contracts Token, [ENS](https://ens.domains/) and [Uport](#)
- Integrated TestRPC testing to simplify TDD and BDD (Specflow) development.
- Key storage using Web3 storage standard, compatible with Geth and Parity.
- Simplified account life cycle for both managed by third party client (personal) or stand alone (signed transactions).
- Low level Interception of RPC calls.
- Code generation of smart contracts services.

## Getting started

### Install .Net

Nethereum works with .Net Core or .Net Framework (from 4.5.1 upwards).You need to have the .Net SDK installed. For new starters or Mac and Linux users we
recommend .Net core.

### Create your app

Create a project using the .Net CLI or create a project in Visual Studio.

```shell
dotnet new console -o NethereumSample
cd NethereumSample
```

### Add package reference to Nethereum.Web3

```shell
dotnet add package Nethereum.Web3
```

### Open your IDE

Visual Studio Code or Visual Studio are both good choices for .Net
development. Other good IDEs are also available (Jet Brains Rider
etc).

Open the _Program.cs_ file in the IDE or editor.

## Code First Steps

First, the code adds required namespaces for Nethereum:

```csharp
using Nethereum.Web3;
```

Next it creates an instance of Web3, with the infura url for
mainnet.

```csharp
var web3 = new Web3("https://mainnet.infura.io");
```

And then you can use the Ethereum API via Nethereum to interact with accounts and transactions.

## Next Steps

- [Read the Nethereum Getting Started guide](https://nethereum.readthedocs.io/en/latest/getting-started/)
- [The full Nethereum documentation](https://nethereum.readthedocs.io/en/latest/)
