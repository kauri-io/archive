---
title: TRC10 Transfer in Smart Contracts
summary: Introduction TRC10 token is a system-level token type in TRON. Compared to TRC20 tokens, TRC10 tokens face a user experience flexibility issue. In Odyssey 3.2, developers and their smart contract callers can interact with TRC10 token via smart contracts according to the contract logic, giving them more control to implement their token in business scenarios. Unlike a TRC20 token, sending TRC10 tokens is consistent with transferring TRX in a contract, meaning TRC10 usage is similar to TRX usage. T
authors:
  - Kauri Team (@kauri)
date: 2019-04-01
some_url: 
---

# TRC10 Transfer in Smart Contracts


## Introduction

TRC10 token is a system-level token type in TRON. Compared to TRC20 tokens, TRC10 tokens face a user experience flexibility issue. In Odyssey 3.2, developers and their smart contract callers can interact with TRC10 token via smart contracts according to the contract logic, giving them more control to implement their token in business scenarios. Unlike a TRC20 token, sending TRC10 tokens is consistent with transferring TRX in a contract, meaning TRC10 usage is similar to TRX usage. 

## Transfer TRC10 to Smart Contract Accounts

TRC10 tokens can be transferred to a smart contract via a contract call. The contract call uses the two gRPC APIs of DeployContract and TriggerContract.

### Wallet-CLI and Examples

DeployContract

```
deployContract <contractName> <abi> <bytecode> <constructor signature>   <constructor params> <isHex> <feeLimit> <consumer_percentage> <energyLimit> <callValue> <tokenValue> <tokenId>
```

```
deployContract testContract [{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"f1","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"i","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}] 6080604052600160005534801561001557600080fd5b50d3801561002257600080fd5b50d2801561002f57600080fd5b5060ef8061003e6000396000f30060806040526004361060485763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166382e7eb3d8114604d578063e5aa3d5814607c575b600080fd5b348015605857600080fd5b50d38015606457600080fd5b50d28015607057600080fd5b50607a60043560b8565b005b348015608757600080fd5b50d38015609357600080fd5b50d28015609f57600080fd5b5060a660bd565b60408051918252519081900360200190f35b600055565b600054815600a165627a7a72305820cd4cf61efb71c4c984be5b1e4d84459871b6b10a93a80874a8a96fa3685cccb10029 # # false 1000000000 0 100000000 0 0 1000001
```

TriggerContract

```
triggercontract <contractAddress> <function signature> <function_parameters> <isHex>  <feeLimit> <callValue> <tokenValue> <tokenId> 
```

```
triggercontract TTWq4vMEYB2yibAbPV7gQ4mrqTyX92fha6 set(uint256, uint256) 1,1 false  1000000       0            10             1000001  
```

### New Parameters Explanation

_**tokenValue**_ 
The token amount caller wants to send into the contract account from the caller’s account.

_**tokenId**_ 
The target token identifier, which is an int64 type in ProtoBuf. In the Wallet client, use # to represent a void field for tokenId.

> **OriginEnergyLimit** is a new feature in Odyssey_v3.2, which limits the energy cost when a caller spends the developer’s energy. It means the contract owner can set a maximum energy cost value to prevent the other user from over-using the owner’s resource. 
**TokenId** is a new feature in Odyssey_v3.2. It can be found in a new map field called assetV2 in an account. Use GetAccount(Account) to obtain the TokenId and its value. TokenId is set by the system to begin from number 1_000_001. When a new TRC10 token is created, the number adds 1 and sets the ID for this token.

## TRC10 Interaction in Smart Contracts

**TRC10 Contract Example**

```
 pragma solidity ^0.4.24;
contract transferTokenContract {
    constructor() payable public{}
    function() payable public{}
    function transferTokenTest(address toAddress, uint256 tokenValue, trcToken id) payable public    {
        toAddress.transferToken(tokenValue, id);
    }
    function msgTokenValueAndTokenIdTest() public payable returns(trcToken, uint256){
        trcToken id = msg.tokenid;
        uint256 value = msg.tokenvalue;
        return (id, value);
    }
    function getTokenBalanceTest(address accountAddress) payable public returns (uint256){
        trcToken id = 1000001;
        return accountAddress.tokenBalance(id);
    }
}
```

**TRC Token Type**

Odyssey_v3.2 defined a new type (trcToken) for TRC10 token, which represents the tokenId in a token transfer operation. TRC10 token can be converted to uint256 type and vice versa.

**Transfer Tokens**

```
address.transferToken(uint256 tokenValue, trcToken tokenId) 
```

Odyssey_v3.2 defined a new transferToken function for TRC10 token transferring in TRON solidity compiler and also supported in JAVA-TRON. An address type variable invokes this native function, which means the current contract would like to transfer a specific amount of target token from the contract’s account to this address’s account. TransferToken function shares similar mechanisms as the transfer(uint256) function. Only 2300 energy is sent to this function and its related fallback function.

**Token Balance Querying**

```
address.tokenBalance(trcToken) returns(uint256 tokenAmount)
```

Odyssey_v3.2 defined a new tokenBalance function for TRC10 token balance querying. An address type variable invokes this native function, which returns the amount of target token owned by the address account.

**TokenValue & TokenID**

Msg.tokenvalue, represents the token value in the current msg call, with a default value of 0. Msg.tokenid, represents the token id in current msg call, with a default value of 0.

## Solidity Compiler

**GitHub**

<a href="https://github.com/tronprotocol/solidity/tree/Odyssey_v3.2" target="_blank">Odyssey v3.2</a>

> The bytecode generated by the new TRON/solidity Odyssey_v3.2 compiler will NOT work before ALLOW_TVM_TRANSFER_TRC10 proposal in JAVA-TRON Odyssey_v3.2 is approved. As a result, TRON-Studio and any other tools depending on the TRON compiler should not import version 3.2 compilers and expose to the public until ALLOW_TVM_TRANSFER_TRC10 proposal is approved on the chain.