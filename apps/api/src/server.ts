import 'dotenv/config';
import { NativeServer } from '@moon/server';
import baseAddons, { seedBaseData, loadBaseData } from '@moon/base';

// Jika Anda lebih suka cara programmatic ketimbang CLI 'moon start':
const server = new NativeServer({
  database: process.env.DATABASE_URL || 'postgres://localhost/moonwitness',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  port: Number(process.env.PORT) || 4000,
  addons: baseAddons.models,
  onBoot: async () => {
    await seedBaseData();
    await loadBaseData();
    console.log('[App] Programmatic boot executed!');
  }
});

server.start();
