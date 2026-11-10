import Math3StructureDiagram from "./Math3StructureDiagram";
import Math2AlgebraDiagram from "./Math2AlgebraDiagram";
import Math2GeometryDiagram from "./Math2GeometryDiagram";
import Math2TrigDiagram from "./Math2TrigDiagram";
import Math2ExplogDiagram from "./Math2ExplogDiagram";
import Math2CalculusDiagram from "./Math2CalculusDiagram";

export default function StructureDiagram(props:{kind:string;stage:number;reduce:boolean}){
 const {kind}=props;
 if(kind.startsWith("m2-algebra-"))return <Math2AlgebraDiagram {...props}/>;
 if(kind.startsWith("m2-geometry-"))return <Math2GeometryDiagram {...props}/>;
 if(kind.startsWith("m2-trig-"))return <Math2TrigDiagram {...props}/>;
 if(kind.startsWith("m2-explog-"))return <Math2ExplogDiagram {...props}/>;
 if(kind.startsWith("m2-calculus-"))return <Math2CalculusDiagram {...props}/>;
 return <Math3StructureDiagram {...props}/>;
}
