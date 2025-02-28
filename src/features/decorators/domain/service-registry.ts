import {ServiceMetadata} from "./service-metadata";

export interface ServiceRegistry {
    register(service: Function): void;
    getAll(): ServiceMetadata[];
}