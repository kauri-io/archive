---
title: A Deep Dive into the Ethereum Virtual Machine (EVM) - part 1- Introduction
summary: This is the first article of a 4-part series on the EVM; 1. Part 1- Introduction to the EVM 2. Part 2- Memory and Storage on the EVM 3. Part 3- Execution Model of the EVM 4. Part 4- Relationship of the EVM with High-level contract-oriented languages evm-architecture In computing, a virtual machine is an emulation of a computer system which may be implemented as a specialized hardware, software or a combination of both. (source- wikipedia) Virtual machines may be generally categorized into two ty
authors:
  - Mayowa Tudonu (@mr-mayowa)
date: 2019-06-26
some_url: 
---

This is the first article of a 4-part series on the EVM;
1. Part 1: [Introduction to the EVM](https://kauri.io/article/b4a6d12332bd4ad58535ac2d59d95dff/v1/a-deep-dive-into-the-ethereum-virtual-machine-(evm)-part-1:-introduction)
2. Part 2: [Memory and Storage on the EVM](https://kauri.io/article/766e5d1e1ba240a7976943b659a871fc/v1/a-deep-dive-into-the-ethereum-virtual-machine-(evm)-part-2:-memory-and-storage)
3. Part 3: Execution Model of the EVM
4. Part 4: Relationship of the EVM with High-level contract-oriented languages


![evm-architecture](https://preview.ibb.co/bM7C9p/compressed_evm.png)

In computing, a virtual machine is an emulation of a computer system which may be 
implemented as a specialized hardware, software or a combination of both. 
(source: [wikipedia](https://en.wikipedia.org/wiki/Virtual_machine))
Virtual machines may be generally categorized into two types: 
- System virtual machines: Virtual machines that provide the functionality needed to 
execute an entire operating system on a host machine.
- Process virtual machines: Virtual machines that are designed to execute programs 
in a platform-independent environment. They can also be referred to as **_Managed 
Runtime Environments_** as they manage their own runtime environment and processes on 
the host machine. 
The EVM may be loosely classified as a process virtual machine. 

### Overview of the Ethereum Virtual Machine (EVM)
The Ethereum Virtual Machine is a _**quasi-Turing complete machine**_ which implements 
the execution model of the Ethereum blockchain by providing a runtime environment 
for smart contracts to be executed which then alter the state of the blockchain. 
>In computing, a machine is said to be Turing complete if it can solve any problem 
that a Turing machine can, _**given an appropriate algorithm, the necessary time and 
memory**_.

On the EVM, the appropriate algorithm is implemented with smart contracts while the 
memory is represented by a **_virtual byte-array ROM_**.

The EVM is referred to as a quasi-Turing complete machine because unlike machines 
based von Neumann architecture where computation is bounded by memory and time, 
computation on the EVM is bounded by a parameter called _**gas**_.
Gas is unit cost of executing an operation on the Ethereum computation engine.
Before a program (smart contract) is executed on the EVM, the gas cost for each operation in the 
program is estimated in advance and then paid for as each operation in the program 
is executed. This limits the number operations that can be executed by the 
EVM per program, as programs can run out of gas.

On the EVM, memory grows as needed. There can be no out-of-bounds memory access, 
you only pay the gas price for a change in memory size.

The execution model of the Ethereum blockchain specifies how the system state 
(blockchain) is altered given a series of bytecode instructions, compiled from 
smart contracts by the EVM compiler, and some environment data. The system state 
is represented by a chain of immutable transactions which have been executed, 
mined and permanently stored on the blockchain. Every time new transactions are 
executed and mined, the blockchain is transitioned into a new state. 
The role of the EVM is to implement this execution model by providing a runtime 
environment for smart contracts that have been compiled to bytecodes by the EVM 
compiler to be executed, manage execution of transaction initiated by contracts 
and then transit the blockchain to its new state. 

#### Architecture of the EVM
The EVM is a simple _**stack-based**_ architecture. Computation on the EVM is done using 
a _**stack-based bytecode**_ language which is like an intersection between 
BitcoinScript and Assembly language, adding the recursive message-sending 
functionality of Lisp. The word size of the machine is `256-bits (32-byte)`, 
this is also the size of a stack item.

> The word-size of a machine is an ordered set of bits/bytes in which information 
may be stored, transmitted or operated on within the machine.

The function of the EVM stack is to store the results of intermittent execution 
of bytecode instructions (opcodes). The size of every item on the EVM stack is 256 bits. If the size of 
the data item is not up to 256bits, it is padded with leading zeros. 
The stack has a maximum size of `1024`. 
The memory model of the EVM is a simple `word-addressed byte array`. 
This means that the memory is an array of bytes, each byte is assigned its 
own memory address. The EVM has a storage model which is a 
`word-addressable word array`. 
Unlike the memory which is volatile, storage is non-volatile and it is 
maintained as part of the system state. All locations in both storage and 
memory are well-defined initially as `zero`.


#### Securing the Ethereum Blockchain with the EVM
The EVM plays a major role in securing the Ethereum Blockchain. 
The EVM is a security-oriented virtual machine, designed to permit the execution 
of untrusted code on a global network of computers. The EVM imposes the following 
set of restrictions to secure the state of the system:

- Every computational step taken in process of executing a program must be paid for
  upfront, thereby preventing Denial-of-Service (DoS) attacks. When computational 
  steps are paid for upfront, any malicious program which intends to execute 
  infinitely on the EVM will eventually run of out gas at some point, thereby 
  ensuring that the execution of that malicious program does not deny other programs
  the use of the EVM. 
  
- Programs may only interact with each other by transmitting a single 
  arbitrary-length byte array; they do not have access to each other's state.
  
- Program execution is sandboxed; an EVM program may access and modify its own 
  internal state and may trigger the execution of other EVM programs, but nothing else.
  
- Program execution is fully deterministic and produces identical state transitions
  for any conforming implementation beginning in an identical state. 
 
These restrictions have helped to shape the design decisions of the Ethereum state transition machine.

In an attempt to dive deeper into the details of the Ethereum Virtual Machine, there are three key aspects of the EVM that  should be thoroughly understood: 

- Memory and Storage
- Execution Model
   - Gas Fees
   - Execution Environment
   - Contract Execution
   - Execution Cycle
- Relationship of the EVM with High-level contract-oriented languages like Solidity.

These topics cannot be exhausted in one article to avoid overwhelming the audience
 ( assuming you are not already 🙂 ), they shall be discussed in future articles 
 leading to the completion of this series on the EVM
 

### Summary
The Ethereum Virtual Machine is at the heart of the Ethereum protocol, performing 
various functions including; executing contracts with arbitrary complexity, managing
state and transition of the blockchain, and ultimately securing the blockchain. Having 
a deeper understanding of the EVM would make better blockchain developers in the blockchain ecosystem.
I hope you enjoyed reading this article as much as I enjoyed writing it.🙂 

### References:
- [Ethereum Yellow Paper](https://github.com/ethereum/yellowpaper)
- [Ethereum Development Guide](https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial#gas)
- [Etherdocs Contract and Transactions](http://ethdocs.org/en/latest/contracts-and-transactions/developer-tools.html#the-evm)
- [virtual-machine](https://en.wikipedia.org/wiki/Virtual_machine)

