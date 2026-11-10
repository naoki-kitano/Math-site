import type {Exercise} from '../content/lessons';
import {rootLemmas} from '../content/math1-logic-presentation';
import {MathText} from './MathText';
export const math1LogicRootAnswerIds:Record<string,2|3>={
 'm1-proof-contradiction-irrational-root-extra-1-v1':2,
 'm1-proof-contradiction-irrational-root-extra-2-v1':3,
 'm1-sets-logic-check-m1-proof-contradiction-choose-irrational-root-1-v1':2,
 'm1-sets-logic-check-m1-proof-contradiction-choose-irrational-root-2-v1':3,
};
export default function Math1LogicAnswerDiagram({exercise}:{exercise:Exercise}){
 const d=math1LogicRootAnswerIds[exercise.id];if(!d)return null;
 return <details className="m1-logic-lemma"><summary>証明で使う平方の性質</summary><p><MathText text={rootLemmas[d].text}/></p></details>;
}
