export type KickUrlType = "vod" | "clip" | "live" | "unknown";

export function detectUrlType(url: string): KickUrlType {
  try {
    const { hostname, pathname } = new URL(url);

    if (!hostname.includes("kick.com")) return "unknown";

    if (pathname.includes("/videos/")) return "vod";
    if (pathname.includes("/clips/")) return "clip";

    // kick.com/streamer — live stream
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 1) return "live";

    return "unknown";
  } catch {
    return "unknown";
  }
}