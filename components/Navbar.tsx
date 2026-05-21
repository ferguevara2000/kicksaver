import ThemeToggle from "./ThemeToggle";
import ToolsMenu from "./ToolsMenu";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-(--border) bg-(--background)">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-(--accent) flex items-center justify-center">
            <span className="text-(--accent-foreground) font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-lg text-(--foreground)">KickSaver</span>
        </div>
        <div className="flex items-center gap-2">
          <ToolsMenu />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}