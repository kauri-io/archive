---
title: How to Get Server Side Rendering Benefits (Unfurling, Indexing, Search-ability) without Building…
summary: You’re not going to hear much about the topic of server side rendering (SSR) from many blockchain startups. If it’s not about a new scaling mechanism, token economic structure, or some other revolutionary idea, you may tune out or keep scrolling. However, there are plenty of things to talk about as a blockchain startup that are not related to the protocol layer or other bleeding edge research. We still face the same problems regular startups have — with a little extra magic. In our case, we were
authors:
  - Will Villanueva (@will)
date: 2018-11-30
some_url: 
---

# How to Get Server Side Rendering Benefits (Unfurling, Indexing, Search-ability) without Building…


![](https://ipfs.infura.io/ipfs/QmbDwkHYVZWdLzDfHfaNPycYsJ5eMQkxj8tVvzPinQUTjX)

You’re not going to hear much about the topic of server side rendering (SSR) from many blockchain startups. If it’s not about a new scaling mechanism, token economic structure, or some other revolutionary idea, you may tune out or keep scrolling. However, there are plenty of things to talk about as a blockchain startup that are not related to the protocol layer or other bleeding edge research. We still face the same problems regular startups have — with a little extra magic. In our case, we were building quickly and wanted to forgo the heaviness of implementing a server side rendering (SSR) solution in our code. We found we could get all the benefits of an SSR solution without having to implement SSR into our code.
 
**We tackled the following tasks:**
 1. Server side rendering for our React/Redux application — but only to bots :)  
 2. Link unfurling (preview images and extra data when posting on twitter, slack, facebook)  
 3. Indexing, sitemap generation and more

### Server Side Rendering
We’re a client-side React/Redux application using redux-saga. When we first built the application, we moved fast and focused on #SHIPLING. We did not implement SSR. We quickly discovered tying ourselves into a framework like Next or others would constrict our code and make us too reliant on an external, opinionated library. We also chose not to build our own server side rendering logic from scratch. It would have added too many edge cases, complexity to our code, separate logic for the server vs. frontend, and generally heavy architectural implications. We avoided this at all costs, and these decisions gave us the flexibility and agility to move quickly and skip implementing heavy server logic while still having all the benefits of an SSR solution.
 
**WHAT WE DID**
 
We implemented it only for _bots_. Our application loads quickly and has been optimized for slower internet connections. We didn’t need to give our users server side rendering. In fact, that would have required progressive loading of certain components while authenticating and fetching. Many benchmark and research studies dive into the benefits of server side rendering (SSR) and [there just are not many](https://davidea.st/articles/measuring-server-side-rendering-performance-is-tricky). It does speed up the application mildly — but the time until first interaction does not change drastically. Also, you need to put together solid infrastructure for scale and an active running process vs. storing your bundled code in a CDN. Overall, SSR seemed like it was more trouble than it would be worth.

So, we worked hard to make our bot friends happy — Slack, Twitter, Google, DuckDuckGo, Bing, and more. :). And let me assure you, they are all quite happy with our decision. 🤖🤖
 
**HOW WE DID IT**
 
