"use client";

import { useTheme } from "next-themes";
import { use } from "react";

function getThemePromise() {
  return Promise.resolve(true);
}

const mountedPromise = getThemePromise();

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  use(mountedPromise);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg border border-(--border) bg-(--card) text-(--foreground) hover:opacity-80 transition-opacity"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}