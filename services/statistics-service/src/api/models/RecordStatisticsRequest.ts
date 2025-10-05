import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Model} from "@nodeboot/starter-openapi";

@Model()
export class RecordStatisticsRequest {
    @IsNotEmpty()
    @IsString()
    eventType: string;

    @IsNotEmpty()
    @IsString()
    entityId: string;

    @IsNotEmpty()
    @IsString()
    entitySlug: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsOptional()
    metadata?: any;
}
