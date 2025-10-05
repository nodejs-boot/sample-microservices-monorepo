import "reflect-metadata";
import {Container} from "typedi";
import {NodeBoot, NodeBootApp, NodeBootApplication, NodeBootAppView} from "@nodeboot/core";
import {FastifyServer} from "@nodeboot/fastify-server";
import {EnableRepositories} from "@nodeboot/starter-persistence";
import {EnableDI} from "@nodeboot/di";
import {EnableActuator} from "@nodeboot/starter-actuator";
import {EnableOpenApi, EnableSwaggerUI} from "@nodeboot/starter-openapi";
import {EnableComponentScan} from "@nodeboot/aot";
import {EnableHttpClients} from "@nodeboot/starter-http";
import {EnableValidations} from "@nodeboot/starter-validation";

@EnableDI(Container)
@EnableOpenApi()
@EnableSwaggerUI()
@EnableActuator()
@EnableRepositories()
@EnableHttpClients()
@EnableValidations()
@EnableComponentScan()
@NodeBootApplication()
export class StatisticsApplication implements NodeBootApp {
    start(): Promise<NodeBootAppView> {
        return NodeBoot.run(FastifyServer);
    }
}
