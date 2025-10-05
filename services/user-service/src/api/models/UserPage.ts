import {Model} from "@nodeboot/starter-openapi";
import {Page} from "@nodeboot/core";
import {User} from "../../persistence";

@Model({T:User})
export class UserPage extends Page<User> {}
