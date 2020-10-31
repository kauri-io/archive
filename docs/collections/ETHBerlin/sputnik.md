---
title: Sputnik
summary: Team Sputnik is pushing the limits of private smart contracts by creating an assembly language and interpreter that performs arbitrary computations and circuits on encrypted data via Fully Homomorphic Encryption. This performs the computations on the GPU for speed and performance, then commits a merkle root of the entire computation for proof of logic flow to the blockchain via Vyper smart contract. - Hugh Lang (ECF) https-//devpost.com/software/sputnik Inspiration Apparently, fully homomorphic
authors:
  - Kauri Team (@kauri)
date: 2018-09-20
some_url: 
---

# Sputnik


Team Sputnik is pushing the limits of private smart contracts by creating an assembly language and interpreter that performs arbitrary computations and circuits on encrypted data via Fully Homomorphic Encryption. This performs the computations on the GPU for speed and performance, then commits a merkle root of the entire computation for proof of logic flow to the blockchain via Vyper smart contract. - Hugh Lang (ECF)

https://devpost.com/software/sputnik

![](https://ipfs.infura.io/ipfs/QmdLyJwwyJincntk2jrVRp4TkX9U6ZX69XEqnSH3phTGA7)

#### Inspiration
Apparently, fully homomorphic encryption is impractical? Until now...

#### What it does
Performs arbitrary computations and circuits on encrypted data via Fully Homomorphic Encryption. This allows for private computations on the blockchain via homomorphic smart contracts.

#### How we built it
We're building on top of NuCypher's fully homomorphic encryption library called NuFHE. This performs the computations on the GPU for speed and performance, then commits a merkle root of the entire computation for proof of logic flow to the blockchain via Vyper smart contract.

#### Challenges we ran into
Proving correct circuit validation is an open problem for us. We require a specific zero knowledge proof that needs some research before implementation is ready. Soon...

#### Accomplishments that we're proud of
We created our own language and we're going to execute the first fully homomorphic smart contract.

#### What we learned
Building a language is hard.

#### What's next for Sputnik
Launch it into orbit...

#### Built With

- python
- nufhe
- numpy
- reikna
- vyper
- sputnik

#### Try it out
 [GitHub Repo](https://github.com/nucypher/Sputnik)

 [docs.google.com](https://docs.google.com/presentation/d/1haXqjNmm3FZA9OvY9BdW4rVR4h9ZQoCzUmRpmL5oEvg/edit?usp=sharing)


---

- **Kauri original title:** Sputnik
- **Kauri original link:** https://kauri.io/sputnik/8806bbaf6a924a6b91f2b1400f31bb81/a
- **Kauri original author:** Kauri Team (@kauri)
- **Kauri original Publication date:** 2018-09-20
- **Kauri original tags:** none
- **Kauri original hash:** QmSp6iCtnSMi8RR1CNeEfS1XuCi93APNfJWbfysGJnnjvs
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



