import {vectorBanks,vectorChapter} from "./mathc-vectors";
import {spaceBanks,spaceChapter} from "./mathc-space";
import {complexBanks,complexChapter} from "./mathc-complex";
import {conicBanks,conicChapter} from "./mathc-conics";
import {curveBanks,curveChapter} from "./mathc-curves";
import {representationBanks,representationChapter} from "./mathc-representation";
export const mathCBanks=[...vectorBanks,...spaceBanks,...complexBanks,...conicBanks,...curveBanks,...representationBanks];
const chapters=[vectorChapter,spaceChapter,complexChapter,conicChapter,curveChapter,representationChapter];
export const mathCLessons=chapters.flatMap(c=>c.lessons);
export const mathCExercises=chapters.flatMap(c=>c.exercises);
const links:Record<string,string[]>={
 "mc-vector-angle":["mc-vector-dot","mc-vector-length"],
 "mc-vector-proof":["mc-vector-division","mc-vector-dot"],
 "mc-space-dot":["mc-vector-dot"],
 "mc-complex-polar":["mc-complex-point"],
 "mc-complex-roots":["mc-complex-powers"],
 "mc-complex-rotation":["mc-complex-product"],
 "mc-hyperbola":["mc-ellipse"],
 "mc-polar-equation":["mc-polar-coordinates"],
 "mc-matrix-product":["mc-matrix-table"],
 "mc-discrete-graph":["mc-matrix-product"]
};
for(const l of mathCLessons)if(links[l.slug])l.prerequisites=links[l.slug].map(slug=>({slug,label:mathCLessons.find(x=>x.slug===slug)!.title}));
