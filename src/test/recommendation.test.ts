import { describe, it, expect } from 'vitest';
import { recommendNext } from '@/store/recommendation';
import type { ScheduleBlock } from '@/types';

const blocks: ScheduleBlock[] = [
  { id: 'critical-incomplete', title: 'A', durationMinutes: 30, priority: 'critical', outcome: '', route: '/a', topicKey: 'a' },
  { id: 'important-incomplete', title: 'B', durationMinutes: 30, priority: 'important', outcome: '', route: '/b', topicKey: 'b' },
  { id: 'optional-incomplete', title: 'C', durationMinutes: 30, priority: 'optional', outcome: '', route: '/c', topicKey: 'c' },
  { id: 'break', title: 'Break', durationMinutes: 10, priority: 'break', outcome: '', route: '/', topicKey: 'break' },
];

describe('recommendNext', () => {
  it('excludes breaks', () => {
    const result = recommendNext(blocks, { a: 3, b: 3, c: 3 }, {});
    expect(result).toHaveLength(3);
  });

  it('ranks critical above important above optional at equal confidence', () => {
    const result = recommendNext(blocks, { a: 3, b: 3, c: 3 }, {});
    expect(result[0].block.id).toBe('critical-incomplete');
    expect(result[1].block.id).toBe('important-incomplete');
    expect(result[2].block.id).toBe('optional-incomplete');
  });

  it('boosts low confidence', () => {
    const result = recommendNext(blocks, { a: 5, b: 1, c: 3 }, {});
    // important at confidence 1: 2 * 5 * 1.5 = 15
    // critical at confidence 5: 3 * 1 * 1.5 = 4.5
    expect(result[0].block.id).toBe('important-incomplete');
  });

  it('reduces weight for completed blocks', () => {
    const completed = { a: true, b: false, c: false };
    const result = recommendNext(blocks, { a: 3, b: 3, c: 3 }, completed);
    // completed critical: 3 * 3 * 0.5 = 4.5; incomplete important: 2 * 3 * 1.5 = 9
    expect(result[0].block.id).toBe('important-incomplete');
  });
});
