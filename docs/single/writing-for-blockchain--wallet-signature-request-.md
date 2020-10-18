---
title: Writing for blockchain  wallet signature request messages
summary: This article is for you if you’re curious about the design problems in the blockchain space. If you don’t have a writer on your team, or you’re looking to improve your blockchain product’s onboarding UX. If you’re thinking about the challenge of getting your product into more hands than the existing, tech-savvy blockchain community. Or all of the above. I’m Ryan, Lead UX content designer for the Rimble design system team over at ConsenSys . And I want to help teams write better blockchain applic
authors:
  - Ryan Cordell (@rcordell)
date: 2019-04-30
some_url: 
---

# Writing for blockchain  wallet signature request messages



![](https://ipfs.infura.io/ipfs/QmY1PpMqybDT6jMC4z7etDodJiuEerheiH6xTk4Ag82Nib)

 
_This article is for you if you’re curious about the design problems in the blockchain space. If you don’t have a writer on your team, or you’re looking to improve your blockchain product’s onboarding UX. If you’re thinking about the challenge of getting your product into more hands than the existing, tech-savvy blockchain community. Or all of the above._
 
I’m Ryan, Lead UX content designer for the 
[Rimble](https://consensys.design/design-system)
 design system team over at 
[ConsenSys](https://medium.com/@ConsenSys)
 . And I want to help teams write better blockchain applications that anyone can understand.
Rimble’s goal is to create:
> an adaptable system of guidelines and components to support the best practices of dApp (decentralised application) UX design. Built as an open-source project, the Web 3 Design System helps teams quickly build products that humans will use.

I wanted to start this “Writing for blockchain” series to support Rimble and its mission. I want this series to offer a content design perspective on some of the interactions unique to blockchain.
This space is straight-up crazy and everything is basically an experiment. Things have been built so rapidly and not always with the benefit of a design perspective. And because things are moving so fast, the UX (and the content) is quite often not thought about or just a sticky plaster applied at the end.
It’s quite possible that my advice will be out of date by the time I publish this article. But that’s what makes the space so exciting, so here goes nothing…
 
_Note: if you’re already familiar with content design and the basics of blockchain or Ethereum. Feel free to skip the next few sections until you see the Bufficorn. Don’t know what one of those is? You’ll know it when you see it._
 

### Before we begin, what is Content design?
Before I begin, a content designer is a role on a multidisciplinary product team. Our mission is to ensure that the product has the content it needs to help users complete their tasks. At the most basic level, it’s putting the right content in the right place at the right time.
While a product designer is expected to design an experience as well as create beautiful user interfaces, a content designer is expected to design an experience through a content lens. After working out the content needed, they need to make sure it’s communicated eloquently and accessibly.
This involves partnering closely with research to understand what you need to say, then partnering closely with product design to ensure flows and screens support the content needed.
That was a bit of a whirlwind explanation, but if you’re curious I’ve written plenty more on the subject. Try 
[this article](https://uxplanet.org/ux-writing-and-the-customer-experience-wont-somebody-please-think-of-the-words-f7cdefa3793a)
 for size… (note: I use UX writer and Content designer interchangeably).
The thing about blockchain is that there are very few designers in the space and even fewer content designers or writers on product teams. So I’m hoping this series proves a good resource for improving the content and usability of all the products out there being built — especially if you don’t have a professional writer.
And first up, I want to talk about something completely unique to blockchain… wallet signature request messages.

### But first, blockchain
Before we actually get in to the nitty gritty of wallet signature requests, I just need to lay out some blockchain basics and some terminology.
Blockchain applications are commonly referred to as dApps, which stands for decentralized applications.
They’re decentralized because they use things called smart contracts to reduce or remove the need for middle-people or central authorities. Smart contracts are essentially coded agreements: “ 
_if you do this, I’ll do that_
 ”, guaranteed because they’re written to the blockchain.
One example might be 
[Airswap](http://airswap.io)
 , a platform for trading digital tokens. If you want to buy a Dogecoin, you pay for it in Ether. There’s no middle-person or 
_Dogecorp_
 needed because the code says that if you pay x Ether, you’ll get Y Dogecoin. And that code can’t be refuted.
But I’m getting carried away…
This article isn’t about explaining blockchain — and just as well because I’m not nearly qualified enough to do that. Let’s get back on track.

![](https://ipfs.infura.io/ipfs/QmXQx1MAGHsD314X1eZxeLKoKJ36siLNi8N32bbG9NNjwF)


### Wallet signature request messages
> Caveat #1: I’ll be talking about signature request messages in the context of logging in or accessing a dApp on the Ethereum blockchain, not when they’re used for verifying a smart contract transaction (that’ll come later).

Wallet signature requests are some of the first things you come across when starting out with dApps. They are a crucial part of the decentralized “logging in” process.
With some dApps, all you need is a wallet to access it. No account, no usernames, no passwords, no personal data stored by the dApp at all! A lot of the time you can enhance your experience by adding data afterwards, but it’s not a prerequisite for access.

![](https://ipfs.infura.io/ipfs/QmaXnEgycRXh71AGkiyWDGpEcfswDusZsc16cZJDubS2y3)

Your wallet is your ticket to the blockchain party. It grants you access to a website’s blockchain features.
So for example, if you head to 
[The Bounties Network](https://explorer.bounties.network/explorer)
 you can browse the bounties (tasks people are willing to pay for in crypto) right away. But to outsource or fulfil a bounty you need to be connected to the blockchain because they are fulfilled via smart contracts without middle-people. To connect to the blockchain you just need to log in using your wallet.
That’s why we have signature request messages when logging in to a dApp. They’re essentially a security precaution and a bit like that bank verification modal you sometimes get when you pay for stuff online. In a decentralized world, we don’t need the bank. You can verify yourself using your wallet. So dApps ask you to sign a message in your wallet to prove you have access and aren’t someone acting fraudulently with someone else’s wallet/funds.
 
_As a side note, I’m not sure signing is the best analogy for this. It sounds contractual, scary and there’s no signature in the traditional pen-and-ink sense, but the metaphors of blockchain is most certainly an article for another time._
 
Whether or not you agree with the metaphor, the importance of this verification step is without doubt. Yet the message is often complete gibberish, leading to unnecessary points of friction and confusion.

![](https://ipfs.infura.io/ipfs/QmYEi527roKZNZpsbcpzt8z9nDZzU8ba811v3R3yowXRRT)

This is often the last step (hurdle?) in logging in, so it’s crucial. I think it’s time we started caring more about what it says.

### Content for signature request messages
> Caveat #1: technically speaking, this article focuses just on MetaMask for now. MetaMask is an extension that allows you to have a wallet in your Chrome, Firefox, Brave or Opera browser. I can’t guarantee that the advice I provide is compatible with other technologies.

> Caveat #2: some dApps are more decentralized than others. Where some allow you access via your wallet alone, other dApps ask you to link a wallet to a centralized account. Although my primary focus is on the former, my advice applies more broadly to the latter too.

In my first month working in blockchain, I’ve spent a lot of time logging in to dApps using my wallet.
In theory, you only have to install MetaMask and create your wallet once. From there you can use your wallet to log into lots of dApps. This is actually a good opportunity for a quick login experience. All you need to do is sign a piece of data to gain access via your wallet. Yet even after a month in, this still feels problematic. I’ve never “signed data” before. I need some context and I desperately need some “why” or at least “what for?”. The good news is, there’s no reason you can’t supply that context.

#### The technical bit
Under the hood a signature request is a dApp sending a small piece of data to the wallet and asking the user to go into the wallet and sign to say that they’ve received it.
This data might look like: 
`d458fa15-dcab-4d85-a477-004d6febca12`
 
 
_Make sense?_
 
After some sleuthing (and thanks to 
[this tutorial](https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial)
 ) I realised that this piece of data can be converted into something that 
**can**
 make sense and provide a better user experience. Hooray!
 
`Personal_sign`
 is a signature type ( 
[see it in action](https://danfinlay.github.io/js-eth-personal-sign-examples/)
 — you’ll need MetaMask installed) that allows you to customise the message presented to your user.
In the code it looks a little like this…

```
handleSignMessage = ({ publicAddress, nonce }) => {
    return new Promise((resolve, reject) =>
      web3.personal.sign(
        web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  };
```


 
_I’ve made it bold to show where you customise the message._
 
This will convert the random combination of letters and numbers into something a human can read.
Now you’ve just got to work out what to say.

#### The content bit
I believe getting this message right can really improve the log in experience for both new and return users — all in a really cheap way.
Here’s my content design advice…
 
**Don’t just pre-explain in your app**
 You might be thinking, we have a screen for this in our dApp. But content belongs where it’s most contextually relevant. That’s why you should invest time in writing your MetaMask message — that’s where your users are completing the sign action. If the MetaMask notification pops up automatically (as it sometimes does), your user may not even read your dApp screen. In fact, even if MetaMask doesn’t pop up automatically, they may not read it, especially if there’s no associated button or action to do. We all love skipping content when we think we can.
However, definitely pre-explain the concept of message signing in your dApp too. With the space so new and the concept so different, over-explanation is probably a good idea. Make sure you direct your users to MetaMask when you ask them to sign the message — it doesn’t always pop up.
 
**Be human, have a zero tolerance policy on jargon**
 Nonce doesn’t mean anything to regular users. And means 
[something COMPLETELY different](https://www.urbandictionary.com/define.php?term=nonce)
 in the UK 😱. And why not say “Hi”? Even though they’re interacting with MetaMask, this is still very much a space for your brand and your product.
 
**Be transparent: explain why**
 The biggest obstacle for me when signing a message was trying to figure out what I was doing and why I was doing it. There’s a lot of assumed knowledge in this space. Remember, no one will forgo your dApp because you’re telling them something they already know. But think about how many people are dropping off because they’re met with a scary cryptographic hash or talks of nonces when all they want to do is log in.
 
_Why do they need to sign:_
 to prove they own the wallet.
Remember, “signing” in the real world has financial and legal connotations — it’s a bit intimidating. I think of it more as like signing for a delivery than something contractual. This is a point I’d make in the dApp when asking users to sign the message.
 
**Be direct**
 Invite them to sign the message. That’s the action you want them to take so ask them for their signature. Create a link between your message and the “Sign” button, so it’s clear what signing will do.
 
_What will signing do:_
 prove they have access and 
__
 log them in
 
**Let your users know it’s free**
 In the blockchain world, every on-chain event (a transaction that interacts with blockchain) requires a processing fee. The signature request is off-chain so doesn’t. Users might not understand this at first and be put off from connecting to your dApp. Be explicit that this won’t cost your users anything.
 
**Be secure**
 It’s still advisable to include part of the data in its raw form. This way if an attacker is aware of a previous signature result, they can’t just reuse it. So keep the 
`${nonce}`
 . Just make sure you explain why you’re including a random string of data — to keep their wallet safe and stop hackers.
 
**Be creative**
 It’s a good opportunity to show off your brand style or tone of voice. Take a look at CrytpoKitties to see what I mean.

![](https://ipfs.infura.io/ipfs/QmVTRSBWYgQ9fAaFE9Lt728iKdFss6poPKVTybEahWK4LH)


![](https://ipfs.infura.io/ipfs/Qmb6JFpcYFkT8dYMJkVGLoXvc7eLg8RDcMFpt9t9wVj9uh)


### What does this advice look like?
A good, but generic, message might look something like:
> Hi there from {dApp name}! Sign this message to prove you have access to this wallet and we’ll log you in. This won’t cost you any Ether.To stop hackers using your wallet, here’s a unique message ID they can’t guess: d458fa15-dcab-4d85-a477–004d6febca12


![](https://ipfs.infura.io/ipfs/QmTcm9uKVpYYcpxHgaGXuN5N2aE9mhF4i2U3H9cz2hBKCM)

What this message does:



 * Addresses the user

 * Uses human language, no jargon

 * Reiterates who the message is from

 * Asks them to sign and explains what they’re signing

 * Sets expectations and frames the message in terms of their goal: “by doing this you’ll be logged in”

 * Explains why

 * Makes it clear it’s not financial

 * Includes the nonce for security purposes
Or in other words… when faced with this message, 
**your user understands what they need to do, why they need to do it and what will happen next**
 .
All in just a few short lines of content.
I hope you give this a go — I’d love to see more informative, helpful and human messages next time I sign one.
 
_Huge thanks to @danfinlay over at MetaMask for answering all my questions. And to my Rimble and ConsenSys team mates for providing feedback on earlier drafts of this article_

#### A quick edit
After more user testing, I found that this message must make it clear that the user doesn’t have to remember the nonce or write it down. It might also be worth removing any mention of hackers if your audience isn’t as tech-savvy.
 
Blockchain is complicated and making it simple is even more complicated. So please let me know if you found this useful or if you spot any mistakes.
If you have any areas you’d like covered in a future issue, leave it in the comments or you can reach out to me on 
[@ryancreatescopy](https://twitter.com/ryancreatescopy)
 on Twitter.



---

- **Kauri original link:** https://kauri.io/writing-for-blockchain:-wallet-signature-request-/e46374ec0fbd4403ae9ea351580caa4d/a
- **Kauri original author:** Ryan Cordell (@rcordell)
- **Kauri original Publication date:** 2019-04-30
- **Kauri original tags:** metamask, ux, usability, blockchain, content
- **Kauri original hash:** Qmf11neYJNAJWJgWEzXkAfe2cngRjaUgExyBmEiqdkXEJm
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



