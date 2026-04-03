// latex.js is loaded from CDN in index.html as a global
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const latexjs: any;

interface RenderResult {
  html: string | null;
  error: string | null;
}

let lastGoodHtml: string | null = null;

export async function latexToHtml(source: string): Promise<RenderResult> {
  // If latexjs is not available (CDN failed), return error
  if (typeof latexjs === 'undefined') {
    return { html: lastGoodHtml, error: 'latex.js not loaded — check CDN connection' };
  }

  if (!source.trim()) {
    return { html: lastGoodHtml, error: null };
  }

  try {
    const generator = latexjs.parse(source, { generator: new latexjs.HtmlGenerator({ hyphenate: false }) });
    const doc = generator.htmlDocument();
    const serializer = new XMLSerializer();
    const html = serializer.serializeToString(doc);
    lastGoodHtml = html;
    return { html, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'LaTeX parse error';
    // Return last good render so preview doesn't blank on transient errors
    return { html: lastGoodHtml, error: errorMessage };
  }
}

export function getLastGoodHtml(): string | null {
  return lastGoodHtml;
}
