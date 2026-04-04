import { appContext, muscleGroups, sessionHistory, type UserProfile } from './mockData';

export const GOAL_OPTIONS = ['Definición', 'Volumen', 'Mantenimiento', 'Recomposición'] as const;

type GoalOption = (typeof GOAL_OPTIONS)[number];

type GoalConfig = {
  calorieMultiplier: number;
  proteinPerKg: number;
  fatPerKg: number;
  title: string;
};

type StaticMuscleGroup = (typeof muscleGroups)[number];

export type MuscleProgressInsight = StaticMuscleGroup & {
  monthlyDirectCount: number;
  monthlyTarget: number;
  progressPercent: number;
  weeklyDirectCounts: number[];
};

const MONTHLY_DIRECT_TARGET = 16;

const GOAL_ALIASES: Record<string, GoalOption> = {
  definicion: 'Definición',
  volumen: 'Volumen',
  mantenimiento: 'Mantenimiento',
  recomposicion: 'Recomposición',
  hipertrofia: 'Volumen',
  fuerza: 'Mantenimiento',
};

const GOAL_CONFIG: Record<GoalOption, GoalConfig> = {
  'Definición': {
    calorieMultiplier: 0.82,
    proteinPerKg: 2.1,
    fatPerKg: 0.8,
    title: 'definición',
  },
  Volumen: {
    calorieMultiplier: 1.1,
    proteinPerKg: 1.6,
    fatPerKg: 0.9,
    title: 'volumen',
  },
  Mantenimiento: {
    calorieMultiplier: 1,
    proteinPerKg: 1.8,
    fatPerKg: 0.9,
    title: 'mantenimiento',
  },
  'Recomposición': {
    calorieMultiplier: 0.95,
    proteinPerKg: 2,
    fatPerKg: 0.85,
    title: 'recomposición',
  },
};

const DIRECT_GROUP_MAPPINGS: Record<string, string[]> = {
  pecho: ['pecho'],
  espalda: ['espalda'],
  piernas: ['cuadriceps', 'isquiotibiales', 'gluteos', 'gemelos', 'abductores'],
  hombros: ['hombros'],
  brazos: ['triceps', 'biceps'],
};

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function parseIsoDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

function startOfWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getDirectGroupId(muscleName: string) {
  const normalized = normalizeText(muscleName);

  return Object.entries(DIRECT_GROUP_MAPPINGS).find(([, muscles]) =>
    muscles.includes(normalized)
  )?.[0];
}

export function normalizeGoal(goal: string): GoalOption {
  const normalized = normalizeText(goal);
  return GOAL_ALIASES[normalized] ?? 'Definición';
}

export function calculateNutritionTargets(profile: UserProfile) {
  const goal = normalizeGoal(profile.goal);
  const goalConfig = GOAL_CONFIG[goal];
  const bmr =
    88.362 + profile.weightKg * 13.397 + profile.heightCm * 4.799 - profile.age * 5.677;
  const maintenanceCalories = Math.round((bmr * profile.activityFactor) / 10) * 10;
  const targetCalories = Math.round((maintenanceCalories * goalConfig.calorieMultiplier) / 10) * 10;
  const proteinGrams = Math.round(profile.weightKg * goalConfig.proteinPerKg);
  const fatGrams = Math.round(profile.weightKg * goalConfig.fatPerKg);
  const carbGrams = Math.max(
    0,
    Math.round((targetCalories - proteinGrams * 4 - fatGrams * 9) / 4)
  );

  return {
    goal,
    goalTitle: goalConfig.title,
    bmr: Math.round(bmr),
    maintenanceCalories,
    targetCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
  };
}

export function getMuscleProgressInsights(referenceIso = appContext.todayIso): MuscleProgressInsight[] {
  const monthKey = referenceIso.slice(0, 7);
  const currentWeekStart = startOfWeek(parseIsoDate(referenceIso));
  const weekStarts = Array.from({ length: 8 }, (_, index) =>
    addDays(currentWeekStart, (index - 7) * 7)
  );

  return muscleGroups.map((group) => {
    const monthlyDirectCount = sessionHistory
      .filter((session) => session.isoDate.startsWith(monthKey))
      .reduce((total, session) => {
        const sessionDirectCount = session.exercises.filter(
          (exercise) => getDirectGroupId(exercise.muscle) === group.id
        ).length;

        return total + sessionDirectCount;
      }, 0);

    const weeklyDirectCounts = weekStarts.map((weekStart) => {
      const weekEnd = addDays(weekStart, 6);

      return sessionHistory.reduce((total, session) => {
        const sessionDate = parseIsoDate(session.isoDate);
        const isInsideWeek = sessionDate >= weekStart && sessionDate <= weekEnd;

        if (!isInsideWeek) {
          return total;
        }

        const sessionDirectCount = session.exercises.filter(
          (exercise) => getDirectGroupId(exercise.muscle) === group.id
        ).length;

        return total + sessionDirectCount;
      }, 0);
    });

    return {
      ...group,
      level: monthlyDirectCount,
      xp: monthlyDirectCount,
      xpNeeded: MONTHLY_DIRECT_TARGET,
      monthlyDirectCount,
      monthlyTarget: MONTHLY_DIRECT_TARGET,
      progressPercent: Math.min(100, (monthlyDirectCount / MONTHLY_DIRECT_TARGET) * 100),
      weeklyDirectCounts,
    };
  });
}
