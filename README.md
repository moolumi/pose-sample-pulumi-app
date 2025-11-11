# Pose Sample Pulumi App

A serverless web application built with Pulumi, featuring API Gateway, Lambda, and S3.

## Architecture

This application implements a serverless architecture pattern with:

- **API Gateway**: HTTP endpoint routing
- **Lambda Function**: Node.js 18.x backend processing
- **S3 Bucket**: Static content hosting
- **IAM Roles**: Security and permissions management

## Infrastructure Visualization

The repository includes a 3D infrastructure diagram created with POV-Ray that visualizes the complete architecture and component relationships.

### Automatic Diagram Rendering

The GitHub Actions workflow automatically renders the infrastructure diagram whenever changes are made to:
- `infrastructure-diagram.pov`
- `.github/workflows/render-infrastructure-diagram.yml`

The rendered diagram is uploaded as a build artifact and can be downloaded from the Actions tab.

### Manual Rendering

To render the diagram locally:

1. Install POV-Ray:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install povray
   
   # macOS
   brew install povray
   ```

2. Render the diagram:
   ```bash
   povray +W1920 +H1080 +A0.3 +O"infrastructure-diagram.png" infrastructure-diagram.pov
   ```

## Deployment

This project uses Pulumi for infrastructure as code. The main stack is deployed to AWS us-west-2 region.

### Request Routing

- `/` → S3 static content (index.html)
- `/source` → Lambda function for dynamic processing
- `/{proxy+}` → S3 static content with path mapping

## Development

The application consists of:
- `index.js` - Lambda function handler
- `www/` - Static web content
- `infrastructure-diagram.pov` - 3D architecture visualization
- `.github/workflows/` - CI/CD automation