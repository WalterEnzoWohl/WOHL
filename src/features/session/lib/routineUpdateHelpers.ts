import type { DayData, ExerciseData, ActiveWorkoutExercise, Routine, SetData } from '@/shared/types/models';

type AnyExerciseRef = { exerciseSlug?: string; name: string };

function exerciseKey(ex: AnyExerciseRef): string {
  return (ex.exerciseSlug ?? ex.name).toLowerCase().trim();
}

export type RoutineChangeSummary = {
  hasChanges: boolean;
  reorderedExercises: boolean;
  addedExercises: number;
  removedExercises: number;
  replacedExercises: number;
  addedSets: number;
  removedSets: number;
  addedWarmupSets: number;
  removedWarmupSets: number;
  changedRestTimes: number;
  changedSetTypes: number;
};

export function detectRoutineChanges(
  originalDay: DayData,
  sessionExercises: ActiveWorkoutExercise[]
): RoutineChangeSummary {
  const origKeys = originalDay.exercises.map(exerciseKey);
  const sessKeys = sessionExercises.map(exerciseKey);
  const origKeySet = new Set(origKeys);
  const sessKeySet = new Set(sessKeys);

  const addedKeys = sessKeys.filter((k) => !origKeySet.has(k));
  const removedKeys = origKeys.filter((k) => !sessKeySet.has(k));
  const replacedExercises = Math.min(addedKeys.length, removedKeys.length);

  const commonOrigOrder = origKeys.filter((k) => sessKeySet.has(k));
  const commonSessOrder = sessKeys.filter((k) => origKeySet.has(k));
  const reorderedExercises = commonOrigOrder.join('|') !== commonSessOrder.join('|');

  let addedSets = 0;
  let removedSets = 0;
  let addedWarmupSets = 0;
  let removedWarmupSets = 0;
  let changedRestTimes = 0;
  let changedSetTypes = 0;

  for (const sessEx of sessionExercises) {
    const key = exerciseKey(sessEx);
    const origEx = originalDay.exercises.find((e) => exerciseKey(e) === key);
    if (!origEx) continue;

    const origNormal = origEx.sets.filter((s) => (s.kind ?? 'normal') === 'normal').length;
    const origWarmup = origEx.sets.filter((s) => s.kind === 'warmup').length;
    const sessNormal = sessEx.sets.filter((s) => s.kind === 'normal').length;
    const sessWarmup = sessEx.sets.filter((s) => s.kind === 'warmup').length;

    const normalDiff = sessNormal - origNormal;
    if (normalDiff > 0) addedSets += normalDiff;
    else if (normalDiff < 0) removedSets += -normalDiff;

    const warmupDiff = sessWarmup - origWarmup;
    if (warmupDiff > 0) addedWarmupSets += warmupDiff;
    else if (warmupDiff < 0) removedWarmupSets += -warmupDiff;

    const origRest = origEx.restSeconds ?? null;
    const sessRest = sessEx.restSeconds ?? null;
    if (origRest !== sessRest) changedRestTimes++;

    if (origNormal === sessNormal && origWarmup === sessWarmup) {
      const origKinds = origEx.sets.map((s) => s.kind ?? 'normal').join(',');
      const sessKinds = sessEx.sets.map((s) => s.kind).join(',');
      if (origKinds !== sessKinds) changedSetTypes++;
    }
  }

  const hasChanges =
    addedKeys.length > 0 ||
    removedKeys.length > 0 ||
    reorderedExercises ||
    addedSets > 0 ||
    removedSets > 0 ||
    addedWarmupSets > 0 ||
    removedWarmupSets > 0 ||
    changedRestTimes > 0 ||
    changedSetTypes > 0;

  return {
    hasChanges,
    reorderedExercises,
    addedExercises: addedKeys.length,
    removedExercises: removedKeys.length,
    replacedExercises,
    addedSets,
    removedSets,
    addedWarmupSets,
    removedWarmupSets,
    changedRestTimes,
    changedSetTypes,
  };
}

export function buildRoutineChangeSummary(changes: RoutineChangeSummary): string {
  const parts: string[] = [];

  if (changes.reorderedExercises) parts.push('reordenaste ejercicios');
  if (changes.addedExercises > 0) {
    const n = changes.addedExercises;
    parts.push(`añadiste ${n} ejercicio${n > 1 ? 's' : ''}`);
  }
  if (changes.removedExercises > 0) {
    const n = changes.removedExercises;
    parts.push(`eliminaste ${n} ejercicio${n > 1 ? 's' : ''}`);
  }
  if (changes.addedSets > 0) {
    const n = changes.addedSets;
    parts.push(`añadiste ${n} serie${n > 1 ? 's' : ''}`);
  }
  if (changes.removedSets > 0) {
    const n = changes.removedSets;
    parts.push(`eliminaste ${n} serie${n > 1 ? 's' : ''}`);
  }
  if (changes.addedWarmupSets > 0) {
    const n = changes.addedWarmupSets;
    parts.push(`añadiste ${n} serie${n > 1 ? 's' : ''} de calentamiento`);
  }
  if (changes.removedWarmupSets > 0) {
    const n = changes.removedWarmupSets;
    parts.push(`eliminaste ${n} serie${n > 1 ? 's' : ''} de calentamiento`);
  }
  if (changes.changedRestTimes > 0) {
    parts.push(
      changes.changedRestTimes > 1
        ? `cambiaste ${changes.changedRestTimes} tiempos de descanso`
        : 'cambiaste el tiempo de descanso'
    );
  }
  if (changes.changedSetTypes > 0) parts.push('modificaste tipos de series');

  if (parts.length === 0) return '';
  parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  if (parts.length === 1) return `${parts[0]}.`;
  const last = parts.pop()!;
  if (parts.length === 1) return `${parts[0]} y ${last}.`;
  return `${parts.join(', ')} y ${last}.`;
}

export function applySessionStructureToRoutine(
  originalRoutine: Routine,
  currentDay: DayData,
  sessionExercises: ActiveWorkoutExercise[]
): Routine {
  const origExByKey = new Map(currentDay.exercises.map((ex) => [exerciseKey(ex), ex]));

  const updatedExercises: ExerciseData[] = sessionExercises.map((sessEx, position) => {
    const key = exerciseKey(sessEx);
    const origEx = origExByKey.get(key);

    const updatedSets: SetData[] = sessEx.sets.map((sessSet, setIdx) => {
      const origSet = origEx?.sets[setIdx];
      return {
        id: setIdx + 1,
        kg: origSet?.kg ?? 0,
        reps: origSet?.reps ?? 0,
        rpe: origSet?.rpe ?? 8,
        completed: false,
        kind: sessSet.kind,
      };
    });

    return {
      id: origEx?.id ?? position + 1,
      exerciseSlug: sessEx.exerciseSlug ?? origEx?.exerciseSlug,
      name: sessEx.name,
      muscle: sessEx.muscle,
      implement: sessEx.implement ?? origEx?.implement,
      secondaryMuscles: origEx?.secondaryMuscles,
      notes: origEx?.notes,
      sets: updatedSets,
      restSeconds: sessEx.restSeconds ?? origEx?.restSeconds,
    };
  });

  return {
    ...originalRoutine,
    days: originalRoutine.days.map((day) =>
      day.name === currentDay.name ? { ...day, exercises: updatedExercises } : day
    ),
  };
}
