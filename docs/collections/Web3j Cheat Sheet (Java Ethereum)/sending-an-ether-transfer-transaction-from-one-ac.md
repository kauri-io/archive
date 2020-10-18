---
title: Sending an Ether Transfer Transaction from One Account to Another in Web3j
summary: To transfer ether from one account to another, a transaction must be sent to the ethereum network. The easiest way to achieve this within your java application
authors:
  - Craig Williams (@craig)
date: 2019-12-18
some_url: 
---

# Sending an Ether Transfer Transaction from One Account to Another in Web3j


To transfer ether from one account to another, a transaction must be sent to the ethereum network.  The easiest way to achieve this within your java application is to use the useful `Transfer` class of web3j.

The below example transfers 1 ether from the seed phrase account to the `recipientAddress` account:

``` java
//Connect to node
//Defaults to http://localhost:8545
Web3j web3 = Web3j.build(new HttpService());  // defaults to http://localhost:8545/

//Generate wallet credentials from a mnemonic seed phrase
Credentials credentials = WalletUtils.loadBip39Credentials("password", "mnemonic");

//The address that the ether should be transferred to
String recipientAddress = "0xF0f15Cedc719B5A55470877B0710d5c7816916b1";

//The ether amount to transfer.
BigDecimal amountInEther = BigDecimal.valueOf(1.0);

//Send the transfer transaction.
//Unit conversion is handled automatically and this method blocks until the transaction has been mined.
TransactionReceipt transactionReceipt = Transfer.sendFunds(
        web3, credentials, recipientAddress,
        amountInEther, Convert.Unit.ETHER).send();
```

Note that there are multiple ways to generate wallet credentials.  For more imformation, check out [Managing an Ethereum Account with Java and Web3j.](https://kauri.io/manage-an-ethereum-account-with-java-and-web3j/925d923e12c543da9a0a3e617be963b4/a)