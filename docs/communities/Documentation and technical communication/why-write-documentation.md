---
title: Why write documentation
summary: Whats one of the first things you look at when you look at using a new project? Its likely some form of documentation. Whether it is official documentation, or external blog posts, videos, books, or even code comments. Ideal documentation should contain everything someone needs to get started with a project without having to read the code. In the words of the creator the Perl language, Ken Williams. Documentation is complete when someone can use your project without having to look at its code. B
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-11-20
some_url: 
---

# Why write documentation

![](https://ipfs.infura.io/ipfs/Qmd3jT6LxnaLhtxDSJeZQ7ZoKbt4mSg7nYXFP2of5FmbJM)


**What's one of the first things you look at when you look at using a new project?**

It's likely some form of documentation. Whether it is official
documentation, or external blog posts, videos, books, or even code
comments.

Ideal documentation should contain everything someone needs to get started with a project
without having to read the code.

In the words of the creator the Perl language, Ken
Williams.

> Documentation is complete when someone can use your project without having to look at its code.

But when was the last time you read documentation that was
complete, where everything worked, it was clear, and it addressed your exact
questions and needs?

I don't mean to criticise those who write documentation. It's a hard
task. It's hard to keep up to date, it's hard to address every use case
and combination of tools that a reader may have, and typically, small
projects do not have a dedicated team member handling documentation.

### Documentation has many readers

It's not just developers who read documentation. Yes, it's mostly developers, but
also developer's colleagues and bosses read it when making decisions
about paying for or using software. More crucially, machines read it.
Well written documentation means that systems that parse content can
also make sense of what you've written, which is especially useful for
searching your documentation, and people finding your documentation via
search engines.

### Assume nothing

Assumptions are unhelpful, often inaccurate, and annoy readers. Documentation should remove technical assumptions, and assumptions made about the reader.

#### Technical assumptions

Developers often tend to assume that every other developer has the same setup as them, with the same dependencies, and dependency versions. We all know this is not true, and we have all encountered dependency hell,
with tangles of (often surprising) dependencies blocking us from
installing something until we figure out the problem and what
specific packages fix the nightmare.

When writing documentation, test all your assumptions. This takes
longer, but like many things, in the long run, it saves you and your
users time. Use tools such as virtual environments (if the language supports them), Docker or virtual machines to test fresh setups, and follow the same process for any operating systems
you intend to release for. You can automate much of this work, which you
can also use for testing your code, but there's no reason not to tie this code testing and documentation together.

#### About your reader

The next assumption is around who your reader is, and what they may know. We'll cover writing inclusive language later, but in summary, not every reader is like you. 'Developers don't all learn their craft in the same ways. Not all spent 3-4 years studying
computer science. Many (possibly like you reading this) learnt through
short, intense coding courses or boot camps. These shorter courses often
teach students how to code practically, but not so much theory
on topics such as design patterns, assembly language, or underlying principles.

Documentation is not the place to show off how smart you are and how
much you know. It is the place to explain to users how to use your
project. If you need to explain complex theory because it is essential
to understanding your project, then include it, and supply explanations
and background to these concepts. You don't have to write these (unless
they don't exist anywhere else), links to quality external resources are
fine.

This is especially an issue in the Web3 space. It's an ecosystem full of
new terminology, and (some) new technology, or new interpretations of old technology. There are concepts
fundamental to Web3 such as consensus algorithms that are hard to
explain, but are not as new or unique as we think, and we can learn from
previous efforts to explain them in other ecosystems.

There are ways to explain complex topics without blinding people. You
abstract some detail, but that's fine. We'll look at the best places to explain what level of technical detail in the next post.



---

- **Kauri original title:** Why write documentation
- **Kauri original link:** https://kauri.io/why-write-documentation/203c87d1ee4b4444b0139fe054f28607/a
- **Kauri original author:** Chris Ward (@chrischinchilla)
- **Kauri original Publication date:** 2019-11-20
- **Kauri original tags:** documentation, writing
- **Kauri original hash:** QmQoenKzVBhi6WAhBXmeWZwcLmhFM1mxMbTdZXWDj2C6eU
- **Kauri original checkpoint:** Qmekp5iiDi5N5M4KdtAVGBEJEF3ahMgWYZJqL7s1qmkQ9g



