import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ApiGW from 'aws-cdk-lib/aws-apigateway';
import * as IAM from 'aws-cdk-lib/aws-iam';
import { CdkDemoProps } from '../configuration/cdkDemoProps';
import { Environments } from '../configuration/environments';


export class ApiGatewayStack extends cdk.Stack {

  constructor(scope: Construct, id: string, backendSqsQueue:cdk.aws_sqs.Queue, backendRegion:string,  props: CdkDemoProps) {
    super(scope, id, props);

    const integrationRole = new IAM.Role(this, 'integration-role', {
        assumedBy: new IAM.ServicePrincipal('apigateway.amazonaws.com'),
      });
    
    backendSqsQueue.grantSendMessages(integrationRole);
    const api = new ApiGW.RestApi(this, 'cdk-demo-api', {
      deployOptions: {
        stageName: Environments[props.Environment],
        tracingEnabled: (props.Environment == Environments.PRD) ? true : false
      }
    });
    const sendMessageIntegration = new ApiGW.AwsIntegration({
        service: 'sqs',
        region: backendRegion,
        path: `${process.env.CDK_DEFAULT_ACCOUNT}/${backendSqsQueue.queueName}`,
        integrationHttpMethod: 'POST',
        options: {
          credentialsRole: integrationRole,
          requestParameters: {
            'integration.request.header.Content-Type': `'application/x-www-form-urlencoded'`,
          },
          requestTemplates: {
            'application/json': 'Action=SendMessage&MessageBody=$input.body',
          },
          integrationResponses: [
            {
              statusCode: '200',
            },
            {
              statusCode: '400',
            },
            {
              statusCode: '500',
            }
          ]
        },
      });

      api.root.addMethod('POST', sendMessageIntegration, {
        methodResponses: [
          {
            statusCode: '400',
          },
          { 
            statusCode: '200',
          },
          {
            statusCode: '500',
          }
        ]
      });
  }
}
