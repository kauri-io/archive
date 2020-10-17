---
title: Bluzelle - A decentralized data cache
summary: Bluzelle is a decentralized data cache with servers available in data centers across multiple regions, and auto-replication. Quick Start 1. Create an NPM Project With NodeJS and NPM installed creating a project is a straight forward process-$ mkdir my-bluzelle-project $ cd my-bluzelle-project $ npm init 2. Install the bluzelle NPM package Run npm install bluzelle to get the latest and greatest Bluzelle sdk \\(see installation for more details\\). 3. Run a simple program Create a file, my-program
authors:
  - Kauri Team (@kauri)
date: 2019-06-06
some_url: 
---

# Bluzelle - A decentralized data cache

> Bluzelle is a decentralized data cache with servers available in data centers across multiple regions, and auto-replication.

## Quick Start

### 1. Create an NPM Project

With NodeJS and NPM installed creating a project is a straight forward process:

```shell
$ mkdir my-bluzelle-project
$ cd my-bluzelle-project
$ npm init
```

### 2. Install the `bluzelle` NPM package

Run `npm install bluzelle` to get the latest and greatest Bluzelle sdk \(see [installation](installation.md) for more details\).

### 3. Run a simple program

Create a file, `my-program.js`, and paste the following starter code. \(Click the copy button in the top-right corner of the code window to preserve line endings\)

Run the program with `node my-program`. The expected output is `The value of myKey is: myValue`. If you run the program multiple times on the same uuid, it will fail with `DATABASE_EXISTS` . Change the uuid to get a fresh database.

Explore the rest of the API on the [API page](api.md) and read about [cryptographic permissioning](permissioning.md).

```javascript
const { bluzelle } = require('bluzelle');

const bz = bluzelle({
    entry: 'ws://testnet.bluzelle.com:51010',

    // This UUID identifies your database and may be changed.
    uuid: '5f493479–2447–47g6–1c36-efa5d251a283',

    // This is the private key used for signing off database operations
    private_pem: 'MHQCAQEEIFNmJHEiGpgITlRwao/CDki4OS7BYeI7nyz+CM8NW3xToAcGBSuBBAAKoUQDQgAEndHOcS6bE1P9xjS/U+SM2a1GbQpPuH9sWNWtNYxZr0JcF+sCS2zsD+xlCcbrRXDZtfeDmgD9tHdWhcZKIy8ejQ=='
});

const main = async () => {
    await bz.createDB();
    await bz.create('myKey', 'myValue');
    console.log('The value of myKey is: ', await bz.read('myKey'));
    bz.close();
};

main().catch(e => { 
    bz.close();
    throw e;
});
```

## Troubleshooting

{% hint style="info" %}
Sometimes running a "hello world" program does not produce expected results. Common problems are listed below.
{% endhint %}

### Your NodeJS installation is out of date

Make sure that your NodeJS installation is modern. Running `node -v` will print your current version. As of the time of writing, the current version is `11.4.0`. Some operating systems ship with outdated versions of node. Follow [this guide](https://www.hostingadvice.com/how-to/update-node-js-latest-version/) to update your installation.

### The testnet is down

While we are consistently improving the system's stability and reliability, sometimes requests cannot be fulfilled due to problems in the distributed network. If you suspect this to be the case, contact us on [Gitter](https://gitter.im/bluzelle/Lobby).

It is possible to launch your own swarm locally using docker by following the instructions [here](https://github.com/bluzelle/docker-swarm-deploy).

### Insecure WebSockets connections over HTTPS

Bluzelle does not currently implement secure WebSockets \(WSS\). If you try to create a connection in an https page, you may get an error message along the lines of "the operation is insecure." To fix, host your page over HTTP, or change your browser settings. In Firefox navigate to "about:config" in the url bar, scroll down and set the `network.websocket.allowInsecureFromHTTPS` flag to true.
