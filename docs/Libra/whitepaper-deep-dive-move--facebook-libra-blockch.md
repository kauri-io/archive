---
title: Whitepaper Deep Dive — Move- Facebook Libra Blockchain’s New Programming Language
summary: Overview & Motivation This is a walkthrough of the 26 pages technical whitepaper of Move , Facebook Libra’s new programming language. As an Ethereum developer and a blockchain community enthusiast, I hope to provide a quick overview and highlights of the paper for everyone curious about this new language -) Hope that you will like it, happy learning! The original article on Medium- http-//bit.ly/2ISy4uA Abstract Move is an executable bytecode language used to implement custom transactions and sm
authors:
  - Lee Ting Ting (@tina1998612)
date: 2019-06-19
some_url: 
---


![](https://api.kauri.io:443/ipfs/QmSpSn7MZb68WtRk4CcdxyA4EZ8ESpjRByWe9XRNWq7iWU)

## Overview & Motivation
This is a walkthrough of the 26 pages 
[technical whitepaper of Move](https://developers.libra.org/docs/assets/papers/libra-move-a-language-with-programmable-resources.pdf)
 , Facebook Libra’s new programming language. As an Ethereum developer and a blockchain community enthusiast, I hope to provide a quick overview and highlights of the paper for everyone curious about this new language :)
Hope that you will like it, happy learning!

The original article on Medium: http://bit.ly/2ISy4uA

## Abstract
> Move is an executable bytecode language used to implement custom transactions and smart contracts.

There’re two things to take note:



 * While Move is a bytecode language which can be directly executed in Move’s VM, Solidity (Ethereum’s smart contract language) is a higher level language that needs to be compiled down to bytecode before executing in EVM (Ethereum’s Virtual Machine).

 * Move can not only be used to implement smart contracts but also _custom transactions_ (explained later in the article), while Solidity is a language for smart contracts on Ethereum only.
> The key feature of Move is the ability to define custom resource types with semantics inspired by linear logic: a resource can never be copied or implicitly discarded, only moved between program storage locations.

This is a feature similar to Rust. Values in Rust can only be assigned to one name at a time. Assigning a value to a different name causes it to no longer be accessible under the previous name.
For example, the following code snippet will output the error: 
`Use of moved value ‘x’`
 . This is because Rust has no garbage collection. When variables go out of scope, the memory they refer to is also deallocated. For simplicity, we can understand this as 
**there can only be one “owner” of data at a time**
 . In this example, x is the original owner, and then y becomes the owner.

![](https://api.kauri.io:443/ipfs/QmaWSednUYAAJvfafttUm3aiSfGQeuiUQswLmTPqLjPEUz)


## 2.2 Encoding Digital Assets in an Open System
> There are two properties of physical assets that are difficult to encode in digital assets:• Scarcity. The supply of assets in the system should be controlled. Duplicating existing assets should be prohibited, and creating new assets should be a privileged operation.• Access control. A participant in the system should be able to protect her assets with access control policies.

It points out two major characteristics that digital assets need to achieve, which are considered natural for physical assets. For example, rare metal is naturally 
**scarce**
 , and only you have the 
**access**
 (ownership) of the bill in your hand before spending it.
To illustrate how we came up with the two properties, let’s start with the following proposals:
 
**Proposal#1: Simplest Rule Without Scarcity and Access Control**
 

![](https://api.kauri.io:443/ipfs/QmcuSXE2qZvo6KqYFrCAxekHG8gSbE1mYfQETFpXdhAjUC)




 *  `G[K]:=n` denotes updating the number stored at key 𝐾 in the global blockchain state with the value 𝑛.

 *  `transaction ⟨Alice, 100⟩` means set Alice’s account balance to 100.
The above representation has serval serious problems:



 * Alice can have unlimited coins by sending `transaction ⟨Alice, 100⟩` herself.

 * The coins that Alice sends to Bob are worthless since Bob could send himself unlimited coins using the same technic as well.
 
**Proposal#2: Taking Scarcity into Account**
 

![](https://api.kauri.io:443/ipfs/Qmc4BWkPsEtV1yuhtC37RTBGgKgGNpsoGNxrdkyouw5cMf)

Now we enforce that the number of coins stored under 𝐾𝑎 is at least 𝑛 before the transfer takes place.
However, though this solves the scarcity issue, there’s no ownership checking on who can send Alice’s coins. (anyone can do so under this evaluation rule)
 
**Proposal#3: Considering both Scarcity and Access Control**
 

![](https://api.kauri.io:443/ipfs/QmfEiEAWq6zmhL8GZ1Z3hA1i3K4rhb9Ti5bD8T46eRnxSy)

We address the problem by using digital signature mechanism 
`verify_sig`
 before the scarcity checking, which means Alice uses her private key to sign the transaction and prove that she is the owner of her coin.

## 2.3. Existing Blockchain Languages
Existing blockchain languages are facing the following problems (all of them have been solved in 
_Move_
 ):
> 1. Indirect representation of assets. An asset is encoded using an integer, but an integer value is not the same thing as an asset. In fact, there is no type or value that represents Bitcoin/Ether/StrawCoin! This makes it awkward and error-prone to write programs that use assets. Patterns such as passing assets into/out of procedures or storing assets in data structures require special language support.

> 2. Scarcity is not extensible. The language only represents one scarce asset. In addition, the scarcity protections are hardcoded directly in the language semantics. A programmer that wishes to create a custom asset must carefully reimplement scarcity with no support from the language.

These are exactly the problems in Ethereum smart contracts. Custom assets such as ERC-20 tokens use integer to represent its value and its total supply. Whenever new tokens are minted, the smart contract code has to manually check if the scarcity (total supply in this case) has been reached.
Furthermore, serious bugs such as 
_duplication, reuse, or loss of assets,_
 are more likely to be introduced due to the Indirect representation of asset problem.
> 3. Access control is not flexible. The only access control policy the model enforces is the signature scheme based on the public key. Like the scarcity protections, the access control policy is deeply embedded in the language semantics. It is not obvious how to extend the language to allow programmers to define custom access control policies.

This is also true in Ethereum, where smart contracts do not have native language support for the public-private key cryptography to do access control. Developers have to manually write access control such as using 
[OnlyOwner](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol#L35)
 .
Despite that I’m a big fan of Ethereum, I agree that these asset properties should be natively supported by the language for safety purposes.
> In particular, transferring Ether to a smart contract involves dynamic dispatch, which has led to a new class of bugs known as re-entrancy vulnerabilities

 
[Dynamic dispatch](https://en.wikipedia.org/wiki/Dynamic_dispatch)
 here means that the code execution logic will be determined at runtime (dynamic) instead of compile time (static). Thus in Solidity, when contract A calls contract B’s function, contract B can run code that was unanticipated by contract A’s designer, which can lead to 
[re-entrancy vulnerabilities](https://consensys.github.io/smart-contract-best-practices/known_attacks/#reentrancy)
 (contract A accidentally executes contract B’s function to withdraw money before actually deducting balances from the account).

## 3. Move Design Goals

### 3.1. First-Class Resources
> At a high level, the relationship between modules/resources/procedures in Move is similar to the relationship between classes/objects/methods in object-oriented programming.Move modules are similar to smart contracts in other blockchain languages. A module declares resource types and procedures that encode the rules for creating, destroying, and updating its declared resources.

The 
**modules/resources/procedures**
 are just some jargons in 
_Move._
 We will have an example to illustrate these later in this article;)

### 3.2. Flexibility
> Move adds flexibility to Libra via transaction scripts. Each Libra transaction includes a transaction script that is effectively the main procedure of the transaction.

> The scripts can perform either expressive one-off behaviors (such as paying a specific set of recipients) or reusable behaviors (by invoking a single procedure that encapsulates the reusable logic)

From the above, we can see that 
_Move_
 ’s transaction script introduces more flexibility since it is capable of 
**one-off behaviors**
 as well as 
**reusable behaviors,**
 while Ethereum can only perform 
**reusable behaviors**
 (which is invoking a single smart contract method). The reason why it’s named “ 
_reusable_
 ” is that smart contract functions can be executed multiple times.

### 3.3. Safety
> The executable format of Move is a typed bytecode that is higher-level than assembly yet lower-level than a source language. The bytecode is checked on-chain for resource, type, and memory safety by a bytecode verifier and then executed directly by a bytecode interpreter. This choice allows Move to provide safety guarantees typically associated with a source language, but without adding the source compiler to the trusted computing base or the cost of compilation to the critical path for transaction execution.

This is indeed a very neat design for 
_Move_
 to be a bytecode language. Since it doesn’t need to be compiled from the source to bytecode like Solidity, it doesn’t have to worry about the possible failures or attacks in compilers.

### 3.4. Verifiability
> Our approach is to perform as much lightweight on-chain verification of key safety properties as possible, but design the Move language to support advanced off-chain static verification tools.

From here we can see that Move prefers performing static verification instead of doing on-chain verification work. Nonetheless, as stated at the end of their paper, the verification tool is left for future work.
> 3. Modularity. Move modules enforce data abstraction and localize critical operations on resources. The encapsulation enabled by a module combined with the protections enforced by the Move type system ensures that the properties established for a module’s types cannot be violated by code outside the module.

This is also a very well thought data abstraction design! which means that the data in a smart contract can only be modified within the contract scope but not other contracts from the outside.

![](https://api.kauri.io:443/ipfs/QmatZY26D9qgAfHvji1yiUHcs9q5kVy8kBiufQy1j3Hk4o)


## 4. Move Overview
> The example transaction script demonstrates that a malicious or careless programmer outside the module cannot violate the key safety invariants of the module’s resources.

This section walks you through an example about what 
**modules, resources, and procedures**
 actually is when writing the programming language.

### 4.1. Peer-to-Peer Payment Transaction Script

![](https://api.kauri.io:443/ipfs/QmVtpAK4S88XWUD9ThQreTwgrY9u9m7MGVKHTMATAfmnJb)

There are several new symbols here (The small red text is my own notes XD):



 *  `0x0` : the account address where the _module_ is stored

 *  `Currency` : the name of the _module_ 

 *  `Coin` : the resource type

 * The value `coin` returned by the _procedure_ is a resource value whose type is `0x0.Currency.Coin` 

 *  `move()` : the value can not be used again

 *  `copy()` : the value can be used later

### Code breakdown:
> In the first step, the sender invokes a procedure named withdraw_from_sender from the module stored at 0x0.Currency.

> In the second step, the sender transfers the funds to payee by moving the coin resource value into the 0x0.Currency module’s deposit procedure.


### Here are 3 types of code examples that will be rejected:
 
**1. Duplicating currency by changing**
  
`move(coin)`
  
**to**
  
`copy(coin)`
 
> Resource values can only be moved. Attempting to duplicate a resource value (e.g., using copy(coin) in the example above) will cause an error at bytecode verification time.

Because 
`coin`
 is a 
_resource_
 value, it can only be moved.
 
**2. Reusing currency by writing**
  
`move(coin)`
  
**twice**
 
> Adding the line 0x0.Currency.deposit(copy(some_other_payee), move(coin)) to the example above would let the sender “spend” coin twice — the first time with payee and the second with some_other_payee. This undesirable behavior would not be possible with a physical asset. Fortunately, Move will reject this program.

 
**3. Losing currency by neglecting to**
  
`move(coin)`
 
> Failing to move a resource (e.g., by deleting the line that contains move(coin) in the example above) will trigger a bytecode verification error. This protects Move programmers from accidentally — or intentionally — losing track of the resource.


### 4.2. Currency Module

### 4.2.1 Primer: Move execution model

![](https://api.kauri.io:443/ipfs/QmZg7JGXRoRjmFbicAtJnqpCdAXijb8PYswBnQU9EdziUS)

> Each account can contain zero or more modules (depicted as rectangles) and one or more resource val- ues (depicted as cylinders). For example, the account at address 0x0 contains a module 0x0.Currency and a resource value of type 0x0.Currency.Coin. The account at address 0x1 has two resources and one module; the account at address 0x2 has two modules and a single resource value.

 
**Some highlights:**
 



 * Executing a transaction script is all-or-nothing

 * A module is a long-lived piece of code published in the global state

 * The global state is structured as a map from account addresses to accounts

 * Accounts can contain at most one resource value of a given type and at most one module with a given name (The account at address `0x0` would not be allowed to contain an additional `0x0.Currency.Coin` resource or another module named `Currency` )

 * The address of the declaring module is part of the type ( `0x0.Currency.Coin` and `0x1.Currency.Coin` are distinct types that cannot be used interchangeably)

 * Programmers can still hold multiple instances of a given resource type in an account by defining a custom wrapper resource
( 
`resource TwoCoins { c1: 0x0.Currency.Coin, c2: 0x0.Currency.Coin }`
 )



 * The rule is it is ok as long as you can still reference the resource by its name without having conflicts, for example, you can reference the two resources using `TwoCoins.c1` and `TwoCoins.c2` .

### 4.2.2 Declaring the Coin Resource

![](https://api.kauri.io:443/ipfs/QmSq21xiWEa4777EJ1VQsph5jq8LLN1kfVd9EXC1exe3U3)

 
**Some highlights:**
 



 * A Coin is a struct type with a single field value of type u64 (a 64-bit unsigned integer)

 * Only the _procedures_ of the `Currency`  _module_ can create or destroy values of type `Coin` 

 * Other _modules_ and _transaction scripts_ can only write or reference the value field via the public _procedures_ exposed by the _module_ 

### 4.2.3 Implementing Deposit

![](https://api.kauri.io:443/ipfs/QmVyN7HCkXim6enAaKRWyYMiDU1FVCREQZWNL9FE3WYNE2)

> This procedure takes a Coin resource as input and combines it with the Coin resource stored in the payee’s account by:1. Destroying the input Coin and recording its value.2. Acquiring a reference to the unique Coin resource stored under the payee’s account.3. Incrementing the value of payee’s Coin by the value of the Coin passed to the procedure.

 
**Some highlights:**
 



 *  `Unpack, BorrowGlobal` are builtin _procedures_ 

 *  `Unpack<T>` is the only way to delete a resource of type T. It takes a resource of type T as input, destroys it, and returns the values bound to the fields of the resource

 *  `BorrowGlobal<T>` takes an address as input and returns a reference to the unique instance of T published under that address

 *  `&mut Coin` is a mutable reference to a `Coin`  _resource_ , not `Coin` 

### 4.2.4 Implementing withdraw_from_sender

![](https://api.kauri.io:443/ipfs/QmZxxtzSnsTDL5yY3JXMgG7RRGieThvpCQ9d9BxFg1qwYD)

> This procedure:

> 1. Acquires a reference to the unique resource of type Coin published under the sender’s account.2. Decreases the value of the referenced Coin by the input amount.3. Creates and returns a new Coin with value amount.

 
**Some highlights:**
 



 *  `Deposit` can be called by anyone but `withdraw_from_sender` has access control to only be callable by the owner of coin

 *  `GetTxnSenderAddress` is similar to Solidity’s `msg.sender` 

 *  `RejectUnless` is similar to Solidity’s `require` . If this check fails, execution of the current transaction script halts and none of the operations it performed will be applied to the global state

 *  `Pack<T>` , also a builtin _procedure_ , creates a new resource of type T

 * Like `Unpack<T>` , `Pack<T>` can only be invoked inside the declaring module of resource T

## Wrap up
Now that you have an overview of what is the main characteristics of 
_Wave,_
 how it compares to Ethereum, and also familiar with its basic syntax.
Lastly, I highly recommend reading through the 
[original white paper](https://developers.libra.org/docs/assets/papers/libra-move-a-language-with-programmable-resources.pdf)
 . It includes a lot of details regarding the programming language design principles behind and many great references.
Thank you so much for your time reading. Feel free to share this with someone who might be interested :) Any suggestions are also welcomed!!

![](https://api.kauri.io:443/ipfs/QmV4CcTkR8h9xWtyDJaTxbQKRNuiQCw2t6vfFWdjRRvn9C)

