---
title: Monoplasma  A simple way to broadcast money
summary: Monoplasma is a special-purpose off-chain scaling solution for one-to-many payments. It’s a good fit for any system where you repeatedly need to  Distribute value to a large and dynamic set of Ethereum addresses. Allow recipients to accumulate value over time. Withdraw tokens at their preferred moment. We built Monoplasma because we needed it for the upcoming Community Products feature on the Streamr Marketplace . Community Products will allow end users who produce data through a connected gadge
authors:
  - Matthew Fontana (@fonty)
date: 2019-05-04
some_url: 
---


![](https://api.kauri.io:443/ipfs/QmQSHbBgSFnF1FvNG3PUJw8Y51uCQbrEJN7Xfs7aSMdhyn)

Monoplasma is a special-purpose off-chain scaling solution for one-to-many payments. It’s a good fit for any system where you repeatedly need to:



 * Distribute value to a large and dynamic set of Ethereum addresses.

 * Allow recipients to accumulate value over time.

 * Withdraw tokens at their preferred moment.
We built Monoplasma because we needed it for the upcoming 
[Community Products](https://medium.com/streamrblog/community-products-crowdselling-big-data-iot-blockchain-streamr-fbaa794c7bc9)
 feature on the 
[Streamr Marketplace](https://marketplace.streamr.com/)
 . Community Products will allow end users who produce data through a connected gadget, 
[like a Fitbit](https://medium.com/streamrblog/personal-fitbit-data-sell-streamr-marketplace-blockchain-ethereum-3b32c215660c)
 , or a Tesla, to pool and sell data collectively. And when that conglomerated data product sells, the revenue will then be automatically distributed out to potentially hundreds of thousands of data contributors.
The Monoplasma framework is reusable and un-opinionated, and as such, it’s a piece of software that might help others too. That’s why we wanted to make it standalone as a (hopefully useful) contribution to the Ethereum scaling space.

## What problem does it solve?
Here are some possible use cases for Monoplasma, where this type of one-to-many payment pattern is repeated:



 * Revenue sharing

 * Dividend distribution

 * Staking rewards

 * Repeated airdrops

 * Community rewards

 * Pension/benefit payments

 * Loyalty reward schemes
To outline something more specific I’ll pick an example way outside of our own use case of data monetisation and smart devices.
Imagine a decentralized Airbnb service where ownership shares in apartments are tokenised. An individual apartment could have hundreds, even thousands, of owners, each owning a fraction of it. When a guest stays in said apartment, the fee needs to be split among the owners. Ideally, this would happen on-chain within the payment transaction, but looping through each recipient, calculating their share, and sending tokens to them in a smart contract costs more and more gas as the number of recipients grows. This approach works fine for a handful of people, but it is simply not feasible beyond, say, 100 recipients — the transaction will simply become too large to even be included in a single block!

## Design principles
We looked at the various scaling solutions out there for Ethereum, but none of them met our requirements, which were:



 * It must distribute individual lump sum payments among a large group of recipients.

 * Recipients must be able to accumulate value for as long as they want, and withdraw at will by making a transaction on-chain.

 * Recipients must be able to join the pool without making a transaction or placing a stake. This is different from many other payment channels, and in fact crucial for us. In our use case, the people are mainstream users and we need to minimise obstacles for joining, such as having to buy ETH on day one.

 * And finally, the system should be trustless and transparent.
So we decided to roll out our own, and try to keep things as simple as possible. We were 
[inspired by the different Plasma variants](#a312)
 and payment channel stuff, but we basically threw out everything we didn’t need, to find the simplest possible mechanism that does what we want (and only that!), while maintaining good security properties and trustlessness.
I won’t dive into the endless depths of how Monoplasma compares to every other side-channel/side-chain/payment channel solution out there. I’ll focus on the major functional difference with the rest of the family. This is the one thing to remember after reading this article:
 
_We sacrificed generality in favour of special-purpose._
 
This is not a generic payment system where everyone can arbitrarily transact with each other. The system is unidirectional: there are no transfers between accounts in the side channel.

![](https://api.kauri.io:443/ipfs/QmahajBWs32vSqejLqjiz8vQjYB26FEepemPoTzzesTH3M)

In other words, tokens can’t be spent on the side channel. But why is that a good thing? Since tokens can’t be spent there, there can be no double spending! And as you might know, preventing double spending is arguably the hardest problem in designing any distributed system that transfers value. Not having to deal with this simplifies things immensely, which is exactly what we wanted.

## Positive balance off-chain, negative balance on-chain
Since there’s no side channel spending, balances on the side channel are your cumulative lifetime earnings. In other words, your account balance can only increase monotonically. Hence the name: Monoplasma.
So what about withdrawals then? Withdrawals are tracked on-chain instead of off-chain. The side channel records your cumulative earnings (credits) and the smart contract keeps track of your cumulative withdrawals (debits).

![](https://api.kauri.io:443/ipfs/Qma61nf3ZpBQyUL9fhPPtZ5xSEvXyGxjGRGHmt4KQcAPJ8)

Your withdrawable balance is the difference. To withdraw, all you need to do is prove your positive balance to the smart contract. You do this by providing a simple 
[Merkle proof](https://medium.com/crypto-0-nite/merkle-proofs-explained-6dd429623dc5)
 .
Let’s look at an example. The Monoplasma smart contract holds all the non-withdrawn tokens of the side channel. If we can prove we have earned 100 tokens, and the Monoplasma smart contract has seen us withdraw only 30 so far, it will allow us to withdraw 70 more.

![](https://api.kauri.io:443/ipfs/Qmb873JytyeDiC5syqa6janF9e6oZ4XDfXrdFvvsVExZoz)

The smart contract updates its internal record keeping to reflect that we now have withdrawn 100. If we try to withdraw again with a proof of earnings of 100 (or less), it won’t give us any further tokens. In other words, Monoplasma relies on the secure consensus mechanism of Ethereum to prevent people from withdrawing more than their provable share.

## Other similarities and differences
I’ll briefly highlight some other aspects of Monoplasma:



 * There’s an Operator/Validator model. The Operator controls the off-chain state, and in Monoplasma they are actually the only party who can cheat. The job of the Validators is to check that they don’t.

 * Both the Operator and Validators maintain the off-chain state in a Merkle tree, and the Operator periodically publishes the root hash to the on-chain smart contract to enable withdrawals from that state. This is all familiar from other Plasma variants.

 * One difference, however, is that there’s no challenge period/exit game, as there can’t be double spending. Instead, there’s a non-interactive freeze period to allow time for Validators to exit people’s funds using the last validated honest block in case the Operator cheats. So earned funds do become withdrawable with a few days of latency, which is fine for many use cases, including ours.
Although somewhat simplified, the below table summarizes some of the similarities and differences between Monoplasma and other typical implementations in the same space:

![](https://api.kauri.io:443/ipfs/Qmc1CCQDpY3mgEEzeBSSWpEaC3LNswVgQk4SNz188wjSvU)


## As a developer, how can I try it out?
Monoplasma lives in 
[this repo](https://github.com/streamr-dev/monoplasma)
 within the 
[Streamr Github](https://github.com/streamr-dev)
 . It ships with an interactive revenue sharing demo which showcases the functionalities of the framework. Feel free to clone the repo and play around with it yourself (as others already have done!). Instructions for running the demo are in the readme. You can also watch the demo as I presented it live at 
[ETHDenver](https://www.ethdenver.com/)
 in the video below.

<iframe allowfullscreen="" frameborder="0" height="300" scrolling="no" src="https://www.youtube.com/embed/t7vOoLBFkUA" width="512"></iframe>

We hope Monoplasma will be useful to other #buidlers out there! It will be reasonably well maintained for the time being, because we will be needing it ourselves for at least as long as similar scale and cost can’t be achieved on-chain, which is probably several years away from now.
Kudos to Juuso Takalainen of Streamr who’s done almost all of the heavy lifting, and to 
[Kelvin Fichter](https://www.linkedin.com/in/kelv-in)
 of OmiseGO (and recently 
[plasma.group](https://plasma.group/)
 ) for support and putting us on the right track. A shout-out also to some prior art we came across including 
[RicMoo](https://blog.ricmoo.com/merkle-air-drops-e6406945584d)
 ’s airdrop utility and the 
[OUTPACE](https://github.com/AdExNetwork/adex-protocol/blob/master/OUTPACE.md)
 protocol by the folks at 
[AdEx](https://www.adex.network/)
 .
You can follow the Streamr community’s progress on 
[Peepeth](https://peepeth.com/streamr)
 and 
[Twitter](https://twitter.com/streamr)
 and also join the 
[community on Telegram](https://t.me/streamrdata)
 and our 
[developer forum](http://forum.streamrdev.com)
 .
Good luck!
