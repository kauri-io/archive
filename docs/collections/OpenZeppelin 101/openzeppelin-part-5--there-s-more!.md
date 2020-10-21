---
title: OpenZeppelin Part 5  There's More!
summary: Theres More! OpenZeppelin has a wide range of utilities to help add more complexity to your contracts. Cryptography Within the cryptography folder are two contracts to help with security- ECDSA.sol - This contract helps you to manage and recover your ECDSA signatures (Elliptic Curve Digital Signature Algorithm). MerkleProof.sol - Functions to verify Merkle proofs. Merkle proofs make sure that data is in the Merkle tree.pragma solidity ^0.5.2; import openzeppelin-solidity/contracts/cryptography/E
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-19
some_url: 
---

# OpenZeppelin Part 5  There's More!

![](https://ipfs.infura.io/ipfs/QmXpNnBRArmx3E36X5niZXricpaMk4QHX9GnJaeP8VCbZG)


## There's More!

OpenZeppelin has a wide range of utilities to help add more complexity to your contracts.

### Cryptography

Within the cryptography folder are two contracts to help with security:

- _ECDSA.sol_ : This contract helps you to manage and recover your ECDSA signatures (Elliptic Curve Digital Signature Algorithm).
- _MerkleProof.sol_ : Functions to verify Merkle proofs. Merkle proofs make sure that data is in the Merkle tree.

```
pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract ECDSAMock {
    using ECDSA for bytes32;

    function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
        return hash.recover(signature);
    }

    function toEthSignedMessageHash(bytes32 hash) public pure returns (bytes32) {
        return hash.toEthSignedMessageHash();
    }
}
```

Read more in the [documentation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/mocks/ECDSAMock.sol).

### Drafts

The drafts folder contains contracts which are in their development stage.

- _Counters.sol_ : A simple counter contract.
- _ERC20Migrator.sol_ : Used to migrate an ERC20 token from one contract to another.
- _SignatureBouncer.sol_ : Set a signature as a permission to do an action.
- _SignedSafeMath.sol_ : Performs math with a safety check that reverts if there is an error.
- _TokenVesting.sol_ : A token holder contract that gradually releases its token balance.

### Introspection

Introspection is a set of contracts that perform interface detection. They allow you to determine if your contract will support the interface you want to use.

Earlier in the series we introduced token standards. In this tutorial, we are going to talk about another standard called ERC165. ERC165 maintains run time interface detection. The introspection folder provides the following contracts:

- **IERC615** : Base interface that ERC165 conforms to. It also defines the interface you're working on.
- **ERC165** : Supports interface detection using a lookup table.
- **ERC165Checked** : Simplifies the process of checking if a contract supports the interface you want to use.

```
pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";

contract ERC165Mock is ERC165 {
    function registerInterface(bytes4 interfaceId) public {
        _registerInterface(interfaceId);
    }
}
```

Read more in the [documentation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/mocks/ERC165Mock.sol).

**Note**: When we refer to the interface, we are talking about what the contracts Application Binary Interface (ABI) can represent. The ABI is the interface by which the application program gains access to the operating system and other services.

### Lifecycle

Lifecycle contains a single contract called _Pausable.sol_ which allows child contracts to have an emergency stop feature.

### Math

- _Math.sol_ : Assorted math operations.
- _SafeMath.sol_ : Math operations that protect your contract from overflow errors.

```
pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract SafeMathMock {
    function mul(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.mul(a, b);
    }

    function div(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.div(a, b);
    }

    function sub(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.sub(a, b);
    }

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.add(a, b);
    }

    function mod(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.mod(a, b);
    }
}
```

Read more in the [documentation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/mocks/SafeMathMock.sol).

### Payment

Payment allows you to set different properties in regards to payment options.

- _PullPayment.sol_ : Fix stalling problems by using an `asyncSend()` function to send money to ex) a person and then requesting that they withdraw the amount later.
- _PaymentSplitter.sol_ : You can split a payment between multiple people in whichever percentages you want.
- _ConditionalEscrow.sol_ : An escrow contract that only allows a withdrawal if a condition is met.
- _Escrow.sol_ : Holds ether until the payee of the contract withdraws it. Thus It governs the release of funds involved in a transaction.
- _RefundEscrow.sol_ : Escrow that holds funds for a beneficiary.

```Solidity
pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/payment/PullPayment.sol";

contract PullPaymentMock is PullPayment {
    constructor () public payable {
    }

    function callTransfer(address dest, uint256 amount) public {
        _asyncTransfer(dest, amount);
    }
}
```

Read more in the [documentation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/mocks/PullPaymentMock.sol).

### Utilities

Utilities contains contracts that don't fall under the other categories.

- _Address.sol_ : Tells you if the target address belongs to a contract.
- _Arrays.sol_ : A search that looks through a sorted array to find the index of an element value.
- _ReentrancyGuard.sol_ : Helps your contract guard against reentrancy attacks (a bug or attack on your contract).

```Solidity
pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/utils/Address.sol";

contract AddressImpl {
    function isContract(address account) external view returns (bool) {
        return Address.isContract(account);
    }
}
```

Read more in the [documentation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/mocks/AddressImpl.sol).

### Next Steps

OpenZeppelin provides the user with a multitude of contracts to support the creation of complex contracts.

- [Documentation](https://openzeppelin.org/api/docs/learn-about-utilities.html)
- [More examples](https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/mocks)


---

- **Kauri original title:** OpenZeppelin Part 5  There's More!
- **Kauri original link:** https://kauri.io/openzeppelin-part-5-theres-more/83d04613ba4a4a428d941483fe4fc45c/a
- **Kauri original author:** Juliette Rocco (@jmrocco)
- **Kauri original Publication date:** 2019-03-19
- **Kauri original tags:** smart-contract, openzeppelin, pay-ment, cryptography, zeppelin
- **Kauri original hash:** QmZdmm3HfsgcPeFRubeC9fTt5wqjGf1AG8F5uE7b4s4bNs
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



