---
title: ‘Add to home screen’   Designing & prototyping a native app in HTML
summary: TL;DR- at Paraşüt we built a prototype in HTML & CSS to be able to design, prototype and iteratively test our mobile app. Works great, you should try it. specially in world of designing for web, CSS is such a brilliant and relatively simple way of ‘owning up’ to your design- instead of designing for a fixed size canvas and data situation, you have to define constraints and be (at least partly) responsible for how your design behaves in different situations. When designing for native mobile this
authors:
  - L Daniel Swakman (@ldanielswakman)
date: 2019-05-24
some_url: 
---

# ‘Add to home screen’   Designing & prototyping a native app in HTML

![](https://ipfs.infura.io/ipfs/QmYpeAFYtC7UPhTP3PC7YNUSpWankTB9SMeeWw58rtND21)


 
**TL;DR: at**
  
[Paraşüt](https://www.parasut.com/)
  
**we built a**
  
[prototype](http://mobile-ui.parasut.com/)
  
**in HTML & CSS to be able to design, prototype and iteratively test our mobile app. Works great, you should try it.**
 

![](https://ipfs.infura.io/ipfs/QmT9KVb6EWovsRFwNgd4pHZjzA7PooyYBVh6iaT86PfzdB)

specially in world of designing for web, CSS is such a brilliant and relatively simple way of ‘owning up’ to your design: instead of designing for a fixed size canvas and data situation, you have to define constraints and be (at least partly) responsible for how your design behaves in different situations. When designing for native mobile this is not so easy — but this story shows how we tackled it for 
[Paraşüt](http://parasut.com/)
 ’s mobile app.
About 1,5 years ago we decided to do a mobile app. Paraşüt has been a SaaS product for SME accounting in Turkey, and was exclusively a web app. From a design point of view, we had a useful and fairly scalable design system, based on Atomic Design combined with a library of utility classes. But we wanted to expand on the idea of doing expenses, invoices and contacts on the go.
We formed a 2-man team; one 
[developer](https://twitter.com/kukabilgin)
 , one designer ( 
[me](https://twitter.com/ldanielswakman)
 ). At this point, our startup was mostly rooted in web technologies, which by its continuous development nature made it easier to build an agile product. For me as a designer it was the same; in the past years of designing for web, I had gotten used to being responsible for the designs I made via CSS.

![](https://ipfs.infura.io/ipfs/QmeK5ZzJGuuqigDKwAqGRf8g4e8D3jhgX2e6V9jf1XBYyA)

> “So yeah, we tried design deliverables.”


![](https://ipfs.infura.io/ipfs/QmQrK1WytNbz1vQCuqWhvrHDVR6AkExCE6WjGpujkXN8wW)

After being set on a clear course for the visual & interaction design of the app, the design (Sketch/Illustrator) files started to look a bit like this (see image).
This drove 2 people crazy: the developer, who always had to ask about one or two dimensions, colours or font-styles I had forgotten to specify, and me, who felt like using a foreign language to explain from the start a system I had figured out in another language.
 
_(I won’t go into the details of the app’s design language too much; that’s a story for another time.)_
 
It had another major drawback that visual design programs have: being unable to design hover states, active states, empty states, animations and transitions. The 
[Zeplin](https://zeplin.io/)
 plugin for Sketch takes care of a part of the problems but cannot solve responsive and stateful design. This is the fundamental problem of all classic ‘static canvas’ design tools.
> “Designers, don’t stay inside your Sketch cage!”

So at that point, opened an empty index.html file in my browser, and turned on responsive design mode…

![](https://ipfs.infura.io/ipfs/QmVorkfJinWZwQ6YkaXn8bBjsQTVsCgZZyT55HF7rFFY4W)

… and started to implement the design system in simple HTML and CSS. One page, one html file. Icon fonts. Exact and consistent dimensions. The file structure is nothing more than a folder with 
**HTML**
 files, (image) 
**assets**
 and (S) 
**CSS**
 .
 
_Full disclosure_
 : at Parasut, we love designers who code. We have 4 designers, each in a different (product/marketing) team, that are all comfortable writing HTML, (S)CSS and the odd line of jQuery. In practice, this means we deliver HTML mockups to developers, and manage the growth and maintenance of the SCSS design pattern library.

#### How does it work?
Back to the design for our mobile app. The approach was to create one html page for every mobile view. Let’s take the invoice list for example. The mobile design has a Material Design inspired list view, with a colourful top header, tabs for different list types, and a swipeable list view, with a centred plus button to create a new invoice.

![](https://ipfs.infura.io/ipfs/QmWZmFBSxTR1kjuZjGieA6c6qHo4Zp8BAtbQ5TZTxzsio2)

As you can see, the list view design is nothing more than a 
**<ul>**
 with 
**<a>**
 links inside it. We’re using Font Awesome as an icon set, so that’s as easy as adding a 
**<i class=”fa fa-file-text-o”><i>**
 tag. The files sit in a repository on GitHub, which are directly accessible via GitHub Pages as a site, at 
[mobile-ui.parasut.com](http://mobile-ui.parasut.com/)
 . Any update I push to that repository will directly be visible to any developer, product manager, or test user visiting that URL.
I’ve set up the file structure so that it contains both the html files for the mockup, as well as the few image assets we have for different resolutions:

![](https://ipfs.infura.io/ipfs/QmT2ShikfU3DK2jDTKMh5HxNXmxtoDgegcEYvrGqztNDJz)

And… as much as I’ld like to dive deeper into how it works, that’s about it! The development workflow comes down to the designer committing the html mockups to the repository and creating a GitHub issue that lists the specs. The developer then opens the mockup in their browser, and keeps referring to that during the implementation. When I asked them about what they think of this workflow, a smile appears on their face and they radiate with joy: no more doubt about how the visual design should be implemented, because it is already defined.

#### Takeaways
After some initial struggling, we found a great way to work out and iterate our app, both for 
[iOS](https://itunes.apple.com/tr/app/parasut-on-muhasebe-ve-fatura/id976151321?mt=8)
 and 
[Android](https://play.google.com/store/apps/details?id=com.parasut&hl=en)
 . I find myself constantly handing the web version of the design over to people, both 
_internally_
 when we are discussing the implementation of a new feature — as well as 
_externally_
 , when testing with users if the design works.
In the end this solution begs the question: wouldn’t it be great if there wasn’t such a disjoint between web and (iOS/Android native)? The web has proven agile and continuously iterative for developers and designers; why can’t designing and building for native mobile be the same? We did once explore the possibility of mapping our SCSS to the Android xml stylesheets, but never took it further.
Do you have any similar experiences with designing for native mobile? I’m curious for your thoughts on this, or other takes on bridging the gap between design and development. I hope this read has been useful and can help you on your way when you’re dealing with the shady uncanny valley of designing for mobile.

![](https://ipfs.infura.io/ipfs/QmdXdWxAJKXy8qpwctDidkepPmN4dj4b58cguZkzFXoH8b)

— L Daniel Swakman
 
_Daniel is a graphic & web designer working on achieving great visual experiences in digital and analog context, both for startups and_
  
[freelance](http://ldaniel.eu/)
  
_._
 



---

- **Kauri original title:** ‘Add to home screen’   Designing & prototyping a native app in HTML
- **Kauri original link:** https://kauri.io/add-to-home-screen--designing-and-prototyping-a-na/45d39987ae974e5ab52a2cc0dd772c35/a
- **Kauri original author:** L Daniel Swakman (@ldanielswakman)
- **Kauri original Publication date:** 2019-05-24
- **Kauri original tags:** ux, design, frontend
- **Kauri original hash:** QmbAskyjJfF5A7JEhz1GQVRXND78nzPiFgzty2Bj7QvLM2
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



