import { AxiosAdapter } from "./src/infra/http/HttpClient";
import { CreatePayment } from "./src/application/usecase/CreatePayment";
import { ExpressAdapter } from "./src/infra/http/HttpServer";
import { GetPaymentStatus } from "./src/application/usecase/GetPaymentStatus";
import { KnexAdapter } from "./src/infra/database/QueryBuilderDatabaseConnection";
import OrderGatewayHttp from "./src/infra/gateway/OrderGatewayHttp";
import PaymentController from "./src/infra/http/PaymentController";
import { PaymentRepositoryDatabase } from "./src/infra/repository/PaymentRepository";
import { config } from "./src/infra/database/config";
import dotenv from 'dotenv';
import knex from "knex";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const port = Number(process.env.API_PORT || 3000);

const defaultConfig = config[environment]
const defaultConfigPostgres = {
  ...defaultConfig,
  connection: typeof defaultConfig.connection === 'object' ? { ...defaultConfig.connection, database: 'postgres' } : defaultConfig.connection
};

const dbPostgres = knex(defaultConfigPostgres);
async function createDatabase() {
  const databases = await dbPostgres.raw("SELECT datname FROM pg_database WHERE datname = 'ms_payment_db';");
  if (databases.rows.length === 0) {
      await dbPostgres.raw('CREATE DATABASE "ms_payment_db";');
      console.log("Banco de dados ms_payment_db' criado.");
  } else {
      console.log("Banco de dados 'ms_payment_db' já existe.");
  }
}

async function createTables() {
  const db = knex(defaultConfig);

    // Criar tabela de pagamentos
    const paymentsExists = await db.schema.hasTable('payments');
    if (!paymentsExists) {
      await db.schema.createTable('payments', (table) => {
        table.uuid('payment_id').primary();
        table.uuid('order_id').notNullable();
        table.string('payment_method').notNullable();
        table.float('amount').notNullable();
        table.string('status').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Tabela 'payments' criada");
    }
}

createDatabase().then(() => createTables()).catch((err) => {
    console.error('Erro ao criar banco de dados ou tabelas:', err);
  }).finally(() => {
    dbPostgres.destroy();
  });

const httpServer = new ExpressAdapter();
const connection = new KnexAdapter();

//ms3
const paymentRepository = new PaymentRepositoryDatabase(connection);
const orderGateway = new OrderGatewayHttp(new AxiosAdapter());
const createPayment = new CreatePayment(paymentRepository, orderGateway); 
const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderGateway);
new PaymentController(httpServer, createPayment, getPaymentStatus); 

httpServer.listen(port);