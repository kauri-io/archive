---
title: An Introduction to Bonding Curves
summary: Bonding Curves The name is Bonding. Bonding Curves. Nothing to fear, bonding curves are pricing curves that mediate the supply of a token. Bonding curves play a crucial role in shaping the token economics for a given crypto ecosystem. With many crypto projects, games, and dApps spiking in popularity before becoming just a one-hit wonder, it is important for project teams looking to turn a positive launch into long-term success, building upon past hype for future success. Given the right incentiv
authors:
  - C (@calvin)
date: 2019-06-04
some_url: 
---

# An Introduction to Bonding Curves


## Bonding Curves

The name is Bonding. Bonding Curves. Nothing to fear, bonding curves are pricing curves that mediate the supply of a token. Bonding curves play a crucial role in shaping the token economics for a given crypto ecosystem. With many crypto projects, games, and dApps spiking in popularity before becoming just a one-hit wonder, it is important for project teams looking to turn a positive launch into long-term success, building upon past hype for future success. Given the right incentives, participants can use the reliability of a bonding curve to continue supporting communities, ecosystems, and games beyond their first interaction.

Much like a preorder system, you’re trying to address the demand that occurs given a constricted supply at the beginning. Even if you sell out, how do you leverage a successful product launch into continued excitement and participation with your brand?

### Inspired by Bitcoin

Bonding curves mimic the behaviors of a fixed-supply, difficulty-adjusting Proof-of-Work blockchain like Bitcoin. The reason? As block-rewards halve, the marginal-effort or “cost” put into the network to mine a bitcoin, all being equal, doubles. As a result, to create a finite supply, the issuance adjustments create the effect of a bonding curve in offering up more coins at the beginning to bootstrap the popularity and growth of a network. Then later making its overall inflation rate lower over time to keep holders invested and interested in the long term sustainability of the project as a whole.

This is another key goal for bonding curves - encouraging both past early adopters and new interested parties to have a reason to stick around. If the price picks up too quickly, the earliest investors stand the biggest to gain. However, if the curve is not steep enough, individuals are likely more hesitant to jump on, citing the rationale that they can participate at a later date, after seeing more progress, more adoption, or whatever reason, if the price is locked in to be relatively low. As a result, many projects seek a happy median between both. In this article, we explore the four main classes of underlying functions for bonding curves: linear, exponential, logarithmic, and logistic.

### A Case Study: Cryptokitties

Take the case of the most famous dApp, Cryptokitties. Cryptokitties is an interesting example, as it only provides a bonding curve for its rarest Gen 0 kitties. All other kitties are produced on the secondary market and not by the founding team themselves. This hybrid structure of the free market mediating the general supply of the “original” cryptokitties, and allowing the free market to dictate the value of different traits, different generations, etc., allows for a flexible framework for individuals to participate in. Thus, the low-end purchaser can still get their cheap Gen-4 kitties for 0.002 ETH, while the premium customer can bid for the rare Gen-0 kitties. This type of price curve allows for customer differentiation, providing different products with different prices such that the collective ecosystem can have aggregate network effects in terms of total participants of all shapes and sizes.

This pricing also mediates the market price of secondary market Gen 0s - no individual would want to pay more for a lesser kitty. Gen-0 kitties also have a unique constraint on its bonding curve: a fixed supply. There will only ever be 50,000 Gen-0 kitties produced. This means that the bonding curve also has an asymptote, where the release of said tokens stops, regardless of the price you’re willing to pay to coerce a new Gen-0 kitty.

