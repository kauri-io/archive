---
title: 3Box Builders Series  How to Integrate with Profiles
summary: _The Builders Series is a collection of blog posts aimed at helping developers easily build better distributed apps using the 3Box _suite of APIs _. This article is the first in the series, and contains everything you need to start adding profiles to your app today. For more information on Profiles, view our _Github documentation . 3Box Profiles Overview Why profiles? 3Box Profiles are a quick and easy way to make your decentralized application more social, useable, and interactive with basic so
authors:
  - Danny Zuckerman (@dazuck)
date: 2019-05-04
some_url: 
---

# 3Box Builders Series  How to Integrate with Profiles


![](https://api.kauri.io:443/ipfs/QmVRP9wYpyZg52iYMDaFeJx8wdJ7rnUaaCi7WWnZLJGFjj)

 
_The Builders Series is a collection of blog posts aimed at helping developers easily build better distributed apps using the 3Box _[suite of APIs](https://github.com/3box/3box-js/blob/develop/README.md)
  
_. This article is the first in the series, and contains everything you need to start adding profiles to your app today. For more information on Profiles, view our _[Github documentation](https://github.com/3box/3box-js)
  
_._
 

## 3Box Profiles Overview

### Why profiles?
 
[3Box Profiles](https://github.com/3box/3box-js#profiles-api)
 are a quick and easy way to make your decentralized application more social, useable, and interactive with basic social identity that works natively with Ethereum. We provide the infrastructure that makes it easy for distributed application developers to replace user hex addresses with human-readable names, images, descriptions, and other social metadata in their application’s UI.

### Why 3Box?
 
[3Box](https://github.com/3box/3box)
 is a distributed data storage and identity network built on IPFS and OrbitDB, where users are always in control of their information. By storing data on 3Box, developers don’t need to operate a centralized backend service to store and manage all of this user information, nor do they need to store it on the blockchain where it’s expensive and exists forever. Rather, 3Box data lives directly with users and is available to be shared across various application front-ends.

### Summary of Benefits



 * Humanize your application by replacing hex addresses with user profiles

 * Support for both public and encrypted profile data

 * Support for both general and application-specific profiles

 * Generate network effects by sharing profiles across applications

 * Store data with users on IPFS, not on a backend or the blockchain

 * Native support for Ethereum accounts

### Example Integrations
Experience 3Box profiles at any of our partner applications: 
[3Box Hub](https://3box.io)
 , 
[EthStats](https://ethstats.io)
 , 
[NiftyFootball](https://niftyfootball.cards)
 ( 
_coming soon_
 ), 
[Aragon](https://mainnet.aragon.org/#/)
 ( 
_coming soon_
 ), 
[Livepeer](https://explorer.livepeer.org)
 ( 
_coming soon_
 ), 
[Giveth](https://beta.giveth.io/)
 ( 
_coming soon_
 ), 
[MolochDAO](https://molochdao.com/)
 ( 
_coming soon_
 ), 
[MetaMask](https://metamask.io)
 ( 
_coming soon_
 )

### User Experience Demo
Below is a video demonstration of how profiles could integrate natively into an application, in this case — the Livepeer Explorer app. This example is for demonstration purposes only and does not reflect an actual live Livepeer integration. Thanks to 
[Jake Brukhman](https://medium.com/@jbrukh)
 for letting me use him and 
[CoinFund](https://medium.com/@coinfund_io)
 as example profiles. 🙏

<iframe allowfullscreen="" frameborder="0" height="300" scrolling="no" src="https://www.youtube.com/embed/k9tayKOowVE" width="512"></iframe>

We will reference this Livepeer example for user and application flows, as well as code examples for the remainder of this tutorial.

## Get Started Developing with Profiles
Follow these steps to get profiles running smoothly in your app:



 * Install [3Box.js](https://github.com/3box/3box-js) in your project

 * Configure the user’s profile, usually on their account page

 * Display the user’s profile, throughout your application UI

## 📁 Install 3Box.js in your Project
 
[3Box](https://github.com/3box/3box)
 provides a JavaScript client library that allows browser-based web applications to interact with the 3Box data network without requiring the user to install any software. 
[3Box.js](https://github.com/3box/3box-js)
 provides the functionality required to perform all of the profile functions below. Let’s get started building!
To get started, install 3Box.js in your project:

```
$ npm install 3box
```



## ⚙️ Configure User Profiles
This section describes the application logic and code that should be implemented on the 
**account or profile page**
 of your application.

### 1. Detect and display default user profile information.
When the user arrives at their profile page, your app should check whether or not they have previously configured their profile for your app. This is indicated by the presence of a 
`defaultProfile`
 setting saved in your app's space. The 
`defaultProfile`
 key functions as a pointer to where profile information for your application should be fetched.
This code snippet checks for the 
`defaultProfile`
 setting, stored in your app's space:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/oed/09723b0d6245d1fd26b8b7034334dea5.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
const livepeerProfile = await Box.getSpace(
<eth-address>
 , 'livepeer')
console.log(livepeerProfile.defaultProfile)
</eth-address>
```


 
`defaultProfile`
 can be either 
`'3box'`
 , 
`'livepeer'`
 (i.e. your app’s space), or 
`undefined`
 . Depending on the value, your app should do 1 of 3 things:



 * If `livepeerProfile.defaultProfile` has the value `'livepeer'` , display the `livepeerProfile` information (name, image, URL) in the user’s profile fields. _Skip steps 3 and 4 below._ 

 * If `livepeerProfile.defaultProfile` has the value `'3box'` , call `Box.getProfile(<eth-address>)` and display the returned profile information (name, image, URL) in the user’s profile fields. _Skip steps 3 and 4 below._ 

 * If no value is returned, the user has never configured their profile for your app before. Display a blank profile. _Complete all steps below._ 

### 2. Ask permission to update their profile.
Regardless of the user’s 
`defaultProfile`
 setting, since they came to their profile page they likely want to create or update their profile, which requires saving data to 3Box. To allow your application to update a user’s 3Box, you will need to ask for the user’s consent then you will need to sync their data.
Consent is given by the user signing two consent messages with their web3 wallet: one to access their 3Box and one to access your space. This approval process only needs to be executed once and then it is automatically stored in browser localStorage, so users will only need to sign messages the first time they open their profile page on a new browser.
Once the user approves these signature requests in their web3 wallet, their browser can fetch and sync data from the 3Box network. The syncing process must be completed before you can update the user’s 3Box. During this time, you may choose to display a small loading indicator, or block users from making updates to their 3Box profile.
This code snippet allows your app to request consent from the user, then sync their data:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/oed/929f4a38f129e60e469a001a5db8eb55.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
const box = await Box.openBox(
<eth-address>
 )
const boxSyncPromise = new Promise((resolve, reject) =&gt; box.onSyncDone(resolve))
let livepeerSpace
const spaceSyncPromise = new Promise((resolve, reject) =&gt; {
  livepeerSpace = await box.openSpace('livepeer', { onSyncDone: resolve })
})
await boxSyncPromise
await spaceSyncPromise
</eth-address>
```


 
_**Note: Steps 3–4 below are only relevant for new users who have no existing defaultProfile setting for your app. At this point, all other users with preconfigured profiles should be able to use and update their profile with no problems._
 

### 3. Configure default profile, if not done previously.

![](https://api.kauri.io:443/ipfs/QmZEv5vhUz5gVsKSf3ngfX1p5Mp3WTFojt5JWW8wGhktoa)

Since the user has not previously set up or configured their profile for your app, they should see a blank profile, but you should offer them the option to set one up. After the user clicks “Set up my profile”, you should determine which options to present to the user for setting a default profile in your application: 1) using their existing 3Box profile (if one exists); or 2) setting up a new profile for your application.
 
**Check if existing 3Box profile is present:**
 Call 
`Box.getProfile(<eth-addr>)`
 to check if a user has previously saved profile information (name, image, URL, email) to their general 3Box profile. If they have, display their basic profile info (such as 
`name`
 and 
`image`
 ) in something like a modal, and present the user with the option to use it, or to create a new profile for your app.
If the user doesn’t have a pre-existing 3Box profile, you don’t need to provide them with this option, and you can instead just save your app as 
`defaultProfile`
 (option 2 in the code block below), and proceed to Step 4b.

![](https://api.kauri.io:443/ipfs/Qme6W2NiJKL3sPjxvPUC5LZoVac8NwsxBHyVto8NjBhvxP)

This code snippet describes the data that should be saved to your app’s space, as a result of the user’s selection above:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/oed/21de1471e1407bf44ad3627d7365d1e9.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
// Option 1: Set public space data, if 3Box is chosen as default

livepeerSpace.public.set('defaultProfile', '3box')

// OR

// Option 2: Set public space data, if your app is chosen as default

livepeerSpace.public.set('defaultProfile', 'livepeer')

```



### 4a. Display profile information, if 3Box is chosen as default.
 
**Display profile with 3Box as default:**
 If the user opts to use their 3Box profile for your app, you should display their 3Box profile information (name, image, URL) on screen using: 
`Box.getProfile(<eth-addres>)`
 .

![](https://api.kauri.io:443/ipfs/QmW5oc97SP6AB2j4KNuMvjQ99hV4mNAp3jkXRKWR6aATK5)

 
**Edit profile with 3Box as default:**
 If your user has chosen 3Box as default and wishes to edit their profile, it’s advisable to send them to 
[3box.io](http://3box.io)
 to make the updates — since these changes will be reflected across every other application accessed with 3Box, and it might be hard or confusing to communicate that from within your app.

![](https://api.kauri.io:443/ipfs/QmYmvDpPjp3YCScnFzTxXHQff8cCkYnryJhsmYu25aC8WX)


### 4b. Display profile information, if your app is chosen as default.
 
**Save new app profile data**
 : If users opt for creating a new profile in your app, then you should provide them with an interface to enter their new profile information.

![](https://api.kauri.io:443/ipfs/QmUrsS7nCHitHoMaSx77a1sP2WEHFi93bpyisoZjqkR1xY)

When the user clicks “SAVE”, write this information to their 3Box, in your app’s space:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/oed/ffa8d514524954a5fb49377dfaee38f4.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
// Set the public app profile data
livepeerSpace.public.set('defaultProfile', 'livepeer')
livepeerSpace.public.set('name', 'yourname')
const imageObject = [{
  "@type":"ImageObject",
  "contentUrl": "
<https: ipfs="" ipfs.infura.io="">
</https:>
<ipfs-hash-of-image>
 ",
  "cid": {"/":"
 <ipfs-hash-of-image>
  "}
}]
livepeerSpace.public.set('image', imageObject)
livepeerSpace.public.set('url', '
  <https: yoursite.com="">
   ')


// Set the private app profile data
livepeerSpace.private.set('email', 'youremail@gmail.com')
  </https:>
 </ipfs-hash-of-image>
</ipfs-hash-of-image>
```


 
**Display app profile:**
 When they’re done creating their profile, it should look something like this.

![](https://api.kauri.io:443/ipfs/Qmaxike5BZq2yhrCDhMNrZRmm4QZgpqo4kwADJojVHTNWn)

 
**Edit app profile:**
 In this case, it would look the same as the save app profile data step above. You would just re-save the data to your app’s space with new values.

![](https://api.kauri.io:443/ipfs/QmUrsS7nCHitHoMaSx77a1sP2WEHFi93bpyisoZjqkR1xY)


## 🌈 Display Profiles Throughout Your App
Now that a user has configured their profile for your app, you will want to display it in your app’s UI, making it available to this user and other users on various pages. This section describes the application logic and code that should be implemented on other pages of your app where you wish to display user profiles.

![](https://api.kauri.io:443/ipfs/QmXvJYxMayWGCcYrcxMvwCp3Paev2AZLsXydfXa32tSNiD)


### How to Display User Profiles
When your app displays a profile in the UI, you must first check the users’ default profile settings to determine which information to display.
This code snippet checks for the 
`defaultProfile`
 setting, stored in your app's space:

<body><style>.gist .gist-file { margin-bottom: 0 !important; }.gist { text-rendering: auto; }</style><script charset="utf-8" src="https://gist.github.com/oed/09723b0d6245d1fd26b8b7034334dea5.js"></script><script>var height = -1; var delayMs = 200;function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}function maybeResize() {if (document.documentElement.offsetHeight != height && notifyResize()) {height = document.documentElement.offsetHeight;}delayMs = Math.min(delayMs * 2, 1000000); setTimeout(maybeResize, delayMs);}maybeResize();</script></body>


```
const livepeerProfile = await Box.getSpace(
<eth-address>
 , 'livepeer')
console.log(livepeerProfile.defaultProfile)
</eth-address>
```


 
`defaultProfile`
 can be either 
`'3box'`
 , 
`'livepeer'`
 or 
`undefined`
 . Depending on the value, your app should do 1 of 3 things:



 * If `livepeerProfile.defaultProfile` has the value `'livepeer'` , display the `livepeerProfile` information (name, image, URL) that you wish

 * If `livepeerProfile.defaultProfile` has the value `'3box'` , call `Box.getProfile(<eth-address>)` and display the returned profile information (name, image, URL) that you wish

 * If no value is returned, the user has never configured their profile for your app before. Display a blank profile, or keep their Ethereum hex address.

## 👋 Get in touch
We love to hear about your use cases and we’re happy to answer any questions that arise as you build with our profiles API. Join our Discord at 
[chat.3box.io](https://chat.3box.io)
 .
View more documentation on 
[Github](https://github.com/3box/3box-js)
 
Subscribe to our 
[newsletter](http://eepurl.com/dFVXCj)
 
Happy building! ⚒️
