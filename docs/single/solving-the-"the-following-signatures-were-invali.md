---
title: Solving the "The following signatures were invalid  KEYEXPIRED" apt-get update linux error
summary: The Error My travis CI pipeline builds randomly starting failing recently, with the following exception-... Reading package lists... W- GPG error- http-//repo.m
authors:
  - Craig Williams (@craig)
date: 2020-02-10
some_url: 
---

# Solving the "The following signatures were invalid  KEYEXPIRED" apt-get update linux error

## The Error

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

## The Solution

Luckily, I stumbled upon a simple, one-line command that updates all the expired keys from the ubuntu keyserver:

``` bash
sudo apt-key list | \
 grep "expired: " | \
 sed -ne 's|pub .*/\([^ ]*\) .*|\1|gp' | \
 xargs -n1 sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys
```

This command first lists all the keys in the sytem, then narrows this list down to only expired keys.  The expired keys are then extracted and updated.

_Thanks to [Peter](https://askubuntu.com/users/606875/peter) and [dlopatin](https://stackoverflow.com/users/1160933/dlopatin) for this solution._

