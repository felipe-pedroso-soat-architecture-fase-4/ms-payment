import HttpClient from "../http/HttpClient";
import OrderGateway from "../../application/gateway/OrderGateway";

export default class OrderGatewayHttp implements OrderGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async getOrderById(orderId: string): Promise<any> {
        return this.httpClient.get(`${process.env.API_ORDER_GATEWAY}/orders/${orderId}`);
    }

    async updateStatus({ order_id, ...rest }: any): Promise<any> {
        return this.httpClient.put(`${process.env.API_ORDER_GATEWAY}/orders/status/${order_id}`, {
            ...rest,
            order_id,
        });
    }
    async createOrder(input: any): Promise<any> {
        return this.httpClient.post(`${process.env.API_ORDER_GATEWAY}/orders`, input);
    }

    async createProduct(input: any): Promise<any> {
        return this.httpClient.post(`${process.env.API_ORDER_GATEWAY}/products`, input);
    }
}
