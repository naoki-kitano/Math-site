"use client";
import { useState } from "react";
import { Formula, MathText } from "./MathText";
import LearningStepControls from "./LearningStepControls";
export const coordinateCases = [
  { label:"右上",x:.6,y:.8,xTex:String.raw`\dfrac35`,yTex:String.raw`\dfrac45`,tan:String.raw`\dfrac43` },
  { label:"左上",x:-.6,y:.8,xTex:String.raw`-\dfrac35`,yTex:String.raw`\dfrac45`,tan:String.raw`-\dfrac43` },
  { label:"左下",x:-.6,y:-.8,xTex:String.raw`-\dfrac35`,yTex:String.raw`-\dfrac45`,tan:String.raw`\dfrac43` },
  { label:"右下",x:.6,y:-.8,xTex:String.raw`\dfrac35`,yTex:String.raw`-\dfrac45`,tan:String.raw`-\dfrac43` },
  { label:"真上",x:0,y:1,xTex:"0",yTex:"1",tan:null },
];
export const basicAngleCases = [
  { angle:"0",x:1,y:0,xTex:"1",yTex:"0",tan:"0" },
  { angle:String.raw`\dfrac\pi6`,x:Math.sqrt(3)/2,y:.5,xTex:String.raw`\dfrac{\sqrt3}2`,yTex:String.raw`\dfrac12`,tan:String.raw`\dfrac1{\sqrt3}` },
  { angle:String.raw`\dfrac\pi4`,x:Math.SQRT1_2,y:Math.SQRT1_2,xTex:String.raw`\dfrac1{\sqrt2}`,yTex:String.raw`\dfrac1{\sqrt2}`,tan:"1" },
  { angle:String.raw`\dfrac\pi3`,x:.5,y:Math.sqrt(3)/2,xTex:String.raw`\dfrac12`,yTex:String.raw`\dfrac{\sqrt3}2`,tan:String.raw`\sqrt3` },
  { angle:String.raw`\dfrac\pi2`,x:0,y:1,xTex:"0",yTex:"1",tan:null },
];
const px=(x:number)=>210+130*x, py=(y:number)=>210-130*y;
function Label({x,y,tex}:{x:number;y:number;tex:string}) {
  return <foreignObject x={x-35} y={y-23} width="70" height="80"><div className="unit-math-label"><Formula tex={tex}/></div></foreignObject>;
}
export default function UnitCircleCoordinates({onCompletionChange,onContinue,onBack,onProgressChange}:{onCompletionChange?:(complete:boolean)=>void;onContinue?:()=>void;onBack?:()=>void;onProgressChange?:(progress:number)=>void}) {
  const [selected,setSelected]=useState(0);
  const [basic,setBasic]=useState<number|null>(3);
  const [stage,setStage]=useState(0);
  const go=(next:number)=>{setStage(next);onCompletionChange?.(next===2);onProgressChange?.(next/2);};
  const axis=(["sin","cos","tan"] as const)[stage];
  const point=basic===null?coordinateCases[selected]:basicAngleCases[basic];
  const xColor="#936114", yColor="#176c82";
  const coordinate=(tex:string,color:string)=>`{\\color{${color}}{${tex}}}`;
  return <section className="unit-coordinates panel" data-stage={stage}>
    <h3>{["正弦は縦の座標", "余弦は横の座標", "正接は縦と横の商"][stage]}</h3>
    <p><MathText text={String.raw`半径 $1$ の円で、正の横軸から点 $P$ への角を $\theta$ とします。反時計回りが正です。`}/></p>
    <div className="unit-layout">
      <div>
        {basic!==null&&<Formula tex={String.raw`\theta=${basicAngleCases[basic].angle}`} display/>}
        <svg className="unit-diagram" viewBox="0 0 420 430" role="img" aria-label="半径1の単位円。青緑が縦座標、黄土色が横座標。">
          <circle cx="210" cy="210" r="130" fill="#f8fafb" stroke="#8195a9"/>
          <line x1="25" y1="210" x2="390" y2="210" stroke="#8195a9"/>
          <line x1="210" y1="25" x2="210" y2="395" stroke="#8195a9"/>
          <Label x={385} y={237} tex="x"/><Label x={235} y={28} tex="y"/>
          <Label x={190} y={242} tex="O"/>{point.x!==1&&<Label x={345} y={240} tex="1"/>}
          <line x1="210" y1="210" x2={px(point.x)} y2={py(point.y)} stroke="#233d5b" strokeWidth="2"/>
          <line x1={px(point.x)} y1={py(point.y)} x2={px(point.x)} y2="210" stroke="#8195a9" strokeDasharray="5 4"/>
          <line x1={px(point.x)} y1={py(point.y)} x2="210" y2={py(point.y)} stroke="#8195a9" strokeDasharray="5 4"/>
          <line x1="210" y1="210" x2={px(point.x)} y2="210" stroke={xColor} strokeWidth={axis==="sin"?2:6} opacity={axis==="sin"?.45:1}/>
          <line x1="210" y1="210" x2="210" y2={py(point.y)} stroke={yColor} strokeWidth={axis==="cos"?2:6} opacity={axis==="cos"?.45:1}/>
          <circle cx={px(point.x)} cy={py(point.y)} r="6" fill="#087c70"/>
          <Label x={px(point.x)+(point.x<0?-30:30)} y={py(point.y)} tex="P"/>
          {point.x!==0&&<Label x={px(point.x)} y={point.y<0?173:252} tex={coordinate(point.xTex,xColor)}/>}
          {point.y!==0&&<Label x={point.x<0?247:173} y={py(point.y)} tex={coordinate(point.yTex,yColor)}/>}
        </svg>
      </div>
      <div className="unit-explanation" aria-live="polite" aria-atomic="true">
        {axis==="sin"?<><p>縦軸で、点の高さを読みます。</p><Formula tex={`\\sin\\theta=${coordinate("y",yColor)}=${coordinate(point.yTex,yColor)}`} display/></>:
        axis==="cos"?<><p>横軸で、点の横の位置を読みます。</p><Formula tex={`\\cos\\theta=${coordinate("x",xColor)}=${coordinate(point.xTex,xColor)}`} display/></>:
        <><p>縦の座標を横の座標で割ります。</p><Formula tex={`\\tan\\theta=\\dfrac{${coordinate("y",yColor)}}{${coordinate("x",xColor)}}\\quad(x\\ne0)`} display/>{point.tan===null?<><Formula tex="x=0" display/><p><MathText text="$0$ では割れないので、この点の正接は定義されません。"/></p></>:<Formula tex={`\\dfrac{${coordinate(point.yTex,yColor)}}{${coordinate(point.xTex,xColor)}}=${point.tan}`} display/>}</>}
      </div>
    </div>
    <LearningStepControls className="unit-controls" onPrevious={stage>0?()=>go(stage-1):onBack} onNext={stage<2?()=>go(stage+1):onContinue}/>
    <details className="supplement unit-point-options">
      <summary>別の点で確かめる</summary>
      <label>点の選び方<select value={basic===null?"quadrants":"angles"} onChange={e=>setBasic(e.target.value==="angles"?3:null)}><option value="angles">基本角</option><option value="quadrants">座標の符号</option></select></label>
      {basic!==null?<>
        <div className="unit-stages" role="group" aria-label="基本角">
          {basicAngleCases.map((p,i)=><button key={p.angle} aria-pressed={basic===i} onClick={()=>setBasic(i)}><MathText text={`$${p.angle}$`}/></button>)}
        </div>
        <p><MathText text={String.raw`$0\le\theta\le\frac\pi2$ では、角を大きくすると縦の座標は増え、横の座標は減ります。`}/></p>
      </>:<>
        <div className="unit-stages" role="group" aria-label="点の位置">
          {coordinateCases.map((p,i)=><button key={p.label} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{p.label}</button>)}
        </div>
        <p><MathText text="右は $x>0$、左は $x<0$。上は $y>0$、下は $y<0$ です。"/></p>
      </>}
    </details>
  </section>;
}
