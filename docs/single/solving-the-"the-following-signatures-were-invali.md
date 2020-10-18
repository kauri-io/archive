---
title: Solving the "The following signatures were invalid  KEYEXPIRED" apt-get update linux error
summary: The Error My travis CI pipeline builds randomly starting failing recently, with the following exception-... Reading package lists... W- GPG error- http-//repo.m
authors:
  - Craig Williams (@craig)
date: 2020-02-10
some_url: 
---

# Solving the "The following signatures were invalid  KEYEXPIRED" apt-get update linux error

![](https://ipfs.infura.io/ipfs/QmR8rqR4Ae7CziNmRgxLKE1c61dXie3PUTJWhjLKd1jpg7)


### The Error

My travis CI pipeline builds randomly starting failing recently, with the following exception:

``` bash
...
Reading package lists...
W: GPG error: http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.4 Release: The following signatures were invalid: KEYEXPIRED 1578250443
E: The repository 'http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.4 Release' is not signed.
The command "sudo apt update" failed and exited with 100 during 
...
```

The mongoDB certificates had expired!  

### The Solution

Luckily, I stumbled upon a simple, one-line command that updates all the expired keys from the ubuntu keyserver:

``` bash
sudo apt-key list | \
 grep "expired: " | \
 sed -ne 's|pub .*/\([^ ]*\) .*|\1|gp' | \
 xargs -n1 sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys
```

This command first lists all the keys in the sytem, then narrows this list down to only expired keys.  The expired keys are then extracted and updated.

_Thanks to [Peter](https://askubuntu.com/users/606875/peter) and [dlopatin](https://stackoverflow.com/users/1160933/dlopatin) for this solution._




---

- **Kauri original title:** Solving the "The following signatures were invalid  KEYEXPIRED" apt-get update linux error
- **Kauri original link:** https://kauri.io/solving-the-"the-following-signatures-were-invali/05b3ec26a2e548909fa2df0222d4f222/a
- **Kauri original author:** Craig Williams (@craig)
- **Kauri original Publication date:** 2020-02-10
- **Kauri original tags:** apt, linux, apt-get
- **Kauri original hash:** QmXZ9Fyq9YztojR2rSppZbmNqqrSYqpWCqy1Q8BGoEnBnp
- **Kauri original checkpoint:** QmZSRFGq9bnBLosiVwSTANrDR9YdXbWkwG71aw35jAjyLo



