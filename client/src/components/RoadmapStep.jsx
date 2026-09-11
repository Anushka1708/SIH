import { useState } from "react";
import { Video, ChevronDown, ChevronUp, Play, ExternalLink } from "lucide-react";

export default function RoadmapStep({
  step,
  title,
  description,
  done,
  last,
  youtubeVideoId,
  youtubeTitle,
  youtubeChannel,
}) {
  const [showVideo, setShowVideo] = useState(false);

  // Fallback popular tutorials if milestone doesn't have an explicit ID
  const effectiveVideoId =
    youtubeVideoId ||
    (title?.toLowerCase().includes("docker")
      ? "fqMOX6JJhGo"
      : title?.toLowerCase().includes("aws") || title?.toLowerCase().includes("cloud")
      ? "2LaAJq1lB1Q"
      : title?.toLowerCase().includes("system")
      ? "m8Icp_Cid5o"
      : title?.toLowerCase().includes("node")
      ? "Oe421EPjeBE"
      : "bMknfKXIFA8");

  const effectiveTitle = youtubeTitle || `${title} - Recommended Masterclass`;
  const effectiveChannel = youtubeChannel || "freeCodeCamp.org";

  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
            done
              ? "bg-green text-white shadow-sm"
              : "bg-slate-100 dark:bg-[#2E2A52] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#4B4578]"
          }`}
        >
          {done ? "✓" : step}
        </div>
        {!last && <div className="w-px flex-1 bg-border dark:bg-[#2E2A52] my-1" />}
      </div>

      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[#1E1B33] dark:text-[#F3F4F6]">{title}</p>
            <p className="text-xs text-muted dark:text-[#9CA3AF] mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Video Toggle Button */}
          {effectiveVideoId && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowVideo(!showVideo);
              }}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shrink-0 ${
                showVideo
                  ? "bg-rose-500 text-white border-rose-600 shadow-sm"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50"
              }`}
              title="Watch recommended tutorial directly"
            >
              <Video size={13} className={showVideo ? "text-white" : "text-rose-600 dark:text-rose-400"} />
              <span>{showVideo ? "Hide Video" : "Watch Tutorial"}</span>
              {showVideo ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {/* Inline Responsive YouTube Iframe Accordion */}
        {showVideo && effectiveVideoId && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 p-3 bg-slate-900/90 dark:bg-[#0B081E] border border-slate-800 dark:border-[#2E2A52] rounded-2xl shadow-xl overflow-hidden text-white animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold text-slate-100 truncate text-[11.5px]">
                  {effectiveTitle}
                </span>
              </div>
              <span className="text-[10px] text-indigo-300 font-semibold shrink-0 ml-2 bg-white/10 px-2 py-0.5 rounded">
                {effectiveChannel}
              </span>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${effectiveVideoId}?autoplay=1&rel=0`}
                title={effectiveTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Play size={11} className="text-emerald-400" /> Interactive Antara Classroom
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${effectiveVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-300 hover:text-white flex items-center gap-1 hover:underline"
              >
                Open in YouTube <ExternalLink size={10} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}