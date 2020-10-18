---
title: Sandcastle, our Latest R&D Pre-Alpha Release, Brings SQL to Ethereum Smart Contracts
summary: Sandcastle R&D This article was written by PegaSys Co-Founder, developer, and researcher, Shahan Khatchadourian, Ph.D. Millions of SQL developers are now Ethereum smart contract developers. As someone with a passion for bridging database and blockchain technologies, I’ve spent a lot of time thinking about blockchains as different forms of databases. It’s still the case that a blockchain is not a database, yet. However, Sandcastle, an Ethereum SQL smart contract language, helps bridge that divide
authors:
  - PegaSys (@pegasys)
date: 2019-05-21
some_url: 
---

# Sandcastle, our Latest R&D Pre-Alpha Release, Brings SQL to Ethereum Smart Contracts


  
![Sandcastle R&D](https://pegasys.tech/wp-content/uploads/2019/05/Sandcastle.jpg)

  
  
  
  
This article was written by [PegaSys](http://pegasys.tech/) Co-Founder, developer, and researcher, [Shahan Khatchadourian, Ph.D.](https://www.linkedin.com/in/shahan-khatchadourian-ph-d-66115210b/)

  
  
  
  
Millions of SQL developers are now Ethereum smart contract developers.  


  
  
  
  
As someone with a passion for bridging database and blockchain technologies, I’ve spent a lot of time thinking about blockchains as different forms of databases. It’s still the case that [a blockchain is not a database, yet](https://media.consensys.net/blockchains-and-databases-arent-the-same-thing-yet-5d5eb7df099e). However, Sandcastle, an Ethereum SQL smart contract language, helps bridge that divide.  


  
  
  
  
A Sandcastle [pre-alpha web service](https://github.com/PegaSysEng/sandcastle-tutorial) that translates SQL into Solidity, and which works on all existing clients (i.e., no changes are needed), is now available as a Remix plugin.   


  
  
  
  
**Try the** [**Sandcastle pre-alpha now**](https://github.com/PegaSysEng/sandcastle-tutorial)**! Feedback is welcome.**  


  
  
  
  
Sandcastle improves Ethereum’s data management capabilities by provisioning an on-chain relational database that supports tables, (sub-)queries, aggregation, updates, triggers, and indexes. Smart contracts based on relational semantics can be automatically optimized for transaction cost, performance, scalability and security across blockchains and databases.  


  
  
  
  
Sandcastle operates by translating each table into a smart contract that contains rows of data structured according to the table’s schema. Queries, updates, triggers, and transactions are smart contract methods that execute against these tables. Our tool hides the complexity of joining multiple tables, computing aggregations, using indexes whenever possible, and using Solidity data structures effectively. The architecture diagram below shows that Sandcastle fits into existing development processes because the generated code can be integrated with pre-existing code and compiled using the standard solc-based toolchain.  


  
  
  
  
![](https://lh3.googleusercontent.com/25IiNYEffjJf7MFvRZOTPw6QXnoEBcn6CH6cYOcJihgNqeHGB1e3ddE0ihOtl_tahu23_w32K3ny6WGQgNvkYfU_rKjVYl4CfFhNxaVNxvzk9M5R6yEQ92hY7VmP8qa2DQc3OE1N)

  
  
  
  
##### 

  
  
  
  
**Why did we build Sandcastle?**  


  
  
  
  
Enterprises need to manage and understand complex data in order to make informed business decisions. But committing to that effort will first require strategies to [mitigate the associated costs and risks](https://hbr.org/2019/02/companies-are-failing-in-their-efforts-to-become-data-driven). One way to reduce risk is to improve blockchain’s data management capabilities. One way to reduce costs is to rely on the expertise of the *millions* of existing SQL developers by turning them into Ethereum smart contract developers.   


  
  
  
  
Enterprises will benefit from the (re-)use of SQL as a way to preserve application logic across private and public Ethereum blockchains and databases, while optimizing for each. For example, Sandcastle’s optimizer will be able to take SQL code and generate smart contracts that minimize transaction costs in public chains, and can also generate smart contracts that perform identical application logic while maximizing performance in private chains. Developers won’t have to spend any time hand-coding brittle optimizations that limit agility and innovation. One of the most promising features is the ability to integrate existing enterprise data to model and simulate transactions and processes. We will share more about these exciting features soon.  


  
  
  
  
Sandcastle is one of several steps we’re taking to help advance blockchain data management. If you’re an enterprise that is familiar with databases, focused on building Ethereum applications (i.e., not necessarily low-level), and willing to experiment with Sandcastle, [do get in touch](mailto: pegasysinfo@consensys.net). This is an opportunity to give your input to our work blending database and blockchain paradigms.   


  
  
  
  
*We thank*[ *Eric Kellstrand*](https://www.linkedin.com/in/eric-kellstrand/) *for their contributions, and* [ *Kate Hardy*](https://www.linkedin.com/in/kate-hardy/)*,*[ *Horacio Mijail Anton Quiles*](https://www.linkedin.com/in/mijail/) *and* [ *Gina Rubino*](https://www.linkedin.com/in/ginarubino/) *for their reviews.*

  
  
  
  
*Want to join the team? PegaSys is hiring!*[ *Check out our list of open roles*](https://consensys.net/open-roles/?discipline=41276)*.*

  
  
  
  
*To keep up to date on PegaSys’ progress, check out our*[ *GitHub*](https://github.com/PegaSysEng)*, follow us on*[ *Twitter*](http://www.twitter.com/PegaSysEng) *and sign up for our mailing list below.*  


  
  
  
  
[Sign Up For PegaSys Updates](https://tech.us18.list-manage.com/subscribe?u=529db31d261d52da36bc21ea3&id=f0846ffd7b)  
The post [Sandcastle, our Latest R&D Pre-Alpha Release, Brings SQL to Ethereum Smart Contracts](https://pegasys.tech/sandcastle-brings-sql-to-ethereum-smart-contracts/) appeared first on [PegaSys](https://pegasys.tech).

  



---

- **Kauri original link:** https://kauri.io/sandcastle-our-latest-randd-pre-alpha-release-bri/9c9decae6eb34414a6c91cca3b60b6c8/a
- **Kauri original author:** PegaSys (@pegasys)
- **Kauri original Publication date:** 2019-05-21
- **Kauri original tags:** smart-contract, ethereum, sql
- **Kauri original hash:** QmUYBi3H5X5fyDBVrS2fh5zwocLVf9JZqWqDjksL7xn33d
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



