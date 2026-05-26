"use client";

import { useEffect, useState } from "react";
import { getQualities, type Quality } from "../app/lib/getQualities";

type Props = {
  source: string;
  kickUrl: string;
};

export default function QualitySelector({ source, kickUrl }: Props) {
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [selected, setSelected] = useState<Quality | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQualities() {
      setLoading(true);
      const result = await getQualities(source);
      setQualities(result);
      if (result.length > 0) setSelected(result[0]);
      setLoading(false);
    }
    fetchQualities();
  }, [source]);

  async function handleDownload() {
  if (!selected) return;
  setDownloading(true);
  setError(null);

  try {
    const height = selected.resolution.split("x")[1];

    const a = document.createElement("a");
    a.href = `/api/download?url=${encodeURIComponent(kickUrl)}&quality=${height}`;
    a.download = `kicksaver_${height}p.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    setError("Something went wrong. Try again.");
  } finally {
    setDownloading(false);
  }
}

  if (loading) {
    return (
      <p className="text-sm text-(--muted-foreground) mt-4 px-4">
        Loading qualities...
      </p>
    );
  }

  if (qualities.length === 0) {
    return (
      <p className="text-sm text-red-500 mt-4 px-4">
        No qualities found.
      </p>
    );
  }

  return (
    <div className="px-4 pb-4">
      <p className="text-xs text-(--muted-foreground) uppercase tracking-wide mb-2 font-medium">
        Select quality
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {qualities.map((q) => (
          <button
            key={q.url}
            onClick={() => setSelected(q)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              selected?.url === q.url
                ? "bg-(--accent) text-(--accent-foreground) border-(--accent)"
                : "bg-(--muted) text-(--foreground) border-(--border) hover:border-(--accent)"
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="px-6 py-2.5 rounded-xl bg-(--accent) text-(--accent-foreground) font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {downloading ? "Processing..." : `Download ${selected?.label}`}
      </button>
    </div>
  );
}