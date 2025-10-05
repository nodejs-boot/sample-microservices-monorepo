import {Page} from "@nodeboot/core";
import {Model} from "@nodeboot/starter-openapi";
import {Statistics} from "../../persistence";

@Model({T: Statistics})
export class StatisticsPage extends Page<Statistics> {
}
