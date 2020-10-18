---
title: Gamifying Crypto Assets with the ERC998 Composables Token Standard
summary: Assets can be complex. Take a house, for example; youre not just selling the ownership of the land it sits on, but also the physical attributes of the building - the foundation, the wood, the interior walls, the roof, the stairs. Sometimes, if youre selling a fully furnished house, that asset will also include expensive furniture pieces such as couches, dining tables, bed frames and more. When it comes to crypto, attributing an ERC721 token to any non-fungible asset doesnt give you the space to
authors:
  - Ramy Zhang (@ramyjzhang)
date: 2019-08-08
some_url: 
---

# Gamifying Crypto Assets with the ERC998 Composables Token Standard

![](https://ipfs.infura.io/ipfs/QmcsGBpxZztnZbiAR3dUfzxHpZ9pVrYUU1Qt6SQTatVi2p)


Assets can be complex. Take a house, for example; you're not just selling the ownership of the land it sits on, but also the physical attributes of the building - the foundation, the wood, the interior walls, the roof, the stairs. Sometimes, if you're selling a fully furnished house, that asset will also include expensive furniture pieces such as couches, dining tables, bed frames and more. When it comes to crypto,  attributing an ERC721 token to any non-fungible asset doesn't give you the space to interact with the asset in all the ways you possibly can. You'd be compressing all the pieces of the item into a single representation, and that representation often isn't accurate, nor helpful to you if you want to later pull them apart to sell them individually.

Crypto Composables, or the ERC998 standard, is a solution to this problem. It can be applied to many non-trivial real-life industry problems: property ownership, supply chain (for example, attributing a given field of harvested coffee beans to an overarching ERC998 token, under which you'd have bags of differently roasted beans as ERC721 tokens and the beans themselves as "bean tokens" in ERC20 standard, etc.), gaming, and more.

### Basic architecture

Think of all the token standards as one big family: ERC998 is the "parent" token contract, and ERC721 and ERC20 the "child" token contracts, depending on which standard you choose (or both, if you wish). ERC998 is mapped to these child contracts in such a way that they are now "adopted" by the parent ERC998 contract and "belong" to the overarching composable.

![alt text](https://github.com/kauri-io/Content/blob/composables-draft/Crypto%20Composables/ERC998%20Graph.png "ERC998 Parent-Child Relationship")

ERC998's `tokenId` is mapped to each child's contract address. For ERC721 child tokens, its contract address is mapped to the token's own `tokenId`, whereas, for ERC20 child tokens, the contract address is mapped to the balance of ERC20 tokens. In this way, you re only allowed to transfer child tokens if you also own the parent ERC998 token.

### Top-Down vs Bottom-Up

No, you're not suddenly reading an article on subatomic physics, we're still in cryptoland. There's two different ways you can structure a composable: the top-down approach, or the bottom-up approach.

You can visualize **the top-down approach** as the ERC998 token being a <img align="right" src="https://github.com/kauri-io/Content/blob/composables-draft/Crypto%20Composables/top-down%20ERC998.png" width="260" height="220"> basket open upwards; you can take objects in and out of it, exchange it with others, and do whatever you want with its contents - as long as you're the owner of the basket. When I mention the parent-child relationship, that usually refers to the top-down composable approach. You can transfer any ERC721 or ERC20 token contract into the composable. It's also easier to retrieve all the information on child tokens with top-down composable tokens.

However, ordinary and existing ERC721 tokens (non-composable ones) cannot receive ownership of a top-down composable token, as the parent-child mapping can't be established. This is like trying to force a woven basket into a sealed cube. Of course, you can always place a basket into a bigger basket - meaning, you can place top-down ERC998 into other top-down ERC998 tokens. _You can't place them inside non-composable ERC721 tokens._

Furthermore, you must make all interactions with non-composable child tokens in top-down ERC998 tokens that require owner authentication through the proxy of the parent contract and not directly to the child contract. This is because you're technically not the owner of the child tokens; the parent token is. Because of this, issues can happen if you haven't made the setup of creating a parent method for all interactions with non-composable child tokens in your top-down ERC998 basket.

<img align="left" src="https://github.com/kauri-io/Content/blob/composables-draft/Crypto%20Composables/bottom-up%20ERC998.png" height="220"> **The bottom-up approach** is where things go topsy-turvy; instead of the parent being the ERC998 contract, it's the children who are. Think of bottom-up composables as a dog left home alone for a long time; it latches onto the first visitor that comes home, asking for pets. Similarly, ERC998 bottom-up composables can attach themselves to other ordinary non-composable ERC721 tokens.

For example, if you have a new CryptoKitty ERC721, you can attach bottom-up ERC998 composables like clothes or toys to the Kitty, as well as ERC20 composable food tokens. Going back to the analogy of non-composable ERC721 tokens as sealed cubes, bottom-up ERC998 composables would be like objects strung up on sticky pads that can _attach_ themselves to the sides of the cube.

In the case of bottom-up composables, it's a lot harder to retrieve information on all the child tokens, but conversely, you can call methods that require owner authentication directly from the "child" ERC998 contracts. The biggest disadvantage of bottom-up composables is that you can't have just any ERC721 be a part of the composable; it can strictly only be a composable ERC721 because the "parent" contract is just a regular non-composable.

### The Implementation

In terms of implementation, there are four kinds of composable tokens:

1.  Top-Down ERC998:
    -   ERC998ERC721 → top-down composables that can transact and hold ERC721 tokens
    -   ERC998ERC20 → top-down composable tokens that can transact and hold ERC20 tokens
2.  Bottom-Up ERC998:
    -   ERC998ERC721 → bottom-up composable ERC721 tokens that can be owned by non-composable ERC721 tokens'
    -   ERC998ERC20 → bottom-up composable ERC20 tokens that can be owned by non-composable ERC721 tokens'

First, there's a couple of key elements of composable contracts that you should know before going in:

**Authentication** is important when you need to limit who or which contracts can execute specific actions. In top-down and bottom-up composables that use ERC721 tokens, the `rootOwner` is the address that "owns" the entire system of composables. For example, for a top-down token, the `rootOwner` is the one who holds the largest ERC998 basket that contains all the other children inside it. For a bottom-up token, the `rootOwner` is the one who holds the cube to which the bottom-up ERC998 composables are attached.
Authentication is pretty simple in an application; you compare the `rootOwner` to the `msg.sender`, whom is the user making the current call to the contract (and thus the owner of the contract at the time of deployment), as well as what's returned by `getApproved(tokenId)` and `isApprovedForAll(rootOwner, msg.sender)`.

From the EIP:

```
address rootOwner = address(rootOwnerOf(_tokenId));
require(rootOwner == msg.sender ||
  isApprovedForAll(rootOwner,msg.sender) ||
  getApproved(tokenId) == msg.sender;
```

You can also transfer an entire composable system from one `rootOwner` to another by using the different `approve` ERC721 functions like below:

```
function approve(address _approved, uint256 _tokenId) external {
  address rootOwner = address(rootOwnerOf(_tokenId));
  require(rootOwner == msg.sender || isApprovedForAll(rootOwner,msg.sender));

  rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] = _approved;
  emit Approval(rootOwner, _approved, _tokenId);
}

function getApproved(uint256 _tokenId) public view returns (address)  {
  address rootOwner = address(rootOwnerOf(_tokenId));
  return rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId];
}
```

_Traversal_ is another important concept that plays an important role when the composable system gets more complex. If you have lots of nested ERC998 composables of different types, one parenting the other, it can be hard to keep track of who the original `rootOwner` was. The functions `rootOwnerOf(uint256 _tokenId)` and `rootOwnerOfChild(address _childContract, uint256 _childTokenId)` can retrieve the `rootOwner` in both top-down and bottom-up composables.

For bottom-up composables, if the `rootOwnerOf` call for the parent token (the ERC721 cube) passes, then what's returned is the true `rootOwner` of the composable tree. If it fails, then you have to call `rootOwnerOfChild` instead to find its parent, which gives you the true `rootOwner` if it passes. If that still fails, then the address of whoever owns that token is the `rootOwner`.

This is what the `rootOwnerOfChild` logic looks like:

```
// Logic for calling rootOwnerOfChild for a tokenId
address tokenOwner = ownerOf(tokenId);
address childContract = address(this);
bytes32 rootOwner = ERC998ERC721(tokenOwner).rootOwnerOfChild(childContract, tokenId);
```

_Transfers_ follow the same simple format from composable to composable: _from whom_, _to whom_, and _what's_ transferred.

For example `getChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId)` transfers an ERC721 token with `address _childContract` and ID `uint256 _childTokenId` from the `address _from` parameters, to the token with ID `uint256 _tokenId`. Therefore, you can think of it as `getChild(from, to, what)`.

The same format applies for the function `safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId)`, except this can’t transfer tokens that are “owned” by other tokens. It can only transfer tokens that are directly owned by an actual address. (In other words, it can't transfer child composable tokens). The same exception applies to `transferFrom` functions.

OK, so now we've got all the pieces in place. Let's dig into the actual implementation!

### ERC998ERC721 Top-Down Implementation

#### For transferring tokens

For ERC721 contracts that have a `safeTransferFrom` function, you can use that function to transfer the token to a top-down composable. The `bytes data` argument is where you put the token ID of the top-down composable token that you're transferring the ERC721 to.

For ERC721 contracts that don't have this function, instead call the `approve` function to approve the top-down composable as an owner, and then in the composable contract, call `getChild` (which I explained previously).

`onERC721Received` is a function that's defined in the ERC721 standard, and it's always called after a `safeTransferFrom` function is called. This is how top-down composable contracts are notified that you've transferred an ERC721 token to it.

Another interesting method to note is `transferChildToParent`. It authenticates the caller and then transfers a bottom-up composable ERC998 token from a top-down composable token to another parent ERC721, basically shifting it from a basket and then hooking it onto a cube.

#### For `rootOwnerOf` and magic values

The first 4 bytes returned by `rootOwnerOf` is a "magic value", which is essentially something that gives contracts a way to show each other what interfaces they support. In this case, it's the magic value `0xcd740db5`, which denotes an ERC998 interface. The last 20 bytes of the returned value is the actual `rootOwner` address. The magic value ensures that even if you call `rootOwnerOf` on a contract that doesn't have that function, you'll still receive a valid returned value. The same goes for `rootOwnerOfChild` and `ownerOfChild` functions.

If you don't know whether a contract has any of these functions, you have to compare the first 4 bytes returned to the ERC998 magic value `0xcd740db5`.

Here is the complete ERC998ERC721 top-down interface:

```
pragma solidity ^0.5.0;

/// @title ERC998ERC721 Top-Down Composable Non-Fungible Token
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-998.md
///  Note: the ERC-165 identifier for this interface is 0x1efdf36a
interface ERC998ERC721TopDown {

  /// @dev This emits when a token receives a child token.
  /// @param _from The prior owner of the token.
  /// @param _toTokenId The token that receives the child token.
  event ReceivedChild(
    address indexed _from,
    uint256 indexed _toTokenId,
    address indexed _childContract,
    uint256 _childTokenId
  );

  /// @dev This emits when a child token is transferred from a token to an address.
  /// @param _fromTokenId The parent token that the child token is being transferred from.
  /// @param _to The new owner address of the child token.
  event TransferChild(
    uint256 indexed _fromTokenId,
    address indexed _to,
    address indexed _childContract,
    uint256 _childTokenId
  );

  /// @notice Get the root owner of tokenId.
  /// @param _tokenId The token to query for a root owner address
  /// @return rootOwner The root owner at the top of tree of tokens and ERC998 magic value.
  function rootOwnerOf(uint256 _tokenId) external view returns (bytes32 rootOwner);

  /// @notice Get the root owner of a child token.
  /// @param _childContract The contract address of the child token.
  /// @param _childTokenId The tokenId of the child.
  /// @return rootOwner The root owner at the top of tree of tokens and ERC998 magic value.
  function rootOwnerOfChild(
    address _childContract,
    uint256 _childTokenId
  )
    external
    view
    returns (bytes32 rootOwner);

  /// @notice Get the parent tokenId of a child token.
  /// @param _childContract The contract address of the child token.
  /// @param _childTokenId The tokenId of the child.
  /// @return parentTokenOwner The parent address of the parent token and ERC998 magic value
  /// @return parentTokenId The parent tokenId of _tokenId
  function ownerOfChild(
    address _childContract,
    uint256 _childTokenId
  )
    external
    view
    returns (
      bytes32 parentTokenOwner,
      uint256 parentTokenId
    );

  /// @notice A token receives a child token
  /// @param _operator The address that caused the transfer.
  /// @param _from The owner of the child token.
  /// @param _childTokenId The token that is being transferred to the parent.
  /// @param _data Up to the first 32 bytes contains an integer which is the receiving parent tokenId.
  function onERC721Received(
    address _operator,
    address _from,
    uint256 _childTokenId,
    bytes calldata _data
  )
    external
    returns(bytes4);

  /// @notice Transfer child token from top-down composable to address.
  /// @param _fromTokenId The owning token to transfer from.
  /// @param _to The address that receives the child token
  /// @param _childContract The ERC721 contract of the child token.
  /// @param _childTokenId The tokenId of the token that is being transferred.
  function transferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId
  )
    external;

  /// @notice Transfer child token from top-down composable to address.
  /// @param _fromTokenId The owning token to transfer from.
  /// @param _to The address that receives the child token
  /// @param _childContract The ERC721 contract of the child token.
  /// @param _childTokenId The tokenId of the token that is being transferred.
  function safeTransferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId
  )
    external;

  /// @notice Transfer child token from top-down composable to address.
  /// @param _fromTokenId The owning token to transfer from.
  /// @param _to The address that receives the child token
  /// @param _childContract The ERC721 contract of the child token.
  /// @param _childTokenId The tokenId of the token that is being transferred.
  /// @param _data Additional data with no specified format
  function safeTransferChild(
    uint256 _fromTokenId,
    address _to,
    address _childContract,
    uint256 _childTokenId,
    bytes calldata _data
  )
    external;

  /// @notice Transfer bottom-up composable child token from top-down composable to other ERC721 token.
  /// @param _fromTokenId The owning token to transfer from.
  /// @param _toContract The ERC721 contract of the receiving token
  /// @param _toTokenId The receiving token
  /// @param _childContract The bottom-up composable contract of the child token.
  /// @param _childTokenId The token that is being transferred.
  /// @param _data Additional data with no specified format
  function transferChildToParent(
    uint256 _fromTokenId,
    address _toContract,
    uint256 _toTokenId,
    address _childContract,
    uint256 _childTokenId,
    bytes calldata _data
  )
    external;

  /// @notice Get a child token from an ERC721 contract.
  /// @param _from The address that owns the child token.
  /// @param _tokenId The token that becomes the parent owner
  /// @param _childContract The ERC721 contract of the child token
  /// @param _childTokenId The tokenId of the child token
  function getChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  )
    external;
}
```

### ERC998ERC20 Top-Down Implementation

#### For transferring tokens

Use the `transfer(address _to, uint256 _value, bytes _data)` function on the ERC223 contract, where the `bytes _data` argument contains the integer value of the top-down composable receiver's token ID.
If the ERC20 contract doesn't support the ERC223 standard, then similar to ERC998ERC20, call the `approve` function in the ERC20 contract to approve the top-down composable as an owner, then call `getERC20(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value)` on the top-down composable contract so the tokens may be transferred.

Here is the complete ERC998ERC20 top-down interface:

```
pragma solidity ^0.5.0;

/// @title ERC998ERC20 Top-Down Composable Non-Fungible Token
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-998.md
///  Note: the ERC-165 identifier for this interface is 0x7294ffed
interface ERC998ERC20TopDown {

  /// @dev This emits when a token receives ERC20 tokens.
  /// @param _from The prior owner of the token.
  /// @param _toTokenId The token that receives the ERC20 tokens.
  /// @param _erc20Contract The ERC20 contract.
  /// @param _value The number of ERC20 tokens received.
  event ReceivedERC20(
    address indexed _from,
    uint256 indexed _toTokenId,
    address indexed _erc20Contract,
    uint256 _value
  );

  /// @dev This emits when a token transfers ERC20 tokens.
  /// @param _fromTokenId The token that owned the ERC20 tokens.
  /// @param _to The address that receives the ERC20 tokens.
  /// @param _erc20Contract The ERC20 contract.
  /// @param _value The number of ERC20 tokens transferred.
  event TransferERC20(
    uint256 indexed _fromTokenId,
    address indexed _to,
    address indexed _erc20Contract,
    uint256 _value
  );

  /// @notice A token receives ERC20 tokens
  /// @param _from The prior owner of the ERC20 tokens
  /// @param _value The number of ERC20 tokens received
  /// @param _data Up to the first 32 bytes contains an integer which is the receiving tokenId.
  function tokenFallback(address _from, uint256 _value, bytes calldata _data) external;

  /// @notice Look up the balance of ERC20 tokens for a specific token and ERC20 contract
  /// @param _tokenId The token that owns the ERC20 tokens
  /// @param _erc20Contract The ERC20 contract
  /// @return The number of ERC20 tokens owned by a token from an ERC20 contract
  function balanceOfERC20(
    uint256 _tokenId,
    address _erc20Contract
  )
    external
    view
    returns(uint256);

  /// @notice Transfer ERC20 tokens to address
  /// @param _tokenId The token to transfer from
  /// @param _value The address to send the ERC20 tokens to
  /// @param _erc20Contract The ERC20 contract
  /// @param _value The number of ERC20 tokens to transfer
  function transferERC20(
    uint256 _tokenId,
    address _to,
    address _erc20Contract,
    uint256 _value
  )
    external;

  /// @notice Transfer ERC20 tokens to address or ERC20 top-down composable
  /// @param _tokenId The token to transfer from
  /// @param _value The address to send the ERC20 tokens to
  /// @param _erc223Contract The ERC223 token contract
  /// @param _value The number of ERC20 tokens to transfer
  /// @param _data Additional data with no specified format, can be used to specify tokenId to transfer to
  function transferERC223(
    uint256 _tokenId,
    address _to,
    address _erc223Contract,
    uint256 _value,
    bytes calldata _data
  )
    external;

  /// @notice Get ERC20 tokens from ERC20 contract.
  /// @param _from The current owner address of the ERC20 tokens that are being transferred.
  /// @param _tokenId The token to transfer the ERC20 tokens to.
  /// @param _erc20Contract The ERC20 token contract
  /// @param _value The number of ERC20 tokens to transfer
  function getERC20(
    address _from,
    uint256 _tokenId,
    address _erc20Contract,
    uint256 _value
  )
    external;
}
```

### ERC998ERC721 Bottom-Up Implementation

These contracts store the address of their parent contract and their parent `tokenId`.

#### On `tokenOwnerOf`

You use this function to get the address and `tokenId` of the token's parent if it exists. If the boolean `isParent` (which is one of the outputs of the `tokenOwnerOf` function) returns true, then the `tokenOwner` is the parent ERC721's address. If it returns false, then the address returned is a user address.

Similar to the previously detailed implementations, the `tokenOwner` returns an ERC998 magic value in the first four bytes, whereas the last 20 bytes contain the token owner address.

Here is the complete ERC998ERC721 bottom-up interface:

```
pragma solidity ^0.5.0;

/// @title ERC998ERC721 Bottom-Up Composable Non-Fungible Token
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-998.md
///  Note: the ERC-165 identifier for this interface is 0xa1b23002
interface ERC998ERC721BottomUp {

  /// @dev This emits when a token is transferred to an ERC721 token
  /// @param _toContract The contract the token is transferred to
  /// @param _toTokenId The token the token is transferred to
  /// @param _tokenId The token that is transferred
  event TransferToParent(
    address indexed _toContract,
    uint256 indexed _toTokenId,
    uint256 _tokenId
  );

  /// @dev This emits when a token is transferred from an ERC721 token
  /// @param _fromContract The contract the token is transferred from
  /// @param _fromTokenId The token the token is transferred from
  /// @param _tokenId The token that is transferred
  event TransferFromParent(
    address indexed _fromContract,
    uint256 indexed _fromTokenId,
    uint256 _tokenId
  );

  /// @notice Get the root owner of tokenId.
  /// @param _tokenId The token to query for a root owner address
  /// @return rootOwner The root owner at the top of tree of tokens and ERC998 magic value.
  function rootOwnerOf(uint256 _tokenId) external view returns (bytes32 rootOwner);

  /// @notice Get the owner address and parent token (if there is one) of a token
  /// @param _tokenId The tokenId to query.
  /// @return tokenOwner The owner address of the token
  /// @return parentTokenId The parent owner of the token and ERC998 magic value
  /// @return isParent True if parentTokenId is a valid parent tokenId and false if there is no parent tokenId
  function tokenOwnerOf(
    uint256 _tokenId
  )
    external
    view
    returns (
      bytes32 tokenOwner,
      uint256 parentTokenId,
      bool isParent
    );

  /// @notice Transfer token from owner address to a token
  /// @param _from The owner address
  /// @param _toContract The ERC721 contract of the receiving token
  /// @param _toTokenId The receiving token
  /// @param _data Additional data with no specified format
  function transferToParent(
    address _from,
    address _toContract,
    uint256 _toTokenId,
    uint256 _tokenId,
    bytes calldata _data
  )
    external;

  /// @notice Transfer token from a token to an address
  /// @param _fromContract The address of the owning contract
  /// @param _fromTokenId The owning token
  /// @param _to The address the token is transferred to.
  /// @param _tokenId The token that is transferred
  /// @param _data Additional data with no specified format
  function transferFromParent(
    address _fromContract,
    uint256 _fromTokenId,
    address _to,
    uint256 _tokenId,
    bytes calldata _data
  )
    external;

  /// @notice Transfer a token from a token to another token
  /// @param _fromContract The address of the owning contract
  /// @param _fromTokenId The owning token
  /// @param _toContract The ERC721 contract of the receiving token
  /// @param _toTokenId The receiving token
  /// @param _tokenId The token that is transferred
  /// @param _data Additional data with no specified format
  function transferAsChild(
    address _fromContract,
    uint256 _fromTokenId,
    address _toContract,
    uint256 _toTokenId,
    uint256 _tokenId,
    bytes calldata _data
  )
    external;
}
```

### ERC998ERC20 Bottom-Up Implementation

Like ERC998ERC721 bottom-up contracts, ERC998ERC20 bottom-ups store their parent contract's address and `tokenId`. The main differences with the ERC223 standard are that ERC998ERC20 bottom-ups allow you to call for the parent token's balance, as well as transfer the bottom-ups between parent tokens. You track ownership by mapping the parent address, to the parent `tokenId`, and to the balance - all this in a nested mapping. This is in addition to the standard ERC223 address-to-balance mapping.

The simple function `balanceOfToken` allows you to check the parent ERC721 token's balance of ERC998ERC20 bottom-up composable tokens, in contrast to the usual ERC223 functionality that would return a user address' balance instead.

#### On transferring tokens

The `transferToParent` function allows you to move ownership of bottom-up tokens from an actual user to a parent ERC721 token.

There's a couple of important things to take note of here:

1.  The new ERC721 parent contract has to be compliant with ERC165 and therefore use the `supportsInterface` interface
2.  `transferToParent` has to make sure the new parent contract exists, and does this by calling `ownerOf` on the parent token's contract to see whether it throws an error or not
3.  After transferring, the function has to emit the `TransferToParent` event
4.  Of course, if the account transferring the tokens doesn't have sufficient balance, an error is thrown

The same specifications apply to all other transfer functions.

Here is the complete ERC998ERC721 bottom-up interface:

```
pragma solidity ^0.5.0;

/// @title ERC998ERC20 Bottom-Up Composable Fungible Token
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-998.md
/// Note: The ERC-165 identifier for this interface is 0xffafa991
interface ERC998ERC20BottomUp {

  /// @dev This emits when a token is transferred to an ERC721 token
  /// @param _toContract The contract the token is transferred to
  /// @param _toTokenId The token the token is transferred to
  /// @param _amount The amount of tokens transferred
  event TransferToParent(
    address indexed _toContract,
    uint256 indexed _toTokenId,
    uint256 _amount
  );

  /// @dev This emits when a token is transferred from an ERC721 token
  /// @param _fromContract The contract the token is transferred from
  /// @param _fromTokenId The token the token is transferred from
  /// @param _amount The amount of tokens transferred
  event TransferFromParent(
    address indexed _fromContract,
    uint256 indexed _fromTokenId,
    uint256 _amount
  );

  /// @notice Get the balance of a non-fungible parent token
  /// @param _tokenContract The contract tracking the parent token
  /// @param _tokenId The ID of the parent token
  /// @return amount The balance of the token
  function balanceOfToken(
    address _tokenContract,
    uint256 _tokenId
  )
    external
    view
    returns (uint256 amount);

  /// @notice Transfer tokens from owner address to a token
  /// @param _from The owner address
  /// @param _toContract The ERC721 contract of the receiving token
  /// @param _toTokenId The receiving token
  /// @param _amount The amount of tokens to transfer
  function transferToParent(
    address _from,
    address _toContract,
    uint256 _toTokenId,
    uint256 _amount
  )
    external;

  /// @notice Transfer token from a token to an address
  /// @param _fromContract The address of the owning contract
  /// @param _fromTokenId The owning token
  /// @param _to The address the token is transferred to
  /// @param _amount The amount of tokens to transfer
  function transferFromParent(
    address _fromContract,
    uint256 _fromTokenId,
    address _to,
    uint256 _amount
  )
    external;

  /// @notice Transfer token from a token to an address, using ERC223 semantics
  /// @param _fromContract The address of the owning contract
  /// @param _fromTokenId The owning token
  /// @param _to The address the token is transferred to
  /// @param _amount The amount of tokens to transfer
  /// @param _data Additional data with no specified format, can be used to specify the sender tokenId
  function transferFromParentERC223(
    address _fromContract,
    uint256 _fromTokenId,
    address _to,
    uint256 _amount,
    bytes calldata _data
  )
    external;

  /// @notice Transfer a token from a token to another token
  /// @param _fromContract The address of the owning contract
  /// @param _fromTokenId The owning token
  /// @param _toContract The ERC721 contract of the receiving token
  /// @param _toTokenId The receiving token
  /// @param _amount The amount tokens to transfer
  function transferAsChild(
    address _fromContract,
    uint256 _fromTokenId,
    address _toContract,
    uint256 _toTokenId,
    uint256 _amount
    )
    external;
}
```

### Now… So What?

Why should we actually care about crypto composables? We know what they do, but what is their potential for the future, and how are people and projects using them today?

Crypto composables brings us one step closer to a future where we can _actually_ use cryptocurrency  reliably and flexibly for a greater variety of financial applications across the world, thus addressing the complete set of needs of the population that it seeks adoption from. From the one-dimensional digital asset backed by an innovative foundational protocol built in 2008, we’re moving to a full-fledged digital economy that still has that same foundational protocol our community fell in love with in the first place.

There’s some super cool projects that are already leveraging crypto composables to do incredible things, and here’s a couple of them as mentioned in [this article](https://medium.com/coinmonks/crypto-composables-erc-998-update-5-eb0a748a9889):

1.  **[Mokens.io](https://mokens.io/about)** → Is the build-your-own crypto collectible! You can make  “limited edition” collections of your own collectible mokens, each with their own unique name, and sell them, trade them, or give them as you like. Mokens.io has become ERC998 compliant, which means your cryptokitty can actually own a moken! How cool is that?
2.  **[Caesar’s Triumph](https://www.caesarstriumph.com/)** → Is an epic empire-building game where each piece of land is a unique ERC721 non-fungible token. You can thus build a huge empire made up of ERC998 bottom-up child token “cities”, and even further down, “villages”. This allows you to trade an entire city with all its components, rather than having to manually transfer each one, which can take ages if you’ve advanced far enough into the game.
3.  **[Mintable.app](https://mintable.app/)** → Similar to mokens.io, this project allows you to create your own ERC721 NFTs, browse others’, and organize them in a streamlined manner. It’s essentially an ERC721 manager for when in-game assets or other crypto collectibles start to become a little confusing to make sense of yourself. This includes, of course, management of ERC998 NFTs, and further down the line, a visualization of the ownership tree.

To wrap up, ERC998 crypto composables are a new token standard that now allows you to do even more with your non-fungible tokens, and if moved into real-world verticals, can make our interactions with assets so much easier. They might seem complicated on the surface, but they’re not too hard to implement either, so do try it out and tinker with some of the smart contracts in this article!


---

- **Kauri original link:** https://kauri.io/gamifying-crypto-assets-with-the-erc998-composabl/436178ce670d4a9e9ffbd9cb7a8476fd/a
- **Kauri original author:** Ramy Zhang (@ramyjzhang)
- **Kauri original Publication date:** 2019-08-08
- **Kauri original tags:** cryptocurrency, erc20, ethereum, token-standard, erc721, erc998
- **Kauri original hash:** QmSSnQKTqcirc1kJpibuxAuehQdfUcpYFyodZzjwagT1RV
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



