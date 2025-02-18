import { ExpressAdapter } from '../../src/infra/http/HttpServer';
import express from 'express';
import request from 'supertest';

describe('HttpServer', () => {
  let server: ExpressAdapter;
  let app: express.Application;

  beforeEach(() => {
    server = new ExpressAdapter();
    app = server['app'];
  });

  it('should register a GET route and return the correct response', async () => {
    server.register('get', '/test', async (req: any) => {
      return { message: 'Hello, world!' };
    });

    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, world!' });
  });

  it('should register a POST route and return the correct response', async () => {
    server.register('post', '/test', async (req: any) => {
      return { message: 'Data received', data: req.body };
    });

    const response = await request(app)
      .post('/test')
      .send({ key: 'value' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Data received', data: { key: 'value' } });
  });

  it('should handle errors and return status 422', async () => {
    server.register('get', '/error', async () => {
      throw new Error('Test error');
    });

    const response = await request(app).get('/error');
    expect(response.status).toBe(422);
    expect(response.body).toEqual({ message: 'Test error' });
  });

  it('should start the server and listen on the specified port', (done) => {
    const port = 3000;
    const listenSpy = jest.spyOn(app, 'listen').mockImplementation((port) => {
      return {
        close: jest.fn(),
        address: jest.fn(),
        getConnections: jest.fn(),
        listen: jest.fn(),
        ref: jest.fn(),
        unref: jest.fn(),
        setTimeout: jest.fn(),
        maxHeadersCount: 0,
        maxRequestsPerSocket: 0,
        timeout: 0,
        headersTimeout: 0,
        keepAliveTimeout: 0,
        requestTimeout: 0,
        connection: jest.fn(),
        addListener: jest.fn(),
        emit: jest.fn(),
        eventNames: jest.fn(),
        getMaxListeners: jest.fn(),
        listenerCount: jest.fn(),
        listeners: jest.fn(),
        off: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        rawListeners: jest.fn(),
        removeAllListeners: jest.fn(),
        removeListener: jest.fn(),
        setMaxListeners: jest.fn(),
        closeAllConnections: jest.fn(),
        closeIdleConnections: jest.fn(),
        maxConnections: 0,
        connections: 0,
        listening: true,
        [Symbol.asyncDispose]: jest.fn(),
      };
    });

    server.listen(port);
    expect(listenSpy).toHaveBeenCalledWith(port);
    done();
  });
});