---
title: (8/8) Deploy Prometheus and Grafana to monitor a Kubernetes cluster
summary: This article is part of the series Build your very own self-hosting platform with Raspberry Pi and Kubernetes Introduction Install Raspbian Operating-System and
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-04-01
some_url: 
---

# (8/8) Deploy Prometheus and Grafana to monitor a Kubernetes cluster

![](https://ipfs.infura.io/ipfs/QmPkbAuQryPTYbKiZ3X542xCXrkXUwXYWtQfwYLtzh2iER)


<br />

#### This article is part of the series [Build your very own self-hosting platform with Raspberry Pi and Kubernetes](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes/5e1c3fdc1add0d0001dff534/c)

1. [Introduction](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes-introduction/1229f21044ef4bff8df35875d6803776/a)
2. [Install Raspbian Operating-System and prepare the system for Kubernetes](https://kauri.io/install-raspbian-operating-system-and-prepare-the-system-for-kubernetes/7df2a9f9cf5f4f6eb217aa7223c01594/a)
3. [Install and configure a Kubernetes cluster with k3s to self-host applications](https://kauri.io/install-and-configure-a-kubernetes-cluster-with-k3s-to-self-host-applications/418b3bc1e0544fbc955a4bbba6fff8a9/a)
4. [Deploy NextCloud on Kuberbetes: The self-hosted Dropbox](https://kauri.io/deploy-nextcloud-on-kuberbetes:-the-self-hosted-dropbox/f958350b22794419b09fc34c7284b02e/a)
5. [Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett](https://kauri.io/self-host-your-media-center-on-kubernetes-with-plex-sonarr-radarr-transmission-and-jackett/8ec7c8c6bf4e4cc2a2ed563243998537/a)
6. [Self-host Pi-Hole on Kubernetes and block ads and trackers at the network level](https://kauri.io/-selfhost-pihole-on-kubernetes-and-block-ads-and/5268e3daace249aba7db0597b47591ef/a)
7. [Self-host your password manager with Bitwarden](https://kauri.io/selfhost-your-password-manager-with-bitwarden/b2187730d4294626b28d1d938057e2e0/a)
8. **Deploy Prometheus and Grafana to monitor a Kubernetes cluster**


<br />
<br />
### Introduction

Monitoring is an important part of the maintenance of a Kubernetes cluster to gain visibility on the infrastructure and the running applications and consequently detect anomalies and undesirables behaviours (service downtime, errors, slow responses).

[Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) is a common combination of tools to build up a monitoring system where Prometheus acts as a data collector pulling periodically metrics from different systems and Grafana as a dashboard solution to visualise the data.

![](https://ipfs.infura.io/ipfs/QmW2155L91oNeMp9H2VR1nSeoB5GchppXQJCjfTt6wtSW4)

Specifically for Kubernetes, a great Open-Source project called [**cluster-monitoring**](https://github.com/carlosedp/cluster-monitoring) offers a scripts to automate the installation and configuration of Prometheus + Grafana and provides a lot of dashboards for Kubernetes out of the box.


<br />
<br />
### Prerequisite

In order to run entirely the tutorial, we will need:

- A running Kubernetes cluster (see previous articles if you haven't set this up yet)
- Install Golang on the machine that runs `kubectl`

```
$ sudo apt  install golang-go
$ export PATH=$PATH:$(go env GOPATH)/bin
$ export GOPATH=$(go env GOPATH)
```


<br />
<br />
### Configuration

**1. Clone the repository** 

Clone the repository `cluster-monitoring` with the following command (change ~/workspace/cluster-monitoring by the target folder of your choice):

```
$ git clone https://github.com/carlosedp/cluster-monitoring.git ~/workspace/cluster-monitoring
```

<br />
**2. Configuration**

Then open the file `~/workspace/cluster-monitoring/vars.jsonnet` and modify the following sections:

Enable k3s and put the IP of our master node `kube-master`.

```json
  k3s: {
    enabled: true,
    master_ip: ['192.168.0.22'],
  },
```

<br />
The suffix domain is used to deploy an ingress to access Prometheus `prometheus.<suffixDomain>` and Grafana `grafana.<suffixDomain>`. You can manually configure a DNS entry to point to `192.168.0.240` (Load Balancer IP of the Nginx) or used [nip.io](https://nip.io/) to automatically resolve a domain to an IP (basically it resolves `<anything>.<ip>.nip.io` by `<ip>` without requiring any other configuration).

```json
    suffixDomain: '192.168.0.240.nip.io',
```

<br />
Enable the persistence to store the metrics (Prometheus) and dashboard settings (Grafana).

```json
  enablePersistence: {
    prometheus: true,
    grafana: true,
  },
```


<br />
<br />
### Installation

Once we've done the configuration part, we can now proceed to the installation.

Navigate into the folder `cluster-monitoring`.

```
$ cd ~/workspace/cluster-monitoring/
```

<br />
First run `make vendor` to download all the necessary packages.

```
$ make vendor

rm -rf vendor
/home/gjeanmart/go/bin/jb install
GET https://github.com/coreos/kube-prometheus/archive/285624d8fbef01923f7b9772fe2da21c5698a666.tar.gz 200
GET https://github.com/brancz/kubernetes-grafana/archive/57b4365eacda291b82e0d55ba7eec573a8198dda.tar.gz 200
(...)
GET https://github.com/metalmatze/slo-libsonnet/archive/5ddd7ffc39e7a54c9aca997c2c389a8046fab0ff.tar.gz 200
```

<br />
Finally deploy the monitoring stack with the command `make deploy`.

```
$ make deploy

rm -rf manifests
./scripts/build.sh main.jsonnet /home/gjeanmart/go/bin/jsonnet
using jsonnet from arg
+ set -o pipefail
+ rm -rf manifests
+ mkdir manifests
+ /home/gjeanmart/go/bin/jsonnet -J vendor -m manifests main.jsonnet
+ xargs '-I{}' sh -c 'cat {} | gojsontoyaml > {}.yaml; rm -f {}' -- '{}'
kubectl apply -f ./manifests/
namespace/monitoring created
(...)
servicemonitor.monitoring.coreos.com/kubelet created
```

**Repeat this command again if you see some errors as a result.**

<br />
Once deployed, check that the namespace `monitoring` has all the components up and running.

```
$ kubectl get pods -n monitoring -o wide

NAME                                   READY   STATUS    RESTARTS   AGE     IP             NODE          NOMINATED NODE   READINESS GATES
prometheus-operator-56d66c5dc6-8ljsb   1/1     Running   0          7m54s   10.42.0.154    kube-master   <none>           <none>
alertmanager-main-0                    2/2     Running   0          7m43s   10.42.0.155    kube-master   <none>           <none>
kube-state-metrics-5c6fb7544b-6p956    3/3     Running   0          7m36s   10.42.0.157    kube-master   <none>           <none>
node-exporter-h48d6                    2/2     Running   0          7m34s   192.168.0.22   kube-master   <none>           <none>
prometheus-adapter-679db899b7-x89l6    1/1     Running   0          7m22s   10.42.0.158    kube-master   <none>           <none>
grafana-6fb45f9c8-j8qbv                1/1     Running   0          7m41s   10.42.0.159    kube-master   <none>           <none>
prometheus-k8s-0                       3/3     Running   1          7m15s   10.42.0.161    kube-master   <none>           <none>
```


<br />
<br />
### Dashboard

After configuring and deploying our Kubernetes Monitoring stack, you can now access the different components:

- Prometheus: [https://prometheus.192.168.0.240.nip.io](https://prometheus.192.168.0.240.nip.io)
- Grafana: [https://grafana.192.168.0.240.nip.io](https://grafana.192.168.0.240.nip.io) 

Click on the Grafana link and login with the default login/password `admin/admin` (you will be asked to choose a new password)

![](https://i.imgur.com/a3a0Ocu.png)

You can now finally enjoy a lot of pre-configured dashboards for your Kubernetes cluster.

![](https://i.imgur.com/ASJhgZ3.png)


---

- **Kauri original link:** https://kauri.io/(88)-deploy-prometheus-and-grafana-to-monitor-a-k/186a71b189864b9ebc4ef7c8a9f0a6b5/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-04-01
- **Kauri original tags:** self-hosting, analytics, kubernetes, grafana, prometheus, monitoring
- **Kauri original hash:** QmVCXG2Uum6gQkKbE1dQprGJ1NUmye7uTPvuiqojGDFupw
- **Kauri original checkpoint:** unknown



