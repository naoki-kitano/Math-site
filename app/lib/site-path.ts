// A build-time value keeps server HTML and hydrated links identical.
export const siteBase = process.env.NEXT_PUBLIC_SITE_BASE ?? "";
export function sitePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const boundary = path.search(/[?#]/);
  const pathname = boundary < 0 ? path : path.slice(0, boundary);
  const suffix = boundary < 0 ? "" : path.slice(boundary);
  const route = siteBase && pathname !== "/" && !pathname.split("/").pop()?.includes(".")
    ? `${pathname.replace(/\/$/, "")}.html`
    : pathname;
  return `${siteBase}${route}${suffix}`;
}
