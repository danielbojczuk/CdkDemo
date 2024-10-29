import { Match, Template } from "aws-cdk-lib/assertions";
import { CdkDemoApp } from "../lib/cdkDemoApp";
import * as cdk from 'aws-cdk-lib';
import { ProcessingServiceStack } from "../lib/stacks/processingServiceStack";
import { Environments } from "../lib/configuration/environments";
import { ApiGatewayStack } from "../lib/stacks/apiGatewayStack";


describe("CdkDemoStack", () => {
    test("Should not deploy apigageway in DEV for sa-east-1", () => {
        const app = new cdk.App()
        app.node.setContext("environment", "DEV");
        const cdkDemoApp = new CdkDemoApp(app);

        cdkDemoApp.Deploy();
        expect(() => app.synth().getStackByName("CdkDemoApiGatewayStackSa-DEV")).toThrow(Error);
      });
    
      test("Should deploy apigageway in PRD for sa-east-1", () => {
        const app = new cdk.App()
        app.node.setContext("environment", "PRD");
        const cdkDemoApp = new CdkDemoApp(app);

        cdkDemoApp.Deploy();
        expect(() => app.synth().getStackByName("CdkDemoApiGatewayStackSa-PRD")).toBeDefined();
      });

      test("Tracing should be enabled in PROD", () => {
        const app = new cdk.App()
        const processingStack = new ProcessingServiceStack(app, "ProcTestStack", {Environment: Environments.PRD});
        const apiGatewayStack = new ApiGatewayStack(app, "ApiTestStack",processingStack.sqsQueue, "region", {Environment: Environments.PRD});

        const template = Template.fromStack(apiGatewayStack);

        template.hasResourceProperties(
            "AWS::ApiGateway::Stage",
            Match.objectLike({
                TracingEnabled: true
            })
          );
      });

      test("Tracing should be disable in DEV", () => {
        const app = new cdk.App()
        const processingStack = new ProcessingServiceStack(app, "ProcTestStack", {Environment: Environments.DEV});
        const apiGatewayStack = new ApiGatewayStack(app, "ApiTestStack",processingStack.sqsQueue, "region", {Environment: Environments.DEV});

        const template = Template.fromStack(apiGatewayStack);

        template.hasResourceProperties(
            "AWS::ApiGateway::Stage",
            Match.objectLike({
                TracingEnabled: false
            })
          );
      });
});