import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const points = ['2-minute screening', 'AI + lifestyle tracks', 'Tailored question sets']

function MindLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" role="img" aria-label="Mind logo">
      <g fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 22c-4 0-7 3-7 7 0 3 2 5 4 6-2 1-4 4-4 7 0 5 4 9 9 9h16c5 0 9-4 9-9 0-3-2-6-4-7 2-1 4-3 4-6 0-4-3-7-7-7-1-4-5-7-10-7s-9 3-10 7Z" />
        <path d="M32 18v28" />
        <path d="M24 31h16" />
        <path d="M22 39h8" />
        <path d="M34 39h8" />
      </g>
    </svg>
  )
}

function AiPulseWidget() {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewBox="0 0 220 220"
      className="h-40 w-40 sm:h-48 sm:w-48"
      role="img"
      aria-label="AI pulse widget"
    >
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="110" r="86" fill="none" stroke="url(#ring)" strokeWidth="2" opacity="0.25" />
      <circle cx="110" cy="110" r="58" fill="none" stroke="url(#ring)" strokeWidth="2" opacity="0.35" />

      <g>
        <line x1="110" y1="110" x2="110" y2="34" stroke="#0f172a" strokeOpacity="0.35" strokeWidth="2" />
        <line x1="110" y1="110" x2="177" y2="73" stroke="#0f172a" strokeOpacity="0.35" strokeWidth="2" />
        <line x1="110" y1="110" x2="177" y2="147" stroke="#0f172a" strokeOpacity="0.35" strokeWidth="2" />
        <line x1="110" y1="110" x2="110" y2="186" stroke="#0f172a" strokeOpacity="0.35" strokeWidth="2" />
        <line x1="110" y1="110" x2="43" y2="147" stroke="#0f172a" strokeOpacity="0.35" strokeWidth="2" />
        <line x1="110" y1="110" x2="43" y2="73" stroke="#0f172a" strokeOpacity="0.35" strokeWidth="2" />
      </g>

      <motion.circle
        cx="110"
        cy="110"
        r="16"
        fill="#0f172a"
        animate={{ r: [16, 18, 16] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
        style={{ transformOrigin: '110px 110px' }}
      >
        <circle cx="110" cy="34" r="8" fill="url(#node)" />
        <circle cx="177" cy="73" r="8" fill="url(#node)" />
        <circle cx="177" cy="147" r="8" fill="url(#node)" />
        <circle cx="110" cy="186" r="8" fill="url(#node)" />
        <circle cx="43" cy="147" r="8" fill="url(#node)" />
        <circle cx="43" cy="73" r="8" fill="url(#node)" />
      </motion.g>
    </motion.svg>
  )
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f6efe7] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none absolute -left-20 -top-16 h-72 w-72 rounded-full bg-[#fcd9b7]/55 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#d8ecef]/65 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col items-center justify-center text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#eadbca] bg-white/80 px-4 py-2">
          <MindLogo />
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">How Cooked Are You</p>
        </div>

        <div className="mt-7">
          <AiPulseWidget />
        </div>

        <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.02] text-slate-900 sm:text-5xl lg:text-6xl">
          Are you over-relying on AI or running your life on low battery?
        </h1>

        <p className="mt-6 max-w-3xl font-ui text-sm leading-relaxed text-slate-700 sm:text-lg">
          Start with a quick screening about who you are, then take a tailored check for AI habits or lifestyle drift.
          The result is more specific, more useful, and easier to act on.
        </p>

        <div className="mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/check/ai"
            className="rounded-full bg-slate-900 px-7 py-3 text-center font-ui text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Start AI Check
          </Link>
          <Link
            to="/check/lifestyle"
            className="rounded-full border border-slate-300 bg-white/85 px-7 py-3 text-center font-ui text-sm font-semibold text-slate-700 transition hover:border-slate-500"
          >
            Start Lifestyle Check
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {points.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#e7d8c8] bg-white/70 px-3.5 py-1.5 font-ui text-xs font-medium text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </main>
  )
}