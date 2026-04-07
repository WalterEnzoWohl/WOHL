import { useEffect, useMemo, useState } from 'react';
import {
  BarChart2,
  BookOpen,
  Check,
  ChevronRight,
  History,
  Menu,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { brandLogoWhite, userProfileAvatar } from '@/assets';
import { ActiveWorkoutEditLockModal } from '../components/ActiveWorkoutEditLockModal';
import { useAppData } from '../data/AppDataContext';
import type { ActiveWorkoutDraft, ExerciseData, SessionHistory } from '../data/models';
import {
  formatWeightInputValue,
  formatWeightNumber,
  formatWeightWithUnit,
  getAutoWeightIncrementKg,
  getWeightUnitLabel,
  parseWeightInputValue,
} from '../data/unitUtils';

type SessionLocationState = {
  routineId?: number;
  dayName?: string;
  mode?: 'free' | 'history-edit';
  action?: 'finish';
  sessionId?: number;
};

type SetState = {
  id: number;
  kg: number;
  reps: number;
  rpe: number;
  completed: boolean;
  prevKg: number;
  prevReps: number;
  kind: 'normal' | 'warmup';
};

type ExerciseState = {
  id: number;
  name: string;
  muscle: string;
  implement?: string;
  sets: SetState[];
};

type ExerciseHistoryEntry = {
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  sets: SessionHistory['exercises'][number]['sets'];
  maxKg: number;
};

const DEFAULT_REST = 90;
const FREE_SESSION_NAME = 'Entrenamiento libre';
const FREE_SESSION_FOCUS = 'Sesión vacía y personalizada';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function buildExerciseState(
  exercises: ExerciseData[],
  previousSession?: SessionHistory,
  seedWithPrevious = false
): ExerciseState[] {
  return exercises.map((exercise) => {
    const previousExercise = previousSession?.exercises.find(
      (sessionExercise) => sessionExercise.name === exercise.name
    );

    return {
      id: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      implement: exercise.implement,
      sets: exercise.sets.map((set, index) => {
        const previousKg = previousExercise?.sets[index]?.kg ?? 0;
        const previousReps = previousExercise?.sets[index]?.reps ?? 0;

        return {
          ...set,
          kg: seedWithPrevious ? previousKg : 0,
          reps: seedWithPrevious ? previousReps : 0,
          prevKg: previousKg,
          prevReps: previousReps,
          kind: 'normal',
        };
      }),
    };
  });
}

function buildExerciseStateFromHistorySession(
  session: SessionHistory,
  previousSession?: SessionHistory
): ExerciseState[] {
  return session.exercises.map((exercise, exerciseIndex) => {
    const previousExercise = previousSession?.exercises.find(
      (sessionExercise) => sessionExercise.name === exercise.name
    );

    return {
      id: exerciseIndex + 1,
      name: exercise.name,
      muscle: exercise.muscle,
      implement: exercise.implement,
      sets: exercise.sets.map((set, setIndex) => ({
        id: setIndex + 1,
        kg: set.kg,
        reps: set.reps,
        rpe: set.rpe ?? 8,
        completed: true,
        prevKg: previousExercise?.sets[setIndex]?.kg ?? set.kg,
        prevReps: previousExercise?.sets[setIndex]?.reps ?? set.reps,
        kind: 'normal',
      })),
    };
  });
}

function buildExerciseStateFromTemplate(
  exercise: ExerciseData,
  history: SessionHistory[],
  seedWithPrevious = false
): ExerciseState {
  const previousExercise = history
    .flatMap((session) => session.exercises)
    .find((sessionExercise) => sessionExercise.name === exercise.name);

  return {
    id: exercise.id,
    name: exercise.name,
    muscle: exercise.muscle,
    implement: exercise.implement,
    sets: exercise.sets.map((set, index) => {
      const previousKg = previousExercise?.sets[index]?.kg ?? 0;
      const previousReps = previousExercise?.sets[index]?.reps ?? 0;

      return {
        ...set,
        kg: seedWithPrevious ? previousKg : 0,
        reps: seedWithPrevious ? previousReps : 0,
        prevKg: previousKg,
        prevReps: previousReps,
        kind: 'normal',
      };
    }),
  };
}

function buildManualExerciseState(
  name: string,
  muscle: string,
  implement: string,
  history: SessionHistory[],
  seedWithPrevious = false
): ExerciseState {
  const previousExercise = history
    .flatMap((session) => session.exercises)
    .find((sessionExercise) => sessionExercise.name.toLowerCase() === name.toLowerCase());

  return {
    id: Date.now(),
    name,
    muscle,
    implement: implement || undefined,
    sets: [
      {
        id: 1,
        kg: seedWithPrevious ? previousExercise?.sets[0]?.kg ?? 0 : 0,
        reps: seedWithPrevious ? previousExercise?.sets[0]?.reps ?? 0 : 0,
        rpe: previousExercise?.sets[0]?.rpe ?? 8,
        completed: false,
        prevKg: previousExercise?.sets[0]?.kg ?? 0,
        prevReps: previousExercise?.sets[0]?.reps ?? 0,
        kind: 'normal',
      },
    ],
  };
}

function markExerciseSetsCompleted(exercise: ExerciseState) {
  return {
    ...exercise,
    sets: exercise.sets.map((set) => ({ ...set, completed: true })),
  };
}

function getActiveSetIndex(exercise: ExerciseState) {
  const firstPendingSet = exercise.sets.findIndex((set) => !set.completed);
  return firstPendingSet === -1 ? Math.max(0, exercise.sets.length - 1) : firstPendingSet;
}

export default function TrainingSessionPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: SessionLocationState };
  const {
    activeWorkout,
    appContext,
    appSettings,
    clearActiveWorkout,
    completeSession: completeSessionRecord,
    routines,
    saveActiveWorkout,
    sessionHistory,
    updateSession: updateSessionRecord,
  } = useAppData();

  const requestedHistorySessionId = state?.mode === 'history-edit' ? state.sessionId ?? null : null;
  const historicalSession =
    requestedHistorySessionId !== null
      ? sessionHistory.find((session) => session.id === requestedHistorySessionId) ?? null
      : null;

  if (requestedHistorySessionId !== null && activeWorkout) {
    return (
      <div className="min-h-screen bg-[#0A0D12]">
        <ActiveWorkoutEditLockModal
          activeWorkoutName={activeWorkout.sessionName}
          eyebrow="Edición bloqueada"
          title="No podés editar este entrenamiento ahora"
          description="Ya tenés un entrenamiento en curso. Para evitar mezclar datos del historial con la sesión activa, primero volvé a ese entrenamiento o finalizalo."
          subjectLabel="Entrenamiento activo"
          onResume={() => navigate('/session')}
          onFinish={() => navigate('/session', { state: { action: 'finish' } })}
          onCancel={() => navigate(-1)}
        />
      </div>
    );
  }

  if (requestedHistorySessionId !== null && !historicalSession) {
    return (
      <div
        className="flex min-h-screen flex-col"
        style={{ background: '#0A0D12', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="flex h-16 items-center border-b border-[#262626] px-5" style={{ background: '#0E0E0E' }}>
          <button className="-ml-2 p-2" onClick={() => navigate(-1)} type="button">
            <Menu size={18} className="text-[#12EFD3]" />
          </button>
        </div>
        <div className="px-5 py-6 text-sm text-[#ADAAAA]">No se encontró la sesión que querías editar.</div>
      </div>
    );
  }

  const resumedWorkout = requestedHistorySessionId === null ? activeWorkout : null;
  const hasActiveWorkout = Boolean(resumedWorkout);
  const isHistoryEditSession = Boolean(historicalSession);
  const isFreeSession = isHistoryEditSession
    ? !historicalSession?.routineId
    : hasActiveWorkout
    ? resumedWorkout.mode === 'free'
    : state?.mode === 'free';
  const routineId = isHistoryEditSession
    ? historicalSession?.routineId ?? null
    : hasActiveWorkout
    ? resumedWorkout?.routineId ?? null
    : isFreeSession
    ? null
    : (state?.routineId ?? appContext.activeRoutineId);
  const routine = routineId !== null ? routines.find((item) => item.id === routineId) ?? null : null;

  if (!isFreeSession && !routine && !hasActiveWorkout && !isHistoryEditSession) {
    return null;
  }

  const currentDay = routine
    ? routine.days.find(
        (day) => day.name === (resumedWorkout?.dayName ?? state?.dayName ?? appContext.currentDayName)
      ) ?? routine.days[0]
    : null;

  if (!isFreeSession && !currentDay && !hasActiveWorkout && !isHistoryEditSession) {
    return null;
  }

  const historicalSessionIndex = historicalSession
    ? sessionHistory.findIndex((session) => session.id === historicalSession.id)
    : -1;
  const historicalPreviousSession =
    historicalSessionIndex >= 0
      ? sessionHistory
          .slice(historicalSessionIndex + 1)
          .find((session) => session.name === historicalSession?.name)
      : undefined;

  const sessionName =
    resumedWorkout?.sessionName ??
    historicalSession?.name ??
    (isFreeSession ? FREE_SESSION_NAME : currentDay?.name ?? 'Sesión');
  const sessionFocus =
    resumedWorkout?.sessionFocus ??
    historicalSession?.sessionFocus ??
    (isFreeSession ? FREE_SESSION_FOCUS : currentDay?.focus ?? 'Entrenamiento guiado');
  const sessionAccent = isFreeSession ? '#F5B942' : isHistoryEditSession ? '#7F98FF' : '#12EFD3';
  const previousSession = isHistoryEditSession
    ? historicalPreviousSession
    : isFreeSession
    ? sessionHistory.find((session) => !session.routineId && session.name === FREE_SESSION_NAME)
    : sessionHistory.find(
        (session) =>
          session.routineId === (resumedWorkout?.routineId ?? routine?.id) &&
          session.name === (resumedWorkout?.dayName ?? currentDay?.name ?? '')
      );

  const [draftId] = useState(() => resumedWorkout?.id ?? `workout-${Date.now()}`);
  const [startedAt] = useState(() => resumedWorkout?.startedAt ?? new Date().toISOString());
  const [currentExIdx, setCurrentExIdx] = useState(resumedWorkout?.currentExerciseIndex ?? 0);
  const [exerciseList, setExerciseList] = useState<ExerciseState[]>(() =>
    resumedWorkout?.exercises ??
      (isHistoryEditSession
        ? buildExerciseStateFromHistorySession(historicalSession as SessionHistory, previousSession)
        : isFreeSession
        ? []
        : buildExerciseState(currentDay?.exercises ?? [], previousSession, appSettings.showPreviousWeight))
  );
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const [elapsed, setElapsed] = useState(() =>
    isHistoryEditSession
      ? (historicalSession?.duration ?? 0) * 60
      : Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
  );
  const [restActive, setRestActive] = useState(false);
  const [restTime, setRestTime] = useState(appSettings.restTimerSeconds || DEFAULT_REST);
  const [restConfig, setRestConfig] = useState(appSettings.restTimerSeconds || DEFAULT_REST);
  const [showMenu, setShowMenu] = useState(false);
  const [notes, setNotes] = useState(resumedWorkout?.notes ?? historicalSession?.notes ?? '');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showRestConfig, setShowRestConfig] = useState(false);
  const [selectedSetIdx, setSelectedSetIdx] = useState<number | null>(null);
  const [showExerciseHistory, setShowExerciseHistory] = useState(false);
  const [showReplaceExercise, setShowReplaceExercise] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showDatabaseExercisePicker, setShowDatabaseExercisePicker] = useState(false);
  const [replaceQuery, setReplaceQuery] = useState('');
  const [databaseQuery, setDatabaseQuery] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseMuscle, setNewExerciseMuscle] = useState('');
  const [newExerciseImplement, setNewExerciseImplement] = useState('');

  useEffect(() => {
    if (isHistoryEditSession) {
      return;
    }

    const updateElapsed = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)));
    };

    updateElapsed();
    const timerId = setInterval(updateElapsed, 1000);
    return () => clearInterval(timerId);
  }, [isHistoryEditSession, startedAt]);

  useEffect(() => {
    if (!restActive) {
      return;
    }

    if (restTime <= 0) {
      setRestActive(false);
      return;
    }

    const timerId = setInterval(() => setRestTime((value) => value - 1), 1000);
    return () => clearInterval(timerId);
  }, [restActive, restTime]);

  useEffect(() => {
    if (exerciseList.length === 0) {
      setCurrentExIdx(0);
      setActiveSetIdx(0);
      setSelectedSetIdx(null);
      setShowMenu(false);
      setShowExerciseHistory(false);
      return;
    }

    if (currentExIdx > exerciseList.length - 1) {
      setCurrentExIdx(exerciseList.length - 1);
    }
  }, [currentExIdx, exerciseList.length]);

  useEffect(() => {
    setRestConfig(appSettings.restTimerSeconds || DEFAULT_REST);
    if (!restActive) {
      setRestTime(appSettings.restTimerSeconds || DEFAULT_REST);
    }
  }, [appSettings.restTimerSeconds, restActive]);

  useEffect(() => {
    if (isHistoryEditSession) {
      return;
    }

    const draft: ActiveWorkoutDraft = {
      id: draftId,
      mode: isFreeSession ? 'free' : 'routine',
      routineId,
      dayName: sessionName,
      sessionName,
      sessionFocus,
      startedAt,
      notes,
      currentExerciseIndex: Math.max(0, Math.min(currentExIdx, Math.max(0, exerciseList.length - 1))),
      exercises: exerciseList,
    };

    saveActiveWorkout(draft);
  }, [
    currentExIdx,
    draftId,
    exerciseList,
    isHistoryEditSession,
    isFreeSession,
    notes,
    routineId,
    saveActiveWorkout,
    sessionFocus,
    sessionName,
    startedAt,
  ]);

  useEffect(() => {
    if (isHistoryEditSession) {
      return;
    }

    if (state?.action === 'finish') {
      setShowFinishModal(true);
    }
  }, [isHistoryEditSession, state?.action]);

  const currentExercise = exerciseList[currentExIdx] ?? null;
  const hasExercises = exerciseList.length > 0;
  const totalSetsCompleted = exerciseList.reduce(
    (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
    0
  );
  const totalSets = exerciseList.reduce((total, exercise) => total + exercise.sets.length, 0);
  const totalVolume = exerciseList.reduce(
    (total, exercise) =>
      total +
      exercise.sets
        .filter((set) => set.completed)
        .reduce((setTotal, set) => setTotal + set.kg * set.reps, 0),
    0
  );
  const weightUnitLabel = getWeightUnitLabel(appSettings.weightUnit);

  const exerciseHistoryEntries: ExerciseHistoryEntry[] = currentExercise
    ? sessionHistory
        .flatMap((session) =>
          isHistoryEditSession && historicalSession && session.id === historicalSession.id
            ? []
            : session.exercises
                .filter((exercise) => exercise.name === currentExercise.name)
                .map((exercise) => ({
                  sessionId: session.id,
                  sessionName: session.name,
                  sessionDate: session.date,
                  sets: exercise.sets,
                  maxKg: exercise.maxKg,
                }))
        )
        .slice(0, 6)
    : [];

  const replacementOptions = useMemo(() => {
    if (!currentExercise) {
      return [];
    }

    return routines
      .flatMap((item) => item.days.flatMap((day) => day.exercises))
      .filter((exercise) => exercise.name !== currentExercise.name)
      .filter(
        (exercise, index, array) =>
          array.findIndex((candidate) => candidate.name === exercise.name) === index
      );
  }, [currentExercise, routines]);

  const databaseExerciseOptions = useMemo(() => {
    const currentNames = new Set(exerciseList.map((exercise) => exercise.name.toLowerCase()));

    return routines
      .flatMap((item) => item.days.flatMap((day) => day.exercises))
      .filter(
        (exercise, index, array) =>
          array.findIndex(
            (candidate) => candidate.name.toLowerCase() === exercise.name.toLowerCase()
          ) === index
      )
      .filter((exercise) => !currentNames.has(exercise.name.toLowerCase()));
  }, [exerciseList, routines]);

  const normalizedReplaceQuery = replaceQuery.trim().toLowerCase();
  const filteredReplacementOptions = replacementOptions.filter((exercise) => {
    if (!normalizedReplaceQuery) {
      return true;
    }

    const haystack = [exercise.name, exercise.muscle, exercise.implement ?? '']
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedReplaceQuery);
  });

  const normalizedDatabaseQuery = databaseQuery.trim().toLowerCase();
  const filteredDatabaseExerciseOptions = databaseExerciseOptions.filter((exercise) => {
    if (!normalizedDatabaseQuery) {
      return true;
    }

    const haystack = [exercise.name, exercise.muscle, exercise.implement ?? '']
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedDatabaseQuery);
  });

  const completeSet = (exerciseIdx: number, setIdx: number) => {
    const targetExercise = exerciseList[exerciseIdx];

    if (!targetExercise) {
      return;
    }

    const targetSet = targetExercise.sets[setIdx];

    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set, index) =>
            index === setIdx ? { ...set, completed: !set.completed } : set
          ),
        };
      })
    );

    if (!targetSet.completed && !isHistoryEditSession) {
      setCurrentExIdx(exerciseIdx);
      setRestTime(restConfig);
      setRestActive(true);
    }
  };

  const updateSetValue = (
    exerciseIdx: number,
    setIdx: number,
    field: 'kg' | 'reps',
    value: string
  ) => {
    if (!exerciseList[exerciseIdx]) {
      return;
    }

    const numericValue =
      field === 'kg' ? parseWeightInputValue(value, appSettings.weightUnit) : Number.parseFloat(value) || 0;

    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set, index) =>
            index === setIdx ? { ...set, [field]: numericValue } : set
          ),
        };
      })
    );
  };

  const addSet = (exerciseIdx: number) => {
    const targetExercise = exerciseList[exerciseIdx];

    if (!targetExercise) {
      return;
    }

    const lastSet = targetExercise.sets[targetExercise.sets.length - 1];
    const newSet: SetState = {
      id: targetExercise.sets.length + 1,
      kg:
        appSettings.autoWeightIncrement && (lastSet?.kg ?? 0) > 0
          ? Number(((lastSet?.kg ?? 0) + getAutoWeightIncrementKg(appSettings.weightUnit)).toFixed(2))
          : (lastSet?.kg ?? 0),
      reps: lastSet?.reps ?? 0,
      rpe: lastSet?.rpe ?? 8,
      completed: isHistoryEditSession,
      prevKg: lastSet?.prevKg ?? lastSet?.kg ?? 0,
      prevReps: lastSet?.prevReps ?? lastSet?.reps ?? 0,
      kind: 'normal',
    };

    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        return { ...exercise, sets: [...exercise.sets, newSet] };
      })
    );
  };

  const updateSetKind = (exerciseIdx: number, setIdx: number, kind: SetState['kind']) => {
    if (!exerciseList[exerciseIdx]) {
      return;
    }

    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set, index) => (index === setIdx ? { ...set, kind } : set)),
        };
      })
    );

    setSelectedSetIdx(null);
  };

  const removeSet = (exerciseIdx: number, setIdx: number) => {
    const targetExercise = exerciseList[exerciseIdx];

    if (!targetExercise || targetExercise.sets.length <= 1) {
      return;
    }

    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets
            .filter((_, index) => index !== setIdx)
            .map((set, index) => ({ ...set, id: index + 1 })),
        };
      })
    );

    setSelectedSetIdx(null);
  };

  const addManualExercise = () => {
    const trimmedName = newExerciseName.trim();
    const trimmedMuscle = newExerciseMuscle.trim();

    if (!trimmedName || !trimmedMuscle) {
      return;
    }

    const nextManualExercise = buildManualExerciseState(
      trimmedName,
      trimmedMuscle,
      newExerciseImplement.trim(),
      sessionHistory,
      appSettings.showPreviousWeight
    );
    const normalizedManualExercise = isHistoryEditSession
      ? markExerciseSetsCompleted(nextManualExercise)
      : nextManualExercise;

    setExerciseList((previous) => [...previous, normalizedManualExercise]);
    setCurrentExIdx(exerciseList.length);
    setActiveSetIdx(0);
    setShowAddExercise(false);
    setNewExerciseName('');
    setNewExerciseMuscle('');
    setNewExerciseImplement('');
  };

  const addDatabaseExercise = (exercise: ExerciseData) => {
    const nextExercise = buildExerciseStateFromTemplate(exercise, sessionHistory, appSettings.showPreviousWeight);
    const normalizedExercise = isHistoryEditSession ? markExerciseSetsCompleted(nextExercise) : nextExercise;

    setExerciseList((previous) => [...previous, normalizedExercise]);
    setCurrentExIdx(exerciseList.length);
    setActiveSetIdx(0);
    setSelectedSetIdx(null);
    setRestActive(false);
    setDatabaseQuery('');
    setShowDatabaseExercisePicker(false);
  };

  const nextExercise = () => {};

  const finishSession = async () => {
    if (isHistoryEditSession && historicalSession) {
      await updateSessionRecord({
        sessionId: historicalSession.id,
        routineId,
        routineName: routine?.name,
        dayName: sessionName,
        sessionFocus,
        durationSeconds: elapsed,
        notes,
        exercises: exerciseList,
      });

      navigate(`/session-history/${historicalSession.id}`);
      return;
    }

    await completeSessionRecord({
      routineId,
      routineName: routine?.name,
      dayName: sessionName,
      sessionFocus,
      durationSeconds: elapsed,
      notes,
      exercises: exerciseList,
    });

    clearActiveWorkout();
    navigate('/post-session', {
      state: {
        duration: elapsed,
        volume: totalVolume,
        setsCompleted: totalSetsCompleted,
        totalSets,
        exercises: exerciseList,
        notes,
        sessionName,
        sessionFocus,
        previousVolume: previousSession?.volume ?? 0,
      },
    });
  };

  const discardSession = () => {
    setShowFinishModal(false);

    if (isHistoryEditSession && historicalSession) {
      navigate(`/session-history/${historicalSession.id}`);
      return;
    }

    clearActiveWorkout();
    navigate('/');
  };

  const deleteCurrentExercise = () => {
    if (!currentExercise) {
      setShowMenu(false);
      return;
    }

    if (exerciseList.length <= 1) {
      setExerciseList([]);
      setCurrentExIdx(0);
      setActiveSetIdx(0);
      setShowMenu(false);
      return;
    }

    setExerciseList((previous) => previous.filter((_, index) => index !== currentExIdx));
    setCurrentExIdx((current) => Math.max(0, Math.min(current, exerciseList.length - 2)));
    setActiveSetIdx(0);
    setShowMenu(false);
  };

  const replaceCurrentExercise = (exercise: ExerciseData) => {
    if (!currentExercise) {
      return;
    }

    const replacement = buildExerciseStateFromTemplate(exercise, sessionHistory, appSettings.showPreviousWeight);
    const normalizedReplacement = isHistoryEditSession ? markExerciseSetsCompleted(replacement) : replacement;

    setExerciseList((previous) =>
      previous.map((item, index) => (index === currentExIdx ? normalizedReplacement : item))
    );
    setActiveSetIdx(0);
    setSelectedSetIdx(null);
    setReplaceQuery('');
    setShowReplaceExercise(false);
    setShowMenu(false);
  };

  const closeAddExercise = () => {
    setShowAddExercise(false);
    setNewExerciseName('');
    setNewExerciseMuscle('');
    setNewExerciseImplement('');
  };

  const closeDatabaseExercisePicker = () => {
    setShowDatabaseExercisePicker(false);
    setDatabaseQuery('');
  };

  const exerciseMenuItems = [
    {
      label: 'Ver historial de este ejercicio',
      icon: History,
      onClick: () => {
        setShowMenu(false);
        setShowExerciseHistory(true);
      },
    },
    {
      label: 'Reemplazar ejercicio',
      icon: RefreshCw,
      onClick: () => {
        setShowMenu(false);
        setShowReplaceExercise(true);
      },
    },
    {
      label: 'Eliminar ejercicio',
      icon: Trash2,
      danger: true,
      disabled: exerciseList.length <= 1,
      onClick: deleteCurrentExercise,
    },
    {
      label: 'Ver instrucciones / forma correcta',
      icon: BookOpen,
      disabled: true,
    },
  ];

  const sessionHeaderLabel = isHistoryEditSession
    ? 'Edición del historial'
    : isFreeSession
    ? 'Sesión libre'
    : 'Sesión activa';
  const sessionDateLabel =
    isHistoryEditSession && historicalSession
      ? `${historicalSession.dayLabel} - ${historicalSession.date}`
      : appContext.todayLabel;
  const sessionBadgeLabel = isHistoryEditSession ? 'Historial' : isFreeSession ? 'Sin rutina' : null;

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: '#0A0D12', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="h-16 shrink-0 border-b border-[#262626] px-5"
        style={{ background: '#0E0E0E' }}
      >
        <div className="flex h-full items-center justify-between">
          <button
            className="-ml-2 p-2"
            onClick={() =>
              isHistoryEditSession && historicalSession ? navigate(`/session-history/${historicalSession.id}`) : navigate('/')
            }
            type="button"
          >
            <Menu size={18} className="text-[#12EFD3]" />
          </button>
          <div className="flex items-center gap-2">
            <img src={brandLogoWhite} alt="GymUp" className="h-7 w-7 object-contain" />
            <span className="text-lg font-extrabold italic uppercase tracking-tight text-white">GYMUP</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(18,239,211,0.2)] bg-[#1C2030] px-3 py-1.5">
              <div className={`h-1.5 w-1.5 rounded-full bg-[#12EFD3] ${isHistoryEditSession ? '' : 'animate-pulse'}`} />
              <span className="text-sm font-bold text-[#12EFD3]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatTime(elapsed)}
              </span>
            </div>
            <div className="h-9 w-9 overflow-hidden rounded-full border border-[rgba(18,239,211,0.2)]">
              <img src={userProfileAvatar} alt="Profile" className="theme-preserve h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5 px-4 py-5">
          <div className="flex items-end justify-between">
            <div>
              <p
                className="mb-1 text-xs uppercase tracking-widest text-[#ADAAAA]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {sessionHeaderLabel} - {sessionDateLabel}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-4xl font-extrabold italic leading-tight tracking-tight text-white">
                  {sessionName}
                </h1>
                {sessionBadgeLabel && (
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#0E0E0E]"
                    style={{ background: sessionAccent }}
                  >
                    {sessionBadgeLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {sessionFocus}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="relative overflow-hidden rounded-xl bg-[#131313] p-5"
              style={{ borderLeft: '4px solid rgba(18,239,211,0.4)' }}
            >
              <p
                className="mb-3 text-[10px] uppercase tracking-widest text-[#ADAAAA]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Volumen total
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white">
                  {formatWeightNumber(totalVolume, appSettings.weightUnit, 0)}
                </span>
                <span className="text-sm font-bold italic text-[#ADAAAA]">{weightUnitLabel}</span>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-xl bg-[#131313] p-5"
              style={{ borderLeft: '4px solid rgba(127,152,255,0.4)' }}
            >
              <p
                className="mb-3 text-[10px] uppercase tracking-widest text-[#ADAAAA]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Series completas
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white">{totalSetsCompleted}</span>
                <span className="text-sm font-bold italic text-[#ADAAAA]">/ {totalSets}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#131313] p-4">
            <label
              htmlFor="session-notes"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Notas de la sesión
            </label>
            <textarea
              id="session-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Añadí notas sobre tu sesión, sensaciones o ajustes para la próxima..."
              className="h-24 w-full resize-none rounded-xl border border-[rgba(18,239,211,0.15)] bg-[#1C2030] p-4 text-sm text-white outline-none transition-colors focus:border-[rgba(18,239,211,0.45)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {(isFreeSession || isHistoryEditSession) && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowAddExercise(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[rgba(245,185,66,0.25)] bg-[rgba(245,185,66,0.08)] px-3 py-4 text-[#F5B942] transition-colors active:bg-[rgba(245,185,66,0.14)]"
                type="button"
              >
                <Sparkles size={18} />
                <span className="text-sm font-semibold">Agregar Nuevo Ejercicio</span>
              </button>
              <button
                onClick={() => setShowDatabaseExercisePicker(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[rgba(18,239,211,0.22)] bg-[rgba(18,239,211,0.08)] px-3 py-4 text-[#12EFD3] transition-colors active:bg-[rgba(18,239,211,0.14)]"
                type="button"
              >
                <Search size={18} />
                <span className="text-sm font-semibold">Agregar Ejercicio</span>
              </button>
            </div>
          )}

          {hasExercises ? (
            <div className="flex flex-col gap-4">
              {exerciseList.map((exercise, exerciseIdx) => {
                const activeSetIdxForExercise = getActiveSetIndex(exercise);

                return (
                  <div
                    key={`${exercise.id}-${exerciseIdx}`}
                    className="overflow-hidden rounded-2xl border border-[#262626] bg-[#141720]"
                  >
                    <div className="flex items-center justify-between px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(0,81,71,0.2)]">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="#12EFD3">
                            <path d="M7 4.5a2.5 2.5 0 0 1 5 0v1h1.5A1.5 1.5 0 0 1 15 7v1.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 8.5V7a1.5 1.5 0 0 1 1.5-1.5H8v-1zM9 4.5a1 1 0 0 0-2 0v1h2v-1zM11 5.5V4.5a1 1 0 0 1 2 0v1h-2zM5 12a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2H5zM4 15a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold italic uppercase leading-tight tracking-tight text-white">
                            {exercise.name}
                          </h2>
                          <p className="mt-0.5 text-xs text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Ejercicio {exerciseIdx + 1} de {exerciseList.length} - {exercise.muscle}
                            {exercise.implement ? ` - ${exercise.implement}` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentExIdx(exerciseIdx);
                          setShowMenu(true);
                        }}
                        className="rounded-lg bg-[#262626] p-2"
                        type="button"
                      >
                        <MoreVertical size={16} className="text-white" />
                      </button>
                    </div>

                    <div className="border-b border-[rgba(73,72,71,0.1)] bg-[rgba(32,31,31,0.5)] px-4 py-3">
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {['SET', weightUnitLabel.toUpperCase(), 'REPS', 'RPE', ''].map((column) => (
                          <span
                            key={`${exercise.id}-${column}`}
                            className={`text-[10px] font-semibold tracking-widest ${
                              column === weightUnitLabel.toUpperCase() || column === 'REPS'
                                ? 'text-[#12EFD3]'
                                : 'text-[#ADAAAA]'
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {column}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      {exercise.sets.map((set, setIdx) => {
                        const isCompleted = set.completed;
                        const isActive = setIdx === activeSetIdxForExercise && !isCompleted;
                        const isPending = !isCompleted && !isActive;

                        return (
                          <div
                            key={set.id}
                            className={`border-b border-[rgba(73,72,71,0.1)] px-4 py-4 last:border-b-0 ${
                              isActive ? 'border-l-4 border-l-[rgba(18,239,211,0.3)] bg-[rgba(18,239,211,0.05)]' : ''
                            }`}
                          >
                            <div className="grid grid-cols-5 items-center gap-2">
                              <div className="text-center">
                                <button
                                  onClick={() => {
                                    setCurrentExIdx(exerciseIdx);
                                    setSelectedSetIdx(setIdx);
                                  }}
                                  className={`flex w-full flex-col items-center rounded-lg px-1 py-1 transition-colors ${
                                    currentExIdx === exerciseIdx && selectedSetIdx === setIdx
                                      ? 'bg-[rgba(18,239,211,0.08)]'
                                      : 'hover:bg-white/5'
                                  }`}
                                  type="button"
                                >
                                  <span
                                    className={`font-bold italic ${
                                      isActive
                                        ? 'text-xl text-[#12EFD3]'
                                        : set.kind === 'warmup'
                                        ? 'text-base text-[#F5B942]'
                                        : 'text-base text-[#ADAAAA]'
                                    }`}
                                  >
                                    {setIdx === 0 && set.kind === 'warmup' ? 'W' : setIdx + 1}
                                  </span>
                                  <span
                                    className={`text-[9px] font-semibold uppercase tracking-widest ${
                                      set.kind === 'warmup' ? 'text-[#F5B942]' : 'text-[#5D6474]'
                                    }`}
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                  >
                                    {set.kind === 'warmup' ? 'Warm' : 'Set'}
                                  </span>
                                </button>
                              </div>

                              <div>
                                {isActive ? (
                                  <div className="rounded-lg border border-[rgba(18,239,211,0.3)] bg-[#262626] px-1 py-2 shadow-[0_0_10px_rgba(18,239,211,0.1)]">
                                    <input
                                      type="number"
                                      step={appSettings.weightUnit === 'kg' ? '0.5' : '0.1'}
                                      value={formatWeightInputValue(set.kg, appSettings.weightUnit)}
                                      onChange={(event) =>
                                        updateSetValue(exerciseIdx, setIdx, 'kg', event.target.value)
                                      }
                                      className={`w-full bg-transparent text-center font-normal text-[#12EFD3] outline-none ${
                                        appSettings.weightUnit === 'lb' ? 'text-sm' : 'text-base'
                                      }`}
                                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    />
                                  </div>
                                ) : (
                                  <div className="rounded-lg bg-[rgba(38,38,38,0.5)] px-1 py-2 text-center">
                                    <span
                                      className={`block font-normal ${isCompleted ? 'text-base text-white' : 'text-sm text-white/40'}`}
                                    >
                                      {set.kg > 0 ? formatWeightNumber(set.kg, appSettings.weightUnit) : '-'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div>
                                {isActive ? (
                                  <div className="rounded-lg border border-[rgba(18,239,211,0.3)] bg-[#262626] py-2 shadow-[0_0_10px_rgba(18,239,211,0.1)]">
                                    <input
                                      type="number"
                                      value={set.reps || ''}
                                      onChange={(event) =>
                                        updateSetValue(exerciseIdx, setIdx, 'reps', event.target.value)
                                      }
                                      className="w-full bg-transparent text-center text-base font-normal text-[#12EFD3] outline-none"
                                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    />
                                  </div>
                                ) : (
                                  <div className="rounded-lg bg-[rgba(38,38,38,0.5)] py-2 text-center">
                                    <span className={`block text-lg font-normal ${isCompleted ? 'text-white' : 'text-white/40'}`}>
                                      {set.reps || '-'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="text-center">
                                <div className="rounded-lg bg-[#262626] py-1 text-center">
                                  <span className="text-xs text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {set.rpe || '-'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-center">
                                <button
                                  onClick={() => completeSet(exerciseIdx, setIdx)}
                                  disabled={isPending}
                                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                                    isCompleted
                                      ? 'bg-[#12EFD3]'
                                      : isActive
                                      ? 'border border-[rgba(18,239,211,0.4)] bg-[rgba(18,239,211,0.2)]'
                                      : 'bg-[#262626] opacity-40'
                                  }`}
                                  type="button"
                                >
                                  <Check
                                    size={14}
                                    className={isCompleted ? 'text-[#003830]' : 'text-[#12EFD3]'}
                                    strokeWidth={3}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-[rgba(73,72,71,0.1)] px-4 py-4">
                      <button
                        onClick={() => addSet(exerciseIdx)}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-[#262626] bg-[#1C2030] py-3 transition-colors active:bg-[#262626]"
                        type="button"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#12EFD3]">
                          <Plus size={12} className="text-[#12EFD3]" />
                        </div>
                        <span className="text-sm font-semibold text-white">Añadir serie</span>
                      </button>
                      <button
                        onClick={() => removeSet(exerciseIdx, exercise.sets.length - 1)}
                        disabled={exercise.sets.length <= 1}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-[rgba(229,57,53,0.18)] bg-[rgba(229,57,53,0.08)] py-3 text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.14)] disabled:opacity-45"
                        type="button"
                      >
                        <Trash2 size={16} />
                        <span className="text-sm font-semibold">Eliminar serie</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[rgba(245,185,66,0.18)] bg-[rgba(245,185,66,0.06)] p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[rgba(245,185,66,0.14)] p-3">
                  <Sparkles size={20} className="text-[#F5B942]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F5B942]">
                    {isHistoryEditSession ? 'Sesión sin ejercicios' : 'Entrenamiento vacío'}
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
                    {isHistoryEditSession ? 'Sumá ejercicios para completar esta sesión' : 'Empezá agregando tu primer ejercicio'}
                  </h2>
                  <p className="mt-2 text-sm text-[#D8C9A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {isHistoryEditSession
                      ? 'Podés reconstruir esta sesión del historial agregando ejercicios manualmente o desde tu base actual.'
                      : 'Esta sesión no depende de ninguna rutina. Podés cargar ejercicios manualmente o elegirlos desde tu base actual y guardar el entrenamiento en tu historial.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {false && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => undefined}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#262626] bg-[#1C2030] py-4 transition-colors active:bg-[#262626]"
                type="button"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#12EFD3]">
                  <Plus size={12} className="text-[#12EFD3]" />
                </div>
                <span className="text-sm font-semibold text-white">Añadir serie</span>
              </button>
              <button
                onClick={nextExercise}
                disabled={currentExIdx >= exerciseList.length - 1}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#12EFD3] py-4 transition-colors active:bg-[#0DBDA7] disabled:opacity-40"
                type="button"
              >
                <span className="text-sm font-bold text-black">Siguiente ejercicio</span>
                <ChevronRight size={16} className="text-black" />
              </button>
            </div>
          )}

          {restActive && currentExercise && (
            <div className="flex items-center gap-3 rounded-2xl border border-[rgba(18,239,211,0.15)] bg-[#1C2030] px-4 py-3">
              <button
                onClick={() => setShowRestConfig(true)}
                className="relative h-14 w-14 flex-shrink-0"
                type="button"
              >
                <svg className="h-full w-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#262626" strokeWidth="4" />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="#12EFD3"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - restTime / restConfig)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#12EFD3]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {restTime}s
                </span>
              </button>
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ADAAAA]">Descanso activo</p>
                <p className="mt-0.5 text-sm font-semibold text-white">Próxima serie: {currentExercise.name}</p>
              </div>
              <button
                onClick={() => setRestActive(false)}
                className="text-sm font-bold uppercase tracking-wider text-[#12EFD3]"
                type="button"
              >
                Omitir
              </button>
            </div>
          )}

          <div className="flex gap-3 pb-2">
            <button
              onClick={() => setShowFinishModal(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E53935] py-4 transition-colors active:bg-[#C62828]"
              type="button"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white/60">
                <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-white">
                {isHistoryEditSession ? 'Guardar cambios' : 'Finalizar entrenamiento'}
              </span>
            </button>
            <button
              onClick={() =>
                isFreeSession || isHistoryEditSession
                  ? setShowDatabaseExercisePicker(true)
                  : setShowReplaceExercise(true)
              }
              disabled={!isFreeSession && !isHistoryEditSession && !currentExercise}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#262626] bg-[#1C2030] disabled:opacity-40"
              type="button"
            >
              {isFreeSession || isHistoryEditSession ? (
                <Search size={20} className="text-[#F5B942]" />
              ) : (
                <BarChart2 size={20} className="text-[#ADAAAA]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {showMenu && currentExercise && (
        <div className="absolute inset-0 z-40 flex items-end">
          <button
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowMenu(false)}
            type="button"
          />
          <div className="relative z-10 w-full rounded-t-[2rem] bg-[#1C2030] px-5 pb-6 pt-5">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#3A3F50]" />
            <h3 className="text-2xl font-bold tracking-tight text-white">{currentExercise.name}</h3>
            <p className="mt-1 text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {currentExercise.muscle}
              {currentExercise.implement ? ` - ${currentExercise.implement}` : ''}
            </p>

            <div className="mt-6 flex flex-col">
              {exerciseMenuItems.map(({ label, icon: Icon, onClick, danger, disabled }) => (
                <button
                  key={label}
                  onClick={onClick}
                  disabled={disabled}
                  className={`flex items-center gap-4 border-b border-white/5 py-4 text-left last:border-b-0 disabled:opacity-45 ${
                    danger ? 'text-[#FF5D5D]' : 'text-white'
                  }`}
                  type="button"
                >
                  <Icon size={18} className={danger ? 'text-[#FF5D5D]' : 'text-white/85'} />
                  <span className="text-lg font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedSetIdx !== null && currentExercise && (
        <div className="absolute inset-0 z-40 flex items-end">
          <button
            aria-label="Cerrar selector de serie"
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedSetIdx(null)}
            type="button"
          />
          <div className="relative z-10 w-full rounded-t-[2rem] bg-[#1C2030] px-5 pb-6 pt-5">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#3A3F50]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#12EFD3]">
              Set {selectedSetIdx + 1}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{currentExercise.name}</h3>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => updateSetKind(currentExIdx, selectedSetIdx, 'warmup')}
                className="flex items-center justify-between rounded-2xl border border-[rgba(245,185,66,0.2)] bg-[rgba(245,185,66,0.08)] px-4 py-4 text-left"
                type="button"
              >
                <div>
                  <p className="font-semibold text-white">Serie de calentamiento</p>
                  <p className="mt-1 text-xs text-[#D8C9A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Ideal para aproximaciones y activación.
                  </p>
                </div>
                <Sparkles size={18} className="text-[#F5B942]" />
              </button>

              <button
                onClick={() => updateSetKind(currentExIdx, selectedSetIdx, 'normal')}
                className="flex items-center justify-between rounded-2xl border border-[rgba(18,239,211,0.18)] bg-[rgba(18,239,211,0.08)] px-4 py-4 text-left"
                type="button"
              >
                <div>
                  <p className="font-semibold text-white">Set normal</p>
                  <p className="mt-1 text-xs text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Cuenta como serie principal dentro del ejercicio.
                  </p>
                </div>
                <Check size={18} className="text-[#12EFD3]" />
              </button>

              <button
                onClick={() => removeSet(currentExIdx, selectedSetIdx)}
                disabled={currentExercise.sets.length <= 1}
                className="flex items-center justify-between rounded-2xl border border-[rgba(229,57,53,0.18)] bg-[rgba(229,57,53,0.08)] px-4 py-4 text-left text-[#FF7D7D] disabled:opacity-45"
                type="button"
              >
                <div>
                  <p className="font-semibold">Eliminar serie</p>
                  <p className="mt-1 text-xs text-[#D6B9B9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Quitá esta serie de la sesión actual.
                  </p>
                </div>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showExerciseHistory && currentExercise && (
        <div className="absolute inset-0 z-40 flex items-end">
          <button
            aria-label="Cerrar historial"
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowExerciseHistory(false)}
            type="button"
          />
          <div className="relative z-10 w-full rounded-t-[2rem] bg-[#1C2030] px-5 pb-6 pt-5">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#3A3F50]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#12EFD3]">
              Historial del ejercicio
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{currentExercise.name}</h3>
            <p className="mt-2 text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tus registros recientes para este movimiento.
            </p>

            <div className="mt-6 flex max-h-[24rem] flex-col gap-3 overflow-y-auto pr-1">
              {exerciseHistoryEntries.length > 0 ? (
                exerciseHistoryEntries.map((entry) => (
                  <button
                    key={`${entry.sessionId}-${entry.sessionDate}`}
                    onClick={() => navigate(`/session-history/${entry.sessionId}`)}
                    className="rounded-2xl border border-[#2A2F3D] bg-[#131313] p-4 text-left"
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-white">{entry.sessionName}</p>
                        <p className="mt-1 text-xs text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {entry.sessionDate}
                        </p>
                      </div>
                      <span className="rounded-full bg-[rgba(18,239,211,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]">
                        PR {entry.maxKg > 0 ? formatWeightWithUnit(entry.maxKg, appSettings.weightUnit) : 'Peso corporal'}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.sets.map((set, index) => (
                        <span
                          key={`${entry.sessionId}-${index}`}
                          className="rounded-full bg-[#1C2030] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#D8E4FF]"
                        >
                          {set.kg > 0 ? `${formatWeightNumber(set.kg, appSettings.weightUnit)}${weightUnitLabel}` : 'PC'} x {set.reps}
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-[#2A2F3D] bg-[#131313] p-5 text-sm text-[#A1A1A1]">
                  Todavía no hay registros guardados para este ejercicio.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showReplaceExercise && currentExercise && (
        <div className="absolute inset-0 z-40 flex items-end">
          <button
            aria-label="Cerrar selector de reemplazo"
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setShowReplaceExercise(false);
              setReplaceQuery('');
            }}
            type="button"
          />
          <div className="relative z-10 w-full rounded-t-[2rem] bg-[#1C2030] px-5 pb-6 pt-5">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#3A3F50]" />
            <h3 className="text-2xl font-bold tracking-tight text-white">Reemplazar ejercicio</h3>
            <p className="mt-2 text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Elegí otra variante disponible en tus rutinas.
            </p>

            <div className="mt-5 rounded-2xl border border-[#2A2F3D] bg-[#131313] px-4 py-3">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-[#7E8799]" />
                <input
                  value={replaceQuery}
                  onChange={(event) => setReplaceQuery(event.target.value)}
                  placeholder="Buscar por ejercicio, músculo o implemento"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#7E8799]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            <div className="mt-5 flex max-h-[24rem] flex-col gap-3 overflow-y-auto pr-1">
              {filteredReplacementOptions.length > 0 ? (
                filteredReplacementOptions.map((exercise) => (
                  <button
                    key={exercise.name}
                    onClick={() => replaceCurrentExercise(exercise)}
                    className="rounded-2xl border border-[#2A2F3D] bg-[#131313] p-4 text-left"
                    type="button"
                  >
                    <p className="text-lg font-bold text-white">{exercise.name}</p>
                    <p className="mt-1 text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {exercise.muscle}
                      {exercise.implement ? ` - ${exercise.implement}` : ''}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exercise.sets.slice(0, 3).map((set, index) => (
                        <span
                          key={`${exercise.name}-${index}`}
                          className="rounded-full bg-[rgba(18,239,211,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]"
                        >
                          {set.kg > 0 ? `${formatWeightNumber(set.kg, appSettings.weightUnit)}${weightUnitLabel}` : 'PC'} x {set.reps}
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-[#2A2F3D] bg-[#131313] p-5 text-sm text-[#A1A1A1]">
                  No encontramos ejercicios que coincidan con tu búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDatabaseExercisePicker && (
        <div className="absolute inset-0 z-40 flex items-end">
          <button
            aria-label="Cerrar selector de base de ejercicios"
            className="absolute inset-0 bg-black/70"
            onClick={closeDatabaseExercisePicker}
            type="button"
          />
          <div className="relative z-10 w-full rounded-t-[2rem] bg-[#1C2030] px-5 pb-6 pt-5">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#3A3F50]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#12EFD3]">
              Base de ejercicios
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Agregar Ejercicio</h3>
            <p className="mt-2 text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {isHistoryEditSession
                ? 'Elegí ejercicios ya existentes en tus rutinas para sumarlos a esta sesión del historial.'
                : 'Elegí ejercicios ya existentes en tus rutinas para sumarlos a este entrenamiento libre.'}
            </p>

            <div className="mt-5 rounded-2xl border border-[#2A2F3D] bg-[#131313] px-4 py-3">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-[#7E8799]" />
                <input
                  value={databaseQuery}
                  onChange={(event) => setDatabaseQuery(event.target.value)}
                  placeholder="Buscar por ejercicio, músculo o implemento"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#7E8799]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            <div className="mt-5 flex max-h-[24rem] flex-col gap-3 overflow-y-auto pr-1">
              {filteredDatabaseExerciseOptions.length > 0 ? (
                filteredDatabaseExerciseOptions.map((exercise) => (
                  <button
                    key={exercise.name}
                    onClick={() => addDatabaseExercise(exercise)}
                    className="rounded-2xl border border-[#2A2F3D] bg-[#131313] p-4 text-left"
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-white">{exercise.name}</p>
                        <p className="mt-1 text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {exercise.muscle}
                          {exercise.implement ? ` - ${exercise.implement}` : ''}
                        </p>
                      </div>
                      <div className="rounded-full bg-[rgba(18,239,211,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]">
                        Agregar
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {exercise.sets.slice(0, 3).map((set, index) => (
                        <span
                          key={`${exercise.name}-${index}`}
                          className="rounded-full bg-[rgba(18,239,211,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]"
                        >
                          {set.kg > 0 ? `${formatWeightNumber(set.kg, appSettings.weightUnit)}${weightUnitLabel}` : 'PC'} x {set.reps}
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-[#2A2F3D] bg-[#131313] p-5 text-sm text-[#A1A1A1]">
                  No hay ejercicios disponibles para agregar con esa búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddExercise && (
        <div className="absolute inset-0 z-40 flex items-end">
          <button
            aria-label="Cerrar carga manual"
            className="absolute inset-0 bg-black/70"
            onClick={closeAddExercise}
            type="button"
          />
          <div className="relative z-10 w-full rounded-t-[2rem] bg-[#1C2030] px-5 pb-6 pt-5">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#3A3F50]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F5B942]">
              {isHistoryEditSession ? 'Edición del historial' : 'Sesión libre'}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Agregar Nuevo Ejercicio</h3>
            <p className="mt-2 text-sm text-[#D8C9A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {isHistoryEditSession
                ? 'Cargá el ejercicio para completar o corregir esta sesión guardada.'
                : 'Cargá el ejercicio para empezar o seguir tu entrenamiento libre.'}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="manual-exercise-name"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#F5B942]"
                >
                  Nombre del ejercicio
                </label>
                <input
                  id="manual-exercise-name"
                  value={newExerciseName}
                  onChange={(event) => setNewExerciseName(event.target.value)}
                  placeholder="Ej. Press militar con mancuernas"
                  className="w-full rounded-2xl border border-[rgba(245,185,66,0.16)] bg-[#131313] px-4 py-3 text-white outline-none transition-colors focus:border-[rgba(245,185,66,0.4)]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="manual-exercise-muscle"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#F5B942]"
                >
                  Músculo principal
                </label>
                <input
                  id="manual-exercise-muscle"
                  value={newExerciseMuscle}
                  onChange={(event) => setNewExerciseMuscle(event.target.value)}
                  placeholder="Ej. Hombros"
                  className="w-full rounded-2xl border border-[rgba(245,185,66,0.16)] bg-[#131313] px-4 py-3 text-white outline-none transition-colors focus:border-[rgba(245,185,66,0.4)]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="manual-exercise-implement"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#F5B942]"
                >
                  Implemento o variante
                </label>
                <input
                  id="manual-exercise-implement"
                  value={newExerciseImplement}
                  onChange={(event) => setNewExerciseImplement(event.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-2xl border border-[rgba(245,185,66,0.16)] bg-[#131313] px-4 py-3 text-white outline-none transition-colors focus:border-[rgba(245,185,66,0.4)]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="mt-2 flex flex-col gap-3">
                <button
                  onClick={addManualExercise}
                  disabled={!newExerciseName.trim() || !newExerciseMuscle.trim()}
                  className="w-full rounded-2xl bg-[#F5B942] py-4 font-bold text-[#1A1300] disabled:opacity-50"
                  type="button"
                >
                  Agregar ejercicio
                </button>
                <button
                  onClick={closeAddExercise}
                  className="w-full rounded-2xl bg-[#131313] py-4 font-semibold text-white"
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRestConfig && (
        <div className="absolute inset-0 z-40 flex items-center justify-center px-5">
          <button
            aria-label="Cerrar descanso"
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowRestConfig(false)}
            type="button"
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#1C2030] p-6">
            <h3 className="text-center text-2xl font-bold text-white">Configurar descanso</h3>
            <p className="mt-2 text-center text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Ajustá cuántos segundos querés entre series.
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setRestConfig((value) => Math.max(15, value - 15))}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#131313] text-2xl text-white"
                type="button"
              >
                -
              </button>
              <div className="min-w-[8rem] rounded-2xl border border-[rgba(18,239,211,0.16)] bg-[#131313] px-4 py-4 text-center">
                <span className="text-3xl font-bold text-white">{restConfig}</span>
                <span className="ml-1 text-sm font-semibold uppercase tracking-widest text-[#12EFD3]">seg</span>
              </div>
              <button
                onClick={() => setRestConfig((value) => Math.min(600, value + 15))}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#131313] text-2xl text-white"
                type="button"
              >
                +
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setRestTime(restConfig);
                  setShowRestConfig(false);
                }}
                className="w-full rounded-2xl bg-[#12EFD3] py-4 font-bold text-black"
                type="button"
              >
                Guardar descanso
              </button>
              <button
                onClick={() => setShowRestConfig(false)}
                className="w-full rounded-2xl bg-[#131313] py-4 font-semibold text-white"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center px-5">
          <button
            aria-label="Cerrar finalización"
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowFinishModal(false)}
            type="button"
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#1C2030] p-6">
            <h3 className="text-center text-3xl font-bold tracking-tight text-white">
              {isHistoryEditSession ? '¿Guardar cambios de la sesión?' : '¿Finalizar entrenamiento?'}
            </h3>
            <p className="mt-3 text-center text-base text-[#D4D4D4]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {isHistoryEditSession
                ? `Vas a actualizar esta sesión con ${totalSetsCompleted}/${totalSets} series completas en ${formatTime(elapsed)} totales.`
                : `Llevas ${formatTime(elapsed)} entrenando y completaste ${totalSetsCompleted}/${totalSets} series.`}
            </p>
            {!hasExercises && (
              <p className="mt-3 text-center text-sm text-[#F5B942]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {isHistoryEditSession
                  ? 'Agregá al menos un ejercicio para guardar los cambios, o descartalos.'
                  : 'Agregá al menos un ejercicio para guardar esta sesión, o descartala.'}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => void finishSession()}
                disabled={!hasExercises}
                className="w-full rounded-2xl bg-[#F43A33] py-4 font-bold text-white disabled:opacity-45"
                type="button"
              >
                {isHistoryEditSession ? 'Guardar cambios' : 'Finalizar entrenamiento'}
              </button>
              <button
                onClick={() => setShowFinishModal(false)}
                className="w-full rounded-2xl bg-[#2A2A2A] py-4 font-semibold text-white"
                type="button"
              >
                {isHistoryEditSession ? 'Seguir editando' : 'Continuar'}
              </button>
              <button
                onClick={discardSession}
                className="w-full rounded-2xl border border-[rgba(229,57,53,0.2)] bg-[rgba(229,57,53,0.08)] py-4 font-semibold text-[#FF7D7D]"
                type="button"
              >
                {isHistoryEditSession ? 'Descartar cambios' : 'Descartar entrenamiento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
