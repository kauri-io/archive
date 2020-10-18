---
title: Auditing the 0x Protocol v2 with ConsenSys Diligence
summary: ConsenSys Diligence is a ConsenSys service providing audits of smart contracts and programs built off the Ethereum network. Periodically, ConsenSys Diligence will publish a summary of an audit, including weaknesses and recommendations for clients. Recently, the Diligence team completed an audit for the 0x protocol v2 upgrade. Read a recap of the team’s conclusions below. Scope The in-scope items can be divided into the following three distinct parts- Exchange- contains the bulk of the business l
authors:
  - MythX (@mythx)
date: 2019-04-04
some_url: 
---

# Auditing the 0x Protocol v2 with ConsenSys Diligence


 
_ConsenSys Diligence is a ConsenSys service providing [audits of smart contracts and programs built off the Ethereum network](https://consensys.net/diligence/). Periodically, ConsenSys Diligence will publish a summary of an audit, including weaknesses and recommendations for clients. Recently, the Diligence team completed an audit for the 0x protocol v2 upgrade. Read a recap of the team’s conclusions below._
 

![](https://api.kauri.io:443/ipfs/QmPyrBr5KpJg4b8sCk6GHPnoJE3s4F7qyHDEfUFP6o5s1Y)


### Scope
The in-scope items can be divided into the following three distinct parts:



 *  **Exchange:** contains the bulk of the business logic within the 0x protocol. It is the entry point for filling orders, canceling orders, executing transactions, validating signatures and registering new ERC Proxy contracts into the system.
 *  **Asset Proxy** is responsible for decoding asset-specific metadata contained within an order, performing the actual asset transfer and authorizing/unauthorizing Exchange contract addresses from calling the transfer methods.
 *  **Forwarder** enables users to buy assets (ERC20 or ERC721 tokens) with ETH. It removes the required knowledge of WETH and allowances.

![](https://api.kauri.io:443/ipfs/QmT1AMYm75XjuogAY7JCmoH1h6JvbNmCxdaoQ6TAgEHZsU)


### Issue Overview
25 issues were identified during the audit. About half of the issues have been prioritised and already fixed during the initial audit phase. Remediation efforts to fix the remaining issues are currently ongoing. The full list of issues can be found in the issue table overview.

![](https://api.kauri.io:443/ipfs/QmNQ8xqUDtpfg74Ew9cNo235G3ZvTuWF1SE6R7UKdLUier)


### Recommendations
We found the quality of the code base to be high, which is especially appreciated when approaching a complex protocol. In particular:


 * The specification documents are thorough and well written. The diagrams of the system’s interactions help to visualize the system.
 * The code is well commented, particularly in sections where understanding the developer’s intent is essential.
 * The organization of the contract repository is thoughtful and consistent. For example, the names of Solidity contracts which are inherited but not deployed are differentiated with the prefix `Mixin_` . Interfaces are prefixed with `M_` .
Relative to the v1 version of the system, the v2 updates introduce features that significantly improve the user experience. They also introduce many new edge cases, which directly resulted in two critical issues, that have been already fixed during the initial audit phase. These features include:



 * Support for multiple `SignatureType` values especially `Caller` , which was unique in that it did not check the signature. It rather assumed that if _msg.sender_ is equal to _order.makerAddress_ then the order is valid and was in fact created by the _msg.sender_ . See section [3.2](https://github.com/ConsenSys/0x_audit_report_2018-07-23#32-mixinsignaturevalidator-insecure-signature-validator-signaturetypecaller) for more information on the resulting issue.
 * Enabling a 3rd party to call Exchange functions on behalf of a user. See section [3.1](https://github.com/ConsenSys/0x_audit_report_2018-07-23#31-a-malicious-maker-can-empty-a-takers-account-of-all-tokens) for the resulting issue, and remediations.
We believe that the system lacks a rigorous and systematic testing strategy that ensures comprehensive test coverage beyond mere line/branch coverage. We found that many important behaviors were untested during a spot check of the test suite. For more detailed information see issues 
[3.4](https://github.com/ConsenSys/0x_audit_report_2018-07-23#34-assetproxyowner-insufficient-testing)
 , 
[3.7](https://github.com/ConsenSys/0x_audit_report_2018-07-23#37-libbytes-insufficient-testing)
 , 
[3.10](https://github.com/ConsenSys/0x_audit_report_2018-07-23#310-mixinauthorizable-insufficient-testing)
 , 
[3.11](https://github.com/ConsenSys/0x_audit_report_2018-07-23#311-erc721proxy-insufficient-testing)
 and 
[3.14](https://github.com/ConsenSys/0x_audit_report_2018-07-23#314-erc20proxy-insufficient-testing)
 .

### Report
The complete report for the audit has been published 
[here](https://github.com/ConsenSys/0x_audit_report_2018-07-23)
 . Github issues were created in a separate audit working repository and links contained in the report are only accessible to the 0x team and the ConsenSys Diligence audit team.

![](https://api.kauri.io:443/ipfs/QmW8tro1jwV1iJ7vNQ4pra6Sho9XcDv2ZfQd693RemSxhW)