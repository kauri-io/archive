---
title: Updating the Besu client binary on Linux
summary: If youve read the previous article on how to add the Besu Binary to your PATH, then updating the client is very easy. Download the new version of the Besu binar
authors:
  - Felipe Faraggi (@felipefaraggi)
date: 2020-02-25
some_url: 
---

# Updating the Besu client binary on Linux

![](https://ipfs.infura.io/ipfs/QmTpqQxw6J2L5CiaxdGM4iK98rzwpPkKFmrc3FXv7t5gMU)


If you've read the [previous article on how to add the Besu Binary to your PATH](https://kauri.io/installing-besu-binary-on-linux/e00df6efcb644e07ab44df169d9375e9/a), then updating the client is very easy.


1. Download the new version of the Besu binary you want to install from a trusted website (ie. the [PegaSys website](https://pegasys.tech/solutions/hyperledger-besu/#downloads)).



2. Remove contents in `home/user/bin/besu` folder.

```
rm -rdf ~/bin/besu/*
mv besu-1.4.0-beta3 ~/bin/besu
```

> Note: Make sure to read the notes on step 4. Renaming the `besu-1.4.0-beta3` folder to `besu` in order to make updates even easier. If it was renamed, there is no need to modify the PATH variable.

3. Extract and replace the contents inside the `home/user/bin/besu` folder with the new version.

```
cd ~/Downloads
tar xf <binary-filename>.tar.gz ~/bin/besu
```


Restart your terminal and that's it. You should now be able to run the new version of Besu in the terminal.



Get more information on Besu here:

[Docs](http://besu.hyperledger.org/)  
[Code](https://github.com/hyperledger/besu)  
[Binaries](https://pegasys.tech/solutions/hyperledger-besu/#downloads)  
[Wiki](https://wiki.hyperledger.org/display/BESU/Hyperledger+Besu)  
[Jira](https://jira.hyperledger.org/projects/BESU/issues)  
[Web](https://pegasys.tech/solutions/hyperledger-besu/)  


---

- **Kauri original title:** Updating the Besu client binary on Linux
- **Kauri original link:** https://kauri.io/updating-the-besu-client-binary-on-linux/b8900d3bcd5347a5bd88999b366561bc/a
- **Kauri original author:** Felipe Faraggi (@felipefaraggi)
- **Kauri original Publication date:** 2020-02-25
- **Kauri original tags:** linux, besu
- **Kauri original hash:** QmX9BgaG2xrGKz9NoK3cLSSfCdG6qb59N3NbaEr4xhjM33
- **Kauri original checkpoint:** unknown



