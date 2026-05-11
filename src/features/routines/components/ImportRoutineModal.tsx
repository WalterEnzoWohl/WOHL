import { useState } from 'react';
import { AlertCircle, CheckCircle2, Code2, Copy, ExternalLink, FileUp, HelpCircle, MessageCircle, Sparkles, X } from 'lucide-react';
import type { Routine } from '@/shared/types/models';
import { loadExerciseCatalog, buildExerciseTemplateFromCatalog } from '@/features/exercises/lib/exerciseCatalog';

const ROUTINE_COLORS = ['#00C9A7', '#7F98FF', '#FF7A8C', '#F5B942', '#54D62C', '#A855F7'];

type ImportState = 'idle' | 'loading' | 'success' | 'error';

interface RawImportDay {
  name?: unknown;
  focus?: unknown;
  description?: unknown;
  exercises?: unknown[];
}

interface RawImportExercise {
  slug?: unknown;
  sets?: unknown;
  reps?: unknown;
}

export function ImportRoutineModal({ onClose, onSave }: { onClose: () => void; onSave: (r: Routine) => Promise<void> }) {
  const [json, setJson] = useState('');
  const [state, setState] = useState<ImportState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied'>('idle');
  const [showJsonHelp, setShowJsonHelp] = useState(false);

  const jsonFeedback: 'empty' | 'valid' | 'invalid' = (() => {
    if (!json.trim()) return 'empty';
    try {
      const p = JSON.parse(json.trim());
      if (p && typeof p === 'object' && (p as Record<string, unknown>).wohl_routine) return 'valid';
      return 'invalid';
    } catch { return 'invalid'; }
  })();

  const handleOpenChatGPT = async () => {
    setCopyState('copying');
    try {
      const res = await fetch('/wohl_ia_prompt.txt');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopyState('copied');

      // Try native app first via URL scheme; fall back to web if app isn't installed
      let appOpened = false;
      const onBlur = () => { appOpened = true; };
      window.addEventListener('blur', onBlur, { once: true });
      window.location.href = 'chatgpt://';
      setTimeout(() => {
        window.removeEventListener('blur', onBlur);
        if (!appOpened) {
          window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
        }
      }, 1200);
    } catch {
      setCopyState('idle');
    }
  };

  const handleImport = async () => {
    setState('loading');
    setError(null);
    setWarnings([]);

    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(json.trim());
      } catch {
        throw new Error('El JSON tiene un error de formato. Copiá el bloque completo desde ChatGPT (empezando con { y terminando con }).');
      }

      if (!parsed || typeof parsed !== 'object') throw new Error('El contenido pegado no es un JSON válido.');
      const raw = parsed as Record<string, unknown>;
      if (!raw.wohl_routine) throw new Error('Este JSON no tiene la firma Wohl. Asegurate de usar el prompt oficial y copiar el JSON completo que genera ChatGPT.');
      if (!raw.name || typeof raw.name !== 'string') throw new Error('La rutina no tiene nombre.');
      if (!Array.isArray(raw.days) || raw.days.length === 0) throw new Error('La rutina no tiene días de entrenamiento.');

      const catalog = await loadExerciseCatalog();
      const bySlug = new Map(catalog.map((e) => [e.slug, e]));
      const missedSlugs: string[] = [];

      const color = ROUTINE_COLORS[Math.floor(Math.random() * ROUTINE_COLORS.length)];

      const routine: Routine = {
        id: 0,
        name: (raw.name as string).trim(),
        daysPerWeek: Math.max(1, Math.min(7, Number(raw.daysPerWeek) || (raw.days as unknown[]).length)),
        color,
        categories: [],
        description: typeof raw.description === 'string' ? raw.description.trim() : undefined,
        avgMinutes: Number(raw.avgMinutes) > 0 ? Number(raw.avgMinutes) : undefined,
        days: (raw.days as RawImportDay[]).map((day, di) => ({
          name: typeof day.name === 'string' ? day.name.trim() : `Día ${di + 1}`,
          focus: typeof day.focus === 'string' ? day.focus.trim() : '',
          description: typeof day.description === 'string' ? day.description.trim() : undefined,
          exercises: (Array.isArray(day.exercises) ? day.exercises as RawImportExercise[] : [])
            .map((ex, ei) => {
              const slug = typeof ex.slug === 'string' ? ex.slug.trim() : '';
              const sets = Math.max(1, Math.min(8, Number(ex.sets) || 3));
              const reps = Math.max(1, Math.min(30, Number(ex.reps) || 10));
              const entry = bySlug.get(slug);
              if (!entry && slug) missedSlugs.push(slug);
              if (entry) return buildExerciseTemplateFromCatalog(entry, sets, reps);
              const humanName = slug
                ? slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                : `Ejercicio ${ei + 1}`;
              return {
                id: ei + 1,
                exerciseSlug: slug || undefined,
                name: humanName,
                muscle: 'Pecho',
                sets: Array.from({ length: sets }, (_, i) => ({
                  id: i + 1, kg: 0, reps, rpe: 0, completed: false, kind: 'normal' as const,
                })),
              };
            }),
        })),
      };

      await onSave(routine);
      if (missedSlugs.length > 0) setWarnings([`${missedSlugs.length} ejercicio(s) no encontrados en el catálogo y se importaron sin detalles: ${missedSlugs.slice(0, 3).join(', ')}${missedSlugs.length > 3 ? '...' : ''}`]);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al importar.');
      setState('error');
    }
  };

  // ── Success state ────────────────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div className="fixed inset-0 bg-black/75" onClick={onClose} />
        <div className="relative w-full max-w-[430px] rounded-t-[2rem] bg-[#071625] px-6 pb-10 pt-5"
          style={{ boxShadow: '0 -24px 60px rgba(0,0,0,0.6)' }}>
          <div className="mb-6 flex justify-center">
            <div className="h-1.5 w-12 rounded-full bg-[#3A3F50]" />
          </div>
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[rgba(0,201,167,0.3)] bg-[rgba(0,201,167,0.12)]"
              style={{ boxShadow: '0 0 32px rgba(0,201,167,0.2)' }}>
              <CheckCircle2 size={36} className="text-[#00C9A7]" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white">¡Rutina importada!</p>
              <p className="mt-2 text-sm leading-relaxed text-[#9BAEC1]">Tu rutina ya aparece en la lista.<br />Podés activarla cuando quieras.</p>
            </div>
            {warnings.length > 0 && (
              <div className="flex w-full items-start gap-3 rounded-2xl border border-[rgba(245,185,66,0.25)] bg-[rgba(245,185,66,0.07)] px-4 py-3 text-left">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#F5B942]" />
                <p className="text-xs leading-relaxed text-[#F5B942]">{warnings[0]}</p>
              </div>
            )}
            <button type="button" onClick={onClose}
              className="mt-1 w-full rounded-2xl bg-[#00C9A7] py-4 text-base font-extrabold text-[#041016] shadow-[0_0_24px_rgba(0,201,167,0.25)] active:bg-[#009F86]">
              Listo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main modal ───────────────────────────────────────────────────────────────
  const steps = [
    { n: 1, icon: <ExternalLink size={18} className="text-[#00C9A7]" />, title: 'Abrí ChatGPT', desc: 'Copiamos el prompt por vos y abrimos ChatGPT.' },
    { n: 2, icon: <MessageCircle size={18} className="text-[#00C9A7]" />, title: 'Respondé las preguntas', desc: 'ChatGPT te va a pedir datos sobre objetivo, días, nivel y preferencias.' },
    { n: 3, icon: <Code2 size={18} className="text-[#00C9A7]" />, title: 'Pegá el JSON', desc: 'Volvé a WOHL y pegá solo el bloque JSON final.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="fixed inset-0 bg-black/75" onClick={state !== 'loading' ? onClose : undefined} />
      <div className="relative w-full max-w-[430px] rounded-t-[2rem] bg-[#071625] pt-3"
        style={{ boxShadow: '0 -24px 60px rgba(0,0,0,0.6)', maxHeight: '92dvh', overflowY: 'auto' }}>

        {/* Handle + close */}
        <div className="relative mb-4 flex items-center justify-center px-5 pt-1">
          <div className="h-1.5 w-12 rounded-full bg-[#2A3A4A]" />
          {state !== 'loading' && (
            <button type="button" onClick={onClose} aria-label="Cerrar"
              className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] transition-colors active:bg-[rgba(255,255,255,0.1)]">
              <X size={14} className="text-[#9BAEC1]" />
            </button>
          )}
        </div>

        <div className="px-5">

          {/* Hero */}
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgba(0,201,167,0.25)] bg-[rgba(0,201,167,0.12)]"
              style={{ boxShadow: '0 0 20px rgba(0,201,167,0.15)' }}>
              <Sparkles size={26} className="text-[#00C9A7]" />
            </div>
            <div className="pt-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Crear rutina con IA</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#7F98AE]">
                WOHL prepara un prompt para ChatGPT. Respondé sus preguntas, copiá el JSON final y pegalo acá para importar tu rutina.
              </p>
            </div>
          </div>

          {/* Steps card */}
          <div className="mb-5 rounded-2xl border border-[rgba(0,201,167,0.1)] bg-[#0C1E2E] p-4">
            {steps.map((step, i) => (
              <div key={step.n} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00C9A7] text-xs font-bold text-[#071625]">
                    {step.n}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="my-1 w-px flex-1" style={{ borderLeft: '1.5px dashed rgba(0,201,167,0.28)' }} />
                  )}
                </div>
                <div className={`flex items-start gap-3 ${i < steps.length - 1 ? 'pb-5' : ''}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,201,167,0.15)] bg-[rgba(0,201,167,0.09)]">
                    {step.icon}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-bold text-white">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#7F98AE]">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <button
            type="button"
            onClick={handleOpenChatGPT}
            disabled={copyState === 'copying'}
            className="mb-2.5 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-extrabold text-[#071625] transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: copyState === 'copied' ? '#009F86' : '#00C9A7', boxShadow: '0 0 24px rgba(0,201,167,0.3)' }}
          >
            {copyState === 'copied' ? <CheckCircle2 size={19} /> : copyState === 'copying' ? <Copy size={19} className="animate-pulse" /> : <ExternalLink size={19} />}
            <span className="text-base">
              {copyState === 'copied' ? 'Prompt copiado. ChatGPT abierto' : copyState === 'copying' ? 'Abriendo ChatGPT...' : 'Abrir ChatGPT con prompt listo'}
            </span>
          </button>

          {/* Clipboard hint */}
          <div className="mb-6 flex items-center justify-center gap-1.5">
            <Copy size={11} className="text-[#506070]" />
            <p className="text-[11px] text-[#506070]">El prompt se copiará automáticamente al portapapeles.</p>
          </div>

          {/* JSON card */}
          <div className="mb-4 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0C1E2E] p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,201,167,0.15)] bg-[rgba(0,201,167,0.09)]">
                <Code2 size={16} className="text-[#00C9A7]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Pegá el JSON final</p>
                <p className="text-xs text-[#7F98AE]">Copiá solo el bloque que empieza con {'{'} y termina con {'}'}.</p>
              </div>
            </div>

            <textarea
              value={json}
              onChange={(e) => { setJson(e.target.value); if (state === 'error') { setState('idle'); setError(null); } }}
              placeholder={'{\n  "wohl_routine": true,\n  "name": "Mi rutina",\n  ...\n}'}
              rows={7}
              className="w-full resize-none rounded-xl border bg-[#071625] px-4 py-3 font-mono text-xs text-[#C8D1DB] outline-none transition-colors focus:ring-0"
              style={{
                fontFamily: 'monospace',
                borderColor: jsonFeedback === 'valid' ? 'rgba(0,201,167,0.45)' : jsonFeedback === 'invalid' && json.trim() ? 'rgba(255,122,140,0.3)' : 'rgba(255,255,255,0.08)',
              }}
              disabled={state === 'loading'}
            />

            {jsonFeedback === 'valid' && (
              <div className="mt-2 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#00C9A7]" />
                <p className="text-xs font-semibold text-[#00C9A7]">JSON detectado correctamente</p>
              </div>
            )}
            {jsonFeedback === 'invalid' && json.trim() && !error && (
              <div className="mt-2 flex items-center gap-1.5">
                <AlertCircle size={12} className="text-[#FF7A8C]" />
                <p className="text-xs text-[#FF7A8C]">No pudimos leer la rutina. Asegurate de copiar solo el JSON final.</p>
              </div>
            )}
            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-[rgba(255,122,140,0.25)] bg-[rgba(255,122,140,0.07)] px-3 py-2.5">
                <AlertCircle size={13} className="mt-0.5 shrink-0 text-[#FF7A8C]" />
                <p className="text-xs leading-relaxed text-[#FF7A8C]">{error}</p>
              </div>
            )}

            <button type="button" onClick={() => setShowJsonHelp((v) => !v)}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#7F98AE] transition-colors active:text-[#00C9A7]">
              <HelpCircle size={12} />
              ¿Qué tengo que copiar?
            </button>
            {showJsonHelp && (
              <p className="mt-2 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#071625] px-3 py-2.5 text-xs leading-relaxed text-[#9BAEC1]">
                Copiá únicamente el bloque de código JSON final que te devuelve ChatGPT. Empieza con <span className="font-bold text-white">{'{'}</span> y termina con <span className="font-bold text-white">{'}'}</span>. No copies explicaciones ni texto adicional.
              </p>
            )}
          </div>

          {/* Import button */}
          <button
            type="button"
            onClick={() => void handleImport()}
            disabled={!json.trim() || state === 'loading' || jsonFeedback === 'empty'}
            className="mb-8 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#00C9A7] py-4 text-base font-extrabold text-[#071625] shadow-[0_0_24px_rgba(0,201,167,0.2)] transition-all active:bg-[#009F86] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileUp size={19} />
            {state === 'loading' ? 'Importando...' : 'Importar rutina a WOHL'}
          </button>

        </div>
      </div>
    </div>
  );
}
