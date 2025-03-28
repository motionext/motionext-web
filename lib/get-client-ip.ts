import { headers } from "next/headers";

/**
 * The function `getClientIP` retrieves the client's IP address from various possible sources with a
 * priority order.
 * @returns The `getClientIP` function returns the client's IP address by prioritizing different
 * sources. It first tries to get the IP address from the "cf-connecting-ip" header, then falls back to
 * "x-forwarded-for" header (splitting by comma if multiple IPs are present), then to "x-real-ip"
 * header, and finally defaults to "anonymous" if no IP address is found
 */
export async function getClientIP() {
  const headersList = await headers();

  // Try to get the client IP from various possible sources
  const forwardedFor = (headersList as Headers).get("x-forwarded-for");
  const realIp = (headersList as Headers).get("x-real-ip");
  const cfConnectingIp = (headersList as Headers).get("cf-connecting-ip");

  // Prioritize different IP sources
  const clientIp =
    cfConnectingIp || forwardedFor?.split(",")[0] || realIp || "anonymous";

  return clientIp;
}
