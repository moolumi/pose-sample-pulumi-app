# Pose Sample Pulumi App

A simple AWS serverless JavaScript Pulumi program that creates a Lambda function and API Gateway endpoint.

## Features

- AWS Lambda function with Node.js 18.x runtime
- API Gateway REST API with routes for static content and Lambda integration
- Static file serving from the `www` directory

## Development

### Prerequisites

- Node.js 18+
- Pulumi CLI
- AWS CLI configured with appropriate credentials

### Setup

```bash
# Install dependencies
npm install

# Configure Pulumi stack
pulumi stack select dev --create

# Preview changes
npm run pulumi:preview

# Deploy infrastructure
npm run pulumi:up
```

### Testing

The project includes automated testing via GitHub Actions:

```bash
# Run local syntax check
npm test

# Run linting
npm run lint

# Run security audit
npm run audit
```

### GitHub Actions Workflow

The test workflow (`.github/workflows/test.yml`) runs on every push and pull request:

1. **Code Quality**: Syntax validation and ESLint checks
2. **Pulumi Validation**: Dry-run preview to validate infrastructure code
3. **Security Scanning**: Dependency audit and secret detection
4. **Dependency Validation**: Ensures all required Pulumi packages are present

#### Required Secrets

To enable the full test workflow, configure these GitHub repository secrets:

- `AWS_ACCESS_KEY_ID`: AWS access key for Pulumi operations
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for Pulumi operations  
- `PULUMI_ACCESS_TOKEN`: Pulumi Cloud access token

## Project Structure

```
.
├── .github/workflows/test.yml    # GitHub Actions test workflow
├── www/                          # Static web content
│   ├── index.html
│   └── favicon.png
├── index.js                      # Main Pulumi program
├── package.json                  # Node.js dependencies and scripts
├── Pulumi.yaml                   # Pulumi project configuration
└── .eslintrc.js                  # ESLint configuration
```

## Infrastructure

This Pulumi program creates:

- **AWS Lambda Function**: Handles API requests with a simple "Hello from API Gateway!" response
- **API Gateway REST API**: Routes requests to Lambda function and serves static content
- **S3 Integration**: Serves static files from the `www` directory

### Endpoints

- `GET /source`: Returns JSON response from Lambda function
- `GET /`: Serves static content from `www/index.html`