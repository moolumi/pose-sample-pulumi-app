#!/bin/bash

# PyTorch GKE Cluster Management Script

set -e

CLUSTER_NAME="pytorch-training-cluster"
REGION="us-central1"
NAMESPACE="pytorch-training"

function usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup       - Get cluster credentials and verify setup"
    echo "  scale-up    - Scale GPU node pool to 2 nodes"
    echo "  scale-down  - Scale GPU node pool to 0 nodes (save costs)"
    echo "  status      - Show cluster and training job status"
    echo "  logs        - Show logs from latest training job"
    echo "  submit      - Submit example training job"
    echo "  clean       - Clean up completed jobs"
    echo "  help        - Show this help message"
}

function setup() {
    echo "Setting up cluster access..."
    
    # Get cluster credentials
    gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION
    
    # Verify cluster access
    echo "Cluster nodes:"
    kubectl get nodes -o wide
    
    echo ""
    echo "Namespaces:"
    kubectl get namespaces
    
    echo ""
    echo "GPU resources:"
    kubectl describe nodes -l node-type=gpu | grep -A 5 "Allocatable:" || echo "No GPU nodes currently running"
}

function scale_up() {
    echo "Scaling up GPU node pool to 2 nodes..."
    gcloud container clusters resize $CLUSTER_NAME \
        --node-pool gpu-pool \
        --num-nodes 2 \
        --region $REGION \
        --quiet
    
    echo "Waiting for nodes to be ready..."
    kubectl wait --for=condition=Ready nodes -l node-type=gpu --timeout=300s
    
    echo "GPU nodes are ready!"
    kubectl get nodes -l node-type=gpu
}

function scale_down() {
    echo "Scaling down GPU node pool to 0 nodes..."
    gcloud container clusters resize $CLUSTER_NAME \
        --node-pool gpu-pool \
        --num-nodes 0 \
        --region $REGION \
        --quiet
    
    echo "GPU nodes scaled down to save costs."
}

function status() {
    echo "=== Cluster Status ==="
    kubectl get nodes -o wide
    
    echo ""
    echo "=== Training Jobs ==="
    kubectl get jobs -n $NAMESPACE
    
    echo ""
    echo "=== Training Pods ==="
    kubectl get pods -n $NAMESPACE
    
    echo ""
    echo "=== Resource Usage ==="
    kubectl top nodes 2>/dev/null || echo "Metrics server not available"
    kubectl top pods -n $NAMESPACE 2>/dev/null || echo "No pod metrics available"
}

function logs() {
    echo "Getting logs from latest training job..."
    
    LATEST_JOB=$(kubectl get jobs -n $NAMESPACE -o jsonpath='{.items[-1:].metadata.name}' 2>/dev/null)
    
    if [ -z "$LATEST_JOB" ]; then
        echo "No training jobs found in namespace $NAMESPACE"
        exit 1
    fi
    
    echo "Showing logs for job: $LATEST_JOB"
    kubectl logs -f job/$LATEST_JOB -n $NAMESPACE
}

function submit() {
    echo "Submitting example PyTorch training job..."
    
    # Check if GPU nodes are available
    GPU_NODES=$(kubectl get nodes -l node-type=gpu --no-headers 2>/dev/null | wc -l)
    
    if [ "$GPU_NODES" -eq 0 ]; then
        echo "No GPU nodes available. Scaling up first..."
        scale_up
    fi
    
    # Submit the training job
    kubectl apply -f examples/pytorch-training-job.yaml
    
    echo "Training job submitted. Monitor with:"
    echo "  kubectl get jobs -n $NAMESPACE"
    echo "  kubectl logs -f job/pytorch-training-example -n $NAMESPACE"
}

function clean() {
    echo "Cleaning up completed jobs..."
    
    # Delete completed jobs
    kubectl delete jobs -n $NAMESPACE --field-selector status.successful=1
    
    # Delete failed jobs
    kubectl delete jobs -n $NAMESPACE --field-selector status.failed=1
    
    echo "Cleanup completed."
}

# Main script logic
case "${1:-help}" in
    setup)
        setup
        ;;
    scale-up)
        scale_up
        ;;
    scale-down)
        scale_down
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    submit)
        submit
        ;;
    clean)
        clean
        ;;
    help|*)
        usage
        ;;
esac