---
title: Fuzzing Smart Contracts Using Multiple Transactions
summary: In previous posts, we introduced Harvey , a fuzzer for Ethereum smart contracts, and presented a novel input prediction technique to improve its effectiveness. Harvey is being developed by ConsenSys Diligence in collaboration with Maria Christakis from MPI-SWS. It is one of the tools that powers the MythX analysis platform . Most real-world contracts transition through many different states (e.g., one for each user bidding during an auction or betting in a game) during their lifetime and it is c
authors:
  - MythX (@mythx)
date: 2019-04-02
some_url: 
---

# Fuzzing Smart Contracts Using Multiple Transactions

![](https://ipfs.infura.io/ipfs/QmPGrTmXhqNeVGJ85nYeqAijteW7xeaW4CbXbmzF496u7y)


In previous posts, we 
[introduced Harvey](https://medium.com/consensys-diligence/finding-vulnerabilities-in-smart-contracts-175c56affe2)
 , a fuzzer for Ethereum smart contracts, and presented a 
[novel input prediction technique](https://medium.com/consensys-diligence/fuzzing-smart-contracts-using-input-prediction-29b30ba8055c)
 to improve its effectiveness.
 
_Harvey is being developed by_
  
[ConsenSys Diligence](https://consensys.net/diligence)
  
_in collaboration with_
  
[Maria Christakis](https://mariachris.github.io)
  
_from MPI-SWS. It is one of the tools that powers the_
  
[MythX analysis platform](https://mythx.io)
  
_._
 
Most real-world contracts transition through many different states (e.g., one for each user bidding during an auction or betting in a game) during their lifetime and it is crucial not to focus a security analysis exclusively on the states reachable after one or very few transactions. In other words, an analysis should not ignore 
_deep vulnerabilities_
 which only manifest themselves after executing a number of transactions first.
In this article, we will look at how to detect such deep vulnerabilities in Ethereum smart contracts. More specifically, we will look at how fuzzers can generate sequences of transactions that ultimately exploit a vulnerability.

### Motivating Example
Let’s look at the following smart contract (written in the Solidity programming language) to illustrate the challenges faced by fuzzers that want to make the assertion in function 
`Bar`
 fail.

```
contract Foo {
  int256 private x;
  int256 private y;

  constructor () public {
    x = 0;
    y = 0;
  }

  function Bar() public view returns (int256) {
    if (x == 42) {
      assert(false);
      return 1;
    }
    return 0;
  }

  function SetY(int256 ny) public {
    y = ny;
  }

  function IncX() public {
    x++;
  }

  function CopyY() public {
    x = y;
  }
}

```


The constructor initializes the (persistent) storage variable 
`x`
 to zero (on Line 6). Let’s assume that this is our initial state. In its initial state, it is not possible to trigger the assertion violation (on Line 12) by sending a single transaction to the contract. In fact, it requires at least three transactions invoking functions 
`SetY(42)`
 , 
`CopyY()`
 , and finally 
`Bar()`
 . Alternatively, the same could be achieved by invoking function 
`IncX`
 42 times and subsequently calling 
`Bar`
 . Finding the right sequence of transactions with just the right arguments can be challenging.
A simple fuzzer might instead perform additional fuzzing operations that modify the state directly; for instance, by setting variable 
`x`
 to 42 even though there is no setter function. However, this can lead to reporting spurious errors if there is no valid sequence of transactions that are able to change the state in such a way. For instance, there could be input validation for function 
`SetY`
 that makes sure that 
`y`
 is never set to 42 and function 
`IncX`
 could be changed to only increment up to 16.
In Harvey we want to avoid any such spurious errors.

### Fuzzing Sequences of Transactions Exhaustively
To avoid spurious errors, a fuzzer might instead try to explore all possible sequences of transactions. A grey-box fuzzer could easily achieve this by including all transactions when computing the path identifier (see the 
[previous post](https://medium.com/consensys-diligence/finding-vulnerabilities-in-smart-contracts-175c56affe2)
 for more details); essentially making the path span all transactions. However, the number of possible sequences grows exponentially in the number of transactions, let alone the number of paths. As a consequence, the test suite would likely grow very quickly and the fuzzer would find it challenging to decide which “promising” test inputs (i.e., sequences of transactions) to focus on for increasing coverage most effectively.
In our example, the only branch that cannot be covered with a single transaction is the one leading to the assertion. Therefore, a fuzzer might want to focus on sequences that end with an invocation of 
`Bar`
 . Similarly, there is little to be gained from exploring sequences that repeatedly call 
`SetY`
 .

### Demand-driven Sequence Fuzzing
Harvey uses a number of techniques to avoid these issues. First, Harvey only adds test inputs to the test suite if they increase path coverage for the 
_final step_
 (i.e., transaction), which in our case is 
`Bar`
 . The intuition behind this design is to consider the steps before the final step primarily as a way to incrementally change the state of the contract such that we can explore a given path in the final step.
Second, before considering additional steps, Harvey will check if there is actually something to be gained in terms of path coverage. More specifically, Harvey is designed to periodically fuzz a selected input by allowing direct mutations of the state before the last step (similar to the simple approach described above of directly fuzzing 
`x`
 ). Unless this more aggressive fuzzing uncovers new paths, we will not even consider inserting additional steps before the last step. In other words, Harvey only considers longer sequences 
_on demand_
 . Note that new inputs found during this more aggressive fuzzing are never added to the test suite to avoid spurious errors.
In our example, Harvey will only consider longer sequences of steps for finding the input that invokes 
`Bar`
 and executes the assertion. Once it finds and adds the sequence that triggers the assertion violation (after roughly 18 seconds), it will stop considering longer sequences completely (since the aggressive fuzzing can no longer increase coverage). Note that this also demonstrates how our 
[technique for input prediction](https://medium.com/consensys-diligence/fuzzing-smart-contracts-using-input-prediction-29b30ba8055c)
 is easily applied across several transactions; it is responsible for predicting the right argument for 
`SetY`
 that will trigger the assertion in 
`Bar`
 .

### Mutation Operations
To actually come up with new sequences, Harvey uses several types of mutation operations that are applied to the selected input. For each of them it first picks an existing step 
`S`
 . It then applies one of the following operations: (1) fuzzing step 
`S`
 (i.e., changing the inputs of the transaction), (2) inserting a new step before step 
`S`
 , and (3) replacing the steps before 
`S`
 with a sequence of new steps.
For the last two types of operations, Harvey uses both a pool of individual steps and a pool of sequences that are populated as new tests are added to the test suite. For our example, the step pool will, for instance, contain a step that invokes 
`SetY`
 whereas the sequence pool will eventually contain the sequence invoking 
`SetY`
 followed by 
`CopyY`
 . Picking from the pools is more efficient than building steps from scratch every time they might be needed; they can subsequently be “tweaked” by applying operations of the first type.
In this post, we have illustrated the challenges in finding deep vulnerabilities and we described a few techniques to address those challenges when fuzzing smart contracts. In practice, Harvey uses additional techniques to quickly find such vulnerabilities and we might cover some of these in later posts. Finding deep vulnerabilities is generally one of the most challenging aspects of analyzing smart contracts.
In the next post of this series, we will look at how we can use Harvey to automatically detect 
[reentrancy](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-107)
 issues — a well-known source of smart contract vulnerabilities. Stay tuned!
Thanks to 
[Maria Christakis](https://mariachris.github.io)
 , 
[Joran Honig](https://twitter.com/joranhonig)
 , and 
[Bernhard Mueller](https://twitter.com/muellerberndt)
 for feedback on drafts of this article.



---

- **Kauri original link:** https://kauri.io/fuzzing-smart-contracts-using-multiple-transactio/566c70b35d564ac8a8fcc08c37fb5859/a
- **Kauri original author:** MythX (@mythx)
- **Kauri original Publication date:** 2019-04-02
- **Kauri original tags:** fuzzing, security, smart-contracts
- **Kauri original hash:** QmP3eFb7sZg7C91YSZ54chACWkxR29wh9vHMoCicB1RD3z
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



