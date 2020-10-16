---
title: HashD - Broadcast on the Distributed Web
summary: Project Name HashD Project Tagline/Description (140 Characters Max. Will be used on table card for judging) Proof of Work protected database that doubles as a discovery & broadcast mechanism for following identities and message types. Team Members. First and Last Names Harrison Stahl, Hunter Trujillo Status.im ID for Each Team Member (we will use this to contact you and your team) @dumdumoneone, @cryptoquick Detailed Project Description (no more than 3-4 sentences) HashD is a command line tool t
authors:
  - Harrison Stahl (@notenoughentropy)
date: 2019-02-17
some_url: 
---

# Project Name
HashD

# Project Tagline/Description (140 Characters Max. Will be used on table card for judging)
Proof of Work protected database that doubles as a discovery & broadcast mechanism for following identities and message types.

# Team Members. First and Last Names
Harrison Stahl, Hunter Trujillo

# Status.im ID for Each Team Member (we will use this to contact you and your team)
@dumdumoneone, @cryptoquick

# Detailed Project Description (no more than 3-4 sentences)
HashD is a command line tool that can create an identity by generating two key pairs, the first signs a block. The other is output a mnemonic which is stored offline only, this is can be used to recover a hacked or lost account. To broadcast a message a new block added to an id's chain with proof of work attached. This reduces gossip spam by tying it to a single identity and adding cost to producing messages that propagate widely. To add more immutability, these chains are timestamped into bitcoin(not implemented)

# Describe your tech stack (e.g., protocols, languages, API’s, etc.)
We have two partial implementations one in Rust and one in Python, mainly using indy-crypto library for BLS signatures, and uses BIP39 mnemonic

# Track for which you’re submitting (Open or Impact)
Open

# All Bounties Completed/Incorporated
N/A


# A link to all your source code on a public repo (i.e. Github)
https://github.com/cryptoquick/hashd
https://github.com/Harryman/hashd



