---
title: EVM package deployment with ZeppelinOS - Part II  Deploying and Testing a LinkedList Contract
summary: Testing and publishing In this section, well make sure the contract weve deployed to our local network works by testing directly against it in Truffle Console. Once were happy it works, well publish to the mainnet and create an EVM package for others to access. Testing Now that we have an instance of our contract, were ready to test it directly in Truffle Console.npx truffle console --network local Again, the network argument tells Truffle to work with our local development network as defined in
authors:
  - Dennison Bertram (@dennisonbertram1)
date: 2019-03-07
some_url: 
---

# EVM package deployment with ZeppelinOS - Part II  Deploying and Testing a LinkedList Contract

![](https://ipfs.infura.io/ipfs/QmbwrPpkqvZozPc7EdDPqWW3gfYhWeGwC3F44A7ss5NmQS)


### Testing and publishing

In this section, we'll make sure the contract we've deployed to our
local network works by testing directly against it in Truffle Console.
Once we're happy it works, we'll publish to the mainnet and create an
EVM package for others to access.

#### Testing

Now that we have an instance of our contract, we're ready to test it
directly in Truffle Console.

```shell
npx truffle console --network local
```

Again, the network argument tells Truffle to work with our local
development network as defined in _truffle-config.js_.

Create an instance of your contract object:

```shell
truffle(local)> myLinkedList = await LinkedList.at('{your-contract-address}')
```

The "{your-contract-address}" is the address returned by the `zos create` command but also found in the _zos.dev-{some number here}.json_ file. (This command should return a long output, which
represents our contract object.)

#### Now for the fun!

Let's check the head of LinkedList:

```shell
truffle(local)> myLinkedList.head()'0x0000000000000000000000000000000000000000000000000000000000000000'
```

There is no head yet, so this is the expected output. Let's add a node:

```shell
truffle(local)> myLinkedList.addNode("Hello World!")
```

This should return a transaction object and logs. It's working! (Notice
the transactions on the window where Ganache is running.)

Let's check the head of the list again:

```shell
truffle(local)> myLinkedList.head()
'0xc08d91feb0d1e3c5808af107ca712c167f4998c4eac93670bc98cd627bf2c6d0'
//the above long string is sample output, you will see something different
```

This should return a `bytes32` value as a string that represents the
location of the "head" node stored in the LinkedList contract instance.
Now try to return the value stored at this "head" node.

```shell
truffle(local)> myLinkedList.nodes('0xc08d91feb0d1e3c5808af107ca712c167f4998c4eac93670bc98cd627bf2c6d0')
[ '0x0000000000000000000000000000000000000000000000000000000000000000', Â 'Hello World!' ]
```

This should return the struct of our node, as expected. Note that the
struct is returned in an array format. The first value is the value of
the "next" node, and the second value is the data value of the "this"
node.

Finally, try "popping" the head off the list, and call `head()` again to
check if your list is empty again.

```shell
truffle(local)> myLinkedList.popHead()
//This returns and prints a transaction

truffle(local)> myLinkedList.head()
'0x0000000000000000000000000000000000000000000000000000000000000000'
```

It works!

Of course, in the real world, during development you would want to build
unit tests, not just manually test on the console. But for now, this is
a good way to interact with your contract directly.

#### Publishing our contract

Great! So now that you have a contract, deployed it on your development
network, created an instance of it, and tested it directly with Truffle
Console, what's next? Publishing!

Publishing your project takes the code you've written, packages it up,
and publishes it to the network of your choosing where others can easily
reuse it. In the same way that we created an instance of our contract,
others can similarly create instances of your contract independently and
reuse the code for their own projects.

First, before publishing to a public network, let's try publishing to
your local development blockchain.

Open a new terminal window, navigate to your project directory, and type
the following:

```shell
zos publish --network local
```

In your _zos.dev-{some number here}.json_ file, you will see
that you now have a `app`, `package` and `provider` fields with
addresses pointing to their respective contracts.

### The big time

Great! You've just published, but only to your local blockchain
network, not to NPM, and not to the main Ethereum network. This means
that so far, it's not useful, as no one can find it. What we need
to do now is to publish to a real public network and then to NPM!

#### Get a mnemonic (and ether!)

To get started, you're going to need a new mnemonic to connect to a
public blockchain. **REMEMBER THIS IS NOT YOUR DEVELOPMENT MNEMONIC FROM GANACHE.** If you use that, you will probably lose all your money.

