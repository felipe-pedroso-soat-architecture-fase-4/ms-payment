import OrderGateway from "../gateway/OrderGateway";
import { PaymentRepository } from "../../infra/repository/PaymentRepository";

export class GetPaymentStatus {
    constructor(readonly paymentRepository: PaymentRepository, readonly orderGateway: OrderGateway) {}

    async execute({ order_id }: Input): Promise<string | undefined> {

        let orderRestored: any;
        try {
            orderRestored = await this.orderGateway.getOrderById(order_id);
        } catch (error: any) {
            throw new Error(error.response.data.message);
        }

        const paymentRestored = await this.paymentRepository.getPaymentByOrderId(orderRestored.order_id);
        if (!paymentRestored) {
            throw new Error("Payment not found");
        }
       
        return paymentRestored.status
    }
}

type Input = {
    order_id: string;
};

