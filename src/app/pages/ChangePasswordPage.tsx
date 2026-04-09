import { useState } from 'react';
import { CheckCircle2, Lock, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { getSupabaseClient } from '../lib/supabase';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setStatus('error');
      setMessage('La nueva contraseÃ±a tiene que tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Las contraseÃ±as no coinciden. Revisalas y volvÃ© a intentar.');
      return;
    }

    try {
      setStatus('saving');
      setMessage(null);
      const { error } = await getSupabaseClient().auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setStatus('success');
      setMessage('Tu contraseÃ±a se actualizÃ³ correctamente.');
      setPassword('');
      setConfirmPassword('');
    } catch (caughtError) {
      setStatus('error');
      setMessage(caughtError instanceof Error ? caughtError.message : 'No se pudo cambiar la contraseÃ±a.');
    }
  };

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title="Cambiar contraseÃ±a" onBack={() => navigate('/config')} />

      <div className="flex flex-col gap-6 px-4 py-5 pb-7 sm:px-5 sm:py-6">
        <div className="rounded-3xl border border-[rgba(0,201,167,0.14)] bg-[rgba(0,201,167,0.06)] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(0,201,167,0.12)]">
              <Lock size={20} className="text-[#00C9A7]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-white">ProtegÃ© tu acceso</h1>
              <p className="mt-2 text-sm leading-6 text-[#C8C8C8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                CambiÃ¡ tu contraseÃ±a cuando quieras. La nueva clave se aplica a tu cuenta de Supabase y reemplaza la actual.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-[#13263A] p-5">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00C9A7]" htmlFor="new-password">
                Nueva contraseÃ±a
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="MÃ­nimo 8 caracteres"
                className="w-full rounded-2xl border border-[rgba(0,201,167,0.16)] bg-[#0F131B] px-4 py-3 text-white outline-none transition-colors focus:border-[rgba(0,201,167,0.4)]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00C9A7]" htmlFor="confirm-password">
                Confirmar contraseÃ±a
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="RepetÃ­ la nueva contraseÃ±a"
                className="w-full rounded-2xl border border-[rgba(0,201,167,0.16)] bg-[#0F131B] px-4 py-3 text-white outline-none transition-colors focus:border-[rgba(0,201,167,0.4)]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              status === 'success'
                ? 'border border-[rgba(0,201,167,0.14)] bg-[rgba(0,201,167,0.08)] text-white'
                : 'border border-[rgba(229,57,53,0.16)] bg-[rgba(229,57,53,0.08)] text-[#FFD4D4]'
            }`}
          >
            <div className="flex items-start gap-3">
              {status === 'success' ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#00C9A7]" />
              ) : (
                <ShieldAlert size={18} className="mt-0.5 shrink-0 text-[#FF8A80]" />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => void handleSubmit()}
            disabled={status === 'saving'}
            className="w-full rounded-2xl bg-[#00C9A7] py-4 font-bold text-black disabled:opacity-60"
            type="button"
          >
            {status === 'saving' ? 'Guardando...' : 'Actualizar contraseÃ±a'}
          </button>
          <button
            onClick={() => navigate('/config')}
            className="w-full rounded-2xl bg-[#13263A] py-4 font-semibold text-white"
            type="button"
          >
            Volver a configuraciÃ³n
          </button>
        </div>
      </div>
    </div>
  );
}
