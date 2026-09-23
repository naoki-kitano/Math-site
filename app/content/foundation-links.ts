import type { Exercise } from "./lessons";

// Explicitly selected prerequisite lessons; this is not an automatic diagnosis.
export const foundationMap: Record<string, string[]> = {
 "rational":["jr-fractions","jr-factorization"],
 "points":["jr-coordinates","jr-substitution"],
 "complex-numbers":["jr-square-roots"],
 "complex-arithmetic":["jr-expansion","jr-signed-product"],
 "m1-substitution":["jr-substitution","jr-order-powers"],
 "m1-like-terms":["jr-like-terms"],
 "m1-distributive-expansion":["jr-expansion"],
 "m1-product-identities":["jr-expansion"],
 "m1-function-values":["jr-substitution","jr-coordinates"],
 "m1-graph-points":["jr-coordinates"],
 "m1-basic-parabola":["jr-quadratic-function"],
 "m1-completing-square":["jr-expansion","jr-quadratic-equation"],
 "ma-independent-trials":["jr-probability","jr-order-powers"],
 "ma-expected-value":["jr-probability","jr-averages"],
 "mb-sequence-terms":["jr-substitution"],
 "mb-arithmetic":["jr-linear-function"],
 "mb-geometric":["jr-order-powers"],
 "mb-partial-fractions":["jr-fractions","jr-factorization"],
 "mb-sample-mean":["jr-averages","jr-sampling"],
 "m3-limit-and-value":["jr-coordinates","jr-substitution"],
 "m3-normal-line":["jr-linear-function"],
 "mc-vector-components":["jr-coordinates","jr-signed-add"],
 "mc-vector-length":["jr-pythagoras","jr-root-calculation"],
 "mc-complex-point":["jr-coordinates"],
 "mc-data-representation":["jr-frequency-quartiles"],
 "jr-signed-product":["jr-signed-add"],
 "jr-order-powers":["jr-signed-product"],
 "jr-fractions":["jr-prime-factors"],
 "jr-ratio-percent":["jr-fractions"],
 "jr-substitution":["jr-order-powers"],
 "jr-like-terms":["jr-signed-add","jr-signed-product"],
 "jr-monomials":["jr-order-powers","jr-fractions"],
 "jr-expansion":["jr-like-terms","jr-signed-product"],
 "jr-factorization":["jr-expansion"],
 "jr-linear-equation":["jr-like-terms","jr-fractions"],
 "jr-simultaneous":["jr-linear-equation","jr-substitution"],
 "jr-formula-quantities":["jr-linear-equation"],
 "jr-square-roots":["jr-order-powers"],
 "jr-root-calculation":["jr-square-roots","jr-prime-factors"],
 "jr-quadratic-equation":["jr-square-roots","jr-factorization"],
 "jr-coordinates":["jr-substitution"],
 "jr-proportion":["jr-ratio-percent","jr-coordinates"],
 "jr-linear-function":["jr-coordinates","jr-linear-equation"],
 "jr-quadratic-function":["jr-coordinates","jr-order-powers"],
 "jr-congruence":["jr-angles"],
 "jr-similarity":["jr-ratio-percent"],
 "jr-circle-angles":["jr-angles"],
 "jr-pythagoras":["jr-square-roots","jr-quadratic-equation"],
 "jr-area-volume":["jr-fractions"],
 "jr-averages":["jr-fractions"],
 "jr-frequency-quartiles":["jr-averages","jr-ratio-percent"],
 "jr-probability":["jr-fractions"],
 "jr-sampling":["jr-ratio-percent","jr-frequency-quartiles"],
};

export function foundationsFor(q: Pick<Exercise,"lesson"|"family"|"stage">): string[] {
 // A preparation question must not inherit the prerequisites of the main task.
 if(q.stage==="ready") return [];
 const source=Object.keys(foundationMap).sort((a,b)=>b.length-a.length)
   .find(slug=>q.lesson===slug || q.family.startsWith(slug+"-"));
 return source ? foundationMap[source].filter(slug=>slug!==q.lesson).slice(0,2) : [];
}

export function knownExercise(id:string|null, all:readonly Exercise[]):Exercise|undefined {
 return id ? all.find(q=>q.id===id) : undefined;
}
export function knownReviewOf(id:string|null,q:Exercise|undefined,all:readonly Exercise[]):string|undefined {
 const target=knownExercise(id,all);
 return q&&target&&target.id!==q.id&&target.lesson===q.lesson&&target.family===q.family&&target.kind===q.kind?target.id:undefined;
}
