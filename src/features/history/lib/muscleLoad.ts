import type { ExerciseCatalogSummary } from '@/features/exercises/types';
import type { SessionHistory, SessionHistoryExercise } from '@/shared/types/models';

export type MuscleLoadPeriod = 'week' | 'month' | 'year';
export type ExerciseRelationType = 'direct' | 'indirect';
export type MuscleLoadLevel = 'Sin carga' | 'Carga baja' | 'Carga media' | 'Carga alta' | 'Carga muy alta';

export type MuscleId =
  | 'pecho'
  | 'espalda'
  | 'espalda_alta'
  | 'hombros'
  | 'biceps'
  | 'triceps'
  | 'antebrazos'
  | 'abdominales'
  | 'oblicuos'
  | 'cuadriceps'
  | 'isquios'
  | 'gluteos'
  | 'aductores'
  | 'abductores'
  | 'pantorrillas'
  | 'trapecios'
  | 'lumbar'
  | 'cuello';

export interface MuscleGroupDefinition {
  id: MuscleId;
  label: string;
  svgIds: string[];
}

export interface MuscleLoadDatum {
  muscle: MuscleId;
  totalSeries: number;
  directSeries: number;
  indirectSeries: number;
  directExerciseCount: number;
  indirectExerciseCount: number;
}

export interface MuscleExerciseMatch {
  key: string;
  exerciseSlug?: string;
  name: string;
  muscle: string;
  implement?: string;
  secondaryMuscles: string[];
  relation: ExerciseRelationType;
  series: number;
  lastIsoDate: string;
}

export interface MuscleExerciseSuggestion {
  key: string;
  exerciseSlug: string;
  name: string;
  titleEn: string;
  muscle: string;
  implement?: string;
  secondaryMuscles: string[];
  relation: ExerciseRelationType;
  coverImageUrl?: string;
  animationMediaUrl?: string;
  animationMediaType?: ExerciseCatalogSummary['animationMediaType'];
  instructions: string[];
  overview: string;
  searchText: string;
}

export const MUSCLE_GROUPS: MuscleGroupDefinition[] = [
  { id: 'pecho', label: 'Pecho', svgIds: ['pecho_posterior'] },
  { id: 'hombros', label: 'Hombros', svgIds: ['hombros_anterior', 'hombros_posterior'] },
  { id: 'biceps', label: 'Bíceps', svgIds: ['biceps_anterior'] },
  { id: 'triceps', label: 'Tríceps', svgIds: ['triceps_anterior', 'triceps_posterior'] },
  { id: 'antebrazos', label: 'Antebrazos', svgIds: ['antebrazo_anterior', 'antebrazos_posterior'] },
  { id: 'abdominales', label: 'Abdominales', svgIds: ['recto_abdominal_anterior'] },
  { id: 'oblicuos', label: 'Oblicuos', svgIds: ['oblicuos_anterior', 'oblicuos_externos_posterior'] },
  { id: 'trapecios', label: 'Trapecios', svgIds: ['trapecio_superior_anterior', 'trapecio_superior'] },
  { id: 'espalda', label: 'Espalda', svgIds: ['dorsales_posterior'] },
  {
    id: 'espalda_alta',
    label: 'Espalda alta',
    svgIds: ['trapecio_medio', 'trapecio_inferior', 'infraespinosos_posterior'],
  },
  { id: 'lumbar', label: 'Lumbar', svgIds: ['lumbar_posterior'] },
  { id: 'gluteos', label: 'Glúteos', svgIds: ['Gluteos_posterior'] },
  { id: 'cuadriceps', label: 'Cuádriceps', svgIds: ['cuadriceps_anterior'] },
  { id: 'isquios', label: 'Isquios', svgIds: ['isquiotibial_posterior'] },
  { id: 'aductores', label: 'Aductores', svgIds: ['aductor_posterior'] },
  { id: 'abductores', label: 'Abductores', svgIds: ['abductor_posterior'] },
  {
    id: 'pantorrillas',
    label: 'Pantorrillas',
    svgIds: ['gemelos_anterior', 'soleo_anterior_interno_externo', 'gemelos_posterior', 'soleo_posterior_interno_externo'],
  },
  { id: 'cuello', label: 'Cuello', svgIds: ['cuello_anterior'] },
];

