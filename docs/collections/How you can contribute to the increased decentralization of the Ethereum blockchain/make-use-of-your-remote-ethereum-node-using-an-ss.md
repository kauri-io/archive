---
title: Make use of your remote Ethereum node using an SSH tunnel and MetaMask
summary: In the first part of this series we learned how to install and synchronize a geth node with the Ethereum blockchain on a Linux Virtual Private Server (VPS). In this second part we explore secure remote access to this Ethereum node via MetaMask.We also cover how to make everything survive crashes and shutdowns. Setting up an SSH tunnel Setting up a what? This is the confusing process I mentioned earlier. I wont go into details here, but in effect it allows requests made to your local machine to b
authors:
  - Daniel Ellison (@zigguratt)
date: 2019-05-16
some_url: 
---

# Make use of your remote Ethereum node using an SSH tunnel and MetaMask

In the [first part](https://kauri.io/article/c287fe53de9b4073a18065443253a86d/v1/how-to-install-and-synchronize-your-own-remote-ethereum-node) of this series we learned how to install and synchronize a `geth` node with the Ethereum blockchain on a Linux Virtual Private Server (VPS). In this second part we explore _secure_ remote access to this Ethereum node via MetaMask.We also cover how to make everything survive crashes and shutdowns.

## Setting up an SSH tunnel

Setting up a _what?_ This is the confusing process I mentioned earlier. I won't go into details here, but in effect it allows requests made to your local machine to be forwarded automatically to another machine, in this case the VPS running your `geth` node. It'll become clear why we need this when we set up MetaMask later.

### Obtaining the IP address of your VPS

In order to forward requests to your VPS you'll need to know its IP address. This is determined by returning to your Linode dashboard and going to the _Linodes_ tab on the left. You should see your node's IP address on the right, just below the geographic location of your VPS. It looks something like this: `172.16.389.54`. Make a note of that IP; we'll be using it shortly.

### SSH on Windows

As of the April 2018 update Windows 10 has OpenSSH installed by default. This provides `ssh.exe` as well as several other SSH utilities. To check the state of SSH on Windows at the time of writing I downloaded the latest Windows 10 ISO and installed it into a virtual machine. OpenSSH was already installed and available from `cmd.exe`. If you have Windows 10 but OpenSSH is not installed, follow the instructions in this [Microsoft article](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_overview). If you have an older version of Windows there are several utilities available that will provide SSH capabilities.

### Initiating the tunnel

We're going from here with the assumption that you have command-line access to an `ssh` client. The following command sets up the SSH tunnel. This command is identical on all three platforms.

```shell
ssh -N -v user@172.16.389.54 -L 8545:localhost:8545
```

The `-N` switch tells `ssh` not to execute a remote command. We want a continuous connection, or _tunnel_, to our node. There's no command to execute remotely at this point. The `-v` switch makes `ssh` output some logging information as it executes. We then supply the username and IP address in order to log into our VPS. The rest sets up the tunnel itself, specifying that anything your local machine receives on port `8545` (the port on which your node is listening for RPC requests) should be forwarded to the same port on your node _securely through the tunnel_. That's the most important point: nobody else can do this except you. Your node is safe from exploits due to an exposed RPC port.

### Configuring MetaMask

This is the easiest part of the whole tunnel kerfuffle. I'm assuming you left the SSH tunnel running and that you can see its log output. In your browser, activate MetaMask by clicking on the fox head at the top right of your browser window. At the top of the MetaMask window is the currently-chosen Ethereum network. If you've been using beta dApps, it's probably say something like _Rinkeby Test Network_. Click on that name and you see a dropdown menu. At the top is _Main Ethereum Network_. That's our final destination, but we don't want to use that menu item. If you do, MetaMask connects to an Infura node, defeating the entire purpose of this long journey. Further down the list you see _Localhost 8545_. Click on that, watching the output of your SSH tunnel. You should see lines appear similar to this:

```shell
debug1: Connection to port 8545 forwarding to localhost port 8545 requested.
debug1: channel 1: new [direct-tcpip]
```

MetaMask should now have _Localhost 8545_ at the top and you should see _Deposit_ and _Send_ buttons in the middle. If so, you've now connected your remote `geth` node to MetaMask, though MetaMask believes it has connected to your local machine.

## Making the impermanent permanent

You now have a fully-functioning `geth` node and are able to connect to it remotely _and securely_ through MetaMask and an SSH tunnel. Congratulations! Of course, computers crash or are shut down deliberately. In order to avoid having to set everything up again on a restart, we need to do two things: one, set up our `geth` node to start automatically on the VPS and two, somehow do the same for the SSH tunnel on our local machine.

### Remote permanence

In relative terms this is the easy part of the permanence process. We only have to deal with one operating system, Linux, and there's an established way to start tasks automatically: `systemd`. Linux politics aside, let's get started.

`systemd` handles processes on most Linux systems, Ubuntu being no exception. In order to do so it reads `.service` files. To have our `geth` node start automatically on boot we need to provide a `geth.service` file. Go back and launch the console from the _Linodes_ tab. If your `geth` node is still running you have to shut it down. As before, type the following to reconnect to your `geth` node:

```shell
$ tmux attach -t 0
```

Stop your `geth` node with `ctrl-c`. Again, wait until you're at a command prompt, then type `ctrl-d` to exit from `tmux`. Type the following at the command line, substituting `user` in `User=user` for the username you provided previously:

```shell
$ cat > geth.service <<EOF
[Unit]
Description=Go Ethereum client

[Service]
User=user
Type=simple
Restart=always
ExecStart=/usr/bin/geth --rpc --rpcaddr localhost --rpcport 8545

[Install]
WantedBy=default.target
EOF
```

This creates a `geth.service` file in the current directory. You need to do a few things to make it available to `systemd`:

```shell
$ sudo mv geth.service /etc/systemd/system/
$ sudo systemctl daemon-reload
$ sudo systemctl enable geth.service
$ sudo systemctl start geth.service
```

To check on the status of the service, use this:

```shell
$ sudo systemctl status geth.service
```

Somewhere near the beginning of the output you'll see `active (running)`. If you don't, there will be error messages below. Good luck! To see continuous output from `geth`, type the following:

```shell
$ sudo journalctl -f -u geth.service
```

If all is well you'll see a stream of lines containing _Imported new chain segment_. Type `ctrl-c` to stop the output. Don't worry, this doesn't shut down your `geth` node. It only stops showing the `systemd` log output.

From now on, when your VPS restarts for any reason `geth` starts up again automatically.

### Local permanence

You've successfully started an SSH tunnel on your machine, but as soon as you close the terminal or put your laptop to sleep the tunnel disconnects and the connection is broken. This is obviously sub-optimal. Having to start up a terminal session and re-activate the tunnel is a bit of a drag. The problem is, the three major operating systems have three different ways to set up permanent services like our SSH tunnel.

#### SSH key pairs

In order for any of the following to work automatically you need to have SSH private and public keys. If you regularly `ssh` into remote machines without needing to provide a password, you're already set up. Even in that case, you need to send your public key to the remote machine running `geth`. For instructions on how to do this — and how to generate an SSH key pair in the first place if you need to — [this article from Linode](https://www.linode.com/docs/security/authentication/use-public-key-authentication-with-ssh/) or [this one from Atlassian](https://confluence.atlassian.com/bitbucketserver/creating-ssh-keys-776639788.html) explains things fairly well. These articles are already very long and very technical; mucking about with SSH keys is a well-known process so it's not necessary to repeat those instructions here. If you can type:

```shell
$ ssh user@172.16.389.54
```

supplying your own username and the IP of your remote `geth` node, and you are logged in without having to supply a password, you're good to go. If this is not the case, none of the following will work.

#### Linux

The process of making an SSH tunnel permanent is similar to they way it was done on our VPS.  We install a `persistent.ssh.tunnel.service` file and set things up so that the service starts with the system. The only major difference, aside from the necessarily different `ExecStart` line, is that we need to precede that line with a line specifying a slight startup delay to make sure the network is ready before the service starts. Remember, of course, to replace `user` in `User=user` with your own desktop username and `user@172.16.389.54` with your username on the remote system and its IP address.

```shell
$ cat > persistent.ssh.tunnel.service <<EOF
[Unit]
Description=Persistent SSH Tunnel

[Service]
User=user
Type=simple
Restart=always
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/ssh -N -v user@172.16.389.54 -L 8545:localhost:8545

[Install]
WantedBy=default.target
EOF
```

This creates a `persistent.ssh.tunnel.service` file in the current directory. As before, you need to do a few things to make it available to `systemd`, this time on your local system:

```shell
$ sudo mv persistent.ssh.tunnel.service /etc/systemd/system/
$ sudo systemctl daemon-reload
$ sudo systemctl enable persistent.ssh.tunnel.service
$ sudo systemctl start persistent.ssh.tunnel.service
```

To check that the service started successfully, type the following:

```shell
$ sudo systemctl status persistent.ssh.tunnel.service
```

#### macOS

Apple's macOS has its own way of setting up persistent services using `launchctl`. Similar to `systemd` on Linux, you provide a configuration file — this time in the form of an [XML document](https://en.wikipedia.org/wiki/XML) instead of an [INI file](https://en.wikipedia.org/wiki/INI_file) — and then install and activate the service using that XML document. First we create this file, providing as usual the username and IP address of our VPS for`user@172.16.389.54`. As well, provide your macOS username under `UserName`.

```shell
$ cat > com.persistent.ssh.tunnel.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.persistent.ssh.tunnel</string>
  <key>UserName</key>
  <string>user</string>
  <key>StandardErrorPath</key>
  <string>/tmp/persistent.ssh.tunnel.err</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/ssh</string>
    <string>-N</string>
    <string>-v</string>
    <string>user@172.16.389.54</string>
    <string>-L</string>
    <string>8545:localhost:8545</string>
  </array>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
EOF
```

Once you've created the `com.persistent.ssh.tunnel.plist` file, move it to a location in which `launchctl` expects these files to reside. Finally, give the command to install it into the system and start the process running in the background.

```shell
$ sudo mv com.persistent.ssh.tunnel.plist /Library/LaunchDaemons/
$ sudo launchctl load /Library/LaunchDaemons/com.persistent.ssh.tunnel.plist
```

Installing the `.plist` file into `/Library/LaunchDaemons/` makes it available to any user on the system; it's not dependent on your being logged in for the tunnel to be active.

#### Windows

In order to set up a persistent service in Windows you need to download a utility that provides this functionality. The one I used is the free, open source, and public domain [NSSM](https://nssm.cc/) so you need to [install that](https://nssm.cc/release/nssm-2.24.zip) before proceeding.

The steps below creates the `persistent-ssh-tunnel` service and sets various parameters so that you can use it to connect MetaMask to your `geth` node. I've provided the commands as well as the responses from `nssm` for clarity. To execute these commands you need to start a terminal session as a Windows administrator. You can do this by opening the start menu and typing `cmd`. This should bring up a _Best match_ menu with _Command Prompt_ highlighted. To the right choose _Run as administrator_. Click _Yes_ to allow this app to make changes.  If all goes well, you see a black terminal window open with the command prompt `C:\Windows\system32>`. Carefully type the commands below, making sure _not_ to type the command prompt! Be sure that each command gets a response similar to the ones provided here. Substitute your Windows username for `.\user` (keeping the `.\`) and your Windows login password for `password`. Also provide your username and the IP address of your remote `geth` node in `user@172.16.389.54`.

```posh
C:\Windows\system32>nssm install persistent-ssh-tunnel "C:\Windows\System32\OpenSSH\ssh.exe" "-N -v user@172.16.389.54 -L 8545:localhost:8545"
Service "persistent-ssh-tunnel" installed successfully!

C:\Windows\system32>nssm set persistent-ssh-tunnel ObjectName ".\user" "password"
Set parameter "ObjectName" for service "persistent-ssh-tunnel".

C:\Windows\system32>nssm set persistent-ssh-tunnel DisplayName "Persistent SSH Tunnel"
Set parameter "DisplayName" for service "persistent-ssh-tunnel".

C:\Windows\system32>nssm set persistent-ssh-tunnel Description "Establishes a persistent SSH tunnel between a remote server and the local computer."
Set parameter "Description" for service "persistent-ssh-tunnel".

C:\Windows\system32>nssm start persistent-ssh-tunnel
persistent-ssh-tunnel: START: The operation completed successfully.
```

#### Testing the persistent SSH tunnel

Assuming all went well, you now have a system service on either Windows, Linux, or macOS that runs in the background and starts every time your local machine restarts. To test it out, open a browser that has MetaMask installed and follow the instructions above under _Configuring MetaMask_. MetaMask should again connect to _Localhost 8545_, but this time it's using the background service which tunnels requests to your `geth` VPS. You no longer have to think about establishing a connection to your remote Ethereum node.

## Conclusion

For the sake of expedience I've made specific choices in these articles. For instance, I chose to use a VPS, and indeed a particular VPS provider, for our Ethereum node. As explained above, this costs money. dApp developers receiving income from their project should definitely consider this route. On the other hand, someone who is simply curious and would like to follow the steps outlined could set up a VPS, follow the tutorial, and after testing it out and learning all there is to be learned, shut down and delete the VPS. This would end up costing just a few cents: if it took you two hours to complete this tutorial you'd be out 24¢ US, assuming a _Linode 16GB_ VPS. Even factoring in the synchronization time, you’re still only out a couple of USDs.

You're also free to choose a different VPS provider. Digital Ocean's _Droplets_ are competitively priced. The process here should work equally well on a Droplet. Amazon's AWS is also a possibility. Using your own hardware would save the monthly cost, but the process gains much more complexity and would have been inappropriate for an article aimed at moderately technical people.

Another choice I made was to use the Ubuntu Linux distribution as the operating system for our `geth` node. Ubuntu is one of the most popular distributions, but there are, shall we say, _several_ other Linux distributions you could choose. If you're more familiar with another distribution, then you should be able to handle the differences between your choice and the Ubuntu-based instructions above.

I chose a system service utility for Windows, offering no alternatives, and glossed over the SSH aspects on that OS. Again, these articles would verge on novella length if I were to go into every aspect of all of the software on all of the platforms. I apologize to those who wanted more detail. Please leave a comment if you have questions on these things.

This has definitely been a long journey. I know it's all a bit ambitious, especially for those with a less technical bent. I hope you were able to follow these instructions and end up with your own remote Ethereum node, connecting to it with MetaMask through a secure SSH tunnel. If you have any questions or need any help with the process, please leave a comment here. I'd be happy to help.