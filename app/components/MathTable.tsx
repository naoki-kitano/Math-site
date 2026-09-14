import { MathText } from "./MathText";
export type MathTableData={caption:string;headers:string[];rows:string[][]};
export default function MathTable({caption,headers,rows}:MathTableData){
 return <div className="math-table-scroll"><table className="math-table"><caption>{caption}</caption>
  <thead><tr>{headers.map((h,i)=><th scope="col" key={i}><MathText text={h}/></th>)}</tr></thead>
  <tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th scope="row" key={j}><MathText text={cell}/></th>:<td key={j}><MathText text={cell}/></td>)}</tr>)}</tbody>
 </table></div>;
}
