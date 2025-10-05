import {Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn} from "typeorm";
import {Model} from "@nodeboot/starter-openapi";
import {ACCOUNTS_COLLECTION} from "../contants";

@Model()
@Entity(ACCOUNTS_COLLECTION)
export class Account {
    @ObjectIdColumn()
    id: string;

    @Column()
    slug: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
