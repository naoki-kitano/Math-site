import type {Step} from "../content/lessons";
import {MathText,Formula} from "./MathText";
import {stepHeading,distinctSteps} from "../lib/step-heading";

export function Steps({steps,showNumbers=true}:{steps:Step[];showNumbers?:boolean}) {
 return <ol className={"steps"+(showNumbers?"":" steps-unnumbered")}>{distinctSteps(steps).map((s,i)=><li className="step" key={i}>{showNumbers&&<span className="step-num" aria-hidden="true">{i+1}</span>}<div>{stepHeading(s.title)&&<strong><MathText text={stepHeading(s.title)}/></strong>}<p><MathText text={s.text}/></p>{s.tex&&<Formula tex={s.tex} display/>}</div></li>)}</ol>;
}
