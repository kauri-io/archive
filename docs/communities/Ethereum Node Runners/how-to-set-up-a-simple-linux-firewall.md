---
title: How to set up a simple Linux firewall
summary: This is the third part of a two part series. In the first part I described how to set up a remote Ethereum node. In the second part I went over setting up an SSH tunnel and using it to access your node with MetaMask. In this article I cover why a Linux firewall is important and describe how to set one up on your remote geth node. WAT FIREWAL?! A firewall is a technology which blocks network traffic to or from a computer. At first that may seem counterproductive. But you can poke holes in your fi
authors:
  - Daniel Ellison (@zigguratt)
date: 2019-07-16
some_url: 
---

# How to set up a simple Linux firewall

![](https://ipfs.infura.io/ipfs/QmdT9d8GN645HMzYrU8GaJ19HGirfKAJ9Dc7rEnADVjHWw)


This is the third part of a two part series. In the [first part](https://kauri.io/article/c287fe53de9b4073a18065443253a86d/v1/how-to-install-and-synchronize-your-own-remote-ethereum-nodes) I described how to set up a remote Ethereum node. In the [second part](https://kauri.io/article/348d6c66da2949978c85bf2cd913d0ac/v1/make-use-of-your-remote-ethereum-node-using-an-ssh-tunnel-and-metamask) I went over setting up an SSH tunnel and using it to access your node with MetaMask. In this article I cover why a Linux firewall is important and describe how to set one up on your remote `geth` node.

### WAT FIREWAL?!

A firewall is a technology which blocks network traffic to or from a computer. At first that may seem counterproductive. But you can poke holes in your firewall to allow external entities to access the machine on specific ports. What the heck is a port, though? From [Wikipedia](https://en.wikipedia.org/wiki/Port_(computer_networking)):

>At the software level, within an operating system, a port is a logical construct that identifies a specific process or a type of network service. Ports are identified for each protocol and address combination by 16-bit unsigned numbers, commonly known as the port number.

This means that each assigned port number has a specific meaning. There are two types of ports, TCP and UDP, but the difference between them is not pertinent to this article. You may already know that [websites use TCP ports `80` and `443`](https://www.howtogeek.com/233383/why-was-80-chosen-as-the-default-http-port-and-443-as-the-default-https-port/). SSH uses TCP port `22` by default. Ethereum clients use these specific ports:

* `30303` TCP: The network listening port
* `30303` UDP: The network discovery port
* `8545` TCP: The RPC port

Since we use an SSH tunnel to communicate via RPC with our remote node, we will not be opening port `8545` on our firewall. This prevents any external entities from making RPC calls to your node. This is what we want. On the other hand, we _will_ be opening port `22` so that our SSH tunnel will work.

### Uncomplicated Firewall

There is a utility that ships with Ubuntu by default called the [Uncomplicated Firewall](https://help.ubuntu.com/community/UFW) (UFW). It is ideal for securing your machine without having to know the gory details of `iptables`, filter tables, or rule chains. Firewalls are very complex things; having this tool to make them uncomplicated is quite a relief.

### Back to the command line

As in previous articles we need to get ourselves to a command prompt. Go back to your Linode dashboard and make sure you're on the _Linodes_ tab on the left. Click on the three dots to the right of name you gave the VPS that's running `geth`. Choose _Launch Console_ from the dropdown menu. Once the terminal window appears and you've logged back in, you're ready to start.

### Becoming an enabler

The first thing you should do once you're sitting at a command line is enable the UFW. Right away your computer is far more secure than it was a few seconds ago. Check the status to see what the firewall is doing. In the examples below I've included both the commands and their output for clarity.

```shell
$ sudo ufw enable
Started bpfilter
Firewall is active and enabled on system startup

$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip
```
As you can see from the output of the `status` command, UFW is denying all incoming network traffic. This may seem overly restrictive, but it doesn't include responses to your own traffic. For example, if you request a web page with your browser, the website has to send you the HTML for your browser to display. So we're good.

### Allowing specific incoming traffic

As discussed earlier, `geth` use specific ports in order to participate in the Ethereum network. Also, our SSH tunnel uses its own specific port. Type the following to allow SSH traffic through our firewall:

```shell
$ sudo ufw allow 22/tcp
Rule added
Rule added (v6)
```

The output indicates that the firewall has been configured properly, both for IPv4 and IPv6. If you don't know what those are, it's not important. Here's a [short guide](https://mashable.com/2011/02/03/ipv4-ipv6-guide/) on the subject. Continue now to allow `geth` to communicate with the outside world.

```shell
$ sudo ufw allow 30303/tcp
$ sudo ufw allow 30303/udp
```

Both of these commands will produce the same output as the previous command. Now when you ask for the status of the firewall you get a different answer.

```shell
$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere                  
30303/tcp                  ALLOW IN    Anywhere                  
30303/udp                  ALLOW IN    Anywhere                  
22/tcp (v6)                ALLOW IN    Anywhere (v6)             
30303/tcp (v6)             ALLOW IN    Anywhere (v6)             
30303/udp (v6)             ALLOW IN    Anywhere (v6)             
```

That's it! Your computer is now sitting behind a firewall, only allowing the network traffic necessary to run `geth` and permitting you to access it via SSH.

### Conclusion

The first version of this article was quite a bit longer and far more complicated. In discussions with peers (thanks, Evans!) I realized that using UFW instead of manually specifying firewall rules would make a more effective article.

With your shiny new firewall, your remote Ethereum node is now much safer from malicious attack. Note: this is specific to running `geth`. If you have other services on the same machine you'll have to open the relevant ports or your services will cease to function after you activate this firewall. I hope this article helped you understand a little more clearly what a firewall is and how to set one up. If you have any questions please ask in the comments below.


---

- **Kauri original link:** https://kauri.io/how-to-set-up-a-simple-linux-firewall/e56670e530d34b2d8917dc2d2e938666/a
- **Kauri original author:** Daniel Ellison (@zigguratt)
- **Kauri original Publication date:** 2019-07-16
- **Kauri original tags:** iptables, ethereum, geth, firewall, linux
- **Kauri original hash:** QmRauq9Yw7J7qfbkXKTbKJVvBgCx7vMCxdETwTZYyuz8PX
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



