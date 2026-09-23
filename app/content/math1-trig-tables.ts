import type {MathTableData} from "../components/MathTable";
import {specialValues,type SpecialAngle} from "./math1-trig-authoring";
function values(angles:SpecialAngle[],caption:string):MathTableData{
 return {caption,headers:["角",String.raw`$\sin\theta$`,String.raw`$\cos\theta$`,String.raw`$\tan\theta$`],rows:angles.map(a=>[String.raw`$${a}^\circ$`,...specialValues[a].map(v=>v===null?"定義されない":`$${v}$`)])};
}
export const math1TrigTables:Record<string,MathTableData[]>={
 "m1-special-angles":[values([30,45,60],"直角三角形から求めた三角比")],
 "m1-trig-relations":[values([0,30,45,60,90,120,135,150,180],"座標と対称性で確かめる三角比（度数法）")],
};
