export interface ServiceMetadata {
    name: string;
    methods: MethodMetadata[];
}

export interface MethodMetadata {
    methodName: string;
    rpcName: string;
}