import {Body, Controller, Get, HttpCode, PagingRequest, Param, Post, QueryParams} from "@nodeboot/core";
import {Logger} from "winston";
import {OpenAPI, ResponseSchema} from "@nodeboot/starter-openapi";
import {StatisticsService} from "../../services/StatisticsService";
import {Statistics} from "../../persistence";
import {RecordStatisticsRequest, StatisticsPage} from "../models";

@Controller("/statistics")
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService, private readonly logger: Logger) {
    }

    @Get()
    @OpenAPI({summary: "Get all statistics with pagination"})
    @ResponseSchema(StatisticsPage)
    async getAllStatistics(@QueryParams() paging: PagingRequest): Promise<StatisticsPage> {
        this.logger.debug(
            `Getting paginated statistics: getAll(page=${paging.page},pageSize=${paging.pageSize},sortOrder=${paging.sortOrder},sortField=${paging.sortField})`,
        );
        return this.statisticsService.getAll({}, paging);
    }

    @Get("/event-type/:eventType")
    @OpenAPI({summary: "Get statistics by event type"})
    @ResponseSchema(StatisticsPage)
    async getStatisticsByEventType(
        @Param("eventType") eventType: string,
        @QueryParams() paging: PagingRequest
    ): Promise<StatisticsPage> {
        this.logger.debug(`Getting statistics by event type: getByEventType(eventType=${eventType})`);
        return this.statisticsService.getByEventType(eventType, paging);
    }

    @Get("/user/:userId")
    @OpenAPI({summary: "Get statistics by user ID"})
    @ResponseSchema(StatisticsPage)
    async getStatisticsByUserId(
        @Param("userId") userId: string,
        @QueryParams() paging: PagingRequest
    ): Promise<StatisticsPage> {
        this.logger.debug(`Getting statistics by user ID: getByUserId(userId=${userId})`);
        return this.statisticsService.getByUserId(userId, paging);
    }

    @Get("/counts")
    @OpenAPI({summary: "Get event counts by type"})
    async getEventCounts(): Promise<{ [eventType: string]: number }> {
        this.logger.debug("Getting event counts by type");
        return this.statisticsService.getEventCounts();
    }

    @Post()
    @HttpCode(201)
    @OpenAPI({summary: "Record a new statistics event"})
    @ResponseSchema(Statistics)
    async recordEvent(@Body() request: RecordStatisticsRequest): Promise<Statistics> {
        this.logger.debug(`Recording statistics event: recordEvent(eventType=${request.eventType}, entityId=${request.entityId})`);
        return this.statisticsService.recordEvent(request);
    }
}
