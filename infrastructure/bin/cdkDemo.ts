import { CdkDemoApp } from "../lib/cdkDemoApp";
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const cdkDemo = new CdkDemoApp(app);
cdkDemo.Deploy();