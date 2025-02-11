import { Knex } from "knex";
import Payment from "../../domain/entity/Payment";
import QueryBuilderDatabaseConnection from "../database/QueryBuilderDatabaseConnection";

// [Driven] Port
export interface PaymentRepository {
    savePayment(payment: Payment): Promise<void>;
    processPayment(payment: Payment): Promise<{ payment_id: string, status: string }>;
    updateStatus(payment: Payment): Promise<Payment>;
    getPaymentByOrderId(order_id: string): Promise<Payment | undefined>;
}

// [Driven] Adapter
export class PaymentRepositoryDatabase implements PaymentRepository {
    private db: Knex;
    constructor(readonly databaseConnection: QueryBuilderDatabaseConnection<Knex>) {
        this.db = this.databaseConnection.builder();
    }
  
    async savePayment(payment: Payment): Promise<void> {
        const trx = await this.db.transaction();
        try {
            await trx("payments").insert({
                payment_id: payment.payment_id,
                order_id: payment.order_id,
                payment_method: payment.getPaymentMethod(),
                amount: payment.amount,
                status: payment.status 
            });

            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
    async processPayment(payment: Payment): Promise<{ payment_id: string, status: string }> {
        const trx = await this.db.transaction();

        //processa o pagamento com uma instituicao de pagamento
        const newStatus  = 'approved';

        return { payment_id: payment.payment_id, status: newStatus };
    }
    async updateStatus(payment: Payment): Promise<Payment> {
        const trx = await this.db.transaction();
        try {
            await trx("payments").where({ payment_id: payment.payment_id }).update({
                status: payment.status
            });

            await trx.commit();
            return payment;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
 
    async getPaymentByOrderId(order_id: string): Promise<Payment | undefined> {
        const payment = await this.db<any>("payments").where({ order_id }).select("*").first();
        if (!payment) return undefined;
        return Payment.restore(payment.payment_id, payment.order_id, payment.payment_method, payment.amount, payment.status);
    }
}
