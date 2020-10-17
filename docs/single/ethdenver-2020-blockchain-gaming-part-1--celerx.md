---
title: ETHDenver 2020 Blockchain Gaming Part 1  CelerX
summary: Zachary Wolff I visited two talks related to blockchain gaming at ETHDenver 2020, and I wanted to provide a quick rundown of what I found to be some of the more
authors:
  - Zak Wolff (@inmathswetrust)
date: 2020-02-17
some_url: 
---

# ETHDenver 2020 Blockchain Gaming Part 1  CelerX

[![Zachary Wolff](https://miro.medium.com/fit/c/96/96/2*5K6-LoPcku-MKm1kbh8PqA.png)](https://medium.com/@zacharywolff?source=post_page-----96adfa2e137d----------------------)

I visited two talks related to blockchain gaming at ETHDenver 2020, and I wanted to provide a quick rundown of what I found to be some of the more exciting concepts, ideas, and games.

In part one, I’ll talk about Mo Dong from Celer presenting on how to “Build & Monetize eSport Games Under 20 Minutes with State Channels”. The [CelerX](https://celerx.app/) gaming platform is built on the Celer network ([whitepaper](https://www.celer.network/assets/doc/CelerNetwork-Whitepaper.pdf)) which operates on the [CELR](https://coinmarketcap.com/currencies/celer-network/) token.

CelerX is a blockchain gaming platform that recently went live on the Ethereum mainnet. The application allows players to compete for prizes in head to head skill-based games using blockchain layer two state channels.

Keeping in mind that ETHDenver is a hackathon, and much of content has a technical focus, Mo walked through a rundown of how CelerX works and described the process that developers could use to integrate their HTML5 games into the app. There was a universal recurring message related to developer returns being 4–5x times higher than that of other ad-based platforms.

How does CelerX work? You can think of it as a skill-based gaming platform. In his talk, Mo took time to explicitly highlight the difference between how random works in a game of chance vs. how random works in a game of skill. From a high level, random does not determine the outcome in a game of skill; it’s determined by how a player performs or how they score.

While this might seem obvious, it’s important to note because gaming laws vary a great deal depending on the jurisdiction, and the final legal designation of a game is not always something a developer can control.

Right now, the CelerX app on iOS offers seven games, while Android provides 13. Games like Solitare Win, 21 Cash, and Gem Cash can be played in free play mode using GameTokens(GT), ETH, DAI, CELR, or USD.

While I found the CelerX iOS user onboarding and deposit process to be cumbersome and lacking in guidance, some of the games are pretty cool. Specifically, I like the 21 Win game, which is a hybrid of blackjack and solitaire.

Before you begin a game, you choose how many tokens you want to stake. There are currently two choices. The USD value of each choice is dynamic and different for each coin. For example, as of this writing, stake one (low) for ETH is ~1.53 USD, and stake two (high) is ~7.63 USD. The amount you choose to wager determines the amount you can win. At these current rates, the $1.53 game allows you to earn $2.54, whereas the $7.63 wager will return $12.72.

Interestingly, with simple math, we can see that the total amount taken from the high game (which gets split between game developers and Celer) is equal to the win amount from the low game:

`21 Win, high game ETH wager in USD = $7.63 x 2 (each player) = $15.26` `$15.26 - total win amount $12.72 = $2.54`

As the pattern repeats across all games and tokens, it’s clear that this is by design.

So, as a developer, if two players compete in a game of ‘high stakes’ 21 Win, the developer or game studio would receive 1/2 of $2.54 or $1.27.

When players play a game, it’s essential to understand (which the app doesn’t make clear initially) that it can take up to seven days to match with a potential opponent. If no match occurs, you will be refunded your stake.

To me, the matching element is critical. I asked Mo about it this crucial part of CelerX after his talk, and he explained that they use statistical analysis to rank players so that excellent players don’t get matched with beginners. I want to collect more info on how that works.

Overall, as the title of Mo’s talk implies, the focus was on how developers can integrate games into CelerX. Mo recommended [Cocos](http://www.cocos2d.org/) for game development but also mentioned a native Unity plugin is coming later this year. From there, integration involves importing a library and adding a couple of hooks into your HTML5 game code.

After his talk I also discussed with him the process of how CeleX handles game selection. He mentioned there are have been a lot of games submitted but they are working hard to ensure quality control. More games are likely coming soon.

In part two of my ETHDenver 2020 Blockchain Gaming series, I’m going to talk about Ben Heidorn from Blockade Games’ excellent presentation on “The Mainstream Blockchain Game Infrastructure.” His talk highlighted fascinating details around the challenges of building impressive free to play games like [Neon District](https://www.neondistrict.io/) using blockchain.