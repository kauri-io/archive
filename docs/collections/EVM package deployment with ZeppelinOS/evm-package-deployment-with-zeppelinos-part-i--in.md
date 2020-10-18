---
title: EVM package deployment with ZeppelinOS - Part I  Introduction and Creating a LinkedList Contract
summary: Introduction to ZeppelinOS and Package Managers If youre familiar with Node.js, then you will be familiar with NPM (Node Package Manager). You will also know that the ability to npm install existing code in your project makes your life as a programmer easier and, frequently, more secure. Being able to import existing code is a hallmark of a mature developer ecosystem and one of the fundamental tools that allow a programming language to reach an ecosystem of scale. The immense success of Node.js
authors:
  - Dennison Bertram (@dennisonbertram1)
date: 2019-03-07
some_url: 
---

# EVM package deployment with ZeppelinOS - Part I  Introduction and Creating a LinkedList Contract


### Introduction to ZeppelinOS and Package Managers

If you're familiar with Node.js, then you will be familiar with NPM
(_Node Package Manager)_. You will also know that the ability
to `npm install` existing code in your project makes your life as a
programmer easier and, frequently, more secure.
Being able to import existing code is a hallmark of a mature developer
ecosystem and one of the fundamental tools that allow a programming
language to reach an ecosystem of scale. The immense success of Node.js
is due in no small part to the NPM ecosystem. In the last month alone,
NPM saw **33,839,343,034** downloads (at the time of writing)!

In comparison, Ethereum, and the primary language for smart contracts,
Solidity, is in its infancy. Yet the Solidity ecosystem is growing
rapidly, and as it grows, so does the complexity of tasks programmers
are trying to solve. Starting from scratch on every project can be a
major impediment to progress, especially when code can potentially store
(and lose!) millions of dollars in real money. A frugal blockchain
developer will try to write as little "new code" as possible, instead
importing existing audited code libraries so as to reduce introducing
new and unforeseen bugs as much as possible.

To this end, Zeppelin created
[OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity),
an open source framework of battle-tested, reusable smart contracts for
Ethereum (as well as other EVM and eWASM blockchains). OpenZeppelin
smart contracts allow you to get up and running with standard blockchain
tasks, with the confidence that the code you're using has been through
rigorous testing by auditors and the open source community.

