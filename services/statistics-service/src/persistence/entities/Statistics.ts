import {Column, CreateDateColumn, Entity, ObjectIdColumn} from "typeorm";
import {Model} from "@nodeboot/starter-openapi";
import {STATISTICS_COLLECTION} from "../constants";

@Model()
@Entity(STATISTICS_COLLECTION)
export class Statistics {
    @ObjectIdColumn()
    id: string;

    @Column()
    eventType: string; // account_created, account_updated, account_deleted

    @Column()
    entityId: string; // ID of the account that triggered the event

    @Column()
    entitySlug: string; // Slug of the account that triggered the event

    @Column()
    userId: string; // User ID associated with the account

    @Column()
    metadata: any; // Additional metadata about the event

    @CreateDateColumn()
    createdAt: Date;
}
