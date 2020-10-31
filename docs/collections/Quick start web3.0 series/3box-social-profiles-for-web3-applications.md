---
title: 3Box - Social profiles for  web3 applications
summary: 3Box provides social infrastructure to power decentralized applications and networks. Ethereum Profiles allow users to create a rich social presence that unites and gives them control over their data and experiences on the decentralized web. These built on our distributed social databases that let developers store and access information in users profiles, making distributed data infrastructure and sharing information between dapps much simpler. What is 3Box Head to 3Box.io and create your own pr
authors:
  - Danny Zuckerman (@dazuck)
date: 2019-01-04
some_url: 
---

# 3Box - Social profiles for  web3 applications

![](https://ipfs.infura.io/ipfs/QmXDGDWxxnGaCoD8o6sMS3kJUe3PApo9fSDzdjrGmC5eQW)


3Box provides social infrastructure to power decentralized applications and networks. [Ethereum Profiles](http://3box.io) allow users to create a rich social presence that unites and gives them control over their data and experiences on the decentralized web. These built on our [distributed social databases](https://github.com/uport-project/3box) that let developers store and access information in users' profiles, making distributed data infrastructure and sharing information between dapps much simpler. 

### What is 3Box

Head to [3Box.io](http://3box.io) and create your own profile to see how users can view, edit and control their 3Box data and profile. All functionality in the 3Box dapp can also be accessed from our APIs. 

Next, integrate [3Box-JS](https://github.com/uport-project/3box-js) into your application to ease user onboarding and deliver a richer user experience via profiles and social connections. `3box-js` will enable you to Get, Set and Remove data associated with an Ethereum account. 

### Integration

#### Install 3Box

    $ npm install 3Box

#### Import 3Box into your project

Import the 3box module

    const Box = require('3box')

or use the dist build in your html code

    <script type="text/javascript" src="../dist/3box.js"></script>

### Usage

#### Get public user data using getProfile

You can retrieve publicly saved data (e.g., name, photo) about ethereum addresses using the `getProfile` static method directly from the Box message, with no user signing.

Using `async/await`

    const profile = await Box.getProfile('0x12345abcde')
    console.log(profile)

or using `.then`

    Box.getProfile('0x12345abcde').then(profile => {
      console.log(profile)
    })

#### Interacting with private data

To get data in a user's 3Box or read private data, you must call the openBox method. This will prompt the user to authenticate your dapp. 

**openBox**

Using `async/await` *('0x123..' represents an Ethereum address)*

    const box = await Box.openBox('0x12345abcde', ethereumProvider)

We recommend adding a listener using the `onSyncDone` method to let you know when all the users data has synced to the network after the first time you open a user's 3Box, making it safe to *set* data. 

    box.onSyncDone(yourCallbackFunction)

**Get, Set and Remove data**

Once a user has authenticated your dapp, you can use the box instance object to interact with data in the users private store and profile. In both the profile and the private store you use a key to set a value.

Using `async/await`

    // use the public profile
    // get
    const nickname = await box.public.get('name')
    console.log(nickname)
    // set
    await box.public.set('name', 'oed')
    // remove
    await box.public.remove('name')
    // use the private store
    // get
    const email = await box.private.get('email')
    console.log(email)
    // set
    await box.private.set('email', 'oed@email.service')
    // remove
    await box.private.remove('email')

You can see the 3Box [API documentation](https://github.com/uport-project/3box-js#-api-documentation) for further information. 

### Make your data accessible

We encourage you to use or add to our [key conventions](https://github.com/uport-project/3box-js/blob/master/KEY-CONVENTIONS.md) to build strong cross-dapp experiences and sharing. 

### Use our other functionality

You can also use our [3box-activity](https://github.com/uport-project/3box-activity) to get a users Ethereum activity feed, our verified fields to get a more trusted view of who a user is, and more coming soon. Follow the latest [here](https://discord.gg/3fzMe8x). 

## Use 3Box profiles & data to make great user experiences

Our mission is to enable anyone to create trust and connection online, and we do that by helping you create great communities and experiences. Here are some of the things are partners are using 3Box for - let us know how you use it. 

- Improved onboarding for users, letting them use previously saved info from other dapps rather than re-entering contact and profile information each time
- Decentralizing user data infrastructure, saving user information on 3Box so there's no need to store sensitive info on a hosted server
- Bootstrapping reputation on a marketplace by showing previous on-chain activity and dapp activity in one place
- Sharing data across dapps and devices, so preferences saved in one wallet can be synced to others, or contacts created in one social dapp can be carried over to others
- Saving posts, messages or threads on a social platform in a way that gives users the power to control and delete their own content

### Chat with us

Stop by our [Discord Community](https://discord.gg/3fzMe8x) for support, the latest news, or good conversation about our latest `#book-club` reading.


---

- **Kauri original title:** 3Box - Social profiles for  web3 applications
- **Kauri original link:** https://kauri.io/3box-social-profiles-for-web3-applications/204bee70b23549f2acdc873d265d98f8/a
- **Kauri original author:** Danny Zuckerman (@dazuck)
- **Kauri original Publication date:** 2019-01-04
- **Kauri original tags:** Ethereum
- **Kauri original hash:** QmWu8CSSGU9rkLefQicihztTsTQeWXgAxQVwoZbiAnBNUN
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



