import {workedText} from "./worked-text";
import type {Exercise,Lesson,Step} from "./lessons";
export const m=String.raw;
export type Q={prompt:string;answer:string;hint:string;working:string;value?:number;model?:{kind:string;args:number[]};steps?:Step[];answerInSteps?:boolean};
export const q=(prompt:string,answer:string,hint:string,working:string,value?:number,model?:Q["model"]):Q=>({prompt,answer,hint,working,value,model});
export const fact=(n:number):number=>n<2?1:n*fact(n-1);
export const comb=(n:number,r:number)=>r<0||r>n?0:fact(n)/fact(r)/fact(n-r);
export const product=(n:number,r:number)=>Array.from({length:r},(_,i)=>n-i).join("\\times");
export type Skill={id:string;title:string;why:string;sample:Q;items:Q[]};
export const skill=(id:string,title:string,why:string,sample:Q,items:Q[]):Skill=>({id,title,why,sample,items});
export function arithmetic(a:number,b:number,add=false):Q{
 const op=add?"+":"\\times",v=add?a+b:a*b;
 return q(m`$${a}${op}${b}$ を計算しなさい。`,m`$${v}$。`,add?"二つの数を足します。":"同じ数を繰り返し足す積です。",m`$${a}${op}${b}=${v}$。`,v,{kind:add?"add":"multiply",args:[a,b]});
}
export const prepSkills=[
 skill("prep-add","足し算を確かめる","別々の個数を合わせる計算を確かめます。",arithmetic(3,4,true),[arithmetic(2,5,true),arithmetic(3,6,true),arithmetic(4,7,true)]),
 skill("prep-multiply","掛け算を確かめる","同じ数ずつあるときの計算を確かめます。",arithmetic(3,2),[arithmetic(2,4),arithmetic(3,5),arithmetic(4,6)])
];
export const auditQuestions:{id:string;q:Q}[]=[];
export function countingTopic(slug:string,title:string,description:string,introduction:string[],rule:string,main:Skill[],section:string){
 const exercises:Exercise[]=[];
 const add=(s:Skill,x:Q,i:number,stage:Exercise["stage"])=>{
  const id=`${slug}-${s.id}-${i+1}-v1`,steps=x.steps??countingSteps(x);
  exercises.push({id,lesson:slug,family:s.id,repair:s.id,stage,kind:"paper",prompt:x.prompt,answer:x.answer,hints:[x.hint],steps:steps??[{title:s.title,text:x.working},{title:"答え",text:x.answer}],answerInSteps:x.answerInSteps??!!steps});
  auditQuestions.push({id,q:x});return id;
 };
 for(const s of main){
  if(s.items.length<8)throw new Error("Insufficient counting practice: "+s.id);
  s.items.forEach((x,i)=>add(s,x,i,i===0?"guided":i>=s.items.length-2?"review":"practice"));
 }
 for(const s of prepSkills)s.items.forEach((x,i)=>add(s,x,i,i===0?"ready":"review"));
 const lesson:Lesson={slug,title,description,introduction,rule,basicsTitle:title,chapter:"場合の数",subject:"数学A",section,guidedAfterExamples:true,
  examples:main.map(s=>({id:s.id,title:s.title,prompt:s.sample.prompt,guidedIds:[`${slug}-${s.id}-1-v1`],steps:s.sample.steps??countingSteps(s.sample)??[{title:"",text:s.sample.hint},{title:s.title,text:s.sample.working},{title:"答え",text:s.sample.answer}]})),
  supplements:[...main,...prepSkills].map(s=>({id:s.id,title:s.title,text:workedText(s.why,s.sample.prompt,s.sample.working,s.sample.answer),tex:"",check:s.items[0].prompt,answer:workedText(s.items[0].working,s.items[0].answer),answerExerciseId:`${slug}-${s.id}-1-v1`}))
 };
 return {lesson,exercises,skills:main};
}
export function pairs(a:number,b:number):Q{
 const rows=Array.from({length:a},(_,i)=>Array.from({length:b},(_,j)=>`(${i+1},${j+1})`).join(","));
 return q(m`番号 $1$ から $${a}$ のシャツと、番号 $1$ から $${b}$ の帽子があります。一つずつ選ぶ組を、（シャツの番号，帽子の番号）の順にすべて書きなさい。`,
 rows.map(r=>`$${r}$`).join("、")+"。",
 "シャツの番号を一つ固定し、その番号にすべての帽子を合わせます。",
 rows.map((r,i)=>m`シャツ $${i+1}$ の組は $${r}$。`).join(" ")+"各シャツを一度ずつ調べたので、抜けも重複もありません。",a*b,{kind:"pairs",args:[a,b]});
}
export function digits(ds:number[],even=false):Q{
 const rows=ds.filter(d=>d!==0).map(a=>ds.filter(b=>b!==a&&(!even||b%2===0)).map(b=>10*a+b)).filter(r=>r.length);
 const vals=rows.flat(),v=vals.length;
 return q(m`数字 $${ds.join(",")}$ のカードが各 $1$ 枚あります。$2$ 枚を使ってできる二桁の${even?"偶数":"整数"}をすべて書き、その個数も答えなさい。`,
 m`$${vals.join(",")}$ の $${v}$ 個。`,
 even?"十の位を固定して書き出し、一の位が偶数になるものを残します。十の位は$0$にできず、同じカードも二度使えません。":"十の位を固定します。$0$を十の位にせず、使ったカードを一の位から除きます。",
 rows.map(r=>m`十の位が $${Math.floor(r[0]/10)}$ のとき $${r.join(",")}$。`).join(" ")+m`合計 $${v}$ 個です。`,v,{kind:even?"even-digits":"digits",args:ds});
}
export function menu(a:number,b:number,mode:"sum"|"product"|"unequal"):Q{
 const v=mode==="product"?a*b:a+b;
 const prompt=mode==="sum"?m`ケーキ $${a}$ 種類とアイス $${b}$ 種類から、一つだけ選びます。選び方は何通りですか。その数え方にした理由も答えなさい。`:mode==="product"?m`パン $${a}$ 種類、飲み物 $${b}$ 種類から一つずつ選びます。どのパンにも、どの飲み物でも付けられます。選び方は何通りですか。その理由も答えなさい。`:m`パンは白パンと黒パンです。白パンに付けられる飲み物は $${a}$ 種類、黒パンには $${b}$ 種類あります。パン一つと飲み物一つのセットは何通りですか。理由も答えなさい。`;
 const reason=mode==="product"?m`どのパンにも飲み物が $${b}$ 通りずつあるので掛けます。`:mode==="sum"?"ケーキを選ぶ場合とアイスを選ぶ場合は重ならないので足します。":"パンごとに飲み物を数えて足します。白パンと黒パンでは候補数が違うので、それぞれを数えます。";
 return q(prompt,m`$${v}$ 通り。`+reason,mode==="product"?"一つのパンに何通りの飲み物が付くか確かめます。":"最初の選択ごとに分けて、それぞれを数えます。",reason+m`$${a}${mode==="product"?"\\times":"+"}${b}=${v}$。`,v,{kind:mode==="product"?"multiply":"add",args:[a,b]});
}
export function sets(total:number,a:number,b:number,both:number,out=false):Q{
 const u=a+b-both,v=out?total-u:u;
 return q(m`$${total}$ 人に尋ねると、犬が好きな人は $${a}$ 人、猫が好きな人は $${b}$ 人、両方好きな人は $${both}$ 人でした。${out?"どちらも好きでない人":"少なくとも一方が好きな人"}は何人ですか。`,
 m`$${v}$ 人。`,"両方好きな人を二度足していないか確かめます。"+(out?"最後に全体から引きます。":""),
 m`犬または猫が好きな人は $${a}+${b}-${both}=${u}$ 人。両方の人を一回だけ数えるために引きます。`+(out?m`全体から引き $${total}-${u}=${v}$ 人。`:""),v,{kind:out?"outside":"union",args:[total,a,b,both]});
}
export function perm(n:number,r:number,all=false):Q{
 const v=fact(n)/fact(n-r);
 return q(all?m`異なる本 $${n}$ 冊を一列にすべて並べます。何通りですか。`:m`$${n}$ 人から $${r}$ 人を選び、その発表順を決めます。一人は一度だけ発表します。何通りですか。`,m`$${v}$ 通り。`,
 "一番目を決めたら、次に選べる数は一つ減ります。",
 m`使ったものを除いて順に決めるので、$${product(n,r)}=${v}$ 通りです。`,v,{kind:"permutation",args:[n,r]});
}
export function repeat(k:number,r:number,integer=false):Q{
 const v=(integer?k-1:k)*k**(r-1);
 return q(m`数字 $0$ から $${k-1}$ を使い、${integer?m`$${r}$ 桁の整数`:m`長さ $${r}$ の暗証番号`}を作ります。同じ数字は何度使ってもよく、${integer?"先頭は$0$にできません":"先頭も$0$にできます"}。何通りですか。`,m`$${v}$ 通り。`,
 integer?"先頭だけ$0$を除きます。残りの各桁は、使えるすべての数字から一つ選べます。":"一度使った数字も残るので、どの桁でも選択肢は同じです。",
 m`先頭は $${integer?k-1:k}$ 通り、残りの各桁は $${k}$ 通り。$${integer?k-1:k}\times${k}^{${r-1}}=${v}$。`,v,{kind:integer?"integer-repeat":"repeat",args:[k,r]});
}
export function adjacent(n:number,apart=false):Q{
 const adj=2*fact(n-1),v=apart?fact(n)-adj:adj;
 return q(m`異なる $${n}$ 人が一列に並びます。その中の $A$ さんと $B$ さんが${apart?"隣り合わない":"隣り合う"}並び方は何通りですか。`,m`$${v}$ 通り。`,
 apart?"全体の並びから、二人が隣り合う並びを引きます。":"二人を一つにまとめ、その中の順序も数えます。",
 m`二人をまとめると $${n-1}$ 個の対象。内部は $AB,BA$ の $2$ 通りなので、隣り合う並びは $${n-1}!\times2=${adj}$。`+(apart?m`全体から引き $${n}!- ${adj}=${v}$。`:""),v,{kind:apart?"apart":"adjacent",args:[n]});
}
export function ends(n:number,both=false):Q{
 const v=both?2*fact(n-2):fact(n-1);
 return q(m`異なる $${n}$ 人を一列に並べます。${both?"その中の $A$ さんと $B$ さんを両端に置く":"その中の $A$ さんを左端に置く"}並び方は何通りですか。`,m`$${v}$ 通り。`,
 both?"両端の担当を決めてから、中央の人を並べます。":"決まった人と場所を除いて、残りを並べます。",
 both?m`両端は $AB$ と $BA$ の $2$ 通り。中央の $${n-2}$ 人を並べて $2\times${n-2}!=${v}$。`:m`左端を固定し、残り $${n-1}$ 人の並びは $${n-1}!=${v}$。`,v,{kind:both?"both-ends":"left-end",args:[n]});
}
export function circle(n:number,labelled=false):Q{
 const v=fact(labelled?n:n-1);
 return q(m`異なる $${n}$ 人が${labelled?m`番号付きの $${n}$ 席に座ります。席が変われば別とします。`:"円卓を囲んで座ります。回転して一致する並びは同じ、裏返した並びは別とします。"}座り方は何通りですか。理由も答えなさい。`,
 m`$${v}$ 通り。`+(labelled?"席を区別するからです。":"一人を固定して、他の人の順序を決められるからです。"),
 labelled?"番号の付いた席を一つずつ埋めます。":"一人の位置を基準にすると、回転による重複を除けます。",
 labelled?m`番号順に座る人を決めるので $${n}!=${v}$。`:m`一人を基準に固定し、残り $${n-1}$ 人を時計回りに並べて $${n-1}!=${v}$。`,v,{kind:labelled?"seats":"circle",args:[n]});
}
export function choose(n:number,r:number,reason=false):Q{
 const v=comb(n,r);
 return q(m`異なる本 $${n}$ 冊から、持っていく $${r}$ 冊を選びます。順番は区別しません。何通りですか。${reason?"順番を付けて数える場合との違いも説明しなさい。":""}`,m`$${v}$ 通り。`+(reason?"同じ本の組なら、選ぶ順序を変えても同じです。":""),
 r===0?"何も選ばない組が何個あるか考えます。":r===n?"すべての本を選ぶ組が何個あるか考えます。":"同じ組の中で順序を入れ替えた分を除きます。",
 r===0?"何も選ばない組は一つだけなので、$1$ 通りです。":r===n?"すべてを選ぶ組は一つだけなので、$1$ 通りです。":m`順番を付けて選ぶと $${product(n,r)}$ 通り。同じ組を $${r}!$ 回数えるので、その回数で割ります。$ {}_{${n}}C_{${r}}=\dfrac{${product(n,r)}}{${r}!}=${v}$。`+(reason?"選ぶ順序は答えの違いにはなりません。":""),v,{kind:"choose",args:[n,r]});
}
export function chooseOrArrange(n:number,r:number):Q{
 const base=perm(n,r);
 return {...base,prompt:m`異なる本 $${n}$ 冊から $${r}$ 冊を選び、棚の左から並べます。何通りですか。並べる順序を区別する理由も説明しなさい。`,answer:base.answer+"同じ本でも左右の順序が変わると別の並びです。",working:base.working+"同じ本の組でも、順序が違えば別なので割りません。"};
}
export function identical(a:number,b:number,c=0,path=false):Q{
 const n=a+b+c,v=fact(n)/(fact(a)*fact(b)*fact(c));
 return q(path?m`格子の道で、出発点 $S$ から右へ $${a}$ 区間、上へ $${b}$ 区間の位置に目的地 $G$ があります。一回に一つの区間を進み、どの道も通れます。$S$ から $G$ への最短経路は何通りですか。`:m`文字 $A$ が $${a}$ 個、$B$ が $${b}$ 個${c?m`、$C$ が $${c}$ 個`:""}あります。すべてを一列に並べる方法は何通りですか。同じ文字は区別しません。`,m`$${v}$ 通り。`,
 path?"一歩を「右」「上」の文字に置き換えます。":"同じ文字に仮の番号を付け、番号を消すと何回重なるか考えます。",
 (path?m`一つの経路は、右 $${a}$ 個・上 $${b}$ 個の一つの並びと対応します。`:"同じ文字どうしの入れ替えでは見た目が変わりません。")+m`全部を区別した $${n}!$ を、同じものの並べ方で割り、$\frac{${n}!}{${a}!${b}!${c?`${c}!`:""}}=${v}$。`,v,{kind:"identical",args:[a,b,c]});
}
export function groups(a:number,b:number,labelled=false):Q{
 const n=a+b,v=comb(n,a)/(!labelled&&a===b?2:1);
 return q(m`異なる $${n}$ 人を、${labelled?m`赤組 $${a}$ 人と白組 $${b}$ 人`:m`名前のない $${a}$ 人組と $${b}$ 人組`}に分けます。分け方は何通りですか。割る必要があるかも説明しなさい。`,
 m`$${v}$ 通り。`+(!labelled&&a===b?"同じ分け方を二度数えるので2で割ります。":labelled?"赤組と白組を区別するので、2では割りません。":"人数で二つの組を区別できるので、2では割りません。"),
 labelled?"赤組を選ぶと残りは白組に決まります。":a===b?"最初に選ぶ組を入れ替えると、同じ分け方になりませんか。":"人数の小さい組と大きい組は区別できます。",
 m`まず $${a}$ 人を選ぶと $ {}_{${n}}C_{${a}}=${comb(n,a)}$。`+(!labelled&&a===b?m`どちらの組を先に選んでも同じ分割なので $\frac{${comb(n,a)}}{2}=${v}$。`:"選ぶ組が区別できるため、同じ分割を二度数えていません。"),v,{kind:labelled?"labelled-groups":"groups",args:[a,b]});
}
export function complement(a:number,b:number,r:number):Q{
 const total=comb(a+b,r),bad=comb(b,r),v=total-bad;
 return q(m`女子 $${a}$ 人、男子 $${b}$ 人から $${r}$ 人を選びます。女子を少なくとも一人含む選び方を、理由とともに求めなさい。`,m`$${v}$ 通り。全体から女子を一人も含まない場合を引きます。`,
 "「女子を少なくとも一人含む」が成り立たないのは、全員男子の場合です。",
 m`全体は $ {}_{${a+b}}C_{${r}}=${total}$。女子が$0$人なら $ {}_{${b}}C_{${r}}=${bad}$。よって $${total}-${bad}=${v}$。`,v,{kind:"complement",args:[a,b,r]});
}


