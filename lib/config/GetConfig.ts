import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Config } from "./Config";
import { Environment } from "./Environment";

const ssmClient = new SSMClient();

async function GetParameter(parameterName: string, shouldDecrypt: boolean, environment: Environment): Promise<string> {
    const input = {
        Name: `/DataWriter/${parameterName}-${environment}`,
        WithDecryption: shouldDecrypt,
    };
    const command = new GetParameterCommand(input);
    const response = await ssmClient.send(command);
    if(!response.Parameter?.Value || response.Parameter?.Value.trim().length == 0) {
        throw new Error(`Error finding parameter ${parameterName} in SSM`)
    }
    return response.Parameter.Value;
}

function GetEnvironment(environment:string): Environment {
    switch(environment) {
        case "prd":
            return Environment.Production;
        case "dev":
            return Environment.Development;
        default:
            throw new Error(`Invalid Environment: ${environment}`);
    }
}

export async function GetConfig(environmentParameter:string): Promise<Config> {
    const environment=GetEnvironment(environmentParameter);
    return {
        RandommerApiKey: await GetParameter("RandommerApiKey", true, environment),
        RandommerApiUrl: await GetParameter("RandommerApiUrl", false, environment),
        Environment: GetEnvironment(environment),            
    }
}