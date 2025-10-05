import {HttpClient, HttpClientStub} from "@nodeboot/starter-http";

@HttpClient("${integrations.http.user-service}")
export class UserServiceClient extends HttpClientStub {}
