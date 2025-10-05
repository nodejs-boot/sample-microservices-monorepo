import {Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn} from "typeorm";
import {Model} from "@nodeboot/starter-openapi";
import {USERS_COLLECTION} from "../contants";

@Model()
@Entity(USERS_COLLECTION)
export class User {
    @ObjectIdColumn()
    id: string;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phoneNumber?: string;

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
