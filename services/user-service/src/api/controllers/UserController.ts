
import {Body, Controller, Delete, Get, HttpCode, PagingRequest, Param, Post, Put, QueryParams} from "@nodeboot/core";
import {Logger} from "winston";
import {OpenAPI, ResponseSchema} from "@nodeboot/starter-openapi";
import {NotFoundError} from "@nodeboot/error";
import {UserService} from "../../services/UserService";
import {User} from "../../persistence";
import {CreateUserRequest, UserPage} from "../models";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService, private readonly logger: Logger) {
    }

    @Get()
    @OpenAPI({summary: "Get all users with pagination"})
    @ResponseSchema(UserPage)
    async getAllUsers(@QueryParams() paging: PagingRequest): Promise<UserPage> {
        this.logger.debug(
            `Getting paginated users: getAll(page=${paging.page},pageSize=${paging.pageSize},sortOrder=${paging.sortOrder},sortField=${paging.sortField})`,
        );
        return this.userService.getAll({}, paging);
    }

    @Get("/:id")
    @OpenAPI({summary: "Get user by id"})
    @ResponseSchema(User)
    async getUserById(@Param("id") id: string): Promise<User> {
        this.logger.debug(`Getting user by id: getById(id=${id})`);
        return (await this.userService.findById(id)).orElseThrow(
            () => new NotFoundError(`No user found for id ${id}`),
        );
    }

    @Post()
    @HttpCode(201)
    @OpenAPI({summary: "Register a new user"})
    @ResponseSchema(User)
    async createUser(@Body() request: CreateUserRequest): Promise<User> {
        this.logger.debug(`Registering a new user: register(email=${request.email})`);
        return this.userService.create(request);
    }

    @Put()
    @OpenAPI({summary: "Update an existing user"})
    @ResponseSchema(User)
    async updateUser(@Body() request: Partial<User>): Promise<User> {
        this.logger.debug(`Updating an existing user: update(id=${request.id})`);
        return this.userService.update(request);
    }

    @Delete("/:id")
    @OpenAPI({summary: "Delete a user"})
    async deleteUser(@Param("id") id: string) {
        this.logger.debug(`Deleting user: delete(id=${id})`);
        await this.userService.delete(id);
        return {message: `User with id ${id} successfully deleted`};
    }

    @Put("/:id/deactivate")
    @OpenAPI({summary: "Deactivate a user"})
    @ResponseSchema(User)
    async deactivateUser(@Param("id") id: string): Promise<User> {
        this.logger.debug(`Deactivating user: deactivate(id=${id})`);
        return this.userService.deactivate(id);
    }

    @Put("/:id/activate")
    @OpenAPI({summary: "Activate a user"})
    @ResponseSchema(User)
    async activateUser(@Param("id") id: string): Promise<User> {
        this.logger.debug(`Activating user: activate(id=${id})`);
        return this.userService.activate(id);
    }
}
