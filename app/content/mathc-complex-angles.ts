import {C,S,m,q,nums,complex} from "./mathc-authoring";
function quotient(n:number,collinear=false){
 const a=complex(1,1),b=complex(n+1,1),c=collinear?complex(2*n+1,1):complex(1,n+1);
 return q(m`$\alpha=${a},\beta=${b},\gamma=${c}$ を表す点を $A,B,C$ とします。$\frac{\gamma-\alpha}{\beta-\alpha}$ を求め、${collinear?m`三点が一直線上にあるか`:m`$\angle BAC$`}を答えなさい。`,collinear?m`商は $2$。実数なので三点は一直線上にあります。`:m`商は $i$。$\angle BAC=90^\circ$。`,m`商の偏角が二本の向きの差になるので、まず頂点からの移動 $\beta-\alpha,\gamma-\alpha$ を求めます。`,m`$\beta-\alpha=${n}\ne0$、$\gamma-\alpha=${collinear?2*n:complex(0,n)}$。`+(collinear?m`商は $\frac{${2*n}}{${n}}=2$。二つの移動は同じ方向の実数倍です。`:m`商は $\frac{${n}i}{${n}}=i$。二つの移動の偏角の差は $\frac\pi2$ です。`));
}
export const complexAngleBanks=[
 C("複素数平面","complex-angle","複素数の商と図形の角度","同じ頂点からの二本の移動を、割り算で比べます。",[m`互いに異なる点 $A,B,C$ を表す複素数を、それぞれ $\alpha,\beta,\gamma$ とします。$\frac{\gamma-\alpha}{\beta-\alpha}$ の偏角は、$\overrightarrow{AB}$ から $\overrightarrow{AC}$ への回転角です。`,m`商が非零の実数なら三点は一直線上、純虚数なら二本は垂直です。分母が零になる $A=B$ や、角を作れない $A=C$ を除きます。通常のなす角は $0$ から $\pi$ の範囲で答えます。`],"頂点を引き忘れず、分母の条件も確かめます。",[S("angle","商から角度へ","同じ頂点から測ります。",nums.map(n=>quotient(n))),S("collinear","一直線上の判定","商が実数かを確かめます。",nums.map(n=>quotient(n,true)))],"回転と図形")
];
