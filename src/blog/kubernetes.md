---
title: Kubernetes
pubDate: 2026-03-22
description:
  "A practical guide to Kubernetes. From cluster architecture and core
  components to deploying applications with pods, services, and deployments."
tags: ["devops"]
isDraft: true
snippet:
  language: "bash"
  code: "kubectl apply -f deployment.yaml"
---

Kubernetes is an open-source container orchestration platform that automates the
deployment, scaling, and management of containerized applications. It provides a
framework for running distributed systems resiliently, allowing you to manage
your application's lifecycle, scale it up or down based on demand, and ensure
high availability.

Kubernetes abstracts away the underlying infrastructure, making it easier to
deploy and manage applications consistently across different environments,
whether on-premises or in the cloud. It also offers features like service
discovery, load balancing, rolling updates, and self-healing, which help
maintain the desired state of your applications and improve their reliability.

## Cluster and Namespace

- **Cluster**: A Kubernetes cluster is a set of nodes (machines) that run
  containerized applications. It consists of a control plane (manages the
  cluster) and worker nodes (run the applications).
- **Namespace**: A namespace is a way to divide cluster resources between
  multiple users or teams. It provides a scope for names, allowing you to create
  isolated environments within the same cluster. Namespaces help organize
  resources and prevent naming conflicts.
  - **Kube-system**: The `kube-system` namespace is used for Kubernetes system
    components and add-ons. It contains essential services like the Kubernetes
    dashboard, DNS, and other system-level resources.

## Nodes

A node is a worker machine in Kubernetes. It can be a physical or virtual
machine and runs the necessary services to execute pods (containers). Each node
is managed by the control plane.

### Nodes Master

The master node is responsible for managing the cluster. It runs the control
plane components, including the API server, scheduler, and controller manager.
The master node makes decisions about the cluster's state and ensures that the
desired state is maintained.

#### Controller Manager

The controller manager is a component of the Kubernetes control plane that runs
controller processes. Controllers are responsible for regulating the state of
the cluster, ensuring that the desired state matches the actual state. For
example, the Replication Controller ensures that the specified number of pod
replicas are running.

#### API Server

The API server is the central component of the Kubernetes control plane. It
exposes the Kubernetes API, which allows users and other components to interact
with the cluster. The API server validates and processes requests, updating the
cluster's state accordingly.

#### Scheduler

The scheduler is responsible for assigning pods to nodes in the cluster. It
considers factors like resource availability, constraints, and policies to make
decisions about pod placement.

#### etcd

etcd is a distributed key-value store used by Kubernetes to store the cluster's
configuration data and state. It provides a reliable and consistent way to store
and retrieve cluster information, ensuring that the control plane components
have access to the latest state of the cluster.

### Nodes Worker

Worker nodes are the machines where your applications run. They host the pods
and provide the necessary resources (CPU, memory, storage) for your containers.
Worker nodes communicate with the master node to receive instructions and report
their status.

#### Kubelet

The kubelet is a component that runs on each worker node in the cluster. It
ensures that containers are running in the desired state by communicating with
the control plane and the container runtime. The kubelet monitors the health of
pods and reports back to the API server.

#### Kube-proxy

Kube-proxy is a network proxy that runs on each worker node and maintains
network rules. It implements service abstractions by maintaining network rules
on the host machine and allowing communication between pods across the cluster.
Kube-proxy enables service discovery and load balancing by managing iptables
rules or using IPVS (IP Virtual Server) to route traffic to the appropriate
pods.

#### Container Runtime

The container runtime is the software responsible for running containers on a
node. Kubernetes supports several container runtimes:

- **containerd**: A lightweight, high-performance container runtime that is the
  industry-standard choice for most Kubernetes deployments. It manages the
  complete lifecycle of containers on a host.
- **CRI-O**: A lightweight container runtime specifically designed for
  Kubernetes, implementing the Container Runtime Interface (CRI). It provides a
  minimal, focused runtime optimized for Kubernetes use cases.

Both runtimes work through the Container Runtime Interface (CRI), which allows
Kubernetes to support multiple container runtimes without tight coupling.

## Pods

