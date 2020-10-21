---
title: Smart Contract Utilities with ZeppelinOS  Installation and Use
summary: In this tutorial, we install ZeppelinOS, deploy a simple contract and then update it. Prerequisites Node.js An understanding of Solidity the programming language for smart contracts. Truffle, a development framework for Ethereum to test and deploy smart contracts. Ganache, a personal blockchain installed to test and run our smart contracts. Installing After installing Node.js we are now ready to install ZeppelinOS. Using terminal do the following- Note- For Windows users, I recommend Powershell
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-19
some_url: 
---

# Smart Contract Utilities with ZeppelinOS  Installation and Use


In this tutorial, we install ZeppelinOS, deploy a simple contract and then update it.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- An understanding of [Solidity](https://solidity.readthedocs.io/en/v0.5.1/solidity-in-depth.html) the programming language for smart contracts.
- [Truffle](https://truffleframework.com/truffle), a development framework for Ethereum to test and deploy smart contracts.
- [Ganache](https://truffleframework.com/ganache), a personal blockchain installed to test and run our smart contracts.

### Installing

After installing Node.js we are now ready to install ZeppelinOS. Using terminal do the following:

**Note**: For Windows users, I recommend Powershell over Command Prompt.

```shell
npm install -g zos
```

That's it! We installed ZeppelinOSs.

**Note**: `zos --help` gives you a full list of all ZeppelinOS commands should you require them.

### Creating our project

In the directory of your choice, create your project and then change to that directory:

```shell
mkdir first-project
cd first-project
```

Now we're going to create our _project.json_ file to store the relevant data for the project. You will see a dialogue of properties to fill in. Fill them in if you wish or press enter to leave as the default.

```shell
npm init
```

To initialize as a ZeppelinOS project run the following:

```shell
zos init first-project
```

This command initializes a Truffle config file, two empty folders called _contracts_ and _migrations_, and a _zos.json_ file which has more information about the project in relation to ZeppelinOS.

The last step is to download the ZeppelinOS project library.

**Note**: You have to install this library with every project, you can't use it from project to project.

```shell
npm install zos-lib --save
```

### Creating a Contract

After installing and initializing our project we are now ready to create our smart contract.

Open the project folder in an editor of your choice (I use atom) and notice that the file structure should look as follows:

```
first-project
  contracts
  migrations
  node_modules
  package-lock.json
  package.json
  truffle-config.js
  zos.json
```

Inside the _contracts_ folder create a new file called _FirstContract.sol_. This is going to be our smart contract. In this file write the following:

```
pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";

contract FirstContract is Initializable {

  int public year;
  int public age;
  string public name;

  function initialize(int _year,int _age, string memory _name) initializer public {
    year = _year;
    age = _age;
    name = _name;
  }
}
```

This is a basic contract that initializes 3 variables: `year`, `age` and `name`. We will update it later to make it more useful.

In ZeppelinOS we use an initialize function instead of a standard constructor because this allows for the contract to be upgradeable. _Initializable.sol_ is a contract we've imported from the zos library. It makes it possible to have the initialize function.

After creating our contract, we're ready to compile and add information to our _zos.json_ file:

```shell
zos add FirstContract
```

### Deploying

It's time to deploy our contract onto our test network using ganache.

To start ganache, open a separate terminal window and type the following command:

```shell
ganache-cli --port 9545 --deterministic
```

You should see something similar to the below:

```
Available Accounts
==================
(0) 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1 (~100 ETH)
(1) 0xffcf8fdee72ac11b5c542428b35eef5769c409f0 (~100 ETH)
(2) 0x22d491bde2303f2f43325b2108d26f1eaba1e32b (~100 ETH)
(3) 0xe11ba2b4d45eaed5996cd0823791e0c93114882d (~100 ETH)
(4) 0xd03ea8624c8c5987235048901fb614fdca89b117 (~100 ETH)
(5) 0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc (~100 ETH)
(6) 0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9 (~100 ETH)
(7) 0x28a8746e75304c0780e011bed21c72cd78cd535e (~100 ETH)
(8) 0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e (~100 ETH)
(9) 0x1df62f291b2e969fb0849d99d9ce41e2f137006e (~100 ETH)

Private Keys
==================
(0) 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
(1) 0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1
(2) 0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c
(3) 0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913
(4) 0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743
(5) 0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd
(6) 0xe485d098507f54e7733a205420dfddbe58db035fa577fc294ebd14db90767a52
(7) 0xa453611d9419d0e56f499079478fd72c37b251a94bfde4d19872c44cf65386e3
(8) 0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4
(9) 0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773

HD Wallet
==================
Mnemonic:     "your Mnemonic here"
Base HD Path:  m/44'/60'/0'/0/{account_index}

Gas Price
==================
20000000000

Gas Limit
==================
6721975

Listening on 127.0.0.1:9545
```

We see a mnemonic associated with our test account as well as details about our development blockchain. Now we're going to start a new session and test our contract. Open up another terminal and run the command below replacing `{ADDRESS}` with an address from Ganache.

```shell
zos session --network local --from {ADDRESS} --expires 3600
```

We've began a session with the local network. We're using a default sender address and we specify an expiry time for how long the session runs.

Our contract is ready to deploy.

```shell
zos push
```

**Note**: If you get a message at any point saying "A network name must be provided to execute the requested action" it means that our session expired. Run the `zos session` command from above and try again from where you left off.

That's it! Our contract is successfully deployed to the local network from the default address. If you look at your ganache terminal you will see details about the deployment. In our project folder there is a new file called _zos.dev-"network id".json_ It contains all the information about your project on this network.

### Upgrading

The contract we created is now deployed to our local network and we want to upgrade it. Normally this would be impossible but with ZeppelinOS we have the ability to do this.

Before we upgrade, to make sure there are no errors later on, we're going to compile our contract.

```shell
truffle compile
```

To begin we create an instance of our contract:

```shell
zos create FirstContract --init initialize --args 2019,19,Juliette
```

We re-initialize our contract through the `initialize` function and pass arguments to it. Thus we are initializing our contract to have the `year` `2019`, `age` `19`, and `name` `Juliette`.

After creating our instance we to test it using our Truffle console.

```shell
npx truffle console --network local
```

Once the Truffle console is up do the following:

```shell
firstContract = await FirstContract.at('your-address')
```

The address you use is directly _underneath_ the 'Instance created at <an-address> sentence from the `zos create` command earlier. Run the following four separate commands:

```shell
$ firstContract.year()
> <BN: 7e3>

$ firstContract.name()
> Juliette

$ firstContract.age()
> <BN: 13>
 ```

**Note**: `7e3` is hexadecimal for `2019` and `13` is hexadecimal for `19`. Integer numbers always display as hexadecimal. To confirm if your math is right you can always convert it yourself from hexadecimal to decimal.

Our tests performed the way we wanted to, thus we can now go and update the contract. Type `exit` to leave the Truffle console.

Update your contract to look like the following:

```
pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";

contract FirstContract is Initializable {

  int public year;
  int public age;
  string public name;


  function initialize(int _year, int _age, string memory _name) initializer public {
    year = _year;
    age = _age;
    name = _name;
  }

  function increaseYear() public {
    year += 4;
    age += 4;
  }
}
````

Updating our contract, we added a new function that increases `year` and `age` by 4. The user is able to determine how old they will be in 4 years.

**Note**: ZeppelinOS allows you to add functions, variables, etc when you update. To preserve functionality, all new variables must be below your existing ones.

```
contract MyContract1.0 {
  uint256 public a;
  uint256 public b;
}

contract MyContract1.1 {
  uint256 public c;
  uint256 public d;
}
```

Once you are happy with your changes, push your contract and then update it.

```shell
zos push --network local
zos update FirstContract --network local
```

Now that we have updated our contract lets start the Truffle console again to test it.

```shell
npx truffle console --network local
```

Now type in the following command:

```shell
$ firstContract = await FirstContract.at('your-address')
> undefined
```

Run the following four separate commands. The address you're going to use is the same one we used before:

```shell
$ firstContract.year()
> <BN: 7e3>

$ firstContract.name()
> Juliette

$ firstContract.age()
> <BN: 13>

$ firstContract.increaseYear()
```

You should get a lot of output here. Something like the following:

```json
{
  "tx": "address",
  "receipt": {
    "transactionHash": "address",
    "transactionIndex": 0,
    "blockHash": "address",
    "blockNumber": 5,
    "from": "address",
    "to": "address",
    "gasUsed": 33451,
    "cumulativeGasUsed": 33451,
    "contractAddress": null,
    "logs": \[],
    "status": true,
    "logsBloom": "0x000000000000000000000000000000000...",
    "v": "0x1b",
    "r": "address",
    "s": "address",
    "rawLogs": []
  },
  "logs": []
}
```

Then if we run the following two commands:

```shell
$ firstContract.age()
> <BN: 17>

$ firstContract.year()
> <BN: 7e7>
```

**Note**: **17** is hexadecimal for **23** and **7e7** is hexadecimal for **2023**. Integer numbers always display as hexadecimal. To confirm if your math is right you can convert it yourself from hexadecimal to decimal.

That's it! We deployed and updated our contract on our local test network!

### Next Steps

- <https://docs.zeppelinos.org/docs/upgrading.html>


---

- **Kauri original title:** Smart Contract Utilities with ZeppelinOS  Installation and Use
- **Kauri original link:** https://kauri.io/smart-contract-utilities-with-zeppelinos-installat/dcd4006a9e0f45fc84c8e5f7ddd6e2bd/a
- **Kauri original author:** Juliette Rocco (@jmrocco)
- **Kauri original Publication date:** 2019-03-19
- **Kauri original tags:** smart-contract, zeppelinos, upgrade, zeppelin, deploy
- **Kauri original hash:** QmUG11wHr1CvoABM3xNRZCg6cXcriMkSou8ahXr2Pwvy9f
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



