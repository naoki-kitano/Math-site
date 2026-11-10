import {Formula,MathText} from './MathText';
export function LogicRootDiagram({d,step=4}:{d:2|3;step?:number}){
 return <div className="m1-logic-diagram"><div className="m1-logic-card"><span className="m1-logic-label">証明の間、保つ条件</span><p><MathText text="$a,b$ は互いに素な正の整数"/></p></div>{step>=2&&<div className="m1-logic-pair"><div className="m1-logic-card teal"><span className="m1-logic-label">分子</span><Formula tex={`a=${d}k`}/><p><MathText text="$k$ は整数"/></p></div><div className="m1-logic-card ochre"><span className="m1-logic-label">分母</span>{step>=3?<><Formula tex={`b=${d}\\ell`}/><p><MathText text="$\ell$ は整数"/></p></>:<Formula tex="b"/>}</div></div>}{step>=4&&<p className="m1-logic-result"><MathText text={`共通因数 $${d}$ があり、互いに素に矛盾`}/></p>}</div>;
}
export default function Math1LogicExampleDiagram({slug,index,step,complete}:{slug:string;index:number;step?:number;complete?:boolean}){
 if(slug!=='m1-proof-contradiction'||index!==1)return null;
 return <LogicRootDiagram d={2} step={complete?4:step}/>;
}
