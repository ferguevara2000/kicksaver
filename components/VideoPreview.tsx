import { type KickVideoInfo } from "../app/lib/getKickInfo";
import QualitySelector from "./QualitySelector";

type Props = {
  info: KickVideoInfo;
  kickUrl: string;
};

export default function VideoPreview({ info, kickUrl }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden">
        <div className="flex gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative shrink-0 w-48 aspect-video rounded-lg overflow-hidden bg-(--muted)">
            {info.thumbnail ? (
              <img
                src={info.thumbnail}
                alt={info.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-(--muted-foreground)">
                🎮
              </div>
            )}
            {info.duration && (
              <span className="absolute bottom-1 right-1 text-xs bg-black/80 text-white px-1.5 py-0.5 rounded">
                {info.duration}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center gap-1 min-w-0">
            <p className="text-xs text-(--accent) font-medium uppercase tracking-wide">
              {info.channel}
            </p>
            <h2 className="text-(--foreground) font-semibold text-sm leading-snug line-clamp-2">
              {info.title}
            </h2>
          </div>
        </div>

        {info.source && (
          <QualitySelector source={info.source} kickUrl={kickUrl} />
        )}
      </div>
    </div>
  );
}