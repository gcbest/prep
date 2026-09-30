export type StarFieldKey = 'situation' | 'task' | 'actions' | 'result' | 'learning';

export const STAR_L_FIELDS: { key: StarFieldKey; label: string; hint: string }[] = [
  { key: 'situation', label: 'Situation', hint: 'Context: team, system, stakes, constraint.' },
  { key: 'task', label: 'Task & personal ownership', hint: 'What YOU owned — not "we" unless your role is explicit.' },
  { key: 'actions', label: 'Actions & alternatives considered', hint: 'What you did, what you considered, trade-offs.' },
  { key: 'result', label: 'Result with honest evidence', hint: 'Measurable or observable outcome, even a partial one.' },
  { key: 'learning', label: 'Learning & institutionalized improvement', hint: 'What changed afterward so it does not recur.' },
] as const;

export const STORY_QUALITY_CHECKS: string[] = [
  'Is personal ownership clear?',
  'Is the answer under two minutes?',
  'Is there a measurable or observable result?',
  'Does it explain trade-offs?',
  'Does it include communication?',
  'Does it include risk/control thinking?',
  'Does it avoid blaming others?',
  'Does it explain what changed afterward?',
];

export const LEADERSHIP_PROMPTS: { id: string; title: string; required: boolean }[] = [
  { id: 'production-incident', title: 'Production incident and root-cause prevention', required: true },
  { id: 'design-disagreement', title: 'Technical disagreement or design trade-off', required: true },
  { id: 'mentoring', title: 'Mentoring or raising engineering quality', required: true },
  { id: 'security-control', title: 'Security/control concern or stopping a risky release', required: true },
  { id: 'rapid-reprioritization', title: 'Rapid reprioritization', required: false },
  { id: 'legacy-modernization', title: 'Legacy modernization', required: false },
  { id: 'ambiguous-requirements', title: 'Ambiguous business requirements', required: false },
  { id: 'cross-team-delivery', title: 'Cross-team delivery', required: false },
  { id: 'failure-learning', title: 'Personal failure and learning', required: false },
];
