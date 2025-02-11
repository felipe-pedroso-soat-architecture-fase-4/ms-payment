import { PaymentMethod } from "../vo/PaymentMethod";
import { randomUUID } from "crypto";

export default class Payment {
    status: string;
     
    private constructor(
        readonly payment_id: string,
        readonly order_id: string,
        private payment_method: PaymentMethod,
        readonly amount: number,
        status: string,
    ) {
        this.status = status;
    }

    //static factory method
    static create(
        order_id: string,
        payment_method: string,
        amount: number,
    ) {
        const payment_id = randomUUID();
        const status = "pending";
        return new Payment(payment_id, order_id, new PaymentMethod(payment_method), amount, status);
    }

    //static factory method
    static restore(
        payment_id: string,
        order_id: string,
        payment_method: string,
        amount: number,
        status: string,
    ) {
        return new Payment(payment_id, order_id,  new PaymentMethod(payment_method), amount, status);
    }

    static calculateTotalPrice(products: any[]): number {
        return products.reduce((total, product) => total + product.price, 0);
    }

    approve() {
        this.status = "approved";
    }

    reject() {
        this.status = "rejected";
    }

    getPaymentMethod(): string {
        return this.payment_method.getValue();
    }
}