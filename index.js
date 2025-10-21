// TODO This link is broken.
// Import the [pulumi/aws](https://pulumi.io/reference/pkg/nodejs/@pulumi/aws/index.html) package
// TODO: Ah I was using TS instead of JS.
// TODO: Oops I got the wrong one. I need to use @pulumi/aws-apigateway.
// I'm really confused: what's the difference between aws and aws-apigateway?
const pulumi = require("@pulumi/pulumi");
// Subset of `awsx` (v1). Another component provider. Wraps `aws`.
// High-level construct.
// L2
// SUGGESTION: awsx.apigateway? So it reduces the confusion
const apigateway = require("@pulumi/aws-apigateway");
// Primitives. Expose primitives. REST-ful provider version. Generated.
// API in provider form. Creates resources in AWS.
// L1
// Version:
const aws = require("@pulumi/aws");
// Crosswalk / higher level abstactions/wrapper around some parts of AWS
// best practices, etc. Hand-written.
// L2
// Version:
const awsx = require("@pulumi/awsx");
const { Runtime } = require("@pulumi/aws/lambda");
awsx.apigateway
// TODO: Where is this?
// const apigateway = require("@pulumi/aws-apigateway");


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

// Create a public HTTP endpoint (using AWS APIGateway)
// TODO This was awsx on the example, but it's not working.
// const endpoint = new aws.apigateway.API("hello", {
//     routes: [
//         // Serve static files from the `www` folder (using AWS S3)
//         {
//             path: "/",
//             localPath: "www",
//         },

//         // Serve a simple REST API on `GET /name` (using AWS Lambda)
//         {
//             path: "/source",
//             method: "GET",
//             eventHandler,
//         },
//     ],
// });
// Ahhh I was using the wrong one. It's not. It's RESTAPI.

// Create a separate bucket for access logs first
const logsBucket = new aws.s3.Bucket("static-files-access-logs");

// Create an S3 bucket for static files
const staticFilesBucket = new aws.s3.Bucket("static-files");

// Configure S3 bucket logging using BucketLoggingV2 resource
const bucketLogging = new aws.s3.BucketLoggingV2("static-files-logging", {
    bucket: staticFilesBucket.id,
    targetBucket: logsBucket.id,
    targetPrefix: "access-logs/",
});

// Upload static files to the bucket
const indexFile = new aws.s3.BucketObject("index.html", {
    bucket: staticFilesBucket.id,
    key: "index.html",
    source: new pulumi.asset.FileAsset("www/index.html"),
    contentType: "text/html",
});

const faviconFile = new aws.s3.BucketObject("favicon.png", {
    bucket: staticFilesBucket.id,
    key: "favicon.png", 
    source: new pulumi.asset.FileAsset("www/favicon.png"),
    contentType: "image/png",
});

// A REST API to route requests to the Lambda function.
// TODO Wrong: it's RestApi, not RestAPI.
// https://www.pulumi.com/docs/iac/clouds/aws/guides/api-gateway/
// const endpoint = new aws.apigateway.RestApi("api", {
const endpoint = new apigateway.RestAPI("api", {
    routes: [
        {
            path: "/source",
            method: "GET",
            eventHandler,
        },
        {
            path: "/",
            target: {
                type: "s3",
                bucket: staticFilesBucket.id,
                key: "index.html",
            },
        },
    ],
});


// Export the public URL for the HTTP service
exports.url = endpoint.url;
