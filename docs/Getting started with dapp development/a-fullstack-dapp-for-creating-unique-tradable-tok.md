---
title: A fullstack dapp for creating unique tradable tokens
summary: This dapp implements is a Crypto-collectible game built on top of the ERC-721 standard for creating unique tokens.. This tutorial is intended to be followed using the online IDE available at studio.ethereum.org, and selecting the CryptoPizza template. Select CryptoPizza template The smart contract After the pragma line are a series of import statements that imports all global symbols from another file to make them available to the current contract. Adding the is keyword after the contract name a
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-10-17
some_url: 
---

> This dapp implements is a Crypto-collectible game built on top of the ERC-721 standard for creating unique tokens.. This tutorial is intended to be followed using the online IDE available at [studio.ethereum.org](https://studio.ethereum.org), and selecting the "CryptoPizza" template.

![Select CryptoPizza template](https://api.kauri.io:443/ipfs/QmYL7nkdTBNpsMSL1T4xQJP3g45j15pxg6EBHCrvXuTY7k)

## The smart contract

After the `pragma` line are a series of `import` statements [that imports all global symbols from another file](https://solidity.readthedocs.io/en/latest/layout-of-source-files.html#importing-other-source-files) to make them available to the current contract.

Adding the `is` keyword after the contract name allows a contract to derive all non-private members from the named external contract including internal functions and state variables. In this example, `CryptoPizza` inherits from the external `IERC721` and `ERC165` contracts.

The `using A for B` directive is a method for attaching library functions to a Solidity type. In this case the [Zeppelin SafeMath](https://docs.openzeppelin.com/contracts/2.x/api/math.html) library that adds overflow checks to any use of the `uint256` type.

This contract introduces [constant variables](https://solidity.readthedocs.io/en/latest/contracts.html#constant-state-variables), these work in a similar way to other programming languages, but constants are not allowed to access storage, blockchain, or execution data, or make calls to external contracts.

[A `struct` type](https://solidity.readthedocs.io/en/latest/types.html#structs) lets you define your own type. In this example `Pizza` is a type that contains a `string` and a `uint`. The [array type](https://solidity.readthedocs.io/en/v0.5.12/types.html#arrays) below the struct definition creates an empty array to contain instances of the `Pizza` type.

[The `mapping` type](https://solidity.readthedocs.io/en/v0.5.12/types.html#mapping-types) is another custom type that lets you define key/value pairs as a content type. The first three are simpler examples that map one value of a certain type to a key of a certain type. For example `mapping (uint => address) public pizzaToOwner` maps an `address` type to a `uint` type inside a mapping called `pizzaToOwner`.

The fourth mapping shows that you can also nest mappings, in this case `mapping (address => mapping (address => bool)) private operatorApprovals;` creates an `address` key type that contains another `address` key that maps to a `bool` type.

The `_createPizza` function introduces several new concepts.

First is the `internal` visibility [keyword](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#visibility-and-getters) that means this function is only visible within the current contract or contracts that derive it.

Second it uses a [function modifier](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#function-modifiers) that accepts the input variables passed to the function, and passes them to another function, that checks a condition is correct before executing the function. The `isUnique` modifier checks to see if the Pizza created exists yet by checking its `_dna` and `_name` using a standard Solidity method for string comparison that compares the byte data.

Once the modifier confirms the Pizza is unique the function adds it to the array and maps it to the owner (creator in this case), using [the `assert` error handling function](https://solidity.readthedocs.io/en/v0.5.12/control-structures.html#id4) to check that the owner address is the same as the address of the current user.

The `createRandomPizza` function is the public function called in JavaScript that assigns the string the user sets in the front end as the name of the pizza and calls the `generateRandomDna` function, passing the name, and the owner.

The `generateRandomDna` introduces another new function modifier, [`pure`](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#pure-functions). Pure functions promise not to read from or modify the state, instead they generally return values to another function that does.

The `getPizzasByOwner` function is another public function called by JavaScript to return all pizzas created by the owner of a specified address. The function introduces another modifier, [`view`](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#view-functions) which promise not to modify the state.

The `transferFrom` contract function is called by JavaScript when a user clicks the _Gift_ button for an individual pizza, and transfers ownership to the address specified. The function uses another form of [error handling function](https://solidity.readthedocs.io/en/v0.5.12/control-structures.html#id4), `require` that checks for valid conditions at run time. If all these conditions are correct the function transfers ownership and emits an event to the blockchain recording the ownership transfer.

When the user clicks the _Eat_ button for an individual pizza, JavaScript calls the `burn` contract function that destroys the pizza at the specified id. The `burn` function uses the [`external`](https://solidity.readthedocs.io/en/v0.5.12/contracts.html#visibility-and-getters) function modifier, which makes the function part of the contract interface and can be called from other contracts.

And that's all the code relevant to this dapp, there are other functions for glue code not included here. To see the dapp in action, click _Compile_, then _Deploy_ found under the disclosure triangle of the contract file, then open the _Preview_ tab to see the frontend of the dapp. Try creating one or more pizzas, then gifting them to other accounts (create new accounts from the _Default_ drop down), and eating them 😋.