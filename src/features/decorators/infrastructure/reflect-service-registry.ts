import {ServiceRegistry} from "../domain/service-registry";
import {MethodMetadata, ServiceMetadata} from "../domain/service-metadata";

export class ReflectServiceRegistry implements ServiceRegistry {
    private services: ServiceMetadata[] = [];

    register(service: Function): void {
        const name = Reflect.getMetadata("tgrpc:service", service);
        const methods = this.getMethods(service.prototype);

        this.services.push({ name, methods });
    }

    private getMethods(prototype: any): MethodMetadata[] {
        return Object.getOwnPropertyNames(prototype)
            .filter(method => method !== "constructor")
            .map(methodName => ({
                methodName,
                rpcName: Reflect.getMetadata("tgrpc:method", prototype[methodName]) || methodName
            }));
    }

    getAll(): ServiceMetadata[] {
        return [...this.services];
    }
}