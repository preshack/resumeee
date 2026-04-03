const latex = "\\documentclass{article}\\begin{document}Hello world!\\end{document}";
fetch('http://localhost:3001/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ latex })
}).then(async r => {
  if (!r.ok) {
    console.error("Failed:", await r.text());
    process.exit(1);
  }
  const ab = await r.arrayBuffer();
  console.log("PDF Bytes:", ab.byteLength);
  require('fs').writeFileSync('test.pdf', Buffer.from(ab));
}).catch(console.error);
