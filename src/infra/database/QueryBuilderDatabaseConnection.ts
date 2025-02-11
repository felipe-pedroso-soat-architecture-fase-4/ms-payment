import knex, { Knex } from "knex";

import { config } from "./config";

export default interface QueryBuilderDatabaseConnection<T> {
    builder(): T;
    close(): Promise<void>;
}

export class KnexAdapter implements QueryBuilderDatabaseConnection<Knex> {
    private connection: any;

    constructor() {
        const environment = process.env.NODE_ENV || "development";
        this.connection = knex(config[environment]);
    }

    builder(): Knex {
        return this.connection;
    }
    async close(): Promise<void> {
        await this.connection.destroy();
    }
}