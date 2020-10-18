---
title: EthASketch
summary: Plotter Main Page Project Name EthASketch Project Tagline/Description (140 Characters Max. Will be used on table card for judging) Instantly sketch collaboratively on the Ethereum blockchain while also instructing a IRL handmade 2d plotter to see everyones doodles. Team Members. First and Last Names Iain Nash Status.im ID for Each Team Member (we will use this to contact you and your team) https-//get.status.im/user/0x042f4f62a710aea5ac4dc12499671a319ca9f34283bf550a87ddcfa00183128598c83cdbfd8b81
authors:
  - iain nash (@iain)
date: 2019-02-17
some_url: 
---

# EthASketch

![](https://ipfs.infura.io/ipfs/QmRQyt2sfib3NAXHy7WjxyCd5ZcSXontkjQ1Pfz5WKgpWz)


![Plotter Main Page](https://ipfs.infura.io/ipfs/QmPpwMcHAQtTEPdeGo2BwMw9nVFz3UQFjRatUhTrNc6TDB)
## Project Name
EthASketch

## Project Tagline/Description (140 Characters Max. Will be used on table card for judging)
Instantly sketch collaboratively on the Ethereum blockchain while also instructing a IRL handmade 2d plotter to see everyone's doodles.

## Team Members. First and Last Names
Iain Nash

## Status.im ID for Each Team Member (we will use this to contact you and your team)
https://get.status.im/user/0x042f4f62a710aea5ac4dc12499671a319ca9f34283bf550a87ddcfa00183128598c83cdbfd8b81fb40335348fa018454b97e2e08052ab0ae98b522889ee2b16d51

## Detailed Project Description (no more than 3-4 sentences)
Sketch online collaboratively and have those sketches made in real life with a plotter streamed online. The interface is simple and retro. Imposing creative restrictions like an etch-a-sketch (by only allowing lines to be plotted, and by making many lines curves and other shapes can be formed) pushes participants to be creative with a level playing field of just submitting sketches to the blockchain.

The 2d plotter was built using two stepper motors, a fan for pen control, custom 3d printed spools, custom arduino firmware that would connect the controllers over Websockets to a browser through a stable server, and finally a web admin interface to bridge blockchain submissions for the plotter to instructions for the plotter over MQTT (along with centering, calibration, etc).

Once a sketch is done and setup, the organizers can "clear" the canvas by setting a new point to fetch from for the smart contract. By using a combination of Fortamatic and the graph, users can participate both with or without a web3 browser on our platform.

## Project link:
View the sketch site live at: https://iainnash.github.io/ethasketch/


Below is a view of the plotter controller:

![Plotter controller](https://ipfs.infura.io/ipfs/Qmar6SWwC4HdPU2nJFtPt5iDS4jvkMewECG6xCXrJm274F)

![Full view](https://ipfs.infura.io/ipfs/QmVKzd3YhmvP5Ft26VHUxfbCyN4X4SyuFC6dtSQxuqUfdV)

## Describe your tech stack (e.g., protocols, languages, API’s, etc.)
* The Graph API (for the live data fetch in web3)
* Fortmatic API (for the web3 layer / dapp accessibility)
* MQTT (PUB/SUB socket protocol)
* ESP8266 (wifi microcontroller)
* Arduino (framework for ESP programming)
* Vue/React.js (for user interface and admin to control plotter)
* Websockets
* McGyvering (for the physical stack)

## Track for which you’re submitting (Open or Impact)
Open

## All Bounties Completed/Incorporated
* The Graph Bounty (Both Subgraph and use of the graph API)
* Fortmatic Bounty (Using the frontend libraries of Fortmatic for an seamless user experience)
* Ideas by nature: Most user-friendly onboarding process (Fun onboarding process for a small but rewarding experience that links into the physical world).
* Chainlink Bounty (Unspecified / creative prototype)


Important: You MUST add a tag (at the top, under Title) for each bounty you'd like to submit to. Your project will not be considered for any bounties unless they are tagged. Click "ADD TAG", type  "bounty" and select the desired bounty from the list. If you'd like to apply to more than 6 bounties, please add the first 6 as tags, add the details for all of them (max of 10) here, and contact the Kauri team (info@kauri.io) to notify them of all 10 bounties you'd like to be considered for. These instructions can be deleted.

## A link to all your source code on a public repo (i.e. Github)
* The Graph API Subgraph: https://github.com/iainnash/plotterlinewriter-graph
* Main EthASketch Project Repo: https://github.com/iainnash/ethasketch







---

- **Kauri original link:** https://kauri.io/ethasketch/eceee829d2184dbf990b21e630be5b15/a
- **Kauri original author:** iain nash (@iain)
- **Kauri original Publication date:** 2019-02-17
- **Kauri original tags:** ethdenver-2019-submission, bounty-chainlink-2019, bounty-graph-2019, bounty-ideasbynature-2019, bounty-fortmatic-2019
- **Kauri original hash:** QmeTqStNx1CoersQirXbE8FvAHmH9xzARtxxE2sH7aTJGu
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



