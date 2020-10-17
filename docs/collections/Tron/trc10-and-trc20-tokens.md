---
title: TRC10 & TRC20 Tokens
summary: Token Issuance In the TRON network, every account is capable of issuing tokens at the expense of 1024 TRX. Users can lock their tokens in separately. To issue tokens, the issuer needs to specify a token name, total capitalization, the exchange rate to TRX, circulation duration, description, website, maximum bandwidth points consumption per account, total bandwidth points consumption, and token freeze. For example- assetissue password abc 1000000 1 1 2018-5-31 2018-6-30 abcdef a.com 1000 1000000
authors:
  - Kauri Team (@kauri)
date: 2019-04-01
some_url: 
---

# TRC10 & TRC20 Tokens

# Token Issuance

In the TRON network, every account is capable of issuing tokens at the expense of 1024 TRX. Users can lock their tokens in separately. To issue tokens, the issuer needs to specify a token name, total capitalization, the exchange rate to TRX, circulation duration, description, website, maximum bandwidth points consumption per account, total bandwidth points consumption, and token freeze.

For example: 

`assetissue password abc 1000000 1 1 2018-5-31 2018-6-30 abcdef a.com 1000 1000000 200000 180 300000 365 `  

Tokens named abc are issued with the above command, with a capitalization totaling 1 million. The exchange rate of abc to TRX is 1:1. The duration of circulation is May 31-June 30, 2018. The token has a description of `abcdef`. The provided website is `a.com` domain.

A maximum of 1000 bandwidth points can be charged from the issuer’s account per day. A maximum of 1,000,000 bandwidth points can be charged from the issuer’s account for all token holders’ transactions each day. In total capitalization, 200,000 tokens are locked for 180 days and 300,000 tokens are locked for 365 days.

# TRC10 & TRC20 Comparison

TRC-10 is a technical token standard supported by the TRON blockchain natively. TRC‌-20 is a technical standard used for smart contracts on the TRON blockchain for implementing tokens with the TRON Virtual Machine (TVM). It is <a href="https://theethereum.wiki/w/index.php/ERC20_Token_Standard" target="_blank">fully compatible to ERC‌-20</a>. Below is the interface:

```
contract TRC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
```

The following are some comparisons between TRC-10 and TRC-20, and how these differences might be significant for each of the communities. The highlights are that TRC-10 has about 1000 times lower transaction fee than TRC-20 and can be accessed via API.  

## Developers

<div></div>
<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}

</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>Developers Learning Curve*</td>
    <td>Easy</td>
    <td>Medium</td>
    <td>Medium to Hard</td>
  </tr>
  <tr>
    <td>Interface Customization?</td>
    <td>No</td>
    <td>Yes</td>
    <td>Yes</td>
  </tr>
  <tr>
    <td>Accessible by Smart Contract?</td>
    <td>Yes</td>
    <td>Yes</td>
    <td>Yes</td>
  </tr>
  <tr>
    <td>Accessible by API?**</td>
    <td>Yes</td>
    <td>No</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Lost Token Protection</td>
    <td>No</td>
    <td>No</td>
    <td>ERC223 allows avoiding accidentally losing tokens inside contracts not designed to work with sent tokens.</td>
  </tr>
  <tr>
    <td>Handle Incoming Token Transactions</td>
    <td>No</td>
    <td></td>
    <td>ERC223 & ERC777 allow contract developers to handle incoming token txns</td>
  </tr>
  <tr>
    <td>GUI for ICO</td>
    <td>Yes</td>
    <td>No</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Deposit from Contract Address</td>
    <td>No</td>
    <td>No</td>
    <td></td>
  </tr>
  <tr>
    <td>Can contracts & addresses control/reject which tokens are sent?</td>
    <td>No</td>
    <td>No</td>
    <td>By ERC777, this can be done by registering a tokensToSend hook. (Rejection is done by reverting in the hook function.)</td>
  </tr>
  <tr>
    <td>Can token holders authorize/revoke operators sending tokens on their behalf?***</td>
    <td>No</td>
    <td>No</td>
    <td>Available ERC777</td>
  </tr>
</table>

&ast; _**Each TRC-20 can have more interfaces**_
&ast;&ast; _**For example, Create Token API**_
&ast;&ast;&ast; _**These operators are intended to be verified contracts, such as an exchange, a check processor, or an automatic charging system.**_
<p>
## Investors

