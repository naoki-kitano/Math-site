import {Formula,MathText} from './MathText';

export type DataFigure={
 title:string;description:string;kind:'bars'|'points'|'box';
 xLabel:string;yLabel:string;xRange:[number,number];yMax:number;
 xTicks:number[];yTicks:number[];points?:[number,number][];
 bars?:{lo:number;hi:number;value:number;highlight?:boolean}[];five?:number[];
 mean?:[number,number];selectedPoint?:number;showFiveLabels?:boolean;
};

/** A compact coordinate drawing; text remains HTML/KaTeX at the surrounding size. */
export default function Math1DataPlot({figure:f}:{figure:DataFigure}){
 const X=(x:number)=>40+(x-f.xRange[0])*258/(f.xRange[1]-f.xRange[0]);
 const Y=(y:number)=>194-y*168/f.yMax;
 const label=(x:number,y:number,tex:string)=><foreignObject x={x-19} y={y-15} width="38" height="31"><div className="m1-data-plot-label"><Formula tex={tex}/></div></foreignObject>;
 const ticks=f.xTicks.filter((_,i)=>f.xTicks.length<=7||i%2===0||i===f.xTicks.length-1);
 return <figure className="m1-data-plot">
  {f.title&&<h4>{f.title}</h4>}
  {f.description&&<p><MathText text={f.description}/></p>}
  <svg viewBox="0 0 320 232" role="img" aria-label={f.title||'データの図'}>
   <title>{f.title||'データの図'}</title>
   {f.kind!=='box'&&f.yTicks.map(v=><g key={v}><line x1="40" x2="298" y1={Y(v)} y2={Y(v)} stroke="#dce8e9"/>{label(19,Y(v),String(v))}</g>)}
   <line x1="40" x2="298" y1="194" y2="194" stroke="#284353" strokeWidth="1.5"/>
   {f.kind!=='box'&&<line x1="40" x2="40" y1="26" y2="194" stroke="#284353" strokeWidth="1.5"/>}
   {ticks.map(v=><g key={v}><line x1={X(v)} x2={X(v)} y1="194" y2="199" stroke="#284353"/>{label(X(v),216,String(v))}</g>)}
   {f.bars?.map((b,i)=><rect key={i} x={X(b.lo)} y={Y(b.value)} width={X(b.hi)-X(b.lo)} height={194-Y(b.value)} fill={b.highlight?'#176c82':'#bed6d1'} stroke="#fff" strokeWidth=".8"/>)}
   {f.mean&&<g stroke="#936114" strokeWidth="1.5" strokeDasharray="4 3"><line x1={X(f.mean[0])} x2={X(f.mean[0])} y1="26" y2="194"/><line x1="40" x2="298" y1={Y(f.mean[1])} y2={Y(f.mean[1])}/></g>}
   {f.points?.map(([x,y],i)=><circle key={i} cx={X(x)} cy={Y(y)} r={i===f.selectedPoint?6:4.5} fill={i===f.selectedPoint?'#936114':'#176c82'} stroke="#fff" strokeWidth="1.5"/>)}
   {f.five&&<g stroke="#176c82" strokeWidth="2.5"><line x1={X(f.five[0])} x2={X(f.five[4])} y1="113" y2="113"/>
    <rect x={X(f.five[1])} y="88" width={X(f.five[3])-X(f.five[1])} height="50" fill="#e4f0ed"/>
    {[0,2,4].map(i=><line key={i} x1={X(f.five![i])} x2={X(f.five![i])} y1={i===2?88:99} y2={i===2?138:127}/>)}
   </g>}
  </svg>
  {f.mean&&<p className="m1-data-plot-key"><MathText text={`破線は平均 $\\bar x=${f.mean[0]}$、$\\bar y=${f.mean[1]}$。`}/></p>}
  {f.five&&f.showFiveLabels!==false&&<dl className="m1-data-five">{f.five.map((v,i)=><div key={i}><dt>{i===0?'最小値':i===4?'最大値':<Formula tex={`Q_${i}`}/>}</dt><dd><Formula tex={String(v)}/></dd></div>)}</dl>}
  <figcaption><MathText text={`横軸：${f.xLabel}${f.yLabel?'　縦軸：'+f.yLabel:''}`}/></figcaption>
 </figure>;
}
