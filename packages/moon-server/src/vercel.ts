import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { setupOrm, getDb, getModel, createCtx, SUPERUSER_ID, Vertex, registerModel, type DbConfig } from '@moon/orm'
import { getRegistry } from '@moon/orm/dist/registry.js'
import { issueJwt } from './utils/auth.js'

export interface VercelAdapterConfig {
  database: DbConfig;
  jwtSecret: string;
  addons?: typeof Vertex[];
}

let initialized = false;

export function createVercelAdapter(config: VercelAdapterConfig) {
  return async function moonHandler(req: Request): Promise<Response> {
    if (!initialized) {
      setupOrm(config.database);
      if (config.addons) {
        for (const addon of config.addons) {
          registerModel(addon);
        }
      }
      initialized = true;
    }

    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };

    try {
      // 1. Auth Endpoint
      if (req.method === 'POST' && path.endsWith('/auth/login')) {
        const body = await req.json();
        const { email, password } = body;
        
        const User = getModel('vx.user');
        if (!User) return Response.json({ error: 'User model not loaded' }, { status: 500, headers });

        const env = createCtx(SUPERUSER_ID, {}, getModel);
        const rows = await User.fetch(User, env, [['email', '=', email]]);
        if (!rows.length) return Response.json({ error: 'Invalid credentials' }, { status: 401, headers });

        const user = rows[0] as any;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return Response.json({ error: 'Invalid credentials' }, { status: 401, headers });

        const tokenVersion = Number(user.token_version ?? user.tokenVersion ?? 1)
        const token = issueJwt(
          { sub: user.id, email: user.email, tokenVersion },
          config.jwtSecret
        );
        return Response.json({ token, user: { id: user.id, email: user.email, name: user.name, partnerId: user.partner_id } }, { status: 200, headers });
      }

      // 2. RPC Endpoint
      if (req.method === 'POST' && path.endsWith('/rpc')) {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return Response.json({ error: 'Missing or invalid token' }, { status: 401, headers });
        }
        const token = authHeader.split(' ')[1];
        if (!token) return Response.json({ error: 'Missing token' }, { status: 401, headers });
        const decoded = jwt.verify(token, config.jwtSecret, {
          algorithms: ['HS256', 'HS384', 'HS512']
        }) as any;
        const uid = decoded.sub as number;
        if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

        const body = await req.json();
        const { model, method, args, kwargs } = body;
        if (!model || !method) return Response.json({ error: 'Model and method required' }, { status: 400, headers });

        const ModelClass = getModel(model);
        if (!ModelClass) return Response.json({ error: `Model ${model} not found` }, { status: 404, headers });

        const methodFn = (ModelClass as any)[method];
        if (typeof methodFn !== 'function') return Response.json({ error: `Method ${method} not found` }, { status: 404, headers });

        const safeArgs = Array.isArray(args) ? args : [];
        if (kwargs && Object.keys(kwargs).length > 0) safeArgs.push(kwargs);

        const db = getDb();
        const result = await db.transaction(async (trx: any) => {
          const env = createCtx(uid, {}, getModel, trx);
          return await methodFn.call(ModelClass, ModelClass, env, ...safeArgs);
        });

        return Response.json({ result }, { status: 200, headers });
      }

      // 3. MetaDashboard Endpoint
      if (req.method === 'GET' && path.endsWith('/meta/models')) {
        const registry = getRegistry();
        const models: Record<string, any> = {};
        for (const [name, ModelClass] of registry) {
          models[name] = {
            name: ModelClass._name,
            description: ModelClass._description,
            fields: ModelClass.getFieldDefs(ModelClass as any)
          };
        }
        return Response.json({ models }, { status: 200, headers });
      }

      // 4. SSE Stream (VxLive) Endpoint
      if (req.method === 'GET' && path.endsWith('/live')) {
         const stream = new ReadableStream({
           start(controller) {
             const encoder = new TextEncoder();
             controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));
             
             // Keepalive
             const interval = setInterval(() => {
               controller.enqueue(encoder.encode(`:\n\n`));
             }, 15000);

             // Define the event listener
             const onMoonEvent = (event: any) => {
               const data = `data: ${JSON.stringify(event)}\n\n`;
               controller.enqueue(encoder.encode(data));
             };

             // @ts-ignore
             if (!globalThis.moonEmitter) {
                const { EventEmitter } = require('events');
                // @ts-ignore
                globalThis.moonEmitter = new EventEmitter();
             }
             // @ts-ignore
             globalThis.moonEmitter.on('moon_event', onMoonEvent);

             req.signal.addEventListener('abort', () => {
               clearInterval(interval);
               // @ts-ignore
               globalThis.moonEmitter.removeListener('moon_event', onMoonEvent);
               controller.close();
             });
           }
         });
         return new Response(stream, {
           headers: {
             'Content-Type': 'text/event-stream',
             'Cache-Control': 'no-cache, no-transform',
             'Connection': 'keep-alive',
             'Access-Control-Allow-Origin': '*'
           }
         });
      }

      return Response.json({ error: 'Not Found' }, { status: 404, headers });

    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }
}
