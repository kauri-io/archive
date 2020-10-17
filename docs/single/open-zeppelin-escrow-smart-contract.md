---
title: Open-Zeppelin Escrow Smart contract
summary: Today, we will look in smart contract escrow and understand open-zeppelin escrow smart contract. What is escrow? An escrow is a financial arrangement where a third party holds and regulates the payment of the funds required for two parties involved in a given transaction. Escrow is used by businesses as a trusted party for a financial agreement. There are many online escrow services, we can also build an escrow service using smart contract. Open zeppelin Escrow Contract-pragma solidity ^0.4.24;
authors:
  - Coinmonks (@coinmonks)
date: 2018-12-06
some_url: 
---

# Open-Zeppelin Escrow Smart contract


![](https://api.beta.kauri.io:443/ipfs/QmY9EN1miTFb4k1P6w15d5rVw1rYZFsVBo8arf5g6bwV2V)

Today, we will look in smart contract escrow and understand open-zeppelin escrow smart contract.

### What is escrow?
 
[An escrow is a financial arrangement where a third party holds and regulates the payment of the funds required for two parties involved in a given transaction.](https://www.escrow.com/what-is-escrow)
 Escrow is used by businesses as a trusted party for a financial agreement. There are many online escrow services, we can also build an escrow service using smart contract.

### Open zeppelin Escrow Contract-

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/buddies2705/538000dd91f3d99c6c6ed4200102bb0a.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
pragma solidity ^0.4.24;

import "../../math/SafeMath.sol";
import "../../ownership/Secondary.sol";

 /**
 * @title Escrow
 * @dev Base escrow contract, holds funds designated for a payee until they
 * withdraw them.
 * @dev Intended usage: This contract (and derived escrow contracts) should be a
 * standalone contract, that only interacts with the contract that instantiated
 * it. That way, it is guaranteed that all Ether will be handled according to
 * the Escrow rules, and there is no need to check for payable functions or
 * transfers in the inheritance tree. The contract that uses the escrow as its
 * payment method should be its primary, and provide public methods redirecting
 * to the escrow's deposit and withdraw.
 */
contract Escrow is Secondary {
  using SafeMath for uint256;

  event Deposited(address indexed payee, uint256 weiAmount);
  event Withdrawn(address indexed payee, uint256 weiAmount);

  mapping(address =&gt; uint256) private _deposits;

  function depositsOf(address payee) public view returns (uint256) {
    return _deposits[payee];
  }

  /**
  * @dev Stores the sent amount as credit to be withdrawn.
  * @param payee The destination address of the funds.
  */
  function deposit(address payee) public onlyPrimary payable {
    uint256 amount = msg.value;
    _deposits[payee] = _deposits[payee].add(amount);

    emit Deposited(payee, amount);
  }

  /**
  * @dev Withdraw accumulated balance for a payee.
  * @param payee The address whose funds will be withdrawn and transferred to.
  */
  function withdraw(address payee) public onlyPrimary {
    uint256 payment = _deposits[payee];

    _deposits[payee] = 0;

    payee.transfer(payment);

    emit Withdrawn(payee, payment);
  }
}

```



### Permission manager Smart contract (Secondary.sol)
Before diving into open-zeppelin escrow smart contract, we will first look at 
`Secondary.sol`
 which is also provided by open-zeppelin. It’s essentially a permission manager wrapper which gets used in 
`Escrow.sol`
 .
 
**Why Secondary.sol?**
 
 
**Secondary.sol**
 will help in establishing a primary party for our contract. This primary party is us (Escrow service). This defines modifier which will be used to enforce ownership while interacting with our escrow system. Of course, we can build this functionality in escrow smart contract itself but creating 
`Secondary.sol`
 helps us in reusability, modularity and separation of concerns.
 
**Here is code for the**
  
`Secondary.sol`
 .

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/buddies2705/a8bcb120e030672340547bdb9ffe08c7.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
pragma solidity ^0.4.24;

import "../../math/SafeMath.sol";
import "../../ownership/Secondary.sol";

contract Escrow is Secondary {
  using SafeMath for uint256;

  event Deposited(address indexed payee, uint256 weiAmount);
  event Withdrawn(address indexed payee, uint256 weiAmount);

  mapping(address =&gt; uint256) private _deposits;

  function depositsOf(address payee) public view returns (uint256) {
    return _deposits[payee];
  }

 
  function deposit(address payee) public onlyPrimary payable {
    uint256 amount = msg.value;
    _deposits[payee] = _deposits[payee].add(amount);

    emit Deposited(payee, amount);
  }

 
  function withdraw(address payee) public onlyPrimary {
    uint256 payment = _deposits[payee];

    _deposits[payee] = 0;

    payee.transfer(payment);

    emit Withdrawn(payee, payment);
  }
}

```


Now, Let’s look at this contract.
 
**Constructor**
 - Account which deploys this contract on blockchain will be the 
`_primary`
 (Primary party) for this smart contract and will control this contract.
 
**Modifier-**
 There is a modifier if used in any function will check that function is getting called by the primary party or not.
 
**Transfer ownership**
 - of course there is a function to change the primary party.

### Escrow Smart contract
Because we are providing escrow service. We will control funds in our escrow(We will be the primary party in 
`Secondary.sol`
 ), we will deposit and withdraw for a party and keep tracks of deposits. Anyone can check how much amount is deposited to a corresponding address for a given address.
That’s it now we can dive into our Escrow smart contract. So now let's understand 
`Escrow.sol`
 .
We are defining a mapping to track the deposits. It maps address with deposit values in escrow contract.

```
mapping(address => uint256) private _deposits;
```


 
**Events**
 - Smart contract also defines two events, One for deposits and one for withdraws.

```
event Deposited(address indexed payee, uint256 weiAmount);
event Withdrawn(address indexed payee, uint256 weiAmount);
```


 
**Methods**
 - now let’s see our methods in escrow smart contract.
 
**deposit**
 — This is a simple method which only allows contract owner(primary party) to submit a deposit for any party. Look we have used 
`onlyPrimary`
 modifier from 
`Secondary.sol`
 for this permission management. We are also storing the address of the party for whom we deposit the ether. We are also emitting deposited at the end.

```
function deposit(address payee) public onlyPrimary payable {
    uint256 amount = msg.value;
    _deposits[payee] = _deposits[payee].add(amount);
 
     emit Deposited(payee, amount);
  }
```


 
**withdraw**
 — We will use this method to transfer the ether back to the party for whom we deposit the ether. We will update our mapping and emit an event in case of a successful transaction. Here also we are using 
`onlyPrimary`
 to make sure that only we can perform withdraw.

```
function withdraw(address payee) public onlyPrimary {
    uint256 payment = _deposits[payee];
```



```
    _deposits[payee] = 0;
```



```
    payee.transfer(payment);
```



```
    emit Withdrawn(payee, payment);
  }
```


 
**depositsOf**
 — This is a function which returns deposited value for a given address and it’s a public, so anyone can check the escrow balance for a given account.

```
function depositsOf(address payee) public view returns (uint256) {
    return _deposits[payee];
}
```


That’s it, our smart contract is complete. We can add extra functionality on top of it and also it’s well tested but you can test it just for getting an idea that how things are working. We will look at other 2 escrow contracts (Conditional Escrow and RefundEscrow)provided by open-zeppelin library in next tutorials which are built upon this Escrow smart contract.
If you don’t understand anything or learn anything about smart contracts, you can comment below. And if you find this useful you can 👏 and follow me on medium.
