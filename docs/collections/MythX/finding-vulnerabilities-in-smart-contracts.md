---
title: Finding Vulnerabilities in Smart Contracts
summary: Smart contracts are increasingly complex programs that often hold and manage large amounts of assets. Getting their business logic right is challenging and developers should use tools to analyze their smart contracts before deploying them. Starting with the mother of all smart contract hacks — the infamous DAO attack — we have seen a number of high-profile hacks over the last years that resulted in tens of millions of dollars in damages. The majority of these hacks were pulled off by locating ho
authors:
  - MythX (@mythx)
date: 2019-04-02
some_url: 
---

# Finding Vulnerabilities in Smart Contracts

![](https://ipfs.infura.io/ipfs/QmcAFocEnAuZMe1bckBs3cDeesoFPybTMkamgTidPqhUZo)


Smart contracts are increasingly complex programs that often hold and manage large amounts of assets. Getting their business logic right is challenging and developers should use tools to analyze their smart contracts before deploying them.
Starting with the mother of all smart contract hacks — the infamous DAO attack — we have seen a number of high-profile hacks over the last years that resulted in tens of millions of dollars in damages. The majority of these hacks were pulled off by locating holes in smart contracts that left them vulnerable to exploitation.
This mini-series will cover various techniques for efficiently finding vulnerabilities in smart contracts. It also introduces 
_Harvey_
 : a fuzzer for Ethereum smart contracts being developed by 
[ConsenSys Diligence: Smart contract auditing](https://consensys.net/diligence/)
 , in collaboration with 
[Maria Christakis](https://mariachris.github.io)
 from MPI-SWS and that will be one of the tools powering our 
[MythX analysis platform](https://mythx.io)
.

### What’s a Fuzzer?
Conceptually, fuzzers are easy to understand: they take a set of program inputs (also known as seed inputs) and generate new ones automatically. However, not all fuzzers are created equal and, thus, have different strengths and weaknesses (just one reason why the MythX platform relies on several different security analysis techniques). Typically, we distinguish fuzzers based on how much information they collect about a program.
On one end of the spectrum, we find 
_black-box fuzzers_
 that do not collect any information about the program and typically perform random mutations to an input before running the program with it. They are easy to implement and can try millions of different inputs within minutes. However, they struggle with achieving high code coverage for complex code.
On the other end of the spectrum, we find 
_white-box fuzzers_
 that symbolically execute each instruction run by a given input and use automated solvers (e.g., SMT/SAT solvers) to find new inputs to cover a new execution path. Typically, these tools are very effective at covering new paths. However, for most non-trivial programs it is infeasible to explore them all. This is known as the path explosion problem and most fuzzers use heuristic search strategies to cover “interesting paths”.
Over the last few years, a third type of fuzzer has emerged: so-called 
_grey-box fuzzers_
 . They use a light-weight program instrumentation to record the execution path for each tested input and compute its path identifier. This short identifier allows the fuzzer to determine inputs that cover new paths and, for instance, avoid fuzzing the same path over and over. Many state-of-the-art tools use sophisticated evolutionary algorithms to select which inputs to fuzz. Unlike black-box fuzzers they are able to achieve high code coverage even for complex code without using more expensive techniques, such as automated solvers, to reason about the program.

### Introducing Harvey
Harvey is a new fuzzer for Ethereum smart contracts being developed by the ConsenSys Diligence team in collaboration with Maria Christakis from MPI-SWS.
Harvey started out as a grey-box fuzzer, but over time we added new techniques to turn it into a lighter shade of grey in order to more efficiently explore complex programs. We will cover some of these techniques in subsequent posts.
At their core, all grey-box fuzzers rely on the following basic algorithm to build up a test suite 
`TS`
 for a given program 
`P`
 starting from seed inputs 
`S`
 :

```
TS := run_seed_inputs(P, S)
while (not interrupted) {
  i := select_input(TS)
  e := assign_energy(i)
  while (0 < e) {
    f := fuzz_input(i)
    pid := run_input(P, f)
    if pid not in TS {
      TS[pid] := f
    }
    e := e - 1
  }
}
```


As mentioned earlier, the fuzzer assigns each input a path identifier (PID) based on the execution path it explored. The test suite stores the corresponding input for each PID and is initialized by running all the seed inputs 
`S`
 .
The fuzzer can be interrupted at any point (e.g., after exceeding a user-provided time limit). Until then, it will keep fuzzing existing inputs to expand the test suite. To do so, it selects an input 
`i`
 (e.g., randomly or in a round-robin fashion) from the test suite and assigns it energy 
`e`
 . The energy specifies how many times the given input should be fuzzed. The fuzzing operation itself produces a new input 
`f`
 from the existing one. After running the new input, the fuzzer will know its PID and can determine if it found a new path. If so, the input is added to the test suite.
This basic algorithm can be improved easily by developing new techniques for selecting inputs to fuzz and for assigning energy to them. Harvey implements several such improvements.

### Harvey in Practice
To illustrate how this works in practice let’s look at the following simple smart contract written in the Solidity programming language:


```
contract Foo {
  function Bar(int256 a, int256 b, int256 c) returns (int256) {
    int256 d = b + c;
    if (d &lt; 1) {
      if (b &lt; 3) {
        return 1;
      }
      if (a == 42) {
        assert(false);
        return 2;
      }
      return 3;
    } else {
      if (c &lt; 42) {
        return 4;
      }
      return 5;
    }
  }
}

```


Suppose we want to check if the assertion in function 
`Bar`
 is reachable. Instead of manually reasoning about the code, we can use Harvey to help us with this task.
Since Harvey works directly with bytecode for the Ethereum virtual machine (EVM), we need to compile the contract first. The Solidity compiler will provide us with the following snippet of bytecode that will create a contract 
`Foo`
 on the blockchain:

```
608060405234801561001057600080fd5b5060e88061001f6000396000f300608060405260043610603e5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632121699a81146043575b600080fd5b348015604e57600080fd5b50605e6004356024356044356070565b60408051918252519081900360200190f35b60008282016001811215609f576003841215608d576001915060b4565b84602a1415609757fe5b6003915060b4565b602a83121560af576004915060b4565b600591505b5093925050505600a165627a7a7230582056907da61e430dcc2b1631bc3800ce597d7eb43bac887ae350e94527c7511ee70029
```


This is all that Harvey needs to get started. In our context, an input consists of a sequence of transactions that each invoke functions of a smart contract. Let’s assume that our seed transaction invokes 
`Bar`
 with all arguments being zero.
It will explore the path that returns 
`4`
 (on Line 15) and the sequence of transactions (of length one in this case) will be added to the test suite.
For lack of other options, the fuzzer will now fuzz this transaction sequence until it finds one that explores a new path. For instance, it might eventually change input 
`c`
 to 100, which will explore the path that returns 
`5`
 (on Line 17).
After roughly 14 seconds (on a regular desktop machine) and trying around 30,000 transaction sequences, it will eventually generate a test that violates the assertion and achieves full path coverage. In contrast, for a black-box fuzzer this could take forever since the input space is huge! The probability of setting 
`a`
 to 42 is tiny ( 
_1/(2²⁵⁶)_
 to be precise).
Harvey is able to achieve high coverage quickly by implementing several techniques and optimizations that go beyond traditional greybox-fuzzing. In fact, even 
[AFL](http://lcamtuf.coredump.cx/afl)
 , a state-of-the-art grey-box fuzzer, was not able to generate such a test within 12 hours.
In subsequent posts, we will cover some more advanced techniques (e.g., 
[input prediction](https://medium.com/consensys-diligence/fuzzing-smart-contracts-using-input-prediction-29b30ba8055c)
 ) that make it possible to achieve the same 
_within less than a second_
 . Stay tuned for more!
Thanks to Rocky Bernstein, Maria Christakis, Joran Honig, Everett Muzzy, and Gerhard Wagner for feedback on drafts of this article.



---

- **Kauri original title:** Finding Vulnerabilities in Smart Contracts
- **Kauri original link:** https://kauri.io/finding-vulnerabilities-in-smart-contracts/b34134b451b04911ba7295df4b86a234/a
- **Kauri original author:** MythX (@mythx)
- **Kauri original Publication date:** 2019-04-02
- **Kauri original tags:** fuzzing, security, smart-contracts
- **Kauri original hash:** QmTBZYkFXytfbcCnbWVy3BH8Um3umKmJUn1VqhgSQCZnYC
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



