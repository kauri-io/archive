---
title: Signing messages with Nethereum
summary: The purpose of this article is to help .NET developers leverage Nethereum, An open source .NET integration library for blockchain. This document also exists as a Workbook , find more about workbooks installation requirements here Nethereum provides methods to sign messages in an Ethereum compatible format. The following is a quick guide to signing a string with Nethereum and verifying a signature using various methods. Ethereum signing basics In the Ethereum context, signing a message allows us
authors:
  - Gaël Blanchemain  (@anegg0)
date: 2019-06-06
some_url: 
---

# Signing messages with Nethereum



The purpose of this article is to help .NET developers leverage  [Nethereum](https://nethereum.com/), An open source .NET integration library for blockchain.

This document also exists as a [ Workbook ](https://github.com/Nethereum/Nethereum.Workbooks/blob/master/docs/nethereum-signing-messages.workbook), find more about workbooks installation requirements  [here](https://docs.microsoft.com/en-us/xamarin/tools/workbooks/install)

Nethereum provides methods to sign messages in an Ethereum compatible format. The following is a quick guide to signing a string with Nethereum and verifying a signature using various methods.

## Ethereum signing basics

In the Ethereum context, signing a message allows us to verify that a piece of data was signed by a specific account, in other terms, it's a way to prove to a smart contract/human that an account approved a message.

Signing a message with a private key does not require interacting with the Ethereum network. It can be done completely offline, hence the following code can be run without a testchain.

Nethereum provides with a class that can be used to sign or verify messages: `EthereumMessageSigner`.
Let's now explore how to use `EthereumMessageSigner` with two very common scenarios in the Ethereum context.

## Signing messages and verifying signatures with Nethereum

Let's first reference our assemblies and namespaces:

```csharp
#r "Nethereum.Web3"
```

```csharp
#r "Nethereum.ABI"
```

```csharp
using Nethereum.Web3;
using Nethereum.Util;
using System.Collections.Generic;
using System.Text;
using Nethereum.Signer;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.ABI.Encoders;
```

Now let's declare elements that we will in every of our examples:

**address** declares the signer's account address:

```csharp
var address = "0x12890d2cce102216644c59dae5baed380d84830c";
```

**msg1** declares the content of the message itself, here is a simple string:

```csharp
var msg1 = "wee test message 18/09/2017 02:55PM";
```

**privatekey** declares the private key of the signer’s **account**:

```csharp
var privateKey = "0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7";
```

**signer1** creates an instance of the **EthereumMessageSigner** object:

```csharp
var signer1 = new EthereumMessageSigner();
```

### 1-Encoding and signing a message using EncodeUTF8AndSign:

The most common scenario when signing a message goes as follows:

A message needs to be signed, it's most likely a string and hence can be encoded in UTF8 and then signed, therefore we will use `EncodeUTF8AndSign`

`EncodeUTF8AndSign` requires two arguments:

* The message itself

* The signing account's private key

```csharp
var signature1 = signer1.EncodeUTF8AndSign(msg1, new EthECKey(privateKey));
```

### 2- Verifying a signed message encoded in UTF8 using EncodeUTF8AndEcRecover:

The Ethereum signature verification process is a bit different from classical digital signatures, here the output of a signature verification is not the message (or the message hash) but the signer's address, since the address is a part of the public key hash.
Verification is successful if the recovered address is equal to the provided address, which can only happen if the signer is the owner of the account's private key.

In this case the **EncodeUTF8AndEcRecover** method is used to verify the signer's address of a message encoded in UTF8:

**addressRec1** evaluates to the signer's address, thus proving the validity of the message.

```csharp
var addressRec1 = signer1.EncodeUTF8AndEcRecover(msg1, signature1);
```

### 3-Hashing and signing a message using **HashAndSign**:

In some cases, hashing data and then signing it might be more relevant, i.e. when dealing with a large file.

**HashAndSign** enables you to do this in one go:

```csharp
var msg2 = "test";
var signer2 = new EthereumMessageSigner();
var signature2 = signer2.HashAndSign(msg2,
                "0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7");
```

### 4-Verifying a hashed message using **HashAndEcRecover**:

When receiving a signature that has been made with a hashed file it's necessary to start by hashing the file we want to verify and then recover the address that signed it.

**HashAndEcRecover** enables you to do this in one single step:

```csharp
var addressRec2 = signer2.HashAndEcRecover(msg2, signature2);
```
For more support get in touch with our community:  https://gitter.im/Nethereum/Nethereum
