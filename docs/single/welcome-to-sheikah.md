---
title: Welcome To Sheikah
summary: Hi there Witnet community! Welcome to our Witnet technology preview. Today, we are unveiling our first prototype, a preview of early features we will implement into our desktop client, Sheikah. As you may know, up until now smart contracts were completely isolated from the rest of the internet. This is called “the oracle problem.” With Witnet, this won’t be an issue anymore. Witnet is a decentralized oracle network that connects smart contracts to any online data source, such as sports results,
authors:
  - Witnet (@witnet)
date: 2018-11-20
some_url: 
---

# Welcome To Sheikah



----


![](https://cdn-images-1.medium.com/max/2000/1*ed_0fAjVWPKQvkdWuu6DFQ.jpeg)

Hi there Witnet community! Welcome to our Witnet technology preview.
Today, 
**we are unveiling our first prototype, a preview of early features we will implement into our desktop client, Sheikah.**
 
As you may know, up until now smart contracts were completely isolated from the rest of the internet. This is called “the oracle problem.” With Witnet, this won’t be an issue anymore.
 
**Witnet is a** [decentralized oracle network](https://witnet.io/static/witnet-whitepaper.pdf) **that connects smart contracts to any online data source**, such as sports results, stock prices, weather forecasts, other blockchains, or any type of data provided using an API.
The protocol works thanks to a distributed network of nodes — called witnesses — who earn Wit tokens as a reward for retrieving data points and delivering them directly into the smart contracts. This, along with a network reputation protocol helps Witnet ensure more consistent data fidelity and quality for requesters. 
**Our technology will enable smart contracts to do complex, mission critical tasks that rely on external data for execution**.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZBYjc4SaDzw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Sheikah
Sheikah is a lightweight Electron app which will eventually serve as a full interface for the Witnet wallet, data requests, smart contracts, block explorer, and more. While the full Witnet testnet and subsequent main-net are yet-to-come on our development roadmap, 
**we wanted to give our community a good idea of what interacting with the Witnet decentralized oracle network**
 would feel like.
Anyone can use the Sheikah technology preview. Having yarn and git installed are prerequisites for running the client. With those ready, 
**you only have to go to our** [Github repo](https://github.com/witnet/sheikah)
  
**and follow the instructions available at the Readme**. Just a few simple command line prompts and you can be up and going with Sheikah.
> Please note there are several views within Sheikah which are not fully developed and are not yet clickable.


#### 1. Wallet

![](https://cdn-images-1.medium.com/max/2000/1*O2ZPvFKDdJE8HoH54Xesug.png)

Once Sheikah has finished compiling, you will be greeted with a welcome screen prompting you to create your wallet.
To anyone who has used web or desktop wallets before, this will be a familiar process. We use a straightforward wallet creation process which includes generating a 12 word mnemonic seed phrase and password to generate the wallet and encrypt it locally.

The wallet is not connected to a network yet, so we have created an option for you to create a wallet with pre-filled data, as you’ll see in the screenshot. This will give you some pre-filled fields and data points within the wallet screens so that you have a better idea of how the wallet will appear and function once connected to the network.

Of course, security and safety are and will always be an utmost concern of ours, so we encourage the user to practice the safe keeping of their seed phrases and private keys. Like with other truly decentralized wallets and projects, we’ll never store your keys on our end and won’t be able to restore your account or help you do so if you lose access to your credentials.

Once you create and verify your seed phrase and password, you will land in the wallet view of Sheikah. In the transactions tab, you’ll see a list of all transactions, incoming, outgoing, pending as well as any time-locked tokens you may be in possession of.

You can also view your overall balance and addition details about Wit tokens which are vesting over time.

![](https://cdn-images-1.medium.com/max/1600/1*eUkKafhVDQc5b6P6bqJiRw.gif)

With the receive tab section of the wallet, you are able to generate specific addresses within the payment request feature. These payment requests all generate unique public key addresses and store information locally about the type of request you’re making and its funding status.

![](https://cdn-images-1.medium.com/max/2000/1*ChfRKyy0moNfJVyPjNHb_Q.png)

The send view is straightforward and standard as you’d expect. We allow you to label outgoing transactions as well to more easily keep track of them. You will be able to adjust your transaction fees as well from within this view.

#### 2. Data Requests

![](https://cdn-images-1.medium.com/max/2000/1*qsRZc-Ngelkzg2gj4_N91w.png)

In Sheikah, you are also able to create data requests, which means asking the Witnet decentralized oracle network for attestations to specific data points that you need for your smart contract. We will have templates available to users who wish to create standard data requests that have been proven and used by other reputable Witnet users.
When launching a data request, you ask the network for trustless verification of the data point you’re interested in retrieving. This avoids feeding a smart contract data from a centralized provider, with the risks that entails.

![](https://cdn-images-1.medium.com/max/2000/1*jag6YdVsb0VL1qV-GOWYBQ.jpeg)

Our code editor view here gives you an idea of what data requests would look like at their fundamental level. If you have ever written an API GET request, you will recognize our format here.
The attestation logic allows you to verify across a single source or multiple sources. The number of sources being pulled from is entirely up to the users discretion.
Delivery clauses allow you to specify how the data will be consumed. You will be able to send the data to an Ethereum smart contract, POST it to a URL, among many other options.

#### 3. Smart Contracts
Witnet smart contracts are significantly simpler in terms of their capability compared to more popular smart contract platforms. They can receive tokens, and their programs determine the ability to spend those. For example, a group of people can lock tokens into a virtual safe (the smart contract) from which no one can spend until the outcome of some future real world event is known.

![](https://cdn-images-1.medium.com/max/2000/1*OlufkemyNz-Wmy3SZ6PXdg.png)

The smart contract view has a variety of functionalities planned that will enable users to be able to easily build, customize, save and deploy their smart contracts to the Witnet blockchain.

![](https://cdn-images-1.medium.com/max/2000/1*WJN7L1IXfm2yswzbFqAJZg.png)

One way we enable this is through having a “templates” tab, which allows users to select from popular or saved smart contract types such as multi-sig contracts or automatic API data payout contracts.
In addition to this, you will see a GUI which enables intuitive build out of smart contract logic using a drop down interface.

----

### Looking Ahead
We are very excited to share our technical preview with you and we hope you will play with it and give us your feedback. You can stay engaged with our development process by dropping into any of our social channels including Twitter, Telegram or on our Github.
As stated in our public roadmap, we intend to have a 
**testnet ready for public use in Q1 2019**
 and will aim for a 
**main-net launch in late 2019**
 as well.

#### Thank you for dropping by!
Please let us know if you have any questions or comments below. You can 
[follow Witnet on Twitter](http://twitter.com/witnet_io)
 and stay up to date on 
[our blog](http://medium.com/witnet).

----


#### You can also:



 *  [Read the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) 📃

 *  [Read the FAQ](https://witnet.io/#/faq) ❓

 *  [Join the community Telegram group](https://t.me/witnetio) 💬

 *  [Follow @witnet_io on Twitter](https://twitter.com/witnet_io) 🐦

 *  [Discover other Witnet community channels](https://witnet.io/#/contact) 👥
