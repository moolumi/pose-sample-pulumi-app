const pulumi = require("@pulumi/pulumi");
const apigateway = require("@pulumi/aws-apigateway");
const aws = require("@pulumi/aws");
const { Runtime } = require("@pulumi/aws/lambda");

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

// A REST API to route requests to the Lambda function, serving static files
// from the `www` folder via S3 and a Lambda handler on GET /source.
// See: https://www.pulumi.com/docs/iac/clouds/aws/guides/api-gateway/
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
