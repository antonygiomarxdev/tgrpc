import {ServiceRegistry} from "./features/decorators/domain/service-registry";
import {ProtoGenerator} from "./features/proto-generation/domain/proto-generator";
import {Server} from "./features/server/domain/server";

export class TygrpcServer {
    private serviceClasses: (new () => object)[] = [];

    constructor(
        private serviceRegistry: ServiceRegistry,
        private protoGenerator: ProtoGenerator,
        private server: Server
    ) {}

    addService(service: new () => object): void { // Tipo modificado
        this.serviceRegistry.register(service.prototype.constructor);
        this.serviceClasses.push(service);
    }


    start(port: number = 50051): void {
        this.server.start(port);
    }
}