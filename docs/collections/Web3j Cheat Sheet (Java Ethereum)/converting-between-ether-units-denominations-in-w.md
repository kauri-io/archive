---
title: Converting Between Ether Units / Denominations in Web3j
summary: The smallest denomination of ether is called wei, and you will often find yourself needing to convert to and from wei when interacting with Ethereum smart contr
authors:
  - Craig Williams (@craig)
date: 2019-12-18
some_url: 
---

# Converting Between Ether Units / Denominations in Web3j


The smallest denomination of ether is called `wei`, and you will often find yourself needing to convert to and from wei when interacting with Ethereum smart contracts.  Luckily, web3j provides a `Convert` library class that simplifies this task.

Here are some examples:

### From Wei to Ether

``` java
BigInteger valueInWei = ...;

BigInteger convertedToEther = Convert.fromWei(valueInWei, Unit.ETHER);
```

### From Ether to Wei

``` java
BigInteger valueInEther = ...;

BigInteger convertedToWei = Convert.toWei(valueInEther, Unit.ETHER);
```

### From Wei to Gwei

``` java
BigInteger valueInWei = ...;

BigInteger convertedToGwei = Convert.fromWei(valueInWei, Unit.GWEI);
```

### From Gwei to Wei

``` java
BigInteger valueInGwei = ...;

BigInteger convertedToWei = Convert.toWei(valueInGwei, Unit.GWEI);
```

