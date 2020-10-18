---
title: DCO Sign-Off  Commiting code to Hyperledger Besu
summary: DCO Sign-Off DCO signoff What is the DCO sign off? This stack overflow answer does a good job of explaining it- It was introduced in the wake of the SCO lawsuit as a Developers Certificate of Origin. It is used to say that you certify that you have created the patch in question, or that you certify that to the best of your knowledge, it was created under an appropriate open-source license, or that it has been provided to you by someone else under those terms. https-//stackoverflow.com/questions/
authors:
  - Felipe Faraggi (@felipefaraggi)
date: 2019-11-27
some_url: 
---

# DCO Sign-Off  Commiting code to Hyperledger Besu


## DCO Sign-Off
![DCO signoff](https://i.imgur.com/4ZBslvZ.png)

### What is the DCO sign off?

This stack overflow answer does a good job of explaining it:

> It was introduced in the wake of the SCO lawsuit [...] as a Developers Certificate of Origin. It is used to say that you certify that you have created the patch in question, or that you certify that to the best of your knowledge, it was created under an appropriate open-source license, or that it has been provided to you by someone else under those terms. 


https://stackoverflow.com/questions/1962094/what-is-the-sign-off-feature-in-git-for

The answer also mentions only a few projects use the DCO sign off feature, and well, we're one of those projects. [Since submitting Besu to the Hyperledger Foundation](https://www.hyperledger.org/blog/2019/08/29/announcing-hyperledger-besu) (hosted by the [Linux Foundation](http://linuxfoundation.org/)) we now require contributors to add a line of text essentially signing their comment in order to affirm that the code submitted has originated from themselves (or that they have permission to use it).

If you want to read the contents of the Developer Certificate of Origin, see here: https://developercertificate.org.

---

### How to sign off?

This should be done after following the [instructions on how to commit](https://wiki.hyperledger.org/display/BESU/How+to+Contribute#ContributingCodeorDocumentation).

There are several ways to add the line "Signed-off-by: Your Legal Name <your-email@address>" to each of your commits.

#### 1. Manually adding it.
You can add this line of text manually to your commit body on each commit. 
Although cumbersome, it possible and simple.

``` shell
git commit -m "Fix typo in documentation
Signed-off-by: Legal Name <email@domain>"
```

or

``` shell
git commit -m "Fix typo in documentation" -m "Signed-off-by: Legal Name <email@domain>"
```

#### 2. Automating this boring step

Computers can do things for us, so lets configure that.

``` shell
git config user.name "Legal Name"
git config user.email "email@domain" 
```
> You can use `-global` or ``-g` in order to configure this globally on your machine.

Now all you need to do is add `-s` or `--signoff` to your `git commit` commands.

``` shell
git commit -s -m "Fix typo in documentation"
```

3. Adding it if you forgot to sign-off.
If you forgot to add the sign-off, you can also amend your commit with the sign-off.

``` shell
git commit --amend -s
```

#### 3. Adding alias

If you're already added your name and email to the config, you can add an alias to your local setup in order to automatically add that `-s` t every commit command.

This can be done wither on your local CLI setup, or through a git alias as follows:

``` shell
git config --global alias.c 'commit --signoff'
```
And now you can run `git commit c -m` instead of `git commit -s -m`.

For an example of the former using zsh:
``` shell
echo alias gco='git commit -s' >> ~/.zshrc
```
> For bash, replace `.zshrc` with `.bashrc`.

If you want to reduce your typing even futher, add the `-m` flag.

``` shell
echo alias gco='git commit -s -m' >> ~/.zshrc
```

Verify that your config was written.
``` shell
$ tail ~/.zshrc
```
You should see the following, or similar:
``` shell
alias gco=git commit -s
```

In order to test this last option out, you have to re-source the config file:

``` shell
source ~/.zshrc
```
> For bash, replace `.zshrc` with `.bashrc`.


If you've already pushed your changes to Github, you will have to `force push` your branch after this with `git push -f`.

### DCO Errors

for more information on DCO sign-off, including how to deal with DCO errors flagged by our bot, check out our wiki: https://wiki.hyperledger.org/display/BESU/How+to+Contribute#HowtoContribute-HowtoworkwithDCO