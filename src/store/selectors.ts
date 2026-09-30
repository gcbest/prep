import type { InterviewQuestion, QuestionResult } from '@/types';
import { QUESTION_BANK } from '@/data/questions';

export interface ReviewQueueItem {
  question: InterviewQuestion;
  result: QuestionResult;
}

export function reviewQueue(questionResults: Record<string, QuestionResult>): ReviewQueueItem[] {
  const items: ReviewQueueItem[] = [];
  for (const [id, result] of Object.entries(questionResults)) {
    if (result.status === 'missed' || result.status === 'partial') {
      const question = QUESTION_BANK.find((q) => q.id === id);
      if (question) items.push({ question, result });
    }
  }
  return items.sort((a, b) => (a.result.confidence - b.result.confidence) || (a.question.estimatedMinutes - b.question.estimatedMinutes));
}

export function missedCount(questionResults: Record<string, QuestionResult>): number {
  return Object.values(questionResults).filter((r) => r.status === 'missed').length;
}

export function lowConfidenceTopics(
  confidence: Record<string, number>,
  labels: Record<string, string>,
): { key: string; label: string; value: number }[] {
  return Object.entries(confidence)
    .filter(([, v]) => v <= 2)
    .map(([key, value]) => ({ key, label: labels[key] ?? key, value }))
    .sort((a, b) => a.value - b.value);
}

export function lowestConfidenceQuestions(
  questionResults: Record<string, QuestionResult>,
  limit = 5,
): { question: InterviewQuestion; result?: QuestionResult }[] {
  const answered = QUESTION_BANK.filter((q) => questionResults[q.id])
    .sort((a, b) => (questionResults[a.id].confidence - questionResults[b.id].confidence));
  const unanswered = QUESTION_BANK.filter((q) => !questionResults[q.id]);
  const combined = [
    ...answered.map((question) => ({ question, result: questionResults[question.id] })),
    ...unanswered.map((question) => ({ question, result: undefined })),
  ];
  return combined.slice(0, limit);
}
