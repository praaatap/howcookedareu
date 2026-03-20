import { Link, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/Landipage'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Option = {
  label: string
  score: number
}

type Question = {
  id: string
  text: string
  hint: string
  options: Option[]
}

type CheckConfig = {
  key: 'ai' | 'lifestyle'
  title: string
  subtitle: string
  accentClass: string
  tips: string[]
  questions: Question[]
}

const frequencyOptions: Option[] = [
  { label: 'Rarely', score: 0 },
  { label: 'Sometimes', score: 1 },
  { label: 'Often', score: 2 },
  { label: 'Always', score: 3 },
]

const checks: Record<'ai' | 'lifestyle', CheckConfig> = {
  ai: {
    key: 'ai',
    title: 'AI Cooked Check',
    subtitle: 'Measure how dependent your brain is on AI shortcuts and autopilot answers.',
    accentClass: 'from-emerald-100 via-cyan-50 to-transparent',
    tips: [
      'Try manual first-draft thinking for 15 minutes before asking AI.',
      'Rewrite AI output in your own structure, not just your own words.',
      'Keep one daily task AI-free to preserve your problem-solving stamina.',
    ],
    questions: [
      {
        id: 'ai-1',
        text: 'I ask AI before I try solving something by myself.',
        hint: 'Measures first-instinct dependency.',
        options: frequencyOptions,
      },
      {
        id: 'ai-2',
        text: 'I copy AI responses with minimal editing.',
        hint: 'Checks passive consumption vs active thinking.',
        options: frequencyOptions,
      },
      {
        id: 'ai-3',
        text: 'Without AI, I feel slower or stuck quickly.',
        hint: 'Shows resilience when tools are unavailable.',
        options: frequencyOptions,
      },
      {
        id: 'ai-4',
        text: 'I skip understanding the answer as long as it works.',
        hint: 'Captures shallow learning behavior.',
        options: frequencyOptions,
      },
      {
        id: 'ai-5',
        text: 'My writing/thinking quality drops when AI is unavailable.',
        hint: 'Detects skill atrophy signals.',
        options: frequencyOptions,
      },
      {
        id: 'ai-6',
        text: 'I use AI for tasks I could do manually in under 10 minutes.',
        hint: 'Checks convenience over capability.',
        options: frequencyOptions,
      },
      {
        id: 'ai-7',
        text: 'I rely on AI summaries instead of reading full material.',
        hint: 'Measures depth of comprehension habits.',
        options: frequencyOptions,
      },
      {
        id: 'ai-8',
        text: 'I use AI to generate ideas before trying to brainstorm myself.',
        hint: 'Assesses creative muscle usage.',
        options: frequencyOptions,
      },
      {
        id: 'ai-9',
        text: 'I trust AI answers without verifying facts or logic.',
        hint: 'Tests critical validation behavior.',
        options: frequencyOptions,
      },
      {
        id: 'ai-10',
        text: 'I ask AI for decisions I should make with personal judgment.',
        hint: 'Checks over-outsourcing of judgment.',
        options: frequencyOptions,
      },
      {
        id: 'ai-11',
        text: 'I feel anxious when I cannot access AI tools.',
        hint: 'Tracks emotional dependency signals.',
        options: frequencyOptions,
      },
      {
        id: 'ai-12',
        text: 'I learn less because AI gives final answers too fast.',
        hint: 'Measures long-term learning impact.',
        options: frequencyOptions,
      },
    ],
  },
  lifestyle: {
    key: 'lifestyle',
    title: 'Lifestyle Cooked Check',
    subtitle: 'Check if your routine is quietly draining your energy and focus quality.',
    accentClass: 'from-orange-100 via-amber-50 to-transparent',
    tips: [
      'Protect sleep timing first. Consistency beats occasional long sleep.',
      'Add short movement breaks every 60 to 90 minutes of screen work.',
      'Set one no-notification block daily to recover cognitive bandwidth.',
    ],
    questions: [
      {
        id: 'life-1',
        text: 'I sleep less than 7 hours most nights.',
        hint: 'Directly affects memory and focus quality.',
        options: frequencyOptions,
      },
      {
        id: 'life-2',
        text: 'I spend long stretches sitting without movement breaks.',
        hint: 'Related to energy crashes and poor concentration.',
        options: frequencyOptions,
      },
      {
        id: 'life-3',
        text: 'My first and last hour of the day is mostly screen time.',
        hint: 'Impacts sleep cycle and stress baseline.',
        options: frequencyOptions,
      },
      {
        id: 'life-4',
        text: 'I skip balanced meals and rely on quick processed snacks.',
        hint: 'Nutrition patterns affect cognitive performance.',
        options: frequencyOptions,
      },
      {
        id: 'life-5',
        text: 'I feel mentally drained even after a normal day.',
        hint: 'Strong burnout indicator.',
        options: frequencyOptions,
      },
      {
        id: 'life-6',
        text: 'I struggle to unplug and rest without notifications.',
        hint: 'Signals constant alert-state habits.',
        options: frequencyOptions,
      },
      {
        id: 'life-7',
        text: 'I skip exercise for most of the week.',
        hint: 'Movement is linked with mood and executive function.',
        options: frequencyOptions,
      },
      {
        id: 'life-8',
        text: 'I wake up tired even after enough time in bed.',
        hint: 'Suggests low sleep quality or routine mismatch.',
        options: frequencyOptions,
      },
      {
        id: 'life-9',
        text: 'I multitask constantly and rarely do deep work.',
        hint: 'Measures attention fragmentation.',
        options: frequencyOptions,
      },
      {
        id: 'life-10',
        text: 'I use caffeine/sugar to push through most afternoons.',
        hint: 'Indicates unstable energy regulation.',
        options: frequencyOptions,
      },
      {
        id: 'life-11',
        text: 'I do not have daily quiet time without devices.',
        hint: 'Restorative downtime is needed for recovery.',
        options: frequencyOptions,
      },
      {
        id: 'life-12',
        text: 'I postpone healthy routines even when I know they help.',
        hint: 'Tracks consistency and self-management patterns.',
        options: frequencyOptions,
      },
    ],
  },
}

