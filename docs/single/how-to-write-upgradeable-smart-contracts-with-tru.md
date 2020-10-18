---
title: How to Write Upgradeable Smart Contracts with Truffle ^5.0 and ZeppelinOS ^2.0
summary: Context In this post, well learn how to write upgradeable smart contracts with the latest versions of Truffle and ZeppelinOS. In particular, version ^5.0 of Truffle introduces a plethora of updates, with the most prominent one being the integration with web3 ^1.0. Lets unpack these updates and introduce upgradeable smart contracts with the state-of-the-art ZeppelinOS. This is not an introductory article to Ethereum development, if you want that, take a look at the following resources- The Hitchh
authors:
  - Paul Berg (@paulrberg-old-account)
date: 2019-02-16
some_url: 
---

# How to Write Upgradeable Smart Contracts with Truffle ^5.0 and ZeppelinOS ^2.0


### Context

In this post, we'll learn how to write upgradeable smart contracts with the latest versions of Truffle and ZeppelinOS. In particular, version ^5.0 of Truffle introduces a plethora of updates, with the most prominent one being the integration with web3 ^1.0. Let's unpack these updates and introduce upgradeable smart contracts with the state-of-the-art ZeppelinOS.

This is not an introductory article to Ethereum development, if you want that, take a look at the following resources:

