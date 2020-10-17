---
title: What could blockchains offer to freelancers?
summary: Freelance marketplace is one of the exciting fields that blockchain technology could help transform. Imagine the freelancers can independently setup smart contracts with the employers to get rewarded either in cryptocurrencies or tokens that can be vested over time. It would be a fundamental change in how people work together since it cut through the middleman and be more flexible for the working relationships. This post discusses how the blockchain technologies can be used in the freelancing ma
authors:
  - null (@null)
date: 2018-11-30
some_url: 
---

# What could blockchains offer to freelancers?


----


![](https://api.beta.kauri.io:443/ipfs/QmZrWV2mk6C62Aw9efXT6BZzDJKZjzq3hAiVGCedrTrJrn)

Freelance marketplace is one of the exciting fields that blockchain technology could help transform. Imagine the freelancers can independently setup smart contracts with the employers to get rewarded either in cryptocurrencies or tokens that can be vested over time.
It would be a fundamental change in how people work together since it cut through the middleman and be more flexible for the working relationships.
This post discusses how the blockchain technologies can be used in the freelancing marketplaces, followed by a simple Dapp to demonstrate a payment smart contract that can be independently managed by a freelancer and employer.

## The trend of freelancing
Based on job market statistics, there is an increasing number of workers choose to escape the 9to5 jobs and work as a freelancer, desired for flexibly work contents they prefer, expand their business networks and grow their personal brands.
They have the freedom to work with preferable partners and be more flexible in making decisions in which career direction they want to go pursuit.
> One of the core principles of the free market is that central planning committees can never be as efficient or effective as the people doing the work.

> The most important feature of free market economies is that each person within them is able to make independent decisions in their own best interest

> 
 
**Why We Hate Working for Big Companies**
   
 medium.com
> 

In the era of blockchain technologies, the core value of which is decentralization, it is very likely the trend of freelancing will be accelerated.

## Freelancing marketplaces
Most of the freelance works are landed via outsourcing platforms like upwork.com and freelancer.com. These platforms provide the facilities for the employer to post the jobs or the employee to apply for the jobs, serving as a job information center.
The key reason of why these platforms are popular is they serve as the middleman for the working contracts and the funds. They have a set of rules to collect and calculate the ratings for both the employer and employee after completed the contracts.
The main duty of these platforms is maintaining and securing the contract made between the employer and employee.
Having a middleman to execute this duty comes at prices:
1. It is inefficient especially in the payment process. It could be taking days or even weeks to withdraw the money to an oversea bank account. They charge fees for the payments and introduce a cost to both the employer and employee. The fees could be as high as 20% to work for a new client.
2. The middleman could be biased when dealing with the conflicts of the contracts.
3. They are in charge of the rules in how the rating calculated and how they are displayed. The rating is the key element for the freelancers as this is what the employer does the evaluation when making the employment, and that needs years of time to cultivate upon the platform. These rating data is owned by the platform and can’t be shared among other platforms.

![](https://api.beta.kauri.io:443/ipfs/QmdrjbwBhfw9DpnroqKTt5VbWWkuKofjPmbk6kenEpiiW4)

> The bad news is that it became much harder for startups, creators, and other groups to grow their internet presence without worrying about centralized platforms changing the rules on them, taking away their audiences and profits.

> 
 
**Why Decentralization Matters**
   
 medium.com
> 


## What is a contract?
Let’s get back to the question of why we need an employment contract that these centralized platforms facilitate to create.
Contract in the nutshell:
> Agreement about the facts and when they change — that is, a consensus about what is in the ledger, and a trust that the ledger is accurate — is one of the fundamental bases of market capitalism.

> 
 
**The Blockchain Economy: A beginner’s guide to institutional cryptoeconomics**
   
  
_Chris Berg, Sinclair Davidson and Jason Potts are from the RMIT Blockchain Innovation Hub, the world’s first social…_
 medium.com
> 

Platforms like upwork or freelancer is basically a centralized database that records and maintains the contracts. These contracts are relying on the trusted central authorities to maintain and validate.
There are generally two types of contracts:
> A complete contract specifies what is to occur under every possible contingency.

> An incomplete contract allows the terms of the contract to be renegotiated in the case of unexpected events.

It is nearly impossible to create a 
**complete**
 contract, particularly for small business activities such as freelancing, as it is too expensive to consider all the possible conditions within a contract period.
So how do we create 
**incomplete**
 contracts 
****
 that are both secure and efficient?
> The blockchain, though smart contracts, lower the information costs and transactions costs associated with many incomplete contracts and so expands the scale and scope of economic activity that can be undertaken.

The decentralized consensus and immutability features of blockchain enable the contracts to be created with embedded rules that automatically govern the ledger data within the contract.
With blockchain technologies, it is now possible to create secure contracts without 3rd party institutions.

## A simple payment contract
To demonstrate the concept, let’s try to implement a simple payroll contract that executes itself without any 3rd party institutions, using Ethereum solidity contract for the backend and React.js for the front end.
The model of the contract is normally for one to one relationship, that is the rules between an employer and an employee. Also there are other contract models in the software outsourcing fields. The crowdsourcing platforms, such as 
[TopCoder](http://topcoder.com/)
 and 
[Kaggle](https://www.kaggle.com/)
 , have a model of one to many relationship. They hold competitions to reward the top performers who participate in the projects.
> 
TopCoder
> 
Kaggle
Suppose we want to create a very basic payment contract, which works on time based, one to one model, with the following key requirements:
1. The employee needs to know if the employer has enough capital to fund the contract agreements.
2. The employer needs to know if the employee is capable of delivering the vision of the project.
3. Both the roles should have chances to evaluate if they are in a good fit within a trial period.
If something doesn’t work well, a contract makes they eligible choose to terminate the contract, so as to avoid potential losses in either monetary or time.

### Flows of contract rules



 * The employer can create a smart contract with configs in contract full period and trial period in a minute.

![](https://api.beta.kauri.io:443/ipfs/Qmf3f7sTLJTyuufywdJE8vbKp7SiUNC8CAdE8EBHtLPjmR)

2. Once employer deposited funds into the smart contract, it will proceed to the 
**handshake**
 stage where there is a URL, containing the address of this contract, to share to the employee to review this contract.

![](https://api.beta.kauri.io:443/ipfs/QmQmMLc29XkhsqRWe8gWsFnMcSv5xTrhDhhbtJN3cJARPP)

3. With the shared URL, employee can review the periods of the contracts and the available funds deposited. Once confirmed(signed) the contract, the contract starts with the trial period, in which payment requests are disabled. From now on, the deposited fund can only be transferred to the employee’s account address or be refunded by canceling the contract.

![](https://api.beta.kauri.io:443/ipfs/QmY9zfWnygijzNzWuNVJBGyNe3nKVuEMhqVctRXxAqf1Bw)

4. The employer can choose to cancel the contract. The contract is cancelable during stages of 
**handshake**
 and 
**trial period**
 . If cancelled, the deposited funds will be withdrew from the contract back into the employer’s wallet account.
5. Once trial period passed, the employee can request payment whenever needed and get paid immediately based on the current time and the length of the contract period.
Alternatively, after the trial period, employer can authorize the contract completed to transfer the total payment to the contractor before the contract end time. This is meant to incentivize the contractor to deliver the quality work faster.

![](https://api.beta.kauri.io:443/ipfs/QmbEgG2KK1LuLfRnC2E5U9BhhuwNsdRYYXqnyHmQoLzk6i)

6. The contract will mark ended when all the fund deposits were paid to the employee.

![](https://api.beta.kauri.io:443/ipfs/QmaPiKfMty4ui8grsKsQAxYWPNTux5YepZ1XA1FpcfXgms)


----

This is a simple demo Dapp as a payment contract for the 1 to 1 employment relationship.
The smart contract demonstrated above is totally owned by the employer and employee. It doesn’t rely on any 3rd party institutions to secure the contract’s rules, which is executed automatically based on the ledger data within the contract.
It is flexible to set up the rules that are transparent to both the employee and employer to agree upon.
It costs little to create this smart contract. The only requirements to create the contract is a web browser with the Metamask extension to sign the transactions.
The source codes for the 
[front end](https://github.com/katat/payment-contract-app)
 and the 
[solidity contract](https://github.com/katat/payment-contract-solidity)
 have been published on github. Also, you can play around with it locally with the source codes, or with the 
[deployed version](http://katat.me/payment-contract-app)
 .
> 
front end
> 
solidity contract
> 
deployed version
 
**Potential issues:**
 
Normally a payment contract could span with a long period of time, during which the prices of the cryptocurrency could be fluctuated dramatically so much that is not acceptable for a normal business entity.
Fortunately, there are already stable coins emerging in the market. The stable coins, such as Dai, could be used as the primary currency in a payment contract.
> 
 
**Maker for Dummies: A Plain English Explanation of the Dai Stablecoin**
   
  
_Summary:_
 medium.com
> 

Another notable issue is the speed of the transaction confirmation. Compared to the centralized web apps that is much easier to tune the performance, it could take a long time to get a transaction confirmed in the Ethereum network especially when the supplied gas is too low.
This would introduce challenges to the UX of the Dapp. To prevent the Dapp users get confused during the period of confirming transactions, a new way of designing the user experiences is highly desired.
> 
 
**Web3 Design Principles**
   
  
_A framework of UX rules for Blockchain based Distributed Applications (part 1)_
 medium.com
> 


## Summary
The simple payment Dapp above demonstrated what revolutions the blockchain technologies can help achieve and how powerful it will position itself in the freelancing market.
In fact, there are already some organizations working for this field from different perspectives, such as 
[Arogan](https://aragon.one/)
 , 
[Ethlance](http://ethlance.com)
 , 
[Gitcoin](https://gitcoin.co/)
 , 
[Bounty Network](http://bounty.network/)
 etc.
> 
Arogan
> 
Ethlance
> 
Gitcoin
> 
Bounty Network
We are still in the very early stage of the blockchain. There are a lot of possibilities the blockchain can help realize in this field. It will help freelancers achieve more freedom to work on the projects that best fit their personal interests, without being locked in a specific centralized platforms.
> Thanks for reading. I will appreciate any comments, please feel free to share your thoughts.


----


![](https://api.beta.kauri.io:443/ipfs/QmRB3vAfbSEV5kvvdw2Jx1668tbC6wF5Pha5Rs2DoSkiXx)

> 


### This story is published in The Startup, Medium’s largest entrepreneurship publication followed by 323,238+ people.
> 
The Startup

### Subscribe to receive our top stories here.
> 
our top stories here

![](https://api.beta.kauri.io:443/ipfs/QmX4tW2jq4KhqCry4wZVWcH9MCfDsWjVzpzwsfpm2HpQzR)

> 

