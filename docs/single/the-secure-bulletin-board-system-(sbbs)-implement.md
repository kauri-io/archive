---
title: The Secure Bulletin Board System (SBBS) implementation in Beam
summary: Beam is built on Mimblewimble protocol¹, a wonderful piece of technology that achieves confidentiality while significantly improving blockchain scalability. However, this comes with a significant caveat. In Mimblewimble there are no addresses, and transactions need to be built interactively by the participating parties. That poses a challenge- if Alice wants to send money to Bob, both their wallets have to connect and perform the necessary actions. Creating a direct socket connection every time
authors:
  - Beni Issembert (@bissembert)
date: 2019-06-23
some_url: 
---

# The Secure Bulletin Board System (SBBS) implementation in Beam


Beam is built on 
[Mimblewimble](https://docs.beam.mw/Mimblewimble.pdf)
 protocol¹, a wonderful piece of technology that achieves confidentiality while significantly improving blockchain scalability. However, this comes with a significant caveat. In Mimblewimble there are no addresses, and transactions need to be built interactively by the participating parties.
That poses a challenge: if Alice wants to send money to Bob, both their wallets have to connect and perform the necessary actions. Creating a direct socket connection every time is not really practical (most people sit behind 
[NATs](https://en.wikipedia.org/wiki/Network_address_translation)
 ). Also, what if Bob’s computer is offline at the moment Alice wants to send funds?
 
[Beam](https://www.beam.mw/)
 ’s Secure Bulletin Board (SBBS) system solves this problem and makes Beam user experience exactly the same as we are used to on Bitcoin and other currencies.
With SBBS client wallets can exchange messages even if they are currently offline by store-and-forward Beam nodes. The system is cryptographically secure with public key cryptography, encrypted over state-of-the-art elliptic curve cryptography (ECC). It leverages the existing public key infrastructure of Beam to implement a bulletin board system, relayed by Beam’s nodes and received by client wallets. This will usher in messaging in crypto with the same privacy, security, and decentralization, as expected from the highest standards of cryptography, and with no central point of failure.

### Computerized Bulletin Board Systems — A Dinosaur from the eighties?
A bulletin board system is a computer server running a software that allows users to connect with a client. Once logged, the user can upload or download messages through public message boards or private email, as well as file downloads (often text files), and if the client allowed, direct chatting and even text-based multiplayer games.

![](https://ipfs.infura.io/ipfs/QmPg5VmNbbwGkLpWD1LyaUgY8jqvtB6LNZFJrezP9Ws7oL)

It used to dominate the internet experience during the decade of the 80s due to the introduction of modems. BBSes were a precursor to the modern internet. They required a direct point-to-point connection with your modem to the server. In modern terms, there wasn’t a website URL, but a phone number which had to be dialed. Users were welcomed to a subculture of elaborate ASCII-art logos and text files with instructions. Relics of that era have been curated in 
[textfiles.com](http://textfiles.com)
 , as well as documented in 
[bbsdocumentary.com](http://www.bbsdocumentary.com/)
 

![](https://ipfs.infura.io/ipfs/QmX292nQ7ve26YUeuY7mKFPLUJwV7X3r1g2earozdF29SF)

Fido became the first network of BBSes, which means that BBSes could call other Fido nodes and exchange messages between them worldwide, 
[FidoNet](https://www.fidonet.org/inet92_Randy_Bush.txt)
 . This was particularly challenging since different hardware couldn’t communicate with each other at them time, Fido abstracted all this from the user. A university network equivalent was 
[BITNET](https://en.wikipedia.org/wiki/BITNET)
 . The nodes were maintained by volunteer “SysOps.” It was the first time users would send electronic messages relayed across the planet with the only expense of dialing a local node.
Run by hobbyists, FidoNet had become highly efficient in compression and transfer, and peaked to 45,000 systems with millions of users across the world and a whopping 8MB a day of compressed public messages.
BBSes reached their peak during the first half of the 90s, until ISP dial-up internet and the user-friendliness of web browsers like Mosaic took over. Faster internet allowed general-purpose protocol like TCP/IP to take over, which were prohibitive on slower networks. Dial-ups required a single connection to the ISP, which serve as gateways to the entire network over the World Wide Web with hypertext, text with embedded 
[links](https://medium.com/@Ronenl/the-secure-bulletin-board-system-sbbs-implementation-in-beam-a01b91c0e919)
 to other texts which can be accessed by web browsers.
When logged into a BBS, users would see a list of messages and a list of files from the node. These messages would be the equivalent of email, yet some of them were addressed to a bulletin board, which meant they are public for anyone to read. Public messages were an equivalent to social networks such as Twitter, in which public messages can be filtered by threads and topics (in Fido it was termed “ 
_echoes_
 ”). It was far from instantaneous, a message from across the world could take several days to be relayed across nodes.

### Beam’s Secure BBS

![](https://ipfs.infura.io/ipfs/QmSkCy4EF2v46YxRr69si3Hkkvmvu53ibTwR4h65Rn1ywW)

The architecture of BBS can be replicated with Beam’s nodes and wallets, as described in the 
[GitHub repository](https://github.com/BeammW/beam/wiki/Secure-bulletin-board-system-%28SBBS%29)
 . The wallet is the computer terminal with a modem, Beam’s full nodes are the BBS nodes, and they relay the message between them. In BBSes, messages are private when addressed to an individual, with Beam’s secure-BBS, such messages are encrypted with a public key before they are sent, using state-of-the-art elliptic curve cryptography. Other messages can be public, that is, not encrypted, and sent to specific channels.
Users will be able to communicate with each other in a secure asynchronous way. They can be offline, and their message will be waiting on the node, received upon sync.
The full nodes form a store-and-forward network, which receives messages and stores them in a database, relaying them with a distributed hash table (DHT). Clients (wallets, in out case) subscribe to notifications from the nodes for new messages. They select a channel to listen and timestamp the call to avoid receiving old messages. If a message is addressed to him, he will be able to decrypt it.
The public key infrastructure is already in place. The cryptographic primitives are those from libsecp256k1, which are both modern and battle-tested in Bitcoin, as well as other cryptocurrencies. The recipient’s public key is his Beam cryptocurrency address. The only work left to do is establish a messaging protocol based on computerized BBSes.

### Alice and Bob connect



 * Alice and Bob pick or generate a keypair: public ( _pK_ ) and private ( _sK_ ).

 * They choose a channel or ask the BBS server (a node) for one suitable.

 * They subscribe to the channel if needed.

### Alice sends a message



 * Alice chooses the recipient, Bob, and uses his public key ( _B-pK_ ).

 * She creates a message, includes in it her public key ( _A-pK_ ) for a response.

 * She encrypts the message with Bob’s public key ( _B-pK_ ).

 * She sends to the BBS server (the node).

### Bob receives the message



 * Bob receives a message from the BBS server (the node).

 * He updates timestamps for the message channel.

 * He tries to decrypt the message using his known key for the message channel.

 * If successful, he notifies the wallet.

![](https://ipfs.infura.io/ipfs/QmTLtNBbpqwoD6dhrHwdhZ6iFxZmq7SKdsgmmUJh3TmUw6)


### Conclusion
> “Privacy is necessary for an open society in the electronic age. Privacy is not secrecy.” “Privacy is the power to selectively reveal oneself to the world.” “Since we desire privacy, we must ensure that each party to a transaction have knowledge only of that which is directly necessary for that transaction.”

These are snippets from the 
[cypherpunk’s manifesto](https://www.activism.net/cypherpunk/manifesto.html)
 , by Eric Hughes, published in March 1993. They battled in code to build a system in which anonymity is the default and one discloses his identity when desired, and only when desired. For this, they required an anonymous electronic transaction system, of which the first successful implementation with no central point of failure was Bitcoin. Beam improved on it with its Mimblewimble implementation, improving privacy in a scalable way with Confidential Transactions and CoinJoin.
Beam will furthermore open its nodes to allow for private communication channels and a decentralized message relay protocol. Thus, both value and communication can be sent in a secure channel. Beam believes this will not only make it easier for the user to transact, but also will enable to verify an address before irretrievably sending funds. Payment requests could be issued, as well as official notifications.
Furthermore, thanks to public key cryptography, the authenticity of the sender can be verified with their digital signature. Public keys can be exchanged in person, allowing for increased confidence in the communication channel.
As the cryptocurrency networks mature, so must communications on the networks, and not rely on black-boxed, non-sovereign third-party apps like Telegram, Slack, or Discord. No private company, government, or army would rely on these for confidential communication as they do with public key cryptography and elliptic curve encryption.
Beam pays a lot of attention to user experience, and SBBS comes in to hide the complexities of Mimblewimble from the end user and the experience easy. I believe that if a cryptocurrency hopes for mass adoption, it must be necessarily be decentralized, permissionless, have great privacy and great user experience.
Beam is offering these properties and more. Hopefully other cryptocurrencies will follow suit.

### References



 * Poelstra, A. (2016). Mimblewimble. Retrieved from [https://download.wpsoftware.net/bitcoin/wizardry/mimblewimble.pdf](https://download.wpsoftware.net/bitcoin/wizardry/mimblewimble.pdf) 



---

- **Kauri original title:** The Secure Bulletin Board System (SBBS) implementation in Beam
- **Kauri original link:** https://kauri.io/the-secure-bulletin-board-system-sbbs-implementat/cc964fc41c434ed3a51cafab51ebbc2c/a
- **Kauri original author:** Beni Issembert (@bissembert)
- **Kauri original Publication date:** 2019-06-23
- **Kauri original tags:** beam, mimblewimble, privacy, privacy-blockchain
- **Kauri original hash:** QmT3CdcBo73cog6XACwZVC8HBdHPoYAiYrdFmiEVrbmbCZ
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



