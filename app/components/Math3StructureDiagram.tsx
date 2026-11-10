import Math3GeometryStructures from './Math3GeometryStructures';
import Math3SequenceStructures from './Math3SequenceStructures';
import Math3LengthStructure from './Math3LengthStructure';
import Math3RiemannStructure from './Math3RiemannStructure';
export default function Math3StructureDiagram({kind,stage,reduce}:{kind:string;stage:number;reduce:boolean}){
 return <div className="math3-structure-diagram">
  {['fence','washer'].includes(kind)?<Math3GeometryStructures kind={kind} stage={stage} reduce={reduce}/>:kind.startsWith('sequence-')?<Math3SequenceStructures kind={kind} stage={stage} reduce={reduce}/>:kind==='riemann'?<Math3RiemannStructure stage={stage} reduce={reduce}/>:<Math3LengthStructure kind={kind} stage={stage} reduce={reduce}/>}
 </div>;
}
