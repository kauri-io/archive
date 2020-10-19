---
title: (7/8) Self-host your password manager with Bitwarden
summary: This article is part of the series Build your very own self-hosting platform with Raspberry Pi and Kubernetes Introduction Install Raspbian Operating-System and
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-04-01
some_url: 
---

# (7/8) Self-host your password manager with Bitwarden

![](https://ipfs.infura.io/ipfs/QmfTTYuhANiy3D9u9TbWPu1GgK3hSokKQH27XmnF5egmgH)




#### This article is part of the series [Build your very own self-hosting platform with Raspberry Pi and Kubernetes](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes/5e1c3fdc1add0d0001dff534/c)

1. [Introduction](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes-introduction/1229f21044ef4bff8df35875d6803776/a)
2. [Install Raspbian Operating-System and prepare the system for Kubernetes](https://kauri.io/install-raspbian-operating-system-and-prepare-the-system-for-kubernetes/7df2a9f9cf5f4f6eb217aa7223c01594/a)
3. [Install and configure a Kubernetes cluster with k3s to self-host applications](https://kauri.io/install-and-configure-a-kubernetes-cluster-with-k3s-to-self-host-applications/418b3bc1e0544fbc955a4bbba6fff8a9/a)
4. [Deploy NextCloud on Kuberbetes: The self-hosted Dropbox](https://kauri.io/deploy-nextcloud-on-kuberbetes:-the-self-hosted-dropbox/f958350b22794419b09fc34c7284b02e/a)
5. [Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett](https://kauri.io/self-host-your-media-center-on-kubernetes-with-plex-sonarr-radarr-transmission-and-jackett/8ec7c8c6bf4e4cc2a2ed563243998537/a)
6. [Self-host Pi-Hole on Kubernetes and block ads and trackers at the network level](https://kauri.io/-selfhost-pihole-on-kubernetes-and-block-ads-and/5268e3daace249aba7db0597b47591ef/a)
7. **Self-host your password manager with Bitwarden**
8. [Deploy Prometheus and Grafana to monitor a Kubernetes cluster](https://kauri.io/deploy-prometheus-and-grafana-to-monitor-a-kube/186a71b189864b9ebc4ef7c8a9f0a6b5/a)




### Introduction

[Bitwarden](https://bitwarden.com/) is a free, open-source and audited Password Manager, it provides a large range of clients (desktop, web, browser extension and mobiles) to access your password easily and safely from anywhere. While Bitwarden offers a SaaS solutions (they host your passwords in an encrypted way), because Bitwarden is open-source, you can decide to host yourself your password and this is what we are going to learn in this tutorial.


![](https://ipfs.infura.io/ipfs/QmcPDteMCafr51JeoHPG3RVk8f1nD5tEvYhDr6VHM9DmFx)

For information, we will deploy [Bitwarden-rs](https://github.com/dani-garcia/bitwarden_rs), Unofficial Bitwarden compatible server written in Rust, ideal for self-hosting.

> This is a Bitwarden server API implementation written in Rust compatible with upstream Bitwarden clients*, perfect for self-hosted deployment where running the official resource-heavy service might not be ideal. This project is not associated with the Bitwarden project nor 8bit Solutions LLC.




### Prerequisite

In order to run entirely the tutorial, we will need:

- A running Kubernetes cluster (see previous articles if you haven't set this up yet)
- A domain name in order to access our Bitwarden instance from outside our network. (replace `<domain.com>` by your domain)
- Have a external static IP (usually the case by default)
- Access to your router admin console to port-forward an incoming request to our Kubernetes Ingress service.


 

### Namespace

We are going to isolate all the Kubernetes objects related to Bitwarden in the namespace `bitwarden`.

To create a namespace, run the following command:

```
$ kubectl create namespace bitwarden
```




### Persistence

The first step consists in setting up a volume to store Bitwarden config files and data. If you followed the previous articles to install and configure a self-hosting platform using RaspberryPi and Kubernetes, you remember we have on each worker a NFS client pointing to a SSD on `/mnt/ssd`.

**1. Deploy the Persistent Volume (PV)**

The Persistent Volume specify the name, the size, the location and the access modes of the volume:

- The name of the PV is  `bitwarden-ssd`
- The size allocated is 500MB
- The location is `/mnt/ssd/bitwarden`
- The access is ReadWriteOnce

Create the following file and apply it to the k8 cluster.

```yaml
## bitwarden.persistentvolume.yml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: bitwarden-ssd
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 500Mi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/ssd/bitwarden"
---
```

```
$ kubectl apply -f bitwarden.persistentvolume.yml
persistentvolume/bitwarden created
```

You can verify the PV exists with the following command:

```
$ kubectl get pv

NAME            CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM                     STORAGECLASS   REASON   AGE
bitwarden-ssd   500Mi      RWO            Retain           Available                             manual                  7s
```


**2. Create the Persistent Volume Claim (PVC)**

The Persistent Volume Claim is used to map a Persistent Volume to a deployment or stateful set. Unlike the PV, the PVC belongs to a namespace.

Create the following file and apply it to the k8 cluster.

```yaml
## bitwarden.persistentvolumeclaim.yml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: bitwarden
  name: bitwarden-ssd
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
---
```

```
$ kubectl apply -f bitwarden.persistentvolumeclaim.yml
persistentvolumeclaim/bitwarden created
```

You can verify the PVC exists with the following command:

```
$ kubectl get pvc -n bitwarden

NAME            STATUS   VOLUME          CAPACITY   ACCESS MODES   STORAGECLASS   AGE
bitwarden-ssd   Bound    bitwarden-ssd   500Mi      RWO            manual         8s
```




### Outside access


The next part consist to enable the connections to Bitwarden from outside so you can access your passwords from anywhere.

**1. Port Forwarding**

First you need to go to your router setup and add a port-forwarding rule to map any incoming requests on port 80 or port 443 to be forwarded to `192.168.0.240` (the LoadBalancer IP of the Nginx).

![](https://i.imgur.com/iqpI0H3.png)

_VirginHub - Port-Forwarding_


**2. Map the subdomain `bitwarden.<domain.com>` to your home router**

First you need to find out what's your router external IP, run this command or go to [whatismyip.com](https://www.whatismyip.com).

```
$ curl ipecho.net/plain
x.x.x.x
```

Then, we need to configure our subdomain to make sure `bitwarden.<domain.com>` resolves to our external static IP. Go to your domain provider console / DNS management add a record:

- **Type:** A
- **Name:** bitwarden (subdomain)
- **Value:** x.x.x.x (external static IP)

![](https://i.imgur.com/Gt4ZG3i.png)

_GoDaddy_




### Deployment


**1. Clone the repo `bitwarden-k8s`**

Clone the repository [`bitwarden-k8s`](https://github.com/cdwv/bitwarden-k8s) with the following command (change `~/workspace/bitwarden-k8s` by the target folder of your choice):

```
$ git clone https://github.com/gjeanmart/bitwarden-k8s.git ~/workspace/bitwarden-k8s
```


**2. Download the Chart values of the chart locally**

Run the following command to download the Chart values into the local file `pihole.values.yml`.

```
$ helm show values ~/workspace/bitwarden-k8s >> bitwarden.values.yml
```

If you open the file, you will see the default configuration values to setup Bitwarden. Instead of using the flag `--set property=value` like before, we will use the file `bitwarden.values.yml` to make all the changes.


**3. Update the values**

We now need to update a few properties before installing the Helm chart. Open the file `bitwarden.values.yml` and change the following properties.



First we need to change to an ARM compatible image

```yaml
## bitwarden.values.yml

image:
  repository: bitwardenrs/server # Change here
  tag: raspberry  # Change here
  pullPolicy: IfNotPresent

```


Then we configure the environment variables.

Replace `[ADMIN_TOKEN]` by the result of the command `$ openssl rand -base64 48`. This token will be used to connect to the Bitwarden administration interface.

```yaml
## bitwarden.values.yml

env:
  SIGNUPS_ALLOWED: false  # Disable Sign Up form (invitation only)
  INVITATIONS_ALLOWED: true # Enable invitation
  ADMIN_TOKEN: "[ADMIN_TOKEN]" # Copy/Paste the result of the command `$ openssl rand -base64 48` (admin interface password)
  DOMAIN: "https://bitwarden.<domain.com>" # Domain used to access Bitwarden
  SMTP_HOST: "smtp.gmail.com" # SMTP host (invitation)
  SMTP_FROM: "no-reply@<domain.com>" # From email (invitation)
  SMTP_PORT: 587 # SMTP Port (invitation)
  SMTP_SSL: true # SMTP SSL (invitation)
  SMTP_USERNAME: "[SMTP_USERNAME]"  # SMTP username (invitation)
  SMTP_PASSWORD: "[SMTP_PASSWORD]"  # SMTP password (invitation)
```




In the next step, we configure an ingress to access Bitwarden and issue a certificate (especially if we want to access from outside).

Replace `<domain.com>` by your domain (same as the section "Internet access")

```yaml
## bitwarden.values.yml

ingress:
  enabled: true # Generate an Ingress while deploying
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod" # Cluster Issuer configured with certmanager
  path: /
  hosts:
    - bitwarden.<domain.com> # Domain for Bitwarden
  tls:
    - secretName: bitwarden-domain-com-tls 
      hosts:
        - bitwarden.<domain.com> # Domain for Bitwarden
```




Finally, we want to plug Bitwarden to the persistent volume created at the beginning of the article pointing to `/mnt/ssd/bitwarden`.

```yaml
## bitwarden.values.yml

### Persist data to a persistent volume
persistence:
  enabled: true # Change here
  existingClaim: "bitwarden-ssd" # Change here
```


**4. Install the Chart**

In the part, we will install the Helm chart under the namespace `bitwarden` with `bitwarden.values.yml` as configuration file.

```
$ helm install bitwarden ~/workspace/bitwarden-k8s \
  --namespace bitwarden \
  --values bitwarden.values.yml
```

After a couple of minutes, check if the pod and service is up and running:

```
$ kubectl get pods -n bitwarden -o wide

NAME                                      READY   STATUS    RESTARTS   AGE     IP            NODE          NOMINATED NODE   READINESS GATES
bitwarden-bitwarden-k8s-58db5c445-7w7wq   1/1     Running   0          4m53s   10.42.0.105   kube-master   <none>           <none>
```




### Configuration

Once Bitwarden is up and running, we can start configuring our first user.

**1. Access the admin interface**

First, access the admin interface which should be available on [https://bitwarden.`<domain.com>`/admin](https://bitwarden.<domain.com>/admin) and enter the `<ADMIN_PASSWORD>` generated previously.

![](https://i.imgur.com/z3H44cl.png)


**2. Invite your first user**

Once connected, you can check and modify the different parameters of Bitwarden and invite a new user. Enter an email address to invite a new user. 

![](https://i.imgur.com/5qNyqQJ.png)

After a few seconds, You should received the invitation via email. Click on "Join the Organisation".

![](https://i.imgur.com/PhbwuHd.png)



**3. Create an account and login for the first time**

Click on "Create Account".

![](https://i.imgur.com/JWZzvat.png)

Configure the details of the user: name, master password (encryption key) and click on "Submit".

![](https://i.imgur.com/vdbPl3m.png)

Finally, log into with the newly created user using the couple email, master password.

![](https://i.imgur.com/1RgykqR.png)




### Conclusion

You now have a fully self-hosted password manager accessible via your own domain from anywhere.

![](https://i.imgur.com/eS8iMKu.png)

You can also install and configure your custom server to easily and safely access your password:

- [Bitwarden Mobile App](https://play.google.com/store/apps/details?id=com.x8bit.bitwarden&hl=en_US) (available on iOS and GooglePlay)
- [Bitwarden Web Browser extension](https://chrome.google.com/webstore/detail/bitwarden-free-password-m/nngceckbapebfimnlniiiahkandclblb?hl=en) (available on Chrome and Firefox)






---

- **Kauri original title:** (7/8) Self-host your password manager with Bitwarden
- **Kauri original link:** https://kauri.io/78-self-host-your-password-manager-with-bitwarden/b2187730d4294626b28d1d938057e2e0/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-04-01
- **Kauri original tags:** self-hosting, kubernetes, password-manager, bitwarden
- **Kauri original hash:** QmdEAA7UJgWkx9FgUiRXnEJuE46chrd7S9R4j9w78gL6ka
- **Kauri original checkpoint:** unknown



