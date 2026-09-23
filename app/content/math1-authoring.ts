import type { Lesson, Example, Exercise } from "./lessons";

// Content is assembled here; publication remains a separate, validated step.
export type MathOneLesson = Omit<Lesson, "subject" | "examples"> & {
  subject: "数学I";
  examples: (Example & { id: string; guidedIds: string[] })[];
};
export type QuestionDraft = {
  key: string; family: string; prompt: string; answer: string;
  hint: string; working: string;
};
export type LessonDraft = Omit<MathOneLesson, "subject" | "chapter" | "guidedAfterExamples">;
export function defineMathOneLesson(lesson: LessonDraft, questions: Record<Exercise["stage"], QuestionDraft[]>) {
  const exercises: Exercise[] = [];
  for (const stage of ["ready", "guided", "practice", "review"] as const) {
    for (const q of questions[stage]) exercises.push({
      id: `${lesson.slug}-${q.key}-v1`, lesson: lesson.slug, stage,
      family: q.family, kind: "paper", prompt: q.prompt, answer: q.answer,
      hints: [q.hint], steps: [{title:"考えて進める",text:q.working},{title:"答えと確認",text:q.answer}],
      repair: q.family,
    });
  }
  const result: MathOneLesson = {...lesson,subject:"数学I",chapter:"数と式",guidedAfterExamples:true};
  return {lesson:result,exercises};
}
export function question(key:string,family:string,prompt:string,answer:string,hint:string,working:string):QuestionDraft {
  return {key,family,prompt,answer,hint,working};
}
