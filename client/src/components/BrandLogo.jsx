import React from "react";
import { Link } from "react-router-dom";

/**
 * BrandLogo - High-tech custom SVG/JSX Vector Logo for SkillBridge
 * Features:
 * - Interconnected "S" Bridge Arch with multi-gradient paths (Indigo -> Violet -> Cyan)
 * - Glowing Violet/Cyan AI Sparkle Node on top-right corner
 * - Modern squircle backdrop with subtle drop-shadow glow
 * - Gradient typography for "SkillBridge"
 * - Thin vertical cyan-tinted glowing divider
 * - High-contrast cyan/indigo uppercase "TALENT PLATFORM" badge
 */
export default function BrandLogo({
  to = "/",
  size = "default", // 'default' | 'compact' | 'large'
  showTagline = true,
  className = "",
}) {
  const isCompact = size === "compact";
  const isLarge = size === "large";

  const markSize = isLarge ? "w-11 h-11" : isCompact ? "w-8 h-8" : "w-9 h-9";
  const titleSize = isLarge
    ? "text-2xl"
    : isCompact
    ? "text-base"
    : "text-xl";

  const content = (
    <div className={`flex items-center gap-2.5 select-none group transition-all duration-300 ${className}`}>
      {/* High-Tech Vector Logo Mark Container */}
      <div
        className={`relative ${markSize} rounded-2xl flex items-center justify-center p-1.5 border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 shadow-lg shadow-indigo-500/20 backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-500/40 transition-all duration-300 shrink-0`}
      >
        {/* Glowing Ambient Backdrop Aura */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 rounded-2xl blur-xs pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Custom SVG Interconnected "S" Bridge Arch */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <defs>
            {/* Primary Bridge Arch Gradient */}
            <linearGradient id="sbPrimaryGrad" x1="2" y1="4" x2="38" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Top Span Arc Gradient */}
            <linearGradient id="sbTopSpanGrad" x1="6" y1="8" x2="34" y2="18" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Bottom Support Span Gradient */}
            <linearGradient id="sbBottomSpanGrad" x1="8" y1="24" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* AI Sparkle Glow Filter */}
            <filter id="aiSparkleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Bridge Upper Arch Curve */}
          <path
            d="M28 8C20 7.5 12 11 11 18C10.2 23.5 15.5 25.2 20 26C25.5 27 28.5 28.5 28 32C27.2 35.5 22 36.5 14 34.5"
            stroke="url(#sbPrimaryGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Intersecting Structural Bridge Truss Line */}
          <path
            d="M13 14L27 24"
            stroke="url(#sbTopSpanGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />

          {/* Lower Suspension Arch */}
          <path
            d="M8 22C11 26 15 28 22 28"
            stroke="url(#sbBottomSpanGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 3"
          />

          {/* Core Keystone Nodes */}
          <circle cx="11" cy="18" r="2" fill="#818CF8" />
          <circle cx="28" cy="32" r="2" fill="#06B6D4" />
          <circle cx="20" cy="26" r="1.5" fill="#FFFFFF" />
        </svg>

        {/* AI Sparkle Node Badge on Top-Right Corner */}
        <div
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 p-0.5 shadow-md shadow-cyan-400/50 flex items-center justify-center animate-pulse"
          title="AI-Powered Platform"
        >
          <svg viewBox="0 0 10 10" fill="none" className="w-full h-full text-white">
            <path
              d="M5 0L6.2 3.8L10 5L6.2 6.2L5 10L3.8 6.2L0 5L3.8 3.8L5 0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Typography & Tagline Container */}
      <div className="flex items-center">
        {/* "SkillBridge" Title with Smooth Gradient Text */}
        <span
          className={`bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent font-bold tracking-tight ${titleSize} leading-none drop-shadow-xs`}
        >
          SkillBridge
        </span>

        {showTagline && (
          <>
            {/* Tagline Divider: Thin vertical cyan-tinted glowing divider */}
            <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent mx-2" />

            {/* "TALENT PLATFORM" Subtitle: High-contrast cyan/indigo uppercase badge */}
            <span className="text-[10px] font-semibold tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase">
              TALENT PLATFORM
            </span>
          </>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block outline-none" title="SkillBridge Dashboard">
        {content}
      </Link>
    );
  }

  return content;
}