[ZeppelinOS](https://zeppelinos.org/?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress)
takes this idea even further by offering a development platform designed
specifically for smart contract projects. It allows for seamless
upgrades and provides economic incentives for creating a healthy
ecosystem of secure applications. Most importantly, it allows you to
build projects that leverage the power of code that is **already deployed on-chain**. Not only does this dramatically increase the transparency of
your project to your potential users, but it also saves you money, as
you don't need to pay the gas cost to deploy entirely new copies of the
existing code to the network. You just reuse the logic from contracts
that someone else has already deployed!

With ZeppelinOS, not only can you now create upgradable smart
contracts (where the upgrading process can be controlled by any number
of governance techniques), you can also create EVM packages to allow
others to reuse, remix, and develop on an open ecosystem.

### What you will learn

In this series, we're going to go over the complete process for
creating, deploying, and linking on-chain bytecode using NPM and the
ZeppelinOS system.

#### Topics

- What EVM packages are and what they're good for.
- The complete setup process for ZeppelinOS. How to create a basic EVM
  package along with basic testing in Truffle Console.
- Deploying your EVM package to test-networks as well as Ethereum
  mainnet.
- Creating a new project and linking to your published EVM package.
- Interacting with your newly deployed on-chain library.

### Who this tutorial is meant for

This tutorial aims to be as detailed as possible to cater to Solidity
developers at all levels of experience. For beginners, it's best to
follow the entire document, as I will build on steps from previous
sections. For more advanced Solidity developers, feel free to skip
ahead.

### What are EVM packages?

[EVM packages](https://blog.zeppelinos.org/open-source-collaboration-in-the-blockchain-era-evm-packages/?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress)
are collections of deployed on-chain code that you can
incorporate and reuse in your own project via package managers such as
NPM. This makes it easy to build upon open source libraries created and
verified by others in the ecosystem. ZeppelinOS makes the process of
creating and using EVM packages simple.

### What are we going to build?

For this tutorial, we're going to create our own EVM package for a
Solidity Linked List implementation: custom code that tackles a real use
case. Our linked list will give your Solidity projects an easy-to-use
data structure that we will deploy on-chain and that you can reuse over
and over for any project you might like. No `Hello World` here!

### What do I need to get started?

If you are an existing Solidity developer familiar with tools such as
Truffle, Ganache, Node.js, and Remix, you're probably already set up. If
not, don't worry, we'll cover the steps necessary to get you started.

#### Software

- Code editor (VSCode, Atom, or Sublime)
- Node.js, [Truffle](#), [Ganache](#) (we'll be using the command line interface version)
- [ZeppelinOS](https://zeppelinos.org/?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress)
- Xcode tools (if you're on macOS, this is not strictly necessary, but if you run into installation problems with NPM, sometimes it can help).

While this guide will be oriented toward Unix-based operating systems
such as Ubuntu or macOS, as long as you can get the core requirements
running, you should be able to follow along with this guide.

##### Ganache

Ganache is a development blockchain that runs locally on your computer
and is used for testing. Previously called TestRPC, Ganache runs a full
ephemeral Ethereum blockchain on our machine that behaves and acts like
the real thing (with customizable differences). We'll use it for testing
our contracts.

```shell
npm install -g ganache-cli
```

##### ZeppelinOS

ZeppelinOS is the development platform that will allow us to not only
create and deploy our EVM package but also to upgrade smart contracts
when we want to add new features or fix bugs. Additionally, ZeppelinOS
introduces economic incentives to support a healthy ecosystem of secure
applications. Learn more at
[ZeppelinOS](https://zeppelinos.org/?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress).

```shell
npm install --global zos
```

To see a list of command line options once they're installed:

```shell
zos --help
```

To learn more, check out [the API reference docs](https://docs.zeppelinos.org/docs/apis.html?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress).

##### Truffle

Go ahead and get [Truffle](https://truffleframework.com/truffle).
Truffle is one of several development frameworks for Ethereum that can
make developing dApps (distributed applications) easier. Recently,
Truffle upgraded to v5, which introduces a number of breaking changes.
If you have Truffle v4, be sure to upgrade.

```shell
npm install truffle@5.0.1
```

#### Project Setup

First, create a new directory and navigate into it.

```shell
mkdir LinkedList
cd LinkedList
```

Feel free to name your directory and project whatever suits you best.

We'll now use NPM to create your **package.json** file.

```shell
npm init
```

Take care to answer the prompts, as this information will be needed when
you publish to NPM.

Now we're ready to initialize our ZeppelinOS project.

```shell
zos init LinkedList>>Successfully written zos.json
```

Like `npm init` , `zos init` will create its own JSON file,
_zos.json_, to track the details of your ZeppelinOS project. The
command will also initialize [Truffle](https://truffleframework.com/),
which will create two directories, **contracts** and **migrations**, as well
as a _truffle-config.js_ file.

Your directory structure should look like this:

```shell
contracts
migrations
package.json
truffle-config.js
zos.json
```

Both **contracts** and **migrations** are empty folders.

The _truffle-config.js_ file exports an object that defines the
networks Truffle can use and the settings for deployment. For now, you
should only see a "local" network. This network will be our development
network.

```javascript
"use strict";
module.exports = {
  networks: {
    local: {
      host: "localhost",
      port: 9545,
      gas: 5000000,
      gasPrice: 5e9,
      network_id: "*"
    }
  }
};
```

The _zos.json_ file will fill up as soon as you start adding and
deploying contracts. The information about our contracts will be stored
here.

```json
{
  "zosversion": "2",
  "name": "LinkedList",
  "version": "0.1.0",
  "contracts": {}
}
```

The files and folders so far are _package.json_ (created by
`npm init`), two empty directories named **contracts** and **migrations**
(created by `zos` for Truffle), and a _zos.json_ file (created by
`zos` for ZeppelinOS).

### Creating the LinkedList contract

The goal of the _LinkedList.sol_ contract is to create a data
structure that will allow us to add and remove nodes from the head of a
list. In essence, we're going to create a **stack**. Custom data
structures are useful, because Solidity has limited built-in array
methods, and array manipulation can quickly become an expensive (or even
impossible!) operation to complete on-chain because of gas costs.

Need a linked list refresher? Here are some references I used for this
tutorial:

[The Little Guide of Linked List in JavaScript](https://hackernoon.com/the-little-guide-of-linked-list-in-javascript-9daf89b63b54) A
Linked List is a list of nodes that are represented by a head that is
the first node in the list and the tail that is the last one. Read more
at [hackernoon](https://hackernoon.com/).

[JS Data Structures: Linked List](https://codeburst.io/js-data-structures-linked-list-3ed4d63e6571)Learn
what a Linked List is and how to write one in JavaScript. Read more at
[codeburst.io](https://codeburst.io/)Open your code editor of choice and navigate to
your project. Create a Solidity contract called _LinkedList.sol_ and
save it in the **contracts** folder.

If you're interested in an excellent tutorial about building a linked
list in Solidity, I highly recommend Austin Thomas Griffith's "[Linked Lists inSolidity](https://medium.com/coinmonks/linked-lists-in-solidity-cfd967af389b)",
which I used as a starting point for the following code:

```solidity
pragma solidity >=0.4.24 &lt;0.6.0;

import "zos-lib/contracts/Initializable.sol";

contract LinkedList is Initializable{

    event EntryAdded(bytes32 head, string data, bytes32 next);

    //Struct will be our Node
    struct Node {
        bytes32 next;
        string data;
    }


    //Mappping will hold nodes
    mapping (bytes32 => Node) public nodes;

    //Length of LinkedList (initialize with constructor/initalizer)
    uint public length;

    //Head of list;
    bytes32 public head;

    //Name of LinkedList (the purpose for the list)
    string public listName;

    function initialize(string memory _listName) initializer public {
        require(bytes(_listName).length >= 0);
        length = 0;
        listName = _listName;
    }

    function addNode(string memory _data) public returns (bool){
        Node memory node = Node(head, _data);
        bytes32 id = keccak256(abi.encodePacked(node.data, length, now));
        nodes[id] = node;
        head = id;
        length = length+1;

        emit EntryAdded(head, node.data, node.next);
    }

    //popNode
    function popHead() public returns (bool) {
        require(length > 0, "error...head is empty");
        //hold this to delete it
        bytes32 newHead = nodes[head].next;
        //delete it
        delete nodes[head];
        head = newHead;
        length = length-1;
    }

    //Contract interface
    function getNodeExternal(bytes32 _node) external view returns (bytes32, string memory){
        return (nodes[_node].next, nodes[_node].data);
    }

}
```

On line 3, we're importing:

```solidity
import "zos-lib/contracts/Initializable.sol";
```

_Initializable.sol_ is not installed by default with ZeppelinOS, but
you will need it in order to compile the contract. To install it:

```shell
npm install zos-lib
```

Here we're importing from the **zos-lib** a contract called
_Initializable.sol_, and we're  telling the compiler on line 5 that
our contract **LinkedList** is initializable. Then on line 26, we create
a function called `initialize()`, which uses the library modifier
**initializer** which can be found in the
_zos-lib/contract/Initializable.sol_ contract.

It's not entirely critical to understand the purpose of the initializer
pattern for this tutorial, but you should know that when building
upgradable smart contracts using the ZeppelinOS system, you must use
initializer functions instead of constructor functions in your
contracts. Constructor functions are incompatible with the way
ZeppelinOS proxy contracts manage upgradable smart contracts. Learn more
from "[Deploying your first contract](https://docs.zeppelinos.org/docs/deploying.html?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress)."

Strictly speaking, in this example it's not really necessary to use the
initializer function, as the _LinkedList.sol_ contract only uses the
`initialize()` function to set the value of `length` to zero. In
Solidity, undeclared values are by default zero, making this initializer
redundant. I am including it as a reminder that in the ZeppelinOS
system, we do not use constructor functions.

### Deploying to our development network

To get started with testing the contract (to be sure it works!), first
deploy it to Ganache, our development blockchain environment.

Open a new terminal window and type the following:

```shell
ganache-cli --port 9545 --deterministic
```

You will want to run this in a new window, because you'll need to keep
it running during development. If you close it, you will lose your
development blockchain state, including all of your locally deployed
contracts, and be forced to start again. After starting ganache-cli, you
should see an output like this:

```shell
Ganache CLI v6.1.8 (ganache-core: 2.2.1)
 Available Accounts
 (0) 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1 (~100 ETH)
 (1) …
 …
 (9) 0x1df62f291b2e969fb0849d99d9ce41e2f137006e (~100 ETH)
 Private Keys
 (0) 0xca9aca918d1c47237a858be560fa444k4qoid23s4e46d63ffc5edeeab2918f
 (1) …
 …
 (9)0x42e4a1f700a5ce2d2a99c262755520f284b324sae37ad8711411f9a245ef3ce8
 HD Wallet
 Mnemonic: <>;
 Base HD Path: m/44'/60'/0'/0/{account_index}
 Gas Price
 20000000000
 Gas Limit
 6721975
 Listening on 127.0.0.1:8545
```

This is a list of pre-generated and pre-funded accounts that you can use
on your development blockchain, along with a generated mnemonic, details
about gas price, gas limit, and base HD (hierarchical deterministic)
wallet path.

**IMPORTANT: NEVER USE THIS MNEMONIC FOR ANYTHING OTHER THAN DEVELOPMENT PURPOSES. IT IS NOT SECURE, AND YOU WILL LOSE ALL YOUR ETH.**

Note that as arguments for the command `ganache-cli`, we have both `--port` and `--deterministic`.

The `--port` argument has the same value (9545) as we saw in our
_truffle-config.js_ file.

The `--deterministic` argument means that every time we run
`ganache-cli`, we're going to use the same mnemonic so that we can
ensure we get the same test wallet addresses and corresponding private
keys. Without this flag, we would have a list of random addresses each
time, which can be confusing when testing projects.

I like to try and keep a single development mnemonic for all my dev
work, so I recommend copying down this mnemonic and saving it. If you're
doing development work across multiple teams or platforms, it can be
useful for everyone to work with the same set of addresses. To use your
mnemonic, run `ganache-cli` with the following additional argument:

```shell
–mnemonic "your twelve word mnemonic here"
```

Remember that this mnemonic is for **DEVELOPMENT ONLY**. For a complete list
of command line options, see [GitHub for ganache-cli](https://github.com/trufflesuite/ganache-cli).

Return to your original terminal window and create a new session for
ZeppelinOS in the top-level folder of your project.

```shell
zos session --network local --from 0x1df62f291b2e969fb0849d99d9ce41e2f137006e --expires 3600
```

The command line argument `--network local` instructs `zos` to use the
local network as specified in our _truffle-config.js_ file, while the
`--from` argument specifies the address from which ZeppelinOS will be
deploying contracts and managing them. In this case, the `--from`
address is the **tenth** address that `ganache-cli` generated.\
Notice that we're using the tenth address that Ganache provides as the
address for our ZeppelinOS session. Essentially, the proxy contract that
is deployed when creating upgradable contracts responds differently
depending on whether or not the address calling the contract is the same
as the address that manages it. Only the address that deploys the proxy
can interact **directly** with the proxy, while all other addresses that
call the proxy will be proxied **transparently** onward toward the
contract that the proxy points to.

![](Dennison.png)

Fortunately, ZeppelinOS takes care of proxies for us, and as a
developer, it is only important to remember that  `--from` needs to be
an address that will never be used to interact with the contract except
for upgrading it. So in this case we use the last address Ganache
offers: the tenth. But you can use any address as long as you remember
that it controls the proxy but won't be proxied itself. To read more,
see [ZeppelinOS upgrades pattern section](https://docs.zeppelinos.org/docs/pattern.html?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress).

Finally, `--expires 3600` sets the duration for which we want to keep
the ZeppelinOS session open. f you time out, the command will need to be
re-entered. You will know your session has timed out if you receive this
message when you try to execute other `zos` commands:

```shell
A network name must be provided to execute the requested action.
```

Not to worry, re-enter the following and you'll have a new
session to work with.

```shell
zos session --network local --from 0x1df62f291b2e969fb0849d99d9ce41e2f137006e --expires 3600
```

Once you have a ZeppelinOS session running, you can always check the
file _.zos.session_ in your main project. Here you will see the
information regarding your current session; the **network** you're
using, the **from** address, and when the session expires.

### Adding our contract

Now that you have set up your ZeppelinOS session, created your contract,
and have your development blockchain running, you need to add your
contract to the ZeppelinOS project. In the same terminal window, in the
top-level folder of your project, run the following:

```shell
zos add LinkedList
```

If you look at the _zos.json_ file, you will see that your JSON object
now contains our contract "LinkedList" under the "contracts" key value.

Similarly, you now have a top-level folder in your project named _build_
that contains a subfolder called _contracts_, which is where the JSON
objects representing the contract's ABI (application binary interface)
are stored.

Now that you have added your _LinkedList.sol_ contract to the
ZeppelinOS project, we can deploy the project to the development
blockchain.

```shell
zos push
```

When it comes time to deploy to a different network (such as a public
test-net or mainnet), you will run the `zos session` command again with
a new network, as defined in your _truffle-config.js_ file. You can also
add the `--network` flag followed by your network name if you want to
push without starting a session.

Note that if you take a look at your second terminal where Ganache is
running, you'll see that a transaction has been created.

Return to your first terminal window where you issued the `zos push`
command. The final line of output should be something like this:

```shell
Created zos.dev-{some number here}.json
```

If you look at your project folder structure, you will see a new JSON
file has been created in your project with the filename
_zos.dev-{ome number here}.json_. The "{some number
here}" will be the network-id of your development blockchain. This
will most likely be a pseudo-random number when working with a
development chain and is used just to identify the network. There's an
[unofficial list of public networks](https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids?noredirect=1&lq=1)
and their identification numbers.

The _zos.dev-{some number here}.json_ file holds all the
information regarding the current deployment of our contracts on this
particular network. If you open it up, you'll see the address the
contracts are deployed at along with information about them.

Here's more
[information](https://docs.zeppelinos.org/docs/configuration.html?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress#zos-network-json)
regarding networks.

##### Creating an instance of our contract

Now that we have deployed our project, we need to make an instance of
our contract to interact with it.

```shell
zos create LinkedList --init initialize --args "NameOfYourLinkedListHere"
```

This command creates an instance of our LinkedList.sol and calls the
initialize function in place of what would normally have been a
constructor. It will return an address where the instance was created
(these addresses will be unique to your project):

```shell
Using session with network local, sender address 0x1df62f291b2e969fb0849d99d9ce41e2f137006e
Creating proxy to logic contract 0x2adf8b30d4dd24a05ccd9afbdc06a5b49c9c758d and initializing by calling initialize with:

Instance created at 0x25f96b23947f3e57b29d15760fd8af926694fa81
0x25f96b23947f3e57b29d15760fd8af926694fa81
```

The `zos create` command creates an instance of the contract on the
blockchain that we can directly interact with. While `zos push` deploys
the project, our project isn't intended to be directly manipulated.
Rather, ZeppelinOS gives us the ability to create **proxies** of contracts
that point to the original contracts we wrote. This gives us the ability
to upgrade our contracts by telling ZeppelinOS we want to point our
instance of a contract to a newer version of our original contract.

If you take a look again at the _zos.dev-{some number here}.json_ file and scroll to the bottom, you will now see a
top-level value named "proxies" near the bottom of the file. This is
where ZeppelinOS keeps track of your contract deployments on this
particular network. The **address** refers to the location of the proxy
of your contract, version is the version of our instance, and
**implementation** points to the logic contract our contract calls will
be proxied to.

The **address** entry will be the address that you will use when you
want to connect to your contract (via the proxy) for something like
testing or via web3 in a dApp.

_Thanks to_ [_Santiago Palladino_](https://twitter.com/smpalladino) _for
reading early drafts and providing feedback._
