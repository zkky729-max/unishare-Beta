import type { SVGProps } from "react";

interface UniShareLogoProps extends SVGProps<SVGSVGElement> {
  showText?: boolean;
  compact?: boolean;
}

export default function UniShareLogo({
  showText = true,
  compact = false,
  className = "",
  ...props
}: UniShareLogoProps) {
  return (
    <div
      className={`flex items-center gap-2 ${
        compact ? "justify-center" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        aria-label="UniShare"
        role="img"
        className={compact ? "h-9 w-9" : "h-10 w-10"}
        {...props}
      >
        <defs>
          <linearGradient
            id="unishare-blue-purple"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="55%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient
            id="unishare-cap"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* الدرع / U */}
        <path
          d="M18 39V61C18 78 31 89 50 93C69 89 82 78 82 61V39"
          fill="none"
          stroke="url(#unishare-blue-purple)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* الشخص الرئيسي */}
        <circle
          cx="50"
          cy="52"
          r="8"
          fill="#2563EB"
        />

        <path
          d="M39 76V67C39 60 44 56 50 56C56 56 61 60 61 67V76"
          fill="#2563EB"
        />

        {/* الشخص الأيسر */}
        <circle
          cx="31"
          cy="55"
          r="5"
          fill="#6366F1"
        />

        <path
          d="M24 73V67C24 63 27 60 31 60C35 60 38 63 38 67V73"
          fill="#6366F1"
        />

        {/* الشخص الأيمن */}
        <circle
          cx="69"
          cy="55"
          r="5"
          fill="#06B6D4"
        />

        <path
          d="M62 73V67C62 63 65 60 69 60C73 60 76 63 76 67V73"
          fill="#06B6D4"
        />

        {/* قبعة التخرج */}
        <path
          d="M50 12L20 26L50 40L80 26L50 12Z"
          fill="url(#unishare-cap)"
        />

        <path
          d="M31 31V42C31 48 40 52 50 52C60 52 69 48 69 42V31"
          fill="none"
          stroke="#2563EB"
          strokeWidth="4"
        />

        {/* خيط القبعة */}
        <path
          d="M80 26V39"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <circle
          cx="80"
          cy="42"
          r="3"
          fill="#6366F1"
        />
      </svg>

      {showText && !compact && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">
            Uni
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              Share
            </span>
          </span>

          <span className="mt-1 text-[8px] font-medium tracking-[0.22em] text-slate-400">
            LEARN · CONNECT · GROW
          </span>
        </div>
      )}
    </div>
  );
}