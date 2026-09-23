import type {MathTableData} from "../components/MathTable";
const m=String.raw;
export const math1LogicTables:Record<string,MathTableData[]>={
 "m1-set-operations":[{caption:"全体集合の各要素を一つずつ確かめる",headers:[m`$U=\{1,2,3,4\}$`,m`$A=\{1,2\}$`,m`$B=\{2,3\}$`,m`$A\cap B$`,m`$A\cup B$`,m`$\overline A$`],rows:[
 ["$1$","入る","入らない","入らない","入る","入らない"],
 ["$2$","入る","入る","入る","入る","入らない"],
 ["$3$","入らない","入る","入らない","入る","入る"],
 ["$4$","入らない","入らない","入らない","入らない","入る"],
 ]}],
 "m1-necessary-sufficient":[{caption:"まず二つの向きを判定する",headers:[m`$p\Rightarrow q$`,m`$q\Rightarrow p$`,m`$p$ は $q$ の何条件か`],rows:[["真","真","必要十分条件"],["真","偽","十分条件だが必要条件でない"],["偽","真","必要条件だが十分条件でない"],["偽","偽","必要条件でも十分条件でもない"]]}],
 "m1-converse-contrapositive":[{caption:"否定と向きを別々に確かめる",headers:["名前","命題","同じ真偽になる相手"],rows:[["元",m`$p\Rightarrow q$`,"対偶"],["逆",m`$q\Rightarrow p$`,"裏"],["裏",m`$\neg p\Rightarrow\neg q$`,"逆"],["対偶",m`$\neg q\Rightarrow\neg p$`,"元"]]}],
};
