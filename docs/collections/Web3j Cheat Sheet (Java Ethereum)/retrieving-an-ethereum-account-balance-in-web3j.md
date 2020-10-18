---
title: Retrieving an Ethereum Account Balance in Web3j
summary: Balance at Current Block To obtain the balance of an account in java with web3j at the current block, the following code snippet can be used-//Connect to node.
authors:
  - Craig Williams (@craig)
date: 2019-12-18
some_url: 
---

# Retrieving an Ethereum Account Balance in Web3j

![](https://ipfs.infura.io/ipfs/QmZS5cWXvWfsqeEpcGWVRnhyxbJGbMSY3zRQBZwXrBHeM7)


### Balance at Current Block

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

### Balance at a Specific Block

The below code snippet will obtain the account balance at block 300000:

``` java
Web3j web3 = Web3j.build(new HttpService());

EthGetBalance balanceResult = web3.ethGetBalance("0xF0f15Cedc719B5A55470877B0710d5c7816916b1", 
new DefaultBlockParameterNumber(300000)).send();

BigInteger balanceInWei = balanceResult.getBalance();
```

Balances are returned in the smallest denomination, called `wei`.  To convert to other denominations, such as `ether`, see this [cheetsheet article.](https://kauri.io/converting-between-ether-units-denominations-in-web3j/ecfdb383843b4379bc0c7aac37d6ba77/a)




---

- **Kauri original link:** https://kauri.io/retrieving-an-ethereum-account-balance-in-web3j/9983473f687348c9b950fff16f71cbfe/a
- **Kauri original author:** Craig Williams (@craig)
- **Kauri original Publication date:** 2019-12-18
- **Kauri original tags:** ethereum, cheatsheet, java, web3j
- **Kauri original hash:** QmTWEwu3cZJk7mACR8sXSYsNUvDaBJxdq2VB9o1TDqpXSx
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



