import "reflect-metadata";

export function tgrpcService(serviceName: string) {
    return (target: any) => {
        Reflect.defineMetadata(
            "tgrpc:service",
            serviceName,
            target.prototype.constructor
        );
    };
}


export function tgrpcMethod(methodName?: string) {
    return (
        target: Object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        Reflect.defineMetadata(
            "tgrpc:method",
            methodName || propertyKey,
            descriptor.value
        );
    };
}