import withNextIntl from "next-intl/plugin";
import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["jsx", "mdx", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=86400; includeSubDomains; preload", // HSTS
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Previne detection MIME
          },
          {
            key: "X-Frame-Options",
            value: "DENY", // Previne clickjacking
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block", // XSS
          },
        ],
      },
    ];
  },
};

const withI18n = withNextIntl("./i18n.config.ts");
export default withI18n(withMDX(nextConfig));
