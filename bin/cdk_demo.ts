#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDemoStack } from '../lib/cdk_demo-stack';
import { GetConfig } from '../lib/config/GetConfig';

async function Main() {
  const app = new cdk.App();
  const config = await GetConfig(app.node.tryGetContext("environment"));
  new CdkDemoStack(app, 'CdkDemoStack', config);
}

Main();
