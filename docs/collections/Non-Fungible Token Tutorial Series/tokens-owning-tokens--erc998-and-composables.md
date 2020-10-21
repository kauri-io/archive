---
title: Tokens Owning Tokens  ERC998 and Composables
summary: Cryptocomposables Were covering a lot of ERCs in this series, and it can be tough to keep track. To recap, the first two covered- 721 and 1155, are all about creating assets themselves. This one is a bit different, as its about assets (721 specifically) OWNING other assets (721 or 20). Why is that interesting? Imagine that you own this CryptoKitty. Now imagine that you want to buy this hat for it. And maybe you want to buy a racecar for KittyRaces After winning a few championships in your awesom
authors:
  - Kauri Team (@kauri)
date: 2018-09-04
some_url: 
---

# Tokens Owning Tokens  ERC998 and Composables



#### Cryptocomposables

We're covering a lot of ERCs in this series, and it can be tough to keep track. To recap, the first two covered: 721 and 1155, are all about creating assets themselves. This one is a bit different, as it's about assets (721 specifically) OWNING other assets (721 or 20). 

Why is that interesting? Imagine that you own this CryptoKitty. 

Now imagine that you want to buy this hat for it.

And maybe you want to buy a racecar for KittyRaces

After winning a few championships in your awesome trucker hat, someone makes an offer for you Kitty+Hat+Car. You decide to sell, transferring just your Kitty to the excited buyer. And since the hat and racecar are “owned” by the NFT representing your Kitty, they are effectively transferred as well.

ERC998 is an attempt to standardize the above situation: NFTs owning (or being owned by) other NFTs, or even owning ERC20s and other digital assets. The CryptoKitty example is just one possible case. There are many, many more, for instance treating the combination of NFTs as a new object all together (by combining traits in the metadata).

#### EIP998

https://github.com/ethereum/EIPs/issues/998

998 is a bit different in that their are two ways to adhere to the standard: Bottom Up and Top Down.

