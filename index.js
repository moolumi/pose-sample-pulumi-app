// Import Pulumi packages
const pulumi = require("@pulumi/pulumi");
// AWS API Gateway component provider - provides high-level constructs
const apigateway = require("@pulumi/aws-apigateway");
// Core AWS provider - provides primitive AWS resources
const aws = require("@pulumi/aws");
// AWS Crosswalk - provides higher-level abstractions and best practices
const awsx = require("@pulumi/awsx");
const { Runtime } = require("@pulumi/aws/lambda");


// A Lambda function to invoke.
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

// Create a REST API to route requests to the Lambda function
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


// Export the public URL for the HTTP service
exports.url = endpoint.url;
