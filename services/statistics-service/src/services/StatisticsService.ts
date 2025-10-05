import {Logger} from "winston";
import {Page, PagingRequest, Service} from "@nodeboot/core";
import {FindOptionsWhere} from "typeorm";
import {StatisticsRepository, Statistics} from "../persistence";

@Service()
export class StatisticsService {

    constructor(
        private readonly logger: Logger,
        private readonly statisticsRepository: StatisticsRepository,
    ) {
    }

    public async getAll(
        filter: FindOptionsWhere<Statistics>,
        paging: PagingRequest,
    ): Promise<Page<Statistics>> {
        this.logger.info("Getting all statistics");
        return this.statisticsRepository.findPaginated(filter, paging);
    }

    public async getByEventType(eventType: string, paging: PagingRequest): Promise<Page<Statistics>> {
        this.logger.info(`Getting statistics by event type: ${eventType}`);
        return this.statisticsRepository.findPaginated({eventType}, paging);
    }

    public async getByUserId(userId: string, paging: PagingRequest): Promise<Page<Statistics>> {
        this.logger.info(`Getting statistics by user ID: ${userId}`);
        return this.statisticsRepository.findPaginated({userId}, paging);
    }

    public async recordEvent(eventData: {
        eventType: string;
        entityId: string;
        entitySlug: string;
        userId: string;
        metadata?: any;
    }): Promise<Statistics> {
        this.logger.info(`Recording statistics event: ${eventData.eventType} for entity ${eventData.entityId}`);

        const statistics = new Statistics();
        statistics.eventType = eventData.eventType;
        statistics.entityId = eventData.entityId;
        statistics.entitySlug = eventData.entitySlug;
        statistics.userId = eventData.userId;
        statistics.metadata = eventData.metadata || {};

        return this.statisticsRepository.save(statistics);
    }

    public async getEventCounts(): Promise<{[eventType: string]: number}> {
        this.logger.info("Getting event counts by type");

        // Using aggregation to count events by type
        const results = await this.statisticsRepository.aggregate([
            {
                $group: {
                    _id: "$eventType",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        const counts: {[eventType: string]: number} = {};
        results.forEach((result: any) => {
            counts[result._id] = result.count;
        });

        return counts;
    }
}
