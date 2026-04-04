import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Clock, Filter, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { sessionHistory } from '../data/mockData';

const monthLabels: Record<string, string> = {
  '2026-04': 'Abril 2026',
  '2026-03': 'Marzo 2026',
};

const muscles = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Glúteos', 'Abdominales'];

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchesMuscle(session: (typeof sessionHistory)[number], selectedMuscle: string) {
  if (selectedMuscle === 'Todos') {
    return true;
  }

  const haystack = [
    session.name,
    session.muscle,
    ...session.exercises.map((exercise) => exercise.muscle),
  ]
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const keywordMap: Record<string, string[]> = {
    Pecho: ['pecho'],
    Espalda: ['espalda'],
    Piernas: ['piernas', 'cuadriceps', 'isquios', 'gluteos', 'gemelos', 'abductores'],
    Hombros: ['hombros', 'deltoides'],
    'Bíceps': ['biceps'],
    'Tríceps': ['triceps'],
    'Glúteos': ['gluteos'],
    Abdominales: ['abdominales'],
  };

  return (keywordMap[selectedMuscle] ?? [normalizeText(selectedMuscle)]).some((keyword) =>
    haystack.includes(keyword)
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const months = Array.from(new Set(sessionHistory.map((session) => session.isoDate.slice(0, 7)))).sort(
    (a, b) => b.localeCompare(a)
  );
  const [selectedMonth, setSelectedMonth] = useState(months[0] ?? '2026-04');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');

  const filtered = sessionHistory.filter(
    (session) =>
      session.isoDate.startsWith(selectedMonth) && matchesMuscle(session, selectedMuscle)
  );

  const totalVolume = filtered.reduce((acc, session) => acc + session.volume, 0);
  const totalTime = filtered.reduce((acc, session) => acc + session.duration, 0);
  const avgRpe =
    filtered.length > 0
      ? (filtered.reduce((acc, session) => acc + session.avgRpe, 0) / filtered.length).toFixed(1)
      : '0.0';

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title="Historial completo" />

      <div className="flex flex-col gap-5 px-5 py-5 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#262626] bg-[#131313] p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp size={12} className="text-[#12EFD3]" />
              <p className="text-[10px] uppercase tracking-widest text-[#ADAAAA]">Volumen</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">{(totalVolume / 1000).toFixed(1)}k</span>
              <span className="text-xs italic text-[#ADAAAA]">kg</span>
            </div>
          </div>
          <div className="rounded-xl border border-[#262626] bg-[#131313] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock size={12} className="text-[#12EFD3]" />
              <p className="text-[10px] uppercase tracking-widest text-[#ADAAAA]">Tiempo</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">{(totalTime / 60).toFixed(1)}h</span>
            </div>
          </div>
          <div className="rounded-xl border border-[#262626] bg-[#131313] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Filter size={12} className="text-[#12EFD3]" />
              <p className="text-[10px] uppercase tracking-widest text-[#ADAAAA]">RPE prom.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">{avgRpe}</span>
              <span className="text-xs italic text-[#ADAAAA]">/ 10</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {months.map((monthKey) => (
            <button
              key={monthKey}
              onClick={() => setSelectedMonth(monthKey)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                selectedMonth === monthKey
                  ? 'bg-[#12EFD3] text-black'
                  : 'border border-[#262626] bg-[#1C2030] text-[#ADAAAA]'
              }`}
            >
              {monthLabels[monthKey] ?? monthKey}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Filter size={12} className="text-[#ADAAAA]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#ADAAAA]">
              Filtrar por músculo
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {muscles.map((muscle) => (
              <button
                key={muscle}
                onClick={() => setSelectedMuscle(muscle)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedMuscle === muscle ? 'bg-[#12EFD3] text-black' : 'bg-[#262626] text-[#ADAAAA]'
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#262626] bg-[#131313] p-6 text-center">
              <p className="text-sm text-[#ADAAAA]">No hay sesiones que coincidan con el filtro.</p>
            </div>
          ) : (
            filtered.map((session) => {
              const deltaText =
                session.comparisonDelta !== undefined
                  ? `${session.comparisonDelta > 0 ? '+' : ''}${session.comparisonDelta.toFixed(1)}%`
                  : null;

              return (
                <button
                  key={session.id}
                  onClick={() => navigate(`/session-history/${session.id}`)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-[#262626] bg-[#131313] px-4 py-4 text-left transition-colors active:bg-[#1a1a1a]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(18,239,211,0.2)] bg-[rgba(18,239,211,0.1)]">
                    <TrendingUp size={16} className="text-[#12EFD3]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{session.name}</p>
                    <p className="mt-0.5 text-xs text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {session.date} - {session.duration} min - {session.muscle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-[#12EFD3]">{session.kcal} kcal</span>
                    <span className="text-xs text-[#ADAAAA]">
                      {(session.volume / 1000).toFixed(1)}k kg{deltaText ? ` - ${deltaText}` : ''}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
