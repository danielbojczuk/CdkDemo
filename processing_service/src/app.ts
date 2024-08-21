import { SQSEvent } from 'aws-lambda';

export const lambdaHandler = async (event: SQSEvent) => {
    console.log(JSON.stringify(event));
}
