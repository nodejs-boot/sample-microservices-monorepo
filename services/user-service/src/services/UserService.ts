import {Logger} from "winston";
import {Page, PagingRequest, Service} from "@nodeboot/core";
import {BadRequestError, NotFoundError} from "@nodeboot/error";
import {FindOptionsWhere} from "typeorm";
import {Optional} from "katxupa";
import {User, UserRepository} from "../persistence";

@Service()
export class UserService {
    constructor(
        private readonly logger: Logger,
        private readonly userRepository: UserRepository,
    ) {
    }

    public async getAll(
        filter: FindOptionsWhere<User>,
        paging: PagingRequest,
    ): Promise<Page<User>> {
        this.logger.info("Getting all users");
        return this.userRepository.findPaginated(filter, paging);
    }

    public async findById(id: string): Promise<Optional<User>> {
        const user = await this.userRepository.findOneBy({id});
        return optionalOf(user);
    }

    public async findByEmail(email: string): Promise<Optional<User>> {
        const user = await this.userRepository.findOneBy({email});
        return optionalOf(user);
    }

    public async create(user: Partial<User>): Promise<User> {
        optionalOf(user.email).orElseThrow(
            () => new BadRequestError(`Invalid User creation request. User email is required`),
        );

        optionalOf(user.firstName).orElseThrow(
            () => new BadRequestError(`Invalid User creation request. User firstName is required`),
        );

        optionalOf(user.lastName).orElseThrow(
            () => new BadRequestError(`Invalid User creation request. User lastName is required`),
        );

        const existingUser = await this.userRepository.findOneBy({
            email: user.email,
        });

        optionalOf(existingUser).ifPresentThrow(
            () => new BadRequestError(`A user is already registered with "${user.email}" email`)
        );

        return this.userRepository.save({
            ...user,
            isActive: user.isActive ?? true
        });
    }

    public async update(data: Partial<User>): Promise<User> {
        optionalOf(data.id).orElseThrow(
            () => new BadRequestError(`Invalid User update request. User id is required during update`),
        );

        const existingUser = optionalOf(await this.userRepository.findOneBy({id: data.id}))
            .orElseThrow(() => new NotFoundError(`User with id ${data.id} doesn't exist`));

        // Check if email is being changed and if it's already taken
        if (data.email && data.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findOneBy({
                email: data.email,
            });
            optionalOf(userWithEmail).ifPresentThrow(
                () => new BadRequestError(`A user is already registered with "${data.email}" email`)
            );
        }

        return this.userRepository.save({
            ...existingUser,
            ...data,
        });
    }

    public async delete(id: string): Promise<void> {
        optionalOf(await this.userRepository.findOneBy({id}))
            .orElseThrow(() => new NotFoundError(`User with id ${id} doesn't exist`));

        await this.userRepository.delete(id);
    }

    public async deactivate(id: string): Promise<User> {
        return this.update({id, isActive: false});
    }

    public async activate(id: string): Promise<User> {
        return this.update({id, isActive: true});
    }
}
