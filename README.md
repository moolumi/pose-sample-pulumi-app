# Pose Sample Pulumi App

A simple AWS serverless web application built with Pulumi that demonstrates Infrastructure as Code (IaC) best practices. This sample app creates a complete serverless stack including static file hosting and REST API endpoints.

## Architecture

This application creates the following AWS resources:

- **AWS Lambda Function**: Handles API requests with a simple "Hello from API Gateway!" response
- **API Gateway REST API**: Routes requests to Lambda function and serves static content
- **Static File Hosting**: Serves HTML content from the `www` directory

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Pulumi CLI](https://www.pulumi.com/docs/install/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/moolumi/pose-sample-pulumi-app.git
cd pose-sample-pulumi-app
npm install
```

### 2. Configure Pulumi

Initialize a new Pulumi stack or select an existing one:

```bash
# Create a new stack
pulumi stack init dev

# Or select an existing stack
pulumi stack select <your-stack-name>
```

### 3. Deploy the Application

```bash
pulumi up
```

Review the changes and confirm the deployment. After deployment, Pulumi will output the public URL of your application.

### 4. Test the Application

Once deployed, you can:

- Visit the main URL to see the static webpage
- Access the `/source` endpoint to test the Lambda function

## Project Structure

```
pose-sample-pulumi-app/
├── index.js              # Main Pulumi program
├── package.json          # Node.js dependencies
├── Pulumi.yaml          # Pulumi project configuration
├── www/                 # Static web content
│   ├── index.html       # Main webpage
│   └── favicon.png      # Site icon
└── README.md           # This file
```

## Code Overview

### Main Infrastructure (`index.js`)

The Pulumi program defines:

1. **Lambda Function**: A callback function that returns a JSON response
2. **API Gateway**: Routes configuration for both static content and API endpoints
3. **Exports**: The public URL of the deployed application

### Static Content (`www/`)

- `index.html`: A simple webpage that fetches data from the API endpoint
- `favicon.png`: Site icon

## Configuration

The project uses the following Pulumi configuration:

- **Runtime**: Node.js (JavaScript, not TypeScript)
- **Package Manager**: npm
- **Template Tags**: `pulumi:template: hello-aws-javascript`

## API Endpoints

- `GET /`: Serves static content from `www/index.html`
- `GET /source`: Lambda function that returns `{"message": "Hello from API Gateway!"}`

## Cleanup

To remove all resources created by this stack:

```bash
pulumi destroy
```

## Development

This sample demonstrates several Pulumi concepts:

- **Infrastructure as Code**: All AWS resources defined in JavaScript
- **Serverless Architecture**: No servers to manage, pay only for usage
- **Component Providers**: Uses `@pulumi/aws-apigateway` for simplified API Gateway setup
- **Static Site Hosting**: Automatic S3 bucket creation and configuration

## Dependencies

- `@pulumi/aws`: Core AWS provider for Lambda and other services
- `@pulumi/aws-apigateway`: Higher-level API Gateway components
- `@pulumi/awsx`: Crosswalk components for AWS best practices
- `@pulumi/pulumi`: Core Pulumi SDK

## Contributing

This is a sample application for demonstration purposes. Feel free to fork and modify it to explore different Pulumi features and AWS services.

## License

This sample code is provided as-is for educational purposes.