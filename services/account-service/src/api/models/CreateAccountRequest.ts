import {IsNotEmpty, IsPositive} from "class-validator";
import {Property} from "@nodeboot/core";
import {Model} from "@nodeboot/starter-openapi";

@Model()
export class CreateAccountRequest {
    @IsNotEmpty()
    @Property({
        required: true,
        description: "Unique identifier of the account",
    })
    slug: string;

    @IsNotEmpty()
    @Property({
        required: true,
        description: "Unique identifier of the user",
    })
    userId: string;

    @IsNotEmpty()
    @Property({required: true, description: "Human readable name of the account, may be displayed in the UI"})
    name: string;

    @Property({description: "Human readable description of the account, may be displayed in the UI"})
    description?: string;

    @IsPositive()
    @Property({required: false, description: "Account score for ranking purposes"})
    score: number;
}
