# Pose Sample Pulumi App

A simple AWS serverless JavaScript application built with Pulumi that demonstrates:
- AWS Lambda function with API Gateway integration
- Static file serving from S3
- Infrastructure as Code with Pulumi

## Architecture

- **Lambda Function**: Node.js 20 runtime handling API requests
- **API Gateway**: REST API routing requests to Lambda and serving static files
- **S3**: Static file hosting for the web frontend

## Recent Updates

### Lambda Runtime Upgrade (Latest)
- Upgraded AWS Lambda runtime from Node.js 18 to Node.js 20
- Benefits:
  - Latest Node.js features and performance improvements
  - Enhanced security updates
  - Better compatibility with modern JavaScript features

## Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Deploy the stack:
   ```bash
   pulumi up
   ```

3. Access your application at the output URL

## Project Structure

- `index.js` - Main Pulumi infrastructure code
- `www/` - Static web assets
- `package.json` - Node.js dependencies
- `Pulumi.yaml` - Pulumi project configuration

## Lambda Function

The Lambda function (`handler`) responds to GET requests at `/source` with a simple JSON message. It runs on Node.js 20 runtime for optimal performance and security.