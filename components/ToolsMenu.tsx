"use client";

import { useState } from "react";

const tools = [
  { name: "TwitchSaver", emoji: "👾", available: false },
  { name: "InstagramSaver", emoji: "📸", available: false },
];

export default function ToolsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg border border-(--border) bg-(--card) text-(--foreground) hover:opacity-80 transition-opacity"
      >
        🛠️ Other Tools
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-52 z-20 rounded-xl border border-(--border) bg-(--card) shadow-lg overflow-hidden">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between px-4 py-3 hover:bg-(--muted) transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{tool.emoji}</span>
                  <span className="text-sm text-(--foreground)">{tool.name}</span>
                </div>
                {!tool.available && (
                  <span className="text-xs text-(--muted-foreground) bg-(--muted) px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}