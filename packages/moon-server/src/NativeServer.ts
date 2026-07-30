import http from 'node:http'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { setupOrm, forge, getLastPending, getDb, getModel, createCtx, SUPERUSER_ID, ANONYMOUS_ID, Vertex, registerModel, registry, type DbConfig } from '@moon/orm'
import { globalRoutes } from './router.js'
import { logger } from './logger.js'
import { generateOpenApi } from './openapi.js'
import { EventEmitter } from 'node:events'

export interface MoonConfig {
  database: DbConfig;
  jwtSecret: string;
  port?: number;
  host?: string;
  addons?: typeof Vertex[];
  onBoot?: () => Promise<void>;
}

export function publish(topic: string, payload: any) {
  if ((globalThis as any).moonEmitter) {
    (globalThis as any).moonEmitter.emit('moon_event', { topic, payload });
  }
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
      return { sub: ANONYMOUS_ID };
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return { sub: ANONYMOUS_ID };
    }
    try {
      return jwt.verify(token, this.config.jwtSecret || 'secret');
    } catch (e: any) {
      if (e.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw new Error('Invalid token');
    }
  }

  private async handleAuthLogin(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const body = await this.parseBody(req);
      const { email, password } = body;
      
      const User = getModel('vx.user');
      if (!User) return this.sendJson(res, 500, { error: 'User model not loaded' });

      const env = createCtx(SUPERUSER_ID, {}, getModel);
      const rows = await User.fetch(User, env, [['email', '=', email]]);
      console.log('Login fetch result:', rows);
      if (!rows.length) return this.sendJson(res, 401, { error: 'Invalid credentials (not found)' });

      const user = rows[0] as any;
      console.log('Login password check:', { hashed: user.password });
      if (!user.password) return this.sendJson(res, 401, { error: 'Invalid credentials (no pass in db)' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return this.sendJson(res, 401, { error: 'Invalid credentials (mismatch)' });

      const token = jwt.sign({ sub: user.id, email: user.email }, this.config.jwtSecret || 'secret', { expiresIn: '24h' });
      this.sendJson(res, 200, { token, user: { id: user.id, email: user.email, name: user.name, partnerId: user.partner_id } });
    } catch (err: any) {
      this.sendJson(res, 500, { error: err.message });
    }
  }

  private async handleAuthRegister(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const body = await this.parseBody(req);
      const { email, password, name } = body;
      
      const User = getModel('vx.user');
      if (!User) return this.sendJson(res, 500, { error: 'User model not loaded' });

      const env = createCtx(SUPERUSER_ID, {}, getModel);
      
      // Check if email already exists
      const existing = await User.fetch(User, env, [['email', '=', email]]);
      if (existing.length > 0) return this.sendJson(res, 400, { error: 'Email already registered' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Find default company
      const Partner = getModel('vx.node');
      let defaultCompanyId = undefined;
      if (Partner) {
         const companies = await Partner.fetch(Partner, env, [['isCompany', '=', true]]);
         if (companies.length > 0) {
            defaultCompanyId = companies[0].id;
         }
      }

      // Create user
      const user = await User.transaction(env, async (txEnv: any) => {
        return await User.spawn(User, txEnv, {
          name: name || email.split('@')[0],
          email,
          password: hashedPassword,
          companyId: defaultCompanyId,
          isActive: true
        });
      });

      const token = jwt.sign({ sub: user.id, email: user.email }, this.config.jwtSecret || 'secret', { expiresIn: '24h' });
      this.sendJson(res, 201, { token, user: { id: user.id, email: user.email, name: user.name, partnerId: user.partner_id } });
    } catch (err: any) {
      this.sendJson(res, 500, { error: err.message });
    }
  }

  private getMailer() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rocksoultech@gmail.com',
        pass: 'qpva imgx ndcu nbnt'
      }
    });
  }

  private async handleAuthForgotPassword(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const body = await this.parseBody(req);
      const { email } = body;
      
      const User = getModel('vx.user');
      if (!User) return this.sendJson(res, 500, { error: 'User model not loaded' });

      const env = createCtx(SUPERUSER_ID, {}, getModel);
      const rows = await User.fetch(User, env, [['email', '=', email]]);
      if (!rows.length) {
        return this.sendJson(res, 200, { message: 'If the email exists, a password reset instruction has been sent.' });
      }

      const user = rows[0] as any;
      
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 15 * 60000); // 15 mins

      await User.transaction(env, async (txEnv: any) => {
        await User.morph(User, txEnv, user.id, { otpCode, otpExpires });
      });

      // Send Email
      const mailer = this.getMailer();
      await mailer.sendMail({
        from: '"Moonwitness Security" <rocksoultech@gmail.com>',
        to: email,
        subject: 'Your Password Reset Code',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0ea5e9;">MoonWitness OS - Password Reset</h2>
            <p>Hello ${user.name},</p>
            <p>You requested a password reset. Please use the following 6-digit code to proceed:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a; margin: 20px 0; text-align: center;">
              ${otpCode}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
          </div>
        `
      });

      logger.info('moon.auth', `OTP sent to ${email}`);
      
      this.sendJson(res, 200, { message: 'Password reset code has been sent to your email.' });
    } catch (err: any) {
      logger.error('moon.auth', 'Forgot Password Error:', err);
      this.sendJson(res, 500, { error: err.message });
    }
  }

  private async handleAuthVerifyOtp(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const body = await this.parseBody(req);
      const { email, code } = body;
      
      const User = getModel('vx.user');
      if (!User) return this.sendJson(res, 500, { error: 'User model not loaded' });

      const env = createCtx(SUPERUSER_ID, {}, getModel);
      const rows = await User.fetch(User, env, [['email', '=', email]]);
      if (!rows.length) return this.sendJson(res, 400, { error: 'Invalid request' });

      const user = rows[0] as any;
      
      if (!user.otp_code || user.otp_code !== code) {
        return this.sendJson(res, 400, { error: 'Invalid verification code' });
      }

      if (user.otp_expires && new Date(user.otp_expires) < new Date()) {
        return this.sendJson(res, 400, { error: 'Verification code has expired' });
      }

      this.sendJson(res, 200, { success: true, message: 'Code verified successfully' });
    } catch (err: any) {
      this.sendJson(res, 500, { error: err.message });
    }
  }

  private async handleAuthResetPassword(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const body = await this.parseBody(req);
      const { email, code, newPassword } = body;
      
      const User = getModel('vx.user');
      if (!User) return this.sendJson(res, 500, { error: 'User model not loaded' });

      const env = createCtx(SUPERUSER_ID, {}, getModel);
      const rows = await User.fetch(User, env, [['email', '=', email]]);
      if (!rows.length) return this.sendJson(res, 400, { error: 'Invalid request' });

      const user = rows[0] as any;
      
      if (!user.otp_code || user.otp_code !== code) {
        return this.sendJson(res, 400, { error: 'Invalid verification code' });
      }

      if (user.otp_expires && new Date(user.otp_expires) < new Date()) {
        return this.sendJson(res, 400, { error: 'Verification code has expired' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.transaction(env, async (txEnv: any) => {
        await User.morph(User, txEnv, user.id, { 
          password: hashedPassword,
          otpCode: null,
          otpExpires: null
        });
      });

      logger.info('moon.auth', `Password for ${email} has been reset successfully.`);
      this.sendJson(res, 200, { message: 'Password has been reset successfully' });
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
      const isAuthError = ['Missing or invalid token', 'Token expired', 'Invalid token'].includes(err.message);
      this.sendJson(res, isAuthError ? 401 : 500, { error: err.message });
    }
  }

  private async handleRest(req: http.IncomingMessage, res: http.ServerResponse, match: RegExpMatchArray) {
    try {
      const decoded = this.verifyToken(req);
      const uid = decoded.sub as number;

      const model = match[1] as string;
      const idStr = match[2];
      const id = idStr ? parseInt(idStr) : undefined;
      
      const ModelClass = getModel(model) as any;
      if (!ModelClass) return this.sendJson(res, 404, { error: `Model ${model} not found` });

      const db = getDb();
      const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
      const params = parsedUrl.searchParams;

      const env = createCtx(uid, {}, getModel, db);

      if (req.method === 'GET') {
        if (id) {
          const record = await ModelClass.query(env).where('id', id).first();
          if (!record) return this.sendJson(res, 404, { error: 'Not found' });
          return this.sendJson(res, 200, { data: record });
        } else {
          const query = ModelClass.query(env);
          
          let page = 1;
          let limit = 50;
          
          for (const [key, value] of params.entries()) {
            if (key === 'page') page = parseInt(value) || 1;
            else if (key === 'limit') limit = parseInt(value) || 50;
            else if (key === 'with') {
              const rels = value.split(',');
              for (const rel of rels) query.with(rel.trim());
            } else {
              query.where(key, value);
            }
          }
          
          const result = await query.paginate(page, limit);
          return this.sendJson(res, 200, result);
        }
      } 
      else if (req.method === 'POST') {
        const body = await this.parseBody(req);
        const record = await ModelClass.transaction(env, async (txEnv: any) => {
          return await ModelClass.spawn(ModelClass, txEnv, body);
        });
        return this.sendJson(res, 201, { data: record });
      }
      else if (req.method === 'PUT') {
        if (!id) return this.sendJson(res, 400, { error: 'ID required' });
        const body = await this.parseBody(req);
        await ModelClass.transaction(env, async (txEnv: any) => {
          await ModelClass.morph(ModelClass, txEnv, id, body);
        });
        const record = await ModelClass.query(env).where('id', id).first();
        return this.sendJson(res, 200, { data: record });
      }
      else if (req.method === 'DELETE') {
        if (!id) return this.sendJson(res, 400, { error: 'ID required' });
        await ModelClass.transaction(env, async (txEnv: any) => {
          await ModelClass.purge(ModelClass, txEnv, id);
        });
        return this.sendJson(res, 200, { success: true });
      }
      
      return this.sendJson(res, 405, { error: 'Method not allowed' });
    } catch (err: any) {
      const isAuthError = ['Missing or invalid token', 'Token expired', 'Invalid token'].includes(err.message);
      this.sendJson(res, isAuthError ? 401 : 500, { error: err.message });
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

    const restMatch = req.url?.match(/^\/api\/([a-z0-9.-]+)(?:\/(\d+))?(?:\?.*)?$/);
    if (restMatch) {
      return this.handleRest(req, res, restMatch);
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Moonwitness Engine</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: radial-gradient(circle at top right, #1e1b4b, #0f172a, #000000); }
    .glass {
      background: rgba(30, 41, 59, 0.4);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body class="text-slate-200 min-h-screen p-8 font-sans antialiased">
  <div class="max-w-4xl mx-auto space-y-8">
    
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Moonwitness Engine</h1>
        <p class="text-slate-400 mt-2">Enterprise Telemetry & ORM Server</p>
      </div>
      <div class="px-4 py-2 glass rounded-full flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></span>
        <span class="text-sm font-semibold tracking-widest uppercase text-green-400">Core Online</span>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- System Stats -->
      <div class="glass rounded-2xl p-6 col-span-1 space-y-4">
        <h2 class="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">System Status</h2>
        
        <div class="flex justify-between items-center">
          <span class="text-slate-400 text-sm">Uptime</span>
          <span class="font-mono text-sm text-blue-300">${(process.uptime() / 3600).toFixed(2)} hrs</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-400 text-sm">Database</span>
          <span class="font-mono text-sm text-purple-300">${getDb().client.driverName}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-400 text-sm">Models Loaded</span>
          <span class="font-mono text-sm text-pink-300">${registry.size}</span>
        </div>
        
        <div class="pt-6">
          <a href="/docs" class="w-full flex justify-center py-2.5 px-4 bg-white/10 hover:bg-white/20 transition-all rounded-lg text-white font-medium text-sm">
            Open API Swagger &rarr;
          </a>
        </div>
      </div>

      <!-- Console Box -->
      <div class="glass rounded-2xl p-6 col-span-1 md:col-span-2 flex flex-col">
        <div class="flex justify-between items-end mb-4 border-b border-slate-700/50 pb-2">
          <div class="flex gap-4">
            <button id="tab-telemetry" onclick="switchTab('telemetry')" class="text-white font-semibold border-b-2 border-indigo-500 pb-1">Live Telemetry</button>
            <button id="tab-logs" onclick="switchTab('logs')" class="text-slate-400 font-semibold hover:text-slate-200 pb-1 transition-colors">Server Logs</button>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Active Connections</span>
            <span id="activeCount" class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">0</span>
          </div>
        </div>
        
        <div class="flex-1 bg-black/50 rounded-xl p-4 overflow-hidden border border-slate-800 relative min-h-[250px]">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none"></div>
          
          <!-- Telemetry View -->
          <ul id="logList" class="space-y-2 text-xs font-mono text-slate-400 overflow-y-auto h-full flex flex-col-reverse relative z-0">
            <li class="text-slate-600 italic">Waiting for visitor signals...</li>
          </ul>

          <!-- Server Logs View -->
          <ul id="serverLogList" class="space-y-1 text-xs font-mono text-slate-400 overflow-y-auto h-full flex flex-col-reverse relative z-0 hidden">
            <li class="text-slate-600 italic">Connected to core logger...</li>
          </ul>
        </div>
      </div>

    </div>

  </div>

  <script>
    function switchTab(tab) {
      document.getElementById('tab-telemetry').className = tab === 'telemetry' ? 'text-white font-semibold border-b-2 border-indigo-500 pb-1' : 'text-slate-400 font-semibold hover:text-slate-200 pb-1 transition-colors';
      document.getElementById('tab-logs').className = tab === 'logs' ? 'text-white font-semibold border-b-2 border-indigo-500 pb-1' : 'text-slate-400 font-semibold hover:text-slate-200 pb-1 transition-colors';
      
      document.getElementById('logList').classList.toggle('hidden', tab !== 'telemetry');
      document.getElementById('serverLogList').classList.toggle('hidden', tab !== 'logs');
    }

    const evtSource = new EventSource("/live");
    const activeCountEl = document.getElementById("activeCount");
    const logList = document.getElementById("logList");
    const serverLogList = document.getElementById("serverLogList");
    
    function logEvent(msg, highlight = false) {
      const li = document.createElement("li");
      const time = new Date().toLocaleTimeString();
      li.innerHTML = \`<span class="text-slate-500">[\${time}]</span> <span class="\${highlight ? 'text-green-400' : 'text-blue-300'}">\${msg}</span>\`;
      logList.prepend(li);
      if (logList.children.length > 50) logList.removeChild(logList.lastChild);
    }

    function appendServerLog(payload) {
      const li = document.createElement("li");
      let color = 'text-slate-300';
      if (payload.level === 'ERROR') color = 'text-red-400';
      if (payload.level === 'WARN') color = 'text-yellow-400';
      if (payload.level === 'INFO') color = 'text-green-400';
      if (payload.level === 'DEBUG') color = 'text-slate-500';
      
      const time = new Date(payload.timestamp).toLocaleTimeString();
      li.innerHTML = \`<span class="text-slate-500">[\${time}]</span> <span class="\${color} font-bold">[\${payload.level}]</span> <span class="text-cyan-400">\${payload.context}:</span> <span class="\${color}">\${payload.message}</span>\`;
      serverLogList.prepend(li);
      if (serverLogList.children.length > 100) serverLogList.removeChild(serverLogList.lastChild);
    }

    evtSource.onmessage = function(event) {
      if (event.data === ":") return; // ping
      
      try {
        const data = JSON.parse(event.data);
        if (data.topic === "system_connections") {
          activeCountEl.innerText = data.payload.activeCount;
          if (data.payload.action === 'joined') {
            logEvent(\`[+\${data.payload.clientId}] \${data.payload.ip || 'Unknown IP'} connected.\`, true);
          } else if (data.payload.action === 'left') {
            logEvent(\`[-\${data.payload.clientId}] disconnected.\`, false);
          } else if (data.payload.action === 'connected') {
            logEvent(\`Connected to telemetry stream. Client ID: \${data.payload.clientId}\`);
          }
        }
        else if (data.topic === "system_logs") {
          appendServerLog(data.payload);
        }
      } catch (e) {
        console.error("Parse error", e);
      }
    };
  </script>
</body>
</html>`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(html);
    }

    if (req.method === 'GET' && req.url === '/openapi.json') {
      return this.sendJson(res, 200, generateOpenApi());
    }

    if (req.method === 'GET' && req.url === '/docs') {
      const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Moonwitness API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
<script>
  window.onload = () => {
    window.ui = SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
    });
  };
