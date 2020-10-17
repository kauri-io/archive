---
title: OpenZeppelin Part 2  Access Control
summary: Access Control What is It? The first category of contracts is access control. Access control allows a developer to regulate who can use certain features of the contract. Examples are- minting tokens, voting on proposals, ownership, etc. This feature is useful for creating a restrictive contract. How to Use OpenZeppelin provides two contracts- Ownable.sol and Roles.sol for access control. Both methods are useful in different scenarios depending on how restrictive you want the contract to be. Owne
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-19
some_url: 
---

# OpenZeppelin Part 2  Access Control

# Access Control

## What is It?

The first category of contracts is access control. Access control allows a developer to regulate who can use certain features of the contract. Examples are: minting tokens, voting on proposals, ownership, etc. This feature is useful for creating a restrictive contract.

## How to Use

OpenZeppelin provides two contracts: _Ownable.sol_ and _Roles.sol_ for access control. Both methods are useful in different scenarios depending on how restrictive you want the contract to be.

### Ownership

Ownership is the most basic form of access control. It's the best method to use when you have one administrative user. To incorporate ownership, add an import statement at the beginning of your contract.

```solidity
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
```

Importing the _Ownable.sol_ contract allows you to use functions such as `transferOwnership(address newOwner)` to transfer ownership to different users and `renounceOwnership()` to renounce ownership of the contract all together. Keep in mind that once a contract is renounced it cannot be claimed again.

The default owner of the contract is the `msg.sender` of the contract. You can change the owner in the _Ownable.sol_ file.

Ownable contracts have an `is Ownable` statement. To specify which functions you only want the administrator to have access to, add `onlyOwner`.

```solidity
pragma solidity ^ 0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyContract is Ownable {

  function everyone() public {
    // anyone can use this function
  }

  function notEveryone() public onlyOwner {
    //only the owner can call this function
  }
}
```

_Ownable.sol_ is a basic implementation of access control that is optimal for a smaller group of users as well as one administrator.

### Roles

Access control is also utilized through the _contracts/access/Roles.sol_ contract. This contract allows you to assign roles to different users as well as control who can use certain functions. This is the best method when you have a multiple of users with varying levels of authority.

Add `import "openzeppelin-solidity/contracts/access/Roles.sol";` to the top of your contract. Create your different roles `Role private "your_Role"`. A require statement in your function states which users have access to it.

```solidity
pragma solidity ^ 0.5.2;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract someRoles {
  using Roles for Roles.Role;

  Roles.Role private roleOne;

  function onlyRoleOne() public {
    //only roleOne can use this function
    require(roleOne.has(msg.sender), "You must be roleOne");
  }

  function anyone() public {
    //anyone can use this function
  }

}
```

### OpenZeppelin Roles

Within the access folder, there are premade roles for you to use: `Capper`, `Minter`,`Pauser`,`Signer`,`Whitelist Admin`,and `Whitelisted`. To use any of these premade roles, import them the same way as with the other contracts. They contain functions to assign the role to your users, renounce the role, and restrict access for functions. All six contracts are identical to each other, except for their names. Thus if you want, you can create your own role contract using one of them as a template. To use, you import it into your function. The benefit of doing this would be that it provides a more detailed role. It also makes your code shorter.

## More Details

- <https://openzeppelin.org/api/docs/learn-about-access-control.html>
- <https://openzeppelin.org/api/docs/ownership_Ownable.html>
- <https://openzeppelin.org/api/docs/access_Roles.html>

For more examples of using _Ownable.sol_ and _Roles.sol_ check out the following links to open source code:

- [Ownable](https://github.com/search?utf8=%E2%9C%93&q=import+%22openzeppelin-solidity%2Fcontracts%2Fownership%2FOwnable.sol%22%3B&type=Code)
- [Roles](https://github.com/search?utf8=%E2%9C%93&q=import+%22openzeppelin-solidity%2Fcontracts%2Faccess%2FRoles.sol%22%3B&type=Code)