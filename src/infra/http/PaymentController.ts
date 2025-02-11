import { CreatePayment } from "../../application/usecase/CreatePayment";
import { GetPaymentStatus } from "../../application/usecase/GetPaymentStatus";
import HttpServer from "./HttpServer";

export default class PaymentController {
    constructor(readonly httpServer: HttpServer, readonly createPayment: CreatePayment, readonly getPaymentStatus: GetPaymentStatus) {
        httpServer.register("post", "/payments", async (req: any) => {
            const output = await createPayment.execute(req.body);
            return output;
        });
        httpServer.register("get", "/payments/status/:order_id", async (req: any) => {
            const output = await getPaymentStatus.execute(req.params);
            return output;
        });
    }
}