![Cryptokitties is one of the best examples of a price bonding curve](https://api.kauri.io:443/ipfs/QmdYY2q4fGsc9hSX8bm6aVeDJ25rS1NFNrYwsWgyrmFKGh)

Because of the immutability of releasing such a smart contract into the open public, the centralized entity that issued the contract is held to their promise, as if they deviate from the initial code for any unreasonable cause, they may torch their hard-earned committee and kill their revenue generating smart contract. If Cryptokitties were to try to print more than they stated, the community would call into question the scarcity of the ERC-721 tokens, and thus drop the value and willingness to pay for potential Cryptokitty customers.

Cryptokitties also sets a price on its “siring” or “breeding” function, minting new cryptokitties from your existing cryptokitties.

The cost of this breeding also sets a natural anchor for pricing of non-Gen 0 cryptokitties - if any “second-hand” (Gen >=1) cryptokitty were offered at a price higher than the “newly bred” kitties, nobody would buy the second-hand ones, given equal or inferior attributes for these kitties.

Thus, the Cryptokitties game features a few neat angles for mediating supply to ensure that individuals can still have a reason to participate in this game.

The transparency of bonding curves encourages users to continue participating/discussing the project, well after its initial hype phase.

Uniquely, because the team built Cryptokitties on Ethereum, the choice of currency to denominate the price of a bonding curve is also important. If it is not a stablecoin, it means that those who do not want exposure to any changes in the underlying price of the denominating currency, they must hold that coin or otherwise find ways to hedge out any fluctuations in price.

Other bonding curves may be denominated in fiats or other currencies. If the underlying currency is expected to depreciate over time (due to supply inflation), the dApp’s bonding curve may need to grow at a rate to compensate for this.

### Linear Curves

Dapper Labs, the team behind Cryptokitties, recently launched another game, Cheeze Wizards - in which the team created two different pricing curves: a flat and a linear curve. For its most basic Wizard, the entry price was 0.07 ETH. Thus, no matter how many people decided to purchase a Cheeze Wizard of this type, the price would remain constant.

Meanwhile, there was an option for another type of Cheeze Wizard, for which each Wizard’s price was 0.01ETH higher than the one before it. This bonding curve would be described as a linear one, with the price being directly related to the level of adoption and demand. However, there’s an added element to this price curve - the “power attribute” of each Wizard is proportional to the price paid for it. This element combats the biggest issue with linearly-increasing bonding curves: a diminishing marginal incentive to participate.

Typically, in a linear pricing curve, while each purchase equally increases the price for all participants (giving it an image of fairness), the earliest participants still have the highest potential returns, and the marginal percentage returns to the Nth customer are just 1/N, leading to a decay that makes it difficult to sustain sufficient network growth. The Cheeze Wizard set-up allows for later participants to be compensated in a different manner - a more powerful item.

![Cheeze Wizards](https://api.kauri.io:443/ipfs/QmYwoiSAL7qbcRj3ET85Mi9Gg2Cz4eiu7jGSXYyv5jDx7z)

Few bonding curves in practice act as purely linear, often because the difficulty of bootstrapping a network often requires a greater “penalty” for being a late bird vs being an early bird.

For example, during the ICO craze of 2017, many ICOs offered steep discounts for earlier participants (either based on hard caps, rounds, or time tranches). These discounts mimic the properties of bonding curves, except that the price of these tokens often occurred before any product or network was deliverable.

### Exponential

To give every participant the same marginal return for each additional participant, a bonding curve may exhibit features of an exponential function. As with many multi-level marketing schemes, Ponzi schemes, and the like, exponential rewards are hard to sustain and come at a great cost for whoever is the program’s sponsor. However, in many crypto networks, this “cost” may be borne by the token holders themselves in the form of total supply dilution. With exponential function-based Bonding curves, it is important to consider the implications of a continuously compounding and growing pricing function, as someone has to pay. Another consideration is that if the price of the curve rises too quickly, the equilibrium for the demand of the project may be met before it gains scale, as the price may reach impossible heights too quickly. There is also a limitation to the exponential growth - the total value of the coins or tokens that a smart contract may accept to pay for these. If one created a smart contract to collect 2^n ETH for the nth customer, this is bounded by the total supply of ETH today.

In this 2^n example, with current ETH supply sitting at under 110 million, 2^27 would already be 134217728, so only 26 customers are even possible.

Even if the common ratio of this exponential function is lower, or for linear pricing curves with a low slope, there is still a risk that the price can be unbounded, making it difficult to predict or project how adoption may continue beyond initial users.

Speaking of Ponzi schemes, the Fomo3D dApp creates incentives to be the “last purchaser” of a key, making the value of holding the last key of a round worth the entire pot size, and all previous purchasers’ keys worthless. This creates a price curve in which there is no price (or even gas fees) that individuals should pay for certain keys. It creates a time frame in which an individual should not bid up and render their previous purchase worthless, and a huge bounty for individuals who can mine/clog the Ethereum network, or otherwise exploit the smart contract that mediates this function.

![Fomo3D saw a lot of activity in 2018, with a designed on-chain Ponzi-like scheme.](https://api.kauri.io:443/ipfs/QmZcQaUEFqrSAYM47om7HRoN67s28D8zSEtfEi773dwsLR)

Thus, on-chain bonding curves are not immune to exploits by default; developers must design them with care such that individuals can be confident in the way that they work - otherwise, their predictability, and their usability, may be significantly affected.

All curves are nominal in nature, and if not denominated in a stablecoin, must be benchmarked to the growth of other things in the space. For example, if a pricing curve was `y = x^2`, with `X` being the price of ETH, but ETH fell to its square root at every time `t` in the future, then you’d have a fixed price in “real” fiat terms. Holding an asset early would’ve meant appreciating in ETH terms but no change or reward in real terms of USD.

Consequently, as much as many staking mechanisms are promising high nominal interest rates, bonding curve growth must also be treated with a grain of salt in regards to whether or not their “advertised” growth is likely to come to fruition.

### Logarithmic

In the most popular choice for bonding curves, many projects choose some logarithmic form for the basis of their bonding curves. The release of supply for a coin often mirrors this type of function as well, as many tokens have a finite, capped eventual circulating supply. However, log formulas are not without their drawbacks. The primary concern is the initial marginal increase in price. Since the early adopters see the most substantial marginal rewards for joining, bonding curves of this nature often create a sense of “FOMO”, encouraging individuals to get in early. However, with many other hands entering at the same time, and shortly after that, the supply dilution of the previously scarce good is also steep. Consequently, individuals participating in the early adoption phases may suffer from higher volatility conditions than later adopters.

With the derivative of a log function in the form `1/x`, the marginal discount of being earlier by one person in adoption is much higher than the marginal discount when the product is established. Mirroring the inverse of the network effect, it makes sense that early adopters (who have the hardest time helping the network grow) are compensated the most for support during the crucial initial stages, whereas the additional referral at platform maturity does little in spurring future growth of the platform. Thus, logarithmic functions provide the best “FOMO-inducing” structure to encourage early participants to ride a wave of rapid growth, before quickly reducing the marginal rewards for participation.

In the long run, just as the Cheeze Wizards example demonstrated, more and more bonding curves may be applied to more than just prices, but other valuable assets such as governance rights, market influence, or other levers of power within crypto communities. What has been explored thus far is where the price is the key variable at play. However, for token ecosystems with governance or other rights of participation - having an asset in hand earlier may, in fact, be more valuable for network participation purposes.

Imagine being able to have a vote on project parameters amongst a relatively rare supply of Voting Wizards, where one vote has a more significant voice on the governance of the project when the community (supply) is small. Over time, as more are issued, bought, or found, the one vote out of the total becomes less and less powerful at a `1/n` rate.

### Logistic

The last type of bonding curve, which may be one that will become more popular in future projects, is a logistic curve. Logistic curves try to incorporate some features of both exponential and logarithmic functions. In terms of convexity, a logistic function is divided into three segments, an initial slow growth phase, a step-growth phase, and a second slow phase approaching a finite value. The first initial slow phase intentionally weeds out the short term opportunist, so that those just looking for short term speculative gains are deterred.

However, the difficulty in growing ecosystems or communities is that nobody ever knows when hockey stick growth can or will happen. As a result, a bonding curve that can trigger the “fast growth phase” based on a certain set of network metrics on adoption, either directly on chain or through a governance vote, may be able to usher in the second phase - a rapid expansion to give a project a significant speed boost in growth. Once the network grows to a sustainable, significant level, the same mechanism can be used to taper the price increases, eventually reaching a finite redemption value.

This type of pricing structure is particularly relevant for “completable projects”, for which further development or other growth is not necessary. Once a certain group or platform attains a critical level of users, it becomes an evergreen product, then the creators of the network can exit the project at a flat value, and allow others to build secondary, layer-two products on top of it.

Overall, the importance of a well-designed bonding curve is made clearer by the increasing presence of DeFi applications that are slowly becoming more efficient in determining the time value of value locked in crypto networks. Bonding curves can help anchor or influence the “time value” of participation in the network, helping projects overcome the issues of initial hype and demand as well as sustaining continued support from their communities.