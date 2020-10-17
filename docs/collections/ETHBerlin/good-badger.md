---
title: Good Badger
summary: Good Badger is a system for rewarding people with badges for their unique contributions towards UN’s Sustainable Development Goals (SDGs). Each badge is an NFT ERC-721 token awarded to a person (encoded with the details of their contribution) and displayed in their mobile wallet app. - Hugh Lang (ECF) https-//devpost.com/software/good-badger Inspiration Engage more people to become aware of the SDGs and to make a positive contribution. Allowing their efforts to be known and measured in the form
authors:
  - Kauri Team (@kauri)
date: 2018-09-20
some_url: 
---

# Good Badger

Good Badger is a system for rewarding people with badges for their unique contributions towards UN’s Sustainable Development Goals (SDGs). Each badge is an NFT ERC-721 token awarded to a person (encoded with the details of their contribution) and displayed in their mobile wallet app. - Hugh Lang (ECF)

https://devpost.com/software/good-badger

![](https://api.beta.kauri.io:443/ipfs/QmZhE7PeZHGHxdQgbRh32kKYbjnWLFMx6tHuLnowCNY9F4)

### Inspiration
Engage more people to become aware of the SDGs and to make a positive contribution. Allowing their efforts to be known and measured in the form of a permanently issued badge.

### What it does
It is a wallet and an issuing system where institutions or organisations can create a proof of the contribution or achievement and then give that proof to the person to keep in their wallet. It engages people and organisations who can start to reward people that are contributing towards the Sustainable Development Goals through a verifiable process

### How we built it
We created a react-native application as the wallet and it is displays ERC721 badge tokens. We then built an issuing platform to mint and issue the tokens with a very slick user experience so that even non-crypto seasoned people can use it like a normal app. Tokens are rendered by compiling and SVG image using parts that are chosen by the issuer and in that way they can customise their token.

### Challenges we ran into
Web3 to run on react-native and getting the SVG representations of our badges to work on both mobile and web

### Accomplishments that we're proud of
The very slick user flow that almost hides the technical details away while still ensuring the proofs and security

### What we learned
How to stitch together SVG ao that it works on mobile and web. How ERC721 tokens work.

### What's next for Good Badger
We want to add more customisation options to the badges so issuers can make it "their own" and we want to use Decentralised Identifiers (DIDs) as the identity for the issuers and people rather than an Ethereum Wallet. Add the ability to show off your badges on social media sites.

### Built With

- javascript
- react
- react-native
- solidity
- docker
- svg
- truffle
- open-zeppelin

### Try it out
[GitHub Repo](https://github.com/good-badger)

[docs.google.com](https://docs.google.com/presentation/d/1nYmMxfiAV93oYE74KvXsIhdzEvJu71_Z0HVxOyaonTE/edit?usp=sharing)