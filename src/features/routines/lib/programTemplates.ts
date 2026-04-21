import { buildExerciseTemplateFromCatalog } from '@/features/exercises/lib/exerciseCatalog';
import type { ExerciseCatalogSummary } from '@/features/exercises/types';
import type { Routine } from '@/shared/types/models';

export type ProgramDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ProgramExercise {
  order: number;
  exercise_slug: string;
  sets: number;
  reps_min: number;
  reps_max: number;
  notes: string | null;
}

export interface ProgramSession {
  id: string;
  slug: string;
  order: number;
  i18n: { es: { title: string }; en: { title: string } };
  exercises: ProgramExercise[];
}

export interface ProgramTemplate {
  id: string;
  slug: string;
  split_type: string;
  days_per_week: number;
  difficulty: ProgramDifficulty;
  goal: string;
  equipment: string;
  variant: string;
  is_active: boolean;
  i18n: {
    es: { title: string; description: string };
    en: { title: string; description: string };
  };
  sessions: ProgramSession[];
}

const DIFFICULTY_LABELS: Record<ProgramDifficulty, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

const DIFFICULTY_COLORS: Record<ProgramDifficulty, string> = {
  beginner: '#00C9A7',
  intermediate: '#3B82F6',
  advanced: '#F59E0B',
};

export function getDifficultyLabel(difficulty: ProgramDifficulty) {
  return DIFFICULTY_LABELS[difficulty];
}

export function getDifficultyColor(difficulty: ProgramDifficulty) {
  return DIFFICULTY_COLORS[difficulty];
}

let templatesPromise: Promise<ProgramTemplate[]> | null = null;

export async function loadProgramTemplates(): Promise<ProgramTemplate[]> {
  if (!templatesPromise) {
    templatesPromise = fetch('/routines.json')
      .then(async (response) => {
        if (!response.ok) throw new Error('No pudimos cargar los programas.');
        const data = (await response.json()) as { programs: ProgramTemplate[] };
        return data.programs.filter((program) => program.is_active);
      })
      .catch((error) => {
        templatesPromise = null;
        throw error;
      });
  }
  return templatesPromise;
}

export function programToRoutine(
  program: ProgramTemplate,
  catalog: ExerciseCatalogSummary[],
  color = '#00C9A7'
): Routine {
  const bySlug = new Map(catalog.map((entry) => [entry.slug, entry]));

  return {
    id: 0,
    name: program.i18n.es.title,
    description: program.i18n.es.description,
    daysPerWeek: program.days_per_week,
    color,
    categories: [],
    tags: [],
    days: program.sessions
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((session) => ({
        name: session.i18n.es.title,
        focus: '',
        exercises: session.exercises
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((ex) => {
            const entry = bySlug.get(ex.exercise_slug);
            if (entry) {
              return buildExerciseTemplateFromCatalog(entry, ex.sets, ex.reps_max);
            }
            return {
              id: 0,
              exerciseSlug: ex.exercise_slug,
              name: ex.exercise_slug,
              muscle: '',
              notes: ex.notes ?? '',
              sets: Array.from({ length: ex.sets }, (_, i) => ({
                id: i + 1,
                kg: 0,
                reps: ex.reps_max,
                rpe: 0,
                completed: false,
                kind: 'normal' as const,
              })),
            };
          }),
      })),
  };
}
