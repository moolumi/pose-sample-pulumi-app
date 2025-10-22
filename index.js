// Import the [pulumi/aws](https://pulumi.io/reference/pkg/nodejs/@pulumi/aws/index.html) package
const pulumi = require("@pulumi/pulumi");
// Subset of `awsx` (v1). Another component provider. Wraps `aws`.
// High-level construct.
// L2
const apigateway = require("@pulumi/aws-apigateway");
// Primitives. Expose primitives. REST-ful provider version. Generated.
// API in provider form. Creates resources in AWS.
// L1
const aws = require("@pulumi/aws");
// Crosswalk / higher level abstactions/wrapper around some parts of AWS
// best practices, etc. Hand-written.
// L2
const awsx = require("@pulumi/awsx");
const { Runtime } = require("@pulumi/aws/lambda");


// Create S3 bucket for access logs
const logsBucket = new aws.s3.Bucket("api-logs", {
    // Enable versioning for the logs bucket
    versioning: {
        enabled: true,
    },
});

// Create S3 bucket for static files with logging enabled
const staticFilesBucket = new aws.s3.Bucket("api-static-files", {
    // Enable versioning
    versioning: {
        enabled: true,
    },
    // Enable server-side encryption
    serverSideEncryptionConfiguration: {
        rule: {
            applyServerSideEncryptionByDefault: {
                sseAlgorithm: "AES256",
            },
        },
    },
});

// Configure access logging for the static files bucket
const staticFilesBucketLogging = new aws.s3.BucketLogging("api-static-files-logging", {
    bucket: staticFilesBucket.id,
    targetBucket: logsBucket.id,
    targetPrefix: "access-logs/",
});

// Upload static files to the bucket
const indexFile = new aws.s3.BucketObject("index.html", {
    bucket: staticFilesBucket.id,
    source: new pulumi.asset.FileAsset("www/index.html"),
    contentType: "text/html",
});

const faviconFile = new aws.s3.BucketObject("favicon.png", {
    bucket: staticFilesBucket.id,
    source: new pulumi.asset.FileAsset("www/favicon.png"),
    contentType: "image/png",
});

// A Lambda function to invoke.
const eventHandler = new aws.lambda.CallbackFunction("handler", {
    runtime: Runtime.NodeJS18dX,
    callback: async (event, context) => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Hello from API Gateway!",
            }),
        };
    },
});

// Make the static files bucket publicly readable
const bucketPolicy = new aws.s3.BucketPolicy("api-static-files-policy", {
    bucket: staticFilesBucket.id,
    policy: staticFilesBucket.id.apply(bucketName => JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: "*",
                Action: "s3:GetObject",
                Resource: `arn:aws:s3:::${bucketName}/*`,
            },
        ],
    })),
});

// Configure bucket for static website hosting
const bucketWebsite = new aws.s3.BucketWebsite("api-static-files-website", {
    bucket: staticFilesBucket.id,
    indexDocument: "index.html",
});

// A REST API to route requests to the Lambda function.
const endpoint = new apigateway.RestAPI("api", {
    routes: [
        {
            path: "/source",
            method: "GET",
            eventHandler,
        },
        // Remove the static file serving from RestAPI since we'll use S3 directly
        // The S3 bucket with logging is now available at the website endpoint
    ],
});


// Export the public URLs
exports.apiUrl = endpoint.url;
exports.staticWebsiteUrl = bucketWebsite.websiteEndpoint.apply(endpoint => `http://${endpoint}`);
