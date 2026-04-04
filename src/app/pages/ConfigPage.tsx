import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, LogOut, Bell, User, Lock, Shield, Timer, TrendingUp, Download, HelpCircle, Mail, FileText, Moon } from 'lucide-react';
import { Header } from '../components/Header';

export default function ConfigPage() {
  const navigate = useNavigate();
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoWeight, setAutoWeight] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-[#12EFD3]' : 'bg-[#262626]'}`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
          value ? 'translate-x-5 bg-[#003830]' : 'translate-x-0.5 bg-[#ADAAAA]'
        }`}
      />
    </button>
  );

  const SectionLabel = ({ children }: { children: string }) => (
    <div className="px-1 mb-2">
      <span
        className="text-[10px] font-bold uppercase tracking-[2.4px]"
        style={{ color: 'rgba(140,255,233,0.7)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {children}
      </span>
    </div>
  );

  const SettingRow = ({
    icon, label, right, onClick, danger,
  }: {
    icon: React.ReactNode;
    label: string;
    right?: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 border-b border-[rgba(72,72,71,0.1)] last:border-b-0 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <span
          className={`font-medium text-base ${danger ? 'text-[#E53935]' : 'text-white'}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {label}
        </span>
      </div>
      {right || <ChevronRight size={16} className="text-[#ADAAAA]" />}
    </button>
  );

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title="Configuración" onBack={() => navigate('/profile')} />

      <div className="flex flex-col gap-6 px-5 py-6 pb-6">
        {/* Page title */}
        <div>
          <h1 className="text-white font-extrabold text-4xl tracking-tight">Configuración</h1>
          <p className="text-[#ADAAAA] text-base mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Gestiona tus preferencias de cuenta y rendimiento.
          </p>
        </div>

        {/* CUENTA */}
        <div>
          <SectionLabel>Cuenta</SectionLabel>
          <div className="bg-[#131313] rounded-2xl overflow-hidden">
            <SettingRow
              icon={<User size={15} className="text-[#8CFFE9]" />}
              label="Editar Perfil"
              onClick={() => navigate('/profile/edit')}
            />
            <SettingRow icon={<Lock size={15} className="text-[#8CFFE9]" />} label="Cambiar Contraseña" />
            <SettingRow icon={<Shield size={15} className="text-[#8CFFE9]" />} label="Privacidad" />
          </div>
        </div>

        {/* APP */}
        <div>
          <SectionLabel>App</SectionLabel>
          <div className="bg-[#131313] rounded-2xl overflow-hidden">
            {/* Units */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(72,72,71,0.1)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="#3AFBF3">
                    <path d="M2 9h14M9 2v14" stroke="#3AFBF3" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <span className="text-white font-medium text-base">Unidades (kg/lb)</span>
              </div>
              <div className="bg-[#262626] rounded-xl p-1 flex gap-0.5">
                <button
                  onClick={() => setUnit('kg')}
                  className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
                    unit === 'kg' ? 'bg-[#8CFFE9] text-[#006256]' : 'text-[#ADAAAA]'
                  }`}
                >
                  KG
                </button>
                <button
                  onClick={() => setUnit('lb')}
                  className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
                    unit === 'lb' ? 'bg-[#8CFFE9] text-[#006256]' : 'text-[#ADAAAA]'
                  }`}
                >
                  LB
                </button>
              </div>
            </div>

            {/* Sounds */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(72,72,71,0.1)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center">
                  <Bell size={15} className="text-[#3AFBF3]" />
                </div>
                <span className="text-white font-medium text-base">Sonidos</span>
              </div>
              <Toggle value={sounds} onChange={() => setSounds((s) => !s)} />
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(72,72,71,0.1)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center">
                  <svg width="22" height="17" viewBox="0 0 22 17" fill="#3AFBF3">
                    <path d="M1 8.5h20M5 3l-4 5.5 4 5.5M17 3l4 5.5-4 5.5" stroke="#3AFBF3" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <span className="text-white font-medium text-base">Vibración</span>
              </div>
              <Toggle value={vibration} onChange={() => setVibration((v) => !v)} />
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center">
                  <Moon size={15} className="text-[#3AFBF3]" />
                </div>
                <span className="text-white font-medium text-base">Tema</span>
              </div>
              <span className="text-[#8CFFE9] font-semibold text-sm">Oscuro</span>
            </div>
          </div>
        </div>

        {/* ENTRENAMIENTOS */}
        <div>
          <SectionLabel>Entrenamientos</SectionLabel>
          <div className="bg-[#131313] rounded-2xl overflow-hidden">
            <SettingRow
              icon={<Timer size={15} className="text-[#3AFBF3]" />}
              label="Temporizador de descanso"
              right={
                <div className="flex flex-col items-end">
                  <span className="text-[#ADAAAA] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Por defecto 90s</span>
                  <ChevronRight size={14} className="text-[#ADAAAA] mt-0.5" />
                </div>
              }
            />
            <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(72,72,71,0.1)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center">
                  <TrendingUp size={15} className="text-[#3AFBF3]" />
                </div>
                <div>
                  <span className="text-white font-medium text-base block">Incrementar peso automático</span>
                </div>
              </div>
              <Toggle value={autoWeight} onChange={() => setAutoWeight((a) => !a)} />
            </div>
            <SettingRow icon={<Download size={15} className="text-[#3AFBF3]" />} label="Exportar a CSV" />
          </div>
        </div>

        {/* SOPORTE */}
        <div>
          <SectionLabel>Soporte</SectionLabel>
          <div className="bg-[#131313] rounded-2xl overflow-hidden">
            <SettingRow icon={<HelpCircle size={15} className="text-[#3AFBF3]" />} label="Centro de Ayuda" />
            <SettingRow icon={<Mail size={15} className="text-[#3AFBF3]" />} label="Contactar Soporte" />
            <SettingRow icon={<FileText size={15} className="text-[#3AFBF3]" />} label="Términos y Condiciones" />
          </div>
        </div>

        {/* Logout */}
        <div className="bg-[#131313] rounded-2xl overflow-hidden">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 text-[#E53935] hover:bg-[rgba(229,57,53,0.05)] transition-colors"
          >
            <LogOut size={16} />
            <span className="font-semibold text-base">Cerrar Sesión</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pb-2">
          <p className="text-[#333] text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
            GYMUP V2.0 • PRECISION KINETIC ENGINE
          </p>
        </div>
      </div>
    </div>
  );
}
