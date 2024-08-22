import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SqsToLambda } from "@aws-solutions-constructs/aws-sqs-lambda";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { PhysicalName } from 'aws-cdk-lib';
import { CdkDemoProps } from '../configuration/cdkDemoProps';

export class ProcessingServiceStack extends cdk.Stack {

  public sqsQueue: cdk.aws_sqs.Queue;

  constructor(scope: Construct, id: string, props: CdkDemoProps) {
    super(scope, id, props);

    const sqsToLambda = new SqsToLambda(this, 'CdkDemoDataProcessing', {
      queueProps: {
        queueName: PhysicalName.GENERATE_IF_NEEDED
      },
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'app.lambdaHandler',
        code: lambda.Code.fromAsset(`../processing_service/.dist`),
      }
    });

    this.sqsQueue = sqsToLambda.sqsQueue;
  }
}
