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
  const databases = await dbPostgres.raw("SELECT datname FROM pg_database WHERE datname = 'order_manager_db';");
  if (databases.rows.length === 0) {
      await dbPostgres.raw('CREATE DATABASE "order_manager_db";');
      console.log("Banco de dados order_manager_db' criado.");
  } else {
      console.log("Banco de dados 'order_manager_db' já existe.");
  }
}

async function createTables() {
  const db = knex(defaultConfig);
    // Criar tabela de clientes
    const clientsExists = await db.schema.hasTable('clients');
    if (!clientsExists) {
      await db.schema.createTable('clients', (table) => {
        table.uuid('account_id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('cpf').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Tabela 'clients' criada");
    }
  
    // Criar tabela de produtos
    const productsExists = await db.schema.hasTable('products');
    if (!productsExists) {
      await db.schema.createTable('products', (table) => {
        table.uuid('product_id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.float('price').notNullable();
        table.string('category').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Tabela 'products' criada");
    }
  
    // Criar tabela de pedidos
    const ordersExists = await db.schema.hasTable('orders');
    if (!ordersExists) {
      await db.schema.createTable('orders', (table) => {
        table.uuid('order_id').primary();
        table.uuid('client_id').nullable().references('account_id').inTable('clients').onDelete('CASCADE');
        table.string('status').notNullable();
        table.timestamp('created_at').notNullable();
      });
      console.log("Tabela 'orders' criada");
    }
  
    // Criar tabela de itens do pedido
    const orderItemsExists = await db.schema.hasTable('order_items');
    if (!orderItemsExists) {
      await db.schema.createTable('order_items', (table) => {
        table.uuid('order_item_id').primary();
        table.uuid('order_id').references('order_id').inTable('orders').onDelete('CASCADE');
        table.uuid('product_id').references('product_id').inTable('products');
        table.integer('quantity').notNullable();
        table.float('price').notNullable();
      });
      console.log("Tabela 'order_items' criada");
    }

    // Criar tabela de pagamentos
    const paymentsExists = await db.schema.hasTable('payments');
    if (!paymentsExists) {
      await db.schema.createTable('payments', (table) => {
        table.uuid('payment_id').primary();
        table.uuid('order_id').references('order_id').inTable('orders').onDelete('CASCADE');
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