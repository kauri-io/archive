---
title: Compound  Money markets on Ethereum
summary: Compound gives you the ability to borrow and lend tokens. In Compound, users contribute to a shared pool of tokens, from which lenders can receive a debt. Lenders can repay the debt at any time, as long as they maintain enough collateral. In case their debt becomes under collateralized, users of the protocol can default the lender’s debt by selling his assets in an auction. - Description from ethhub.io This article originally appeared on the Compound blog The Compound Protocol functions can be c
authors:
  - Kauri Team (@kauri)
date: 2019-04-08
some_url: 
---

# Compound  Money markets on Ethereum

![](https://ipfs.infura.io/ipfs/QmNVeYrVj3v38LQMspq5iShDbkVEjDRJ7ipqZw3HCukyAb)


> Compound gives you the ability to borrow and lend tokens. In Compound, users contribute to a shared pool of tokens, from which lenders can receive a debt. Lenders can repay the debt at any time, as long as they maintain enough collateral. In case their debt becomes under collateralized, users of the protocol can default the lender’s debt by selling his assets in an auction. - Description from [ethhub.io](https://docs.ethhub.io/built-on-ethereum/open-finance/0x-protocol/#0x-protocol-overview)

_This article originally appeared on the [Compound blog](https://medium.com/compound-finance/building-on-compound-d6ddcf869178)_

The Compound Protocol functions can be called by any Ethereum address, which means that any developer can leverage the liquidity & interest rate mechanics of Compound as a foundation to BUIDL interesting new products. For the first time, any smart contract can generate interest from token balances, or borrow a token (to use elsewhere in Ethereum) from Compound on-demand.
In addition to the 
[whitepaper](https://compound.finance/documents/Compound.Whitepaper.v04.pdf)
 and full 
[documentation](https://compound.finance/developers)
 , today we’re releasing a sample contract, 
[QuickBorrow](https://github.com/compound-finance/QuickBorrow)
 , as inspiration — 
_please note: this contract has not been audited, and is not meant for production usage in the current state._
 
QuickBorrow is a smart contract designed to do one thing well; allow a user to instantly borrow a token, using Ether as collateral.



 * When a user sends Ether to the QuickBorrow contract, they instantly receive borrowed tokens (such as BAT) directly to their address, in one transaction.

 * A user can add collateral for their borrowing by sending more Ether to the QuickBorrow contract

 * A user can repay their borrow by calling approve and repay functions
We’ve deployed QuickBorrow to 
[Rinkeby](https://rinkeby.etherscan.io/address/0xbf7bbeef6c56e53f79de37ee9ef5b111335bd2ab)
 , which you can use to borrow mock-BAT. We’re excited to see you extend QuickBorrow with new use cases; to borrow any asset, to instantly trade borrowed tokens on Kyber, 0x, or Bancor, to add a web3 interface, etc. If you’d like our help building something new, join our #development channel in 
[Discord](https://discord.gg/XuSKm5B)
 — to ask questions, request an API key, or show off what you’ve built.

### QuickBorrow Contract Experience
When the QuickBorrow contract receives Ether, the following steps occur in a single 
[transaction](https://rinkeby.etherscan.io/tx/0xbaf8878f19d1530f4d2a04fc8b7b4c2f7cf45e04665fdf8ce14a965bb1fd288e)
 :



 * A custodial contract (CDP) is deployed, to house the collateral value and borrowed position

 * Ether is wrapped into WETH, and supplied to the Compound Protocol

 * The borrowable asset is borrowed from the Compound Protocol, such that the user’s collateral value is equal to 1.75x the borrowed position, and sent to the user

![](https://ipfs.infura.io/ipfs/QmTxYwyBYMyaiftW6oDh5eAofEPckAaXLLVjdALArMqnax)

The user will eventually need to repay the borrowed tokens. To do this, the user must 
`approve`
 the TokenBorrowFactory to transfer the amount they wish to repay. 
[Example](https://rinkeby.etherscan.io/tx/0xdc90e4c88d3168ec297df6486bc3abecca4717eaeb7e00e514ae1b46026155ad)
 

![](https://ipfs.infura.io/ipfs/Qmdwn7Q8sS2RhMxuJUqr4HSfH9m7n6k8MP39iC4GzCFZSf)

The user then calls 
`repay`
 . The original borrow plus interest owed is repaid, and collateral is returned with interest received. That’s it! One function call to borrow an asset, two to return it.

![](https://ipfs.infura.io/ipfs/QmdYsVzK6Lnjw2bAZmr16RKDtBYijac5jzvRBRpBJxYkga)


![](https://ipfs.infura.io/ipfs/QmeZiZNUYe9NaxKt8XAhgNY7JnaxJwbrGrVhdYp93BRrbD)


### Building QuickBorrow
The Compound Money Market has four primary functions: 
`supply`
 , 
`withdraw`
 , 
`borrow`
 , and 
`repay`
 . QuickBorrow uses all four functions; supply and borrow when sending Ether, and repay and withdraw when closing the position. In both cases, QuickBorrow is combing two money market transactions into one call. In fact, to accurately perform these operations, it is necessary to perform a few other operations.
Let’s explore the Compound interface, using QuickBorrow as our guide.
 
[#Supply](https://github.com/compound-finance/money-market/blob/master/contracts/MoneyMarket.sol#L877)
 
The Compound Protocol (hereinafter “the protocol”) operates solely on ERC-20 tokens. Compound supports 
[Wrapped Ether (WETH)](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 . We need to use the Wrapped Ether deposit function in order to get an ERC-20 representation of our Ether. Then we’ll supply the resulting tokenized Ether to Compound!

```
import "./WrappedEtherInterface.sol";
weth = WrappedEtherInterface("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
```



```
weth.deposit.value(msg.value)();     
uint supplyStatus = compoundMoneyMarket.supply(weth, msg.value);
require(supplyStatus == 0, "keep reading to find out why supply status has to be 0!");
```


We wrapped our Ether, and then supplied all of it to Compound. Then we checked that the supply action completed successfully with require(supplyStatus == 0). A full list of Compound status codes can be found 
[here](https://compound.finance/developers#error-codes)
 , but suffice it to say that if we don’t get back 0 ( Success ), we want the transaction to revert and the user to keep their Ether!
 
[#Borrow](https://github.com/compound-finance/money-market/blob/master/contracts/MoneyMarket.sol#L1921)
 
Having successfully deposited Ether into the protocol, it is time to borrow some tokens! But how much can we borrow? The protocol requires 
[overcollateralization](https://www.investopedia.com/terms/o/overcollateralization.asp)
 to let users borrow without credit, so we must know the collateral requirement. Also, we can read the current price of the asset ( token / eth ) from the protocol. Therefore, we can calculate the number of tokens we can borrow.

```
// calculating how much basic attention token to borrow
address BATAddress = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
uint collateralRatio = compoundMoneyMarket.collateralRatio();
uint assetPrice = compoundMoneyMarket.assetPrices(BATAddress);
```



```
// it is recommended to use a math library such as SafeMath for this calculation, but for purposes of demonstration...
uint numTokensToBorrow = (msg.value / collateralRatio) * assetPrice;
```


After calculating the number of tokens we are able to borrow, let’s borrow them!

```
uint borrowStatus = compoundMoneyMarket.borrow(BATAddress, numTokensToBorrow);
require(borrowStatus == 0, "failed to borrow tokens);
```


Again, we assert that the operation completed successfully.
Finally, a sample of a single function to allow a contract to supply and borrow from Compound.

```
import "./WrappedEtherInterface.sol";
import "./MoneyMarketInterface.sol";
import "./EIP20Interface.sol";
```



```
contract CDP {
  WrappedEtherInterface weth;
  MoneyMarketInterface compoundMoneyMarket;
  EIP20Interface basicAttentionToken;
```



```
  constructor () {
    weth = WrappedEtherInterface("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
    compoundMoneyMarket = MoneyMarketInterface("0x3fda67f7583380e67ef93072294a7fac882fd7e7");
    basicAttentionToken = EIP20Interface(""0x0d8775f648430679a709e98d2b0cb6250d2887ef");
```



```
  }
```



```
  function fund() payable {
    weth.deposit.value(msg.value)();
    weth.approve(compoundMoneyMarket, uint(-1));    
```



```
    uint supplyStatus = compoundMoneyMarket.supply(weth, msg.value);
    require(supplyStatus == 0, "supply succeeded, keep going!");
```



```
    uint collateralRatio = compoundMoneyMarket.collateralRatio();
    uint assetPrice = compoundMoneyMarket.assetPrices(basicAttentionToken);
    uint numTokensToBorrow = (msg.value / collateralRatio) * assetPrice;
```



```
    uint borrowStatus = compoundMoneyMarket.borrow(BATAddress, numTokensToBorrow);
    require(borrowStatus == 0, "failed to borrow tokens);
```



```
// give the borrowed tokens to the user
    uint tokenBalance = basicAttentionToken.balanceOf(address(this));  
    basicAttentionToken.transfer(msg.sender, tokenBalance);
```



```
  }
}
```


In less than 30 lines of code, we’ve demonstrated how to supply Ether and borrow BAT from the Compound Money Market. There’s more to it than that, though! This contract takes in Ether and borrows tokens, and sends them back to the user, just like 
[QuickBorrow](https://github.com/compound-finance/QuickBorrow/blob/master/contracts/CDP.sol#L62)
 . We also need a way to repay our borrow.
##Repay
To get back our precious Ether posted as collateral, it is necessary to repay the borrowed tokens. The protocol follows the approve-transferFrom pattern to pull tokens into itself, so we’ll follow suit and assume the user of the CDP contract has approved it to transfer the borrowed tokens held by the user on their behalf. After that, it’s a simple matter of calling the protocol’s repayBorrow function. We’ll pass in uint(-1) to signify we want to repay everything we can.

```
uint borrowBalance = compoundMoneyMarket.getBorrowBalance(address(this), basicAttentionToken);
```



```
basicAttentionToken.transferFrom(msg.sender, address(this), borrowBalance)
basicAttentionToken.approve(compoundMoneyMarket, uint(-1));
```



```
uint repayStatus = compoundMoneyMarket.repayBorrow(borrowedToken, uint(-1));    
require(repayStatus == 0, "repay failed");
```


##Withdraw  
 Okay! Having made productive use of our borrowed tokens elsewhere, we have repaid our debt to the protocol. Now, time to withdraw our original collateral and be on our way. First, read our balance from the protocol, we’ve probably accrued some interest if we’ve waited a few blocks before withdrawing. Then, we’ll pull it all out, unwrap the weth, and send the Ether back to the user.

```
uint supplyBalance = compoundMoneyMarket.getSupplyBalance(address(this), weth);
uint withdrawStatus = compoundMoneyMarket.withdraw(weth, supplyBalance);    
require(withdrawStatus == 0 , "withdrawal failed");
```



```
/* ---------- return ether to user ---------*/    
uint wethBalance = weth.balanceOf(address(this));    weth.withdraw(wethBalance);    msg.sender.transfer(address(this).balance);
```


Grouping repaying and withdrawing into one function and adding it to the contract above:

```
import "./WrappedEtherInterface.sol";
import "./MoneyMarketInterface.sol";
import "./EIP20Interface.sol";
```



```
contract CDP {
  WrappedEtherInterface weth;
  MoneyMarketInterface compoundMoneyMarket;
  EIP20Interface basicAttentionToken;
```



```
constructor () {
    weth = WrappedEtherInterface("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
    compoundMoneyMarket = MoneyMarketInterface("0x3fda67f7583380e67ef93072294a7fac882fd7e7");
    basicAttentionToken = EIP20Interface(""0x0d8775f648430679a709e98d2b0cb6250d2887ef");
```



```
}
```



```
function fund() payable {
    weth.deposit.value(msg.value)();
    weth.approve(compoundMoneyMarket, uint(-1));    
    uint supplyStatus = compoundMoneyMarket.supply(weth, msg.value);
    require(supplyStatus == 0, "supply succeeded, keep going!");
```



```
    uint collateralRatio = compoundMoneyMarket.collateralRatio();
    uint assetPrice = compoundMoneyMarket.assetPrices(basicAttentionToken);
    uint numTokensToBorrow = (msg.value / collateralRatio) * assetPrice;
```



```
    uint borrowStatus = compoundMoneyMarket.borrow(basicAttentionToken, numTokensToBorrow);
    require(borrowStatus == 0, "failed to borrow tokens);
```



```
    uint tokenBalance = basicAttentionToken.balanceOf(address(this));  
    basicAttentionToken.transfer(msg.sender, tokenBalance);    
  }
```



```
  function repay() {
    uint borrowBalance = compoundMoneyMarket.getBorrowBalance(address(this), basicAttentionToken);
    basicAttentionToken.transferFrom(msg.sender, address(this), borrowBalance)
    basicAttentionToken.approve(compoundMoneyMarket, uint(-1));
```



```
    uint repayStatus = compoundMoneyMarket.repayBorrow(borrowedToken, uint(-1));    
    require(repayStatus == 0, "repay failed");
```



```
    uint supplyBalance = compoundMoneyMarket.getSupplyBalance(address(this), weth);
    uint withdrawStatus = compoundMoneyMarket.withdraw(weth, supplyBalance);    
    require(withdrawStatus == 0 , "withdrawal failed");
```



```
    uint wethBalance = weth.balanceOf(address(this));
    weth.withdraw(wethBalance);
    msg.sender.transfer(address(this).balance);
  }
}
```


That’s it! In less than 50 lines of Solidity, we are able to deposit Ether in the Compound Money Market, borrow another token, send that one anywhere we like ( back to the user in this case ), then allow the user to repay that borrowed token and receive their Ether back with interest earned.
For a full implementation with more nuanced borrow and withdraw amounts ( maintaining a supply / balance ratio of collateral requirement + 25% ), a newly deployed contract for each new user, and unit tests using mocked interfaces, see the 
[QuickBorrow project on github](https://github.com/compound-finance/QuickBorrow)
 !



---

- **Kauri original title:** Compound  Money markets on Ethereum
- **Kauri original link:** https://kauri.io/compound-money-markets-on-ethereum/33e45b49f47f42228d3c35726a341a1b/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2019-04-08
- **Kauri original tags:** lending, open-finance
- **Kauri original hash:** QmbV8jkjP2GUZqJRKxEk9mKfYGCayFV6Kd8RbBqTabWvjx
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



