import http from 'node:http'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { setupOrm, forge, getLastPending, getDb, getModel, createCtx, SUPERUSER_ID, Vertex, registerModel, type DbConfig } from '@moon/orm'
import { globalRoutes } from './router.js'
import { logger } from './logger.js'

export interface MoonConfig {
  database: DbConfig;
  jwtSecret: string;
  port?: number;
  host?: string;
  addons?: typeof Vertex[];
  onBoot?: () => Promise<void>;
}

export class NativeServer {
  private config: MoonConfig;

  constructor(config: MoonConfig) {
    this.config = config;
    setupOrm(config.database);
    if (config.addons) {
      for (const addon of config.addons) {
        registerModel(addon);
      }
    }
  }

  private sendJson(res: http.ServerResponse, statusCode: number, data: any) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
  }

  private async parseBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private verifyToken(req: http.IncomingMessage): any {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid token');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Missing token');
    }
    return jwt.verify(token, this.config.jwtSecret || 'secret');
  }

  private async handleAuth(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const body = await this.parseBody(req);
      const { email, password } = body;
      
      const User = getModel('vx.user');
      if (!User) return this.sendJson(res, 500, { error: 'User model not loaded' });

      const env = createCtx(SUPERUSER_ID, {}, getModel);
      const rows = await User.fetch(User, env, [['email', '=', email]]);
      if (!rows.length) return this.sendJson(res, 401, { error: 'Invalid credentials' });

      const user = rows[0] as any;
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return this.sendJson(res, 401, { error: 'Invalid credentials' });

      const token = jwt.sign({ sub: user.id, email: user.email }, this.config.jwtSecret || 'secret', { expiresIn: '24h' });
      this.sendJson(res, 200, { token, user: { id: user.id, email: user.email, name: user.name, partnerId: user.partner_id } });
    } catch (err: any) {
      this.sendJson(res, 500, { error: err.message });
    }
  }

  private async handleRpc(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const decoded = this.verifyToken(req);
      const uid = decoded.sub as number;
      if (!uid) return this.sendJson(res, 401, { error: 'Unauthorized' });

      const body = await this.parseBody(req);
      const { model, method, args, kwargs } = body;
      if (!model || !method) return this.sendJson(res, 400, { error: 'Model and method required' });

      const ModelClass = getModel(model);
      if (!ModelClass) return this.sendJson(res, 404, { error: `Model ${model} not found` });

      const methodFn = (ModelClass as any)[method];
      if (typeof methodFn !== 'function') return this.sendJson(res, 404, { error: `Method ${method} not found` });

      const safeArgs = Array.isArray(args) ? args : [];
      if (kwargs && Object.keys(kwargs).length > 0) safeArgs.push(kwargs);

      const db = getDb();
      const result = await db.transaction(async (trx) => {
        const env = createCtx(uid, {}, getModel, trx);
        return await methodFn.call(ModelClass, ModelClass, env, ...safeArgs);
      });

      this.sendJson(res, 200, { result });
    } catch (err: any) {
      this.sendJson(res, err.message === 'Missing or invalid token' ? 401 : 500, { error: err.message });
    }
  }

  public handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const startTime = Date.now()
    
    const originalEnd = res.end
    res.end = function(chunk: any, encoding?: any, cb?: any) {
      const duration = Date.now() - startTime
      logger.info('moon.http', `${req.method} ${req.url} ${res.statusCode} (${duration}ms)`)
      return originalEnd.call(res, chunk, encoding, cb)
    } as any
    
    if (req.method === 'OPTIONS') {
      return this.sendJson(res, 204, null);
    }
    
    if (req.method === 'GET' && (req.url === '/favicon.ico' || req.url === '/favicon.png')) {
      res.writeHead(200, { 'Content-Type': 'image/x-icon', 'Access-Control-Allow-Origin': '*' });
      return res.end();
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
      return this.sendJson(res, 200, { name: 'Moonwitness API Server', status: 'online', version: '0.0.1' });
    }
    
    if (req.method === 'POST' && req.url === '/auth/login') {
      return this.handleAuth(req, res);
    }
    
    if (req.method === 'POST' && req.url === '/rpc') {
      return this.handleRpc(req, res);
    }

    if (req.method === 'GET' && req.url === '/db/status') {
      return this.sendJson(res, 200, { ok: true, driver: getDb().client.driverName });
    }

    if (req.method === 'GET' && req.url === '/meta/models') {
      const { getRegistry } = require('@moon/orm/dist/registry.js');
      const registry = getRegistry();
      const models: any = {};
      for (const [name, ModelClass] of registry) {
        models[name] = {
          name: ModelClass._name,
          description: ModelClass._description,
          fields: ModelClass.getFieldDefs(ModelClass as any)
        };
      }
      return this.sendJson(res, 200, { models });
    }

    // SSE
    if (req.method === 'GET' && req.url === '/live') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
      const interval = setInterval(() => res.write(':\n\n'), 15000);
      const onEvent = (e: any) => res.write(`data: ${JSON.stringify(e)}\n\n`);
      
      if (!(globalThis as any).moonEmitter) {
        const { EventEmitter } = require('events');
        (globalThis as any).moonEmitter = new EventEmitter();
      }
      (globalThis as any).moonEmitter.on('moon_event', onEvent);
      
      req.on('close', () => {
        clearInterval(interval);
        (globalThis as any).moonEmitter.removeListener('moon_event', onEvent);
      });
      return;
    }

    const customRoute = globalRoutes.find(r => r.method === req.method && r.path === req.url);
    if (customRoute) {
      return customRoute.handler(req, res);
    }

    this.sendJson(res, 404, { error: 'Not Found' });
  }

  public async start() {
    try {
      const { applied } = await forge();
      logger.info('moon.schema', `Schema sync: ${applied.length} applied, ${getLastPending().length} pending`);

      if (this.config.onBoot) {
        await this.config.onBoot();
      }

      const server = http.createServer((req, res) => this.handleRequest(req, res));

      const port = this.config.port || Number(process.env.PORT) || 4000;
      const host = this.config.host || '0.0.0.0';
      server.listen(port, host, () => {
        logger.info('moon.core', `Native Engine running at http://${host}:${port}`);
      });
    } catch (err) {
      logger.error('moon.core', 'Failed to start:', err);
      process.exit(1);
    }
  }
}
