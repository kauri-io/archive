---
title: Insight   1  Documentation
summary: IPFS’s Go repository Django documentation Python documentation
authors:
  - Chris Spannos (@chris-spannos)
date: 2018-11-06
some_url: 
---

# Insight   1  Documentation


----


![](https://cdn-images-1.medium.com/max/1600/1*LmBD9OaRAJPnBYBoZwyZMw.jpeg)


<p>For those working to scale the Ethereum blockchain it is easy to focus only on designing the layer one or layer two mechanisms needed to make it happen. Developers have a lot of their own work to focus on. Compounding the problem in Ethereum’s ecosystem is that there is a widespread sense of urgency that scaling must happen now.


<p>But Raul Jordan, co-founder of Prysmatic Labs and developer on their Prysm sharding implementation team, says that taking the time needed to focus on good documentation is necessary to make it easy for other developers to join in.
The sense of pressure to focus on mechanism design can lead developers to compromise on their documentation he says. 


<p>“Whenever someone else looks at their code or tries to understand what they’re working on it becomes almost impossible. It’s really hard to understand the context.”


<p>This is even more important in open source communities where, beyond just core developers, a lot of people may want to help.


<p>“It’s just a matter of having good entry points. I can’t really stress that enough,” Raul says.
Prysmatic Labs has provided one such [entry point](https://github.com/prysmaticlabs/prysm/blob/master/client/CONTRIBUTING.md) for full-and part-time contributors where anyone can help them develop their sharding implementation.


<p>Most of Ethereum’s protocol development occurs in a distributed fashion with remote contributors so it is important to provide clear and organized information.


<p>“People will be looking at your project from all around the world. There is no point in having it open source if you can’t attract any of the talent.”


<p>“That’s one of the reasons behind why we do bi-weekly updates. It’s not just to tell everyone what we’re up to. It’s more to show that we have really good tracking of our goals.”


<p>“That it’s not only visible to us but anyone else can see and criticize and jump in.”


<p>But there is no one size fits all style of documentation to make it easy for people to help out. There are various types and you often can’t get by with only one of them, Piper Merriam, lead architect for Py-EVM’s Trinity sharding implementation, tells me.


<p>“You need the lowest level of documentation of: ‘What are all the different APIs? What do they expect?’ and the description of what they do and how they behave.”


<p>“Then there’s normally sort of a narrative style documentation that tells more of a ingestible story about what the framework library, what it does and getting you up to speed with a mental model of how it all fits together. It’s a harder type of documentation to write, because you’re building the concepts that your users need to understand and you have to figure out where to start.”


<p>Py-EVM is a Python implementation of the Ethereum Virtual Machine designed to enable a wide array of use cases for public and private blockchains. Trinity is a base implementation of a full node based on Py-EVM.


<p>The project, its [documentation states](https://github.com/ethereum/py-evm) , aspires to provide “friendly and easy to digest documentation.” This will evolve to include narrative style documentation and practical examples.


<p>“I think we’re going to start referring to this as our cookbook, but it’s sections with code examples that layout relatively fully formed solutions to commonly shared problems that people run into. So that you can, in the practical sense, come along and find almost functional code to do the thing that you’re likely to do with the application.”


<p>Piper highlights the example of how Python provides this documentation around small kits, standard libraries and APIs.
“There’s API documentation that documents all of the different objects and things that are available but there’s also big chunks that say, ‘This is how you would build a web server use case’ and lay out how you fit all of those different pieces together.”


<p>In addition to these three styles — API docs, narrative docs and cookbook style documentation — Raul at Prysmatic Labs’ says “I wish that there was better information … on certain projects; better tests, better onboarding guidelines.”


<p>When asked about better documentation in the Ethereum space David Knott, research scientist at OmiseGo working on Plasma and OmiseGo’s decentralized exchange, told me that he would like to see “More proof of concepts!”


<p>David explained that proof of concepts can help people get excited and help highlight what’s good and what’s bad in the design.


<p>“There could be lots more tutorials demonstrating, and helping people understand, how to get things up and running,” he said.


<p>On proof of concepts, Piper explains that a lot of Ethereum’s development is fueled by either known use cases or theoretical solutions to problems that exist. “The only things I wish that we spent more time on if we had more capacity to do was to write up those blog posts on ‘This is how you would build this thing using our tools’ because I have a lot of ideas about things that you could build that would be useful or ‘You want to build something that scrapes information from this, then this is how you would do it’. Or you want to build the testing harness for your thing, this is how you would do it using these tools that we make’.”


<p>Echoing the problem that core protocol developers have a lot to focus on in their own work, Piper says that “I think there’s a lot of room in [proof of concepts], and my hope is that we see some of that happening more in a third party sense just because in terms of our time and where it stands, right now there’s just enough core development that spending time doing those other things, I don’t think is the right investment.”


<p>Nonetheless, they are still very valuable and necessary. “I think that illustrative proof of concept examples for these things are a great way to onboard good people and to, well, show them how you would build these things.”
 

<p>**Recommended examples of project documentation:** 

 *  [IPFS’s Go repository](https://github.com/ipfs/go-ipfs) 


 *  [Django documentation](https://docs.djangoproject.com/en/2.1/) 


 *  [Python documentation](https://docs.python.org/3/) 
 

<p>
**Note:** Scaling Today is funded by the May 2018 Ethereum Grants Program. For more information visit: [scaling.today](https://scaling.today) 
