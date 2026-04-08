export type CheckKey = 'ai' | 'lifestyle'

export type ScoreOption = {
  label: string
  value: number
}

export type ChoiceOption = {
  label: string
  value: string
}

export type ProfileQuestion = {
  id: string
  label: string
  hint: string
  options: ChoiceOption[]
}

export type AssessmentQuestion = {
  id: string
  text: string
  hint: string
  options: ScoreOption[]
}

export type SegmentConfig = {
  label: string
  summary: string
  questions: AssessmentQuestion[]
}

export type CheckConfig = {
  key: CheckKey
  title: string
  subtitle: string
  accentClass: string
  introLabel: string
  profileQuestions: ProfileQuestion[]
  segments: Record<string, SegmentConfig>
  defaultSegment: string
  tips: string[]
}

export type SavedCheckState = {
  stage: 'screening' | 'assessment'
  profileAnswers: Record<string, string>
  answers: Record<string, number>
}