---
title: Tools for Working With Solidity
summary: Recently a group of Blockchain enthusiasts at the co-working space I occasionally work from decided that it was time we stopped talking about Blockchain and actually learned how to create something based on it. We wanted to create a coin or token for the community to use internally, and whilst the project has stalled for now, I started investigating Ethereum in more depth, and the language it uses for creating smart contracts, Solidity . I will cover the language itself in more detail in the fut
authors:
  - Chris Ward (@chrischinchilla)
date: 2018-11-13
some_url: 
---

# Tools for Working With Solidity



Recently a group of Blockchain enthusiasts at the co-working space I occasionally work from decided that it was time we stopped talking about Blockchain and actually learned how to create something based on it.
We wanted to create a coin or token for the community to use internally, and whilst the project has stalled for now, I started investigating Ethereum in more depth, and the language it uses for creating smart contracts, [Solidity](http://solidity.readthedocs.io/en/develop/index.html) . I will cover the language itself in more detail in the future (when I understand it more myself!), but in this post, I will cover some of the tools available for working with the language.

### Your Language of Choice
Your starting point is [the official Ethereum clients](https://www.ethereum.org/cli) , available for all operating systems and in [Go](https://github.com/ethereum/go-ethereum) , [C++ (Aleth)](https://github.com/ethereum/aleth) , [Rust](https://github.com/paritytech/parity) , and [Python](https://github.com/ethereum/pyethereum) and [JavaScript](https://github.com/ethereum/web3.js/) . All support the full breadth of classes and methods for Solidity and many of the other tools listed here will need them as dependencies.

### Remix
Mix promised to be a fully-fledged Solidity IDE, but it never materialized and [Remix](https://remix.ethereum.org/) is its the web-based alternative. You can lint, compile, debug, run, and analyze your Solidity code based on different versions of the Ethereum compiler. You can also run your own [local copy of Remix](https://github.com/ethereum/browser-solidity) in the browser, or as a browser extension.

![](https://cdn-images-1.medium.com/max/1600/0*YHxKtAdf92nd3PT2.jpg)


### Wallets
The official Ethereum [wallet and mist](https://github.com/ethereum/mist) applications allow you to deploy contracts to networks, but not much else, so you should make sure your code is finished before using them.

![](https://cdn-images-1.medium.com/max/1600/0*WPy00wrYBo3QAX5L.jpg)


### JetBrains IDEs
If you use any of the IDEs based on the IntelliJ platform, then [there’s a plugin available](https://plugins.jetbrains.com/plugin/9475-intellij-solidity) that supports formatting, snippets, and code completion.

### Eclipse IDE
Papyrus is a UML modeling environment for the Eclipse IDE (and the Oxygen XML editor), and [uml2solidity](https://github.com/UrsZeidler/uml2solidity) is a plugin for Papyrus that lets you convert UML models to Solidity. For experienced programmers who are new to smart contracts, this is a great way to model your ideas in languages that are familiar to you.

### Atom
I am a big Atom fan, so I was delighted to find a selection of packages available with Solidity support.
There’s [the Solidity linter](https://atom.io/packages/linter-solidity) based on coding standards from the [solc npm package](https://www.npmjs.com/package/solc) , and [the solium linter](https://atom.io/packages/linter-solium) based on [the solium project](https://github.com/duaraghav8/Solium) . They take different approaches to configuration, `linter-solidity` has far more users, and I couldn’t even get `linter-solium` to work, so that may make deciding between the two an easy choice. And finally, there’s [autocomplete for Solidity](https://atom.io/packages/autocomplete-solidity) and [language-ethereum](https://atom.io/packages/language-ethereum) that adds support for Solidity and [Serpent](https://github.com/ethereum/wiki/wiki/Serpent) , another language you can use for creating smart contracts.
The [etheratom package](https://atom.io/packages/etheratom) lets you compile and deploy Solidity code from the editor, but it’s complicated to setup and you have to know what you’re doing as it requires several Ethereum related tools to already be installed, and working, on your machine.

![](https://cdn-images-1.medium.com/max/1600/0*9T7rAE7LdBxqgOnB.jpg)

### Visual Studio Code
A slightly smaller selection of extensions, but enough to get you started is the [solidity language extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity). The extension lints code using a selection of underlying linters and can compile code for you amongst other tasks.

### Deployment Frameworks
You know when the development community has started to accept a language when it starts creating frameworks for it. Unsurprisingly Ethereum has a couple of options.
 [Truffle](http://truffleframework.com/) claims to be the most popular option, supporting compilation, testing, deployment, and dependency management.
 [Embark](https://github.com/iurimatias/embark-framework) is similar, and also offers integration with [IPFS](http://ipfs.io/) for storage-based solutions and [whisper](https://github.com/ethereum/wiki/wiki/Whisper) for communications-based applications.
 [Dapp](https://github.com/dapphub/) is a simpler CLI tool for package management, testing, and deployment of smart contracts.

### An Ecosystem of Constant Change
The blockchain space is in constant flux and thus a list of tools will not be comprehensive for the foreseeable future. If there’s anything missing from this list, please add it to the comments below.