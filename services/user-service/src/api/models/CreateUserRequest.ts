import {IsEmail, IsString, IsOptional, MinLength, MaxLength} from "class-validator";
import {Model} from "@nodeboot/starter-openapi";

@Model()
export class CreateUserRequest {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    firstName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    lastName: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}
