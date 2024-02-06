import { Architecture, Code, Function, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CdkDemoStack } from '../cdk_demo-stack';
import { Config } from '../config/Config';
import { Environment } from '../config/Environment';

export const dataWriterLambdaFunction = (scope: CdkDemoStack, config: Config, s3Bucket: Bucket): Function => {

    const tracing = (config.Environment == Environment.Production) ? Tracing.ACTIVE : Tracing.DISABLED;
    const lambdaFunction = new Function(scope, "DataWriterFunction", {
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      handler: "app.lambdaHandler",
      code: Code.fromAsset("../CdkDemoLambdaFunction/.dist/"),
      functionName: `DataWriterFunction-${config.Environment}`,
      tracing: tracing,
      environment: {
         "RandommerApiKey": config.RandommerApiKey,
         "RandommerApiUrl": config.RandommerApiUrl,
         "S3BucketName": s3Bucket.bucketName,
      }
    });

    s3Bucket.grantWrite(lambdaFunction);

    return lambdaFunction;
   }