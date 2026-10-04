"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Formula, MathText } from "./MathText";
import { originalTriangle, rotateClockwise, type Point } from "../lib/unit-circle-motion";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (callback: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const motionSnapshot = () => window.matchMedia(motionQuery).matches;
const px = (x: number) => 210 + 130 * x;
const py = (y: number) => 210 - 130 * y;
const svgPoint = ([x, y]: Point) => `${px(x)},${py(y)}`;
const arc = (start: number, end: number, r: number) => Array.from({ length: 81 }, (_, i) => {
  const a = start + (end - start) * i / 80;
  // Match the existing coordinate diagrams: serialize subpixel coordinates
  // consistently across the Worker and browser math implementations.
  return `${i ? "L" : "M"}${px(r * Math.cos(a)).toFixed(2)},${py(r * Math.sin(a)).toFixed(2)}`;
}).join(" ");
function MathLabel({ at, tex, width = 104 }: { at: Point; tex: string; width?: number }) {
  return <foreignObject x={px(at[0]) - width / 2} y={py(at[1]) - 18} width={width} height="48"><div className="unit-math-label"><Formula tex={tex} /></div></foreignObject>;
}

export default function UnitCircleExplorer() {
  const [stage, setStage] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const systemReduced = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
  const reduced = systemReduced || reduceMotion;
  const rotationRef = useRef(0);
  const uid = useId().replace(/:/g, "");
  const original = originalTriangle.point;
  const foot = originalTriangle.foot;
  const moving = rotateClockwise(original, rotation);
  const movingFoot = rotateClockwise(foot, rotation);
  const intermediate = rotation > 0 && rotation < 180;

  useEffect(() => {
    if (!playing || reduced) return;
    let frame: number, previous: number | undefined;
    const tick = (time: number) => {
      const elapsed = previous === undefined ? 0 : Math.min(time - previous, 80);
      previous = time;
      const next = Math.min(180, rotationRef.current + elapsed * 180 / 4200);
      rotationRef.current = next;
      setRotation(next);
      if (next >= 180) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced]);

  // A setting change stops motion immediately; do not resume it implicitly.
  useEffect(() => {
    const media = window.matchMedia(motionQuery);
    const stop = () => { if (media.matches) setPlaying(false); };
    media.addEventListener("change", stop);
    return () => media.removeEventListener("change", stop);
  }, []);

  const position = (value: number) => { rotationRef.current = value; setRotation(value); };
  const chooseStage = (value: number) => {
    setPlaying(false); setStage(value); position(value === 0 ? 0 : 180);
  };
  const replay = () => {
    setStage(1);
    if (reduced) { position(180); setPlaying(false); return; }
    if (rotationRef.current >= 180) position(0);
    setPlaying(true);
  };
  const reset = () => { setPlaying(false); setStage(0); position(0); };
  const status = stage === 0 ? "元の点は第三象限。正弦はこの点の縦の座標です。" : stage === 2 ? "元の点は横軸より下。長さは正でも、縦の座標は負です。" : intermediate ? "青い辺の長さは、回しても変わりません。" : rotation === 180 ? "半回転が完了。第一象限の三角形と辺が対応しました。" : "再生すると、原点を中心に時計回りに半回転します。";
  return <section className="unit-explorer panel" aria-labelledby={`${uid}-title`}>
    <p className="section-label">図で一問</p>
    <h3 id={`${uid}-title`}><Formula tex="\sin\dfrac{4\pi}{3}" /> を求めよう</h3>
    <p>まず「時計回りに回す」を押して、同じ辺を追ってみよう。</p>
    <div className="unit-stages" role="group" aria-label="考える順序">
      {["1 位置をみる", "2 長さをみる", "3 符号をつける"].map((label, i) => <button key={label} aria-pressed={stage === i} onClick={() => chooseStage(i)}>{label}</button>)}
    </div>
    <div className="unit-layout">
      <div>
        <svg viewBox="0 0 420 430" role="img" aria-labelledby={`${uid}-diagram-title ${uid}-diagram-desc`} className="unit-diagram" data-rotation={rotation}>
          <title id={`${uid}-diagram-title`}>第三象限の直角三角形を時計回りに半回転する</title>
          <desc id={`${uid}-diagram-desc`}>原点から左下の元の点へ伸びる半径と、横軸へ下ろした垂線でできる三角形。原点を中心に時計回りで半回転すると、第一象限の三角形と重なります。辺の長さは一定です。元の点の縦座標は負です。</desc>
          <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 9 5 L 0 9" fill="none" stroke="#087c70" strokeWidth="1.5" /></marker></defs>
          <circle cx="210" cy="210" r="130" fill="#f8fafb" stroke="#8195a9" strokeWidth="1.5" />
          <line x1="32" y1="210" x2="386" y2="210" stroke="#8195a9" />
          <line x1="210" y1="30" x2="210" y2="390" stroke="#8195a9" />
          <MathLabel at={[1.42, -.1]} tex="x" width={28} /><MathLabel at={[.12, 1.36]} tex="y" width={28} />
          <MathLabel at={[.1, -.18]} tex="O" width={28} /><MathLabel at={[1.02, -.18]} tex="1" width={28} />
          <MathLabel at={[-1.05, -.18]} tex="-1" width={38} /><MathLabel at={[-.15, 1.02]} tex="1" width={28} />
          <polygon points={[svgPoint([0, 0]), svgPoint(foot), svgPoint(original)].join(" ")} fill={stage === 2 ? "#c77b2720" : "none"} stroke="#7c8899" strokeWidth="2" strokeDasharray="5 4" />
          <circle cx={px(original[0])} cy={py(original[1])} r="5" fill="#233d5b" />
          <MathLabel at={[-.67, -1.16]} tex={stage === 2 ? "P\\left(-\\frac12,-\\frac{\\sqrt3}{2}\\right)" : "P"} width={174} />
          {stage === 0 && <><path d={arc(0, 4 * Math.PI / 3, .3)} fill="none" stroke="#087c70" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`} /><MathLabel at={[-.1, .5]} tex="\frac{4\pi}{3}" width={54} /></>}
          {stage !== 0 && <path d={arc(4 * Math.PI / 3, Math.PI / 3, 1.17)} fill="none" stroke="#087c70" strokeWidth="2" strokeDasharray="4 4" markerEnd={`url(#${uid}-arrow)`} />}
          <g data-testid="rigid-triangle" opacity={stage === 2 ? .5 : 1}>
            <polygon points={[svgPoint([0, 0]), svgPoint(movingFoot), svgPoint(moving)].join(" ")} fill="#d98b2d22" />
            <line x1="210" y1="210" x2={px(moving[0])} y2={py(moving[1])} stroke="#c67c28" strokeWidth="3" />
            <line x1="210" y1="210" x2={px(movingFoot[0])} y2={py(movingFoot[1])} stroke="#c67c28" strokeWidth="4" />
            <line x1={px(movingFoot[0])} y1={py(movingFoot[1])} x2={px(moving[0])} y2={py(moving[1])} stroke="#496fa8" strokeWidth="5" />
            <polyline points={([[-.42, 0], [-.42, -.08], [-.5, -.08]] as Point[]).map(p => svgPoint(rotateClockwise(p, rotation))).join(" ")} stroke="#c67c28" strokeWidth="1.5" fill="none" />
            <circle cx={px(moving[0])} cy={py(moving[1])} r="5" fill="#c67c28" />
          </g>
          {rotation === 180 && <><path d={arc(0, Math.PI / 3, .3)} fill="none" stroke="#c67c28" strokeWidth="2" /><MathLabel at={[.44, .26]} tex="\frac{\pi}{3}" width={45} /><MathLabel at={[.88, .49]} tex="\frac{\sqrt3}{2}" width={65} /><MathLabel at={[.3, -.2]} tex="\frac12" width={42} /><MathLabel at={[.08, .64]} tex="1" width={26} /></>}
          {stage === 2 && <><line x1={px(-.5)} y1="210" x2={px(-.5)} y2={py(original[1])} stroke="#496fa8" strokeWidth="5" /><MathLabel at={[-.94, -.48]} tex="y=-\frac{\sqrt3}{2}" width={116} /></>}
        </svg>
    <div className="actions unit-controls">
      <button className="button" onClick={playing ? () => setPlaying(false) : replay}>{playing ? "停止" : reduced ? "半回転後を見る" : intermediate ? "再生を続ける" : "時計回りに回す"}</button>
      <button className="button secondary" onClick={reset}>リセット</button>
      <button className="button secondary" disabled={stage === 2 || rotation !== 180} onClick={() => chooseStage(2)}>元の点の符号をみる</button>
    </div>
    {!reduced && <details className="unit-manual"><summary>途中の位置を手で動かす</summary><label className="unit-scrubber">回す途中を自分で確かめる<input aria-label="時計回りの回転量" type="range" min="0" max="180" step="1" value={rotation} aria-valuetext={`時計回りに${Math.round(rotation)}度。180度で半回転。`} onChange={e => { setPlaying(false); setStage(1); position(Number(e.target.value)); }} /><span>回転前 → 半回転後</span></label></details>}
    <label className="unit-reduced"><input type="checkbox" checked={reduced} disabled={systemReduced} onChange={e => { setReduceMotion(e.target.checked); setPlaying(false); if (e.target.checked && stage === 1) position(180); }} />動きを減らす{systemReduced && "（端末の設定を使用）"}</label>
        <p className="unit-legend"><span className="unit-side-key" />青い辺は、回しても同じ長さ。破線は元の三角形。</p>
      </div>
      <div className="unit-explanation">
        <div aria-live="polite" aria-atomic="true"><h4>{["元の点を決める", "鋭角で長さを求める", "元の点の上下で決める"][stage]}</h4><p>{status}</p></div>
        {stage === 0 && <><Formula tex="\frac{4\pi}{3}=\pi+\frac{\pi}{3}" display /><p><MathText text="正の横軸から反時計回りに $\pi$ を越えた、左下の点です。$\sin$ は縦の座標を読みます。" /></p></>}
        {stage === 1 && <><Formula tex="\frac{4\pi}{3}-\pi=\frac{\pi}{3}" display /><p><MathText text="三角形を原点のまわりに時計回りで $\pi$ だけ回します。半回転後は、半径 $1$、鋭角 $\frac{\pi}{3}$ の直角三角形です。" /></p>{rotation === 180 && <Formula tex="\text{青い辺の長さ}=\sin\frac{\pi}{3}=\frac{\sqrt3}{2}" display />}</>}
        {stage === 2 && <><p><MathText text="元の点 $P$ は横軸より下なので $y<0$。青い辺の長さ $\frac{\sqrt3}{2}$ に負号をつけます。" /></p><div className="unit-answer"><Formula tex="\sin\frac{4\pi}{3}=-\frac{\sqrt3}{2}" display /></div></>}
        {stage > 0 && <div className="unit-lengths"><span>回転中も変わらない辺の長さ</span><Formula tex="\frac12,\quad\frac{\sqrt3}{2},\quad1" /></div>}
        {stage === 1 && <p className="meta">回転の途中では辺が斜めになります。青い辺の長さと、そのときの点の縦座標は区別します。</p>}
      </div>
    </div>
    <details className="supplement"><summary>長さが分かる根拠・回転と対称移動の違い</summary>
      <p><MathText text="正三角形を半分にすると、辺の比は $1:\sqrt3:2$。斜辺を $1$ にそろえると、短い辺は $\frac12$、長い辺は $\frac{\sqrt3}{2}$ です。$\frac{\pi}{3}$ の向かい側が長い辺です。" /></p>
      <p><MathText text="回転は図形の長さと角を保ちます。半回転では $(x,y)\mapsto(-x,-y)$ となり、元の点 $P$ と回転後の点の縦座標は反対符号です。ここで動かしたのは比較用の三角形で、求める角は最初の $\frac{4\pi}{3}$ のままです。" /></p>
      <p><MathText text="横軸に関する対称移動なら $(x,y)\mapsto(x,-y)$。この第三象限の点は第二象限へ移ります。今回の時計回りの半回転とは別の操作です。" /></p>
    </details>
  </section>;
}
