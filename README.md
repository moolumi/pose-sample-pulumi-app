# Pose Sample Pulumi App

A simple AWS serverless web application built with Pulumi, demonstrating how to create and deploy cloud infrastructure using JavaScript.

## Overview

This sample application creates a complete serverless web application on AWS that includes:

- **Static Web Hosting**: Serves static HTML files from an S3 bucket
- **API Gateway**: Provides a REST API endpoint
- **AWS Lambda**: Handles dynamic API requests
- **Integrated Frontend**: A simple HTML page that calls the API

The application demonstrates the integration between static content hosting and serverless functions, all deployed as Infrastructure as Code using Pulumi.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Static Files  │    │   API Gateway    │    │  Lambda Function│
│   (S3 Bucket)   │◄───┤   REST API       │◄───┤   (Node.js)     │
│   www/          │    │   /source        │    │   Event Handler │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Features

- **Serverless Architecture**: No servers to manage
- **Static + Dynamic Content**: Combines static file hosting with dynamic API responses
- **Infrastructure as Code**: Complete infrastructure defined in JavaScript
- **AWS Best Practices**: Uses managed AWS services for scalability and reliability

## Prerequisites

Before running this project, ensure you have:

1. [Node.js](https://nodejs.org/) (version 14 or later)
2. [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/) installed
3. [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
4. An AWS account with sufficient permissions to create:
   - S3 buckets
   - Lambda functions
   - API Gateway resources
   - IAM roles and policies

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/moolumi/pose-sample-pulumi-app.git
cd pose-sample-pulumi-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Pulumi

Initialize a new Pulumi stack (replace `dev` with your preferred stack name):

```bash
pulumi stack init dev
```

Set the AWS region:

```bash
pulumi config set aws:region us-west-2
```

### 4. Deploy the Application

```bash
pulumi up
```

This will:
- Show you a preview of the resources to be created
- Ask for confirmation before proceeding
- Deploy all resources to AWS
- Display the public URL of your application

### 5. Test the Application

After deployment, Pulumi will output a URL. Visit this URL in your browser to see:
- A "Hello, world!" page
- A message showing it was "Made with ❤️ using Pulumi"
- A dynamic message fetched from the Lambda function via API Gateway

## Project Structure

```
pose-sample-pulumi-app/
├── index.js              # Main Pulumi program
├── package.json          # Node.js dependencies
├── Pulumi.yaml           # Pulumi project configuration
├── www/                  # Static web content
│   ├── index.html        # Main HTML page
│   └── favicon.png       # Site favicon
└── README.md             # This file
```

## Key Components

### Lambda Function (`index.js`)

The Lambda function is defined using Pulumi's `CallbackFunction`, which allows you to define the function code inline:

```javascript
const eventHandler = new aws.lambda.CallbackFunction("handler", {
    runtime: Runtime.NodeJS20dX,
    callback: async (event, context) => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Hello from API Gateway!",
            }),
        };
    },
});
```

### API Gateway Configuration

The REST API is created using the `@pulumi/aws-apigateway` package:

```javascript
const endpoint = new apigateway.RestAPI("api", {
    routes: [
        {
            path: "/source",
            method: "GET",
            eventHandler,
        },
        {
            path: "/",
            localPath: "www",
        },
    ],
});
```

### Static Content

The `www/` directory contains the static HTML content that gets served at the root path.

## Configuration

### Pulumi Configuration

The project uses the following configuration:

- **Runtime**: Node.js (JavaScript, not TypeScript)
- **Package Manager**: npm
- **Cloud Provider**: AWS
- **Template Tag**: hello-aws-javascript

### Dependencies

- `@pulumi/aws`: AWS resource provider
- `@pulumi/aws-apigateway`: Higher-level API Gateway constructs
- `@pulumi/awsx`: AWS extensions for common patterns
- `@pulumi/pulumi`: Core Pulumi SDK

## Customization

### Modifying the Lambda Function

To change the API response, edit the `callback` function in the `eventHandler` definition in `index.js`.

### Adding Static Content

Add or modify files in the `www/` directory. They will be automatically served at the root path.

### Adding API Routes

Add more routes to the `routes` array in the `RestAPI` configuration:

```javascript
{
    path: "/new-endpoint",
    method: "POST",
    eventHandler: newHandler,
}
```

## Cleanup

To destroy all created resources:

```bash
pulumi destroy
```

This will remove all AWS resources created by this project.

## Troubleshooting

### Common Issues

1. **AWS Credentials**: Ensure your AWS credentials are properly configured
2. **Permissions**: Make sure your AWS user/role has sufficient permissions
3. **Region**: Verify you're deploying to the intended AWS region

### Debugging

- Use `pulumi logs` to view Lambda function logs
- Check the AWS Console for resource status
- Use `pulumi stack output` to see the deployed URL

## Learning Resources

- [Pulumi AWS Documentation](https://www.pulumi.com/docs/clouds/aws/)
- [Pulumi JavaScript/TypeScript Guide](https://www.pulumi.com/docs/languages-sdks/javascript/)
- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

## Contributing

This is a sample/demo application. Feel free to fork and modify it for your own learning and experimentation.

## License

This project is provided as-is for educational and demonstration purposes.