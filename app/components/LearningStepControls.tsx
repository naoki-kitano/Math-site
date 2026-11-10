"use client";

export default function LearningStepControls({onPrevious,onNext,nextLabel="次へ",previousLabel="前へ",className=""}:{onPrevious?:()=>void;onNext?:()=>void;nextLabel?:string;previousLabel?:string;className?:string}){
 if(!onPrevious&&!onNext)return null;
 return <div className={`actions learning-step-controls ${className}`}>
  {onPrevious&&<button className="button secondary step-previous" onClick={onPrevious}>{previousLabel}</button>}
  {onNext&&<button className="button step-next" onClick={onNext}>{nextLabel}</button>}
 </div>;
}
