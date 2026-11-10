import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./learning.css";
import "./appearance.css";
import "./matha-learning.css";
import { Header, Footer } from "./components/Shell";
import { ProgressProvider } from "./components/Progress";
import { sitePath } from "./lib/site-path";


export const metadata: Metadata = {
  title: { default: "高校数学と中学の基礎 | MathCanvas", template: "%s | MathCanvas" },
  description: "数学I・A・II・B・III・Cと中学数学の基礎を、考え方と途中式が分かる例題・練習・復習で学ぶMathCanvas。",
  icons: {
    icon: sitePath("/favicon.svg"),
    shortcut: sitePath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{__html:'try{document.body.dataset.appearance=localStorage.getItem("mathcanvas.appearance.v1")==="warm"?"warm":"cool"}catch{document.body.dataset.appearance="cool"}'}}/>
        <ProgressProvider><Header />{children}<Footer /></ProgressProvider>
      </body>
    </html>
  );
}
