import type {MathTableData} from "../components/MathTable";
import {m} from "./math1-data-authoring";
import {histogramData} from "./math1-data-distributions";
import {coinSimulation} from "./math1-data-inference";
export const math1DataTables:Record<string,MathTableData[]>={
 "m1-histogram":[{caption:"所要時間の度数分布（教材用の仮想データ）",headers:["時間の階級（分）","度数（人）"],rows:[...histogramData.counts.map((c,i)=>[m`$${histogramData.edges[i]}$ 以上 $${histogramData.edges[i+1]}$ 未満`,m`$${c}$`]),["合計","$12$"]]}],
 "m1-data-variance":[{caption:"平均からのずれを二乗する（平均は $4$）",headers:["値","偏差","偏差の二乗"],rows:[["$2$","$-2$","$4$"],["$4$","$0$","$0$"],["$4$","$0$","$0$"],["$6$","$2$","$4$"],["合計","$0$","$8$"]]}],
 "m1-correlation-coefficient":[{caption:"例題の同じ組の偏差を掛ける（両方の平均は $2$）",headers:["$(x,y)$",m`$x-\bar x$`,m`$y-\bar y$`,"偏差の積"],rows:[["$(1,1)$","$-1$","$-1$","$1$"],["$(2,3)$","$0$","$1$","$0$"],["$(3,2)$","$1$","$0$","$0$"],["合計","$0$","$0$","$1$"]]}],
 "m1-hypothesis-thinking":[{caption:m`公平で独立な $10$ 回のコイン投げを $10000$ 回まねた計算機実験`,headers:["表の回数","試行の度数"],rows:coinSimulation.counts.map((c,k)=>[m`$${k}$ 回`,m`$${c}$ 回`])}],
};
