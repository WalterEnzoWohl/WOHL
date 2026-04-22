import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  GripVertical,
  History,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TimerReset,
  Trash2,
  X,
} from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router';
import { brandLogoWhite } from '@/assets';
import { NumberWheelPicker } from '@/features/onboarding/components/WheelPickers';
import type { WheelPickerOption } from '@/features/onboarding/components/WheelPickers';
import { buildExerciseTemplateFromCatalog } from '@/features/exercises/lib/exerciseCatalog';
import { useExerciseCatalog } from '@/features/exercises/hooks/useExerciseCatalog';
import { ActiveWorkoutEditLockModal } from '@/shared/components/layout/ActiveWorkoutEditLockModal';
import { TrainingExerciseCard } from '@/features/session/components/TrainingExerciseCard';
import {
  buildExerciseState,
  buildExerciseStateFromHistorySession,
  buildExerciseStateFromTemplate,
  buildManualExerciseState,
  DEFAULT_REST,
  type ExerciseState,
  formatTime,
  FREE_SESSION_FOCUS,
  FREE_SESSION_NAME,
  isBodyweightExercise,
  markExerciseSetsCompleted,
} from '@/features/session/lib/sessionDrafts';
import { useAppData } from '@/core/app-data/AppDataContext';
import type {
  ActiveWorkoutDraft,
  ActiveWorkoutSet,
  ExerciseData,
  SessionHistory,
} from '@/shared/types/models';
import { formatWeightNumber, getAutoWeightIncrementKg, getWeightUnitLabel, parseWeightInputValue } from '@/shared/lib/unitUtils';

type SessionLocationState = {
  routineId?: number;
  dayName?: string;
  mode?: 'free' | 'history-edit';
  action?: 'finish';
  sessionId?: number;
};

type SetState = ActiveWorkoutSet;

type ExerciseHistoryEntry = {
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  sets: SessionHistory['exercises'][number]['sets'];
  maxKg: number;
  notes?: string;
};

type ShellBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const REST_OPTIONS: WheelPickerOption[] = [
  { value: '30', label: '30s' },
  { value: '45', label: '45s' },
  { value: '60', label: '1min' },
  { value: '90', label: '1min 30s' },
  { value: '120', label: '2min' },
  { value: '180', label: '3min' },
  { value: '240', label: '4min' },
];

const REST_VALID_VALUES = new Set(REST_OPTIONS.map((option) => option.value));

