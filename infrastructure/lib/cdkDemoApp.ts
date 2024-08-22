import * as cdk from 'aws-cdk-lib';
import { ProcessingServiceStack } from './stacks/processingServiceStack';
import { ApiGatewayStack } from './stacks/apiGatewayStack';
import { AppConfiguration } from './configuration/appConfiguration';
import { Environments } from './configuration/environments';

export class CdkDemoApp {
    constructor(private App: cdk.App) {
    }

    public Deploy(): void {
        const configuration = new AppConfiguration(this.App);
        const environmentName = Environments[configuration.GetEnvironment()];
        const createPros = (awsRegion:string) => {
            return {
                env: {
                    region: awsRegion, 
                    account: process.env.CDK_DEFAULT_ACCOUNT 
                }, 
                crossRegionReferences: true,
                Environment: configuration.GetEnvironment()
            }
        }
        const backendRegion = 'eu-central-1';
        const saRegion = 'sa-east-1';

        const processingServiceStack = new ProcessingServiceStack(this.App, `CdkDemoProcessingServiceStack-${environmentName}`, createPros(backendRegion));

        new ApiGatewayStack(this.App, `CdkDemoApiGatewayStackEu-${environmentName}`, processingServiceStack.sqsQueue, backendRegion ,createPros(backendRegion));

        if(configuration.GetEnvironment() == Environments.PRD)
            new ApiGatewayStack(this.App, `CdkDemoApiGatewayStackSa-${environmentName}`, processingServiceStack.sqsQueue, backendRegion ,createPros(saRegion));

    }
} 