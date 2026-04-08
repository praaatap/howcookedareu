import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { checkConfigs } from '../features/checks/checkData'
import {
  getAssessmentQuestions,
  getNextQuestionId,
  getSegmentLabel,
  getSegmentSummary,
} from '../features/checks/checkEngine'
import type { AssessmentQuestion, CheckKey } from '../features/checks/checkTypes'
import { useCheckStore } from '../features/checks/checkStore'

type ResultTone = {
  title: string
  text: string
  toneClass: string
  badgeClass: string
}

const scoreOptions = [
  { label: 'Never', value: 0 },
  { label: 'Sometimes', value: 1 },
  { label: 'Often', value: 2 },
  { label: 'Always', value: 3 },
]

function getResultTone(score: number, maxScore: number): ResultTone {
  if (maxScore === 0) {
    return {
      title: 'No result yet',
      text: 'Answer the tailored questions to unlock your result.',
      toneClass: 'text-slate-700',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  }

  const ratio = score / maxScore

  if (ratio <= 0.33) {
    return {
      title: 'Stable zone',
      text: 'You are mostly in control. Keep these systems consistent.',
      toneClass: 'text-emerald-700',
      badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
  }

  if (ratio <= 0.66) {
    return {
      title: 'Medium cooked',
      text: 'Some habits are starting to drag your performance down.',
      toneClass: 'text-amber-700',
      badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    }
  }

  return {
    title: 'Deeply cooked',
    text: 'Current pattern is high risk. A reset routine is needed now.',
    toneClass: 'text-rose-700',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
  }
}

function isCheckKey(value: string | undefined): value is CheckKey {
  return value === 'ai' || value === 'lifestyle'
}

function getOptionLabel(options: Array<{ label: string; value: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? 'Unknown'
}

function getScreeningProgress(profileQuestions: typeof checkConfigs.ai.profileQuestions, profileAnswers: Record<string, string>) {
  return profileQuestions.reduce((count, question) => count + (profileAnswers[question.id] ? 1 : 0), 0)
}

function CheckPage() {
  const { checkKey } = useParams()
  const isValidCheckKey = isCheckKey(checkKey)
  const resolvedCheckKey: CheckKey = isValidCheckKey ? checkKey : 'ai'

  const config = checkConfigs[resolvedCheckKey]
  const [copied, setCopied] = useState(false)
  const savedState = useCheckStore((state) => state.checks[resolvedCheckKey])
  const setStage = useCheckStore((state) => state.setStage)
  const setProfileAnswer = useCheckStore((state) => state.setProfileAnswer)
  const setAnswer = useCheckStore((state) => state.setAnswer)
  const resetCheck = useCheckStore((state) => state.resetCheck)

  const profileAnswers = savedState.profileAnswers
  const answers = savedState.answers
  const profileQuestions = config.profileQuestions
  const assessmentQuestions = useMemo<AssessmentQuestion[]>(() => getAssessmentQuestions(config, profileAnswers), [config, profileAnswers])
  const segmentLabel = getSegmentLabel(config, profileAnswers)
  const segmentSummary = getSegmentSummary(config, profileAnswers)
  const screeningAnswered = getScreeningProgress(profileQuestions, profileAnswers)
  const screeningComplete = screeningAnswered === profileQuestions.length
  const stage = savedState.stage === 'assessment' && !screeningComplete ? 'screening' : savedState.stage
  const answeredCount = Object.keys(answers).length
  const completed = assessmentQuestions.length > 0 && answeredCount === assessmentQuestions.length
  const score = useMemo(() => Object.values(answers).reduce((acc, value) => acc + value, 0), [answers])
  const maxScore = assessmentQuestions.length * 3
  const resultTone = getResultTone(score, maxScore)
  const progressPercent = stage === 'screening'
    ? Math.round((screeningAnswered / profileQuestions.length) * 100)
    : Math.round((answeredCount / assessmentQuestions.length) * 100)
  const nextAssessmentQuestionId = getNextQuestionId(
    assessmentQuestions.map((question: AssessmentQuestion) => question.id),
    answers,
  )

  useEffect(() => {
    if (savedState.stage === 'assessment' && !screeningComplete) {
      setStage(resolvedCheckKey, 'screening')
    }
  }, [resolvedCheckKey, savedState.stage, screeningComplete, setStage])

  function updateProfileAnswer(questionId: string, value: string) {
    setProfileAnswer(resolvedCheckKey, questionId, value)
  }

  function updateAnswer(questionId: string, value: number) {
    setAnswer(resolvedCheckKey, questionId, value)
  }

  function continueToAssessment() {
    if (!screeningComplete) return

    setStage(resolvedCheckKey, 'assessment')
  }

  function resetAssessment() {
    resetCheck(resolvedCheckKey)
  }

  function jumpToNextQuestion() {
    if (!nextAssessmentQuestionId) return

    const element = document.getElementById(`q-${nextAssessmentQuestionId}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function buildSummaryText() {
    const profileLines = profileQuestions.map((question) => {
      const answer = profileAnswers[question.id]
      return `${question.label}: ${answer ? getOptionLabel(question.options, answer) : 'Unanswered'}`
    })

    const topSignals: Array<{ question: AssessmentQuestion; value: number }> = assessmentQuestions
      .map((question: AssessmentQuestion) => ({
        question,
        value: answers[question.id] ?? 0,
      }))
      .filter((item: { question: AssessmentQuestion; value: number }) => item.value > 0)
      .sort((a: { question: AssessmentQuestion; value: number }, b: { question: AssessmentQuestion; value: number }) => b.value - a.value)
      .slice(0, 3)

    const lines = [
      `How Cooked Are You - ${config.title}`,
      `Screening segment: ${segmentLabel}`,
      '',
      'Profile snapshot:',
      ...profileLines.map((line) => `- ${line}`),
      '',
      `Score: ${score}/${maxScore} (${progressPercent}%)`,
      `Result: ${resultTone.title}`,
      `Notes: ${resultTone.text}`,
      '',
      'Top signals:',
      ...topSignals.map((item: { question: AssessmentQuestion; value: number }, index: number) => `${index + 1}. ${item.question.text}`),
      '',
      'Suggested improvement tips:',
      ...config.tips.map((tip, index) => `${index + 1}. ${tip}`),
    ]

    return lines.join('\n')
  }

  async function copySummary() {
    if (!completed) return

    await navigator.clipboard.writeText(buildSummaryText())
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  function downloadSummary() {
    if (!completed) return

    const blob = new Blob([buildSummaryText()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${config.key}-cooked-summary.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const screeningProgressPercent = Math.round((screeningAnswered / profileQuestions.length) * 100)
  const assessmentProgressPercent = Math.round((answeredCount / assessmentQuestions.length) * 100)

  if (!isValidCheckKey) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f6efe7]">
      <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${config.accentClass} opacity-80`} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[34px_34px] opacity-[0.08]" />

      <div className="relative px-4 pb-20 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <header className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-slate-600">Assessment</p>
              <h1 className="mt-2 text-balance font-display text-4xl text-slate-900 sm:text-5xl lg:text-6xl">{config.title}</h1>
              <p className="mt-3 font-ui text-sm leading-6 text-slate-700 sm:text-base">{config.subtitle}</p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-5 py-3 font-ui text-sm font-semibold text-slate-700 transition hover:border-slate-500 sm:self-start"
            >
              Back Home
            </Link>
          </div>
        </header>

        <section className="mx-auto mt-6 max-w-6xl border-y border-[#dcc8b4] bg-white/45 px-3 py-4 backdrop-blur-sm sm:px-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Stage</p>
              <p className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
                {stage === 'screening' ? 'Screening' : 'Questions'}
              </p>
            </div>
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Progress</p>
              <p className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">{progressPercent}%</p>
            </div>
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Answered</p>
              <p className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
                {stage === 'screening' ? screeningAnswered : answeredCount}
                <span className="ml-1 font-ui text-sm text-slate-500 sm:text-base">/ {stage === 'screening' ? profileQuestions.length : assessmentQuestions.length}</span>
              </p>
            </div>
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Current Score</p>
              <p className="mt-1 font-display text-2xl text-slate-900 sm:text-3xl">
                {score}
                <span className="ml-1 font-ui text-sm text-slate-500 sm:text-base">/ {maxScore}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-300/50">
            <div
              className="h-full bg-slate-900 transition-all"
              style={{ width: `${stage === 'screening' ? screeningProgressPercent : assessmentProgressPercent}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={stage === 'screening' ? continueToAssessment : jumpToNextQuestion}
              disabled={stage === 'screening' && !screeningComplete}
              className="rounded-full border border-slate-300 bg-white/90 px-4 py-2 font-ui text-sm font-semibold text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-white/60 disabled:text-slate-400"
            >
              {stage === 'screening' ? 'Continue to tailored questions' : 'Jump to next unanswered'}
            </button>
            <button
              type="button"
              onClick={resetAssessment}
              className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 font-ui text-sm font-semibold text-rose-700 transition hover:border-rose-400"
            >
              Reset assessment
            </button>
            <p className="self-center font-ui text-xs text-slate-500">Progress is auto-saved on this device.</p>
          </div>
        </section>

        {stage === 'screening' ? (
          <section className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-5">
              <div className="glass-panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-7">
                <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Step 1 of 2</p>
                <h2 className="mt-2 text-balance font-display text-2xl text-slate-900 sm:text-4xl">Quick screening</h2>
                <p className="mt-3 max-w-2xl font-ui text-sm leading-6 text-slate-700 sm:text-base">
                  Answer a few questions about who you are. The assessment will reshape itself around your routine, role,
                  and main pressure points.
                </p>
              </div>

              <div className="space-y-4">
                {profileQuestions.map((question, index) => {
                  const answer = profileAnswers[question.id]

                  return (
                    <motion.article
                      key={question.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: index * 0.03 }}
                      className="glass-panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-7"
                    >
                      <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Profile question {index + 1}</p>
                      <h3 className="mt-2 max-w-3xl text-balance font-ui text-lg font-semibold text-slate-900 sm:text-2xl">{question.label}</h3>
                      <p className="mt-1 max-w-3xl font-ui text-xs leading-5 text-slate-500 sm:text-sm">{question.hint}</p>

                      <div className="mt-4 flex flex-wrap gap-2 sm:gap-2.5">
                        {question.options.map((option) => {
                          const active = answer === option.value

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateProfileAnswer(question.id, option.value)}
                              className={`min-h-11 rounded-full border px-4 py-2 font-ui text-sm font-semibold transition ${
                                active
                                  ? 'border-slate-900 bg-slate-900 text-white'
                                  : 'border-[#d9c6b3] bg-white/80 text-slate-700 hover:border-slate-500'
                              }`}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6 lg:h-fit">
              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-sm lg:border-l-2 lg:border-y lg:border-r lg:border-l-slate-400/40 lg:bg-transparent lg:p-0 lg:pl-4 lg:shadow-none">
                <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Screening outcome</p>
                <p className="mt-3 font-ui text-sm leading-6 text-slate-700">
                  {screeningComplete
                    ? 'You are ready for a tailored set of questions.'
                    : 'Finish the profile questions to unlock the tailored assessment.'}
                </p>
                <div className="mt-4 space-y-2">
                  <span className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 font-ui text-xs font-semibold text-slate-700">
                    {segmentLabel}
                  </span>
                  <p className="font-ui text-sm leading-6 text-slate-600">{segmentSummary}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-sm lg:border-l-2 lg:border-y lg:border-r lg:border-l-slate-400/40 lg:bg-transparent lg:p-0 lg:pl-4 lg:shadow-none">
                <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Why this matters</p>
                <ul className="mt-3 space-y-2.5">
                  {config.tips.map((tip) => (
                    <li key={tip} className="font-ui text-sm text-slate-700">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </section>
        ) : (
          <section className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1fr_300px]">
            <div className="relative pl-6 sm:pl-10">
              <div className="pointer-events-none absolute left-2 top-0 h-full w-px bg-slate-400/35 sm:left-4" />
              <div className="space-y-9">
                <div className="glass-panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-7">
                  <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Step 2 of 2</p>
                  <h2 className="mt-2 text-balance font-display text-2xl text-slate-900 sm:text-4xl">Tailored questions</h2>
                  <p className="mt-3 max-w-2xl font-ui text-sm leading-6 text-slate-700 sm:text-base">
                    This set is tuned to your profile. The result gets sharper when the assessment matches how you actually
                    work or live.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-ui text-xs font-semibold text-slate-700">
                      {segmentLabel}
                    </span>
                    <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-ui text-xs font-semibold text-slate-700">
                      {segmentSummary}
                    </span>
                  </div>
                </div>

                {assessmentQuestions.map((question: AssessmentQuestion, index: number) => {
                  const answered = answers[question.id] !== undefined

                  return (
                    <motion.article
                      key={question.id}
                      id={`q-${question.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: index * 0.03 }}
                      className="relative glass-panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-7"
                    >
                      <span
                        className={`absolute -left-8 top-1 h-4 w-4 rounded-full border-2 sm:-left-11 ${
                          answered ? 'border-slate-900 bg-slate-900' : 'border-slate-500 bg-[#f6efe7]'
                        }`}
                      />

                      <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Question {index + 1}</p>
                      <h3 className="mt-2 max-w-3xl text-balance font-ui text-lg font-semibold text-slate-900 sm:text-2xl">{question.text}</h3>
                      <p className="mt-1 max-w-3xl font-ui text-xs leading-5 text-slate-500 sm:text-sm">{question.hint}</p>

                      <div className="mt-4 flex flex-wrap gap-2 sm:gap-2.5">
                        {scoreOptions.map((option) => {
                          const active = answers[question.id] === option.value

                          return (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => updateAnswer(question.id, option.value)}
                              className={`min-h-11 rounded-full border px-4 py-2 font-ui text-sm font-semibold transition ${
                                active
                                  ? 'border-slate-900 bg-slate-900 text-white'
                                  : 'border-[#d9c6b3] bg-white/80 text-slate-700 hover:border-slate-500'
                              }`}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6 lg:h-fit">
              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-sm lg:border-l-2 lg:border-y lg:border-r lg:border-l-slate-400/40 lg:bg-transparent lg:p-0 lg:pl-4 lg:shadow-none">
                <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Final Result</p>
                {completed ? (
                  <div className="mt-3 space-y-2">
                    <span className={`inline-flex rounded-full border px-3 py-1 font-ui text-xs font-semibold ${resultTone.badgeClass}`}>
                      {resultTone.title}
                    </span>
                    <p className={`font-ui text-sm ${resultTone.toneClass}`}>{resultTone.text}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => void copySummary()}
                        className="min-h-11 rounded-full border border-slate-300 bg-white px-3 py-2 font-ui text-xs font-semibold text-slate-700 transition hover:border-slate-500"
                      >
                        {copied ? 'Copied' : 'Copy summary'}
                      </button>
                      <button
                        type="button"
                        onClick={downloadSummary}
                        className="min-h-11 rounded-full border border-slate-300 bg-white px-3 py-2 font-ui text-xs font-semibold text-slate-700 transition hover:border-slate-500"
                      >
                        Download summary
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 font-ui text-sm leading-6 text-slate-600">Finish all questions to unlock your result.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-sm lg:border-l-2 lg:border-y lg:border-r lg:border-l-slate-400/40 lg:bg-transparent lg:p-0 lg:pl-4 lg:shadow-none">
                <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Improvement Tips</p>
                <ul className="mt-3 space-y-2.5">
                  {config.tips.map((tip) => (
                    <li key={tip} className="font-ui text-sm text-slate-700">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-sm lg:border-l-2 lg:border-y lg:border-r lg:border-l-slate-400/40 lg:bg-transparent lg:p-0 lg:pl-4 lg:shadow-none">
                <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Top Signals</p>
                {assessmentQuestions.some((question: AssessmentQuestion) => (answers[question.id] ?? 0) > 0) ? (
                  <ul className="mt-3 space-y-2.5">
                    {assessmentQuestions
                      .map((question: AssessmentQuestion) => ({
                        question,
                        value: answers[question.id] ?? 0,
                      }))
                      .filter((item: { question: AssessmentQuestion; value: number }) => item.value > 0)
                      .sort((a: { question: AssessmentQuestion; value: number }, b: { question: AssessmentQuestion; value: number }) => b.value - a.value)
                      .slice(0, 3)
                      .map((item: { question: AssessmentQuestion; value: number }) => (
                        <li key={item.question.id} className="font-ui text-sm text-slate-700">
                          {item.question.text}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-3 font-ui text-sm text-slate-600">Answer questions to unlock personalized signals.</p>
                )}
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  )
}

export default CheckPage