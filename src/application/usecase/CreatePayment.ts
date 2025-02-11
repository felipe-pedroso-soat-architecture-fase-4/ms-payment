import OrderGateway from "../gateway/OrderGateway";
import Payment from "../../domain/entity/Payment";
import { PaymentRepository } from "../../infra/repository/PaymentRepository";

export class CreatePayment {
  constructor(readonly paymentRepository: PaymentRepository, readonly orderGateway: OrderGateway) {}

  async execute({ order_id, payment_method }: Input): Promise<Output> {
    let orderRestored: any;
    try {
      orderRestored = await this.orderGateway.getOrderById(order_id);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
    
    const amount = Payment.calculateTotalPrice(orderRestored.products);
    const payment = Payment.create(order_id, payment_method, amount);
    await this.paymentRepository.savePayment(payment);
    const processPayment = await this.paymentRepository.processPayment(payment);
    
    if (processPayment.status === 'approved') {
        payment.approve();
        await this.paymentRepository.updateStatus(payment);

       const newOrderRestored = {
            ...orderRestored,
            status: 'received'
       }
      await this.orderGateway.updateStatus(newOrderRestored);
    } else {
        payment.reject();
        await this.paymentRepository.updateStatus(payment);
    }

    return {
      payment_id: payment.payment_id,
      status: payment.status
    };
  }
}

type Input = {
  order_id: string;
  payment_method: string;
};

type Output = {
  payment_id: string;
  status: string;
};