export const BODY_NON_MUSCLE_IDS = [
  'cabeza_anterior',
  'manos_anterior',
  'rodillas_anterior',
  'pies_anteriores',
  'cadera',
  'cabeza_posterior',
  'manos_posterior',
  'rodillas_posterior',
  'pies_posteriores',
  'codos_posterior',
  'talon',
];

export const MUSCLE_BY_ID = new Map(MUSCLE_GROUPS.map((group) => [group.id, group]));

export const MUSCLE_ID_BY_SVG_ID = new Map<string, MuscleId>(
  MUSCLE_GROUPS.flatMap((group) => group.svgIds.map((svgId) => [svgId, group.id] as const)),
);

export const ALL_MUSCLE_SVG_IDS = MUSCLE_GROUPS.flatMap((group) => group.svgIds);

export const LOAD_LEGEND = [
  { label: '0', color: '#F3F8FB' },
  { label: '1–3', color: '#D8FFF5' },
  { label: '4–6', color: '#A8F7DF' },
  { label: '7–9', color: '#63EFC2' },
  { label: '10–12', color: '#16D9A8' },
  { label: '13+', color: '#00B884' },
];

function repairPotentialMojibake(value: string) {
  if (!/[ÃƒÃ‚Ã¢]/.test(value)) {
    return value;
  }

  const bytes = Array.from(value).map((character) => character.charCodeAt(0));
  if (bytes.some((byte) => byte > 255)) {
    return value;
  }

  const repaired = new TextDecoder().decode(Uint8Array.from(bytes));
  const originalNoise = (value.match(/[ÃƒÃ‚Ã¢]/g) ?? []).length;
  const repairedNoise = (repaired.match(/[ÃƒÃ‚Ã¢]/g) ?? []).length;

  return repairedNoise < originalNoise ? repaired : value;
}

