import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ServiceMetadata } from "../../decorators/domain/service-metadata";
import { BasicProtoGenerator } from "../../proto-generation/infrastructure/basic-proto-generator";
import {Server} from "../domain/server";

type UntypedServiceImplementation = grpc.UntypedServiceImplementation;

export class GrpcServer implements Server {
    private server = new grpc.Server();
    private serviceInstances: Map<string, any> = new Map();

    constructor(
        private servicesMetadata: ServiceMetadata[],
        private serviceClasses: Array<new () => object>
    ) {
        this.registerServiceInstances();
    }

    private registerServiceInstances() {
        this.serviceClasses.forEach(ServiceClass => {
            const serviceName = Reflect.getMetadata(
                "tgrpc:service",
                ServiceClass.prototype.constructor
            );
            this.serviceInstances.set(serviceName, new ServiceClass());
        });
    }

    start(port: number): void {
        const protoContent = new BasicProtoGenerator().generate(this.servicesMetadata);
        const tempProtoPath = this.generateTempProto(protoContent);

        const packageDefinition = protoLoader.loadSync(tempProtoPath);
        const proto = grpc.loadPackageDefinition(packageDefinition);

        this.servicesMetadata.forEach(service => {
            const serviceImpl = this.createServiceImpl(service);
            const serviceDef = (proto[service.name] as any).service;
            this.server.addService(serviceDef, serviceImpl);
        });

        this.server.bindAsync(
            `0.0.0.0:${port}`,
            grpc.ServerCredentials.createInsecure(),
            (error, port) => {
                if (error) throw error;
                this.server.start();
                console.log(`Server running on port ${port}`);
            }
        );
    }

    private generateTempProto(content: string): string {
        const fs = require("fs");
        const path = require("path");
        const protoPath = path.join(__dirname, "temp.proto");
        fs.writeFileSync(protoPath, content);
        return protoPath;
    }

    private createServiceImpl(service: ServiceMetadata): UntypedServiceImplementation {
        const implementation: UntypedServiceImplementation = {};
        const serviceInstance = this.serviceInstances.get(service.name);

        service.methods.forEach(method => {
            implementation[method.rpcName] = (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
                try {
                    const result = serviceInstance[method.methodName](call.request);
                    callback(null, result);
                } catch (error) {

                    if (error instanceof Error) {
                        callback(error);

                    } else {

                        callback(new Error(JSON.stringify(error)));
                    }


                }
            };
        });

        return implementation;
    }
}