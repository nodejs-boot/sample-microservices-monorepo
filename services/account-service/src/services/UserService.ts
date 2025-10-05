import {UserDTO, UserServiceClient} from "../client";
import {Service} from "@nodeboot/core";

@Service()
export class UserService {

    constructor(private readonly userServiceClient: UserServiceClient) {
    }

    async findById(userId: string): Promise<UserDTO> {
        return (await this.userServiceClient.get<UserDTO>(`/users/${userId}`)).data;
    }
}
