export type Quality = {
  label: string;
  resolution: string;
  url: string;
};

export async function getQualities(masterUrl: string): Promise<Quality[]> {
  try {
    const res = await fetch(masterUrl);
    if (!res.ok) return [];
    const text = await res.text();

    const base = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1);
    const qualities: Quality[] = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("#EXT-X-STREAM-INF")) {
        const resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);
        const resolution = resolutionMatch ? resolutionMatch[1] : "Unknown";
        const height = resolution.split("x")[1];
        const rawUrl = lines[i + 1]?.trim();

        if (rawUrl && !rawUrl.startsWith("#")) {
          const absoluteUrl = rawUrl.startsWith("http")
            ? rawUrl
            : `${base}${rawUrl}`;

          qualities.push({
            label: height ? `${height}p` : "Unknown",
            resolution,
            url: absoluteUrl,
          });
        }
      }
    }

    return qualities.sort((a, b) => {
      const aH = parseInt(a.resolution.split("x")[1]);
      const bH = parseInt(b.resolution.split("x")[1]);
      return bH - aH;
    });
  } catch {
    return [];
  }
}