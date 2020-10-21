---
title: EGGE.GG Instant Payout eSports Tournaments For ETHDenver2019
summary: EGGE.GG The Future Of Esports Competition Team Members- Robbie Weinel Hayder Sharhan Somesh K S Status.im ID for Each Team Member (we will use this to contact you and your team) Robbie- https-//get.status.im/user/0x044be687b9a8c52a2af4911a35737f20d834a0c836dd5c202413ab72f36106ef1349aceda14cccacb1463c198bce118be74d7d5338ec27a0101c785483739d0060 Somesh- https-//get.status.im/user/0x04aa9d02a29de468e40419a22bf2bed01645ec082ab1682efe38fbae1c5bd0ba8ac5141be0ad2d2b96ec1d7b4a7d5b705fc115bf234ac712e3445
authors:
  - Hayder Sharhan (@hshar)
date: 2019-02-17
some_url: 
---

# EGGE.GG Instant Payout eSports Tournaments For ETHDenver2019



## EGGE.GG


## The Future Of Esports Competition


## Team Members:
* Robbie Weinel
* Hayder Sharhan
* Somesh K S

## Status.im ID for Each Team Member (we will use this to contact you and your team)
* Robbie: https://get.status.im/user/0x044be687b9a8c52a2af4911a35737f20d834a0c836dd5c202413ab72f36106ef1349aceda14cccacb1463c198bce118be74d7d5338ec27a0101c785483739d0060
* Somesh: https://get.status.im/user/0x04aa9d02a29de468e40419a22bf2bed01645ec082ab1682efe38fbae1c5bd0ba8ac5141be0ad2d2b96ec1d7b4a7d5b705fc115bf234ac712e344587d3e72bc7339
* Hayder: https://get.status.im/user/0x044dbadd965fc19cb1616f6fe0744397686a479f3e32e147ee4185a78143855aba0e8214557c3a178126405d2ecf066cc0d7b2972d1c7a948ec618b8052bfa91de

## Detailed Project Description (no more than 3-4 sentences):
* We built a tournament management platform that uses ETH and ERC20 tokens to  fund tournaments. Once the games are played and the winners are determined, the winners should receive the funds immediately.


## Describe your tech stack (e.g., protocols, languages, API’s, etc.):
We're using Kotlin w/ Springboot to host the backend (With a Mongo database). All the offchain data is stored there as well as mirroring of the on chain data.

The frontend is calls out to the database with user information as well as utilizing Web3js to call a smart contract that is deployed for each tournament instance. We're utilizing Skale as a layer 2 solution for cheaper transaction fees.

User onboarding is done using Blocknative which allows us to receive the basic information about the user (public address) from there we allow the user to interact with the dapp until he or she wants to engage in a tournament (organize or register). The user must then provide extra metadata.

Once the winners of the tournament are selected by the organizer, a transaction is fired off to the smart contract with the winners' public addresses. The winners then should get their payouts.

For a tournament to run, we only use two transactions with the blockchain. 1. fund the contract 2. transfer the funds to the winner. 
This helps keep the transaction fees even cheaper for our users!


## Track: 
* Open


## All Bounties Completed/Incorporated:
* Ideas By Nature
* Block Native

## A link to all your source code on a public repo (i.e. Github):
* [Frontend] (https://github.com/hshar7/EGGE.GG-Frontend)
* [Backend] (https://github.com/hshar7/EGGE.GG-Backend)
* [GUI Designs] (https://xd.adobe.com/view/b9c33ddd-9fef-48dc-7060-19b88237b5cf-cff2/)







---

- **Kauri original title:** EGGE.GG Instant Payout eSports Tournaments For ETHDenver2019
- **Kauri original link:** https://kauri.io/eggegg-instant-payout-esports-tournaments-for-eth/2d6aad56cc904756bbef18332efb00fc/a
- **Kauri original author:** Hayder Sharhan (@hshar)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission, blocknative, skale, esports, 4ideas-by-nature
- **Kauri original hash:** QmV9618WuH9F4swZ7MEQuaEa9you564bpc1FfCHAukpyYZ
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



