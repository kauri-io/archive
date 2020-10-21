---
title: (1/8) Build your very own self-hosting platform with Raspberry Pi and Kubernetes - Introduction
summary: Preface Self-hosting is a new trend which attracts more people every day, whether you are looking for more privacy, or disapprove big SaaS companies methods to
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-04-13
some_url: 
---

# (1/8) Build your very own self-hosting platform with Raspberry Pi and Kubernetes - Introduction

![](https://ipfs.infura.io/ipfs/QmPFWQJ1gevuXVxMfELZ9XoXx9QEANSonMiEvNw7YP254t)



### Preface

**Self-hosting** is a new trend which attracts more people every day, whether you are looking for more privacy, or disapprove big [SaaS](https://en.wikipedia.org/wiki/Software_as_a_service) companies methods to monetize your data or simply because you enjoy hacking things at home and challenge yourself. This series is for you!

The concept of self-hosting is usually defined by hosting an [open-source software](https://en.wikipedia.org/wiki/Open-source_software) at home on your own machine and under your own network instead of relying on a third-party SaaS provider which usually comes with terms and conditions you might read and agree with or not. On one hand, SaaS/Cloud solutions are simple and easy, everything is taken care for you (hosting, maintenance, support) but at the cost of being sustainable which generally means for the end users: selling personal data (targeted advertising) or paying monthly subscription fees. On the other hand, depending on what software you will self-host, it could require strong technical IT knowledge, especially in networking and security to ensure your data are safe. But, as we all know, _With great power comes great responsibility_ !

Another important concept is **open-source software** (OSS), giving access to anyone to the code of your software is ultimately the most transparent and effective way to insure security. It often relies on a community of passionate engineers to quickly respond to security holes without bureaucracy but bear in mind you need to pick a reputable open-source software which has both good code quality and an active community.

Here is a metaphor I really like about self-hosting:

> *Having a hosted website is like being a renter, rather than a homeowner.*

> *On the one hand, you have a place to live and your landlord takes care of certain fees and maintenance.*

> *On the other hand, you depend on the mercy of the landlord to keep things liveable for you, and you can’t redesign the house as you please.*

[source](https://medium.com/swlh/the-step-by-step-guide-to-starting-your-own-self-hosted-website-from-scratch-d10a8e6ccf0c)

<br />
<br />

### Introduction

As I mentioned, self-hosting can be quite complicated and require knowledge. So in this series of articles, we will learn how to setup a Kubernetes cluster of Raspberry Pi computers to ensure the following properties for our containerized applications:

- Data security
- Service availability
- Maintenance easiness
- Simple resource management


Before starting, let me explain a few important concepts here.

<br />

#### Container

As most modern software engineers can attest, containers have offered a dramatically more flexible way to run applications on virtual and physical environments. A container is a unit of software that packages up code and all its dependencies, it is portable from one environment to another, lightweight and secure (isolation by default).

[Docker](https://www.docker.com) is currently the most known container software in the industry.

<br />

#### Why Kubernetes?

Now we know, it is easy to run containerized applications, we need an orchestrator to manage our applications across multiple hosts (machines), this will help automating most of the maintenance tasks (reboot after application or host crash, scaling, load balancing, configuration management, etc.).   

![](https://ipfs.infura.io/ipfs/QmXCrk532MtmJPY5eWnyrXvmgi8PCaxdbGh6DFtknHHbdN)

[Kubernetes (k8s) from Google](https://kubernetes.io) is the market leader in container orchestration, it offers:

- **Portability**: Kubernetes works on most of the cloud provider and CPU architectures, an infrastructure can easily be moved from one another without complete re-architecture.  
- **Scalability**: Multiple-instance of an application and load-balancing is made very easy
- **Availability** Kubernetes addresses high availability at both the application and the infrastructure level.
- **Open-source** A vast ecosystem and community
- **Battle-tested** Used by thousands of developers and companies across the world

For those reasons, Kubernetes is a good choice to orchestrate our future self-hosting / homelab infrastructure!

Kubernetes comes with a lot of tools that aren't necessarily needed or optimized for ARM devices like the RaspberryPi so the company Rancher launched [k3s](https://k3s.io), a lightweight Kubernetes ideal for IOT and Single-Board computers.

<br />

#### Why Raspberry Pi

A [Raspberry Pi (RPI)](https://www.raspberrypi.org) is Single-Board Computer (SBC) initially launched in 2012 as an educational tool to learn programming but it actually quickly became very popular in the hardware and hacking communities and people now use RPI for hardware projects, home automation, robotics and much more...

![](https://ipfs.infura.io/ipfs/QmexqWd1z8T1XsAWbxwgkgSwimtU4buUD9CoksLwKAoRaZ)

<br />

Since 2012, the Raspberry Pi foundation launched several generations:

| Product                 | SoC          | Speed   | RAM   | USB Ports      | Ethernet   | Wireless   | Bluetooth |
|-------------------------|--------------|---------|-------|----------------|------------|------------|-----------|
| Raspberry Pi Model A+   | BCM2835      | 700MHz  | 512MB | 1              | No         | No         | No        |
| Raspberry Pi Model B+   | BCM2835      | 700MHz  | 512MB | 4              | 100Base-T  | No         | No        |
| Raspberry Pi 2 Model B  | BCM2836/7    | 900MHz  | 1GB   | 4              | 100Base-T  | No         | No        |
| Raspberry Pi 3 Model B  | BCM2837A0/B0 | 1200MHz | 1GB   | 4              | 100Base-T  | 802.11n    | 4.1       |
| Raspberry Pi 3 Model A+ | BCM2837B0    | 1400MHz | 512MB | 1              | No         | 802.11ac/n | 4.2       |
| Raspberry Pi 3 Model B+ | BCM2837B0    | 1400MHz | 1GB   | 4              | 1000Base-T | 802.11ac/n | 4.2       |
| Raspberry Pi 4 Model B  | BCM2711      | 1500MHz | 1GB   | 2xUSB2, 2xUSB3 | 1000Base-T | 802.11ac/n | 5.0       |
| Raspberry Pi 4 Model B  | BCM2711      | 1500MHz | 2GB   | 2xUSB2, 2xUSB3 | 1000Base-T | 802.11ac/n | 5.0       |
| Raspberry Pi 4 Model B  | BCM2711      | 1500MHz | 4GB   | 2xUSB2, 2xUSB3 | 1000Base-T | 802.11ac/n | 5.0       |
| Raspberry Pi Zero       | BCM2835      | 1000MHz | 512MB | 1              | No         | No         | No        |
| Raspberry Pi Zero W     | BCM2835      | 1000MHz | 512MB | 1              | No         | 802.11n    | 4.1       |
| Raspberry Pi Zero WH    | BCM2835      | 1000MHz | 512MB | 1              | No         | 802.11n    | 4.1       |


[Raspberry Pi - Hardware history](https://elinux.org/RPi_HardwareHistory)

<br />

The main benefits of using Raspberry Pi are:

- **Cheap**: A Raspberry Pi usually cost around 50$
- **Reliability and performance**: Again RPIs are battle tested products, very reliable and getting more and more powerful
- **Great community**: It has a huge community of passionate hobbyists and professionals which provides knowledge and addons across the web.
- **Size**: The raspberry pi is small (credit card size) and fits almost anywhere.


<br />

#### Keep Control and Enjoy!

I have been hosting stuff by myself for a while now and I've always struggled with maintenance in the long run (service not working correctly on ARM, machine freeze, configuration management mess). So when I recently decided to migrate everything on Kubernetes, it has been quite challenging but finally got it working and I haven't touched it since, every single services are running like a charm, they may have crashed a couple of times but Kubernetes recovered everything without me noticing the downtime.



<br />
<br />

### Hardware requirement

In order to build our self-hosting platform, we need the following hardware materials:

- **Single-Board Computers:**
First of all, we need computers. I would recommend to start at least with two so your applications can fallback on the second node if one crashes. I also highly suggest to use Raspberry Pi 4 (4GB) but you can stack up any kind of ARM based computers.
For example in my case, I use one [RaspberryPi 4B](https://www.amazon.co.uk/Raspberry-Pi-ARM-Cortex-A72-Bluetooth-Micro-HDMI/dp/B07TC2BK1X), one [NanoPi-m4](https://www.amazon.co.uk/FriendlyARM-Rockchip-dual-band-Support-learning/dp/B07GXP3ZR4) and two [RaspberryPi 3B+](https://www.amazon.co.uk/Raspberry-Pi-3-Model-B/dp/B07BDR5PDW).
The cost of one board is around $50.

- **Power supply:**
Depending on the board, you need a power supply, a Raspberry Pi 4 requires a [5V 3A USB C/Type-C Power Supply Adapter](https://www.amazon.co.uk/Jun_Electronic-Type-C-Supply-Adapter-Raspberry/dp/B07TWMFB92) which shouldn't cost more than $10.

- **Micro-SD card:**
In order to run the operating-system on each board, we need a Micro-SD card of 16GB minimum (for e.g [SanDisk 16GB](https://www.amazon.co.uk/SanDisk-microSDHC-Memory-Adapter-Performance/dp/B073K14CVB) which costs around $5 piece)

- **A portable SSD disk (optional):**
Because the hosting-platform will run programs (containers) on any hosts we have, we need to build a share drive between each host. I chose to run a NFS share from a portable [USB3 512GB SSD disk](https://www.amazon.co.uk/Samsung-MU-PA500B-Portable-SSD-500GB/dp/B074MCM721) (cost: $90) but we could imagine more reliable solution such as a NAS (e.g Synology).

- **Ethernet Cables:** (optional but recommended)
Our hosts machines need access to a network and Internet, I recommend using Ethernet instead of WIFI.

- **Ethernet Switch (optional):**
Routers usually have only 4 or 5 Ethernet ports so if you don't want to use them all, you can dedicate an Ethernet switch to the homelab like [this one](https://www.amazon.co.uk/gp/product/B07HP5TN4S) which costs around $15.  

- **Case with cooling fan (optional but recommended):**
Finally, cooling fans and heatsink are also highly recommended to keep the CPU cool and reduce the risk of hardware failure due to overheating.
I am personally using [this rack case](https://www.amazon.co.uk/gp/product/B07J9VMNBL/) including fans and heatsinks (cost $20)

<br />

The result looks like this on my side for a total cost around $250 approximately:

![](https://ipfs.infura.io/ipfs/Qme6ME6QJaDXKqX14CA7oSQpySMpdpgLV55DzHdMX5Yc6Q)

<br />
<br />

### Table of content

Alright, now we defined what we gonna do and why, let's get started!

1. [Introduction](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes-introduction/1229f21044ef4bff8df35875d6803776/a)
2. [Install Raspbian Operating-System and prepare the system for Kubernetes](https://kauri.io/install-raspbian-operating-system-and-prepare-the-system-for-kubernetes/7df2a9f9cf5f4f6eb217aa7223c01594/a)
3. [Install and configure a Kubernetes cluster with k3s to self-host applications](https://kauri.io/install-and-configure-a-kubernetes-cluster-with-k3s-to-self-host-applications/418b3bc1e0544fbc955a4bbba6fff8a9/a)
4. [Deploy NextCloud on Kuberbetes: The self-hosted Dropbox](https://kauri.io/deploy-nextcloud-on-kuberbetes:-the-self-hosted-dropbox/f958350b22794419b09fc34c7284b02e/a)
5. [Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett](https://kauri.io/self-host-your-media-center-on-kubernetes-with-plex-sonarr-radarr-transmission-and-jackett/8ec7c8c6bf4e4cc2a2ed563243998537/a)
6. [Self-host Pi-Hole on Kubernetes and block ads and trackers at the network level](https://kauri.io/-selfhost-pihole-on-kubernetes-and-block-ads-and/5268e3daace249aba7db0597b47591ef/a)
7. [Self-host your password manager with Bitwarden](https://kauri.io/selfhost-your-password-manager-with-bitwarden/b2187730d4294626b28d1d938057e2e0/a)
8. [Deploy Prometheus and Grafana to monitor a Kubernetes cluster](https://kauri.io/deploy-prometheus-and-grafana-to-monitor-a-kube/186a71b189864b9ebc4ef7c8a9f0a6b5/a)

_If you'd like to see an article in this series: please contact me on Twitter [@gregjeanmart](https://twitter.com/GregJeanmart)_


<br />
<br />
<br />
### References

- [The Step-by-Step Guide to Starting Your Own Self-Hosted Website From Scratch](https://medium.com/swlh/the-step-by-step-guide-to-starting-your-own-self-hosted-website-from-scratch-d10a8e6ccf0c)
- [Wikipedia - SaaS](https://en.wikipedia.org/wiki/Software_as_a_service)
- [Wikipedia - open-source software](https://en.wikipedia.org/wiki/Open-source_software)
- [Understanding Open Source Software, and How It Makes You Money Online](https://www.websiteplanet.com/blog/what-is-open-source-software/)
- [Raspberry Pi - Hardware history](https://elinux.org/RPi_HardwareHistory)

<br />
<br />



---

- **Kauri original title:** (1/8) Build your very own self-hosting platform with Raspberry Pi and Kubernetes - Introduction
- **Kauri original link:** https://kauri.io/18-build-your-very-own-self-hosting-platform-with-/1229f21044ef4bff8df35875d6803776/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-04-13
- **Kauri original tags:** self-hosting, kubernetes, raspberrypi, k8s, privacy, k3s, home-lab
- **Kauri original hash:** QmafSCAJNiFRu7XihbUqXB2J7SsRiH7TGkJcrxcGevnkP1
- **Kauri original checkpoint:** unknown



