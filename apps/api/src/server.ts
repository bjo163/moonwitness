import 'dotenv/config';
import { NativeServer } from '@moon/server';
import baseAddons, { seedBaseData, loadBaseData } from '@moon/base';
import { globalRoutes } from '@moon/server/dist/router.js';
import { publish } from '@moon/server';

globalRoutes.push({
  method: 'POST',
  path: '/test-publish',
  handler: (req, res) => {
    publish('chat_global', { text: 'Realtime works perfectly!' })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
  }
});

// Jika Anda lebih suka cara programmatic ketimbang CLI 'moon start':
const server = new NativeServer({
  database: process.env.DATABASE_URL || 'postgres://localhost/moonwitness',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  port: Number(process.env.API_PORT || process.env.PORT) || 4000,
  addons: baseAddons.models,
});

server.start().then(async () => {
  try {
    await seedBaseData();
    await loadBaseData();
    console.log('[App] Programmatic boot executed and data seeded!');
  } catch (err) {
    console.error('[App] Failed to seed data:', err);
  }
});









