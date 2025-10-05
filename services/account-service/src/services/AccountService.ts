import {Logger} from "winston";
import {Page, PagingRequest, Service} from "@nodeboot/core";
import {BadRequestError, NotFoundError} from "@nodeboot/error";
import {FindOptionsWhere} from "typeorm";
import {Optional} from "katxupa";
import {Account, AccountRepository} from "../persistence";
import {UserService} from "./UserService";
import {StatisticsService} from "./StatisticsService";

@Service()
export class AccountService {

    constructor(
        private readonly logger: Logger,
        private readonly accountRepository: AccountRepository,
        private readonly userService: UserService,
        private readonly statisticsService: StatisticsService,
    ) {
    }

    public async getAll(
        filter: FindOptionsWhere<Account>,
        paging: PagingRequest,
    ): Promise<Page<Account>> {
        this.logger.info("Getting all accounts");
        return this.accountRepository.findPaginated(filter, paging);
    }

    public async getBySlug(slug: string): Promise<Optional<Account>> {
        const account = await this.accountRepository.findOneBy({slug});
        return optionalOf(account);
    }

    public async create(account: Partial<Account>): Promise<Account> {
        optionalOf(account.userId).orElseThrow(
            () => new BadRequestError(`Invalid Account creation request. Account userId is required`),
        );

        const existingAccount = await this.accountRepository.findOneBy({
            slug: account.slug,
        });

        optionalOf(existingAccount).ifPresentThrow(
            () => new BadRequestError(`An account is already registered with "${account.slug}" slug`)
        );

        // Verify that the userId exists in the User Service
        optionalOf((await this.userService.findById(account.userId!))).orElseThrow(
            () => new BadRequestError(`Invalid Account creation request. User with id ${account.userId} doesn't exist`),
        );

        const savedAccount = await this.accountRepository.save(account);

        // Send statistics event for account creation
        await this.statisticsService.recordEvent({
            eventType: "account_created",
            entityId: savedAccount.id,
            entitySlug: savedAccount.slug,
            userId: savedAccount.userId,
            metadata: {
                name: savedAccount.name,
                description: savedAccount.description,
                score: savedAccount.score
            }
        });

        return savedAccount;
    }

    public async update(data: Partial<Account>): Promise<Account> {
        optionalOf(data.slug).orElseThrow(
            () => new BadRequestError(`Invalid Account update request. Account slug is required during update`),
        );
        optionalOf(data.id).ifPresentThrow(
            () => new BadRequestError(`Invalid Account update request. Account id is forbidden during update`),
        );
        optionalOf(data.userId).ifPresentThrow(
            () => new BadRequestError(`Invalid Account update request. Account userId is forbidden during update`),
        );

        const existingCategory = await this.accountRepository.findOneBy({
            slug: data.slug,
        });

        if (!existingCategory) {
            throw new NotFoundError(`Account with slug ${data.slug} doesn't exist`);
        }

        const updatedAccount = await this.accountRepository.save({
            ...existingCategory,
            ...data,
        });

        // Send statistics event for account update
        await this.statisticsService.recordEvent({
            eventType: "account_updated",
            entityId: updatedAccount.id,
            entitySlug: updatedAccount.slug,
            userId: updatedAccount.userId,
            metadata: {
                updatedFields: Object.keys(data),
                previousValues: existingCategory,
                newValues: updatedAccount
            }
        });

        return updatedAccount;
    }

    public async delete(accountSlug: string): Promise<void> {
        const existingAccount = await this.accountRepository.findOneBy({
            slug: accountSlug,
        });

        if (!existingAccount) {
            throw new NotFoundError(`Account with slug ${accountSlug} doesn't exist`);
        }

        await this.accountRepository.delete({id: existingAccount.id});

        // Send statistics event for account deletion
        await this.statisticsService.recordEvent({
            eventType: "account_deleted",
            entityId: existingAccount.id,
            entitySlug: existingAccount.slug,
            userId: existingAccount.userId,
            metadata: {
                deletedAccount: existingAccount
            }
        });
    }
}
