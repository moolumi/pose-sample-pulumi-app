# Pose Sample Pulumi App

A simple AWS serverless web application built with Pulumi that demonstrates the use of API Gateway, Lambda functions, and static file hosting.

## Overview

This application creates a serverless web service on AWS that includes:

- **AWS Lambda Function**: A Node.js function that returns a "Hello from API Gateway!" message
- **API Gateway REST API**: Routes requests to either the Lambda function or static files
- **Static Web Content**: A simple HTML page served from S3 via API Gateway

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │───▶│   API Gateway   │───▶│ Lambda Function │
└─────────────────┘    │                 │    │    (Node.js)    │
                       │   Routes:       │    └─────────────────┘
                       │   • /           │           │
                       │   • /source     │           ▼
                       └─────────────────┘    "Hello from API Gateway!"
                              │
                              ▼
                       ┌─────────────────┐
                       │  Static Files   │
                       │   (www/ dir)    │
                       └─────────────────┘
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- An active AWS account

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/moolumi/pose-sample-pulumi-app.git
   cd pose-sample-pulumi-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Pulumi**:
   ```bash
   pulumi stack init dev  # or your preferred stack name
   pulumi config set aws:region us-west-2  # or your preferred region
   ```

4. **Deploy the application**:
   ```bash
   pulumi up
   ```

5. **Access your application**:
   After deployment, Pulumi will output the URL of your API Gateway endpoint. Visit this URL in your browser to see the application running.

## Project Structure

```
.
├── Pulumi.yaml          # Pulumi project configuration
├── package.json         # Node.js dependencies
├── index.js            # Main Pulumi program
├── www/                # Static web content
│   ├── index.html      # Main HTML page
│   └── favicon.png     # Site favicon
└── README.md           # This file
```

## Key Components

### Lambda Function (`index.js`)
- **Runtime**: Node.js 18.x
- **Handler**: Returns a JSON response with a greeting message
- **Endpoint**: Accessible via the `/source` API Gateway route

### API Gateway Routes
- **`/`**: Serves static files from the `www/` directory
- **`/source`**: Proxies requests to the Lambda function

### Static Content (`www/index.html`)
- Simple HTML page that displays a greeting
- Fetches additional content from the `/source` endpoint using JavaScript
- Demonstrates integration between static and dynamic content

## Dependencies

This project uses the following Pulumi providers:

- `@pulumi/aws` (^6.0.0) - Core AWS resources
- `@pulumi/aws-apigateway` (^3.0.0) - High-level API Gateway constructs
- `@pulumi/awsx` (^2.0.2) - AWS crosswalk components
- `@pulumi/pulumi` (^3.0.0) - Core Pulumi SDK

## Development Notes

The code includes several TODO comments and experimental approaches that show the development process:

- Exploration of different API Gateway implementations (`aws` vs `aws-apigateway` providers)
- Comments explaining the relationship between L1 (primitive) and L2 (high-level) Pulumi resources
- Examples of troubleshooting provider selection and configuration

## Cleanup

To remove all AWS resources created by this application:

```bash
pulumi destroy
```

## Learn More

- [Pulumi AWS Provider Documentation](https://www.pulumi.com/registry/packages/aws/)
- [Pulumi API Gateway Guide](https://www.pulumi.com/docs/iac/clouds/aws/guides/api-gateway/)
- [AWS Lambda with Pulumi](https://www.pulumi.com/docs/iac/clouds/aws/guides/lambda/)

## License

This project is provided as a sample application for educational purposes.