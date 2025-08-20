# Pose Sample Pulumi App

A simple AWS serverless web application built with Pulumi, demonstrating Infrastructure as Code (IaC) with AWS Lambda, API Gateway, and S3 static hosting.

## Overview

This project showcases a basic serverless architecture using:

- **AWS Lambda**: Serverless function handling API requests
- **AWS API Gateway**: REST API endpoint for the Lambda function
- **S3 Static Hosting**: Serving static web content (HTML, favicon)
- **Pulumi**: Infrastructure as Code using JavaScript

## Architecture

The application creates:

1. A Lambda function that returns a simple JSON response
2. An API Gateway REST API with two routes:
   - `GET /source` - Returns a JSON message from the Lambda function
   - `GET /` - Serves static content from the `www/` directory
3. Static web assets hosted on S3

## Project Structure

```
├── index.js           # Main Pulumi program
├── package.json       # Node.js dependencies
├── Pulumi.yaml        # Pulumi project configuration
├── www/
│   ├── index.html     # Main web page
│   └── favicon.png    # Site favicon
├── .gitignore         # Git ignore file
└── mise.toml          # Development environment configuration
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- AWS CLI configured with appropriate credentials
- An AWS account

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
   # Login to Pulumi Cloud (or use local state)
   pulumi login
   
   # Create a new stack
   pulumi stack init dev
   
   # Set AWS region (optional, defaults to us-west-2)
   pulumi config set aws:region us-east-1
   ```

4. **Deploy the infrastructure**:
   ```bash
   pulumi up
   ```

5. **Access your application**:
   After deployment, Pulumi will output the URL of your application. Open it in a browser to see the "Hello, world!" page.

## Key Dependencies

- `@pulumi/aws`: AWS provider for Pulumi
- `@pulumi/aws-apigateway`: High-level API Gateway component
- `@pulumi/awsx`: AWS extensions providing higher-level constructs
- `@pulumi/pulumi`: Core Pulumi SDK

## API Endpoints

- `GET /`: Serves the main HTML page with static content
- `GET /source`: Returns JSON response from Lambda function
  ```json
  {
    "message": "Hello from API Gateway!"
  }
  ```

## Customization

### Modifying the Lambda Function

Edit the `eventHandler` callback function in `index.js` to change the API response:

```javascript
const eventHandler = new aws.lambda.CallbackFunction("handler", {
    runtime: Runtime.NodeJS20dX,
    callback: async (event, context) => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Your custom message here!",
            }),
        };
    },
});
```

### Adding New Routes

Add additional routes to the API Gateway configuration:

```javascript
const endpoint = new apigateway.RestAPI("api", {
    routes: [
        {
            path: "/source",
            method: "GET",
            eventHandler,
        },
        {
            path: "/new-endpoint",
            method: "POST",
            eventHandler: newHandler, // Define your new handler
        },
        {
            path: "/",
            localPath: "www",
        },
    ],
});
```

### Updating Static Content

Modify the files in the `www/` directory to customize the web interface.

## Deployment Management

- **Preview changes**: `pulumi preview`
- **Deploy changes**: `pulumi up`
- **View stack outputs**: `pulumi stack output`
- **Destroy resources**: `pulumi destroy`

## Development Notes

This project includes several TODO comments and experimental code snippets that demonstrate the learning process of working with different Pulumi AWS providers (`@pulumi/aws` vs `@pulumi/aws-apigateway` vs `@pulumi/awsx`).

## Cost Considerations

This application uses AWS services that may incur charges:
- AWS Lambda (pay per invocation)
- API Gateway (pay per request)
- S3 (storage and requests)

The AWS Free Tier covers typical development usage for this simple application.

## Troubleshooting

### Common Issues

1. **AWS credentials not configured**:
   ```bash
   aws configure
   ```

2. **Pulumi login required**:
   ```bash
   pulumi login
   ```

3. **Node.js version compatibility**:
   Ensure you're using Node.js v20 or later as specified in the Lambda runtime.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the deployment
5. Submit a pull request

## License

This project is provided as a sample application for learning Pulumi and AWS serverless development.

## Resources

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [Pulumi AWS Provider](https://www.pulumi.com/registry/packages/aws/)