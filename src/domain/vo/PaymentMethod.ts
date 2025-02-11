export class PaymentMethod {
  private value: string
  constructor(paymentMethod: string) {
    const isPaymentMethodValid = !!paymentMethod.match(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    );

    if (!isPaymentMethodValid) {
      throw new Error("Invalid Payment Method");
    }

    const  isPixMethod = paymentMethod === "Pix"
    if (!isPixMethod) {
        throw new Error("Invalid Payment Method")
    }
    
    this.value = paymentMethod
  }
  getValue() {
    return this.value
  }
}