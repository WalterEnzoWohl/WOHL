import { Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

type OverlayBounds = { top: number; left: number; width: number; height: number } | null;

type MissingSetEntry = {
  exerciseName: string;
  exerciseIdx: number;
  count: number;
};

interface FinishSessionModalProps {
  isOpen: boolean;
  isHistoryEditSession: boolean;
  isSubmittingSession: boolean;
  missingSets: MissingSetEntry[];
  overlayBounds: OverlayBounds;
  onFinish: () => void;
  onDiscard: () => void;
  onContinue: () => void;
  onDeleteSession: () => void;
  onJumpToMissing: (exerciseIdx: number) => void;
}

export function FinishSessionModal({
  isOpen,
  isHistoryEditSession,
  isSubmittingSession,
  missingSets,
  overlayBounds,
  onFinish,
  onDiscard,
  onContinue,
  onDeleteSession,
  onJumpToMissing,
}: FinishSessionModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed z-40 flex items-center justify-center px-5 py-6"
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
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/70"
        onClick={onContinue}
        type="button"
      />
      <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
        <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
        <div className="overflow-y-auto px-5 pb-6 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
            {isHistoryEditSession ? 'Edición de sesión' : 'Sesión activa'}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {isHistoryEditSession ? 'Guardar cambios' : 'Finalizar entrenamiento'}
          </h3>

          {missingSets.length > 0 && !isHistoryEditSession && (
            <>
              <p className="mt-2 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Tenés {missingSets.reduce((acc, m) => acc + m.count, 0)}{' '}
                {missingSets.reduce((acc, m) => acc + m.count, 0) === 1
                  ? 'serie pendiente'
                  : 'series pendientes'}{' '}
                sin completar:
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {missingSets.map(({ exerciseName, exerciseIdx, count }) => (
                  <button
                    key={exerciseIdx}
                    onClick={() => onJumpToMissing(exerciseIdx)}
                    className="flex items-center justify-between rounded-2xl border border-[rgba(245,185,66,0.22)] bg-[rgba(245,185,66,0.08)] px-4 py-3 text-left"
                    type="button"
                  >
                    <span className="text-sm font-semibold text-white">{exerciseName}</span>
                    <span className="text-xs font-semibold text-[#F5B942]">
                      {count} pendiente{count > 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={onFinish}
              disabled={isSubmittingSession}
              className="flex w-full items-center justify-center rounded-2xl bg-[#00C9A7] py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors active:bg-[#00b092] disabled:opacity-45"
              type="button"
            >
              {isSubmittingSession
                ? 'Guardando...'
                : isHistoryEditSession
                  ? 'Guardar cambios'
                  : missingSets.length > 0
                    ? 'Finalizar de todas formas'
                    : 'Finalizar entrenamiento'}
            </button>

            <button
              onClick={onContinue}
              className="flex w-full items-center justify-center rounded-2xl border border-[#203347] bg-[#2A2A2A] py-4 text-sm font-semibold text-white transition-colors active:bg-[#343434]"
              type="button"
            >
              {isHistoryEditSession ? 'Seguir editando' : 'Continuar entrenamiento'}
            </button>

            {isHistoryEditSession ? (
              <button
                onClick={onDeleteSession}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(229,57,53,0.22)] bg-[rgba(229,57,53,0.08)] py-4 text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.14)]"
                type="button"
              >
                <Trash2 size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Eliminar entrenamiento</span>
              </button>
            ) : (
              <button
                onClick={onDiscard}
                className="flex w-full items-center justify-center rounded-2xl border border-[#203347] bg-[#13263A] py-4 text-sm font-semibold text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.08)]"
                type="button"
              >
                Descartar entrenamiento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
