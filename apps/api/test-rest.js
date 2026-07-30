const http = require('http');

const data = JSON.stringify({
  email: 'admin@moonwitness.com', // Assuming admin email is this or we can just fetch /meta/models without auth to see if server responds
  password: 'admin'
});

const req = http.request('http://localhost:4000/meta/models', {
  method: 'GET'
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('Server is up and models are available.');
    } else {
      console.log('Body:', body);
    }
  });
});

req.on('error', console.error);
req.end();
