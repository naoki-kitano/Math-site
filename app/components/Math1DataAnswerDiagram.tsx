import type {Exercise} from '../content/lessons';
import {math1DataAnswerFigures} from '../content/math1-data-answer-figures';
import Math1DataPlot from './Math1DataPlot';
export default function Math1DataAnswerDiagram({exercise}:{exercise:Exercise}){
 const figure=math1DataAnswerFigures[exercise.id];
 return figure?<Math1DataPlot figure={figure}/>:null;
}
