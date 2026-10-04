"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Formula, MathText } from "./MathText";

const m = String.raw;
const query = "(prefers-reduced-motion: reduce)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
type Kind = "equation" | "conditional" | "sum" | "vector" | "derivative";
const kinds: Record<string, Kind> = {
  "jr-linear-equation": "equation", "ma-conditional-probability": "conditional",
  "mb-arithmetic-sum": "sum", "mc-vector-sum": "vector", "m3-derivative-meaning": "derivative",
};
const titles: Record<Kind, string> = {
  equation: "左右を同じように変える", conditional: "条件を知ったあとの全体",
  sum: "逆順にすると、どの組も同じ和", vector: "矢印の先に、次の矢印をつなぐ",
  derivative: "二点を近づけて、傾きを比べる",
};
const stages: Record<Kind, string[]> = {
  equation: ["1 元の式", "2 両辺から3を引く", "3 両辺を2で割る"],
  conditional: ["1 6枚から選ぶ", "2 条件に合う5枚", "3 偶数の3枚"],
  sum: ["1 同じ和を二行", "2 下の行を逆順に", "3 二行分を足す"],
  vector: ["1 同じ始点", "2 矢印をつなぐ", "3 和を描く"],
  derivative: ["1 離れた二点", "2 点を近づける", "3 極限の接線"],
};
const readouts: Record<Kind, string[]> = {
  equation: ["左右は等しい量です。青緑の箱二つは、同じ未知の量を表します。", "左右から三つずつ取り除くので、等しさを保てます。", "残った左右をそれぞれ二等分します。一箱は三つ分です。"],
  conditional: ["どのカードも選ばれる確率は同じです。", "選ばれた番号が2以上と分かりました。1を除いた五枚を新しい全体にします。", "残った五枚のうち、偶数は三枚です。最初の六枚では割りません。"],
  sum: ["同じ和をもう一行書きます。二行あるので、合計は元の和の二倍です。", "下の行だけ順序を逆にします。足す順序を変えても和は同じです。", "各組の和は十四。それが五組です。最後に二で割り、一行分の和に戻します。"],
  vector: ["青緑が一つ目、橙が二つ目の移動です。", "橙の矢印は、同じ向きと長さを保ったまま動きます。", "紺の矢印は、最初の始点から最後の終点へ向かいます。これが二つの移動の和です。"],
  derivative: ["固定した点と、もう一つの点を結ぶ割線を見ます。", "横の差を零に近づけます。途中では差は零でないので、傾きを割り算で求められます。", "接線を表示しています。横の差を零にした割り算の値ではなく、傾きの極限です。"],
};
function Label({ x, y, tex, width = 110 }: { x: number; y: number; tex: string; width?: number }) {
  return <foreignObject x={x - width / 2} y={y - 18} width={width} height="40"><div className="unit-math-label"><Formula tex={tex} /></div></foreignObject>;
}
const num = (x: number) => Number(x.toFixed(3)).toString();
const gx = (x: number) => 185 + 54 * x;
const gy = (y: number) => 218 - 36 * y;
function Axes({ vector = false }: { vector?: boolean }) {
  return <g>
    {[-2, -1, 0, 1, 2, 3, 4].map(x => <line key={x} x1={gx(x)} x2={gx(x)} y1="25" y2="320" stroke="#e3eaf2" />)}
    {[-2, -1, 0, 1, 2, 3, 4, 5].map(y => <line key={y} x1="50" x2="455" y1={gy(y)} y2={gy(y)} stroke="#e3eaf2" />)}
    <line x1="44" x2="460" y1={gy(0)} y2={gy(0)} stroke="#6b7b8c" /><line x1={gx(0)} x2={gx(0)} y1="18" y2="325" stroke="#6b7b8c" />
    <Label x={472} y={gy(0)} tex="x" width={30} /><Label x={gx(0)} y={15} tex="y" width={30} />
    {[-2, 0, 1, 2, 3, 4].map(x => <Label key={x} x={gx(x)} y={gy(0) + 23} tex={String(x)} width={25} />)}
    {(vector ? [-2, 2, 4] : [1, 3, 5]).map(y => <Label key={y} x={gx(0) - 20} y={gy(y)} tex={String(y)} width={25} />)}
  </g>;
}
function Drawing({ kind, progress, id, side }: { kind: Kind; progress: number; id: string; side: number }) {
  const t = Math.min(1, progress), second = Math.max(0, progress - 1);
  if (kind === "equation") return <g>
    <Label x={118} y={32} tex={progress === 2 ? "x" : progress >= 1 ? "2x" : "2x+3"} /><Label x={379} y={32} tex={progress === 2 ? "3" : progress >= 1 ? "6" : "9"} />
    {[0, 1].map(i => <g key={i} opacity={i === 1 ? 1 - second * .82 : 1}>
      <rect x={64 + i * 63} y={95 + i * second * 74} width="53" height="64" rx="6" fill="#e0f1ec" stroke="#087c70" strokeWidth="2" />
      <Label x={90 + i * 63} y={128 + i * second * 74} tex="x" width={35} />
      {[0, 1, 2].map(j => <rect key={j} x={322 + j * 25} y={88 + i * 46 + i * second * 66} width="18" height="31" rx="3" fill="#e0f1ec" stroke="#087c70" />)}
    </g>)}
    {[0, 1, 2].map(i => <g key={i} opacity={1 - t}>
      <rect x={70 + i * 33} y={181 + t * 36} width="24" height="24" rx="3" fill="#f2d9b6" stroke="#bb7c38" />
      <rect x={322 + i * 25} y={181 + t * 36} width="18" height="24" rx="3" fill="#f2d9b6" stroke="#bb7c38" />
    </g>)}
    <Label x={250} y={135} tex="=" width={40} />
    {progress > 0 && <><Label x={115} y={282} tex={progress <= 1 ? "-3" : m`\div2`} /><Label x={375} y={282} tex={progress <= 1 ? "-3" : m`\div2`} /></>}
    <line x1="50" x2="195" y1="255" y2="255" stroke="#c0ccd4" /><line x1="305" x2="440" y1="255" y2="255" stroke="#c0ccd4" />
  </g>;
  if (kind === "conditional") return <g>
    <text x="250" y="40" textAnchor="middle" className="concept-svg-text">6枚から1枚を等確率で選ぶ</text>
    {Array.from({ length: 6 }, (_, i) => {
      const n = i + 1, x = 66 + (i % 3) * 130, y = 88 + Math.floor(i / 3) * 120;
      return <g key={n} opacity={n === 1 ? 1 - .78 * t : 1}>
        <rect x={x} y={y} width="108" height="78" rx="10" fill={n % 2 === 0 && second > 0 ? "#e0f1ec" : "#fff"} stroke={n % 2 === 0 && second > 0 ? "#087c70" : "#b4c3d0"} strokeWidth="2" />
        <Label x={x + 54} y={y + 40} tex={String(n)} width={40} />
        {n === 1 && t > 0 && <line x1={x + 15} y1={y + 60} x2={x + 93} y2={y + 18} stroke="#7b8490" strokeWidth="2" />}
        {n % 2 === 0 && second > 0 && <text x={x + 54} y={y + 103} textAnchor="middle" className="concept-svg-text">偶数</text>}
      </g>;
    })}
  </g>;
  if (kind === "sum") return <g>
    <Label x={38} y={68} tex="S" width={40} /><Label x={38} y={191} tex="S" width={40} />
    {[3, 5, 7, 9, 11].map((n, i) => <g key={n}>
      <rect x={77 + 80 * i} y="43" width="56" height="48" rx="5" fill="#e0f1ec" stroke="#087c70" />
      <Label x={105 + 80 * i} y={68} tex={String(n)} width={48} />
      <g transform={(() => {
        const swap = i === 0 || i === 4 ? Math.min(1, 2 * t) : Math.max(0, 2 * t - 1);
        const arc = i === 2 ? 0 : (i < 2 ? -1 : 1) * 76 * Math.sin(Math.PI * swap);
        return m`translate(${num(80 * (4 - 2 * i) * swap)},${num(arc)})`;
      })()}>
        <rect x={77 + 80 * i} y="166" width="56" height="48" rx="5" fill="#f8e8d3" stroke="#bb7c38" />
        <Label x={105 + 80 * i} y={191} tex={String(n)} width={48} />
      </g>
      {progress >= 1 && <><Label x={105 + 80 * i} y={128} tex="+" width={35} /><line x1={80 + 80 * i} x2={130 + 80 * i} y1="237" y2="237" stroke="#698295" /></>}
      {progress === 2 && <Label x={105 + 80 * i} y={274} tex="14" width={48} />}
    </g>)}
    {progress === 2 && <Label x={250} y={329} tex="2S=5\times14" width={250} />}
  </g>;
  if (kind === "vector") return <g>
    <Axes vector />
    <defs>{["teal", "orange", "navy"].map((c, i) => <marker key={c} id={`${id}-${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={["#087c70", "#bb7c38", "#0b1f3a"][i]} /></marker>)}</defs>
    <path d={m`M${gx(0)},${gy(0)} L${gx(3)},${gy(-2)}`} stroke="#087c70" strokeWidth="3" markerEnd={`url(#${id}-teal)`} />
    <path d={m`M${gx(0)},${gy(0)} L${gx(-1)},${gy(3)}`} stroke="#b4c3d0" strokeWidth="2" strokeDasharray="4 5" />
    <path data-vector="b" d={m`M${gx(3 * t)},${gy(-2 * t)} L${gx(-1 + 3 * t)},${gy(3 - 2 * t)}`} stroke="#bb7c38" strokeWidth="3" markerEnd={`url(#${id}-orange)`} />
    {second > 0 && <path d={m`M${gx(0)},${gy(0)} L${gx(2 * second)},${gy(second)}`} stroke="#0b1f3a" strokeWidth="3" markerEnd={`url(#${id}-navy)`} />}
    <Label x={gx(1.8)} y={gy(-1.5)} tex="\vec a" width={40} /><Label x={gx(-.8 + 3 * t)} y={gy(2 - 2 * t)} tex="\vec b" width={40} />
    {progress === 2 && <Label x={gx(2.4)} y={gy(1.5)} tex="\vec a+\vec b" width={105} />}
  </g>;
  const h = progress === 2 ? 0 : side * Math.max(.01, 1 - progress / 2), slope = 2 + h;
  const curve = Array.from({ length: 101 }, (_, i) => {
    const x = -1.4 + i * 3.7 / 100;
    return `${i ? "L" : "M"}${num(gx(x))},${num(gy(x * x))}`;
  }).join(" ");
  return <g>
    <Axes /><path d={curve} fill="none" stroke="#087c70" strokeWidth="2.5" />
    <path d={m`M${num(gx(-.2))},${num(gy(1 - 1.2 * slope))} L${num(gx(2.25))},${num(gy(1 + 1.25 * slope))}`} stroke={progress === 2 ? "#0b1f3a" : "#bb7c38"} strokeWidth="2.5" />
    {progress < 2 && <><path d={m`M${gx(1)},${gy(1)} L${num(gx(1 + h))},${gy(1)} L${num(gx(1 + h))},${num(gy((1 + h) ** 2))}`} fill="none" stroke="#697f98" strokeDasharray="4 4" /><circle cx={num(gx(1 + h))} cy={num(gy((1 + h) ** 2))} r="6" fill="#bb7c38" />{Math.abs(h) >= .35 && <Label x={gx(1 + h) + side * 24} y={gy((1 + h) ** 2) - 27} tex="Q" width={30} />}</>}
    <circle cx={gx(1)} cy={gy(1)} r="5" fill="#0b1f3a" /><Label x={gx(1) + 24} y={gy(1) - 14} tex="P" width={30} />
    <Label x={92} y={35} tex="y=x^2" width={100} />
  </g>;
}
function Explorer({ kind }: { kind: Kind }) {
  const [progress, setProgress] = useState(0), [playing, setPlaying] = useState(false);
  const [manualReduced, setManualReduced] = useState(false), [side, setSide] = useState(1);
  const systemReduced = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  const reduced = systemReduced || manualReduced, current = useRef(0), id = useId().replace(/:/g, "");
  const move = (p: number) => { setPlaying(false); current.current = p; setProgress(p); };
  useEffect(() => {
    if (!playing || reduced) return;
    let frame: number, before: number | undefined;
    const tick = (now: number) => {
      const delta = before === undefined ? 0 : Math.min(80, now - before);
      before = now; current.current = Math.min(2, current.current + delta / 2000);
      setProgress(current.current);
      if (current.current === 2) setPlaying(false); else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced]);
  useEffect(() => {
    const media = window.matchMedia(query), stop = () => { if (media.matches) setPlaying(false); };
    media.addEventListener("change", stop); return () => media.removeEventListener("change", stop);
  }, []);
  const play = () => {
    if (reduced || kind === "conditional") { move(Math.min(2, Math.floor(progress) + 1)); return; }
    if (progress === 2) { current.current = 0; setProgress(0); }
    setPlaying(true);
  };
  const stage = progress < 1 ? 0 : progress < 2 ? 1 : 2;
  const h = progress === 2 ? 0 : side * Math.max(.01, 1 - progress / 2);
  const tex = kind === "equation" ? ["2x+3=9", "2x=6", "x=3"][stage]
    : kind === "conditional" ? [m`P(B)=\frac36`, m`A=\{2,3,4,5,6\}`, m`P_A(B)=\frac35`][stage]
    : kind === "sum" ? ["S=3+5+7+9+11", "3+11=5+9=7+7=14", m`S=\frac{5\times14}{2}=35`][stage]
    : kind === "vector" ? (stage === 2 ? m`\vec a+\vec b=(3-1,-2+3)=(2,1)` : m`\vec a=(3,-2),\quad\vec b=(-1,3)`)
    : progress === 2 ? m`\lim_{h\to0}(2+h)=2=f'(1)` : m`h\approx${num(h)},\quad 2+h\approx${num(2 + h)}`;
  return <section className="concept-explorer panel" data-kind={kind} data-progress={progress} aria-labelledby={`${id}-heading`}>
    <p className="section-label">図で確かめる</p><h3 id={`${id}-heading`}>{titles[kind]}</h3>
    <p>{kind === "conditional" ? "「次の段階を見る」を押し、分母になる全体を確かめよう。" : "「変化を再生」を押し、動くものと変わらないものを追ってみよう。"}</p>
    <div className="unit-stages" role="group" aria-label="図の段階">{stages[kind].map((title, i) => <button key={title} aria-pressed={progress === i} onClick={() => move(i)}>{title}</button>)}</div>
    <svg viewBox="0 0 500 355" className="concept-diagram" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{titles[kind]}</title><desc id={`${id}-desc`}>{readouts[kind][stage]}</desc>
      <Drawing kind={kind} progress={progress} id={id} side={side} />
    </svg>
    <div className="actions unit-controls"><button className="button" disabled={(reduced || kind === "conditional") && progress === 2} onClick={playing ? () => setPlaying(false) : play}>{playing ? "停止" : reduced || kind === "conditional" ? "次の段階を見る" : progress > 0 && progress < 2 ? "再生を続ける" : "変化を再生"}</button><button className="button secondary" onClick={() => move(0)}>リセット</button></div>
    {kind !== "conditional" && <label className="unit-reduced"><input type="checkbox" checked={reduced} disabled={systemReduced} onChange={e => { setManualReduced(e.target.checked); move(Math.ceil(progress)); }} />動きを減らす{systemReduced && "（端末の設定を使用）"}</label>}
    {kind === "derivative" && <div className="graph-controls" role="group" aria-label="点を近づける側">{[1, -1].map(s => <button key={s} aria-pressed={side === s} onClick={() => { setSide(s); move(0); }}>{s === 1 ? "右から近づける" : "左から近づける"}</button>)}</div>}
    <div className="translation-readout"><p aria-live="polite">{readouts[kind][stage]}</p><Formula tex={tex} display /></div>
    {kind === "equation" && <p><MathText text={progress === 2 ? "元の式へ代入すると $2\\cdot3+3=9$。左右が一致します。箱の図はこの正の解の例を表し、等式の操作自体は負の解の場合にも使えます。" : "小さい長方形一つを $1$ とします。大きい箱一つが、求めたい量 $x$ です。"} /></p>}
    {kind === "conditional" && <p><MathText text="$A$ は「2以上」、$B$ は「偶数」です。灰色のカードは、条件を知ったあとの全体に含めません。" /></p>}
    {kind === "sum" && <details className="supplement"><summary>何項でも同じになる理由</summary><p><MathText text="等差数列では $a_k=a_1+(k-1)d$、$a_{n+1-k}=a_1+(n-k)d$。足すと $2a_1+(n-1)d=a_1+a_n$ です。どの組も同じで、組の個数は $n$。だから $2S_n=n(a_1+a_n)$ となります。" /></p></details>}
    {kind === "vector" && <p><MathText text="橙の矢印の始点と終点に同じ移動量を足すので、終点から始点を引いた成分 $(-1,3)$ は変わりません。" /></p>}
    {kind === "derivative" && <><p><MathText text="固定する点は $P(1,1)$。$h\ne0$ の間に約分します。" /></p><Formula tex="\frac{(1+h)^2-1}{h}=\frac{h(2+h)}h" display /><Formula tex="=2+h\quad(h\ne0)" display /><p><MathText text={progress === 2 ? "右からも左からも傾きは $2$ に近づきます。接線は $y-1=2(x-1)$、つまり $y=2x-1$。点の高さ $f(1)=1$ と傾き $f'(1)=2$ は別です。" : "破線の横の差は $h$、縦の差は $2h+h^2$。差は符号つきの量です。左から近づけると、この例ではどちらも負になります。"} /></p></>}
  </section>;
}
export default function ConceptExplorer({ slug }: { slug: string }) {
  const kind = kinds[slug];
  return kind ? <Explorer key={slug} kind={kind} /> : null;
}
