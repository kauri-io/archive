---
title: Installing IPFS
summary: In this tutorial, we install IPFS and learn its basic commands. Prerequisites Familiar with the command line and IPFS concepts. Downloading There are 3 ways to install IPFS- from a prebuilt package from ipfs-update building from source In this post, we install from a prebuilt package. Download the appropriate binary from the link above. Unzip the package where you want to store the IPFS binary, and add the IPFS binary to your PATH. Open your terminal and try the following to test that your insta
authors:
  - Juliette Rocco (@jmrocco)
date: 2019-03-19
some_url: 
---

# Installing IPFS


In this tutorial, we install IPFS and learn its basic commands.

### Prerequisites

Familiar with the command line and IPFS concepts.

### Downloading

There are 3 ways to install IPFS:

- [from a prebuilt package](https://dist.ipfs.io/#go-ipfs)
- from ipfs-update
- building from source

In this post, we install from a prebuilt package. Download the appropriate binary from the link above.

Unzip the package where you want to store the IPFS binary, and add the IPFS binary to your `PATH`.

Open your terminal and try the following to test that your install works:

**Note**: For Windows users, I recommend Powershell over Command Prompt.

```shell
ipfs help
```

That's It! You now have the IPFS installation on your machine.

### Initializing

Before we can use IPFS, we must initialize a local repository. This repository contains the settings and internal data for your user account. It also generates a peer identity key to sign any content you create cryptographically.

```shell
ipfs init
```

The `init` command outputs your peer identity key. This key is similar to an account number. The `init` command suggests the following command to try:

```shell
ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

You should see something like the below:

```shell
    Hello and Welcome to IPFS!

    ██╗██████╗ ███████╗███████╗
    ██║██╔══██╗██╔════╝██╔════╝
    ██║██████╔╝█████╗  ███████╗
    ██║██╔═══╝ ██╔══╝  ╚════██║
    ██║██║     ██║     ███████║
    ╚═╝╚═╝     ╚═╝     ╚══════╝

    If you see this, you have successfully installed
    IPFS and are now interfacing with the ipfs merkledag!

    -------------------------------------------------------
    | Warning:                                              |
    |   This is alpha software. use at your own discretion! |
    |   Much is missing or lacking polish. There are bugs.  |
    |   Not yet secure. Read the security notes for more.   |
    -------------------------------------------------------

    Check out some of the other files in this directory:

      ./about
      ./help
      ./quick-start     <-- usage examples
      ./readme          <-- this file
      ./security-notes
```

You can try the other files suggested by replacing _readme_ in the last command.

It's important to know where your IPFS repository is located because this is where all your content is stored. The default location is a _.ipfs_ folder in your home folder.

### Basic Commands

**Note**: The quick start guide from the readme gives a list of all commands to assist with getting started.

#### Creating & Adding a File to IPFS

Navigate to a directory where you would like to create a file and try the following:

```shell
mkdir hello-ipfs
cd hello-ipfs
```

Now let's create a file inside this folder.

```shell
echo "hello world 1" > helloworld.txt
```

The text file _helloworld.txt_ contains **"hello world 1"**. Next, add the file to IPFS.

```shell
ipfs add hellowworld.txt
```

You see the following output:

```shell
added QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8 helloworld.txt
```

The combination of letters and numbers is the hash that's associated with this text file. The hash is created based on the contents of the file. If you change the contents of the file, the hash changes, save this hash to access the file later on.

#### Reading content

Without using IPFS, we can read the contents of the _helloworld.txt_ file with the following command:

```shell
cat mytextfiletxt
```

We can read it through IPFS as well. Using the hash generated earlier, enter the following to return the contents of the file:

```shell
ipfs cat QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8
```

#### Changing the Content

Let's see what happens if we change the text inside our _helloworld.txt_ file.

```shell
$ echo "hello world 2" > helloworld.txt
$ ipfs add helloworld.txt`

> added QmfEKnXvgW7gbbxPj7e3LF4ZsaX8hxW427ASiGUKXDUZnB

$ cat helloworld.txt
> hello world 2
```

We changed the text to say **"hello world 2"** and when we added it to IPFS, we received a new hash. Using the `cat` command, we see that our _helloworld.txt_ file was updated with the new text.

It's also possible to still read the "hello world 1" phrase that we had earlier.

```shell
$ ipfs cat QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8
> hello world 1

$ cat helloworld.txt
> hello world 2
```

Using the first hash, IPFS outputs **"hello world 1"**. We read the contents of the hash rather than the contents of the file. Reading the _helloworld.txt_ file we see that the contents haven't changed.

We can revert to the **"hello world 1"** text if we wish.

```shell
$ ipfs cat QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8 > helloworld.txt
$ cat helloworld.txt
> hello world 1
```

#### Pinning

As mentioned earlier, content on your node stays there for a short period. Pinning allows you to tell IPFS what you want to keep for an extended period.

Using the file, we created earlier, use the command below to pin it:

```shell
ipfs pin add QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8
```

Once pinned, it stays on our node. Let's see what happens when we try to clean our node of all hosted files (garbage collection):

```shell
$ ipfs repo gc
$ ipfs cat QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8
> hello world 1
```

We couldn't collect the file couldn't because we pinned to our node.

#### Remove a Pin

```shell
ipfs pin rm QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8
ipfs repo gc
ipfs cat QmYBmnUzkvvLxPksYUBGHy2sqbvwskLQw5gK6whxHGcsa8
```

The first command removes the pin. When we garbage collect, it's removed from our node. The file is still available in our local directory stored on our computer, but we are no longer hosting it on the node.

#### Connecting to the Web

So far we've worked with IPFS locally. Now we're ready to try things online. Open another terminal and run the daemon command.

```shell
ipfs daemon
```

The daemon allows us to interact with the IPFS network through localhost in our browser. Switch back to the other terminal to take a look at our peers.

```shell
ipfs swarm peers
```

This command results in a bunch of addresses flashing across the terminal. We opened the swarm component that allows us to listen and maintain connections with other peers on the network. The `peers` command allows us to see every peer that has an open connection.

**Note**: If you ever get an error message saying "API not found," run the daemon command and continue where you left off. **To ensure that IPFS runs correctly it is suggested to run the daemon command every time you use IPFS, even locally.**

We've successfully connected to the IPFS network and from here can get content from other nodes if we know the hash of the content.

If we know the hash of a file and want to save it on our computer we can do the following:

```shell
ipfs name/ipfs/hash-here/name-of-file > name.jpg
```

We can also view a file directly in our browser using the path _<http://127.0.0.1:8080/ipfs/Qmdh9Sk33zbLgPCPsadcSrvaJt4YUifP3njYbZT9W7B9zG>_.

You should see a picture of a dog. If you know the hash of another file, just replace the hash!

#### Web Console

Now that we've connected our node to the network we can use the IPFS Web Console.

_<http://localhost:5001/webui>_

In the console, we can:

- check the status of your node
- upload files to IPFS
- explore files
- see your peers
- adjust settings for your node

The web console is the best tool for managing IPFS node.

#### Command Summary

We've covered the basics of working with IPFS. Here is a summary of all the commands covered, and a handful of other useful ones:

- `ipfs add name-of-file` : Adds a file to IPFS.
- `ipfs cat hash-of-file` : Shows the contents of the file.
- `ipfs pin add hash-of-file` : Pin file to local IPFS storage.
- `ipfs pin rm hash-of-file` : Removes pinned file from local IPFS storage.
- `ipfs repo gc` : Removes files from IPFS storage.
- `ipfs daemon` : Starts an online connection to the network.
- `ipfs swarm peers` : List peers with open connections.
- `ipfs commands` : Lists all commands.
- `ipfs id` : Tells you your id as well as other node id information.
- `ipfs version` : The version of IPFS you are running.
- `ipfs help` : Provides you with help information.

**Note**: Try any command in the following format: `ipfs base-command` , and the terminal displays the usage of that command.

### Next Steps

- <https://medium.freecodecamp.org/ipfs-101-understand-by-doing-it-9f5622c4d4ed>
- <https://docs.ipfs.io/introduction/usage/>
- <https://flyingzumwalt.gitbooks.io/decentralized-web-primer/content/>
