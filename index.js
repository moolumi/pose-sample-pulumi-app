const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");
const k8s = require("@pulumi/kubernetes");

// Get configuration values
const config = new pulumi.Config();
const gcpConfig = new pulumi.Config("gcp");
const clusterConfig = new pulumi.Config("cluster");

const projectId = gcpConfig.require("project");
const region = gcpConfig.get("region") || "us-central1";
const clusterName = clusterConfig.get("name") || "pytorch-training-cluster";

// Enable required GCP APIs
const computeApi = new gcp.projects.Service("compute-api", {
    project: projectId,
    service: "compute.googleapis.com",
});

const containerApi = new gcp.projects.Service("container-api", {
    project: projectId,
    service: "container.googleapis.com",
}, { dependsOn: [computeApi] });

// Create a VPC network for the cluster
const network = new gcp.compute.Network("pytorch-network", {
    project: projectId,
    autoCreateSubnetworks: false,
    description: "Network for PyTorch training cluster",
});

// Create a subnet for the cluster
const subnet = new gcp.compute.Subnetwork("pytorch-subnet", {
    project: projectId,
    region: region,
    network: network.id,
    ipCidrRange: "10.0.0.0/16",
    secondaryIpRanges: [
        {
            rangeName: "pods",
            ipCidrRange: "10.1.0.0/16",
        },
        {
            rangeName: "services",
            ipCidrRange: "10.2.0.0/16",
        },
    ],
    description: "Subnet for PyTorch training cluster",
});

// Create a service account for the GKE cluster
const clusterServiceAccount = new gcp.serviceaccount.Account("cluster-service-account", {
    project: projectId,
    accountId: `${clusterName}-cluster-sa`,
    displayName: "GKE Cluster Service Account",
    description: "Service account for GKE cluster nodes",
});

// Bind necessary roles to the service account
const roles = [
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/monitoring.viewer",
    "roles/stackdriver.resourceMetadata.writer",
];

const roleBindings = roles.map((role, index) => {
    return new gcp.projects.IAMBinding(`cluster-sa-binding-${index}`, {
        project: projectId,
        role: role,
        members: [pulumi.interpolate`serviceAccount:${clusterServiceAccount.email}`],
    });
});

// Create the GKE cluster
const cluster = new gcp.container.Cluster("pytorch-cluster", {
    project: projectId,
    location: region,
    name: clusterName,
    
    // Remove default node pool - we'll create custom ones
    removeDefaultNodePool: true,
    initialNodeCount: 1,
    
    // Network configuration
    network: network.name,
    subnetwork: subnet.name,
    
    // IP allocation for pods and services
    ipAllocationPolicy: {
        clusterSecondaryRangeName: "pods",
        servicesSecondaryRangeName: "services",
    },
    
    // Private cluster configuration for security
    privateClusterConfig: {
        enablePrivateNodes: true,
        enablePrivateEndpoint: false, // Allow public access to API server for development
        masterIpv4CidrBlock: "10.3.0.0/28",
    },
    
    // Master authorized networks (allow access from anywhere for development)
    masterAuthorizedNetworksConfig: {
        cidrBlocks: [
            {
                cidrBlock: "0.0.0.0/0",
                displayName: "All networks (development)",
            },
        ],
    },
    
    // Workload Identity for secure pod-to-GCP service communication
    workloadIdentityConfig: {
        workloadPool: `${projectId}.svc.id.goog`,
    },
    
    // Enable network policy for security
    networkPolicy: {
        enabled: true,
        provider: "CALICO",
    },
    
    // Addons configuration
    addonsConfig: {
        networkPolicyConfig: {
            disabled: false,
        },
        httpLoadBalancing: {
            disabled: false,
        },
        horizontalPodAutoscaling: {
            disabled: false,
        },
    },
    
    // Maintenance policy
    maintenancePolicy: {
        dailyMaintenanceWindow: {
            startTime: "03:00", // 3 AM UTC
        },
    },
    
    description: "GKE cluster for PyTorch training workloads",
}, { dependsOn: [containerApi, subnet, clusterServiceAccount] });

// Create a system node pool for cluster services
const systemNodePool = new gcp.container.NodePool("system-node-pool", {
    project: projectId,
    location: region,
    cluster: cluster.name,
    name: "system-pool",
    
    nodeCount: 1,
    
    nodeConfig: {
        machineType: "e2-medium", // Cost-effective for system workloads
        diskSizeGb: 50,
        diskType: "pd-standard",
        
        serviceAccount: clusterServiceAccount.email,
        oauthScopes: [
            "https://www.googleapis.com/auth/cloud-platform",
        ],
        
        // Taints to prevent user workloads from running on system nodes
        taints: [
            {
                key: "node-type",
                value: "system",
                effect: "NO_SCHEDULE",
            },
        ],
        
        labels: {
            "node-type": "system",
            "workload": "cluster-services",
        },
        
        metadata: {
            "disable-legacy-endpoints": "true",
        },
    },
    
    management: {
        autoRepair: true,
        autoUpgrade: true,
    },
}, { dependsOn: [cluster] });

