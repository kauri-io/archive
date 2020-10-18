---
title: Introducing Bloom Starter
summary: We are happy to announce Bloom Starter, a starting point for integrating Bloom into your app. Getting started with integrating a third-party ecosystem can seem daunting, Bloom Starter aims to ease this pain. Giving developers a starting point will help speed up integration times. Here at Bloom we use a Typescript + React + Express stack so our first implementation of Bloom Starter is in this stack, available under the Bloom Starter repo here. This is a very simple integration that renders a QR C
authors:
  - Isaac Patka (@isaacpatka)
date: 2019-02-16
some_url: 
---

# Introducing Bloom Starter


![](https://ipfs.infura.io/ipfs/QmPsZKGrX7F7swmezHEXGLigX3dxzvqJvC5NQv7kbYeAj1)


We are happy to announce [Bloom Starter](https://github.com/hellobloom/bloom-starter), a starting point for integrating Bloom into your app.

Getting started with integrating a third-party ecosystem can seem daunting, Bloom Starter aims to ease this pain. Giving developers a starting point will help speed up integration times.

Here at Bloom we use a Typescript + React + Express stack so our first implementation of Bloom Starter is in this stack, available under the Bloom Starter repo [here](https://github.com/hellobloom/bloom-starter/tree/master/bloom-starter-react). This is a very simple integration that renders a QR Code via Share Kit and manages users with a session.


## Use Bloom Protocol for Login, Lending, and Financial Compliance

Bloom Protocol is an end-to-end protocol for decentralized login, identity, and credit scoring. With Bloom Protocol, you can verify a user’s identity, reduce the risk of fraud, and build compliant financial applications, all without sacrificing user privacy or risking data breaches. You can do this without taking custody of a user’s personal data, and without relying on centralized systems.

## Get Started Building on Bloom Protocol

Start developing on top of the Bloom Protocol with Bloom Starter. Please see the repos below, as well as step-by-step instructions in our [Bloom Workshop video](https://www.youtube.com/watch?v=SM3KicBROpw&feature=youtu.be&t=1785).

- Bloom Starter Repo

- Bloom Starter React


## Development

There are two parts to this app, the server-side (express) and client-side (react).

## Getting Started

`git clone https://github.com/hellobloom/bloom-starter.git`

1. `cd bloom-starter/bloom-starter-react`
2. `npm run deps` (install dependencies for server and react)
3. Before starting up the dev server, you will need a `.env` file with these variables set: `PORT`, `NODE_ENV` and `SESSION_SECRET`. See `.env.sample` for an example of where your `.env` should be look like.
4. `npm run dev`

## What does this do?

- Start the express server

- Start ngrok to proxy the express server

    - This is so the mobile app can `POST` share-kit data to the url

- Start the react app

    - The `REACT_APP_SERVER_URL` env var is set to the ngrok url

## Production

### Build app (client and server)

This will build client and server code and output to the build/ directory

`npm run build`

### Start app (client and server)

`npm run start`

### Deploy to Heroku
Commands must be done from the root of the git project.

## Init heroku (one time)
Assuming that your heroku app is called bloom-starter-react.

```
heroku login
heroku git:remote -a bloom-starter-react
```


### Push latest
`git subtree push --prefix bloom-starter-react heroku master`

## Join Us at ETHDenver
Starting next Friday, come join us for a fun weekend of creativity and development at ETHDenver!

- What: [ETHDenver #BUIDLATHON](https://www.ethdenver.com/)

- When: [February 15 - 17](https://www.ethdenver.com/#schedule)

- Where: [The Sports Castle, Denver, CO](https://goo.gl/maps/uCSs7gRoBe12)

We’ve built a strong developer ecosystem, supporting development on the Bloom Protocol. Now join us at ETHDenver as we continue to foster our developer ecosystem and work to build even more applications on top of the protocol!

## About Bloom
Bloom is a blockchain solution for identity security and cross-border credit scoring, restoring ownership and control of identity information and financial data back to consumers. By decentralizing the way that information is shared between untrusted parties, the system reduces the risk of identity theft and minimizes the costs associated with customer on-boarding, compliance and fraud prevention.

## Learn More
To learn more about the latest with Bloom:

- [Download the Bloom App](https://bloom.app.link/n84SaYZx6P)
- [Visit our Website](https://bloom.co/)
- [Join the conversation on Telegram](https://t.me/bloomprotocol)
- [Follow us on Twitter](https://twitter.com/bloom)
- [Read our Blog](https://bloom.co/blog)


---

- **Kauri original link:** https://kauri.io/introducing-bloom-starter/61d982a9c6d441049670c1f0acf6358f/a
- **Kauri original author:** Isaac Patka (@isaacpatka)
- **Kauri original Publication date:** 2019-02-16
- **Kauri original tags:** ethereum, bloom, identity, ethdenver, credit, ethdenver-2019
- **Kauri original hash:** QmbVt3c6kbeSvswJ7rRgjA9JdAxCVi6Z6huXc3U7pEfbyP
- **Kauri original checkpoint:** QmRS3wCLX2MRi62bg9NTM89qNkgm3XjpKXciLvCKAr1f1g