function scoreLabel(score: number, maxScore: number) {
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

function CheckPage({ config }: { config: CheckConfig }) {
  const storageKey = `how-cooked-${config.key}-answers-v1`
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return {}

    try {
      return JSON.parse(stored) as Record<string, number>
    } catch {
      return {}
    }
  })
  const [copied, setCopied] = useState(false)

  const maxScore = config.questions.length * 3
  const score = useMemo(() => Object.values(answers).reduce((acc, value) => acc + value, 0), [answers])
  const answeredCount = Object.keys(answers).length
  const remainingCount = config.questions.length - answeredCount
  const completed = config.questions.length === answeredCount
  const result = scoreLabel(score, maxScore)
  const progressPercent = Math.round((answeredCount / config.questions.length) * 100)
  const nextUnansweredId = useMemo(
    () => config.questions.find((question) => answers[question.id] === undefined)?.id,
    [answers, config.questions],
  )
  const topSignals = useMemo(
    () =>
      config.questions
        .map((question) => ({
          question,
          value: answers[question.id] ?? 0,
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 3),
    [answers, config.questions],
  )

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(answers))
  }, [answers, storageKey])

  function resetAssessment() {
    setAnswers({})
    localStorage.removeItem(storageKey)
  }

  function jumpToNextQuestion() {
    if (!nextUnansweredId) return
    const element = document.getElementById(`q-${nextUnansweredId}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function buildSummaryText() {
    const headline = `How Cooked Are You - ${config.title}`
    const lines = [
      headline,
      `Score: ${score}/${maxScore} (${progressPercent}%)`,
      `Result: ${result.title}`,
      `Notes: ${result.text}`,
      '',
      'Top signals:',
      ...topSignals.map((item, index) => `${index + 1}. ${item.question.text}`),
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
    setTimeout(() => setCopied(false), 1500)
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7]">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.accentClass} opacity-80`} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative px-4 pb-16 pt-6 sm:px-8 sm:pt-10">
        <header className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-slate-600">Assessment</p>
              <h1 className="mt-2 font-display text-4xl text-slate-900 sm:text-6xl">{config.title}</h1>
              <p className="mt-3 max-w-3xl font-ui text-sm text-slate-700 sm:text-base">{config.subtitle}</p>
            </div>
            <Link
              to="/"
              className="rounded-full border border-slate-300 bg-white/80 px-5 py-2.5 font-ui text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              Back Home
            </Link>
          </div>
        </header>

        <section className="mx-auto mt-6 max-w-6xl border-y border-[#dcc8b4] bg-white/45 px-2 py-4 backdrop-blur-sm sm:px-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Progress</p>
              <p className="mt-1 font-display text-3xl text-slate-900">{progressPercent}%</p>
            </div>
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Answered</p>
              <p className="mt-1 font-display text-3xl text-slate-900">
                {answeredCount}
                <span className="ml-1 font-ui text-base text-slate-500">/ {config.questions.length}</span>
              </p>
            </div>
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Remaining</p>
              <p className="mt-1 font-display text-3xl text-slate-900">{remainingCount}</p>
            </div>
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Current Score</p>
              <p className="mt-1 font-display text-3xl text-slate-900">
                {score}
                <span className="ml-1 font-ui text-base text-slate-500">/ {maxScore}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-300/50">
            <div className="h-full bg-slate-900 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={jumpToNextQuestion}
              className="rounded-full border border-slate-300 bg-white/90 px-4 py-2 font-ui text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              Jump to next unanswered
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

        <section className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1fr_300px]">
          <div className="relative pl-7 sm:pl-10">
            <div className="pointer-events-none absolute left-2 top-0 h-full w-px bg-slate-400/35 sm:left-4" />
            <div className="space-y-9">
              {config.questions.map((question, index) => {
                const answered = answers[question.id] !== undefined

                return (
                  <motion.article
                    key={question.id}
                    id={`q-${question.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.03 }}
                    className="relative"
                  >
                    <span
                      className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 sm:-left-[43px] ${
                        answered ? 'border-slate-900 bg-slate-900' : 'border-slate-500 bg-[#f6efe7]'
                      }`}
                    />

                    <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate-500">Question {index + 1}</p>
                    <h2 className="mt-2 max-w-3xl font-ui text-lg font-semibold text-slate-900 sm:text-2xl">{question.text}</h2>
                    <p className="mt-1 max-w-3xl font-ui text-xs text-slate-500 sm:text-sm">{question.hint}</p>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {question.options.map((option) => {
                        const active = answers[question.id] === option.score

                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.score }))}
                            className={`rounded-full border px-4 py-2 font-ui text-sm font-semibold transition ${
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
            <div className="border-l-2 border-slate-400/40 pl-4">
              <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Final Result</p>
              {completed ? (
                <div className="mt-3 space-y-2">
                  <span className={`inline-flex rounded-full border px-3 py-1 font-ui text-xs font-semibold ${result.badgeClass}`}>
                    {result.title}
                  </span>
                  <p className={`font-ui text-sm ${result.toneClass}`}>{result.text}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => void copySummary()}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 font-ui text-xs font-semibold text-slate-700 transition hover:border-slate-500"
                    >
                      {copied ? 'Copied' : 'Copy summary'}
                    </button>
                    <button
                      type="button"
                      onClick={downloadSummary}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 font-ui text-xs font-semibold text-slate-700 transition hover:border-slate-500"
                    >
                      Download summary
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 font-ui text-sm text-slate-600">Finish all questions to unlock your result.</p>
              )}
            </div>

            <div className="border-l-2 border-slate-400/40 pl-4">
              <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Improvement Tips</p>
              <ul className="mt-3 space-y-2.5">
                {config.tips.map((tip) => (
                  <li key={tip} className="font-ui text-sm text-slate-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-2 border-slate-400/40 pl-4">
              <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate-500">Top Signals</p>
              {topSignals.length > 0 ? (
                <ul className="mt-3 space-y-2.5">
                  {topSignals.map((item) => (
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
      </div>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/check/ai" element={<CheckPage config={checks.ai} />} />
      <Route path="/check/lifestyle" element={<CheckPage config={checks.lifestyle} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
