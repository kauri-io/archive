---
title: A Deep Dive into the Ethereum Virtual Machine - Part 4  The EVM and High-Level Programming Languages
summary: The EVM and High-Level Smart Contract Programming Languages Introduction The Ethereum platform offers the power of a peer to peer, secured, decentralized virtua
authors:
  - Adrian Hacker (@adrian-h)
date: 2020-02-17
some_url: 
---

# A Deep Dive into the Ethereum Virtual Machine - Part 4  The EVM and High-Level Programming Languages


## The EVM and High-Level Smart Contract Programming Languages

### Introduction

The Ethereum platform offers the power of a peer to peer, secured, decentralized virtual computer that can execute smart contracts to perform a vast array of tasks.  A smart contract is the same as a program that runs on any standard PC instance.  The use cases for which smart contracts have been created range from very simple to extremely complex.  Underneath those cute crypto-kitties or that defi lending platform is a symphony of digital logic, instructions, data manipulation, and interaction between other smart contracts or users.  This article explores the different programming languages that are used to create smart contracts on the Ethereum Virtual Machine.  An analysis of the machine code mechanism in the EVM as it relates to higher-level languages is explored.  The current limitations of these languages in terms of usability, functionality, and security are assessed.  Finally, the potential road map of expanding the functionality and user-friendliness of EVM programming languages will wrap up the four article series: A Deep Dive into the EVM.

### Ethereum Virtual Machine Logical Features

The Ethereum Virtual Machine is a powerful and isolated computing environment that keeps records eternally for all to see. Smart contracts are the "app", ".exe", "executable", ".dmg" equivalent in the Ethereum Virtual Machine (EVM).  Before introducing the languages themselves, it is important to look at the logical features that can be built or accessed in the EVM.  These complex digital characteristics elevate the computing power of the EVM to a "high-level":

* Predefined function libraries 
* Function constructors and destructors
* Function overrides 
* High-level logic
* Looping and recursion 
* Full range of expressions for logical and mathematical arguments
* Control structures
* More than one variable can pass in and out of a function 
* User ability to define custom functions 
* Inheritance
* Polymorphism 
* Sandboxing 
* Two-way interaction with other smart contracts 

There are, however, fundamental flaws in the implementation of these features.  The EVM execution model leaves some things out of the built-in software architecture, leaving it up to the language implementer to create and include:

* True library support, instead of just blessed CALL targets at well-known addresses
* Richer data types
* Direct support and enforcement of interfaces/APIs

The demand put on smart contract developers to build these crucial high-level components into a contract versus a library creates a security risk.  Re-duplicated effort and additional modules expose the smart contract to the possibility of security vulnerabilities and bugs.

### Solidity

Created in 2014, this language features human-readable nomenclature for easier code writing.  An example smart contract in Solidity looks like this:

```

pragma solidity >=0.5.0 <0.7.0;

contract Coin {
    // The keyword "public" makes variables
    // accessible from other contracts
    address public minter;
    mapping (address => uint) public balances;

    // Events allow clients to react to specific
    // contract changes you declare
    event Sent(address from, address to, uint amount);

    // Constructor code is only run when the contract
    // is created
    constructor() public {
        minter = msg.sender;
    }

    // Sends an amount of newly created coins to an address
    // Can only be called by the contract creator
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        require(amount < 1e60);
        balances[receiver] += amount;
    }

    // Sends an amount of existing coins
    // from any caller to an address
    function send(address receiver, uint amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
```

Solidity is an object-oriented programming language.  There have been some serious flaws in Solidity that have lead to a severe loss of assets and time.  The language allows recursion and looping such that a GAS payment to send a transaction can be depleted.  Solidity is blamed for the 2016 DAO hack costing millions of US Dollars.  Investigators stated that the EVM was running as intended when these exploits were utilized, but Solidity lacked the functionality to fully utilize the EVM security schema.

Solidity, when compiled, is turned into bytecode.  This long chain of hexadecimal digits becomes the machine code of the EVM.  The way it compiles from high-level language directly to machine code without any kind of application wrapper presents security risks and exposes the smart contract at the deepest possible level.  This removes the abstraction layer that exists between the language and the hardware.  In so doing, it exposes an attack vector for manipulating a smart contract in a nefarious way.

