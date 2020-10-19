---
title: Claiming your DNS on ENS via Web (3/3  The code)
summary: The Theory The Demo 3. The Code Previously In the second blog post, I showed you how the demo web app works. In this final blog post, I will explain how this demo code was built by assembling the multiple ENS related libraries. NOTE- The library API are evolving and it will more likely become out of date fairly quickly 3. The code Before diving into the code, let me quickly explain various components which this demo code uses. ENS = The main smart contract repository which contains various smart
authors:
  - Makoto Inoue (@makoto)
date: 2018-10-30
some_url: 
---

# Claiming your DNS on ENS via Web (3/3  The code)



----




 * 1. The Theory

 * 2. The Demo

 *  **3. The Code** 
 **Previously** 
In the second blog post, I showed you how the demo web app works. In this final blog post, I will explain how this demo code was built by assembling the multiple ENS related libraries.
[NOTE: The library API are evolving and it will more likely become out of date fairly quickly]
 **3. The code** 
Before diving into the code, let me quickly explain various components which this demo code uses.



 *  [ENS](https://github.com/ensdomains/ens) = The main smart contract repository which contains various smart contracts.

 *  [DNSSEC Oracle](https://github.com/ensdomains/dnssec-oracle/blob/master/contracts/DNSSEC.sol) = The smart contract that stores DNSSEC proofs.

 *  [dnsproverjs](https://github.com/ensdomains/dnsprovejs) = This library is in charge of extracting DNS information from DNS servers and storing the proof into the DNSSEC Oracle contract. You do not need to interact with this library directly as there is another wrapper library I will explain next.

 *  [dnsregistrar](https://github.com/ensdomains/dnsregistrar) = This project contains a special [registrar](https://docs.ens.domains/en/latest/implementers.html#writing-a-registrar) smart contract that allows you to claim the ENS name based on the proof existing on DNSSEC Oracle as well a wrapper to the dnsprovejs library.
 [The demo code is on my github](https://github.com/makoto/dnssec-ens-example) . It’s quickly built on top of Truffle react box. and I will show you the process step by step.

#### 1. Setup Truffle box
First thing first, you create react and unbox react components.

```
$ mkdir react
$ cd react
$ truffle unbox react
$ truffle migrate
$ npm run start
```


If it’s successful, you should see the stored value of 5 on the page.

![](https://cdn-images-1.medium.com/max/1600/1*LtWy8_7alSb_Lq9yuhkskA.png)

When I first tried, it was just showing 0. It was because I was starting up ganache on port 8545, you need to edit getWeb3.js manually to change port number.

#### 2. Install necessary npm modules

```
npm install --save @ensdomains/ens @ensdomains/dnssec-oracle @ensdomains/dnsregistrar eth-ens-namehash
```


I already explained the three libraries. `eth-ens-namehash` is used to hash your ENS name when looking up if your ENS entity exists.

#### 3. Create & run a migration file
You don’t need to see what [this migration file](https://github.com/makoto/dnssec-ens-example/blob/dnssec/migrations/2_deploy_contracts.js) does line by line as we are trying to encapsulate it, but this is what the migration does:



 * Deploy ENS and DNSSEC contract.

 * Deploy DNSRegistrar with ENS address, DNSSEC address, and `.xyz` domain name.

 * Set `.xyz` as a top level domain (TLD) of ENS contract.

 * Set algorithm and digest to DNSSEC contract for verifying signature.
Once the migration file is created, run `truffle migrate` .

#### 4. Write frontend code
 [I modified Truffle box default App.js.](https://github.com/makoto/dnssec-ens-example/compare/dnssec?expand=1#diff-14b1e33d5bf5649597cdc0e4f684dadd) Looks like it’s doing a lot but the gist of the code is not a lot.
 **4.1**  [Instantiate DNSRegistrarjs](https://github.com/makoto/dnssec-ens-example/compare/dnssec?expand=1#diff-14b1e33d5bf5649597cdc0e4f684daddR99) 

```
registrarjs = new DNSRegistrarJS(
  this.state.web3.currentProvider, registrar.address
);
```


 `DNSRegistrarJS` is a very thin wrapper of DNSRegistrar contract and `dnsprovejs` js libray. It requires your web3 provider and DNS registrar address (given that you run the migration, you can access the address via `DNSRegistrar` truffle function call.
 **4.2**  [call registrarjs.claim()](https://github.com/makoto/dnssec-ens-example/compare/dnssec?expand=1#diff-14b1e33d5bf5649597cdc0e4f684daddR106) 
This function looks up DNS server for the given domain name and returns an `claim` object with `found` attribute.

```
return registrarjs.claim(this.state.domain);
```


if the domain name prefixed with `_ens.` contains a record, the `found` attribute returns true.
 **4.3**  [claim.submit()](https://github.com/makoto/dnssec-ens-example/compare/dnssec?expand=1#diff-14b1e33d5bf5649597cdc0e4f684daddR69) 
By calling the function, it will send two transactions, one to call [DNSSEC#submitRRSets](https://github.com/ensdomains/dnssec-oracle/blob/master/contracts/DNSSEC.sol) that submits the proof and another transaction to call [DNSRegistrar#claim](https://github.com/ensdomains/dnsregistrar/blob/master/contracts/dnsregistrar.sol#L44) that sets ownership on ENS.
 **4.4 Bonus:**  [claim.oracle.knownProof()](https://github.com/makoto/dnssec-ens-example/compare/dnssec?expand=1#diff-14b1e33d5bf5649597cdc0e4f684daddR120)  **to check if the oracle has the proof** 
If you want to get more info about the detail of DNS record or proofs of DNSSEC Oracle, the `claim` object returns a few more attributes exposing the guts of [dnsprovejs API](https://github.com/ensdomains/dnsprovejs#api) .

```
// Iterate each DNSSEC Proof
claim.result.proofs.map((proof, index)=>{
  // Ask DNSSEC Oracle if the proof exists.
  claim.oracle.knownProof(proof).then((proven)=>{
    // Do something with the response
  })
})
```


(NOTE, this is exposed more for debugging purpose and we may exclude in the future release.)
Once frontend code is created, run `npm run start` which should open browser pointing to `localhost:3000` .
 **TODO** 
It’s a super breeding edge version and it is highly likely that many things are missing/broken (so it’s only for the brave). These are the outstanding tasks I may work on during ENS Hackathon (if I have time…)



 * Deleting a record (using [NSEC](https://simpledns.com/help/nsec-records) record)

 * Support for Ropsten network (once the new DNSSEC Oracle smart contract is deployed).

 * Make migration file as a separate function so that you don’t have to copy & paste each time



---

- **Kauri original title:** Claiming your DNS on ENS via Web (3/3  The code)
- **Kauri original link:** https://kauri.io/claiming-your-dns-on-ens-via-web-33:-the-code/3bb9fee637a540d7b1e027cba121ab14/a
- **Kauri original author:** Makoto Inoue (@makoto)
- **Kauri original Publication date:** 2018-10-30
- **Kauri original tags:** none
- **Kauri original hash:** QmdLCs3guAFBThCYEv2kAwhLtuyNVYqtBVSj1kUCVW45xX
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



