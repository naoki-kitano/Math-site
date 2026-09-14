import type { AnchorHTMLAttributes } from "react";
import { sitePath } from "../lib/site-path";

// Use document navigation: the hosted vinext Link client currently throws
// during prefetch/navigation. Browser records survive full page navigation.
export default function SiteLink({children,...props}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ? sitePath(props.href) : props.href;
  return <a {...props} href={href}>{children}</a>;
}
