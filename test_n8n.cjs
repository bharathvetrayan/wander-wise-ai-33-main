
const https = require('https');

const data = JSON.stringify({
    message: 'Hello'
});

const options = {
    hostname: 'n8nproject-b62m.onrender.com',
    port: 443,
    path: '/webhook/travel-assistant',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    let body = '';
    res.on('data', (d) => {
        body += d;
    });
    res.on('end', () => {
        console.log('Response body:', body);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
