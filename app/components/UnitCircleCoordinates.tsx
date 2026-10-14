"use client";
import { useState } from "react";
import { Formula, MathText } from "./MathText";
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
  return <foreignObject x={x-35} y={y-23} width="70" height="58"><div className="unit-math-label"><Formula tex={tex}/></div></foreignObject>;
}
export default function UnitCircleCoordinates() {
  const [selected,setSelected]=useState(0);
  const [basic,setBasic]=useState<number|null>(0);
  const [axis,setAxis]=useState<"sin"|"cos"|"tan">("sin");
  const point=basic===null?coordinateCases[selected]:basicAngleCases[basic];
  return <section className="unit-coordinates panel">
    <h3>点の座標から、値を読む</h3>
    <p>まず基本角を左から順に選び、点の高さと横の位置を見てみよう。</p>
    <div className="unit-stages" role="group" aria-label="基本角を順に確かめる">
      {basicAngleCases.map((p,i)=><button key={p.angle} aria-pressed={basic===i} onClick={()=>setBasic(i)}><MathText text={`$${p.angle}$`}/></button>)}
    </div>
    <p><MathText text={String.raw`$0\le\theta\le\frac\pi2$ では、角を大きくすると点が上へ、左へ移ります。$\sin\theta=y$ は増え、$\cos\theta=x$ は減ります。`}/></p>
    <p>次に、ほかの象限でも座標の符号を確かめよう。</p>
    <div className="unit-stages" role="group" aria-label="点の位置">
      {coordinateCases.map((p,i)=><button key={p.label} aria-pressed={basic===null&&selected===i} onClick={()=>{setBasic(null);setSelected(i);}}>{p.label}</button>)}
    </div>
    <div className="unit-layout">
      <svg className="unit-diagram" viewBox="0 0 420 430" role="img" aria-label="半径1の単位円。青が縦座標、オレンジが横座標。">
        <circle cx="210" cy="210" r="130" fill="#f8fafb" stroke="#8195a9"/>
        <line x1="25" y1="210" x2="390" y2="210" stroke="#8195a9"/>
        <line x1="210" y1="25" x2="210" y2="395" stroke="#8195a9"/>
        <Label x={385} y={237} tex="x"/><Label x={235} y={28} tex="y"/>
        <Label x={190} y={242} tex="O"/>{point.x!==1&&<Label x={345} y={240} tex="1"/>}
        <line x1="210" y1="210" x2={px(point.x)} y2={py(point.y)} stroke="#233d5b" strokeWidth="2"/>
        <line x1={px(point.x)} y1={py(point.y)} x2={px(point.x)} y2="210" stroke="#8195a9" strokeDasharray="5 4"/>
        <line x1={px(point.x)} y1={py(point.y)} x2="210" y2={py(point.y)} stroke="#8195a9" strokeDasharray="5 4"/>
        <line x1="210" y1="210" x2={px(point.x)} y2="210" stroke="#c67c28" strokeWidth={axis==="sin"?3:6}/>
        <line x1="210" y1="210" x2="210" y2={py(point.y)} stroke="#496fa8" strokeWidth={axis==="cos"?3:6}/>
        <circle cx={px(point.x)} cy={py(point.y)} r="6" fill="#087c70"/>
        <Label x={px(point.x)+(point.x<0?-30:30)} y={py(point.y)} tex="P"/>
        {point.x!==0&&<Label x={px(point.x)} y={point.y<0?173:252} tex={point.xTex}/>}
        {point.y!==0&&<Label x={point.x<0?247:173} y={py(point.y)} tex={point.yTex}/>}
      </svg>
      <div className="unit-explanation">
        {basic!==null&&<Formula tex={String.raw`\theta=${basicAngleCases[basic].angle}`} display/>}
        <Formula tex={`P\\left(${point.xTex},${point.yTex}\\right)`} display/>
        <div className="unit-stages" role="group" aria-label="求める三角関数">
          {(["sin","cos","tan"] as const).map((value,i)=><button key={value} aria-pressed={axis===value} onClick={()=>setAxis(value)}>{["正弦","余弦","正接"][i]}</button>)}
        </div>
        <div aria-live="polite" aria-atomic="true">
          {axis==="sin"?<><p>正弦は縦の座標。青い線の先を縦軸で読みます。</p><Formula tex={`\\sin\\theta=y=${point.yTex}`} display/></>:
          axis==="cos"?<><p>余弦は横の座標。オレンジの線の先を横軸で読みます。</p><Formula tex={`\\cos\\theta=x=${point.xTex}`} display/></>:
          <><p>正接は、縦の座標を横の座標で割ります。</p>{point.tan===null?<><Formula tex="x=0" display/><p>零では割れないので、正接は定義されません。</p></>:<Formula tex={`\\tan\\theta=\\dfrac{y}{x}=${point.tan}`} display/>}</>}
        </div>
        <p><MathText text="右は $x>0$、左は $x<0$。上は $y>0$、下は $y<0$ です。"/></p>
      </div>
    </div>
    <p className="meta"><MathText text="原点を中心とする半径 $1$ の円が単位円です。正の横軸を始線とし、点 $P$ を通る動径が表す角を $\theta$ とします。"/></p>
  </section>;
}
