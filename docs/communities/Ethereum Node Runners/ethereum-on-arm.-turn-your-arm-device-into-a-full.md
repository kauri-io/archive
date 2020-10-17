---
title: Ethereum on ARM. Turn your ARM device into a full Ethereum node just by flashing a MicroSD card
summary: Ethereum on ARM is a project that provides custom Linux images for ARM devices that run Geth, Parity and Nethermind Ethereum clients as a boot service and autom
authors:
  - Ethereum on ARM (@ethonarm)
date: 2020-02-10
some_url: 
---

# Ethereum on ARM. Turn your ARM device into a full Ethereum node just by flashing a MicroSD card

**Ethereum on ARM** is a project that provides custom Linux images for ARM devices that run Geth, Parity and Nethermind Ethereum clients as a boot service and automatically turns these ARM boards into a full Ethereum node.

## Why running a full node?

You may ask yourself, why should I run a full Ethereum node? Well, probably, there is not a perfect answer to this question but this quote from Mastering Ethereum book is a good one: _“The health, resilience, and censorship resistance of blockchains depend on them having many independently operated and geographically dispersed full nodes. Each full node can help other new nodes obtain the block data to bootstrap their operation, as well as offering the operator an authoritative and independent verification of all transactions and contracts.”_

So, basically, what you are doing by running a full node is supporting the Ethereum network. Other possible reasons to run a node are: validate / send transactions without relying on third party services, host your own node infrastructure to develop Dapps or test eth2.0 implementations.

## Why ARM devices?

Think about it, if you are going to run a full node, would you be willing to let your laptop or desktop running 24/7 for such a specific task? Would you buy an expensive server?. We did ask ourselves these questions when we first decided to run full nodes some years ago and came to the conclusion that **ARM** devices are the most convenient devices for doing so.

Among other reasons:

- **Affordable**: These boards are quite affordable, you can acquire all necessary hardware for less that $200
- **Eco Friendly**: Power consumption is quite low compare to x86 computers
- **Efficient**: The device is dedicated to this particular task (no graphical environments or other user tasks)
- **Small**: It fits pretty much in any corner of your home or office

## What is Ethereum on **ARM**

Ethereum on ARM provides images to easily turn you **ARM** device into a full Ethereum node. Images take care of all necessary steps, from setting up the environment and formatting the SSD disk to installing and running the Ethereum software as well as synchronizing the blockchain.

## Supported devices (February 2020)

- Raspberry Pi 4 https://www.raspberrypi.org/products/raspberry-pi-4-model-b/ (4 GB RAM)
- NanoPC-T4 https://www.friendlyarm.com/index.php?route=product/product&product_id=225
- RockPro64 https://www.pine64.org/rockpro64 (4 GB RAM)

## Ethereum on ARM images

- https://github.com/diglos/pi-gen (Raspberry Pi 4 32-bit)
- https://github.com/diglos/userpatches (NanoPC-T4 and RockPro64)

## Main features

- Support for Geth, Nethermind and Parity 1.0 clients
- Based on Armbian Ubuntu Bionic 18.04 and Raspbian Debian Buster
- Automatically resizes the SD card on first boot
- Partitions and formats the NVMe / USB3 SSD drive (in case is detected) and mount it as /home for storing the Ethereum blockchain under the ethereum user account
- Adds some swap memory (4GB) to prevent memory issues (applies only if a SSD drive is detected)
- Changes the hostname to something like “ethnode-e2a3e6fe” (HEX chunk based on the MAC hash)
- Runs Geth by default as a Systemd service in Light Server mode and starts syncing the Blockchain
- Watches the Ethereum client binary and respawns it in case it gets killed
- Includes an APT repository for upgrade Ethereum software through apt command
- Includes automatic upgrades through "Unattended upgrades" system (only 64 bit)

## Software installed

### Ethereum 1.0 clients

- Geth 1.9.10
- Parity 2.7.2
- Nethermind 1.5.8

### Ethereum 2.0 (64-bit only)

- Prysm 0.3.1
- Lighthouse 0.1.0

### Ethereum ecosystem

- Swarm: 0.5.5
- Raiden Network: 0.200.0~rc1
- IPFS: 0.4.23
- Status.im: 0.34.0~beta3
- Vipnode: 2.3

## Equipment

- Ethereum on ARM image (links above)
- Raspberry PI 4 / NanoPC-T4 / RockPro64
- Micro SD Card and SD Adaptor (for flashing the MicroSD)
- NVMe M.2 SSD (NanoPC-T4 / RockPro64) or an USB3 Disk (Raspberry Pi 4). We recommend at least 500GB. Keep in mind that without a SSD drive there’s absolutely no chance of syncing the Ethereum blockchain.
- An ethernet cable
- (Optional) 30303 Port forwarding. This is a recommended setting
- (Optional) USB keyboard, Monitor and HDMI cable

# Workshop. Raspberry Pi 4 image installation

This is a step-by-step guide of Ethereum on ARM image installation for the Raspberry Pi 4.

