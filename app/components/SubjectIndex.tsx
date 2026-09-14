import Link from "./SiteLink";
import { lessons, exercises } from "../content/lessons";
import { chapters } from "../content/chapters";
export default function SubjectIndex({subject}:{subject:"数学II"|"数学III"}){
 const available=chapters.filter(c=>c.subject===subject&&lessons.some(l=>l.chapter===c.name));
 return <main id="main"><section className="hero"><div className="breadcrumb"><Link href="/">科目を選ぶ</Link></div><h1>{subject}</h1></section><div className="wrap">
  <nav className="chapter-jump" aria-label={subject+"の章を選ぶ"}>{available.map(c=><a className="button secondary" key={c.id} href={"#"+c.id}>{c.title}</a>)}</nav>
  {available.map(c=><section className="block" id={c.id} key={c.id}><h2>{c.title}</h2><div className="home-grid">{lessons.filter(l=>l.chapter===c.name).map((l,i)=><article className="lesson-tile" key={l.slug}><span className="tile-number">{String(i+1).padStart(2,"0")}</span><h3>{l.title}</h3><p>{l.description}</p><p className="meta">例題 {l.examples.length}問 · 練習 {exercises.filter(e=>e.lesson===l.slug&&e.stage!=="review").length}問 · 復習用の別問題 {exercises.filter(e=>e.lesson===l.slug&&e.stage==="review").length}問</p><Link className="button" href={"/learn/"+l.slug}>学ぶ →</Link></article>)}</div></section>)}
  <Link className="text-link" href="/">科目選択へ戻る</Link>
 </div></main>;
}
