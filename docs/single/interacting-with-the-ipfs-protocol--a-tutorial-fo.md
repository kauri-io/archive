---
title: Interacting with the IPFS protocol  a tutorial for beginner 
summary: For Linux and Mac- go-ipfs github and build from source For Windows user- Download Prebuild package and extract the go-ipfs folder. Download the open source programming language software Go from Golang.org In your IPFS foder, move the files ipfs.exe into the bin folder of your Go folder Open your terminal and type the command-ipfs help And then type-ipfs init The command line will then give you your peer identity in the form of a hashipfs init initializing ipfs node at /Users/xxxx/.go-ipfs gener
authors:
  - Michael A (@silver84)
date: 2019-03-14
some_url: 
---

# Interacting with the IPFS protocol  a tutorial for beginner 


For Linux and Mac: <a href="https://github.com/ipfs/go-ipfs#build-from-source" target="blank7">go-ipfs github</a> and build from source<br><br>
        For Windows user:  <a href="https://dist.ipfs.io/#go-ipfs" title="Download Prebuild package" target="blank9">Download Prebuild package</a>  and extract the go-ipfs folder.<br>
         <br>
Download the open source programming language software Go from <a href="https://golang.org/dl/" title="Golang.org" target="blank8">Golang.org</a><br><br>
In your IPFS foder, move the files ipfs.exe into the bin folder of your Go folder<br><br>
Open your terminal and type the command: 

```
ipfs help
```

 And then type: 
```
ipfs init
```
 The command line will then give you your peer identity in the form of a hash
```
ipfs init
 initializing ipfs node at /Users/xxxx/.go-ipfs
 generating 2048-bit RSA keypair...done
  peer identity: Qmcpo2iLBikrdf1d6QU6vXuNb6P7hwrbNPW9kLAH8eG67z
  to get started, enter:

        ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```
Save your peer identity (the Hash) in a text file.<br>
Now, try running: 
```
ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```
You should see something like this:
```
Hello and Welcome to IPFS!

██╗██████╗ ███████╗███████╗
██║██╔══██╗██╔════╝██╔════╝
██║██████╔╝█████╗  ███████╗
██║██╔═══╝ ██╔══╝  ╚════██║
██║██║     ██║     ███████║
╚═╝╚═╝     ╚═╝     ╚══════╝

If you're seeing this, you have successfully installed
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
Open another terminal and type the command: 
```
ipfs daemon
```
 You will then get
``` 
ipfs daemon API
Initializing daemon...
API server listening on /ip4/127.0.0.1/tcp/4001
Gateway server listening on /ip4/127.0.0.1/tcp/8080
```
Boomshakalaka your are now using an ipfs node and you can start interacted with the protocol!<br><br><br><br><br><br><br><br><br><br><br>
    

   




---

- **Kauri original title:** Interacting with the IPFS protocol  a tutorial for beginner 
- **Kauri original link:** https://kauri.io/interacting-with-the-ipfs-protocol:-a-tutorial-fo/9376ff63f19648f0b826ec23e9023b09/a
- **Kauri original author:** Michael A (@silver84)
- **Kauri original Publication date:** 2019-03-14
- **Kauri original tags:** none
- **Kauri original hash:** QmT4Q3p2gHxersZ3maa2yWPzgh6KwPNjssquEMQVnvRuJE
- **Kauri original checkpoint:** QmSRv329t5c2hpHHf1Yz4XZomqgeBc8LVh9KNJC9z4PVDS



