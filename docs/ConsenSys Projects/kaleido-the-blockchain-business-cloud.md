---
title: Kaleido - the Blockchain Business Cloud
summary: Gartners 2018 CIO Survey revealed that only 1% of surveyed respondents indicated any kind of blockchain adoption within their organizations. Kaleido fixes that. Kaleido is a Blockchain Business Cloud that radically simplifies the creation and operation of private blockchain networks. Offered in collaboration with AWS, Kaleido is the first Software-as-a-Service featuring Ethereum packages Geth and Quorum. Kaleido allows enterprises to build out consortia bootstrap the private blockchain network.
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-03-01
some_url: 
---

Gartner's 2018 CIO Survey revealed that

> "only 1% of surveyed respondents indicated any kind of blockchain adoption within their organizations."

Kaleido fixes that.

Kaleido is a Blockchain Business Cloud that radically simplifies the
creation and operation of private blockchain networks. Offered in
collaboration with AWS, Kaleido is the first Software-as-a-Service
featuring Ethereum packages Geth and Quorum. Kaleido allows enterprises
to build out consortia bootstrap the private blockchain network.

## Features

Kaleido provides:

- A link between private networks and the public Ethereum mainnet
- Integrated analytics
- Support for multiple protocol options and consensus mechanisms
- The ability to seamlessly connect to other popular AWS services
- Reduces the cost of real-world projects
- Streamlines complex integrations

Kaleido creates blockchain SaaS, allowing companies to reduce
cost and/or time for transactions, improve product and system security,
increase transparency, incentivize certain behaviors, increase customer
loyalty, and create new revenue streams.

## Getting started

### Prerequisites

Install the following to interact with the backend microservices and
make use of the python abstraction script:

- [curl](https://curl.haxx.se/download.html)
- [jq](https://stedolan.github.io/jq/download)
- [python & pip](https://www.python.org/downloads/)

For applications and CLI:

- [node.js & npm](https://nodejs.org/en/)
- [Truffle](http://truffleframework.com/docs/getting_started/installation)
- [solc](http://solidity.readthedocs.io/en/v0.4.24/installing-solidity.html#npm-node-js)
- [Go](https://golang.org/dl/)
- [Geth](https://geth.ethereum.org/downloads/)

## Build your Network

### Option 1

Create an account on the [Kaleido Dashboard](https://console.kaleido.io/splash). Follow the
step-by-step user interface instructions to build your consortium and
provision nodes provided in the [Create your network](https://docs.kaleido.io/getting-started/environment-creation/create-your-network/)
section.

### Option 2

Utilize the Kaleido REST API to administratively build out
your network. Use the comprehensive [API 101 tutorial](https://docs.kaleido.io/developer-materials/api-101/)
to create your environment, provision nodes and generate application
credentials.

### Get your API key

Navigate to the [KaleidoConsole](https://console.kaleido.io/settings/apikeys).
Click the _API_ tab at the top of the screen and then select _+ New API Key_ to generate your key.

**Note the key before closing the pop-up, as Kaleido does not store it.**

Generate your `Authorization` and `Content-Type`
headers. Replace the `YOUR_API_KEY` placeholder text with the key you
just generated:

```bash
export APIURL="https://console.kaleido.io/api/v1\"
export APIKEY="{YOUR_API_KEY}"
export HDR_AUTH="Authorization: Bearer {YOUR_API_KEY}"
export HDR_CT="Content-Type: application/json"
```

If you wish to host your resources in the EU or Asia Pacific, enumerate
the region in your `{APIURL}` variable. The `ap` qualifier resolves to
Sydney, while `ko` resolves to Seoul. For example:

```bashs
export APIURL=\"https://console-eu.kaleido.io/api/v1\"\
export APIURL=\"https://console-ap.kaleido.io/api/v1\"\
export APIURL=\"https://console-ko.kaleido.io/api/v1\"
```

## Next Steps

- [Kaleido tutorial](https://docs.kaleido.io/developer-materials/api-101/)
- [Kaleido Knowledge base](https://docs.kaleido.io/)
