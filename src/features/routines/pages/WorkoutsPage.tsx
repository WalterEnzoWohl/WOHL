import type { MouseEvent } from 'react';
import { useState } from 'react';
import { AlertCircle, BookOpen, Bot, CheckCircle2, Clock, Copy, ExternalLink, FileUp, LayoutGrid, Pencil, Plus, Settings, Target, Trash2, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ActiveWorkoutEditLockModal } from '@/shared/components/layout/ActiveWorkoutEditLockModal';
import { Header } from '@/shared/components/layout/Header';
import type { Routine } from '@/shared/types/models';
import { useAppData } from '@/core/app-data/AppDataContext';
import { formatCompactWeight } from '@/shared/lib/unitUtils';
import { WeeklyMuscleLoad } from '@/features/home/components/WeeklyMuscleLoad';
import { loadExerciseCatalog, buildExerciseTemplateFromCatalog } from '@/features/exercises/lib/exerciseCatalog';

// ─── Import Routine Modal ──────────────────────────────────────────────────────

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

function ImportRoutineModal({ onClose, onSave }: { onClose: () => void; onSave: (r: Routine) => Promise<void> }) {
  const [json, setJson] = useState('');
  const [state, setState] = useState<ImportState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied'>('idle');

  const handleOpenChatGPT = async () => {
    setCopyState('copying');
    try {
      const res = await fetch('/wohl_ia_prompt.txt');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="fixed inset-0 bg-black/75" onClick={state !== 'loading' ? onClose : undefined} />
      <div className="relative w-full max-w-[430px] rounded-t-[2rem] border-t border-[rgba(0,201,167,0.18)] bg-[#0E1F30] px-5 pb-8 pt-5"
        style={{ boxShadow: '0 -24px 60px rgba(0,0,0,0.55)', maxHeight: '92dvh', overflowY: 'auto' }}>

        {/* Header */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="h-1.5 w-12 rounded-full bg-[#3A3F50]" />
          {state !== 'loading' && (
            <button type="button" onClick={onClose}
              className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)]"
              aria-label="Cerrar">
              <X size={15} className="text-[#9BAEC1]" />
            </button>
          )}
        </div>

        <div className="mb-1 flex items-center gap-2">
          <Bot size={18} className="text-[#00C9A7]" />
          <h2 className="text-xl font-bold tracking-tight text-white">Rutina con IA</h2>
        </div>

        {/* Steps */}
        <div className="mb-5 mt-3 flex flex-col gap-2">
          {[
            { n: '1', text: 'Hacé clic en el botón → se copia el prompt y se abre ChatGPT' },
            { n: '2', text: 'En ChatGPT, pegá el texto (Ctrl+V) y enviá el mensaje' },
            { n: '3', text: 'Copiá el JSON que te devuelve y pegalo en el campo de abajo' },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(0,201,167,0.15)] text-[10px] font-bold text-[#00C9A7]">{n}</span>
              <p className="text-xs leading-relaxed text-[#9BAEC1]">{text}</p>
            </div>
          ))}
        </div>

        {/* Open ChatGPT CTA */}
        <button
          type="button"
          onClick={handleOpenChatGPT}
          disabled={copyState === 'copying'}
          className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-[rgba(0,201,167,0.22)] bg-[rgba(0,201,167,0.07)] px-4 py-3.5 text-left transition-colors active:bg-[rgba(0,201,167,0.12)] disabled:opacity-60"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,201,167,0.3)] bg-[rgba(0,201,167,0.12)]">
            {copyState === 'copied'
              ? <CheckCircle2 size={16} className="text-[#00C9A7]" />
              : copyState === 'copying'
                ? <Copy size={16} className="animate-pulse text-[#00C9A7]" />
                : <ExternalLink size={16} className="text-[#00C9A7]" />
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white">
              {copyState === 'copied' ? '¡Prompt copiado! ChatGPT abierto' : 'Copiar prompt y abrir ChatGPT'}
            </p>
            <p className="text-xs text-[#00C9A7]">
              {copyState === 'copying' ? 'Copiando...' : 'Paso 1 de 3'}
            </p>
          </div>
        </button>

        {/* Post-copy instruction */}
        {copyState === 'copied' && (
          <div className="mb-5 rounded-2xl border border-[rgba(0,201,167,0.25)] bg-[rgba(0,201,167,0.08)] px-4 py-3">
            <p className="mb-1 text-xs font-bold text-[#00C9A7]">Siguiente paso →</p>
            <p className="text-xs leading-relaxed text-[#C8D1DB]">
              En la pestaña de ChatGPT que se abrió, hacé clic en el campo de texto y presioná <span className="font-bold text-white">Ctrl+V</span> para pegar el prompt. Luego enviá el mensaje y esperá la respuesta.
            </p>
          </div>
        )}

        {/* JSON textarea */}
        {state !== 'success' ? (
          <>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#9BAEC1]">
              Pegá el JSON que generó ChatGPT
            </label>
            <textarea
              value={json}
              onChange={(e) => { setJson(e.target.value); if (state === 'error') setState('idle'); }}
              placeholder={'{\n  "wohl_routine": true,\n  "name": "Mi rutina",\n  ...\n}'}
              rows={10}
              className="mb-4 w-full resize-none rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0A1824] px-4 py-3 font-mono text-xs text-[#C8D1DB] outline-none focus:border-[rgba(0,201,167,0.45)] focus:ring-0"
              style={{ fontFamily: 'monospace' }}
              disabled={state === 'loading'}
            />

            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[rgba(255,122,140,0.3)] bg-[rgba(255,122,140,0.08)] px-4 py-3">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#FF7A8C]" />
                <p className="text-sm text-[#FF7A8C]">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleImport()}
              disabled={!json.trim() || state === 'loading'}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00C9A7] py-4 font-extrabold text-[#041016] shadow-[0_0_20px_rgba(0,201,167,0.2)] transition-colors active:bg-[#009F86] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileUp size={18} />
              {state === 'loading' ? 'Importando...' : 'Importar rutina'}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(0,201,167,0.3)] bg-[rgba(0,201,167,0.12)]">
              <CheckCircle2 size={32} className="text-[#00C9A7]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Rutina importada</p>
              <p className="mt-1 text-sm text-[#9BAEC1]">Ya aparece en tu lista de rutinas.</p>
            </div>
            {warnings.length > 0 && (
              <div className="flex items-start gap-2 rounded-xl border border-[rgba(245,185,66,0.3)] bg-[rgba(245,185,66,0.08)] px-4 py-3 text-left">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#F5B942]" />
                <p className="text-xs text-[#F5B942]">{warnings[0]}</p>
              </div>
            )}
            <button type="button" onClick={onClose}
              className="mt-2 w-full rounded-2xl bg-[#00C9A7] py-4 font-extrabold text-[#041016]">
              Listo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkoutsPage() {
  const navigate = useNavigate();
  const { activeWorkout, appContext, appSettings, copyRoutine, deleteRoutine, routines, saveRoutine, sessionHistory, setActiveRoutine } =
    useAppData();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [blockedRoutineId, setBlockedRoutineId] = useState<number | null>(null);
  const [switchingRoutineId, setSwitchingRoutineId] = useState<number | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const activeRoutine = routines.find((routine) => routine.id === appContext.activeRoutineId) ?? null;
  const hasRoutines = routines.length > 0;
  const filteredVolume = activeRoutine
    ? sessionHistory
        .filter((session) => session.routineId === activeRoutine.id)
        .reduce((acc, session) => acc + session.volume, 0)
    : 0;
  const weeklyHours = ((activeRoutine?.daysPerWeek ?? 0) * (activeRoutine?.avgMinutes ?? 0)) / 60;
  const headerSettingsAction = (
    <button
      onClick={() => navigate('/config')}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,201,167,0.22)] bg-[rgba(0,201,167,0.08)] transition-colors hover:bg-[rgba(0,201,167,0.14)]"
      type="button"
      aria-label="Abrir configuración"
    >
      <Settings size={17} className="text-[#00C9A7]" />
    </button>
  );

  const copyCurrentRoutine = async (routine: Routine, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await copyRoutine(routine);
  };

  const deleteCurrentRoutine = async (id: number) => {
    await deleteRoutine(id);
    setDeleteId(null);
  };

  const handleSelectRoutine = async (routineId: number, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSwitchingRoutineId(routineId);

    try {
      await setActiveRoutine(routineId);
    } finally {
      setSwitchingRoutineId(null);
    }
  };

  const handleEditRoutine = (routineId: number, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (activeWorkout) {
      setBlockedRoutineId(routineId);
      return;
    }

    navigate(`/routine/${routineId}/edit`);
  };

  return (
    <div className="relative flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header rightContent={headerSettingsAction} />

      <div className="flex flex-col gap-6 px-5 py-6 pb-4">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Entrenamientos</h1>
          <button
            onClick={() => navigate('/routine/new')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00C9A7] py-4 shadow-[0_0_15px_rgba(0,201,167,0.15)] transition-colors active:bg-[#009F86]"
            type="button"
          >
            <Plus size={22} className="text-black" strokeWidth={2.5} />
            <span className="text-base font-extrabold text-black">Crear nueva rutina</span>
          </button>
          <button
            onClick={() => navigate('/program-templates')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(0,201,167,0.24)] bg-[rgba(0,201,167,0.08)] py-4 font-bold text-[#00C9A7] transition-colors active:bg-[rgba(0,201,167,0.14)]"
            type="button"
          >
            <LayoutGrid size={18} />
            Explorar Rutinas
          </button>
          <button
            onClick={() => navigate('/exercise-explore')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#203347] bg-[#13263A] py-4 font-bold text-[#9BAEC1] transition-colors active:bg-[#1a3047]"
            type="button"
          >
            <BookOpen size={18} />
            Explorar ejercicios
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(127,152,255,0.25)] bg-[rgba(127,152,255,0.07)] py-4 font-bold text-[#7F98FF] transition-colors active:bg-[rgba(127,152,255,0.14)]"
            type="button"
          >
            <Bot size={18} />
            Importar rutina IA
          </button>
        </div>

        {hasRoutines ? (
          activeRoutine ? (
            <div className="rounded-3xl border border-[rgba(0,201,167,0.18)] bg-[linear-gradient(180deg,rgba(0,201,167,0.10),rgba(19,19,19,1))] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
                    Rutina actual seleccionada
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">{activeRoutine.name}</h2>
                  <p className="mt-2 text-sm text-[#C8C8C8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {activeRoutine.description ??
                      `${activeRoutine.daysPerWeek} días por semana con ${activeRoutine.days.length} entrenamientos disponibles.`}
                  </p>
                </div>
                <div className="rounded-2xl border border-[rgba(0,201,167,0.2)] bg-[rgba(0,201,167,0.08)] p-3">
                  <CheckCircle2 size={22} className="text-[#00C9A7]" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#13263A] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock size={14} className="text-[#00C9A7]" />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider text-[#777575]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Tiempo semanal
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{weeklyHours.toFixed(1)}</span>
                    <span className="text-sm font-bold italic text-[#9BAEC1]">h</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#13263A] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#00C9A7]" />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider text-[#777575]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Volumen histórico
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      {formatCompactWeight(filteredVolume, appSettings.weightUnit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[rgba(229,57,53,0.18)] bg-[rgba(229,57,53,0.08)] p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[rgba(229,57,53,0.15)] p-3">
                  <Target size={20} className="text-[#FF8A80]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FF8A80]">
                    Sin rutina seleccionada
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
                    Elegí una rutina para empezar
                  </h2>
                  <p className="mt-2 text-sm text-[#D6B9B9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Seleccioná una de tus rutinas disponibles abajo para actualizar los entrenamientos,
                    el resumen de la rutina y las opciones de inicio.
                  </p>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="rounded-3xl border border-[#203347] bg-[#13263A] p-6 text-sm text-[#9BAEC1]">
            Todavía no tenés rutinas creadas. Creá una nueva para empezar a entrenar.
          </div>
        )}

        <WeeklyMuscleLoad />

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-white">Cambiar rutina</span>
          <span
            className="rounded-full border border-[rgba(0,201,167,0.18)] bg-[rgba(0,201,167,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#00C9A7]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {routines.length} disponibles
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {routines.map((routine) => {
            const isActive = routine.id === activeRoutine?.id;

            return (
              <button
                key={routine.id}
                onClick={() => navigate(`/routine/${routine.id}`)}
                className={`relative w-full overflow-hidden rounded-2xl text-left transition-colors active:bg-[#1a1a1a] ${
                  isActive
                    ? 'border border-[rgba(0,201,167,0.18)] bg-[rgba(0,201,167,0.06)]'
                    : 'border border-[#203347] bg-[#13263A]'
                }`}
                style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              >
                <div
                  className="absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl"
                  style={{ background: routine.color }}
                />

                <div className="flex flex-col gap-4 py-5 pl-6 pr-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold leading-tight text-white">{routine.name}</h3>
                        {isActive && (
                          <span className="rounded-full bg-[rgba(0,201,167,0.12)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#00C9A7]">
                            Activa
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {routine.daysPerWeek} días / semana
                      </p>
                    </div>
                    <div className="-mr-1 flex items-center gap-1">
                      <button
                        onClick={(event) => void copyCurrentRoutine(routine, event)}
                        className="rounded-xl p-2 transition-colors hover:bg-white/5"
                        type="button"
                      >
                        <Copy size={14} className="text-white/70" />
                      </button>
                      <button
                        onClick={(event) => handleEditRoutine(routine.id, event)}
                        className="rounded-xl p-2 transition-colors hover:bg-white/5"
                        type="button"
                      >
                        <Pencil size={14} className="text-white/70" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteId(routine.id);
                        }}
                        className="rounded-xl p-2 transition-colors hover:bg-white/5"
                        type="button"
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
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#203347]">
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
                            className="rounded-lg bg-[#203347] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#777575]"
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

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {routine.days.length} entrenamientos disponibles
                    </p>
                    <button
                      onClick={(event) => void handleSelectRoutine(routine.id, event)}
                      disabled={isActive || switchingRoutineId === routine.id}
                      className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors disabled:opacity-60 ${
                        isActive
                          ? 'border border-[rgba(0,201,167,0.18)] bg-[rgba(0,201,167,0.1)] text-[#00C9A7]'
                          : 'bg-[#00C9A7] text-black active:bg-[#009F86]'
                      }`}
                      type="button"
                    >
                      {isActive
                        ? 'Rutina actual'
                        : switchingRoutineId === routine.id
                        ? 'Cambiando...'
                        : 'Usar rutina'}
                    </button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="fixed inset-0 bg-black/70" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-[430px] rounded-3xl p-6" style={{ background: '#1A2D42' }}>
            <h3 className="mb-2 text-center text-xl font-bold text-white">Eliminar rutina</h3>
            <p className="mb-6 text-center text-sm text-[#9BAEC1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => void deleteCurrentRoutine(deleteId)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E53935] py-4 font-bold text-white"
                type="button"
              >
                <Trash2 size={16} />
                Eliminar rutina
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="w-full rounded-2xl bg-[#203347] py-4 font-semibold text-white"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {blockedRoutineId !== null && activeWorkout && (
        <ActiveWorkoutEditLockModal
          activeWorkoutName={activeWorkout.sessionName}
          onResume={() => navigate('/session')}
          onFinish={() => navigate('/session', { state: { action: 'finish' } })}
          onCancel={() => setBlockedRoutineId(null)}
        />
      )}

      {showImportModal && (
        <ImportRoutineModal
          onClose={() => setShowImportModal(false)}
          onSave={async (routine) => {
            await saveRoutine(routine);
          }}
        />
      )}

    </div>
  );
}
