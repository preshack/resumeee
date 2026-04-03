const http = require('http');

const data = JSON.stringify({
  jobDescription: "We are looking for a Software Engineer with Python and React experience to build scalable platforms.",
  userProfile: {
    name: "John Doe",
    skills: ["Python", "React", "TypeScript", "Node.js"]
  }
});

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`CHUNK: ${chunk.toString()}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
