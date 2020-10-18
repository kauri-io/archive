---
title: (2/5) Install ElasticSearch and Kibana to store and visualize monitoring data
summary: ElasticSearch cluster As explained in the introduction of this article, to setup a monitoring stack with the Elastic technologies, we first need to deploy ElasticSearch that will act as a Database to store all the data (metrics, logs and traces). The database will be composed of three scalable nodes connected together into a Cluster as recommended for production. Moreover, we will enable the authentication to make the stack more secure to potential attackers. 1. Setup the ElasticSearch master no
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-09-03
some_url: 
---

# (2/5) Install ElasticSearch and Kibana to store and visualize monitoring data

![](https://ipfs.infura.io/ipfs/QmaRtE99DKhycBBsY3Y7EzCEhmmAxmAS7rhDJy8jxmrt4Y)



### ElasticSearch cluster

As explained in the introduction of this article, to setup a monitoring stack with the Elastic technologies, we first need to deploy **ElasticSearch** that will act as a Database to store all the data (metrics, logs and traces). The database will be composed of three scalable nodes connected together into a Cluster as recommended for production.

Moreover, we will enable the authentication to make the stack more secure to potential attackers.


<br />

#### 1. Setup the ElasticSearch `master` node

The first node of the cluster we're going to setup is the master which is responsible of controlling the cluster.

The first k8s object we need is a `ConfigMap` which describes a YAML file containing all the necessary settings to configure the ElasticSearch master node into the cluster and enable security.

```yaml
## elasticsearch-master.configmap.yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: elasticsearch-master-config
  labels:
    app: elasticsearch
    role: master
data:
  elasticsearch.yml: |-
    cluster.name: ${CLUSTER_NAME}
    node.name: ${NODE_NAME}
    discovery.seed_hosts: ${NODE_LIST}
    cluster.initial_master_nodes: ${MASTER_NODES}

    network.host: 0.0.0.0

    node:
      master: true
      data: false
      ingest: false

    xpack.security.enabled: true
    xpack.monitoring.collection.enabled: true
---
```

Secondly, we will deploy a `Service` which defines a network access to a set of pods. In the case of the master node, we only need to communicate through the port `9300` used for cluster communication.

```yaml
## elasticsearch-master.service.yaml
---
apiVersion: v1
kind: Service
metadata:
  namespace: monitoring
  name: elasticsearch-master
  labels:
    app: elasticsearch
    role: master
spec:
  ports:
  - port: 9300
    name: transport
  selector:
    app: elasticsearch
    role: master
---
```

Finally, the last part is a `Deployment` which describes the running service (docker image, number of replicas, environment variables and volumes).

```yaml
## elasticsearch-master.deployment.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: monitoring
  name: elasticsearch-master
  labels:
    app: elasticsearch
    role: master
spec:
  replicas: 1
  selector:
    matchLabels:
      app: elasticsearch
      role: master
  template:
    metadata:
      labels:
        app: elasticsearch
        role: master
    spec:
      containers:
      - name: elasticsearch-master
        image: docker.elastic.co/elasticsearch/elasticsearch:7.3.0
        env:
        - name: CLUSTER_NAME
          value: elasticsearch
        - name: NODE_NAME
          value: elasticsearch-master
        - name: NODE_LIST
          value: elasticsearch-master,elasticsearch-data,elasticsearch-client
        - name: MASTER_NODES
          value: elasticsearch-master
        - name: "ES_JAVA_OPTS"
          value: "-Xms256m -Xmx256m"
        ports:
        - containerPort: 9300
          name: transport
        volumeMounts:
        - name: config
          mountPath: /usr/share/elasticsearch/config/elasticsearch.yml
          readOnly: true
          subPath: elasticsearch.yml
        - name: storage
          mountPath: /data
      volumes:
      - name: config
        configMap:
          name: elasticsearch-master-config
      - name: "storage"
        emptyDir:
          medium: ""
---
```

*See the [full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/elasticsearch-master.yml)*

Now let's apply the configuration to our k8s environment using the following command:

```shell
$ kubectl apply  -f elasticsearch-master.configmap.yaml \
                 -f elasticsearch-master.service.yaml \
                 -f elasticsearch-master.deployment.yaml

configmap/elasticsearch-master-config created
service/elasticsearch-master created
deployment.apps/elasticsearch-master created
```

Check that everything is running with the command:

```shell
$ kubectl get pods -n monitoring

NAME                                   READY   STATUS    RESTARTS   AGE
elasticsearch-master-6f8c975f9-8gdpb   1/1     Running   0          4m18s
```

<br />


#### 2. Setup the ElasticSearch `data` node

The second node of the cluster we're going to setup is the data which is responsible of hosting the data and executing the queries (CRUD, search, aggregation).

Like the master node, we need a `ConfigMap` to configure our node which looks similar to the master node but differs a little bit (see `node.data: true`)

```yaml
## elasticsearch-data.configmap.yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: elasticsearch-data-config
  labels:
    app: elasticsearch
    role: data
data:
  elasticsearch.yml: |-
    cluster.name: ${CLUSTER_NAME}
    node.name: ${NODE_NAME}
    discovery.seed_hosts: ${NODE_LIST}
    cluster.initial_master_nodes: ${MASTER_NODES}

    network.host: 0.0.0.0

    node:
      master: false
      data: true
      ingest: false

    xpack.security.enabled: true
    xpack.monitoring.collection.enabled: true
---
```

The `Service` only exposes the port `9300` for communicating with the other members of the cluster.

```yaml
## elasticsearch-data.service.yaml
---
apiVersion: v1
kind: Service
metadata:
  namespace: monitoring
  name: elasticsearch-data
  labels:
    app: elasticsearch
    role: data
spec:
  ports:
  - port: 9300
    name: transport
  selector:
    app: elasticsearch
    role: data
---
```

And finally the `ReplicaSet` is similar to the deployment but involves storage, you can identify a `volumeClaimTemplates` at the bottom of the file to create a persistent volume of 50GB.

```yaml
## elasticsearch-data.replicaset.yaml
---
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  namespace: monitoring
  name: elasticsearch-data
  labels:
    app: elasticsearch
    role: data
spec:
  serviceName: "elasticsearch-data"
  replicas: 1
  template:
    metadata:
      labels:
        app: elasticsearch-data
        role: data
    spec:
      containers:
      - name: elasticsearch-data
        image: docker.elastic.co/elasticsearch/elasticsearch:7.3.0
        env:
        - name: CLUSTER_NAME
          value: elasticsearch
        - name: NODE_NAME
          value: elasticsearch-data
        - name: NODE_LIST
          value: elasticsearch-master,elasticsearch-data,elasticsearch-client
        - name: MASTER_NODES
          value: elasticsearch-master
        - name: "ES_JAVA_OPTS"
          value: "-Xms1024m -Xmx1024m"
        ports:
        - containerPort: 9300
          name: transport
        volumeMounts:
        - name: config
          mountPath: /usr/share/elasticsearch/config/elasticsearch.yml
          readOnly: true
          subPath: elasticsearch.yml
        - name: elasticsearch-data-persistent-storage
          mountPath: /data/db
      volumes:
      - name: config
        configMap:
          name: elasticsearch-data-config
  volumeClaimTemplates:
  - metadata:
      name: elasticsearch-data-persistent-storage
      annotations:
        volume.beta.kubernetes.io/storage-class: "standard"
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: standard
      resources:
        requests:
          storage: 50Gi
---
```

*See the [full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/elasticsearch-data.yml)*

Now, let's apply the configuration using the command:

```shell
$ kubectl apply -f elasticsearch-data.configmap.yaml \
                -f elasticsearch-data.service.yaml \
                -f elasticsearch-data.replicaset.yaml

configmap/elasticsearch-data-config created
service/elasticsearch-data created
statefulset.apps/elasticsearch-data created
```

And check that everything is running:

```shell
$ kubectl get pods -n monitoring

NAME                                   READY   STATUS    RESTARTS   AGE
elasticsearch-data-0                   1/1     Running   0          2m46s
elasticsearch-master-9455d4865-42h45   1/1     Running   0          3m
```

<br />


#### 3. Setup the ElasticSearch `client` node

The last but not least node of the cluster is the client which is responsible of exposing an HTTP interface and pass queries to the data node.

The `ConfigMap` is again very similar to the master node:

```yaml
## elasticsearch-client.configmap.yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: elasticsearch-client-config
  labels:
    app: elasticsearch
    role: client
data:
  elasticsearch.yml: |-
    cluster.name: ${CLUSTER_NAME}
    node.name: ${NODE_NAME}
    discovery.seed_hosts: ${NODE_LIST}
    cluster.initial_master_nodes: ${MASTER_NODES}

    network.host: 0.0.0.0

    node:
      master: false
      data: false
      ingest: true

    xpack.security.enabled: true
    xpack.monitoring.collection.enabled: true
---
```

The client node exposes two ports, `9300` to communicate with the other nodes of the cluster and `9200` for the HTTP API.

```yaml
## elasticsearch-client.service.yaml
---
apiVersion: v1
kind: Service
metadata:
  namespace: monitoring
  name: elasticsearch-client
  labels:
    app: elasticsearch
    role: client
spec:
  ports:
  - port: 9200
    name: client
  - port: 9300
    name: transport
  selector:
    app: elasticsearch
    role: client
---
```

The `Deployment` which describes the container for the client node:

```yaml
## elasticsearch-client.deployment.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: monitoring
  name: elasticsearch-client
  labels:
    app: elasticsearch
    role: client
spec:
  replicas: 1
  selector:
    matchLabels:
      app: elasticsearch
      role: client
  template:
    metadata:
      labels:
        app: elasticsearch
        role: client
    spec:
      containers:
      - name: elasticsearch-client
        image: docker.elastic.co/elasticsearch/elasticsearch:7.3.0
        env:
        - name: CLUSTER_NAME
          value: elasticsearch
        - name: NODE_NAME
          value: elasticsearch-client
        - name: NODE_LIST
          value: elasticsearch-master,elasticsearch-data,elasticsearch-client
        - name: MASTER_NODES
          value: elasticsearch-master
        - name: "ES_JAVA_OPTS"
          value: "-Xms256m -Xmx256m"
        ports:
        - containerPort: 9200
          name: client
        - containerPort: 9300
          name: transport
        volumeMounts:
        - name: config
          mountPath: /usr/share/elasticsearch/config/elasticsearch.yml
          readOnly: true
          subPath: elasticsearch.yml
        - name: storage
          mountPath: /data
      volumes:
      - name: config
        configMap:
          name: elasticsearch-client-config
      - name: "storage"
        emptyDir:
          medium: ""
---
```

[full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/elasticsearch-client.yml)


Apply each file to deploy the `client` node:

```shell
$ kubectl apply  -f elasticsearch-client.configmap.yaml \
                 -f elasticsearch-client.service.yaml \
                 -f elasticsearch-client.deployment.yaml

configmap/elasticsearch-client-config created
service/elasticsearch-client created
deployment.apps/elasticsearch-client created
```

And verify that everything is up and running:

```shell
$ kubectl get pods -n monitoring
NAME                                    READY   STATUS    RESTARTS   AGE
elasticsearch-client-7c55b46d7f-gg9kx   1/1     Running   0          4s
elasticsearch-data-0                    1/1     Running   0          3m26s
elasticsearch-master-9455d4865-42h45    1/1     Running   0          3m40s
````

After a couple of minutes, each node of the cluster should reconcile and the master node should log the following sentence `Cluster health status changed from [YELLOW] to [GREEN] `.

```shell
$ kubectl logs -f -n monitoring \
  $(kubectl get pods -n monitoring | grep elasticsearch-master | sed -n 1p | awk '{print $1}') \
  | grep "Cluster health status changed from \[YELLOW\] to \[GREEN\]"

{ "type": "server",
  "timestamp": "2019-08-15T15:09:43,825+0000",
  "level": "INFO",
  "component": "o.e.c.r.a.AllocationService",
  "cluster.name": "elasticsearch",
  "node.name": "elasticsearch-master",
  "cluster.uuid": "iWgG2n5WSAC05Hvpeq5m4A",
  "node.id": "LScYW6eZTQiUgwRDzCvxRQ",
  "message": "Cluster health status changed from [YELLOW] to [GREEN] (reason: [shards started [[.monitoring-es-7-2019.08.15][0]] ...])."
}
```


<br />

#### 4. Generate a password and store in a k8s secret

We enabled the xpack security module to secure our cluster, so we need to initialise the passwords. Execute the following command which runs the program `bin/elasticsearch-setup-passwords` within the `client` node container (any node would work) to generate default users and passwords.

```shell
$ kubectl exec $(kubectl get pods -n monitoring | grep elasticsearch-client | sed -n 1p | awk '{print $1}') \
    -n monitoring \
    -- bin/elasticsearch-setup-passwords auto -b

Changed password for user apm_system
PASSWORD apm_system = uF8k2KVwNokmHUomemBG

Changed password for user kibana
PASSWORD kibana = DBptcLh8hu26230mIYc3

Changed password for user logstash_system
PASSWORD logstash_system = SJFKuXncpNrkuSmVCaVS

Changed password for user beats_system
PASSWORD beats_system = FGgIkQ1ki7mPPB3d7ns7

Changed password for user remote_monitoring_user
PASSWORD remote_monitoring_user = EgFB3FOsORqOx2EuZNLZ

Changed password for user elastic
PASSWORD elastic = 3JW4tPdspoUHzQsfQyAI
```

Note the `elastic` user password and add it into a k8s secret like this:

```shell
$ kubectl create secret generic elasticsearch-pw-elastic \
    -n monitoring \
    --from-literal password=3JW4tPdspoUHzQsfQyAI
```


<br />
<br />


### Kibana

The second part of the article consists in deploying **Kibana**, the data visialization plugin for ElasticSearch which offers functionalities to manage an ElasticSeach cluster and visualise all the data.

In terms of setup in k8s, this is very similar to ElasticSearch, we first use `ConfigMap` to provide a config file to our deployment with all the required properties. This particularly includes the access to ElasticSearch (host, username and password) which are configured as environment variables.

```yaml
## kibana.configmap.yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: kibana-config
  labels:
    app: kibana
data:
  kibana.yml: |-
    server.host: 0.0.0.0

    elasticsearch:
      hosts: ${ELASTICSEARCH_HOSTS}
      username: ${ELASTICSEARCH_USER}
      password: ${ELASTICSEARCH_PASSWORD}
---
```

The `Service` exposes Kibana default port `5601` to the environment and use `NodePort` to also expose a port directly on the static node IP so we can access it externally.

```yaml
## kibana.service.yaml
---
apiVersion: v1
kind: Service
metadata:
  namespace: monitoring
  name: kibana
  labels:
    app: kibana
spec:
  type: NodePort
  ports:
  - port: 5601
    name: webinterface
  selector:
    app: kibana
---
```

Finally, the `Deployment` part describes the container, the environment variables and volumes. For the env var `ELASTICSEARCH_PASSWORD`, we use `secretKeyRef` to read the password from the secret.

```yaml
## kibana.deployment.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: monitoring
  name: kibana
  labels:
    app: kibana
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kibana
  template:
    metadata:
      labels:
        app: kibana
    spec:
      containers:
      - name: kibana
        image: docker.elastic.co/kibana/kibana:7.3.0
        ports:
        - containerPort: 5601
          name: webinterface
        env:
        - name: ELASTICSEARCH_HOSTS
          value: "http://elasticsearch-client.monitoring.svc.cluster.local:9200"
        - name: ELASTICSEARCH_USER
          value: "elastic"
        - name: ELASTICSEARCH_PASSWORD
          valueFrom:
            secretKeyRef:
              name: elasticsearch-pw-elastic
              key: password
        volumeMounts:
        - name: config
          mountPath: /usr/share/kibana/config/kibana.yml
          readOnly: true
          subPath: kibana.yml
      volumes:
      - name: config
        configMap:
          name: kibana-config
---
```

*See the [full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/kibana.yml)*

Now, let's apply these files to deploy Kibana:

```shell
$ kubectl apply  -f kibana.configmap.yaml \
                 -f kibana.service.yaml \
                 -f kibana.deployment.yaml

configmap/kibana-config created
service/kibana created
deployment.apps/kibana created
```

And after a couple of minutes, check the logs for `Status changed from yellow to green`.

```shell
$ kubectl logs -f -n monitoring $(kubectl get pods -n monitoring | grep kibana | sed -n 1p | awk '{print $1}') \
     | grep "Status changed from yellow to green"

{"type":"log","@timestamp":"2019-08-16T08:56:04Z","tags":["status","plugin:maps@7.3.0","info"],"pid":1,"state":"green","message":"Status changed from yellow to green - Ready","prevState":"yellow","prevMsg":"Waiting for Elasticsearch"}
{"type":"log","@timestamp":"2019-08-16T08:56:13Z","tags":["status","plugin:spaces@7.3.0","info"],"pid":1,"state":"green","message":"Status changed from yellow to green - Ready","prevState":"yellow","prevMsg":"Waiting for Elasticsearch"}
```

Once, the logs say "green", you can access Kibana from your browser.

Run the command `$ minikube ip` to determine the IP of your node .

```shell
$ minikube ip
10.154.0.2
```

Also run the following command to find on which external port is mapped Kibana's port `5601`.

```shell
$ kubectl get service kibana -n monitoring
NAME     TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kibana   NodePort   10.111.154.92   <none>        5601:31158/TCP   41m
```

Then open [http://10.154.0.2:31158](http://10.154.0.2:31158) in your browser.

![](https://i.imgur.com/TITU4CL.png)

Login with username `elastic` and the password (generated before and stored in a secret) and you will be redirected to the index page:

![](https://i.imgur.com/rMVKBmy.png)

Before moving forward, I recommend to forget the `elastic` user (only used for cross-service access) and create a dedicated user to access Kibana. Go to *Management > Security > Users* and click on *Create User* :

![](https://i.imgur.com/BGYhaJQ.png)

Finally, go to *Stack Monitoring* to visualise the health of the cluster.

![](https://i.imgur.com/0GlrHeC.png)


In conclusion, we now have a ready-to-use **ElasticSearch + Kibana** stack which will serve us to store and visualize our infrastructure and application data (metrics, logs and traces).


<br />
<br />

### Next steps

In the following article, we will learn how to install and configure Metricbeat:
[Collect metrics with Elastic Metricbeat for monitoring Kubernetes](https://kauri.io/article/935f4e17a10243139b41546780f43c42)

<br />
<br />


---

- **Kauri original link:** https://kauri.io/(25)-install-elasticsearch-and-kibana-to-store-an/e5b86351f38940b8a071267062f052cb/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2019-09-03
- **Kauri original tags:** kubernetes, elasticsearch, k8s, metricbeat, monitoring, kibana, filebeat
- **Kauri original hash:** QmfKVBGkSynBiN9MpK6AfxPhTF6P9k24yy78KSW8iJBmsQ
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



