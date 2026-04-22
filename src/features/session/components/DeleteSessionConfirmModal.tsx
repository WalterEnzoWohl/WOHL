import { Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

type OverlayBounds = { top: number; left: number; width: number; height: number } | null;

interface DeleteSessionConfirmModalProps {
  isOpen: boolean;
  overlayBounds: OverlayBounds;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteSessionConfirmModal({
  isOpen,
  overlayBounds,
  onConfirm,
  onClose,
}: DeleteSessionConfirmModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed z-50 flex items-center justify-center px-5 py-6"
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
        aria-label="Cancelar"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 flex w-full max-h-[calc(100%-3rem)] flex-col overflow-hidden rounded-3xl bg-[#1A2D42] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
        <div className="mx-auto mb-3 mt-4 h-1 w-10 shrink-0 rounded-full bg-[#203347]" />
        <div className="overflow-y-auto px-5 pb-6 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FF7D7D]">
            Atención
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Eliminar entrenamiento
          </h3>
          <p className="mt-2 text-sm text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Esta acción no se puede deshacer. El registro de esta sesión se eliminará permanentemente.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(229,57,53,0.22)] bg-[rgba(229,57,53,0.08)] py-4 text-[#FF7D7D] transition-colors active:bg-[rgba(229,57,53,0.14)]"
              type="button"
            >
              <Trash2 size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Sí, eliminar</span>
            </button>
            <button
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-2xl border border-[#203347] bg-[#13263A] py-4 text-sm font-semibold text-white transition-colors active:bg-[rgba(255,255,255,0.04)]"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
