import Link from "./SiteLink";
export function Header() {
  return <><a className="skip" href="#main">本文へ移動</a><header className="topbar"><div className="nav-inner"><Link className="brand" href="/">Math<span>Canvas</span></Link><nav className="nav-links" aria-label="メイン"><Link href="/">学ぶ</Link><Link href="/review">復習</Link><Link href="/record">記録</Link></nav></div></header></>;
}
export function Footer() {
  return <footer><div className="footer-inner"><span>MathCanvas · 数学II・数学III</span><span>学習記録はこのブラウザに保存されます。</span></div></footer>;
}
