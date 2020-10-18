---
title: (4/5) Collect logs with Elastic Filebeat for monitoring Kubernetes
summary: In the next section of this series, we are now going to install Filebeat, it is a lightweight agent to collect and forward log data to ElasticSearch within the k8s environment (node and pod logs). Moreover, specific modules can be configured to parse and visualise logs format coming from common applications or system (databases, message bus). Configuration Similarly to Metricbeat, Filebeat requires a settings file to configure the connections to ElasticSearch (endpoint, username, password), the
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2019-09-03
some_url: 
---

# (4/5) Collect logs with Elastic Filebeat for monitoring Kubernetes

![](https://ipfs.infura.io/ipfs/QmZcCzNro3rnKo22XsMSmVRdxwj1jybedy9SHgQhPVHmpt)



In the next section of this series, we are now going to install [**Filebeat**](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html), it is a lightweight agent to collect and forward log data to ElasticSearch within the k8s environment (node and pod logs). Moreover, specific [modules](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html) can be configured to parse and visualise logs format coming from common applications or system (databases, message bus).


### Configuration

Similarly to Metricbeat, Filebeat requires a settings file to configure the connections to ElasticSearch (endpoint, username, password), the connection to Kibana (to import pre-existing dashboards) and the way to collect and parse logs from each container of the k8s environment.

The following `ConfigMap` represents all the settings needed to capture logs (find more [here](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-reference-yml.html) to customise this config).


```yaml
## filebeat.settings.configmap.yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: filebeat-config
  labels:
    app: filebeat
data:
  filebeat.yml: |-
    filebeat.inputs:
    - type: container
      paths:
        - /var/log/containers/*.log
      processors:
        - add_kubernetes_metadata:
            in_cluster: true
            host: ${NODE_NAME}
            matchers:
            - logs_path:
                logs_path: "/var/log/containers/"

    filebeat.modules:
      - module: system
        syslog:
          enabled: true
        auth:
          enabled: true

    filebeat.autodiscover:
      providers:
        - type: kubernetes
          templates:
            - condition.equals:
                kubernetes.labels.app: mongo
              config:
                - module: mongodb
                  enabled: true
                  log:
                    input:
                      type: docker
                      containers.ids:
                        - ${data.kubernetes.container.id}

    processors:
      - drop_event:
          when.or:
              - and:
                  - regexp:
                      message: '^\d+\.\d+\.\d+\.\d+ '
                  - equals:
                      fileset.name: error
              - and:
                  - not:
                      regexp:
                          message: '^\d+\.\d+\.\d+\.\d+ '
                  - equals:
                      fileset.name: access
      - add_cloud_metadata:
      - add_kubernetes_metadata:
      - add_docker_metadata:

    output.elasticsearch:
      hosts: ['${ELASTICSEARCH_HOST:elasticsearch}:${ELASTICSEARCH_PORT:9200}']
      username: ${ELASTICSEARCH_USERNAME}
      password: ${ELASTICSEARCH_PASSWORD}

    setup.kibana:
      host: '${KIBANA_HOST:kibana}:${KIBANA_PORT:5601}'

    setup.dashboards.enabled: true
    setup.template.enabled: true

    setup.ilm:
      policy_file: /etc/indice-lifecycle.json
---
```

We also configure the [indice lifecycle](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/index-lifecycle-management.html) on startup to rollover the indice every day and delete 30 days old indices.

```yaml
## filebeat.indice-lifecycle.configmap.yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: monitoring
  name: filebeat-indice-lifecycle
  labels:
    app: filebeat
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

The following `DaemonSet` file allows to deploy an agent on each node of the k8s cluster to collect logs according to the settings configured above.

```yaml
##filebeat.daemonset.yml
---
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  namespace: monitoring
  name: filebeat
  labels:
    app: filebeat
spec:
  template:
    metadata:
      labels:
        app: filebeat
    spec:
      serviceAccountName: filebeat
      terminationGracePeriodSeconds: 30
      containers:
      - name: filebeat
        image: docker.elastic.co/beats/filebeat:7.3.0
        args: [
          "-c", "/etc/filebeat.yml",
          "-e",
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
          mountPath: /etc/filebeat.yml
          readOnly: true
          subPath: filebeat.yml
        - name: filebeat-indice-lifecycle
          mountPath: /etc/indice-lifecycle.json
          readOnly: true
          subPath: indice-lifecycle.json
        - name: data
          mountPath: /usr/share/filebeat/data
        - name: varlog
          mountPath: /var/log
          readOnly: true
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: dockersock
          mountPath: /var/run/docker.sock
      volumes:
      - name: config
        configMap:
          defaultMode: 0600
          name: filebeat-config
      - name: filebeat-indice-lifecycle
        configMap:
          defaultMode: 0600
          name: filebeat-indice-lifecycle
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      - name: dockersock
        hostPath:
          path: /var/run/docker.sock
      - name: data
        emptyDir: {}
---
```

Finally, we need to grant permissions to filebeat to access some resources of the Cluster.

```yaml
## filebeat.permission.yml
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  namespace: monitoring
  name: filebeat
subjects:
- kind: ServiceAccount
  name: filebeat
  namespace: monitoring
roleRef:
  kind: ClusterRole
  name: filebeat
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  namespace: monitoring
  name: filebeat
  labels:
    app: filebeat
rules:
- apiGroups: [""]
  resources:
  - namespaces
  - pods
  verbs:
  - get
  - watch
  - list
---
apiVersion: v1
kind: ServiceAccount
metadata:
  namespace: monitoring
  name: filebeat
  labels:
    app: filebeat
---
```

*See the [full file](https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/filebeat.yml)*


<br />

### Installation and result

We can now deploy Filebeat:

```shell
$ kubectl apply  -f filebeat.settings.configmap.yml \
                 -f filebeat.indice-lifecycle.configmap.yml \
                 -f filebeat.daemonset.yml \
                 -f filebeat.permissions.yml

configmap/filebeat-config configured
configmap/filebeat-indice-lifecycle configured
daemonset.extensions/filebeat created
clusterrolebinding.rbac.authorization.k8s.io/filebeat created
clusterrole.rbac.authorization.k8s.io/filebeat created
serviceaccount/filebeat created
```

Wait until the `filebeat` pod is `Running` and you should be able to observe logs in Kibana.

```shell
$ kubectl get all -n monitoring -l app=filebeat
NAME                 READY   STATUS    RESTARTS   AGE
pod/filebeat-l88qj   1/1     Running   0          4m52s

NAME                      DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
daemonset.apps/filebeat   1         1         1       1            1           <none>          4m52s
```

Now Filebeat is up and running, you can observe logs in different ways. From the left menu, click on "Logs" and you can see an aggregated view of all the logs printed from every nodes and containers. You can filter the logs by any attributes attached to the log (for example a kubernetes label) and navigate over the time:

![](https://imgur.com/aiDUoYf.gif)

In the Infrastructure view, the logs are now integrated and can be accessed easily for each pod by clicking on "View logs" on a pod or container.

![](https://imgur.com/PLOi5bN.gif)

Filebeat comes also with pre-built dashboards imported to Kibana, go to "Dashboards" and you should have a lot of Filebeat dashboards available. We enabled the `mongodb` module so the dashboard "Overview [Filebeat MongoDB] ECS" should be populated. It give an overview of the state of MongoDB based on the logs (error rate).

![](https://i.imgur.com/NLBuXxy.png)

<br />
<br />

### Next steps

In the following article, we will learn how to install and configure APM:
[Collect traces with Elastic APM for monitoring Kubernetes](https://kauri.io/article/bbbc0af03721495b886567ce6af6c59e)

<br />
<br />


---

- **Kauri original title:** (4/5) Collect logs with Elastic Filebeat for monitoring Kubernetes
- **Kauri original link:** https://kauri.io/(45)-collect-logs-with-elastic-filebeat-for-monit/28b4930506794915be2559dc5ee4b0b1/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2019-09-03
- **Kauri original tags:** kubernetes, elasticsearch, k8s, metricbeat, kibana, monitoring, filebeat
- **Kauri original hash:** QmVco48xYKasdoCbEqsXNXXTQm2eEhMaJihMtvkDniuSxs
- **Kauri original checkpoint:** QmYRYAA1TRyDiXS6uLXdt6qS8AnW63tqJHYpUQKrdyNz7h



