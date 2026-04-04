import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Clock, Copy, Pencil, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { userProfileAvatar } from '@/assets';
import { Header } from '../components/Header';
import { Routine, routines, sessionHistory } from '../data/mockData';

function cloneRoutine(routine: Routine): Routine {
  return {
    ...routine,
    categories: routine.categories.map((category) => ({ ...category })),
    days: routine.days.map((day) => ({
      ...day,
      exercises: day.exercises.map((exercise) => ({
        ...exercise,
        secondaryMuscles: exercise.secondaryMuscles ? [...exercise.secondaryMuscles] : undefined,
        sets: exercise.sets.map((set) => ({ ...set })),
      })),
    })),
  };
}

export default function WorkoutsPage() {
  const navigate = useNavigate();
  const [routineList, setRoutineList] = useState<Routine[]>(routines.map(cloneRoutine));
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [highlightActive, setHighlightActive] = useState(false);

  const copyRoutine = (routine: Routine, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const copy = cloneRoutine(routine);
    copy.id = Date.now();
    copy.name = `Copia de ${routine.name}`;
    setRoutineList((previous) => [...previous, copy]);
  };

  const deleteRoutine = (id: number) => {
    setRoutineList((previous) => previous.filter((routine) => routine.id !== id));
    setDeleteId(null);
  };

  const totalVolume = sessionHistory.reduce((acc, session) => acc + session.volume, 0);
  const primaryRoutine = routineList[0];
  const weeklyHours =
    ((primaryRoutine?.daysPerWeek ?? 0) * (primaryRoutine?.avgMinutes ?? 0)) / 60;

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header
        rightContent={
          <div className="h-10 w-10 overflow-hidden rounded-full border border-[rgba(18,239,211,0.2)] bg-[#262626]">
            <img src={userProfileAvatar} alt="Profile" className="h-full w-full object-cover" />
          </div>
        }
      />

      <div className="flex flex-col gap-6 px-5 py-6 pb-4">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Entrenamientos</h1>
          <button
            onClick={() => navigate('/routine-editor/new')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#12EFD3] py-4 shadow-[0_0_15px_rgba(18,239,211,0.15)] transition-colors active:bg-[#0DBDA7]"
          >
            <Plus size={22} className="text-black" strokeWidth={2.5} />
            <span className="text-base font-extrabold text-black">Crear nueva rutina</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-white">Mis rutinas</span>
          <button
            onClick={() => setHighlightActive((value) => !value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-colors ${
              highlightActive
                ? 'border border-[rgba(18,239,211,0.3)] bg-[rgba(18,239,211,0.2)] text-[#12EFD3]'
                : 'text-[#12EFD3]'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {routineList.length} activas
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {routineList.map((routine) => (
            <button
              key={routine.id}
              onClick={() => navigate(`/routine/${routine.id}`)}
              className="relative w-full overflow-hidden rounded-2xl bg-[#131313] text-left transition-colors active:bg-[#1a1a1a]"
              style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: routine.color }}
              />

              <div className="flex flex-col gap-4 py-5 pl-6 pr-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold leading-tight text-white">{routine.name}</h3>
                    <p
                      className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {routine.daysPerWeek} días / semana
                    </p>
                  </div>
                  <div className="-mr-1 flex items-center gap-1">
                    <button
                      onClick={(event) => copyRoutine(routine, event)}
                      className="rounded-xl p-2 transition-colors hover:bg-white/5"
                    >
                      <Copy size={14} className="text-white/70" />
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/routine-editor/${routine.id}`);
                      }}
                      className="rounded-xl p-2 transition-colors hover:bg-white/5"
                    >
                      <Pencil size={14} className="text-white/70" />
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteId(routine.id);
                      }}
                      className="rounded-xl p-2 transition-colors hover:bg-white/5"
                    >
                      <Trash2 size={14} className="text-[#E53935]/70" />
                    </button>
                  </div>
                </div>

                {routine.categories.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {routine.categories.map(({ name, percentage, color }) => (
                      <div key={name} className="flex items-center gap-3">
                        <span
                          className="w-12 text-[10px] font-semibold text-[#777575]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {name}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#262626]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              background: `linear-gradient(to right, ${color}, ${color}aa)`,
                              boxShadow: `0 0 8px ${color}40`,
                            }}
                          />
                        </div>
                        <span
                          className="w-8 text-right text-[10px] font-bold"
                          style={{ color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {routine.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-[#262626] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#777575]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {routine.avgMinutes && (
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-white">{routine.avgMinutes} MIN</p>
                        <p className="text-[9px] uppercase tracking-wider text-[#777575]">Promedio</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pb-2">
          <div className="rounded-xl bg-[#131313] p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-[#12EFD3]" />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider text-[#777575]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Volumen total
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{(totalVolume / 1000).toFixed(1)}k</span>
              <span className="text-sm font-bold italic text-[#ADAAAA]">kg</span>
            </div>
          </div>
          <div className="rounded-xl bg-[#131313] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock size={14} className="text-[#12EFD3]" />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider text-[#777575]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Tiempo semanal
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{weeklyHours.toFixed(1)}</span>
              <span className="text-sm font-bold italic text-[#ADAAAA]">h</span>
            </div>
          </div>
        </div>
      </div>

      {deleteId !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteId(null)} />
          <div className="relative w-full rounded-3xl p-6" style={{ background: '#1C2030' }}>
            <h3 className="mb-2 text-center text-xl font-bold text-white">¿Eliminar rutina?</h3>
            <p className="mb-6 text-center text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => deleteRoutine(deleteId)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E53935] py-4 font-bold text-white"
              >
                <Trash2 size={16} />
                Eliminar rutina
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="w-full rounded-2xl bg-[#262626] py-4 font-semibold text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
