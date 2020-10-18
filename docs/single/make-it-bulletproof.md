---
title: Make it Bulletproof
summary: An-depth breakdown of Zero-Knowledge Proofs and Benedikt Bünz’s brainchild. Let’s say it’s 2030 and every single institution now uses distributed ledgers as a database. Everything’s working as it should; auditing is quick and easy because it’s so easy to trace back mistakes, there’s no more central point of failure, important private information is less vulnerable to attack, and there’s real-time transparent updates of the network’s state. Wait, rewind that. Real-time transparent updates of the
authors:
  - Ramy Zhang (@ramyjzhang)
date: 2019-01-14
some_url: 
---

# Make it Bulletproof


### An-depth breakdown of Zero-Knowledge Proofs and Benedikt Bünz’s brainchild.

Let’s say it’s 2030 and every single institution now uses distributed ledgers as a database. Everything’s working as it should; auditing is quick and easy because it’s so easy to trace back mistakes, there’s no more central point of failure, important private information is less vulnerable to attack, and there’s real-time transparent updates of the network’s state.

Wait, rewind that.

Real-time transparent updates of the network’s state? Wouldn’t that mean that if a company were using a blockchain as their underlying database, the salary of every single employee could be easily viewed and traced through history?

Well, not as easily as you might think, because 
[distributed ledgers like blockchain are, after all, pseudo-anonymous](https://www.blockchain-council.org/blockchain/how-is-blockchain-verifiable-by-public-and-yet-anonymous/). However, since most people re-use addresses, it’s a lot easier than it should be to 
[trace transaction graphs](https://www.researchgate.net/publication/271855021_Bitcoin_Transaction_Graph_Analysis)
 and associate transactions back to the individual. So we can see that this becomes a huge liability in a corporate setting where employees will want to keep their compensation private.

This isn’t the only case where the complete transparency of blockchain becomes rather inconvenient; the truth of it is that, while criminal actors will always be willing to splurge on a guarantee of privacy _regardless_ of the transparency of the network, it’s simply not a priority for average people like you and me to gather up the money to pay for that kind of anonymity.

So how do we fix this?

## Humble Beginnings

One of the first steps to better confidentiality was taken by Gregory Maxwell’s 
[Confidential Transaction](https://www.mycryptopedia.com/what-are-confidential-transactions/)
 proposal for Bitcoin, where the inputs and the outputs of each transaction are cryptographically encrypted so that the true values cannot be seen. This keeps the amounts transacted secret, which decreases a lot of risk for people, especially those who are moving large sums.

Confidential Transactions are facilitated by something called _Petersen commitments_, which essentially allow you to commit to a certain value without necessarily revealing that value to anyone until you choose to do so. Petersen commitments operate under the 
[discrete logarithm problem](https://en.wikipedia.org/wiki/Discrete_logarithm_problem), which is a type of one-way computation. In other words, it’s totally infeasible to compute the input from the output. This not only makes Petersen commitments really tough to crack, thus keeping your value safe, but also forces the person sending the transaction to commit to that value, thus _binding_ them to that commitment.

![](https://api.beta.kauri.io:443/ipfs/QmTArfrR4qC5qVEZJbb854GGiK6wuTPgDf1RckB17nfhe1)

What’s awesome about Confidential Transactions is that they’re _homomorphically encrypted_, which means you can perform different operations (like adding and subtracting) on the encrypted values but have the true result still be computationally correct. This gives a lot more freedom and flexibility to different institutions looking to adopt blockchain.

Unfortunately, because there’s so much added bulk after you encrypt all these transaction inputs and outputs, Confidential Transactions are super heavy. This is a huge problem if we want to implement them, as one of Bitcoin’s major problems right now is scalability. Confidential Transactions as they are right now will also cause many problems for people running nodes on lower-end hardware. Not only that, but they make it really difficult to verify the validity of each transaction.

Beyond Confidential Transactions, zkSNARKs are also another, more complete, potential solution to the privacy problem. They hide not only the transaction amounts but also the senders and the recipients themselves — it’s the proof of knowledge protocol that projects like Zcash have implemented. They also allow you to verify all these transactions without needing to know what the transactions really were to begin with.

So what are they really? zkSNARK stands for 
**Zero-Knowledge Succinct Non-Interactive Argument of Knowledge.**
 Whew! That was a mouthful; let’s break that down.
 
**Zero-knowledge** proofs are the basis of what we’ll be looking at today; they’re important because they allow anyone to prove that a certain piece of information is valid without actually having to show what that piece of information was.

Imagine a zero-knowledge proof as a situation where you want to prove to your colour-blind friend that you know the colour of each of the two pens you’re holding — without actually revealing which one is what colour. You give the pens to your friend, and ask them to hide the pens behind their back. Your friend will switch the pens from hand to hand or keep them in the same hands as they wish, and bring them back out to ask you if they’ve switched the pens or not. At first, if you were also colourblind you’d have a 50% chance of guessing correctly; however, the possibility to guess correctly slims down at a really fast pace until you’re in the decimals of probability in later rounds.

![](https://api.beta.kauri.io:443/ipfs/QmTGJmJoJsQzt6JYepm21PmRAXNW1qn5MogumkY89hTF8z)

The **succinct** part tells us that the proofs themselves are really, really fast and really, really small; think in the scale of mere milliseconds and bytes. This is important for protocol implementation, because as I’ve mentioned previously, one of blockchain’s biggest issues right now is scalability and speed. We need every aspect of the technology to be as efficient and compact as possible.

Lastly, the very first zero-knowledge proofs needed multiple rounds of back-and-forth between the prover and the verifier (as you can see in the diagram above) to be able to validate a certain piece of information, but the keyword **non-interactive** here shows that zkSNARKs actually consist of one single interaction between the prover and the verifier, which is part of why they can be so tiny.

So zkSNARKs sound pretty much like the complete package — they’re fast, zero-knowledge, and from a user’s point of view, relatively simple. Unfortunately, as with anything in this space, there’s a catch; zkSNARKs require a preprocessing method called a _trusted setup._ The trusted setup is what allows zkSNARKs to be succinct in the first place, but it’s also their greatest weakness.

Before we start, let me introduce to you my friends _Peggy the Prover_, _Victor the Verifier_, and _Tiana the Trusted Party_. They’ll help guide us through these following breakdowns.

To replace the interactive challenge/response protocol of previous zero-knowledge proofs (that were just back-and-forths between Peggy and Victor), in zkSNARKs a new character is introduced — Tiana. Tiana sits between Peggy and Victor. She encrypts all new incoming queries with a special secret key before passing on the garbled messages to Peggy, who performs some impressive computations on the encrypted queries to make a short proof of the validity of the query.

While Peggy’s doing that, Tiana users another short _verification_ key to encrypt the answers to the query, and passes on those answers to Victor. Victor takes these short answers together with Peggy’s short proof and is quickly able to verify the validity of Peggy’s proof. Every time after each interaction, Tiana has to destroy both the initial secret keys and the verification keys so that no repeated forgery of transactions with these two keys can happen.

You can sort of see the problem here: what if Tiana was actually feeling a little malicious that day and decided to secretly keep the keys after the transaction and continue on to use them to prove and verify her own transactions?
This is a big problem; because of this setup, each person needs to _trust_ that this third party will effectively destroy all these secret keys once the interaction is complete. Because these keys not only help create the proofs for the transactions, but also help to verify them, if they remain in the wrong hands they can be used to forge transactions with fake verifications, allowing that individual to make currency out of thin air — without anyone ever knowing.

So with Confidential Transactions we got computationally heavy privacy, with zkSNARKs we get short zero-knowledge proofs that require a little too much trust to be completely secure. What now?

## Bang Bang, Bulletproof

Before we throw ourselves into the details of how these work, let’s talk about why exactly Bulletproofs are so exciting. Bulletproofs combine the best of both worlds of zkSNARKs and Confidential Transactions; they’re smaller than CTs, don’t need trusted setups, and allow for zero-knowledge verification of transactions. In fact, they’re so good that Monero actually released an upgrade with Bulletproofs implementation just this October 18th. Not to mention, because Bulletproofs are a lot smaller than nearly anything we’ve seen before, Monero’s 
[fees have fallen by 96%](https://www.coindesk.com/monero-fees-fall-to-almost-zero-after-bulletproofs-upgrade/) as a result. This is awesome news!

At a very base level, just like zkSNARKs, Bulletproofs are zero-knowledge proofs of knowledge, specifically a type of range proof. Range proofs verify that a certain committed value exists within a certain range without necessarily revealing any real information about the value. So fundamentally, Bulletproofs really give a probabilistic result.

Digging deeper, Bulletproofs operate under the discrete logarithm assumption (which means you assume the difficulty of cracking discrete logarithm problems is near impossible), vastly reducing their size.
They also leverage the Fiat-Shamir heuristic, which is a method that essentially collapses multi-round challenge/response zero-knowledge protocols into one single non-interactive proof, which is what we need to keep things light. As compared to the Trusted Setup that zkSNARKs use, this is a more trustless method. Let’s take a closer look at how this elegant solution works!

## Non-Interactive Proofs and the Fiat-Shamir Heuristic

I’m gonna bring in Peggy and Victor again to make this a little more digestible.

So Peggy has this transaction that she wants to have Victor validate. She 
[hashes](https://medium.com/@ramyjzh/cryptographic-hash-functions-wait-what-35128a8960a6) the transaction, getting a value _x_, and then takes a base _g_, putting it to the power of _x_. So we have something like this: 
_y = g_^ _x_, where the transaction hash becomes the [discrete logarithm](https://www.youtube.com/watch?v=SL7J8hPKEWY) of _y_ base _g_. 

Easy to compute, hard to crack.

Peggy then takes a random number _v,_ and computes _t = g^v_. After that, she finally hashes _g, y,_ and _t_ all together to obtain a value _c_.
She’s not done yet! Peggy whips out her calculator to compute the following:

![](https://api.beta.kauri.io:443/ipfs/QmfEoTbDAg91wDZYCqzSxne9jSg8wohfEPcEx37tAStgqc)

After this tedious four-step computation, she finally sends over her proof pair (_t, r_) to Victor to have him verify it, and for him it’s as easy as simply making sure that the following is true:

![](https://api.beta.kauri.io:443/ipfs/QmV1sSxGT4FdMDD4tYGNxYMNi2HDRrH86EALKMXyWJJ3wJ)

How does this one single operation prove that Peggy’s proof was valid? It’s because the math checks out:

![](https://api.beta.kauri.io:443/ipfs/QmdL9cd9jFXy2pvB5UcPDkDYyHgdTbitd5cmtHJBxSXvy5)

So as a general rule, these kinds of proofs based on the Fiat-Shamir heuristic will take the longest time to prove, but are really fast when it comes to verification. The process might seem complex, but in reality we’ve essentially condensed the original zero-knowledge proof process of three separate back-and-forths between Peggy and Victor to just one single interaction.

## How it Sizes Up

So Bulletproofs seem great and all, but how do they really compare to all the other zero-knowledge protocols out there today? And there _has_ to be a catch somewhere, right?
Right. So before we take a look into Bulletproofs’ downsides, let’s throw out some quick numbers:



 * Previous range proofs with Confidential Transactions were at a whopping 2.5KiB each. With Bulletproofs, that’s scaled all the way down to 610 bytes.

 * Bulletproofs can aggregate range proofs (which means Peggy combines multiple proofs into one) really well. Case in point: doubling the number of proofs in each group has no significant effect on the size of the proof. 2 becomes 738 bytes, 4 becomes 802 bytes, and 8 becomes 866 bytes. In contrast, a traditional range proof would already be passing the 40,000s of bytes at this point.

 * Multiple outputs in a transaction will only increase the size of a Bulletproof logarithmically, instead of linearly.
So essentially, Bulletproofs are great for a wider variety of proofs; they’re faster, much lighter, and you can use them to prove any kind of information you’d like. They also require no trusted setup the way zkSNARKs do.
Unfortunately, for full-privacy systems like Zcash, Bulletproofs aren’t as efficient as zkSNARKs. While zkSNARKs start out by taking up a lot more memory for each proof despite how fast they are, that initial memory threshold remains constant no matter how many outputs there are. On the other hand, that memory requirement does increase for Bulletproofs, so for completely private large-scale systems, zkSNARKs will eventually end up with the upper hand in terms of scalability.
Lastly, an interesting thing to note that is that Bulletproofs are still very much vulnerable against any kind of quantum attack by because they fundamentally operate under the discrete logarithm assumption. To be fair, this assumption is as good as true for classical computers, but becomes pretty much invalid in the face of quantum computing because it all ultimately boils down to a guessing game (a really long one, that’d normally take thousands of years for classical computers, but only a couple minutes or even seconds for a couple of qubits).

## Final Takeaways



 * Adoption will not happen if we’re not able to figure out the privacy problem in distributed ledger networks.

 * Zero-knowledge proofs like zkSNARKs and technologies such as Confidential Transactions can help us get there, and Bulletproofs are the latest big step in that journey

 * There’s still a long way to go, since distributed ledgers all have their own scalability problems to work out even without the added bulk of zero-knowledge proofs. Everything needs to be 10x as compact and fast than it is today.

 * The quantum computing space is developing quickly, and so it’s becoming increasingly important for us to take into account these tough problems as we move forwards in developing these cryptographic protocols.
> I hope this was helpful! Please let me know any questions you may have in the comments, and any feedback as well. Thank you for reading! Be sure to send me some claps, and follow me for more articles like this. Feel free to connect with me on [LinkedIn](https://linkedin.com/in/ramyzhang/), and reach out to me via [my personal website](http://ramyzhang.com/) as well.


<iframe allowfullscreen="" frameborder="0" height="300" scrolling="no" src="https://upscri.be/7b0181" width="512"></iframe>

