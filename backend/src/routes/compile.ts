import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { latex } = req.body;
    
    if (!latex) {
      return res.status(400).json({ error: 'LaTeX content is required' });
    }

    // latexonline.cc accepts the source via the text= query param
    const url = 'https://latexonline.cc/compile?text=' + encodeURIComponent(latex);

    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LaTeX compilation failed:', errorText);
      return res.status(response.status).send('Compilation failed: ' + errorText);
    }

    // Stream the PDF back to the client
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
    res.send(buffer);

  } catch (error) {
    console.error('PDF Compile Route Error:', error);
    res.status(500).json({ error: 'Failed to compile PDF' });
  }
});

export default router;