- [The Hitchhiker’s Guide to Smart Contracts in Ethereum](https://blog.zeppelin.solutions/the-hitchhikers-guide-to-smart-contracts-in-ethereum-848f08001f05)
- [Gentle Introduction to Ethereum Programming](https://blog.zeppelin.solutions/a-gentle-introduction-to-ethereum-programming-part-1-783cc7796094)

Do note that the blockchain world moves at a ridiculous pace, giving little to no time for standards to sink in. This means that a lot of code snippets from the articles above may not work as expected, but don't panic and return here when that happens.

### Prerequisites

Make sure you are equipped with the following:

- node.js and npm
- ganache-cli or the [Ganache](https://truffleframework.com/ganache) desktop app
- curiosity to learn more

### Truffle ^5.0

![Truffle Logo](https://paulrberg.com/post/upgradeable-smart-contracts/truffle.png)

To install truffle globally, go to your terminal and write:

```
$ npm install truffle@^5.0.0 --global
```

And let's create our project:

```
$ mkdir MyProject
$ cd myProject
$ npm init -y
$ truffle init
```

This will initialise a bunch of files. If you used older versions of Truffle, you may notice that "truffle-config.js" is more verbose now and has many more configurable options. Let's go through the important changes.

#### Web3 ^1.0

This is a major API change, but it's a good one, because the new library is much more elegant and intuitive to use. Of course, there are transition costs if you had already written your Truffle tests using older versions, so bookmark the web3 ^1.0 [documentation](https://web3js.readthedocs.io/en/1.0/) just in case.

#### HD Wallet Provider

If you were previously using the "truffle-hdwallet-provider" npm module, you **must** upgrade to "truffle-hdwallet-provider@web3-one" to make it work with Truffle ^5.0:

```
$ npm install truffle-hdwallet-provider@web3-one --save-dev
```

To load your mnemonic, you can either use the "fs" module natively provided by node or you can install "dotenv". Never hardcode it in JavaScript!

#### Bring Your Own Compiler

It used to be a huge [pain in the neck](https://ethereum.stackexchange.com/questions/17551/how-to-upgrade-solidity-compiler-in-truffle) to change the Solidity compiler when compiling with Truffle, but fear not any more! You can define whatever (remote) version you want by doing this:

```
compilers: {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    version: "0.4.25",
  },
}
```

In this particular example, we set the compiler version to "0.4.25", but you can choose "0.4.24" or "0.4.18" if you want to. To list all the available versions:

```
$ truffle compile --list
```

#### Support for Async, Await

If you're a fan of JavaScript ES8's super duper cool "async" and "await", you can now make good use of them when running `$ truffle develop` or `$ truffle console`.

#### Others

There a few other new features, such as the added support for plugins, but they are outside the scope of this tutorial. Check out the [changelog](https://github.com/trufflesuite/truffle/releases/tag/v5.0.0) if you're looking for an exhaustive list.

### Deploy a Smart Contract

![Smart Contract](https://paulrberg.com/post/upgradeable-smart-contracts/smart-contract.png)

This is the mock-up Solidity contract we're going to use:

```
// Note.sol
pragma solidity ^0.4.25;

contract Note  {
  uint256 private number;

  constructor(uint256 _number) public {
    number = _number;
  }

  function getNumber() public view returns (uint256 _number) {
    return number;
  }
}
```

Create a new file called "Note.sol" in your "contracts" folder and copy and paste the code above in there. Now, make sure you've done all the steps correctly by compiling the contract:

```
$ truffle compile
```

You should get no error and the following logs:

> Compiling ./contracts/Migrations.sol...  
> Compiling ./contracts/Note.sol...  
> Writing artifacts to ./build/contracts

Now, let's write the migration file.

```
// 2_migrate_note.js

var Note = artifacts.require("./Note.sol");

module.exports = function (deployer) {
  deployer.deploy(Note, 64);
};
```

In the "migrations" folder, create a new file called "2_migrate_note.js" and copy and paste the code above. To verify the set up, you have to first spin up an Ethereum node, but don't worry, for local development there are tools like [Ganache](https://truffleframework.com/ganache). You can run it either by opening a new terminal window and executing `$ ganache-cli` or by launching the desktop app. Then:

```
$ truffle migrate
```

If you encounter problems, make sure that your "truffle-config.js" file looks like this (I stripped the comments for brevity):

```
// truffle-config.js

module.exports = {
  compilers: {
    solc: {
      version: "0.4.25",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    }
  }
};
```

If it works, you should get a beautiful report like the [one here](https://gist.github.com/PaulRBerg/e582f77a6e59da1e4719b5877dd88cd8). Awesome! Now you know how to compile and deploy a contract with Truffle ^5.0, but you haven't got your hands dirty with the cooler part yet: making the smart contracts upgradeable.

### ZeppelinOS

![ZeppelinOS Logo](https://paulrberg.com/post/upgradeable-smart-contracts/zeppelinOS.png)

#### Set Up

If you're completely unfamiliar with upgradeable smart contracts, go watch Elena Nadolinski's [presentation](https://www.youtube.com/watch?v=FzmzUHLiutg) on the topic. It's totally worth it and it can do a much better job than someone can on a blog.

The gist of it is that we're aiming to reconcile traditional development practices with smart contracts:

1. When running A/B testing with real users and there's a bug, we should patch the code and fix it asap.
2. The upgradeability processes should remain fully transparent and not grant total power to the developer(s).

Point no. 2 is currently under research with many people actively [proposing](https://blog.zeppelinos.org/exploring-upgradeability-governance-in-zeppelinos-with-a-gnosis-multisig/) transparent governance models. However, we won't mind decentralised autonomous organisations (DAOs) for now and focus on the technical part of the story.

Let's install ZeppelinOS and its library dependency:

```
npm install zos --global
npm install zos-lib --save-dev
```

And then initialise it within our Truffle project:

```
zos init MyProject
```

A file called "zos.json" should've been initialised:

```
{
  "zosversion": "2",
  "name": "MyProject",
  "version": "0.1.0",
  "contracts": {}
}
```

Importantly, make sure to **update the Note contract** as follows:

```
// Note.sol
pragma solidity ^0.4.25;

import "zos-lib/contracts/Initializable.sol";

contract Note is Initializable {
  uint256 private number;

  function initialize(uint256 _number) public initializer {
    number = _number;
  }

  function getNumber() public view returns (uint256 _number) {
    return number;
  }
}
```

ZeppelinOS contracts don't use normal Solidity constructors but instead rely on an "Initializable" base contract which needs to have its "initialize" function overridden. Let's continue by adding the edited contract to ZeppelinOS:

```
$ zos add Note
```

The following JavaScript object should've been added to "zos.json":

```
"contracts": {
  "Note": "Note"
}
```

Before deployment, ZeppelinOS requires you to create a session:

```
$ zos session --network development --from YOUR_DEPLOYMENT_ACCOUNT --expires 7200
```

Explaining each parameter:

- network: one of the networks defined under "truffle-config.js"
- from: because of a known [transparent proxy issue](https://docs.zeppelinos.org/docs/pattern.html), the deployment account mustn't be the default address designated by truffle or ganache
- expires: the time-to-live of the session, measured in seconds

Now, to clarify a few things:

1. The session is sort of a "behavioural sugar" - while deploying, you don't have to specify the "network" and the "from" parameters.
2. You might wonder what "from" parameter to set. Simply put, any account **except** the first one. Find a picture below for an example on the Ganache desktop app:

![Ganache Screenshot](https://paulrberg.com/post/upgradeable-smart-contracts/ganache-account.png)

Ready for prime time?

```
$ zos push
```
If it worked, you should've got something like this:

> Compiling contracts  
> Compiling ./contracts/Migrations.sol...  
> Compiling ./contracts/Note.sol...  
> Compiling zos-lib/contracts/Initializable.sol...  
> Writing artifacts to ./build/contracts  
>
> Validating contract Note  
> Uploading Note contract as Note  
> Deploying logic contract for Note  
> Created zos.dev-7923.json  

This command finally deploys your smart contract to the blockchain. This is where you can find important information about your project, such as the addresses of your deployed contracts.

#### Upgradeability

It is highly important to understand that ZeppelinOS, under the hood, works by creating two contracts:

1. Proxy
2. Logic

The catch is that the Proxy redirects the end user to the Logic, but the Proxy "retains" the storage. That is, even if you update the Logic, the state of your smart contracts stays the same.

Previously, you created and deployed a Logic contract. Let's create an instance of a Proxy:

```
$ zos create Note --init initialize --args 64
```

This deploys and logs the address of the new Proxy contract. Open a new terminal window and initialise a Truffle console:

```
truffle console --network development
let abi = require("./build/contracts/Note.json").abi
let contract = new web3.eth.Contract(abi, "your-proxy-address")
contract.methods.getNumber().call();
```

It should print "64".

*Head to the web3 ^1.0 [docs](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html) for more information on how to work with the new Contract API.*

What if you want to change the number? Fortunately, you can make an upgrade to the logic of the contract, while preserving the storage.

Firstly, update the contract by adding a new function:

```
// Note.sol
pragma solidity ^0.4.25;

import "zos-lib/contracts/Initializable.sol";

contract Note is Initializable {
  uint256 private number;

  function initialize(uint256 _number) public initializer {
    number = _number;
  }

  function getNumber() public view returns (uint256 _number) {
    return number;
  }

  function setNumber(uint256 _number) public {
    number = _number;
  }
}
```

And then:

```
$ zos push
$ zos update Note
```

Logs should look like this:

> Using session with network development, sender address 0xd833B5fa468A5a430a890390D8Ec652142836019  
> Upgrading proxy to logic contract 0xe6d6d1cd339f129275e5b5e7ab39d85bc5642010  
> Instance at 0x746bb4a872bdfd861c4af5dd9391b3fb5b22fb7a upgraded  
> 0x746bb4a872bdfd861c4af5dd9391b3fb5b22fb7a  
> Updated zos.dev-7923.json

Now, start a new Truffle console and call your new "setNumber" function:

```
$ truffle console --network development
let abi = require("./build/contracts/Note.json").abi;
let contract = new web3.eth.Contract(abi, "your-proxy-address");
contract.methods.getNumber().call();
contract.methods.setNumber(65).send({ from: YOUR_OTHER_ACCOUNT });
contract.methods.getNumber().call();
```

It should print "65".

Voilà! You just wrote, deployed and upgraded an Ethereum smart contract.

#### Caveats

- "YOUR\_DEPLOYMENT\_ACCOUNT" must only be used when setting up a session, for any other interaction with the contract, you have to use other account.
- If you got a `A network name must be provided to execute the requested action` error, just start a new session, the old one expired.
- You might've noticed that we didn't use TruffleContract to interact with the deployed contracts and instead relied on the web3 ^1.0 implementation. This is because I find the former confusing and, on many occasions\[[1](https://github.com/trufflesuite/truffle/issues/1455)\]\[[2](https://github.com/trufflesuite/truffle/issues/1601)\], not even functional.
- There is more to upgradeable smart contracts than what we discussed here. Head to Zeppelin's awesome [documentation](https://docs.zeppelinos.org/docs/start.html) to get the whole picture. In particular, I recommend looking over the [limitations](https://docs.zeppelinos.org/docs/start.html) to upgrading storage variables.
- ~~If you're planning to migrate to Solidity ^0.5.0, I'm sorry to disappoint you that ZeppelinOS doesn't support it yet, as of Dec 2018. There is an option called "--skip-compile", but I felt that it added too much complexity to be worth it.~~ Santiago Palladino from Zeppelin [reached out](https://twitter.com/smpalladino/status/1080460733333336065) on Twitter and announced that they now do support the ^0.5.0 versions of Solidity. If you want to test it out, just do `npm install zos-lib@2.1.0-rc.0 --global`.

### Wrap-Up

I hope you enjoyed this tutorial and you're as excited about blockchain development as I am, despite the occasional versioning and coordination issues. 

I compiled the code used throughout this article in this GitHub [repo](https://github.com/PaulRBerg/truffle-zos-tutorial). There are three branches (master, zos, zos-upgraded) with the correspondent code of the Note contract for every stage we've been through.

Find me on [Twitter](https://twitter.com/PaulRBerg) or [Keybase](https://keybase.io/PaulRBerg) if you want to chat.


---

- **Kauri original title:** How to Write Upgradeable Smart Contracts with Truffle ^5.0 and ZeppelinOS ^2.0
- **Kauri original link:** https://kauri.io/how-to-write-upgradeable-smart-contracts-with-tru/315cbd6c71574e2686e15f0a20003089/a
- **Kauri original author:** Paul Berg (@paulrberg-old-account)
- **Kauri original Publication date:** 2019-02-16
- **Kauri original tags:** ethereum, truffle
- **Kauri original hash:** QmV17ugGfaECarUVoerS1GCBoJcYmgAKj2vakqXZT1NkTG
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



