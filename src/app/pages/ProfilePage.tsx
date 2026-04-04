import { useState } from 'react';
import { Bell, ChevronRight, Flame, LogOut, Pencil, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { userProfileAvatar } from '@/assets';
import { Header } from '../components/Header';
import { appContext, sessionHistory } from '../data/mockData';
import { calculateNutritionTargets, getMuscleProgressInsights, GOAL_OPTIONS } from '../data/profileInsights';
import { updateUserProfile, useUserProfile } from '../data/userProfileStore';

const historyDays = [
  { day: 'LUN', num: 6, isoDate: '2026-04-06' },
  { day: 'MAR', num: 7, isoDate: '2026-04-07' },
  { day: 'MIÉ', num: 8, isoDate: '2026-04-08' },
  { day: 'JUE', num: 9, isoDate: '2026-04-09' },
  { day: 'VIE', num: 10, isoDate: '2026-04-10' },
  { day: 'SÁB', num: 11, isoDate: '2026-04-11' },
  { day: 'DOM', num: 12, isoDate: '2026-04-12' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const userProfile = useUserProfile();
  const [selectedDate, setSelectedDate] = useState('2026-04-07');
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const filteredSessions = sessionHistory.filter((session) => session.isoDate === selectedDate);
  const nutritionTargets = calculateNutritionTargets(userProfile);
  const monthlyMuscleProgress = getMuscleProgressInsights(appContext.todayIso);

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header
        rightContent={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/config')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(18,239,211,0.22)] bg-[#131313] transition-colors hover:bg-white/5"
              aria-label="Ir a ajustes"
            >
              <Settings size={16} className="text-[#12EFD3]" />
            </button>
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(18,239,211,0.22)] bg-[#131313] transition-colors hover:bg-white/5"
              aria-label="Editar perfil"
            >
              <Pencil size={16} className="text-[#12EFD3]" />
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-6 px-5 py-5 pb-4">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="flex items-start justify-between gap-4 pt-4 pb-5">
            <div className="flex min-w-0 flex-1 flex-col gap-1 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]">
                {userProfile.trainingLevel}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">{userProfile.fullName}</h1>
              <p className="text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Miembro desde {userProfile.memberSince}
              </p>
            </div>
            <div className="flex h-36 w-36 flex-shrink-0 items-start justify-center pt-4">
              <div className="relative h-[104px] w-[104px] overflow-hidden rounded-full border-2 border-[rgba(18,239,211,0.35)] bg-[#1C2030] shadow-[0_0_28px_rgba(18,239,211,0.18)]">
                <img src={userProfileAvatar} alt={userProfile.fullName} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'PESO', value: userProfile.weightKg.toString(), unit: 'kg' },
            { label: 'ALTURA', value: userProfile.heightCm.toString(), unit: 'cm' },
            { label: 'EDAD', value: userProfile.age.toString(), unit: 'años' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#131313] p-4">
              <p
                className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white">{value}</span>
                <span className="text-sm font-bold text-[#12EFD3]">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#262626] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]">
              Actividad
            </p>
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-[#12EFD3]" />
              <div>
                <span className="block text-lg font-bold text-white">{userProfile.activityLevel}</span>
                <span className="text-xs text-[#12EFD3]">Factor {userProfile.activityFactor}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowObjectiveModal(true)}
            className="rounded-xl border border-[rgba(18,239,211,0.2)] bg-[#005147] p-4 text-left transition-colors active:bg-[#006257]"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]">Objetivo</p>
            <span className="text-lg font-extrabold text-white">{userProfile.goal}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]">
                Calorías recomendadas para {nutritionTargets.goalTitle}
              </p>
              <p className="text-sm leading-6 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                Estimado con Harris-Benedict y tu factor de actividad {userProfile.activityFactor}. Tu mantenimiento ronda las {nutritionTargets.maintenanceCalories} kcal.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(18,239,211,0.18)] bg-[rgba(18,239,211,0.1)] px-4 py-3 text-right">
              <span className="block text-2xl font-extrabold text-white">{nutritionTargets.targetCalories}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#12EFD3]">kcal</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Proteínas', value: nutritionTargets.proteinGrams, unit: 'g' },
              { label: 'Carbos', value: nutritionTargets.carbGrams, unit: 'g' },
              { label: 'Grasas', value: nutritionTargets.fatGrams, unit: 'g' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="rounded-xl bg-[#1C2030] px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]">{label}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-white">{value}</span>
                  <span className="text-xs font-bold text-[#12EFD3]">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">Progreso mensual</h2>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313] p-6">
            <div className="flex flex-col gap-5">
              {monthlyMuscleProgress.map((muscleGroup) => (
                <button
                  key={muscleGroup.id}
                  onClick={() => navigate(`/muscle-progress/${muscleGroup.id}`)}
                  className="flex flex-col gap-2 text-left transition-opacity active:opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest text-[#ADAAAA]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {muscleGroup.name}
                    </span>
                    <span className="text-base font-bold text-[#12EFD3]">Niv. {muscleGroup.level}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#262626]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${muscleGroup.progressPercent}%`,
                        background: 'linear-gradient(135deg, #12EFD3 0%, #00A894 100%)',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {muscleGroup.monthlyDirectCount} ejercicios directos este mes
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white">Historial de sesiones</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]"
            >
              Ver todo
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {historyDays.map(({ day, num, isoDate }) => {
              const hasSession = sessionHistory.some((session) => session.isoDate === isoDate);
              const isSelected = selectedDate === isoDate;

              return (
                <button
                  key={isoDate}
                  onClick={() => setSelectedDate(isoDate)}
                  className={`flex min-w-[3.5rem] flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all ${
                    isSelected
                      ? 'bg-[#12EFD3]'
                      : hasSession
                      ? 'border border-[rgba(18,239,211,0.3)] bg-[#262626]'
                      : 'border border-[rgba(255,255,255,0.05)] bg-[#131313]'
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      isSelected ? 'text-black' : 'text-[#ADAAAA]'
                    }`}
                  >
                    {day}
                  </span>
                  <span className={`text-base font-extrabold ${isSelected ? 'text-black' : 'text-white'}`}>
                    {num}
                  </span>
                  {hasSession && !isSelected && <div className="h-1 w-1 rounded-full bg-[#12EFD3]" />}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => navigate(`/session-history/${session.id}`)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313] px-5 py-4 text-left transition-colors active:bg-[#1a1a1a]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(18,239,211,0.2)] bg-[rgba(18,239,211,0.1)]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="#12EFD3">
                      <path d="M3 9h12M9 3v12" stroke="#12EFD3" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{session.name}</p>
                    <p className="mt-0.5 text-xs text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {session.date} - {session.duration} min - {session.muscle}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#12EFD3]">{session.kcal} kcal</span>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313] p-5">
                <p className="text-center text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  No hay sesiones registradas para ese día.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Configuración</h2>
          <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313]">
            {[
              { label: 'Ajustes de cuenta', icon: <Settings size={18} className="text-[#12EFD3]" />, path: '/config' },
              { label: 'Notificaciones', icon: <Bell size={18} className="text-[#12EFD3]" />, path: '/config' },
            ].map(({ label, icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex w-full items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-4 py-4 transition-colors last:border-b-0 hover:bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#262626]">
                    {icon}
                  </div>
                  <span className="text-base font-medium text-white">{label}</span>
                </div>
                <ChevronRight size={16} className="text-[#ADAAAA]" />
              </button>
            ))}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(229,57,53,0.1)]">
                  <LogOut size={18} className="text-[#E53935]" />
                </div>
                <span className="text-base font-medium text-[#E53935]">Cerrar sesión</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showObjectiveModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowObjectiveModal(false)} />
          <div className="relative w-full rounded-3xl p-6" style={{ background: '#1C2030' }}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Cambiar objetivo</h3>
              <button onClick={() => setShowObjectiveModal(false)}>
                <X size={20} className="text-[#ADAAAA]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {GOAL_OPTIONS.map((objective) => (
                <button
                    key={objective}
                    onClick={() => {
                      updateUserProfile({ goal: objective });
                      setShowObjectiveModal(false);
                    }}
                  className={`flex items-center justify-between rounded-2xl px-4 py-4 text-left transition-all ${
                    userProfile.goal === objective
                      ? 'bg-[#12EFD3] text-black'
                      : 'bg-[#262626] text-white hover:bg-[#333]'
                  }`}
                >
                  <span className="font-semibold">{objective}</span>
                  {userProfile.goal === objective && <X size={16} className="rotate-45 text-black" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowLogoutModal(false)} />
          <div className="relative w-full rounded-3xl p-6" style={{ background: '#1C2030' }}>
            <h3 className="mb-2 text-center text-xl font-bold text-white">Cerrar sesión</h3>
            <p className="mb-6 text-center text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
              ¿Seguro que querés salir de tu cuenta?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E53935] py-4 font-bold text-white"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
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
