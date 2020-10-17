---
title: The Æternity blockchain with Emil Wagner
summary: To match every article dismissing blockchain as a pointless technology that brings nothing new or useful is a project aiming to prove that statement wrong. I recently spoke with Emil Wagner, apps lead at æternity, one such project attempting just this by creating their own blockchain operating system. Like any good project, æternity consists of several components. The Blockchain The æternity team is full of functional programmers, which reflects the blockchain at the core of their technology. Wr
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-09-19
some_url: 
---

# The Æternity blockchain with Emil Wagner


To match every article dismissing blockchain as a pointless technology that brings nothing new or useful is a project aiming to prove that statement wrong. I recently spoke with Emil Wagner, apps lead at æternity, one such project attempting just this by creating their own "blockchain operating system."

<iframe src="https://anchor.fm/theweeklysqueak/embed/episodes/The-Aeternity-Blockchain-with-Emil-Wagner-e2bp51/a-a5n37t" height="102px" width="400px" frameborder="0" scrolling="no"></iframe>

Like any good project, æternity consists of several components.

### The Blockchain

The æternity team is full of functional programmers, which reflects the blockchain at the core of their technology. Written in Erlang, I'm surprised more blockchains aren't written in functional languages, as their declarative nature, and reluctance to change state suits Blockchain near perfectly. Other blockchain projects will also be able to use the network for their uses

### The AE Token

No Blockchain project is complete without a token to allow access to its network. With æternity, the tokens are the access token for the network, as well as the tokens each app running on the network can issue and use.

### Oracles

Another increasingly popular feature of Blockchain projects, oracles provide smart contracts with network or real-world data to help solve computational and consensus problems. Quite what information oracles will provide the æternity network I wasn't able to find an answer too.

### Names

One of the standout features of æternity is the names feature that works something like DNS for Blockchain addresses, reducing the need for complex, and unmemorable strings.

### State Channels

Another increasingly common feature of modern blockchain projects are state channels (or sidechains) to allow for processing off of the main public chain for scalability purposes.

### Scripting Languages

While lacking in detail at the moment, æternity will support two smart contracts scripting languages. Sophia, based on [OCaml](https://ocaml.org) is the more complex and object-oriented (contracts and oracles in this case) language, but with a steeper learning curve. Varna is a more straightforward language, but with more accurate token costs available at compile time. I wonder if the team will maintain both languages in the future, or if the two options will cause too much confusion.

### Accounts and Identity

Æternity promises flexibility with account permission (but no detail), and claim that you can use your network account elsewhere on the internet, but entirely for what and how I am unsure.

### Æpps

One of the criticisms of many blockchain projects and platforms is the lack of useful distributed apps beyond financial speculation. While Æternity plans to create "out-the-box" apps for some of these use cases, they also plan several others to make their platform more usable, some of these include apps useful for development, such as a blockchain explorer and code editor.

### The Roadmap

As always with blockchain projects I encounter, details actual users are thin or scattered around multiple blogs and GitHub repositories. [the æternity roadmap](https://aeternity.com/#roadmap) is on track, their [GitHub](https://aeternity.com/#roadmap) full of repositories, and their [blog](https://blog.aeternity.com) flush with posts. If what you've read interests you, take a look around, make your own mind up and let me know your thoughts in the comments below.
