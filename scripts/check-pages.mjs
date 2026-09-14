import { readdir, readFile, access, writeFile, cp } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
const root = path.resolve("dist/client");
// vinext nests assets under assetPrefix; Pages already mounts this directory
// at /Math-site, so place the bundle at the artifact root too.
await cp(path.join(root, "Math-site/_next"), path.join(root, "_next"), { recursive: true });
const files = await readdir(root, { recursive: true });
const html = files.filter(f => f.endsWith(".html"));
assert.equal(html.filter(f => f.replaceAll("\\", "/").startsWith("learn/")).length, 113);
let checked = 0;
for (const file of html) {
  const source = await readFile(path.join(root, file), "utf8");
  assert(!source.includes('class="katex-error"'), file);
  for (const [, url] of source.matchAll(/(?:href|src)="(\/[^"#?]*)[^"]*"/g)) {
    if (url.startsWith("//")) continue;
    assert(url.startsWith("/Math-site/"), `${file}: ${url}`);
    const target = decodeURIComponent(url.slice("/Math-site/".length)) || "index.html";
    await access(path.join(root, target));
    checked++;
  }
}
await writeFile(path.join(root, ".nojekyll"), "");
console.log(`Pages: ${html.length} HTML files; ${checked} local references verified.`);
