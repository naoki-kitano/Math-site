import {topic,chapterCheck,m,skill,range,addRepairExample} from "./matha-authoring";
import type {Q} from "./matha-authoring";
import {geoPrep} from "./matha-geometry-questions";
import * as s from "./matha-space-questions";
const S=(id:string,title:string,why:string,qs:Q[])=>skill(id,title,why,qs[0],qs.slice(1));
const sections=["基本の作図","空間の位置関係","空間の角・距離・切り口"];
const T=(slug:string,title:string,description:string,intro:string[],rule:string,skills:ReturnType<typeof S>[],section:string)=>topic("作図と空間図形","ma-"+slug,title,description,intro,rule,skills,geoPrep,section);
const direction=["水平","右上がり","右下がり","鉛直","短く水平","長く水平","急な右上がり","緩やかな右上がり","緩やかな右下がり"];
const positions=["右","左","上","下","右上","左上","右下","左下","右の離れた位置"];
const cons=(kind:s.Construction)=>direction.map((d,i)=>s.construct(kind,i+2,kind==="bisect-angle"?["鋭角","直角","鈍角","右に開く鋭角","左に開く鋭角","上に開く鈍角","下に開く鈍角","大きく開いた鋭角","小さく開いた鋭角"][i]:kind.startsWith("tangent")?positions[i]:d));
export const mathASpaceTopics=[
 T("construction-bisectors","垂直二等分線と角の二等分線","等しい半径の円弧を使って、線分や角を二等分します。",[
 "目盛りを使わない定規は二点を結ぶ直線を引くため、コンパスは中心から同じ距離の点を取るために使います。測って半分の印を付ける操作とは区別します。",
 "二点から等距離の点を二つ作ると、垂直二等分線が引けます。角では、三辺がそれぞれ等しい二つの三角形を作り、合同から二等分を説明します。",
 "紙に円弧と補助線を残してください。解答の完成図を見るだけではなく、自分で同じ条件の線を再現できるか確かめます。"
 ],"等距離の条件を円弧で作り、合同を使って理由を説明します。",[
 S("construct-segment","両端から等距離の二点を作る","二つの交点を作るため、円の半径は元の線分の半分より大きくします。",cons("bisect-segment")),
 S("construct-angle","合同な三角形を作る","頂点から等距離の二点と、そこから等距離の交点を使います。",cons("bisect-angle"))
 ],sections[0]),
 T("construction-perpendicular","垂線と平行線の作図","直角を作り、必要な点を通る直線を引きます。",[
 "直線外の点から円を描き、直線上に等距離の二点を取ります。その二点の垂直二等分線が、元の点を通る垂線になります。接するだけでなく二交点を取れる半径を選びます。",
 "直線上の点で垂線を作るには、その点を中心とする円で直線上に等距離の二点を取り、二点の垂直二等分線を作ります。",
 "同じ平面で同じ直線に垂直な二直線は平行です。外点から垂線を作り、その点でもう一度垂線を作ると平行線になります。"
 ],"同じ距離を円で取り、垂直を二回使えば平行線になります。",[
 S("construct-perpendicular","外点を通る垂線を作る","元の直線上に、外点から等距離の二点を作ります。",cons("perpendicular")),
 S("construct-parallel","垂直を二回使う","二回目の垂線も、指定された点を通るように作ります。",cons("parallel"))
 ],sections[0]),
 T("construction-division","線分の等分と内分の作図","等しい間隔と平行線を使って、線分を分けます。",[
 "元の線分をいきなり等分する代わりに、別の半直線上に等しい区間を並べます。コンパスの幅を変えなければ、等しい長さを繰り返し取れます。",
 "最後の点と元の線分の端を結び、それに平行な線を途中の点から作ります。相似により、等しい区間が元の線分上でも等しい区間に対応します。",
 m`$2:3$ に分けるなら、全体に対応する区間数は $2+3=5$。その二番目を選びます。二等分と三等分を別々に作るのではありません。`
 ],"比の和を全体に対応させ、平行線で位置を移します。",[
 S("construct-equal-parts","等間隔を平行線で移す","補助半直線は元の線分と違う向きに引きます。",cons("divide")),
 S("construct-ratio","比の和で全体を分ける","指定の比に対応する位置から平行線を作ります。",cons("ratio"))
 ],sections[0]),
 T("construction-tangents","円の接線の作図","接点で半径に垂直になることを使って、接線を引きます。",[
 "円上の点が接点として分かっているなら、その点で半径に垂線を作れば接線です。",
 "円外の点から引く場合は、接点そのものを見つける必要があります。中心と外点を直径の両端とする円を描くと、元の円との交点で直角ができます。",
 "外点からは二本の接線が引けます。円上なら一本、円内からは引けません。点の位置の条件を確認してから作図します。"
 ],"求める接点で、半径と接線の直角を作ります。",[
 S("construct-tangent-at","円上の点で垂線を作る","接点が分かっているときは半径から始めます。",cons("tangent-point")),
 S("construct-tangent-from","直径に対する直角を使う","中心と外点を結ぶ線分の中点が、補助円の中心です。",cons("tangent-outside"))
 ],sections[0]),
 T("space-lines","空間の二直線","同じ平面にあるかどうかも確かめ、二直線の位置を調べます。",[
 s.cubeIntro,
 "異なる二直線が同じ平面内にあれば、交わるか平行です。同じ平面内になく、交わらず平行でもない場合を「ねじれの位置」といいます。",
 "見取図は立体を平面へ写した図です。図上で線が交差しても、空間で同じ点を通るとは限りません。線分が離れているというだけでも判定できません。"
 ],"平行・共有点・同じ平面という三つの観点で確かめます。",[
 S("edge-position","辺を含む直線を分類する","対応する辺、共通の端点、属する面を調べます。",[["AB","EF"],["AD","EH"],["AD","AB"],["AD","BF"],["BC","FG"],["BC","CD"],["BC","AE"],["AB","CG"],["CD","EF"]].map(([a,b])=>s.lines(a,b))),
 S("diagonal-position","対角線の位置も確かめる","上下面の線は、見取図の重なりだけで交点を決めません。",[["AC","FH"],["AC","EG"],["BD","FH"],["AC","BD"],["EG","FH"],["AF","BE"],["AH","DE"],["AC","EF"],["BD","FG"]].map(([a,b])=>s.lines(a,b)))
 ],sections[1]),
 T("space-lines-planes","直線と平面・二平面","面に対して平行・垂直といえる条件を確かめます。",[
 s.cubeIntro,
 "直線と平面は、直線が平面に含まれる、一点で交わる、交わらず平行という三つに分けます。一点で交わる場合の特別なものが垂直です。",
 "平面への垂直を示すには、その平面内で交わる二本の直線の両方に垂直であることを使います。一方の直線との直角だけでは不十分です。",
 "二平面が交わるとき、交線上の一点からそれぞれの面内で交線に垂線を引き、その二本の角で二面の角を測ります。"
 ],"面内の一本だけでなく、交わる二本の直線との関係を見ます。",[
 S("line-plane","面に含まれる・平行・交わるを分ける","一点で交わる場合も、垂直かどうかは別に確かめます。",[
 s.linePlane("AE","ABCD","垂直","$AE$ は、底面内で交わる $AB,AD$ の両方に垂直です。"),
 s.linePlane("BF","ABCD","垂直","$BF$ は、底面内で交わる $BA,BC$ の両方に垂直です。"),
 s.linePlane("CG","ABCD","垂直","$CG$ は、底面内で交わる $CB,CD$ の両方に垂直です。"),
 s.linePlane("EF","ABCD","平行","$EF$ は底面と交わらず、底面内の $AB$ に平行です。"),
 s.linePlane("GH","ABCD","平行","$GH$ は底面と交わらず、底面内の $CD$ に平行です。"),
 s.linePlane("AB","ABCD","含まれる","$A,B$ が底面内にあるので、直線全体が底面に含まれます。$AD$ に垂直でも面への垂直ではありません。"),
 s.linePlane("AF","ABCD","一点で交わるが、垂直ではない","交点は $A$ です。底面内の $AB$ とは直角でないので、面への垂線ではありません。"),
 s.linePlane("DH","ABCD","垂直","$DH$ は、底面内で交わる $DA,DC$ の両方に垂直です。"),
 s.linePlane("AD","ABCD","含まれる","$A,D$ が底面内にあるので、直線全体が底面に含まれます。")
 ]),
 S("two-planes","二面の角を交線から測る","交線に垂直な二本を各平面から取ります。",[["ABCD","EFGH",0],["ABCD","ABFE",1],["ABCD","BCGF",1],["ABFE","DCGH",0],["ADHE","BCGF",0],["EFGH","ABFE",1],["EFGH","ADHE",1],["ABFE","ADHE",1],["BCGF","DCGH",1]].map(([a,b,c])=>s.planes(String(a),String(b),!!c)))
 ],sections[1]),
 T("space-angle-distance","空間の角と距離","垂線の足や正射影を取り、必要な直角三角形を見つけます。",[
 s.cubeIntro,
 "点から平面までの距離は、平面への垂線の長さです。斜めに結んだ線分の長さと区別します。",
 "直線と平面のなす角は、その直線と平面上への正射影（垂直に写した影）との角です。図の中で近くに見える辺との角ではありません。"
 ],"まず垂線の足を決め、点への距離・面への距離・角を区別します。",[
 S("space-distance","斜めの距離と垂直距離を分ける","三平方を使う面を、立体から取り出します。",[[3,4],[5,12],[6,8],[8,15],[7,24],[9,12],[12,16],[10,24],[20,21]].map(([a,h])=>s.spaceDistance(a,h))),
 S("space-projection","正射影との角を選ぶ","上下を結ぶ辺が底面への垂線です。",[["G","A","C"],["H","B","D"],["E","C","A"],["F","D","B"],["F","A","B"],["E","B","A"],["G","B","C"],["H","C","D"],["G","D","C"]].map(([a,b,c])=>s.projection(a,b,c)))
 ],sections[2]),
 T("solid-sections","立体の切り口","同じ面にある点を結び、切り口を順に描きます。",[
 s.cubeIntro,
 "一つの平面で切ったとき、各面に現れる切り口は直線です。同じ面にある二点を見つけ、その二点を結ぶところから始めます。",
 "隣の面へ移り、最初の点まで閉じた図形になったか確かめます。異なる面にある点を、理由なく斜めに結んではいけません。",
 "底面に平行な平面で切る場合は、各側面で同じ高さの点を結びます。四点が同じ平面にある理由も、底面との平行から説明します。"
 ],"各線分がどの面にあるかを確認しながら、閉じた切り口を描きます。",[
 S("corner-section","一つの頂点に近い三点を結ぶ","三つの隣り合う面で、それぞれ二点ずつ結びます。",range(9,2).map(n=>s.cut(n))),
 S("parallel-section","同じ高さの四点を結ぶ","底面に平行な切り口は、側面内でも底辺に平行です。",range(9,2).map(n=>s.cut(n,false)))
 ],sections[2]),
 T("polyhedron-counts","多面体の頂点・辺・面","見えない部分も含め、重複しないように数えます。",[
 "角柱は二つの底面とそれらをつなぐ辺、角錐は底面と一つの頂点へつなぐ辺に分けて数えます。見取図の線の本数だけを数えてはいけません。",
 m`凸多面体には、頂点数 $V$、辺数 $E$、面数 $F$ について $V-E+F=2$ が成り立ちます。これがオイラーの多面体の関係式です。`,
 m`理由は、一面を外して残りを平面の網に広げて考えます。閉じた領域を隔てる辺を一つ除くと、辺と領域が一つずつ減り、$V-E+F$ は不変です。閉じた領域がなくなった木では、端の頂点と辺を一組ずつ除けます。最後は頂点一つと外側の領域一つなので値は二です。穴のある立体に条件なしで使うことはできません。`
 ],"底面と側面に分けて数え、凸多面体では関係式でも確かめます。",[
 S("prism-count","二つの底面と側面に分ける","上下で対応する頂点と辺を整理します。",range(9,3).map(n=>s.polyhedron(n))),
 S("pyramid-count","底面と一つの頂点に分ける","底面の各頂点から、上の頂点へ一本ずつ辺が伸びます。",range(9,3).map(n=>s.polyhedron(n,true))),
 S("euler-count","不足する個数を関係式で求める","使う式は凸多面体の頂点・辺・面の関係です。",[[6,5],[8,6],[5,5],[4,4],[10,7],[12,8],[7,7],[8,8],[14,9]].map(([v,f])=>s.euler(v,f)))
 ],sections[2])
];
const planeHelp=mathASpaceTopics.find(b=>b.lesson.slug==="ma-space-lines-planes")!;
for(const key of [4,5,6]){
 const example=planeHelp.skills[0].items[key-1];
 addRepairExample(mathASpaceTopics,"ma-space-lines-planes","line-plane",example);
}
addRepairExample(mathASpaceTopics,"ma-space-lines-planes","two-planes",s.planes("ABCD","ABFE",true));
addRepairExample(mathASpaceTopics,"ma-space-lines","edge-position",s.lines("AB","BC"));
addRepairExample(mathASpaceTopics,"ma-space-lines","edge-position",s.lines("AB","CG"));
addRepairExample(mathASpaceTopics,"ma-space-lines","diagonal-position",s.lines("AC","EG"));
addRepairExample(mathASpaceTopics,"ma-space-lines","diagonal-position",s.lines("AC","BD"));
const check=chapterCheck("作図と空間図形","ma-space-construction-check",mathASpaceTopics,sections,{
 "ma-space-lines-planes-line-plane":[1,3,5,6,7,8],
 "ma-space-lines-edge-position":[1,2,3,4,7,8],
 "ma-space-lines-diagonal-position":[1,2,3,4,7,8]
});
export const mathAChapter4Lessons=[...mathASpaceTopics.map(b=>b.lesson),check.lesson];
export const mathAChapter4Exercises=[...mathASpaceTopics.flatMap(b=>b.exercises),...check.exercises];
