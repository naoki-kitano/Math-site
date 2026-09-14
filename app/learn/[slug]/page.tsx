import { notFound } from "next/navigation";
import LessonView from "../../components/LessonView";
import { lessons } from "../../content/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;const lesson=lessons.find(l=>l.slug===slug);
  return {title:lesson?.title??"見つかりません",description:lesson?.description};
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;const lesson=lessons.find(l=>l.slug===slug);
  if(!lesson)notFound();
  return <LessonView lesson={lesson}/>;
}
