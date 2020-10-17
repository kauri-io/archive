---
title: Witnet Monthly Report — October 2018
summary: If this is your first time visiting our monthly updates, welcome! For some general background on Witnet and our technology, please read this 3 minute primer, take a look at our whitepaper , or check out our project’s “must-reads” digest. Every month we update you on our work towards the milestones set in our project roadmap. In September, we proudly shared the release of our prototype, Sheikah. Today we will share what we have been up to since then and the progress we have made towards our next
authors:
  - Witnet (@witnet)
date: 2018-11-20
some_url: 
---

# Witnet Monthly Report — October 2018


----


![](https://cdn-images-1.medium.com/max/2000/0*MKHewYXXP1ugbMUU)

 
_If this is your first time visiting our monthly updates, welcome! For some general background on Witnet and our technology, please_ [read this 3 minute primer](https://medium.com/witnet/witnet-smart-contracts-with-real-power-f79e326da3a4), [take a look at our whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) _, or check out our_ [project’s “must-reads” digest](https://medium.com/witnet/witnet-must-reads-digest-b8d26a909efb)_._
 
Every month we update you on our work towards the milestones 
[set in our project roadmap](https://republic.co/witnet). In September, we proudly shared 
[the release of our prototype, Sheikah](https://medium.com/witnet/welcome-to-sheikah-5b658d4815c8). Today we will share what we have been up to since then and 
**the progress we have made towards our next milestone: the Witnet testnet**.

## 🔧 Product

### Witnet-rust
We are particularly excited to share that 
`Witnet-rust`
 development has boomed over the last month:

 * We **adopted**  [Actix](https://actix.rs/) for powering the different components inside the full node in a concurrent and efficient way using green threads.

 * We **wrote encoders and decoders** to be able to send Witnet protocol messages over the network using the [FlatBuffers](https://google.github.io/flatbuffers/) library from Google.

 * We implemented a lot more of **infrastructure layer components** that are not so noteworthy, but will have a very positive impact on our future development efficiency.

 * We **published the**  [specification for the basic network protocol messages](https://docs.witnet.io/protocol/network/) in the official documentation.

 * The [full specification for the RADON language](https://docs.witnet.io/protocol/data-requests/radon/encoding/)  **has been published** in the official documentation. This is huge: it includes all the data types and methods that will be available on testnet.

 * We also **published our**  [updated roadmap](https://docs.witnet.io/roadmap/)  **and a**  [small glossary](https://docs.witnet.io/glossary/) that gathers our project-wise definitions of the crypto jargon terms we use the most.
 
**By The Way… Open Source Contributors:**
 
Are you interested in contributing to the development of 
[Witnet-rust](https://github.com/witnet/witnet-rust)
 ? We would be thrilled to have you! 
**Visit our new** [contributing guide](https://docs.witnet.io/contributing/) **and** [development guide] https://docs.witnet.io/development/) **for more info**!

## 💜 Team
This past week we 
[introduced you to Gorka](https://medium.com/witnet/team-insights-gorka-research-lead-76da9ecbee3d), 
**our new Research Lead.**
 Gorka is leading our scientific, cryptographic and security research, and has experience working with security attacks and best practices in both software and hardware environments.
 
**The Witnet Foundation still has** [open positions](https://angel.co/witnet-foundation-1/jobs), so if you are aware of the impact a decentralized oracle network will have on the crypto landscape and want to get involved, be sure to check them out!

## 🌍 Community
As we 
[announced last month](https://medium.com/witnet/witnets-fall-event-schedule-b94650a0351a), this October was packed with exciting events that we’re just now returning from. It was great to be able to see old friends and collaborators and also meet people who have never heard of Witnet or had not thought of the issues surrounding data oracles before. We found pretty much all of our conversations about what we’re working to solve and how we’re going about it to to be both enlightening and incredibly validating.

### Web3 Summit
Our first stop was Berlin and the 
[Web3 Summit](https://web3summit.com/). It was a great experience full of rich talks, learning, and discussing the best approach to the Oracle problem with other colleagues. We also got to participate in a cool interview with Griff from Giveth!

<body><style>body[data-twttr-rendered="true"] {background-color: transparent;}.twitter-tweet {margin: auto !important;}</style><blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>Great talk between <a href="http://twitter.com/aesedepece" target="_blank" title="Twitter profile for @aesedepece">@aesedepece</a>, <a href="http://twitter.com/jrmoreau" target="_blank" title="Twitter profile for @jrmoreau">@jrmoreau</a> and <a href="http://twitter.com/thegrifft" target="_blank" title="Twitter profile for @thegrifft">@thegrifft</a> about Decentralized Oracles at #Web3Summit!</p><p> — <a href="https://twitter.com/witnet_io/status/1055513409356263425">@witnet_io</a></p></blockquote><script charset="utf-8" src="//platform.twitter.com/widgets.js"></script><script>function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}twttr.events.bind('rendered', function (event) {notifyResize();}); twttr.events.bind('resize', function (event) {notifyResize();});</script><script>if (parent && parent._resizeIframe) {var maxWidth = parseInt(window.frameElement.getAttribute("width")); if ( 500  < maxWidth) {window.frameElement.setAttribute("width", "500");}}</script></body>


### Status Hackathon
After that, we headed to Prague where we first participated as sponsors in the 
[Status #cryptolife hackathon](https://hackathon.status.im/), a great event where we got to meet smart contract developers from all over the world and participate in meaningful conversations.

![](https://cdn-images-1.medium.com/max/1600/1*l5vX2sf3FjAaYBP4690QSg.jpeg)


### D1Conf
Next, we headed to 
[D1Conf](https://d1conf.com/), which we were fortunate enough to be able to sponsor. This was the decentralized insurance conference where Adán was able to deliver his 
**#DontTrustTheMessenger**
 talk: why smart contracts shouldn’t trust centralized data providers.

<body><style>body[data-twttr-rendered="true"] {background-color: transparent;}.twitter-tweet {margin: auto !important;}</style><blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>P2P and DAOs are here to take over the world." <a href="http://twitter.com/witnet_io" target="_blank" title="Twitter profile for @witnet_io">@witnet_io</a> testnet coming January 2019.</p><p> — <a href="https://twitter.com/jbrukh/status/1056929974450618375">@jbrukh</a></p></blockquote><script charset="utf-8" src="//platform.twitter.com/widgets.js"></script><script>function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}twttr.events.bind('rendered', function (event) {notifyResize();}); twttr.events.bind('resize', function (event) {notifyResize();});</script><script>if (parent && parent._resizeIframe) {var maxWidth = parseInt(window.frameElement.getAttribute("width")); if ( 500  < maxWidth) {window.frameElement.setAttribute("width", "500");}}</script></body>

Adan also participated in an Oracle panel with other members of the community working on different approaches to solving the Oracle problem. It was a lively discussion that really hooked the audience. We were grateful to be part of one of the highlights of the whole event.

<body><style>body[data-twttr-rendered="true"] {background-color: transparent;}.twitter-tweet {margin: auto !important;}</style><blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>Greatest minds in the space of #decentralized #oracles <a href="http://twitter.com/tensorjack" target="_blank" title="Twitter profile for @tensorjack">@tensorjack</a> <a href="http://twitter.com/ThomasBertani" target="_blank" title="Twitter profile for @ThomasBertani">@ThomasBertani</a> <a href="http://twitter.com/dougvk" target="_blank" title="Twitter profile for @dougvk">@dougvk</a> <a href="http://twitter.com/SergeyNazarov" target="_blank" title="Twitter profile for @SergeyNazarov">@SergeyNazarov</a> <a href="http://twitter.com/aesedepece" target="_blank" title="Twitter profile for @aesedepece">@aesedepece</a> <a href="http://twitter.com/bneiluj" target="_blank" title="Twitter profile for @bneiluj">@bneiluj</a> We have all of them on #D1Conf stage now together with <a href="http://twitter.com/RonB7139" target="_blank" title="Twitter profile for @RonB7139">@RonB7139</a> of <a href="http://twitter.com/coinbase" target="_blank" title="Twitter profile for @coinbase">@coinbase</a>. Really humbling 🙏🏻</p><p> — <a href="https://twitter.com/d1conf/status/1056933120178618368">@d1conf</a></p></blockquote><script charset="utf-8" src="//platform.twitter.com/widgets.js"></script><script>function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}twttr.events.bind('rendered', function (event) {notifyResize();}); twttr.events.bind('resize', function (event) {notifyResize();});</script><script>if (parent && parent._resizeIframe) {var maxWidth = parseInt(window.frameElement.getAttribute("width")); if ( 500  < maxWidth) {window.frameElement.setAttribute("width", "500");}}</script></body>

Finally, in this video interview, you can watch Adán explain the core of Witnet’s design and how our technology works on empowering smart contracts.

<iframe width="560" height="315" src="https://www.youtube.com/embed/s0_Bwme-eHA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Devcon IV
DevCon IV was the climax of Prague Blockchain Week and largely the pinnacle of the Fall event lineup this year. Over the course of several days, non-stop talks, workshops and immersive experiences were offered to an enthusiastic group of individuals from all over the world who were waiting with anticipation to share and hear updates on their favorite projects and initiatives. We were encouraged by seeing talks about the very problems we are trying to solve related to data oracles, including a packed talk given by Chainlink’s 
[Sergey Nazarov](https://twitter.com/chainlink/status/1058004990856454144).

<body><style>body[data-twttr-rendered="true"] {background-color: transparent;}.twitter-tweet {margin: auto !important;}</style><blockquote class="twitter-tweet" data-align="center" data-conversation="none" data-dnt="true"><p>Lots of great talks and conversations happening at #Devcon4. <a href="http://twitter.com/aesedepece" target="_blank" title="Twitter profile for @aesedepece">@aesedepece</a> about to watch <a href="http://twitter.com/chainlink" target="_blank" title="Twitter profile for @chainlink">@chainlink</a> talk about decentralized oracles. #DontTrustTheMessenger</p><p> — <a href="https://twitter.com/witnet_io/status/1058003620875005952">@witnet_io</a></p></blockquote><script charset="utf-8" src="//platform.twitter.com/widgets.js"></script><script>function notifyResize(height) {height = height ? height : document.documentElement.offsetHeight; var resized = false; if (window.donkey && donkey.resize) {donkey.resize(height); resized = true;}if (parent && parent._resizeIframe) {var obj = {iframe: window.frameElement, height: height}; parent._resizeIframe(obj); resized = true;}if (window.location && window.location.hash === "#amp=1" && window.parent && window.parent.postMessage) {window.parent.postMessage({sentinel: "amp", type: "embed-size", height: height}, "*");}if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.resize) {window.webkit.messageHandlers.resize.postMessage(height); resized = true;}return resized;}twttr.events.bind('rendered', function (event) {notifyResize();}); twttr.events.bind('resize', function (event) {notifyResize();});</script><script>if (parent && parent._resizeIframe) {var maxWidth = parseInt(window.frameElement.getAttribute("width")); if ( 500  < maxWidth) {window.frameElement.setAttribute("width", "500");}}</script></body>

For sure, traveling to Berlin and Prague for these events provided valuable opportunities for us to present our ideas and progress to the public and get feedback on where we’re at. But for now, **our team is rapidly advancing towards our goals of a Q1 testnet launch and are more than eager to get heads down building again**. We look forward to sharing even more updates as we head towards that milestone!

----


### You can follow Witnet on Twitter and stay up to date on our blog.
You can also:



 *  [Read the Witnet whitepaper](https://witnet.io/static/witnet-whitepaper.pdf) 📃

 *  [Read the FAQ](https://witnet.io/#/faq) ❓

 *  [Join the community Telegram group](https://t.me/witnetio), [Discourse](https://community.witnet.io/) and [Discord](https://discord.gg/QKEa5gU). 💬

 *  [Follow @witnet_io on Twitter](https://twitter.com/witnet_io) 🐦

 *  [Discover other Witnet community channels](https://witnet.io/#/contact) 👥
