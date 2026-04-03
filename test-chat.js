const http = require('http');

const data = JSON.stringify({
  message: "Rewrite the resume to be fully detailed, making it span a complete page. Ignore any conciseness, be as verbose as possible.",
  resumeLatex: "\\documentclass{article}\\begin{document}Testing\\end{document}",
  coverLetterLatex: "",
  activeTab: "resume",
  history: []
});

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/chat',
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
