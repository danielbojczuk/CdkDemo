import { Construct } from "constructs";
import { Environments } from "./environments";
export class AppConfiguration {
    constructor(private appConstruct: Construct) {}

    public GetEnvironment = ():Environments => {
        const environment = Environments[this.appConstruct.node.tryGetContext('environment') as keyof typeof Environments];
        if(environment === undefined){
            throw new Error('Invalid environment');
        }
        return environment;
    }
}