// Offline source migration only. Never changes the runtime math renderer.
import fs from 'node:fs';
import { literals } from './notation-inventory.mjs';

export function normalize(tex) {
  let i = 0;
  const ws = () => { while (/\s/.test(tex[i] || '') && i < tex.length) i++; };
  function argument() {
    ws();
    if (tex[i] === '{') return group('{', '}');
    if (tex[i] === '\\') return command();
    if (i >= tex.length) throw Error('Missing argument');
    return tex[i++];
  }
  function group(open, close) {
    i++;
    const value = sequence(close);
    if (tex[i] !== close) throw Error(`Unclosed ${open}`);
    i++;
    return open + value + close;
  }
  function command() {
    const match = tex.slice(i).match(/^\\(?:[a-zA-Z]+|.)/);
    if (!match) throw Error('Invalid command');
    const c = match[0]; i += c.length;
    if (c === '\\binom') {
      const unwrap = s => s.startsWith('{') ? s.slice(1, -1) : s;
      return `{}_{${unwrap(argument())}}C_{${unwrap(argument())}}`;
    }
    const braced = s => s.startsWith('{') ? s : '{'+s+'}';
    if (['\\frac', '\\dfrac', '\\tfrac'].includes(c)) return c + braced(argument()) + braced(argument());
    if (c === '\\sqrt') {
      ws();
      const index = tex[i] === '[' ? group('[', ']') : '';
      return c + index + braced(argument());
    }
    if (['\\text', '\\mathrm', '\\operatorname'].includes(c)) {
      // Text is not algebra; keep its original spelling.
      ws(); const start = i; let depth = 0;
      if (tex[i] !== '{') throw Error('Expected text group');
      do { if(tex[i]==='{')depth++; if(tex[i]==='}')depth--; i++; } while(depth && i<tex.length);
      return c + tex.slice(start, i);
    }
    return c;
  }
  function atom() {
    ws();
    let value;
    if (tex[i] === '{') value = group('{', '}');
    else if (tex[i] === '(') value = group('(', ')');
    else if (tex[i] === '[') value = group('[', ']');
    else if (tex[i] === '|') value = group('|', '|');
    else if (tex[i] === '\\') value = command();
    else { const n = tex.slice(i).match(/^\d+(?:\.\d+)?/); value=n?n[0]:tex[i]; i += value?.length || 0; }
    if (!value) throw Error('Missing atom');
    while (tex[i] === '^' || tex[i] === '_' || tex[i] === "'") {
      const op = tex[i++]; value += op + (op === "'" ? '' : argument());
    }
    // A named function value includes its argument, also in denominators.
    if (/^[fgh]'*$/.test(value) && tex[i] === '(') value += group('(', ')');
    // Trigonometric/logarithmic functions include their argument in the fraction.
    if (/^\\(?:sin|cos|tan|log|ln)(?:[_^].*)?$/.test(value)) {
      ws(); value += ' ' + atom();
      // sin 5x / (2x), log ax: coefficient and variable form one argument.
      while (/[a-zA-Z]/.test(tex[i] || '') && i < tex.length) value += atom();
    }
    // Differential notation dy/dx and d^2y/dx^2.
    if (/^d(?:\^.*)?$/.test(value) && /[xyut]/.test(tex[i] || '') && i < tex.length) value += atom();
    return value;
  }
  function sequence(close) {
    let out = '', product = '';
    const flush = () => { out += product; product = ''; };
    while (i < tex.length && tex[i] !== close) {
      if (/\s/.test(tex[i])) { product += tex[i++]; continue; }
      const boundary = tex.slice(i).match(/^(?:[=+\-,;<>:]|\\(?:to|rightarrow|Rightarrow|Longrightarrow|iff|leq?|geq?|ne[q]?|approx|sim|in|notin|quad|qquad|text|lim|sum|int)(?![a-zA-Z]))/);
      if (boundary) { flush(); const b=boundary[0]; if(['\\text','\\lim','\\sum','\\int'].includes(b)) out+=atom(); else {out+=b;i+=b.length;} continue; }
      if (tex[i] === '/') {
        i++; ws();
        if (!product.trim()) throw Error('Empty numerator');
        const denominator = atom();
        const unwrap = s => {
          if(!s.startsWith('(')||!s.endsWith(')'))return s;
          let depth=0;
          for(let k=0;k<s.length;k++){if(s[k]==='(')depth++;if(s[k]===')')depth--;if(depth===0&&k<s.length-1)return s;}
          return s.slice(1,-1);
        };
        product = `\\frac{${unwrap(product.trim())}}{${unwrap(denominator)}}`;
      } else product += atom();
    }
    flush(); return out;
  }
  return sequence(undefined);
}

export function changes() {
  const result=[];
  for (const entry of literals()) {
    let next=entry.value;
    const convert = text => /\/|\\binom/.test(text) ? normalize(text) : text;
    try {
      if (next.includes('$')) next=next.replace(/\$([^$]+)\$/g,(_,tex)=>'$'+convert(tex)+'$');
      else if (/\/|\\binom/.test(next) && !/https?:|^\.?\.?\/|node_modules|application\//.test(next) && (!/[ぁ-んァ-ヶ一-龯]/.test(next) || next.includes('\\text{')) && /[0-9a-zA-Z\\]/.test(next)) next=convert(next);
    } catch (error) { result.push({file:entry.file,before:entry.value,error:error.message});continue; }
    if(next!==entry.value)result.push({file:entry.file,start:entry.start,end:entry.end,before:entry.value,after:next,raw:entry.raw});
  }
  return result;
}
if(process.argv[1]?.endsWith('normalize-notation.mjs')) {
  const result=changes();
  if(process.argv.includes('--apply')) {
    if(result.some(r=>r.error))throw Error('Resolve inventory errors before applying');
    fs.mkdirSync('outputs/notation',{recursive:true});
    fs.writeFileSync('outputs/notation/migration.json',JSON.stringify(result,null,2));
    for(const file of new Set(result.map(r=>r.file))) {
      let source=fs.readFileSync(file,'utf8');
      for(const row of result.filter(r=>r.file===file).sort((a,b)=>b.start-a.start)) {
        const value=row.raw?'`'+row.after+'`':JSON.stringify(row.after);
        source=source.slice(0,row.start)+value+source.slice(row.end);
      }
      fs.writeFileSync(file,source);
    }
  } else console.log(JSON.stringify(result.map(({file,before,after,error})=>({file,before,after,error})),null,2));
}
