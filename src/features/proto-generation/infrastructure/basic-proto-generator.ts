import {ProtoGenerator} from "../domain/proto-generator";
import {ServiceMetadata} from "../../decorators/domain/service-metadata";

export class BasicProtoGenerator implements ProtoGenerator {
    generate(services: ServiceMetadata[]): string {
        let proto = 'syntax = "proto3";\n\n';

        services.forEach(service => {
            proto += `service ${service.name} {\n`;
            service.methods.forEach(method => {
                proto += `  rpc ${method.rpcName} (${method.rpcName}Request) returns (${method.rpcName}Response);\n`;
            });
            proto += "}\n\n";
        });

        return proto;
    }
}