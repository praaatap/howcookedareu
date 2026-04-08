import type { CheckConfig, ScoreOption } from './checkTypes'

const frequencyOptions: ScoreOption[] = [
  { label: 'Never', value: 0 },
  { label: 'Sometimes', value: 1 },
  { label: 'Often', value: 2 },
  { label: 'Always', value: 3 },
]

export const checkConfigs: Record<'ai' | 'lifestyle', CheckConfig> = {
  ai: {
    key: 'ai',
    title: 'AI Cooked Check',
    subtitle: 'Screen your habits first, then take a sharper assessment tuned to how you actually use AI.',
    accentClass: 'from-emerald-100 via-cyan-50 to-[#f3ede4]',
    introLabel: 'AI habit screening',
    profileQuestions: [
      {
        id: 'role',
        label: 'What best describes you right now?',
        hint: 'This helps tune the wording and examples in the assessment.',
        options: [
          { label: 'Student', value: 'student' },
          { label: 'Professional', value: 'professional' },
          { label: 'Creator', value: 'creator' },
          { label: 'Founder / Builder', value: 'builder' },
          { label: 'Other', value: 'general' },
        ],
      },
      {
        id: 'usage',
        label: 'How often do you use AI in a normal week?',
        hint: 'This sets the starting intensity for the check.',
        options: [
          { label: 'Rarely', value: 'rare' },
          { label: 'A few times', value: 'some' },
          { label: 'Daily', value: 'daily' },
          { label: 'Constantly', value: 'constant' },
        ],
      },
      {
        id: 'goal',
        label: 'What do you use AI for most?',
        hint: 'The core question set changes depending on the main use case.',
        options: [
          { label: 'Writing', value: 'writing' },
          { label: 'Coding', value: 'coding' },
          { label: 'Research', value: 'research' },
          { label: 'Planning', value: 'planning' },
          { label: 'Decisions', value: 'decisions' },
        ],
      },
      {
        id: 'pressure',
        label: 'When do you reach for AI most?',
        hint: 'This separates convenience use from dependency.',
        options: [
          { label: 'Before I start', value: 'before' },
          { label: 'When I get stuck', value: 'stuck' },
          { label: 'For polish', value: 'polish' },
          { label: 'For almost everything', value: 'everything' },
        ],
      },
    ],
    defaultSegment: 'general',
    segments: {
      student: {
        label: 'Student mode',
        summary: 'The questions lean toward assignments, studying, and learning shortcuts.',
        questions: [
          { id: 'ai-student-1', text: 'I use AI to turn rough notes into finished assignments.', hint: 'Shows how often AI replaces your own drafting.', options: frequencyOptions },
          { id: 'ai-student-2', text: 'I ask AI to explain topics before I try to understand them myself.', hint: 'Checks whether AI is the first teacher.', options: frequencyOptions },
          { id: 'ai-student-3', text: 'I use AI to outline essays or reports before writing my own ideas.', hint: 'Captures dependency in early thinking.', options: frequencyOptions },
          { id: 'ai-student-4', text: 'I use AI to save time more often than to improve understanding.', hint: 'Measures speed-first habits.', options: frequencyOptions },
          { id: 'ai-student-5', text: 'I stop studying once AI gives me a simple answer.', hint: 'Shows whether learning depth gets skipped.', options: frequencyOptions },
          { id: 'ai-student-6', text: 'I trust AI summaries instead of reading the original material.', hint: 'Checks how much source depth is being lost.', options: frequencyOptions },
        ],
      },
      professional: {
        label: 'Professional mode',
        summary: 'The questions focus on work output, communication, and judgment calls.',
        questions: [
          { id: 'ai-pro-1', text: 'I use AI to draft emails or messages that should still sound like me.', hint: 'Checks voice ownership in communication.', options: frequencyOptions },
          { id: 'ai-pro-2', text: 'I use AI to write documents before I know my own point of view.', hint: 'Measures whether AI leads the thinking.', options: frequencyOptions },
          { id: 'ai-pro-3', text: 'I copy AI wording into work without verifying the logic or facts.', hint: 'Shows passive trust habits.', options: frequencyOptions },
          { id: 'ai-pro-4', text: 'I ask AI to solve problems I could still reason through myself.', hint: 'Separates convenience from capability.', options: frequencyOptions },
          { id: 'ai-pro-5', text: 'I rely on AI to sound confident even when I am unsure.', hint: 'Captures delegation of judgment.', options: frequencyOptions },
          { id: 'ai-pro-6', text: 'I use AI to move faster instead of to think more clearly.', hint: 'Measures output pressure over understanding.', options: frequencyOptions },
        ],
      },
      creator: {
        label: 'Creator mode',
        summary: 'The questions lean toward taste, originality, and creative ownership.',
        questions: [
          { id: 'ai-creator-1', text: 'I let AI shape the tone of my content before I have my own angle.', hint: 'Checks whether creative direction is outsourced.', options: frequencyOptions },
          { id: 'ai-creator-2', text: 'I use AI to fill creative gaps instead of iterating on my own idea.', hint: 'Measures creative muscle usage.', options: frequencyOptions },
          { id: 'ai-creator-3', text: 'I trust AI to give me the first interesting idea too quickly.', hint: 'Captures shortcut brainstorming habits.', options: frequencyOptions },
          { id: 'ai-creator-4', text: 'I edit AI output more than I create my own rough drafts.', hint: 'Shows whether the creative center is shifting.', options: frequencyOptions },
          { id: 'ai-creator-5', text: 'I use AI to avoid sitting with uncomfortable blank-page time.', hint: 'Highlights tolerance for creative friction.', options: frequencyOptions },
          { id: 'ai-creator-6', text: 'I still know how I would make the thing without AI.', hint: 'Checks retained originality.', options: frequencyOptions },
        ],
      },
      builder: {
        label: 'Builder mode',
        summary: 'The questions focus on product judgment, code, and decision quality.',
        questions: [
          { id: 'ai-builder-1', text: 'I use AI to make product or technical decisions before I define the problem.', hint: 'Checks whether framing gets skipped.', options: frequencyOptions },
          { id: 'ai-builder-2', text: 'I ask AI to write code or plans I do not fully understand yet.', hint: 'Captures over-reliance in execution.', options: frequencyOptions },
          { id: 'ai-builder-3', text: 'I trust AI output without checking assumptions against the real system.', hint: 'Measures validation habits.', options: frequencyOptions },
          { id: 'ai-builder-4', text: 'I use AI to avoid thinking through tradeoffs.', hint: 'Looks at whether decision making is being outsourced.', options: frequencyOptions },
          { id: 'ai-builder-5', text: 'I rely on AI to move from zero to something, then stop there.', hint: 'Shows shallow follow-through.', options: frequencyOptions },
          { id: 'ai-builder-6', text: 'I can still explain the thing in my own words after AI helps.', hint: 'Checks retained understanding.', options: frequencyOptions },
        ],
      },
      general: {
        label: 'General mode',
        summary: 'The questions stay broad and measure overall dependency and thinking depth.',
        questions: [
          { id: 'ai-gen-1', text: 'I open AI before trying a rough answer myself.', hint: 'Measures first-instinct dependency.', options: frequencyOptions },
          { id: 'ai-gen-2', text: 'I ask AI for help when I could still work through the problem.', hint: 'Checks overuse for simple tasks.', options: frequencyOptions },
          { id: 'ai-gen-3', text: 'I trust AI output without checking the logic or facts.', hint: 'Captures passive trust.', options: frequencyOptions },
          { id: 'ai-gen-4', text: 'I rely on AI summaries instead of reading the source.', hint: 'Measures depth of comprehension.', options: frequencyOptions },
          { id: 'ai-gen-5', text: 'I feel slower or stuck when AI is unavailable.', hint: 'Shows resilience when tools are missing.', options: frequencyOptions },
          { id: 'ai-gen-6', text: 'I use AI to finish work I still know how to do manually.', hint: 'Separates convenience from capability.', options: frequencyOptions },
        ],
      },
    },
    tips: [
      'Keep one daily task AI-free so your own reasoning stays warm.',
      'Draft your answer first, then use AI to challenge or refine it.',
      'Re-read source material before trusting a summary or suggestion.',
    ],
  },
  lifestyle: {
    key: 'lifestyle',
    title: 'Lifestyle Cooked Check',
    subtitle: 'Start with a quick screening of your routine, then answer a more precise set of questions about how you actually live.',
    accentClass: 'from-orange-100 via-amber-50 to-[#f3ede4]',
    introLabel: 'Lifestyle screening',
    profileQuestions: [
      {
        id: 'dayType',
        label: 'What kind of day do you usually live?',
        hint: 'This helps tune the wording of the questions that follow.',
        options: [
          { label: 'Desk-heavy', value: 'desk' },
          { label: 'Shift-based', value: 'shift' },
          { label: 'Student schedule', value: 'student' },
          { label: 'Parent / carer', value: 'parent' },
          { label: 'Mixed / irregular', value: 'general' },
        ],
      },
      {
        id: 'biggestLeak',
        label: 'What is your biggest routine leak?',
        hint: 'This helps highlight the habits that matter most.',
        options: [
          { label: 'Sleep', value: 'sleep' },
          { label: 'Movement', value: 'movement' },
          { label: 'Food', value: 'food' },
          { label: 'Stress', value: 'stress' },
          { label: 'Screens', value: 'screens' },
        ],
      },
      {
        id: 'crashTime',
        label: 'When do you usually crash?',
        hint: 'This lets the result focus on the part of the day that hurts most.',
        options: [
          { label: 'Morning', value: 'morning' },
          { label: 'Afternoon', value: 'afternoon' },
          { label: 'Evening', value: 'evening' },
          { label: 'Late night', value: 'night' },
        ],
      },
      {
        id: 'consistency',
        label: 'How consistent is your routine?',
        hint: 'This separates a busy life from a broken routine.',
        options: [
          { label: 'Stable', value: 'stable' },
          { label: 'Mostly stable', value: 'mostly-stable' },
          { label: 'Unpredictable', value: 'unpredictable' },
          { label: 'All over the place', value: 'chaotic' },
        ],
      },
    ],
    defaultSegment: 'general',
    segments: {
      desk: {
        label: 'Desk-heavy routine',
        summary: 'The questions focus on sitting time, posture, breaks, and screen fatigue.',
        questions: [
          { id: 'life-desk-1', text: 'I sit for long stretches without movement breaks.', hint: 'Captures inactivity spikes.', options: frequencyOptions },
          { id: 'life-desk-2', text: 'My day starts and ends with screens.', hint: 'Checks screen bleed around sleep.', options: frequencyOptions },
          { id: 'life-desk-3', text: 'I feel physically stiff or flat by the afternoon.', hint: 'Signals energy drain from low movement.', options: frequencyOptions },
          { id: 'life-desk-4', text: 'I skip proper meals when work gets busy.', hint: 'Looks at fuel consistency.', options: frequencyOptions },
          { id: 'life-desk-5', text: 'I need caffeine just to stay functional.', hint: 'Measures unstable energy support.', options: frequencyOptions },
          { id: 'life-desk-6', text: 'I rarely step away long enough to reset my focus.', hint: 'Tracks attention recovery habits.', options: frequencyOptions },
        ],
      },
      shift: {
        label: 'Shift-based routine',
        summary: 'The questions focus on sleep drift, meal timing, and recovery windows.',
        questions: [
          { id: 'life-shift-1', text: 'My sleep timing changes so much that I never fully settle in.', hint: 'Checks circadian instability.', options: frequencyOptions },
          { id: 'life-shift-2', text: 'I eat at whatever time I can, not when my body actually needs it.', hint: 'Measures rhythm disruption.', options: frequencyOptions },
          { id: 'life-shift-3', text: 'Recovery time gets squeezed out by the next obligation.', hint: 'Captures load without reset.', options: frequencyOptions },
          { id: 'life-shift-4', text: 'I wake up tired even after enough total hours in bed.', hint: 'Signals poor sleep quality.', options: frequencyOptions },
          { id: 'life-shift-5', text: 'I rely on stimulants to stay level during the day.', hint: 'Shows compensation habits.', options: frequencyOptions },
          { id: 'life-shift-6', text: 'My body clock feels out of sync most weeks.', hint: 'Looks at rhythm friction.', options: frequencyOptions },
        ],
      },
      student: {
        label: 'Student routine',
        summary: 'The questions focus on sleep, study blocks, device habits, and burnout risk.',
        questions: [
          { id: 'life-student-1', text: 'My first and last hour of the day are mostly screen time.', hint: 'Checks bookending screen exposure.', options: frequencyOptions },
          { id: 'life-student-2', text: 'I stay up late and then pay for it the next day.', hint: 'Captures sleep debt loops.', options: frequencyOptions },
          { id: 'life-student-3', text: 'I study for long periods without a real reset.', hint: 'Measures overload habits.', options: frequencyOptions },
          { id: 'life-student-4', text: 'I skip movement because I feel too busy or behind.', hint: 'Connects stress to physical neglect.', options: frequencyOptions },
          { id: 'life-student-5', text: 'I feel mentally drained before the day is over.', hint: 'Strong burnout indicator.', options: frequencyOptions },
          { id: 'life-student-6', text: 'I bounce between productivity bursts and crash mode.', hint: 'Shows unstable pacing.', options: frequencyOptions },
        ],
      },
      parent: {
        label: 'Parent / carer routine',
        summary: 'The questions focus on interrupted rest, self-care, and energy recovery.',
        questions: [
          { id: 'life-parent-1', text: 'My rest gets interrupted so often that I never fully recharge.', hint: 'Captures fragmented recovery.', options: frequencyOptions },
          { id: 'life-parent-2', text: 'I put my own meals or hydration off to the side.', hint: 'Checks whether fuel is consistently missed.', options: frequencyOptions },
          { id: 'life-parent-3', text: 'I feel guilty when I try to take quiet time for myself.', hint: 'Measures the cost of recovery avoidance.', options: frequencyOptions },
          { id: 'life-parent-4', text: 'I rely on momentum more than a real routine.', hint: 'Shows how fragile the day structure is.', options: frequencyOptions },
          { id: 'life-parent-5', text: 'By evening, I am too drained to do the basics well.', hint: 'Signals accumulated depletion.', options: frequencyOptions },
          { id: 'life-parent-6', text: 'I struggle to get consistent exercise or movement.', hint: 'Looks at the missing recovery loop.', options: frequencyOptions },
        ],
      },
      general: {
        label: 'General routine',
        summary: 'The questions stay broad and measure the main forces dragging on your energy.',
        questions: [
          { id: 'life-gen-1', text: 'I sleep less than 7 hours on most nights.', hint: 'Directly affects recovery.', options: frequencyOptions },
          { id: 'life-gen-2', text: 'I spend long stretches sitting without movement.', hint: 'Relates to energy crashes and focus loss.', options: frequencyOptions },
          { id: 'life-gen-3', text: 'My meals are inconsistent or rushed.', hint: 'Nutrition patterns affect performance.', options: frequencyOptions },
          { id: 'life-gen-4', text: 'I feel mentally drained even on a normal day.', hint: 'Strong fatigue signal.', options: frequencyOptions },
          { id: 'life-gen-5', text: 'I struggle to unplug without checking my phone or apps.', hint: 'Signals constant alert-state habits.', options: frequencyOptions },
          { id: 'life-gen-6', text: 'I postpone healthy routines even when I know they help.', hint: 'Tracks consistency and self-management.', options: frequencyOptions },
        ],
      },
    },
    tips: [
      'Protect sleep timing first. Consistency beats occasional long sleep.',
      'Add short movement breaks every 60 to 90 minutes of screen work.',
      'Keep one no-notification block daily so your nervous system can reset.',
    ],
  },
}