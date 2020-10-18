---
title: Redesigning Web3 UX with WalletConnect
summary: There are a lot of discussions around scalability in Ethereum but few around the experience for users to securely manage and control their keys. To get to mainstream adoption of a decentralized web there needs to be more work in the UX side otherwise users will fallback to centralized and custodial services. However a lot has improved in the past couple months since the price speculation noise has faded and the community was able to focus on core issues. More organized discussions and initiative
authors:
  - Pedro Gomes (@pedrouid)
date: 2018-11-30
some_url: 
---

# Redesigning Web3 UX with WalletConnect



----


![](https://ipfs.infura.io/ipfs/QmZrSHYNCi8aPX9E4VYAMYdBX5tL3crDFxnZgb7EuebSdL)

There are a lot of discussions around scalability in Ethereum but few around the experience for users to securely manage and control their keys. To get to mainstream adoption of a decentralized web there needs to be more work in the UX side otherwise users will fallback to centralized and custodial services.
However a lot has improved in the past couple months since the price speculation noise has faded and the community was able to focus on core issues. More organized discussions and initiatives to create 
[industry standards for better UX](https://ethereum-magicians.org/t/material-design-for-dapps/459)
 have been gaining traction and new protocol standards are moving faster and debated more effectively.
> 
industry standards for better UX
A couple of months back while struggling to find better Web3 UX alternatives, I designed a way to enable 
[Balance Manager](https://manager.balance.io/)
 to connect to mobile wallets.
> 
Balance Manager

![](https://ipfs.infura.io/ipfs/QmRnXT2NDLaGKPkyyL8Jww9FC1HtzPE2TFuevh2M4UUzch)

We developed a prototype and were so excited with the results that we wanted to share with everyone so we open-sourced it as 
[WalletConnect](https://github.com/WalletConnect)
 .
> 
WalletConnect

<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>This is <a href="http://twitter.com/WalletConnect" target="_blank" title="Twitter profile for @WalletConnect">@WalletConnect</a> in action: 📱 Your wallet lives on the phone 💻 The dapp lives on the web 🏁 Scan a QR code to connect 🕹 Interact with the dapp 📥 Transactions are pushed ✅ Confirm the transaction 🔐 Secured with biometrics A simple way for people to use dapps.</p><p> — <a href="https://twitter.com/ricburton/status/978509303500984320">@ricburton</a></p></blockquote>

The vision is to open the world of Dapps that has been enabled by Metamask to all of the mobile wallets available on iOS and Android without the compromise of a small screen or a restricted web view. A simple approach that resembles OAuth that can be implemented by any Dapp or Wallet.
The feedback from the community was amazing and we had external contributions on Github within the first couple of hours. One month later, a lot of hard work was put into it by Jin Chung (Balance), Jaynti Kanani (Matic Network), Arron Hunt (Hart), Jeff Reiner (Contentful) and Witek Randomski (Enjin Network) which kickstarted the project to a great start.

![](https://ipfs.infura.io/ipfs/QmUeRBXMGBNwFNBstA9XsbECkKcipGFHbS87D2f4N3BsSe)

Last Friday, the Ethereum Community Fund (ECF) in collaboration with Gitcoin have funded 6 bounties for WalletConnect as part of the Web 3.0 Infrastructure Fund Pilot Program which were claimed in less than two days.

<blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>Great traction on the <a href="http://twitter.com/ethereumecf" target="_blank" title="Twitter profile for @ethereumecf">@ethereumecf</a> Web 3.0 Infrastructure Fund Pilot Program... team funded 6 bounties worth 2100 <a href="http://twitter.com/MakerDAO" target="_blank" title="Twitter profile for @MakerDAO">@MakerDAO</a> #DAI on Friday for <a href="http://twitter.com/WalletConnect" target="_blank" title="Twitter profile for @WalletConnect">@WalletConnect</a>. I went to Twitter today to drum up interest for these bounties but each has already been claimed! OSS is amazing 😍</p><p> — <a href="https://twitter.com/Mitch_Kosowski/status/1011060750352375809">@Mitch_Kosowski</a></p></blockquote>

In May, the Ethereum Foundation awarded WalletConnect with a 
[grant](https://blog.ethereum.org/2018/05/02/announcing-may-2018-cohort-ef-grants/)
 to support its development. So we decided to take WalletConnect a step further and completely separate it into its own non-profit organization. I have left Balance to dedicate myself full-time on the WalletConnect Foundation that will manage and promote the project across all developers in Ethereum.
> 
grant
But WalletConnect Foundation has the goal to push user experience even further. We are first focused in developing a set of easy-to-use libraries for connecting mobile wallets to desktop Dapps but we are not stopping there, we want to help developers provide better experience for their users to interact with their Dapp using any wallet.

![](https://ipfs.infura.io/ipfs/Qma4oYXiHaDLz9JuyMBXWhq2J75HoFtbByCLxscYk9Kax2)

As first designed by Richard Burton (Balance), we will be developing a 
[WalletConnect Widget](https://github.com/WalletConnect/walletconnect-widget)
 for Dapps to easily integrate with Metamask, WalletConnect, Ledger and Trezor.
> 
WalletConnect Widget
But we also have plans to expand WalletConnect to communicate between mobile Dapps and mobile Wallets by using Deep Linking following the great work done by Viktor Radchenko (Trust) which he 
[shared back in May](https://medium.com/@trustwallet/mobile-dapps-with-deep-linking-and-trust-wallet-6a4712b9b9a4)
 .
> 
shared back in May
I’m super excited for what’s coming next for WalletConnect and thankful to have the early collaboration of amazing teams like Balance, Trust, Enjin, imToken, MyCrypto and many other individuals. Looking forward to have a lot more teams join us in this project and build great products for all users in this space.
Join us on Telegram: 
[https://t.me/walletconnect](https://t.me/walletconnect)
   
 Join us on Github: 
[https://github.com/walletconnect](https://github.com/walletconnect)
   
 Join us on Discord: 
[https://discord.gg/fM8kbHh](https://discord.gg/fM8kbHh)
 
> 
https://t.me/walletconnect
> 
https://github.com/walletconnect
> 
https://discord.gg/fM8kbHh



---

- **Kauri original link:** https://kauri.io/redesigning-web3-ux-with-walletconnect/d77f0c2ca81445f78a2974b5206c6891/a
- **Kauri original author:** Pedro Gomes (@pedrouid)
- **Kauri original Publication date:** 2018-11-30
- **Kauri original tags:** none
- **Kauri original hash:** QmPCptN67UByk6yPPPrPMDoU3Saujkkw1gEAUpkdr8yxCK
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