Pods are the smallest deployable units in Kubernetes. A pod is a wrapper around
one or more containers that share network and storage resources. In most cases,
a pod runs a single container, but you can define multi-container pods when
containers need to work closely together.

### What Are Pods?

A pod provides a shared network namespace, meaning all containers within a pod
share the same IP address and port space. Containers in a pod can communicate
through localhost. Pods are ephemeral—they are created and destroyed based on
the desired state defined in higher-level resources like Deployments or
StatefulSets.

### Pod Lifecycle

Pods go through several phases during their lifecycle:

- **Pending**: The pod has been created but not yet scheduled on a node.
- **Running**: The pod is running on a node and all containers are created.
- **Succeeded**: All containers in the pod have terminated successfully.
- **Failed**: One or more containers in the pod have terminated with a non-zero
  exit code.
- **Unknown**: The state of the pod could not be determined.

### Multi-Container Pods

While single-container pods are most common, multi-container pods are useful for
tightly coupled applications. Common patterns include:

- **Sidecar pattern**: A secondary container provides supplementary
  functionality (logging, monitoring, proxying).
- **Ambassador pattern**: A proxy container handles communication for the main
  container.
- **Adapter pattern**: A container transforms the output of the main container.

Example of a multi-container pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-example
spec:
  containers:
    - name: app
      image: my-app:latest
      ports:
        - containerPort: 8080
    - name: sidecar-logger
      image: fluent-bit:latest
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/app
  volumes:
    - name: shared-logs
      emptyDir: {}
```

## Services

Services provide stable, persistent access to pods. Since pods are ephemeral and
can be created and destroyed, services abstract away individual pod addresses
and provide a single point of access to a set of pods.

### ClusterIP

ClusterIP is the default service type and exposes the service only within the
cluster. Pods can communicate with the service, but it's not accessible from
outside the cluster.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
```

### NodePort

NodePort exposes the service on a port on each node. External traffic can reach
the service by accessing `<NodeIP>:<NodePort>`. This is useful for simple
external access but is not recommended for production use.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport-service
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080
```

### LoadBalancer

LoadBalancer exposes the service externally using a cloud provider's load
balancer. This is the recommended way to expose services to external traffic in
production environments. It automatically provisions a load balancer and assigns
a public IP address.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-loadbalancer-service
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
```

## Deployments

Deployments are higher-level resources that manage the creation and scaling of
pods. They ensure that a specified number of pod replicas are running at all
times and provide declarative updates for pods and ReplicaSets.

### What Deployments Manage

A Deployment defines the desired state of your application, including:

- The container image to use
- The number of replicas
- Resource requests and limits
- Environment variables and configuration
- Health checks and restart policies

The Deployment controller continuously monitors the actual state and reconciles
it with the desired state.

### Rolling Updates

Deployments support rolling updates, which allow you to update your application
without downtime. The deployment gradually replaces old pods with new ones,
ensuring that your application remains available during the update.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:1.0
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
```

## ConfigMaps and Secrets

ConfigMaps and Secrets allow you to decouple configuration from your container
images, making it easier to manage configuration across different environments.

### ConfigMaps

ConfigMaps store non-sensitive configuration data as key-value pairs. They are
useful for storing application configuration, environment variables, or entire
configuration files.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "INFO"
  DATABASE_HOST: "db.example.com"
  app.properties: |
    server.port=8080
    server.servlet.context-path=/api
```

### Secrets

Secrets store sensitive data like passwords, API keys, and tokens. They are
stored separately from ConfigMaps and can be encrypted at rest in etcd.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DATABASE_PASSWORD: $DATABASE_PASSWORD # base64 encoded
  API_KEY: $API_KEY # base64 encoded
```

To use ConfigMaps and Secrets in pods, you can mount them as environment
variables or volumes:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-app
      image: my-app:latest
      envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secret
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: app-config
```

## Common kubectl Commands

kubectl is the command-line interface for interacting with Kubernetes. Here are
some commonly used commands:

### Viewing Cluster Information

```bash
# Get cluster information
kubectl cluster-info

# Get nodes in the cluster
kubectl get nodes

# Get detailed node information
kubectl describe node <node-name>

# Get cluster events
kubectl get events
```

