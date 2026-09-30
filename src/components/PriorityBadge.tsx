import type { Priority } from '@/types';
import { priorityColor } from '@/lib/utils';

export function PriorityBadge({ priority }: { priority: Priority | 'break' }) {
  return (
    <span className={`badge ${priorityColor(priority)}`}>
      {priority === 'critical' ? 'Critical' : priority === 'important' ? 'Important' : priority === 'break' ? 'Break' : 'Optional'}
    </span>
  );
}
