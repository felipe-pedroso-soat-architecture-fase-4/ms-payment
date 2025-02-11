import { AxiosAdapter } from "../src/infra/http/HttpClient";
import ClientGatewayHttp from "../src/infra/gateway/ClientGatewayHttp";
import { CreatePayment } from "../src/application/usecase/CreatePayment";
import { KnexAdapter } from "../src/infra/database/QueryBuilderDatabaseConnection";
import  OrderGatewayHttp from "../src/infra/gateway/OrderGatewayHttp";
import { PaymentRepositoryDatabase } from "../src/infra/repository/PaymentRepository";
import { randomUUID } from "crypto";

let connection: KnexAdapter;
let orderGateway: OrderGatewayHttp;
let clientGateway: ClientGatewayHttp;
let paymentRepository: PaymentRepositoryDatabase;

describe('CreatePayment.test', () => {
  
    beforeEach(async () => {
        connection = new KnexAdapter();
        orderGateway = new OrderGatewayHttp(new AxiosAdapter());
        clientGateway = new ClientGatewayHttp(new AxiosAdapter());
        paymentRepository = new PaymentRepositoryDatabase(connection);
    })
    
    it('should create a payment with approved status', async () => {
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
        const createPayment = new CreatePayment(paymentRepository, orderGateway);
        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Pix'
        };

        const payment = await createPayment.execute(paymentData);
        expect(payment.payment_id).toBeDefined();
        expect(payment.status).toBe('approved');
    })

    it('should create a payment with rejected status if payment process failure', async () => {
        jest.spyOn(paymentRepository, 'processPayment').mockImplementationOnce(async (data) => {
            return {
                status: 'rejected',
                payment_id: data.payment_id
            }
        });
        const createPayment = new CreatePayment(paymentRepository, orderGateway);

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
        expect(payment.status).toBe('rejected');
    })

    it('should return an error if the order not found', async () => {

        const createPayment = new CreatePayment(paymentRepository, orderGateway);
        const paymentData = {
            order_id: randomUUID(),
            payment_method: 'Pix'
        };
        await expect(() => createPayment.execute(paymentData)).rejects.toThrow("Order not found");
    })

    it('should return an error if the payment method is invalid', async () => {
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
        const createPayment = new CreatePayment(paymentRepository, orderGateway);
        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Invalid'
        };
        await expect(() => createPayment.execute(paymentData)).rejects.toThrow("Invalid Payment Method");
    })

    afterEach(() => {
        connection.close();
    });
})