// Create a GPU node pool for PyTorch training
const gpuNodePool = new gcp.container.NodePool("gpu-node-pool", {
    project: projectId,
    location: region,
    cluster: cluster.name,
    name: "gpu-pool",
    
    // Start with 0 nodes to save costs, scale up when needed
    initialNodeCount: 0,
    
    autoscaling: {
        minNodeCount: 0,
        maxNodeCount: 10, // Allow scaling up for production workloads
    },
    
    nodeConfig: {
        machineType: "n1-standard-4", // Good balance for T4 GPUs
        diskSizeGb: 100,
        diskType: "pd-ssd", // Faster storage for training data
        
        // Attach T4 GPU (cost-effective for development)
        guestAccelerators: [
            {
                type: "nvidia-tesla-t4",
                count: 1,
            },
        ],
        
        serviceAccount: clusterServiceAccount.email,
        oauthScopes: [
            "https://www.googleapis.com/auth/cloud-platform",
        ],
        
        labels: {
            "node-type": "gpu",
            "workload": "pytorch-training",
            "gpu-type": "t4",
        },
        
        taints: [
            {
                key: "nvidia.com/gpu",
                value: "true",
                effect: "NO_SCHEDULE",
            },
        ],
        
        metadata: {
            "disable-legacy-endpoints": "true",
        },
    },
    
    management: {
        autoRepair: true,
        autoUpgrade: true,
    },
}, { dependsOn: [cluster] });

// Create Kubernetes provider using the GKE cluster
const k8sProvider = new k8s.Provider("k8s-provider", {
    kubeconfig: pulumi.all([cluster.name, cluster.location, cluster.project]).apply(([name, location, project]) => {
        return gcp.container.getClusterKubeconfig({
            name: name,
            location: location,
            project: project,
        }).then(result => result.kubeconfig);
    }),
}, { dependsOn: [cluster] });

// Install NVIDIA GPU device plugin
const gpuDevicePlugin = new k8s.apps.v1.DaemonSet("nvidia-device-plugin", {
    metadata: {
        name: "nvidia-device-plugin-daemonset",
        namespace: "kube-system",
    },
    spec: {
        selector: {
            matchLabels: {
                name: "nvidia-device-plugin-ds",
            },
        },
        updateStrategy: {
            type: "RollingUpdate",
        },
        template: {
            metadata: {
                labels: {
                    name: "nvidia-device-plugin-ds",
                },
            },
            spec: {
                tolerations: [
                    {
                        key: "nvidia.com/gpu",
                        operator: "Exists",
                        effect: "NoSchedule",
                    },
                ],
                nodeSelector: {
                    "cloud.google.com/gke-accelerator": "nvidia-tesla-t4",
                },
                priorityClassName: "system-node-critical",
                containers: [
                    {
                        image: "nvcr.io/nvidia/k8s-device-plugin:v0.14.1",
                        name: "nvidia-device-plugin-ctr",
                        args: ["--fail-on-init-error=false"],
                        securityContext: {
                            allowPrivilegeEscalation: false,
                            capabilities: {
                                drop: ["ALL"],
                            },
                        },
                        volumeMounts: [
                            {
                                name: "device-plugin",
                                mountPath: "/var/lib/kubelet/device-plugins",
                            },
                        ],
                    },
                ],
                volumes: [
                    {
                        name: "device-plugin",
                        hostPath: {
                            path: "/var/lib/kubelet/device-plugins",
                        },
                    },
                ],
            },
        },
    },
}, { provider: k8sProvider, dependsOn: [gpuNodePool] });

// Create namespace for PyTorch training workloads
const pytorchNamespace = new k8s.core.v1.Namespace("pytorch-training", {
    metadata: {
        name: "pytorch-training",
        labels: {
            name: "pytorch-training",
            purpose: "ml-training",
        },
    },
}, { provider: k8sProvider });

// Create a service account for PyTorch training jobs
const pytorchServiceAccount = new k8s.core.v1.ServiceAccount("pytorch-training-sa", {
    metadata: {
        name: "pytorch-training",
        namespace: pytorchNamespace.metadata.name,
        annotations: {
            "iam.gke.io/gcp-service-account": clusterServiceAccount.email,
        },
    },
}, { provider: k8sProvider });

// Create resource quota to prevent runaway resource consumption
const resourceQuota = new k8s.core.v1.ResourceQuota("pytorch-resource-quota", {
    metadata: {
        name: "pytorch-training-quota",
        namespace: pytorchNamespace.metadata.name,
    },
    spec: {
        hard: {
            "requests.cpu": "20",
            "requests.memory": "80Gi",
            "requests.nvidia.com/gpu": "4",
            "limits.cpu": "40",
            "limits.memory": "160Gi",
            "limits.nvidia.com/gpu": "4",
            "persistentvolumeclaims": "10",
        },
    },
}, { provider: k8sProvider });

// Create a storage class for training data
const storageClass = new k8s.storage.v1.StorageClass("pytorch-storage", {
    metadata: {
        name: "pytorch-ssd",
    },
    provisioner: "kubernetes.io/gce-pd",
    parameters: {
        type: "pd-ssd",
        replication: "regional-pd",
    },
    allowVolumeExpansion: true,
    reclaimPolicy: "Retain",
}, { provider: k8sProvider });

// Export important values
exports.clusterName = cluster.name;
exports.clusterEndpoint = cluster.endpoint;
exports.clusterLocation = cluster.location;
exports.kubeconfig = pulumi.all([cluster.name, cluster.location, cluster.project]).apply(([name, location, project]) => {
    return gcp.container.getClusterKubeconfig({
        name: name,
        location: location,
        project: project,
    }).then(result => result.kubeconfig);
});
exports.pytorchNamespace = pytorchNamespace.metadata.name;
exports.networkName = network.name;
exports.subnetName = subnet.name;