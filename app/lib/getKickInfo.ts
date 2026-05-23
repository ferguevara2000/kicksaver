export type KickVideoInfo = {
  title: string;
  thumbnail: string;
  channel: string;
  duration?: string;
  source?: string;
};

export async function getKickInfo(
  url: string
): Promise<KickVideoInfo | null> {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);

    // VOD: /streamer/videos/12345
    if (parts[1] === "videos" && parts[2]) {
      const res = await fetch(
        `https://kick.com/api/v1/video/${parts[2]}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return {
        title: data.livestream?.session_title ?? "Untitled",
        thumbnail: data.livestream?.thumbnail ?? "",
        channel: data.livestream?.channel?.slug ?? parts[0],
        duration: data.livestream?.duration
          ? formatDuration(Math.floor(data.livestream.duration / 1000))
          : undefined,
        source: data.source ?? undefined,
      };
    }

    // Clip: /streamer/clips/abc
    if (parts[1] === "clips" && parts[2]) {
      const res = await fetch(
        `https://kick.com/api/v2/clips/${parts[2]}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return {
        title: data.clip?.title ?? "Untitled",
        thumbnail: data.clip?.thumbnail_url ?? "",
        channel: data.clip?.channel?.slug ?? parts[0],
        duration: data.clip?.duration
          ? formatDuration(data.clip.duration)
          : undefined,
      };
    }

    // Live: /streamer
    if (parts.length === 1) {
      const res = await fetch(
        `https://kick.com/api/v2/channels/${parts[0]}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return {
        title: data.livestream?.session_title ?? "Live Stream",
        thumbnail: data.livestream?.thumbnail?.url ?? "",
        channel: data.slug ?? parts[0],
      };
    }

    return null;
  } catch {
    return null;
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}