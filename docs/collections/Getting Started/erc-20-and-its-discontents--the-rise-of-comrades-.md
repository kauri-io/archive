---
title: ERC-20 and Its Discontents  The Rise of Comrades ERC-777 & ERC-1820
summary: ERC-20 and Its Discontents- The Rise of Comrades ERC-777 & ERC-1820 The most well-known Ethereum Request for Comment (ERC) is the ERC-20, which enabled the growth of Decentralized Apps (dApps), tokens, and token standards that serve the blockchain community as the blueprint for creating tokens. One of the most significant promises of Ethereum is to remove intermediaries, in essence, our ability to directly interact with one another without a central authority, which is a principle built into ERC
authors:
  - Shayan Shokrgozar (@transcendent)
date: 2019-10-20
some_url: 
---

# ERC-20 and Its Discontents  The Rise of Comrades ERC-777 & ERC-1820


## ERC-20 and Its Discontents: The Rise of Comrades ERC-777 & ERC-1820

The most well-known Ethereum Request for Comment (ERC) is the [ERC-20](https://en.wikipedia.org/wiki/ERC20), which enabled the growth of Decentralized Apps (dApps), tokens, and token standards that serve the blockchain community as the blueprint for creating tokens.

One of the most significant promises of Ethereum is to remove intermediaries, in essence, our ability to directly interact with one another without a central authority, which is a principle built into ERC-20. However, this ability doesn't come without fallibility, ones that we didn't foresee as clearly as we do today – namely that not all contracts can accept all ERC-20 tokens, resulting in a substantial number of tokens lost, forever.

Under ERC-20, we can send tokens to any Ethereum address, which means we can also send them to contracts that do not support them or do not have private keys, locking, and losing them forever. According to some estimates, there are tens of millions of dollars' worth of lost tokens. With the rise of [non-fungible tokens (NFTs)](https://kauri.io/article/028ff6bf2fa0432191371e6d39398ba6/v1/cute-kitties-and-where-to-find-them-an-introduction-to-non-fungible-tokens), we can ideally purchase an NFT with one transaction, which wasn't possible until now. Previously, to buy an NFT, we'd have to complete two transactions. One to change the balance on the ledger and a second one to transfer it to the smart contract.

1.  `approve()` – on your coin.
2.  `transfer()` – on the contract side.

Thanks to recent efforts, it's now possible to purchase an NFT within a single transaction.

### The Efforts of ERC-223

ERC-223 has all the features of ERC-20, but it also checks to see if the smart contract can accept tokens. The ERC-223 receiver can call a function, so it can also be used for purchasing NFTs.

Under ERC-223, for a contract to be able to receive tokens, it has to implement the ERC-223 receiver interface. However, it still isn't as complete as ERC-777, which is built with the goal of backward compatibility with ERC-20; solving its main hurdles and avoiding the weaknesses of EIP-223.

### The Introduction of ERC-777

ERC-777 is a substantial evolution over ERC-20. More than just sending tokens, ERC-777 defines the lifecycle of a token, starting with the minting process, followed by the sending process, and ending with the burn process. It allows for the management of funds by others, called "operators".

#### From transfer (to, amount) to send (to, amount, data)

EIP-777 does not use `transfer` and `transferFrom` functions, instead, it uses `send` and `operatorSend` to avoid interface confusion.
Similar to the notes field when completing a bank transfer, the "data" in an ERC-777 token transfer can be full or empty. The `tokensReceived` hook allows for both sending and notifying a contract in a single transaction. Whereas ERC-20 required a double call (`approve`/`transferFrom`) to achieve this.

#### From Approve to Operators

Another difference in the Solidity contract of ERC-777 is the use of the `operators` function instead of `approve()`. ERC-777 allows holders of an address to authorize others to send and burn tokens on their behalf. Furthermore, token holders are notified when their address is used.

### ERC-1820

ERC-1820 is a registry for checking which address supports which interface. Unlike ERC-777, ERC-1820 is not a token standard; it is a standard for a registry.

While there might be disadvantages to relying on a separate standard, ERC-1820 offers benefits that are important to acknowledge. For example, it allows ERC-777 to remain relatively simple, without the added overcomplication of adding a registry to it. Perhaps more importantly, it allows other EIPs and smart contract infrastructures to take advantage of the registry for their use cases.

The authors of the protocol had a choice between either making the protocol more complex or creating a separate protocol, which would result in a dependency issue; the parity hack is an obvious example of what problems such dependencies can create.

### The ERC-777 Code and Explanation

The code below is a basic example of an ERC-777 contract, from <https://github.com/ethereum/EIPs/blob/master/EIPS/eip-777.md>:

```solidity
interface ERC777Token {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function totalSupply() external view returns (uint256);
    function balanceOf(address holder) external view returns (uint256);
    function granularity() external view returns (uint256);

    function defaultOperators() external view returns (address[] memory);
    function isOperatorFor(
        address operator,
        address holder
    ) external view returns (bool);
    function authorizeOperator(address operator) external;
    function revokeOperator(address operator) external;

    function send(address to, uint256 amount, bytes calldata data) external;
    function operatorSend(
        address from,
        address to,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external;

    function burn(uint256 amount, bytes calldata data) external;
    function operatorBurn(
        address from,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external;

    event Sent(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes data,
        bytes operatorData
    );
    event Minted(
        address indexed operator,
        address indexed to,
        uint256 amount,
        bytes data,
        bytes operatorData
    );
    event Burned(
        address indexed operator,
        address indexed from,
        uint256 amount,
        bytes data,
        bytes operatorData
    );
    event AuthorizedOperator(
        address indexed operator,
        address indexed holder
    );
    event RevokedOperator(address indexed operator, address indexed holder);
}
```

ERC-777 defines the entire lifecycle of a token, including the minting (4), sending (3), and burning (5) of tokens. Below are the functions and events of the protocol. For more detail, read [the official EIP-777 Github page](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-777.md).

#### View Functions

-   `name`
-   `symbol`
-   `totalSupply`
-   `balanceOf`
-   `granularity`

#### Operators

-   `AuthorizedOperator` event
-   `RevokedOperator` event
-   `defaultOperator` function
-   `authorizeOperator` function
-   `revokeOperator` function
-   `isOperatorFor` function

#### Sending Tokens

-   `Sent` event
-   `Send` function
-   `operatorSend` function

#### Minting Tokens

-   `Minted` event

#### Burning Tokens

-   `Burned` event
-   `burn` function
-   `operatorBurn` function

### Further Reading

1.  <https://medium.com/coinmonks/erc-777-a-new-advanced-token-standard-c841788ab3cb>
2.  <https://github.com/ethereum/EIPs/issues/777>
3.  <https://github.com/0xjac/ERC777>
4.  <https://eips.ethereum.org/EIPS/eip-777>