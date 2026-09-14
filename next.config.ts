import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.MATHCANVAS_PAGES === "1" ? {
    output: "export" as const,
    assetPrefix: "/Math-site",
  } : {}),
};

export default nextConfig;
