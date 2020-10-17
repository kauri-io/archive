---
title: Ethereum community and its ecosystem  Networks Visualisation Analysis
summary: Ethereum community and ecosystem- Networks visualisation analysisVisualisation of the Ethereum Ecosystem- interactions and relationships between subcommunities. In the previous reflexions we have analysed the conditions for a crowd to become a community, we have determined that the open and distributed protocol behind Ethereum is acting as a foundation for a vibrant ecosystem that is shaped by hundreds of active groups of individuals scattered around the world. It has allowed the creation of a s
authors:
  - Michael A (@silver84)
date: 2019-03-20
some_url: 
---

# Ethereum community and its ecosystem  Networks Visualisation Analysis

<FONT size="2pt">_Ethereum community and ecosystem: Networks visualisation analysis_</FONT>

#<FONT size="5pt">**<u>Visualisation of the Ethereum Ecosystem: interactions and relationships between subcommunities.</u>**</FONT>

In the previous reflexions we have analysed the conditions for a crowd to become a community, we have determined that the open and distributed protocol behind Ethereum is acting as a foundation for a vibrant ecosystem that is shaped by hundreds of active groups of individuals scattered around the world. It has allowed the creation of a structured systems of communities governed by a general set of rules; we have also observed that this communities is subdivided in specialised groups.<br/>
 If we had to describe the shape of its community, Ethereum looks like a polymorph system, organised around a decentralised network of sub-communities.<br/>
By sub-communities we mean of groups of interests organised around one or several structure, develop reciprocal influence between them and that exists as part of a larger community.<br/>
Polymorph because it looks like a single symbol but when we investigate details, it represents multiple types of entities.<br/><br/>

