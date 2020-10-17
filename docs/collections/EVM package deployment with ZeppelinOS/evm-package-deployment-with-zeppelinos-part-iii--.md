---
title: EVM package deployment with ZeppelinOS - Part III  Linking to mainnet
summary: Pulling it all together Now that youve created your first EVM package, lets go through the steps you would take to link it to your project as if you were linking directly from NPM. These commands you already know, so Ill just run through them quickly-mkdir myproject2 cd myproject2 npm init -y zos init myproject2 npm install truffle@5.0.1 Now we need to link the NPM package-zos link <> This will install your NPM package and add it to your zos.json file as a dependency. You will also now find your
authors:
  - Dennison Bertram (@dennisonbertram1)
date: 2019-03-07
some_url: 
---

# EVM package deployment with ZeppelinOS - Part III  Linking to mainnet

## Pulling it all together

Now that you've created your first EVM package, let's go through the
steps you would take to link it to your project as if you were linking
directly from NPM. These commands you already know, so I'll just run
through them quickly:

```shell
mkdir myproject2
cd myproject2

npm init -y
zos init myproject2
npm install truffle@5.0.1
```

Now we need to link the NPM package:

```shell
zos link <<name of your npm package>>
```

This will install your NPM package and add it to your **zos.json** file
as a dependency. You will also now find your linked contract in the
_node modules_ folder. Open it up and you will see the ZeppelinOS
project configuration files along with your _contract_ and _build_
folders.

For convenience, I've already deployed our linked list to NPM, so if you
don't want to deploy your own, you can use:

```shell
zos link zos-linkedlist
```

## Testing

Return to your _myproject2_ top level, and create a new contract to test
the linked `LinkedList` contract. In your _contracts_ folder, make a new
contract called _QuickContract.sol_. Note that for the import of the
LinkedList NPM module, I refer to the folder by the name "LinkedList."
As you will not be able to publish your NPM package under that name, be
sure to reference the module name according to the name you gave your
NPM package.

```solidity
pragma solidity >=0.4.24 <>0.6.0;
import "zos-linkedlist/contracts/LinkedList.sol";
//The NPM package name will have it's own folder under modules

contract QuickContract {
    LinkedList private _linkedlist;

    function setLinkedList(LinkedList linkedlist) external {
        _linkedlist = linkedlist;
    }

    function getHead() public view returns (bytes32) {
        bytes32 _node = _linkedlist.head();
        return _node;
    }

    function addNode(string memory _data) public {
        _linkedlist.addNode(_data);
    }
}

```

This is a fairly simple contract designed to test the basic functions of
the _LinkedList.sol_ contract. Note that the first function
`setLinkedList()` takes an instance of `LinkedList` as an address. This is
how the `QuickContract` knows where the `LinkedList` contract is deployed,
but remember, this address will actually be the **proxy** contract, which
will serve as the permanent address for the contract but actually points
to the `LinkedList` implementation we deployed earlier. When we call into
the proxy, the proxy will forward the contract call to the logic code as
managed by ZeppelinOS. To upgrade your contract, you can tell the proxy
to point to a new logic contract, keeping the same address but with new
logic. As upgradable smart contracts are outside of the scope of this
tutorial, I encourage [you to see this article for more information](https://docs.zeppelinos.org/docs/upgrading.html?utm_campaign=zos-tutorial-evmpackages&utm_medium=blog&utm_source=wordpress).

Make sure you have your development blockchain running, as follows:

```shell
ganache-cli --port 9545 --deterministic
```

And then start a new session:

```shell
zos session --network local --from <<your_10th_Ganache_address_here>> --expires 3600
```

Now, from the top level of our project, we're going to add QuickContract
to the project:

```shell
zos add QuickContract
```

The next command will push our changes to the blockchain:

```shell
zos push --deploy-dependencies --network local
```

Let's take a quick look at the flag `--deploy-dependencies` while we have
deployed our NPM contract to the Ethereum mainnet. For testing purposes,
we're testing again on our local blockchain. ZeppelinOS will need to
also deploy its own copy of the _LinkedList.sol_ to this development
blockchain in order to link to it. We only need to do this in cases
where the dependencies are not already deployed on our blockchain (since
we just created it when we started Ganache!), and we only need to do it
once. If you have successfully deployed to the mainnet, you will not
need to do this again.

As before, you need to create an instance of our contract:

```shell
zos create QuickContract
```

Be sure to call the _LinkedList.sol_ contract initializer (ZeppelinOS
will remind you if you forget):

```shell
zos create zos-linkedlist/LinkedList --init initialize --args "MyList"
```

Note that after `zos create`, I have included the _node_modules_ folder
where _LinkedList.sol_ has been installed via NPM.

Now we can test the contract:

```shell
npx truffle console --network local
```

First, create an instance of our QuickContract:

```shell
truffle(local)>
quickContract = await QuickContract.at('<QuickContract-contract-address>')
```

Then link the contract by setting the address of our LinkedList
contract:

```shell
truffle(local)>
quickContract.setLinkedList('<LinkedList-address>')
```

Remember that you can find your "<QuickContract-contract-address>" and
"<LinkedList-address>" inside your _zos.<networkname>.json_ file.

Time to test! First, check if a head exists:

```shell
truffle(local)> quickContract.getHead()

0x0000000000000000000000000000000000000000000000000000000000000000
```

Now try adding a node:

```shell
truffle(local)> quickContract.addNode("Hello World!")
```

And now get the head again:

```shell
truffle(local)> quickContract.getHead()

0xcfbf767713316a02071074289829821d60f486eee26333765c344cea90478d1e

// The actual bytes32 response will be unique to your project
```

It works!

## Recap

That brings us to the end of the tutorial. Just to recap, in this
tutorial you:

- learned what EVM packages are for, how they can be used, and how to
  deploy them.
- wrote a basic (but very useful!) linked list data structure with
  Solidity.
- added the _LinkedList.sol_ contract to your ZeppelinOS project.
- tested your linked list by deploying the _LinkedList.sol_ contract
  and creating an instance to test against using ZeppelinOS and
  Truffle.
- published your _LinkedList.sol_ contract to the Ethereum mainnet
  and published it on NPM for others to use.
- created a new project from scratch, linking your deployed LinkedList
  to our test project.
- tested your new project using Truffle, and sure enough, it works!

Good luck with your projects! Have any questions or comments? Shoot me
an
[email](https://blog.zeppelinos.org/evm-package-deployment-with-zeppelinos-part-iii-linking-to-mainnet/dennison@zeppelin.solution)
or follow me on [Twitter](https://twitter.com/dennisonbertram).

_Thanks to [Santiago Palladino](https://twitter.com/smpalladino) for
reading early drafts and providing feedback._
