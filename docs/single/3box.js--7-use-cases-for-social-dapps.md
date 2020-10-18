---
title: 3Box.js  7 Use Cases for Social Dapps
summary: User profiles, onboarding, distributed data storage, encryption, and data sharing are just a few of the ways 3Box powers next-generation social dapps. This post provides an overview of 3Box.js and the use cases it enables. Most decentralized applications are social. Decentralized applications are designed around the premise that users in a trustless context can interact peer-to-peer. The trust needed to support this type of interaction is established primarily in two ways- the context of the int
authors:
  - Danny Zuckerman (@dazuck)
date: 2018-12-14
some_url: 
---

# 3Box.js  7 Use Cases for Social Dapps



![](https://api.beta.kauri.io:443/ipfs/QmPzN12erYvZtDadCD5ZFyDqeCyfc7qbP246BnP1s56TNG)

 
_User profiles, onboarding, distributed data storage, encryption, and data sharing are just a few of the ways_
  
[3Box](https://3box.io)
  
_powers next-generation social dapps. This post provides an overview of_
  
[3Box.js](https://github.com/3box/3box-js)
  
_and the use cases it enables._
 

### Most decentralized applications are social.
Decentralized applications are designed around the premise that users in a trustless context can interact peer-to-peer. The trust needed to support this type of interaction is established primarily in two ways: the 
**context of the interaction**
 and the 
**reputation of the participants**
 .
In closed networks, platform operators set the context and enforce user reputation, which makes it easy for users to trust other users. In open networks however, the need for social context is even greater since we can infer very little about other users just by their presence on the network.

### Social applications require and generate lots of user data.
Social applications 
_require_
 user data such as reputation, connections, and matches to create social context for users. Common features of social applications are that they allow users to learn more about the people they’re interacting with, find their friends, and create meaningful relationships — all forms of social context. As users are able to gather more information about their peers, they become more likely to trust and use the application. In this case, 
**familiarity leads to adoption and usage.**
 
Social applications also 
_generate_
 large amounts of contextual data as a result of being social. Once users are able to establish relationships and identify each other, they begin to interact more frequently. This produces more and more data on the application, often referred to as user-generated content — like this post, your claps, or comment threads. As users establish more connections and community on these platforms, they generate more content, and as a result, more social context.

### Where do we manage social user data in web3?
In web2, closed networks operate exclusive servers that store and analyze data produced by users of the network. This centralization of storage and compute makes it very efficient to scale the network, however web2 data servers silo users’ information within each network and strip the user of any ownership and benefit from their data. This closed model makes things like giving users control over their data, and sharing user data between applications, very difficult.
> Web3 promises to improve this model by giving users control over their data, yet there are currently no viable production-ready solutions to storing data within the user’s control.

Many developers are storing user data on IPFS and publishing the hash on the blockchain, or storing it on a central server managed by the dapp. Both of these options are poor choices: blockchain storage is expensive, immutable, and provides a limited interface with poor user experience; while centralized storage is web2 all over again and makes it difficult or impossible to build data sharing partnerships.
> The fundamental gap to building distributed social applications is a user-centric data storage solution that allows users to generate and manage their social context.

Developers need a place where they can store data with the user, but where their application and other applications can still easily access it when desired. This place should not be on the blockchain, but elsewhere on the distributed web. 
**3Box provides an**
  
[API for user-centric distributed data storage](https://github.com/3box/3box)
  
**.**
 

### 3Box.JS: A Web3 API for Social User Profiles
3Box is a distributed database for Ethereum accounts that allows users to easily store and share public and encrypted information without needing to store any information on the blockchain. The 
[3box.io](http://3box.io)
 application allows Ethereum users to create a social profile, which they can use to collect data, log into Ethereum applications, and build connections.
 
`3box-js`
 is a JavaScript API that allows applications to integrate with 3Box, allowing them to onboard users and set/get data into 3Box profiles.
By taking steps to make social context more available to people using Ethereum applications, we can make our users feel more at home on web3. 
**Once we begin replacing hex identifiers with human-readable profiles consisting of names and images, we can generate social context and welcome a mainstream audience to Web3.**
 
 
_The remainder of this post describes some of the ways that your application can use the 3Box.js library. For more detailed documentation you can always explore our Github repo._
 

### 7 Ways to Use 3Box.js in Your Dapp

#### 👩‍🚀 1. Public User Profiles
Wouldn’t it be great if we could replace hex addresses with social user profiles in our dapps? 3Box is a system for social user profiles, and we make it easy to discover other users.
The 
`getProfile`
 method allows you to 
_get_
 the public profile for one or more ethereum accounts at any time. This allows you to replace hex addresses with user names and images throughout your application, which provides users with a huge amount of social context. 
`getProfile`
 is also useful for onboarding new users, which we will describe in more detail in #3.
The 
`box.public.set()`
 and 
`box.public.get()`
 methods allow you to 
_set_
 and 
_get_
 data in the public profile. For example, you might store community or group affiliations in the public profile.

#### 🔐 2. Private Encrypted Storage
3Box provides encryption to Ethereum users. This powerful functionality enables users and apps to store and exchange private information. This information will only ever be able to be read by those approved by the user. Encryption is not not currently supported by standard Ethereum wallets, but we can enable it which brings on a whole new set of Ethereum use cases.
The 
`box.private.set()`
 and 
`box.private.get()`
 methods allow you to 
_set_
 and 
_get_
 private encrypted data in 3Box. For example, you might store a private image in the user’s private profile.

#### 👋 3. User Onboarding
As an outcome of having #1 and #2 above, apps can easily onboard new users to their dapp by calling 
`getProfile`
 , 
`box.public.get()`
 , and 
`box.private.get()`
 for public and private information. One nice thing about this system is that users can share all of their information with an application that requests it with one click, making filling out forms and sharing information a simplified experience.

#### ✅ 4. Decentralized Messaging or Public Key Infrastructure (PKI)
Applications can store public user communication keys and other verifiable information in 3Box and other users and applications can verify messages or claims against the user’s 3Box profile. This allows 3Box to act as a user’s very own decentralized public key infrastructure, making it trivial to implement encrypted messaging systems or verifiable identity credentials using 3Box.

#### 📁 5. Distributed User Content Storage and Management
You might also think about using 3Box as a generalized way to store and keep track of user generated content without needing to store the content hashes on the blockchain; these hashes would instead be kept with the user in either the public or private profile. These bits of content can represent everything from tweets and peeps, to videos and likes. All you need is the hash of an IPFS object and you can store it in 3Box: be creative!

#### 🎁 6. Sharing Data Between Apps
One of the benefits of storing data with the user ( free of silos) is that the data becomes more portable and interoperable wherever the user goes. This data can be shared with anyone or any application that calls 
`getProfile`
 , 
`box.public.get()`
 , or 
`box.private.get()`
 .

#### ⭐ 7. Shared Reputation Systems
One of the most obvious use cases for sharing data between applications is building shared reputation systems. We are certain that these will emerge as the decentralized application ecosystem matures and we need better and more sophisticated ways to provide context to our users. 3Box is the obvious place to store most of this data in an off-chain, distributed manner, with the user.

### Summary
We believe these features will make it easy to build the next generation of more social apps on Ethereum, and contribute to making web3 a more safe and familiar place for our users and communities.
This is only the starting point to what can be built using 
`3box-js`
 , and we hope this list excites your imagination! We invite you to 
[join our discord](https://discord.gg/bevMe7w)
 and share your ideas.
For more technical information on 3Box.js, visit our Github at 
[github.com/3box/3box-js](https://github.com/3box/3box-js)
 , or read one of our 
[previous posts](https://medium.com/3box)
 .
 
_3Box provides social infrastructure for web3. Integrate 3Box.js to instantly make your dapp more scalable, social, and human. Visit our site at_
  
[3box.io](https://3box.io)
  
_to create your profile, or our Github at_
  
[github.com/3box/3box](https://github.com/3box/3box)
  
_to dig into the code. Join our_
  
[discord](https://discord.gg/VrrMqfy)
  
_to chat and say hi!_
 

![](https://api.beta.kauri.io:443/ipfs/QmNMSqWAKfHKJbiG7PW4hRArhJobPFFsFbixa1C5w6bHB6)

