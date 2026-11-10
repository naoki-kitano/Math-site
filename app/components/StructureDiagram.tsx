import MathACountingStructure from "./MathACountingStructure";
import MathAProbabilityStructure from "./MathAProbabilityStructure";
import MathAGeometryStructure from "./MathAGeometryStructure";
import MathASpaceStructure from "./MathASpaceStructure";
import MathAIntegerStructure from "./MathAIntegerStructure";
import Math1AlgebraDiagram from "./Math1AlgebraDiagram";
import Math1LogicDiagram from "./Math1LogicDiagram";
import Math1QuadraticDiagram from "./Math1QuadraticDiagram";
import Math1TrigDiagram from "./Math1TrigDiagram";
import Math1DataDiagram from "./Math1DataDiagram";
import Math3StructureDiagram from "./Math3StructureDiagram";
import Math2AlgebraDiagram from "./Math2AlgebraDiagram";
import Math2GeometryDiagram from "./Math2GeometryDiagram";
import Math2TrigDiagram from "./Math2TrigDiagram";
import Math2ExplogDiagram from "./Math2ExplogDiagram";
import Math2CalculusDiagram from "./Math2CalculusDiagram";

export default function StructureDiagram(props:{kind:string;stage:number;reduce:boolean}){
 const {kind}=props;
 if(kind.startsWith("ma-counting-"))return <MathACountingStructure {...props}/>;
 if(kind.startsWith("ma-probability-"))return <MathAProbabilityStructure {...props}/>;
 if(kind.startsWith("ma-geometry-"))return <MathAGeometryStructure {...props}/>;
 if(kind.startsWith("ma-space-"))return <MathASpaceStructure {...props}/>;
 if(kind.startsWith("ma-integer-"))return <MathAIntegerStructure {...props}/>;
 if(kind.startsWith("m1-data-"))return <Math1DataDiagram {...props}/>;
 if(kind.startsWith("m1-trig-"))return <Math1TrigDiagram {...props}/>;
 if(kind.startsWith("m1-quadratic-"))return <Math1QuadraticDiagram {...props}/>;
 if(kind.startsWith("m1-logic-"))return <Math1LogicDiagram {...props}/>;
 if(kind.startsWith("m1-algebra-"))return <Math1AlgebraDiagram {...props}/>;
 if(kind.startsWith("m2-algebra-"))return <Math2AlgebraDiagram {...props}/>;
 if(kind.startsWith("m2-geometry-"))return <Math2GeometryDiagram {...props}/>;
 if(kind.startsWith("m2-trig-"))return <Math2TrigDiagram {...props}/>;
 if(kind.startsWith("m2-explog-"))return <Math2ExplogDiagram {...props}/>;
 if(kind.startsWith("m2-calculus-"))return <Math2CalculusDiagram {...props}/>;
 return <Math3StructureDiagram {...props}/>;
}