// These steps name the decision represented by each counting model. They do not
// split prose mechanically; the full working remains available in supplements.
function countingSteps(question:Q):Step[]|undefined{
 if(!question.model)return;
 const {kind,args}=question.model,[a,b,c,d]=args;
 const answer:Step={title:"答え",text:question.answer};
 if(kind==="pairs")return [
  {title:"一つの選び方",text:"シャツと帽子の番号の組を一つと数えます。同じシャツの行で、すべての帽子を一度ずつ調べます。"},
  {title:"行ごとに書く",text:question.working},answer
 ];
 if(kind==="digits"||kind==="even-digits")return [
  {title:"使えるカード",text:kind==="even-digits"?"二桁の偶数なので、十の位は$0$以外、一の位は偶数です。同じカードは二度使えません。":"二桁の整数なので、十の位は$0$以外です。使ったカードを一の位の候補から除きます。"},
  {title:"十の位ごとに分ける",text:question.working},answer
 ];
 if(kind==="union"||kind==="outside")return [
  {title:"重なりを一度にする",text:m`犬好き $${b}$ 人と猫好き $${c}$ 人を足すと、両方好きな $${d}$ 人を二度数えます。一回分を引きます。`,tex:`${b}+${c}-${d}=${b+c-d}`},
  ...(kind==="outside"?[{title:"全体から除く",text:"どちらも好きでない人は、今数えた人以外です。",tex:`${a}-(${b+c-d})=${a-b-c+d}`}]:[]),answer
 ];
 if(kind==="permutation")return [
  {title:"一つ使うたびに減る",text:m`一つ目は $${a}$ 通り。使ったものを除くので、二つ目は $${a-1}$ 通りです。`},
  {title:"決める場所だけ掛ける",text:m`決める場所は $${b}$ 個です。`,tex:b===a?`${a}!=${question.value}`:`${product(a,b)}=${question.value}`},answer
 ];
 if(kind==="repeat"||kind==="integer-repeat")return [
  {title:"先頭の候補",text:kind==="integer-repeat"?m`$${b}$ 桁の整数なので、先頭の $0$ を除いた $${a-1}$ 通りです。`:m`暗証番号は先頭にも $0$ を使えるので、$${a}$ 通りです。`},
  {title:"残りの各桁",text:m`数字は再使用できるため、残り $${b-1}$ 桁の候補はそれぞれ $${a}$ 通りです。`,tex:`${kind==="integer-repeat"?a-1:a}\\times${a}^{${b-1}}=${question.value}`},answer
 ];
 if(kind==="adjacent"||kind==="apart")return [
  {title:"二人を一つのまとまりにする",text:m`$A,B$ を一つにまとめると、残り $${a-2}$ 人と合わせて $${a-1}$ 個の対象です。`},
  {title:"中と外の順序",text:m`外側は $${a-1}!$ 通り。各配置に、内部の $AB,BA$ の $2$ 通りがあります。`,tex:`${a-1}!\\times2=${2*fact(a-1)}`},
  ...(kind==="apart"?[{title:"隣り合う並びを除く",text:"すべての並びは、隣り合う場合と隣り合わない場合に分かれます。",tex:`${a}!- ${2*fact(a-1)}=${question.value}`}]:[]),answer
 ];
 if(kind==="left-end")return [{title:"決まっていない場所を数える",text:m`左端の $A$ は決まっています。残る $${a-1}$ 人だけを順に並べます。`,tex:`${a-1}!=${question.value}`},answer];
 if(kind==="both-ends")return [
  {title:"両端の担当",text:m`左が $A$・右が $B$ と、左が $B$・右が $A$ の $2$ 通りです。`},
  {title:"中央の順序",text:m`各配置で、残り $${a-2}$ 人を中央に並べます。`,tex:`2\\times${a-2}!=${question.value}`},answer
 ];
 if(kind==="circle")return [
  {title:"回転の基準を決める",text:"一人を基準にすると、全員を回しただけの並びが同じ位置から読めます。"},
  {title:"基準から時計回りに読む",text:m`基準の人以外の $${a-1}$ 人の順序を決めます。裏返しは別に数えます。`,tex:`${a-1}!=${question.value}`},answer
 ];
 if(kind==="seats")return [{title:"席番号が場所を区別する",text:"回転しても、違う席番号に座れば別の割り当てです。番号順に座る人を決めます。",tex:`${a}!=${question.value}`},answer];
 if(kind==="choose"){
  if(b===0||b===a)return [{title:"選ぶ組を考える",text:b===0?"何も選ばない組は一つです。":"すべての本を含む組は一つです。"},answer];
  return [{title:"順序を付けて数える",text:m`まず $${b}$ 冊を順に選ぶと、$${product(a,b)}$ 通りです。`},
   {title:"同じ組の重複を除く",text:m`同じ $${b}$ 冊の組を、その並べ方 $${b}!$ 回ずつ数えています。`,tex:`{}_{${a}}C_{${b}}=\\dfrac{${fact(a)/fact(a-b)}}{${b}!}=${question.value}`},answer];
 }
 if(kind==="identical")return [
  {title:question.prompt.includes("最短経路")?"歩く順序に置き換える":"仮の番号を付ける",text:question.prompt.includes("最短経路")?m`最短なら右 $${a}$ 回、上 $${b}$ 回です。この $${a+b}$ 歩の順序と一つの経路が対応します。`:m`同じ文字にも仮番号を付けると、全 $${a+b+c}$ 個を区別して並べられます。`},
  {title:"同じものの入れ替えを除く",text:m`同じものに付けた仮番号を入れ替える $${a}!${b}!${c?`${c}!`:""}$ 通りが、一つの結果に対応します。`,tex:`\\dfrac{${a+b+c}!}{${a}!${b}!${c?`${c}!`:""}}=${question.value}`},answer
 ];
 if(kind==="groups"||kind==="labelled-groups")return [
  {title:"一方を選ぶと残りが決まる",text:kind==="labelled-groups"?m`赤組の $${a}$ 人を選ぶと、残りが白組です。`:m`まず $${a}$ 人の組を選ぶと、残りが $${b}$ 人の組です。`,tex:`{}_{${a+b}}C_{${a}}=${comb(a+b,a)}`},
  {title:"同じ分割を何回数えたか",text:kind==="groups"&&a===b?"組名も人数の違いもないので、先に選ぶ組を交換しても同じ分割です。二回ずつ数えています。":kind==="labelled-groups"?"赤組と白組の役割は違います。どちらが赤組かを一度だけ選んでいるので割りません。":m`人数が違うため、$${a}$ 人の組は一つに決まります。同じ分割を二度数えていないので割りません。`,...(kind==="groups"&&a===b?{tex:`\\dfrac{${comb(a+b,a)}}{2}=${question.value}`}:{})},answer
 ];
 if(kind==="complement")return [
  {title:"選べるすべての組",text:m`全 $${a+b}$ 人から $${c}$ 人を選びます。`,tex:`{}_{${a+b}}C_{${c}}=${comb(a+b,c)}`},
  {title:"女子が0人の組",text:m`女子を含まない組は、男子 $${b}$ 人だけから選ぶ組です。`,tex:`{}_{${b}}C_{${c}}=${comb(b,c)}`},
  {title:"それ以外が求める組",text:"女子が0人の組と、少なくとも一人いる組は重ならず、合わせて全体になります。",tex:`${comb(a+b,c)}-${comb(b,c)}=${question.value}`},answer
 ];
}