To understand the difference, I recommend [Nick Mudge's post] (https://hackernoon.com/top-down-and-bottom-up-composables-whats-the-difference-and-which-one-should-you-use-db939f6acf1d).

To summarize: 
Top Down tokens store information about their children, meaning any token can be a child of them, but existing tokens cannot be Top Down (since the child-token map hasn't been implemented).

Bottom Up tokens store information about their parents. The advantage here is that Bottom Up tokens can be transferred to any ERC721, and the disadvantage is that regular ERC721 tokens cannot be children of Bottom Up. Effectively, the advantages and disadvantages are the opposite of those in Top Down.

So when should you use Top Down or Bottom Up? It depends on you starting point, and your “anchor token”.

Nick sums this up quite well:

> If you want to transfer regular ERC721 tokens to non-fungible tokens, then use top-down composables.

> If you want to transfer non-fungible tokens to regular ERC721 tokens then use bottom-up composables.

> If you want an existing, regular 721 token to be the “anchor token” and owner of new tokens, you should use Bottom Up.

> If you're starting from scratch, Top Down is likely a better choice.

In the case of the CryptoKitties and KittyHat example, the Kitty NFT is the “anchor token” as it is the primary owner of the Hat (and any other items), and thus should control those items. Since the NFT already exists and is a regular ERC721, Bottom Up composable tokens should be used to create children.

#### The Implementation

https://github.com/mattlockyer/composables-998

An important note from the maintainers of this implementation:

> A WIP (Work-In-Progress) implementation and documentation repo for the proposed ERC-998 standard extension to ERC-721 on the Ethereum blockchain. The purpose of this repo is to see the theory in action to gather insights and feedback on the proposed ERC-998 standard.

#### Bottom Up

Below are the two main interfaces for the Bottom Up token (ComposableBottomUp.sol)

```
interface ERC998ERC721BottomUp {
    event TransferToParent(address indexed _toContract, uint256 indexed _toTokenId, uint256 _tokenId);
    event TransferFromParent(address indexed _fromContract, uint256 indexed _fromTokenId, uint256 _tokenId);


    function rootOwnerOf(uint256 _tokenId) external view returns (bytes rootOwner);

    /**
    * The tokenOwnerOf function gets the owner of the _tokenId which can be a user address or another ERC721 token.
    * The tokenOwner address return value can be either a user address or an ERC721 contract address.
    * If the tokenOwner address is a user address then parentTokenId will be 0 and should not be used or considered.
    * If tokenOwner address is a user address then isParent is false, otherwise isChild is true, which means that
    * tokenOwner is an ERC721 contract address and _tokenId is a child of tokenOwner and parentTokenId.
    */
    function tokenOwnerOf(uint256 _tokenId) external view returns (bytes32 tokenOwner, uint256 parentTokenId, bool isParent);

    // Transfers _tokenId as a child to _toContract and _toTokenId
    function transferToParent(address _from, address _toContract, uint256 _toTokenId, uint256 _tokenId, bytes _data) external;
    // Transfers _tokenId from a parent ERC721 token to a user address.
    function transferFromParent(address _fromContract, uint256 _fromTokenId, address _to, uint256 _tokenId, bytes _data) external;
    // Transfers _tokenId from a parent ERC721 token to a parent ERC721 token.
    function transferAsChild(address _fromContract, uint256 _fromTokenId, address _toContract, uint256 _toTokenId, uint256 _tokenId, bytes _data) external;

}

interface ERC998ERC721BottomUpEnumerable {
    function totalChildTokens(address _parentContract, uint256 _parentTokenId) external view returns (uint256);

    function childTokenByIndex(address _parentContract, uint256 _parentTokenId, uint256 _index) external view returns (uint256);
}
```

The above interfaces compose the key available functions for ERC998, in addition to entire set of ERC721 functions (link to post). Walking through we have:

```rootOwnerOf(uint256 _tokenId)```

Takes a token ID, traverses the token structure and returns the highest order token. For example, will return the CryptoKitty if given the ID of a KittyHat, and also if given a car wheel owned by a Kitty racecar, which is ultimately owned by a CryptoKitty.

```ownerOf(uint256 _tokenId)```

Used in the current 998 implementation. This is effectively a less-advanced version of rootOwnerOf, and will only work for tokens that were created in this contract (not external tokens, which root can handle).

```tokenOwnerOf(uint256 _tokenId) external view returns (bytes32 tokenOwner, uint256 parentTokenId, bool isParent)```

A very useful function that will return the direct parent of a token ID. If the owner is a user (not a contract), the tokenId will be 0 (and not used), as the owner is an externally-owned account with an address and no ID. Otherwise, the parent token contract address and token ID will be returned.

```transferToParent(address _from, address _toContract, uint256 _toTokenId, uint256 _tokenId, bytes _data)```

In a departure from 721, in 998 there are different transfer functions used to transfer in different situations. If your token is not currently owned by another token, you'll use this function to transfer it to a new parent token. So if you freshly minted a KittyHat, and want it to become the child of CryptoKitty #1, you would include the CK address as the _toContract, and 1 as the _toTokenId.

```transferFromParent(address _fromContract, uint256 _fromTokenId, address _to, uint256 _tokenId, bytes _data)```

If the token to be transferred already has a Parent token, you'll use transferFromParent, including the parent address as _fromContract, the parent token ID as _fromTokenId, and the new owner address (parent or not) as _to.

```transferAsChild(address _fromContract, uint256 _fromTokenId, address _toContract, uint256 _toTokenId, uint256 _tokenId, bytes _data)```

And in the case of transferring from one Parent to another Parent, you'll need to pass in both the current Parent token contract address and token ID, and the new Parent token address and ID.

#### Top Down

The Top Down (ComposableTopDown.sol) composable contract is a bit more complex and flexible than Bottom Up. The most interesting part is that Top Down tokens can own both 721 and 20/223 tokens in this implementation. 

```
interface ERC998ERC721TopDown {
    event ReceivedChild(address indexed _from, uint256 indexed _tokenId, address indexed _childContract, uint256 _childTokenId);
    event TransferChild(uint256 indexed tokenId, address indexed _to, address indexed _childContract, uint256 _childTokenId);

    function rootOwnerOf(uint256 _tokenId) external view returns (bytes32 rootOwner);
    function rootOwnerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 rootOwner);
    function ownerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 parentTokenOwner, uint256 parentTokenId);
    function onERC721Received(address _operator, address _from, uint256 _childTokenId, bytes _data) external returns (bytes4);
    function transferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external;
    function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external;
    function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId, bytes _data) external;
    function transferChildToParent(uint256 _fromTokenId, address _toContract, uint256 _toTokenId, address _childContract, uint256 _childTokenId, bytes _data) external;
    // getChild function enables older contracts like cryptokitties to be transferred into a composable
    // The _childContract must approve this contract. Then getChild can be called.
    function getChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) external;
}
```
```
rootOwnerOf(uint256 _tokenId) external view returns (bytes32 rootOwner);
rootOwnerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 rootOwner);
ownerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 parentTokenOwner, uint256 parentTokenId);
```

These functions are very similar to the ones from Bottom Up.

```transferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external;```

This function, along with the now recognizable safeTransfer versions can be used to to transfer a child token to a contract that is not necessarily 998 compliant.

```transferChildToParent(uint256 _fromTokenId, address _toContract, uint256 _toTokenId, address _childContract, uint256 _childTokenId, bytes _data) external```

Similar to transferAsChild from Bottom Up, and used to transfer a child token from one parent to another.

```getChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) external;
}```

This function is very cool, and (as the comments mention) allows 721 contracts to become child contracts. Before calling this function, the setApprovalForAll() 721 function must be called with the 998 contract's address.

```
interface ERC998ERC20TopDown {
    event ReceivedERC20(address indexed _from, uint256 indexed _tokenId, address indexed _erc20Contract, uint256 _value);
    event TransferERC20(uint256 indexed _tokenId, address indexed _to, address indexed _erc20Contract, uint256 _value);

    function tokenFallback(address _from, uint256 _value, bytes _data) external;
    function balanceOfERC20(uint256 _tokenId, address __erc20Contract) external view returns (uint256);
    function transferERC20(uint256 _tokenId, address _to, address _erc20Contract, uint256 _value) external;
    function transferERC223(uint256 _tokenId, address _to, address _erc223Contract, uint256 _value, bytes _data) external;
    function getERC20(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value) external;

}
```
```tokenFallback(address _from, uint256 _value, bytes _data) external;```

Required for ERC223.

```
transferERC20(uint256 _tokenId, address _to, address _erc20Contract, uint256 _value) external;
transferERC223(uint256 _tokenId, address _to, address _erc223Contract, uint256 _value, bytes _data) external;
```

No real surprises here, as these are used to transfer 20 and 223 tokens, respectively. 

```getERC20(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value) external;```

This function can be used the same way as getChild() above, first requiring an “approve” call.

**Creating a 998-Compliant Token**

The reference implementation is still a WIP, and can be tricky to use as-is. I recommend starting with ComposableBottomUp.sol first, as we were able to get that one working more easily than TopDown.

We'll be writing a tutorial on using the implementation in the next few weeks, so stay watch out for that!









---

- **Kauri original title:** Tokens Owning Tokens  ERC998 and Composables
- **Kauri original link:** https://kauri.io/tokens-owning-tokens-erc998-and-composables/9a8ed83233e0433e95f95f9547f27085/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2018-09-04
- **Kauri original tags:** none
- **Kauri original hash:** QmbLLE5RqkgnhRMQd5NpQ2L2pJzxiBKg5Cx6xYjMUvNJHp
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



