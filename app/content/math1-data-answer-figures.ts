import type {DataFigure} from '../components/Math1DataPlot';
const bars=(counts:number[]):DataFigure=>({title:'解答のヒストグラム',description:'',kind:'bars',xLabel:'所要時間（分）',yLabel:'度数（人）',xRange:[0,15],yMax:6,xTicks:[0,5,10,15],yTicks:[0,2,4,6],bars:counts.map((value,i)=>({lo:5*i,hi:5*(i+1),value}))});
const box=(five:number[]):DataFigure=>({title:'解答の箱ひげ図',description:'ひげは最小値・最大値まで引いています。',kind:'box',xLabel:'データの値',yLabel:'',xRange:[0,12],yMax:1,xTicks:[0,2,4,6,8,10,12],yTicks:[],five});
const points=(pairs:[number,number][]):DataFigure=>({title:'解答の散布図',description:'',kind:'points',xLabel:'変量 $x$',yLabel:'変量 $y$',xRange:[0,5],yMax:5,xTicks:[0,1,2,3,4,5],yTicks:[0,1,2,3,4,5],points:pairs});

export const math1DataAnswerFigures:Record<string,DataFigure>={
 'm1-histogram-draw-histogram-one-v1':bars([2,5,3]),
 'm1-histogram-draw-histogram-two-v1':bars([4,3,1]),
 'm1-boxplot-draw-boxplot-one-v1':box([1,2,4,8,9]),
 'm1-boxplot-draw-boxplot-two-v1':box([2,3,6,9,10]),
 'm1-scatterplot-paired-points-1-v1':points([[1,3],[2,1],[3,2]]),
 'm1-scatterplot-paired-points-2-v1':points([[0,1],[1,3],[2,2]]),
 'm1-scatterplot-paired-points-3-v1':points([[1,4],[2,2],[3,1]]),
 'm1-scatterplot-paired-points-4-v1':points([[2,1],[3,3],[4,2]]),
 'm1-scatterplot-paired-points-5-v1':points([[1,1],[2,3],[4,2]]),
 'm1-scatterplot-paired-points-6-v1':points([[0,3],[2,2],[3,0]]),
};
const copies:Record<string,string>={
 'm1-data-analysis-check-m1-histogram-draw-histogram-1-v1':'m1-histogram-draw-histogram-one-v1',
 'm1-data-analysis-check-m1-histogram-draw-histogram-2-v1':'m1-histogram-draw-histogram-two-v1',
 'm1-data-analysis-check-m1-boxplot-draw-boxplot-1-v1':'m1-boxplot-draw-boxplot-one-v1',
 'm1-data-analysis-check-m1-boxplot-draw-boxplot-2-v1':'m1-boxplot-draw-boxplot-two-v1',
 'm1-data-analysis-check-m1-scatterplot-paired-points-1-v1':'m1-scatterplot-paired-points-2-v1',
 'm1-data-analysis-check-m1-scatterplot-paired-points-2-v1':'m1-scatterplot-paired-points-5-v1',
};
for(const[id,source]of Object.entries(copies))math1DataAnswerFigures[id]=math1DataAnswerFigures[source];