## Hardware used
- Raspberry Pi 4 https://www.raspberrypi.org/products/raspberry-pi-4-model-b/
- Inateck Box https://www.inateck.com/fe2011-aluminum-2-5-hard-drive-enclosure.html
- Kingston A400 SSD SA400S37/480G https://www.kingston.com/es/ssd/a400-solid-state-drive?partnum=SA400S37/480G
- Micro SD Card
- GeepPi Acrylic Case https://www.amazon.com/GeeekPi-Acrylic-Raspberry-Cooling-Heatsinks/dp/B07TXSQ47L?ref_=ast_sto_dp
- USB C power adapter
- Ethernet cable

![](https://api.kauri.io:443/ipfs/QmNsFNp2rUMSXQrDcdv2Yqr9RE8cAs4przQPhwvG7YzE6e)
_Necessary hardware (Raspberry Pi 4)_

## Installation steps

### Download the latest Ethereum on ARM [image](https://ethraspbian.com/downloads/image_2019-12-20-EthRaspbian2.0-lite.zip)

``` shell
[fernando@etherNode ~]$ wget https://ethraspbian.com/downloads/image_2019-12-20-EthRaspbian2.0-lite.zip
--2020-02-08 15:34:14--  https://ethraspbian.com/downloads/image_2019-12-20-EthRaspbian2.0-lite.zip
Loaded CA certificate '/etc/ssl/certs/ca-certificates.crt'
Resolving ethraspbian.com (ethraspbian.com)... 87.98.231.24
Connecting to ethraspbian.com (ethraspbian.com)|87.98.231.24|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 574317534 (548M) [application/zip]
Saving to: ‘image_2019-12-20-EthRaspbian2.0-lite.zip’

image_2019-12-20-EthRaspbian2.0-lite.zip            100%[==================================================================================================================>] 547,71M  11,3MB/s    in 48s

2020-02-08 15:35:02 (11,4 MB/s) - ‘image_2019-12-20-EthRaspbian2.0-lite.zip’ saved [574317534/574317534]
```
### Unzip the downloaded file
``` shell
[fernando@etherNode ~]$ unzip image_2019-12-20-EthRaspbian2.0-lite.zip
Archive:  image_2019-12-20-EthRaspbian2.0-lite.zip
  inflating: 2019-12-20-EthRaspbian2.0-lite.img
```
### Flash the uncompressed image

We need to find the right block device in order to flash the  image

``` shell
[fernando@etherNode ~]$ lsblk -P -M  -o PATH,MODEL
PATH="/dev/sda" MODEL="ST1000LM049-2GH172"
PATH="/dev/sda1" MODEL=""
PATH="/dev/sda2" MODEL=""
PATH="/dev/sdc" MODEL="Micro_SD_M2"
PATH="/dev/sdc1" MODEL=""
PATH="/dev/nvme0n1" MODEL="CT500P1SSD8"
PATH="/dev/nvme0n1p1" MODEL=""
PATH="/dev/nvme0n1p2" MODEL=""
PATH="/dev/nvme0n1p3" MODEL=""
PATH="/dev/nvme0n1p4" MODEL=""
PATH="/dev/nvme0n1p5" MODEL=""
PATH="/dev/nvme0n1p6" MODEL=""
```
In this case /dev/sdc is the MicroSD card. Other possible device is /dev/mmcblk0

### Flash the image to the right device

``` shell
[fernando@etherNode ~]$ sudo dd bs=1M if=2019-12-20-EthRaspbian2.0-lite.img of=/dev/sdc conv=fdatasync status=progress
2480930816 bytes (2,5 GB, 2,3 GiB) copied, 2 s, 1,2 GB/s
2444+0 records in
2444+0 records out
2562719744 bytes (2,6 GB, 2,4 GiB) copied, 258,691 s, 9,9 MB/s
```
And that's it. Easy! isn't it?

Note: **If you have a Windows desktop you can use Balena Etcher to flash the MicroSD

![](https://api.kauri.io:443/ipfs/QmWEFd3wErZ9n3qiS7LzBUbjkkXr9mUeyoh6pXdNeaD5m2)
_Etcher main menu_

### First connection

Using nmap you can easily find the local IP of your Raspi

``` shell
[fernando@etherNode ~]$ sudo nmap -sn 172.16.10.0/24
Starting Nmap 7.80 ( https://nmap.org ) at 2020-02-08 16:05 CET
Nmap scan report for www.adsl.vf (172.16.10.1)
Host is up (0.0075s latency).
MAC Address: B4:A5:EF:12:DE:30 (Sercomm)
Nmap scan report for 172.16.10.2
Host is up (0.010s latency).
MAC Address: 00:11:32:16:FD:03 (Synology Incorporated)
Nmap scan report for 172.16.10.154
Host is up (0.0085s latency).
MAC Address: B4:F1:DA:EA:0D:56 (LG Electronics (Mobile Communications))
Nmap scan report for 172.16.10.157
Host is up (0.0089s latency).
MAC Address: 7C:2E:BD:5F:4C:21 (Google)
Nmap scan report for 172.16.10.158
Host is up (0.0033s latency).
MAC Address: 14:49:E0:66:19:96 (Samsung Electro-mechanics(thailand))
Nmap scan report for 172.16.10.163
Host is up (0.0031s latency).
MAC Address: DC:A6:32:45:32:F2 (Raspberry Pi Trading)
Nmap scan report for 172.16.10.155
Host is up.
Nmap done: 256 IP addresses (7 hosts up) scanned in 28.26 seconds
```
The default user and password are ethereum::ethereum. The system will require a password change for security reasons so you will need to log in twice.

``` shell
[fernando@etherNode ~]$ ssh 172.16.10.163 -l ethereum
The authenticity of host '172.16.10.163 (172.16.10.163)' can't be established.
ECDSA key fingerprint is SHA256:BPw2GzwtL/VCgyhkY3O//ZHl9ZP1w+42R9zOs4EtX/U.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '172.16.10.163' (ECDSA) to the list of known hosts.
ethereum@172.16.10.163's password:
X11 forwarding request failed on channel 1
You are required to change your password immediately (administrator enforced)
Linux ethnode-f33f31e5 4.19.75-v8+ #1270 SMP PREEMPT Tue Sep 24 18:59:17 BST 2019 aarch64
The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.
Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Feb  8 15:10:05 2020 from 172.16.10.155
WARNING: Your password has expired.
You must change your password now and login again!
Changing password for ethereum.
Current password:
New password:
Retype new password:
passwd: password updated successfully
Connection to 172.16.10.163 closed.
```
## Software update

1. First run update-ethereum in order to get the latest software

``` shell
fernando@ethnode-f33f31e5:~# sudo update-ethereum
Hit:1 http://apt.ethraspbian.com buster InRelease
Hit:2 http://raspbian.raspberrypi.org/raspbian buster InRelease
Hit:3 http://apt.ethraspbian.com buster-security InRelease
Hit:4 http://archive.raspberrypi.org/debian buster InRelease
Hit:5 http://apt.ethraspbian.com buster-upgrades InRelease
Reading package lists... Done
Reading package lists... Done
Building dependency tree
Reading state information... Done
raiden is already the newest version (0.200.0~rc1-0).
status.im-node is already the newest version (0.34.0~beta3-0).
vipnode is already the newest version (2.3-0).
The following packages will be upgraded:
  geth ipfs parity swarm
4 upgraded, 0 newly installed, 0 to remove and 16 not upgraded.
Need to get 50.8 MB of archives.
After this operation, 0 B of additional disk space will be used.
Do you want to continue? [Y/n]
Get:1 http://apt.ethraspbian.com buster/main armhf geth armhf 1.9.10-0 [12.7 MB]
Get:2 http://apt.ethraspbian.com buster/main armhf ipfs armhf 0.4.23-0 [14.4 MB]
Get:3 http://apt.ethraspbian.com buster/main armhf parity armhf 2.7.2-0 [11.7 MB]
Get:4 http://apt.ethraspbian.com buster/main armhf swarm armhf 0.5.5-0 [12.0 MB]
Fetched 50.8 MB in 5s (10.3 MB/s)
Reading changelogs... Done
(Reading database ... 41579 files and directories currently installed.)
Preparing to unpack .../geth_1.9.10-0_armhf.deb ...
Unpacking geth (1.9.10-0) over (1.9.9-0) ...
Preparing to unpack .../ipfs_0.4.23-0_armhf.deb ...
Unpacking ipfs (0.4.23-0) over (0.4.22-0) ...
Preparing to unpack .../parity_2.7.2-0_armhf.deb ...
Unpacking parity (2.7.2-0) over (2.5.12-0) ...
Preparing to unpack .../swarm_0.5.5-0_armhf.deb ...
Unpacking swarm (0.5.5-0) over (0.5.4-0) ...
Setting up parity (2.7.2-0) ...
Setting up ipfs (0.4.23-0) ...
Setting up geth (1.9.10-0) ...
Setting up swarm (0.5.5-0) ...
```
2. Update Raspberry Pi kernel

``` shell
fernando@ethnode-f33f31e5:~# sudo rpi-eeprom-update
BOOTLOADER: up-to-date
CURRENT: Tue 10 Sep 10:41:50 UTC 2019 (1568112110)
 LATEST: Tue 10 Sep 10:41:50 UTC 2019 (1568112110)
VL805: up-to-date
CURRENT: 000137ab
 LATEST: 000137ab
```

**You are now running a full Ethereum node (Geth) on your Raspberry Pi 4.**

## Addendum. Some pictures of the installation

![](https://api.kauri.io:443/ipfs/QmXpnWXgyTMFt59hKg2VwyJeKtVN4hJrBKqCwYP1ZCxQt2)
_Power consumption during sync_

![](https://api.kauri.io:443/ipfs/QmaT3sC8YwUre7diBw6qYoZFh15xGSk2YfaXUToZbjb8jZ)
_It is very important to connect the SSD to the blue USB port_

![](https://api.kauri.io:443/ipfs/QmfBY1D7G8B2JyxY7x93GFtnJsLvrUcVU8LmUyHvjEwUSQ)
_Try to get a case with a cooler kit_

Follow us on https://twitter.com/EthereumOnARM
