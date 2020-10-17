---
title: OpenZeppelin Part 3- Token Standards
summary: Token Standards OpenZeppelin has incorporated a series of token contracts to assist with creating and managing them. What is a Token? In Ethereum, tokens are a digital asset that can represent anything. It can be a protocol, physical object, or even cryptocurrency. People use them for a variety of actions such as buying or even voting. A token is a smart contract and a smart contract is a piece of code. To send a token you need to write a contract. Keep in mind that this contract must conform to
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-02-28
some_url: 
---

# Token Standards

OpenZeppelin has incorporated a series of token contracts to assist with creating and managing them.

## What is a Token?

In Ethereum, tokens are a digital asset that can represent anything. It can be a protocol, physical object, or even cryptocurrency. People use them for a variety of actions such as buying or even voting. A token is a smart contract and a smart contract is a piece of code. To send a token you need to write a contract. Keep in mind that this contract must conform to a set of special standards to be able to interact with other tokens and smart contracts.

## Types of Standards

In this tutorial, we cover the two types of standards that OpenZeppelin has made contracts for. Keep in mind that there are more standards.

### ERC20

This standard is the most common for Ethereum tokens to follow. It describes the way tokens are transferred between addresses and how their data is accessed. Every ERC20 token is identical and equal to each other.

### ERC721

This standard is for a non-fungible token. Non-fungible means that people cannot interchange these tokens whereas ERC20 tokens can be. ERC721 tokens are all unique and have special standards in relation to how they are managed, owned, and traded.

## OpenZeppelin & ERC20

OpenZeppelin provides different contracts to assist with creating and interacting with an ERC20 token.

- **IER20**: Defines the implementation all tokens should conform to.
- **ERC20**: Basic implementation of the token.
- **ERC20Detailed**: Allows you to add more information to your tokens such as name, symbol, and decimals.
- **ERC20Mintable**: Allows anyone with the minter role to mint tokens aka create tokens.
- **ERC20Burnable**: Allows you to destroy the token.
- **ERC20Capped**: Maximum cap on tokens allowed.
- **ERC20Pausable**: Allows anyone with the pauser role to freeze the transfer of tokens to and from users.
- **safeERC20**: Forces transfers and approvals to succeed or the transaction reverts.
- **TokenTimelock**: To release tokens after a specified timeout. Useful in an Escrow situation.

```solidity
pragma solidity ^ 0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20-option-you-choose.sol";

contract ERC20Contract is ERC20-option-you-choose {
  // the rest of your code
}
```

## OpenZeppelin & ERC721

OpenZeppelin provides contracts for creating and interacting with an ERC721 token.

- **IERC721**: Interface for the token.
- **ERC721**: Basic implementation of ERC721.
- **IERC721Receiver**: How to handle ERC721 tokens and not mistake it for an ERC20 token.
- **ERC721Mintable**: Allows anyone with the minter role to mint tokens aka create tokens.
- **ERC721Pausable**: Allows anyone with the pauser role to freeze the transfer of tokens to and from users.

```solidity
pragma solidity ^ 0.5 .2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721-option-you-choose.sol";

contract ERC721Contract is ERC721-option-you-choose {
  // the rest of your code
}
```

## Usage

To use any of the features from the token library, import them at the top of your contract. `import "openzeppelin-solidity/contracts/token/chosen standard"`. This allows you to inherit its functions into your contract.

**Note**: You can have multiple inheritances but they must all be for the same standard of token.

```solidity
pragma solidity ^ 0.5 .2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol";

contract ERC721Contract is ERC721Mintable , ERC20Burnable {
  // the rest of your code
}
```

## Next Steps

- <https://openzeppelin.org/api/docs/learn-about-tokens.html>
- <https://beta.kauri.io/article/b282e90cb260459fb8a8cc6e24ae34fa/v1/ethereum-101-part-v-tokenization>
- <https://openzeppelin.org/api/docs/token_ERC20_ERC20.html>
- <https://openzeppelin.org/api/docs/token_ERC721_ERC721.html>

For more examples of how to use ERC20 and ERC721 inheritable features check out the following links:

- [ERC721](https://github.com/search?q=import+%22openzeppelin-solidity%2Fcontracts%2Ftoken%2FERC721%22&type=Code)
- [ERC20](https://github.com/search?utf8=%E2%9C%93&q=import+%22openzeppelin-solidity%2Fcontracts%2Ftoken%2FERC20%22&type=Code)