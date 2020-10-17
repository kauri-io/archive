---
title: Building a Decentralized Comment Section with 3Box
summary: User comments are an important part of any content-driven application. Traditional web applications usually pair commenting systems with a corresponding user pr
authors:
  - Kelvin Fichter (@kfichter)
date: 2020-02-04
some_url: 
---

# Building a Decentralized Comment Section with 3Box

User comments are an important part of any content-driven application. Traditional web applications usually pair commenting systems with a corresponding user profile system. When we create commenting systems for the decentralized web we also need decentralized user profiles. Luckily, the [3Box Comments Plugin](https://docs.3box.io/build/plugins/comments) has us covered.

The 3Box Comments Plugin is an easy to use [React](https://reactjs.org/) component that adds a decentralized commenting system to your app. It connects directly to your users' Ethereum wallets, so there's no need to implement yet another profile system. It also integrates with [3Box](https://3box.io/) to upload comments to a database that your users have control over. If you're looking for the ultimate decentralized commenting system, look no further.

In this tutorial, we build a small React app that implements the 3Box Comments Plugin. We cover all the steps you need to take in order to get a decentralized commenting system running. If you're feeling adventurous, you're more than welcome to follow along while adding the plugin to an existing project.

## About 3Box

[3Box](https://3box.io/) is a framework for managing user data in a secure and decentralized way. The [3Box Comments Plugin](https://docs.3box.io/build/plugins/comments) is only one of [the many free and open source tools](https://3box.io/products) in the 3Box ecosystem. 3Box can help you easily integrate various decentralized components, like user profiles or chat systems, into your application. Check out [their website](https://3box.io/) and [documentation page](https://docs.3box.io/why-3box) if you'd like to learn more!

## Setup

The [3Box Comments Plugin](https://docs.3box.io/build/plugins/comments) is a [React](https://reactjs.org/) component. We need to create a React project base first. We use React's [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) tool to set everything up, so make sure you've got [Node.js](https://nodejs.org/en/) and [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your machine.

### Creating the Project Base

Once you're ready, open up your terminal and run the following to create the base:

```sh
npx create-react-app 3box-comments-demo
cd 3box-comments-demo
```

You can check that everything's working as expected by starting the app and heading over to localhost:3000:

```sh
npm start
```

You should see a placeholder page with some basic information about React:

![Initial React app screenshot](https://api.kauri.io:443/ipfs/QmRdD96Qf7FhyFNSGahNz2myAFyrpDFWR9FkVNhZMF2CWJ)

**Note**: You'll have an easier time with this demo if you keep the development server running in one terminal window and edit your code in another.

### Installing 3Box

Next, we install the 3Box Comments Plugin and the [3Box.js SDK](https://github.com/3box/3box-js). 3Box.js connects our plugin to the 3Box data storage system that gives users control over their comments. In your terminal:

```sh
npm install 3box 3box-comments-react --save
```

#### Bug Fix: `multicodec`

3Box makes use of the `ipfs` Node.js package, which itself imports a library called `multicodec`. Due to a breaking change in the current version of `multicodec`, it's necessary at the moment to downgrade the library to version `0.5.6`. Install this library in your terminal via:

```sh
npm install multicodec@0.5.6 --save
```

### Installing an Ethereum Wallet

Finally, make sure you've got an Ethereum wallet (like [MetaMask](https://metamask.io/)) installed in your browser. You need this in order to get an instance of [`ethereum`](https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider) injected into your webpage. You can also easily use a tool like [Web3](https://github.com/ethereum/web3.js) to create an `ethereum` instance, but we'll use a browser wallet to keep things focused.

Once you've installed everything, you're all set to start experimenting with decentralized comments!

## Behind the Scenes

Before we continue, let's take a quick look at how the 3Box Comments Plugin actually works. 

The plugin handles two key features, user profile generation and comment storage. It connects to a [`3box`](https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider) instance and an [`ethereum`](https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider) instance (either injected by a browser wallet like [MetaMask](https://metamask.io/) or created by a tool like [Web3](https://github.com/ethereum/web3.js)) to automatically create a [3Box Profile](https://docs.3box.io/build/web-apps/profiles) linked to the user's Ethereum wallet. The `3box` and `ethereum` instances should exist globally within your application, so your users only need to authenticate once. The plugin then opens a websocket connection via `3box` to stream comments to/from a 3Box database. Users can manage and control all of their comments and data on the [3Box Hub](https://3box.io/hub).

The Comments Plugin can be created in [a few different ways](https://docs.3box.io/build/plugins/comments#2-choose-your-authentication-pattern), depending on when and how your instances of `ethereum` and `3box` are initialized. For the best possible user experience, `ethereum` and `3box` should both be initialized either before or after the Comments component is [mounted](https://docs.3box.io/build/plugins/comments#2-choose-your-authentication-pattern). It's possible to use the component without initializing an instance of `3box`, but users have to re-authenticate on each page using the plugin. More information about the different initialization and authentication flows is available on the [documentation page](https://docs.3box.io/build/plugins/comments) for the plugin.

## Let's Get Down to Business

Now that we've covered the internals, let's get started with our demo application. We start by modifying `src/App.js`. We don't need of React's demo code in `src/App.js`, so go ahead and delete the file's contents.

### Creating an App Component

First, we create a basic [React component](https://reactjs.org/docs/react-component.html) to hold the contents of our app. There's nothing special here, we're just setting things up:

```js
// src/App.js
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="comments-container">
          Hello!
        </div>
      </div>
    );
  }
}

export default App;
```

Your development server should automatically compile the app again once you've made these changes. The webpage should now look like this:

![React app setup screenshot](https://api.kauri.io:443/ipfs/QmRjzWCLes8gz47zTtYzN5q4Dt3coxAXYpD2uNAv5bMCPs)

### Importing 3Box

Now we start setting up our `3box` instance. We import `3box` and `3box-comments-react` at the top of `src/App.js` file:

```js
// src/App.js
import React from 'react';
import Box from '3box';
import BoxComments from '3box-comments-react';

...
```

### Adding Component State

Our `App` component needs to [store some state](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class) for later. Particularly, we need to store a `3box` instance, the user's Ethereum address, the user's 3Box profile (if any), and a readiness flag:

```js
// src/App.js
...

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      box: {},
      profile: {},
      address: '',
      ready: false,
    };
  }

  ...
}

...
```

### Initializing 3Box

We're ready to initialize 3Box. We create our `3box` instance after the component is mounted by listening for the [`componentDidMount`](https://reactjs.org/docs/react-component.html#componentdidmount) lifecycle hook. We need to create a function `login()` that handles the `3box` initialization logic.

**Note** We need access to an `ethereum` instance in order to initialize `3box`. Again, you can create an `ethereum` instance with a library like Web3, but our browser wallet automatically injects an `ethereum` instance on our behalf.

Our `login()` function pulls the user's address from `ethereum` and then uses that address to connect to `3box`. We'll be ready to create the component once this first step is complete. Our `3box` instance does some light synchronization in the background, so we also update the component once synchronization has finished.

Add these new functions:

```js
// src/App.js
...

class App extends React.Component {
  // Constructor from above.
  ...

  componentDidMount() {
    this.login();
  }

  async login() {
    // Request access to wallet and pull addresses.
    const addresses = await window.ethereum.enable();
    const address = addresses[0];

    // Create the 3Box instance.
    const box = await Box.openBox(address, window.ethereum, {});
    const profile = await Box.getProfile(address);

    // Update the box in our state once we've synced.
    box.onSyncDone(() => {
      this.setState({
        box: box
      });
    });

    // Update our state immediately with current values.
    this.setState({
      box: box,
      profile: profile,
      address: address,
      ready: true,
    });
  }

  ...
  // Render function from above.
}

...
```

### Creating the Component

We're finally ready to create our component. We update our [`render()`](https://reactjs.org/docs/react-component.html#render) function so that it renders the component we imported from `3box-comments-react`. Once we're finished with this step, we have have a working comment section!

The Comments component takes a few required parameters. These parameters are:

| Property          | Type     | Description                                                                                                                        |
|-------------------|----------|------------------------------------------------------------------------------------------------------------------------------------|
| `spaceName`       | `string` | A [3Box Space](https://docs.3box.io/api/storage) name for your application. You usually want to use a single `spaceName` throughout your entire application. |
| `threadName`      | `string` | A [3Box Thread](https://docs.3box.io/api/messaging) name for this specific component. Each component typically has its own `threadName`.                          |
| `adminEthAddr`    | `string` | An Ethereum address for the admin of your application. Admins are able to moderate comments in the comment thread.                 |
| `box`             | `Object` | A `3box` instance. In our case, the one we initialized and added to our `state`.                                                   |
| `currentUserAddr` | `string` | The address of the user viewing the component. We pulled this from the `ethereum` instance earlier.

Let's go ahead and create the component using the values we initialized in `login()` by modifying our existing `render()` function. Make sure to replace `spaceName`, `threadName`, and `adminEthAddr` with your own values:

```js
// src/App.js
...

class App extends React.Component {
  ...

  render() {
    const {
      box,
      address,
      profile,
      ready,
    } = this.state;

    return (
      <div className="App">
        <div className="comments-container">
          <BoxComments
            spaceName="your-3box-space-name"
            threadName="your-3box-thread-name"
            adminEthAddr="your-eth-address"

            box={box}
            currentUserAddr={address}
          />
        </div>
      </div>
    );
  }
}

...
```

Wait for the development server to recompile the app. You should be able to see the working demo! When you initially load the page, you should get a few popups from your browser wallet. Specifically, you should see:

1. A [wallet access request](https://medium.com/metamask/eip-1102-preparing-your-dapp-5027b2c9ed76).
2. (Optionally) A request to for a signature to create a 3Box account linked to your Ethereum address, if you don't have one already.
2. A request for a signature to access your 3Box profile.

Once you've accepted these requests, you should be able to leave a comment:

![First 3Box comment screenshot](https://api.kauri.io:443/ipfs/QmSvSXL63yCZbYAyxZLsBsCzunPSWyPPy2JPPhQQ7Qg5iA)

And we're off!

## Optional Settings

We managed to get the basic comments component running, but `3box-comments-react` also provides [a few additional customization options](https://docs.3box.io/build/plugins/comments#3-configure-application-settings). Here's a full list:

| Property                 | Type      | Default | Description                                                                                                                |
|--------------------------|-----------|---------|----------------------------------------------------------------------------------------------------------------------------|
| `members`                | `boolean` | `false` | Whether or not this thread is only open to members of your 3Box Space. If `false`, anyone will be able to comment.         |
| `showCommentCount`       | `number`  | `30`    | The number of comments initially loaded as well as the number of additional comments loaded when `Load More` is clicked.   |
| `useHovers`              | `boolean` | `false` | Whether or not to show a 3Box Profile popup when hovering over a comment.                                                  |
| `currentUser3BoxProfile` | `Object`  |         | A reference to the 3Box `profile` object for the current user.                                                             |
| `userProfileURL`         | `string`  |         | Link to the user's profile on your application. Usually something along the lines of `https://yourapp.com/user/${address}` |
| `spaceOpts`              | `Object`  |         | [Additional options]()https://docs.3box.io/api/storage/get#box-getspace-address-name-opts to pass to the 3Box Space.                                                                          |
| `threadOpts`             | `Object`  |         | [Additional options]()https://docs.3box.io/api/messaging#box-getthread-space-name-firstmoderator-members-opts to pass to the 3Box Thread.                                                                         |

Let's try changing a few of these variables:

```js
// src/App.js
...

class App extends React.Component {
  ...

  render() {
    const {
      box,
      address,
      profile,
      ready,
    } = this.state;

    return (
      <div className="App">
        <div className="comments-container">
          <BoxComments
            spaceName="your-3box-space-name"
            threadName="your-3box-thread-name"
            adminEthAddr="your-ethereum-address"

            box={box}
            currentUserAddr={address}

	    // Optional settings.
            showCommentCount={10}
            useHovers={true}
            currentUser3BoxProfile={profile}
            userProfileURL={address => `https://yourapp.com/user/${address}`}
          />
        </div>
      </div>
    );
  }
}

...
```

Wait for your app to compile again and head over to the webpage. You should see these new features in action:

![3Box comments with more features screenshot](https://api.kauri.io:443/ipfs/QmaSZoJHibTv2svPgs6CGK1pgnqxKkfFEXmhdtCbi5rscW)

## Making It Your Own

Now that you've played around with `3box-comments-react`, you're ready to integrate it into your own app. You can easily customize the visual style of the component by adding some CSS rules. Let's try making our comment text red. Open up `src/index.css` and add the following:

```css
// src/index.css
...

.comment_content_text {
  color: red;
}
```

And here's what that looks like:

![3Box comments with red text screenshot](https://api.kauri.io:443/ipfs/QmerHkbaEZNXZHBPExKVWqj4vppsJM8VSQ1KMUgjWFMLue)

## Conclusion

We did it! We managed to get the 3Box Comments Plugin added to a simple React app in just a short period of time. The decentralized future awaits. 

A final version of the code we wrote in this tutorial is available in [this repository](https://github.com/kfichter/3box-comments-tutorial). 3Box has [a lot of other cool tools](https://3box.io/products) that you can check out on their [website](https://3box.io/) and [documentation page](https://docs.3box.io/products). Since you've just tried out the Comments Plugin, you might want to look at the [Chatbox Plugin](https://docs.3box.io/build/plugins/chatbox) next.

Thanks for checking out this tutorial, see you in the next one!