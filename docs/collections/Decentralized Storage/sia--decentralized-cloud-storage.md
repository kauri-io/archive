---
title: Sia  Decentralized Cloud Storage
summary: Sia is a decentralized cloud storage platform and data storage marketplace. Sia encrypts and distributes your files across its network, keeping your data private. This article originally appeared in the Sia docs This guide will walk you through uploading a file to Sia using the API. Complete API reference documentation can be found here . Examples are given in Curl and Sia.js If you have questions, reach out to us on the -app-dev channel on Discord . Setup and Configuration If you haven’t alread
authors:
  - Kauri Team (@kauri)
date: 2019-05-14
some_url: 
---

# Sia  Decentralized Cloud Storage


> Sia is a decentralized cloud storage platform and data storage marketplace. Sia encrypts and distributes your files across it's network, keeping your data private.

_This article originally appeared in the [Sia docs](https://www.notion.so/kauriofficial/Sia-becc9fd14d6c41e9b01f33ccd6fe62d8)_

This guide will walk you through uploading a file to Sia using the API. Complete API reference documentation can be found 
[here](https://gitlab.com/NebulousLabs/Sia/blob/master/doc/API.md)
 .
Examples are given in Curl and 
[Sia.js](https://github.com/NebulousLabs/Nodejs-Sia)
 
If you have questions, reach out to us on the 
[#app-dev channel on Discord](https://discord.gg/sia)
 .

### Setup and Configuration
If you haven’t already, download the 
[Sia Daemon](https://github.com/NebulousLabs/Sia/releases/latest)
 . The Sia Daemon runs a Sia node as well as hosts the API.
By default the API listens on 
`localhost:9980`
 . You can change this using the 
`--api-addr`
 flag. Be sure to specify 
`localhost:port`
 , otherwise you may be exposing your daemon’s API to the internet, which can result in stolen coins.
The API is secured by a password, which can be specified in a few different ways. If you don’t supply a password yourself, one will be generated for you. (This is the recommended approach.) The password will be stored in a file that varies based on your OS. Refer to the complete API docs for the location of this file. The examples below will assume that the API password is 
`foobar`
 .
By default the daemon stores persist data (such as your wallet) in the current directory. You can specify a directory to use with the 
`-d`
 flag. Go ahead and start the Sia Daemon. 
`siad -d sia-data`
 
You can also start the daemon from sia.js. All of the following examples given in SiaJS will assume that the daemon has been launched like so.

```
import { launch } from 'sia.js'

try {  
  const daemon = launch('/path/to/your/siad', {
    'sia-directory': 'sia-data',
  })
  daemon.on('error', (err) => console.log('siad encountered an error ' + err))
} catch (e) {
  console.error('error launching siad: ' + e.toString())
}
```



### Basics
Let’s check the status of blockchain download using the 
`/consensus`
 endpoint.

#### Curl

```
$curl -i -A "Sia-Agent" -u "":foobar localhost:9980/consensus

HTTP/1.1 200 OK  
Content-Type: application/json; charset=utf-8  
Date: Mon, 17 Oct 2016 05:50:47 GMT  
Content-Length: 186

{
    "synced": false,
    "height": 0,
    "currentblock": "25f6e3b9295a61f69fcb956aca9f0076234ecf2e02d399db5448b6e22f26e81c",
    "target": [0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}
```



#### SiaJS

```
try {  
  const consensus = await daemon.call('/consensus')
  // do something with result consensus
} catch (e) {
  // do something with error e
}
```


Note that the user agent needs to be set to “Sia-Agent”. This happens automatically in Sia.js. This is necessary to prevent certain classes of browser based attacks.
The consensus endpoint returns the current state of the blockchain. You should not attempt to spend coins or upload files until the blockchain has been downloaded. This may take several hours. When the 
`/consensus`
 endpoints returns 
`"synced": true`
 the blockchain has been downloaded.
While we are waiting we can setup the wallet. If this is your first time running the daemon you’ll need to initialize a new wallet.

#### Curl

```
$curl -i -A "Sia-Agent" -u "":foobar -X POST localhost:9980/wallet/init

HTTP/1.1 200 OK  
Content-Type: application/json; charset=utf-8  
Date: Mon, 17 Oct 2016 06:48:24 GMT  
Content-Length: 209

{
    "primaryseed": "foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar“
}
```



#### SiaJS

```
try {  
  const wallet = await daemon.call({
    url: '/wallet/init',
    method: 'POST',
  })
} catch (e) {
  // do something with error e
}
```


The primary seed can be used to recover your wallet should you lose the sia-data directory. Write it down and keep it in a safe place. By default the seed is also used as the encryption password.
Now that we have initialize a wallet, we need to unlock it. The wallet needs to be unlocked to spend Siacoins, including uploading files. You’ll need to unlock the wallet every time you start Sia Daemon. This call will block while the wallet is unlocking and may therefore take several minutes to complete.

#### Curl

```
$curl -i -A "Sia-Agent" -u "":foobar -X POST localhost:9980/wallet/unlock?encryptionpassword=foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar%20baz%20foo%20bar

HTTP/1.1 204 No Content  
Date: Mon, 17 Oct 2016 07:01:12 GMT
```



#### SiaJS

```
try {  
  await daemon.call({
    url: '/wallet/unlock',
    method: 'POST',
    qs: {
      encryptionpassword: 'foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar',
    },
  })
} catch (e) {
  // do something with error e
}
```


You’ll need Siacoins in your wallet before you can upload any files to the network. To do this you must send coins to your wallet. The wallet provides an endpoint for getting a new wallet address. Send coins to this address.

#### Curl

```
$ curl -i -A "Sia-Agent" -u "":foobar localhost:9980/wallet/address

HTTP/1.1 200 OK  
Content-Type: application/json; charset=utf-8  
Date: Mon, 17 Oct 2016 20:15:13 GMT  
Content-Length: 91

{
    "address": "1234567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab"
}
```



#### SiaJS

```
try {  
  const wallet = await daemon.call('/wallet/address')
  // do something with wallet.address
} catch (e) {
  // do something with error e
}
```


Before continuing, wait for 
`/consensus`
 to return 
`"synced": true`
 .

### Uploading and Downloading Files
Before we can upload files we must configure the renter. Primarily, we need to allocate funds and specify the contract period. The contract period is the minimum duration of time we want to store files, and is also the minimum amount of time you pay for at once. For example, to allocate 1000 SC (1000000000000000000000000000 Hastings) for the renter with a 1 month (4320 blocks) contract period:

#### Curl

```
$ curl -i -A "Sia-Agent" -u "":foobar -X POST "localhost:9980/renter?funds=1000000000000000000000000000&period=4320"

HTTP/1.1 204 No Content  
Date: Mon, 17 Oct 2016 07:01:12 GMT
```



#### SiaJS

```
try {  
  await daemon.call({
    url: '/renter',
    method: 'POST',
    qs: {
      funds: '1000000000000000000000000000',
      period: 4320,
    },
  })
} catch (e) {
  // do something with error e
}
```


This call will block until the Sia Daemon has formed contracts with a sufficient number of hosts.
We can now upload files to the network. The following call will upload the local file 
`/home/foo/bar.txt`
 to 
`/qux/bar.txt`
 on the network.

#### Curl

```
$ curl -i -A "Sia-Agent" -u "":foobar -X POST localhost:9980/renter/upload/qux/bar.txt?source=/home/foo/bar.txt

HTTP/1.1 204 No Content  
Date: Mon, 17 Oct 2016 07:01:12 GMT
```



#### SiaJS

```
try {  
  await daemon.call({
    url: '/renter/upload/qux/bar.txt',
    method: 'POST',
    qs: {
      source: '/home/foo/bar.txt',
    },
  })
} catch (e) {
  // do something with error e
} 
```


This call will return immediately. We can check the progress of the upload with the following call

#### Curl

```
$ curl -i -A "Sia-Agent" -u "":foobar localhost:9980/renter/files

HTTP/1.1 200 OK  
Content-Type: application/json; charset=utf-8  
Date: Wed, 19 Oct 2016 22:26:36 GMT  
Content-Length: 125

{
    "files": [
      {
        "siapath":        "qux/bar.txt",
        "filesize":       8192,
        "available":      false,
        "renewing":       true,
        "redundancy":     0.5,
        "uploadprogress": 10
      }
    ]
}
```



#### SiaJS

```
try {  
  const renter = await daemon.call('/renter/files')
  // use renter.files to check the upload progress
} catch (e) {
  // do something with error e
}
```


Once 
`/renter/files`
 returns 
`"available": true`
 , that file can be downloaded. Files may become available for download before 
`uploadprogress`
 reaches 100. This is because files are uploaded with redundancy.
We can download files with the 
`/renter/download`
 endpoint.

#### Curl

```
$ curl -i -A "Sia-Agent" -u "":foobar localhost:9980/renter/download/qux/bar.txt?destination=/home/foo/bar.txt

HTTP/1.1 204 No Content  
Date: Mon, 17 Oct 2016 07:01:12 GMT
```



#### SiaJS

```
try {  
  await daemon.call({
    url: '/renter/download/qux/bar.txt',
    qs: {
      source: '/home/foo/bar.txt',
    },
  })
} catch (e) {
  // do something with error e
} 
```


The call will block until the file has been downloaded. While the file is downloading you can check the progress with the 
`/renter/downloads`
 endpoint.

#### Curl

```
$ curl -i -A "Sia-Agent" -u "":foobar localhost:9980/renter/downloads

HTTP/1.1 200 OK  
Content-Type: application/json; charset=utf-8  
Date: Wed, 19 Oct 2016 22:26:36 GMT  
Content-Length: 125

{
    "downloads": [
      {
        "siapath":     "qux/bar.txt",
        "destination": "/home/foo/bar.txt",
        "filesize":    8192,
        "received":    4096,
        "starttime":   "2009-11-10T23:00:00Z",
      },
    ]
}
```



#### SiaJS

```
try {  
  const renter = await daemon.call('/renter/downloads')
  // use renter.downloads to check the download progress
} catch (e) {
  // do something with error e
} 
```


Now that we’ve covered the basics of using the API, you can find the complete API documentation 
[here](https://github.com/NebulousLabs/Sia/blob/master/doc/API.md)
 .
 
[Sia](http://sia.tech/)
  
_, by Nebulous Inc., is a blockchain-based decentralized cloud storage platform._
 
