const mathTwoChapters = [
  {name:"式と証明",title:"第1章　式と証明",id:"chapter-one"},
  {name:"複素数と方程式",title:"第2章　複素数と方程式",id:"chapter-two"},
  {name:"図形と方程式",title:"第3章　図形と方程式",id:"chapter-three"},
  {name:"三角関数",title:"第4章　三角関数",id:"chapter-four"},
  {name:"指数関数・対数関数",title:"第5章　指数関数・対数関数",id:"chapter-five"},
  {name:"微分の考え",title:"第6章　微分の考え",id:"chapter-six"},
  {name:"積分の考え",title:"第7章　積分の考え",id:"chapter-seven"},
];
export const chapters = [
  ...mathTwoChapters.map(chapter=>({...chapter,subject:"数学II" as const})),
  {name:"関数を読むための基礎",title:"第1章　関数を読むための基礎",id:"math3-chapter-one",subject:"数学III" as const},
  {name:"数列の極限と無限級数",title:"第2章　数列の極限と無限級数",id:"math3-chapter-two",subject:"数学III" as const},
  {name:"関数の極限と連続性",title:"第3章　関数の極限と連続性",id:"math3-chapter-three",subject:"数学III" as const},
];
export const subjectForChapter=(name:string)=>chapters.find(c=>c.name===name)?.subject??"数学II";
