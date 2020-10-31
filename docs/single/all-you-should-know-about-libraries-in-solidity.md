---
title: All you should know about libraries in solidity
summary: It’s very important to know about the libraries in solidity while writing Dapps. In simple words, a library is the reusable piece of code which is deployed once and shared many times. But libraries are not just limited to reusability, there are few other areas where ethereum developers are using the library feature. This post aims to touch all those topics starting from basics. Let’s start with a simple library for mathematical operation. The SafeMath library described below contains basic arith
authors:
  - Sarvesh Jain (@sarveshgs)
date: 2019-05-13
some_url: 
---

# All you should know about libraries in solidity



![](https://ipfs.infura.io/ipfs/QmSdjNhBNvSRGsvmGFQXDeAnjzR64QPDcokdiGeLqYxeDN)

It’s very important to know about the libraries in solidity while writing Dapps. In simple words, a library is the reusable piece of code which is deployed once and shared many times.

But libraries are not just limited to reusability, there are few other areas where ethereum developers are using the library feature. This post aims to touch all those topics starting from basics.

Let’s start with a simple library for mathematical operation. The SafeMath library described below contains basic arithmetic operation which takes 2 unsigned integer as input and returns the arithmetic operation result.

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/sarveshgs/a84fe09edbe978dd8b7b79e346a12d88.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
library SafeMath {

    function mul(uint256 num1, uint256 num2) internal pure returns (uint256) {
        uint256 result = num1 * num2;
        return result;
    }


    function div(uint256 num1, uint256 num2) internal pure returns (uint256) {
        uint256 result = num1 / num2;
        return result;
    }


    function sub(uint256 num1, uint256 num2) internal pure returns (uint256) {
        uint256 result = num1 - num2;
        return result;
    }


    function add(uint256 num1, uint256 num2) internal pure returns (uint256) {
        uint256 result = num1 + num2;
        return result;
    }
}

```


> “Ideally, libraries are not meant to change state of contract, it should only be used to perform simple operations based on input and returns result”

Before going in depth, let’s cover few prerequisite for better understanding:



 *  **What is a contract in solidity?** : Technically, smart contract is a basic building block of a Dapp. In ethereum, smart contract has address like external user account which can be used to make interaction with contract like calling method, sending ether etc. Each contract has these four properties:



 * Nonce : It’s a count of number of transaction triggered from an account.

 * Balance: It’s a number that tell about amount of ether this particular address holds

 * Storage root: Contract can store data, it’s a root of tree which stores data from this contract

 * Codehash : It’s hashed value of contract code.
2. 
****
  
[Function types](https://solidity.readthedocs.io/en/v0.4.24/types.html?highlight=pure%20view#function-types)
  
**:**
 Solidity has following function types:



 * Internal: This type of function is only called from inside of contract

 * External:This type of function is only called from outside of contract

 * Public: This type of function is called from outside of contract as well inside.

 * Pure: This kind of function neither reads nor write to storage of contract.

 * View: This kind of function can only read from storage but can’t write from storage.

 * Payable: A contract function can only accept ether if it’s marked as payable.
 
**How library works?**
 

![](https://ipfs.infura.io/ipfs/QmXZF88bnHtvDVdC64rCuDMmvntCoZ55hpWxSb7rWFhqci)

In blockchain, transaction can change state of smart contract. There are various kinds of state change that can happen in a contract:



 * Sending ether: It will update balance of contract

 * Changing data in contract: It will change storage root.
> “Whenever user sends a transaction to a smart contract which is internally using library contract then state change happens on smart contract not in library contract. This is possible with delegate call feature of EVM”

 
[Delegate Call:](http://solidity.readthedocs.io/en/develop/introduction-to-smart-contracts.html?highlight=delegatecall#delegatecall-callcode-and-libraries)
 
Paraphrased from the 
[solidity docs](http://solidity.readthedocs.io/en/develop/introduction-to-smart-contracts.html?highlight=delegatecall#delegatecall-callcode-and-libraries)
 :
 
_“Delegatecall is identical to a message call apart from the fact that the code at the target address is executed in the context of the calling contract and_
 msg.sender 
_and_
 msg.value 
_do not change their values._
 
 
_This means that a contract can dynamically load code from a different address at runtime. Storage, current address and balance still refer to the calling contract, only the code is taken from the called address.”_
 
This low-level function has been very useful as it’s the backbone for implementing libraries.
 
**Deployment of libraries:**
 
Library deployment is a bit different from regular smart contract deployment. There are two scenarios in the library deployment:



 *  **Embedded Library:** If a smart contract is consuming a library which have only **internal functions** than EVM simply embeds library into the contract. Instead of using delegate call to call a function, it simply uses JUMP statement(normal method call). There is no need to separately deploy library in this scenario.

 *  **Linked Library :** On the flip side, if a library contain **public or external functions** then library needs to be deployed. Deployment of library will generate unique address in blockchain. This address needs to be linked with calling contract.
Let’s consider simple example to understand linked libraries.
Below code snippet shows a ERC20 contract with transfer function. There are two methods in SafeMath library “sub” and “add” used in transfer function which are 
**external**
 .

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/sarveshgs/81449a6389f6ddc2a63e185726a76d2d.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract ERC20 {

    using SafeMath for uint256;
    mapping(address =&gt; uint256) balances;

    function transfer(address _to, uint256 _value) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        return true;
    }
}

library SafeMath {

    function mul(uint256 a, uint256 b) external pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }


    function div(uint256 a, uint256 b) external pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }


    function sub(uint256 a, uint256 b) external pure returns (uint256) {
        assert(b &lt;= a);
        return a - b;
    }


    function add(uint256 a, uint256 b) external pure returns (uint256) {
        uint256 c = a + b;
        assert(c &gt;= a);
        return c;
    }
}

```


There are two interesting observations to make.



 * SafeMath library has external functions.
2. String given below is part of the bytecode generated after compilation of ERC20 contract. This bytes code contains reference of SafeMath __SafeMath______________________________. This means that the bytes of ERC20 can’t be deployed before performing linkage step. Linking essentially means replacing library reference in the byte code with it’s address.
0x608060405234801561001057600080fd5b50610343806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063a9059cbb14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506100ab565b604051808215151515815260200191505060405180910390f35b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205473__SafeMath______________________________63b67d77c59091846040518363ffffffff167c0100000000000000000000000000000000000
 
**How to link library contract during deployment?**
 



 * Deploy library : I have deployed SafeMath on ropsten and it’s address is [0x40189fb71f54a3ad0370620dfb095382859eb095](https://ropsten.etherscan.io/address/0x40189fb71f54a3ad0370620dfb095382859eb095) 

 * Link deployed library with the contract. Below command can be used to link SafeMath library with ERC20 contract.
 
_solc ERC20.sol — libraries “SafeMath:0x40189fb71f54a3ad0370620dfb095382859eb095” — bin_
 
After successful linking, SafeMath references will be removed from the bytecode and contract is ready for deployment.
 
**‘Using for’ in library:**
 
In solidity 
**using X for Y**
 directive means, library function of X is attached with type Y.
For instance, 
**Using SafeMath for uint256**
 .
SafeMath functions like add, sub, mul and div are now bound with type uint256.
“One condition which should be taken care is, library functions will receive the object they are called on as their first parameter”
 
**For example:**
 In ERC-20 contract mentioned above. Using for directive is using for SafeMath for type uint256.

```
using SafeMath for uint256;

uint256 a = 10;
uint256 b= 10;

uint256 = a.add(b);
```


Here 
**add**
 function is available from SafeMath. SafeMath library functions are bound with uint256.
Great!!! 🙌
I hope, this article helped you to understand libraries in solidity.
Happy Coding 😇
 
[linkedin.com/in/jainsarvesh](https://www.linkedin.com/in/jainsarvesh/)
   
  
[medium.com/@sarvesh.sgsits](https://medium.com/@sarvesh.sgsits)
 



---

- **Kauri original title:** All you should know about libraries in solidity
- **Kauri original link:** https://kauri.io/all-you-should-know-about-libraries-in-solidity/bb7efad0f7204a67aa6fa2b71b9641bc/a
- **Kauri original author:** Sarvesh Jain (@sarveshgs)
- **Kauri original Publication date:** 2019-05-13
- **Kauri original tags:** ethereum, library, evm, ethereum-virtual-machine, solidity
- **Kauri original hash:** QmcdCUBdqznJAfEuC7Av5M34NeBiYULdnY4Y83AdYMLUMA
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



