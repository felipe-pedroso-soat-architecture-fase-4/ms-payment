export default interface ClientGateway {
    getClientById(clientId: string): Promise<any>;
    registerClient(input: any): Promise<any>;
}
