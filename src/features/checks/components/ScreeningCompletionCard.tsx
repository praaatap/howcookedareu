type ScreeningCompletionCardProps = {
  screeningComplete: boolean
  segmentLabel: string
  segmentSummary: string
  answered: number
  total: number
  onContinue: () => void
}

function ScreeningCompletionCard({
  screeningComplete,
  segmentLabel,
  segmentSummary,
  answered,
  total,
  onContinue,
}: ScreeningCompletionCardProps) {
  if (!screeningComplete) {
    return null
  }

  return (
    <div className="glass-panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-7">
      <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Screening Complete</p>
      <h3 className="mt-2 text-balance font-ui text-lg font-semibold text-slate-900 sm:text-2xl">Ready for your tailored track</h3>
      <p className="mt-2 font-ui text-sm leading-6 text-slate-700">
        You answered {answered}/{total} profile questions. Your active mode is <span className="font-semibold">{segmentLabel}</span>.
      </p>
      <p className="mt-2 font-ui text-sm leading-6 text-slate-600">{segmentSummary}</p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 font-ui text-sm font-semibold text-slate-700 transition hover:border-slate-500"
      >
        Continue to tailored questions
      </button>
    </div>
  )
}

export default ScreeningCompletionCard