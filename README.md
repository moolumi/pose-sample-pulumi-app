# Pose Sample Pulumi App

A sample serverless application built with Pulumi that demonstrates how to create a REST API using AWS Lambda and API Gateway.

## Architecture

This application consists of:

- **AWS Lambda Function**: A Node.js 20.x serverless function that handles HTTP requests
- **AWS API Gateway**: A REST API that routes requests to the Lambda function
- **Static Content**: Served from an S3 bucket via API Gateway

## Components

### Lambda Function (`handler`)

- **Runtime**: Node.js 20.x (nodejs20.x)
- **Handler Type**: Callback function
- **Functionality**: Returns a JSON response with a greeting message
- **Endpoint**: `GET /source`

### API Gateway

- **Type**: REST API
- **Routes**:
  - `GET /source` - Routes to the Lambda function
  - `GET /` - Serves static content from the `www/` directory

### Static Assets

Static files are served from the `www/` directory:
- `index.html` - Main landing page
- `favicon.png` - Site favicon

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- AWS CLI configured with appropriate credentials
- An active Pulumi account

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd pose-sample-pulumi-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Pulumi**:
   ```bash
   pulumi login
   pulumi stack init <your-stack-name>
   ```

4. **Configure AWS credentials**:
   ```bash
   aws configure
   ```

## Deployment

1. **Preview changes**:
   ```bash
   pulumi preview
   ```

2. **Deploy the stack**:
   ```bash
   pulumi up
   ```

3. **Get the API endpoint URL**:
   ```bash
   pulumi stack output url
   ```

## Usage

Once deployed, you can access the application:

- **Static content**: `GET <api-url>/`
- **Lambda endpoint**: `GET <api-url>/source`

Example response from the Lambda function:
```json
{
  "message": "Hello from API Gateway!"
}
```

## Dependencies

- `@pulumi/aws` (^6.0.0) - Core AWS provider
- `@pulumi/aws-apigateway` (^3.0.0) - High-level API Gateway constructs  
- `@pulumi/awsx` (^2.0.2) - AWS extensions and best practices
- `@pulumi/pulumi` (^3.0.0) - Core Pulumi SDK

## Runtime Information

The Lambda function is configured to use:
- **Runtime**: `nodejs20.x` (Node.js 20.x)
- **Architecture**: x86_64 (default)
- **Handler**: Inline callback function

## File Structure

```
.
├── www/                  # Static assets
│   ├── index.html       # Main HTML page
│   └── favicon.png      # Site favicon
├── index.js             # Main Pulumi program
├── package.json         # Node.js dependencies
├── Pulumi.yaml          # Pulumi project configuration
└── README.md            # This file
```

## Development Notes

- The application uses Pulumi's `CallbackFunction` for inline Lambda code
- API Gateway routing is handled by the `@pulumi/aws-apigateway` package
- Static content is automatically uploaded to S3 and served via API Gateway

## Cleanup

To destroy the deployed resources:

```bash
pulumi destroy
```

## Support

For issues related to:
- Pulumi: [Pulumi Documentation](https://www.pulumi.com/docs/)
- AWS Lambda: [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- API Gateway: [Amazon API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)