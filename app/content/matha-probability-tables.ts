import type {MathTableData} from "../components/MathTable";
export const mathAProbabilityTables:Record<string,MathTableData[]>={
 "ma-events":[{caption:"硬貨二回は順番を区別する",headers:["一回目","二回目","表の回数"],rows:[["表","表","$2$"],["表","裏","$1$"],["裏","表","$1$"],["裏","裏","$0$"]]}],
 "ma-equally-likely":[{caption:"赤・白のさいころの和（各マスの確率は $\\frac1{36}$）",headers:["赤の目／白の目",...Array.from({length:6},(_,i)=>`$${i+1}$`)],rows:Array.from({length:6},(_,i)=>[`$${i+1}$`,...Array.from({length:6},(_,j)=>`$${i+j+2}$`)])}],
 "ma-probability-tree":[{caption:"赤二個・青一個から各玉を等確率で選び、戻して二回引く",headers:["一回目","その後の二回目","経路の確率"],rows:[["赤 $\\frac23$","赤 $\\frac23$","$\\frac49$"],["赤 $\\frac23$","青 $\\frac13$","$\\frac29$"],["青 $\\frac13$","赤 $\\frac23$","$\\frac29$"],["青 $\\frac13$","青 $\\frac13$","$\\frac19$"]]}],
 "ma-conditional-probability":[{caption:"一から六のカード：三以上と分かった後",headers:["番号","最初の全体","条件後の全体","条件後の偶数"],rows:Array.from({length:6},(_,i)=>[`$${i+1}$`,"含む",i>=2?"含む":"除く",i>=2&&(i+1)%2===0?"含む":"含まない"])}],
 "ma-expected-value":[{caption:"得点と確率を一組ずつ掛ける",headers:["得点","確率","積"],rows:[["$0$","$\\frac12$","$0$"],["$2$","$\\frac13$","$\\frac23$"],["$5$","$\\frac16$","$\\frac56$"]]}]
};
