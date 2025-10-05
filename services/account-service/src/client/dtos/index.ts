export interface StatisticsEvent {
    eventType: string;
    entityId: string;
    entitySlug: string;
    userId: string;
    metadata?: any;
}

export type UserDTO = {
    id: string;
    username: string;
    email: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}
