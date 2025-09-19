# PyTorch Training Cluster on GKE

This repository contains a production-ready PyTorch training cluster deployed on Google Kubernetes Engine (GKE) with GPU support. The infrastructure is designed to be cost-effective for development while being easily scalable for production workloads.

## Architecture Overview

### Infrastructure Components

- **GKE Cluster**: Regional cluster with private nodes for security
- **Node Pools**:
  - **System Pool**: `e2-medium` instances for cluster services
  - **GPU Pool**: `n1-standard-4` with NVIDIA T4 GPUs for training workloads
- **Networking**: Custom VPC with secondary IP ranges for pods and services
- **Storage**: SSD persistent volumes for training data and model checkpoints
- **Security**: Workload Identity, private cluster, network policies

### Cost Optimization for Development

- GPU node pool starts with 0 nodes (autoscales from 0-10)
- Uses cost-effective T4 GPUs instead of expensive V100/A100
- System workloads run on separate, smaller instances
- Regional persistent disks for data durability

### Production Scalability

- Easy to add more powerful GPU node pools (A100, V100)
- Horizontal Pod Autoscaler enabled
- Resource quotas prevent runaway costs
- Distributed training support with PyTorch DDP

## Prerequisites

1. **GCP Project**: Ensure you have a GCP project with billing enabled
2. **APIs Enabled**: Compute Engine API and Kubernetes Engine API
3. **Pulumi**: Install Pulumi CLI and set up your account
4. **GitHub Secrets**: Configure the following secrets in your repository:
   - `PULUMI_ACCESS_TOKEN`: Your Pulumi access token
   - `GCP_CREDENTIALS`: Service account key JSON for `cloud-creds/gcp-dev-sandbox`
   - `GCP_PROJECT_ID`: Your GCP project ID

## Deployment

### Using GitHub Actions (Recommended)

1. Push changes to the `main` branch to trigger automatic deployment
2. Pull requests will show preview of infrastructure changes
3. The workflow uses the `cloud-creds/gcp-dev-sandbox` service account

### Manual Deployment

```bash
# Install dependencies
npm install

# Configure Pulumi stack
pulumi stack init dev
pulumi config set gcp:project YOUR_PROJECT_ID
pulumi config set gcp:region us-central1

# Deploy infrastructure
pulumi up
```

## Configuration

Key configuration options in `Pulumi.yaml`:

- `gcp:project`: GCP project ID
- `gcp:region`: GCP region (default: us-central1)
- `cluster:name`: GKE cluster name (default: pytorch-training-cluster)

## Usage Examples

### Basic PyTorch Training Job

```bash
# Apply the example training job
kubectl apply -f examples/pytorch-training-job.yaml

# Monitor the job
kubectl get jobs -n pytorch-training
kubectl logs -f job/pytorch-training-example -n pytorch-training
```

### Distributed Training

```bash
# Apply the distributed training job
kubectl apply -f examples/distributed-training-job.yaml

# Monitor distributed training
kubectl get jobs -n pytorch-training
kubectl logs -f job/pytorch-distributed-training -n pytorch-training
```

### Scaling GPU Nodes

The GPU node pool autoscales based on demand, but you can manually scale:

```bash
# Scale up GPU nodes
gcloud container clusters resize pytorch-training-cluster \
  --node-pool gpu-pool \
  --num-nodes 3 \
  --region us-central1

# Scale down to save costs
gcloud container clusters resize pytorch-training-cluster \
  --node-pool gpu-pool \
  --num-nodes 0 \
  --region us-central1
```

## Monitoring and Debugging

### Check Cluster Status

```bash
# Get cluster credentials
gcloud container clusters get-credentials pytorch-training-cluster \
  --region us-central1

# Check nodes
kubectl get nodes -o wide

# Check GPU availability
kubectl describe nodes -l node-type=gpu
```

### Monitor Training Jobs

```bash
# List all training jobs
kubectl get jobs -n pytorch-training

# Get job details
kubectl describe job pytorch-training-example -n pytorch-training

# View logs
kubectl logs -f job/pytorch-training-example -n pytorch-training

# Check resource usage
kubectl top nodes
kubectl top pods -n pytorch-training
```

### Troubleshooting

Common issues and solutions:

1. **GPU nodes not starting**: Check if you have GPU quota in your region
2. **Pods pending**: Verify node selectors and tolerations match GPU nodes
3. **Out of resources**: Check resource quotas and node pool limits
4. **CUDA errors**: Ensure NVIDIA device plugin is running

```bash
# Check NVIDIA device plugin
kubectl get daemonset nvidia-device-plugin-daemonset -n kube-system

# Verify GPU resources
kubectl get nodes -o yaml | grep nvidia.com/gpu
```

## Production Considerations

### Scaling for Production

1. **Add powerful GPU node pools**:
   ```javascript
   // Add to index.js
   const a100NodePool = new gcp.container.NodePool("a100-node-pool", {
       // ... configuration for A100 GPUs
       nodeConfig: {
           machineType: "a2-highgpu-1g",
           guestAccelerators: [{
               type: "nvidia-tesla-a100",
               count: 1,
           }],
       },
   });
   ```

2. **Implement monitoring**: Add Prometheus, Grafana, and custom metrics
3. **Set up logging**: Configure structured logging for training jobs
4. **Add backup strategies**: Automate model checkpoint backups to GCS
5. **Implement CI/CD for models**: Add model validation and deployment pipelines

### Security Hardening

1. **Network policies**: Restrict pod-to-pod communication
2. **Pod security standards**: Implement security contexts and policies
3. **Secrets management**: Use Google Secret Manager for sensitive data
4. **Image scanning**: Scan container images for vulnerabilities

### Cost Management

1. **Preemptible nodes**: Use spot instances for non-critical training
2. **Scheduled scaling**: Scale down clusters during off-hours
3. **Resource monitoring**: Set up billing alerts and resource quotas
4. **Data lifecycle**: Implement data retention policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `pulumi preview`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.