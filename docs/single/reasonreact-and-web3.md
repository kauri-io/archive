---
title: ReasonReact and Web3
summary: What is this series about This will be a two part series about frontend development in the Web3 world, illustrated through examples using ReasonReact. The first part of the series being an introduction about how to think in the new Web3 paradigm; lightly touching the available api methods in the Web3.js library but at the same time compartmentalising them into three individual domains being -- - The browser - The connected network - And the accounts available to your dApp. The second part of the
authors:
  - Eric Juta (@ericjuta)
date: 2018-09-19
some_url: 
---

# ReasonReact and Web3

## What is this series about

This will be a two part series about frontend development in the Web3 world, illustrated through examples using ReasonReact.

The first part of the series being an introduction about how to think in the new Web3 paradigm; lightly touching the available api methods in the Web3.js library but at the same time compartmentalising them into three individual domains being :-
- The browser
- The connected network
- And the accounts available to your dApp.

The second part of the series is focused around transactions. You may have heard of the buzzword smart contracts being mentioned in blockchain news. 
Well we have a lot in store for you coming up as we will start to delve into smart contract and wallet interactions! 
This part may feel a bit advanced JS and Web3 wise because we build upon the concepts taught in the first series to handle state management within your dApp from two separate origin data sources; the Ethereum blockchain and your dApp's private centralised (not really a bad thing honestly!) database.

Here I personally have some UI/UX recommendations from experience on working on Kauri's frontend codebase within one's dApp.
We want to be encouraging and handholding your dApp users along the way!

At the end of this series, the aim is for you to have enough knowledge to architect your own frontend technology stack (whether you use ReasonReact or React.js does not actually matter!), understanding when and how to use these previously unknown technologies.

## Web3 as just another technology in the stack

Web3 is really an assortment of tools that have decentralised and p2p implementations underlying them.
But without each tool, there cannot be the whole Web3 Suisse army knife-like toolset!
There are many decentralised libraries outside the context of the Web3 API suite too btw, we'll delve into some of those too. Confusing, I know, just as confusing as the JS ecosystem is to be fair!

There are actually multiple language implementations for the Web3 API, which is great! So as previously mentioned, we are specifically looking at the Web3.js library so maybe the Web3-Rust => WASM => Browser implementation could be an ideal future for your dApp, who knows?

In JS land, the Web3.js library is isomorphic/universal so you get the same data in and out whether the JS runtime is Node.js or the Browser compatible runtime!

The implications of that is that you can delegate Web3 interactions to being in the frontend or the backend and/or the backend being reactive to Web3 interactions triggered by the frontend (as we do in Kauri!).
This gets a bit confusing as you can decide to have specific parts of the data coming from the same origin but layered behind your dApp's backend GraphQL api (REST is so 20th century...) or have a fat client implementation. 
*The choice is really up to you!*

## Thinking about Onchain and Offchain data

You know when I said this can be confusing architecture wise?
Yeahhh..., gonna explain that right now so hold onto your seat.

1.  Offchain data is your database or anything that isn't stored in the Ethereum blockchain
2.  Onchain data anything stored in the Ethereum blockchain

Phew... that was easy!
Nah wait up!

So really, Onchain data is expensive, you have to pay gas in the form of ETH to reward the p2p interaction for compute time and storage.

Given that, we don't want everything Onchain, but only where it makes sense. Interacting with the blockchain is a user experience too you know!

Onchain benefits are due to the implementation of the blockchain technology but not limited to p2p value transfer. Currently explored dApp uses are governance, voting, data integrity and proof of authorship or ownership. Many more are unexplored...

In this series, we utilise a commonly used pattern of linking Offchain and Onchain data as many (if not all) resources and files in the Web3 world have unique, immutable, timestamped IDs.

## Where does ReasonReact piece into this?

There are many React patterns that are possible in React.js but in ReasonReact we're given a limited set of ideal practices due to the ML language implementation.
Rebuilding React in ML has surfaced them!

Enums called variant types, render props and labelled prop arguments all have fancy names but are readable and understandable when we get to them.

To illustrate what's relevant to the frontend world of Web3, we start with the types first and let the code flow all the way down.
The takeaway of this series are the concepts, not the code.

# dApp component domains
## The Web3-enabled browser

Tl;dr some storage, cryptography, p2p and networking protocol apis required by Web3.js are not bundled directly with the mainstream browsers out of the box but are accessible via their extensions/plugin frameworks.

