import * as cdk from 'aws-cdk-lib';
import { ProcessingServiceStack } from '../lib/processing-service-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { AppConfiguration } from '../lib/configuration/appConfiguration';
import { Environments } from '../lib/configuration/environments';

const backendRegion = 'eu-central-1';

const app = new cdk.App();

const configuration = new AppConfiguration(app);
const environment = configuration.GetEnvironment();

const processingServiceStack = new ProcessingServiceStack(app, `CdkDemoProcessingServiceStack-${environment}`, {env: {region: backendRegion, account: process.env.CDK_DEFAULT_ACCOUNT }, crossRegionReferences: true});

new ApiGatewayStack(app, `CdkDemoApiGatewayStackEu-${environment}`, processingServiceStack.sqsQueue, backendRegion ,{env: {region: 'eu-central-1', account: process.env.CDK_DEFAULT_ACCOUNT }, crossRegionReferences: true});

if(configuration.GetEnvironment() != Environments.PRD) {
    new ApiGatewayStack(app, `CdkDemoApiGatewayStackSa-${environment}`, processingServiceStack.sqsQueue, backendRegion ,{env: {region: 'sa-east-1', account: process.env.CDK_DEFAULT_ACCOUNT }, crossRegionReferences: true});
}
