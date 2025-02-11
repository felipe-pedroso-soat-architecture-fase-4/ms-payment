import { AxiosAdapter } from "../src/infra/http/HttpClient";
import ClientGatewayHttp from "../src/infra/gateway/ClientGatewayHttp";
import { CreatePayment } from "../src/application/usecase/CreatePayment";
import { GetPaymentStatus } from "../src/application/usecase/GetPaymentStatus";
import { KnexAdapter } from "../src/infra/database/QueryBuilderDatabaseConnection";
import OrderGatewayHttp from "../src/infra/gateway/OrderGatewayHttp";
import { PaymentRepositoryDatabase } from "../src/infra/repository/PaymentRepository";
import { randomUUID } from "crypto";

describe('GetPaymentStatus', () => {
    let connection: KnexAdapter;
    let orderGateway: OrderGatewayHttp;
    let paymentRepository: PaymentRepositoryDatabase;
    let clientGateway: ClientGatewayHttp;

     beforeEach(() => {
        connection = new KnexAdapter();
        orderGateway = new OrderGatewayHttp(new AxiosAdapter());
        clientGateway = new ClientGatewayHttp(new AxiosAdapter());
        paymentRepository = new PaymentRepositoryDatabase(connection);
    })

    it("should get payment status correctly", async () => {

        const createPayment = new CreatePayment(paymentRepository, orderGateway);
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderGateway);

        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
          };
          
       const outputClient = await clientGateway.registerClient(input)
       const product = await orderGateway.createProduct({
        name: 'Product Test',
        description: 'Product Test',
        price: 100,
        category: 'Test'
       })
       
        const orderData = {
            client_id: outputClient.account_id,
            status: 'open',
            products: [
                {
                    product_id: product.product_id,
                    quantity: 1,
                    price: 100
                }
            ]
        };
       const orderCreated = await orderGateway.createOrder(orderData);

        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Pix'
        };

        const payment = await createPayment.execute(paymentData);
        expect(payment.payment_id).toBeDefined();
        expect(payment.status).toBe('approved');
    
        const paymentStatus = await getPaymentStatus.execute({ order_id: paymentData.order_id });
        expect(paymentStatus).toBe(payment.status);
    })

    it("should return an error if the order not found", async () => {
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderGateway);
       
        await expect(() => getPaymentStatus.execute({ order_id: randomUUID() })).rejects.toThrow("Order not found");
    })

    it("should return an error if the payment not found", async () => {
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderGateway);

        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
          };
          
       const outputClient = await clientGateway.registerClient(input)
       const product = await orderGateway.createProduct({
        name: 'Product Test',
        description: 'Product Test',
        price: 100,
        category: 'Test'
       })
       
        const orderData = {
            client_id: outputClient.account_id,
            status: 'open',
            products: [
                {
                    product_id: product.product_id,
                    quantity: 1,
                    price: 100
                }
            ]
        };
       const orderCreated = await orderGateway.createOrder(orderData);
        
        await expect(() => getPaymentStatus.execute({ order_id: orderCreated.order_id })).rejects.toThrow("Payment not found");
    })

    afterEach(() => {
        connection.close();
    });
})
