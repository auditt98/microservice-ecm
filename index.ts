import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as apigateway from "@pulumi/aws-apigateway";
import * as serverless from "@pulumi/aws-serverless";

//Lambda

//-----------------Test Service-----------------
const testHandler = new aws.lambda.CallbackFunction("testHandler", {
    callback: async (event) => {
      return {
        statusCode: 200,
        body: 'Hallo Welt',
      }
    },
    timeout: 10,
    tags: {
      app: 'ecm',
    }
});



// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket", {
  tags: {
    app: 'ecm'
  }
});

const gateway = new apigateway.RestAPI('ecm-apigateway', {
  routes: [
    {
      path: '/test',
      method: 'GET',
      eventHandler: testHandler,
    }
  ]
})

const queue = new aws.sqs.Queue("queue", {
  tags: {
    app: "ecm"
  }
})

// serverless.queue.subscribe("test-queue", queue, testHandler)




// Export the name of the bucket
export const bucketName = bucket.id;

export const gatewayId = gateway.url;
