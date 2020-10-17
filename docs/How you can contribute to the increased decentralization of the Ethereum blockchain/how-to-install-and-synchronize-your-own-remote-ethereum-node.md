---
title: How to install and synchronize your own remote Ethereum node
summary: This is a two part tutorial. The first part covers the process of installing an Ethereum node remotely on a Virtual Private Server (VPS), synchronizing it with the blockchain, and setting it up to allow secure remote access. Why would you even want to be responsible for your own Ethereum node? At a recent Deconomy conference in Seoul, South Korea, Joe Lubin gave a speech called Why Ethereum Will Become the Global Settlement Layer. In it he stated- We would achieve maximal decentralization of a b
authors:
  - Daniel Ellison (@zigguratt)
date: 2019-05-24
some_url: 
---

This is a two part tutorial. The first part covers the process of installing an Ethereum node remotely on a Virtual Private Server (VPS), synchronizing it with the blockchain, and setting it up to allow secure remote access.

## Why would you even _want_ to be responsible for your own Ethereum node?

At a recent [_Deconomy_ conference](https://deconomy.com/) in Seoul, South Korea, [Joe Lubin](https://en.wikipedia.org/wiki/Joseph_Lubin_(entrepreneur)) gave a speech called [_Why Ethereum Will Become the Global Settlement Layer_](https://media.consensys.net/joe-lubin-why-ethereum-will-become-the-global-settlement-layer-9b5f90d85be2/). In it he stated:

> We would achieve maximal decentralization of a blockchain network if every person on the planet owned precisely one full node device connected to the network.

This is one of the core concepts behind Ethereum and other blockchains: to create a network with so many nodes holding copies of the blockchain that it would be impossible for any government, corporate entity, or cohort of nefarious actors to take down or censor the network. It's vital that the data be spread across the globe as widely as possible.

## The problem

When the Ethereum blockchain sprang to life on [July 30, 2015](https://blog.ethereum.org/2015/07/30/ethereum-launches/), its creators assumed that those who wanted to participate would download the client software, set it up, and then synchronize their new client with the Ethereum blockchain. This was the only way to join in at the time. Early adopters were generally technical in nature so it didn't prove too much of a challenge. Since then the Ethereum blockchain has grown larger and larger and an increasing number of people are now involved, with broader skills and interests than the early adopters. In addition, distributed application (dApp) developers started looking for an easier, more scalable way to offer services to their customers rather than having to build out an Ethereum node farm to handle the load.

To meet these demands, services like [Infura](https://infura.io/about/), [QuikNode](https://quiknode.io/), and [BlockCypher](https://www.blockcypher.com/) came into being. Instead of taking on the responsibility of running your own Ethereum client, one of these services does it for you. This has become one of the main ways for dApp developers to interact with the Ethereum blockchain.

As a result, large chunks of the network run on the Infura infrastructure, which itself relies for the most part on Amazon Web Services (AWS). Make no mistake: Infura is doing an incredible job; the Ethereum network would be much much weaker if it suddenly disappeared. But the problem here lies in the fact that a large number of the nodes that operate the Ethereum blockchain belong to Infura and other such services. From an [article](https://www.ccn.com/dev-ethereum-may-fail-if-it-relies-on-infura-to-run-nodes-potential-solution/) on CCN:

> The concern in regards to the influence of Infura in the node ecosystem of the blockchain is that if dApps do not run their own nodes or rely on a network of light clients, it will increase centralization in the protocol, which was structured and designed to operate as a global supercomputer.

This is opposite to the core concept of blockchain decentralization. The takeaway from all of this is that if it's at all within your capabilities and means, running your own Ethereum node should be on your to-do list.

## What we're covering

When you've completed the steps I describe in these articles you will be running your own Ethereum node securely on a remote machine, thus contributing to the decentralization of the Ethereum network. That machine could be a Virtual Private Server (VPS), such as that provided by [Digital Ocean](https://www.digitalocean.com/), [Linode](https://www.linode.com/), or [AWS](https://aws.amazon.com/), or it could be a computer in your own home. You will also set up an SSH tunnel to make your remote node appear to be available on your local machine. You will learn how to point [MetaMask](https://metamask.io/#about) at your node to take advantage of your own contribution to the Ethereum network. I also explain how to make your efforts permanent, automatically restarting on any failure or reboot. All in all you'll be significantly ahead of a large percentage of Ethereum users. I think it's worth the effort.

## The hardest part first

To start, we delve into how to set up a [Go Ethereum](https://geth.ethereum.org/) (`geth`) node on a Linux-based server. That sounds scary as all get-out, doesn't it? Don't worry, you won't actually have to install Linux itself. I'm going to give guidance on how to create a Linux instance on Linode, a Linux VPS provider. In fact, I'm running my own `geth` node on an Arch Linux Linode VPS. For this exercise we'll stick with a more common Linux distribution, Ubuntu. Linode's Ubuntu image has several utilities pre-installed, such as `sshd`, `wget`, `tmux`, and `sudo`. This avoids having to explain how to install these utilities, allowing us to concentrate on the task at hand. Go to <https://www.linode.com/> and — if you don't already have one — sign up for an account.

### An aside

Yes, using a VPS for this costs you some money. There are many reasons to sacrifice your cash in this way, but there are also [people](http://eips.ethereum.org/EIPS/eip-908) thinking of [ways](https://medium.com/vipnode/an-economic-incentive-for-running-ethereum-full-nodes-ecc0c9ebe22) to [incentivize](https://ethresear.ch/t/incentives-for-running-full-ethereum-nodes/1239) us to run full nodes. Until then, if you have it within your means consider making a sacrifice for the health of the network. On the other hand, if you have the equipment and the technical know-how, go ahead and set up a node on your own hardware, keeping your costs to a minimum.

### Back to business

Once you have an account on Linode, log in and go to your dashboard if you're not automatically dropped there. Click the _Create_ button at the top. Choose _Linode_ from the resulting dropdown menu. Under _Choose a distribution_ click _Ubuntu_. Under _Region_, make a choice appropriate for your locale. Under _Linode Plan_ choose the level of commitment you're comfortable with. According to [Etherscan](https://etherscan.io/chart2/chaindatasizefast), a `geth` node that's been fast-synced currently takes up about 133GB of disk space. You could probably, for a time, get away with a _Linode 8GB_ VPS with 160GB of storage, but you will run out of space quickly. You could start with that size to try things out; Linode allows you to resize an instance at any time so you could step up to the next level if you decide to make your node permanent. For now, I'll assume you chose _Linode 16GB_ to avoid any storage issues. For _Linode Label_, provide a name by which to refer to your VPS, or just leave it at the default built up from your choices. Under _Root Password_, enter a password that you have to provide later in order to log into your VPS. On the right you see a summary of your choices and a big _Create_ button. Click the button.

Your new VPS will now be created. When it's done, click on _Launch Console_ at the top right. A new window pops up and presents you with a login prompt. Log in as `root`, using the password you provided on creation. You should be left at a command line prompt that looks like this:

```shell
root@localhost:~#
```

### Housekeeping

There's a bit of housekeeping to take care of before we can begin the `geth` installation. First create a non-root user. You _never_ want to log in as `root`. Never. For normal day-to-day operation you operate as a user with standard privileges, only acquiring root privileges as necessary. Issue the `useradd` command, replacing `Regular User` and `user` with your own choices unless, of course, your name is actually _Regular User_. After that, add this new user to the `sudo` system as one who can elevate their privileges. Finally, provide a password for the user. From this point on I use `#` at the beginning of a line to indicate commands to run as root and `$` for those to run as a regular user. It's never necessary to type that character.

```shell
# useradd -c "Regular User" -d /home/user -m -s /bin/bash user
# echo "%user ALL=(ALL:ALL) ALL" > /etc/sudoers.d/user
# chmod 440 /etc/sudoers.d/user
# passwd user
```

Now we lock the `root` account's password so nobody can ever log in as `root`, not even you. After that, reboot.

```shell
# passwd --lock root
# reboot
```

Once you're back at a login prompt, log in using the username and password of the user we just created. After logging in, make sure that you can switch to the `root` user account. Type `sudo su -`. After providing your password you should see this response:

```shell
$ sudo su -
[sudo] password for user:
root@localhost:~#
```

Type `exit` to return to the regular user's account. You're now ready to install `geth`.

### Installing `geth`

We use the latest version of `geth` from the Go Ethereum team. As of this writing, that version is _Punisher (v1.8.27)_. For the latest version when you read this, go [here](https://geth.ethereum.org/downloads/) and right-click on the _Geth x.x.xx for Linux_ button near the top. Choose _Copy Link Address_ or whatever the equivalent is for your browser. At your command prompt, type `wget`, then a space, then paste the link you just copied and hit `return`. Next, uncompress the freshly-downloaded file and move it to a location the system knows about. After that you should test that the system _does_ know how to locate `geth`.

```shell
$ wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.8.27-4bcc0a37.tar.gz
$ tar xf geth-linux-amd64-1.8.27-4bcc0a37.tar.gz
$ cd geth-linux-amd64-1.8.27-4bcc0a37
$ sudo mv geth /usr/bin/
$ cd ~
$ geth version
Geth
Version: 1.8.27-stable
Git Commit: 4bcc0a37ab70cb79b16893556cffdaad6974e7d8
Architecture: amd64
Protocol Versions: [63 62]
Network Id: 1
Go Version: go1.11.9
Operating System: linux
GOPATH=
GOROOT=/home/travis/.gimme/versions/go1.11.9.linux.amd64
```

If you don't get something like the response above from `geth` then you'll have to do some troubleshooting. If you did, _congratulations!_ You now have a working Linux VPS with `geth` installed correctly.

### Synchronizing your node

Before we can do anything we need to synchronize our node with the Ethereum blockchain. This takes a long time, even in "fast" mode. Days, in fact. To start the process, type:

```shell
$ tmux
$ geth --syncmode "fast" --cache=1024
```

You see several lines of output from `geth` and then it pauses for a while. Once you see lines start to appear with _Imported new block headers_ you know the sync has started. This is the part that goes for days. In order for you to safely close windows and leave `geth` to finish its sync, type `ctrl-b d`. In other words, hold down the `control` key and hit `b`. Release the `control` key and hit `d`.  You should see the following output:

```shell
[detached (from session 0)]
```

The `geth` sync continues on in the background and you're free to log off and do more productive things than watching log output. To check on the progress of the synchronization, attach to the `geth` node via the built-in JavaScript console and issue the `syncing` command.

```shell
$ geth attach
> web3.eth.syncing
> {
  currentBlock: 142490,
  highestBlock: 7640000,
  knownStates: 143562,
  pulledStates: 143174,
  startingBlock: 0
}
>
```

Press `ctrl-d` to exit the console. Check again occasionally to monitor the progress. When the result changes from block and state count to `false`, your node is in sync with the Ethereum mainnet. You can safely close that terminal window. When you come back to this terminal window by hitting the _Launch Console_ link as before, you can reconnect to your `geth` instance by typing the following:

```shell
$ tmux attach -t 0
```

This should return you to a screen that shows the continuing output from your running `geth` node.

## Configuring your node for remote access

Now that you've synchronized, there's nothing further to do if your aim was to provide an additional node to the Ethereum network. That would, however, be overly-selfless. You want to take advantage of your node, using it for your own Ethereum transactions and even perhaps contract deployment and access through your own dApp. A more general use would be to have MetaMask point to your node instead of its default Infura nodes. This is a confusing process, but if you follow the steps carefully there shouldn't be a problem.

### Setting up RPC access

RPC stands for _remote procedure call_, which means one computer requesting action from another. `geth` supports this with what are called _command-line switches_: instructions to `geth` on startup. Configuring `geth` to accept connections from any computer on the internet is extremely hazardous to your node's health. It's safer to allow RPC access _only_ from the machine that's running `geth`. This makes no sense, I know, but I'll explain how to get around that restriction securely later. For now, we want to change the switches we use to start `geth`.

Go back to your Linode dashboard and make sure you're on the _Linodes_ tab on the left. Click on the three dots to the right of name you gave the VPS that's running `geth`. Choose _Launch Console_ from the dropdown menu. Once the terminal window appears and you've logged back in, reconnect to your `geth` instance with:

```shell
$ tmux attach -t 0
```

If you've confirmed that your node has completed syncing, you should see a slow but steady stream of _Imported new chain segment_ log lines. Only proceed from here if that is the case. Otherwise, be patient and wait.

Stop your `geth` node with `ctrl-c`. It will take a while for it to shut down as it executes some housekeeping, but eventually you'll be left at a command prompt. Your `geth` is dead. We now start it up again with a different set of switches. Type the following to start `geth` with RPC enabled for the local machine:

```shell
$ geth --rpc --rpcaddr localhost --rpcport 8545
```

Your node will eventually get back to spitting out lines with _Imported new chain segment_. With that, you've completed setting up your `geth` node.

## Coming up
In the [second article](https://kauri.io/article/348d6c66da2949978c85bf2cd913d0ac/v1/make-use-of-your-remote-ethereum-node-using-an-ssh-tunnel-and-metamask) of this series I describe how to set up a local SSH tunnel and make MetaMask use that tunnel to interact with our `geth` node. To finish up I describe how to make everything we've done survive crashes and reboots, having it all restart automatically. See you there!