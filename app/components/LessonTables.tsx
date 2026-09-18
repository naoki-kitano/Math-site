import MathTable, {type MathTableData} from "./MathTable";
import {math3ApplicationTables} from "../content/math3-chapter5-tables";
import {math3IntegralTables} from "../content/math3-chapter6-tables";
import {math3DefiniteTables} from "../content/math3-chapter7-tables";
export const lessonTables:Record<string,MathTableData[]>={
 ...math3ApplicationTables,
 ...math3IntegralTables,
 ...math3DefiniteTables,
 "m3-e-and-natural-log":[
  {caption:"自然対数の底に近づく数列（小数第4位までの近似）",headers:["$n$","$1$","$10$","$100$","$1000$"],rows:[["$(1+\\frac{1}{n})^n$","$2.0000$","$2.5937$","$2.7048$","$2.7169$"]]}
 ],
 "m3-sequence-basics":[
  {caption:"同じ添字でも、項と和は別の量",headers:["$n$","$1$","$2$","$3$","$4$"],rows:[["$a_n=2n-1$","$1$","$3$","$5$","$7$"],["$S_n$","$1$","$4$","$9$","$16$"]]}
 ],
 "m3-sequence-convergence":[
  {caption:"項の大きさと符号を比べる",headers:["$n$","$1$","$2$","$3$","$4$"],rows:[["$\\frac{1}{n}$","$1$","$\\frac{1}{2}$","$\\frac{1}{3}$","$\\frac{1}{4}$"],["$n$","$1$","$2$","$3$","$4$"],["$(-1)^n$","$-1$","$1$","$-1$","$1$"],["$\\frac{(-1)^n}{n}$","$-1$","$\\frac{1}{2}$","$-\\frac{1}{3}$","$\\frac{1}{4}$"]]}
 ],
 "m3-geometric-sequence-limit":[
  {caption:"公比と、十分先の項の振る舞い",headers:["公比","$r^n$ の振る舞い"],rows:[["$-1<r<1$","$0$ に収束"],["$r=1$","$1$ に収束"],["$r>1$","正の無限大へ発散"],["$r=-1$","$-1,1$ を行き来して発散"],["$r<-1$","符号を変え、大きさが増えて発散"]]}
 ],
 "m3-infinite-series-meaning":[
  {caption:"項は零へ、和は二へ",headers:["$N$","$1$","$2$","$3$","$4$"],rows:[["$a_N=(\\frac{1}{2})^{N-1}$","$1$","$\\frac{1}{2}$","$\\frac{1}{4}$","$\\frac{1}{8}$"],["$S_N$","$1$","$\\frac{3}{2}$","$\\frac{7}{4}$","$\\frac{15}{8}$"]]}
 ],
 "m3-geometric-series":[
  {caption:"項の数列と級数を区別する（初項は一）",headers:["公比","項の数列","無限級数"],rows:[["$\\frac{1}{2}$","$0$ に収束","和は $2$"],["$-\\frac{1}{2}$","$0$ に収束","和は $\\frac{2}{3}$"],["$1$","$1$ に収束","発散"],["$-1$","発散","発散"],["$2$","発散","発散"]]}
 ],
 "m3-recurrence-limit":[
  {caption:"二との差が半分になる",headers:["$n$","$1$","$2$","$3$","$4$"],rows:[["$a_n$","$0$","$1$","$\\frac{3}{2}$","$\\frac{7}{4}$"],["$a_n-2$","$-2$","$-1$","$-\\frac{1}{2}$","$-\\frac{1}{4}$"]]}
 ],
 "exponent-extension":[
  {caption:"指数を一つ下げるたび、値を二で割る",headers:["指数","$3$","$2$","$1$","$0$","$-1$","$-2$"],rows:[["$2$ の累乗","$8$","$4$","$2$","$1$","$\\frac{1}{2}$","$\\frac{1}{4}$"]]}
 ],
 "logarithm-meaning":[
  {caption:"同じ関係を、求めるものに合わせて読む",headers:["指数の式","対数の式","対数が表す指数"],rows:[
   ["$2^3=8$","$\\log_2 8=3$","$3$"],["$2^0=1$","$\\log_2 1=0$","$0$"],["$2^{-2}=\\frac{1}{4}$","$\\log_2 (\\frac{1}{4})=-2$","$-2$"]
  ]}
 ],
 "trig-unit-circle":[
  {caption:"特別な角の値",headers:["角","$0$","$\\frac{\\pi}{6}$","$\\frac{\\pi}{4}$","$\\frac{\\pi}{3}$","$\\frac{\\pi}{2}$"],rows:[
   ["正弦（縦）","$0$","$\\frac{1}{2}$","$\\frac{\\sqrt{2}}{2}$","$\\frac{\\sqrt{3}}{2}$","$1$"],
   ["余弦（横）","$1$","$\\frac{\\sqrt{3}}{2}$","$\\frac{\\sqrt{2}}{2}$","$\\frac{1}{2}$","$0$"],
   ["正接（縦÷横）","$0$","$\\frac{\\sqrt{3}}{3}$","$1$","$\\sqrt3$","定義されない"]
  ]}
 ]
};
export default function LessonTables({slug}:{slug:string}){
 return <>{(lessonTables[slug]??[]).map(t=><MathTable key={t.caption} {...t}/>)}</>;
}
