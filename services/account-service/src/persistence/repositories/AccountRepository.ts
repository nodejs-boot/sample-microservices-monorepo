import {DataRepository, MongoPagingAndSortingRepository} from "@nodeboot/starter-persistence";
import {Account} from "../entities/Account";

@DataRepository(Account)
export class AccountRepository extends MongoPagingAndSortingRepository<Account> {}
