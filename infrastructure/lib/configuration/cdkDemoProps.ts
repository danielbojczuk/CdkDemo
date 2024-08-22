import * as cdk from 'aws-cdk-lib';
import { Environments } from './environments';

export interface CdkDemoProps extends cdk.StackProps {
    Environment: Environments;
}