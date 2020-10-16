---
title: Peer-to-peer hypermedia with IPFS
summary: InterPlanetary File System, also known as IPFS, is a peer to peer media protocol that means to make the web faster, safer, and open sourced. Right now were in need of a system that has fast performance, continuous access to content, efficient data transfer, easy naming conventions, and low cost. Although IPFS is in its early stages, it can do all of these things. What Were Using Right Now In the current implementation of the web, we are using a service called hypertext transfer protocol, also kn
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-19
some_url: 
---

InterPlanetary File System, also known as IPFS, is a peer to peer media protocol that means to make the web faster, safer, and open sourced. Right now we're in need of a system that has fast performance, continuous access to content, efficient data transfer, easy naming conventions, and low cost. Although IPFS is in its early stages, it can do all of these things.

## What We're Using Right Now

In the current implementation of the web, we are using a service called hypertext transfer protocol, also known as http. When we search for content on the web, our computer sends an http request to the server hosting the content. In return the server sends a response with the information we requested.

There are problems with this method:

-   Most applications on the web are hosted by one server. If anything happens to the server, we are not able to access the content anymore.
-   Downloading from a single server is inefficient. If lots of people try to access the same site, browsing and downloading will be incredibly slow.
-   The servers we access information from are usually far away. The further the distance the more expensive it is to access the content.
-   Duplicated content creates wasted space.
-   We depend on others to keep content accessible and secure. Site administrators are depended on to keep websites active and updated and hosting companies on keeping our data safe.

## How it works

IPFS is a decentralized way of storing and sharing files. Objects are kept track of through an address that's associated with the contents of the object. It works using a structure called a merkledag which is a combination of a merkle tree and directed acyclic graphs. Merkledag is a cryptographically authenticated structure of data that uses different cryptographic hashes to address content. It allows for data to link together.

### Peer2Peer

IPFS runs using a peer to peer system. Peer to peer is a network in which other computer systems or 'peers', share files directly between each other. Peers connected together are called a swarm. Every computer using IPFS is called a node. When you access content on the network, your system first looks at nodes near you to see if they have what you're looking for. If it doesn't find it, it will search farther away. When your node finds the content, it will store it for a short period of time. Essentially you become a host for nodes close to you. Multiple nodes can host the same content and thus you no longer have to depend on a single server. It's a swarm of nodes that exchange data.

To reiterate:  

-   You connect to the swarm.
-   Request a file.
-   Your computer looks for the closest peer for a copy.
-   If they don't have it, it will look farther away (the original server).
-   You download the file and host it.
-   With this method you only host files you're interested in.
-   Everyone is a host and a client at the same time

### Content Addressable

Every file is given a unique identifier called a cryptographic hash. The hash is used to search for content on the network. Instead of describing what the file is, it describes what the file contains. If the content of the file changes then the hash will change. This is a tamper proof system because you will know if it's been altered based on the hash. The InterPlanetary naming system, also known as IPFN is responsible for this feature. IPFN is a secure method because there is no way possible to determine what the content is through the hash.

## Why it Matters

### Replication and Distribution

Duplicates don't exist on the network because the hash for a file is based on the contents. If the contents of the files are the same, the hashes will also be the same. Getting rid of duplicates frees up unnecessary space.

### Access and Censorship

Content will always be accessible because it's available from multiple sources. For this reason, content is difficult to censor. Attacks would have to be directed at all nodes containing the content. Weak links or failing points in the system don't exist because there will always be another node. As well, since the hash points to the content and not its location, content will always be accessible because there is no such thing as a broken link.

### Speed

Everyone serves each other content and thus you don't necessarily have to access far away servers. This allows it to be a quick system regardless of how close you are to the original host. If a file is too large (bigger than 256 kb) it's broken down into smaller pieces and joined together when it reaches the user. Smaller pieces of information travel faster.

## Downfalls

IPFS is a system that only works if people are actively participating in it. Although, if people are participating, content will be available forever but only if people want it to be there. As well, personal information is not secure on this system. Personal information would be challenging to keep designated to one node because of the way information is shared in IPFS.

## Implementations

Before we install IPFS, here is a brief introductory to familiarize yourself with the different interfaces.

### Command Line Tool:

The IPFS protocol comes in two different languages: Go and JavaScript. In the future we can expect to see a Python implementation.

**go-ipfs** : The main IPFS platform. It's a command line tool with a daemon server, HTTP API for controlling the node, and an HTTP gateway to serve content to HTTP browsers. It features all the commands necessary to control your own IPFS node.

**js-ipfs** : The JavaScript browser implementation. Allows you to start an IPFS node directly in your program or control a node that is already running through HTTP API.

In our tutorial, we are going to be using the Go implementation. For more information on **js-ipfs** visit the [link.](https://js.ipfs.io/)

### Browser extension

The browser extension also known as the companion, allows the user to view short detailed information about their node. The companion is available on [Chrome](https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch?hl=en) and [Firefox.](https://addons.mozilla.org/en-US/firefox/addon/ipfs-companion/) Information includes version, gateway, API, and the number of peers connected. It has the capability to share files and switch to a custom or public gateway.

In the next tutorial we will not be covering the browser extension. To learn more click the [link](https://github.com/ipfs-shipyard/ipfs-companion).

![](https://api.kauri.io:443/ipfs/Qmevyp8k7QKnE8WAmBb6LrmvvarVXFZ4mcyrpCFmXLF1Tx)

### Local Webhost

Once you have connected to the daemon server, you can access your own personal web host to see the status of your node. You'll be able to read information such as network traffic, bandwidth, and peers. The local webhost is a more advanced version of the browser extension.

<http://localhost:5001/webui>

![](https://api.kauri.io:443/ipfs/QmY38K1ps2iG2DsYcWbq9nc9Y4uz2PA3PmD9q12R8Z5Bno)

The status page allows the users to check information in regards to how their node is running on the network.

![](https://api.kauri.io:443/ipfs/QmdCspQhUqUsXHSUpL85mdJkmwfJJE2vSf35bbko9X6N3s)

You can upload files to your node directly in the browser as well as explore files on other nodes if you know the hash of the content. 

![](https://api.kauri.io:443/ipfs/QmNcLG5bmCGRK4AbfHgEQBqZoR3pABMwNwY2Q6Gd8KS3uf)

![](https://api.kauri.io:443/ipfs/QmNcLG5bmCGRK4AbfHgEQBqZoR3pABMwNwY2Q6Gd8KS3uf)

The web interface is the ultimate tool for checking the status of your node and managing your files.

## Conclusion

IPFS is a system that allows the web to be more reliable and robust than what we have right now. It saves us money by not having to rely on servers that are far away. The content we want is always available to us because we have the option of pinning it forever. If a server goes down, it's not an issue because we can access the information from somewhere else. IPFS and Blockchain are both headed in the same direction; towards a decentralized system. It's fast, reliable, and space efficient so what are we waiting for?

## Next Steps

- <https://docs.ipfs.io/introduction/usage/>
- <https://www.sitepoint.com/http-vs-ipfs-is-peer-to-peer-sharing-the-future-of-the-web/>
- <https://medium.com/@ConsenSys/an-introduction-to-ipfs-9bba4860abd0>
