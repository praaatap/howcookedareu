import type { AssessmentQuestion, CheckConfig, SavedCheckState } from './checkTypes'

export function getActiveSegmentKey(config: CheckConfig, profileAnswers: Record<string, string>) {
  if (config.key === 'ai') {
    return profileAnswers.role ?? config.defaultSegment
  }

  if (config.key === 'lifestyle') {
    return profileAnswers.dayType ?? config.defaultSegment
  }

  return config.defaultSegment
}

export function getAssessmentQuestions(config: CheckConfig, profileAnswers: Record<string, string>): AssessmentQuestion[] {
  const segmentKey = getActiveSegmentKey(config, profileAnswers)
  const segment = config.segments[segmentKey] ?? config.segments[config.defaultSegment]

  return segment.questions
}

export function getSegmentLabel(config: CheckConfig, profileAnswers: Record<string, string>) {
  const segmentKey = getActiveSegmentKey(config, profileAnswers)
  return config.segments[segmentKey]?.label ?? config.segments[config.defaultSegment].label
}

export function getSegmentSummary(config: CheckConfig, profileAnswers: Record<string, string>) {
  const segmentKey = getActiveSegmentKey(config, profileAnswers)
  return config.segments[segmentKey]?.summary ?? config.segments[config.defaultSegment].summary
}

export function loadSavedState(storageKey: string): SavedCheckState {
  if (typeof window === 'undefined') {
    return { stage: 'screening', profileAnswers: {}, answers: {} }
  }

  const stored = window.localStorage.getItem(storageKey)
  if (!stored) {
    return { stage: 'screening', profileAnswers: {}, answers: {} }
  }

  try {
    const parsed = JSON.parse(stored) as Partial<SavedCheckState>

    return {
      stage: parsed.stage === 'assessment' ? 'assessment' : 'screening',
      profileAnswers: parsed.profileAnswers ?? {},
      answers: parsed.answers ?? {},
    }
  } catch {
    return { stage: 'screening', profileAnswers: {}, answers: {} }
  }
}

export function getNextQuestionId(questionIds: string[], answers: Record<string, number>) {
  return questionIds.find((questionId) => answers[questionId] === undefined)
}