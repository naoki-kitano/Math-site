import { MathText } from "./MathText";
export type MathTableData={caption:string;headers:string[];rows:string[][];compact?:boolean};
export default function MathTable({caption,headers,rows,compact=false}:MathTableData){
 const table=(columns:number[],className:string,captionHidden=false)=><table className={"math-table "+className}>
  <caption className={captionHidden?"sr-only":undefined}><MathText text={caption}/></caption>
  <thead><tr>{columns.map(i=><th scope="col" key={i}><MathText text={headers[i]}/></th>)}</tr></thead>
  <tbody>{rows.map((row,i)=><tr key={i}>{columns.map(j=>j===0?<th scope="row" key={j}><MathText text={row[j]}/></th>:<td key={j}><MathText text={row[j]}/></td>)}</tr>)}</tbody>
 </table>;
 const columns=headers.map((_,i)=>i);
 const groups=compact?Array.from({length:Math.ceil((headers.length-1)/2)},(_,i)=>[0,...columns.slice(1+i*2,3+i*2)]):[];
 return <div className={"math-table-scroll"+(compact?" has-compact-table":"")}>
  {table(columns,"math-table-main")}
  {compact&&<div className="math-table-compact">{groups.map((group,i)=><div key={i}>{table(group,"",i>0)}</div>)}</div>}
 </div>;
}
