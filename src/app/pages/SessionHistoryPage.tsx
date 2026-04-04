import { useParams } from 'react-router';
import { BarChart2, Clock, TrendingUp, Zap } from 'lucide-react';
import { Header } from '../components/Header';
import { sessionHistory } from '../data/mockData';

export default function SessionHistoryPage() {
  const { id } = useParams();
  const session = sessionHistory.find((item) => item.id === Number(id)) ?? sessionHistory[0];
  const delta = session.comparisonDelta ?? 0;
  const deltaText = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
  const currentBar = delta >= 0 ? 88 : 74;
  const previousBar = delta >= 0 ? 78 : 84;

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title={session.name} />

      <div className="flex flex-col gap-5 px-5 py-5 pb-6">
        <div>
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#ADAAAA]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {session.dayLabel} - {session.date}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">{session.name}</h1>
          <p className="mt-1 text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {session.muscle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl border border-[rgba(18,239,211,0.2)] bg-[#131313] p-4"
            style={{ borderLeftWidth: 4 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-[#12EFD3]" />
              <p className="text-[10px] uppercase tracking-widest text-[#ADAAAA]">Volumen</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-normal text-white">{session.volume.toLocaleString()}</span>
              <span className="text-xs font-bold italic text-[#ADAAAA]">kg</span>
            </div>
          </div>
          <div
            className="rounded-2xl border border-[rgba(127,152,255,0.2)] bg-[#131313] p-4"
            style={{ borderLeftWidth: 4 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Clock size={14} className="text-[#7F98FF]" />
              <p className="text-[10px] uppercase tracking-widest text-[#ADAAAA]">Duración</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-normal text-white">{session.duration}</span>
              <span className="text-xs font-bold italic text-[#ADAAAA]">min</span>
            </div>
          </div>
          <div className="rounded-2xl bg-[#131313] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap size={14} className="text-orange-400" />
              <p className="text-[10px] uppercase tracking-widest text-[#ADAAAA]">Calorías</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-normal text-white">{session.kcal}</span>
              <span className="text-xs font-bold italic text-[#ADAAAA]">kcal</span>
            </div>
          </div>
          <div className="rounded-2xl bg-[#131313] p-4">
            <div className="mb-2 flex items-center gap-2">
              <BarChart2 size={14} className="text-[#12EFD3]" />
              <p className="text-[10px] uppercase tracking-widest text-[#ADAAAA]">RPE prom.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-normal text-white">{session.avgRpe.toFixed(1)}</span>
              <span className="text-xs font-bold italic text-[#ADAAAA]">/ 10</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#262626] bg-[#131313] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#ADAAAA]">Vs. sesión anterior</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="mb-1 h-2 overflow-hidden rounded-full bg-[#262626]">
                <div className="h-full rounded-full bg-[#12EFD3]" style={{ width: `${currentBar}%` }} />
              </div>
              <p className="text-sm font-bold text-white">Sesión actual</p>
            </div>
            <div className={`text-sm font-bold ${delta >= 0 ? 'text-[#12EFD3]' : 'text-[#E53935]'}`}>
              {deltaText}
            </div>
            <div className="flex-1">
              <div className="mb-1 h-2 overflow-hidden rounded-full bg-[#262626]">
                <div className="h-full rounded-full bg-[#ADAAAA]" style={{ width: `${previousBar}%` }} />
              </div>
              <p className="text-sm text-[#ADAAAA]">Sesión anterior</p>
            </div>
          </div>
        </div>

        {session.exercises.length > 0 ? (
          <div>
            <h2 className="mb-3 text-xl font-bold tracking-tight text-white">Ejercicios</h2>
            <div className="flex flex-col gap-3">
              {session.exercises.map((exercise) => (
                <div
                  key={`${session.id}-${exercise.name}`}
                  className="overflow-hidden rounded-2xl border border-[#262626] bg-[#131313]"
                >
                  <div className="flex items-center justify-between border-b border-[#262626] px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{exercise.name}</p>
                      <p className="mt-0.5 text-xs text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Máx: {exercise.maxKg > 0 ? `${exercise.maxKg} kg` : 'Peso corporal'}
                        {exercise.implement ? ` - ${exercise.implement}` : ''}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[rgba(18,239,211,0.2)] bg-[rgba(18,239,211,0.1)] px-2 py-1">
                      <span className="text-xs font-bold text-[#12EFD3]">{exercise.sets.length} series</span>
                    </div>
                  </div>

                  {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-4 py-3">
                      {exercise.secondaryMuscles.map((muscle) => (
                        <span
                          key={`${exercise.name}-${muscle}`}
                          className="rounded-full bg-[#262626] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1A1]"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  )}

                  <div>
                    <div className="grid grid-cols-4 gap-2 bg-[rgba(255,255,255,0.02)] px-4 py-2">
                      {['#', 'KG', 'Reps', 'RPE'].map((column) => (
                        <span
                          key={`${exercise.name}-${column}`}
                          className="text-center text-[10px] font-semibold uppercase tracking-wider text-[#ADAAAA]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {column}
                        </span>
                      ))}
                    </div>
                    {exercise.sets.map((set, index) => (
                      <div
                        key={`${exercise.name}-${index}`}
                        className="grid grid-cols-4 gap-2 border-t border-[rgba(255,255,255,0.03)] px-4 py-2"
                      >
                        <span className="text-center text-xs text-[#ADAAAA]">{index + 1}</span>
                        <span className="text-center text-xs font-medium text-white">{set.kg > 0 ? set.kg : '-'}</span>
                        <span className="text-center text-xs font-medium text-white">{set.reps}</span>
                        <span className="text-center text-xs text-[#ADAAAA]">{set.rpe ?? '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#262626] bg-[#131313] p-6 text-center">
            <p className="text-sm text-[#ADAAAA]">No hay detalles de ejercicios para esta sesión.</p>
          </div>
        )}
      </div>
    </div>
  );
}
