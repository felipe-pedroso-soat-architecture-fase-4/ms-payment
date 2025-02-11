export default interface OrderGateway {
    getOrderById(orderId: string): Promise<any>;
    updateStatus(input: any): Promise<any>;
    createOrder(input: any): Promise<any>; 
    createProduct(input: any): Promise<any>;
}