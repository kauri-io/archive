---
title: Quick Dive into the Move Programming Language
summary: NOTE- This is a quick summary on my thoughts as I read through Libras Move Technical Paper, learning as I type. Two Different Types of Programs- Transaction Scripts & Modules Transaction scripts are more single-use, and can invoke modules Modules are long-term pieces of code stored in Libras global state Move Global State Libras global state is a mapping of account addresses => accounts. Think 0x0, 0x1, 0x2 in succession, with each of these account addresses able to hold zero or more modules and
authors:
  - Wil Barnes (@wil)
date: 2019-06-20
some_url: 
---

# Quick Dive into the Move Programming Language


**NOTE:** This is a quick summary on my thoughts as I read through Libra's Move Technical Paper, learning as I type. 

## Two Different Types of Programs: Transaction Scripts & Modules

- **_Transaction scripts_** are more single-use, and can invoke modules
- **_Modules_** are long-term pieces of code stored in Libra's global state

## Move Global State
- Libra's global state is a mapping of account addresses => accounts.
- Think 0x0, 0x1, 0x2 in succession, with each of these account addresses able to hold zero or more modules and at least one resource values. 
- Say at account address 0x1337 I have module deployed named 'Multisig' and a resource type called 'Wallet.'
- 0x1337 would consist of our 'module/Multisig' module and our '0x1337.Multisig.Wallet' resource type.
- More modules and resource types can still be added to our 0x1337 address.
- "_Accounts can contain at most one resource value of a given type and at most one module with a given name_" [4.1, 1st sentence] 
- Move is designed so that malicious actors outside the module cannot affect the resource types within the module. 

## Drawing Comparisons 

#### Libra & Ethereum 1 transactions are nearly identical

- Both include gas price & gas supply mechanisms.
- Libra's 'sequence' == Ethereum's 'nonce.'
- Both implement 'all-or-nothing' transactions; out-of-gas, failed require/assert, result in reversion of whole transaction.

### Libra 'Modules' & Ethereum 'Smart Contracts'

- Fairly similar, with nuances
- Modules enforce strong data abstraction: "Critical operations on a resource type T may only be performed inside a module that defines T." [Section 3.1, last sentence]
- A struct, or presumably any resource type, within a module can only be changed by that module. 

#### Move VM & Ethereum Virtual Machine (EVM)

- "_Move bytecode instructions are executed by a stack-based interpreter similar to the Common Language Runtime and Java Virtual Machine_." [5.1 1st paragraph, 1st sentence]
- "_Execution of Move programs is metered in a manner similar to the EVM. Each bytecode instructed has an associated gas unit cost, and any transaction to be executed must include a gas unit budget. The interpreter track sthe gas units remaining during execution and halts with an error if the amount remaining reaches zero_." [5.1 4th paragraph, 1st sentence]

#### A Note on Transaction Scripts

- A rough parallel for a transaction script would be the 'main.rs' in Rust or 'main.py' in Python.
- "[...] scripts can perform either expressive one-off behaviors (such as paying a specific set of recipients) or reusable behaviors (by invoking a single procedure that encapsulates the reusable logic)_" [3.2, 1st paragraph, 5th sentence]


## Move VM Nuances 

### No Dynamic Dispatch 
- Dynamic dispatching in Ethereum, or the process of determining which function to call at runtime, was the culprit behind a pivotal event that literally split the chain in two.  
- No dynamic dispatch in Move, code execution is decided at compile time.

### "Duplicating currency by changing move(coin) to copy(coin)"
- Currency can't be duplicated through use of the 'copy()' function (though unrestricted values like u64 and address can be copied). 
- Double-spending is prevented using the account sequence. 

### "Reusing currency by writing move(coin) twice"
- Calling 'move()' twice on a resource results in a bytecode verification error. 

### "Losing currency by neglecting to move(coin)"
- You can't use 'move()' twice. Not moving the coin also triggers a bytecode verification error. 

We're going to conclude here. This was simply a quick primer on the Move language with some rough comparisons to the current state of Ethereum. 

This guide will be updated over time as I gain more experience working with the tech. Additionally, I intend on penning a technical dive into transaction scripts and modules. 









