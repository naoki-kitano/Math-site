import {sequenceChapter,sequenceBanks} from "./mathb-sequences";
import {recurrenceChapter,recurrenceBanks} from "./mathb-recurrence";
import {distributionChapter,distributionBanks} from "./mathb-distributions";
import {inferenceChapter,inferenceBanks} from "./mathb-inference";
import {societyChapter,societyBanks} from "./mathb-society";
export const mathBBanks=[...sequenceBanks,...recurrenceBanks,...distributionBanks,...inferenceBanks,...societyBanks];
const all=[sequenceChapter,recurrenceChapter,distributionChapter,inferenceChapter,societyChapter];
export const mathBLessons=all.flatMap(c=>c.lessons);
export const mathBExercises=all.flatMap(c=>c.exercises);
const prerequisites:Record<string,{slug:string;label:string}[]>={
 "mb-partial-fractions":[{slug:"rational",label:"分数式の約分"}],
 "mb-telescoping":[{slug:"mb-partial-fractions",label:"部分分数分解"}],
 "mb-affine-recurrence":[{slug:"mb-geometric",label:"等比数列"}],
 "mb-expectation":[{slug:"ma-expected-value",label:"期待値の考え方"}],
 "mb-binomial-distribution":[{slug:"ma-independent-trials",label:"独立な試行"}],
 "mb-sample-mean":[{slug:"mb-independent-sum",label:"独立な確率変数の和"}],
 "mb-mean-interval":[{slug:"mb-sample-mean",label:"標本平均"},{slug:"mb-normal-distribution",label:"正規分布"}],
 "mb-two-sided-test":[{slug:"mb-normal-distribution",label:"標準化と区間確率"}],
 "mb-balance-recurrence":[{slug:"mb-affine-recurrence",label:"定数を引く漸化式"}]
};
for(const lesson of mathBLessons)if(prerequisites[lesson.slug])lesson.prerequisites=prerequisites[lesson.slug];
