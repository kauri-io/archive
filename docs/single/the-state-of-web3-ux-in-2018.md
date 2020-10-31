---
title: The state of Web3 UX in 2018
summary: One of the biggest frictions with on-boarding users to Web3 is overcoming a lot of the technical issues that are required by design from decentralized networks. From owning your private keys to sending transactions to the blockchain, there is a lot of pointers to consider when companies are designing user-friendly products on Ethereum. In short, the web3 UX can be broken down into three major components, the Dapp, the Wallet and the Blockchain and here is an overview of each component’s experien
authors:
  - Pedro Gomes (@pedrouid)
date: 2018-11-30
some_url: 
---

# The state of Web3 UX in 2018



----


![](https://ipfs.infura.io/ipfs/QmWwkEMR1xEbRQPXizqNn8MT6ETuPeCu61LxR172tPRfRe)

One of the biggest frictions with on-boarding users to Web3 is overcoming a lot of the technical issues that are required by design from decentralized networks. From owning your private keys to sending transactions to the blockchain, there is a lot of pointers to consider when companies are designing user-friendly products on Ethereum. In short, the web3 UX can be broken down into three major components, the Dapp, the Wallet and the Blockchain and here is an overview of each component’s experience for a user today.

### Wallet UX
The state of private key management is still very rudimentary nowadays which involves teaching users to backup their seed phrases (used to generate private keys) on paper for future recovery. Additionally, public addresses are represented by a 40 character hexadecimal hash which is very unappealing for users.  
 Another friction point for users is understanding how private key ownership plays a part with interacting with dapps (decentralized applications). Usually users are accustomed to having a username and password for each app/website which in turn has access to a single account’s data. However Web3 allows users to use the same login or authentication for all dapps and access the same account data between them.

### Dapp UX
The most commonly used user flow for dapps in Ethereum is to require users to install Metamask wallet (a browser extension available on Chrome and Firefox). Metamask injects a web3 script to expose the public addresses (accounts) stored on the browser extension. Metamask seamlessly authenticates as dapps assume its existence and/or require users to install it.  
 After reading data associated to the user’s account on the blockchain, the dapp is able to display and provide customized features/services to the user. The user then can interact with the dapp and requested to sign messages and/or send transactions which are validated on the wallet.  
 Transactions and messages are also represented by long hexadecimal hashes which are very confusing and feel overwhelming to new users that are accustomed to data in more human-readable format.

### Blockchain UX
Blockchain is not only a very hard concept to grasp for users but so is a lot of the protocols that are powering a lot of their favorite apps today. However there are one major friction point that is unique to blockchain infrastructure. Whenever the user is required to submit transactions, it comes at two costs, money and time. These transactions are required when you want to write data, meaning that these result in a state transition on the blockchain that requires verification by the miners. The miners are incentivized to verify blocks by the block reward and the transaction fee paid by the users, additionally the blocks are hard algorithmic problems that take time to solve (making the network secure to corruption) which means from the user perspective that these changes or interactions with the blockchain cost both time and money. On top of that, you can’t pay with “regular” money that users are used to. It has to be paid by Ether which has to be acquired through an exchange or over-the-counter service.

### Friction Points
Thus the major friction points for new users to web3 experience are:



 *  _Wallets_ a) safely storing seed phrasesb) no optional recovery availablec) representing addresses in hexadecimal hashes

 * Dappsa) requiring installing a walletb) instant/invisible authenticationc) shared authentication and data between dapps

 * Blockchaina) transactions cost moneyb) transactions take long timec) transactions can’t be paid with “regular” money

### UX Solutions
There are several teams talking these friction points with several approaches but the Ethereum community is working hard to building standards around them.
Starting from Wallet UX when it comes to private key management/recovery there isn’t a great solution for recovering keys for a normal account which consists of a public and private key pair generated on the user’s device which is represented by a hexadecimal hash as the public address. However if we use a smart contract to act as an account (ERC-725 — Identity Proxy), users could have multiple keys being generated to sign transactions on their account. This removes the requirement to store seed phrases and provides us with more flexibility to develop optional recovery solutions. On top of this wallet providers can submit transactions on the behalf of users using signed messages from private keys authorized by their smart contract account (ERC-1077 — Meta Transactions). This account could then be represented by an ENS domain or subdomain that would resolve to the smart contract’s address providing a more human readable format to authenticate themselves into dapps (ERC-1078 — Universal Logins).
When it comes to Dapps there is a lot more UI/UX thought that needs to go into working around the complexity to be more familiar with already existing solutions. One of the most used forms of authentication is using social media accounts as a pattern to login into an app which uses a protocol called OAuth to provide permissions to apps to access user’s data. This pattern is what could be mirrored by providing choice of wallets to authenticate and then redirect to wallets to provide permissions to the dapp to access user’s data which is accessible by exposing the user’s accounts (ERC-1102). This familiar pattern would ease the user to know that they have given consent to the dapp to access this information and make them more familiar with the idea of the data being accessible between dapps.
There is still a few issues left to solve when it comes to blockchain, these friction points are what provide security and trustless features of the network, despite we were able to solve the transaction costs to be waived or payable through wallet providers, there isn’t much that can be done in terms of reducing the transaction verification time which is tied to the block production. The research for providing scalability to the layer 1 of decentralized networks is on-going but it’s not something that will be soon release.
This is where layer 2 solutions come into play that includes two popular solutions: state channels and plasma chains. These provide small or close to no transaction verification time or more generally referred to as finality. Because they only require two transactions on the blockchain to open and close for state channels or to enter and leave the plasma chain, we can provide much higher velocity for user interactions with a dapp by simply signing messages to create state changes. This also means of course that it has a smaller cost has you can bundle infinite state changes in two transactions on the blockchain while retaining the same security and trustless features of the network. There has been great innovation in the layer 2 scope but it’s still too early to be build standards as new solutions are being shared frequently.

### Conclusion
As the community keeps developing and working together to bring new solutions to the table, it is by fart the standards that are built and coordinated between all teams that really help bring Ethereum and Web3 closer to mainstream adoption. We may not be there yet this year, but there was a lot less synergy and standards being built to improve the user experience in this space. If you are interested in contributing to any of these efforts, feel free to join working groups and rings that are actively working on Identity Proxy or Meta Transactions or Universal Logins or State Channels or Plasma Chains.



---

- **Kauri original title:** The state of Web3 UX in 2018
- **Kauri original link:** https://kauri.io/the-state-of-web3-ux-in-2018/e58bc467b7474a0eb3e1afe4eb9fe634/a
- **Kauri original author:** Pedro Gomes (@pedrouid)
- **Kauri original Publication date:** 2018-11-30
- **Kauri original tags:** none
- **Kauri original hash:** QmdNVysaRr4KzQKik9hAnujgzcU4ub1Yrbc4wz7eeZXh6U
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



