---
title: So you want to contribute to Artemis?
summary: Artemis is an Ethereum 2.0 client being built in Java by the PegaSys R&D team. We’d love for you to get involved! My first contribution to Ethereum software development was pretty modest- a single line of code; just an unsolicited patch to improve something trivial. Things moved quite swiftly after that- within two months I was interviewing with blockchain companies, and within four months was working full time in R&D for PegaSys. In this space, people who get involved get noticed, and those who
authors:
  - Ben Edgington (@benjaminion)
date: 2019-02-01
some_url: 
---

# So you want to contribute to Artemis?

![](https://api.beta.kauri.io:443/ipfs/Qma22aVM17Sv7F9vjAYq4TgMt2ofjRKzmzUDQi8FYJWTcv)

> _Artemis is an [Ethereum 2.0](https://github.com/ethereum/eth2.0-specs) client being built in Java by the [PegaSys](https://pegasys.tech/) R&D team. We’d love for you to get involved!_

My [first contribution](https://github.com/ethereum/solidity/pull/2350/files) to Ethereum software development was pretty modest: a single line of code; just an unsolicited patch to improve something trivial. Things moved quite swiftly after that: within two months I was interviewing with blockchain companies, and within four months was working full time in R&D for PegaSys. In this space, people who get involved get noticed, and those who are generous with their time and knowledge do well.

Anyway, it was just about my first Github pull request (PR) on any project, and, honestly speaking, the whole Github workflow and terminology (forks, clones, remotes, rebases, upstream, origin...) was bewildering. I wish I’d had a handy quick-start guide like this one 😀.

At PegaSys, we are building two major projects based on open source community and collaboration: [Pantheon](https://github.com/PegaSysEng/pantheon), our Ethereum Mainnet and Enterprise client, and [Artemis](https://github.com/PegaSysEng/artemis), our Ethereum 2.0 test implementation. Both are written in Java. I’m going to focus on Artemis here as it’s the one I’m most familiar with, but the process for getting involved in Pantheon is just about the same.

# 1. Find something to work on
In the [Artemis repo on Github](https://github.com/PegaSysEng/artemis/), we’ve tagged some open items with [Good First Issue](https://github.com/PegaSysEng/artemis/issues?q=is%3Aissue+is%3Aclosed+label%3A%22good+first+issue+%3Ababy%3A%22) or [Help Wanted](https://github.com/PegaSysEng/artemis/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted+%F0%9F%86%98%22). These are likely to be fruitful starting points, but don’t feel limited by these if you see things in the code you think need fixing, or other work that needs doing. Help with testing is always appreciated.

Don’t be shy about jumping onto our [Gitter channel](https://gitter.im/PegaSysEng/artemis) to ask for advice or guidance. And do read our [guidelines for contributing](https://github.com/PegaSysEng/artemis/blob/master/CONTRIBUTING.md).

# 2. Fork the repo
To make pull requests, you’ll need a copy of the Artemis repo under your own Github account. Simply visit the [main Artemis page](https://github.com/PegaSysEng/artemis/) in your browser and click the “Fork” button at the top right.

![](https://api.beta.kauri.io:443/ipfs/Qmb6S47s4kjT55WpjSgv3a96Rm463C3Qm4SB8L2dBeu2xp)
 
# 3. Make a local copy
You’ll also need a local version to work on. In the below, `NAME` is your Github username. At your command line, do the following:
```
$ git clone https://github.com/NAME/artemis.git
```
Or, use this command if you have an ssh key, and modify things below accordingly:
```
$ git clone git@github.com:NAME/artemis.git
```
Check that your own Github repo is correctly set as the origin remote:
```
$ cd artemis
$ git remote -v
origin    https://github.com/NAME/artemis.git (fetch)
origin    https://github.com/NAME/artemis.git (push)
```

# 4. Add the Artemis base repo as your upstream remote
The standard contribution workflow looks like this:
1.	You keep your local repo up to date with any recent changes in the Artemis base repo (the upstream remote).
2.	You commit changes and new code on git branches in your local environment.
3.	You push your local branch to your own Github Artemis repo (the origin remote).
4.	From there you create a pull request to the base Artemis repo, closing the circle.

Once you’re set up, this is all fairly straightforward. We just need to point your upstream remote to the Artemis base repo:
```
$ git remote add upstream https://github.com/PegaSysEng/artemis.git
$ git remote -v
origin    https://github.com/NAME/artemis.git (fetch)
origin    https://github.com/NAME/artemis.git (push)
upstream    https://github.com/PegaSysEng/artemis.git (fetch)
upstream    https://github.com/PegaSysEng/artemis.git (push)
```

# 5. Write some code!
Your code needs to be committed to a local git branch. Choosing a reasonable name for the branch helps avoid confusion if you’ve got several on the go.
```
$ git checkout -b implement-feature-x
```
Once you have made some changes, commit them to the branch with a [good commit message](https://chris.beams.io/posts/git-commit/).
```
$ git add the/modified/file.java
$ git commit -m "Implement feature x"
```

# 6. Rebase from upstream
While you were writing your code, other changes may have been made in the base (upstream) repo. It is good practice to rebase your code to take this into account. It’s possible that your changes will conflict with other changes, in which case you might need to do some fixing up.
```
$ git fetch upstream master
$ git rebase upstream/master
```

# 7. Make sure everything still works
```
$ ./gradlew spotlessApply clean build test
```

You’re looking for a nice `BUILD SUCCESSFUL` message.

# 8. Push your changes to origin
This will push your local branch to your own forked version of the Artemis repo:
```
$ git push origin implement-feature-x
```

# 9. Submit a pull request
A “pull request” asks the maintainers of the repository to pull in your code changes.

When you push a branch to your own Github/artemis repo and then visit the page in your browser, you should see a banner like this one (only with your name and branch name).

 ![](https://api.beta.kauri.io:443/ipfs/QmckcRcvkqPdNd8XjaVtn9NvLYTtTFuapZBbtUsqqNKcn2)

Clicking on the green button allows you to review the code changes and to complete the template commit message. If you want to make further updates, you can simply make more commits to your branch by going back to step #5 (you can do this before or after creating the PR).

On your first commit, you will be asked to sign the [Contributor License Agreement](https://gist.github.com/rojotek/978b48a5e8b68836856a8961d6887992) to confirm that you are fully on-board with the open source nature of this project. Just click the link and follow the instructions.

 ![](https://api.beta.kauri.io:443/ipfs/Qmaa5hzHHfWudcW6fjL12rs6LCMvhjiVQ9G6Vk2F9PEYh7)

And that’s it! Some automatic checks are run, then one of the team will review your PR. There maybe some Q&A and perhaps some updates. Finally, your PR will be merged, and you’ll be Ethereum 2.0 Core Dev 😃.

# Resources
* [Artemis Github repo](https://github.com/PegaSysEng/artemis).
* [Contributing guidelines](https://github.com/PegaSysEng/artemis/blob/master/CONTRIBUTING.md).
* [Artemis Gitter](https://gitter.im/PegaSysEng/artemis) - come and say Hi!
* [Github’s notes on creating PRs](https://github.com/PointCloudLibrary/pcl/wiki/A-step-by-step-guide-on-preparing-and-submitting-a-pull-request).
* An intro to [git rebasing](https://dev.to/maxwell_dev/the-git-rebase-introduction-i-wish-id-had). This can be a bit tricky on occasion. Don’t hesitate to reach out on Gitter if you need a hand.

***

_[Ben Edgington](https://twitter.com/benjaminion_xyz), on behalf of the PegaSys Ethereum 2.0 implementation team. Thanks to [Jonny Rhea](https://twitter.com/JonnyRhea) for getting this article started!_
