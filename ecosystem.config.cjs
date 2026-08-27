/**
 * ◈ MOONWITNESS OS V9.0 — PM2 ENTERPRISE CLUSTER CONFIGURATION
 */
module.exports = {
  apps: [
    {
      name: 'mw-api',
      script: './apps/api/dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'mw-command-center',
      script: 'node_modules/next/dist/bin/next',
      args: 'start apps/command-center -p 3001',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'mw-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start apps/web -p 3000',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