### Vyper

Vyper is essentially the "only other" choice in high-level programming language library of smart contracts.  Vyper is a language that is based on Python, therefore, easier for experienced developers to use.  Another advantage of being derived from Python is the lower amount of development time and the inclusion of better features and more security.  The additional security does come at a cost.  There are logic functionalities that are prohibited in Vyper, due to the exploitation experienced in Solidity.  This is an example of a smart contract written with Vyper:

```

// Open Auction

// Auction params
//Beneficiary receives money from the highest bidder
beneficiary: public(address)
auctionStart: public(timestamp)
auctionEnd: public(timestamp)

// urrent state of auction
highestBidder: public(address)
highestBid: public(wei_value)

// Set to true at the end, disallows any change
ended: public(bool)

// Keep track of refunded bids so we can follow the withdraw pattern
pendingReturns: public(map(address, wei_value))

// Create a simple auction with `_bidding_time`
// seconds bidding time on behalf of the
// beneficiary address `_beneficiary`.
@public
def __init__(_beneficiary: address, _bidding_time: timedelta):
    self.beneficiary = _beneficiary
    self.auctionStart = block.timestamp
    self.auctionEnd = self.auctionStart + _bidding_time

/* Bid on the auction with the value sent
together with this transaction.
The value will only be refunded if the
auction is not won. */
@public
@payable
def bid():
    // Check if bidding period is over.
    assert block.timestamp < self.auctionEnd
    // Check if bid is high enough
    assert msg.value > self.highestBid
    // Track the refund for the previous high bidder
    self.pendingReturns[self.highestBidder] += self.highestBid
    // Track new high bid
    self.highestBidder = msg.sender
    self.highestBid = msg.value

/* Withdraw a previously refunded bid. The withdraw pattern is
used here to avoid a security issue. If refunds were directly
sent as part of bid(), a malicious bidding contract could block
those refunds and thus block new higher bids from coming in. */
@public
def withdraw():
    pending_amount: wei_value = self.pendingReturns[msg.sender]
    self.pendingReturns[msg.sender] = 0
    send(msg.sender, pending_amount)

// End the auction and send the highest bid
// to the beneficiary.
@public
def endAuction():
    /* It is a good guideline to structure functions that interact
    with other contracts (i.e. they call functions or send Ether)
    into three phases:
    1. checking conditions
    2. performing actions (potentially changing conditions)
    3. interacting with other contracts
    If these phases are mixed up, the other contract could call
    back into the current contract and modify the state or cause
    effects (Ether payout) to be performed multiple times.
    If functions called internally include interaction with external
    contracts, they also have to be considered interaction with
    external contracts. */

    // 1. Conditions
    // Check if auction endtime has been reached
    assert block.timestamp >= self.auctionEnd
    // Check if this function has already been called
    assert not self.ended

    // 2. Effects
    self.ended = True

    // 3. Interaction
    send(self.beneficiary, self.highestBid)
    
```

