---
title: xDai
summary: The xDai Chain xDai is a blockchain based on Ethereum that uses Dai as its currency. It features 5-second block speed, a gas price fixed at 1 GWei, free capacity for blocks, and a fixed platform usage price. Using a proof of autonomy consensus, its a fast and cost-efficient chain. Fun Fact- The Burner Wallet featured at EthDenver 2019 ran on the xDai network! The wallet allows the user to exchange currencies through a QR code scanner. To learn more about its success follow the link. What is Dai?
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-04-02
some_url: 
---

# The xDai Chain

xDai is a blockchain based on Ethereum that uses Dai as its currency. It features 5-second block speed, a gas price fixed at 1 GWei, free capacity for blocks, and a fixed platform usage price. Using a proof of autonomy consensus, it's a fast and cost-efficient chain.

**Fun Fact**: The Burner Wallet featured at EthDenver 2019 ran on the xDai network! The wallet allows the user to exchange currencies through a QR code scanner. To learn more about its success follow the [link.](https://medium.com/gitcoin/burner-wallet-at-ethdenver-was-faa3851ea833)

## What is Dai?

Dai is an ERC20 token that has a stable value. It's pegged to always be equal to 1 USD no matter how many Dai are in circulation.

Even though Dai is its own currency, it still relies on Ether to pay for transactions and gas fees, and the Ethereum Blockchain. These prices are constantly changing, and as a result, the rate is different from day to day.

## The Solution

xDai is a chain that allows users to only deal with Dai. On this chain, the tokens remain a 1:1 ratio with the USD, allowing it to stay stable.

xDai tokens are not mintable; they're created by moving Dai over the xDai bridge that connects the Ethereum and xDai chains. Dai changes its name to xDai once it crosses over to the chain. The bridge allows for the user to use their tokens on both chains in their respective currencies.

Dai is the only token that is convertible to xDai; POA tokens and Ether are not compatible. You must own Dai to cross the bridge.

## Chain Resources

-   **Network ID**: 100
-   **RPC Endpoint**: <https://dai.poa.network>
-   **Block Explorer**: <https://blockscout.com/poa/dai>
-   **Network Status**: <http://dai-netstat.poa.network>
-   **xDai Token Bridge**: <https://dai-bridge.poa.network/>
-   **Burner Wallet**: <https://xdai.io/>
-   **Nifty Wallet Guide**: <https://forum.poa.network/t/nifty-wallet-guide/1789>

If you follow the ["POA - Part 1 - Develop and deploy a smart contract"](https://kauri.io/article/549b50d2318741dbba209110bb9e350e/v12/poa-part-1-develop-and-deploy-a-smart-contract) tutorial, there are minimal steps to change to allow you to deploy to xDai.

**Note**: xDai is a real network, not a test network! Any contract you deploy costs real xDai/Dai. The following steps show you how to deploy to the xDai network using the steps from the tutorial mentioned.

Right now xDai is not available as a network to select in the Metamask wallet. However, we can add it as a custom RPC end point and it will work just the same.

Under network selection in Metamask, click on "Custom RPC" and add the RPC endpoint listed under the Chain Resources heading. Click save and you're good to go!

We can also use the Nifty wallet which already has the xDai network configured for you. Download the [Nifty Wallet](https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid/related?hl=en) extension for your browser.

![](https://api.kauri.io:443/ipfs/QmZ7B4UniExCxADK5HmudNaZS5knoU9m3CgQLuCDYzqfSu)

If you already have a Metamask account, copy your seed phrase and click _import existing DEN_ button. Enter your seed phrase and create a password. Once logged in, select the xDai Chain from the list of networks.

**Note**: Later in the tutorial you need this seed phrase again to create a mnemonic variable.

![](https://api.kauri.io:443/ipfs/QmW5kSUBShBqNkWMXqyWSajgrLkfkr2qkpAimXLsaTQPeb)

Convert your Dai into xDai using the token bridge <https://dai-bridge.poa.network/>.

``` javascript
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    xdai: {
          provider: function() {
                return new HDWalletProvider(
               process.env.MNEMONIC,
               "https://dai.poa.network")
          },
          network_id: 100,
          gas: 500000,
          gasPrice: 1000000000
    },
    development: {
          host: "127.0.0.1",
          port: 8545,
          network_id: "*" // Match any network id
    }
  }
};
```

Update your _truffle.js_ file to the proper network.

``` bash
truffle migrate --network xdai
```

Deploy to the xDai network.

![](https://api.kauri.io:443/ipfs/Qmd25W7zi27GL2Kx11yQbJ2mY5ynNiHXi1HbBe8bfHSmDQ)

Use the block explorer to check the status of your transactions.

![](https://api.kauri.io:443/ipfs/QmZQK4UsrnAyGyZbdwxwyJ1BAWdYdoU4fz8Lc6R97xvSdb)

Use the network status link to check the status of the chain nodes.

## Next Steps

-   [More resources](https://forum.poa.network/t/xdai-chain-resources/1769)
-   <https://poa.network/xdai>
