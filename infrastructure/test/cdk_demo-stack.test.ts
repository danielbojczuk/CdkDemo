import { Tracing } from "aws-cdk-lib/aws-lambda";
import { CdkDemoStack } from "../lib/cdk_demo-stack";
import { Config } from "../lib/config/Config";
import { Environment } from "../lib/config/Environment";
import { Match, Template } from "aws-cdk-lib/assertions";

const cdk = require("aws-cdk-lib");
describe("CdkDemoStack", () => {
    test("Should have one Lambda Function", () => {
      const app = new cdk.App();
      const config: Config = {
          RandommerApiKey: "API_KEY",
          RandommerApiUrl: "API_URL",
          Environment: Environment.Development
      };
      const stack = new CdkDemoStack(app,"CdkDemoStack",config);
      const template = Template.fromStack(stack);

      template.resourceCountIs("AWS::Lambda::Function", 1);
    });

    test("Should have one S3 Bucket", () => {
        const app = new cdk.App();
        const config: Config = {
            RandommerApiKey: "API_KEY",
            RandommerApiUrl: "API_URL",
            Environment: Environment.Development
        };
        const stack = new CdkDemoStack(app,"CdkDemoStack",config);
        const template = Template.fromStack(stack);
  
        template.resourceCountIs("AWS::S3::Bucket", 1);
      });

      test("Should have Lambda Function without tracing in dev", () => {
        const app = new cdk.App();
        const config: Config = {
            RandommerApiKey: "API_KEY",
            RandommerApiUrl: "API_URL",
            Environment: Environment.Development
        };

        const stack = new CdkDemoStack(app,"CdkDemoStack",config);
        const template = Template.fromStack(stack);

        template.hasResourceProperties(
            "AWS::Lambda::Function",
            Match.not(Match.objectLike({
                Properties: {
                    TracingConfig: 
                    {
                        Mode: 'Active',
                    },
                },
            }))
          );
      });

      test("Should have Lambda Function with tracing in prd", () => {
        const app = new cdk.App();
        const config: Config = {
            RandommerApiKey: "API_KEY",
            RandommerApiUrl: "API_URL",
            Environment: Environment.Production
        };
        
        const stack = new CdkDemoStack(app,"CdkDemoStack",config);
        const template = Template.fromStack(stack);

        template.hasResource("AWS::Lambda::Function", {
            Properties: {
                TracingConfig: {
                    Mode: 'Active',
                },
            },
        });
      });
});