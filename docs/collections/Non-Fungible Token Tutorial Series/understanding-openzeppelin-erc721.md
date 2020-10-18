---
title: Understanding OpenZeppelin ERC721
summary: What is an NFT? Non-fungible Tokens (NFTs/NFTYs/Nifties) are an emerging tool to create provably unique digital assets. Whereas ERC20 ushered in a flood of fungible (where no single token or fraction of a token is unique or distinguishable from any other) tokens, ERC721 and others are allowing for rare and unique units. These units can represent everything from a specific piece of digital artwork (or physical art!) to a real estate asset, financial instrument (a futures contract to buy 1,000 bar
authors:
  - Kauri Team (@kauri)
date: 2018-09-04
some_url: 
---

# Understanding OpenZeppelin ERC721


#### What is an NFT?

Non-fungible Tokens (NFTs/NFTYs/Nifties) are an emerging tool to create provably unique digital assets. Whereas ERC20 ushered in a flood of fungible (where no single token or fraction of a token is unique or distinguishable from any other) tokens, ERC721 and others are allowing for rare and unique units. These units can represent everything from a specific piece of digital artwork (or physical art!) to a real estate asset, financial instrument (a futures contract to buy 1,000 barrels of oil for $60k on December 1), or even a [KYC compliance check](https://blog.sendwyre.com/community-driven-on-chain-compliance-d334e0f5962b).

One of the first implementations of the NFT pattern is CryptoKitties from Axiom Zen, a wildly (at least by Dapp standards) popular game centered around collecting and breeding NFT-based cats. CryptoKitties used one of the first implementations of ERC721, the original proposed NFT standard. 

In the 6 months since the release of CK, NFTs have exploded, with major organizations and game studios developing products around the concept of digital collectibles. In this article, we'll walk through the standard interface referred to in EIP721, as well as the popular OpenZeppelin implementation. And most importantly, how to use it yourself!

#### Getting to Know the Standard

EIP 721: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md

```
interface ERC721 /* is ERC165 */ {

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    function balanceOf(address _owner) external view returns (uint256);

    function ownerOf(uint256 _tokenId) external view returns (address);

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

    function approve(address _approved, uint256 _tokenId) external payable;

    function setApprovalForAll(address _operator, bool _approved) external;

    function getApproved(uint256 _tokenId) external view returns (address);

    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}

interface ERC165 {

    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}
```

The interface itself is composed of 8 functions:

`balanceOf`: returns the number of tokens owned by the given address

`ownerOf`: returns the address that owns a particular token (by unique ID)

`transferFrom`: transfers the token from one address to another

`safeTransferFrom`: performs the same action as transferFrom, but will fail if the receiver (_to) has not implemented the ERC721 functionality. This is done to prevent the accidental burning of the token, as a contract without ERC721 would have no support for moving the token elsewhere.

`approve`: sets an address as the “approved” owner, but does not transfer the token to them (they can do so in the future by using transferFrom). note: the specified token (by tokenId) must be owned by the sender (msg.sender)

`setApprovalForAll`: similar to approve, but sets the address as the “approved” owner for all tokens owned by the sender (msg.sender)

`getApproved`: returns the approved owner of a _tokenId

`isApprovedForAll`: returns true or false if the _operator is listed as the approved owner for all of _owner's tokens (setApprovalForAll called previously)


#### The OpenZeppelin implementation

As with many common smart contract patterns, the Zeppelin team has released an audited version of the ERC721 implementation, which will likely be one of the most highly used. There are 6 files that compose the standard.

OZ files
https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/token/ERC721

**ERC721Basic.sol** 
Implements the standard interface

**ERC721BasicToken.sol**
Provides a basic token implementation, minus the option metadata and enumerable extensions

**ERC721Holder.sol**
Can be inherited to receive ERC721 transfers to a smart contract (implemented in ERC721Receiver.sol). 
Note:
If you want your contract to receive ERC721, this is the one you want!

**ERC721.sol** 
Packages the optional metadata and enumerable extensions for use in ERC721Token.sol

**ERC721Token.sol** 
This is the full implementation of the standard, and what we will be focusing on.

### Most Relevant Functions

**Constructor**
```
constructor(string _name, string _symbol) public {}
```
Set the name and symbol of the contract

**Getter Functions**
```
  function name() external view returns (string) {
    return name_;
  }

  /**
   * @dev Gets the token symbol
   * @return string representing the token symbol
   */
  function symbol() external view returns (string) {
    return symbol_;
  }

  /**
   * @dev Returns an URI for a given token ID
   * Throws if the token ID does not exist. May return an empty string.
   * @param _tokenId uint256 ID of the token to query
   */
  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));
    return tokenURIs[_tokenId];
  }
```

**Mint**

Creates a new token with a given Id (reverts if this Id already exists) and transfers to a given address

```
  function _mint(address _to, uint256 _tokenId) internal {
    super._mint(_to, _tokenId);

    allTokensIndex[_tokenId] = allTokens.length;
    allTokens.push(_tokenId);
  }
```

**Burn**

Removes from circulation

```
  function _burn(address _owner, uint256 _tokenId) internal {
    super._burn(_owner, _tokenId);

    // Clear metadata (if any)
    if (bytes(tokenURIs[_tokenId]).length != 0) {
      delete tokenURIs[_tokenId];
    }
  }
```

#### Metadata

Metadata is crucial to the vast majority of NFTs, as it gives the token it's unique attributes. In CryptoKitties for instance, this can be the name of the cat, it's “cattributes”, and other useful information.

To learn more about this standard: read our article here.

#### Creating a Token

Below is a very simple example of using the OpenZeppelin ERC721Token contract.

```
pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title KauriBadges
 * KauriBadges - non-fungible badges
 */
contract KauriBadge is ERC721Token, Ownable {
    constructor() ERC721Token("KauriBadge", "KAB") public { }

    /**
    * @dev Mints a token to an address with a tokenURI.
    * @param _to address of the future owner of the token
    * @param _tokenURI token URI for the token
    */
    function mintTo(address _to, string _tokenURI) public onlyOwner {
        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
    }

    /**
    * @dev calculates the next token ID based on totalSupply
    * @return uint256 for the next token ID
    */
    function _getNextTokenId() private view returns (uint256) {
        return totalSupply().add(1); 
    }
}
```
Starting with the constructor:

`constructor() ERC721Token("KauriBadge", "KAB") public { }`

Since the ERC721Token takes two strings, name and symbol, those arguments are included in the instantiation here (“KauriBadge”, “KAB”)

Next is mintTo:
In this case, mintTo is limited to use by the creator of the contract (OpenZeppelin Ownable contract) using the onlyOwner modifer.

`function mintTo(address _to, string _tokenURI) public onlyOwner {}`

In order to keep the token IDs simple and sequential, an internal function _getNextTokenId() counts the current token supply (using the totalSupply getter) and adds 1. This is then used in the internal _mint function as the tokenId. Next, the metadata URI (if provided) is set using the _setTokenURI function and the newly created tokenId.

```
function _getNextTokenId() private view returns (uint256) {
        return totalSupply().add(1); 
    }
```

#### Wrap Up

In this article, we've covered the ERC721 token standard, the OpenZeppelin implementation, and how to use the implementation in a simple contract. Further articles in this series will cover more advanced usage patterns for NFTs, including Refungibles, Cryptocomposables (ERC998), and other NFT-compatible standards like ERC1155.



---

- **Kauri original link:** https://kauri.io/understanding-openzeppelin-erc721/9a7a50e503a1477f8b91397ecf1677da/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2018-09-04
- **Kauri original tags:** none
- **Kauri original hash:** Qmb5ysTem1C8r4LQ1kcSUrg9gqFGnz95nm6CyuQP4CUJaW
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



