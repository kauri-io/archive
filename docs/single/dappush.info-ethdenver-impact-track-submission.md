---
title: Dappush.info ETHDenver Impact Track Submission
summary: Project Name Dappush Project Tagline/Description WEA meets Ethereum. - Censorship Resistant Emergency Alerts, Decentralized Push Notifications with Opt-in User Preferences on Smart Contract State Changes. Team Members Josh Han, Trevor Clarke, Waleed Elsakka Status.im ID for Each Team Member (we will use this to contact you and your team) JoshGlobal 0x044b879651c122d8e1ef9d8f8eb1aba0d1e738cad1f2d530216ed529225bfe7805ec4a43f9d05fc846ae8297b7fd9b6facdf30cadf7f5d217388f6f455372befb9 Detailed Project
authors:
  - Josh Han (@joshglobal)
date: 2019-02-17
some_url: 
---

# Dappush.info ETHDenver Impact Track Submission

![](https://ipfs.infura.io/ipfs/QmaiGkqEbzM6yMg1vppKMY4L42WWfToyUUQ79wUfcLocn8)


## Project Name 
Dappush

## Project Tagline/Description
WEA meets Ethereum. 
- Censorship Resistant Emergency Alerts, Decentralized Push Notifications with Opt-in User Preferences on Smart Contract State Changes.

## Team Members
Josh Han, Trevor Clarke, Waleed Elsakka

## Status.im ID for Each Team Member (we will use this to contact you and your team)
JoshGlobal 

<a href="https://get.status.im/user/0x044b879651c122d8e1ef9d8f8eb1aba0d1e738cad1f2d530216ed529225bfe7805ec4a43f9d05fc846ae8297b7fd9b6facdf30cadf7f5d217388f6f455372befb9">0x044b879651c122d8e1ef9d8f8eb1aba0d1e738cad1f2d530216ed529225bfe7805ec4a43f9d05fc846ae8297b7fd9b6facdf30cadf7f5d217388f6f455372befb9</a>

## Detailed Project Description (no more than 3-4 sentences)
Dappush.info - We are proposing Decentralized Automatic Push Notifications (DAPN) on state channels for smart contract state changes. Hackathon deliverables include Slack/GCM/Webhook push notifications that can be changed on user preferences - current CDN can be based on assets, registry, uptime and validation/checksums and use state channels. Immediate use cases include: fair Wireless Emergency Alert (WEA) systems, Dapp remittance support, micro-payments, IoT (slock.it) and shared savings accounts updates. Subscriptions implementation could also be made based on push + payments and time-based agreements. 

## Describe your tech stack (e.g., protocols, languages, API’s, etc.)

State Channel Bootnodes
- An economy driven application architecture

Architecture:
- redis
- WebRTC - https://peerjs.com/
- nodejs

RPS:
- both players deploy contracts
- on confirmation of both contracts, channel is open
- players use this formula for moving state forward:
   - 1. Resting - current state, no changes
   - 2. Propose - Provide some stake value, and a hashed state update
   - 3. Accept - Other person provides their state update & accepts the stake allotment
   - 4. Reveal - Original person responds with hash salt, state raw value, and updates state allotment based on stake value
   - 5. Resting - Other person accepts the change by sending current state

Payment Channels:
- Prefund setup
- Funding
- Postfund setup
- Game/interactions
   - Library that uses pure functions only to validate proposed state change validity
- Conclusion

Research/Notes:
- CREATE2 
- counterfactual instantiation, allows lots of up front work to take place, and closing the channel upon disagreements and final state change


## Track for which you’re submitting (Impact Track - Increasing Emergency Preparedness)

<a href="https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf"> UN Global indicator framework for the Sustainable Development Goals & targets of the 2030 Agenda for Sustainable Development</a>

Goal 3. Ensure healthy lives and promote well-being for all at all ages
- 3.d Strengthen the capacity of all countries, in particular developing countries, for early warning, risk reduction and management of national and global health risks
   - 3.d.1 International Health Regulations (IHR) capacity and health emergency preparedness

Goal 9. Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation
- 9.a Advancing mechanisms for human rights monitoring and economic development, reducing corruption
    - 9.1: Develop quality, reliable sustainable and resilient infrastructure to support human well-being with a focus on equitable access for all 


Goal 13. Take urgent action to combat climate change and its impacts
- 13.3 Improve education, awareness-raising and human and institutional capacity on climate change mitigation, adaptation, impact reduction and early warning
    - 13.3.1 Number of countries that have integrated mitigation, adaptation, impact reduction and early warning into primary, secondary and tertiary curricula

We believe Dappush will be impactful to these SDGs by generating a new value class for information propagators, incentivizing good behavior in them (censorship-free), and limiting future Dapp development. We believe our solution (after finishing development) will scale directly with Dapp adoption especially regarding information. There is no current tooling solution or standard proven mechanism for smart contracts to send push notifications on-chain. The paragraph below details new value over current existing system in developed countries to properly inform citizens and new implementation methods for emerging governance bodies. 

During 2012 the United States launched the Wireless Emergency Alert (WEA) system, and it has acted as an essential part of population preparedness for natural disasters, imminent threats, and presidential alerts.International adoption of emergency systems has been slow due to government censorship, lack of economic incentive and underlying technology. The current system is unblockable and sent through Federal Emergency Management Agency (FEMA) Integrated Public Alert and Warning System (IPAWS) to phone providers and wireless carriers. Past incidents regarding Edward Snowden raise privacy concerns about the misuse of this WEA system because of FCC's E911 System standard requirement that a mobile device is able to send its location. EFF has publicity stated that this was not the intended use of WEA and that location detection requires a warrant. 

## All Bounties Completed/Incorporated
Impact Track

Important: You MUST add a tag (at the top, under Title) for each bounty you'd like to submit to. Your project will not be considered for any bounties unless they are tagged. Click "ADD TAG", type  "bounty" and select the desired bounty from the list. If you'd like to apply to more than 6 bounties, please add the first 6 as tags, add the details for all of them (max of 10) here, and contact the Kauri team (info@kauri.io) to notify them of all 10 bounties you'd like to be considered for. These instructions can be deleted.

## A link to all your source code on a public repo (i.e. Github)
https://github.com/TrevorJTClarke/dappush







---

- **Kauri original title:** Dappush.info ETHDenver Impact Track Submission
- **Kauri original link:** https://kauri.io/dappush.info-ethdenver-impact-track-submission/ff1b7f1460974edebf369e512e0cc53e/a
- **Kauri original author:** Josh Han (@joshglobal)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission, bounty-impact
- **Kauri original hash:** QmbuwUkyKd7Cru6vYyGA71wi44Kk7CU4EwbNyToio5Qr8r
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



