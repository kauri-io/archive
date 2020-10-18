---
title: Eli Ben Sasson on using STARKs to scale Ethereum
summary: 
authors:
  - Chris Spannos (@chris-spannos)
date: 2018-11-06
some_url: 
---

# Eli Ben Sasson on using STARKs to scale Ethereum



----


![](https://cdn-images-1.medium.com/max/1600/1*FcuL5e94W4FXAmu9w_Uv2Q.jpeg)

<p>
 _Scaling the Ethereum blockchain was top of the agenda at this year’s Devcon4 in Prague. One way to improve scalability is by using STARK technology which provides cryptographic proofs that are zero-knowledge, succinct, transparent and post-quantum secure. Eli Ben Sasson is co-founder and Chief Scientist of StarkWare Industries, based in Israel, working on scalability of blockchains through STARKs. He is also Professor of Computer Science at Technion — Israel Institute of Technology and founding scientist of the Zcash Company. Scaling Today’s Chris Spannos spoke with Eli on day 2 of Devcon4._ 


<p> **Chris Spannos:** What are STARKs and where do they come from?
 

<p>**Eli Ben Sasson:** STARKs are a form of computational integrity proof. It is a set of techniques that allow someone to prove to others that computation was executed correctly. This proof can be with or without zero knowledge. You can have a STARK or a Zk-STARK, in that respect, they’re a little bit like SNARKs. The core attributes of a STARK are, S stands for the scalability, which means that verification time scales exponentially faster than naive computation time. The T in the STARK stands for transparent, which means there’s no trusted set up. The rest of it is a little bit more technical.
 
<p>**Chris:** What are the key performance benefits of STARKs?
 
<p>**Eli:** STARKs allow a prover or a prover node to take a large amount of computation, process it and prove to the rest of the world in a transparent manner that the output of the computation is correct. For instance, a prover node might take, let’s say, 10,000 transactions, or 10 blocks of a blockchain, process all of them and report to the network that the result of this processing is a certain update to the state of the network. All of these can be trusted by virtue of the cryptography in math that underlies the STARK without needing everyone else, or the other nodes to re-execute the same computation. They could trust the STARK instead.
 
<p>**Chris:** There is a big engineering effort to scale the Ethereum blockchain. How will this benefit these efforts?
 
<p>**Eli:** Okay. I’ve seen that the Ethereum developers are very quick to adapt the latest and greatest technology out there. STARKs are just starting to hit the market soon, but there is a lot of opportunities in which STARKs can help with both: in layer one, layer two plasma, other areas where you would want a single node to prove to the rest of the world that a lot of computation has transpired correctly. Whenever you have such a situation, a STARK could help.
 
<p>**Chris:** Thinking about this in terms of implementation, how would this be implemented into the protocol?
 
<p>**Eli:** That’s a very good question. There are basically two parts to a STARK. There’s a prover and a verifier. The verifier, ultimately, would be, if it’s running on something like Ethereum, it would be some sort of Ethereum code written in solidity, running on an EVM. It would execute either something from the core, if it’s layer one it’s something that the basic protocol supports, and that is the STARK verifier. If it’s a layer two, it would be a smart contract running this verifier.
Now, the prover, that’s another nice thing about it, can be written and executed on any platform in any kind of code. It doesn’t have to be Ethereum compatible, in the sense that, all that matters is that the verifier can check the correctness of the proof. The proofs can be generated off-chain by some big proofing machine. Then the verification, which is the lean part, is done on-chain or on a smart contract.
 
<p>**Chris:** Are there any performance trade-offs between if it’s baked into the layer one protocol, or in a layer two smart contract?
 
<p>**Eli:** That’s a good question that I confess I’m not enough of an expert on. I’m guessing the gas costs would be lower if something is baked into a layer one, because then the gas basically for running the verifier would somehow be modeled so that it’s not too expensive. I’m not enough of an expert on the gas costs if it’s implemented in that one.
 
<p>**Chris:** Where is the project at now?
 
<p>**Eli:** The project is that we have a team of about 15 engineers working full-time on building a better and faster and safer STARKs. We have here [at Devcon4] demoed that, our technology is even right now cross-platform compatible. We ran the first demo of STARK prover running inside a browser on a smartphone. We are in the final steps of deciding what our very first MVP, Minimal Viable Product will be, and then we’ll announce it and progress towards doing it.

<p>Contemplating between either doing something like a shielded transaction on Ethereum, or doing scalability of many transactions on Ethereum, or supporting decentralized exchanges. Those are the three main options we’re thinking about, and we need to decide what’s going to be the first thing we want to deploy. There will be a smart contract, or something like it that verifies computations that are done off-chain. That’s for sure.
 
<p>**Chris:** Great. What’s the timeline for that?
 
<p>**Eli:** Internally we want to try and have the MVP out there by the end of Q1 2019. Which means roughly in four months or so, but that’s our hope.
 
<p>**Chris:** Thank you very much Eli.
 
<p>**Eli:** Thank you.
 
<p>**You can read more about the latest in scaling research and development at**  [scaling.today](https://scaling.today/) 