</script>
</body>
</html>`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(swaggerHtml);
    }
    
    if (req.method === 'POST' && req.url === '/auth/login') {
      return this.handleAuthLogin(req, res);
    }
    
    if (req.method === 'POST' && req.url === '/auth/register') {
      return this.handleAuthRegister(req, res);
    }

    if (req.method === 'POST' && req.url === '/auth/forgot-password') {
      return this.handleAuthForgotPassword(req, res);
    }
    
    if (req.method === 'POST' && req.url === '/auth/verify-otp') {
      return this.handleAuthVerifyOtp(req, res);
    }

    if (req.method === 'POST' && req.url === '/auth/reset-password') {
      return this.handleAuthResetPassword(req, res);
    }
    
    if (req.method === 'POST' && req.url === '/rpc') {
      return this.handleRpc(req, res);
    }

    if (req.method === 'GET' && req.url === '/db/status') {
      return this.sendJson(res, 200, { ok: true, driver: getDb().client.driverName });
    }

    if (req.method === 'GET' && req.url === '/meta/models') {
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
    if (req.method === 'GET' && req.url && req.url.startsWith('/live')) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      const clientId = Math.random().toString(36).substring(2, 11);
      
      const reqAny = req as any;
      const ipAddress = (String(reqAny.headers['x-forwarded-for'] || (reqAny.socket && reqAny.socket.remoteAddress) || 'unknown').split(',')[0] || 'unknown').trim();
      const userAgent = reqAny.headers['user-agent'] || 'unknown';
      
      if (!(globalThis as any).moonActiveClients) {
        (globalThis as any).moonActiveClients = new Set();
      }
      const activeClients = (globalThis as any).moonActiveClients;
      activeClients.add(clientId);

      const broadcastStats = () => {
        if ((globalThis as any).moonEmitter) {
          (globalThis as any).moonEmitter.emit('moon_event', { 
            topic: 'system_connections', 
            payload: { activeCount: activeClients.size, action: 'joined', clientId, ip: ipAddress }
          });
        }
      };

      // Create fx.session record asynchronously
      const FxSession = getModel('fx.session');
      let sessionRecordId: number | null = null;
      
      if (FxSession) {
        const env = createCtx(SUPERUSER_ID, {}, getModel as any);
        // GeoIP lookup
        let country = 'Unknown';
        if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
          country = 'Localhost';
        } else {
          fetch(`http://ip-api.com/json/${ipAddress}`).then(res => res.json()).then(data => {
            if (data.status === 'success' && sessionRecordId) {
              FxSession.morph(FxSession as any, env, sessionRecordId, { country: data.country }).catch(() => {});
            }
          }).catch(() => {});
        }
        
        FxSession.spawn(FxSession as any, env, {
          clientId,
          ipAddress,
          userAgent,
          country
        }).then(rec => {
          sessionRecordId = rec.id;
        }).catch(e => logger.error('moon.metrics', 'Failed to save fx.session', e));
      }

      res.write(`data: ${JSON.stringify({ topic: 'system_connections', payload: { activeCount: activeClients.size, action: 'connected', clientId } })}\n\n`);
      const interval = setInterval(() => res.write(':\n\n'), 15000);
      
      const onEvent = (e: any) => res.write(`data: ${JSON.stringify(e)}\n\n`);
      
      if (!(globalThis as any).moonEmitter) {
        (globalThis as any).moonEmitter = new EventEmitter();
      }
      (globalThis as any).moonEmitter.on('moon_event', onEvent);
      
      // Broadcast that someone joined
      setTimeout(broadcastStats, 100);

      req.on('close', () => {
        clearInterval(interval);
        if ((globalThis as any).moonEmitter) {
           (globalThis as any).moonEmitter.removeListener('moon_event', onEvent);
        }
        activeClients.delete(clientId);
        
        if (FxSession && sessionRecordId) {
          const env = createCtx(SUPERUSER_ID, {}, getModel as any);
          FxSession.morph(FxSession as any, env, sessionRecordId, { disconnectedAt: new Date() }).catch(e => logger.error('moon.metrics', 'Failed to update disconnectedAt', e));
        }

        // Broadcast that someone left
        if ((globalThis as any).moonEmitter) {
          (globalThis as any).moonEmitter.emit('moon_event', { 
            topic: 'system_connections', 
            payload: { activeCount: activeClients.size, action: 'left', clientId }
          });
        }
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

      const builtinRoutes = [
        { method: 'POST', path: '/auth/login' },
        { method: 'POST', path: '/auth/register' },
        { method: 'POST', path: '/auth/forgot-password' },
        { method: 'POST', path: '/auth/verify-otp' },
        { method: 'POST', path: '/auth/reset-password' },
        { method: 'POST', path: '/rpc' },
        { method: 'GET', path: '/db/status' },
        { method: 'GET', path: '/meta/models' },
        { method: 'GET', path: '/live' },
        { method: 'GET', path: '/openapi.json' },
        { method: 'GET', path: '/docs' }
      ];

      logger.info('moon.rest', '--- Built-in Endpoints ---');
      for (const route of builtinRoutes) {
        logger.info('moon.rest', `${route.method.padEnd(14)} ${route.path}`);
      }
      
      if (globalRoutes.length > 0) {
        logger.info('moon.rest', '--- Custom Endpoints ---');
        for (const route of globalRoutes) {
          logger.info('moon.rest', `${route.method.padEnd(14)} ${route.path}`);
        }
      }

      logger.info('moon.rest', '--- Auto-Generated REST Endpoints ---');
      for (const [name] of registry) {
        logger.info('moon.rest', `GET, POST      /api/${name}`);
        logger.info('moon.rest', `GET, PUT, DEL  /api/${name}/:id`);
      }

      const server = http.createServer((req, res) => this.handleRequest(req, res));

      const port = this.config.port || Number(process.env.API_PORT || process.env.PORT) || 4000;
      const host = this.config.host || '0.0.0.0';
      server.listen(port, host, () => {
        logger.info('moon.core', `Native Engine running at http://${host}:${port}`);
        
        // Metric Telemetry Background Worker
        setInterval(async () => {
          try {
            const MxMetric = getModel('mx.metric');
            const activeCount = (globalThis as any).moonActiveClients ? (globalThis as any).moonActiveClients.size : 0;
            if (MxMetric) {
              const env = createCtx(SUPERUSER_ID, {}, getModel as any);
              await MxMetric.spawn(MxMetric as any, env, { name: 'active_connections', value: activeCount });
            }
          } catch(e) {
            logger.error('moon.metrics', 'Failed to flush metric to DB', e);
          }
        }, 60000); // 1 minute interval
      });
    } catch (err) {
      logger.error('moon.core', 'Failed to start:', err);
      process.exit(1);
    }
  }
}
