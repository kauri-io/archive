---
title: A Deep Dive into the Ethereum Virtual Machine (EVM) - Part 3  Execution Model of the EVM 
summary: This is a high-level overview of the execution model of the Ethereum Virtual Machine (EVM). It outlines the state(s) of the machine that changes between the exe
authors:
  - Adrian Hacker (@adrian-h)
date: 2020-02-17
some_url: 
---

# A Deep Dive into the Ethereum Virtual Machine (EVM) - Part 3  Execution Model of the EVM 



This is a high-level overview of the execution model of the Ethereum Virtual Machine (EVM).  It outlines the state(s) of the machine that changes between the execution steps of an executing smart contract in the EVM.  This consists of the configurations that are held and rewritten before and after each execution step which collectively could be referred to the "state" of the EVM.

Machine state can be thought of as a snapshot of all data held in the EVM at a given moment in time.  Think "state of being."  This includes the aggregate data within the EVM such as account balances and smart contract instances running.  The illustration below depicts the execution state as it changes after a transaction is completed.

### EVM Execution State (Overview)

The execution model of the EVM includes the machine state and the network state. This overview omits the external account (wallet) and associated state as it exists outside of the EVM.  With that, two transaction types exist in the EVM that cause a state change in the execution model:

* Deploy a contract on the Ethereum network

* Execute a function within a deployed contract on the Ethereum Network

### Execution Event: Smart Contract Deployment

When a smart contract has been written and compiled, it is then ready for deployment on the Ethereum blockchain.  This is done by the holder of an externally owned account (i.e. wallet or API) submitting a transaction containing specific information.  The result creates a contract account which will be ready to accept function inputs as well as generate computed and meaningful outputs.

![EOA user deploys new smart contract instance on the Ethereum blockchain](https://i.imgur.com/UmdULIQ.png)

This transaction is constructed as follows:

![Smart contract deployment transaction configuration](https://i.imgur.com/QYepkt5.png)

A developer uses a language such as Solidity or Vyper to program the smart contract.  Once the high-level program code is compiled successfully a bytecode is generated which is a machine code representation of the program.  

![Smart contract code to bytecode](https://i.imgur.com/hPzkXHL.png)

A sent transaction looks like this:

![Send transaction for deploy new smart contract](https://i.imgur.com/Xa7r3h0.png)

We see that a transaction hash is generated (green hash at the bottom.)  Using this information the transaction can be fully examined using `eth.getTransaction()` and `eth.getTransactionReceipt()`.

![Deployed smart contract transaction receipt](https://i.imgur.com/ZF9raB7.png)

Here we see:

* In the transaction, the `to` is left empty (‘0x0’ is shown).

* In the input, we only place the bytecode. It is because our SimpleStorage contract does not have a constructor that requires arguments. If arguments are needed in the constructor, they are encoded according to the type and appended after the bytecode. We will see how the encoding is done when we call `set()` function in the next part.

* The Contract Address is found in the Transaction Receipt. We will use it in the next part.

* The default Gas Limit (gas) is 90,000 gas. If you do not specify the gas, you will encounter “out of gas” as it takes more than 90,000 gas for processing this transaction. Therefore we specify 200,000 gas for this transaction.

* It turns out the transaction processing only takes 112,213 gas. The remainder is returned to the transaction sender.

### Execution Event:  Execute Smart Contract Function on a Deployed Contract

The second execution event in the EVM is the call to a smart contract already deployed to do some analysis or "work" to some data that is passed into the smart contract by the EOA.

The EVM has access to many different functions to be able to process data.  These are called OPCODES.  Similar to the way a new contract is deployed, the developer uses a high-level language such as Solidity to define the program arguments which initiate a smart contract instance and turn that into bytecode.  The bytecode is the machine level language calling functions required by the program as well as any encoded arguments required.

![EOA executes smart contract](https://i.imgur.com/SX4kNB9.png)

The transaction composition is nearly identical to the deployment transaction:

![Execute Smart Contract transaction model](https://i.imgur.com/11IipKe.png)

The difference is the data/input is the function and necessary arguments to initiate an instance of the smart contract that will generate a meaningful response.

The response is contained by examining the block transaction, again, using the transaction ID hash.  A bytecode response in the `logsBloom` portion of the block data is the machine code response to be constructed and interpreted.  

### Network State Execution of the EVM

The EVM is based on blockchain technology.  With each new set of transactions processed, a new block is added to the top of the existing data structure detailing the new state of the EVM and other protocol-oriented state data existing outside the EVM.

The newly generated block, a unique identifier, and the encapsulated and encrypted data represent the state execution of the network aspect of the EVM.

### Resources

* [KEVM:  A Complete Semantics of the Ethereum Virtual Machine](https://www.ideals.illinois.edu/bitstream/handle/2142/97207/hildenbrandt-saxena-zhu-rodrigues-guth-daian-rosu-2017-tr_0818.pdf?sequence=3&isAllowed=y)

* [Transaction in Ethereum](https://medium.com/@kctheservant/transactions-in-ethereum-e85a73068f74)