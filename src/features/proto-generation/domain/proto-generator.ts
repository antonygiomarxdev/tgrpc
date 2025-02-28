import {ServiceMetadata} from "../../decorators/domain/service-metadata";

export interface ProtoGenerator {
    generate(services: ServiceMetadata[]): string;
}