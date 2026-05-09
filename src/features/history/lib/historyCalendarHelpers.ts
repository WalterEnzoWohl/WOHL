import type { SessionHistory } from '@/shared/types/models';

export type CalendarDay = {
  isoDate: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type MuscleGroupKey =
  | 'pecho'
  | 'espalda'
  | 'hombros'
  | 'brazos'
  | 'abdomen'
  | 'cuadriceps'
  | 'gluteos'
  | 'gemelos';

// Used for fullbody detection: abs/core deliberately excluded from both sides
const UPPER_GROUPS: MuscleGroupKey[] = ['pecho', 'espalda', 'hombros', 'brazos'];
const LOWER_GROUPS: MuscleGroupKey[] = ['cuadriceps', 'gluteos', 'gemelos'];

export function normalizeMuscleGroup(muscle: string): MuscleGroupKey | null {
  if (!muscle) return null;
  const m = muscle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  if (/pecho|pectoral/.test(m)) return 'pecho';
  if (/espalda|dorsal|lumbar|trapecio|romboide/.test(m)) return 'espalda';
  if (/hombro|deltoid/.test(m)) return 'hombros';
  if (/bicep|tricep|brazo|antebrazo/.test(m)) return 'brazos';
  if (/abdomin|core|oblicuo/.test(m)) return 'abdomen';
  if (/cuadricep|quadricep|isquio|femoral|pierna/.test(m)) return 'cuadriceps';
  if (/gluteo/.test(m)) return 'gluteos';
  if (/gemelo|pantorrilla|soleo/.test(m)) return 'gemelos';
  return null;
}

export function getDominantGroup(
  sessions: SessionHistory[]
): MuscleGroupKey | 'fullbody' | null {
  if (!sessions.length) return null;

  const primary = sessions.reduce((a, b) => (a.volume >= b.volume ? a : b));

  // Count sets per normalized muscle group
  const setCounts: Partial<Record<MuscleGroupKey, number>> = {};
  for (const ex of primary.exercises) {
    const g = normalizeMuscleGroup(ex.muscle);
    if (g) setCounts[g] = (setCounts[g] ?? 0) + ex.sets.length;
  }

  // Fall back to exercise count when all sets are empty (defensive against bad data)
  const totalSets = Object.values(setCounts).reduce((s, c) => s + (c ?? 0), 0);
  let counts: Partial<Record<MuscleGroupKey, number>> = setCounts;
  if (totalSets === 0) {
    const exCounts: Partial<Record<MuscleGroupKey, number>> = {};
    for (const ex of primary.exercises) {
      const g = normalizeMuscleGroup(ex.muscle);
      if (g) exCounts[g] = (exCounts[g] ?? 0) + 1;
    }
    counts = exCounts;
  }

  // Fullbody check: requires both upper AND lower (abs excluded from both)
  const hasUpper = UPPER_GROUPS.some((m) => (counts[m] ?? 0) > 0);
  const hasLower = LOWER_GROUPS.some((m) => (counts[m] ?? 0) > 0);
  if (hasUpper && hasLower) return 'fullbody';

  // Find max count across all groups
  const maxCount = Math.max(0, ...Object.values(counts).map((c) => c ?? 0));

  if (maxCount === 0) {
    // Zero data — use first exercise muscle as last resort
    return normalizeMuscleGroup(primary.exercises[0]?.muscle ?? '');
  }

  // Collect all groups tied at maxCount
  const tied = (Object.keys(counts) as MuscleGroupKey[]).filter(
    (k) => (counts[k] ?? 0) === maxCount
  );

  if (tied.length === 1) return tied[0];

  // Tiebreak: use the first exercise's muscle group if it's in the tied set.
  // This prevents arbitrary JavaScript object-key-order from picking the winner.
  const firstExerciseGroup = normalizeMuscleGroup(primary.exercises[0]?.muscle ?? '');
  if (firstExerciseGroup && tied.includes(firstExerciseGroup)) return firstExerciseGroup;

  return tied[0] ?? null;
}

function isoFromDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function buildCalendarGrid(
  year: number,
  month: number,
  todayIso: string
): CalendarDay[] {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = (firstDay.getDay() + 6) % 7; // 0=Mon
  const days: CalendarDay[] = [];

  for (let i = firstDow - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, -i);
    const iso = isoFromDate(d);
    days.push({ isoDate: iso, dayNum: d.getDate(), isCurrentMonth: false, isToday: iso === todayIso });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const iso = isoFromDate(date);
    days.push({ isoDate: iso, dayNum: d, isCurrentMonth: true, isToday: iso === todayIso });
  }

  const rem = days.length % 7;
  if (rem !== 0) {
    for (let d = 1; d <= 7 - rem; d++) {
      const date = new Date(year, month, d);
      const iso = isoFromDate(date);
      days.push({ isoDate: iso, dayNum: d, isCurrentMonth: false, isToday: iso === todayIso });
    }
  }

  return days;
}

export function groupSessionsByDay(
  sessions: SessionHistory[]
): Map<string, SessionHistory[]> {
  const map = new Map<string, SessionHistory[]>();
  for (const s of sessions) {
    if (!map.has(s.isoDate)) map.set(s.isoDate, []);
    map.get(s.isoDate)!.push(s);
  }
  return map;
}

export function getSessionsForMonth(
  sessions: SessionHistory[],
  year: number,
  month: number
): SessionHistory[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return sessions.filter((s) => s.isoDate.startsWith(prefix));
}

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function calculateWeekStreak(
  sessions: SessionHistory[],
  todayIso: string
): number {
  if (!sessions.length) return 0;
  const dateSet = new Set(sessions.map((s) => s.isoDate));
  const today = new Date(`${todayIso}T12:00:00`);
  let weekStart = getMondayOf(today);

  const currentWeekEnd = new Date(weekStart);
  currentWeekEnd.setDate(weekStart.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);
  const currentHas = [...dateSet].some((iso) => {
    const d = new Date(`${iso}T12:00:00`);
    return d >= weekStart && d <= currentWeekEnd;
  });
  if (!currentHas) weekStart.setDate(weekStart.getDate() - 7);

  let streak = 0;
  for (let i = 0; i < 260; i++) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    const has = [...dateSet].some((iso) => {
      const d = new Date(`${iso}T12:00:00`);
      return d >= weekStart && d <= weekEnd;
    });
    if (!has) break;
    streak++;
    weekStart = new Date(weekStart);
    weekStart.setDate(weekStart.getDate() - 7);
  }
  return streak;
}

export function sessionHasPR(session: SessionHistory): boolean {
  return typeof session.comparisonDelta === 'number' && session.comparisonDelta > 0;
}

export function getSessionMusclesList(session: SessionHistory): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const ex of session.exercises) {
    if (ex.muscle && !seen.has(ex.muscle)) {
      seen.add(ex.muscle);
      result.push(ex.muscle);
    }
  }
  return result;
}
