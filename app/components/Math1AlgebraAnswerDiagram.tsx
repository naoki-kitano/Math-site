import type {Exercise} from '../content/lessons';
import {math1AlgebraAnswerCases} from '../content/math1-algebra-answer-cases';
import {MathText} from './MathText';
import Math1AlgebraNumberLine from './Math1AlgebraNumberLine';
export {math1AlgebraAnswerCaseIds} from '../content/math1-algebra-answer-cases';
export default function Math1AlgebraAnswerDiagram({exercise}:{exercise:Exercise}){
 const data=math1AlgebraAnswerCases[exercise.id];
 if(!data)return null;
 return <figure className="m1alg-answer-diagram"><figcaption>{data.title}</figcaption>{data.note&&<p><MathText text={data.note}/></p>}<Math1AlgebraNumberLine min={data.min} max={data.max} marks={data.marks} rows={data.rows}/></figure>;
}
