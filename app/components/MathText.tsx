import katex from "katex";

export function Formula({ tex, display = false }: { tex: string; display?: boolean }) {
  let html: string | undefined;
  try {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: "error", trust: false, output: "htmlAndMathml" });
  } catch { /* Keep an explicit, accessible fallback for invalid content. */ }
  return html === undefined
    ? <span role="alert" className="math-error">数式を表示できませんでした。再読み込みしてください。</span>
    : <span className={display ? "formula display" : "formula"} data-tex={tex} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MathText({ text }: { text: string }) {
  return <>{text.split(/(\$[^$]+\$)/g).map((part, i) => part.startsWith("$") && part.endsWith("$") ? <Formula key={i} tex={part.slice(1, -1)} /> : <span key={i}>{part}</span>)}</>;
}
