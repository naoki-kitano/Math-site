'use client';
import type {ReactNode} from 'react';
import {Formula, MathText} from './MathText';

const blue = '#176c82';
const gold = '#936114';
const ink = '#213950';
const light = '#c4d3dd';
const m = String.raw;

function Picture({height, label, children}: {height: number; label: string; children: ReactNode}) {
  return <svg viewBox={`0 0 300 ${height}`} className="mb-model-picture" role="img" aria-label={label}>{children}</svg>;
}
function Label({x, y, text, width = 50}: {x: number; y: number; text: string; width?: number}) {
  return <foreignObject x={x - width / 2} y={y - 13} width={width} height="30"><div className="mb-model-label"><MathText text={text}/></div></foreignObject>;
}
function Interest({stage}: {stage: number}) {
  // A new tile is the interest on two eligible tiles at this illustrative 50% rate.
  return <><Picture height={103} label={`単利と複利の${stage}年後の残高を、1万円のマスで比較`}>
    {[false, true].map((compound, row) => {
      const amount = [4, 6, compound ? 9 : 8][stage];
      const y = 20 + 44 * row;
      return <g key={row}>
        <Label x={25} y={y + 8} text={compound ? '複利' : '単利'}/>
        {Array.from({length: 9}, (_, i) => {
          const eligiblePair = i < 6 ? i - 4 : i - 6;
          const position = i < amount ? i : eligiblePair * 2 + 0.5;
          return <rect key={i} x="50" y={y} width="18" height="20" rx="3" className="mb-model-move" style={{transform: `translateX(${22 * position}px)`, opacity: i < amount ? 1 : 0}} fill={i < 4 ? blue : gold}/>;
        })}
        <Label x={270} y={y + 8} text={`$${amount}$`}/>
      </g>;
    })}
  </Picture><p className="mb-model-key"><MathText text="1マスは $1$ 万円"/></p></>;
}
function Deposits({stage}: {stage: number}) {
  const yearX = (year: number) => 38 + year * 76;
  const amounts = [['1000'], ['1020', '1000'], ['1040.4', '1020', '1000']][stage];
  return <Picture height={155} label={`${stage + 1}年目の年末。各入金を預けた期間と、その元利合計（円）`}>
    {[0, 1, 2].map(i => <Label key={i} x={yearX(i)} y={14} width={70} text={`${i + 1}年末`}/>)}
    <Label x={259} y={14} width={70} text="金額(円)"/>
    {[0, 1, 2].map(i => {
      const y = 46 + 39 * i;
      const x = yearX(i);
      const end = yearX(Math.max(i, stage));
      return <g key={i} style={{opacity: i <= stage ? 1 : 0}}>
        <circle cx={x} cy={y} r="5" fill="white" stroke={blue} strokeWidth="2"/>
        <path d={`M${x} ${y}h76`} stroke={blue} strokeWidth="2" className="mb-model-move" style={{transformOrigin: `${x}px ${y}px`, transform: `scaleX(${(end - x) / 76})`}}/>
        <circle cx={x} cy={y} r="5" fill={blue} className="mb-model-move" style={{transform: `translateX(${end - x}px)`}}/>
        {amounts[i] && <Label x={258} y={y} width={78} text={`$${amounts[i]}$`}/>}
      </g>;
    })}
  </Picture>;
}

