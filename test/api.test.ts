import axios from "axios";
import dotenv from 'dotenv';
import { randomUUID } from "crypto";

dotenv.config();

axios.defaults.validateStatus = function () {
  return true;
};

describe('Payment', () => {
  
  it("should create a payment correctly [approved]", async () => {
    const input = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
   
    const responseClient = await axios.post(
      `${process.env.API_CLIENT_GATEWAY}/clients`,
      input,
    );
   
    const client_id = responseClient.data.account_id;
    const product = {
      name: "Product Test",
      description: "Product Test Description",
      price: 10.0,
      category: "Test",
    };
    const responseProduct = await axios.post(
      `${process.env.API_ORDER_GATEWAY}/products`,
      product,
    );
    const product_id = responseProduct.data.product_id;

    const order = {
      client_id,
      products: [
        {
          product_id,
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_ORDER_GATEWAY}/orders`,
      order,
    );
    const order_id = responseOrder.data.order_id;

    const payment = {
      order_id,
      payment_method: "Pix",
    };
    const responsePayment = await axios.post(
      `${process.env.API_URL}:${process.env.API_PORT}/payments`,
      payment,
    );
    const outputPayment = responsePayment.data;
    expect(outputPayment.payment_id).toBeDefined();
    expect(outputPayment.status).toBe("approved");
  });

  it("should return an error if the order not found", async () => {
    const payment = {
      order_id: randomUUID(),
      payment_method: "credit",
    };
    const responsePayment = await axios.post(
      `${process.env.API_URL}:${process.env.API_PORT}/payments`,
      payment,
    );
    expect(responsePayment.status).toBe(422);
    expect(responsePayment.data.message).toBe("Order not found");
  });

  it("should get payment status correctly", async () => {
    const client = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      `${process.env.API_CLIENT_GATEWAY}/clients`,
      client,
    );
  
    const client_id = responseClient.data.account_id;

    const product = {
      name: "Product Test",
      description: "Product Test Description",
      price: 10.0,
      category: "Test",
    };
    const responseProduct = await axios.post(
      `${process.env.API_ORDER_GATEWAY}/products`,
      product,
    );
  
    const product_id = responseProduct.data.product_id;

    const order = {
      client_id,
      products: [
        {
          product_id,
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_ORDER_GATEWAY}/orders`,
      order,
    );
  
    const order_id = responseOrder.data.order_id;

    const payment = {
      order_id,
      payment_method: "Pix",
    };
    const responsePayment = await axios.post(
      `${process.env.API_URL}:${process.env.API_PORT}/payments`,
      payment,
    );
   
    const outputPayment = responsePayment.data;

    const responsePaymentStatus = await axios.get(
      `${process.env.API_URL}:${process.env.API_PORT}/payments/status/${order_id}`,
    );
    const outputPaymentStatus = responsePaymentStatus.data;
    expect(outputPaymentStatus).toBe(outputPayment.status);
  });
})

