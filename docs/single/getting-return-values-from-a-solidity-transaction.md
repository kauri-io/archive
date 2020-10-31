---
title: Getting return values from a solidity transaction
summary: In solidity we have learned that there are two ways to directly interact with smart contracts, by transactions and calls. Transactions change the state of the blockchain, Calls allow you to read that state. There is, however a little wrinkle that I decided to investigate as part of some work into upgradable contracts. I havent seen anybody write about this before so I thought this may be useful to somebody. Writing to the chain A transaction when signed and submitted to the transaction pool and
authors:
  - Dave Appleton (@daveappleton)
date: 2019-06-21
some_url: 
---

# Getting return values from a solidity transaction


In solidity we have learned that there are two ways to directly interact with smart contracts, by transactions and calls.

Transactions change the state of the blockchain, Calls allow you to read that state.

There is, however a little wrinkle that I decided to investigate as part of some work into upgradable contracts. I haven't seen anybody write about this before so I thought this may be useful to somebody.

**Writing to the chain**

A transaction when signed and submitted to the transaction pool and when mined will alter the internal state of one or more contracts. An example of a transaction would be the transfer function of an ERC20 token.

`function transfer(address destination, uint256 value) public returns (bool)`

As we should all be aware, calling this function from your account will cause a certain number of tokens to be transferred from your balance to the destination's balance. This transfer of tokens is the state change of the contract. This means that all the nodes on the network need to reach a consensus that your transaction is valid. This takes time.

You will notice that the function returns a boolean result to indicate the success or failure of the transfer but if you send this function from a normal _externally owned address_ (EOA*) - you are unable to check the boolean result that is returned because the transaction is submitted to be mined so the result is not immediately available on submission. This is why the event mechanism is available to allow the contract to communicate to the off chain world.

*An _externally owned address_ is an account for which you own the private key in some form as opposed to another smart contract.

**Reading from the chain**

By contrast, if all we want to do is to read something from a contract, for example and ERC20 balance we can do so using a _call_.

`function balanceOf(address owner) public view returns (uint256)`

The `view` keyword is one of two variants of the original `constant` keyword that is clearly defines this as a function that does NOT change the blockchain. Since each node in the blockchain should contain identical data, we only need to query a single node, usually a local one. Your local query, not requiring consensus, will return an immediate answer containing the data you requested.

So let's take some very simple sample code

```
pragma solidity ^0.4.25;

contract test {
    
    uint val = 7;
    
    function wotVal() public returns (uint) {
        val++;
        return val;
    }
}
```

You can see that if we submit a transaction to call `wotVal` it will increment the value of `val` but unfortunately you will not be able to find out the value of `val` because you can't get the resulting value from the transaction.

If you mark the function `wotVal` as constant by adding `view`, you will not be able to submit a transaction that increments `val`.

**Accessing the contract from myCrypto using the ABI**

It IS possible however, to use this function in either mode if you do not mark it as constant.

From a low level perspective you can either submit a transaction (to make the increment of val persistent) or you can use the call method to get the results. Let's see how we can do that.

You will find this contract sitting at address `0x17d9486DCd19981B42a3214Ba97d1E1F130e801a` on the Kovan Network. You can interact with it. Find it on etherscan.

https://kovan.etherscan.io/address/0x17d9486dcd19981b42a3214ba97d1e1f130e801a#contracts

On this page you will find the ABI. You can access the contract from myCrypto. Select the Kovan network and "interact with contracts" from the tools menu.

![
](https://ipfs.infura.io/ipfs/QmcqRJYhzsjZYqJd3cQhx2pnMkEeJP6pvZbT6MGrzwZT5U)

Paste the address of the contract (see above) as the address, and paste the ABI that you got from etherscan into the large text box.

Clicking the access button, you will see that you can now call the wotVal function - but you are asked for an account with which to access it (e.g. Metamask). 

![](https://ipfs.infura.io/ipfs/Qmf25PRUaybpgmcfiSFa4YohjFDg9mccKwEWAnn2B8hYhD)

Using one of these would allow you to transact with the contract (i.e. bump the value of `val`) but you cannot read the return value.

**But if we tweak the ABI....**

Let's have a look at the ABI that we pasted. It defines how we interact with the contract. Formatting it slightly we get :

```
[
    {
        "constant": false,
        "inputs": [],
        "name": "wotVal",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
```

If we change constant to `true` and stateMutability to `view` and paste the new ABI into myCrypto, we now get a big READ button instead of an offer to use a wallet. Depending on how many people call the transaction, your reply probably won't be 9 but you do get a response. Do note however, that calling the function multiple times always results in the same answer because the changes when you bump `val` are not persistent.

![](https://ipfs.infura.io/ipfs/QmRMsvV2VkvHe5cGWPfCQj4HGsbLmn2rrzAuS8AkLqn5GL)

This means that you can use exactly the same mechanism to read the reply from javascript using either the web3 call method or by using a modified ABI, or similar methods from Go, Python etc.

Interestingly it also means that if you write an ERC20 and forgot to make the _balanceOf_ function constant, almost every user would access it as if it were so it really would not matter!

**How this is important**

The way an upgradable contract works is that the data is stored in one (data) contract, but most transactions and calls are passed to another (business logic) contract via the delegatecall method. 

This means that your base contract is usually accessed via its fallback function because you will not know all the functions that may be needed in the future.

Say, for example, you had released an ERC20 token but wanted to upgrade it to an ERC777 or some other kind of token. When you wrote the ERC20 you would not know all the ERC777 functions. You would rely on the fallback function to act as a catch-all and pass everything on to the business logic contract.

Since we do not know in advance which function are going to be constant and which are not, we need to be able to treat functions as constant as required. The investigations here proved that this is possible.



---

- **Kauri original title:** Getting return values from a solidity transaction
- **Kauri original link:** https://kauri.io/getting-return-values-from-a-solidity-transaction/ea44be3e30264e0ea116c7ec0621bb51/a
- **Kauri original author:** Dave Appleton (@daveappleton)
- **Kauri original Publication date:** 2019-06-21
- **Kauri original tags:** transaction, solidity
- **Kauri original hash:** QmNTMTdRP1L1fqequEDtA56gwAmgTVxJos6qp7CwbUjHiX
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



