---
title: Populus  Smart contract compilation and deployment
summary: Populus- Smart contract compilation and deployment Note- this guide outlines Populus as it stands right now and is a work in progress. As this guide was being written, support for Web3.py 4 has been introduced, and eth-tester support was added while ethtestrpc was removed (as of PR-474). Shortly after this, Piper Merriam (via ethereum/populus gitter) indicated that a new tool, called pytest-ethereum, is being prototyped and it is intended to be “a standalone replacement for alot of what populus
authors:
  - Wil Barnes (@wil)
date: 2018-09-13
some_url: 
---

# Populus  Smart contract compilation and deployment


## Populus: Smart contract compilation and deployment 

Note: this guide outlines Populus as it stands right now and is a work in progress. As this guide was being written, support for Web3.py 4 has been introduced, and eth-tester support was added while ethtestrpc was removed (as of PR#474). 

Shortly after this, Piper Merriam (via 'ethereum/populus' gitter) indicated that a new tool, called pytest-ethereum, is being prototyped and it is intended to be “a standalone replacement for alot of what populus does.” For this reason, this article will be left in it's current unfinished state, but as more information becomes available this article will be updated. 

There are many tools available to developers looking to simplify the process of compiling and deploying contracts to the testnets and mainnet. Populus is a development framework for Ethereum smart contracts written in Python. 

### What is Populus?

Populus is a Python based development framework for Ethereum smart contracts. Populus is in a more rudimentary development state than the other prominent development frameworks discussed in this DappSeries (e.g. Truffle, Embark). 

Those using this tool should be aware that as of writing this article Populus does not receive a constant stream of updates. 

### General Information 

* Populus 2.2.0 documentation: 
    https://populus.readthedocs.io/en/latest/
* The steps below were written in the context of an Ubuntu 18.04 environment + python3.6 virtual environment, though the article has been crafted to be applicable to any of the major operating systems. 

### Installing Populus 

Much of the content in this section is copied verbatim from Populus' ReadtheDocs page linked above in the General Information section.

#### Populus has the following system dependencies: 

Debian, Ubuntu, Mint 

```
$ sudo apt-get install libssl-dev
```


Fedora, CentOS, RedHat

```
$ sudo yum install openssl-devel
```


OSX 

```
$ brew install pkg-config libffi autoconf automake libtool openssl
```


Virtual environments: 
While not a neccessity, this article assumes use of a python3.6 virtual environment. This article won't go into detail on how to install & construct a virtual environment. See this documentation: https://docs.python.org/3/tutorial/venv.html 

Use pip to install Populus:

Python 2:

```
$ pip install populus 
```


Python 3: 

```
$ pip3 install populus
```


A note on some issues I experienced while installing Populus:

* Populus compile error related to 'Force_Text':
    * Try 'pip install eth-utils==0.8.1'
* Pip installation errors related to secp256k1:
    * Try 'pip install —upgrade web3'

To install latest dev branch, clone the repo and install via requirements-dev.txt. 

```
$ pip install -e . -r requirements-dev.txt
```

### Initializing a new project 

Initialize a new project using the command line:

```
$ populus init
```

or use the command below to initialize a project in a specific directory: 

```
$ populus -p /path/to/my/project
```



### Compiling your contracts

The init command we used in the previous section generates a sample contract for us called 'Greeter.sol'. This contract is located in the contracts/ folder. This is just a basic contract used in the Populus ReadtheDocs to demonstrate generic functionality. 

Some things to consider: 

Instead we will use a more intermediate level contract in this article. See below:

```
pragma solidity ^0.4.21;
/**
 * @title Bounties
 * @author Joshua Cassidy- <joshua.cassidy@consensys.net>
 * @dev Simple smart contract which allows any user to issue a bounty in ETH linked to requirements
 * which anyone can fulfil by submitting the evidence of their fulfilment
 */
contract Bounties {
/*
  * Enums
  */
enum BountyStatus { CREATED, ACCEPTED, CANCELLED }
/*
  * Storage
  */
Bounty[] public bounties;
/*
  * Structs
  */
struct Bounty {
      address issuer;
      uint deadline;
      string data;
      BountyStatus status;
      uint amount; //in wei
  }
/**
   * @dev Contructor
   */
  constructor() public {}
/**
  * @dev issueBounty(): instantiates a new bounty
  * @param _deadline the unix timestamp after which fulfillments will no longer be accepted
  * @param _data the requirements of the bounty
  */
  function issueBounty(
      string _data,
      uint64 _deadline
  )
      public
      payable
      hasValue()
      validateDeadline(_deadline)
      returns (uint)
  {
      bounties.push(Bounty(msg.sender, _deadline, _data, BountyStatus.CREATED, msg.value));
      emit BountyIssued(bounties.length - 1,msg.sender, msg.value, _data);
      return (bounties.length - 1);
  }
/**
  * Modifiers
  */
modifier hasValue() {
      require(msg.value > 0);
      _;
  }
modifier validateDeadline(uint _newDeadline) {
      require(_newDeadline > now);
      _;
  }
/**
  * Events
  */
  event BountyIssued(uint bounty_id, address issuer, uint amount, string data);
}
```

Using your text editor of choice, add this solidity contract to the contracts/ folder and use the below command to compile it: 

```
$ populus compile 
```
![](https://ipfs.infura.io/ipfs/QmaZ4Cqew26sJ2gYzMiSpNhEd6Qjw7KDZKCKv9muomWvTn)

Here you can see that our Bounties.sol contract was found and compiled. When you first initialize a new Populus project, you will find a Greeter.sol and its test python files. I removed those files for this demo and will only focus on the Bounties.sol contract shown above. 

Within your build directory (in our example: './testproject/build/') there should exist a 'contracts.json' file. This file is required to deploy the contract. It contains the application binary interface (ABI), the bytecode required to deploy the contract, and the bytecode to be written to the Ethereum blockchain. 

The watching command (—watch/-w) is helpful when you're working with your source code, as it will automatically recompile your contracts when it detects that the source code has changed. 

```
$ populus compile --watch
```

Lastly, any build output is serialized as JSON and is written to the build/contract.json folder of your initialized project. 

### Creating a local test blockchain using Populus (to be deprecated)

A feature of Populus that will soon be deprecated is the ability to quickly create local chains using your machine's local geth instance. You can both deploy and test your smart contracts using these local chains. 

You must have geth installed on your machine for the below command to work, otherwise you will receive a folder cannot be found error. 

Create a local geth chain, named 'newchain': 

```
$ populus chain new newchain
```

This command creates a genesis.json (the local chains genesis block), an ethereum account with balance, and two bash scripts: 'init_chain.sh' and 'run_chain.sh'. 

Directory view of the generated directory and associated files: 
![](https://ipfs.infura.io/ipfs/QmbUkwdXJYuAVPEb9J5mWBA4NTz1dKRhs5FUYuuLxg9q73)

Using this feature, new developers do not yet need to delve into the intricacies of the the 'genesis.json' file. Likewise, more experienced developers can use the chain command to generate a 'genesis.json' file and then modify it as they see fit. 

After you create a new local chain, it must be initialized using the 'init_chain.sh' script generated by our command above: 

```
$ ./init_chain.sh
```

Note: Initialize your local chain before you use the 'run_chain.sh' script or you will receive a 'failed to write genesis block' error. 

Let's run our local geth chain now: 

```
$ ./run_chain.sh
```

You should see the standard geth output. This is our local chain 'syncing.' 

Lastly, we need to add our newly created local chain information to our 'project.json' file, as below: 

```
},
  "chains": {
    "newchain": {
      "chain": {
        "class": "populus.chain.ExternalChain"
      },
      "web3": {
        "provider": {
          "class": "web3.providers.ipc.IPCProvider",
        "settings": {
          "ipc_path":"/home/wil/Documents/scripts/python/populus/testproject/chains/newchain/chain_data/geth.ipc"
        }
       }
      },
      "contracts": {
        "backends": {
          "JSONFile": {"$ref": "contracts.backends.JSONFile"},
          "ProjectContracts": {
            "$ref": "contracts.backends.ProjectContracts"
          }
        }
      }
    }
  }
```

### Deploying smart contracts to our newly created local chain (to be deprecated)

We've both compiled our smart contracts and brought our local chain online. It's now time to deploy our smart contracts to our local chain. 

Populus makes this process simple with the following command:

```
$ populus deploy --chain newchain Bounties --no-wait-for-sync
```

We use the deploy argument along with a few additional optional arguments that selects our local chain, 'newchain', and the smart contract we want to deploy, 'Bounties.' We use the '—no-wait-for-sync' option because on our local chain we've already initalized a genesis block that endows our generated coinbase account with the test ether we need to successfully deploy. 

Your expected output should be similar to the below: 
![](https://ipfs.infura.io/ipfs/QmSDtESrzDSKDajQ5mSfqcL1GNE5DRELtDSndMZdm398ZJ)

### Testing your smart contracts 

The command to test the smart contracts is different from the general populus command syntax: 

```
$ py.test tests/
```

If you experience errors, there are a few things to be aware of here. Initially, I experienced errors here related to the 'project.json' file that is required to be in the default project directory (in our example: './testproject/'). The file we need appears in './../venv/lib/python3.6/site-packages/populus/assets/defaults.v8.config.json'. Copy this file into your default populus directory (in our example: 'testproject/') and rename it to 'project.json'. For more information on this issue and solution, see: https://github.com/ethereum/populus/issues/431 

The following guide will discuss the Populus testing process in greater detail. 



---

- **Kauri original title:** Populus  Smart contract compilation and deployment
- **Kauri original link:** https://kauri.io/populus:-smart-contract-compilation-and-deploymen/21b6d5256bcd4a0bb23c84c75c1b1f76/a
- **Kauri original author:** Wil Barnes (@wil)
- **Kauri original Publication date:** 2018-09-13
- **Kauri original tags:** none
- **Kauri original hash:** QmVjoEZBCgXZWVkG6ajnCfYDvT3BhSkJYhdtjoGJ3YcNG6
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



