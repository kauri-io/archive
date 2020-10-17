---
title: A Deep Dive into the Ethereum Virtual Machine (EVM) - part 2- Memory and Storage
summary: This is the second article of a 4-part series on the EVM; 1. Part 1- Introduction to the EVM 2. Part 2- Memory and Storage on the EVM 3. Part 3- Execution Model of the EVM 4. Part 4- Relationship of the EVM with High-level contract-oriented languages evm-storage The Ethereum Virtual Machine has three locations where it can store data; stack, memory, storage. Each of these storage locations play a major role in the execution model of the EVM and also helps to maintain the state of the blockchain.
authors:
  - Mayowa Tudonu (@mr-mayowa)
date: 2019-06-26
some_url: 
---

This is the second article of a 4-part series on the EVM;
1. Part 1: [Introduction to the EVM](https://kauri.io/article/b4a6d12332bd4ad58535ac2d59d95dff/v1/a-deep-dive-into-the-ethereum-virtual-machine-(evm)-part-1:-introduction)
2. Part 2: [Memory and Storage on the EVM](https://kauri.io/article/766e5d1e1ba240a7976943b659a871fc/v1/a-deep-dive-into-the-ethereum-virtual-machine-(evm)-part-2:-memory-and-storage)
3. Part 3: Execution Model of the EVM
4. Part 4: Relationship of the EVM with High-level contract-oriented languages

![evm-storage](https://preview.ibb.co/kOuBGp/EVM_storage.png)

The Ethereum Virtual Machine has three locations where it can store data; stack, memory, storage. 
Each of these storage locations play a major role in the execution model of the EVM and also 
helps to maintain the state of the blockchain.
Before we talk about each of them, let's take a detour and talk about Ethereum Accounts.

Ethereum Accounts are objects with components such as storage state, intrinsic balance, 
number of transaction (nonce), 20-byte address, EVM code/smart contracts, maintained as part of the Ethereum state. 
Every account has a 20-byte address associated with it. 
An address is a 160-bit (20-byte or 40 characters) code used for identifying an account (e.g. `0x7053437291d7ef549f066f6802542106b59c0aee`). 
An address is generated whenever a new Ethereum account is created. 

There are two types of Ethereum accounts, and they share the same address space on the machine.
- **External Accounts**: Accounts that are controlled by external entities, by an individual for example, using public-private key pairs. 
  These accounts have no EVM code (smart contracts) associated with them, hence they have empty storage state 
  and do not make use of memory. These accounts can be created using Ethereum Clients 
  like [Geth](https://geth.ethereum.org/install/) or [Ganache](https://truffleframework.com/ganache).
  
- **Contract Accounts**: Accounts that are associated with EVM code and are controlled by EVM code. 
  These accounts have non-empty Storage state and also make use of memory and stack during the 
  execution of the EVM code stored as part of the account.
  A contract account is created when a smart contract is deployed on the Ethereum blockchain.
  It is derived from the creator's address and the number of transactions sent from that address, also called “nonce”.
  
![evm-accounts](https://preview.ibb.co/cnk1XU/Ethereum_Accounts.png)

##### _**Externally owned account vs Contract account (source: [medium](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369))**_
                             
The foregoing explanation highlights the fact that storage and memory on the EVM is always connected to an account. Let's
go ahead and discuss each of the storage locations.

### Stack
>Whether I'm at the office, at home, or on the road, I always have a stack of books I'm looking forward to reading.
 ~ [Bill Gates](https://www.brainyquote.com/quotes/bill_gates_626066?src=t_stack)

As discussed in the [first article](https://kauri.io/article/b4a6d12332bd4ad58535ac2d59d95dff/v1/a-deep-dive-into-the-ethereum-virtual-machine-(evm)-part-1:-introduction) of this series,
the EVM is a simple stack-based architecture. All the computations on the EVM are performed on the stack. The operands
for instructions are taken from the stack, and the result of intermediate operations are also stored on the stack.
>A stack is a data type which serves as a collection of elements, with two principal operations: _**push**_ which adds 
an element to the top of the stack, and _**pop**_ which removes the topmost element from the stack. 

![stack](https://image.ibb.co/ca0Ee9/stack.jpg)

##### _**A stack with push and pop operations (source: [site-bay](https://www.sitesbay.com/data-structure/c-stack))**_

The size of every item on the EVM stack is 256 bits and the stack has a maximum size of 1024 elements. Some of the
operations that can be performed on the EVM stack include:

| **Stack operation** |  **Description** |
|--|--|
| POP | Remove an item from the top of stack|
| PUSH | Add item to top of stack|
| DUP | Duplicate an item on the stack|
| SWAP | Exchange items on the stack |

The PUSH, DUP and SWAP operations have several versions which are used where applicable during the execution of
instructions. The PUSH operation places an item on the stack. It has 32 versions (PUSH1 to PUSH32), where PUSH1 
instructs 1 byte to be placed on the stack and PUSH32 instructs 32bytes (full word) to be placed on the stack. 

The DUP operation duplicates an item on the stack and pushes the duplicate to the top of the stack. 
It has 16 versions (DUP1 to DUP16), where DUP1 duplicates the first item, DUP2 duplicates the second and so on until
DUP16 which duplicates the sixteenth item on the stack.

The SWAP operation swaps items on the stack. Like the DUP operation, it also has 16 versions (SWAP1 to SWAP 16), where
SWAP1 swaps the first and second item on the stack, SWAP2 swaps the second and third item on the stack, and so on until
SWAP16.

Let's take simple example by adding 1 and 3 using the EVM stack. The instructions would look like this:

`PUSH1 0x01 PUSH1 0x03 ADD POP STOP`

PUSH1 was used to push the digits 1 and 3 to the stack because the digits 1 and can conveniently fit into a 
byte (8 bits) when converted from decimal to binary. The output of this simple operation would be: 

```
0: PUSH1  1      Stack: [1]
1: PUSH1  3      Stack: [1, 3]
2: ADD           Stack: [4]
3: POP           Stack: []
4: STOP


result: 4
```
The EVM stack operates in a much complex way, but this gives us a fair idea of what the EVM could be doing.


### Memory

>To improve short-term memory significantly, reduce the stress in your life. And choose your parents wisely.
 ~ [John Medina](https://www.azquotes.com/quote/1566067?ref=short-term-memory)

![memory](https://preview.ibb.co/gpZ55f/evm-memory.png)
##### _**Evm memory accessed in 8-bits or 256-bits**_
 
The second storage location is the Memory. The **memory** is a storage area that is created when functions calls are
made to smart contracts. It is used to store temporary data such as function arguments, local variables and return values.
Like the RAM (Random Access Memory) on x86-64 machines, the memory is volatile --- its data is lost when power is 
switched off.

The sample contract below shows how memory may be used on the evm when function calls are made.
```solidity
contract AddTwoNumbers {
    
    function addNumbers(uint a, uint b){
        //arguments a and b are stored in memory
        uint c = a + b;
        //return value c is written to memory
        return c;
    }
   
}
```

Structurally, the **memory** is a byte-array and can be accessed linearly via reads or writes of 8bits or 256bits.
When a memory is freshly instantiated on the EVM, its initial size is zero, but it can be expanded by 256bits when 
accessing (reading or writing) a previously untouched memory word. At the time of this expansion, the cost in gas 
must be paid and this cost grows quadratically. The gas cost for memory operations are shown in the image below:

![memory](https://preview.ibb.co/m2yzy0/memory.png)

#####  _**Gas cost for evm memory operations (Source: Yellow Paper)**_ 

The EVM provides three opcodes to interact with the memory:

| **Memory operation** |  **Description** |
|--|--|
| MLOAD | Loads a word from memory into the stack|
| MSTORE | Saves a word to memory|
| MSTORE8 | Saves a byte to memory|


### Storage
>The more storage you have, the more stuff you accumulate
 ~ [Alex Stewart](https://www.brainyquote.com/quotes/alexis_stewart_651091?src=t_storage)
 
The third data location is the Storage. Storage on the EVM is a persistent key-value store that maps 
keys to values, the keys an values are 256-bits word. A smart contract can only read or write to its own storage, it has
no access to the storage of external contracts. 
All storage locations are initially defined as zero. 
 
![evm-storage](https://preview.ibb.co/kOuBGp/EVM_storage.png)

##### _**Evm key-value store**_

Reading and writing to memory is very expensive. 
The cost of writing to storage is one of the highest amongst several EVM operations. Due to this high cost, it is 
not possible to enumerate storage from within a contract. The EVM provides two opcodes to interact with storage:

| **Storage operation** |  **Description** |
|--|--|
| SLOAD | Loads a word from storage into the stack|
| SSTORE | Saves a word to storage|

The cost of each of these operations is highlighted in the diagram below.
 
![storage](https://preview.ibb.co/fENtaf/storage.png)
##### _**Gas cost for evm storage operations (Source: Yellow Paper)**_

In Solidity, storage memory is represented as state variables declared outside of user-defined functions, within the 
context of the contract. Let's have an example code to understand how this works. The sample contract below stores
the ages of certain persons in the contract storage when the contract is instantiated. 

```solidity
pragma solidity ^0.4.24;

contract StoreAge{

    /*
     * state variable `ages` storing a dynamic array of ages in 8 bits
     * state variable `oldest` storing the oldest age in 8 bits
     * state variable `persons` storing a mapping of number of persons to ages 
     */
    uint8 public oldest;
    
    uint8[] ages;
    
    mapping (uint8 => uint8) persons;
    
    constructor () public {
         oldest = 75;
         ages.push(20);
         ages.push(30);
         ages.push(56);
         persons[1] = 55; //1 person is 55
         persons[2] = 67; //2 persons are 67 
    }
}

```

Solidity maps every state variable to a slot in storage starting from position 0. Fixed sized state variables such as 
`oldest` are stored in a slot in storage contiguously. For dynamic arrays like `ages`, the length of the array
is stored in the next available slot `(n, for example)`, while the data will be located at a slot number derived from 
the hash of `n(keccak256(n))`. For Mappings, their slots are unused, but the value for each key in the mapping will be 
located at a slot derived from `keccak256(n, p)`, where `n` is the slot number the mapping is meant to fill originally, 
and `p` is the index of the item on the mapping which we would like to locate. The contract above will be deployed and 
its storage structure will be tested as shown below:

![evm-storage](https://albumizr.com/ia/57fc596e67601bdc3bb48695fd233b76.jpg)
##### _**Storage structure of the StoreAge contract**_

First, let's compile the contract and create a new contract instance using Truffle. [Truffle](https://truffleframework.com/) is a framework for building
dApps (Distributed Applications). It provides functionalities such as compiling, debugging, and testing smart contracts out of the box. 

The contract instance is stored as an object in the `storeAge` variable.
```
$ truffle(develop)> compile
$ truffle(develop)> StoreAge.new().then(item => storeAge = item;)
```
Next, we check the content of the storage at index 0 using web3
```
$ truffle(develop)> web3.eth.getStorageAt(storeAge.address, 0)
$ '0x4b'
```
`4b` is the hexadecimal representation of 75. This confirms how fixed sized state variables are represented in storage.
Let's confirm how mappings are mapped in storage.

The mapping state variable is meant to be stored in index 2 on storage. Let's set n as index 2, padded to 32 bytes i.e 
64 characters, each character being 4 bits.
```
$ truffle(develop)> n = ‘0000000000000000000000000000000000000000000000000000000000000002’
```
Let's set p as the key of the first item in the mapping with key 1, padded to 32 bytes.
```
$ truffle(develop)> p = '0000000000000000000000000000000000000000000000000000000000000001'
```
Next, we find the hash of the slot of the first item in the mapping.
```
$ truffle(develop)> first_item_addr = web3.sha3(n + p, {encoding: 'hex'})
$ '0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0'
```
With this address, we can obtain the value of the first item in the mapping from storage.
```
$ truffle(develop)> web3.eth.getStorageAt(storeAge.address, first_item_addr)
$ '0x37'
```
`37` is the hexadecimal representation 55. This also confirms how mapping are mapped in storage.

### Summary
In this article, we expounded the details data management on the EVM. The EVM uses the stack to perform computations,
memory is used to store data from function calls and the storage persists data on the Blockchain.

### References:
- [Ethereum Yellow Paper](https://github.com/ethereum/yellowpaper)
- [Ethereum Development Guide](https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial#gas)
- [Etherdocs Contract and Transactions](http://ethdocs.org/en/latest/contracts-and-transactions/developer-tools.html#the-evm)
