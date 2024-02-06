import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Config} from '../lib/config/Config'
import { dataWriterLambdaFunction} from '../lib/lambda/dataWriterLambdaFunction'
import { dataWriterS3Bucket } from './s3/dataWriterS3Bucket';

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, config: Config, props?: cdk.StackProps) {
    super(scope, id, props);
    const s3Bucket = dataWriterS3Bucket(this, config);
    const dataWriterFunction = dataWriterLambdaFunction(this, config, s3Bucket);
  }
}
