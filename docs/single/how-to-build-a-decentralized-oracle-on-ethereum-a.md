---
title: How to build a Decentralized Oracle on Ethereum — A Step-by-Step Guide
summary: Whether you are a developer, tech enthusiast or enterprise, iExec offers one of the most complete and simple-to-use decentralized oracle solutions. This guide will show you how to start feeding Web 2.0 API data into your Ethereum smart contract in no time. For a general overview of what a decentralized oracle is and why it is needed, have a look at our previous article- Why your Decentralized Application Needs a Decentralized Oracle If earning some RLC while learning about decentralized oracles
authors:
  - Julien Béranger (@julienbrg)
date: 2019-08-01
some_url: 
---

# How to build a Decentralized Oracle on Ethereum — A Step-by-Step Guide


Whether you are a developer, tech enthusiast or enterprise, iExec offers one of the most complete and simple-to-use decentralized oracle solutions. This guide will show you how to start feeding Web 2.0 API data into your Ethereum smart contract in no time. For a general overview of what a decentralized oracle is and why it is needed, have a look at our previous article:

[Why your Decentralized Application Needs a Decentralized Oracle
](https://medium.com/iex-ec/why-your-dapp-needs-a-decentralized-oracle-2f2403f9fd7)

If earning some RLC while learning about decentralized oracles is something that interests you, check out [our developer training reward program](https://medium.com/iex-ec/decentralized-oracles-get-started-earn-rlc-6064aa95a2f9)!

[The Medium version of this tutorial](https://medium.com/iex-ec/how-to-build-a-decentralized-oracle-on-ethereum-a-step-by-step-guide-d8c14719b69f) is also available. 

In the following guide, we are going to see how to fetch the price of any crypto pair (ex: ETH/USD) from an API on the internet and put it back into a smart contract on the Ethereum Blockchain. Such a mechanism is called a price feed oracle and is one of the many use cases enabled by iExec’s decentralized cloud.

All the terminal commands part of this tutorial were run on a macOS machine. If using Linux, you can use almost all the same commands. However, Windows users may need to adapt OS-specific commands and install apps such as Git Bash — but we can not provide full tech support. If you encounter any issues while following the tutorial, our developers we’ll be happy to help or receive feedback on [Slack](http://slack.iex.ec), [Gitter](https://gitter.im/iExecBlockchainComputing/Lobby), or [Telegram](https://t.me/iexec_discussion).


### 0. Pre-Requirements

#### Install OS specific compiling libs

##### On MacOS

Make sure that the [Xcode Command Line Tool](https://stackoverflow.com/a/53078282/10182638) is installed.

##### On Linux

sudo apt-get update
sudo apt-get install python
sudo apt-get install build-essential

##### On Windows 10

Unless you are a Windows power user or Windows addict, and installing Visual Studio to be able to compile c++ doesn’t sound terrifying for you, then you may consider using Windows Subsystem for Linux (to get a linux shell integrated in Windows) or you could just install Virtualbox and launch a Linux VM.

#### Install Docker

##### On MacOS

Go on Docker website, sign up and install Docker Desktop. Once successfully installed, log in Docker Desktop. Ensure that Docker Desktop is up by running in your terminal:

```
docker --version

```

##### On Linux

Go on this [Docker documentation page](https://docs.docker.com/install/linux/docker-ce/ubuntu/) explaining how to install Docker on Ubuntu (all Linux flavors are supported). Ensure Docker is installed by running:

```
docker --version

```

#### Create a repository on DockerHub.

Head over [dockerhub](https://hub.docker.com/), create a repository and name it price-feed.

#### Install NodeJS

The cleanest way to install node on Linux & MacOS is by using the [NVM installer](https://github.com/nvm-sh/nvm). Run the command below to install NodeJS on your system:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash  #works for MacOS & Linux
command -v nvm #should output 'nvm' if installation worked
nvm install node 10.12  # this will install latest stable node version
nvm use node  #make nvm installed node the system's default node
```

Ensure that NodeJS is up by running in your terminal.

```
node --version

```

On Windows, download the NodeJS Windows installer from [their official website](https://nodejs.org/en/).

#### Instal the iExec SDK

The iExec SDK is a node module. To install it, just run:

```
npm -g install iexec

```

Ensure that iExec SDK is correctly installed by running:

```
iexec --version

```

That’s it for the prerequisites, that’s a one shot install. Next part is about setting up your DOracle project (like create and fill your Ethereum wallet).


### 1. Initialize the project

Now let’s initialize our new price-feed oracle project:

![](https://api.kauri.io:443/ipfs/Qma1Djst8y5thvKFvHpZBxiwuomQxBKzrP8Byy7thLNrQw)

```
mkdir price-feed  #new folder
cd price-feed  #enter the folder
iexec init  #init iexec project. If you already have an iExec wallet, run iexec init --skip-wallet to keep using your current wallet

```

The last command will create an Ethereum wallet.

**Important**: choose a password and save it (you will need it after).

![](https://api.kauri.io:443/ipfs/QmT7JKod4t8Zag7kpwRutjLvL4RWqJyZUgioF22f8p5a9a)

Great! Now that you have a wallet (it is saved as a .json file in your machine user folder. ex: ) let’s get some ETH to interact with the Ethereum Blockchain, and some RLC to interact with the iExec’s platform.

Reminder: All commands in this tutorial that interact with the Blockchain will use the Kovan testnet blockchain. It works identically to Ethereum Mainnet, but doesn’t require real money to get started. Perfect for testing!

Let’s ask iExec for some free Kovan RLC:

```
iexec wallet getRLC --chain kovan

```

At this stage, you should see your Wallet displayed in your terminal with a credit of 200 nRLC.

Now to get some free Kovan ETH, you will need to post your Ethereum wallet address in a Gitter group chat. Let’s show our wallet address:

```
iexec wallet show --chain kovan

```

Let’s go over the [Kovan Faucet Gitter](https://gitter.im/kovan-testnet/faucet), sign in to Gitter and copy-paste your wallet address in the discussion.

![](https://api.kauri.io:443/ipfs/QmWQVJvHP7wxvWRi9X58RqEFt6d2w9fRwcfN5nKcXR9vzt)

Paste your wallet address on the chatbox to receive 3.0 Kovan ETH.

Before going further, we need to ensure that our wallet received the ETH and the RLC we asked for. Run this command to check your wallet balance:

```
iexec wallet show --chain kovan

```

Your balance should show you 3.0 ETH and 200 nRLC. If not, wait for a minute.

Now let’s top up our iExec account and move on to the next section:

```
iexec account deposit 200 --chain kovan

```


### 2. Deploy your off-chain application

In order to run the price-feed application on the iExec’s decentralized cloud, we need to go through the following steps:

1. Dockerize the “price-feed” application,
2. Push it on the DockerHub public registry
3. Deploy it on the iExec’s Platform

Ensure that your terminal is in the price-feed folder, and let’s create a new folder named app, containing the off-chain logic:

```
mkdir app 
cd app  # enter the folder
```

Then download the price-feed JS script that implements the price fetching logic (we encourage you to have a look at the JS code):

```
curl -o ./price-feed.js https://raw.githubusercontent.com/iExecBlockchainComputing/iexec-apps/master/PriceFeed/src/oracle.js
```

Now, let’s dockerize our JS application. The first step is to open your IDE (Developer environment), create a file named Dockerfile in the app folder, and paste below content in it:

```
FROM node:11-alpine
COPY price-feed.js /src/price-feed.js
RUN npm i https ethers fs
ENTRYPOINT ["node", "src/price-feed.js"]

```

At this stage, we are ready to build the Docker image and publish it to dockerhub. In your terminal, run these commands:

```
docker build .  #write down your image ID (it appears after the text "successfully built 19acce70289d" <-- that is the image ID)
```

You’ve built a docker image. Now we want to tag this image with our dockerhub username:

```
docker tag <IMAGE_ID> < YOUR_DOCKERHUB_NAME >/price-feed:1.0.0  #ex: docker tag 19acce70289d iexechub/price-feed
```

Finally, we can push our local image to the dockerhub public repository:

```
docker push <YOUR_DOCKERHUB_NAME>/price-feed  #write down your image digest (it appears after sha256:959eb75b13efb41a8f37495784150574d66175adebd0c6c18216b482c574d109 <-- this is your image digest)
Now we are just a few steps from having our application being “iExec’s ready”:
cd ..  #move to upper folder
iexec app init  #tell the SDK that you want to create an app
```

Then, open the newly created “iexec.json” file, and edit these four fields:

- **owner**: “Your_key_wallet”
- **name**: We name it “PriceFeed”.
- **multiaddr**: replace by dockerhub repository name. "registry.hub.docker.com/< YOUR DOCKERHUB NAME >/price-feed:1.0.0".
- **checksum**: given by the command docker push. (add 0x before the sha256:)

Now let’s deploy your price-feed application on iExec, in the terminal:

```
iexec app deploy --chain kovan  #that is a blockchain transaction
```

Congrats! Your Price-Feed App is now deployed on the iExec platform.

![](https://api.kauri.io:443/ipfs/QmbpEfN9nt7Vyh5d7VEQTuj8SpaS3pU8TSMV99jLPqcYio)

Finally, let’s publish sell orders for your application, so iExec platform users are able to use your application at the price you write on the orders:

```
iexec order init --app
iexec order sign --app
iexec order publish --app # publish your apporder on the marketplace and get an orderHash
iexec order show --app [orderHash]
```


### 3. Deploy your on-chain DOracle Smart Contract

Let’s clone the repo on your terminal, enter the smart-contract folder, and install JS dependencies:

```
git clone https://github.com/iExecBlockchainComputing/price-feed-doracle.git smart-contract
cd smart-contract
npm install
```

In order to deploy the smart contract on the Blockchain, you need to tell Truffle your wallet private key. Here is how you can show your wallet’s private key:

```
cd ..  # move to upper folder
iexec wallet show --show-private-key  # copy your private key for next step
```

Now you are ready to deploy. Thanks to truffle, that’s as simple as this:

```
cd smart-contract # move back to the smart-contract folder
MNEMONIC=<YOUR_PRIVATE_KEY> ./node_modules/.bin/truffle migrate --network kovan # Deploy your smart contract to the Blockchain
```

![](https://api.kauri.io:443/ipfs/QmXGPhn8fYCYyi2ctznrCXmpAtPFwhyTvh2Zwtq8F21aHw)

Great, your DOracle smart contract is now deployed on Kovan testnet blockchain. How about feeding it with the ETH/USD price?

### 4. Update your DOracle (as a requester)

Now let’s buy a “price-feed” run on iExec by running these commands on your terminal:

```
cd ..  # move back to parent folder price-feed
```

Let’s show the unique ID (order hash) of the orders we want to buy. One is the workerpool order, and the other one is our price feed app order:

```
iexec orderbook workerpool --category 2 # copy the workerpool order hash
iexec orderbook app <address>  # copy the app order hash
```

Now we want to fill the orders (workerpool + app), that’s as simple as running:

```
iexec order fill --app <APP_ORDER_HASH> --workerpool <WORKERPOOL_ORDER_HASH> --params "RLC BTC 9 2019-07-09T13:27:24.909Z" --chain kovan  # start the DOracle computation!
```

That’s it! we sent to the iExec platform the computation request. To ensure we all talk the same language, you now have a deal, and in that deal, there is one task (that’s a way to enable the coming bag of task feature). Let’s track the progress of the computation by using these commands:

```
iexec deal show <DEAL_ID> --tasks 0 --chain kovan
iexec task show <TASK_ID> --watch --chain kovan
```

You can also head over the [iExec Explorer](https://explorer.iex.ec) to track your tasks. After a few minutes, the status should turn to “completed”.

So what happened so far? We ask a workerpool to run our price-feed application, the workers fetched the ETH/USD price, the result is validated by the PoCo, and as soon as there is consensus, it is stored back into iExec’s smart contracts. Last step consists of calling the function named “_iexecDoracleGetVerifiedResult” on your DOracle smart contract, so it will check the result stored on the iExec’s smart contract, run some filtering logic (ex: is the new price associated with a UTC date more recent than the previous one I pulled), and if all your custom conditions are fulfilled, then it will update itself with the new ETH/USD price! Makes sense?

We will soon update the article with a truffle script to show this last step. If you can’t wait, just try by yourself! Also, we encourage you to try out our price-feed frontend to see what the end-user experience could look like: [https://price-feed-doracle.iex.ec](https://explorer.iex.ec)

That’s it! We hope you realized how easy it is to build a decentralized oracle on iExec.

If you liked it, then you definitely want to learn more about our dev training reward program that makes building DOracle on iExec fun & financially rewarding:

[Decentralized Oracles: Get Started & Earn RLC](https://medium.com/iex-ec/decentralized-oracles-get-started-earn-rlc-6064aa95a2f9)

Bear in mind that the dev team is reachable on [Slack](http://slack.iex.ec), [Gitter](https://gitter.im/iExecBlockchainComputing/Lobby), and [Telegram](https://t.me/iexec_discussion).
