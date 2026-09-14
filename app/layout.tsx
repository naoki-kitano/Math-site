import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./learning.css";
import { Header, Footer } from "./components/Shell";
import { ProgressProvider } from "./components/Progress";
import { sitePath } from "./lib/site-path";


export const metadata: Metadata = {
  title: { default: "数学II・数学III | MathCanvas", template: "%s | MathCanvas" },
  description: "数学II・数学IIIの基礎を、考え方と途中式が分かる例題・練習・後日の復習で学ぶMathCanvas。",
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
      <body>
        <ProgressProvider><Header />{children}<Footer /></ProgressProvider>
      </body>
    </html>
  );
}
