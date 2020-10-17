---
title: Introduction to Cryptography 
summary: Disclaimer- The content of these research summaries has been written after a year of reading, researching and writing about blockchain technologies and applications. Definitions may vary depending on the paper cited. The summaries provided are subject to further iterations; whereby, the first version relies on my personal understanding of the industry and the technologies. Most of it is based on informal discussions, academic papers, industry whitepapers and primary research. These research summ
authors:
  - Kauri Team (@kauri)
date: 2019-05-01
some_url: 
---

>Disclaimer: The content of these research summaries has been written after a year of reading, researching and writing about blockchain technologies and applications. Definitions may vary depending on the paper cited. The summaries provided are subject to further iterations; whereby, the first version relies on my personal understanding of the industry and the technologies. Most of it is based on informal discussions, academic papers, industry whitepapers and primary research. These research summaries may foster from previous research but do not replicate any ideas or content created previously. 

For comments, references, contribution proposals etc. please contact Anais Urlichs on [Twitter](https://twitter.com/urlichsanais), [LinkedIn](https://www.linkedin.com/in/urlichsanais/) or email under urlichsanais@gmail.com 

This article was originally authored by [Anais Urlichs](https://twitter.com/urlichsanais)

##Overview
Blockchain based systems are built on cryptographic mechanisms to keep the information appended to the ledger secure. Cryptography entails the set of mathematical computations that distort information to keep it secure from third-party interception. Overall, the owner of a message should be able to encrypt the plain-text with an encryption key and send it over a network of nodes or individuals to the receiver. With the ownership of a secret key, the receiver should be able to decrypt the message into its original format. Any party that is routing or manages to intercept the encrypted message should not be able to access its plain-text. 

Cryptography is not a new concept; it has been used for centuries to securely communicate between several parties. However, people did not have a standardised format of encrypting messages. Thus, it was necessary to agree on an encryption key while the parties met in person. In comparison, if they would have agreed on an encryption key over messages, they could not be sure that no one has gained access to the key and would be able to decipher the messages. In the case of long-distance, analog or digital communication, the communicating parties often do not have the option to meet and agree on an encryption key in person. Furthermore, with the development of computers and the internet, previously used encryption keys become easy to intercept and decipher. Thus, new encryption standards were developed to retain privacy and security in communication and storage of information.

The blockchain ecosystem is often compared to the development of the Internet since it follows similar steps in development and user adoption. With the advancement in usability of the internet, the underlying technology became more and more abstracted. Today, the average internet user does not have to know in what format their password is stored on servers, how companies verify user credentials, nor how data packages, such as emails, are communicated securely. However, in the case of blockchain, storing, transferring and validating information requires the user to take ownership of their encryption keys. Responsibility is assigned back to the user. Thus, to make this work effectively decentralised applications have to provide user education. While there are many projects (such as MyCrypto) that aim to make the technology as user friendly as possible, there is no project that can securely take ownership of the users’ signature credentials. An educated users, following best practices to ensure the security of her/his own credentials will remain to be more secure than most business solutions available. The latter often allows a company to store all of their users’ credentials at one place, making their system highly attractive for attackers. 

This summary will provide an introduction to the type of cryptography used in blockchain systems. 

##Symmetric encryptions
Symmetric encryption was the first form of encryption. The security of the message relies on one secret key that is used to encrypt and decrypt the plain-text message. The main drawback is that it requires the trusted parties to securely share the key with each other before transferring any other messages. The transfer either relies on additional cryptographic mechanisms or the key has to be shared in person. Transferring the key over a network would risk that a middleman intercepts the message and obtains the key. Once the middleman has the key, she/he will be able to decipher any future messages that have been encrypted with the exact same key. Thus, any key transfer requires both parties to agree on a key without revealing the key. A malicious actor, who intercepts the messages, would only know the information that both parties publicly agree on but not their individual secrets that are required to construct the key.

![Alice shares key with Bob](https://api.kauri.io:443/ipfs/QmPBby41gs3w9oDYc41LJveNwPdt9kkpGH2q7Yty93vf3E)
**Figure 1** Alice shares the secret key with Bob; Bob shares the encrypted message; Alice decrypts the message with the same key.

An example for symmetric encryption is the Vigenere Cipher. Participants, who wish to communicate with each other, share a decryption/encryption table and a key that has to be used in connection with the table. An example is the one provided below on the right. The user takes the plaintext that they wish to transfer. Then she/he maps each letter of the key to the according letter in the plaintext to generate the keystream. To encrypt the plaintext, the user simply maps letter 1 of the plaintext on the y axis and letter 1 of the keystream on the x axis. The letter at the point where both lines intercept is the according encrypted letter. To decrypt a message, the process is executed the other way around.

![Vigenere Cipher](https://api.kauri.io:443/ipfs/QmS47hwe5RR7KzUrWV18QRtBjYKR89pyNKLszSKvRLragY)
**Figure 2** Example of symmetric encryption -- the Vigenere Cipher [[Source](https://eu.udacity.com/course/intro-to-information-security--ud459])]


Again, to ensure that the Vigenere Cipher is secure, users will require secure access to the table and more importantly the secret key. If any of the communicating parties change, the group has to agree on a new key. 

Generally, symmetric encryption is not that secure. Asymmetric encryption has been developed to improve upon the security flaws of symmetric encryption.

##Asymmetric encryption
While symmetric encryption relies on one secret key to both encrypt and decrypt the message, asymmetric encryption relies on two separate keys; one public key and one private key. Thus, asymmetric encryption is also referred to as public key cryptography. The public key is used to encrypt a message and the private key is used to decrypt the message. In the case of symmetric encryption, the owners of the key has to be careful whom to share the key with. In contrast, asymmetric encryption allows the owner of the key pair to share the public key with anyone they would like since the public key is only used to encrypt the message. It does not allow to decrypt the message. However, the private key should never be shared with any other party. Only the private key will allow to decrypt messages securely. Anyone who got hold of someone's private key will be able to decrypt any message that is intended for that person. Note that private-public key pairs are unique, there is no copy and once the private key is lost it is impossible to recover (without it additional third-party intervention). 

##Types of asymmetric encryption
The most popular asymmetric encryption is RSA. RSA is the acronym for “Rivest–Shamir–Adleman,” composing “the surnames of Ron Rivest, Adi Shamir, and Leonard Adleman, who first publicly described the algorithm in 1978.” [[Source](https://en.wikipedia.org/wiki/RSA_(cryptosystem)])] It is based on the idea that it is quite easy to multiply two prime numbers together but it is a lot harder to factorise those prime numbers. You can read more on this [here](http://crypto.stanford.edu/~dabo/courses/cs255_winter03/rsa-lecture.pdf.).

![Bob accesses Alices Public Key](https://api.kauri.io:443/ipfs/QmXwgTreTqSY6WDyZcTBjD6gPC8LwC36E7savaQa5aQ9GH)
**Figure 3** Bob accesses Alice’s public key (green) to encrypt the message. Once Alice receives the message she can decrypt it with her private key (red).

Another popular asymmetric encryption is based on elliptic curve cryptography (ECC). Points are basically dotted across an elliptic curve to generate a function. The idea is that it is quite easy to compute from this function (function A) another function (function B). However, it is a lot more difficult to compute from function B function A. Imagine it to be like a room with a ball that bounces up and down. When the room is entered, the ball will be in a stagnant position. The observer will not know where the ball has been before, nor how many times it has bounced up and down. Finding the previous positions of the ball in the room is really difficult. Here is a video that offers a high level explanation.

<div align="center"><iframe width="560" height="315" src="https://www.youtube.com/embed/dCvB-mhkT0w" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></div></br>

Generally, both RSA and ECC provide high levels of security. However, RSA would require a much larger key to reach the same level of security as ECC. Thus, generating an ECC key requires less computational power. “To visualize how much harder it is to break, Lenstra recently introduced the concept of "Global Security." You can compute how much energy is needed to break a cryptographic algorithm, and compare that with how much water that energy could boil. This is a kind of cryptographic carbon footprint. By this measure, breaking a 228-bit RSA key requires less energy than it takes to boil a teaspoon of water. Comparatively, breaking a 228-bit elliptic curve key requires enough energy to boil all the water on earth. For this level of security with RSA, you'd need a key with 2,380-bits.” [[Source](https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/])] A problem that both ECC and RSA face is that they are often applied quite carelessly by utilising faulty libraries and/or because developers believe that their level of understanding of encryption is sufficient to implement it. However, most projects utilise RSA encryption. This is mainly because ECC and the development behind it is heavily patented, which restricts open source implementations.

##Hash functions
While asymmetric encryption is great to securely transfer messages between participants and sign messages off (i.e. a user stating that a message is theirs), it is not as practical to use for storing information. That´s where hash functions become more important. A hash function takes an input and produces a unique output, the hash. The input may be a password, an article, transactions etc. The output is a string of characters that uniquely identifies the content that has been provided as input. Using the same hash function, the same input should always produce the exact same hash. Any changes to the input of the hash function will result in a completely different output. This is also referred to as collision resistant hash functions. 

Hash functions should only be one way computable. It should be relatively easy to generate the hash but close to impossible to recover the original input from the hash. The plaintext may only be reconstructed if the user knows the hash function and some property of the plain text. Hash functions can be used to store data or compare data inputs without revealing the actual information. The latter can also be used to reference previous information. For example, when providing a password to a service, it will be hashed and stored. Once the user returns and provides the same password, the hash function will generate an identical hash. When the computer compares the generated hash with the stored hash and they match, the user will be provided access to their account. However, if the hashes do not match, the user most likely provided the wrong password. 

To make a hash function more secure, a random input, called the salt, can be added to the original input before the hashing process. This will result in another output of the hash, making it more difficult to recover the original message from the hash without knowing the salt. 

Hash functions vary in their level of security, application and size. For example SHA hash function has several different sizes that may be applied. [[Source](https://blockgeeks.com/guides/what-is-hashing/])]
1. SHA-224: 224 bits
1. SHA-256: 256 bits (used by Bitcoin)
1. SHA-384: 384 bits
1. SHA-512: 512 bits
1. SHA-3: Size is application dependent

The example [below](https://blockgeeks.com/guides/what-is-hashing/) shows how two different inputs result with the same hash in two completely different outputs. Merely by analysing hashing patterns, it is impossible to recover the original input.

![Hash examples](https://api.kauri.io:443/ipfs/QmQq91svuyqRM8bTDnrikSV1ugRZyMf7KYiux6Dy2NLh3W)

**Hash functions in Blockchains**

In the case of blockchain, hash functions are used to represent the current state of the blockchain. A hash function is applied to find the hash of the block, as in the case of PoW. For the first block, the transaction data is taken to produce a unique hash. The first block is called the genesis block. Each additional block is built upon the previous block and can be tracked back up to the genesis block. In the case of mining, the miners will take the block data and hash it together with a nonce. Only the block data with the right nonce, which results in the predefined number of zeros in the hash, will be accepted to the blockchain. The hash of the current block depends on the hash of the previous block. Thus, linking all blocks together. In case the transaction data within a block changes, the hash of the block will change, too. Therefore, if the data of any of the blocks within a blockchain differs from the set that is already hashed, it will not result in the same chain. If all nodes on a blockchain rely on the same chain, then they will not accept an alternative chain with modified information. This property make the blockchain tamper-proof. 

Below is a list of various hashing functions that may be used in PoW mining. Each has indicated how likely it is to utilise ASIC mining rigs to enhance the efficiency gains, i.e. to be more likely to discover the next block through specialised hardware. For more information, please refer to the following [source](https://github.com/ifdefelse/ProgPOW.). 
- SHA256: Utilises ASIC mining
- Scrypt and NeoScrypt: Also enhanced by ASIC 
- X11 and X16R: High ASIC efficiency gains
- Equihash: A bit less benefitted by ASIC
- Cuckoo Cycle: Potential ASIC efficiency gain
- CryptoNight: Potential ASIC efficiency gain
- Ethash: Potential ASIC efficiency gain

Generally, PoW blockchains want to be ASIC resistant to counteract the centralisation of the protocol. PoW mining that is not dependent on ASIC tends to be more decentralised since users do not have to acquire the specialised hardware first. Thus, there is a lower barrier of entry. 

## Blockchains
Most users do not have their own servers at home nor the technical background, which would allow them to take ownership of their data. Instead, they are dependent on third-party companies to take care of the secure and reliable storage of their information; whether these information are personal data related to someone's identity, funds stored at the bank, or passwords to access applications. All these services are provided to users. While this may be quite convenient, it makes the user reliable on third-parties, often having to provide data without receiving anything in return. 

Blockchains apply cryptographic processes, as outlined earlier, to assign ownership to digital value. Users may create a wallet with a unique address (public key) and a private key attached. Any user in the network can have insights to someone's public key and send funds to that address. However, only the user, who holds the private key assigned to that address, can access the funds within. Whenever a user wants to make a transactions, she/he has to provide the destination address of the wallet of another node in the network and sign the transaction with their private key. By signing the transactions, the user unlocks the funds associated to their address. 

This entire process does not require a middleman to process transactions; which might even be the most revolutionary part of blockchain technologies. Instead, users are empowered to take ownership of their funds. On one hand, this is a really great thing since users are able to interact on a trustless and tamper proof basis. No single entity should be able to spend funds, which they do not have. This is primarily ensured through consensus mechanisms. On the other hand, the responsibility of self-storing one’s funds places the user at greater risk. The pubic address is made up of a quite random string of letters and numbers, in case there is a typo, the user may send the funds to a completely random address in the ledger. At that point the funds cannot be recovered. Additionally, the types of wallets that can be used vary in design, security, accessibility and functionality. To use cryptocurrencies securely, it is important to familiarise yourself first with the technical implications and processes.

## Quantum resistance
The promise of quantum computing is to provide faster computers that are able to execute several processes simultaneously. At the moment, computations may be scaled by running several machines in parallel. Normal computers represent information in binary format, in bits, which are either 1 or 0. Different processes allow computers to combine bits and represent more complex information other than 1 or 0, yes or no, on or off, etc. In contrast, quantum computing is based on qubits. A qubit can be in three distinct positions, either 1, 0, or a special quantum state, whereby the qubit is spinning and can appear in several positions at the same time. This is referred to as the superposition state. The following video provides an explanation.

<div align="center"><iframe width="560" height="315" src="https://www.youtube.com/embed/DfPeprQ7oGc" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></div></br>

Quantum particles are not always able to be in the superposition state. This only happens under the right conditions. As soon as the particles become disturbed by external influences such as light, they will fall out of the superposition state. Thus, research in the field is highly dependent on the right conditions. Ruining experiments by mere observation is known as the Heisenberg Uncertainty principle, which is unique to quantum mechanics. You can read more about this [here](https://en.wikipedia.org/wiki/Uncertainty_principle). Furthermore, qubits can be interlinked, whereby multiple qubits are connected and provide more distinct positions than one could do alone. This is called quantum entanglement. While one qubit can represent 3 distinct states, 2 connected qubits can show 9 and 3 qubits can show 27 different states. 

Since quantum computers can execute multiple computations in parallel, they would also be able to break a cryptographic key pairs faster. Currently the research into quantum computing is quite difficult and time consuming. The most qubits that have been connected so far were 72 [[Source](https://ai.googleblog.com/2018/03/a-preview-of-bristlecone-googles-new.html])]. It is suggested that it would take at least 80 qubits to work together to break a symmetric encryption key pair. Even once researcher manage to connect a large amount of qubits together, programs that can run on a quantum computer would have to be developed first before it could become commercialised and exploited to break current encryption standards. 

Despite quantum computers being currently completely inaccessible to the public, there is a concern by users and projects that once they are available, it will not be a matter of time before they have managed to tamper with the cryptography deployed on blockchains. Thus, some projects pride themselves with deploying quantum resistant cryptography, such as lattice cryptography. You can read more about this [here](https://en.wikipedia.org/wiki/Lattice-based_cryptography).

##Zero knowledge proofs
In most public blockchains, the transaction history of every address is openly accessible to anyone else in the ledger. In other words, a user is able to view the address of any node and its associated, on the ledger recorded, transactions. While this ensures transparency and traceability of funds, it also does not guarantee any privacy. Generally, it is quite difficult to associate users with their public address. However, assumptions could be made based on the transaction history or by having given the address from an entity to make a transfer. This may infringe with the privacy of users. 

To prevent any information about an address from leaking to the public, zero knowledge proofs can be used. Zero knowledge proofs verify the correctness of certain information without revealing the data themselves. For example, a night-club visitor could verify that they are over eighteen years old without revealing their actual age. Zero knowledge proofs have to fulfill the following characteristics: Completeness (if the information is correct, then the proof will always be valid), Soundness (if the information is false, then the proof can never be valid), and Privacy (the raw data should not leak to anyone else).

Zero knowledge proofs can be divided into two categories, interactive zero knowledge proofs and non-interactive zero knowledge proofs. The latter requires the prover (who holds the data) and the verifier (who verifies whether or not the data is true) to engage on a set-up ceremony in which they agree on a shared secret. This shared secret is used to construct and verify the proof. In comparison, non-interactive zero knowledge proofs do not require any communication between the prover and the verifier. Generally, interactive zero-knowledge proofs are easier to computer but if another user intercepts the secret set up, then they are able to generate false proofs that look identical to the verifier. 

You can learn more about zero knowledge proofs through the following resources:

<div align="center"><iframe width="560" height="315" src="https://www.youtube.com/embed/HUs1bH85X9I" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></div></br>

[Introduction to Zero Knowledge Proofs](https://www.cs.princeton.edu/courses/archive/fall07/cos433/lec15.pdf)

Privacy-focused projects
- [Zcash](https://z.cash/)
- [Monero](https://www.getmonero.org/)
- [Beam](https://www.beam.mw/)
- [Grin](https://grin-tech.org/)

##Overview
- The security of symmetric encryption relies on one key, the secret key, which is used to encrypt and decrypt the message.
- Asymmetric encryption relies on a key pair, composed of the public and the private key. The public key is used to encrypt messages and the private key is used to decrypt messages.
- Popular asymmetric encryption standards are RSA and ECC. 
- Hash functions are used to create a unique fixed size string that represents the hash of an input. 
- Hash functions are used to find and verify the hash of individual blocks and the included data within a blockchain.
- Zero-knowledge proofs may be used to enhance privacy on public blockchains.











