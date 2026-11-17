import type { ReactNode } from "react";
import { MathText } from "./MathText";

const m = String.raw;
const ink = "#14243f";
const accent = "#247669";
const selected = "#bbdfd7";

function Label({ x, y, text, width = 60 }: { x: number; y: number; text: string; width?: number }) {
  return <foreignObject x={x - width / 2} y={y} width={width} height="38">
    <div style={{ textAlign: "center", fontSize: 20, lineHeight: 1.25 }}><MathText text={text} /></div>
  </foreignObject>;
}

const axisY = 145;
const xAt = (z: number) => 180 + 42 * z;
const densityY = (z: number) => axisY - 270 * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
function densityCurve(lo: number, hi: number) {
  return Array.from({ length: 121 }, (_, i) => {
    const z = lo + (hi - lo) * i / 120;
    return `${xAt(z).toFixed(2)},${densityY(z).toFixed(2)}`;
  }).join(" ");
}

const normalRegions = {
  middle: {
    ranges: [[-1, 1]], ticks: [-1, 0, 1], title: "標準正規分布の中央の確率",
    caption: m`中央の面積は片側の $2$ 倍。$2\times0.3413=0.6826$（近似値）。`,
  },
  tail: {
    ranges: [[1, 3.7]], ticks: [0, 1], title: "標準正規分布の右側の確率",
    caption: m`右半分から $0$ と $1$ の間の面積を引きます。$0.5-0.3413=0.1587$（近似値）。`,
  },
  critical: {
    ranges: [[-3.7, -1.96], [1.96, 3.7]], ticks: [-1.96, 0, 1.96], title: "両側の棄却域と今回の検定統計量",
    caption: m`帰無仮説の下で左右の裾は各約 $2.5\%$。今回の $z=2.4$ は右の棄却域に入ります。`,
  },
};

function Normal({ region }: { region: keyof typeof normalRegions }) {
  const { ranges, ticks, title, caption } = normalRegions[region];
  return <figure className="math-b-figure">
    <svg viewBox="0 0 360 190" role="img" aria-label={title}>
      {ranges.map(([a, b]) => <polygon key={a} points={`${xAt(a)},${axisY} ${densityCurve(a, b)} ${xAt(b)},${axisY}`} fill={selected} />)}
      <polyline points={densityCurve(-3.7, 3.7)} fill="none" stroke={accent} strokeWidth="2" />
      <line x1="20" x2="340" y1={axisY} y2={axisY} stroke={ink} />
      {ticks.map(z => <g key={z}>
        <line x1={xAt(z)} x2={xAt(z)} y1={axisY} y2={axisY + 5} stroke={ink} />
        <Label x={xAt(z)} y={axisY + 8} text={`$${z}$`} />
      </g>)}
      {region === "critical" && <g>
        <line x1={xAt(2.4)} x2={xAt(2.4)} y1="111" y2={axisY} stroke={ink} strokeDasharray="3 3" />
        <circle cx={xAt(2.4)} cy={axisY} r="3" fill={ink} />
        <Label x={xAt(2.4)} y={80} text="$2.4$" />
      </g>}
      <Label x={340} y={axisY - 30} text="$z$" width={32} />
    </svg><figcaption><MathText text={caption} /></figcaption>
  </figure>;
}

function SequenceTerms() {
  return <figure className="math-b-figure">
    <svg viewBox="0 0 360 225" role="img" aria-label="項番号に対する項の値。第5項の点は高さ9">
      <path d="M45 23 V182 H340" fill="none" stroke={ink} />
      {[1, 2, 3, 4, 5].map(n => {
        const value = 2 * n - 1;
        const x = 45 + 49 * n;
        const y = 182 - 15 * value;
        return <g key={n}>
          {n === 5 && <line x1={x} x2={x} y1={y} y2="182" stroke={accent} strokeDasharray="4 4" />}
          <circle cx={x} cy={y} r={n === 5 ? 5 : 3.5} fill={n === 5 ? accent : ink} />
          <Label x={x} y={188} text={`$${n}$`} width={35} />
          <Label x={x} y={y - 32} text={`$${value}$`} width={38} />
        </g>;
      })}
      <Label x={335} y={150} text="$n$" width={35} /><Label x={24} y={0} text="$a_n$" width={45} />
    </svg><figcaption><MathText text={m`横軸で項番号 $5$ を選ぶと、点の高さから $a_5=9$ と読めます。`} /></figcaption>
  </figure>;
}

