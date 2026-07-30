// Vercel Serverless Entry Point
import { NativeServer } from '@moon/server';
import baseAddons from '@moon/base';

// Instantiate the server WITHOUT calling start() 
// (We don't want to listen on port 4000 or run migrations on every cold start in Vercel)
const server = new NativeServer({
  database: process.env.DATABASE_URL || 'postgres://localhost/moonwitness',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  addons: baseAddons.models
});

export default function handler(req: any, res: any) {
  return server.handleRequest(req, res);
}
