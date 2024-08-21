import * as cdk from 'aws-cdk-lib';
import { ProcessingServiceStack } from '../lib/processing-service-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';

const backendRegion = 'eu-central-1';

const app = new cdk.App();
const processingServiceStack = new ProcessingServiceStack(app, 'CdkDemoProcessingServiceStack', {env: {region: backendRegion, account: process.env.CDK_DEFAULT_ACCOUNT }, crossRegionReferences: true});
const apiEuStack = new ApiGatewayStack(app, 'CdkDemoApiGatewayStackEu', processingServiceStack.sqsQueue, backendRegion ,{env: {region: 'eu-central-1', account: process.env.CDK_DEFAULT_ACCOUNT }, crossRegionReferences: true});
const apiSaStack = new ApiGatewayStack(app, 'CdkDemoApiGatewayStackSa', processingServiceStack.sqsQueue, backendRegion ,{env: {region: 'sa-east-1', account: process.env.CDK_DEFAULT_ACCOUNT }, crossRegionReferences: true});