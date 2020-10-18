---
title: Building Blocks  What makes a good EVM package?
summary: A mental shortcut for thinking about EVM packages is to compare them to a package manager such as NPM. Package managers serve as convenient repositories for code that you can reuse and share with others. Indeed, when you use zos link {packageName}, ZeppelinOS will actually download code from NPM and save it directly into your node_modules folder. This is similar behavior to npm install, which is how you would install the openzeppelin-solidity smart contracts. The difference when using zos link {
authors:
  - Dennison Bertram (@dennisonbertram1)
date: 2019-03-07
some_url: 
---

# Building Blocks  What makes a good EVM package?

![](https://ipfs.infura.io/ipfs/QmTWpnTFavG5AnBgSnimrCLDwo6iQdLX9AuipPPBxfWnLe)


A mental shortcut for thinking about [EVM packages](https://blog.zeppelinos.org/open-source-collaboration-in-the-blockchain-era-evm-packages/?utm_campaign=zos-technical-evmpackages&utm_medium=blog&utm_source=wordpress)
is to compare them to a package manager such as NPM. Package managers
serve as convenient repositories for code that you can reuse and
share with others. Indeed, when you use `zos link {packageName}`,
ZeppelinOS will actually download code from NPM and save it directly
into your _node_modules_ folder. This is similar behavior to
`npm install`, which is how you would install the
[openzeppelin-solidity](https://github.com/OpenZeppelin/openzeppelin-solidity)
smart contracts.

The difference when using `zos link {packageName}` to install EVM
packages rather than `npm install` is that after downloading the
package, ZeppelinOS checks the _zos.{network-name}.json_ files
to see if and where the code is already deployed on-chain. If the
**bytecode** is already deployed, the `zos create` command will link it to
your project by creating a [_transparent proxy_](https://blog.zeppelinos.org/the-transparent-proxy-pattern/). In
other words: instead of having to upload the logic contract's code to
the blockchain, ZeppelinOS will reuse the existing instance, and just
spin up a proxy that delegates all logic to it. Linking to on-chain
code, rather than deploying entirely new contracts, can be a vastly less
expensive operation, especially for cases that might end up deploying
hundreds of instances of the same contract.

Note that if you decide to write your own contracts **extending** from a
base contract in an EVM package, ZeppelinOS will need to compile a
completely new contract, extended from the downloaded Solidity source
code. Publishing this code will essentially create a completely new
logic contract that is now linkable itself. However, the gas savings
from linking to an on-chain implementation during deployment will be
lost.

When considering what makes a good EVM package, it helps to first
clarify what your goals are. In keeping with [DRY programming principles](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), we
want to avoid rewriting code as much as possible to avoid the
introduction of errors and improve code maintainability. Considering the
level of danger that an error in smart contracts can expose users to,
breaking a program down into smaller, isolated pieces of code can reduce
a program's attack surface area, improve readability/maintainability,
and, if individual pieces are themselves upgradable, create more robust
and less brittle software.

With DRY programming, we generally turn each particular task into its
own function, and then rather than rewriting tasks, we reuse code via
functions. When these functions are audited and well-tested, reusing
them, rather than writing new implementations each time, allows
developers to craft their contracts in a secure way. While
theoretically, you could create an EVM package from a single function,
in most cases this won't end up being very efficient in terms of gas
deployment savings or for the organization of code. Instead, EVM
packages are best built out of collections of functions that form a
standalone contract.

As you can rarely complete complicated tasks with a single function (we
coding mortals anyway!), by grouping these functions together based on
cohesive areas of functionality, you can build **modular building blocks**
that can be used standalone or linked to as a part of something yet
larger.

As an example, [Zeppelin's OpenZeppelin-eth](https://github.com/OpenZeppelin/openzeppelin-eth)
implementation of the ERC20 standard is a concise collection of the
functions and data definitions required to implement the functionality
described by the [EIP-20](https://eips.ethereum.org/EIPS/eip-20).
Standards such as this make good candidates for EVM packages, and they
gather all of the functionality required for a particular goal into a
concise collection. Functions related to the implementation requirements
of ERC20 tokens can be found inside the ERC20 EVM package, and any
project wishing to incorporate ERC20 tokens need only link to the
deployed on-chain contract to implement a standards-compliant and secure
ERC20 token.

When building your own EVM packages, keep in mind how you might bundle
together all the related functionality for a task, or implement a
standalone standard by itself. The goal is to create a package that you
might reuse any number of times for your own project and, optionally,
share with a wider community of users. EVM packages should be
self-contained, ready-to-go packs that don't need external supporting
code to make them work.

In building EVM packages, you may also find yourself wondering, **Is this a Solidity library?** Generally, we use libraries to help keep our
code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), and
the [OpenZeppelin-Solidity SafeMath](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)
library is a good example of this. SafeMath allows us to safely perform
arithmetic operations repeatedly but using a **safe** implementation that
protects us from things like
[overflow](https://ethereumdev.io/safemath-protect-overflows/), which
can be exploited to do some [nasty things](https://medium.com/@blockchain101/beautychain-erc20-integer-overflow-bug-explained-c583adcd847e).
As SafeMath is currently written, it is a library that has only internal
functions, and as such will be embedded within the contract. At compile
time, the SafeMath code is directly inserted into the user's Solidity
code and compiled together as if it were one large contract, while **EVM packages are designed to be used as external bytecode**.

While it is certainly possible to craft an EVM package that offers the
functionality of a standard Solidity library, generally **an EVM package will have its own storage and keep its own state**. Contracts that make
use of embedded libraries rather than link to them as an EVM package
will also have an advantage in terms of gas cost. It is cheaper to call
functions directly inside a contract than to call them externally. Thus,
modifying SafeMath to work as an EVM package might save deployment gas
costs (if you need to deploy many contracts), but the resulting smart
contract could be significantly more expensive to interact with.

For developers working on private networks or sidechains with different
gas-cost dynamics, this may or may not be a relevant concern. Certainly,
a theoretical use case for _libraries as EVM packages_ could be a
private network where gas costs are not a concern and smart contract
libraries are required to use singular approved implementations.

On a higher level, EVM packages are great for solving commonly occurring
problems and simplifying the software development process. If you find
yourself creating or using the same code over and over, or thinking,
**Hasn't someone already built this?**, then your code might be a good
candidate for creating an EVM package. Thoughtful developers may also
want to [include documentation](https://guides.github.com/features/wikis/) in their EVM
packages or tests, to clarify what behavior is expected from the code
and to make it easier and safer for the community to build on it. If you
are developing your EVM package primarily for the community, nice
documentation, sample usages, and a clear readme with a quick-start
guide are always highly appreciated.

Have a look at what some [noteworthy projects are building](https://forum.zeppelin.solutions/t/list-of-evm-packages/90?utm_campaign=zos-technical-evmpackages&utm_medium=blog&utm_source=wordpress)
with EVM packages to get inspiration.

Solidity libraries that are deployed separately and then linked at
compile time (rather than having their code inlined by the compiler) or
are linked manually after the compile process, are also not ideal EVM
packages, as the ZeppelinOS system does not currently support linking to
a Solidity library in an EVM package, although this will change in the
future.



---

- **Kauri original link:** https://kauri.io/building-blocks:-what-makes-a-good-evm-package/583aaad5aff749dab1edb80933350936/a
- **Kauri original author:** Dennison Bertram (@dennisonbertram1)
- **Kauri original Publication date:** 2019-03-07
- **Kauri original tags:** zeppelinos, zeppelin-best-evm-package, packages, evm, solidity
- **Kauri original hash:** QmXTgt4jdTo5EGJj3zyCA8eqtyCDheyoyooh5o7yj8bJuW
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



