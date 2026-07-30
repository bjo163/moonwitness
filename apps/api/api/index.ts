import { server } from '../src/server';

export default function handler(req: any, res: any) {
  // Use the extracted handleRequest method from NativeServer
  // We need to ensure the server is booted, but Vercel Serverless Functions
  // might hit this handler before start() completes if we don't await it.
  
  // Since server.start() is asynchronous, we might need a quick boot wrapper.
  // For now, NativeServer handles requests synchronously and boots the ORM 
  // immediately via the constructor (setupOrm).
  // The forge() schema sync happens in start(), which we might skip for serverless.
  
  return server.handleRequest(req, res);
}
