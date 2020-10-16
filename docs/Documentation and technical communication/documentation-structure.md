---
title: Documentation structure
summary: Documentation structure applies to your documentation as a whole, and to each page. Lets start at the top and work down. There are different types of documentation your project might need. The terms I use to describe them below are just the terms I use, and others use different terms. The explanation of what they are is more important than what you decide to call them is up to you. Documentation types Getting started A Getting started guide is often a starting point with your project. It should
authors:
  - Chris Ward (@chrischinchilla)
date: 2019-11-14
some_url: 
---

Documentation structure applies to your documentation as a whole, and to each page. Let's start at the top and work down.

There are different types of documentation your project might need. The
terms I use to describe them below are just the terms I use, and others use different terms. The explanation of what they are is more important than what you decide to call
them is up to you.

## Documentation types

### Getting started

A Getting started guide is often a starting point with your
project. It should take people from knowing next to nothing about your
project to installing and configuring it, and performing their first
interactions with it. The extent of what "first steps" means
somewhat depends on your project, but it should be simple enough for
anyone to complete, but complicated enough that it shows a semi-realistic
use case that highlights the potential of your project.

### Guides

Guides are a collection of documentation pages that take a user from getting
started to the next steps. These are typically more in-depth around a particular topic or common use case.

### Reference

If your project has an API, error codes, or other particular components
that need a reference, this is the place. If the rest of your
documentation tells users how to use your tools to build something, this
is the place where you explain what individual tools do. Often you can
autogenerate these docs from code or other sources, and that's fine.
Anyone digging into this section knows what they are looking for and is
looking for specifics on how to use it.

### Explanation

Perhaps most relevant to the Web3 world is a section for the theoretical
underpinnings of the project. This is where you explain your consensus
algorithm and encryption methods in depth. Again, not everyone wants or needs to know this information, but certain people will.

## Documentation structure

Creating good structure (or information architecture) for documentation can be a complex process,
depending on how much documentation you have, the most important
information people need to know, and the common pathways and questions
they typically have.

A good starting point is to divide your documentation along the lines of
the categories outlined above, and then use feedback and analytics to
tweak the structure over time. A typical alternative structure is to
group documentation around use cases, and what a user might be trying to
do, rather than arbitrary divisions. This doesn't suit all documentation
projects, especially tools that a developer can use for nearly limitless
applications, but can work well for focussed SaaS products.

Another aspect to bear in mind is that no matter how much time you spend on creating the perfect organisation and navigation, a majority of readers arrive at your documentation from search engines. Once
they arrive, they hopefully continue through the pathways you create, but there is still no guarantee of that. This means that you need to
generally assume that someone arrives at a page with no knowledge of
anything else in your documentation and you need to tell them what they should know before reading the page they arrive at. You can do this with
an explicit pre-requisites section, inline links to concepts and steps,
or with an expanding menu that won't always show a reader everything
they need to know but does show them where the document sits in the
wider structure.

Finally, if possible, add multiple ways for people to find their way
around your documentation, for example, a search box, related content,
next steps etc.

## Page structure

Good page structure helps readers read. If a page is a wall of text,
it's hard to process, and for people to find the details they are looking for. Good structure helps break up the reading experience, and
draws attention to different topic sections, and important pieces of
information.

There's an unexpected bonus to using good page structure, and that's
that it doesn't just improve readability for humans, but also for machines. Crawlers from search engines, digital assistants, semantic
aggregators and more all have their work assisted by good, predictable
page structure that follows best practices.

### Correct and helpful headings

Headings help readers identify what a particular section covers. Use
correct heading hierarchy to indicate topics and sub-topics, but also to
improve how machines read and understand the content. For example, to
improve SEO.

This means that a document should only ever have one top-level heading,
typically a level one heading unless you are using a generator tool that adds top-level headings from tags or other sources of information.

Subtitles should be level 2 headings, and any subtopics for those subtitles, level 3, 4 etc. You can use as many of these you need in a
document, but be as consistent as possible.

### Images and code examples

As people scroll through a web page, their eyes are drawn to page
elements that break up the wall of text. We are especially drawn to
images, and developers are drawn to code examples as it's often what
they are looking for most.

The trick is ensuring that important explanatory text is around these
elements, so after someone's eyes are drawn to it, they see the
surrounding text and (hopefully) read it.

We cover what makes good images and code examples in other sections.

### Paragraphs

White space is your friend in breaking up a wall of text, don't fear
it. Every major concept, or half a dozen lines or so, start a new
paragraph. Even better, if appropriate, add a sub-heading before it.

### Highlighting and Formatting

Make use of ways to highlight certain important pieces of information
with formatting. I have my personal preferences which are:

-   `Code formatting` for anything that is code.
-   _Italics_ for paths and actions. Many use code formatting for paths,
    but that doesn't make sense to me, as it's not code.
-   **Bold** for important information.
-   Any form of "double" or 'single' quote marks to highlight values to add somewhere, or the traditional usage of quote marks in the English language.

But really what formatting you use for what isn't the important part,
it's more important to be consistent if someone expects to see italics
to show file paths, then stick to it.
