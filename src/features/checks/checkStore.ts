import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CheckKey, SavedCheckState } from './checkTypes'

type CheckStoreState = {
  checks: Record<CheckKey, SavedCheckState>
  setStage: (checkKey: CheckKey, stage: SavedCheckState['stage']) => void
  setProfileAnswer: (checkKey: CheckKey, questionId: string, value: string) => void
  setAnswer: (checkKey: CheckKey, questionId: string, value: number) => void
  resetCheck: (checkKey: CheckKey) => void
}

function createEmptyCheckState(): SavedCheckState {
  return {
    stage: 'screening',
    profileAnswers: {},
    answers: {},
  }
}

function createInitialChecks() {
  return {
    ai: createEmptyCheckState(),
    lifestyle: createEmptyCheckState(),
  } satisfies Record<CheckKey, SavedCheckState>
}

export const useCheckStore = create<CheckStoreState>()(
  persist(
    (set) => ({
      checks: createInitialChecks(),
      setStage: (checkKey, stage) =>
        set((state) => ({
          checks: {
            ...state.checks,
            [checkKey]: {
              ...state.checks[checkKey],
              stage,
            },
          },
        })),
      setProfileAnswer: (checkKey, questionId, value) =>
        set((state) => ({
          checks: {
            ...state.checks,
            [checkKey]: {
              ...state.checks[checkKey],
              profileAnswers: {
                ...state.checks[checkKey].profileAnswers,
                [questionId]: value,
              },
            },
          },
        })),
      setAnswer: (checkKey, questionId, value) =>
        set((state) => ({
          checks: {
            ...state.checks,
            [checkKey]: {
              ...state.checks[checkKey],
              answers: {
                ...state.checks[checkKey].answers,
                [questionId]: value,
              },
            },
          },
        })),
      resetCheck: (checkKey) =>
        set((state) => ({
          checks: {
            ...state.checks,
            [checkKey]: createEmptyCheckState(),
          },
        })),
    }),
    {
      name: 'how-cooked-question-bank-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ checks: state.checks }),
    },
  ),
)