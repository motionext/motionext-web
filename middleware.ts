import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // Uma lista de todos os locales que são suportados
  locales: ["en", "pt"],

  // Se nenhum locale corresponder, use este
  defaultLocale: "en",
});

export const config = {
  // Corresponde a todos os caminhos exceto os que começam com: api, _next, _vercel, legal, (.*).(.*)
  matcher: ["/((?!api|_next|_vercel|legal|.*\\..*).*)"],
};
