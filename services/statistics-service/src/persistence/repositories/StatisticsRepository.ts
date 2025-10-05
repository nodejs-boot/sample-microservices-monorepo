import {DataRepository, MongoPagingAndSortingRepository} from "@nodeboot/starter-persistence";
import {Statistics} from "../entities";

@DataRepository(Statistics)
export class StatisticsRepository extends MongoPagingAndSortingRepository<Statistics> {}
