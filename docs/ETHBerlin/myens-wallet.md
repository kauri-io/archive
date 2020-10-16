---
title: MyENS Wallet
summary: ENS enables human-readable domain names mapped to Ethereum addresses. And the MyENS Wallet app for iPhone lets you bid on and purchase ENS names and manage your ENS domains. Someday, everything will have an ENS address and this helps envision that future. Built with Web3Swift and Infura. - Hugh Lang (ECF) Inspiration I got the idea to build this after I attempted to get my girlfriend to register an ENS domain name. Talk about a nightmare. I realized that the current process is not very user frie
authors:
  - Kauri Team (@kauri)
date: 2018-09-20
some_url: 
---

ENS enables human-readable domain names mapped to Ethereum addresses. And the MyENS Wallet app for iPhone lets you bid on and purchase ENS names and manage your ENS domains. Someday, everything will have an ENS address and this helps envision that future. Built with Web3Swift and Infura. - Hugh Lang (ECF)

![](https://api.beta.kauri.io:443/ipfs/QmQyz81cUaTs4t2rsJwV9pUM1qENrofUfKBcbQ7UKi3qii)
### Inspiration
I got the idea to build this after I attempted to get my girlfriend to register an ENS domain name. Talk about a nightmare.

I realized that the current process is not very user friendly. Not only does one have to be familiar with general web 3 concepts, but the exisiting applications do not make it easy to register and manage names all in one cohesive location.

The main purpose of this application is to abstract all the technical jargon and make it easier for end users to interact with the ENS, similarly to a typical DNS provider like GoDaddy or NameCheap.

### What it does
The app uses a web3 library written in Swift to perform calls to the Ethereum blockchain. It allows the user to send and recieve ether and ERC20 tokens, as well as registering and managing ENS domains all from within the app.

### How I built it
First, I started drawing out sketches with some good old pen and paper. Then after some feedback and iterations, I made wireframes using Adobe XD.

Once I settled on the views and essential features, I began to code it up using Xcode.

### Built with
- Web3Swift
- Infura

### Challenges
Originally, I began to research exisiting web3 libraries written in Swift. After settling on Web3Swift, I started working on the Etherem wallet functionality.

After a full day of getting that to work, I noticed on the most recent WeekInEthereum post that there is a new web3 library with ENS support.

Dang-- too late!

Rather than reverting all of my work for the previous day, I stuck with the currently web3 library, although it is much more difficult to call contract functions.

After the hackathon, I will switch over to the newest web3 library to finish the ENS functions.

### Future work and features
Some features that I'd like to include in the future:

- Contact list: send ether directly to friends using their ENS names
- Reminders for auctions: push notifications for bids and reveals
- Mask the root wallet address with an ENS domain that you own
- Multi-factor authentication
- Trade and sell ENS names directly in the app
- Back up and recover your private key using Keysplit ;)
- Ability to export bids

### Try It Out
[GitHub Repo](https://github.com/barrasso/enswallet)