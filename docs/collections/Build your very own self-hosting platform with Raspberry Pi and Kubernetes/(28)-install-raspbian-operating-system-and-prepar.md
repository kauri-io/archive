---
title: (2/8) Install Raspbian Operating-System and prepare the system for Kubernetes
summary: This article is part of the series Build your very own self-hosting platform with Raspberry Pi and Kubernetes Introduction Install Raspbian Operating-System and
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-03-31
some_url: 
---

# (2/8) Install Raspbian Operating-System and prepare the system for Kubernetes

![](https://ipfs.infura.io/ipfs/Qma6gsqaPkdAEKDzke9N7DTHXKKGRnU2RD7sH7tXdLSUjt)


<br />

#### This article is part of the series [Build your very own self-hosting platform with Raspberry Pi and Kubernetes](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes/5e1c3fdc1add0d0001dff534/c)

1. [Introduction](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes-introduction/1229f21044ef4bff8df35875d6803776/a)
2. **Install Raspbian Operating-System and prepare the system for Kubernetes**
3. [Install and configure a Kubernetes cluster with k3s to self-host applications](https://kauri.io/install-and-configure-a-kubernetes-cluster-with-k3s-to-self-host-applications/418b3bc1e0544fbc955a4bbba6fff8a9/a)
4. [Deploy NextCloud on Kuberbetes: The self-hosted Dropbox](https://kauri.io/deploy-nextcloud-on-kuberbetes:-the-self-hosted-dropbox/f958350b22794419b09fc34c7284b02e/a)
5. [Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett](https://kauri.io/self-host-your-media-center-on-kubernetes-with-plex-sonarr-radarr-transmission-and-jackett/8ec7c8c6bf4e4cc2a2ed563243998537/a)
6. [Self-host Pi-Hole on Kubernetes and block ads and trackers at the network level](https://kauri.io/-selfhost-pihole-on-kubernetes-and-block-ads-and/5268e3daace249aba7db0597b47591ef/a)
7. [Self-host your password manager with Bitwarden](https://kauri.io/selfhost-your-password-manager-with-bitwarden/b2187730d4294626b28d1d938057e2e0/a)
8. [Deploy Prometheus and Grafana to monitor a Kubernetes cluster](https://kauri.io/deploy-prometheus-and-grafana-to-monitor-a-kube/186a71b189864b9ebc4ef7c8a9f0a6b5/a)


<br />
<br />
### Introduction

Fist of all, we need to install and configure **Raspbian Linux Operating System** on each node of the future Kubernetes cluster.

Our cluster will be composed of three machines (I might use the terms _device_, _machine_, _node_ or _host_, that's all the same! a Single-Board Computer used as part of our future cluster):

| Hostname | IP | Description |
|---|---|---|
| kube-master | 192.168.0.22 | A Master represents the main node of the cluster responsible of the orchestration. It can act as a worker as well and run applications |
| kube-worker1 | 192.168.0.23 | A Worker is a machine dedicated to run applications only. It is remotely managed by the master node |
| kube-worker2 | 192.168.0.24 | A Worker is a machine dedicated to run applications only. It is remotely managed by the master node |

<br />
We are using a Portable SSD connected to the master node and exposed to the worker via NFS to store the volume data.

![](https://ipfs.infura.io/ipfs/QmfAnBjKB9hj2CMikh4c5TVKHLoKABBS5B5yQbSRRXyAtZ)

<br />

**Notes:**

- _Do not forget to run each step on each node (unless specified)_
- _We assume here your local network is under 192.168.0.x. You might need to change to match your home network._
- _If you prefer to use a NAS rather than a SSD, skip the part "Configure the SSD disk share" but configure the NFS client on each machine._
- _When I refer to the "local machine", it's usually your laptop or Desktop PC from where you are reading this._

<br />
<br />
### Flash the OS on the Micro SD card

**1. Download the latest version of the Raspbian Linux OS for RaspberryPi**

Go to the [download page](https://www.raspberrypi.org/downloads/raspbian/) and download Raspbian Buster Lite.

- Raspbian is a Debian-based computer operating system for Raspberry Pi.
- Buster Lite is a minimal version of Raspbian that doesn't contain a Desktop or Recommended software. We can start from a very clean, light and fresh install using this version.

**2. Unzip the archive to obtain the image `2019-09-26-raspbian-buster-lite.img`**

**3. Plug an Micro SD Card into your local machine**

**4. Use Etcher and flash the image on the SD card**

Download [Etcher](https://www.balena.io/etcher/) to flash OS images to SD cards & USB drives, safely and easily.

Launch Etcher, select first the image extracted of Raspbian, select the Media (SD card) and click on Flash.

![](https://ipfs.infura.io/ipfs/Qmbq9nv6BGxLcBmLvYAQ8fqCGHRcZewPN8DqSRBJDaHmXm)

![](https://ipfs.infura.io/ipfs/QmSGCN8edA61AuuhTAhAKoa61XmmvUtzCvTGBQsxtyPHBB)

**5. Once flashed, navigate to the folder /boot of the SD card and create an empty file `ssh`**

Adding the file named `ssh` onto the boot partition enables SSH by default.

```shell
$ cd /media/<USER_ID>/boot
$ touch ssh
```

**6. Unplug the Micro SD Card from your local machine and plug it to the Raspberry Pi**

**7. Plug the power to the Raspberry Pi as well as an Ethernet cable**

<br />
<br />
### Power up and connect via SSH

After you power up each device, we will attempt to connect from our local machine to the node via SSH. If you are under Linux or MacOS, toy only need to open a new terminal. For Microsoft Windows users, you can download and use [Putty](https://www.putty.org) as SSH client.

**1. Determine the device IP address**

Your network router probably assigns an arbitrary IP address when a device tries to join the network via DHCP. To find the address attributed to the device, you can check either on your router admin panel (usually http://192.168.0.1 assuming your local network is 192.168.0.x) or via a tool like [angryip](https://angryip.org).

![](https://ipfs.infura.io/ipfs/QmaGAcRkvbdsco79EDf49rfXzZzJs3c4RSxCHJnT4m5PBw)

_E.g. Virgin Media Hub_

In my case, the device named _raspberrypi_ (hostname) is assigned to the IP address **192.168.0.22**.

**2. Connect via SSH to the machine**

From a new terminal (or Putty), execute the following command `ssh pi@<IP>` to connect remotely to the node. You will be asked to accept to establish the connection (answer `yes`) and then to enter the password. The default password after a fresh Raspbian installation is `raspberry` (this will be change after this step).

```
greg@laptop:~$ ssh pi@192.168.0.22

The authenticity of host '192.168.0.22 (192.168.0.22)' can't be established.
ECDSA key fingerprint is SHA256:lwJ1ARp4uu94nJdD08HdFj0b8np/oTnMGA3q0yApLT0.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.22' (ECDSA) to the list of known hosts.

pi@192.168.0.22's password: raspberry
Linux raspberrypi 4.19.75-v7l+ #1270 SMP Tue Sep 24 18:51:41 BST 2019 armv7l

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.

SSH is enabled and the default password for the 'pi' user has not been changed.
This is a security risk - please login as the 'pi' user and type 'passwd' to set a new password.

pi@raspberrypi:~ $
```

Well done, you are now connected remotely to the machine. Do the same for the other machines of the cluster.


<br />
<br />
### Configure the OS

Before starting installing the Kubernetes cluster, we need to run a few common steps and security checks.

<br />
#### Change password

The default password configured by Raspbian is well known, so it is highly recommended to change it to something else only you know:

```
pi@raspberrypi:~ $ passwd

Changing password for pi.
Current password: raspberry
New password: <new_password>
Retype new password: <new_password>
passwd: password updated successfully
```


<br />
#### Change hostname

As we saw on the router, the default machine hostname is `raspberrypi`, keeping this could be quite confusing when we'd have two more machines with the same name. To change the hostname, two files needs to be edited:

**1. Edit the file `/etc/hostname` and replace `raspberrypi` by `kube-master` or `kube-worker-x`**

```
pi@raspberrypi:~ $ sudo vi /etc/hostname

kube-master
```

_Struggling with `vi`? take a look at the [Vim cheat-sheet](https://devhints.io/vim) or alternatively, use nano._

<br />
**2. Edit the file `/etc/hosts` and replace `raspberrypi` (line 6) by `kube-master` or `kube-worker-x`**

```
pi@raspberrypi:~ $ sudo vi /etc/hosts

127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

127.0.1.1       kube-master

```

<br />
#### Upgrade the system

To make sure, the system is up-to-date, run the following command to download the latest update and security patches. This step might take a few minutes.

```
pi@raspberrypi:~ $ sudo apt-get update && sudo apt-get upgrade -y

Get:1 http://raspbian.raspberrypi.org/raspbian buster InRelease [15.0 kB]
Get:2 http://archive.raspberrypi.org/debian buster InRelease [25.1 kB]
Get:3 http://raspbian.raspberrypi.org/raspbian buster/main armhf Packages [13.0 MB]
Get:4 http://archive.raspberrypi.org/debian buster/main armhf Packages [261 kB]
99% [3 Packages store 0 B]
(...)  
Processing triggers for dbus (1.12.16-1) ...
Processing triggers for install-info (6.5.0.dfsg.1-4+b1) ...
Processing triggers for mime-support (3.62) ...
Processing triggers for libc-bin (2.28-10+rpi1) ...
```

<br />
#### Configure a static IP

By default, the router assigns a arbitrary IP address to the device which means it is highly possible that the router will assign a new different IP address after a reboot. To avoid to recheck our router, it is possible to assign a static IP to the machine.  

Edit the file `/etc/dhcpcd.conf` and add the four lines below:

```
pi@raspberrypi:~ $ sudo vi /etc/dhcpcd.conf

interface eth0
static ip_address=192.168.0.<X>/24
static routers=192.168.0.1
static domain_name_servers=1.1.1.1
```

PS: This could be also done at the network level via the router admin (DHCP).


<br />
#### Enable container features

We need to enable _container features_ in the kernel in order to run containers.

Edit the file `/boot/cmdline.txt`:

```
pi@raspberrypi:~ $ sudo vi /boot/cmdline.txt
```

and add the following properties **at the end of the line**:

```
cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory
```

<br />
#### Firewall

Switch Debian firewall to legacy config:

```shell
$ update-alternatives --set iptables /usr/sbin/iptables-legacy
$ update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
```

<br />
#### Restart and connect to the static IP with the new password and check the hostname.

```
pi@raspberrypi:~ $ sudo reboot

Connection to 192.168.0.22 closed by remote host.
Connection to 192.168.0.22 closed.
```

Reconnect after a few seconds

```
greg@laptop:~$ ssh pi@192.168.0.22
pi@192.168.0.22's password: <new_password>
```

Check if the hostname has been updated

```
pi@kube-master:~ $ hostname

kube-master
```

<br />
<br />
### Configure the SSD disk share

As explained during the introduction, I made the choice to connect a portable SSD to the Master node and gave access via NFS to each worker.

<br />
**====== Master node only - Mount the disk and expose a NFS share ======**

<br />

**A. Mount the disk to the master**

**1. Plug the SSD to the USB3.0 (blue) port**

**2. Find the disk name (drive)**

Run the command `fdisk -l` to list all the connected disks to the system (includes the RAM) and try to identify the SSD. The disk which has a size of *465.6 GiB* and a model name *Portable SSD T5* and located into `/dev/sda` is our SSD.

```
pi@kube-master:~ $ sudo fdisk -l

Disk /dev/ram0: 4 MiB, 4194304 bytes, 8192 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
(...)
Disk /dev/sda: 465.8 GiB, 500107862016 bytes, 976773168 sectors
Disk model: Portable SSD T5
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 33553920 bytes
Disklabel type: dos
Disk identifier: 0x41d0909f
```

<br />
**3. Create a partition**

If your disk is new and freshly out of the package, you will need to create a partition.

```
pi@kube-master:~ $ sudo mkfs.ext4 /dev/sda

mke2fs 1.44.5 (15-Dec-2018)
/dev/sda contains a ext4 file system
	last mounted on /mnt/ssd on Mon Sep  9 21:06:47 2019
Proceed anyway? (y,N) y
Creating filesystem with 58609664 4k blocks and 14655488 inodes
Filesystem UUID: 5c3a8481-682c-4834-9814-17dba166f591
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
	4096000, 7962624, 11239424, 20480000, 23887872

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (262144 blocks):
done
Writing superblocks and filesystem accounting information: done     
```

<br />
**4. Manually mount the disk**

You can manually mount the disk to the directory `/mnt/ssd`.

```
pi@kube-master:~ $ sudo mkdir /mnt/ssd
pi@kube-master:~ $ sudo chown -R pi:pi /mnt/ssd/
pi@kube-master:~ $ sudo mount /dev/sda /mnt/ssd
```

<br />
**5. Automatically mount the disk on startup**

Next step consists to configure `fstab` to automatically mount the disk when the system starts.

You first need to find the Unique ID of the disk using the command `blkid`.

```
pi@kube-master:~ $ sudo blkid

/dev/mmcblk0p1: LABEL_FATBOOT="boot" LABEL="boot" UUID="F661-303B" TYPE="vfat" PARTUUID="a91dd8a2-01"
/dev/mmcblk0p2: LABEL="rootfs" UUID="8d008fde-f12a-47f7-8519-197ea707d3d4" TYPE="ext4" PARTUUID="a91dd8a2-02"
/dev/mmcblk0: PTUUID="a91dd8a2" PTTYPE="dos"
/dev/sda: UUID="0ac98c2c-8c32-476b-9009-ffca123a2654" TYPE="ext4"
```

Our SSD located in `/dev/sda` has a unique ID `0ac98c2c-8c32-476b-9009-ffca123a2654`.

Edit the file `/etc/fstab` and add the following line to configure auto-mount of the disk on startup.

```
pi@kube-master:~ $ sudo vi /etc/fstab
```

Add this line at the end:

```
UUID=0ac98c2c-8c32-476b-9009-ffca123a2654 /mnt/ssd ext4 defaults 0 0
```

Reboot the system

```
pi@kube-master:~ $ sudo reboot
```

You can verify the disk is correctly mounted on startup with the following command:

```
pi@kube-master:~ $ df -ha /dev/sda

Filesystem      Size  Used Avail Use% Mounted on
/dev/sda        458G   73M  435G   1% /mnt/ssd
```

<br />
**B. Share via NFS Server**

We now gonna make the directory `/mnt/ssd` of master accessible to other machines via NFS

**1. Install the required dependencies**

```
pi@kube-master:~ $ sudo apt-get install nfs-kernel-server -y
```

<br />
**2. Configure the NFS server**

Edit the file `/etc/exports` and add the following line

```
pi@kube-master:~ $ sudo vi /etc/exports

/mnt/ssd *(rw,no_root_squash,insecure,async,no_subtree_check,anonuid=1000,anongid=1000)
```

<br />
**3. Start the NFS Server**

```
pi@kube-master:~ $ sudo exportfs -ra
```


<br />
**====== Worker nodes only - Mount the NFS share ======**

<br />

**1. Install the necessary dependencies**

```
pi@kube-worker1:~ $ sudo apt-get install nfs-common -y
```

**2. Create the directory to mounty the NFS Share**

Create the directory `/mnt/ssd` and set the ownership to `pi`

```
pi@kube-worker1:~ $ sudo mkdir /mnt/ssd
pi@kube-worker1:~ $ sudo chown -R pi:pi /mnt/ssd/
```

**3. Configure auto-mount of the NFS Share**

In this step, we will edit `/etc/fstab` to tell the OS to automatically mount the NFS share into the directory `/mnt/ssd` when the machine starts.

```
pi@kube-worker1:~ $ sudo vi /etc/fstab
```

Add the following line where `192.168.0.22:/mnt/ssd` is the IP of `kube-master` and the NFS share path.

```
192.168.0.22:/mnt/ssd   /mnt/ssd   nfs    rw  0  0
```

**4. Reboot the system**

```
pi@kube-worker1:~ $ sudo reboot
```



<br />
<br />
### Conclusion

To conclude, we now have three secured, up-to-date and operational machines to build a Kubernetes cluster and easily self-host and maintain applications at home!

In the [next chapter](https://kauri.io/install-and-configure-a-kubernetes-cluster-with-k3s-to-self-host-applications/418b3bc1e0544fbc955a4bbba6fff8a9/a), we will see how to install Kubernetes with [Rancher **k3s**](https://k3s.io) on those three machines and deploy the necessary tools such as Package Manager (helm), Proxy and Load Balancer, Certificate Manager, etc. to safely and efficiently deploy our applications.

<br />
<br />



---

- **Kauri original title:** (2/8) Install Raspbian Operating-System and prepare the system for Kubernetes
- **Kauri original link:** https://kauri.io/28-install-raspbian-operating-system-and-prepare-t/7df2a9f9cf5f4f6eb217aa7223c01594/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-03-31
- **Kauri original tags:** self-hosting, kubernetes, raspberrypi, raspbian
- **Kauri original hash:** QmXT3ezdnGNLW5oYqoLjdvGvR3t3jhdcrM95KHqBe31bBV
- **Kauri original checkpoint:** unknown



