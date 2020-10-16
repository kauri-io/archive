---
title: Crypto Items and ERC1155
summary: Improvements on 721 With the recent finalizing of ERC721, games involving non-fungible tokens and cryptocollectibles are poised to explode. Many are nearing beta release as we speak, namely  Gods Unchained, CryptoWars, Zombie Battleground along with officially-affiliated collectibles with the NFL, MLB, and more. The creators of Enjin Coin, an Ethereum-based games platform, identified a few areas for improvement in the token standards as related to the needs of typical games. From the “Motivation
authors:
  - Kauri Team (@kauri)
date: 2018-09-04
some_url: 
---

### Improvements on 721

With the recent finalizing of ERC721, games involving non-fungible tokens and cryptocollectibles are poised to explode. Many are nearing beta release as we speak, namely: God's Unchained, CryptoWars, Zombie Battleground along with officially-affiliated collectibles with the NFL, MLB, and more.

The creators of Enjin Coin, an Ethereum-based games platform, identified a few areas for improvement in the token standards as related to the needs of typical games. From the “Motivation” section on the EIP1155:

> Tokens standards like ERC-20 and ERC-721 require a separate contract to be deployed for each fungible or NFT token/collection. This places a lot of redundant bytecode on the Ethereum blockchain and limits certain functionality by the nature of separating each token contract into its own permissioned address. With the rise of crypto games and platforms like Enjin Coin (https://enjincoin.io/), game developers may be creating tens of thousands of items, and a new type of token standard is needed to support this.

> New functionality is possible with this design, such as transferring or approving multiple token types at once, saving on transaction costs. Trading (escrow / atomic swaps) of multiple tokens can be built on top of this standard and it removes the need to "approve" individual tokens separately. It is also easy to describe and mix multiple fungible or non-fungible tokens in a single contract.

The EIP can be found here: https://github.com/ethereum/EIPs/issues/1155

### The Interface(s)

**Basic**

```
interface IERC1155 {
    event Approval(address indexed _owner, address indexed _spender, uint256 indexed _id, uint256 _oldValue, uint256 _value);
    event Transfer(address _spender, address indexed _from, address indexed _to, uint256 indexed _id, uint256 _value);

    function transferFrom(address _from, address _to, uint256 _id, uint256 _value) external;
    function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes _data) external;
    function approve(address _spender, uint256 _id, uint256 _currentValue, uint256 _value) external;
    function balanceOf(uint256 _id, address _owner) external view returns (uint256);
    function allowance(uint256 _id, address _owner, address _spender) external view returns (uint256);
}

interface IERC1155Extended {
    function transfer(address _to, uint256 _id, uint256 _value) external;
    function safeTransfer(address _to, uint256 _id, uint256 _value, bytes _data) external;
}
```

The basic interface should look very familiar from ERC20 and 721. The usual suspects of transferFrom, approve, balanceOf, allowance, the 721 safeTransferFrom (checking if ERC721 Receiver is implemented to prevent token loss). The two functions in the “Extended” version are transfer() and safeTransfer(), which are the same as transfer() and safeTransferFrom respectively, minus the _from argument, as they will just use msg.sender instead.

**Batch Transfers**

Batch transfers are were things start to get interesting.

```
interface IERC1155BatchTransfer {
    function batchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values) external;
    function safeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values, bytes _data) external;
    function batchApprove(address _spender, uint256[] _ids,  uint256[] _currentValues, uint256[] _values) external;
}

interface IERC1155BatchTransferExtended {
    function batchTransfer(address _to, uint256[] _ids, uint256[] _values) external;
    function safeBatchTransfer(address _to, uint256[] _ids, uint256[] _values, bytes _data) external;
}
```

Here, you can pass batchTransferFrom or safeBatchTransferFrom an array of token IDs to transfer many tokens in one transaction. Using batchApprove will set the _spender address as the operator, allowing them to initiate a transfer in the future (same as approve).

`batchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)`

This takes the _from and _to address, along with an array of the token IDs (_ids), and a matching array of the AMOUNTs of the exactly corresponding tokens to be transferred (_values). 

For example: to transfer 10 of item 1 and 20 of item 2 from address 0x0 to address 0x1, the transaction would be the following:

`batchTransferFrom( 0x0, 0x1, [1, 2], [10, 20] )`

`batchApprove(address _spender, uint256[] _ids,  uint256[] _currentValues, uint256[] _values)`

The batchApprove function is similar, though the currently allocations of the various desired token IDs must be included as well. For example, if you want to increase the approved allocations of token ID 1 from 5 to 10 for the address 0x0, the transaction would look like: 

`batchApprove( 0x0, [1], [5], [10] )`

**Operators**
```
interface IERC1155Operators {
    event OperatorApproval(address indexed _owner, address indexed _operator, uint256 indexed _id, bool _approved);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    function setApproval(address _operator, uint256[] _ids, bool _approved) external;
    function isApproved(address _owner, address _operator, uint256 _id)  external view returns (bool);
    function setApprovalForAll(address _operator, bool _approved) external;
    function isApprovedForAll(address _owner, address _operator) external view returns (bool isOperator);
}
```

The operator functions are also quite similar to ERC721, basically divided into setApproval and the getter isApproved (returns  a boolean), and setApprovalForAll (all tokens) and isApprovedForAll.

**Views**

```
interface IERC1155Views {
    function totalSupply(uint256 _id) external view returns (uint256);
    function name(uint256 _id) external view returns (string);
    function symbol(uint256 _id) external view returns (string);
    function decimals(uint256 _id) external view returns (uint8);
    function uri(uint256 _id) external view returns (string);
}
```
The above views are available for each token, taking just the _id as an argument.

**Non-fungible Views (optional)**

```
interface IERC1155NonFungible {
    // Optional Functions for Non-Fungible Items
    function ownerOf(uint256 _id) external view returns (address);
    function nonFungibleByIndex(uint256 _id, uint128 _index) external view returns (uint256);
    function nonFungibleOfOwnerByIndex(uint256 _id, address _owner, uint128 _index) external view returns (uint256);
    function isNonFungible(uint256 _id) external view returns (bool);
}
```

The non-fungible views are set as optional in the ERC1155 standard. 

***The Enjin Implementation (WIP)**

The Enjin implementation can be found here: https://github.com/enjin/erc-1155

Note: this is a WIP, and will likely change (this article will be updated to reflect those changes)

The implementation contains the following files:
[ERC1155.sol](https://github.com/enjin/erc-1155/blob/master/contracts/ERC1155.sol)
[ERC1155Mintable.sol](https://github.com/enjin/erc-1155/blob/master/contracts/ERC1155Mintable.sol)
[ERC1155NonFungible.sol](https://github.com/enjin/erc-1155/blob/master/contracts/ERC1155NonFungible.sol)
[ERC1155NonFungibleMintable.sol](https://github.com/enjin/erc-1155/blob/master/contracts/ERC1155NonFungibleMintable.sol)
[IERC1155.sol](https://github.com/enjin/erc-1155/blob/master/contracts/IERC1155.sol)
[IERC1155NonFungible.sol](https://github.com/enjin/erc-1155/blob/master/contracts/IERC1155NonFungible.sol)

The last two (starting with I), are the interfaces discussed above. ERC1155.sol and ERC1155NonFungible.sol are the implementations of the respective interfaces, so we'll focus on ERC1155NonFungibleMintable.sol, which is the usable token contract that includes NFTs.

```
pragma solidity ^0.4.24;

import "./ERC1155NonFungible.sol";

/**
    @dev Mintable form of ERC1155
    Shows how easy it is to mint new items
*/
contract ERC1155NonFungibleMintable is ERC1155NonFungible {

    mapping (uint256 => address) public minters;
    uint256 nonce;

    modifier minterOnly(uint256 _id) {
        require(minters[_id] == msg.sender);
        _;
    }

    // This function only creates the type.
    function create(
        string _name,
        string _uri,
        uint8 _decimals,
        string _symbol,
        bool _isNFI)
    external returns(uint256 _type) {

        // Store the type in the upper 128 bits
        _type = (++nonce << 128);

        // Set a flag if this is an NFI.
        if (_isNFI)
          _type = _type | TYPE_NF_BIT;

        // This will allow special access to minters.
        minters[_type] = msg.sender;

        // Setup the basic info.
        items[_type].name = _name;
        decimals[_type] = _decimals;
        symbols[_type] = _symbol;
        metadataURIs[_type] = _uri;
    }

    function mintNonFungible(uint256 _type, address[] _to) external minterOnly(_type) {

        require(isNonFungible(_type));

        // Index are 1-based.
        uint256 _startIndex = items[_type].totalSupply + 1;

        for (uint256 i = 0; i < _to.length; ++i) {

            address _dst = _to[i];
            uint256 _nfi = _type | (_startIndex + i);

            nfiOwners[_nfi] = _dst;
            items[_type].balances[_dst] = items[_type].balances[_dst].add(1);
        }

        items[_type].totalSupply = items[_type].totalSupply.add(_to.length);
    }

    function mintFungible(uint256 _type, address[] _to, uint256[] _values)
    external  {

        require(isFungible(_type));

        uint256 totalValue;
        for (uint256 i = 0; i < _to.length; ++i) {

            uint256 _value = _values[i];
            address _dst = _to[i];

            totalValue = totalValue.add(_value);

            items[_type].balances[_dst] = items[_type].balances[_dst].add(_value);
        }

        items[_type].totalSupply = items[_type].totalSupply.add(totalValue);
    }
}
```

Here we have three functions:

`create(string _name, string _uri, uint8 _decimals, string _symbol, bool _isNFI)`

This is an entirely new function from 20 and 721. Instead of “minting” individual tokens, this creates a new instance of a token (called a “type”), which can be either ERC20 or 721. This effectively operates as a Factory (link) contract function.

`mintNonFungible(uint256 _type, address[] _to) external minterOnly(_type)`

This is the function to mint new NFTs, and requires a _type created in the create() function, and an array of addresses to send the newly minted token(s) to. This is different from the 721 mint() function in that you can mint multiple tokens at once (one for each address in the array).

`mintFungible(uint256 _type, address[] _to, uint256[] _values)`

Similar to mintNonFungible but for ERC20ish tokens. This function takes an additional argument, _values, which sets the amount of tokens to be minted and sent to each address in the corresponding _to array.

**Bonus: Token Marking (Fungible vs. Nonfungible) With Bit Identification**

One very interesting component of the ERC1155 standard is the use of a split bit to designate a token as either a fungible or non-fungible token.

```
contract ERC1155NonFungible is ERC1155 {

    // Use a split bit implementation.
    // Store the type in the upper 128 bits..
    uint256 constant TYPE_MASK = uint256(uint128(~0)) << 128;

    // ..and the non-fungible index in the lower 128
    uint256 constant NF_INDEX_MASK = uint128(~0);

    // The top bit is a flag to tell if this is a NFI.
    uint256 constant TYPE_NF_BIT = 1 << 255;

    mapping (uint256 => address) nfiOwners;

    // Only to make code clearer. Should not be functions
    function isNonFungible(uint256 _id) public pure returns(bool) {
        return _id & TYPE_NF_BIT == TYPE_NF_BIT;
    }
    function isFungible(uint256 _id) public pure returns(bool) {
        return _id & TYPE_NF_BIT == 0;
    }
    function getNonFungibleIndex(uint256 _id) public pure returns(uint256) {
        return _id & NF_INDEX_MASK;
    }
    function getNonFungibleBaseType(uint256 _id) public pure returns(uint256) {
        return _id & TYPE_MASK;
    }
    function isNonFungibleBaseType(uint256 _id) public pure returns(bool) {
        // A base type has the NF bit but does not have an index.
        return (_id & TYPE_NF_BIT == TYPE_NF_BIT) && (_id & NF_INDEX_MASK == 0);
    }
    function isNonFungibleItem(uint256 _id) public pure returns(bool) {
        // A base type has the NF bit but does not have an index.
        return (_id & TYPE_NF_BIT == TYPE_NF_BIT) && (_id & NF_INDEX_MASK != 0);
    }
}
```

The first bit is used as the flag (TYPE_NF_BIT), the rest of the upper 128 bits are used to store the type (TYPE_MASK), and the lower 128 bits are used to store the index of the NFT (NF_INDEX_MASK).

```
    uint256 constant TYPE_MASK = uint256(uint128(~0)) << 128;

    // ..and the non-fungible index in the lower 128
    uint256 constant NF_INDEX_MASK = uint128(~0);

    // The top bit is a flag to tell if this is a NFI.
    uint256 constant TYPE_NF_BIT = 1 << 255;
```

The functions that use these variables use the bitwise operator & to return the requested value, either 0 for fungible or 1 for nonfungible.
