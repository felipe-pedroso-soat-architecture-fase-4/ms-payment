import ClientGateway from "../../application/gateway/ClientGateway";
import HttpClient from "../http/HttpClient";

//interface adapter
export default class ClientGatewayHttp implements ClientGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async registerClient(input: any): Promise<any> {
        return this.httpClient.post(`${process.env.API_CLIENT_GATEWAY}/clients`, input);
    }

    async getClientById(clientId: string): Promise<any> {
        return this.httpClient.get(`${process.env.API_CLIENT_GATEWAY}/clients/${clientId}`); 
    }
}