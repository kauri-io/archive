---
title: Making a URL shortener on Ethereum Blockchain ⛓
summary: The Product How it works The web app deployed at 0x.now.sh , interacts with a smart contract deployed on Ethereum Ropsten testnet . Being on testnet means you can interact with it using free ethers. Get your free ethers here . 0x.now.sh Ethereum Ropsten testnet free ethers here The Process Users make a transaction requesting the blockchain to store a URL string. Since it is a transaction that modifies the state of the blockchain, it needs to have some amount of ethers attached to it so that it c
authors:
  - sauravtom (@sauravtom)
date: 2018-12-04
some_url: 
---

# Making a URL shortener on Ethereum Blockchain ⛓



----

> 

> 

#### The Product

<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>🔗 <a href="https://t.co/Rte4yKrN1q" rel="nofollow">https://t.co/Rte4yKrN1q</a> shutting down is old news. But have you found a replacement? Well, we did! A link shortener that will keep your link stored for a lifetime ... because it's on the blockchain. Check out <a href="http://twitter.com/sauravtom" target="_blank" title="Twitter profile for @sauravtom">@sauravtom</a>'s Ethereum URL shortener at <a href="https://t.co/QhsWph5eOi" rel="nofollow">https://t.co/QhsWph5eOi</a>!</p><p> — <a href="https://twitter.com/makersup/status/1069165144150704130">@makersup</a></p></blockquote>


### How it works

![](https://ipfs.infura.io/ipfs/QmasWnFCo1WTEu58JV8Sv6LhAzfgXGJvWPLu6xy2wdAdWZ)

The web app deployed at 
[0x.now.sh](https://0x.now.sh)
 , interacts with a smart contract deployed on 
[Ethereum Ropsten testnet](https://ropsten.etherscan.io/address/0x4b8241f24537d2539d0b310bc074fd68a782e182)
 . Being on testnet means you can interact with it using free ethers. Get your 
[free ethers here](https://faucet.metamask.io)
 .
> 
0x.now.sh
> 
Ethereum Ropsten testnet
> 
free ethers here

#### The Process



 * Users make a transaction requesting the blockchain to store a URL string.

 * Since it is a transaction that modifies the state of the blockchain, it needs to have some amount of ethers attached to it so that it can be mined to the blockchain by miners.

 * The amount of fee (also called [gas](https://www.cryptocompare.com/coins/guides/what-is-the-gas-in-ethereum/) ) is determined by the Metamask chrome extension and displayed in the prompt box.
> 
gas

 * There is some waiting time for the transaction to be confirmed (5–10sec) depending on how busy the blockchain is.

 * The shortened URL is generated. eg [https://0x.now.sh/s?id=23](https://0x.now.sh/s?id=23) 
> 
https://0x.now.sh/s?id=23

 * When the users clicks on the shortened URL another transaction is made requesting the blockchain which URL string is located at the provided reference (in this case 23)

 * Since this transaction is not changing the state of the blockchain, we do not need to pay any ETH this time, the user is seamlessly redirected to the long URL.

#### The SmartContract 📃

```
pragma solidity ^0.4.24;
```



```
contract e0x {
 event LinkVisited(string url, uint linkId);
 event LinkAdded(uint linkId, string url);
 
 struct LinkTemplate {
  address userAddress;
  string url;
 }
 
 uint lastLinkId;
 mapping (uint => LinkTemplate) public linkMapping;
 
 constructor() public {
  lastLinkId = 0;
 }
 
 
 function createNewLink(string url) public returns (uint) {
     lastLinkId++;
  linkMapping[lastLinkId] = LinkTemplate(msg.sender, url);
  emit LinkAdded(lastLinkId, url);
  return lastLinkId;
 }
 
 modifier linkExists(uint linkId) {
     //link with the given hash does not exist
  if(linkMapping[linkId].userAddress == 0x0000000000000000000000000000000000000000) {
   revert();
  }
  _;
 }
 
 function getLink(uint linkId) linkExists(linkId) public constant
  returns(
   address,
   string
  ) {
      //emit LinkVisited(linkId, link.url);
      LinkTemplate memory link = linkMapping[linkId];
   return(
      link.userAddress,
      link.url
   );
  }
```



```
event LinkAdded(uint linkId, string url);
 
 struct LinkTemplate {
  address userAddress;
  string url;
 }
 
 uint lastLinkId;
 mapping (uint => LinkTemplate) public linkMapping;
 
 constructor() public {
  lastLinkId = 0;
 }
 
 
 function createNewLink(string url) public returns (uint) {
     lastLinkId++;
  linkMapping[lastLinkId] = LinkTemplate(msg.sender, url);
  emit LinkAdded(lastLinkId, url);
  return lastLinkId;
 }
 
 modifier linkExists(uint linkId) {
     //link with the given hash does not exist
  if(linkMapping[linkId].userAddress == 0x0000000000000000000000000000000000000000) {
   revert();
  }
  _;
 }
 
 function getLink(uint linkId) linkExists(linkId) public constant
  returns(
   address,
   string
  ) {
      //emit LinkVisited(link.url,linkId);
      LinkTemplate memory link = linkMapping[linkId];
   return(
       link.userAddress,
       link.url
   );
  }
```



----


### Technical Challenges

#### Making the shortened URLs accessible in all Browsers
This was quite tricky because interacting with blockchain required the browser to be web3 enabled, and have some wallet installed (metamask or similar). Currently web3 and wallet support is only for Chrome and Firefox on Desktop only.
To solve this, I had to create a wallet on the fly as follows

```
provider = ethers.getDefaultProvider('ropsten');
wallet = ethers.Wallet.createRandom();
wallet = wallet.connect(provider);
```


Shout out to 
[ethersJS library](https://github.com/ethers-io/ethers.js/)
 for having support for this.
> 
ethersJS library

#### Counting URL visits
The flexibility for using this one all browsers comes at a cost. Each time user clicks on the shortened URL no change is made to the blockchain state, hence it is not possible to determine how many times each link was clicked.
This issues remains unsolved.
The complete source code for this project is on 
[Github](https://github.com/sauravtom/ethereum-url-shortener)
 .
> 
Github
Pull Requests welcome 😁



---

- **Kauri original title:** Making a URL shortener on Ethereum Blockchain ⛓
- **Kauri original link:** https://kauri.io/making-a-url-shortener-on-ethereum-blockchain/a7ba00394f414496827730f0ce4aeacd/a
- **Kauri original author:** sauravtom (@sauravtom)
- **Kauri original Publication date:** 2018-12-04
- **Kauri original tags:** none
- **Kauri original hash:** QmfD4zffz3QRQAfYx5JKnPEtuVCHCH777MUCuRWidpTs1p
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



