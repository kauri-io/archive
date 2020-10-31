---
title: Installing Besu binary on Linux
summary: Ever gotten a besu command not found on your terminal? Well, read on Although there are many ways to install software on a Linux machine, an accepted startard p
authors:
  - Felipe Faraggi (@felipefaraggi)
date: 2020-02-26
some_url: 
---

# Installing Besu binary on Linux

![](https://ipfs.infura.io/ipfs/QmTpqQxw6J2L5CiaxdGM4iK98rzwpPkKFmrc3FXv7t5gMU)


Ever gotten a "`besu command not found`" on your terminal? Well, read on...

[Although there are many ways to install software](https://askubuntu.com/questions/6897/where-to-install-programs) on a Linux machine, an accepted startard practice is to install on your [Linux user's `home/bin` folder](https://unix.stackexchange.com/questions/36871/where-should-a-local-executable-be-placed).
The following will help you install [Hyperledger Besu](http://besu.hyperledger.org/) on Ubuntu, and can be tweaked to many other distributions.

> The Java JDK is a requirement for running Besu. Make sure its already installed and higher than version 11 by typing `java --version`. If it isn't installed, follow [these install instructions](https://www.oracle.com/java/technologies/javase-downloads.html) or type `sudo apt install default-jdk` into the terminal.


1. Download the latest binary from a trusted website (ie. [the PegaSys website](https://pegasys.tech/solutions/hyperledger-besu/#downloads)).

2. If it doesn't exist, make the home `bin` folder.


```
cd ~
mkdir bin
```

3. Move the binary to the bin folder.
Remember to replace <binary-filename> with the name of the file you've downloaded from step 1.

```
cd ~
cd Downloads
mv <binary-filename> ~/bin
```

4. Untar/unzip the downloaded binary.
Depending on which file type you've downloaded, choose the extraction type.

> If not present in your system, install unzip with `sudo apt-get install unzip`.

Untar:

```
cd ~
cd bin
tar xf <binary-filename>.tar.gz
```

Unzip:

```
cd ~
cd bin
unzip <binary-filename>.zip
```

5. Rename the folder to `besu`.

> You may now remove the original tar/zip file.

```
mv <besu-version>/ besu
```


Your bin folder should look like this now:

``` 
~/tmp/bin
$ tree -L 2
.
└── besu
    ├── bin
    ├── lib
    ├── LICENSE
    └── license-dependency.html
```

6. Add Besu to your PATH environment variable.
Adding a binary to your PATH allows you to run the executable from any folder on your machine, without having to point to it directly at each call.

Using your text editor of choice, add the following line to your `.bashrc` (or `.zshrc`, etc) file.

```
PATH=$PATH:~/bin/besu/bin
```

7. Restart your terminal.

You should now be able to run Besu from any folder, open a terminal window and type `besu -h` and you will get the besu help output in the terminal.



Get more information on Besu here:

[Docs](http://besu.hyperledger.org/)  
[Code](https://github.com/hyperledger/besu)  
[Binaries](https://pegasys.tech/solutions/hyperledger-besu/#downloads)  
[Wiki](https://wiki.hyperledger.org/display/BESU/Hyperledger+Besu)  
[Jira](https://jira.hyperledger.org/projects/BESU/issues)  
[Web](https://pegasys.tech/solutions/hyperledger-besu/)  


---

- **Kauri original title:** Installing Besu binary on Linux
- **Kauri original link:** https://kauri.io/installing-besu-binary-on-linux/e00df6efcb644e07ab44df169d9375e9/a
- **Kauri original author:** Felipe Faraggi (@felipefaraggi)
- **Kauri original Publication date:** 2020-02-26
- **Kauri original tags:** linux, besu, tutorial
- **Kauri original hash:** QmZeKXuj998XoXt8Lfm5eMhrk7XcHKdnY3WDQZthoZqU8u
- **Kauri original checkpoint:** QmRG8ZzCupt9QRmCrcMhV5T9HWn64rzsCBaNQSt8Naq3dG