There are a number of different ways to get a mnemonic: some are more
secure than others, and some are easier than others. For this tutorial,
we'll use a simple and secure method: [MetaMask](https://metamask.io/),
a browser plugin for Chrome, Firefox, Opera, and Brave. Another option
would be to use [MyEtherWallet](https://www.myetherwallet.com/).

During the MetaMask installation and setup process, you will be told at
a certain point to save your mnemonic, a 12-word "secret phrase" that
can be used to regenerate your entire wallet at any time in the future.
This is the mnemonic you will need. **COPY IT DOWN TO A SAFE PLACE**, as
you will need to copy it into your code. This is a good time to also
fund your account with a small amount of ETH or test ETH. In the case of
a test network such as Rinkeby, get test ETH from a
[faucet](https://faucet.rinkeby.io/).

Once MetaMask is installed and you've copied your mnemonic, you will
need to create an account (and address) with MetaMask that you'll use as
your "deployment address" as per the transparent proxy issue mentioned
earlier. This can be the default account that MetaMask creates, or you
can generate a new account to use specifically for deployment. Once you
have this, you should load the account with some ETH for deployment.

#### A note on safety

As a personal preference, I tend to generate mnemonics and fund them
with only enough ETH to complete whatever deployment or development task
I'm working on. When I finish, I send whatever remains back to my
personal account. It can be very easy to accidentally commit secret data
to public GitHub accounts. Enterprising individuals have created scripts
that specifically scan Git repos for mistakenly hardcoded private keys
and mnemonics to steal users' funds. By limiting the amount of money you
put on your address, you can limit your losses in the event your code
(and mnemonic) ever inadvertently become public. Similarly, if you do
use MetaMask to generate your mnemonic, be sure to reset it to a new
account when you're done with development. **Do not forget and mistakenly go forward using the MetaMask account you created for development as your main wallet.**

#### Setup

If you open your _truffle-config.js_ file, you will see that there is
only your development blockchain under "local." You will need to add the
network you wish to deploy to. (For more information about this, check
out "[Deploying to mainnet](https://docs.zeppelinos.org/docs/mainnet).")

Return to your code editor, open up _truffle-config.js_, and edit it
to look like this:

```javascript
"use strict";
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic =
  "Your Twelve Word Mnemonic";ï»¿

module.exports = {
  networks: {
    local: {
      host: "localhost",
      port: 9545,
      gas: 5000000,
      gasPrice: 5e9,
      network_id: "*"
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://mainnet.infura.io/v3/<<Your Infura API token",
        );
      },
      gas: 200000000,
      network_id: 1
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/<<Your INFURA API TOKEN>>"
        );
      },
      gas: 5000000,
      gasPrice: 5e9,
      network_id: 3
    }
  }
};
```

Notice that I'm including both the Ethereum mainnet and the Rinkeby
test-net for convenience. Feel free to use either.

You will need to install [HDWalletProvider](https://www.npmjs.com/package/truffle-hdwallet-provider) for this to work.

```shell
npm install truffle-hdwallet-provider
```

HDWalletProvider gives you a JavaScript object that will behave like an
Ethereum wallet connected to a network. It acts as a web3 provider, but
it intercepts your transactions to sign them locally with the key
derived from the mnemonic you entered. This way, you don't need to have
your keys on your node and can just send the transaction to a public
node. In this case, you will use Infura, a free service that acts as a
gateway to the main Ethereum network. You will need an API token to
connect, and can get that [here](https://infura.io/) by signing up.

Once you've signed up at Infura, found your token (you'll need to create
a project and then copy-paste the endpoint), and deposited some ETH in
your wallet, you now need to **push** your project to the mainnet before
publishing. Use the address of the MetaMask account you created earlier
as your **from** address:

```shell
zos push --network mainnet --from <<your from address>>
```

Now you can now proceed to publish.

```shell
zos publish --network mainnet --from <<your from address>>
```

#### A note on gas and deployment troubleshooting

##### Gas prices

Typically, gas prices for executing or deploying contracts on public
networks can vary wildly at times, and figuring out the accurate cost of
deployment can sometimes be a guessing game. As of ZeppelinOS 2.1.0, gas
prices are automatically retrieved by ZeppelinOS from [ETH Gas Station](https://ethgasstation.info/).

##### Deployment troubleshooting

Depending on the state of the network you're deploying to, deployment
can sometimes fail, but don't be discouraged. Most of the time it will
be a question of gas price, the size of your contracts to deploy, and
the address you're deploying from (check the HDWallet provider documents
closely).

One problem you can potentially run into is the following error
message:

```shell
Error: Contract transaction couldn't be found after 50 blocks
```

To help get around this, you'll want to check out the
[options](https://docs.zeppelinos.org/docs/cli_publish.html) for the `zos publish` command and use the `--timeout flag`. The default timeout for
each blockchain transaction is 600 seconds, but in some cases, you might
need more. You can also try to raise your gas price to get picked up
faster by miners. Expect a moderate amount of trial and error to get
your settings right.

```shell
zos publish .... --timeout 6000 //just an example
```

Once you get your deployment to a public network such as the mainnet to
succeed, you will find that a new file has been created for you:
_zos.mainnet.json_ (or _zos.{networkname}.json_). This file
keeps track of your project contracts deployed on that particular
network.

Once you've been able to publish to the mainnet (or other public
networks), you should see something similar to this:

```shell
Publishing project to mainnet…
Deploying new App…
Deployed App at 0x2f759.......
Deploying new Package…
Deployed Package 0x706........
Adding new version…
Deploying new ImplementationDirectory…
Deployed ImplementationDirectory at 0x9ded..........
Updated zos.mainnet.json
```

Whew! You did it! Congratulations are in order! If you want to see under
the hood, have a look at your _zos.mainnet.json_ file to see where
everything is!

### NPM

You have now deployed your EVM package to the mainnet, where anyone can
access it. The final step is to add your EVM package to the NPM
repository so others can find your package and install your code
via `npm install`.

At this point, if you haven't done so already, you will need to [sign up for an NPM account](https://www.npmjs.com/signup).

Your NPM package should include the source code and compiled contracts
as well as the ZeppelinOS configuration files. To do this, we'll need to
add a top-level field to our _package.json_:

```json
{
  …
  "files": [
    "build",
    "contracts",
    "test",
    "zos.json",
    "zos.*.json"
  ]
}
```

Your _package.json_ will look similar to this (customized for your
project, of course):

```json
{
  "name": "linkedlist",
  "version": "0.0.1",
  "description": "On chain Solidity linked list",
  "main": "index.js",
  "scripts": {
    "test": "echo 'Error: no test specified' && exit 1;"
  },
  "keywords": ["Solidity", "ethereum", "linked", "list"],
  "author": "Dennison Bertram",
  "license": "MIT",
  "dependencies": {
    "truffle-hdwallet-provider": "0.0.6",
    "zos-lib": "2.0.1"
  },
  "files": ["build", "contracts", "test", "zos.json", "zos.*.json"]
}
```

The ZeppelinOS configuration files keep track of your contracts and the
addresses where you have published them. This way, when someone installs
your NPM package, ZeppelinOS already knows where the on-chain code is
deployed and can link their project to your on-chain code. (This link
does not affect your contract in any way; it just allows others to reuse
your code via the ZeppelinOS system. They will still need to deploy
their own instance of the code via the proxy system.)

Now we just need to clean a few things up before we publish to NPM.

Double-check the rest of your _package.json_ fields to be sure they
describe your package correctly. Feel free to remove the "main" field,
if it is present, because for pure EVM packages, it doesn't serve a
purpose. At this point, you can also delete your _zos.dev-{some number here}.json_ file, as it describes your particular local test
environment that others won't have access to.

Once you're ready, do as follows:

```shell
npm login
```

And then publish:

```shell
npm publish
```

That's it! You've published your first EVM package! Others can link to
your package via the following

```shell
zos link <<your-project-name>>
```

You should check to see if there isn't by chance already a package with
the same name as your package. If there is, go back to your
_package.json_ file and change the "name" field to something else.
Whatever name you decide to use, remember it, as that is the name people
will need to use when they later type it:

```shell
npm install <<your-project-name>>
```

_Thanks to [Santiago Palladino](https://twitter.com/smpalladino) for
reading early drafts and providing feedback._



---

- **Kauri original link:** https://kauri.io/evm-package-deployment-with-zeppelinos-part-ii:-d/077f5e1d62e147089f21f709f77d8ccb/a
- **Kauri original author:** Dennison Bertram (@dennisonbertram1)
- **Kauri original Publication date:** 2019-03-07
- **Kauri original tags:** zeppelinos
- **Kauri original hash:** QmNoTdvcTK3Cv43y8nFCzwzjcCaftGPa5bFY6jXfZAJJSi
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



