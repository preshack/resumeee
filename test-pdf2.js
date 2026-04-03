const latex = "\\documentclass{article}\\begin{document}Hello world!\\end{document}";
fetch('https://latexonline.cc/data?target=main.tex', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: latex
}).then(async r => {
  if (!r.ok) {
    console.error("Failed:", await r.text());
    process.exit(1);
  }
  const ab = await r.arrayBuffer();
  console.log("PDF Bytes:", ab.byteLength);
  require('fs').writeFileSync('test2.pdf', Buffer.from(ab));
}).catch(console.error);
