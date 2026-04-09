import { useState } from 'react';
import { LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { brandLogoWhite } from '@/assets';
import { getAuthRedirectUrl, getSupabaseClient } from '../lib/supabase';

export function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const client = getSupabaseClient();
      const emailRedirectTo = getAuthRedirectUrl();
      const response =
        mode === 'signin'
          ? await client.auth.signInWithPassword({ email: email.trim(), password })
          : await client.auth.signUp({
              email: email.trim(),
              password,
              options: emailRedirectTo
                ? {
                    emailRedirectTo,
                  }
                : undefined,
            });

      if (response.error) {
        throw response.error;
      }

      if (mode === 'signup' && !response.data.session) {
        setMessage('Revisa tu correo para confirmar la cuenta antes de entrar.');
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050710] px-5">
      <div className="w-full max-w-[390px] rounded-[32px] border border-[rgba(18,239,211,0.12)] bg-[#0A0D12] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(18,239,211,0.2)] bg-[#0E0E0E]">
            <img src={brandLogoWhite} alt="GYMUP" className="h-14 w-14 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">GYMUP</h1>
            <p className="mt-2 text-sm text-[#ADAAAA]">
              Entrá con tu cuenta para guardar rutinas y sesiones reales.
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#131313] p-1">
          {[
            { value: 'signin', label: 'Entrar' },
            { value: 'signup', label: 'Crear cuenta' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setMode(item.value as 'signin' | 'signup')}
              className={`rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                mode === item.value ? 'bg-[#12EFD3] text-black' : 'text-[#ADAAAA]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-[#262626] bg-[#131313] px-4 py-3">
              <Mail size={16} className="text-[#12EFD3]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-white outline-none"
                placeholder="vos@gmail.com"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]">Contraseña</span>
            <div className="flex items-center gap-3 rounded-2xl border border-[#262626] bg-[#131313] px-4 py-3">
              <LockKeyhole size={16} className="text-[#12EFD3]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-white outline-none"
                placeholder="Tu contraseña"
              />
            </div>
          </label>

          {error && (
            <div className="rounded-2xl border border-[rgba(229,57,53,0.25)] bg-[rgba(229,57,53,0.12)] px-4 py-3 text-sm text-[#FFB4B2]">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-2xl border border-[rgba(18,239,211,0.2)] bg-[rgba(18,239,211,0.08)] px-4 py-3 text-sm text-[#9EF8EC]">
              {message}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading || !email.trim() || !password.trim()}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#12EFD3] py-4 font-extrabold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <LoaderCircle size={18} className="animate-spin" /> : null}
            {mode === 'signin' ? 'Entrar a GYMUP' : 'Crear cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
}
