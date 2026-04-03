const latex = "\\documentclass{article}\\begin{document}Hello world!\\end{document}";
const url = 'https://latexonline.cc/compile?text=' + encodeURIComponent(latex);
fetch(url).then(async r => {
  if (!r.ok) {
    console.error("Failed:", await r.text());
    process.exit(1);
  }
  const ab = await r.arrayBuffer();
  console.log("PDF Bytes:", ab.byteLength);
  require('fs').writeFileSync('test4.pdf', Buffer.from(ab));
}).catch(console.error);
