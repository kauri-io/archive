---
title: (5/8) Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett 
summary: This article is part of the series Build your very own self-hosting platform with Raspberry Pi and Kubernetes Introduction Install Raspbian Operating-System and
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-05-26
some_url: 
---

# (5/8) Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett 

![](https://ipfs.infura.io/ipfs/QmUMQnRmFtNMXkBfYQdjG9WMCpAof49zavMNJXYHSDSa2k)


<br />

#### This article is part of the series [Build your very own self-hosting platform with Raspberry Pi and Kubernetes](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes/5e1c3fdc1add0d0001dff534/c)

1. [Introduction](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes-introduction/1229f21044ef4bff8df35875d6803776/a)
2. [Install Raspbian Operating-System and prepare the system for Kubernetes](https://kauri.io/install-raspbian-operating-system-and-prepare-the-system-for-kubernetes/7df2a9f9cf5f4f6eb217aa7223c01594/a)
3. [Install and configure a Kubernetes cluster with k3s to self-host applications](https://kauri.io/install-and-configure-a-kubernetes-cluster-with-k3s-to-self-host-applications/418b3bc1e0544fbc955a4bbba6fff8a9/a)
4. [Deploy NextCloud on Kuberbetes: The self-hosted Dropbox](https://kauri.io/deploy-nextcloud-on-kuberbetes:-the-self-hosted-dropbox/f958350b22794419b09fc34c7284b02e/a)
5. **Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett**
6. [Self-host Pi-Hole on Kubernetes and block ads and trackers at the network level](https://kauri.io/-selfhost-pihole-on-kubernetes-and-block-ads-and/5268e3daace249aba7db0597b47591ef/a)
7. [Self-host your password manager with Bitwarden](https://kauri.io/selfhost-your-password-manager-with-bitwarden/b2187730d4294626b28d1d938057e2e0/a)
8. [Deploy Prometheus and Grafana to monitor a Kubernetes cluster](https://kauri.io/deploy-prometheus-and-grafana-to-monitor-a-kube/186a71b189864b9ebc4ef7c8a9f0a6b5/a)

<br />
<br />
### Introduction

In the next article of this series, we will learn how to install and configure a Media Center onto our Kubernetes platform to automate the media aggregation and management and play our Media files. The Media Center will be composed of the following components:

- **Persistence:** A dedicated volume on the SSD to store the data and files
- **Torrent Proxy:** Jackett is a Torrent Providers Aggregator tool helping to find efficiently BitTorent files over the web
- **Downloaders:** Transmission is a BitTorrent client to download the files
- **TV Show/Movie Media Management:** We'll use Sonarr and Radarr to automate the media aggregation. It searches, launches downloads and renames files when they go out
- **Media Center/Player:** Plex (server/player) will allow us to make our Media resources accessible from anywhere.

![](https://ipfs.infura.io/ipfs/Qmex8bC6gLPAHCmtAc2EHe3jnUYjXoV9GA5SFQFcrboqCu)

<br />
<br />
### Namespace

We are going to isolate all the Kubernetes objects related to the Media Center into the namespace `media`.

To create a namespace, run the following command:

```
$ kubectl create namespace media
```


<br />
<br />
### Persistence

The first step consists in setting up a volume to store our media files and data required to run each component. If you followed the previous articles to install and configure a self-hosting platform using RaspberryPi and Kubernetes, you remember we have on each worker a NFS client pointing to a SSD on `/mnt/ssd`.

**1. Deploy the Persistent Volume (PV)**

The Persistent Volume specifies the name, the size, the location and the access modes of the volume:

- The name of the PV is  `media-ssd`
- The size allocated is 200GB
- The location is `/mnt/ssd/media`
- The access is ReadWriteOnce

Create the following file and apply it to the k8 cluster.

```yaml
## media.persistentvolume.yml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: "media-ssd"
  labels:
    type: "local"
spec:
  storageClassName: "manual"
  capacity:
    storage: "200Gi"
  accessModes:
    - ReadWriteMany
  hostPath:
    path: "/mnt/ssd/media"
---
```

```
$ kubectl apply -f media.persistentvolume.yml
persistentvolume/media-ssd created
```

You can verify the PV exists with the following command:

```
$ kubectl get pv

NAME            CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
media-ssd       200Gi      RWO            Retain           Available           manual                  34s
```

<br />
**2. Create the Persistent Volume Claim (PVC)**

The Persistent Volume Claim is used to map a Persistent Volume to a deployment or stateful set. Unlike the PV, the PVC belongs to a namespace.

Create the following file and apply it to the k8 cluster.

```yaml
## media.persistentvolumeclaim.yml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: "media"
  name: "media-ssd"
spec:
  storageClassName: "manual"
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: "200Gi"
---
```

```
$ kubectl apply -f media.persistentvolumeclaim.yml
persistentvolumeclaim/media-ssd created
```

You can verify the PVC exists with the following command:

```
$ kubectl get pvc -n media

NAME            STATUS   VOLUME          CAPACITY   ACCESS MODES   STORAGECLASS   AGE
media-ssd       Bound    media-ssd       200Gi      RWO            manual         26s
```


<br />
<br />
### Ingress

After the persistent volume, we are now going to deploy the ingress responsible of making accessible a service from outside the cluster by mapping an internal `service:port` to a host. To choose a host, we need to configure a DNS like we did for NextCloud "nextcloud.<domain.com>" in the previous article. However, unlike NextCloud, the Media Center components have no reason to be exposed on the Internet, we can pick a host that will be resolved internally to our Nginx proxy (available at `192.168.0.240` : LoadBalancer IP). The simplest solution is to use [nip.io](https://nip.io) which allows us to map an IP (in our case `192.168.0.240`) to a hostname without touching `/etc/hosts` or configuring a DNS. Basically it resolves `<anything>.<ip>.nip.io` by `<ip>` without requiring anything else, Magic !

**1. Create the file `media.ingress.yaml`**

Create the following Ingress config file `media.ingress.yaml` to map the routes to each service we will deploy right after this step:

- `http://media.192.168.0.240.nip.io/transmission` -> `transmission-transmission-openvpn:80`
- `http://media.192.168.0.240.nip.io/sonarr` -> `sonarr:80`
- `http://media.192.168.0.240.nip.io/jackett` -> `jackett:80`
- `http://media.192.168.0.240.nip.io/radarr` -> `radarr:80`
- `http://media.192.168.0.240.nip.io/` -> `plex-kube-plex:32400`

```yaml
## media.ingress.yaml
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  namespace: "media"
  name: "media-ingress"
spec:
  rules:
  - host: "media.192.168.0.240.nip.io"
    http:
      paths:
        - backend:
            serviceName: "transmission-transmission-openvpn"
            servicePort: 80
          path: "/transmission"
        - backend:
            serviceName: "sonarr"
            servicePort: 80
          path: "/sonarr"
        - backend:
            serviceName: "jackett"
            servicePort: 80
          path: "/jackett"
        - backend:
            serviceName: "radarr"
            servicePort: 80
          path: "/radarr"
        - backend:
            serviceName: "plex-kube-plex"
            servicePort: 32400
          path: "/"
---
```

<br />
**2. Deploy the ingress**

Deploy the Ingress by applying the file `media.ingress.yaml`.

```
$ kubectl apply -f media.ingress.yaml
ingress.extensions/media-ingress created
```

<br />
**3. Confirm the Ingress is correctly deployed**

Try the URL [http://media.192.168.0.240.nip.io](http://media.192.168.0.240.nip.io) from your browser and confirm it returns the error message `503 Service Temporarily Unavailable` which is normal because we haven't deployed anything yet.

![](https://i.imgur.com/tIC7P0r.png)

<br />
<br />
### Heml Repository - add Bananaspliff

Someone already made a very good job at creating specific [Helm Charts](https://bananaspliff.github.io/geek-charts/) for the all the software we wish to install in this tutorial. Add the following repository to your Helm using the following command:

```
$ helm repo add bananaspliff https://bananaspliff.github.io/geek-charts
$ helm repo update
```


<br />
<br />

![](https://ipfs.infura.io/ipfs/QmTp1hoJ558ZtTRXDtsmj6smFJLq2y6J8d7a5MD6gmPzfH)

<br />

### BitTorrent client - Transmission over VPN

The first bit of software to install is [Transmission](https://transmissionbt.com), an open-source BitTorent client offering an API, great for integration and automation. Because many Internet providers and Governments disproves BitTorent download, we are going to deploy Transmission alongside a VPN. The image [haugene/transmission-openvpn](https://haugene.github.io/docker-transmission-openvpn/) includes Transmission and supports a very large range of VPN providers (see [here](https://haugene.github.io/docker-transmission-openvpn/supported-providers/)) to obfuscate the traffic. I will be using NordVPN but change appropriately to your need.

<br />
**1. Create a Kubernetes secret to store your VPN password**

We first need to safely store our VPN Provider username and password into a [Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/). Run the command using your own VPN username and password:

```
$ kubectl create secret generic openvpn \
    --from-literal username=<VPN_USERNAME> \
    --from-literal password=<VPN_PASSWORD> \
    --namespace media
```

<br />
**2. Write the Helm configuration**

Next, we will configure the chart [bananaspliff/transmission-openvpn](https://github.com/bananaspliff/geek-charts/tree/gh-pages/transmission-openvpn). The default configuration can be seen by running the following command `$ helm show values bananaspliff/transmission-openvpn`.

Create the file `media.transmission-openvpn.values.yml` containing the following configuration.

```yaml
## media.transmission-openvpn.values.yml
replicaCount: 1

image:
  repository: "haugene/transmission-openvpn"
  tag: "latest-armhf" # Suffixed by -armhf to pull the ARM image
  pullPolicy: "IfNotPresent"

env:
  - name: OPENVPN_PROVIDER
    value: "NORDVPN" # VPN provider. List of supported providers: https://haugene.github.io/docker-transmission-openvpn/supported-providers/
  - name: OPENVPN_USERNAME
    valueFrom: # Reference to the secret | openvpn.username
      secretKeyRef:
        name: "openvpn"
        key: "username"
  - name: OPENVPN_PASSWORD
    valueFrom: # Reference to the secret | openvpn.password
      secretKeyRef:
        name: "openvpn"
        key: "password"
  - name: NORDVPN_PROTOCOL
    value: "TCP"
  - name: NORDVPN_COUNTRY
    value: "CH" # Country where we want to download over VPN
  - name: NORDVPN_CATEGORY
    value: "P2P" # VPN Type
  - name: LOCAL_NETWORK
    value: "192.168.0.0/24"
  - name: TRANSMISSION_PEER_PORT
    value: "47444"
  - name: TRANSMISSION_DOWNLOAD_DIR
    value: "/downloads/transmission"
  - name: PUID
    value: "1000"
  - name: PGID
    value: "1000"

service:
  type: ClusterIP
  port: 80

volumes:
  - name: "media-ssd"
    persistentVolumeClaim:
      claimName: "media-ssd" # PersistentVolumeClaim created earlier
  - name: "dev-tun" # Needed for VPN
    hostPath:
      path: "/dev/net/tun"

volumeMounts:
  - name: "media-ssd"
    mountPath: "/data"
    subPath: "configs/transmission-data" # Path /mnt/ssd/media/configs/transmission-data where transmission writes the configuration
  - name: "media-ssd"
    mountPath: "/downloads/transmission"
    subPath: "downloads/transmission" # Path /mnt/ssd/media/downloads/transmission where transmission downloads Torrents
  - name: "dev-tun"
    mountPath: "/dev/net/tun" # Needed for VPN

securityContext:
  capabilities: # Needed for VPN
    add:
      - NET_ADMIN
```

<br />
**2. Install the chart `bananaspliff/transmission-openvpn`**

Execute the following command to install the chart `bananaspliff/transmission-openvpn` with the above configuration onto the namespace `media`.

```
$ helm install transmission bananaspliff/transmission-openvpn \
    --values media.transmission-openvpn.values.yml \
    --namespace media
```

After a couple of minutes, you should observe a pod named `transmission-transmission-openvpn-xxx` Running.

```
$ kubectl get pods -n media -l app=transmission-openvpn -o wide

NAME                                                 READY   STATUS    RESTARTS   AGE   IP           NODE           NOMINATED NODE   READINESS GATES
transmission-transmission-openvpn-8446dbf97c-rzw5l   1/1     Running   0          29m   10.42.1.26   kube-worker1   <none>           <none>
```

<br />
**3. Access to Transmission Web console**

Now Transmission and the Nginx Ingress routes are deployed, you should be able to access the Transmission Web console via [http://media.192.168.0.240.nip.io/transmission](http://media.192.168.0.240.nip.io/transmission).

![](https://i.imgur.com/qBAFOA1.png)


<br />
<br />

![](https://ipfs.infura.io/ipfs/QmNsoV9jUjVJVz4dw9RVFUy8N6Q6rsZAHvHXk6aooMnZAZ)

<br />
### Torrent Providers Aggregator- Jackett over VPN

[Jackett](https://github.com/Jackett/Jackett) is a Torrent Providers Aggregator which translates search queries from applications like Sonarr or Radarr into tracker-site-specific http queries, parses the html response, then sends results back to the requesting software. Because some Internet Providers might also block access to Torrent websites, I packaged a version of Jackett using a VPN connection (similar to _transmission-over-vpn_) accessible on [Docker hub - gjeanmart/jackettvpn:arm-latest](https://hub.docker.com/repository/docker/gjeanmart/jackettvpn).

<br />
**1. Write the Helm configuration**

Let's now configure the chart [bananaspliff/jackett](https://github.com/bananaspliff/geek-charts/tree/gh-pages/jackett). The default configuration can be seen by running the following command `$ helm show values bananaspliff/jackett`.

Create the file `media.jackett.values.yml` containing the following configuration.


```yaml
## media.jackett.values.yml
replicaCount: 1

image:
  repository: "gjeanmart/jackettvpn" # Special image to use Jackett over a VPN
  tag: "arm-latest"
  pullPolicy: IfNotPresent

env:
  - name: VPN_ENABLED
    value: "yes" # Enable Jackett over VPN
  - name: VPN_USERNAME
    valueFrom:
      secretKeyRef: # Reference to the secret | openvpn.username
        name: "openvpn"
        key: "username"
  - name: VPN_PASSWORD
    valueFrom:
      secretKeyRef: # Reference to the secret | openvpn.password
        name: "openvpn"
        key: "password"
  - name: LAN_NETWORK
    value: "192.168.0.0/24"
  - name: CREATE_TUN_DEVICE
    value: "true" # Needed for VPN
  - name: PUID
    value: "1000"
  - name: PGID
    value: "1000"

service:
  type: ClusterIP
  port: 80

volumes:
  - name: "media-ssd"
    persistentVolumeClaim:
      claimName: "media-ssd" # PersistentVolumeClaim created earlier
  - name: "dev-tun"  # Needed for VPN
    hostPath:
      path: "/dev/net/tun"

volumeMounts:
  - name: "media-ssd"
    mountPath: "/config"
    subPath: "configs/jackett" # Path /mnt/ssd/media/configs/jackett where jackett writes the configuration
  - name: "media-ssd"
    mountPath: "/downloads"
    subPath: "downloads/jackett" # Path /mnt/ssd/media/downloads/jackett ???

securityContext:
  capabilities: # Needed for VPN
    add:
      - NET_ADMIN
```

<br />
**2. Configure VPN (only if you configured VPN_ENABLED=yes)*

a. Create the following directory structure on your SSD

```shell
$ mkdir -p /mnt/ssd/media/configs/jackett/openvpn/
```

b. Copy one OpenVPN file (usually provided by your VPN provider) into the folder `/mnt/ssd/media/configs/jackett/openvpn/`

c. Create a file `credentials.conf` into the folder `/mnt/ssd/media/configs/jackett/openvpn/` composed of two line (first one: username and second one password)

```
<VPN_USERNAME>
<VPN_PASSWORD>
```

**3. Pre-configure Jackett**

a. Create the following directory structure on your SSD

```shell
$ mkdir -p /mnt/ssd/media/configs/jackett/Jackett/
```

b. Create the file `ServerConfig.json` into the folder `/mnt/ssd/media/configs/jackett/Jackett/` with the following content:

```json
{
  "BasePathOverride": "/jackett"
}
```

<br />
**4. Install the chart `bananaspliff/jackett`**

Execute the following command to install the chart `bananaspliff/jackett` with the above configuration onto the namespace `media`.

```
$ helm install jackett bananaspliff/jackett \
    --values media.jackett.values.yml \
    --namespace media
```

After a couple of minutes, you should observe a pod named `jackett-xxx` Running.

```
$ kubectl get pods -n media -l app=jackett -o wide

NAME                      READY   STATUS    RESTARTS   AGE    IP           NODE           NOMINATED NODE   READINESS GATES
jackett-864697466-69xwt   1/1     Running   0          101s   10.42.1.29   kube-worker1   <none>           <none>
```

<br />
**5. Access Jackett**

Go to Jackett on [http://media.192.168.0.240.nip.io/jackett](http://media.192.168.0.240.nip.io/jackett) and try to add one or more indexers.

![](https://i.imgur.com/IglUSIZ.png)


<br />
<br />

![](https://ipfs.infura.io/ipfs/QmXrpHKsVCnsFQpzhprH1TYdBbyZaxssjy8hv34XkybULz)

<br />
### TV Show Library Management - Sonarr

[Sonarr](https://sonarr.tv/) is a TV Show library management tool that offers multiple features:

- List all your episodes and see what's missing
- See upcoming episodes
- Automatically search last released episodes (via Jackett) and launch download (via Transmission)
- Move downloaded files into the right directory
- Notify when a new episodes is ready (Kodi, Plex)

<br />
**1. Write the Helm configuration**

Let's now configure the chart [bananaspliff/sonarr](https://github.com/bananaspliff/geek-charts/tree/gh-pages/sonarr). The default configuration can be seen by running the following command `$ helm show values bananaspliff/sonarr`.

Create the file `media.sonarr.values.yml` containing the following configuration.

```yaml
### media.sonarr.values.yml
replicaCount: 1

image:
  repository: linuxserver/sonarr
  tag: arm32v7-latest # ARM image
  pullPolicy: IfNotPresent

env:
  - name: PUID
    value: "1000"
  - name: PGID
    value: "1000"

service:
  type: ClusterIP
  port: 80

volumes:
  - name: media-ssd
    persistentVolumeClaim:
      claimName: "media-ssd" # PersistentVolumeClaim created earlier

volumeMounts:
  - name: media-ssd
    mountPath: "/config"
    subPath: "configs/sonarr" # Path /mnt/ssd/media/configs/sonarr where sonarr writes the configuration
  - name: media-ssd
    mountPath: "/downloads/transmission"
    subPath: "downloads/transmission" # Path /mnt/ssd/media/downloads/transmission where sonarr picks up downloaded episodes
  - name: media-ssd
    mountPath: "/tv"
    subPath: "library/tv" # Path /mnt/ssd/media/library/tv where sonarr moves and renames the episodes
```

<br />
**2. Pre-configure Sonarr**

a. Create the following directory structure on your SSD

```shell
$ mkdir -p /mnt/ssd/media/configs/sonarr/
```

b. Create the file `config.xml` into the folder `/mnt/ssd/media/configs/sonarr/` with the following content:

```xml
<Config>
  <UrlBase>/sonarr</UrlBase>
</Config>
```

<br />
**3. Install the chart `bananaspliff/sonarr`**

Execute the following command to install the chart `bananaspliff/sonarr` with the above configuration onto the namespace `media`.

```
$ helm install sonarr bananaspliff/sonarr \
    --values media.sonarr.values.yml \
    --namespace media
```

After a couple of minutes, you should observe a pod named `sonarr-xxx` Running.

```
$ kubectl get pods -n media -l app=sonarr -o wide

NAME                      READY   STATUS    RESTARTS   AGE     IP           NODE           NOMINATED NODE   READINESS GATES
sonarr-574c5f85d7-n9jc6   1/1     Running   0          3m13s   10.42.1.30   kube-worker1   <none>           <none>
```

<br />
**4. Access Sonarr**

Go to Sonarr on [http://media.192.168.0.240.nip.io/sonarr](http://media.192.168.0.240.nip.io/sonarr) and start setting up the library automation. Refer to the [wiki](https://github.com/Sonarr/Sonarr/wiki) for more details.

![](https://i.imgur.com/HMzjbcm.png)

- Configure the connection to Transmission into **Settings / Download Client / Add (Transmission)** using the hostname and port `transmission-transmission-openvpn.media:80`

![](https://i.imgur.com/cWN5WKY.png)

- Configure the connection to Jackett into **Settings / Indexers / Add (Torznab / Custom)** using the hostname and port `jackett.media:80`

![](https://i.imgur.com/TFvpjYa.png)

<br />
<br />

![](https://ipfs.infura.io/ipfs/QmXoFr3jf7GxTXtg5ezY1RKbUDjNiGXBhF2cbwwFYetNSk)

<br />
### Movie Library Management - Radarr

[Radarr](https://radarr.video/) is a Movie library management tool that offers multiple features:

- List all your movies
- Search movies (via Jackett) and launch download (via Transmission)
- Move downloaded files into the right directory
- Notify when a new movie is ready (Kodi, Plex)

<br />
**1. Write the Helm configuration**

Let's now configure the chart [bananaspliff/radarr](https://github.com/bananaspliff/geek-charts/tree/gh-pages/radarr). The default configuration can be seen by running the following command `$ helm show values bananaspliff/radarr`.

Create the file `media.radarr.values.yml` containing the following configuration.

```yaml
## media.radarr.values.yml
replicaCount: 1

image:
  repository: "linuxserver/radarr"
  tag: "arm32v7-latest" # ARM image
  pullPolicy: IfNotPresent

env:
  - name: PUID
    value: "1000"
  - name: PGID
    value: "1000"

service:
  type: ClusterIP
  port: 80

volumes:
  - name: "media-ssd"
    persistentVolumeClaim:
      claimName:  "media-ssd" # PersistentVolumeClaim created earlier

volumeMounts:
  - name: "media-ssd"
    mountPath: "/config"
    subPath: "configs/radarr" # Path /mnt/ssd/media/configs/radarr where radarr writes the configuration
  - name: "media-ssd"
    mountPath: "/downloads/transmission"
    subPath: "downloads/transmission" # Path /mnt/ssd/media/downloads/transmission where radarr picks up downloaded movies
  - name: media-ssd
    mountPath: "/movies"
    subPath: "library/movies" # Path /mnt/ssd/media/library/movies where radarr moves and renames the movies
```

<br />
**2. Pre-configure Radarr**

a. Create the following directory structure on your SSD

```shell
$ mkdir -p /mnt/ssd/media/configs/radarr/
```

b. Create the file `config.xml` into the folder `/mnt/ssd/media/configs/radarr/` with the following content:

```xml
<Config>
  <UrlBase>/radarr</UrlBase>
</Config>
```


<br />
**3. Install the chart `bananaspliff/radarr`**

Execute the following command to install the chart `bananaspliff/radarr` with the above configuration onto the namespace `media`.

```
$ helm install radarr bananaspliff/radarr \
    --values media.radarr.values.yml \
    --namespace media
```

After a couple of minutes, you should observe a pod named `radarr-xxx` Running.

```
$  kubectl get pods -n media -l app=radarr -o wide

NAME                      READY   STATUS    RESTARTS   AGE   IP          NODE           NOMINATED NODE   READINESS GATES
radarr-7846697889-jhqbz   1/1     Running   0          11m   10.42.2.2   kube-worker2   <none>           <none>
```

<br />
**4. Access Radarr**

Go to Radarr on [http://media.192.168.0.240.nip.io/radarr](http://media.192.168.0.240.nip.io/radarr) and start setting up the library automation. Refer to the [wiki](https://github.com/Radarr/Radarr/wiki) for more details.

![](https://i.imgur.com/gqCB8TX.png)

<br />
<br />

![](https://ipfs.infura.io/ipfs/QmbASTjZAenaVQ3FGg9oGRSjo1PZVG5JwjjKkdRSFPzaEu)

<br />
### Media Server - Plex

[Plex Media Server](https://www.plex.tv/en-gb/) is a software to serve and stream your personal Media library (movies, TV show and music). It fetches the Media resources and builds up a catalogue accessible to any compatible players (Desktop/Mobiles) and transcodes the stream to the player.

<br />

In this section, we are going to deploy Plex Media Server (PMS) on Kubernetes using the Helm chart [kube-plex](https://github.com/munnerz/kube-plex).

**1. Clone the charts**

This Helm chart is not available via an online repository like jetstack or bananaspliff. We need to download the chart locally. Clone the following repository using `git`.

```
$ git clone https://github.com/munnerz/kube-plex.git
```

<br />
**2. Get a claim token**

Obtain a Plex Claim Token by visiting [plex.tv/claim](https://plex.tv/claim). You need to create an account if you haven't already one yet.

This will be used to bind your new PMS instance to your own user account automatically.

![](https://i.imgur.com/VLScSRw.png)

<br />
**3. Create the Helm config file `media.plex.values.yml`**

```yaml
## media.plex.values.yml

claimToken: "<CLAIM_TOKEN>" # Replace `<CLAIM_TOKEN>` by the token obtained previously.

image:
  repository: linuxserver/plex
  tag: arm32v7-latest
  pullPolicy: IfNotPresent

kubePlex:
  enabled: false # kubePlex (transcoder job) is disabled because not available on ARM. The transcoding will be performed by the main Plex instance instead of a separate Job.

timezone: Europe/London

service:
  type: LoadBalancer # We will use a LoadBalancer to obtain a virtual IP that can be exposed to Plex Media via our router
  port: 32400 # Port to expose Plex

rbac:
  create: true

nodeSelector: {}

persistence:
  transcode:
    claimName: "media-ssd"
  data:
    claimName: "media-ssd"
  config:
    claimName: "media-ssd"

resources: {}
podAnnotations: {}
proxy:
  enable: false
```

<br />
**4. Install Plex using Helm**

Now install Plex with Helm specifying our config file `media.plex.values.yml` and the namespace `media`:

```
$ helm install plex kube-plex/charts/kube-plex/ \
  --values media.plex.values.yml \
  --namespace media
```

Wait until `kube-plex` (Plex Media Server) is up and running.

```
$ kubectl get pods -n media -l app=kube-plex -o wide

NAME                             READY   STATUS    RESTARTS   AGE   IP           NODE          NOMINATED NODE   READINESS GATES
plex-kube-plex-b76f8f478-4tn97   1/1     Running   0          55s   10.42.0.27   kube-master   <none>           <none>
```

You can find the Virtual IP attributed to Plex by MetalLB (in my case `192.168.0.241`).

```
$ kubectl get services -n media -l app=kube-plex -o wide

NAME             TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                                      AGE   SELECTOR
plex-kube-plex   LoadBalancer   10.43.77.73   192.168.0.241   32400:30048/TCP,80:32383/TCP,443:31274/TCP   16m   app=kube-plex,release=plex
```

<br />
**5. Router config (outside access only)**

If you want to access remotely to your Media library, you will need to configure a port-forwarding to allow Plex to access your PMS.

Add a route to port-forward incoming requests on port `32400` to `192.168.0.241:32400` (Plex virtual IP assigned by MetalLB).

![](https://i.imgur.com/A0rmhfH.png)

<br />
**6. Setup Plex**

Try now to access (from your network) to Plex Web Player on [http://192.168.0.241:32400](http://192.168.0.241:32400/). You should see the setup wizard :

- Click on _Got It_

![](https://i.imgur.com/eMqahAZ.png)

- Select _Next_

You can uncheck _Allow me to access my media outside my home_ if you only want to use Plex within your home network.

![](https://i.imgur.com/ActauD5.png)

- Configure the different Libraries (movies, tv shows, music, etc.)

Our Media will be accessible from the folder `/data/`.

![](https://i.imgur.com/lU9g43e.png)

- Click on _Done_

![](https://i.imgur.com/lvbswJK.png)

- All set! Plex will start scrapping your library (bear in mind, this can take a while)

![](https://i.imgur.com/5ABd3Rw.jpg)

- For outside access, you need to configure the external port used to map outside incoming requests to Plex. Go to _Settings / Remote Access_ and check _Manually specify the public_ to set the port `32400` (as configured in the router - Local)

![](https://i.imgur.com/64ntDcS.png)


<br />
**Notes**

- You can also access Plex from your local network via the ingress: [http://media.192.168.0.240.nip.io/web](http://media.192.168.0.240.nip.io/web)
- Download the Android/iOS app and connect to your Plex account, you should automatically see your Plex Media Server with our your Media.


<br />
<br />
### Conclusion

In conclusion, you now have everything you need to automate and manage your Media and enjoy watching shows, movies or just listen some music !

<br />
<br />



---

- **Kauri original title:** (5/8) Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett 
- **Kauri original link:** https://kauri.io/58-self-host-your-media-center-on-kubernetes-with-/8ec7c8c6bf4e4cc2a2ed563243998537/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-05-26
- **Kauri original tags:** self-hosting, kubernetes, tv-show, k8s, plex, bittorrent, htpc
- **Kauri original hash:** QmWcNJUeEMcNMrBb6CUqg6egT6tmsZWiaJSU3rPY3V5bL8
- **Kauri original checkpoint:** unknown