<div></div>

<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}

</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>Token Structure Learning Curve</td>
    <td>Easy (Common structure)</td>
    <td>Medium (Need to learn each token structure before sending to contract address)</td>
    <td>Medium to Hard (Need to learn each token structure)</td>
  </tr>
</table>

<p>
## Exchanges/Wallets

<div></div>

<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}

</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>Token Structure Learning Curve</td>
    <td>Easy (Common structure)</td>
    <td>Medium (Need to learn each token structure before sending to contract address)</td>
    <td>Medium to Hard (Need to learn each token structure)</td>
  </tr>
</table>

<p>
## Platform

<div></div>

<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}

</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>Easy to Track</td>
    <td>Easy - Built In</td>
    <td>Need 3rd-party platform to track</td>
    <td>Hard</td>
  </tr>
  <tr>
    <td>In Development</td>
    <td>TVM support are in developers</td>
    <td>Compatible with ERC20</td>
    <td>Some popular standards are available and widely used</td>
  </tr>
  <tr>
    <td>Token Name Management</td>
    <td>Name can be duplicated</td>
    <td>Name can be duplicated</td>
    <td>Name can be duplicated</td>
  </tr>
  <tr>
    <td>Decimal</td>
    <td>Not supported</td>
    <td>Up to 18</td>
    <td>Up to 18</td>
  </tr>
  <tr>
    <td>Tron-Scan Observable</td>
    <td>Yes</td>
    <td>Yes</td>
    <td>No</td>
  </tr>
</table>

<p>
## Bugs/Security

<div></div>

<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}
 
</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>batchOverflow</td>
    <td></td>
    <td><a href="https://medium.com/@peckshield/alert-new-batchoverflow-bug-in-multiple-erc20-smart-contracts-cve-2018-10299-511067db6536" target="_blank">Medium article on batchOverflow Bug in ERC20 Smart Contracts (CVE-2018-10299)</a></td>
    <td></td>
  </tr>
</table>

<p>
## Cost

<div></div>

<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}
  
</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>Transaction Fee</td>
    <td>~ 1000 times lower than TRC20 (using API, not by smart contract)</td>
    <td>~ 1000 times (dynamic) higher than TRC10</td>
    <td></td>
  </tr>
  <tr>
    <td>Transfer</td>
    <td>Can use API to transfer, but costs bandwidth points; transfer in smart contract costs both bandwidth points and energy.</td>
    <td>Energy & Bandwidth Points</td>
    <td>ERC223 transfer to contract consumes half as much gas as ERC20 approve and transferFrom at receiver contract.</td>
  </tr>
   <tr>
    <td>Deposit</td>
    <td>Can use API to deposit, but costs bandwidth points; deposit in smart contract costs both bandwidth points and energy.</td>
    <td>Energy & Bandwidth Points</td>
    <td>ERC223 allows depositing tokens into contract with a single transaction.</td>
  </tr>
</table>

<p>
## Community

<div></div>

<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}
  
</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>Resources</td>
    <td>Relatively less, since it is new.</td>
    <td>High amount of resources.</td>
    <td>Fair amount of resources.</td>
  </tr>
</table>

<p>
## Links

<div></div>

<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
 }
  
td, th {
    border: 1px solid #dddddd;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
}
     
</style>
<table>
  <col width="100">
  <col width="20">
  <col width="40">
  <col width="100">
  <tr>
    <th>Features</th>
    <th>TRC-10</th>
    <th>TRC-20</th>
    <th>Others</th>
  </tr>
  <tr>
    <td>Token Listing Website</td>
    <td><a href="https://tronscan.org/#/tokens/list" target="_blank">Tronscan Token List</a></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ICO Website</td>
    <td><a href="https://tronscan.org/#/tokens/create" target="_blank">Tronscan Token Creation</a></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Participation Website</td>
    <td><a href="https://tronscan.org/#/tokens/view" target="_blank">Participate in TRON Token Issuance</a></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Developers Documentation</td>
    <td><a href="https://developers.tron.network/v1.0/reference#tronwebapi" target="_blank">Developers API Documentation</a></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Smart Contract Templates</td>
    <td></td>
    <td><a href="https://github.com/tronprotocol/tron-contracts/tree/master/tokens/TRC20" target="_blank">Templates GitHub Repository</a></td>
    <td></td>
  </tr>
</table>