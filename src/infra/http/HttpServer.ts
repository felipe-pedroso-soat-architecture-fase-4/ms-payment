//framework and driver

import YAML from 'yamljs';
import express from "express";
import path from 'path';
import swaggerUi from 'swagger-ui-express';

export default interface HttpServer {
    register(method: string, route: string, handler: Function): void;
    listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
    private app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());

        const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger.yaml'));
        swaggerDocument.servers = [{ url: `${process.env.API_URL}:${process.env.API_PORT}` }];
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    register(method: string, route: string, handler: Function): void {

        this.app[method](route, async (req: any, res: any) => {
            try {
                const output = await handler(req);
                res.json(output);
            } catch (error: any) {
                console.log({errorServer: error})
                res.status(422).json({ message: error.message });
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
        console.log(`Server is running at ${process.env.API_URL}:${port}`);
        console.log(`Swagger API documentation is available at: ${process.env.API_URL}:${port}/api-docs`);
    }
}