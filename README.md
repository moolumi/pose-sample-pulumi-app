# Pose Sample Pulumi App

A simple AWS serverless web application built with Pulumi, demonstrating the use of AWS Lambda, API Gateway, and S3 for static file hosting.

## Overview

This application creates a serverless web service that:
- Serves static HTML files from the `www` folder using S3
- Provides a REST API endpoint at `/source` using AWS Lambda
- Uses AWS API Gateway to route requests between static content and the Lambda function
- Displays a simple "Hello, world!" page that fetches data from the Lambda endpoint

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Static Files  │    │   API Gateway    │    │  Lambda Function│
│   (S3 Bucket)   │◄───┤    (RestAPI)     ├───►│   (EventHandler)│
│                 │    │                  │    │                 │
│ • index.html    │    │ Routes:          │    │ GET /source     │
│ • favicon.png   │    │ • / → S3         │    │ Returns JSON    │
│                 │    │ • /source → λ    │    │ message         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Features

- **Serverless Architecture**: Built using AWS Lambda and API Gateway
- **Static File Hosting**: HTML, CSS, and images served from S3
- **RESTful API**: Simple Lambda-based API endpoint
- **Infrastructure as Code**: Complete infrastructure defined using Pulumi
- **Modern JavaScript**: Uses Node.js 20.x runtime

## Prerequisites

Before you can deploy this application, you need:

1. [Node.js](https://nodejs.org/) installed (version 14 or later)
2. [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/) installed
3. [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
4. An AWS account with permissions to create Lambda functions, API Gateway, and S3 resources

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/moolumi/pose-sample-pulumi-app.git
   cd pose-sample-pulumi-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Pulumi (if not already done):
   ```bash
   pulumi login
   ```

4. Create a new Pulumi stack or select an existing one:
   ```bash
   pulumi stack init dev
   # or
   pulumi stack select dev
   ```

5. Configure AWS region (optional, defaults to us-east-1):
   ```bash
   pulumi config set aws:region us-west-2
   ```

## Deployment

Deploy the application to AWS:

```bash
pulumi up
```

After deployment completes, Pulumi will output the URL where your application is accessible.

## Usage

Once deployed, you can:

1. **Visit the main page**: Open the URL provided by Pulumi in your browser to see the "Hello, world!" page
2. **Test the API endpoint**: The page will automatically fetch data from the `/source` endpoint and display it
3. **Direct API access**: You can also visit `{your-url}/source` directly to see the JSON response

## Project Structure

```
pose-sample-pulumi-app/
├── index.js           # Main Pulumi program
├── package.json       # Node.js dependencies
├── Pulumi.yaml        # Pulumi project configuration
├── www/               # Static web content
│   ├── index.html     # Main HTML page
│   └── favicon.png    # Site icon
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Key Components

### Lambda Function (`index.js`)
- **Runtime**: Node.js 20.x
- **Handler**: Returns a simple JSON message
- **Trigger**: HTTP requests via API Gateway

### API Gateway (`index.js`)
- **Type**: REST API
- **Routes**:
  - `GET /` → Serves static files from S3
  - `GET /source` → Invokes Lambda function

### Static Content (`www/`)
- Simple HTML page with JavaScript that fetches from the API
- Favicon for the site

## Configuration

The application uses the following Pulumi configuration:
- **Project Name**: `pose-sample-app`
- **Runtime**: Node.js (JavaScript)
- **AWS Resources**: Lambda, API Gateway, S3
- **Tags**: Includes `pulumi:template: hello-aws-javascript`

## Development

To modify this application:

1. **Update the Lambda function**: Edit the `callback` function in `index.js`
2. **Modify static content**: Update files in the `www/` directory
3. **Add new routes**: Extend the `routes` array in the API Gateway configuration
4. **Preview changes**: Run `pulumi preview` to see what will change
5. **Deploy changes**: Run `pulumi up` to apply updates

## Cleanup

To remove all AWS resources created by this application:

```bash
pulumi destroy
```

## Dependencies

This project uses the following Pulumi packages:
- `@pulumi/pulumi` - Core Pulumi SDK
- `@pulumi/aws` - AWS resource provider
- `@pulumi/aws-apigateway` - Higher-level API Gateway constructs
- `@pulumi/awsx` - AWS crosswalk utilities

## Troubleshooting

### Common Issues

1. **AWS Credentials**: Ensure AWS CLI is configured or environment variables are set
2. **Permissions**: Your AWS user needs permissions for Lambda, API Gateway, and S3
3. **Node.js Version**: Make sure you're using Node.js 14 or later
4. **Pulumi Login**: Ensure you're logged into Pulumi Cloud or using local state

### Getting Help

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [AWS Provider Documentation](https://www.pulumi.com/docs/reference/pkg/aws/)
- [Pulumi Community](https://slack.pulumi.com/)

## License

This project is provided as an example and learning resource. Please check with your organization's policies before using in production.

## Contributing

This is a sample application. For improvements or issues, please open a GitHub issue or pull request.