import type {Transfer} from "../components/FormulaTransfer";
import {math3FormulaCorrespondence} from "./math3-formula-correspondence";
import {math3CalculusCorrespondence} from './math3-calculus-correspondence';
import {math3IntegralCorrespondence} from './math3-integral-correspondence';
import {math3RiemannCorrespondence} from './math3-riemann-correspondence';
import {math3SequenceCorrespondence} from './math3-sequence-correspondence';
import {math3GeometryCorrespondence} from './math3-geometry-correspondence';
import {math2AlgebraCorrespondence} from './math2-algebra-correspondence';
import {math2GeometryCorrespondence} from './math2-geometry-correspondence';
import {math2TrigCorrespondence} from './math2-trig-correspondence';
import {math2ExplogCorrespondence} from './math2-explog-correspondence';
import {math2CalculusCorrespondence} from './math2-calculus-correspondence';
const m=String.raw;

export type FormulaStep={label:string; text:string; formulas:string[];motion?:Transfer;diagram?:{kind:string;stage:number;animated?:boolean}};
export type FormulaLesson={title:string; goal:string; check:string; steps:FormulaStep[]};

// Each displayed line remains a true equation. Color identifies the particular
// part being followed, not a general rule for every appearance of a symbol.
export const formulaCorrespondence:Record<string,FormulaLesson>={
 "logarithm-base-change":{
  title:"真数と底の行き先",goal:m`$\log_a b$ を、別の底 $c$ を使って表します。`,
  check:m`$a,c>0$、$a,c\ne1$、$b>0$ です。新しい底 $c$ は分子・分母で同じです。`,
  steps:[
   {label:"元の式",text:m`$a$ は底、$b$ は真数です。`,formulas:[]},
   {label:"真数を分子へ",text:m`元の真数 $b$ は、分子の対数の真数になります。`,formulas:[]},
   {label:"底を分母へ",text:m`元の底 $a$ は、分母の対数の真数になります。`,formulas:[]},
   {label:"新しい底をそろえる",text:m`分子と分母の底を、ともに $c$ にします。`,formulas:[]},
  ],
 },
 "logarithm-laws":{
  title:"真数の積と対数の和",goal:m`真数を掛けた式と、二つの対数の和を見比べます。`,
  check:m`$a>0$、$a\ne1$、$M,N>0$ です。真数の和 $M+N$ を同じように分けることはできません。`,
  steps:[
   {label:"真数を分けて見る",text:m`真数の積を $M$ と $N$ の二つに分けて見ます。`,formulas:[m`\log_a({\color{#176c82}{M}}\,{\color{#936114}{N}})`]},
   {label:"それぞれの対数",text:m`真数の積が、同じ底の対数の和に対応します。`,formulas:[m`\log_a({\color{#176c82}{M}}\,{\color{#936114}{N}})=\log_a{\color{#176c82}{M}}+\log_a{\color{#936114}{N}}`]},
   {label:"指数で理由を確かめる",text:m`$M=a^p$、$N=a^q$ なら、積では指数が $p+q$ になります。`,formulas:[m`MN=a^p a^q=a^{p+q}`,m`\log_a(MN)=p+q=\log_a M+\log_a N`]},
  ],
 },
 "m1-completing-square":{
  title:"平方を作り、増えた数を補う",goal:m`$x^2+6x+2$ の値を変えずに、平方の形に直します。`,
  check:"同じ数を足して引いているので、どの実数を入れても式の値は変わりません。",
  steps:[
   {label:"係数を半分にする",text:m`一次の係数 $6$ の半分は $3$。平方の括弧に入れます。`,formulas:[m`x^2+{\color{#176c82}{6}}x+2`,m`(x+{\color{#176c82}{3}})^2=x^2+6x+9`]},
   {label:"増えた数を補う",text:m`平方の中で増えた $9$ を引き、元の $2$ を残します。`,formulas:[m`x^2+6x+2=(x+3)^2-{\color{#936114}{9}}+2`]},
   {label:"定数をまとめる",text:m`$-9+2=-7$ なので、平方完成は次のようになります。`,formulas:[m`x^2+6x+2=(x+3)^2-7`]},
  ],
 },
 "m1-completing-square-coefficient":{
  title:"外の係数を補正にも掛ける",goal:m`$2x^2+8x+1$ を平方完成します。`,
  check:"括弧の中のすべての項に、外の係数を掛けます。",
  steps:[
   {label:"係数をくくる",text:m`二次と一次の項から $2$ をくくります。`,formulas:[m`2x^2+8x+1=2(x^2+4x)+1`]},
   {label:"平方を作る",text:m`括弧の中に増える $4$ を、括弧の中で引きます。`,formulas:[m`2(x^2+4x)+1=2\{(x+2)^2-{\color{#936114}{4}}\}+1`]},
   {label:"補正にも掛ける",text:m`括弧の中の $-4$ にも、外の $2$ が掛かります。`,formulas:[m`2\{(x+2)^2-{\color{#936114}{4}}\}+1=2(x+2)^2-{\color{#936114}{8}}+1`,m`=2(x+2)^2-7`]},
  ],
 },
 ...math3FormulaCorrespondence,
 ...math3CalculusCorrespondence,
 ...math3IntegralCorrespondence,
 ...math3RiemannCorrespondence,
 ...math3SequenceCorrespondence,
 ...math3GeometryCorrespondence,
 ...math2AlgebraCorrespondence,
 ...math2GeometryCorrespondence,
 ...math2TrigCorrespondence,
 ...math2ExplogCorrespondence,
 ...math2CalculusCorrespondence,
};
formulaCorrespondence['logarithm-laws'].steps[1].motion={
 source:m`\log_a({\color{#176c82}{M}}{\color{#936114}{N}})`,target:m`=\log_a{\color{#176c82}{M}}+\log_a{\color{#936114}{N}}`,
 parts:[{tex:m`\color{#176c82}{M}`,color:'#176c82'},{tex:m`\color{#936114}{N}`,color:'#936114'}]
};
