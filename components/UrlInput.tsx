"use client";

import { useState } from "react";
import { detectUrlType, type KickUrlType } from "../app/lib/detectUrlType";
import { getKickInfo, type KickVideoInfo } from "../app/lib/getKickInfo";
import VideoPreview from "./VideoPreview";

const labels: Record<KickUrlType, string> = {
  vod: "📹 VOD detected",
  clip: "✂️ Clip detected",
  live: "🔴 Live stream detected",
  unknown: "❓ Unknown URL",
};

export default function UrlInput() {
  const [url, setUrl] = useState("");
  const [urlType, setUrlType] = useState<KickUrlType | null>(null);
  const [videoInfo, setVideoInfo] = useState<KickVideoInfo | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(value: string) {
    setUrl(value);
    setVideoInfo(null);
    if (value.trim()) {
      setUrlType(detectUrlType(value));
    } else {
      setUrlType(null);
    }
  }

  async function handleSubmit() {
    if (!url.trim() || urlType === "unknown" || !urlType) return;
    setLoading(true);
    const info = await getKickInfo(url);
    setVideoInfo(info);
    setLoading(false);
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-(--foreground) mb-3">
          Download from Kick
        </h1>
        <p className="text-(--muted-foreground)">
          Paste a VOD, clip or live stream URL to get started
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="https://kick.com/streamer/videos/12345..."
          className="flex-1 px-4 py-3 rounded-xl border border-(--border) bg-(--card) text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--accent) transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={!url.trim() || urlType === "unknown" || loading}
          className="px-6 py-3 rounded-xl bg-(--accent) text-(--accent-foreground) font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Download"}
        </button>
      </div>

      {urlType && (
        <p className={`mt-3 text-sm ${urlType === "unknown" ? "text-red-500" : "text-(--accent)"}`}>
          {labels[urlType]}
        </p>
      )}

      {videoInfo && (
        <div className="mt-6">
          <VideoPreview info={videoInfo} kickUrl={url} />
        </div>
      )}
    </section>
  );
}