function Binomial() {
  const weights = [1, 5, 10, 10, 5, 1];
  return <figure className="math-b-figure">
    <svg viewBox="0 0 360 205" role="img" aria-label="表の回数別の並びの数。表が2回の棒は10通り">
      <path d="M25 10 V158 H337" fill="none" stroke={ink} />
      {weights.map((weight, k) => {
        const x = 50 + k * 49;
        const y = 158 - weight * 9.5;
        return <g key={k}>
          <rect x={x - 13} y={y} width="26" height={158 - y} fill={k === 2 ? accent : selected} stroke={k === 2 ? ink : "none"} />
          <Label x={x} y={165} text={`$${k}$`} width={40} />
          <Label x={x} y={y - 31} text={`$${weight}$`} width={46} />
        </g>;
      })}
    </svg><figcaption><MathText text={m`横軸は表の回数、棒の高さは並びの数。表が $2$ 回の確率は $\frac{10}{32}=\frac5{16}$ です。`} /></figcaption>
  </figure>;
}

function ConfidenceInterval() {
  return <figure className="math-b-figure">
    <svg viewBox="0 0 360 114" role="img" aria-label="標本平均45を中心とした区間、43.04から46.96まで">
      <line x1="25" x2="335" y1="55" y2="55" stroke={ink} />
      <line x1="65" x2="295" y1="55" y2="55" stroke={accent} strokeWidth="6" />
      {[65, 180, 295].map(x => <line key={x} x1={x} x2={x} y1="47" y2="63" stroke={ink} />)}
      <Label x={65} y={70} text="$43.04$" width={86} /><Label x={180} y={70} text="$45$" />
      <Label x={295} y={70} text="$46.96$" width={86} /><Label x={180} y={8} text={m`$\overline x$`} />
    </svg><figcaption><MathText text={m`今回の標本平均 $45$ から左右に $1.96$ ずつ取ります。`} /></figcaption>
  </figure>;
}

function DataLine() {
  return <figure className="math-b-figure">
    <svg viewBox="0 0 360 218" role="img" aria-label="代表点を結ぶと、横に4進んで縦に8上がる">
      <path d="M57 16 V175 H340" fill="none" stroke={ink} />
      <path d="M57 120 H285 V32" fill="none" stroke={ink} strokeDasharray="5 4" />
      <path d="M57 120 L285 32" fill="none" stroke={accent} strokeWidth="3" />
      <circle cx="57" cy="120" r="4" fill={ink} /><circle cx="285" cy="32" r="4" fill={ink} />
      <Label x={30} y={105} text="$5$" width={40} /><Label x={30} y={17} text="$13$" width={46} />
      <path d="M57 32 H285 M285 120 V175" stroke={ink} strokeWidth="0.8" opacity=".45" strokeDasharray="2 4" />
      <Label x={57} y={180} text="$0$" width={36} /><Label x={285} y={180} text="$4$" width={36} />
      <Label x={170} y={124} text="$+4$" /><Label x={314} y={61} text="$+8$" />
      <Label x={70} y={0} text="$y$" width={30} /><Label x={339} y={146} text="$x$" width={30} />
    </svg><figcaption><MathText text={m`代表点を結ぶ直線の傾きは $\frac84=2$。横に $1$ 進むと、モデルの値は $2$ 増えます。`} /></figcaption>
  </figure>;
}

export function mathBExampleVisualSteps(slug: string, index: number): ReactNode[] {
  if (slug === "mb-normal-distribution" && (index === 0 || index === 1)) return [<Normal key="normal" region={index === 0 ? "middle" : "tail"} />];
  if (index !== 0) return [];
  switch (slug) {
    case "mb-two-sided-test": return [<Normal key="test" region="critical" />];
    case "mb-sequence-terms": return [<SequenceTerms key="SequenceTerms" />];
    case "mb-binomial-distribution": return [<Binomial key="Binomial" />];
    case "mb-mean-interval": return [<ConfidenceInterval key="ConfidenceInterval" />];
    case "mb-data-function": return [<DataLine key="DataLine" />];
    default: return [];
  }
}
