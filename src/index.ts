
import { TygrpcServer } from "./tygrpc-server";
import {ReflectServiceRegistry} from "./features/decorators/infrastructure/reflect-service-registry";
import {BasicProtoGenerator} from "./features/proto-generation/infrastructure/basic-proto-generator";
import {GrpcServer} from "./features/server/infrastructure/grpc-server";

export const createTygrpcServer = () => {
    const serviceRegistry = new ReflectServiceRegistry();
    const protoGenerator = new BasicProtoGenerator();
    const server = new GrpcServer(serviceRegistry.getAll(), []);

    return new TygrpcServer(serviceRegistry, protoGenerator, server);
};