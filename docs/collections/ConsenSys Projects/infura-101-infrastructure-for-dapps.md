---
title: Infura 101 - Infrastructure for Dapps
summary: Why use Infura? Creating and maintaining your own Ethereum and IPFS nodes and infrastructure is complex and costly. Infura lets you focus on developing functionality by providing a secure, reliable, and scalable infrastructure for your Dapps that you dont need to worry about. You access your Infura-hosted infrastructure via TLS-enabled endpoints, and Ferryman, a custom reverse proxy for scaling requests and instances. Getting Started with Infura The onboarding process for Infura walks you throug
authors:
  - Chris Ward (@chrischinchilla)
date: 2018-12-07
some_url: 
---

# Infura 101 - Infrastructure for Dapps


### Why use Infura?

Creating and maintaining your own Ethereum and IPFS nodes and infrastructure is complex and costly. Infura lets you focus on developing functionality by providing a secure, reliable, and scalable infrastructure for your Dapps that you don't need to worry about.

You access your Infura-hosted infrastructure via TLS-enabled endpoints, and Ferryman, a custom reverse proxy for scaling requests and instances.

### Getting Started with Infura

The onboarding process for Infura walks you through creating an account and projects. You can assign each project to a different Ethereum network, and the project overview gives you the keys and addresses your application needs. The project overview also has a section for whitelisting contracts, and a secret key value, but these are reserved for future functionality.

You can get status information by issuing requests to your project endpoint, for example, to return the latest block:

```bash
curl -X "POST" "https://rinkeby.infura.io/v3/<PROJECT_ID>" \
     -H 'Content-Type: application/json' \
     -d $'{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_blockNumber",
  "params": []
}'
```

HTTP requests are useful, but to create a fully-fleshed Dapp, you can also use Web3.js.

First import the web3 library, and create a provider to the Infura project:

```html
<script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.0.0-beta.36/dist/web3.min.js" integrity="sha256-nWBTbvxhJgjslRyuAKJHK+XcZPlCnmIAAMixz6EefVk=" crossorigin="anonymous">
</script>

<script>
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // Set the provider you want from
    Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/<PROJECT_ID>"));
}
</script>
```

Then call the method, outputting the value to the interface:

```html
<h2>Latest Block</h2>
<script>
  web3.eth.getBlockNumber(function (err, res) {
    if (err) console.log(err)
    document.write(res)
  })
</script>
```

### Statistics

Once your Dapp has issued some requests to Infura, the _Stats_ pane shows a summary of method calls and information about the bandwidth used.

![Infura stats dashboard](https://api.beta.kauri.io:443/ipfs/QmSuWjeyKnSQeotyf535wZtFdqgqz1Vu8eL7wqPe2eX6Qk)

### Migrating from V2 to V3

If you used Infura before, make sure your applications are using the new `https://rinkeby.infura.io/v3/*` endpoints. If not, you need to re-register and update your Dapps to keep using Infura. BLOG POST?
