---
title: Claiming your DNS on ENS via Web (2/3  The Demo)
summary: The Theory 2. The Demo The Code Previously In the first blog post, I talked about the theory behind how DNSSEC can prove that a certain Ethereum address belongs to a domain and how ENS can use the mechanism by submitting the proof into DNSSEC Oracle smart contract. In this blog post, I will show you how the actual process works on the web. 2. The Demo I have been working for the past few months making it easier to retrieve the proof from DNS and submit into the DNSSEC Oracle smart contract, and
authors:
  - Makoto Inoue (@makoto)
date: 2018-10-30
some_url: 
---

# Claiming your DNS on ENS via Web (2/3  The Demo)



----




 * 1. The Theory

 *  **2. The Demo** 

 * 3. The Code
 **Previously** 
In the first blog post, I talked about the theory behind how DNSSEC can prove that a certain Ethereum address belongs to a domain and how ENS can use the mechanism by submitting the proof into DNSSEC Oracle smart contract.
In this blog post, I will show you how the actual process works on the web.
 **2. The Demo** 
I have been working for the past few months making it easier to retrieve the proof from DNS and submit into the DNSSEC Oracle smart contract, and this video shows the first attempt where you can do the whole process online.

<iframe allowfullscreen="" frameborder="0" scrolling="no" src="https://cdn.embedly.com/widgets/media.html?url=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKOsMMpIO-pQ&amp;src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FKOsMMpIO-pQ&amp;type=text%2Fhtml&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;schema=youtube"></iframe>

Let’s dissect the demo video screenshot by screenshot.

#### Step 1: Type domain name and press “Lookup”.
This will show you the ETH address set under `_ens.domain.xyz` 
At this moment, no data is set on DNSSEC Oracle nor ENS so they all show `0x0` .

![](https://cdn-images-1.medium.com/max/1600/1*LIA_3Yv2dIMIXBOKHvkmyQ.png)


#### Step 2: Submit the proof
Clicking the button will prompt to send two transactions, one to claim the proofs for each record on DNSSEC Oracle smart contract, and another one to set ownership of the domain on the ENS contract.

![](https://cdn-images-1.medium.com/max/1600/1*U-egIBGBF0xGSDb9omj-Lg.png)

If you look at the transactions, you can see that the first transaction is over 1.2 million gas which is quite expensive. But hold your horses! It’s likely you’ll pay a lot less in practice.

```
### claim()
Transaction: 0x554a91b048ee837d000b88cc73dbacccbad0bc27ee555b4e29a1af9422478a32
Gas usage: 1252768 <= *1.2 M !
```



```
### setSubNodeOwner()
Transaction: 0xc08125d6ea9c11f866458eac335defee436f4ac72fdc3d07f59197017d2f14ad
Gas usage: 83849
```



#### Step 3: Setting another domain record
Now let’s try to set another record, ethlab.xyz.
What you notice is that the first half of the proofs are already set because the proof of `.xyz` is already set in a previous transaction.

![](https://cdn-images-1.medium.com/max/1600/1*HtUJH5DTf9GgyfG0wrfnHQ.png)

So if you press “Submit the proof”, this time the cost of the first transaction to put the proof in DNSSEC Oracle is a lot lower.

```
### claim()
Transaction: 0xfd091eeb5bd81ddf01ef62b784f9ed651b333ef22938438a93f189b307ee404a
Gas usage: 373156 <= *373K !
```



```
### setSubNodeOwner()
Transaction: 0x003d32cd1c2a57ca2f1252735d4e2e25d565fb56249c8fc5e8ac9a1a4793819a
Gas usage: 84822
```


In reality, the majority of people will be paying this amount of gas.
 **Summary** 
In this blog post, I showed you the demo app which allows you to claim DNS on ENS. I also explained that transaction cost becomes lower if part of the proof has already been submitted. In the next blog post, I will show you how the demo code make use of a series of ENS libraries.



---

- **Kauri original title:** Claiming your DNS on ENS via Web (2/3  The Demo)
- **Kauri original link:** https://kauri.io/claiming-your-dns-on-ens-via-web-23:-the-demo/8666e3b3000541498f3e9d08cd9a4808/a
- **Kauri original author:** Makoto Inoue (@makoto)
- **Kauri original Publication date:** 2018-10-30
- **Kauri original tags:** none
- **Kauri original hash:** QmXLkr1T9MRmDUa8NXtpsZupT3x3SGREvEPYV3xEHoKL58
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



