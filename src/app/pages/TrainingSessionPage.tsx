import { useEffect, useState } from 'react';
import {
  BarChart2,
  BookOpen,
  Check,
  ChevronRight,
  FileText,
  History,
  Menu,
  MoreVertical,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { brandLogoWhite, userProfileAvatar } from '@/assets';
import { appContext, routines, sessionHistory } from '../data/mockData';

type SessionLocationState = {
  routineId?: number;
  dayName?: string;
};

type SetState = {
  id: number;
  kg: number;
  reps: number;
  rpe: number;
  completed: boolean;
  prevKg: number;
  prevReps: number;
};

type ExerciseState = {
  id: number;
  name: string;
  muscle: string;
  implement?: string;
  sets: SetState[];
};

const DEFAULT_REST = 90;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function buildExerciseState(
  exercises: (typeof routines)[number]['days'][number]['exercises'],
  previousSession?: (typeof sessionHistory)[number]
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
      sets: exercise.sets.map((set, index) => ({
        ...set,
        prevKg: previousExercise?.sets[index]?.kg ?? set.kg,
        prevReps: previousExercise?.sets[index]?.reps ?? set.reps,
      })),
    };
  });
}

export default function TrainingSessionPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: SessionLocationState };
  const routine =
    routines.find((item) => item.id === (state?.routineId ?? appContext.activeRoutineId)) ?? routines[0];
  const currentDay =
    routine.days.find((day) => day.name === (state?.dayName ?? appContext.currentDayName)) ??
    routine.days[0];
  const previousSession = sessionHistory.find((session) => session.name === currentDay.name);

  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [exerciseList, setExerciseList] = useState<ExerciseState[]>(() =>
    buildExerciseState(currentDay.exercises, previousSession)
  );
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const [elapsed, setElapsed] = useState(2535);
  const [restActive, setRestActive] = useState(false);
  const [restTime, setRestTime] = useState(DEFAULT_REST);
  const [restConfig, setRestConfig] = useState(DEFAULT_REST);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showRestConfig, setShowRestConfig] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timerId);
  }, []);

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

  const currentExercise = exerciseList[currentExIdx] ?? exerciseList[0];
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

  const completeSet = (setIdx: number) => {
    const targetSet = currentExercise.sets[setIdx];

    setExerciseList((previous) =>
      previous.map((exercise, exerciseIdx) => {
        if (exerciseIdx !== currentExIdx) {
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

    if (!targetSet.completed) {
      setRestTime(restConfig);
      setRestActive(true);

      const nextIdx = setIdx + 1;
      if (nextIdx < currentExercise.sets.length) {
        setActiveSetIdx(nextIdx);
      }
    }
  };

  const updateSetValue = (setIdx: number, field: 'kg' | 'reps', value: string) => {
    const numericValue = Number.parseFloat(value) || 0;

    setExerciseList((previous) =>
      previous.map((exercise, exerciseIdx) => {
        if (exerciseIdx !== currentExIdx) {
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

  const addSet = () => {
    const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
    const newSet: SetState = {
      id: currentExercise.sets.length + 1,
      kg: lastSet?.kg ?? 0,
      reps: lastSet?.reps ?? 0,
      rpe: lastSet?.rpe ?? 8,
      completed: false,
      prevKg: lastSet?.prevKg ?? lastSet?.kg ?? 0,
      prevReps: lastSet?.prevReps ?? lastSet?.reps ?? 0,
    };

    setExerciseList((previous) =>
      previous.map((exercise, exerciseIdx) => {
        if (exerciseIdx !== currentExIdx) {
          return exercise;
        }

        return { ...exercise, sets: [...exercise.sets, newSet] };
      })
    );
  };

  const nextExercise = () => {
    if (currentExIdx < exerciseList.length - 1) {
      setCurrentExIdx((index) => index + 1);
      setActiveSetIdx(0);
      setRestActive(false);
    }
  };

  const finishSession = () => {
    navigate('/post-session', {
      state: {
        duration: elapsed,
        volume: totalVolume,
        setsCompleted: totalSetsCompleted,
        totalSets,
        exercises: exerciseList,
        notes,
        sessionName: currentDay.name,
        sessionFocus: currentDay.focus,
        previousVolume: previousSession?.volume ?? 0,
      },
    });
  };

  const exerciseMenuItems = [
    { label: 'Ver historial de este ejercicio', icon: History },
    { label: 'Reemplazar ejercicio', icon: RefreshCw },
    { label: 'Eliminar ejercicio', icon: Trash2, danger: true },
    { label: 'Ver instrucciones / forma correcta', icon: BookOpen },
  ];

  return (
    <div
      className="flex flex-col"
      style={{ background: '#0A0D12', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="shrink-0 h-16 flex items-center justify-between px-5 border-b border-[#262626]"
        style={{ background: '#0E0E0E' }}
      >
        <button className="p-2 -ml-2" type="button">
          <Menu size={18} className="text-[#12EFD3]" />
        </button>
        <div className="flex items-center gap-2">
          <img src={brandLogoWhite} alt="GymUp" className="w-7 h-7 object-contain" />
          <span className="text-white font-extrabold text-lg italic uppercase tracking-tight">GYMUP</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[rgba(18,239,211,0.2)] bg-[#1C2030] px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#12EFD3] animate-pulse" />
            <span className="text-sm font-bold text-[#12EFD3]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {formatTime(elapsed)}
            </span>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full border border-[rgba(18,239,211,0.2)]">
            <img src={userProfileAvatar} alt="Profile" className="h-full w-full object-cover" />
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
                Sesión activa - {appContext.todayLabel}
              </p>
              <h1 className="text-4xl font-extrabold italic leading-tight tracking-tight text-white">
                {currentDay.name}
              </h1>
              <p className="mt-1 text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {currentDay.focus}
              </p>
            </div>
            <button
              onClick={() => setShowNotes(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[#12EFD3]"
              type="button"
            >
              <FileText size={13} className="text-[#12EFD3]" />
              <span className="text-sm text-[#12EFD3]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Notas
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="relative overflow-hidden rounded-xl bg-[#131313] p-5"
              style={{ borderLeft: '4px solid rgba(18,239,211,0.4)' }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-widest text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Volumen total
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white">{totalVolume.toLocaleString()}</span>
                <span className="text-sm font-bold italic text-[#ADAAAA]">kg</span>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-xl bg-[#131313] p-5"
              style={{ borderLeft: '4px solid rgba(127,152,255,0.4)' }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-widest text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Series completas
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white">{totalSetsCompleted}</span>
                <span className="text-sm font-bold italic text-[#ADAAAA]">/ {totalSets}</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#262626] bg-[#141720]">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(0,81,71,0.2)]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#12EFD3">
                    <path d="M7 4.5a2.5 2.5 0 0 1 5 0v1h1.5A1.5 1.5 0 0 1 15 7v1.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 8.5V7a1.5 1.5 0 0 1 1.5-1.5H8v-1zM9 4.5a1 1 0 0 0-2 0v1h2v-1zM11 5.5V4.5a1 1 0 0 1 2 0v1h-2zM5 12a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2H5zM4 15a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold italic uppercase tracking-tight text-white">
                    {currentExercise.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Ejercicio {currentExIdx + 1} de {exerciseList.length} - {currentExercise.muscle}
                    {currentExercise.implement ? ` - ${currentExercise.implement}` : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMenu(true)}
                className="rounded-lg bg-[#262626] p-2"
                type="button"
              >
                <MoreVertical size={16} className="text-white" />
              </button>
            </div>

            <div className="border-b border-[rgba(73,72,71,0.1)] bg-[rgba(32,31,31,0.5)] px-4 py-3">
              <div className="grid grid-cols-6 gap-2 text-center">
                {['SET', 'PREV', 'KG', 'REPS', 'RPE', ''].map((column) => (
                  <span
                    key={column}
                    className={`text-[10px] font-semibold tracking-widest ${
                      column === 'KG' || column === 'REPS' ? 'text-[#12EFD3]' : 'text-[#ADAAAA]'
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>

            <div>
              {currentExercise.sets.map((set, idx) => {
                const isCompleted = set.completed;
                const isActive = idx === activeSetIdx && !isCompleted;
                const isPending = !isCompleted && !isActive;

                return (
                  <div
                    key={set.id}
                    className={`border-b border-[rgba(73,72,71,0.1)] px-4 py-4 last:border-b-0 ${
                      isActive ? 'border-l-4 border-l-[rgba(18,239,211,0.3)] bg-[rgba(18,239,211,0.05)]' : ''
                    }`}
                  >
                    <div className="grid grid-cols-6 items-center gap-2">
                      <div className="text-center">
                        <span
                          className={`font-bold italic ${
                            isActive ? 'text-xl text-[#12EFD3]' : 'text-base text-[#ADAAAA]'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-xs leading-tight text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {set.prevKg > 0 ? set.prevKg : '-'} x
                          <br />
                          {set.prevReps}
                        </span>
                      </div>

                      <div>
                        {isActive ? (
                          <div className="rounded-lg border border-[rgba(18,239,211,0.3)] bg-[#262626] py-2 shadow-[0_0_10px_rgba(18,239,211,0.1)]">
                            <input
                              type="number"
                              value={set.kg || ''}
                              onChange={(event) => updateSetValue(idx, 'kg', event.target.value)}
                              className="w-full bg-transparent text-center text-base font-normal text-[#12EFD3] outline-none"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            />
                          </div>
                        ) : (
                          <div className="rounded-lg bg-[rgba(38,38,38,0.5)] py-2 text-center">
                            <span className={`text-lg font-normal ${isCompleted ? 'text-white' : 'text-white/40'}`}>
                              {set.kg || '-'}
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
                              onChange={(event) => updateSetValue(idx, 'reps', event.target.value)}
                              className="w-full bg-transparent text-center text-base font-normal text-[#12EFD3] outline-none"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            />
                          </div>
                        ) : (
                          <div className="rounded-lg bg-[rgba(38,38,38,0.5)] py-2 text-center">
                            <span className={`text-lg font-normal ${isCompleted ? 'text-white' : 'text-white/40'}`}>
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
                          onClick={() => completeSet(idx)}
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
                          <Check size={14} className={isCompleted ? 'text-[#003830]' : 'text-[#12EFD3]'} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={addSet}
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

          {restActive && (
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
                <p className="mt-0.5 text-sm font-semibold text-white">
                  Próxima serie: {currentExercise.name}
                </p>
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
              <span className="text-sm font-bold uppercase tracking-widest text-white">Finalizar entrenamiento</span>
            </button>
            <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#262626] bg-[#1C2030]" type="button">
              <BarChart2 size={20} className="text-[#ADAAAA]" />
            </button>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMenu(false)} />
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 rounded-t-3xl p-6"
            style={{ background: '#1C2030' }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#262626]" />
            <h3 className="mb-2 text-lg font-bold text-white">{currentExercise.name}</h3>
            {exerciseMenuItems.map(({ label, icon: Icon, danger }) => (
              <button
                key={label}
                onClick={() => setShowMenu(false)}
                className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors hover:bg-white/5 ${
                  danger ? 'text-[#E53935]' : 'text-white'
                }`}
                type="button"
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showNotes && (
        <div className="absolute inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowNotes(false)} />
          <div className="relative w-full rounded-t-3xl p-6" style={{ background: '#1C2030' }}>
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#262626]" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Notas de la sesión</h3>
              <button onClick={() => setShowNotes(false)} type="button">
                <X size={20} className="text-[#ADAAAA]" />
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Añadí notas sobre tu sesión..."
              className="h-32 w-full resize-none rounded-xl border border-[rgba(18,239,211,0.2)] bg-[#262626] p-4 text-sm text-white outline-none focus:border-[rgba(18,239,211,0.5)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <button
              onClick={() => setShowNotes(false)}
              className="mt-4 w-full rounded-2xl bg-[#12EFD3] py-4 font-bold text-black"
              type="button"
            >
              Guardar notas
            </button>
          </div>
        </div>
      )}

      {showRestConfig && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowRestConfig(false)} />
          <div className="relative w-full rounded-3xl p-6" style={{ background: '#1C2030' }}>
            <h3 className="mb-6 text-center text-lg font-bold text-white">Tiempo de descanso</h3>
            <div className="mb-6 flex items-center justify-center gap-6">
              {[30, 60, 90, 120, 180].map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setRestConfig(time);
                    setRestTime(time);
                    setShowRestConfig(false);
                  }}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    restConfig === time ? 'bg-[#12EFD3] text-black' : 'bg-[#262626] text-white hover:bg-[#333]'
                  }`}
                  type="button"
                >
                  {time}s
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRestConfig(false)}
              className="w-full rounded-2xl bg-[#262626] py-3 font-semibold text-white"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowFinishModal(false)} />
          <div className="relative w-full rounded-3xl p-6" style={{ background: '#1C2030' }}>
            <h3 className="mb-2 text-center text-xl font-bold text-white">¿Finalizar entrenamiento?</h3>
            <p className="mb-6 text-center text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Llevas {formatTime(elapsed)} entrenando y completaste {totalSetsCompleted}/{totalSets} series.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={finishSession}
                className="w-full rounded-2xl bg-[#E53935] py-4 font-bold text-white"
                type="button"
              >
                Finalizar entrenamiento
              </button>
              <button
                onClick={() => setShowFinishModal(false)}
                className="w-full rounded-2xl bg-[#262626] py-4 font-semibold text-white"
                type="button"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
