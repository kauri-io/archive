---
title: (1/5) Getting started with Elastic Stack for monitoring on Kubernetes
summary: Introduction In this article, we will learn how to set up a monitoring stack for your Kubernetes environment (k8s in short). This kind of solution allows your team to gain visibility on your infrastructure and each application with a minimal impact on the existing. The goal of observability is to provide tools to operators responsible of running the production to detect undesirables behaviours (service downtime, errors, slow responses) and have actionable information to find the root cause of an
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-10-19
some_url: 
---

# (1/5) Getting started with Elastic Stack for monitoring on Kubernetes

![](https://ipfs.infura.io/ipfs/Qmb41iri4YonbWVhjyNkuAanQJMGczpqeLKYjERh38HSUb)


### Introduction

In this article, we will learn how to set up a monitoring stack for your Kubernetes environment (*k8s* in short). This kind of solution allows your team to gain visibility on your infrastructure and each application with a minimal impact on the existing.

The goal of observability is to provide tools to operators responsible of running the production to detect undesirables behaviours (service downtime, errors, slow responses) and have actionable information to find the root cause of an issue. It is usually represented under three pillars:

- **Metrics** provide time-series information about each component of your system such as CPU, memory, disk and network consumption and usually show an overall vision and the first step to detect unusual behaviour at a certain time.
- **Logging** offer operators a tools to analyse and understand those unexpected behaviours on the system with machine, service and application logs centralised in the same searchable database.
- **Tracing or APM (Application Monitoring Performance)** provides a much deeper vision of an application where every requests and steps in the execution of the service is recorded (http calls, database queries, etc.). Using tracing, we can detect slow performance or debug a specific user at a low level and improve or fix our system accordingly.

![](https://peter.bourgon.org/img/instrumentation/01.png)
*Source: [Peter Bourgon](https://peter.bourgon.org/blog/2017/02/21/metrics-tracing-and-logging.html)*

The concept of 360 observability is fully aligned with devops and agile principles to continuously observe, detect and improve the system over time.

In this article, we will use the **Elastic stack** (version **7.3.0**) composed of ElasticSearch, Kibana, Filebeat, Metricbeat and APM-Server on a Kubernetes environment to monitor and log a production environment. This article series will walk-through a standard Kubernetes deployment, which,  in my opinion, gives a better understanding overall of each step of the installation and configuration. Of course, other methods exist to install and configure some services using tools such as *Helm* or [*Elastic Cloud on Kubernetes*](https://www.elastic.co/elasticsearch-kubernetes) but the purpose of this article is to give the readers a good understanding of each component in this "fairly" complex architecture to help them tweak it for their own system, something that is sometime limited with automated installer.

![](https://imgur.com/JLPgAwx.png)


<br />

### Prerequisite

This tutorial is using **minikube** to create a local k8s environment and deploy a simple application composed of a Spring-Boot service and a MongoDB database that will be used as example to monitor and track system and application behaviours.

So in order to get started, the following tools are required:

- [**docker**](https://docs.docker.com/install/): Container engine
- [**minikube**](https://kubernetes.io/docs/setup/learning-environment/minikube/): Local kubernetes for development and testing
- [**kubectl**](https://kubernetes.io/docs/tasks/tools/install-kubectl/): Kubernetes command line tool

ElasticSearch requires to increase nmapfs (virtual memory) on the host ([see details](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html))

```shell
$ sudo sysctl -w vm.max_map_count=262144
```

<br />

#### 1. Configure minikube memory size

First on all, we will increase the default memory size (2GB) allocated to a minikube host to 8GB. Run in a terminal the command:

```shell
$ minikube config set memory 8192
```


<br />

#### 2. Start minikube

Now let's start minikube using the following command. It might take a few minutes...


```shell
$ minikube start
😄  minikube v1.2.0 on linux (amd64)
🔥  Creating none VM (CPUs=2, Memory=8192MB, Disk=20000MB) ...
🐳  Configuring environment for Kubernetes v1.15.0 on Docker 18.06.1-ce
    ▪ kubelet.resolv-conf=/run/systemd/resolve/resolv.conf
🚜  Pulling images ...
🚀  Launching Kubernetes ...
🤹  Configuring local host environment ...

⚠️  The 'none' driver provides limited isolation and may reduce system security and reliability.
⚠️  For more information, see:
👉  https://github.com/kubernetes/minikube/blob/master/docs/vmdriver-none.md

⚠️  kubectl and minikube configuration will be stored in /home/gjeanmart
⚠️  To use kubectl or minikube commands as your own user, you may
⚠️  need to relocate them. For example, to overwrite your own settings:

    ▪ sudo mv /home/gjeanmart/.kube /home/gjeanmart/.minikube $HOME
    ▪ sudo chown -R $USER $HOME/.kube $HOME/.minikube

💡  This can also be done automatically by setting the env var CHANGE_MINIKUBE_NONE_USER=true
⌛  Verifying: apiserver proxy etcd scheduler controller dns
🏄  Done! kubectl is now configured to use "minikube"
```


<br />

#### 3. Check that everything is up and running

Finally, we check that everything works correctly

```shell
$ minikube status
host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 10.154.0.2

$ kubectl get nodes
NAME       STATUS   ROLES    AGE   VERSION
minikube   Ready    master   40m   v1.15.0
```

Bravo, we have now a running k8s local environment, you can run the command `$ kubectl get pods -A` to see what pods (containers) are currently running (mostly k8s system components).


<br />


#### 4. Deploy a sample application

We now are going to deploy a simple application (Spring-Boot) and its database (MongoDB).

##### MongoDB

We first deploy MongoDB on the k8s environment and expose the port `27017`.

```yaml
## mongo.yml
---
apiVersion: v1
kind: Service
metadata:
  namespace: default
  name: mongo
  labels:
    app: mongo
spec:
  ports:
  - port: 27017
    protocol: TCP
  selector:
    app: mongo
---
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  namespace: default
  name: mongo
  labels:
    app: mongo
spec:
  serviceName: "mongo"
  replicas: 1
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - name: mongo
        image: mongo
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongo-persistent-storage
          mountPath: /data/db
  volumeClaimTemplates:
  - metadata:
      name: mongo-persistent-storage
      annotations:
        volume.beta.kubernetes.io/storage-class: "standard"
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: standard
      resources:
        requests:
          storage: 1Gi
---
```

*See [full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/mongo.yml)*

Deploy MongoDB using the command:

```shell
$ kubectl apply -f mongo.yml
```

And wait until it gets running:

```shell
$ kubectl get all -l app=mongo
NAME          READY   STATUS    RESTARTS   AGE
pod/mongo-0   1/1     Running   0          3h35m

NAME                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)     AGE
service/mongo        ClusterIP   10.101.156.248   <none>        27017/TCP   3h35m

NAME                     READY   AGE
statefulset.apps/mongo   1/1     3h35m
```

##### spring-boot-simple

Let's now deploy our Spring-Boot API. It deploys the API internally on the port `8080` but `type=NodePort` also make accessible on another port from the node static IP.

```yaml
## spring-boot-simple.yml
---
apiVersion: v1
kind: Service
metadata:
  namespace: default
  name: spring-boot-simple
  labels:
    app: spring-boot-simple
spec:
  type: NodePort
  ports:
  - port: 8080
    protocol: TCP
  selector:
    app: spring-boot-simple
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: default
  name: spring-boot-simple
  labels:
    app: spring-boot-simple
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spring-boot-simple
  template:
    metadata:
      labels:
        app: spring-boot-simple
    spec:
      containers:
      - image: gjeanmart/spring-boot-simple:0.0.1-SNAPSHOT
        imagePullPolicy: Always
        name: spring-boot-simple
        env:
          - name: SPRING_DATA_MONGODB_HOST
            value: mongo
        ports:
        - containerPort: 8080
```

*See [full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/spring-boot-simple.yml)*

Run the command to deploy spring-boot-simple:

```shell
$ kubectl apply -f spring-boot-simple.yml
```

And wait until it's deployed

```shell
$ kubectl get all -l app=spring-boot-simple
NAME                                      READY   STATUS    RESTARTS   AGE
pod/spring-boot-simple-7cb78f8498-xwm9k   1/1     Running   0          3m2s

NAME                         TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/spring-boot-simple   NodePort   10.97.144.198   <none>        8080:30049/TCP   3m2s

NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/spring-boot-simple   1/1     1            1           3m2s

NAME                                            DESIRED   CURRENT   READY   AGE
replicaset.apps/spring-boot-simple-7cb78f8498   1         1         1       3m2s
```

Note the external port of the API on the node: `30049` and get your node static IP with `$ minikube ip`

Once you get all the information you need, simply run the following commands to test our sample API (replace `<IP>:<PORT>` by your values).

*Greetings*

```shell
$ curl -X GET  http://10.154.0.2:30049/
Greetings from Spring Boot!
```

*Post a message*

```shell
$ curl -X POST http://10.154.0.2:30049/message -d 'hello world'
{"id":"5d5abdebdc0e820001bc5c74","message":"hello+world=","postedAt":"2019-08-19T15:19:07.075+0000"}
```

*Get all messages*

```shell
$ curl -X GET http://10.154.0.2:30049/message
[{"id":"5d5abdebdc0e820001bc5c74","message":"hello+world=","postedAt":"2019-08-19T15:19:07.075+0000"}]
```


<br />

#### 5. Create a `monitoring` namespace

Finally, in order to logically separate the monitoring stack from the application (namespace `default`), we will deploy everything under a namespace called `monitoring`.

To create a namespace, simply run the following command:

```shell
$ kubectl create namespace monitoring
```

or apply the file `monitoring.namespace.yml`:

```yaml
## monitoring.namespace.yml
---
apiVersion: v1
kind: Namespace
metadata:
   name: monitoring
---
```

like this:

```shell
$ kubectl apply -f monitoring.namespace.yml
```


<br />
<br />

### Next steps

In the following article, we will get started with the installation of ElasticSearch and Kibana:
[Install ElasticSearch and Kibana to store and visualize monitoring data](https://kauri.io/article/e5b86351f38940b8a071267062f052cb)

<br />
<br />


---

- **Kauri original title:** (1/5) Getting started with Elastic Stack for monitoring on Kubernetes
- **Kauri original link:** https://kauri.io/15-getting-started-with-elastic-stack-for-monitor/b3be4dbf895b433f93b3cb589d414988/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2019-10-19
- **Kauri original tags:** kubernetes, elasticsearch, k8s, metricbeat, monitoring, kibana, filebeat
- **Kauri original hash:** QmT6U56B9Vh9VLmAKuHSTaCA1V7DhpH7ScQhaXr3yUQmmu
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



