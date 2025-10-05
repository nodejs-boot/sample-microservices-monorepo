import {StatisticsEvent, StatisticsServiceClient} from "../client";
import {Service} from "@nodeboot/core";
import {Logger} from "winston";

@Service()
export class StatisticsService {

    constructor(
        private readonly logger: Logger,
        private readonly statisticsServiceClient: StatisticsServiceClient
    ) {
    }

    async recordEvent(eventData: StatisticsEvent): Promise<void> {
        try {
            this.logger.debug(`Sending statistics event: ${eventData.eventType} for entity ${eventData.entityId}`);
            await this.statisticsServiceClient.post("/statistics", eventData);
            this.logger.info(`Successfully recorded statistics event: ${eventData.eventType}`);
        } catch (error) {
            this.logger.error(`Failed to record statistics event: ${eventData.eventType}`, error);
            // Don't throw error to avoid breaking the main operation
        }
    }
}
