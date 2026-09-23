import {integerFigure} from "../content/matha-integer-figures";
import {GeometryDrawing} from "./MathAGeometryDiagrams";
export default function MathAIntegerDiagrams({slug,index}:{slug:string;index:number}){
 const figure=integerFigure(slug,index);return figure?<GeometryDrawing figure={figure}/>:null;
}