### Managing Pods

```bash
# List all pods
kubectl get pods

# Get pods with more details
kubectl get pods -o wide

# Describe a pod
kubectl describe pod <pod-name>

# View pod logs
kubectl logs <pod-name>

# Get logs from a specific container in a multi-container pod
kubectl logs <pod-name> -c <container-name>

# Execute a command in a container
kubectl exec -it <pod-name> -- /bin/bash

# Port forward to a pod
kubectl port-forward <pod-name> 8080:8080
```

### Managing Deployments

```bash
# List all deployments
kubectl get deployments

# Describe a deployment
kubectl describe deployment <deployment-name>

# Update a deployment image
kubectl set image deployment/<deployment-name> <container-name>=<new-image>:<tag>

# Check rollout status
kubectl rollout status deployment/<deployment-name>

# Rollback to a previous version
kubectl rollout undo deployment/<deployment-name>
```

### Managing Services

```bash
# List all services
kubectl get services

# Describe a service
kubectl describe service <service-name>

# Access a service externally
kubectl port-forward service/<service-name> 8080:80
```

### Applying and Deleting Resources

```bash
# Apply a manifest file
kubectl apply -f deployment.yaml

# Apply all manifests in a directory
kubectl apply -f ./manifests/

# Delete a resource
kubectl delete pod <pod-name>

# Delete a resource by file
kubectl delete -f deployment.yaml

# Delete all resources of a type
kubectl delete pods --all
```

### Working with Namespaces

```bash
# List namespaces
kubectl get namespaces

# Create a namespace
kubectl create namespace my-namespace

# Get resources in a specific namespace
kubectl get pods -n my-namespace

# Set default namespace for current context
kubectl config set-context --current --namespace=my-namespace
```

## Practical Example: Deploying a Simple Application

Let's walk through deploying a simple web application with Kubernetes. This
example includes a Deployment, a Service, and a ConfigMap.

First, create a file named `app-manifest.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app-ns

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: my-app-ns
data:
  APP_NAME: "My Awesome App"
  LOG_LEVEL: "INFO"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: my-app-ns
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: web-app
          image: nginx:latest
          ports:
            - containerPort: 80
          envFrom:
            - configMapRef:
                name: app-config
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
  namespace: my-app-ns
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
```

Deploy the application:

```bash
# Create the namespace and resources
kubectl apply -f app-manifest.yaml

# Check deployment status
kubectl get deployments -n my-app-ns

# Check pods
kubectl get pods -n my-app-ns

# Check service
kubectl get service -n my-app-ns

# View service details (including external IP if available)
kubectl describe service web-app-service -n my-app-ns

# Check pod logs
kubectl logs -n my-app-ns -l app=web-app

# Port forward to test locally
kubectl port-forward -n my-app-ns service/web-app-service 8080:80

# Update the deployment image
kubectl set image deployment/web-app -n my-app-ns web-app=nginx:1.19

# Monitor rollout
kubectl rollout status deployment/web-app -n my-app-ns

# Clean up
kubectl delete namespace my-app-ns
```

## Final Thoughts

Kubernetes has become the de facto standard for container orchestration in
modern DevOps practices. While it has a steep learning curve, understanding its
core concepts—clusters, nodes, pods, services, and deployments—provides a solid
foundation for managing containerized applications at scale.

The key to mastering Kubernetes is hands-on practice. Start with simple
deployments, gradually increase complexity, and leverage the extensive
documentation and community resources available. Remember that Kubernetes is
highly flexible and can be customized to fit virtually any architectural pattern
or operational requirement.

As you grow more comfortable with Kubernetes, explore advanced topics like
StatefulSets for managing stateful applications, DaemonSets for running pods on
every node, and custom resource definitions for extending Kubernetes with
domain-specific abstractions.

## References

- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [Kubernetes Up and Running, 2nd Edition](https://www.oreilly.com/library/view/kubernetes-up-and/9781492046523/)
  (O'Reilly)
- [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/)
- [Kubernetes API Reference](https://kubernetes.io/docs/reference/kubernetes-api/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
