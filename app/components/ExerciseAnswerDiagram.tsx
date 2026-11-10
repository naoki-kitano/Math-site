import Math1QuadraticAnswerDiagram from "./Math1QuadraticAnswerDiagram";
import Math1AlgebraAnswerDiagram from "./Math1AlgebraAnswerDiagram";
import Math1DataAnswerDiagram from "./Math1DataAnswerDiagram";
import Math1LogicAnswerDiagram from "./Math1LogicAnswerDiagram";
import type {Exercise} from "../content/lessons";
import Math2GeometryAnswerDiagram from "./Math2GeometryAnswerDiagram";
import Math2TrigAnswerDiagram from "./Math2TrigAnswerDiagram";
import Math2ExplogAnswerDiagram from "./Math2ExplogAnswerDiagram";

// Only exact, authored exercise matches return a figure. A lesson's first
// example must never stand in for the answer to a different question.
export default function ExerciseAnswerDiagram({exercise}:{exercise:Exercise}){
 return <><Math1LogicAnswerDiagram exercise={exercise}/><Math1AlgebraAnswerDiagram exercise={exercise}/><Math1DataAnswerDiagram exercise={exercise}/><Math1QuadraticAnswerDiagram exercise={exercise}/><Math2GeometryAnswerDiagram exercise={exercise}/><Math2TrigAnswerDiagram exercise={exercise}/><Math2ExplogAnswerDiagram exercise={exercise}/></>;
}