1. We used a lambda function with our CloudFront CDN to reroute bots to a cache service (more on this below) called [prerender.io](https://prerender.io)   
 2. We programmatically refreshed the cache any time an event happened that updated the content on the page (using their api)  
 3. We planned for good old, strategic iteration — we will eventually just run our own cache (it’s not that hard) and forgo the use of Prerender
 
**THE RESULTS**
 
The bots get a fully rendered page in under a second. Meta tags, links, and everything else are indexable and now discoverable by Google. Unfurling happens beautifully — just take a look at this on Twitter:

![](https://ipfs.infura.io/ipfs/QmRUfgaoApWnTrsMoB7Q8yquyF637226GLCwBNU2A4N17i)

I will talk more on unfurling below. :)

#### The lambda functions (or bot rerouting):
 
**Add reroute headers Lambda Function:**
[Gist](https://gist.github.com/villanuevawill/560a7c2f33748876195130eb3d3f8823#file-reroutelambda-js) 

**Initiate Rerouting Lambda Function:**
[Gist](https://gist.github.com/villanuevawill/151c404f32b18f4884cd9d4975c2843b#file-reroutewithheaderlabda-js) 

The first snippet adds the appropriate headers on viewer request. The second snippet triggers the routing/proxy behavior on origin request. Both of these are pure lambda functions based on the code found on [this Github repo](https://github.com/jinty/prerender-cloudfront). In CloudFront, the additions should look like the following:

![](https://ipfs.infura.io/ipfs/QmWLbVLnRwPahvdtV388GxXQJmHi17etqpr8ZLy3YhTs65)

For this to work, you also have to turn on custom headers for the bot request to always forward:

![](https://ipfs.infura.io/ipfs/QmTGv7NvhnEx67DvQCpRjYFk2MBDs18VakEsxsTkdCD3Tp)


#### Prerender:
We plan on building our own service soon. In the meantime, [Prerender](https://prerender.io) has worked well for us. Prerender goes to your page, waits until the everything is rendered, saves the rendered html and caches it. When you send bot traffic to it, it serves the page immediately from cache. We send an API request to Prerender any time our site generates a new page or updates an existing page. This request warms up the cache for that page. Since the client-side application uses [React Helmet](https://github.com/nfl/react-helmet), all meta tags are also rendered for the server.

### Unfurling:
When you share one of our bounties on Twitter, it looks like this:

![](https://ipfs.infura.io/ipfs/QmRUfgaoApWnTrsMoB7Q8yquyF637226GLCwBNU2A4N17i)

On Slack, it looks like this:

![](https://ipfs.infura.io/ipfs/QmPz4pt7z7kQfkCQoMbjD4EnxnVJjbfH11cVGhAAfXNxQW)

On Facebook it looks like this:

![](https://ipfs.infura.io/ipfs/QmZ6ZuJg5eKbujEEMKTxNXMi9RSr4JoihJ5qfpoA7bmyQN)

 
**In order to accomplish this unfurling, we needed to do 3 things:**
 1. Make sure our meta tags are rendered properly to bots (Already covered above) — [@mathowie](http://twitter.com/mathowie) describes in [this article](https://medium.com/slack-developer-blog/everything-you-ever-wanted-to-know-about-unfurling-but-were-afraid-to-ask-or-how-to-make-your-e64b4bb9254) what you need to put in your meta tags  
 2. Build a service that takes a screenshot any time a new bounty is created or updated  
 3. Include a meta tag with the screenshot/preview image from step 2

We call a serverless function to take a screenshot every time a bounty updates or changes. In the code snippet below, we use [puppeteer](https://github.com/GoogleChrome/puppeteer) to take a screenshot and upload it directly to S3. This enables CloudFront to serve the image through its CDN. The full Github repo on the screenshot function and serverless operations [can be found here.](https://github.com/Bounties-Network/BountiesAPI/tree/master/serverless/puppeteer-screenshots) Keep in mind, the function can be used in a slightly modified format to replace Prerender.

[Gist](https://gist.github.com/villanuevawill/af9f4d0f893b57f74cd4bfae8ef6ceea#file-serverlessscreenshot-js)

On the React application, we use React Helmet and serve up the appropriate image tags. Keep in mind, if your image is hosted in an https endpoint, you need to use the secure image url for Facebook’s [Open Graph (OG) meta tag](http://ogp.me/)s. Slack and many other providers will default to reading either Twitter’s tags or OG tags. Our code that sets up these meta tags can be [found here](https://github.com/Bounties-Network/Explorer/blob/master/src/containers/Bounty/components/SEOHeader.js), and in the snippet below:

[Gist](https://gist.github.com/villanuevawill/d00ef4ceecc02eccbe91b5666d52d350#file-bountymetatags-js)

### Search Engine Indexing and Sitemaps:
To determine whether search engines can properly view and read your page:
1. Use Fetch as Google to render your page and make sure their 
[headless browser](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) can read your pages correctly  
 2. Make sure there are no remnants of ES6 code (you may be surprised)  
 3. Keep your sitemaps up to data and your pages optimized correctly

#### Fetch as Google:
![](https://ipfs.infura.io/ipfs/QmZaHrWU32KAf3JekubktziS5WcfSH4xkyHkvSY8RhYH1F)

This one is simple. If the page shows up for you, you’re in the clear. If not, then you have an issue you need to investigate. In our case, Google was not able to render our pages, resulting in us just seeing a blank page. Our issue was stray ES6 code lying around. One of the libraries we used was responsible and was breaking Google, yikes!

#### No ES6 Remnants:
Google is running Chrome version 41 to view your page. This means it is not compatible with a lot of modern ES6. In order to make sure you have no ES6 remnants, you should run the following command on your javascript bundle: 
`es-check es5 [js-filename].js — verbose`. If ES6 remains are found, an error will be thrown and you will need to investigate further. In our case, [IPFS-API](https://github.com/ipfs/js-ipfs-api) was breaking our bundle for Google and other bots across the web, since IPFS-API and its dependencies are not transpiled to ES5. If you’re running a blockchain startup and include that library in your bundle, then you should definitely investigate if your app experiences the same issues.

#### A little course on Google’s crawler and indexer:
If you decide not to tackle server side rendering (or a Prerender solution), you will slow down the speed at which your pages will be visited by search engines. For example, Google’s crawler follows links across the web. If the crawler lands on your site and realizes HTML content is not loaded immediately, it will add your site to its indexing queue. This means Google’s indexer will visit your site later to evaluate your single page, client-side rendered application for links to index vs recording your links right away. This slows down discovery of new pages drastically. Only Baidu and Google could index our site before our current SSR solution. Other search engines do not even respect client-side applications (Bing, DuckDuckGo, etc.). Looking at how our site was indexed across the web _before_ we had our current SSR solution, only Baidu and Google could index properly. [@wiekatz](http://twitter.com/wiekatz) has a great article about this topic 
[here](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9).

#### Keeping your sitemap up to date:
Every time an event occurs, a bounty updates, or something new is posted, we generate a new sitemap and we ping google to let them know we’ve updated it. We programmatically generate the sitemap on the fly using our API and Django’s sitemap plugin. Once that sitemap is generated, we upload it to s3 to be served by the CDN for the website. Our serverless function that manages this behavior 
[can be found here](https://github.com/Bounties-Network/BountiesAPI/blob/master/serverless/ssr-services/handler.js#L5-L25). The API code for Django around constructing the sitemap [can be found here](https://github.com/Bounties-Network/BountiesAPI/blob/master/bounties_api/bounties/sitemaps.py).
 
**There you go!**
 
That was a lot in one post, but I hope this gives you guidance in your decision on whether you should build a server side rendered application or not. We chose to avoid it for a prerendering solution, and we are happy we did. Hopefully this article will help inform you while you decide on your own approach to server-side rendering, and provide a compelling argument against tying your React code to a specific framework while still receiving the search, unfurling, and bot benefits a first-class server-side rendering solution would provide.

----

Do you enjoy tackling new and exciting challenges? [Bounties Network](https://bounties.network) is building a team of elite, remote-first engineers. Drop us a line if think you would be a good fit.

Check out our new explorer at: 
[https://explorer.bounties.network](https://explorer.bounties.network)
   
 My favorite bounty: 
[https://explorer.bounties.network/bounty/1265](https://explorer.bounties.network/bounty/1265)
 
- Join our [Bounties Slack community](https://join.slack.com/t/bountiesnetwork/shared_invite/enQtMzA2Mjk3MzAzODQwLTZjN2UxMmU5MWYxZTVmMmM4OGNjZDRiMDgwYTVhOTIwYmQ4MjVlMjNkZjYzOTE4MWI4OTFhOWE4ZTUzN2MyNWY)
- [sign up to learning sessions](http://eepurl.com/dpTC-5)
- [follow us on Twitter](https://twitter.com/ethbounties) to see what we’re up to!



---

- **Kauri original title:** How to Get Server Side Rendering Benefits (Unfurling, Indexing, Search-ability) without Building…
- **Kauri original link:** https://kauri.io/how-to-get-server-side-rendering-benefits-unfurli/936e38ed86f641cf9931e6d99f7ae9b1/a
- **Kauri original author:** Will Villanueva (@will)
- **Kauri original Publication date:** 2018-11-30
- **Kauri original tags:** none
- **Kauri original hash:** QmZ9iHqrCCMJnjxQWzVDwEjMoF6Mdfu5JSt47dVL7GE3n9
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



