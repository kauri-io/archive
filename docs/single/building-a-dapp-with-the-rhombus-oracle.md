---
title: Building a dapp with the Rhombus Oracle
summary: Introduction This in depth tutorial is designed to walk you through the process of building your first dapp using a Rhombus oracle. It will guide you step by step on how to incorporate real world data into your smart contracts with the Rhombus Lighthouse Delivery method. You will learn how to interact with existing Lighthouses on Rinkeby in your smart contracts, and how to perform local testing of Lighthouses using Truffle and a local Ganache chain. This tutorial is meant for those with a good u
authors:
  - Jeff Rosen (@jeffrosen)
date: 2019-05-10
some_url: 
---

# Building a dapp with the Rhombus Oracle

![](https://ipfs.infura.io/ipfs/Qmao35NGpXgss8EfuRRsUvwaLmiBccPbUbqLUMst99RsXL)


### Introduction

This in depth tutorial is designed to walk you through the process of building your first dapp using a Rhombus oracle. It will guide you step by step on how to incorporate real world data into your smart contracts with the Rhombus Lighthouse Delivery method. You will learn how to interact with existing Lighthouses on Rinkeby in your smart contracts, and how to perform local testing of Lighthouses using Truffle and a local Ganache chain.

This tutorial is meant for those with a good understanding of Ethereum and smart contracts, dapp development using solidity, and the Truffle framework, but are new to using Rhombus oracles.

**Note** : For those new to Truffle or Ethereum, please read the [Truffle Tutorial](https://truffleframework.com/docs/truffle/testing/testing-your-contracts) before proceeding.

In this tutorial, we cover:

1.  Project setup
2.  Using a lighthouse oracle in the project
3.  Deploying your project
4.  Performing local testing

### The Gambling Game Scenario

Alice wants to start a casino where players can bet Ether on the outcome of a dice roll. Unfortunately, it is hard to generate truly random numbers on the Ethereum blockchain. She has asked you to help integrate an oracle into her project which periodically obtains a random number generated off-chain. You know that Rhombus provides a random number oracle service, and must figure out how to incorporate it into the project.

Alice already has the casino functionality completed, and is waiting on you to provide the random number

### Project Setup

Create a directory where you would like to keep this project, and move inside it with your terminal. Run the truffle command `truffle unbox RhombusNetwork/tutorial`. Truffle should automatically unbox and the project and download it into your folder.

Alternatively, visit the project's [github link](https://github.com/RhombusNetwork/tutorial) and download or clone the project files.

### Using a lighthouse oracle in the project

What you have just downloaded is a skeleton project with pieces missing. This tutorial will give you code and explanations on how you can fill out the missing sections to complete the project

Looking inside the `contracts` folder, you see four files.

-   `Gamble.sol` is the main file for our Betting Game project. This is where we want to read lighthouse data into
-   `Ilighthouse` is a lighthouse interface file. This is must be included in `Gamble.sol` to interact with currently deployed lighthouses. You do not need to modify this file, simply include it in your project
-   `Lighthouse.sol` is the actual lighthouse code. Do not modify this file. It only needs to be included if you are doing local testing of projects using lighthouse oracles with Truffle/Ganache
-   `Migrations.sol` comes with every Truffle project and can be ignored. You do not need to modify this file

`Gamble.sol` already contains the gambling logic Alice has coded. We will fill in the missing sections to provide a random number.

Rhombus provides oracle data through a mechanism called a lighthouse. A lighthouse is an address where a single integer value that contains off-chain data is stored. Rhombus ensures the value is updated periodically, and can provide guarantees that the value is correct.

In this case, there is a random number generator lighthouse already deployed on Rinkeby, and you must access this lighthouse from your casino project smart contract (which will also be deployed on Rinkeby)

To obtain a value from an existing Rhombus lighthouse oracle, see the `Gamble.sol` file in the `contracts` folder.

1.  First, you must include the Lighthouse Interface file `ILighthouse.sol` in the smart contract file where you want to read data into, `Gamble.sol`. Add the following code snippet into section 1.

```javascript
import "../contracts/Ilighthouse.sol";
```

2.  The `Ilighthouse` file contains the interface for a Lighthouse Object. Now you can declare a global `ILighthouse` object in your `Gamble.sol` file. Add this to section 2.

```javascript
ILighthouse  public myLighthouse;
```

3.  Create a constructor for `Gamble.sol`. Pass in an `Ilighthouse` object as a constructor parameter. Add the following code to section 3.

```javascript
constructor(ILighthouse _myLighthouse) public {
    myLighthouse = _myLighthouse;
}
```

What you did here is define the lighthouse that the `Gamble.sol` smart contract will read data from. When you deploy your project to Rinkeby, you will give `Gamble.sol` the address of the random number lighthouse that Rhombus has deployed. This address will be interpreted by the constructor as an `Ilighthouse` object, and set as the global `Ilighthouse` variable `myLighthouse`. Now you can use `myLighthouse` to call lighthouse functions such as reading data. Lets do this now.

4.  Scroll down in `Gamble.sol` and insert the following code in section 4

```javascript
uint winningNumber;
bool ok;
(winningNumber,ok) = myLighthouse.peekData(); // obtain random number from Rhombus Lighthouse
```

Here, your smart contract will go to the address represented by `myLighthouse`, which is the address you passed into the constructor during deployment (and also the address of the random number lighthouse) and call the `peekData()` function at that address. The random number lighthouse will then return a pair of values to you, a bool and an int. The bool `ok` contains whether or not the data is the latest updated value, and the int `winningNumber` contains what you have been after this whole time -- the random number (from 1 to 6) you need in integer format.

### Deploying your project

Now that you've helped Alice complete her gambling project, its time to deploy it and showcase it to the world. Go into the `migrations` folder. You should see two files

-   `1_initial_migrations.js` comes with every truffle project. You can ignore it
-   `2_deploy_project.js` is where you will write the code to deploy the smart contracts you have added to your project, `Gamble.sol`.

Go into `2_deploy_project.js` and add the following code snippet into section 5.

```javascript
if(network == "rinkeby") {

  var address = '0x613D2159db9ca2fBB15670286900aD6c1C79cC9a';   //address of RNG lighthouse on rinkeby
  deployer.deploy(Gamble, address);

} else {    // For local testing

  // First deploy the lighthouse, then use the lighthouse's address to deploy gamble. This allows
  // gamble to know which lighthouse to obtain data from.
  deployer.deploy(Lighthouse).then(function() {
    return deployer.deploy(Gamble, Lighthouse.address);
  });

}
```

Lets focus on the first if statement, which contains code for Rinkeby deployment. Remember how in `Gamble.sol` you created a constructor which had to take an address as an argument (and interpret it as an `Ilighthouse` object)? This is where you pass that address in. We have provided you with the address of the random number lighthouse on Rinkeby, and here you are deploying the `Gamble.sol` file with the address as a parameter.

Next, exit out of the `migrations` folder and go back to the main project directory. Find the `truffle-config.js` file and open it. This file contains information for the blockchain you will be connected to and deploying to. Paste the following code into section 6.

```javascript
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = ""; // Enter the mnemonic for your rinkeby account (testnet deployment only)
module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,     // port 7545 for Ganache GUI version and port 8545 for Ganache-cli
      network_id: "*" // Match any network id

    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/[your infura link here]");
      },
      network_id: 4
    }

  }
};
```

These are the deployment settings you need to get your project onto Rinkeby. The deployment settings for testing with a local Ganache chain is included as well. Note that you will need to have an Infura link and a wallet with Rinkeby ether to deploy the project.

With this all set up, go to your terminal and run `truffle migrate --network rinkeby` to complete deployment. Congratulations, your project is now available for anyone to use!

### What's next?

Now that you have completed this tutorial, you are ready to start using Rhombus lighthouse oracles and creating your own projects! We provide lighthouses that contain all kinds of information that may be useful to you, such as crypto prices, temperature, and random number generators like the one you used today. Check out all our oracles here (insert link)

If you create an amazing project using one of our oracles and would like to share it with us, please do so here (add information, formats, email). Your project may even end up featured on our website and win a bounty prize! (ask jeff)

Additionally, there are a few more things that could help you in your oracle development, listed below

### Performing local testing

Everything is great if your project works, but what if you are running into errors reading data from a lighthouse? It's a pain to deploy your entire project to Rinkeby each time you change your code, and performing tests on Rinkeby is difficult as well. That is why you may want to learn about the local testing feature to save time when you are developing your own projects that use lighthouse oracles. We have integrated lighthouse testing with regular Truffle test suites for a smooth experience. Here's how it works.

In order to test your project in Truffle, you need a lighthouse to read from. But your local Ganache chain cannot communicate with the Rinkeby chain, and your project to be Truffle tested is on Ganache while the lighthouse you want to read from is on Rinkeby.

To fix this, you will have to create a simulated lighthouse on your local Ganache chain and run tests by having your project interact with it.

1.  Ensure you have the `Lighthouse.sol` file inside your contracts folder. You will need this for local testing.

2.  Go into the `migrations` folder and open the `2_deploy_project` file. The code snippet you filled out had one section for Rinkeby deployment, and one section for local deployment (and testing). Observe the `else()` statement, the format is  similar to Rinkeby deployment with a few differences.

Now, you cannot deploy `Gamble.sol` with the random number lighthouse address provided to you as that address does not contain a random number lighthouse on the local chain. You must first deploy a lighthouse locally, and pass that address to `Gamble.sol` as a parameter in order to deploy `Gamble.sol`. This sets the local lighthouse as the address `Gamble.sol` will read from. Later on, you will fill out the lighthouse with a simulated value and read from it.

3.  Open the `test` folder, you should see two files, `TestGamble.sol` and `TestGamble.js`. Just like how Truffle supports test cases in both solidity and javascript, you can run lighthouse tests in both. For this tutorial, we will look at the solidity tests. Open up `TestGamble.sol`.

4.  At the beginning of the file, note that we import `Lighthouse.sol` in addition to the usual files you need for Truffle tests. Additionally, we declare new instances `Lighthouse` and `Gamble`. This is because we must write a value into our sample lighthouse before testing interactions with it, and only the address that deployed a lighthouse is permitted to write values into it for security reasons. Truffle however, uses proxy contracts when running tests, thus making your attempts at writing values into the lighthouse fail because the proxy contracts are not authorized. Basically, you need to redeclare new instances of `Lighthouse` and `Gamble` for your tests to work.

```javascript
// Create new instances of smart contracts to perform tests on.
  Lighthouse newlighthouse = new Lighthouse();
  Gamble newgamble = new Gamble(ILighthouse(address(newlighthouse)));
```

5.  Now lets take a look at how to write test cases with lighthouses. Scroll down and find the `TestWrite()` function. First we write a value into the lighthouse with `newlighthouse.write(dataValue, nonce);` Next, we read from the lighthouse, and check to see if the value we get is correct with an assert statement. If the read or write failed, the value we obtain from `peekData()` would be wrong and we can proceed to debug with error statements that Truffle provides. There are more complicated test cases provided below for you to reference.

With this setup, you can perform Truffle testing as usual, and not have to worry about lighthouse's only being available on Rinkeby.



---

- **Kauri original link:** https://kauri.io/building-a-dapp-with-the-rhombus-oracle/093b82a34e924fedb2fed3c80034aec1/a
- **Kauri original author:** Jeff Rosen (@jeffrosen)
- **Kauri original Publication date:** 2019-05-10
- **Kauri original tags:** rhombus, gaming, dapp, oracles
- **Kauri original hash:** QmUZ4UAFpiHk65wQjZxc5hrymJLzhv5C2TUyvuRsuqjS2a
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