export function normalizeMuscleText(value: string) {
  return repairPotentialMojibake(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeMuscleName(muscle: string | null | undefined): MuscleId | null {
  if (!muscle) return null;

  const normalized = normalizeMuscleText(muscle);
  if (!normalized) return null;

  if (normalized.includes('pecho') || normalized.includes('pectoral')) return 'pecho';
  if (normalized.includes('hombro') || normalized.includes('deltoid')) return 'hombros';
  if (normalized.includes('bicep')) return 'biceps';
  if (normalized.includes('tricep')) return 'triceps';
  if (normalized.includes('antebrazo') || normalized.includes('forearm')) return 'antebrazos';
  if (normalized.includes('espalda alta') || normalized.includes('upper back') || normalized.includes('infraespinos')) {
    return 'espalda_alta';
  }
  if (normalized.includes('trapecio') || normalized.includes('trapez') || normalized.includes('traps')) return 'trapecios';
  if (normalized.includes('espalda') || normalized.includes('dorsal') || normalized.includes('latissimus')) return 'espalda';
  if (normalized.includes('lumbar') || normalized.includes('lower back') || normalized.includes('erector')) return 'lumbar';
  if (normalized.includes('oblic')) return 'oblicuos';
  if (normalized.includes('core') || normalized.includes('abdominal') || normalized === 'abs') return 'abdominales';
  if (normalized.includes('cuadricep') || normalized.includes('quadriceps')) return 'cuadriceps';
  if (normalized.includes('isquio') || normalized.includes('hamstring') || normalized.includes('femoral')) return 'isquios';
  if (normalized.includes('glute')) return 'gluteos';
  if (normalized.includes('aductor') || normalized.includes('adductor')) return 'aductores';
  if (normalized.includes('abductor')) return 'abductores';
  if (
    normalized.includes('pantorrilla') ||
    normalized.includes('gemelo') ||
    normalized.includes('soleo') ||
    normalized.includes('calf') ||
    normalized.includes('calves')
  ) {
    return 'pantorrillas';
  }
  if (normalized.includes('cuello') || normalized.includes('neck')) return 'cuello';

  return null;
}

function parseIsoDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getMuscleLoadPeriodRange(period: MuscleLoadPeriod, todayIso: string) {
  const today = parseIsoDate(todayIso);
  const start = new Date(today);
  const end = new Date(today);

  if (period === 'week') {
    const mondayOffset = (today.getDay() + 6) % 7;
    start.setDate(today.getDate() - mondayOffset);
    end.setTime(addDays(start, 6).getTime());
  } else if (period === 'month') {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
  } else {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  }

  return {
    startIso: toIsoDate(start),
    endIso: toIsoDate(end),
  };
}

export function getSessionsForMuscleLoadPeriod(
  sessionHistory: SessionHistory[],
  period: MuscleLoadPeriod,
  todayIso: string,
) {
  const { startIso, endIso } = getMuscleLoadPeriodRange(period, todayIso);
  return sessionHistory.filter((session) => session.isoDate >= startIso && session.isoDate <= endIso);
}

function createEmptyLoadDatum(muscle: MuscleId): MuscleLoadDatum {
  return {
    muscle,
    totalSeries: 0,
    directSeries: 0,
    indirectSeries: 0,
    directExerciseCount: 0,
    indirectExerciseCount: 0,
  };
}

function getExerciseKey(exercise: Pick<SessionHistoryExercise, 'exerciseSlug' | 'name'>) {
  return exercise.exerciseSlug ?? normalizeMuscleText(exercise.name);
}

export function getMuscleLoadByPeriod(
  sessionHistory: SessionHistory[],
  period: MuscleLoadPeriod,
  todayIso: string,
) {
  const result: Record<MuscleId, MuscleLoadDatum> = Object.fromEntries(
    MUSCLE_GROUPS.map((group) => [group.id, createEmptyLoadDatum(group.id)]),
  ) as Record<MuscleId, MuscleLoadDatum>;
  const directExercisesByMuscle = new Map<MuscleId, Set<string>>();
  const indirectExercisesByMuscle = new Map<MuscleId, Set<string>>();
  const periodSessions = getSessionsForMuscleLoadPeriod(sessionHistory, period, todayIso);

  for (const session of periodSessions) {
    for (const exercise of session.exercises) {
      const seriesCount = exercise.sets.length;
      if (seriesCount <= 0) continue;

      const primary = normalizeMuscleName(exercise.muscle);
      const secondaryMuscles = new Set(
        (exercise.secondaryMuscles ?? [])
          .map((secondary) => normalizeMuscleName(secondary))
          .filter((muscle): muscle is MuscleId => Boolean(muscle)),
      );
      const exerciseKey = getExerciseKey(exercise);

      if (primary) {
        result[primary].directSeries += seriesCount;
        result[primary].totalSeries += seriesCount;
        const directSet = directExercisesByMuscle.get(primary) ?? new Set<string>();
        directSet.add(exerciseKey);
        directExercisesByMuscle.set(primary, directSet);
      }

      for (const secondary of secondaryMuscles) {
        if (secondary === primary) continue;
        result[secondary].indirectSeries += seriesCount;
        result[secondary].totalSeries += seriesCount;
        const indirectSet = indirectExercisesByMuscle.get(secondary) ?? new Set<string>();
        indirectSet.add(exerciseKey);
        indirectExercisesByMuscle.set(secondary, indirectSet);
      }
    }
  }

  for (const group of MUSCLE_GROUPS) {
    result[group.id].directExerciseCount = directExercisesByMuscle.get(group.id)?.size ?? 0;
    result[group.id].indirectExerciseCount = indirectExercisesByMuscle.get(group.id)?.size ?? 0;
  }

  return result;
}

export function getMuscleSeriesCount(
  muscle: MuscleId,
  sessionHistory: SessionHistory[],
  period: MuscleLoadPeriod,
  todayIso: string,
) {
  return getMuscleLoadByPeriod(sessionHistory, period, todayIso)[muscle]?.totalSeries ?? 0;
}

function collectExercisesForMuscle(
  muscle: MuscleId,
  sessionHistory: SessionHistory[],
  period: MuscleLoadPeriod,
  todayIso: string,
  relation: ExerciseRelationType,
) {
  const periodSessions = getSessionsForMuscleLoadPeriod(sessionHistory, period, todayIso);
  const matches = new Map<string, MuscleExerciseMatch>();

  for (const session of periodSessions) {
    for (const exercise of session.exercises) {
      const primary = normalizeMuscleName(exercise.muscle);
      const secondaryMuscles = new Set(
        (exercise.secondaryMuscles ?? [])
          .map((secondary) => normalizeMuscleName(secondary))
          .filter((secondary): secondary is MuscleId => Boolean(secondary)),
      );
      const isDirectMatch = primary === muscle;
      const isIndirectMatch = !isDirectMatch && secondaryMuscles.has(muscle);

      if ((relation === 'direct' && !isDirectMatch) || (relation === 'indirect' && !isIndirectMatch)) {
        continue;
      }

      const key = getExerciseKey(exercise);
      const existing = matches.get(key);
      const series = exercise.sets.length;

      if (existing) {
        existing.series += series;
        existing.lastIsoDate = existing.lastIsoDate > session.isoDate ? existing.lastIsoDate : session.isoDate;
        continue;
      }

      matches.set(key, {
        key,
        exerciseSlug: exercise.exerciseSlug,
        name: exercise.name,
        muscle: exercise.muscle,
        implement: exercise.implement,
        secondaryMuscles: exercise.secondaryMuscles ?? [],
        relation,
        series,
        lastIsoDate: session.isoDate,
      });
    }
  }

  return Array.from(matches.values()).sort((a, b) => {
    if (a.lastIsoDate !== b.lastIsoDate) return b.lastIsoDate.localeCompare(a.lastIsoDate);
    if (a.series !== b.series) return b.series - a.series;
    return a.name.localeCompare(b.name, 'es');
  });
}

export function getDirectExercisesForMuscle(
  muscle: MuscleId,
  sessionHistory: SessionHistory[],
  period: MuscleLoadPeriod,
  todayIso: string,
) {
  return collectExercisesForMuscle(muscle, sessionHistory, period, todayIso, 'direct');
}

export function getIndirectExercisesForMuscle(
  muscle: MuscleId,
  sessionHistory: SessionHistory[],
  period: MuscleLoadPeriod,
  todayIso: string,
) {
  return collectExercisesForMuscle(muscle, sessionHistory, period, todayIso, 'indirect');
}

function catalogEntryMatchesMuscle(
  entry: ExerciseCatalogSummary,
  muscle: MuscleId,
  relation: ExerciseRelationType,
) {
  const primaryMatches =
    normalizeMuscleName(entry.muscle) === muscle ||
    entry.primaryMuscles.some((primaryMuscle) => normalizeMuscleName(primaryMuscle) === muscle);
  const secondaryMatches = entry.secondaryMuscles.some((secondaryMuscle) => normalizeMuscleName(secondaryMuscle) === muscle);

  return relation === 'direct' ? primaryMatches : !primaryMatches && secondaryMatches;
}

export function getSuggestedExercisesForMuscle(
  muscle: MuscleId,
  type: ExerciseRelationType,
  catalog: ExerciseCatalogSummary[],
  ownedExerciseKeys: Set<string>,
) {
  return catalog
    .filter((entry) => catalogEntryMatchesMuscle(entry, muscle, type))
    .filter((entry) => !ownedExerciseKeys.has(entry.slug) && !ownedExerciseKeys.has(normalizeMuscleText(entry.title)))
    .map<MuscleExerciseSuggestion>((entry) => ({
      key: entry.slug,
      exerciseSlug: entry.slug,
      name: entry.title,
      titleEn: entry.titleEn,
      muscle: entry.muscle,
      implement: entry.implement,
      secondaryMuscles: entry.secondaryMuscles,
      relation: type,
      coverImageUrl: entry.coverImageUrl,
      animationMediaUrl: entry.animationMediaUrl,
      animationMediaType: entry.animationMediaType,
      instructions: entry.instructions,
      overview: entry.overview,
      searchText: entry.searchText,
    }))
    .sort((a, b) => {
      if (Boolean(a.coverImageUrl) !== Boolean(b.coverImageUrl)) return a.coverImageUrl ? -1 : 1;
      return a.name.localeCompare(b.name, 'es');
    });
}

export function getMuscleLoadLevel(seriesCount: number): MuscleLoadLevel {
  if (seriesCount <= 0) return 'Sin carga';
  if (seriesCount <= 3) return 'Carga baja';
  if (seriesCount <= 6) return 'Carga media';
  if (seriesCount <= 12) return 'Carga alta';
  return 'Carga muy alta';
}

export function getMuscleColor(seriesCount: number) {
  if (seriesCount <= 0) return '#F3F8FB';
  if (seriesCount <= 3) return '#D8FFF5';
  if (seriesCount <= 6) return '#A8F7DF';
  if (seriesCount <= 9) return '#63EFC2';
  if (seriesCount <= 12) return '#16D9A8';
  return '#00B884';
}
