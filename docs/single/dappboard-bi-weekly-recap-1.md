---
title: DAppBoard BI-Weekly Recap 1
summary: The past 2 weeks were a fresh start for our organization. We have been working hard to set up the foundation of the new upcoming version of DAppBoard . We are currently focusing on building the backbone of it- principally how data are collected, organized and accessed. Our goal, in the next few months, is to get the new version of DAppBoard out. This recap is what we did from 12 to 24 November 2018. 🛠 DAppBoard ETL In 2 weeks we architectured, developped and released our Ethereum ETL that is wr
authors:
  - DAppBoard Team (@dappboard-team)
date: 2018-12-05
some_url: 
---

# DAppBoard BI-Weekly Recap 1



![](https://api.beta.kauri.io:443/ipfs/QmS1qe7r4Xm7LBWEUEMhjra1eP5VpvcwrGuzxqjeNeQk3h)

The past 2 weeks were a fresh start for our organization. We have been working hard to set up the foundation of 
[the new upcoming version of DAppBoard](http://dappboard.com)
 . We are currently focusing on building the backbone of it: principally how data are collected, organized and accessed. Our goal, in the next few months, is to get the new version of DAppBoard out.
This recap is what we did from 12 to 24 November 2018.

![](https://api.beta.kauri.io:443/ipfs/QmU9i2oJi3CGouSFzGtMTsVaahCYiK7R3UTRwk9A11JG49)


### 🛠 DAppBoard ETL
In 2 weeks we architectured, developped and released our 
[Ethereum ETL](https://github.com/DAppBoard/ethereum-etl/)
 that is written in Javascript. The ETL’s goal (Extract, Load & Transform)and writes to SQL compatible database.
The elements that we currently focus on are:



 * Basics of the Ethereum blockchain (blocks, transactions, event logs).

 * Tokens (ERC20/ERC721): we aggregate there transfers but also their metadata like name, symbol, number of decimals.

 * Contracts: the source code and element of their ABIs are stored in an easy to use way. Thanks Etherscan for the openness of their API.
We deployed our pipeline and database live for testing and could easily extract more than 60M transactions from 700K blocks, 22K tokens.
All the software we run in the background is and will stay open source. As we can’t rely on decentralized technologies to do what we want yet. We open our work so community can thrust us and grow with us.

### 📊Firsts analysis
We set up 
[the awesome Metabase to access and play with our data](https://www.metabase.com/)
 . Metabase is an open source piece of software that let anyone build queries and visualize and organize the results. The goal was to see if our data were correct and how easy the way they were stored let us play with it.
Our first piece of analysis was about tokens (ERC20/ERC721):

<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>The token space on <a href="http://twitter.com/ethereum" target="_blank" title="Twitter profile for @ethereum">@ethereum</a> is still really active! Everyday, around 4000 different tokens are used. There is an average number of 350K transfers per days.</p><p> — <a href="https://twitter.com/dappboardTeam/status/1065663649027682304">@dappboardTeam</a></p></blockquote>


<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>The number of unique receivers and senders per days is nearly double. A lot of ERC20, ERC721 tokens are still airdropped or minted everyday.</p><p> — <a href="https://twitter.com/dappboardTeam/status/1065663652152442880">@dappboardTeam</a></p></blockquote>

And our second piece about mining ⛏:

<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>It's Friday and we compiled some facts about mining on #ethereum ! 42,576 miners mined a total of 230,592 blocks. #blockchain #Mining</p><p> — <a href="https://twitter.com/dappboardTeam/status/1065932942093008896">@dappboardTeam</a></p></blockquote>


<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>The distribution of miners is leaded by pools like Ethermine 26%, Sparkpool 21%, f2pool 12% <a href="http://twitter.com/etherchain_org" target="_blank" title="Twitter profile for @etherchain_org">@etherchain_org</a> <a href="http://twitter.com/sparkpool_eth" target="_blank" title="Twitter profile for @sparkpool_eth">@sparkpool_eth</a> <a href="http://twitter.com/f2pool_official" target="_blank" title="Twitter profile for @f2pool_official">@f2pool_official</a></p><p> — <a href="https://twitter.com/dappboardTeam/status/1065932945649819648">@dappboardTeam</a></p></blockquote>


<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>The minimum number of transactions included in a block is 0 while the maximum is 388 with an average of 90 transactions per blocks.</p><p> — <a href="https://twitter.com/dappboardTeam/status/1065932948229230595">@dappboardTeam</a></p></blockquote>


<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>With an average gas limit of 8,000,000 we can see that most of the blocks are optimized to use as much gas as possible.</p><p> — <a href="https://twitter.com/dappboardTeam/status/1065932950846488581">@dappboardTeam</a></p></blockquote>


<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>In one week the total amount of gas used was 1,365,199,944,694 while the total gas limit was 1,860,227,470,940. This means that in the most ideal world: blocks are 73% filled.</p><p> — <a href="https://twitter.com/dappboardTeam/status/1065932953317007361">@dappboardTeam</a></p></blockquote>

Those two studies helped us validate our architecture and the correctness of our data set. If you want to be one of the first to see our upcoming tweet storms, do 
[follow DAppBoardTeam on twitter](https://twitter.com/dappboardTeam)
 .

![](https://api.beta.kauri.io:443/ipfs/QmYgTeEb9yrpN85BciBsc7BQT9co7EDXxYpGNDSxrq5kox)

Those 2 weeks went so fast and we could achieve a lot. The next steps of our adventure are:
 
**Step back and explain**
 , as the code written for the ETL has been done fast, a lot of things need to be consolidated and also documented so anyone can use it, or we can read it in few months too!
 
**Produce more analysis**
 , we just scratched the surface of what was possible to do with our pipeline. We’ll try to produce DApps specific dashboards. This will also let us improve even more how we structure and test our data set.
 
**Enrich the data**
 , some of the data we store need to be edited manually for more consistency. We need to build an interface for us to easily check and edit some of the data.
 
**Grow the team**
 , we want to grow the team, but for this we need to decide and secure how we’ll get funded for the next months.
DAppBoard is focusing on building tools to store, explore and explain data that are generated by the Ethereum makers and users. 
[Follow us or get in touch on Twitter](https://twitter.com/dappboardTeam)
 !
