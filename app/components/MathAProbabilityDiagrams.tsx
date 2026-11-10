import {MathText} from "./MathText";
import {ProbabilityPaths} from "./MathAProbabilityStructure";
export default function MathAProbabilityDiagrams({slug,index}:{slug:string;index:number}){
 if(slug!=="ma-probability-tree"||index!==1)return null;
 return <div className="math-a-figure"><ProbabilityPaths stage={2}/><p><MathText text={String.raw`$\frac6{25}+\frac6{25}=\frac{12}{25}$。`}/></p></div>;
}