const measured = [5, 8, 8, 12, 13];
const predict = (x: number) => 5 + 2 * x;
const chartX = (x: number) => 39 + 51 * x;
const baseline = 163;
const chartY = (y: number) => baseline - y * 10;
function Scatter({stage, residual}: {stage: number; residual?: boolean}) {
  const flat = Boolean(residual && stage >= 1);
  const zero = 84;
  return <><Picture height={190} label={flat ? '残差の散布図。横の位置を保ち、各予測値を0にそろえた図' : '五つの観測点と、両端の二点を結ぶ予測直線'}>
    <path d={`M${chartX(0)} 14V${baseline}H270`} fill="none" stroke={light} strokeWidth="1.5"/>
    <Label x={282} y={baseline + 1} text="$x$" width={30}/>
    <Label x={55} y={14} text={flat ? '残差' : '$y$'} width={40}/>
    {flat && <line x1={chartX(0)} x2="270" y1={zero} y2={zero} stroke={light} strokeDasharray="4 3"/>}
    {(flat ? [0] : [0, 5, 9, 13]).map(value => {
      const y = flat ? zero - value * 10 : chartY(value);
      return <Label key={value} x={14} y={y} width={25} text={`$${value}$`}/>;
    })}
    {measured.map((_, x) => <Label key={x} x={chartX(x)} y={178} width={30} text={`$${x}$`}/>)}
    {!flat && <line x1={chartX(0)} y1={chartY(5)} x2={chartX(4)} y2={chartY(13)} stroke={blue} strokeWidth="2" opacity={residual || stage > 0 ? 1 : 0}/>}
    {!residual && stage === 1 && <path className="mb-model-draw" pathLength="1" d={`M${chartX(0)} ${chartY(5)}H${chartX(4)}V${chartY(13)}`} fill="none" stroke={gold} strokeWidth="2" strokeDasharray="1"/>}
    {measured.map((obs, x) => {
      const fit = chartY(predict(x));
      const selected = residual || stage === 2 && x === 3;
      return <g key={x} className="mb-model-move" style={{transform: `translateY(${flat ? zero - fit : 0}px)`}}>
        {selected && <><line x1={chartX(x)} x2={chartX(x)} y1={fit} y2={chartY(obs)} stroke={gold} strokeWidth="3"/>
          <circle cx={chartX(x)} cy={fit} r="5" fill="white" stroke={blue} strokeWidth="2"/></>}
        <circle cx={chartX(x)} cy={chartY(obs)} r={residual || x === 0 || x === 4 || stage === 2 && x === 3 ? 4 : 3} fill={ink}/>
      </g>;
    })}
  </Picture>{residual && stage === 2 && <div className="mb-model-key"><Formula tex={m`0^2+1^2+(-1)^2+1^2+0^2=3`}/></div>}</>;
}

const experiments = [[1, 0, 0, 0], [0, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0]];
function Trials({stage}: {stage: number}) {
  const plot = stage === 2;
  const slotX = (total: number) => 55 + 46 * total;
  const levels = [0, 0, 0, 0, 0];
  return <><Picture height={160} label={plot ? '実験ごとの表の回数は1回、2回、2回、3回。2回の列に二点が重なる。' : '一行に四投。一回の実験の結果から表の個数を数える。'}>
    {plot && <><line x1="42" x2="254" y1="126" y2="126" stroke={ink}/>{levels.map((_, i) => <Label key={i} x={slotX(i)} y={142} text={`$${i}$`} width={30}/>)}</>}
    {experiments.map((tosses, row) => {
      const heads = tosses.reduce((a, b) => a + b, 0);
      const y = 22 + 32 * row;
      const stackY = 115 - 19 * levels[heads]++;
      return <g key={row} opacity={stage === 0 && row > 0 ? 0 : 1}>
        {!plot && tosses.map((head, j) => <circle key={j} cx={53 + 28 * j} cy={y} r="9" fill={head ? blue : 'white'} stroke={blue} strokeWidth="1.5"/>)}
        <g className="mb-model-move" style={{transform: `translate(${plot ? slotX(heads) : 196}px,${plot ? stackY : y}px)`}}>
          <circle r={plot ? 7 : 12} fill={plot ? blue : '#edf5f7'} stroke={blue}/>
          {!plot && <Label x={0} y={0} width={24} text={`$${heads}$`}/>}
        </g>
      </g>;
    })}
  </Picture><p className="mb-model-key">{plot ? '横軸は表の回数' : '塗りつぶしが表。右は表の回数。'}</p></>;
}

export default function MathBSocietyStructure({kind, stage, reduce}: {kind: string; stage: number; reduce: boolean}) {
  let picture: ReactNode;
  switch (kind) {
    case 'mb-society-interest': picture = <Interest stage={stage}/>; break;
    case 'mb-society-deposits': picture = <Deposits stage={stage}/>; break;
    case 'mb-society-fit': picture = <Scatter stage={stage}/>; break;
    case 'mb-society-residual': picture = <Scatter stage={stage} residual/>; break;
    case 'mb-society-trials': picture = <Trials stage={stage}/>; break;
    default: return null;
  }
  return <div className="mb-model-scene" data-reduce={reduce} data-kind={kind} data-stage={stage}>{picture}</div>;
}
