import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { formatWeightNumber } from '@/shared/lib/unitUtils';
import type { AppSettings, SessionHistoryExerciseSet } from '@/shared/types/models';

type OverlayBounds = { top: number; left: number; width: number; height: number } | null;

export type ExerciseHistoryEntry = {
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  sets: SessionHistoryExerciseSet[];
  maxKg: number;
  notes?: string;
};

interface ExerciseHistorySheetProps {
  isOpen: boolean;
  exerciseName: string;
  entries: ExerciseHistoryEntry[];
  weightUnit: AppSettings['weightUnit'];
  weightUnitLabel: string;
  overlayBounds: OverlayBounds;
  onClose: () => void;
}

export function ExerciseHistorySheet({
  isOpen,
  exerciseName,
  entries,
  weightUnit,
  weightUnitLabel,
  overlayBounds,
  onClose,
}: ExerciseHistorySheetProps) {
  const navigate = useNavigate();

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
        aria-label="Cerrar historial"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] max-w-lg flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
        <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
        <div className="overflow-y-auto px-5 pb-6 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
            Historial del ejercicio
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{exerciseName}</h3>
          <p className="mt-2 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tus registros recientes para este movimiento.
          </p>

          <div className="mt-6 flex max-h-[24rem] flex-col gap-3 overflow-y-auto pr-1">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <button
                  key={`${entry.sessionId}-${entry.sessionDate}`}
                  onClick={() => void navigate(`/session-history/${entry.sessionId}`)}
                  className="rounded-2xl border border-[#2A2F3D] bg-[#13263A] p-4 text-left"
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-white">{entry.sessionName}</p>
                      <p className="mt-1 text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {entry.sessionDate}
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(0,201,167,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#00C9A7]">
                      PR{' '}
                      {entry.maxKg > 0
                        ? `${formatWeightNumber(entry.maxKg, weightUnit)}${weightUnitLabel}`
                        : 'Peso corporal'}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.sets.map((set, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#1A2D42] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#D8E4FF]"
                      >
                        {set.kg > 0
                          ? `${formatWeightNumber(set.kg, weightUnit)}${weightUnitLabel}`
                          : 'PC'}{' '}
                        x {set.reps}
                      </span>
                    ))}
                  </div>
                  {entry.notes && (
                    <p className="mt-3 text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {entry.notes}
                    </p>
                  )}
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-[#2A2F3D] bg-[#13263A] p-5 text-sm text-[#90A4B8]">
                Todavia no hay registros guardados para este ejercicio.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