![](https://api.kauri.io:443/ipfs/QmbAWMp9mc4i7ThHsdMgZKHetoRMiavMsUby6dMyboEeYR)<br/>

This speculative map attempts to categorize the main subdivisions of the Ethereum ecosystem. If we assume that the Ethereum blockchain is the basis for a Dapps platform (distributed application), its open protocol is a public infrastructure. its infrastructure is so essential for the performance and operation of all Dapps.<br/>
Groups of specialised individuals get together around specific projects in order to satisfy different needs.<br/>
Some groups will focus around projects in order to improve of the protocol itself (the EVM for example) others will be focus on projects that help the scalability of the system (layer 2), others will try to develop application on the protocol in order to solve problem for other groups of people outside the community…..<br/>
We can use this method to help categorised and understand the Ethereum community however, the problem with this approach is that each groups who focus around one projects, can have members who are also involved or interested to other projects, an interconnection between project that we need to analyse<br/>

**Network visualisation analysis**<br/><br/>

With this method we will try to identify sub-communities inside the Ethereum ecosystem by using a network analysis method named graph theory and network analysis.<br/>
The purpose of this graph analysis is to observe and understand the reciprocal influence of subcommunities inside the Ethereum ecosystem. In this analysis I have used an open source command-line tool written in[ Python](https://github.com/jdevoo/twecoll/blob/master/README.md) to retrieve data from Twitter and then an [open-source software](https://gephi.org/users) for visualizing and analysing large networks graph.<br/> The data collected are public data (official twitter account) of most famous projects building on ethereum or "ethereum friendly" project, helping the ecosystem (eg: Ipfs, zcash fondation, polkadot, cosmos, Ocean protocol....). <br/>I have curated122 projects in order to determine their reputation (what is a famous project?) according of standard criteria:<br/>
- Does it have a long-term historical reputation?
- Does it have a github accounts?
- Does it have other social media exposure (twitter reddit facebook youtube and so on)?
- How many people are signalling they support this project?
- Is it backed by others official projects or influencer (developers, entrepreneurs, analysts) within the ecosystem?
- What is the probability that it satisfies one of set of needs stated above (usability, prosperity, value satisfaction)? You can find the entire list in [github](https://github.com/silver84/Ethereum-community-toolset/tree/master/src/raw_dat_and_gml_data).<br/><br/>

Analysing a community via twitter will not give you an exact metrics on the nature of a community but an attempt to gain a better understanding. The graph visualisation of the “who’s following who” in twitter allows us to highlight the structure of the network’s relationships and identify projects whose position is specific. It also allows us to identify weak and strong signal such as:<br/>
- The diversity and density of the network, the degree of influence of a project, how the flow of information transmit itself from project to project.<br/>
- Identify potential affinity and interest between projects and eventually identify sub-community within the network.
Unfortunately, not all projects will be represented as not all of them have enough visibility or credibility (in my opinion) to be considered in my analysis.<br/>
 I encourage everyone to participate to the [collaborative library](https://github.com/silver84/Ethereum-community-toolset/tree/master/src/raw_dat_and_gml_data) I have created and add missing data about Ethereum projects.<br/><br/>

**Analysis of the different graphs**<br/><br/>

On of the most interesting graph is the graph who combine **[Fruchterman-Reingold](https://github.com/gephi/gephi/wiki/Fruchterman-Reingold),Fruchterman-Reingold, Weight Degree and [Hubs and authorities](https://github.com/gephi/gephi/wiki/HITS) algorithm.**<br/><br/>
In our analysis this graph algorithm was used to emphasis the importance and the influence in term of attraction and relationship each nodes has inside its network, identified which hubs as the most authorities ( high number of interconnection with the rest of the network + higher flow of informations passing through them). Large and cold color hubs represent hubs with higher score of authority and high weighted value within the network.<br/>
In this graph we can observe that project like **Ethereum Network, Mycrypto, MyethereumWallet, Consensys, Metamask, Status** are the projects who attract most of informations flow and are the most important in term of “weighted value”(hubs with large number of relationship and interconnection) compare to the rest of the network .On the other hand small and warm color hubs represent hubs with small score of authority, small weighted value (hubs with smaller number of relationship and interconnection) and less affinity compare to the rest of the network.<br/><br/>

![](https://api.kauri.io:443/ipfs/QmYxgGkBNR1RKN6tCxBeL43LmUujPfcPSBXXbWhYm3JDmt)<br/><br/>

Another interesting graph is the  graph who combine **[ForceAtlas2](https://github.com/gephi/gephi/wiki/Force-Atlas-2), Weight Degree and [Modularity](https://github.com/gephi/gephi/wiki/Modularity) algorithm.**<br/> In our analysis this graph algorithm was used to analyse the structure of the community and identified potential sub-community inter-relation.<br/>
ForceAtlas2 algorithm introduce the notion of repulsion/attraction force between nodes and hedges, nodes repulse each others like charged particle, while edges attract their nodes. At the end the graph create a more balanced state of the network, it also emphasis dependency within this network of hubs. Dense cluster of hubs means hubs with lot of affinity between each other.<br/>
The warmer the color of the hubs the more inclusive a hubs is (hubs with interconnection and relationship with almost every types of hubs within the network). The colder the color the less inclusive a hubs is (hubs with always the same interconnection and relationship with similar hubs within the network).<br/>
The size of the hubs is like above their comparative weight value. Large weighted value hubs tend to attract smaller one (node with high level of dependency) in the middle of the graph but some of them have enough repulsion power (low level of dependency) to be located on the hedge of the network. The density of cluster of small hubs around large one represent their level of interest and affinity.<br/>
With this graph we can observe few trends and we can also observe different type of sub-community.<br/><br/>
![](https://api.kauri.io:443/ipfs/QmPbumhyqoyQZTXce1UAdw3dGS1qDKvuYBSQAMcdm8j8HU)<br/><br/>

1) **Ethereum.network** is the most attractive and the most inclusive hub in the network, it is a hub who have a lot of affinity among most hubs in the network<br/>
![](https://api.kauri.io:443/ipfs/QmTZnazb4XAnz1GM48igdgoUR3CXw1bdcCFWxhiRwZT8WB)

2) **MyethereumWallet**, the second most attractive hub, is less inclusive and interact with a less diverse group. However we can also notice that MyethereumWallet draw a lot of small hubs with similar affinity around him. (**Ethereum Classic, nanopool, Idex, forkdelta, Adex Network, Etherchain, POA Network, Ocean trade**….)<br/>
![](https://api.kauri.io:443/ipfs/QmbSMYsx7vqqwSPnaPViFLfg5wD6Lk5FWPgBhLE6xBShPi)

3) Hubs around **Web3 foundation, Parity technology** (dark blue colors) who seems to have a high degree of affinity with the same types of hubs, they interact a lot with each others with a poor level of inclusiveness among the network as a whole (each nodes seems to always interact with the same nodes within the network).<br/>
![](https://api.kauri.io:443/ipfs/QmRWtDuZBH2mnim1iBx14MXhWadGtAoQSNUvB2HhGEvi4P)

4) Hubs around **Consensys** (light blue colors) seems to have a high degree of affinity among them and interact a lot with each others with relatively low level of inclusiveness. They have a low level of dependency with the rest of the network hence are located on the left inside of the graph.<br/>
![](https://api.kauri.io:443/ipfs/QmYhPBFywo7Mk7tvXSo57PqdRjbLE48WGYj9dPsWn6o1FT)

5) Hubs around **Cryptokitties, Spankchain, Omnisego** and **KyberNetwork** who interact with a wilder varities of hubs within the network. The have a moderated level of dependency.<br/>
![](https://api.kauri.io:443/ipfs/QmQRuze8hzdu856iMD4Yc3SGCWob7jS1SaaqtkTrw1q4vN)

6) Hubs with high very low level of dependency but low level of inclusiveness like **Uport, Trubit, Metamask, etherbounties, Infura, Giveth**. They tend to interact with always the same groups of hubs but seems to enjoy a higher level of independency.<br/>
![](https://api.kauri.io:443/ipfs/QmTxpwnvbX6u4QXivEvQCmfkcwgKvr5azpEbg8zKJT1q7d)![](https://api.kauri.io:443/ipfs/QmTwAw6yiMWAc9Ejq6hPSaYaFEaFkKnrP6SUEjzF58wpNX)![](https://api.kauri.io:443/ipfs/QmUcZE5Qc4tyMMT6Mo8sx1HSZWS5q96e2zM5K97m6qif3A)<br/><br/>

7) Hubs with high very low level of dependency and high level of inclusiveness like **Truffle, Makerdao, Ethersphere, Gnosis, Storj** who have been repulsed from the center of the graph while having a strong amount of edges. We can interpret them as hubs on the rise, hubs who are in a process to becoming themselve magnet within the network or form their own sub-community (in the case of Makerdao)<br/>
![](https://api.kauri.io:443/ipfs/QmTAecR8vtFvs8iT9LbYcVnH2NrWHDHptK8gcTvoNBbND5)![](https://api.kauri.io:443/ipfs/QmXeKizMjQ73ArqCsgCvaxJrwCqTfZ7Hgfab6hv7eWVbsj)![](https://api.kauri.io:443/ipfs/Qmd4WcJy7tXGFLJxkUWKWXveY12VyGP59JfTqGTDKZkvLJ)<br/><br/>

8) **Ethereum foundation** and the **Ethereum Community Fund** are not central to the network or located in dense area but on the hedge with relative degree of inclusiveness.<br/>
![](https://api.kauri.io:443/ipfs/QmQSdpn7p1JBv47oGPCn3FQKjtAzTxmDunJidaKKQ82wj8)![](https://api.kauri.io:443/ipfs/QmeJUNYXwJbCUTskkucJCwkRkuJhSt5SReXttBRDSE8SNP)<br/><br/>

The first step for the foundation of a credible governance model is the need for pro-active communications between members of the Ethereum community.<br/>
Network visualisation analysis could be a nice tools to understand the relationships between sub-communities and project who attract lot of attentions as well as understanding how the informations flow inside the Ethereum ecosystem.<br/><br/>


**Contact Information**<br/>
@michaelaudoux

Want to help? have a look at my [github account](https://github.com/silver84/Ethereum-community-toolset)<br/>
Feel free to fork it, add comment, data or even add new projects.

Thank you cards address: [Kudos me](https://gitcoin.co/kudos/marketplace/) @0x2e34cdb393c08086e759e3d186b3b4fb2ca5b1b2


