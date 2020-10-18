---
title: Introduction to Mythril Classic and Symbolic Execution
summary: Mythril Classic is a cool symbolic execution tool that comes pre-loaded with several detection modules that check for bugs like integer overflows and reentrancy vulnerabilities. I’m one of the core team members of the MythX platform team; maintaining, improving, and buidling Mythril Classic. One of the main design goals in Mythril Classic is to make the interaction with the analysis tool simple and effortless. In other words, you don’t have to get a PhD in computer science in order to start usin
authors:
  - MythX (@mythx)
date: 2019-04-02
some_url: 
---

# Introduction to Mythril Classic and Symbolic Execution


 
[Mythril Classic](https://github.com/ConsenSys/mythril-classic)
 is a cool symbolic execution tool that comes pre-loaded with several detection modules that check for bugs like integer overflows and reentrancy vulnerabilities. I’m one of the core team members of the MythX platform team; maintaining, improving, and buidling Mythril Classic.
One of the main design goals in Mythril Classic is to make the interaction with the analysis tool simple and effortless. In other words, you don’t have to get a PhD in computer science in order to start using and benefiting from formal methods like symbolic analysis. 
[Bernhard Mueller](https://medium.com/@muellerberndt)
 has written 
[several posts](https://hackernoon.com/practical-smart-contract-security-analysis-and-exploitation-part-1-6c2f2320b0c)
 showing how you can use Mythril Classic to up your security game.
This specific post aims to reveal some of the magic happening behind the scenes, later articles will go more in-depth on the detection module system of Mythril Classic, ultimately providing enough information to start rolling your own custom analysis modules.

### Symbolic execution

To explain how Mythril works we will need to start with symbolic execution, the core technique used in Mythril Classic. If you are already comfortable with the general idea of symbolic execution, then this post will recap already familiar concepts.
I think the easiest way to explain symbolic execution is by applying it and graphically showing what happens during execution. To help with that, we’ll be using the following solidity function as a target of our analysis.

```
function execute(uint256 input) public (uint256){
   uint memory result = 0;
   if (input > 10) {
      result += 10;
   }
   return result;
}
```

Our goal will be to see if we can use symbolic analysis to show that it is possible to get the result of the function to be 10.

#### Concrete Example

Before we start with actual symbolic execution let’s first look at concrete execution. We can execute the function 
`execute(uint256)`
 with multiple different inputs. Take for example the input 4, which will result in the following execution trace for the function 
`execute`
 (I've added the memory state for each step):

```
Initial state (function entry): 
- currently executing: line 1 
- input = 4 
step1: 
- currently executing: line 2 
- input = 4 
- result = uninitialized 
step2: 
- currently executing: line 3 
- input = 4 
- result = 0 
step3: 
- currently executing: line 6: 
- input = 4 
- result = 0
```


And here is a graphical representation of the same trace:

![](https://ipfs.infura.io/ipfs/QmYeLC1q25DRQd9KzandsuBRRyPW6nFav8Sz6Gc7nmSHbi)

We can keep trying different inputs until we find an input that makes the function return 10. This approach is called fuzzing, and 
[Valentin Wüstholz](https://medium.com/@wuestholz)
 has done 
[an awesome writeup](https://medium.com/consensys-diligence/finding-vulnerabilities-in-smart-contracts-175c56affe2)
 of how Harvey, a state-of-the-art fuzzer, works and is used in the MythX-platform. In this case, however, we are looking at how symbolic execution can be used to solve the problem.

#### Symbolic Example
Finally, we’re at the part where we’ll be executing the program symbolically. This means that instead of executing the program with the input 4 we’ll execute the program with a symbol, let's call that symbol 
`x`
 . The symbol 
`x`
 can take on any valid value that a 
`uint256`
 could possibly have. Now, we’ll execute the program again.
Executing the first two steps is still rather straightforward:

![](https://ipfs.infura.io/ipfs/QmanKdLDQRikZ8pjsKGTFqevnNstx1D2WBPCpEjtit1DpK)

This is where it gets interesting. At line 3 the input is compared to a number 
`10`
 , but the input is 
`x`
 , so it could take on any concrete value. Therefore, both options 
`x > 10`
 and 
`x <= 10`
 are possible. If this happens, we 
_branch_
  
_out_
 and create two new states. One where 
`x > 10`
 must hold, and one where 
`x <= 10`
 must hold. We'll also keep track of these 
_constraints_
 in our states. We do this so we can determine what inputs would follow specific paths.
Let's extend the state graph with the next steps of the execution:

![](https://ipfs.infura.io/ipfs/QmbqXxgTazypUnrnMRafPk5vC5QTJe7Gv6ctxXhKnqAsMc)

These are the states generated by symbolically executing the function. Given these symbolic states, we can write a simple program that tries to find an input for which the function will return 10.

```python
for state in states:
  # Let's filter all the states that are not return statements
  if state.currently_executing != 6:
    continue
  # We want the result to be 10, let's formulate that as a constraint
  result_constraint = (state.result == 10)
  
  # If it is possible to satisfy both the path constraints (these are the constraints collected on each branch)
  # and the result constraint then there must be an input that makes the function return 10
  if is_possible(result_constraint and state.constraints):
    # Using SMT solving we can get an input that will satisfy all the constraints and make the function return 10
    print(give_satisfying_input(result_constraints and state.constraints))
```

If we look at the execution of this piece of code then we can clearly see that it will only consider state 3 and state 5.
For the analysis of state 3, the function 
`is_possible(result_constraint and state.constraints)`
 will return false, because for this state 
`result = 0`
 .
Looking at state 5, we’ll see something more interesting. Let's look at the two constraints that are considered here: 
`result == 10`
 and 
`x > 10`
 . It's easy to see that the first constraint must be satisfied, because for this state 
`result = 10`
 . We can also easily determine that 
`x > 10`
 can be satisfied; take for example the input 
`11`
 . I just manually found a value that satisfies the constraints. In Mythril Classic itself, actually checking if it is possible to satisfy these constraints is handled by an SMT solver (Z3 in our case). It uses 
[black magic](https://en.wikipedia.org/wiki/Satisfiability_modulo_theories)
 and tells us if it is possible to satisfy the constraints.  
 But Z3's magic doesn't stop there. It can even give you an example that satisfies the constraints; this will allow us to construct a concrete input that will make the function return 10.
As a conclusion to the analysis of the function 
`execute`
 , we were able to say that



 * It is possible that the output of the program is 10

 * To get the output of the program to be 10, you could use the input 11

### What next?
In this post, we saw how we can apply symbolic execution to a small example function and saw how to write a trivial analysis module.
While this is already cool, in further posts we’ll look at more interesting properties and bugs. For example, we can search for states where we can force the value of a send call to be 10 ether. Something you might not want your contract to allow.
Thanks to 
[Valentin Wüstholz](https://medium.com/@wuestholz)
 and 
[Dominik Muhs](https://medium.com/@dmuhs)
 for feedback on a draft version of this article.



---

- **Kauri original title:** Introduction to Mythril Classic and Symbolic Execution
- **Kauri original link:** https://kauri.io/introduction-to-mythril-classic-and-symbolic-exec/36e41e821089493b9e8997c251d68ef2/a
- **Kauri original author:** MythX (@mythx)
- **Kauri original Publication date:** 2019-04-02
- **Kauri original tags:** mythril, symbolic-execution, security, smart-contracts
- **Kauri original hash:** QmPufqif5v99VYAPETym2X5bR4PqFS2ZaMKGy7ASK1ovf8
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



