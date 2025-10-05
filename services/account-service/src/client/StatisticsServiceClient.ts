import {HttpClient, HttpClientStub} from "@nodeboot/starter-http";

@HttpClient("${integrations.http.statistics-service}")
export class StatisticsServiceClient extends HttpClientStub {
}