A control loop cannot iterate infinitely, as this was the method for exhausting GAS in transactions.  Infinite looping will throw a compiler exception.  Messages cannot be accessed inside of private functions, and so on.  This link leads to the full Vyper documentation stack, including [Compiler Exceptions](https://vyper.readthedocs.io/en/latest/compiler-exceptions.html).

### K Framework, KEVM, and Semantics

Smart contract implementation creates a unique combination of security concerns.  Consider these factors about the decentralized nature of smart contracts:

* They are designed to store cryptocurrency, which when stolen can be transferred irreversibly, can be
difficult to trace, and can be laundered effectively.

* The quantity of the money stored in these contracts tends to be high, with contracts often storing in
excess of 100M US, a strong attack incentive.

* All contract code is stored publicly on the blockchain, allowing attackers to probe the
system with full knowledge and test a range of attacks.

* The Ethereum environment is adversarial, with all actors, from the miners involved in processing transactions, to nodes involved in relaying, are assumed to be potentially malicious. 

These features that entice hackers, in combination with a lack of software quality tools, create an extreme security risk that must be at the forefront of all consideration when writing smart contracts.  KEVM is a smart contract analysis tool built out of the K framework designed to analyze the security and performance of smart contracts.  K Framework takes components of the machine code programming language and lays out a logical semantic structure.  The foundation of K is Reach-ability Logic, a logic for reasoning symbolically about potentially infinite transition systems.  Three tiers of logical evaluation exist for smart contracts:  

* data.k - Data representations and their associated data structures used in the low-level EVM client code,
and their definition in terms of K-native data structures.

* evm.k - Formalization of the EVM semantics in K, including execution semantics of the various opcodes,
world and network state, gas semantics, and various errors that can occur during execution.

* ethereum.k - Extra execution environment/drivers that run EVM code, with a mode to parse the JSON
test-files used to test reference EVM implementations.

For further technical details, the academic research article on KEVM and EVM Semantics can be accessed in the resources section below: KEVM: A Complete Semantics of the Ethereum Virtual Machine.

The challenge that KEVM tries to overcome is turning bytecode into usable language for developers in the structure of a programming language.  Bytecode is not intuitive in any way of making a vocabulary for building functions, data structures, and control mechanisms.  KEVM via the K Framework lays out a vernacular that is consistent, human-readable, and intuitive for writing smart contracts.  Furthermore, this particular vernacular is how smart contract performance is analyzed.  This includes security and efficient use of resources.

### IELE

IELE is a smart contract programming language, developed in the wake of KEVM creation.  Building KEVM exposed many limitations of the current smart contract language schema.  IELE has various high-level features, such as
function calls/returns, static jumps, arbitrary-precision integer arithmetic among others, that both
make automatic formal verification more straight-forward and the language itself more secure.

Five high-level properties are the core that created IELE: 

* Security
* Formal Verification
* Human Readable
* Determinism
* GAS Model

Moreover, IELE is cross-blockchain compatible.  It can be used in conjunction with a wide array of token, coin, and data.  For further information read IELE: An Intermediate-Level Blockchain Language Designed
and Implemented Using Formal Semantics; listed in the reference section.

IELE was officially introduced in scholarly journal articles mid-2018, it is relatively new.  Efforts in creating and implementing IELE as a mainstream blockchain smart contract language are not known at this time.

### Conclusion

The Ethereum Virtual Machine is an extraordinary and practical creation that brings about solutions to a wide variety of use cases.  In so doing, a unique set of characteristics has laid out a rigorous set of obstacles for ensuring security, efficiency, and usability.  While a good portion of the learning curve in the language development of the EVM happened after a serious loss or incident occurred, progress is getting ahead of the cybercriminals.  Tools are being developed for smart contract QA and analysis.  Languages are being evaluated and scrutinize like never before.  New ways of closing security gaps and including data abstraction are being tested and implemented.

The nature of the EVM and how it is built on a blockchain present a host of benefits and an equal amount of new security considerations that have not been native to software development until now.  It will be exciting to see where technology takes a creation like the EVM and builds upon the design flaws to create efficient, powerful, secure virtual computing environments.  


### Resources

* [What is the Ethereum Virtual Machine?](https://techcoins.net/ethereum-virtual-machine/)

* [Solidity](https://solidity.readthedocs.io/en/develop/index.html)

* [Vyper](https://github.com/vyperlang/vyper)

* [How to Learn Solidity:  The Ultimate Ethereum Coding Tutorial](https://blockgeeks.com/guides/solidity/)

* [Solidity](https://en.wikipedia.org/wiki/Solidity)

* [The EVM is Fundamentally Unsafe](https://hackernoon.com/the-evm-is-fundamentally-unsafe-d69f2e3b908b)

* [Vyper Smart Contract Programming Language Documentation](https://vyper.readthedocs.io/en/latest/compiling-a-contract.html)

* [KEVM: A Complete Semantics of the Ethereum Virtual Machine](https://www.ideals.illinois.edu/bitstream/handle/2142/97207/hildenbrandt-saxena-zhu-rodrigues-guth-daian-rosu-2017-tr_0818.pdf?sequence=3&isAllowed=y)

* [IELE: An Intermediate-Level Blockchain Language Designed
and Implemented Using Formal Semantics](https://www.ideals.illinois.edu/bitstream/handle/2142/100319/paper.pdf?sequence=2&isAllowed=y)
