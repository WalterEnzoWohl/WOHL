import { Clock, Flame, Play, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { appContext, routines, sessionHistory, weekDays } from '../data/mockData';
import { normalizeGoal } from '../data/profileInsights';
import { useUserProfile } from '../data/userProfileStore';

function buildFocusPreview(day: { exercises: Array<{ muscle: string }> }) {
  const counts = day.exercises.reduce<Record<string, number>>((acc, exercise) => {
    acc[exercise.muscle] = (acc[exercise.muscle] ?? 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const maxCount = entries[0]?.[1] ?? 1;

  return entries.map(([name, count]) => ({
    name,
    width: `${Math.max(32, Math.round((count / maxCount) * 100))}%`,
  }));
}

export default function HomePage() {
  const navigate = useNavigate();
  const userProfile = useUserProfile();
  const activeGoal = normalizeGoal(userProfile.goal).toLowerCase();
  const currentRoutine =
    routines.find((routine) => routine.id === appContext.activeRoutineId) ?? routines[0];
  const currentDay =
    currentRoutine.days.find((day) => day.name === appContext.currentDayName) ?? currentRoutine.days[0];
  const nextDay =
    currentRoutine.days.find((day) => day.name === appContext.nextDayName) ??
    currentRoutine.days[1] ??
    currentDay;
  const latestSession = sessionHistory[0];
  const nextDayPreview = buildFocusPreview(nextDay);
  const comparisonLabel =
    latestSession?.comparisonDelta !== undefined
      ? `${latestSession.comparisonDelta > 0 ? '+' : ''}${latestSession.comparisonDelta.toFixed(1)}%`
      : null;

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header />

      <div className="flex flex-col gap-8 px-5 py-6 pb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[#12EFD3] text-[10px] font-bold uppercase tracking-[0.24em]">
            {appContext.todayLabel}
          </span>
          <h1 className="text-white font-extrabold text-3xl tracking-tight">
            Hola, {userProfile.firstName}
          </h1>
          <p className="text-[#A1A1A1] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Hoy toca {currentDay.name}. Venís con {appContext.streakDays} días seguidos de entrenamiento.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#12EFD3] to-[#0DBDA7] opacity-20 blur-sm" />
          <button
            onClick={() =>
              navigate('/session', {
                state: { routineId: currentRoutine.id, dayName: currentDay.name },
              })
            }
            className="relative w-full overflow-hidden rounded-2xl active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(152deg, rgb(27,59,56) 0%, rgb(28,28,28) 100%)' }}
          >
            <div className="flex flex-col items-center gap-3 px-4 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(18,239,211,0.3)] bg-[rgba(18,239,211,0.15)] shadow-[0_0_20px_rgba(18,239,211,0.3)]">
                <Play size={24} fill="#12EFD3" className="ml-1 text-[#12EFD3]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Iniciar entrenamiento</span>
              <div className="rounded-full border border-[rgba(18,239,211,0.2)] bg-[rgba(18,239,211,0.1)] px-4 py-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]">
                  Sesión actual: {currentDay.name}
                </span>
              </div>
            </div>
            <div className="absolute top-4 right-6 opacity-5">
              <svg width="64" height="80" viewBox="0 0 64 80" fill="white">
                <path d="M36 0L0 44h28L16 80l48-52H36L48 0z" />
              </svg>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[rgba(18,239,211,0.2)]" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold tracking-tight text-white">Próximo entrenamiento</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#12EFD3]">
              {appContext.nextDayLabel}
            </span>
          </div>
          <button
            onClick={() => navigate(`/routine/${currentRoutine.id}`)}
            className="w-full rounded-2xl border border-[#262626] bg-[#111111] p-5 text-left transition-colors active:bg-[#1a1a1a]"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">{nextDay.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Clock size={11} className="text-[#A1A1A1]" />
                  <span className="text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {currentRoutine.avgMinutes ?? 78} min - {nextDay.exercises.length} ejercicios
                  </span>
                </div>
                <p className="mt-3 max-w-[18rem] text-sm text-[#D4D4D4]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {nextDay.focus}. {nextDay.description}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(18,239,211,0.2)] bg-[rgba(18,239,211,0.1)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.5 6.5a4.5 4.5 0 0 1-6.36 0L12 4.36l2.14 2.14A4.5 4.5 0 0 1 20.5 6.5zM3.5 6.5a4.5 4.5 0 0 0 6.36 0L12 4.36 9.86 6.5A4.5 4.5 0 0 0 3.5 6.5z"
                    stroke="#12EFD3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 17.5a4.5 4.5 0 0 0 6.36 0L12 19.64l-2.14-2.14A4.5 4.5 0 0 0 3.5 17.5zM20.5 17.5a4.5 4.5 0 0 1-6.36 0L12 19.64l2.14-2.14A4.5 4.5 0 0 1 20.5 17.5z"
                    stroke="#12EFD3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="12" y1="4.36" x2="12" y2="19.64" stroke="#12EFD3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-3">
              {nextDayPreview.map(({ name, width }) => (
                <div key={name} className="flex items-center justify-between gap-3">
                  <span className="w-24 text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {name}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#262626]">
                    <div
                      className="h-full rounded-full"
                      style={{ width, background: 'linear-gradient(to right, #12EFD3, #0DBDA7)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {nextDay.exercises.slice(0, 3).map((exercise) => (
                <span
                  key={exercise.id}
                  className="rounded-full border border-[rgba(18,239,211,0.18)] bg-[rgba(18,239,211,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#12EFD3]"
                >
                  {exercise.name}
                </span>
              ))}
            </div>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xl font-bold tracking-tight text-white">Resumen semanal</span>
          <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
            <div className="mb-2 flex items-center justify-between">
              {weekDays.map(({ day, completed, missed, active }, index) => (
                <div key={`${day}-${index}`} className="flex flex-col items-center gap-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest ${
                      active ? 'text-[#12EFD3]' : 'text-[#A1A1A1]'
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {day}
                  </span>
                  {completed ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(18,239,211,0.2)] bg-[rgba(18,239,211,0.1)]">
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="#12EFD3">
                        <path d="M1 4L4 7L10 1" stroke="#12EFD3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                  ) : active ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12EFD3] shadow-[0_0_15px_rgba(18,239,211,0.4)]">
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="#0E0E0E">
                        <path d="M6 0L0 7h4L2 12l8-7H6L8 0z" />
                      </svg>
                    </div>
                  ) : missed ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(229,57,53,0.3)] bg-[rgba(229,57,53,0.15)]">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8M9 1L1 9" stroke="#E53935" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#262626]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm text-[#A1A1A1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="font-semibold text-white">{appContext.streakDays} días seguidos</span> - ritmo ideal para sostener tu objetivo de {activeGoal}.
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold tracking-tight text-white">Última sesión</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A1A1A1]">
              {latestSession.dayLabel}
            </span>
          </div>
          <button
            onClick={() => navigate(`/session-history/${latestSession.id}`)}
            className="grid w-full grid-cols-2 gap-4 transition-opacity active:opacity-80"
          >
            <div
              className="relative overflow-hidden rounded-xl border border-[rgba(18,239,211,0.2)] bg-[#131313] p-5 text-left"
              style={{ borderLeftWidth: 4 }}
            >
              <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]">
                Volumen total
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-normal text-white">{latestSession.volume.toLocaleString()}</span>
                <span className="text-sm font-bold italic text-[#ADAAAA]">kg</span>
              </div>
              {comparisonLabel && (
                <div className="mt-1 flex items-center gap-1">
                  <TrendingUp size={12} className="text-[#12EFD3]" />
                  <span className="text-xs font-semibold text-[#12EFD3]">{comparisonLabel} vs anterior</span>
                </div>
              )}
              <div className="absolute top-[-10px] right-[-10px] opacity-5">
                <TrendingUp size={60} className="text-white" />
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-xl border border-[rgba(127,152,255,0.2)] bg-[#131313] p-5 text-left"
              style={{ borderLeftWidth: 4 }}
            >
              <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]">
                Tiempo
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-normal text-white">{latestSession.duration}:00</span>
              </div>
              <div className="mt-1 text-xs text-[#ADAAAA]">{latestSession.name}</div>
              <div className="absolute top-[-10px] right-[-10px] opacity-5">
                <Clock size={60} className="text-white" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
