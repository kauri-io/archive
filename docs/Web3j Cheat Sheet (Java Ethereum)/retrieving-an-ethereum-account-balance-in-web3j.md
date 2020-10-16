---
title: Retrieving an Ethereum Account Balance in Web3j
summary: Balance at Current Block To obtain the balance of an account in java with web3j at the current block, the following code snippet can be used //Connect to node.
authors:
  - Craig Williams (@craig)
date: 2019-12-18
some_url: 
---

## Balance at Current Block

To obtain the balance of an account in java with web3j at the current block, the following code snippet can be used:



``` java
//Connect to node.
//Defaults to http://localhost:8545
Web3j web3 = Web3j.build(new HttpService());

//Get balance result synchronously
EthGetBalance balanceResult = web3.ethGetBalance("0xF0f15Cedc719B5A55470877B0710d5c7816916b1", 
	DefaultBlockParameterName.LATEST).send();

//Obtain the BigInteger balance representation, in the wei unit.
BigInteger balanceInWei = balanceResult.getBalance();
```

## Balance at a Specific Block

The below code snippet will obtain the account balance at block 300000:

``` java
Web3j web3 = Web3j.build(new HttpService());

EthGetBalance balanceResult = web3.ethGetBalance("0xF0f15Cedc719B5A55470877B0710d5c7816916b1", 
new DefaultBlockParameterNumber(300000)).send();

BigInteger balanceInWei = balanceResult.getBalance();
```

Balances are returned in the smallest denomination, called `wei`.  To convert to other denominations, such as `ether`, see this [cheetsheet article.](https://kauri.io/converting-between-ether-units-denominations-in-web3j/ecfdb383843b4379bc0c7aac37d6ba77/a)

