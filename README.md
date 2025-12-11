# Pose Sample Pulumi App

A simple AWS serverless JavaScript application built with Pulumi that demonstrates how to create a REST API using AWS API Gateway and Lambda functions, along with static file hosting.

## 🏗️ Architecture

This application creates:
- **AWS Lambda Function**: A serverless function that returns a JSON response
- **AWS API Gateway**: A REST API that routes requests to the Lambda function and serves static files
- **Static File Hosting**: Serves HTML content from the `www` directory via S3

## 🚀 Features

- **Serverless REST API**: GET endpoint at `/source` that returns a greeting message
- **Static Web Hosting**: Serves a simple HTML page at the root `/` path
- **Infrastructure as Code**: All AWS resources defined using Pulumi

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- An AWS account

## 🛠️ Setup

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
   pulumi login
   pulumi stack init dev  # or use an existing stack
   ```

4. **Set AWS region** (optional):
   ```bash
   pulumi config set aws:region us-west-2
   ```

## 🚀 Deployment

1. **Deploy the stack**:
   ```bash
   pulumi up
   ```

2. **Review the changes** and confirm the deployment.

3. **Get the endpoint URL**:
   ```bash
   pulumi stack output url
   ```

## 🧪 Testing

Once deployed, you can test the application:

1. **Visit the web page**: Open the URL returned by `pulumi stack output url` in your browser
2. **Test the API endpoint**: The page will automatically fetch data from `/source` and display it
3. **Direct API access**: You can also directly visit `{url}/source` to see the JSON response

Expected API response:
```json
{
  "message": "Hello from API Gateway!"
}
```

## 📁 Project Structure

```
.
├── README.md           # This file
├── Pulumi.yaml        # Pulumi project configuration
├── package.json       # Node.js dependencies
├── index.js          # Main Pulumi program
├── www/              # Static web content
│   ├── index.html    # Main HTML page
│   └── favicon.png   # Site favicon
└── mise.toml         # Development environment configuration
```

## 🔧 Key Components

### Lambda Function
- **Runtime**: Node.js 20.x
- **Handler**: Async function that returns a JSON response
- **Trigger**: HTTP requests via API Gateway

### API Gateway
- **Type**: REST API using `@pulumi/aws-apigateway`
- **Routes**:
  - `GET /source` → Lambda function
  - `GET /` → Static files from `www/` directory

### Static Content
- Simple HTML page with JavaScript that fetches data from the API
- Demonstrates integration between static hosting and serverless functions

## 📦 Dependencies

- `@pulumi/aws`: Core AWS provider
- `@pulumi/aws-apigateway`: High-level API Gateway constructs
- `@pulumi/awsx`: AWS Crosswalk utilities
- `@pulumi/pulumi`: Core Pulumi SDK

## 🧹 Cleanup

To destroy the resources:
```bash
pulumi destroy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is provided as-is for demonstration purposes.

## 🔗 Resources

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Pulumi AWS Provider](https://www.pulumi.com/registry/packages/aws/)
- [AWS API Gateway Guide](https://www.pulumi.com/docs/iac/clouds/aws/guides/api-gateway/)
- [AWS Lambda with Pulumi](https://www.pulumi.com/docs/iac/clouds/aws/guides/lambda/)