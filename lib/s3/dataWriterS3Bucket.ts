import { Bucket } from "aws-cdk-lib/aws-s3";
import { CdkDemoStack } from "../cdk_demo-stack";
import { Config } from "../config/Config";

export const dataWriterS3Bucket = (scope: CdkDemoStack, config: Config): Bucket => {
    return new Bucket(scope, "DataWriterBucket", {
        bucketName: `datawriter-${config.Environment}`,
        versioned: true,
    })
}