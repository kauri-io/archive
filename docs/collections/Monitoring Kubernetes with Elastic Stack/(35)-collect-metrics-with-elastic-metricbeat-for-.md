---
title: (3/5) Collect metrics with Elastic Metricbeat for monitoring Kubernetes 
summary: Metricbeat is a lightweight shipper installed on a server to periodically collect metrics from the host and services running. This represents the first pillar of observability to monitor our stack. Metricbeat captures by default system metrics but also includes a large list of modules to capture specific metrics about services such as proxy (NGINX), message bus (RabbitMQ, Kafka), Databases (MongoDB, MySQL, Redis) and many others (find the full list here) Prerequisite - kube-state-metrics First,
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-10-19
some_url: 
---

# (3/5) Collect metrics with Elastic Metricbeat for monitoring Kubernetes 

![](https://ipfs.infura.io/ipfs/QmfFTZb7ZaiZfDzc34kQfc137WaQ5HewS4JzinqEu2QRpE)



[**Metricbeat**](https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-overview.html) is a lightweight shipper installed on a server to periodically collect metrics from the host and services running. This represents the first pillar of observability to monitor our stack.

Metricbeat captures by default system metrics but also includes a large list of modules to capture specific metrics about services such as proxy (NGINX), message bus (RabbitMQ, Kafka), Databases (MongoDB, MySQL, Redis) and many others (find the full list [here](https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-modules.html))


<br />

### Prerequisite - kube-state-metrics

First, we need to install `kube-state-metrics` which is a service listening the Kubernetes API to exposes a set of useful metrics about the state of each Object.

To install `kube-state-metrics`, simply run the following command:

```shell
$ kubectl apply -f https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/kube-state-metrics.yml

clusterrolebinding.rbac.authorization.k8s.io/kube-state-metrics created
clusterrole.rbac.authorization.k8s.io/kube-state-metrics created
deployment.apps/kube-state-metrics created
serviceaccount/kube-state-metrics created
service/kube-state-metrics created
```


<br />

### Configuration

In order to install Metricbeat on our Kubernetes environment, we need to install a `DaemonSet` (agent installed on every nodes) and configure the settings.

First of all, we are writing the metricbeat configuration into the file `metricbeat.yml`  which will be located in `/etc/metricbeat.yml` of the DaemonSet pod container.

This file contains our metricbeat [settings](https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-reference-yml.html). We configure the ElasticSearch connection (endpoint, username, password) as output, the Kibana connection (to import pre-existing dashboards), the modules we want to enable with the period of pulling and the indice lifecycle file (rollup, retention), etc.


``` yaml
## metricbeat.settings.configmap.yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: metricbeat-config
  labels:
    app: metricbeat
data:
  metricbeat.yml: |-

    # Configure modules
    metricbeat.modules:
      - module: system
        period: ${PERIOD}
        metricsets: ["cpu", "load", "memory", "network", "process", "process_summary", "core", "diskio", "socket"]
        processes: ['.*']
        process.include_top_n:
          by_cpu: 5      # include top 5 processes by CPU
          by_memory: 5   # include top 5 processes by memory

      - module: system
        period: ${PERIOD}
        metricsets:  ["filesystem", "fsstat"]
        processors:
        - drop_event.when.regexp:
            system.filesystem.mount_point: '^/(sys|cgroup|proc|dev|etc|host|lib)($|/)'

      - module: docker
        period: ${PERIOD}
        hosts: ["unix:///var/run/docker.sock"]
        metricsets: ["container", "cpu", "diskio", "healthcheck", "info", "memory", "network"]

      - module: kubernetes
        period: ${PERIOD}
        host: ${NODE_NAME}
        hosts: ["localhost:10255"]
        metricsets: ["node", "system", "pod", "container", "volume"]

      - module: kubernetes
        period: ${PERIOD}
        host: ${NODE_NAME}
        metricsets: ["state_node", "state_deployment", "state_replicaset", "state_pod", "state_container"]
        hosts: ["kube-state-metrics.kube-system.svc.cluster.local:8080"]

    # Configure specific service module based on k8s deployment
    metricbeat.autodiscover:
      providers:
        - type: kubernetes
          host: ${NODE_NAME}
          templates:
            - condition.equals:
                kubernetes.labels.app: mongo
              config:
                - module: mongodb
                  period: ${PERIOD}
                  hosts: ["mongo.default:27017"]
                  metricsets: ["dbstats", "status", "collstats", "metrics", "replstatus"]

    # Connection to ElasticSearch
    output.elasticsearch:
      hosts: ['${ELASTICSEARCH_HOST:elasticsearch}:${ELASTICSEARCH_PORT:9200}']
      username: ${ELASTICSEARCH_USERNAME}
      password: ${ELASTICSEARCH_PASSWORD}

    # Connection to Kibana to import pre-existing dashboards
    setup.kibana:
      host: '${KIBANA_HOST:kibana}:${KIBANA_PORT:5601}'

    # Import pre-existing dashboards
    setup.dashboards.enabled: true

    # Configure indice lifecycle
    setup.ilm:
      policy_file: /etc/indice-lifecycle.json
---
```

[ElasticSearch indice lifecycle](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/index-lifecycle-management.html) represents a set of rules you want to apply to your indices based on the size or the age of the indice. So for example, it's possible to rollover the indice (create a new file) every day or every time it exceed 1GB, we can also configure different phases based on rule (`hot` for active read/write indice, `cold` for read-only and `delete` to delete the indice).
Monitoring can generate a large amount of data, perhaps more than 10GB a day, so to prevent spending to much money on cloud storage, we can use the indice lifecycle to configure data retention easily.

In the file below, we configure to rollover the indice every day or every time it exceeds 5GB and delete all indice files older than 30 days. **We only keep 30 days of monitoring data**

```yaml
## metricbeat.indice-lifecycle.configmap.yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: metricbeat-indice-lifecycle
  labels:
    app: metricbeat
data:
  indice-lifecycle.json: |-
    {
      "policy": {
        "phases": {
          "hot": {
            "actions": {
              "rollover": {
                "max_size": "5GB" ,
                "max_age": "1d"
              }
            }
          },
          "delete": {
            "min_age": "30d",
            "actions": {
              "delete": {}
            }
          }
        }
      }
    }
---
```

The next part is the `DaemonSet` describing a Metricbeat agent deployed on each node of the k8s cluster. We can especially noticed the environment variables and the volumes to access the `ConfigMap`

```yaml
## metricbeat.daemonset.yml
---
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  namespace: monitoring
  name: metricbeat
  labels:
    app: metricbeat
spec:
  template:
    metadata:
      labels:
        app: metricbeat
    spec:
      serviceAccountName: metricbeat
      terminationGracePeriodSeconds: 30
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      containers:
      - name: metricbeat
        image: docker.elastic.co/beats/metricbeat:7.3.0
        args: [
          "-c", "/etc/metricbeat.yml",
          "-e",
          "-system.hostfs=/hostfs",
        ]
        env:
        - name: ELASTICSEARCH_HOST
          value: elasticsearch-client.monitoring.svc.cluster.local
        - name: ELASTICSEARCH_PORT
          value: "9200"
        - name: ELASTICSEARCH_USERNAME
          value: elastic
        - name: ELASTICSEARCH_PASSWORD
          valueFrom:
            secretKeyRef:
              name: elasticsearch-pw-elastic
              key: password
        - name: KIBANA_HOST
          value: kibana.monitoring.svc.cluster.local
        - name: KIBANA_PORT
          value: "5601"
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        - name: PERIOD
          value: "10s"
        securityContext:
          runAsUser: 0
        resources:
          limits:
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 100Mi
        volumeMounts:
        - name: config
          mountPath: /etc/metricbeat.yml
          readOnly: true
          subPath: metricbeat.yml
        - name: indice-lifecycle
          mountPath: /etc/indice-lifecycle.json
          readOnly: true
          subPath: indice-lifecycle.json
        - name: dockersock
          mountPath: /var/run/docker.sock
        - name: proc
          mountPath: /hostfs/proc
          readOnly: true
        - name: cgroup
          mountPath: /hostfs/sys/fs/cgroup
          readOnly: true
      volumes:
      - name: proc
        hostPath:
          path: /proc
      - name: cgroup
        hostPath:
          path: /sys/fs/cgroup
      - name: dockersock
        hostPath:
          path: /var/run/docker.sock
      - name: config
        configMap:
          defaultMode: 0600
          name: metricbeat-config
      - name: indice-lifecycle
        configMap:
          defaultMode: 0600
          name: metricbeat-indice-lifecycle
      - name: data
        hostPath:
          path: /var/lib/metricbeat-data
          type: DirectoryOrCreate
---
```

The last part is a more generic part that grant access of k8s resources to the metricbeat agents.

```yaml
## metricbeat.permissions.yml
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: metricbeat
subjects:
- kind: ServiceAccount
  name: metricbeat
  namespace: monitoring
roleRef:
  kind: ClusterRole
  name: metricbeat
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: metricbeat
  labels:
    app: metricbeat
rules:
- apiGroups: [""]
  resources:
  - nodes
  - namespaces
  - events
  - pods
  verbs: ["get", "list", "watch"]
- apiGroups: ["extensions"]
  resources:
  - replicasets
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources:
  - statefulsets
  - deployments
  verbs: ["get", "list", "watch"]
- apiGroups:
  - ""
  resources:
  - nodes/stats
  verbs:
  - get
---
apiVersion: v1
kind: ServiceAccount
metadata:
  namespace: monitoring
  name: metricbeat
  labels:
    app: metricbeat
---
```

*See the [full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/metricbeat.yml)*


<br />

### Installation and result

We can now deploy Metricbeat:

```shell
$ kubectl apply  -f metricbeat.settings.configmap.yml \
                 -f metricbeat.indice-lifecycle.configmap.yml \
                 -f metricbeat.daemonset.yml \
                 -f metricbeat.permissions.yml

configmap/metricbeat-config configured
configmap/metricbeat-indice-lifecycle configured
daemonset.extensions/metricbeat created
clusterrolebinding.rbac.authorization.k8s.io/metricbeat created
clusterrole.rbac.authorization.k8s.io/metricbeat created
serviceaccount/metricbeat created
```

Wait until the `metricbeat` pod is `Running` and you should be able to observe metrics in Kibana.

```shell
$ kubectl get all -n monitoring -l app=metricbeat

NAME                   READY   STATUS    RESTARTS   AGE
pod/metricbeat-hczk7   1/1     Running   0          60m

NAME                        DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
daemonset.apps/metricbeat   1         1         1       1            1           <none>          60m
```

Firstly, from the left menu, click on "Infrastructure" and you should see a schema of your infrastructure with:
- Host: Nodes of Cluster
- Kubernetes: Visualise each pods
- Docker: Visualise each container

On each view, we can observe different metrics (CPU, Memory, Network, etc.) or group by attribute value (namespace, host, etc.).

![](https://imgur.com/lBlGO0X.gif)

In the settings, we set the property `setup.dashboards.enabled` to `true` to import pre-existing dashboards. From the left menu, go to "Dashboards" and you should see a list of about 50 Metricbeat dashboards.

We enabled the module `kubernetes`, so the dashboard **[Metricbeat Kubernetes] Overview ECS** should be populated:

![](https://i.imgur.com/A14pvYz.png)

We also enabled the module `mongodb`, have a look now on the dashboard **[Metricbeat MongoDB] Overview ECS**

![](https://i.imgur.com/XyZCA9k.png)


<br />
<br />

### Next steps

In the following article, we will learn how to install and configure Filebeat:
[Collect logs with Elastic Filebeat for monitoring Kubernetes](https://kauri.io/article/28b4930506794915be2559dc5ee4b0b1)

<br />
<br />


---

- **Kauri original title:** (3/5) Collect metrics with Elastic Metricbeat for monitoring Kubernetes 
- **Kauri original link:** https://kauri.io/35-collect-metrics-with-elastic-metricbeat-for-mon/935f4e17a10243139b41546780f43c42/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2019-10-19
- **Kauri original tags:** kubernetes, elasticsearch, k8s, metricbeat, monitoring, kibana, filebeat
- **Kauri original hash:** QmV8jRTc1MmPN1fTgoi5cSZ9qzvLkQseb6RRUNFDLAkRPf
- **Kauri original checkpoint:** QmUP9qZg9vxiTYmDyCRfVzpyYLQbtd6r3GAM7CyqCFhShv



