import type {Exercise} from "../content/lessons";
import Math2GeometryAnswerDiagram from "./Math2GeometryAnswerDiagram";
import Math2TrigAnswerDiagram from "./Math2TrigAnswerDiagram";
import Math2ExplogAnswerDiagram from "./Math2ExplogAnswerDiagram";

// Only exact, authored exercise matches return a figure. A lesson's first
// example must never stand in for the answer to a different question.
export default function ExerciseAnswerDiagram({exercise}:{exercise:Exercise}){
 return <><Math2GeometryAnswerDiagram exercise={exercise}/><Math2TrigAnswerDiagram exercise={exercise}/><Math2ExplogAnswerDiagram exercise={exercise}/></>;
}
