import {Page} from "@nodeboot/core";
import {Model} from "@nodeboot/starter-openapi";
import {Account} from "../../persistence";

@Model({T: Account})
export class AccountPage extends Page<Account> {}
