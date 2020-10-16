---
title: Managing nonces with Nethereum
summary: The purpose of this article is to help .NET developers leverage Nethereum, An open source .NET integration library for blockchain. This document also exists as a Workbook, find more about workbooks installation requirements here. What are nonces? The nonce is an important component of a transaction, it is an attribute of a an address that represents the number of transactions sent by that address. Nonces act as counters that keeps track of the number of transactions sent by an account. Nonces ha
authors:
  - Gaël Blanchemain  (@anegg0)
date: 2019-06-06
some_url: 
---

The purpose of this article is to help .NET developers leverage  [Nethereum](https://nethereum.com/), An open source .NET integration library for blockchain.

This document also exists as a [Workbook](https://github.com/Nethereum/Nethereum.Workbooks/blob/master/docs/nethereum-managing-nonces.workbook), find more about workbooks installation requirements  [here](https://docs.microsoft.com/en-us/xamarin/tools/workbooks/install).

## What are nonces?

The nonce is an important component of a transaction, it is an attribute of a an address that represents the number of transactions sent by that address. Nonces act as counters that keeps track of the number of transactions sent  by an account.

Nonces have two functions:
1- Allowing to choose the order in which transactions will be executed.
2- Avoiding replay attacks.

In case 1, nonces enable to choose the order in which transactions will be executed by simply assigning nonces reflecting the order in which we want them processed (`0`for the first `1` for the second, etc...).
In case 2, nonces prevent an attacker from copying one of our transactions and resending it until the account is drained (replay attack). Nonces make each transaction unique: there can only be one single transaction with a specific nonce, once it's confirmed it cannot be "replayed".

For more details on transactions and nonces, we recommend [this article](https://github.com/ethereumbook/ethereumbook/blob/develop/06transactions.asciidoc#the-transaction-nonce) (and more generally, the [Ethereum Book](https://github.com/ethereumbook/ethereumbook))

## Common errors when working with nonces

Each node will process transactions from a specific account in a strict order according to the value of its nonce, hence the nonce value needs to be incremented precisely.

Keeping track of nonces is straightforward if all transactions originate from a single source/wallet handling the account, but things can get complicated if the account is managed by concurrent processes.
When several wallets handle transactions for the same account, duplicates and gaps can happen, resulting in transactions being cancelled or held off.

Errors can also occur when Geth or Parity clients update their pending transactions queue too slowly.

Two main errors can occur with nonces:

Error 1/ Reusing nonce: if we send two transactions with the same nonce from the same account, one of the two will be rejected.

Error 2/ Gaps: if we leave a gap between the nonces that are attributed to two consecutive transactions, the last transaction will not be processed until this gap is closed.

Let's take an example with a first transaction that would have nonce `123` and a second transaction with nonce `126`. In that example, the transaction with nonce `126` wouldn't be processed until transactions with nonces `124` and `125` are sent.

## How Nethereum helps managing nonces

Nethereum simplifies nonce management thanks to the `NonceService`.
The `NonceService` keeps track of pending transactions thus preventing the errors mentionned above the below demonstrates how to leverage it.

## Prerequisites:

In order to run the code in this workbook, we recommended the following setup:
First, download the test chain matching your environment from <https://github.com/nethereum/testchains>

Start a geth chain (geth-clique-linux\\, geth-clique-windows\\ or geth-clique-mac\\) using **startgeth.bat** (windows) or **startgeth.sh** (mac/linux). the chain is setup with the proof of authority consensus and will start the mining process immediately.

```csharp
#r "nethereum.web3"
```

```csharp
#r "nethereum.Accounts"
```

Then we will need to add `using` statements:

```csharp
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using Nethereum.Web3.Accounts.Managed;
using Nethereum.Signer;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.KeyStore;
using Nethereum.Hex.HexConvertors;
using Nethereum.Hex.HexTypes;
using Nethereum.RPC.NonceServices;
using Nethereum.RPC.TransactionReceipts;
using System.Threading.Tasks;
using Nethereum.RPC.Eth.Transactions;
using Nethereum.RPC.Eth.DTOs;
```

## Usage

In most cases, Nethereum takes care of incrementing the `nonce` automatically (unless you need to sign a raw transaction manually, we'll explain that in the next chapter).

Once you have loaded your private keys into your account, if Web3 is instantiated with that account, all the transactions will be made using the `TransactionManager`, Contract deployment or Functions will be signed offline using the latest nonce.

Example:
This example shows what happens to the `nonce` value when we send a transaction with a Nethereum account:

We first need to create an instance of an account, then use it to instantiate a `web3` object.

Let's first declare our new `Account`:

```csharp
var privateKey = "0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7";
var account = new Nethereum.Web3.Accounts.Account(privateKey);
```

* `web3` is the Web3 instance using the new `account` as constructor

```csharp
var web3 = new Web3(account);
```

We can now create an instance of the NonceService that will help us keep track of transaction.\
Please note: when using the TransactionManager the NonceService is started automatically. The below is mostly for the sake of demontration.

```csharp
account.NonceService = new InMemoryNonceService(account.Address, web3.Client);
```

Let's now examine what happens to the `nonce` value before and after we send a transaction:

### Before a transaction is sent:

The `NonceService` keeps track of all transactions, including the ones still pending, making it easy to assign the right nonce to a transaction about to be sent.

Here is how to return the current number of transaction for the `account` we declared earlier:

```csharp
var currentNonce = await web3.Eth.Transactions.GetTransactionCount.SendRequestAsync(account.Address, BlockParameter.CreatePending());
```

`actualNonce` includes the total number of transactions including the pending transactions which have been submitted but are yet to be confirmed.

It is also possible to return the next nonce that needs to be assigned to a future transaction, this nonce will be determined by the \`NonceService\` using the current nonce plus the pending transactions sent by our account:

```csharp
var futureNonce = await account.NonceService.GetNextNonceAsync();
```

Now, let's send a simple transaction, the right nonce will be automatically assigned to it by the `TransactionManager`:

```csharp
var recipientAddress = "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae";
var transaction = await web3.TransactionManager.SendTransactionAsync(account.Address, recipientAddress, new HexBigInteger(1));
```

#### After a transaction has been sent

Finally, using the NonceService, we can check if our transaction count has changed:

```csharp
currentNonce = await web3.Eth.Transactions.GetTransactionCount.SendRequestAsync(account.Address, BlockParameter.CreatePending());
```

As the above code demonstrates, the `nonce` was automatically incremented, thanks to the use of `TransactionManager`.

## Sending a transaction with an arbitrary nonce

There are scenarios where we might want to supply a Nonce manually, for example if we want to sign a transaction completely offline. Here is how to verify the number of transactions sent by an account:

Let's first create an object instance of `TransactionSigner`

```csharp
var OfflineTransactionSigner = new TransactionSigner();
```

We can now declare a variable representing the next nonce for our upcoming transaction:

```csharp
futureNonce = await account.NonceService.GetNextNonceAsync();
```

Finally, let’s sign our transaction offline:

```csharp
var encoded = OfflineTransactionSigner.SignTransaction(privateKey, recipientAddress, 10,futureNonce);
```

And finally, send our transaction:

```csharp
var txId = await web3.Eth.Transactions.SendRawTransaction.SendRequestAsync("0x" + encoded);
```


For more support get in touch with our community:  https://gitter.im/Nethereum/Nethereum
