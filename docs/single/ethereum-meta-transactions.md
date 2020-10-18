---
title: Ethereum Meta Transactions
summary: Introduction Dapps require way too much onboarding. The Ethereum ecosystem needs to push toward mass adoption by allowing new users immediate access to functionality and interactivity without all the hoops to jump through. This means paying the gas for first time users. There is no native method to do this in the Ethereum protocol, yet. However, thanks to public/private key pairs, users can sign meta transactions and incentivize desktop miners to pay the gas for them. Key pairs will exist in you
authors:
  - Austin Griffith (@austingriffith)
date: 2018-11-28
some_url: 
---

# Ethereum Meta Transactions



----


![](https://api.beta.kauri.io:443/ipfs/QmRdqBJda6fGg3C4dCrpjWZ6ki52T33xviV3qRGWjtN61V)


### Introduction
 
**Dapps require way too much onboarding.**
 The Ethereum ecosystem needs to push toward mass adoption by allowing new users immediate access to functionality and interactivity without all the hoops to jump through.
 
**This means paying the gas for first time users.**
 There is no native method to do this in the Ethereum protocol, yet. However, thanks to public/private key pairs, users can sign 
_meta transactions_
 and incentivize 
_desktop miners_
 to pay the gas for them.
 
**Key pairs will exist in your browser first and will be generated automatically.**
 The cypherpunks are really going to hate this one, but users shouldn’t be bothered with downloading a wallet up front. First, they need to use the product and provide value within the Dapp. Once they receive some tokens or Ether, they should be prompted to move to a wallet like MetaMask or Trust.

----


### Basics
I want to cover a few underlying concepts to lay the groundwork for explaining meta transactions on Ethereum. Scroll away cryptography gurus…

#### Hashes
Hash functions take in information of varying size and map it to a predictable (deterministic) result of an arbitrary size. It’s a great way to take a bunch of information and get a small, digestible “fingerprint” of the data. The resulting “fingerprint” for a given input is always the same. 
**If any little thing in your original data changes, the resulting hash will change drastically.**
 

#### Key Pairs
Public/Private key pairs employ some heady math but the concept is simple; A message can be signed with a private key and anyone can use the public key to prove it was signed correctly. To reiterate, 
**I can give you a message along with a signature and using only my public information you can mathematically prove that I signed the specific message**
 . A private key is very sensitive and should never be moved around. A public key can be shared far and wide. Your Ethereum address is your public key and it 
[acts as your identity](https://twitter.com/AlwaysBCoding/status/995753516001001472)
 .
> A public key can also encrypt a small message too. Then, only the owner of the private key can decrypt the message. This isn’t really important here, but it’s cool so I thought I should share. :)


----

> From @cooganbrennan: “By signing a hash of data you achieve three things:

> non-corruptibility: you know the data has not been tampered with

> identity: you know the transaction is definitely from the person who sent it

> non-repudiation: the person who sent it can not rescind the transaction later”


----


#### Transactions
In order to interact with the blockchain, you need to send a transaction. A transaction consists of a few parts and I like to use the snail mail analogy:



 * To address: An Ethereum address the transaction is going to. This could be another a person or a smart contract. Analogous to the address on the front of the envelope of a letter you are sending.

 * Value: This is like putting a little cash in the envelope for the recipient.

 * Data: This is like the contents of the letter you are sending. This is usually empty when you are just sending value.

 * Nonce: Since this is digital, it can be replicated. To protect against the same letter getting sent twice, we keep track of a count. This acts like an identity of the envelope itself. (Another good analogy for a nonce is a check’s number. The bank technically shouldn’t cash a check from a nonce previous to the last-cashed check’s nonce)

 * Gas Price: This is like some loose change you put in your mailbox to incentivize the mailman to deliver the message. The more change you leave the higher the likelihood the busy mailman will grab your letter.

 * Gas Limit: This is like a limit of how far your mailman should travel. Let’s say he ends up going to the other side of the earth to deliver your message that is meant to go around the block… you want to avoid that because you’re paying for his trip.

 * Signature: Finally, all the data above is hashed and you seal the envelope with a signature that proves its exact contents are verified by you.
> This is a very loose analogy and I have many more. Let’s have a beer and discuss it at length. Find me at Devcon.


#### Smart Contracts
My grandfather told me a story about his brother who used to grow tomatoes in his backyard in Kansas. He would put the last night’s harvest in a box on the front step with a scale with an asking price. Every night he would go out and collect the money from a cigar box. This system relied heavily on trust. A smart contract is like this, but it’s backed by math, not trust.
I like to think of a smart contract like a set of rules with storage. There are 25 tomatoes in the box and the rule is 15 cents for a pound of tomatoes. If you send an envelope with 30 cents in it to the cigar box, two pounds of tomatoes will be transferred to your address. This will continue until there are no more tomatoes left. At the end of the day, the contract owner can empty the cigar box because he proves who he is with is private key.
Contracts can also talk to other contracts. They can even do the trick we talked about earlier where they prove a specific message was signed by a particular account. This concept is the heart of the trick…

----


### Meta Transactions
First, I craft a transaction similar to the structure of a traditional Ethereum transaction, but I also add in some extra information:



 * Data: The contents of the letter is more complex. It is encoded information detailing a list of actions to take including a hash of the name of the function to call along with arguments to pass to that function.

 * Reward: Economics are important to incentivize a decentralized system. If you want ‘desktop miners’ to pay the gas to submit your transaction, you’ll need to pay up. These funds will not come from your account. They will come out of the identity proxy smart contract. **Ether or tokens can be used to pay miners.** 

 * Requirements: There can be extended requirements that are checked within the smart contract too. One example is a chronological check. Let’s say the transaction can only go through at the end of the month. The contract can verify this.
Next, instead of sending my transaction directly to a smart contract, I’ll send it to a secondary network. The network can parse my request and make sure my signature is valid. They then choose what transactions are worth submitting and interface directly with the blockchain.
Finally, when my proxy contract receives my transaction sent from a third party, it will parse the instructions, pay the third party, and execute my commands. These instructions could be sending tokens, calling functions, or anything a normal blockchain transaction can do.

### Demo Screencast of Ethereum Meta Transactions

<iframe allowfullscreen="" frameborder="0" height="300" scrolling="no" src="https://www.youtube.com/embed/6r3SqCcEVU4" width="512"></iframe>


----


### Conclusion
Using this method we are able to interact with the blockchain from accounts that don’t hold any Ether. This is may be necessary to drive mass adoption of Ethereum. 
**Users don’t care about decentralization or private keys; they care about using your Dapp to do something important to them.**
 

#### Universal Logins
Another great use case for this technology is ‘ 
[Universal Logins](https://youtu.be/qF2lhJzngto)
 ’. You should store your Ether in a “cold” wallet and use that to charge up a proxy contract. This contract will hold funds and tokens on your behalf and act as your on-chain identity. Then, as new devices come in and out of your life, you can tell your identity proxy to trust them. These devices never hold funds and their private key is never moved. At the same time, they are able to interact with the blockchain using meta transactions.

----

Thanks for checking out meta transactions on Ethereum. Hit me up on Twitter: 
[https://twitter.com/austingriffith](https://twitter.com/austingriffith)
 or learn more about me here:

### Credits and Inspiration:
@avsa — 
[https://www.youtube.com/watch?v=qF2lhJzngto](https://www.youtube.com/watch?v=qF2lhJzngto)
 
@mattgcondon — 
[https://twitter.com/mattgcondon/status/1022287545139449856](https://twitter.com/mattgcondon/status/1022287545139449856)
 && 
[https://twitter.com/mattgcondon/status/1021984009428107264](https://twitter.com/mattgcondon/status/1021984009428107264)
 
@owocki — 
[https://twitter.com/owocki/status/1021859962882908160](https://twitter.com/owocki/status/1021859962882908160)
 
@danfinlay — 
[https://twitter.com/danfinlay/status/1022271384938983424](https://twitter.com/danfinlay/status/1022271384938983424)
 
@PhABCD — 
[https://twitter.com/PhABCD/status/1021974772786319361](https://twitter.com/PhABCD/status/1021974772786319361)
 
 
[gnosis-safe](https://github.com/gnosis/safe-contracts)
 
 
[uport-identity](https://github.com/uport-project/uport-identity)
 

![](https://api.beta.kauri.io:443/ipfs/QmTD27DHrZAzDQxDqA9ac8tN3zvUVnTP3pu1WVJaXYCjKP)

