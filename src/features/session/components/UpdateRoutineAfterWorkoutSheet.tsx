import { LayoutList } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { RoutineChangeSummary } from '@/features/session/lib/routineUpdateHelpers';
import { buildRoutineChangeSummary } from '@/features/session/lib/routineUpdateHelpers';

type OverlayBounds = { top: number; left: number; width: number; height: number } | null;

interface UpdateRoutineAfterWorkoutSheetProps {
  open: boolean;
  routineName: string;
  changeSummary: RoutineChangeSummary;
  isSubmitting?: boolean;
  overlayBounds: OverlayBounds;
  onUpdateRoutine: () => void;
  onKeepOriginal: () => void;
}

export function UpdateRoutineAfterWorkoutSheet({
  open,
  routineName,
  changeSummary,
  isSubmitting = false,
  overlayBounds,
  onUpdateRoutine,
  onKeepOriginal,
}: UpdateRoutineAfterWorkoutSheetProps) {
  if (!open) return null;

  const summaryText = buildRoutineChangeSummary(changeSummary);

  return createPortal(
    <div
      className="fixed z-50 flex items-end overflow-hidden"
      style={
        overlayBounds
          ? {
              top: overlayBounds.top,
              left: overlayBounds.left,
              width: overlayBounds.width,
              height: overlayBounds.height,
            }
          : { inset: 0 }
      }
    >
      <button
        aria-label="Mantener rutina original"
        className="absolute inset-0 bg-black/65"
        onClick={onKeepOriginal}
        disabled={isSubmitting}
        type="button"
      />

      <div className="relative z-10 w-full rounded-t-[28px] bg-[#152232] shadow-[0_-20px_60px_rgba(0,0,0,0.55)]">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[rgba(255,255,255,0.1)]" />

        <div className="px-5 pb-8 pt-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(0,201,167,0.18)] bg-[rgba(0,201,167,0.1)]">
              <LayoutList size={18} className="text-[#00C9A7]" />
            </div>
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00C9A7]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Cambios detectados
              </p>
              <h3 className="text-xl font-bold leading-tight tracking-tight text-white">
                Actualizar rutina
              </h3>
            </div>
          </div>

          <p className="text-sm leading-6 text-[#9BAEC1]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Detectamos cambios en esta sesión.{' '}
            <span className="text-white">¿Querés aplicarlos a tu rutina</span>{' '}
            <span className="font-semibold text-white">{routineName}</span>?
          </p>

          {summaryText ? (
            <div className="mt-4 rounded-2xl border border-[rgba(0,201,167,0.12)] bg-[rgba(0,201,167,0.06)] px-4 py-3">
              <p className="text-sm leading-6 text-[#7FDFD0]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {summaryText}
              </p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={onUpdateRoutine}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-2xl bg-[#00C9A7] py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors active:bg-[#00b092] disabled:opacity-50"
              type="button"
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar rutina'}
            </button>

            <button
              onClick={onKeepOriginal}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-2xl border border-[#1E3550] bg-[#1A2D42] py-4 text-sm font-semibold text-white transition-colors active:bg-[#223347] disabled:opacity-50"
              type="button"
            >
              Mantener rutina original
            </button>

            <p
              className="text-center text-[11px] text-[#546880]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Tu sesión se guardará igual en ambos casos.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
