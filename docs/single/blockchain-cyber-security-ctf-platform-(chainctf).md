---
title: Blockchain Cyber Security CTF Platform (ChainCTF)
summary: Project Name ChainCTF Project Tagline/Description (140 Characters Max. Will be used on table card for judging) A modular system for event organizers to deploy a full featured cyber security ctf featuring on and off chain exploits, leader boards, and a trading card game to teach the more conceptual vulnerabilities. Team Members. First and Last Names Dev Bharel, Daniel Fallon, Jordan Earls Status.im ID for Each Team Member (we will use this to contact you and your team) spacemandev Detailed Projec
authors:
  - Dev Bharel (@spacemandev)
date: 2019-02-17
some_url: 
---

# Blockchain Cyber Security CTF Platform (ChainCTF)


## Project Name
ChainCTF

## Project Tagline/Description (140 Characters Max. Will be used on table card for judging)
A modular system for event organizers to deploy a full featured cyber security ctf featuring on and off chain exploits, leader boards, and a trading card game to teach the more conceptual vulnerabilities. 

## Team Members. First and Last Names
Dev Bharel, Daniel Fallon, Jordan Earls

## Status.im ID for Each Team Member (we will use this to contact you and your team)
spacemandev

## Detailed Project Description (no more than 3-4 sentences)
CTF Engine features Quest Packages, Quest Provisioning System, Scoring Engine, Asset Store, and a Meta Game. 
**Quest Packages**: A self contained template for multi-step exploit checks. Users can try to break the contract or submit zero knowledge flags for off chain steps (breaking into a lockbox, hacking a server, etc) then run the test contract to see if they achieved all the exploits in the contract. 

**Quest Provisioning System**: QPS is an optional off chain deploy service that listens to Scoring Engine events to see when a user wants to start a given quest. An instance of that quest's vulnerable contracts are then deployed and locked so only that user can attack them. It uses Graph QL to listen to the events and pull and read quest package data. 

**Scoring Engine**: An optional module that handles a leaderboard and the main interface to players to interact with. Also manages player's quest progressions and requests for a quest to be provisioned for them. 

**Asset Store**: Optional module that awards Coins for completed quests that players can use to purchase Admin defined Cards from the store. These cards have specific stats that can be skinned to whatever narrative design you like and can be used for attack/defense meta game.  

**Meta Game**: Optional module that focuses on two contracts: Blockchains.sol, and Mutators.sol. This is a specific meta game where enemy AI and players spawn and fight against each other blockchains. Blockchains have attributes and players can 'mine' their blockchain to gain more Coins and Points. They can also burn cards in Mutators.sol to carry out attacks or defend their chain. For example, a 51% attack that reduces the market value of an enemy blockchain might cost them 51% of Attack CPU cards as the target chain has total CPU power. This is used to teach more 'conceptual' vulnerabilities (actually breaking into and gaining control of that many nodes might be tedious work). 

## Describe your tech stack (e.g., protocols, languages, API’s, etc.)
Truffle & Eth for contract deployments
Terraform, AWS, Ansible, GraphQL for Quest Provisioning System
YAML for config 

## Track for which you’re submitting (Open or Impact)
Open

## A link to all your source code on a public repo (i.e. Github)
https://github.com/Brownie79/ethctf (README has further explanation) 






---

- **Kauri original title:** Blockchain Cyber Security CTF Platform (ChainCTF)
- **Kauri original link:** https://kauri.io/blockchain-cyber-security-ctf-platform-chainctf/60ad746c233b4e48bd67622af370b0b4/a
- **Kauri original author:** Dev Bharel (@spacemandev)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission, bounty-zeppelin-2019, bounty-thegraph-2019
- **Kauri original hash:** QmZKigEXBSUfq7y8LATuf1UBvvxH9JrWVVf58HgPSp4kPh
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



