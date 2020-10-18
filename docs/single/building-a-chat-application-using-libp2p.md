---
title: Building a Chat Application using Libp2p
summary: This article was first published on our open-source platform, SimpleAsWater.com. If you are interested in IPFS, Libp2p, Ethereum, IPLD, Multiformats, IPFS Clust
authors:
  - Vaibhav Saini (@vasa)
date: 2020-01-05
some_url: 
---

# Building a Chat Application using Libp2p

![](https://ipfs.infura.io/ipfs/QmZUii1zraq5yn7jcfsFZEMnup6GycfUw1hDGxMuGkp8Xy)


This article was first published on our open-source platform, [SimpleAsWater.com](https://simpleaswater.com/chat-using-libp2p). If you are interested in IPFS, Libp2p, Ethereum, IPLD, Multiformats, IPFS Cluster and other Web 3.0 projects, concepts and interactive tutorials, then be sure to check out [SimpleAsWater](https://simpleaswater.com).

---

Around the 1960s, the early research on ARPANET(predecessor of the internet)
began around the question that

> How do you build a network which is so resilient, so that it could even survive
> a *NUCLEAR WAR*?

The reason that this topic was of such interest in the 1960s was that most of
the communication infrastructure at that time looked like this:

[![IMAGE ALT TEXT HERE](https://i.ytimg.com/an_webp/2BzRjfOoiVQ/mqdefault_6s.webp?du=3000&sqp=CKjrnvAF&rs=AOn4CLB5oekGlDs5hXCaDsagXx4hpZdD4g)](https://youtu.be/2BzRjfOoiVQ)

These were banks of human operators connecting wires to facilitate country-wide
communication. This was a highly centralized system, which could be destroyed
easily in a nuclear war.

Fast-forward to today’s world, most of the internet companies today have
centralized servers, most of which are hosted in the data centers outside the
cities. The internet we see today is still somehow full of services similar to
the bank of human operators which are highly centralized and fragile(well, we
aren’t in a constant threat of a nuclear war today, but any technical or natural
disaster can cause great damage).

##### **But, Why do we need to rethink about networking in 2019?**

Today, we are dependent on the internet more than ever. We are dependent on it
for life and death situations. But the current internet, as we see it today is
quite fragile and has several design problems. Most of these problems stem from
the [location-addressing](https://simpleaswater.com/location-addressing).

*****

We can go on and on about [Why do we need
Libp2p](https://simpleaswater.com/why-libp2p/) and [How it
works](https://simpleaswater.com/what-is-libp2p/). 

But, we are here to BUILD STUFF. 

So, let’s get right into it.

In this series, we are going to cover a number of posts, which go into the
practical, or even wild applications of peer-to-peer systems using Libp2p. We
will build and also break a lot of stuff.

You can **[suggest any topic for future tutorials](https://vasa486547.typeform.com/to/phna8b)** related to Blockchains and in
general Web 3.0.

This is the first in a series of tutorials on working with libp2p’s javascript
implementation, [js-libp2p](https://github.com/libp2p/js-libp2p).

#### Building Chat Application using Libp2p

![](https://cdn-images-1.medium.com/max/800/1*AvrV3t_DNoV8p3fX_rpcPw.jpeg)

After going through this tutorial, you will be able to:

* [Install NodeJS](https://simpleaswater.com/chat-using-libp2p/#install-node-js)
* [Create an empty
project](https://simpleaswater.com/chat-using-libp2p/#create-an-empty-project)
* [Create a libp2p “bundle” from
scratch.](https://simpleaswater.com/chat-using-libp2p/#build-a-libp2p-bundle)
* [Adding support for multiplex &
encryption.](https://simpleaswater.com/chat-using-libp2p/#add-multiplexing-and-encryption)
* [Create & Start a libp2p
peer.](https://simpleaswater.com/chat-using-libp2p/#let-s-go-interplanetary-)
* [Send messages back and forth between two
peers.](https://simpleaswater.com/chat-using-libp2p/#let-s-talk-to-the-moon)


#### Install node.js

Working with js-libp2p requires [node.js](https://nodejs.org/) for development.
If you haven’t already, install node using whatever package manager you prefer
or [using the official installer](https://nodejs.org/en/download/).

We recommend using the latest stable version of node, but anything fairly recent
should work fine. If you want to see how low you can go, the current version
requirements can always be found at the [js-libp2p project
page](https://github.com/libp2p/js-libp2p).

#### Create an empty project

We need a place to put our work, so open a terminal to make a new directory for
your project somewhere and set it up as an `npm` project:

```sh
## create a directory for the project and `cd` into it
$ mkdir -p hello-libp2p/src
$ cd hello-libp2p

## make it a git repository
$ git init .
Initialized empty Git repository in /home/vasa/Desktop/simpleaswater/libp2p/.git/

## make it an npm project
$ npm init -y
```

Side note: throughout this tutorial, we use the **$** character to indicate your
terminal’s shell prompt. When following along, don’t type the **$** character,
or you’ll get some weird errors.

#### **Build a libp2p bundle**

As we learned in [what is Libp2p](https://simpleaswater.com/what-is-libp2p)
post, libp2p is a very modular framework, which allows javascript devs to target
different runtime environments and opt-in to various features by including a
custom selection of modules.

In easy words, let’s suppose you are at a hardware store and want to buy some
tools for your toolbox. Now, you see all the available wrenches in the store.

![](https://cdn-images-1.medium.com/max/800/0*2GFkwsuKtvx_zrX6.jpg)

For most of us, we only want a few sizes of wrenches. So, we pick only the ones
that we want.

Similarly, when we build a networking stack(toolbox) for our application, we
only need a few protocols & modules(wrenches). So, we should be able to select
what protocols and modules we want to use and use them independently.

Libp2p allows you to do the same for networking, as the hardware store does for
the hardware tools, i.e. allowing you to select and use only the tools that you
want to use.

Now, as everyone needs a different set of wrenches, similarily, every
application needs a different “bundle” with just the modules the application
needs.

You can even make more than one bundle if you want to target multiple javascript
runtimes with different features. For example, the IPFS project uses two libp2p
bundles, [one for
node.js](https://github.com/ipfs/js-ipfs/tree/master/src/core/runtime/libp2p-nodejs.js)
and [one for the
browser](https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/libp2p-browser.js).

Since, we’re here to learn how libp2p works, we’re going to start from scratch
and define our own bundle. We’ll start with a very simple bundle and add
features as we need them.

First, install the libp2p dependency. We’ll also need at least one transport
module, so we’ll pull in `libp2p-tcp` as well, and the
`@nodeutils/defaults-deep` helper which we'll use when building the bundle.

```sh
$ npm install libp2p@^0.26.2 libp2p-tcp@^0.13.2 @nodeutils/defaults-deep@^1.1.0 --save
```
In a production application, it may make sense to create a separate npm module
for your bundle, which will give you one place to manage the *libp2p*
dependencies for all your javascript projects. In that case, you should not
depend on *libp2p* directly in your application. Instead, you’d depend on your
bundle, which would, in turn, depend on libp2p and whatever modules (transports,
etc) you might need.

For this tutorial, our bundle will just be a javascript file in our application
source.

Make a file called *src/libp2p_bundle.js* with the following content:

```js
const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const defaultsDeep = require('@nodeutils/defaults-deep')
const DEFAULT_OPTS = {
  modules: {
    transport: [
      TCP
    ]
  }
}
class P2PNode extends Libp2p {
  constructor (opts) {
    super(defaultsDeep(opts, DEFAULT_OPTS))
  }
}
module.exports = P2PNode
```


The `libp2p` module exports a `libp2p.Node` class which we extend into our own
`P2PNode` class.

Right now our class just adds the `libp2p-tcp` transport module to the default
constructor options of the base class. As we go, we'll extend our bundle to
include more transports and configure other aspects of the libp2p stack.

#### **Create an instance of a libp2p node**

As we know, libp2p was born while working InterPlanetary File System project, it
makes sense to make our libp2p nodes InterPlanetary. Let’s make our first node,
*moon.js*.

Using the bundle we defined above, we can create a new `P2PNode` instance.

To do so, create a file called *src/moon.js* and make it look like this:

```js
'use strict'
/* eslint-disable no-console */
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const Node = require('./libp2p_bundle')
PeerId.createFromJSON(require('./ids/moonId'), (err, peerId) => {
    if (err) {
        throw err
    }
const peerInfo = new PeerInfo(peerId)
    peerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
    const nodeListener = new Node({ peerInfo })
})
```

We also have to create a *JSON* file containing the `peerId` of our moon peer.
This will help other peers find our moon peer.

Create a file named *src/ids/moonId.json*

```sh
$ mkdir ids
$ touch moonId.json; touch earthId.json
```


Now, add the `peerId` in *moonId.json*

```json
{
    "id": "QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm",
    "privKey": "CAASqAkwggSkAgEAAoIBAQDLZZcGcbe4urMBVlcHgN0fpBymY+xcr14ewvamG70QZODJ1h9sljlExZ7byLiqRB3SjGbfpZ1FweznwNxWtWpjHkQjTVXeoM4EEgDSNO/Cg7KNlU0EJvgPJXeEPycAZX9qASbVJ6EECQ40VR/7+SuSqsdL1hrmG1phpIju+D64gLyWpw9WEALfzMpH5I/KvdYDW3N4g6zOD2mZNp5y1gHeXINHWzMF596O72/6cxwyiXV1eJ000k1NVnUyrPjXtqWdVLRk5IU1LFpoQoXZU5X1hKj1a2qt/lZfH5eOrF/ramHcwhrYYw1txf8JHXWO/bbNnyemTHAvutZpTNrsWATfAgMBAAECggEAQj0obPnVyjxLFZFnsFLgMHDCv9Fk5V5bOYtmxfvcm50us6ye+T8HEYWGUa9RrGmYiLweuJD34gLgwyzE1RwptHPj3tdNsr4NubefOtXwixlWqdNIjKSgPlaGULQ8YF2tm/kaC2rnfifwz0w1qVqhPReO5fypL+0ShyANVD3WN0Fo2ugzrniCXHUpR2sHXSg6K+2+qWdveyjNWog34b7CgpV73Ln96BWae6ElU8PR5AWdMnRaA9ucA+/HWWJIWB3Fb4+6uwlxhu2L50Ckq1gwYZCtGw63q5L4CglmXMfIKnQAuEzazq9T4YxEkp+XDnVZAOgnQGUBYpetlgMmkkh9qQKBgQDvsEs0ThzFLgnhtC2Jy//ZOrOvIAKAZZf/mS08AqWH3L0/Rjm8ZYbLsRcoWU78sl8UFFwAQhMRDBP9G+RPojWVahBL/B7emdKKnFR1NfwKjFdDVaoX5uNvZEKSl9UubbC4WZJ65u/cd5jEnj+w3ir9G8n+P1gp/0yBz02nZXFgSwKBgQDZPQr4HBxZL7Kx7D49ormIlB7CCn2i7mT11Cppn5ifUTrp7DbFJ2t9e8UNk6tgvbENgCKXvXWsmflSo9gmMxeEOD40AgAkO8Pn2R4OYhrwd89dECiKM34HrVNBzGoB5+YsAno6zGvOzLKbNwMG++2iuNXqXTk4uV9GcI8OnU5ZPQKBgCZUGrKSiyc85XeiSGXwqUkjifhHNh8yH8xPwlwGUFIZimnD4RevZI7OEtXw8iCWpX2gg9XGuyXOuKORAkF5vvfVriV4e7c9Ad4Igbj8mQFWz92EpV6NHXGCpuKqRPzXrZrNOA9PPqwSs+s9IxI1dMpk1zhBCOguWx2m+NP79NVhAoGBAI6WSoTfrpu7ewbdkVzTWgQTdLzYNe6jmxDf2ZbKclrf7lNr/+cYIK2Ud5qZunsdBwFdgVcnu/02czeS42TvVBgs8mcgiQc/Uy7yi4/VROlhOnJTEMjlU2umkGc3zLzDgYiRd7jwRDLQmMrYKNyEr02HFKFn3w8kXSzW5I8rISnhAoGBANhchHVtJd3VMYvxNcQb909FiwTnT9kl9pkjhwivx+f8/K8pDfYCjYSBYCfPTM5Pskv5dXzOdnNuCj6Y2H/9m2SsObukBwF0z5Qijgu1DsxvADVIKZ4rzrGb4uSEmM6200qjJ/9U98fVM7rvOraakrhcf9gRwuspguJQnSO9cLj6",
    "pubKey": "CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDLZZcGcbe4urMBVlcHgN0fpBymY+xcr14ewvamG70QZODJ1h9sljlExZ7byLiqRB3SjGbfpZ1FweznwNxWtWpjHkQjTVXeoM4EEgDSNO/Cg7KNlU0EJvgPJXeEPycAZX9qASbVJ6EECQ40VR/7+SuSqsdL1hrmG1phpIju+D64gLyWpw9WEALfzMpH5I/KvdYDW3N4g6zOD2mZNp5y1gHeXINHWzMF596O72/6cxwyiXV1eJ000k1NVnUyrPjXtqWdVLRk5IU1LFpoQoXZU5X1hKj1a2qt/lZfH5eOrF/ramHcwhrYYw1txf8JHXWO/bbNnyemTHAvutZpTNrsWATfAgMBAAE="
}
```

Let’s see what we did above.

In *moon.js* we start out by importing a few modules. Apart from the `P2PNode`
bundle we defined earlier, `peer-id`, which contains a
[PeerId](https://simpleaswater.com/libp2p-glossary/#peerid) associated with a
peer, and `peer-info`, which provides a libp2p Peer abstraction.

The constructor for our bundle(*libp2p_bundle.js*) requires a `peerInfo`
argument. This can either be generated on-the-fly or loaded from a byte buffer
or `JSON` object. Here, we're generating a new `PeerInfo` object for our peer
using *ids/moonId.json*. This will generate a new `PeerId` containing the
cryptographic key pair that we added in *moonId.json*.

Once we have our `peerId`, we next create a
[multiaddress](https://docs.libp2p.io/reference/glossary/#multiaddr) for
`/ip4/127.0.0.1/tcp/10333`, which is the [localhost IPv4
address](https://en.wikipedia.org/wiki/Localhost) on the TCP port `10333`.

Adding the new multiaddr to our `peerInfo` object will cause our node to try to
listen to that address when the node starts.

Next, we create our peer, passing in the `peerInfo` constructor option. That's
it for setting up our moon node.

#### **Start the node and listen for connections**

Before starting our nodes, let’s add some colors and emojis to our command line
using `chalk` and `node-emoji`.

```sh
$ npm i chalk node-emoji --save-dev
```


Now, let’s start our moon node. To do that, replace *moon.js* with following
code:

```js
'use strict'
/* eslint-disable no-console */
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const Node = require('./libp2p_bundle')
const chalk = require('chalk');
const emoji = require('node-emoji')
PeerId.createFromJSON(require('./ids/moonId'), (err, peerId) => {
    if (err) {
        throw err
    }
    const peerInfo = new PeerInfo(peerId)
    peerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
    const nodeListener = new Node({ peerInfo })
nodeListener.start((err) => {
        if (err) {
            throw err
        }
console.log(emoji.get('moon'), chalk.blue(' Moon ready '),
            emoji.get('headphones'), chalk.blue(' Listening on: '));
peerInfo.multiaddrs.forEach((ma) => {
            console.log(ma.toString() + '/p2p/' + peerId.toB58String())
        })
console.log('\n' + emoji.get('moon'), chalk.blue(' Moon trying to connect with Earth '),
            emoji.get('large_blue_circle'));
    })
})
```

Now, try to run the *moon.js*, using *node moon.js*. You will see something like
below.

![](https://cdn-images-1.medium.com/max/800/1*7DUfc9CD74MPJRH2JtlPJQ.png)

Now, we have started our moon node and listening for the earth node. So, we need
another node, *earth.js*. But before building our earth node, we need to add one
final thing to make our moon node work.

In case you are stuck somewhere, let us know [here](https://discord.gg/x2kmUXW).

#### **Add multiplexing and encryption**

We can now start a node and listen for connections, but we can’t really do
anything yet. This is because we’re missing a key libp2p component called a
[stream multiplexer](https://docs.libp2p.io/reference/glossary/#multiplexer),
which lets us interleave multiple independent streams of communication across
one network connection.

##### **But, what is multiplexing?**

To understand multiplexing, let’s take an example of your TV cable or WiFi
router. You can see multiple channels, which all comes through a single cable
attached from your setup box. Also, multiple people can connect to the same WiFi
router and watch videos and read an article all at the same time…Ever wondered
how you can do multiple things using a single wire or router?

The answer is multiplexing.

Multiplexing (or *muxing*) is a way of sending multiple signals or streams of
information over a communications link at the same time in the form of a single,
complex signal; the receiver recovers the separate signals, a process called
demultiplexing (or *demuxing*).

While we’re at it, we’ll also add support for encrypted communication, which
will secure our moon-earth communications so that anyone cannot eavesdrop our
messages.

Let’s add two new dependencies:

```sh
$ npm install --save libp2p-mplex@^0.8.5 libp2p-secio@^0.11.1
```

And we'll need to edit our bundle. Open *src/libp2p_bundle.js* and import the
new modules:

```js
const Multiplex = require('libp2p-mplex') 
const SECIO = require('libp2p-secio')
```

Then change the `DEFAULT_OPTS` constant to look like this:

```js
const DEFAULT_OPTS = {
  modules: {
    transport: [
      TCP
    ],
    connEncryption: [
      SECIO
    ],
    streamMuxer: [
      Multiplex
    ]
  }
}
```

That’s it! Now we can open multiple independent streams over our single TCP
connection, and our connection will be upgraded to a securely encrypted channel
using the [secio module](https://github.com/libp2p/js-libp2p-secio).

#### **Let’s go interplanetary!**

As we have now added all the necessary components for our communication, let’s
build our earth node.

Add the following code in *src/earth.js*

```js
'use strict'
/* eslint-disable no-console */
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const Node = require('./libp2p_bundle')
const async = require('async')
const chalk = require('chalk');
const emoji = require('node-emoji')
let moonPeerId
async.parallel([
    (callback) => {
        PeerId.createFromJSON(require('./ids/earthId'), (err, earthPeerId) => {
            if (err) {
                throw err
            }
            callback(null, earthPeerId)
        })
    },
    (callback) => {
        PeerId.createFromJSON(require('./ids/moonId'), (err, moonPeerId) => {
            if (err) {
                throw err
            }
            callback(null, moonPeerId)
        })
    }
], (err, ids) => {
    if (err) throw err
    const earthPeerInfo = new PeerInfo(ids[0])
    earthPeerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/0')
    const nodeDialer = new Node({ peerInfo: earthPeerInfo })
    const moonPeerInfo = new PeerInfo(ids[1])
    moonPeerId = ids[1]
    moonPeerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
    nodeDialer.start((err) => {
        if (err) {
            throw err
        }
        console.log(emoji.get('large_blue_circle'), chalk.blue(' Earth Ready '),
                    emoji.get('headphones'), chalk.blue(' Listening on: '));
        nodeDialer.dialProtocol(moonPeerInfo, '/chat/1.0.0', (err, conn) => {
            if (err) {
                throw err
            }
            console.log('\n' + emoji.get('large_blue_circle'),
                        chalk.blue(' Earth dialed to Moon on protocol: /chat/1.0.0'));
            console.log(`${emoji.get('incoming_envelope')}
                         ${chalk.bold(`Type a message and press enter. See what happens...`)}`)
        })
    })
})
```

And similarly to the moon peer, we also have to create a *JSON* file containing
the `peerId` of our earth peer.

```json
{
    "id": "Qma3GsJmB47xYuyahPZPSadh1avvxfyYQwk8R3UnFrQ6aP",
    "privKey": "CAASpwkwggSjAgEAAoIBAQCaNSDOjPz6T8HZsf7LDpxiQRiN2OjeyIHUS05p8QWOr3EFUCFsC31R4moihE5HN+FxNalUyyFZU//yjf1pdnlMJqrVByJSMa+y2y4x2FucpoCAO97Tx+iWzwlZ2UXEUXM1Y81mhPbeWXy+wP2xElTgIER0Tsn/thoA0SD2u9wJuVvM7dB7cBcHYmqV6JH+KWCedRTum6O1BssqP/4Lbm2+rkrbZ4+oVRoU2DRLoFhKqwqLtylrbuj4XOI3XykMXV5+uQXz1JzubNOB9lsc6K+eRC+w8hhhDuFMgzkZ4qomCnx3uhO67KaICd8yqqBa6PJ/+fBM5Xk4hjyR40bwcf41AgMBAAECggEAZnrCJ6IYiLyyRdr9SbKXCNDb4YByGYPEi/HT1aHgIJfFE1PSMjxcdytxfyjP4JJpVtPjiT9JFVU2ddoYu5qJN6tGwjVwgJEWg1UXmPaAw1T/drjS94kVsAs82qICtFmwp52Apg3dBZ0Qwq/8qE1XbG7lLyohIbfCBiL0tiPYMfkcsN9gnFT/kFCX0LVs2pa9fHCRMY9rqCc4/rWJa1w8sMuQ23y4lDaxKF9OZVvOHFQkbBDrkquWHE4r55fchCz/rJklkPJUNENuncBRu0/2X+p4IKFD1DnttXNwb8j4LPiSlLro1T0hiUr5gO2QmdYwXFF63Q3mjQy0+5I4eNbjjQKBgQDZvZy3gUKS/nQNkYfq9za80uLbIj/cWbO+ZZjXCsj0fNIcQFJcKMBoA7DjJvu2S/lf86/41YHkPdmrLAEQAkJ+5BBNOycjYK9minTEjIMMmZDTXXugZ62wnU6F46uLkgEChTqEP57Y6xwwV+JaEDFEsW5N1eE9lEVX9nGIr4phMwKBgQC1TazLuEt1WBx/iUT83ita7obXqoKNzwsS/MWfY2innzYZKDOqeSYZzLtt9uTtp4X4uLyPbYs0qFYhXLsUYMoGHNN8+NdjoyxCjQRJRBkMtaNR0lc5lVDWl3bTuJovjFCgAr9uqJrmI5OHcCIk/cDpdWb3nWaMihVlePmiTcTy9wKBgQCU0u7c1jKkudqks4XM6a+2HAYGdUBk4cLjLhnrUWnNAcuyl5wzdX8dGPi8KZb+IKuQE8WBNJ2VXVj7kBYh1QmSJVunDflQSvNYCOaKuOeRoxzD+y9Wkca74qkbBmPn/6FFEb7PSZTO+tPHjyodGNgz9XpJJRjQuBk1aDJtlF3m1QKBgE5SAr5ym65SZOU3UGUIOKRsfDW4Q/OsqDUImvpywCgBICaX9lHDShFFHwau7FA52ScL7vDquoMB4UtCOtLfyQYA9995w9oYCCurrVlVIJkb8jSLcADBHw3EmqF1kq3NqJqm9TmBfoDCh52vdCCUufxgKh33kfBOSlXuf7B8dgMbAoGAZ3r0/mBQX6S+s5+xCETMTSNv7TQzxgtURIpVs+ZVr2cMhWhiv+n0Omab9X9Z50se8cWl5lkvx8vn3D/XHHIPrMF6qk7RAXtvReb+PeitNvm0odqjFv0J2qki6fDs0HKwq4kojAXI1Md8Th0eobNjsy21fEEJT7uKMJdovI/SErI=",
    "pubKey": "CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCaNSDOjPz6T8HZsf7LDpxiQRiN2OjeyIHUS05p8QWOr3EFUCFsC31R4moihE5HN+FxNalUyyFZU//yjf1pdnlMJqrVByJSMa+y2y4x2FucpoCAO97Tx+iWzwlZ2UXEUXM1Y81mhPbeWXy+wP2xElTgIER0Tsn/thoA0SD2u9wJuVvM7dB7cBcHYmqV6JH+KWCedRTum6O1BssqP/4Lbm2+rkrbZ4+oVRoU2DRLoFhKqwqLtylrbuj4XOI3XykMXV5+uQXz1JzubNOB9lsc6K+eRC+w8hhhDuFMgzkZ4qomCnx3uhO67KaICd8yqqBa6PJ/+fBM5Xk4hjyR40bwcf41AgMBAAE="
}
```

Here in *earth.js*, we used the same modules as we used in *moon.js*. The only
new module we use here is `async`, which is used to generate `peerIds` for moon
and earth peers, in parallel.

Then, as we did in *moon.js* we create the `earthPeerInfo`, add a
[multiaddr](https://docs.libp2p.io/reference/glossary/#multiaddr),
`/ip4/127.0.0.1/tcp/0` and finally, create our earth node `nodeDialer`.

Notice that we also, create `moonPeerInfo` and add the same
[multiaddr](https://docs.libp2p.io/reference/glossary/#multiaddr), that we added
in *moon.js*. We do this as the earth node needs to know about the
`moonPeerInfo` in order to *dial* our moon peer. So, the `moonPeerInfo` acts
like a phone number here.

And finally, we start our earth peer and dial the moon peer using
`nodeDialer.dialProtocol`. While dialing to our moon peer, we need to specify a
protocol (`/chat/1.0.0`), using which we will talk to our moon peer. It's like
deciding a common language before we start talking to each other. Otherwise, it
would make no sense.

Now, as earth peer hash defined that it will use `/chat/1.0.0` protocol to
communicate with the moon peer, let's add that to the *moon.js* as well.

To do that, we need to install a few more libs:

```sh
$ npm i pull-stream@^3.6.9 pull-pushable --save
```

Now, replace the *moon.js* with the following code:

```js
'use strict'
/* eslint-disable no-console */
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const Node = require('./libp2p_bundle')
const pull = require('pull-stream')
const Pushable = require('pull-pushable')
const p = Pushable()
const chalk = require('chalk');
const emoji = require('node-emoji')
PeerId.createFromJSON(require('./ids/moonId'), (err, peerId) => {
    if (err) {
        throw err
    }
    const peerInfo = new PeerInfo(peerId)
    peerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
    const nodeListener = new Node({ peerInfo })
    nodeListener.start((err) => {
        if (err) {
            throw err
        }
        nodeListener.on('peer:connect', (peerInfo) => {
            console.log(emoji.get('moon'), chalk.blue(' Moon found Earth '),
                        emoji.get('large_blue_circle'),
                        chalk.blue(` on: ${peerInfo.id.toB58String()}`));
            console.log('\n' + emoji.get('moon'),
                        chalk.green(' Moon waiting for message from Earth ')
                        + emoji.get('large_blue_circle'))
        })
        nodeListener.handle('/chat/1.0.0', (protocol, conn) => {
            pull(
                p,
                conn
            )
            pull(
                conn,
                pull.map((data) => {
                    return data.toString('utf8').replace('\n', '')
                }),
                pull.drain(console.log)
            )
        })
        console.log(emoji.get('moon'), chalk.blue(' Moon ready '),
                    emoji.get('headphones'), chalk.blue(' Listening on: '));
        peerInfo.multiaddrs.forEach((ma) => {
            console.log(ma.toString() + '/p2p/' + peerId.toB58String())
        })
        console.log('\n' + emoji.get('moon'),
                    chalk.blue(' Moon trying to connect with Earth '),
                    emoji.get('large_blue_circle'));
    })
})
```

Now, as have defined `/chat/1.0.0` protocol for moon peer too, let's try to
connect earth peer to our moon peer.

First, run node *moon.js* in one terminal. Then fire up another terminal and run
*node earth.js*.

If everything went right, then you would see something like below:

![](https://cdn-images-1.medium.com/max/800/1*KC6_f43jGgas4hYQ2mSXWg.gif)

In case you are stuck somewhere, let us know [here](https://discord.gg/x2kmUXW).

#### **Let’s Talk to the Moon**

Till now we have managed to connect moon peer and earth peer. Another
interesting thing that we can do here to allow these 2 peers to communicate with
each other.

We will use the command line to write and send our messages.

To do that we need to handle and send messages from the command prompt. We can
do that using *process* module available in NodeJS.

Replace *moon.js* with the following code:

```js
'use strict'
/* eslint-disable no-console */

const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const Node = require('./libp2p_bundle')
const pull = require('pull-stream')
const Pushable = require('pull-pushable')
const p = Pushable()
const chalk = require('chalk');
const emoji = require('node-emoji')

PeerId.createFromJSON(require('./ids/moonId'), (err, peerId) => {
    if (err) {
        throw err
    }
    const peerInfo = new PeerInfo(peerId)
    peerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
    const nodeListener = new Node({ peerInfo })

    nodeListener.start((err) => {
        if (err) {
            throw err
        }

        nodeListener.on('peer:connect', (peerInfo) => {
            console.log(emoji.get('moon'), 
                        chalk.blue(' Moon found Earth '),
                        emoji.get('large_blue_circle'),
                        chalk.blue(` on: ${peerInfo.id.toB58String()}`));
            console.log('\n' + emoji.get('moon'),
                        chalk.green(' Moon waiting for message from Earth ')
                        + emoji.get('large_blue_circle'))
        })

        nodeListener.handle('/chat/1.0.0', (protocol, conn) => {
            pull(
                p,
                conn
            )

            pull(
                conn,
                pull.map((data) => {
                    return data.toString('utf8').replace('\n', '')
                }),
                pull.drain(console.log)
            )

            process.stdin.setEncoding('utf8')
            process.openStdin().on('data', (chunk) => {
                var data = `${chalk.blue("Message received from Moon: ")}\n\n`
                + chunk.toString() + `\n${emoji.get('incoming_envelope')}
                ${chalk.blue("  Send message from Earth:")}`
                
                p.push(data)
            })
        })

        console.log(emoji.get('moon'), chalk.blue(' Moon ready '),
                    emoji.get('headphones'), chalk.blue(' Listening on: '));

        peerInfo.multiaddrs.forEach((ma) => {
            console.log(ma.toString() + '/p2p/' + peerId.toB58String())
        })

        console.log('\n' + emoji.get('moon'), chalk.blue(' Moon trying to connect with Earth '),
                    emoji.get('large_blue_circle'));
    })
})
```

Replace *earth.js* with the following code:

```js
'use strict'
/* eslint-disable no-console */

const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const Node = require('./libp2p_bundle')
const pull = require('pull-stream')
const async = require('async')
const chalk = require('chalk');
const emoji = require('node-emoji')
const Pushable = require('pull-pushable')
const p = Pushable()
let moonPeerId

async.parallel([
    (callback) => {
        PeerId.createFromJSON(require('./ids/earthId'), (err, earthPeerId) => {
            if (err) {
                throw err
            }
            callback(null, earthPeerId)
        })
    },
    (callback) => {
        PeerId.createFromJSON(require('./ids/moonId'), (err, moonPeerId) => {
            if (err) {
                throw err
            }
            callback(null, moonPeerId)
        })
    }
], (err, ids) => {
    if (err) throw err
    const earthPeerInfo = new PeerInfo(ids[0])
    earthPeerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/0')
    const nodeDialer = new Node({ peerInfo: earthPeerInfo })

    const moonPeerInfo = new PeerInfo(ids[1])
    moonPeerId = ids[1]
    moonPeerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
    nodeDialer.start((err) => {
        if (err) {
            throw err
        }

        console.log(emoji.get('large_blue_circle'), chalk.blue(' Earth Ready '),
                    emoji.get('headphones'), chalk.blue(' Listening on: '));

        nodeDialer.dialProtocol(moonPeerInfo, '/chat/1.0.0', (err, conn) => {
            if (err) {
                throw err
            }
            console.log('\n' + emoji.get('large_blue_circle'),
                        chalk.blue(' Earth dialed to Moon on protocol: /chat/1.0.0'));
            console.log(`${emoji.get('incoming_envelope')}
                         ${chalk.bold(`Type a message and press enter. See what happens...`)}`)
            // Write operation. Data sent as a buffer
            pull(
                p,
                conn
            )
            // Sink, data converted from buffer to utf8 string
            pull(
                conn,
                pull.map((data) => {
                    return data.toString('utf8').replace('\n', '')
                }),
                pull.drain(console.log)
            )

            process.stdin.setEncoding('utf8')
            process.openStdin().on('data', (chunk) => {
                var data = chunk.toString()
                var data = `${chalk.blue("Message received from Earth: ")}\n\n`
                + chunk.toString() + `\n${emoji.get('incoming_envelope')}
                ${chalk.blue("  Send message from Moon:")}`
                
                p.push(data)
            })
        })
    })
})
```

That’s all. **First**, **run node moon.js** in one terminal. Then **fire up
another terminal and run node earth.js**.

Now, if everything in fine, then you will see the earth peer asking you to
**type something and press enter**. If you do that, you can see the same message
is received on the moon peer. Also, if you type something and press enter from
the moon peer, you can see the same message on the earth peer.

![](https://cdn-images-1.medium.com/max/800/1*r5IeY8-6FmkB77MkP1T2aA.gif)

Congratulations🎉🎉 You are one of the very few people to communicate from earth
to moon!!

In case you are stuck somewhere, let us know [here](https://discord.gg/x2kmUXW).

*****

This article was first published on
[SimpleAsWater.com](https://simpleaswater.com/chat-using-libp2p/)*.*



---

- **Kauri original link:** https://kauri.io/building-a-chat-application-using-libp2p/32b0d9455bfa4312a2f6fb02cae8383f/a
- **Kauri original author:** Vaibhav Saini (@vasa)
- **Kauri original Publication date:** 2020-01-05
- **Kauri original tags:** tcp, trasports, secio, ipfs, libp2p, tutorial, bundle
- **Kauri original hash:** QmfUNCDadmkVNiQ8nMsbUDVnRRC2jpTYYePCxtMLb4Mygx
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



