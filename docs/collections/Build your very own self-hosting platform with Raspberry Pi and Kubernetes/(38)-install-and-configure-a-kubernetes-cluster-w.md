---
title: (3/8) Install and configure a Kubernetes cluster with k3s to self-host applications
summary: This article is part of the series Build your very own self-hosting platform with Raspberry Pi and Kubernetes Introduction Install Raspbian Operating-System and
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-07-29
some_url: 
---

# (3/8) Install and configure a Kubernetes cluster with k3s to self-host applications


<br />

#### This article is part of the series [Build your very own self-hosting platform with Raspberry Pi and Kubernetes](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes/5e1c3fdc1add0d0001dff534/c)

1. [Introduction](https://kauri.io/build-your-very-own-self-hosting-platform-with-raspberry-pi-and-kubernetes-introduction/1229f21044ef4bff8df35875d6803776/a)
2. [Install Raspbian Operating-System and prepare the system for Kubernetes](https://kauri.io/install-raspbian-operating-system-and-prepare-the-system-for-kubernetes/7df2a9f9cf5f4f6eb217aa7223c01594/a)
3. **Install and configure a Kubernetes cluster with k3s to self-host applications**
4. [Deploy NextCloud on Kuberbetes: The self-hosted Dropbox](https://kauri.io/deploy-nextcloud-on-kuberbetes:-the-self-hosted-dropbox/f958350b22794419b09fc34c7284b02e/a)
5. [Self-host your Media Center On Kubernetes with Plex, Sonarr, Radarr, Transmission and Jackett](https://kauri.io/self-host-your-media-center-on-kubernetes-with-plex-sonarr-radarr-transmission-and-jackett/8ec7c8c6bf4e4cc2a2ed563243998537/a)
6. [Self-host Pi-Hole on Kubernetes and block ads and trackers at the network level](https://kauri.io/-selfhost-pihole-on-kubernetes-and-block-ads-and/5268e3daace249aba7db0597b47591ef/a)
7. [Self-host your password manager with Bitwarden](https://kauri.io/selfhost-your-password-manager-with-bitwarden/b2187730d4294626b28d1d938057e2e0/a)
8. [Deploy Prometheus and Grafana to monitor a Kubernetes cluster](https://kauri.io/deploy-prometheus-and-grafana-to-monitor-a-kube/186a71b189864b9ebc4ef7c8a9f0a6b5/a)

<br />
<br />
### Introduction

In the previous article, we freshly prepared three machines (one master and two workers). In this article, we are going to learn how to install Kubernetes using [k3s](https://k3s.io), a lightweight version of Kubernetes, suitable for ARM-based computers such as Raspberry Pi. If you need any support with k3s, I recommend checking the [official documentation](https://rancher.com/docs/k3s/latest/en/) as well as the [GitHub repository](https://github.com/rancher/k3s).

Once the cluster is up and each node connected to each other, we will install some useful services such as:

- **[Helm](https://helm.sh/):** Package manager for Kubernetes
- **[MetalLB](https://metallb.universe.tf/):** Load-balancer implementation for bare metal Kubernetes clusters
- **[Nginx](https://github.com/kubernetes/ingress-nginx):** Kubernetes Ingress Proxy
- **[Cert Manager](https://cert-manager.io):** Native Kubernetes certificate management controller.
- **[Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/):** A web-based Kubernetes user interface


<br />
<br />
### Install k3s server (master node)

In the first part of this article, we will install the Kubernetes master node which represents the orchestrator of the cluster.

**1. Connect via ssh to the master node**

```
$ ssh pi@192.168.0.22
```

<br />
**2. Configure the following environment variables**

The first line specifies in which mode we would like to write the k3s configuration (required when not running commands as `root`) and the second line actually says k3s not to deploy its default load balancer named _servicelb_ and proxy _traefik_, instead we will install manually [_metalb_](https://metallb.universe.tf/) as load balancer and [_nginx_](https://www.nginx.com/) as proxy which are in my opinion better and more widely used.

```
$ export K3S_KUBECONFIG_MODE="644"
$ export INSTALL_K3S_EXEC=" --no-deploy servicelb --no-deploy traefik"
```

<br />
**3. Run the installer**

The next command simply downloads and executes the k3s installer. The installation will take into account the environment variables set just before.

```
$ curl -sfL https://get.k3s.io | sh -

[INFO]  Finding latest release
[INFO]  Using v1.17.0+k3s.1 as release
[INFO]  Downloading hash https://github.com/rancher/k3s/releases/download/v1.17.0+k3s.1/sha256sum-arm.txt
[INFO]  Downloading binary https://github.com/rancher/k3s/releases/download/v1.17.0+k3s.1/k3s-armhf
[INFO]  Verifying binary download
[INFO]  Installing k3s to /usr/local/bin/k3s
[INFO]  Creating /usr/local/bin/kubectl symlink to k3s
[INFO]  Creating /usr/local/bin/crictl symlink to k3s
[INFO]  Creating /usr/local/bin/ctr symlink to k3s
[INFO]  Creating killall script /usr/local/bin/k3s-killall.sh
[INFO]  Creating uninstall script /usr/local/bin/k3s-uninstall.sh
[INFO]  env: Creating environment file /etc/systemd/system/k3s.service.env
[INFO]  systemd: Creating service file /etc/systemd/system/k3s.service
[INFO]  systemd: Enabling k3s unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s.service → /etc/systemd/system/k3s.service.
[INFO]  systemd: Starting k3s
```

<br />
**4. Verify the status**

The installer creates a systemd service which can be used for `stop`, `start`, `restart` and verify the `status` of the k3s server running Kubernetes.

```
$ sudo systemctl status k3s

● k3s.service - Lightweight Kubernetes
   Loaded: loaded (/etc/systemd/system/k3s.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-01-10 19:26:41 GMT; 9s ago
     Docs: https://k3s.io
  Process: 900 ExecStartPre=/sbin/modprobe br_netfilter (code=exited, status=0/SUCCESS)
  Process: 902 ExecStartPre=/sbin/modprobe overlay (code=exited, status=0/SUCCESS)
 Main PID: 904 (k3s-server)
    Tasks: 14
   Memory: 395.0M
(...)
```

k3s also installed the [Kubernetes Command Line Tools](https://kubernetes.io/docs/reference/kubectl/overview/) `kubectl`, so it is possible to start querying the cluster (composed at this stage, of only one node - the master, and a few internal services used by Kubernetes).

- To get the details of the nodes

```
$ kubectl get nodes -o wide

NAME          STATUS   ROLES    AGE   VERSION         INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION   CONTAINER-RUNTIME
kube-master   Ready    master   29m   v1.17.0+k3s.1   192.168.0.22   <none>        Raspbian GNU/Linux 10 (buster)   4.19.75-v7l+     containerd://1.3.0-k3s.5
```

- To get the details of all the services deployed

```
$ kubectl get pods -A -o wide

NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE   IP          NODE          NOMINATED NODE   READINESS GATES
kube-system   metrics-server-6d684c7b5-w2qdj            1/1     Running   0          30m   10.42.0.3   kube-master   <none>           <none>
kube-system   local-path-provisioner-58fb86bdfd-jmdjh   1/1     Running   0          30m   10.42.0.4   kube-master   <none>           <none>
kube-system   coredns-d798c9dd-vh56g                    1/1     Running   0          30m   10.42.0.2   kube-master   <none>           <none>
```

<br />
**5. Save the access token**

Each agent will require an access token to connect to the server, the token can be retrieved with the following commands:

```
$ sudo cat /var/lib/rancher/k3s/server/node-token

K106edce2ad174510a840ff7e49680fc556f8830173773a1ec1a5dc779a83d4e35b::server:5a9b70a1f5bc02a7cf775f97fa912345
```

<br />
<br />
### Install k3s agent (worker nodes)

In the second part, we are now installing the k3s agent to connect on each worker to the k3s server (master).


**1. Connect via ssh to the worker node**

```
$ ssh pi@192.168.0.23
```

<br />
**2. Configure the following environment variables**

The first line specifies in which mode we would like to write the k3s configuration (required when not running command as `root`) and the second line provide the k3s server endpoint the agent needs to connect to. Finally, the third line is an access token to the k3s server saved previously.

```
$ export K3S_KUBECONFIG_MODE="644"
$ export K3S_URL="https://192.168.0.22:6443"
$ export K3S_TOKEN="K106edce2ad174510a840ff7e49680fc556f8830173773a1ec1a5dc779a83d4e35b::server:5a9b70a1f5bc02a7cf775f97fa912345"
```

<br />
**3. Run the installer**

The next command simply downloads and executes the k3s installer. The installation will take into account the environment variables set just before and install the agent.

```
$ curl -sfL https://get.k3s.io | sh -

[INFO]  Finding latest release
[INFO]  Using v1.17.0+k3s.1 as release
[INFO]  Downloading hash https://github.com/rancher/k3s/releases/download/v1.17.0+k3s.1/sha256sum-arm64.txt
[INFO]  Downloading binary https://github.com/rancher/k3s/releases/download/v1.17.0+k3s.1/k3s-arm64
[INFO]  Verifying binary download
[INFO]  Installing k3s to /usr/local/bin/k3s
[INFO]  Creating /usr/local/bin/kubectl symlink to k3s
[INFO]  Creating /usr/local/bin/crictl symlink to k3s
[INFO]  Creating /usr/local/bin/ctr symlink to k3s
[INFO]  Creating killall script /usr/local/bin/k3s-killall.sh
[INFO]  Creating uninstall script /usr/local/bin/k3s-agent-uninstall.sh
[INFO]  env: Creating environment file /etc/systemd/system/k3s-agent.service.env
[INFO]  systemd: Creating service file /etc/systemd/system/k3s-agent.service
[INFO]  systemd: Enabling k3s-agent unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s-agent.service → /etc/systemd/system/k3s-agent.service.
[INFO]  systemd: Starting k3s-agent
```

<br />
**4. Verify the status**

The installer creates a systemd service which can be used for `stop`, `start`, `restart` and verify the `status` of the k3s agent running Kubernetes.

```
$ sudo systemctl status k3s-agent

● k3s-agent.service - Lightweight Kubernetes
   Loaded: loaded (/etc/systemd/system/k3s-agent.service; enabled; vendor preset: enabled)
   Active: active (running) since Sun 2020-01-12 16:03:07 UTC; 9s ago
     Docs: https://k3s.io
  Process: 4970 ExecStartPre=/sbin/modprobe br_netfilter (code=exited, status=0/SUCCESS)
  Process: 4973 ExecStartPre=/sbin/modprobe overlay (code=exited, status=0/SUCCESS)
 Main PID: 4974 (k3s-agent)
    Tasks: 16
   Memory: 205.1M
(...)
```

k3s also installed the [Kubernetes Command Line Tools](https://kubernetes.io/docs/reference/kubectl/overview/) `kubectl`, so it is possible to start querying the cluster and observe the all nodes are reconciliated.

```
$ kubectl get nodes -o wide

NAME           STATUS   ROLES    AGE     VERSION         INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION     CONTAINER-RUNTIME
kube-master    Ready    master   44h     v1.17.0+k3s.1   192.168.0.22   <none>        Raspbian GNU/Linux 10 (buster)   4.19.75-v7l+       containerd://1.3.0-k3s.5
kube-worker1   Ready    <none>   2m47s   v1.17.0+k3s.1   192.168.0.23   <none>        Debian GNU/Linux 10 (buster)     5.4.6-rockchip64   containerd://1.3.0-k3s.5
kube-worker2   Ready    <none>   2m9s    v1.17.0+k3s.1   192.168.0.24   <none>        Raspbian GNU/Linux 10 (buster)   4.19.75-v7+        containerd://1.3.0-k3s.5
```


<br />
<br />
### Connect remotely to the cluster

If you don't want to connect via SSH to a node every time you need to query your cluster, it is possible to install `kubectl` (k8s command line tool) on your local machine and control remotely your cluster.

**1. Install kubectl on your local machine**

Read the [following page](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to know how to install `kubectl` on Linux, MacOS or Windows.

<br />
**2. Copy the k3s config file from the master node to your local machine**

The command `scp` allows to transfer file via SSH from/to a remote machine. We simply need to download the file `/etc/rancher/k3s/k3s.yaml` located on the master node to our local machine into `~/.kube/config`.

```
$ scp pi@192.168.0.22:/etc/rancher/k3s/k3s.yaml ~/.kube/config
```

The file contains a localhost endpoint `127.0.0.1`, we just need to replace this by the IP address of the master node instead (in my case `192.168.0.22`).

```
$ sed -i '' 's/127\.0\.0\.1/192\.168\.0\.22/g' ~/.kube/config
```

<br />
**3. Try using `kubectl` from your local machine**

```
$ kubectl get nodes -o wide

NAME           STATUS   ROLES    AGE   VERSION         INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION     CONTAINER-RUNTIME
kube-worker1   Ready    <none>   18m   v1.17.0+k3s.1   192.168.0.23   <none>        Debian GNU/Linux 10 (buster)     5.4.6-rockchip64   containerd://1.3.0-k3s.5
kube-worker2   Ready    <none>   17m   v1.17.0+k3s.1   192.168.0.24   <none>        Raspbian GNU/Linux 10 (buster)   4.19.75-v7+        containerd://1.3.0-k3s.5
kube-master    Ready    master   44h   v1.17.0+k3s.1   192.168.0.22   <none>        Raspbian GNU/Linux 10 (buster)   4.19.75-v7l+       containerd://1.3.0-k3s.5
```



<br />
<br />
### Install Helm (version >= 3.x.y) - Kubernetes Package Manager

[Helm](https://helm.sh/) is a package manager for Kubernetes. An application deployed on Kubernetes is usually composed of multiple config files (deployment, service, secret, ingress, etc.) which can be more or less complex and are generally the same for common applications.

Helm provides a solution to define, install, upgrade k8s applications based on config templates (called _charts_). A simple unique config file (names Values.yml) is used to generate all the necessary k8s config files and deploy them. The repository [hub.helm.sh](https://hub.helm.sh/) contains all the "official" charts available but you can easily find unofficial charts online.

**1. Install Helm command line tools on your local machine**

Refer to the [following page](https://helm.sh/docs/intro/install) to install `helm` on your local machine. **You must install Helm version >= 3.x.y**

Example for Linux:

- Download the package on [GitHub](https://github.com/helm/helm/releases)
- Run `$ tar -zxvf helm-v3.<X>.<Y>-linux-amd64.tar.gz` (replace `3.<Y>.<Y>` by the latest version)
- Execute `$ mv linux-amd64/helm /usr/local/bin/helm`

<br />
**2. Check the version**

Verify that you have Helm version 3.x installed.

```
$ helm version
version.BuildInfo{Version:"v3.0.2", GitCommit:"19e47ee3283ae98139d98460de796c1be1e3975f", GitTreeState:"clean", GoVersion:"go1.13.5"}
```

<br />
**3. Add the repository for official charts**

Configure the repository `stable https://kubernetes-charts.storage.googleapis.com` to access the [official charts](https://github.com/helm/charts/tree/master/stable)

```
$ helm repo add stable https://kubernetes-charts.storage.googleapis.com
"stable" has been added to your repositories

$ helm repo update
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈ Happy Helming!⎈
```

<br />

We can now install application using Helm using `helm install <deployment_name> <chart_name> --namespace <namespace> --set <property_value_to_change>`, uninstall application running `helm uninstall <deployment_name> --namespace <namespace>` and list the applications with `helm list --namespace <namespace>`

I also recommend checking this page to learn more [how to use Helm cli](https://helm.sh/docs/intro/using_helm/).


<br />
<br />
### Install MetalLB - Kubernetes Load Balancer

[MetalLB](https://metallb.universe.tf) is a load-balancer implementation for bare metal Kubernetes clusters. When configuring a [Kubernetes service](https://kubernetes.io/docs/concepts/services-networking/service/) of type _LoadBalancer_, MetalLB will dedicate a virtual IP from an address-pool to be used as load balancer for an application.

To install MetalLB from Helm, you simply need to run the following command `helm install ...` with:

- `metallb`: the name to give to the deployment
- `stable/metallb`: the name of the [chart](https://github.com/helm/charts/tree/master/stable/metallb)
- `--namespace kube-system`: the namespace in which we want to deploy MetalLB.
- `--set configInline...`: to configures MetalLB in **Layer 2** mode (see [documentation](https://metallb.universe.tf/configuration/) for more details). The IPs range `192.168.0.240-192.168.0.250` is used to constitute a pool of virtual IP addresses.

```
helm install metallb stable/metallb --namespace kube-system \
  --set configInline.address-pools[0].name=default \
  --set configInline.address-pools[0].protocol=layer2 \
  --set configInline.address-pools[0].addresses[0]=192.168.0.240-192.168.0.250
```

After a few seconds, you should observe the MetalLB components deployed under `kube-system` namespace.

```
$ kubectl get pods -n kube-system -l app=metallb -o wide

NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE     IP             NODE           NOMINATED NODE   READINESS GATES
kube-system   metallb-speaker-s7cvp                     1/1     Running   0          2m47s   192.168.0.22   kube-master    <none>           <none>
kube-system   metallb-speaker-jx64v                     1/1     Running   0          2m47s   192.168.0.23   kube-worker1   <none>           <none>
kube-system   metallb-controller-6fb88ff94b-4g256       1/1     Running   0          2m47s   10.42.1.7      kube-worker1   <none>           <none>
kube-system   metallb-speaker-k5kbh                     1/1     Running   0          2m47s   192.168.0.24   kube-worker2   <none>           <none>
```

All done. No every time a new Kubenertes service of type _LoadBalancer_ is deployed, MetalLB will assign an IP from the pool to access the application.



<br />
<br />
### Install Nginx - Web Proxy

[Nginx](https://www.nginx.com/) is a recognized high-performance web server / reverse proxy. It can be used as [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) to expose HTTP and HTTPS routes from outside the cluster to services within the cluster.

Similarly to MetalLB, we will use the following [stable/nginx-ingress Helm chart](https://github.com/helm/charts/tree/master/stable/nginx-ingress) to install our proxy server.

The only config change done here is disabling `defaultBackend` which isn't required.

```
$ helm install nginx-ingress stable/nginx-ingress --namespace kube-system \
    --set defaultBackend.enabled=false
```


After a few seconds, you should observe the Nginx component deployed under `kube-system` namespace.

```
$ kubectl get pods -n kube-system -l app=nginx-ingress -o wide

NAME                                             READY   STATUS    RESTARTS   AGE     IP          NODE           NOMINATED NODE   READINESS GATES
nginx-ingress-controller-996c5bf9-k4j64   1/1     Running   0          76s   10.42.1.13   kube-worker1   <none>           <none>
```

Interestingly, Nginx service is deployed in LoadBalancer mode, you can observe MetalLB allocates a virtual IP (column ` EXTERNAL-IP`) to Nginx with the command here:

```
$ kubectl get services  -n kube-system -l app=nginx-ingress -o wide

NAME                            TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE   SELECTOR
nginx-ingress-controller   LoadBalancer   10.43.253.188   192.168.0.240   80:30423/TCP,443:32242/TCP   92s   app=nginx-ingress,component=controller,release=nginx-ingress
```

From you local machine, you can try to externally access Nginx via the LoadBalancer IP (in my case `http://192.168.0.240`) and it should return the following message "404 not found" because nothing is deployed yet.

![](https://i.imgur.com/DQI2Nwr.png)


<br />
<br />
### Install cert-manager

[Cert Manager](https://cert-manager.io) is a set of Kubernetes tools used to automatically deliver and manage x509 certificates against the ingress (Nginx in our case) and consequently secure via SSL all the HTTP routes with almost no configuration.

**1. Install the CustomResourceDefinition**

Install the CustomResourceDefinition resources.

```
$ kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.16.0/cert-manager.crds.yaml
```

<br />
**2. Configure the jetstack Helm repository**

cert-manager Helm charts aren't hosted by the offical Helm hub, you need to configure a new repository named JetStack which maintains those charts ([here](https://github.com/jetstack/cert-manager/tree/master/deploy/charts/cert-manager)).

```
$ helm repo add jetstack https://charts.jetstack.io && helm repo update
```

<br />
**3. Install cert-manager through Helm**

Run the following command to install the cert-manager components under the `kube-system` namespace.

```
$ helm install cert-manager jetstack/cert-manager --namespace kube-system  --version v0.16.0
```

Check that all three cert-manager components are running.

```
$ kubectl get pods -n kube-system -l app.kubernetes.io/instance=cert-manager -o wide 

NAME                                       READY   STATUS    RESTARTS   AGE   IP           NODE           NOMINATED NODE   READINESS GATES
cert-manager-cainjector-6659d6844d-w9vrn   1/1     Running   0          69s   10.42.1.13   kube-worker1   <none>           <none>
cert-manager-859957bd4c-2nzqp              1/1     Running   0          69s   10.42.0.16   kube-master    <none>           <none>
cert-manager-webhook-547567b88f-zfm9x      1/1     Running   0          68s   10.42.0.17   kube-master    <none>           <none>
```

<br />
**4. Configure the certificate issuers**

We now going to configure two certificate issuers from which signed x509 certificates can be obtained, such as [Let’s Encrypt](https://letsencrypt.org):

- _letsencrypt-staging_: will be used for testing purpose only
- _letsencrypt-prod_: will be used for production purpose.

Run the following commands (change `<EMAIL>` by your email).

```
$ cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    email: <EMAIL>
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

```
$ cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: <EMAIL>
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

Once done, we should be able to automatically issue a Let's Encrypt's certificate every time we configure an ingress with ssl.

<br />
**5. Example: Configuration of a ingress with SSL**

The following k8s config file allows to access the service `service_name` (port `80`) from outside the cluster with issuance of a certificate to the domain `domain`.

```yaml
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-staging"
spec:
  tls:
  - hosts:
    - <domain>
    secretName: "<domain>-staging-tls"
  rules:
  - host: <domain>
    http:
      paths:
        - path: /
          backend:
            serviceName: <service_name>
            servicePort: 80
---
```             

<br />
<br />
### Manage storage

Most of the application require a persistence storage to store data and allow running containers to access this storage space from any nodes of the cluster. In the previous chapter, we set up a Persistent Volume to access the SSD connected to the master node via NFS.

**1. Deploy the Persistent Volume**

In order to expose a NFS share to our applications deployed on Kubernetes, we will need first to define a Persistent Volume. Apply the following config:

```yaml
## example.nfs.persistentvolume.yml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-ssd-volume
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/ssd/example"
---
```

```
$ kubectl apply -f example.nfs.persistentvolume.yml
```

<br />
**2. Deploy the Persistent Volume Claim**

Now, we need to configure a Persistent Volume Claim which maps a Peristent Volume to a Deployment or Statefulset. Apply the

```yaml
## example.nfs.persistentvolumeclaim.yml
---
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: example-ssd-volume
  spec:
    storageClassName: manual
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
---
```

```
$ kubectl apply -f example.nfs.persistentvolumeclaim.yml
```


<br />
**3. Checkout the result**

You should be able to query the cluster to find our Persistent Volume and Persistent Volume Claim.

```
$ kubectl get pv

NAME                 CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
example-ssd-volume   1Gi        RWO            Retain           Available           manual                  3s

$ kubectl get pvc -A

NAMESPACE   NAME                 STATUS   VOLUME               CAPACITY   ACCESS MODES   STORAGECLASS   AGE
default     example-ssd-volume   Bound    example-ssd-volume   1Gi        RWO            manual         6s
```

This method will be used to declare persistent storage volume for each of our application. You can learn more about Persistent Volume [here](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).


<br />
<br />
### Install Kubernetes Dashboard

[Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) is a web-based Kubernetes user interface allowing similar operations as _kubectl_.

![](https://s14-eu5.startpage.com/cgi-bin/serveimage?url=https:%2F%2Fmiro.medium.com%2Fmax%2F5760%2F1*xA3NgdUJHa0t09NH3xPv-A.png&sp=c9182253abe18efb13bc730e52fda946)


<br />
**1. Install kubernetes-dashboard via the official "recommended" manifests file**

Execute the following command and replace `<VERSION>` by the latest version (see [release page](https://github.com/kubernetes/dashboard/releases)) 

_Tested with version: **v2.0.3**_

```
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/<VERSION>/aio/deploy/recommended.yaml
```

<br />
After a few seconds, you should see to pods running in the namespace `kubernetes-dashboard`.

```
$ kubectl get pods -n kubernetes-dashboard 

NAME                                        READY   STATUS    RESTARTS   AGE
dashboard-metrics-scraper-b68468655-jg6pz   1/1     Running   0          26m
kubernetes-dashboard-64999dbccd-79whq       1/1     Running   0          26m
```

<br />
**2. Create `admin-user` to connect kubernetes-dashboard**

According to the [wiki](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md), create a new user named `admin-user` to grant this user admin permissions and login to Dashboard using bearer token tied to this user.

```
$ cat <<EOF | kubectl apply -f -
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
---
EOF
```

<br />
**3. Retrieve the unique access token of `admin-user`**

In order to authenticate to the dashboard web page, we will need to provide a token we can retrieve by executing the command:

```
$ kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')

Name:         admin-user-token-tr2dp
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: 9507154d-0742-4af0-87c9-1fe97143f5fe

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     526 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1Ni...GscCR9APmOxm53jwLj8XFqw [COPY HERE]
```

*Copy the token value*

<br />
**4. Create a secure channel to access the kubernetes-dashboard**

To access kubernetes-dashboard from your local machine, you must create a secure channel to your Kubernetes cluster. Run the following command:

```
$  kubectl proxy

Starting to serve on 127.0.0.1:8001
```

<br />
**5. Connect to kubernetes-dashboard**

Now we have a secure channel, you can access kubernetes-dashboard via the following URL: [http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/).

Select "Token", copy/paste the token previously retrieved and click on "Sign in".

![](https://i.imgur.com/7xW77VN.png)

Well done, you have now access to a nice web interface to visialise and manage all the Objects of your Kubernetes cluster (*you can switch namespace with the dropdown on the left menu*).

![](https://i.imgur.com/Ky9zXpH.png) 

<br />
<br />
### Conclusion

In conclusion of this article, we now have a ready to use Kubernetes cluster to self-host applications. In the next articles, we will learn how to deploy specific applications such as a Media manager with Plex, a self-hosted file sharing solution similar to DropBox and more.


<br />
<br />
### Teardown

If you want to uninstall completely the Kubernetes from a machine.

**1. Worker node**

Connect to the worker node and run the following commands:

```
$ sudo /usr/local/bin/k3s-agent-uninstall.sh
$ sudo rm -rf /var/lib/rancher
```

<br />
**2. Master node**

Connect to the master node and run the following commands:

```
$ sudo /usr/local/bin/k3s-uninstall.sh
$ sudo rm -rf /var/lib/rancher
```


<br />
<br />
### Known Issues

- cert-manager doesn't issue a certificate, it could be a DNS problem: [Cert Manager works! (Jim Nicholson)](https://project.kube.thejimnicholson.com/2020/04/17/cert-manager-works.html)


<br />
<br />
