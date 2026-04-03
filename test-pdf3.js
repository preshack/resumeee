const latex = "\\documentclass{article}\\begin{document}Hello world!\\end{document}";
const formData = new URLSearchParams();
formData.append('filecontents[]', latex);
formData.append('filename[]', 'document.tex');
formData.append('engine', 'pdflatex');
formData.append('return', 'pdf');

fetch('https://texlive.net/cgi-bin/latexcgi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: formData.toString()
}).then(async r => {
  if (!r.ok) {
    console.error("Failed:", await r.text());
    process.exit(1);
  }
  const ab = await r.arrayBuffer();
  console.log("PDF Bytes:", ab.byteLength);
  require('fs').writeFileSync('test3.pdf', Buffer.from(ab));
}).catch(console.error);