The most common extension used by the ecosystem is [https://metamask.io](MetaMask) so go ahead and install that and save your seed words somewhere safe!

Once you're setup, every webpage gets window.web3 injected.
If you installed MetaMask, calling `web3.version.api` in console returns `"0.20.3"`.
(Yeah they refuse to update, lol.)

Okay so now we think about the different states that matter in the context of our dApp.
In the Web3 world, you carry your identity by your private key which can also be represented by those seed words as you may have already read whilst getting setup with MetaMask.

This means that you can log into any dApp with your single private key. It is common for people to create multiple accounts/private keys per wallet, one for each dApp they use to isolate privacy!

Didn't say the Web3 world was straight forward or easy... Well now you're reading this series then you can contribute now to the UX! Hopefully in ReasonML!

## BrowserWeb3Capabilities

```<BrowserWeb3Capabilities />```

Here I am going to outline a component API in ReasonML to connect your dApp's business logic and the Web3 state of the world.

![/BrowserWeb3Capabilities.png](https://api.beta.kauri.io:443/ipfs/QmV2NY2CGcAzRee5d5DgzyCPvmZr1QZqdzzcnEDTxFZKnm)

![/BrowserWeb3State.png](https://api.beta.kauri.io:443/ipfs/QmSkzyg9VhhEXKkP1GMbrshSLcwvnWQppyu5z7gzgunCrs)

> We use *is*, *can* and *has* prefixes for the props that revolve around this Web3 component's capabilities!

1. Internally the component polls the Web.js library and sets React state starting via componentDidMount().
2. *isLoggedIn*, *currentLoggedInAddress* props are passed to our component for deriving state from props passed in from your own dApp. Did say they were business logic!

![/BrowserWeb3Actions.png](https://api.beta.kauri.io:443/ipfs/QmfQuawGF9bbkp8Ln9bTwB1Hn76TGGsS6KuAZgEUg7js7w)

> Actions are enums but in ReasonML they're variant types with constructors. You see they're wrapping a typed value. Think of them as action.payload in React.js but with amazing type inference.

![/BrowserWeb3Reducer.png](https://api.beta.kauri.io:443/ipfs/QmUU5naDfUjjN4JAyqN1BbEZ5pPMWC2cL6ASncftPvyqyW)

> ReasonReact has the redux reducer model built into its components but is based on the ReasonML/OCaml based pattern type matching.
> Those above actions are types right... you can wrap the action payload in a type and switch case over it, that's it! **OMG**.

## web3.eth.accounts: array(string)

Easy right?

Well now we're gonna go into how we derive relevant Web3 dApp states to render helpful React components that guide the user on what they can and cannot or need to do!

- No window.Web3 found

Well, what about users without `window.web3` in their browser?
You get back `hasWeb3 === false`.

So they can't do `web3.personal.sign()` to even login... 
(A common pattern, where the backend decrypts an arbitrary signed message  via a shared secret that is signed with the user's private key in return for a dApp JWT)

- Logged in/out but locked account

`web3.eth.accounts === []` means that the user has a locked account.
`window.web3` is available but lacking their unlocked account with a user entered passphrase prevents access to the user's address interactions and the Ethereum blockchain.

> Locking/Logging out MetaMask and calling `window.web3.eth.accounts` yields this empty array.

- Current Web3 account differs to dApp logged in one

`hasWeb3 && isLoggedIn && (currentLoggedInAddress !== web3.eth.accounts[0])`
Sigh. This means we can't orchestrate Offchain and Onchain data properly. 
`currentLoggedInAddress` should be derived from your dApp's JWT btw.

- All good

`web3.eth.accounts === ["0xABC..."]` means an account is unlocked and `hasWeb3 === true`. WOOHOO! We can go wild and play around with our dApp! 
Well still not quite until the next part of the series :(.

# NEXT

Next part of the series will include contracts and transaction lifecycles!

We'll talk about truffle-contract calling Solidity compiled ABI JSON files, checking your dApp's network capability

## dApp network compatibility

There is a mapping of well known network ids to their network names:

```
	let networksTypes = {
	  1: "mainnet",
	  2: "morden",
	  3: "ropsten",
	  42: "kovan",
	  4: "rinkeby"
	};
```

- No deployed smart contracts found on current network
- Invalid network
- Network not found
- Fetching/Loading network status
## Co-ordinating offchain and onchain state and what to render
## Thinking about what parts of your dApp are Web2 and Web3
### What really we should show to users who don't have Web3 enabled browsers
## How to guide users pre, intra and post transactions

---

# BrowserWeb3Capabilities.make()

Here's the ReasonReact component implementation code btw!

![/BrowserWeb3Make.png](https://api.beta.kauri.io:443/ipfs/QmS2v8ZEm9B2QwoZaqQ3dcykbURexT4JLFkW4wkJXAjLfb)