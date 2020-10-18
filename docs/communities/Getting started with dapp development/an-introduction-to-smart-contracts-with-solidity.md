---
title: An Introduction to Smart Contracts with Solidity
summary: Smart contracts are programs which govern the behaviour of accounts within the Ethereum state, and Solidity is an object-oriented, high-level language for implementing smart contracts. With Solidity you can create contracts for uses such as voting, crowdfunding, blind auctions, and multi-signature wallets. Solidity was influenced by C++, Python and JavaScript and is designed to target the Ethereum Virtual Machine (EVM). Solidity is statically typed, supports inheritance, libraries and complex us
authors:
  - Kauri Team (@kauri)
date: 2019-04-30
some_url: 
---

# An Introduction to Smart Contracts with Solidity

![](https://ipfs.infura.io/ipfs/QmeN9SKhoubbXwfpSdprqKF8bmNVmW6JaBB99MdwuGtuLj)


Smart contracts are programs which govern the behaviour of accounts within the Ethereum state, and Solidity is an object-oriented, high-level language for implementing smart contracts.

With Solidity you can create contracts for uses such as voting, crowdfunding, blind auctions, and multi-signature wallets.

Solidity was influenced by C++, Python and JavaScript and is designed to target the Ethereum Virtual Machine (EVM).

Solidity is statically typed, supports inheritance, libraries and complex user-defined types among other features.

### An Introductory Smart Contract

The Solidity code below sets the value of a variable and exposes it for other contracts to access.

#### Storage Example

```
pragma solidity >=0.4.0 <0.7.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
```

The first line defines that the source code is written for Solidity version 0.4.0 or anything newer that does not break functionality (up to, but not including, version 0.7.0). This is to ensure that the contract is not compilable with a new (breaking) compiler version, where it could behave differently. Pragmas are common instructions for compilers about how to treat the source code (e.g., [pragma once](https://en.wikipedia.org/wiki/Pragma_once)).

A contract in the sense of Solidity is a collection of code (its **functions**) and data (its **state**) that resides at a specific address on the Ethereum blockchain. The line `uint storedData;` declares a state variable called `storedData` of type `uint` (unsigned integer of 256 bits). Think of it as a single slot in a database that can be queried and altered by calling functions of the code that manages the database. In the case of Ethereum, this is always the owning contract. And in this case, the functions set and get can be used to modify or retrieve the value of the variable.

To access a state variable, you do not need the prefix `this` as is common in other languages.

This contract does not do much apart from (due to the infrastructure built by Ethereum) allow anyone to store a single number that is accessible by anyone in the world without a (feasible) way to prevent you from publishing this number. Anyone could call `set` again with a different value and overwrite your number, but the number is still stored in the history of the blockchain. There are ways to impose access restrictions so that only you can alter the number.

### Next Steps

This introduction and example was taken from [the official Solidity documentation](https://solidity.readthedocs.io/), which is your best resource. Recommended next steps are:

-   [The more advanced subcurrency example](https://solidity.readthedocs.io/en/latest/introduction-to-smart-contracts.html#subcurrency-example)
-   [A selection of smart contract examples](https://solidity.readthedocs.io/en/latest/solidity-by-example.html)
-   [An in-depth guide to the language core concepts](https://solidity.readthedocs.io/en/latest/solidity-in-depth.html)



---

- **Kauri original title:** An Introduction to Smart Contracts with Solidity
- **Kauri original link:** https://kauri.io/an-introduction-to-smart-contracts-with-solidity/6479f4a2cb3446d790dd27e8aeb36f63/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2019-04-30
- **Kauri original tags:** ethereum, smart-contracts, solidity
- **Kauri original hash:** QmSXAzZk2YzuDvTGy8mQHy3pFjEP3QKKQYB7GXTakFshNd
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



