import {DataRepository, MongoPagingAndSortingRepository} from "@nodeboot/starter-persistence";
import {User} from "../entities/User";

@DataRepository(User)
export class UserRepository extends MongoPagingAndSortingRepository<User> {}
