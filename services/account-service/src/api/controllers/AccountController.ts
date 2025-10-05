import {Body, Controller, Delete, Get, HttpCode, PagingRequest, Param, Post, Put, QueryParams} from "@nodeboot/core";
import {Logger} from "winston";
import {OpenAPI, ResponseSchema} from "@nodeboot/starter-openapi";
import {NotFoundError} from "@nodeboot/error";
import {AccountService} from "../../services/AccountService";
import {Account} from "../../persistence";
import {CreateAccountRequest} from "../models/CreateAccountRequest";
import {AccountPage} from "../models/AccountPage";

@Controller("/accounts")
export class AccountController {
    constructor(private readonly categoryService: AccountService, private readonly logger: Logger) {
    }

    @Get()
    @OpenAPI({summary: "Get all contract categories with pagination"})
    @ResponseSchema(AccountPage)
    async getAllCategories(@QueryParams() paging: PagingRequest): Promise<AccountPage> {
        this.logger.debug(
            `Getting paginated contract categories: getAll(page=${paging.page},pageSize=${paging.pageSize},sortOrder=${paging.sortOrder},sortField=${paging.sortField})`,
        );
        return this.categoryService.getAll({}, paging);
    }

    @Get("/:slug")
    @OpenAPI({summary: "Get contract category by slug"})
    @ResponseSchema(Account)
    async getCategoryBySlug(@Param("slug") slug: string): Promise<Account> {
        this.logger.debug(`Getting contract category by slug: getBySlug(slug=${slug})`);
        return (await this.categoryService.getBySlug(slug)).orElseThrow(
            () => new NotFoundError(`No category found for slug ${slug}`),
        );
    }

    @Post()
    @HttpCode(201)
    @OpenAPI({summary: "Register a new contract category"})
    @ResponseSchema(Account)
    async createCategory(@Body() request: CreateAccountRequest): Promise<Account> {
        this.logger.debug(`Registering a new contract category: register(slug=${request.slug})`);
        return this.categoryService.create(request);
    }

    @Put()
    @OpenAPI({summary: "Update an existing contract category"})
    @ResponseSchema(Account)
    async updateCategory(@Body() request: Partial<Account>): Promise<Account> {
        this.logger.debug(`Updating an existing contract category: update(slug=${request.slug})`);
        return this.categoryService.update(request);
    }

    @Delete("/:slug")
    @OpenAPI({summary: "Unregister a contract category"})
    async deleteCategory(@Param("slug") slug: string) {
        this.logger.debug(`Unregistering an existing contract category: unregister(slug=${slug})`);
        await this.categoryService.delete(slug);
        return {message: `contract category with slug ${slug} successfully unregistered`};
    }
}
