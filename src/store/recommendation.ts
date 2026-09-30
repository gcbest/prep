import type { ScheduleBlock } from '@/types';

const PRIORITY_WEIGHT: Record<string, number> = {
  critical: 3,
  important: 2,
  optional: 1,
  break: 0,
};

const COMPLETED_WEIGHT = 0.5;
const INCOMPLETE_WEIGHT = 1.5;

export interface Recommendation {
  block: ScheduleBlock;
  score: number;
}

/**
 * Deterministic "priority recommendation". This is not AI — it is a weighted
 * formula over priority, confidence, and completion, as specified in the plan.
 *
 * score = priorityWeight × (6 - confidence) × incompleteWeight
 */
export function recommendNext(
  schedule: ScheduleBlock[],
  confidence: Record<string, number>,
  completed: Record<string, boolean>,
): Recommendation[] {
  return schedule
    .filter((block) => block.priority !== 'break')
    .map((block) => {
      const priorityWeight = PRIORITY_WEIGHT[block.priority] ?? 1;
      const conf = clamp(confidence[block.topicKey] ?? 3, 1, 5);
      const isComplete = completed[block.topicKey] ?? false;
      const incompleteWeight = isComplete ? COMPLETED_WEIGHT : INCOMPLETE_WEIGHT;
      const score = priorityWeight * (6 - conf) * incompleteWeight;
      return { block, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return schedule.indexOf(a.block) - schedule.indexOf(b.block);
    });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
