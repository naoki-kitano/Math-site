import type {Q} from "./mathb-authoring";

// Each passage includes the part of the answer reached at this point.
export function worked(question: Q, ...passages: string[]): Q {
  const parts = passages.length ? passages : [question.working];
  return {...question, working: parts.join(" "), steps: parts.map(text => ({title: "", text})), answerInSteps: true};
}
