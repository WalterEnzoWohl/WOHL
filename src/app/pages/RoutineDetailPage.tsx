import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronDown, ChevronUp, Clock, Dumbbell, Pencil, Play } from 'lucide-react';
import { Header } from '../components/Header';
import { appContext, routines } from '../data/mockData';

export default function RoutineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routine = routines.find((item) => item.id === Number(id)) ?? routines[0];
  const initialDayIndex = Math.max(
    0,
    routine.days.findIndex((day) => day.name === appContext.currentDayName)
  );
  const [activeDay, setActiveDay] = useState(initialDayIndex);
  const [expandedExercises, setExpandedExercises] = useState<Set<number>>(new Set([0]));

  const selectedDay = routine.days[activeDay] ?? routine.days[0];
  const totalExercises = routine.days.reduce((acc, day) => acc + day.exercises.length, 0);
  const totalSets = routine.days.reduce(
    (acc, day) => acc + day.exercises.reduce((setAcc, exercise) => setAcc + exercise.sets.length, 0),
    0
  );

  const toggleExercise = (index: number) => {
    setExpandedExercises((previous) => {
      const next = new Set(previous);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header
        showBack
        onBack={() => navigate(-1)}
        rightContent={
          <button
            onClick={() => navigate(`/routine-editor/${routine.id}`)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#262626] bg-[#1C2030]"
          >
            <Pencil size={14} className="text-[#ADAAAA]" />
          </button>
        }
      />

      <div className="flex flex-col gap-6 px-5 py-5 pb-4">
        <div className="flex flex-col gap-3">
          <div
            className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: `${routine.color}20`,
              color: routine.color,
              border: `1px solid ${routine.color}40`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {routine.daysPerWeek} días por semana
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white">{routine.name}</h1>
          <p className="text-sm leading-6 text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {routine.description}
          </p>
          {routine.tags && (
            <div className="flex flex-wrap gap-2">
              {routine.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-[#262626] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#A1A1A1]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Días/sem', value: routine.daysPerWeek.toString(), icon: <Clock size={14} style={{ color: routine.color }} /> },
            { label: 'Ejercicios', value: totalExercises.toString(), icon: <Dumbbell size={14} style={{ color: routine.color }} /> },
            { label: 'Series', value: totalSets.toString(), icon: <div className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: routine.color }} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-xl border border-[#262626] bg-[#131313] p-3">
              <div className="mb-1.5 flex items-center gap-1.5">
                {icon}
                <span className="text-[10px] uppercase tracking-wider text-[#ADAAAA]">{label}</span>
              </div>
              <span className="text-xl font-bold text-white">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {routine.days.map((day, index) => (
            <button
              key={day.name}
              onClick={() => setActiveDay(index)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeDay === index
                  ? 'text-black'
                  : 'border border-[#262626] bg-[#1C2030] text-[#ADAAAA]'
              }`}
              style={activeDay === index ? { background: routine.color } : {}}
            >
              {day.name}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[#262626] bg-[#131313] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]">Enfoque</p>
              <h2 className="mt-1 text-xl font-bold text-white">{selectedDay.focus}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#ADAAAA]">{selectedDay.exercises.length} ejercicios</p>
              <p className="text-xs text-[#ADAAAA]">
                {selectedDay.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0)} series
              </p>
            </div>
          </div>
          {selectedDay.description && (
            <p className="mt-3 text-sm text-[#D4D4D4]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {selectedDay.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {selectedDay.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="overflow-hidden rounded-2xl border border-[#262626] bg-[#131313]"
            >
              <button
                onClick={() => toggleExercise(index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${routine.color}15`, border: `1px solid ${routine.color}30` }}
                  >
                    <Dumbbell size={16} style={{ color: routine.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{exercise.name}</p>
                    <p className="mt-0.5 text-xs text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {exercise.sets.length} series - {exercise.muscle}
                    </p>
                  </div>
                </div>
                {expandedExercises.has(index) ? (
                  <ChevronUp size={16} className="text-[#ADAAAA]" />
                ) : (
                  <ChevronDown size={16} className="text-[#ADAAAA]" />
                )}
              </button>

              {expandedExercises.has(index) && (
                <div className="border-t border-[#262626] px-4 py-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {exercise.implement && (
                      <span className="rounded-full border border-[rgba(18,239,211,0.25)] bg-[rgba(18,239,211,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]">
                        {exercise.implement}
                      </span>
                    )}
                    {exercise.secondaryMuscles?.map((muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full bg-[#262626] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1A1]"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 bg-[rgba(255,255,255,0.03)] px-4 py-2">
                    {['Serie', 'Kg', 'Reps', 'RPE'].map((column) => (
                      <span
                        key={column}
                        className="text-center text-[10px] font-semibold uppercase tracking-wider text-[#ADAAAA]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-4 gap-2 border-t border-[rgba(255,255,255,0.03)] px-4 py-3"
                    >
                      <span className="text-center text-sm text-[#ADAAAA]">{setIndex + 1}</span>
                      <span className="text-center text-sm font-medium text-white">
                        {set.kg > 0 ? set.kg : '-'}
                      </span>
                      <span className="text-center text-sm font-medium text-white">{set.reps}</span>
                      <span className="text-center text-sm text-[#ADAAAA]">{set.rpe}</span>
                    </div>
                  ))}

                  {exercise.notes && (
                    <p className="mt-3 text-xs leading-5 text-[#D4D4D4]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {exercise.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pb-2">
          <button
            onClick={() =>
              navigate('/session', {
                state: { routineId: routine.id, dayName: selectedDay.name },
              })
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#12EFD3] py-4 shadow-[0_0_15px_rgba(18,239,211,0.2)] transition-colors active:bg-[#0DBDA7]"
          >
            <Play size={18} fill="black" className="ml-0.5 text-black" />
            <span className="font-bold text-black">Iniciar {selectedDay.name}</span>
          </button>
          <button
            onClick={() => navigate(`/routine-editor/${routine.id}`)}
            className="flex w-14 items-center justify-center rounded-2xl border border-[#262626] bg-[#1C2030]"
          >
            <Pencil size={18} className="text-[#ADAAAA]" />
          </button>
        </div>
      </div>
    </div>
  );
}
