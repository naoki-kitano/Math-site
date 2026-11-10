"use client";
import { useEffect, useEffectEvent, useId, useRef, useState, useSyncExternalStore } from "react";
import { Formula, MathText } from "./MathText";
import LearningStepControls from "./LearningStepControls";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const px = (x: number) => 175 + 44 * x;
const py = (y: number) => 326 - 44 * y;
const curve = (h: number, k: number) => Array.from({ length: 121 }, (_, i) => {
  const u = -2.25 + 4.5 * i / 120;
  return `${i ? "L" : "M"}${px(u + h)},${py(u * u + k)}`;
}).join(" ");
const number = (v: number) => Number(v.toFixed(2)).toString();
function Label({ x, y, tex, width = 100 }: { x: number; y: number; tex: string; width?: number }) {
  return <foreignObject x={px(x) - width / 2} y={py(y) - 16} width={width} height="44"><div className="unit-math-label"><Formula tex={tex} /></div></foreignObject>;
}

export default function ParabolaExplorer({ onCompletionChange,onContinue,onBack,onProgressChange }: { onCompletionChange?: (complete: boolean) => void;onContinue?:()=>void;onBack?:()=>void;onProgressChange?:(progress:number)=>void } = {}) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [manualReduced, setManualReduced] = useState(false);
  const systemReduced = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  const reduced = systemReduced || manualReduced;
  const [selected, setSelected] = useState(0);
  const current = useRef(0);
  const target = useRef(1);
  const id = useId().replace(/:/g, "");
  const h = 2 * Math.min(progress, 1), k = Math.max(0, progress - 1);
  const stage = progress === 0 ? 0 : progress <= 1 ? 1 : 2;
  const moving = progress !== 0 && progress !== 1 && progress !== 2;
  const complete = progress === 2 && !playing;
  const previousStage = useRef(stage);
  const reportProgress = useEffectEvent((value: number) => onProgressChange?.(value / 2));
  useEffect(() => { if (previousStage.current !== stage) { previousStage.current = stage; reportProgress(stage); } }, [stage]);
  const setPosition = (p: number) => { current.current = p; setProgress(p); };
  const go = (p: number) => { setPlaying(false); setPosition(p); };
  useEffect(() => { onCompletionChange?.(complete); }, [complete, onCompletionChange]);
  useEffect(() => {
    if (!playing || reduced) return;
    let frame: number, previous: number | undefined;
    const tick = (now: number) => {
      const elapsed = previous === undefined ? 0 : Math.min(now - previous, 80);
      previous = now;
      const next = Math.min(target.current, current.current + elapsed / 2400);
      current.current = next; setProgress(next);
      if (next >= target.current) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced]);
  useEffect(() => {
    const media = window.matchMedia(query);
    const stop = () => { if (media.matches) { setPlaying(false); const next = Math.ceil(current.current); current.current = next; setProgress(next); } };
    media.addEventListener("change", stop);
    return () => media.removeEventListener("change", stop);
  }, []);
  const play = () => {
    target.current = current.current < 1 ? 1 : 2;
    if (reduced) { go(target.current); return; }
    setPlaying(true);
  };
  return <section className="parabola-explorer panel mathi-paced-visual" aria-labelledby={`${id}-heading`} data-stage={stage} data-complete={complete}>
    <h3 id={`${id}-heading`}>右へ移すのに、式では引くのはなぜ？</h3>
    <div className="translation-readout mathi-current-reading" aria-live="polite">
      <p><MathText text={stage === 0 ? "放物線 $y=x^2$ 上の点を $(u,u^2)$ とします。まず右へ $2$ 移し、同じ点の位置を追いましょう。" : stage === 1 ? "右へ $2$ 移すと、新しい横座標は $x=u+2$。元の横座標は $u=x-2$ なので、高さは $(x-2)^2$ です。" : "さらに上へ $1$ 移すと、どの点の高さにも $1$ が加わります。"} /></p>
      <div className="mathi-translation-formula">{!moving && <Formula tex={["y=x^2", "y=(x-2)^2", "y=(x-2)^2+1"][stage]} display />}</div>
    </div>
    <svg viewBox="0 0 500 390" className="parabola-diagram" role="img" aria-labelledby={`${id}-title ${id}-desc`} data-progress={progress}>
      <title id={`${id}-title`}>放物線を右へ2、上へ1移動する</title><desc id={`${id}-desc`}>破線は元の放物線。同じ三つの点を同じ量だけ移動し、全体の形を保ちます。まず右へ2、次に上へ1。頂点は原点から座標2、1へ移ります。</desc>
      <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#bb7c38" /></marker></defs>
      {[-2, -1, 0, 1, 2, 3, 4, 5, 6].map(x => <line key={x} x1={px(x)} x2={px(x)} y1="30" y2="352" stroke="#e3eaf2" />)}
      {[0, 1, 2, 3, 4, 5, 6].map(y => <line key={y} x1="40" x2="463" y1={py(y)} y2={py(y)} stroke="#e3eaf2" />)}
      <line x1="35" x2="470" y1={py(0)} y2={py(0)} stroke="#66788d" /><line x1={px(0)} x2={px(0)} y1="20" y2="354" stroke="#66788d" />
      {[-2, 0, 2, 4, 6].map(x => <Label key={x} x={x} y={-.42} tex={String(x)} width={36} />)}
      {[2, 4, 6].map(y => <Label key={y} x={-.4} y={y} tex={String(y)} width={36} />)}
      <Label x={6.8} y={-.14} tex="x" width={30} /><Label x={.24} y={6.72} tex="y" width={30} />
      <path d={curve(0, 0)} stroke="#8c9eaf" strokeWidth="2" strokeDasharray="5 5" fill="none" />
      <path d={curve(h, k)} stroke="#087c70" strokeWidth="3" fill="none" />
      {[-1, 0, 1].map(u => <g key={u}>
        {progress > 0 && <path d={`M${px(u)},${py(u * u)} L${px(u + h)},${py(u * u + k)}`} stroke={u === selected ? "#bb7c38" : "#b6c4cc"} strokeWidth={u === selected ? 2.5 : 1.5} markerEnd={`url(#${id}-arrow)`} />}
        <circle cx={px(u)} cy={py(u * u)} r="4" fill="white" stroke="#8c9eaf" />
        <circle cx={px(u + h)} cy={py(u * u + k)} r={u === selected ? 7 : 4} fill={u === selected ? "#bb7c38" : "#087c70"} stroke="white" strokeWidth="1.5" />
      </g>)}
      <Label x={selected + h + .5} y={selected * selected + k + .53} tex={`(${number(selected + h)},${number(selected * selected + k)})`} width={132} />
    </svg>
    <LearningStepControls className="unit-controls mathi-stage-controls" onPrevious={progress>0?()=>go(Math.max(0,Math.ceil(progress)-1)):onBack} onNext={progress<2?(playing?()=>setPlaying(false):play):onContinue} nextLabel={playing?"停止":"次へ"}/>
    <label className="unit-reduced"><input type="checkbox" checked={reduced} disabled={systemReduced} onChange={e => { setManualReduced(e.target.checked); setPlaying(false); if (e.target.checked) setPosition(Math.ceil(progress)); }} />動きを減らす{systemReduced && "（端末の設定を使用）"}</label>
    <details className="mathi-visual-options"><summary>別の点を追う</summary><div className="graph-controls" role="group" aria-label="追いかける点">{[-1, 0, 1].map(u => <button key={u} aria-pressed={selected === u} onClick={() => setSelected(u)}><MathText text={u === 0 ? "頂点 $(0,0)$" : `$(${u},1)$ の点`} /></button>)}</div></details>
    <details className="supplement mathi-visual-options"><summary>文字で確かめる</summary><p><MathText text="元の点を $(u,u^2)$ とすると、移動後は $x=u+2$、$y=u^2+1$。$u=x-2$ を代入すると $y=(x-2)^2+1$ です。これはすべての実数 $u$ について成り立ち、三つの点だけで確かめた結論ではありません。" /></p><Formula tex="(u,u^2)\longmapsto(u+2,u^2+1)" display /></details>
  </section>;
}
