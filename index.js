// Import the [pulumi/aws](https://pulumi.io/reference/pkg/nodejs/@pulumi/aws/index.html) package
const apigateway = require("@pulumi/aws-apigateway");
const aws = require("@pulumi/aws");
const { Runtime } = require("@pulumi/aws/lambda");


// Create S3 bucket for access logs (required for CIS compliance)
const accessLogsBucket = new aws.s3.Bucket("access-logs", {
    // Enable versioning for the logs bucket
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

// Create S3 bucket for static content with access logging enabled
const staticContentBucket = new aws.s3.Bucket("static-content", {
    // Enable versioning for compliance
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
    // Enable access logging to comply with CIS policy
    logging: {
        targetBucket: accessLogsBucket.id,
        targetPrefix: "static-content-access-logs/",
    },
});

// A Lambda function to invoke.
const eventHandler = new aws.lambda.CallbackFunction("handler", {
    runtime: Runtime.NodeJS18dX,
    callback: async () => {
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

// A REST API to route requests to the Lambda function.
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
    // Use our custom S3 bucket with access logging enabled for static content
    staticRoutesBucket: staticContentBucket,
});


// Export the public URL for the HTTP service
exports.url = endpoint.url;
