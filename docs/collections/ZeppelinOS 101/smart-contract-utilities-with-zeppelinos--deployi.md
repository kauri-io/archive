---
title: Smart Contract Utilities with ZeppelinOS  Deploying to Mainnet
summary: In previous tutorials, we used our local development environment for testing. This tutorial describes how to change your code so that you can deploy to the Etehreum mainnet. The first step is to install the truffle hdwallet provider. The wallet allows you to sign (authenticate) transactions. Note- You must install the wallet in every project.npm install truffle-hdwallet-provider Next use Infura to gain access to a network node, you need to register for an account. Infura allows the user to remot
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-06
some_url: 
---

# Smart Contract Utilities with ZeppelinOS  Deploying to Mainnet

In previous tutorials, we used our local development environment for testing. This tutorial describes how to change your code so that you can deploy to the Etehreum mainnet.

The first step is to install the truffle hdwallet provider. The wallet allows you to sign (authenticate) transactions.

**Note**: You must install the wallet in every project.

```shell
npm install truffle-hdwallet-provider
```

Next use [Infura](https://infura.io/) to gain access to a network node, you need to [register](https://infura.io/register) for an account. Infura allows the user to remotely attach to a node on the network and run their application. Otherwise the user has to run the node on their computer.

Once signed in, create a new project and from the Endpoint drop down select _mainnet_ or one of the test networks depending on where you want to deploy. Write down the project ID because we need it in a couple of steps.

Now we have a node and a wallet but we need an account to join the two together. Install [Metamask](https://metamask.io/), which allows you to create an account where you can store funds, run dApps, and sign transactions. Upon creation of your account you are given a mnemonic, aka secret phrase associated with your account. We will use this mnemonic later.

Now that you have your mnemonic, project ID, and account we can make changes to the configuration file. In the _truffle-config.js_ file add the following:

```javascript
const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");

let secrets;

if (fs.existsSync("secrets.json")) {
  secrets = JSON.parse(fs.readFileSync("secrets.json", "utf8"));
}

module.exports = {
  networks: {
    development: {
      network_id: "*",
      host: "localhost",
      port: 8545
    },
    rinkeby: {
      provider: new HDWalletProvider(
        secrets.mnemonic,
        "https://rinkeby.infura.io/v3/" + secrets.infuraProjectID
      ),
      network_id: "4"
    },
    kovan: {
      provider: new HDWalletProvider(
        secrets.mnemonic,
        "https://kovan.infura.io/v3/" + secrets.infuraProjectID
      ),
      network_id: "42"
    },
    ropsten: {
      provider: new HDWalletProvider(
        secrets.mnemonic,
        "https://ropsten.infura.io/v3/" + secrets.infuraProjectID
      ),
      network_id: "3"
    },
    main: {
      provider: new HDWalletProvider(
        secrets.mnemonic,
        "https://main.infura.io/v3/" + secrets.infuraProjectID
      ),
      network_id: "1"
    }
  }
};
```

You also need to create a _secrets.json_ file within your project folder. Add your mnemonic and Infura and Project ID to it.

```json
{
  "mnemonic": "mnemonic-here",
  "infuraProjectID": "project-id-here"
}
```

Now we can push to the mainnet or test net. If you want to deploy to a test net, replace mainnet with the name of your test net.

```shell
zos push --network mainnet
```

That's it!! Your contract is now published. To apply this to our previous tutorials we change the commands that say `--network local` to `--network mainnet`, as well as follow the steps outlined above.

# Next Steps

- <https://docs.zeppelinos.org/docs/mainnet>