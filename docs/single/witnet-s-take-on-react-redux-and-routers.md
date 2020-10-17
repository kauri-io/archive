---
title: Witnet’s Take on React, Redux, and Routers 
summary: After days of frustrations and many hours of discussions at Witnet Foundation we came up with a few conclusions on what our take on React + Redux + routers should be. React apps already worked pretty decently before Redux came and stole the show React predates Redux by 2 years. A lot of solid apps were written with React way before Redux became popular or even before it was a thing at all. The idea of functional composable components is really powerful in itself. The thing is that React isn’t a
authors:
  - Witnet (@witnet)
date: 2018-11-19
some_url: 
---

# Witnet’s Take on React, Redux, and Routers 


----

#After days of frustrations and many hours of discussions at [Witnet Foundation](https://medium.com/witnet) we came up with a few conclusions on what our take on React + Redux + routers should be.

![](https://cdn-images-1.medium.com/max/1600/0*6oPjPw8RuuV-6m_d.png)


### React apps already worked pretty decently before Redux came and stole the show
React predates Redux by 2 years. A lot of solid apps were written with React way before Redux became popular or even before it was a thing at all. The idea of functional composable components is really powerful in itself.
The thing is that React isn’t a framework per se. It won’t impose any opinion on how you have to structure your app, how your components are composed or what’s the role of whatever abstraction you want to build on top (containers, etc.)
This can easily lead the naive React user to write spaghetti code. However, after several hours of frustrations, cursing and revelations, you will end up figuring out something that works for you.

### Redux is awesome (if you need it, when you need it, where you need it)
Redux digs deeper into the waters of this sort of functional reactive programming. The cornerstone idea behind it design is centralizing the management of the application state, making the UI be a consequence of predictable states and deterministic mutations that take place by applying pure functions (reducers) on previous valid states.
In other words: it acknowledges the app state as the single source of truth for what the UI must be showing at every time. As long as you honor this premise, you’ll be OK.
Cool… but… wait. Not all apps are the same in terms of how the UI relates to the app state. Broadly speaking, there are two types of apps:



 * Type A: **many states, few views** .

 * Type B: **few states, many views** .
 
(Of course there’s a whole spectrum between type A and B. But that area is scary. From our point of view, it’s a matter of time that you end up modeling your apps as one of those types.)
 
Apps of type A are trivially implemented with Redux without any hassle, specially if they have a single view that renders many possible states.
But type B is a little more tricky to translate into the Redux paradigm. It’s virtually impossible to create a 1:1 map between the state of your app and the view you are presented. In one way or another, you will need to pivot over some app state value in order to let the UI know which view to render. And that leads to what we consider the biggest pitfall when using Redux: polluting app state with routing info.

### Don’t write your own router
Overloading your app state (the Redux store) with variables telling the UI what section of your app to render is a severe counter pattern. That’s exactly the role of a router. If you go down that road, you are probably overstepping the scope of your app and you’ll be writing your own router.
Even worst, you could fall into the temptation of using the store to tell the UI what to render without isolating those variables into a single key in the Redux store. If your app is of type B, please refrain from doing that. For that type of apps, the store should be limited to work as an app data repository, not a UI state pseudo-router.
We think this is a fact most React + Redux users have realized on their own after some time. But for whatever reason, it is often overlooked, undermentioned or intentionally neglected: most apps can’t rely on the store as a single source of truth for painting the UI.

### Separating concerns when it comes to sources of truth
 
[Separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
 has been a thing for decades for a number of good reasons.
At this point, it becomes clear that there can’t be a single source of truth because there’s no single truth. Different aspects of our app (UI vs. data) have different requirements when it comes to maintaining and updating their state in a deterministic way.
However, it’s true that routing info (UI state) can benefit from the nice features of Redux. That’s the case for 
[connected-react-router](https://github.com/supasate/connected-react-router)
 . For example, time traveling with the Redux DevTools is a must for debugging stateful apps.

### Letting the router do what it knows best
OK, I’ll buy it. Let’s use a Redux-aware router like 
[connected-react-router](https://github.com/supasate/connected-react-router)
 . But… what if I try to navigate to a route that is incompatible with the current app state? I mean, what if the UI needs some variable in the store not to be null or undefined? We all know what happens when a “whatever is undefined” exception arises in the browser… JavaScript dies and the whole UI breaks.
Well, that’s a no-problem for type B apps. This kind of apps should always render “empty UI states” when you navigate to a route that renders a view with no actual items to list or paint. Therefore, accidentally navigating to one of those routes will not break your app but instead show a user friendly message. Don’t panic. UX is safe and sound.

### Limiting the scope of the app-wide state store
Another source of pollution for the app state is transitive data. Transitive data refers to information that is relevant to a single part of the app in a certain point in time. Its scope belongs and is specific to a certain transaction, process or flow that has an start and an end.
For example: a form. The values entered by the user along a multi-step form are only relevant to the form itself. When it reaches the last step, some logic will be performed and some action will be dispatched, triggering a mutation on the app state. But then the form component will get unmounted by React and there’s no good reason to keep the entered data into the store. (Of course we could make the reducers clear out the form data from the store, but that’s simply unnecessary and introduces redundant “chore” code into our reducers, harming their clarity).

It becomes evident that transitive data must be stored in the components themselves (namely, in their containers). This way, every component is responsible of wiping after itself, without running the risk of causing the app state to mutate in such a way that affects other components. It’s a matter of contention.
This pattern stays in line with the original workflow of React: containers should pass as little data as needed to their contained components. In the same way, each container will pass each of its children components only the callback methods or promises they need to report transitive data to their parent.
The containers themselves can handle their internal state as they wish. However, it’s a good idea to use some standard interface for them that somehow mimics the Redux model. 
[MobX](https://github.com/mobxjs/mobx)
 is a good candidate for that, although lighter solutions can be trivially written from scratch.

### The conclusion of our conclusions
 
[Don’t drink the kool-aid](https://en.wikipedia.org/wiki/Drinking_the_Kool-Aid)
 . Use Redux and a router only for what they were thought for. They can interact and work together pretty nicely, but don’t try to mix them up just because you can.
