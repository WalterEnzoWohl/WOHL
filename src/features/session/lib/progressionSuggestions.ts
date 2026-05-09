export function getProgressionIncrement(implement?: string): number {
  const impl = (implement ?? '').toLowerCase();
  if (impl.includes('mancuerna') || impl.includes('dumbbell')) return 2;
  return 2.5;
}

const REP_TARGET = 12;
const RESET_REPS = 8;
const WEIGHT_INCREMENT = 2.5;

export type ProgressionReason = 'increase_reps' | 'increase_weight';

export type ProgressionSuggestion = {
  suggestedKg: number;
  suggestedReps: number;
  reason: ProgressionReason;
  explanation: string;
};

export type ProgressionOptions = {
  repTarget?: number;
  resetReps?: number;
  weightIncrement?: number;
};

export function getProgressionSuggestion(
  lastSet: { kg: number; reps: number },
  options?: ProgressionOptions
): ProgressionSuggestion {
  const repTarget = options?.repTarget ?? REP_TARGET;
  const resetReps = options?.resetReps ?? RESET_REPS;
  const weightIncrement = options?.weightIncrement ?? WEIGHT_INCREMENT;

  if (lastSet.reps >= repTarget) {
    const suggestedKg = lastSet.kg + weightIncrement;
    return {
      suggestedKg,
      suggestedReps: resetReps,
      reason: 'increase_weight',
      explanation: `Última vez alcanzaste ${lastSet.reps} reps con ${lastSet.kg} kg. Te sugerimos subir a ${suggestedKg} kg y volver a ${resetReps} reps.`,
    };
  }

  return {
    suggestedKg: lastSet.kg,
    suggestedReps: lastSet.reps + 1,
    reason: 'increase_reps',
    explanation: `Última vez hiciste ${lastSet.kg} kg × ${lastSet.reps}. Te sugerimos mantener el peso y sumar 1 rep.`,
  };
}