export default function TrainingSessionPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: SessionLocationState };
  const {
    catalog: exerciseCatalog,
    error: exerciseCatalogError,
    isLoading: isExerciseCatalogLoading,
  } = useExerciseCatalog();
  const {
    activeWorkout,
    appContext,
    appSettings,
    clearActiveWorkout,
    completeSession: completeSessionRecord,
    deleteSession: deleteSessionRecord,
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
      <div className="min-h-screen bg-[#102235]">
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
        style={{ background: '#102235', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="flex h-16 items-center border-b border-[#203347] px-5" style={{ background: '#0B1F33' }}>
          <button className="-ml-2 p-2" onClick={() => navigate(-1)} type="button">
            <Menu size={18} className="text-[#00C9A7]" />
          </button>
        </div>
        <div className="px-5 py-6 text-sm text-[#9BAEC1]">No se encontró la sesión que querías editar.</div>
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
  const baseSessionFocus =
    resumedWorkout?.sessionFocus ??
    historicalSession?.sessionFocus ??
    (isFreeSession ? FREE_SESSION_FOCUS : currentDay?.focus ?? 'Entrenamiento guiado');
  const sessionAccent = isFreeSession ? '#F5B942' : isHistoryEditSession ? '#7F98FF' : '#00C9A7';
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
  const [elapsed, setElapsed] = useState(() =>
    isHistoryEditSession
      ? (historicalSession?.duration ?? 0) * 60
      : Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
  );
  const [restActive, setRestActive] = useState(false);
  const [restTime, setRestTime] = useState(appSettings.restTimerSeconds || DEFAULT_REST);
  const [restConfig, setRestConfig] = useState(appSettings.restTimerSeconds || DEFAULT_REST);
  const [notes, setNotes] = useState(resumedWorkout?.notes ?? historicalSession?.notes ?? '');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showExerciseHistory, setShowExerciseHistory] = useState(false);
  const [showReplaceExercise, setShowReplaceExercise] = useState(false);
  const [showRestPicker, setShowRestPicker] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showDatabaseExercisePicker, setShowDatabaseExercisePicker] = useState(false);
  const [restPickerDraft, setRestPickerDraft] = useState('90');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [databaseQuery, setDatabaseQuery] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseMuscle, setNewExerciseMuscle] = useState('');
  const [newExerciseImplement, setNewExerciseImplement] = useState('');
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);
  const [inlineFeedback, setInlineFeedback] = useState<string | null>(null);
  const [exerciseMenuAnchor, setExerciseMenuAnchor] = useState<{ exerciseIdx: number; rect: DOMRect } | null>(null);
  const [setMenuAnchor, setSetMenuAnchor] = useState<{
    exerciseIdx: number;
    setIdx: number;
    rect: DOMRect;
  } | null>(null);
  const [sessionExerciseDetail, setSessionExerciseDetail] = useState<{
    name: string;
    titleEn: string;
    animationMediaUrl?: string;
    muscle: string;
    secondaryMuscles: string[];
    implement?: string;
    instructions: string[];
    overview: string;
  } | null>(null);
  const [sessionOverlayBounds, setSessionOverlayBounds] = useState<ShellBounds | null>(null);
  const [reorderDragState, setReorderDragState] = useState<{ fromIndex: number; toIndex: number } | null>(null);
  const reorderDragStateRef = useRef<{ fromIndex: number; toIndex: number } | null>(null);
  const reorderListRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sessionTimeLimitRef = useRef(false);

  const sessionFocus = useMemo(() => {
    const uniqueMuscles: string[] = [];
    const seenMuscles = new Set<string>();

    for (const exercise of exerciseList) {
      const muscle = exercise.muscle?.trim();
      if (!muscle) {
        continue;
      }

      const normalizedMuscle = muscle.toLowerCase();
      if (seenMuscles.has(normalizedMuscle)) {
        continue;
      }

      seenMuscles.add(normalizedMuscle);
      uniqueMuscles.push(muscle);
    }

    return uniqueMuscles.length > 0 ? uniqueMuscles.join(', ') : baseSessionFocus;
  }, [baseSessionFocus, exerciseList]);

  const syncSessionOverlayBounds = useCallback(() => {
    if (typeof window === 'undefined') return;

    const shell = document.querySelector<HTMLElement>('.wohl-shell');
    if (shell) {
      const rect = shell.getBoundingClientRect();
      setSessionOverlayBounds({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      return;
    }

    setSessionOverlayBounds({
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useLayoutEffect(() => {
    if (!(sessionExerciseDetail || showExerciseHistory || showReplaceExercise || showReorderModal || showFinishModal || showDeleteSessionModal) || typeof window === 'undefined') {
      return;
    }

    syncSessionOverlayBounds();

    const viewport = window.visualViewport;
    window.addEventListener('resize', syncSessionOverlayBounds);
    viewport?.addEventListener('resize', syncSessionOverlayBounds);
    viewport?.addEventListener('scroll', syncSessionOverlayBounds);

    return () => {
      window.removeEventListener('resize', syncSessionOverlayBounds);
      viewport?.removeEventListener('resize', syncSessionOverlayBounds);
      viewport?.removeEventListener('scroll', syncSessionOverlayBounds);
    };
  }, [sessionExerciseDetail, showExerciseHistory, showReplaceExercise, showReorderModal, showFinishModal, showDeleteSessionModal, syncSessionOverlayBounds]);

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
      setExerciseMenuAnchor(null);
      setSetMenuAnchor(null);
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

  useEffect(() => {
    if (!inlineFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => setInlineFeedback(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [inlineFeedback]);

  useEffect(() => {
    if (isHistoryEditSession || elapsed < 14400 || sessionTimeLimitRef.current) {
      return;
    }
    sessionTimeLimitRef.current = true;
    setShowFinishModal(true);
  }, [elapsed, isHistoryEditSession]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => closeContextMenus();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const currentExercise = exerciseList[currentExIdx] ?? null;
  const catalogExerciseTemplates = useMemo(
    () => exerciseCatalog.map((exercise) => buildExerciseTemplateFromCatalog(exercise)),
    [exerciseCatalog]
  );

  const catalogBySlug = useMemo(
    () => new Map(exerciseCatalog.filter((e) => Boolean(e.coverImageUrl)).map((e) => [e.slug, e])),
    [exerciseCatalog]
  );
  const catalogSummaryBySlug = useMemo(
    () => new Map(exerciseCatalog.map((exercise) => [exercise.slug, exercise])),
    [exerciseCatalog]
  );
  const fallbackExerciseTemplates = useMemo(
    () =>
      routines
        .flatMap((item) => item.days.flatMap((day) => day.exercises))
        .filter(
          (exercise, index, array) =>
            array.findIndex((candidate) => {
              const candidateKey = candidate.exerciseSlug?.toLowerCase() ?? candidate.name.toLowerCase();
              const exerciseKey = exercise.exerciseSlug?.toLowerCase() ?? exercise.name.toLowerCase();
              return candidateKey === exerciseKey;
            }) === index
        ),
    [routines]
  );
  const exerciseCatalogTemplates =
    catalogExerciseTemplates.length > 0 ? catalogExerciseTemplates : fallbackExerciseTemplates;
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
  const missingSets = exerciseList.flatMap((exercise, exerciseIdx) =>
    exercise.sets
      .map((set, setIdx) => ({ exercise, exerciseIdx, set, setIdx }))
      .filter(({ set }) => !set.completed)
  );
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
                  notes: exercise.notes,
                }))
        )
        .slice(0, 6)
    : [];

  const replacementOptions = useMemo(() => {
    if (!currentExercise) {
      return [];
    }

    const currentIdentity =
      currentExercise.exerciseSlug?.toLowerCase() ?? currentExercise.name.toLowerCase();

    return exerciseCatalogTemplates.filter((exercise) => {
      const exerciseIdentity =
        exercise.exerciseSlug?.toLowerCase() ?? exercise.name.toLowerCase();
      return exerciseIdentity !== currentIdentity;
    });
  }, [currentExercise, exerciseCatalogTemplates]);

  const databaseExerciseOptions = useMemo(() => {
    const currentNames = new Set(
      exerciseList.map((exercise) => exercise.exerciseSlug?.toLowerCase() ?? exercise.name.toLowerCase())
    );

    return exerciseCatalogTemplates.filter((exercise) => {
      const exerciseIdentity =
        exercise.exerciseSlug?.toLowerCase() ?? exercise.name.toLowerCase();
      return !currentNames.has(exerciseIdentity);
    });
  }, [exerciseCatalogTemplates, exerciseList]);

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

  const closeContextMenus = () => {
    setExerciseMenuAnchor(null);
    setSetMenuAnchor(null);
  };

  const buildSessionExerciseDetail = useCallback(
    (exercise: Pick<ExerciseData, 'exerciseSlug' | 'name' | 'muscle' | 'implement' | 'secondaryMuscles'> | null) => {
      if (!exercise) {
        return null;
      }

      const catalogSummary = exercise.exerciseSlug
        ? catalogSummaryBySlug.get(exercise.exerciseSlug)
        : exerciseCatalog.find((entry) => entry.title === exercise.name);
      const fallbackTemplate = exercise.exerciseSlug
        ? exerciseCatalogTemplates.find((entry) => entry.exerciseSlug === exercise.exerciseSlug)
        : exerciseCatalogTemplates.find((entry) => entry.name === exercise.name);

      if (!catalogSummary && !fallbackTemplate) {
        return null;
      }

      const secondaryMuscles = catalogSummary?.secondaryMuscles ?? fallbackTemplate?.secondaryMuscles ?? exercise.secondaryMuscles ?? [];
      const implement = catalogSummary?.implement ?? fallbackTemplate?.implement ?? exercise.implement;

      return {
        name: catalogSummary?.title ?? fallbackTemplate?.name ?? exercise.name,
        titleEn:
          exercise.exerciseSlug?.replace(/-/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase()) ??
          exercise.name,
        animationMediaUrl: catalogSummary?.animationMediaUrl,
        muscle: catalogSummary?.muscle ?? fallbackTemplate?.muscle ?? exercise.muscle,
        secondaryMuscles,
        implement,
        instructions: catalogSummary?.instructions ?? [],
        overview: catalogSummary?.overview ?? '',
      };
    },
    [catalogSummaryBySlug, exerciseCatalog, exerciseCatalogTemplates]
  );

  const openSessionExerciseDetail = useCallback(
    (exercise: Pick<ExerciseData, 'exerciseSlug' | 'name' | 'muscle' | 'implement' | 'secondaryMuscles'> | null) => {
      const detail = buildSessionExerciseDetail(exercise);
      if (!detail) {
        return false;
      }

      setSessionExerciseDetail(detail);
      return true;
    },
    [buildSessionExerciseDetail]
  );

  const buildExerciseOptionSummary = (exercise: ExerciseData) => {
    const baseReps = exercise.sets[0]?.reps ?? 10;
    const repsLabel = exercise.sets.every((set) => set.reps === baseReps)
      ? `${baseReps} reps`
      : `${exercise.sets[0]?.reps ?? 0}-${exercise.sets[exercise.sets.length - 1]?.reps ?? 0} reps`;

    return `${exercise.sets.length} series base - ${repsLabel}`;
  };

  const updateInlineFeedback = (message: string | null) => {
    setInlineFeedback(message);
  };

  const moveExercise = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    setExerciseList((previous) => {
      const next = [...previous];
      const [movedExercise] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, movedExercise);
      return next;
    });

    setCurrentExIdx(toIndex);
  };

  const reorderDisplayList = (() => {
    if (!reorderDragState || reorderDragState.fromIndex === reorderDragState.toIndex) {
      return exerciseList;
    }
    const arr = [...exerciseList];
    const [item] = arr.splice(reorderDragState.fromIndex, 1);
    arr.splice(reorderDragState.toIndex, 0, item);
    return arr;
  })();

  const handleReorderPointerDown = (e: React.PointerEvent, idx: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    navigator.vibrate?.(12);
    const state = { fromIndex: idx, toIndex: idx };
    reorderDragStateRef.current = state;
    setReorderDragState(state);
  };

  const handleReorderPointerMove = (e: React.PointerEvent) => {
    if (!reorderDragStateRef.current || !reorderListRef.current) return;
    const children = Array.from(reorderListRef.current.children) as HTMLElement[];
    let newTo = children.length - 1;
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) { newTo = i; break; }
    }
    if (newTo !== reorderDragStateRef.current.toIndex) {
      const updated = { ...reorderDragStateRef.current, toIndex: newTo };
      reorderDragStateRef.current = updated;
      setReorderDragState(updated);
    }
  };

  const handleReorderPointerUp = () => {
    if (!reorderDragStateRef.current) return;
    const { fromIndex, toIndex } = reorderDragStateRef.current;
    reorderDragStateRef.current = null;
    setReorderDragState(null);
    if (fromIndex !== toIndex) moveExercise(fromIndex, toIndex);
  };

  const updateExerciseNotes = (exerciseIdx: number, value: string) => {
    setCurrentExIdx(exerciseIdx);
    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) =>
        candidateExerciseIdx === exerciseIdx ? { ...exercise, notes: value } : exercise
      )
    );
  };

  const updateSetValue = (
    exerciseIdx: number,
    setIdx: number,
    field: 'kg' | 'reps',
    value: string
  ) => {
    const targetExercise = exerciseList[exerciseIdx];
    if (!targetExercise) {
      return;
    }

    setCurrentExIdx(exerciseIdx);
    updateInlineFeedback(null);

    const numericValue =
      field === 'kg' ? parseWeightInputValue(value, appSettings.weightUnit) : Number.parseFloat(value) || 0;

    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        const suggestionField = field === 'kg' ? 'suggestedKg' : 'suggestedReps';
        const nextSets = exercise.sets.map((set, index) => {
          if (index === setIdx) {
            return { ...set, [field]: numericValue };
          }

          if (index <= setIdx) {
            return set;
          }

          const shouldPropagate = !set.completed && set[field] === 0;

          if (!shouldPropagate) {
            return set;
          }

          return { ...set, [suggestionField]: numericValue };
        });

        return {
          ...exercise,
          sets: nextSets,
        };
      })
    );
  };

  const buildNewSet = (targetExercise: ExerciseState, kind: SetState['kind'] = 'normal'): SetState => {
    const lastSet = targetExercise.sets[targetExercise.sets.length - 1];
    const referenceKg = lastSet?.kg || lastSet?.suggestedKg || lastSet?.prevKg || 0;
    const referenceReps = lastSet?.reps || lastSet?.suggestedReps || lastSet?.prevReps || 0;

    return {
      id: targetExercise.sets.length + 1,
      kg: 0,
      reps: 0,
      rpe: 0,
      completed: isHistoryEditSession,
      prevKg: lastSet?.prevKg ?? referenceKg,
      prevReps: lastSet?.prevReps ?? referenceReps,
      suggestedKg:
        kind === 'warmup'
          ? referenceKg || undefined
          : appSettings.autoWeightIncrement && referenceKg > 0
          ? Number((referenceKg + getAutoWeightIncrementKg(appSettings.weightUnit)).toFixed(2))
          : referenceKg || undefined,
      suggestedReps: referenceReps || undefined,
      kind,
    };
  };

  const addSetOfKind = (exerciseIdx: number, kind: SetState['kind']) => {
    const targetExercise = exerciseList[exerciseIdx];
    if (!targetExercise) {
      return;
    }

    setCurrentExIdx(exerciseIdx);
    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        return { ...exercise, sets: [...exercise.sets, buildNewSet(exercise, kind)] };
      })
    );
  };

  const addSet = (exerciseIdx: number) => addSetOfKind(exerciseIdx, 'normal');

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

    setSetMenuAnchor(null);
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

    setSetMenuAnchor(null);
  };

  const getSuggestedSetValues = (set: SetState) => ({
    kg: set.suggestedKg ?? (appSettings.showPreviousWeight ? set.prevKg : 0) ?? 0,
    reps: set.suggestedReps ?? (appSettings.showPreviousWeight ? set.prevReps : 0) ?? 0,
  });

  const getEffectiveSetValues = (set: SetState) => {
    const suggested = getSuggestedSetValues(set);

    return {
      kg: set.kg > 0 ? set.kg : suggested.kg,
      reps: set.reps > 0 ? set.reps : suggested.reps,
    };
  };

  const isSetReadyToComplete = (exercise: ExerciseState, set: SetState) => {
    const effectiveSet = getEffectiveSetValues(set);

    if (isBodyweightExercise(exercise)) {
      return effectiveSet.reps > 0;
    }

    return effectiveSet.kg > 0 && effectiveSet.reps > 0;
  };

  const completeSet = (exerciseIdx: number, setIdx: number) => {
    const targetExercise = exerciseList[exerciseIdx];

    if (!targetExercise) {
      return;
    }

    const targetSet = targetExercise.sets[setIdx];
    if (!targetSet) {
      return;
    }

    setCurrentExIdx(exerciseIdx);

    if (!targetSet.completed && !isSetReadyToComplete(targetExercise, targetSet)) {
      updateInlineFeedback(
        isBodyweightExercise(targetExercise)
          ? 'Completá al menos las repeticiones antes de marcar la serie.'
          : 'Cargá peso y repeticiones antes de marcar la serie.'
      );
      return;
    }

    updateInlineFeedback(null);
    const nextCompleted = !targetSet.completed;

    setExerciseList((previous) =>
      previous.map((exercise, candidateExerciseIdx) => {
        if (candidateExerciseIdx !== exerciseIdx) {
          return exercise;
        }

        const nextSetValues = getEffectiveSetValues(targetSet);

        return {
          ...exercise,
          sets: exercise.sets.map((set, index) =>
            index === setIdx
              ? {
                  ...set,
                  kg: nextCompleted ? nextSetValues.kg : set.kg,
                  reps: nextCompleted ? nextSetValues.reps : set.reps,
                  completed: nextCompleted,
                }
              : set
          ),
        };
      })
    );

    if (nextCompleted && !isHistoryEditSession) {
      setRestTime(restConfig);
      setRestActive(true);
    }
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
    setRestActive(false);
    setDatabaseQuery('');
    setShowDatabaseExercisePicker(false);
  };

  const scrollToExercise = (exerciseIdx: number) => {
    setCurrentExIdx(exerciseIdx);
    const container = scrollContainerRef.current;
    const target = document.getElementById(`session-exercise-${exerciseIdx}`);

    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const nextTop = container.scrollTop + (targetRect.top - containerRect.top) - 24;
      container.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    }
  };

  const jumpToMissingSet = (exerciseIdx: number) => {
    setShowFinishModal(false);
    scrollToExercise(exerciseIdx);
  };

  const finishSession = async () => {
    if (isSubmittingSession) {
      return;
    }

    setIsSubmittingSession(true);

    try {
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
    } finally {
      setIsSubmittingSession(false);
    }
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

  const deleteHistoricalSession = async () => {
    if (!historicalSession) {
      return;
    }

    await deleteSessionRecord(historicalSession.id);
    setShowDeleteSessionModal(false);
    setShowFinishModal(false);
    navigate('/history');
  };

  const deleteCurrentExercise = () => {
    const targetIndex = exerciseMenuAnchor?.exerciseIdx ?? currentExIdx;
    const targetExercise = exerciseList[targetIndex];

    if (!targetExercise) {
      closeContextMenus();
      return;
    }

    if (exerciseList.length <= 1) {
      setExerciseList([]);
      setCurrentExIdx(0);
      closeContextMenus();
      return;
    }

    setExerciseList((previous) => previous.filter((_, index) => index !== targetIndex));
    setCurrentExIdx((current) => Math.max(0, Math.min(current, exerciseList.length - 2)));
    closeContextMenus();
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
    setReplaceQuery('');
    setShowReplaceExercise(false);
    closeContextMenus();
  };

  const adjustRestBy = (seconds: number) => {
    setRestConfig((value) => Math.max(15, Math.min(600, value + seconds)));
    setRestTime((value) => {
      const targetValue = restActive ? value + seconds : restConfig + seconds;
      return Math.max(0, Math.min(600, targetValue));
    });
  };

  const openRestEditor = () => {
    const currentValue = String(restConfig);
    setRestPickerDraft(REST_VALID_VALUES.has(currentValue) ? currentValue : '90');
    setShowRestPicker(true);
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
        const exerciseSlug = currentExercise?.exerciseSlug;
        setExerciseMenuAnchor(null);
        if (exerciseSlug) {
          void navigate(`/muscle-progress/${exerciseSlug}`);
          return;
        }

        setShowExerciseHistory(true);
      },
    },
    {
      label: 'Reemplazar ejercicio',
      icon: RefreshCw,
      onClick: () => {
        setExerciseMenuAnchor(null);
        setShowReplaceExercise(true);
      },
    },
    {
      label: 'Editar Descanso',
      icon: TimerReset,
      onClick: () => {
        setExerciseMenuAnchor(null);
        openRestEditor();
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
      disabled: !buildSessionExerciseDetail(currentExercise),
      onClick: () => {
        if (openSessionExerciseDetail(currentExercise)) {
          setExerciseMenuAnchor(null);
        }
      },
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
      style={{ background: '#102235', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="sticky top-0 z-30 shrink-0 border-b border-[#203347] px-5 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
        style={{ background: '#0B1F33', paddingTop: 'var(--wohl-safe-top)' }}
      >
        <div className="flex h-16 items-center justify-between">
          <button
            className="-ml-2 p-2"
            onClick={() =>
              isHistoryEditSession && historicalSession ? navigate(`/session-history/${historicalSession.id}`) : navigate('/')
            }
            type="button"
          >
            <Menu size={18} className="text-[#00C9A7]" />
          </button>
          <div className="flex items-center gap-2">
            <img src={brandLogoWhite} alt="WOHL" className="h-7 w-7 object-contain" />
            <span className="text-lg font-extrabold italic uppercase tracking-tight text-white">WOHL</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(0,201,167,0.2)] bg-[#1A2D42] px-3 py-1.5">
              <div className={`h-1.5 w-1.5 rounded-full bg-[#00C9A7] ${isHistoryEditSession ? '' : 'animate-pulse'}`} />
              <span className="text-sm font-bold text-[#00C9A7]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatTime(elapsed)}
              </span>
            </div>
            <button
              onClick={() => setShowFinishModal(true)}
              disabled={isSubmittingSession}
              className="rounded-full border border-[rgba(0,201,167,0.22)] bg-[rgba(0,201,167,0.12)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00C9A7] transition-colors active:bg-[rgba(0,201,167,0.18)] disabled:opacity-45"
              type="button"
            >
              {isHistoryEditSession ? 'Guardar' : 'Finalizar'}
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5 px-4 py-5 pb-52">
          <div className="flex items-end justify-between">
            <div>
              <p
                className="mb-1 text-xs uppercase tracking-widest text-[#9BAEC1]"
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
                    className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#0B1F33]"
                    style={{ background: sessionAccent }}
                  >
                    {sessionBadgeLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#9BAEC1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {sessionFocus}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="relative overflow-hidden rounded-xl bg-[#13263A] p-5"
              style={{ borderLeft: '4px solid rgba(0,201,167,0.4)' }}
            >
              <p
                className="mb-3 text-[10px] uppercase tracking-widest text-[#9BAEC1]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Volumen total
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white">
                  {formatWeightNumber(totalVolume, appSettings.weightUnit, 0)}
                </span>
                <span className="text-sm font-bold italic text-[#9BAEC1]">{weightUnitLabel}</span>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-xl bg-[#13263A] p-5"
              style={{ borderLeft: '4px solid rgba(127,152,255,0.4)' }}
            >
              <p
                className="mb-3 text-[10px] uppercase tracking-widest text-[#9BAEC1]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Series completas
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white">{totalSetsCompleted}</span>
                <span className="text-sm font-bold italic text-[#9BAEC1]">/ {totalSets}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isHistoryEditSession && (
              <button
                onClick={() => setShowDeleteSessionModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(229,57,53,0.22)] bg-[rgba(229,57,53,0.08)] py-4 text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.14)]"
                type="button"
              >
                <Trash2 size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Eliminar entrenamiento</span>
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-[#203347] bg-[#13263A] p-4">
            <label
              htmlFor="session-notes"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#00C9A7]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Notas de la sesión
            </label>
            <textarea
              id="session-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Añadí notas sobre tu sesión, sensaciones o ajustes para la próxima..."
              className="h-24 w-full resize-none rounded-xl border border-[rgba(0,201,167,0.15)] bg-[#1A2D42] p-4 text-sm text-white outline-none transition-colors focus:border-[rgba(0,201,167,0.45)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {inlineFeedback && (
            <div className="rounded-2xl border border-[rgba(245,185,66,0.22)] bg-[rgba(245,185,66,0.08)] px-4 py-3 text-sm text-[#F5D38A]">
              {inlineFeedback}
            </div>
          )}

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
                className="flex items-center justify-center gap-2 rounded-2xl border border-[rgba(0,201,167,0.22)] bg-[rgba(0,201,167,0.08)] px-3 py-4 text-[#00C9A7] transition-colors active:bg-[rgba(0,201,167,0.14)]"
                type="button"
              >
                <Search size={18} />
                <span className="text-sm font-semibold">Agregar Ejercicio</span>
              </button>
            </div>
          )}

          {hasExercises ? (
            <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 500, delayMouseStart: 500 }}>
              <div className="flex flex-col gap-4">
                {exerciseList.map((exercise, exerciseIdx) => {
                  const catalogEntry = exercise.exerciseSlug
                    ? catalogBySlug.get(exercise.exerciseSlug)
                    : undefined;
                  return (
                  <TrainingExerciseCard
                    key={`${exercise.id}-${exerciseIdx}`}
                    htmlId={`session-exercise-${exerciseIdx}`}
                    exercise={exercise}
                    exerciseIdx={exerciseIdx}
                    totalExercises={exerciseList.length}
                    currentExerciseIndex={currentExIdx}
                    weightUnit={appSettings.weightUnit}
                    weightUnitLabel={weightUnitLabel}
                    showPreviousWeight={appSettings.showPreviousWeight}
                    coverImageUrl={catalogEntry?.coverImageUrl}
                    onThumbnailClick={catalogEntry ? () => void openSessionExerciseDetail(exercise) : undefined}
                    onMoveExercise={moveExercise}
                    onExerciseFocus={setCurrentExIdx}
                    onExerciseMenu={(targetExerciseIdx, rect) => {
                      setCurrentExIdx(targetExerciseIdx);
                      setSetMenuAnchor(null);
                      setExerciseMenuAnchor({ exerciseIdx: targetExerciseIdx, rect });
                    }}
                    onSetMenu={(targetExerciseIdx, setIdx, rect) => {
                      setCurrentExIdx(targetExerciseIdx);
                      setExerciseMenuAnchor(null);
                      setSetMenuAnchor({ exerciseIdx: targetExerciseIdx, setIdx, rect });
                    }}
                    onSetValueChange={updateSetValue}
                    onSetToggleComplete={completeSet}
                    onExerciseNotesChange={updateExerciseNotes}
                    onAddSet={addSet}
                    onRemoveLastSet={(targetExerciseIdx) =>
                      removeSet(targetExerciseIdx, exerciseList[targetExerciseIdx].sets.length - 1)
                    }
                    onOpenRestTimer={() => {
                      openRestEditor();
                    }}
                    onReorderClick={() => setShowReorderModal(true)}
                  />
                  );
                })}
              </div>
            </DndProvider>
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
          {hasExercises && (
            <button
              onClick={() => setShowFinishModal(true)}
              disabled={isSubmittingSession}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(0,201,167,0.18)] bg-[rgba(0,201,167,0.1)] py-4 transition-colors active:bg-[rgba(0,201,167,0.16)] disabled:opacity-45"
              type="button"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#00C9A7]/40">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00C9A7]" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#00C9A7]">
                {isHistoryEditSession ? 'Guardar cambios' : 'Finalizar entrenamiento'}
              </span>
            </button>
          )}
        </div>
      </div>

      {restActive && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-30 flex justify-center px-4">
        <div className="pointer-events-auto w-full max-w-[25.5rem] rounded-2xl border border-[rgba(0,201,167,0.15)] bg-[rgba(19,38,58,0.96)] px-4 py-3 shadow-[0_-12px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(0,201,167,0.12)]">
              <TimerReset size={20} className="text-[#00C9A7]" />
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                onClick={() => adjustRestBy(-15)}
                className="rounded-xl border border-[#203347] bg-[#1A2D42] px-3 py-2 text-sm font-bold text-white"
                type="button"
              >
                -15
              </button>

              <div className="min-w-[4.75rem] flex-1 text-center">
                <p className="text-xl font-bold text-white">
                  {restActive ? formatTime(restTime) : `${restConfig}s`}
                </p>
              </div>

              <button
                onClick={() => adjustRestBy(15)}
                className="rounded-xl border border-[#203347] bg-[#1A2D42] px-3 py-2 text-sm font-bold text-white"
                type="button"
              >
                +15
              </button>
            </div>

            <button
              onClick={() => {
                setRestActive(false);
              }}
              className="shrink-0 rounded-xl bg-[#00C9A7] px-4 py-2 text-sm font-bold text-black"
              type="button"
            >
              Omitir
            </button>
          </div>
        </div>
        </div>
      )}

      <NumberWheelPicker
        open={showRestPicker}
        title="Descanso"
        subtitle="Tiempo entre series"
        value={{ whole: restPickerDraft }}
        onChange={(value) => setRestPickerDraft(value.whole)}
        onClose={() => setShowRestPicker(false)}
        onConfirm={() => {
          const seconds = Number(restPickerDraft);
          if (!Number.isFinite(seconds) || seconds <= 0) {
            setShowRestPicker(false);
            return;
          }

          setRestConfig(seconds);
          setRestTime(seconds);
          setShowRestPicker(false);
        }}
        wholeOptions={REST_OPTIONS}
      />

      {exerciseMenuAnchor && currentExercise && (() => {
        const exRect = exerciseMenuAnchor.rect;
        const menuH = 260;
        const spaceBelow = window.innerHeight - exRect.bottom;
        const exTop = spaceBelow >= menuH + 8
          ? exRect.bottom + 8
          : Math.max(10, exRect.top - menuH - 8);
        const exLeft = Math.max(12, Math.min(exRect.right - 288, window.innerWidth - 300));
        return (
        <div className="absolute inset-0 z-40">
          <button aria-label="Cerrar menú" className="absolute inset-0 bg-black/20" onClick={closeContextMenus} type="button" />
          <div
            className="fixed z-50 w-[18rem] rounded-3xl border border-[rgba(32,51,71,0.92)] bg-[#13263A] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.42)]"
            style={{ top: exTop, left: exLeft }}
          >
            <div className="border-b border-white/6 px-2 pb-3">
              <h3 className="text-lg font-bold tracking-tight text-white">{currentExercise.name}</h3>
              <p className="mt-1 text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {currentExercise.muscle}
                {currentExercise.implement ? ` - ${currentExercise.implement}` : ''}
              </p>
            </div>

            <div className="mt-2 flex flex-col">
              {exerciseMenuItems.map(({ label, icon: Icon, onClick, danger, disabled }) => (
                <button
                  key={label}
                  onClick={onClick}
                  disabled={disabled}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors disabled:opacity-45 ${
                    danger ? 'text-[#FF5D5D] hover:bg-[rgba(229,57,53,0.08)]' : 'text-white hover:bg-white/5'
                  }`}
                  type="button"
                >
                  <Icon size={17} className={danger ? 'text-[#FF5D5D]' : 'text-white/85'} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        );
      })()}

      {setMenuAnchor && currentExercise && (() => {
        const setRect = setMenuAnchor.rect;
        const menuH = 245;
        const spaceBelow = window.innerHeight - setRect.bottom;
        const setTop = spaceBelow >= menuH + 8
          ? setRect.bottom + 8
          : Math.max(10, setRect.top - menuH - 8);
        const setLeft = Math.max(12, Math.min(setRect.left, window.innerWidth - 300));
        return (
        <div className="absolute inset-0 z-40">
          <button
            aria-label="Cerrar selector de serie"
            className="absolute inset-0 bg-black/20"
            onClick={closeContextMenus}
            type="button"
          />
          <div
            className="fixed z-50 w-[18rem] rounded-3xl border border-[rgba(32,51,71,0.92)] bg-[#13263A] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.42)]"
            style={{ top: setTop, left: setLeft }}
          >
            <div className="border-b border-white/6 px-2 pb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
                Set {setMenuAnchor.setIdx + 1}
              </p>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-white">{currentExercise.name}</h3>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <button
                onClick={() => updateSetKind(currentExIdx, setMenuAnchor.setIdx, 'warmup')}
                className="flex items-center justify-between rounded-2xl border border-[rgba(245,185,66,0.2)] bg-[rgba(245,185,66,0.08)] px-4 py-3 text-left"
                type="button"
              >
                <div>
                  <p className="font-semibold text-white">Serie de calentamiento</p>
                  <p className="mt-1 text-xs text-[#D8C9A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Ideal para aproximaciones y activación.
                  </p>
                </div>
                <Check size={17} className="text-[#F5B942]" />
              </button>

              <button
                onClick={() => updateSetKind(currentExIdx, setMenuAnchor.setIdx, 'normal')}
                className="flex items-center justify-between rounded-2xl border border-[rgba(0,201,167,0.18)] bg-[rgba(0,201,167,0.08)] px-4 py-3 text-left"
                type="button"
              >
                <div>
                  <p className="font-semibold text-white">Set normal</p>
                  <p className="mt-1 text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Cuenta como serie principal dentro del ejercicio.
                  </p>
                </div>
                <Check size={17} className="text-[#00C9A7]" />
              </button>

              <button
                onClick={() => removeSet(currentExIdx, setMenuAnchor.setIdx)}
                disabled={currentExercise.sets.length <= 1}
                className="flex items-center justify-between rounded-2xl border border-[rgba(229,57,53,0.18)] bg-[rgba(229,57,53,0.08)] px-4 py-3 text-left text-[#FF7D7D] disabled:opacity-45"
                type="button"
              >
                <div>
                  <p className="font-semibold">Eliminar serie</p>
                  <p className="mt-1 text-xs text-[#D6B9B9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Quitá esta serie de la sesión actual.
                  </p>
                </div>
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {showExerciseHistory && currentExercise
        ? createPortal(
            <div
              className="fixed z-40 flex items-center justify-center px-5 py-6"
              style={
                sessionOverlayBounds
                  ? {
                      top: sessionOverlayBounds.top,
                      left: sessionOverlayBounds.left,
                      width: sessionOverlayBounds.width,
                      height: sessionOverlayBounds.height,
                    }
                  : {
                      inset: 0,
                    }
              }
            >
              <button
                aria-label="Cerrar historial"
                className="absolute inset-0 bg-black/70"
                onClick={() => setShowExerciseHistory(false)}
                type="button"
              />
              <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] max-w-lg flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
                <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
                <div className="overflow-y-auto px-5 pb-6 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
                    Historial del ejercicio
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{currentExercise.name}</h3>
                  <p className="mt-2 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Tus registros recientes para este movimiento.
                  </p>

                  <div className="mt-6 flex max-h-[24rem] flex-col gap-3 overflow-y-auto pr-1">
                    {exerciseHistoryEntries.length > 0 ? (
                      exerciseHistoryEntries.map((entry) => (
                        <button
                          key={`${entry.sessionId}-${entry.sessionDate}`}
                          onClick={() => navigate(`/session-history/${entry.sessionId}`)}
                          className="rounded-2xl border border-[#2A2F3D] bg-[#13263A] p-4 text-left"
                          type="button"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-base font-bold text-white">{entry.sessionName}</p>
                              <p className="mt-1 text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {entry.sessionDate}
                              </p>
                            </div>
                            <span className="rounded-full bg-[rgba(0,201,167,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#00C9A7]">
                              PR {entry.maxKg > 0 ? `${formatWeightNumber(entry.maxKg, appSettings.weightUnit)}${weightUnitLabel}` : 'Peso corporal'}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {entry.sets.map((set, index) => (
                              <span
                                key={`${entry.sessionId}-${index}`}
                                className="rounded-full bg-[#1A2D42] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#D8E4FF]"
                              >
                                {set.kg > 0 ? `${formatWeightNumber(set.kg, appSettings.weightUnit)}${weightUnitLabel}` : 'PC'} x {set.reps}
                              </span>
                            ))}
                          </div>
                          {entry.notes && (
                            <p className="mt-3 text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {entry.notes}
                            </p>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-[#2A2F3D] bg-[#13263A] p-5 text-sm text-[#90A4B8]">
                        Todavia no hay registros guardados para este ejercicio.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {showReplaceExercise && currentExercise
        ? createPortal(
            <div
              className="fixed z-40 flex items-center justify-center px-5 py-6"
              style={
                sessionOverlayBounds
                  ? {
                      top: sessionOverlayBounds.top,
                      left: sessionOverlayBounds.left,
                      width: sessionOverlayBounds.width,
                      height: sessionOverlayBounds.height,
                    }
                  : {
                      inset: 0,
                    }
              }
            >
              <button
                aria-label="Cerrar selector de reemplazo"
                className="absolute inset-0 bg-black/70"
                onClick={() => {
                  setShowReplaceExercise(false);
                  setReplaceQuery('');
                }}
                type="button"
              />
              <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] max-w-lg flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
                <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
                <div className="overflow-y-auto px-5 pb-6 pt-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">Reemplazar ejercicio</h3>
                  <p className="mt-2 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Elegi otra variante disponible en el catalogo de WOHL.
                  </p>

                  <div className="mt-5 rounded-2xl border border-[#2A2F3D] bg-[#13263A] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-[#7E8799]" />
                      <input
                        value={replaceQuery}
                        onChange={(event) => setReplaceQuery(event.target.value)}
                        placeholder="Buscar por ejercicio, musculo o implemento"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#7E8799]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex max-h-[24rem] flex-col gap-3 overflow-y-auto pr-1">
                    {exerciseCatalogError ? (
                      <div className="rounded-2xl border border-[rgba(255,125,125,0.22)] bg-[rgba(255,125,125,0.08)] p-4 text-sm text-[#FFB4B4]">
                        {exerciseCatalogError}. Mientras tanto usamos tus rutinas guardadas como respaldo.
                      </div>
                    ) : null}

                    {isExerciseCatalogLoading && exerciseCatalog.length === 0 ? (
                      <div className="rounded-2xl border border-[#2A2F3D] bg-[#13263A] p-5 text-sm text-[#90A4B8]">
                        Cargando catalogo de ejercicios...
                      </div>
                    ) : null}

                    {filteredReplacementOptions.length > 0 ? (
                      filteredReplacementOptions.map((exercise) => (
                        <button
                          key={exercise.exerciseSlug ?? exercise.name}
                          onClick={() => replaceCurrentExercise(exercise)}
                          className="rounded-2xl border border-[#2A2F3D] bg-[#13263A] p-4 text-left"
                          type="button"
                        >
                          <p className="text-lg font-bold text-white">{exercise.name}</p>
                          <p className="mt-1 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {exercise.muscle}
                            {exercise.implement ? ` - ${exercise.implement}` : ''}
                          </p>
                          <div className="mt-3 inline-flex rounded-full bg-[rgba(0,201,167,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#00C9A7]">
                            {buildExerciseOptionSummary(exercise)}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-[#2A2F3D] bg-[#13263A] p-5 text-sm text-[#90A4B8]">
                        No encontramos ejercicios que coincidan con tu busqueda.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {showReorderModal
        ? createPortal(
            <div
              className="fixed z-40 flex items-center justify-center px-5 py-6"
              style={
                sessionOverlayBounds
                  ? {
                      top: sessionOverlayBounds.top,
                      left: sessionOverlayBounds.left,
                      width: sessionOverlayBounds.width,
                      height: sessionOverlayBounds.height,
                    }
                  : { inset: 0 }
              }
            >
              <button
                aria-label="Cerrar reordenador"
                className="absolute inset-0 bg-black/70"
                onClick={() => setShowReorderModal(false)}
                type="button"
              />
              <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
                <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
                <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
                    Sesión activa
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Reordenar ejercicios</h3>
                  <p className="mt-1 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Mantené apretado una fila y arrastrálo para cambiar el orden.
                  </p>
                  <div
                    ref={reorderListRef}
                    className={`mt-5 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 ${reorderDragState ? 'touch-none select-none' : ''}`}
                  >
                    {reorderDisplayList.map((ex, displayIdx) => {
                      const catalogEntry = ex.exerciseSlug ? catalogBySlug.get(ex.exerciseSlug) : undefined;
                      const isActive = reorderDragState?.toIndex === displayIdx;
                      const isDraggingAny = reorderDragState !== null;
                      return (
                        <div
                          key={ex.id}
                          onPointerDown={(e) => handleReorderPointerDown(e, displayIdx)}
                          onPointerMove={handleReorderPointerMove}
                          onPointerUp={handleReorderPointerUp}
                          onPointerCancel={handleReorderPointerUp}
                          className={`flex cursor-grab items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-100 active:cursor-grabbing ${
                            isActive
                              ? 'scale-[1.02] border-[rgba(0,201,167,0.45)] bg-[#0e2035] shadow-[0_6px_20px_rgba(0,0,0,0.45)]'
                              : isDraggingAny
                                ? 'border-[#203347] bg-[#13263A] opacity-50'
                                : 'border-[#203347] bg-[#13263A]'
                          }`}
                        >
                          <GripVertical size={16} className="shrink-0 text-[#4A6278]" />
                          {catalogEntry?.coverImageUrl ? (
                            <img
                              src={catalogEntry.coverImageUrl}
                              alt=""
                              draggable={false}
                              className="h-9 w-9 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,81,71,0.2)]">
                              <GripVertical size={14} className="text-[#00C9A7]" />
                            </div>
                          )}
                          <span className="shrink-0 text-xs font-bold tabular-nums text-[#4A6278]">
                            {displayIdx + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                            {ex.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setShowReorderModal(false);
                      setReorderDragState(null);
                      reorderDragStateRef.current = null;
                    }}
                    className="mt-5 w-full rounded-2xl bg-[#00C9A7] py-4 text-sm font-bold uppercase tracking-widest text-black"
                    type="button"
                  >
                    Listo
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {showFinishModal
        ? createPortal(
            <div
              className="fixed z-40 flex items-center justify-center px-5 py-6"
              style={
                sessionOverlayBounds
                  ? {
                      top: sessionOverlayBounds.top,
                      left: sessionOverlayBounds.left,
                      width: sessionOverlayBounds.width,
                      height: sessionOverlayBounds.height,
                    }
                  : { inset: 0 }
              }
            >
              <button
                aria-label="Cerrar"
                className="absolute inset-0 bg-black/70"
                onClick={() => setShowFinishModal(false)}
                type="button"
              />
              <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
                <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
                <div className="overflow-y-auto px-5 pb-6 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
                    {isHistoryEditSession ? 'Edición de sesión' : 'Sesión activa'}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {isHistoryEditSession ? 'Guardar cambios' : 'Finalizar entrenamiento'}
                  </h3>

                  {missingSets.length > 0 && !isHistoryEditSession && (
                    <>
                      <p className="mt-2 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Tenés {missingSets.length} {missingSets.length === 1 ? 'serie pendiente' : 'series pendientes'} sin completar:
                      </p>
                      <div className="mt-4 flex flex-col gap-2">
                        {[...new Set(missingSets.map((ms) => ms.exerciseIdx))].map((exIdx) => {
                          const ex = exerciseList[exIdx];
                          const count = missingSets.filter((ms) => ms.exerciseIdx === exIdx).length;
                          return (
                            <button
                              key={exIdx}
                              onClick={() => jumpToMissingSet(exIdx)}
                              className="flex items-center justify-between rounded-2xl border border-[rgba(245,185,66,0.22)] bg-[rgba(245,185,66,0.08)] px-4 py-3 text-left"
                              type="button"
                            >
                              <span className="text-sm font-semibold text-white">{ex.name}</span>
                              <span className="text-xs font-semibold text-[#F5B942]">
                                {count} pendiente{count > 1 ? 's' : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      onClick={() => void finishSession()}
                      disabled={isSubmittingSession}
                      className="flex w-full items-center justify-center rounded-2xl bg-[#00C9A7] py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors active:bg-[#00b092] disabled:opacity-45"
                      type="button"
                    >
                      {isSubmittingSession
                        ? 'Guardando...'
                        : isHistoryEditSession
                          ? 'Guardar cambios'
                          : missingSets.length > 0
                            ? 'Finalizar de todas formas'
                            : 'Finalizar entrenamiento'}
                    </button>

                    <button
                      onClick={() => setShowFinishModal(false)}
                      className="flex w-full items-center justify-center rounded-2xl border border-[#203347] bg-[#2A2A2A] py-4 text-sm font-semibold text-white transition-colors active:bg-[#343434]"
                      type="button"
                    >
                      {isHistoryEditSession ? 'Seguir editando' : 'Continuar entrenamiento'}
                    </button>

                    {isHistoryEditSession ? (
                      <button
                        onClick={() => setShowDeleteSessionModal(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(229,57,53,0.22)] bg-[rgba(229,57,53,0.08)] py-4 text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.14)]"
                        type="button"
                      >
                        <Trash2 size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">Eliminar entrenamiento</span>
                      </button>
                    ) : (
                      <button
                        onClick={discardSession}
                        className="flex w-full items-center justify-center rounded-2xl border border-[#203347] bg-[#13263A] py-4 text-sm font-semibold text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.08)]"
                        type="button"
                      >
                        Descartar entrenamiento
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {showDeleteSessionModal
        ? createPortal(
            <div
              className="fixed z-50 flex items-center justify-center px-5 py-6"
              style={
                sessionOverlayBounds
                  ? {
                      top: sessionOverlayBounds.top,
                      left: sessionOverlayBounds.left,
                      width: sessionOverlayBounds.width,
                      height: sessionOverlayBounds.height,
                    }
                  : { inset: 0 }
              }
            >
              <button
                aria-label="Cancelar"
                className="absolute inset-0 bg-black/70"
                onClick={() => setShowDeleteSessionModal(false)}
                type="button"
              />
              <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
                <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
                <div className="overflow-y-auto px-5 pb-6 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FF7D7D]">
                    Atención
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                    Eliminar entrenamiento
                  </h3>
                  <p className="mt-2 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Esta acción no se puede deshacer. El registro de esta sesión se eliminará permanentemente.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      onClick={() => void deleteHistoricalSession()}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(229,57,53,0.22)] bg-[rgba(229,57,53,0.08)] py-4 text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.14)]"
                      type="button"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm font-bold uppercase tracking-widest">Sí, eliminar</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteSessionModal(false)}
                      className="flex w-full items-center justify-center rounded-2xl border border-[#203347] bg-[#13263A] py-4 text-sm font-semibold text-white transition-colors active:bg-[rgba(255,255,255,0.04)]"
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {sessionExerciseDetail
        ? createPortal(
            <div
              className="fixed z-50 flex items-center justify-center px-5 py-6"
              style={
                sessionOverlayBounds
                  ? {
                      top: sessionOverlayBounds.top,
                      left: sessionOverlayBounds.left,
                      width: sessionOverlayBounds.width,
                      height: sessionOverlayBounds.height,
                    }
                  : {
                      inset: 0,
                    }
              }
            >
              <button
                type="button"
                aria-label="Cerrar instructivo"
                className="absolute inset-0 bg-black/70"
                onClick={() => setSessionExerciseDetail(null)}
              />
              <div
                className="relative z-10 flex w-full max-h-[calc(100%-3rem)] flex-col overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.42)]"
                style={{ background: '#1A2D42' }}
              >
                <div className="overflow-y-auto">
                  {sessionExerciseDetail.animationMediaUrl ? (
                    <video
                      key={sessionExerciseDetail.animationMediaUrl}
                      src={sessionExerciseDetail.animationMediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full"
                      style={{ maxHeight: '260px', objectFit: 'cover' }}
                    />
                  ) : null}

                  <div className="px-5 pb-8 pt-4">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold leading-tight text-white">
                          {sessionExerciseDetail.name}
                        </h2>
                        <p className="mt-0.5 text-sm text-[#6F859A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {sessionExerciseDetail.titleEn}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSessionExerciseDetail(null)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#203347] text-[#9BAEC1]"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[rgba(0,201,167,0.12)] px-3 py-1 text-xs font-semibold text-[#00C9A7]">
                        {sessionExerciseDetail.muscle}
                      </span>
                      {sessionExerciseDetail.secondaryMuscles.map((m) => (
                        <span
                          key={m}
                          className="rounded-full bg-[rgba(155,174,193,0.1)] px-3 py-1 text-xs font-medium text-[#9BAEC1]"
                        >
                          {m}
                        </span>
                      ))}
                      {sessionExerciseDetail.implement ? (
                        <span className="rounded-full bg-[rgba(127,152,255,0.12)] px-3 py-1 text-xs font-semibold text-[#7F98FF]">
                          {sessionExerciseDetail.implement}
                        </span>
                      ) : null}
                    </div>

                    {sessionExerciseDetail.overview ? (
                      <p className="mb-5 text-sm leading-relaxed text-[#9BAEC1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {sessionExerciseDetail.overview}
                      </p>
                    ) : null}

                    {sessionExerciseDetail.instructions.length > 0 ? (
                      <div className="mb-2">
                        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-[#9BAEC1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Instrucciones
                        </p>
                        <ol className="flex flex-col gap-2.5">
                          {sessionExerciseDetail.instructions.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(0,201,167,0.15)] text-[10px] font-bold text-[#00C9A7]">
                                {index + 1}
                              </span>
                              <p className="text-sm leading-relaxed text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {step}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
