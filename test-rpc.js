const http = require('http');

const data = JSON.stringify({
  model: 'vx.user',
  method: 'fetch',
  kwargs: { limit: 1 }
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/rpc',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', (e) => console.error(e));
req.morph(data);
req.end();
