export const BUCKETS = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'someday', label: 'Someday' },
];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function bucketOf(task, now = new Date()) {
  if (!task.dueAt) return 'someday';
  const due = startOfDay(task.dueAt);
  const today = startOfDay(now);
  const tomorrow = startOfDay(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (due <= today) return 'today';
  if (due.getTime() === tomorrow.getTime()) return 'tomorrow';
  return 'upcoming';
}

export function groupByBucket(tasks, now = new Date()) {
  const groups = { today: [], tomorrow: [], upcoming: [], someday: [] };
  for (const t of tasks) groups[bucketOf(t, now)].push(t);
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const ao = a.order ?? 0, bo = b.order ?? 0;
      if (ao !== bo) return ao - bo;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }
  return groups;
}

export function formatDue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const today = startOfDay(now);
  const due = startOfDay(d);
  const dayDiff = Math.round((due - today) / 86400000);

  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
  const time = hasTime
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  let day;
  if (dayDiff === 0) day = 'Today';
  else if (dayDiff === 1) day = 'Tomorrow';
  else if (dayDiff === -1) day = 'Yesterday';
  else if (dayDiff < 0) day = `${-dayDiff}d ago`;
  else if (dayDiff < 7) day = d.toLocaleDateString([], { weekday: 'short' });
  else day = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return time ? `${day} · ${time}` : day;
}
