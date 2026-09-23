import {spaceFigure} from "../content/matha-space-figures";
import {GeometryDrawing} from "./MathAGeometryDiagrams";
export default function MathASpaceDiagrams({slug,index}:{slug:string;index:number}){
 const figure=spaceFigure(slug,index);return figure?<GeometryDrawing figure={figure}/>:null;
}
