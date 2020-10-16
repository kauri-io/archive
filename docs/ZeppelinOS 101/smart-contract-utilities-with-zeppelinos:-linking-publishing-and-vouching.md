---
title: Smart Contract Utilities with ZeppelinOS  Linking, Publishing, and Vouching
summary: A feature of ZeppelinOS is the ability to link to EVM packages that are already deployed. In this tutorial, we will learn how to link to these packages and publish our own! Prerequisites Node.js An understanding of Solidity the programming language for smart contracts. Truffle, a development framework for Ethereum to test and deploy smart contracts. Ganache, a personal blockchain installed to test and run our smart contracts. Installing After installing Node.js we are now ready to install Zeppel
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-08
some_url: 
---

A feature of ZeppelinOS is the ability to link to EVM packages that are already deployed. In this tutorial, we will learn how to link to these packages and publish our own!

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- An understanding of [Solidity](https://solidity.readthedocs.io/en/v0.5.1/solidity-in-depth.html) the programming language for smart contracts.
- [Truffle](https://truffleframework.com/truffle), a development framework for Ethereum to test and deploy smart contracts.
- [Ganache](https://truffleframework.com/ganache), a personal blockchain installed to test and run our smart contracts.

## Installing

After installing Node.js we are now ready to install ZeppelinOS. Using the terminal do the following:

**Note**: For Windows users, I recommend Powershell over Command Prompt.

```shell
npm install -g zos
```

That's it! We installed ZeppelinOS.

**Note**: `zos --help` gives you a full list of all ZeppelinOS commands should you require them.

## Creating our project

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

## Creating a Contract

Open your project in a text editor of your choice (I'm using Atom) and create a new file called _MyToken.sol_ under the _contracts_ folder.

```solidity
pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20Detailed.sol";

contract MyToken {
  ERC20Detailed private _token;

  function initialize(ERC20Detailed token) external  {
    _token = token;
  }
}
```

**openzeppelin-eth** is an EVM package that is already deployed and it contains the same contracts that OpenZeppelin does. The difference between the two is that OpenZeppelin is not deployed to the network.

Now let's link our contract to the package:

```shell
zos link openzeppelin-eth
```

Right now the openzeppelin-eth EVM package has **StandaloneERC20**, **StandaloneERC721**, **TokenVesting**, and **PaymentSplitter** contracts pre-deployed. This means that these are the only contracts you can utilize in the EVM package.

We are now linked. It's time to compile and add the contract to our project:

```shell
truffle compile

zos add MyToken
```

Now in a separate terminal run ganache.

```shell
ganache-cli --port 9545 --deterministic
```

Open your original terminal and start a new session. For the address, you can choose any of the addresses from the ganache window under the "available accounts" section. I'm using the 9th address.

```shell
zos session --network local --from ganache-address-here --expires 3600
```

**Note**: If you get a message at any point saying "A network name must be provided to execute the requested action" it means that our session expired. Run the `zos session` command from above and try again from where you left off.

Now push our contract to the local network.

```shell
zos push --deploy-dependencies --network local
```

It's time to create an instance of our contract and the package we linked using the **StandaloneERC20** contract to create an instance of an ERC20 token.

```shell
zos create MyToken

zos create openzeppelin-eth/StandaloneERC20 --init initialize --args JToken,JTKN,18,100,Juliette,[],[] --network local
```

The arguments are as follows: name, symbol, decimal, initial supply, initial holder, minters address, and pausers address. We left the last two empty and put "Juliette" instead of an address for who owns the token. You should see output describing what you've initialized.

The last step is to use the truffle console to connect **MyToken** and **StandalineERC20** together. Open your _zos.dev-<network-id>.json_ file and scroll down to where you see `token-project/MyToken` and `openzeppelin-eth/StandalineERC20`. The addresses listed in those sections are the ones you use in the following commands.

```shell
truffle console --network local

myToken = await Mytoken.at('<MyToken-address>')
> undefined

myToken.initialize('<MyToken-address>')
```

After this command, there should be a lot of output detailing the transaction.

That's it! You've linked to an EVM package and deployed it on your local blockchain with the arguments we submitted above and successfully joined our **StandaloneERC20** token contract with our **MyToken** contract.

## Publishing

We've seen how to deploy, upgrade, and link our smart contracts. Now it's time to learn about publishing. If you've created your own EVM package, you have the option of publishing it to the network for others to use.

**Note**: If you follow the steps in this section of the tutorial you publish your package to the network. If you don't want to do that, use this section as a reference.

Create your project and initialize it:

```shell
mkdir project-name
cd project-name
npm init
zos init project-name
```

Within the _contracts_ folder, we create our contract/package. Once finished we use the `add` command:

```shell
zos add contract-name-here
```

Then we can push our contract to the network. We have to use a real network, not a local network for it to deploy and be available for others to use.

```shell
zos push --network {network-here}
```

Replace {network-here} with the network you are going to publish to.

Next, we edit the _package.json_ file. Add the following to the bottom of the file.

```json
...
"files": [
  "contracts",
  "build",
  "zos.json",
  "zos.*.json"
]
```

Before adding this code, make sure that you change the second last bracket to have a comma after it. Your file should look something like this:

```json
{
  "name": "",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "openzeppelin-eth": "^2.1.3",
    "zos-lib": "^2.1.2"
  },
  "files": [
    "contracts",
    "build",
    "zos.json",
    "zos.*.json"
  ]
}
```

If you have a _zos.dev-"network id".json_ file you can remove it now because it was specific for your local test network.

When you're ready:

```shell
npm login
```

You'll see a prompt to fill in your credentials to create an NPM account such as username, password and email address.
Once you have an account. The last step is to publish your package to npm.

```shell
npm publish
```

If any developers ever want to link to your package, they use the following commands:

```shell
zos link your-project-name
```

That's it! It's easy to publish an EVM package and it's even easier to link to one!

## Vouching

Vouching is useful to ensure the authenticity of a package. Anyone can create an EVM package but not all packages are useful or reliable. Vouching provides a way for the user to measure the quality of code. Right now vouching is in its beta stage and the following [contract](https://github.com/zeppelinos/zos/blob/v2.0.0/packages/vouching/contracts/Vouching.sol) controls it. The ZEP token is an ERC20 token that will be used to vouch in this process. This is the next feature to be released.

## Next Steps

- <https://docs.zeppelinos.org/docs/linking.html>
- <https://docs.zeppelinos.org/docs/vouching.html>