import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

type OverlayBounds = { top: number; left: number; width: number; height: number } | null;

export type ExerciseDetailInfo = {
  name: string;
  titleEn: string;
  animationMediaUrl?: string;
  muscle: string;
  secondaryMuscles: string[];
  implement?: string;
  instructions: string[];
  overview: string;
};

interface ExerciseDetailModalProps {
  detail: ExerciseDetailInfo | null;
  overlayBounds: OverlayBounds;
  onClose: () => void;
}

export function ExerciseDetailModal({ detail, overlayBounds, onClose }: ExerciseDetailModalProps) {
  if (!detail) return null;

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
        type="button"
        aria-label="Cerrar instructivo"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex w-full max-h-[calc(100%-3rem)] flex-col overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.42)]"
        style={{ background: '#1A2D42' }}
      >
        <div className="overflow-y-auto">
          {detail.animationMediaUrl ? (
            <video
              key={detail.animationMediaUrl}
              src={detail.animationMediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
              style={{ maxHeight: '260px', objectFit: 'cover' }}
            />
          ) : null}

          <div className="px-5 pb-8 pt-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-xl font-bold leading-tight text-white">{detail.name}</h2>
                <p
                  className="mt-0.5 text-sm text-[#6F859A]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {detail.titleEn}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#203347] text-[#9BAEC1]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[rgba(0,201,167,0.12)] px-3 py-1 text-xs font-semibold text-[#00C9A7]">
                {detail.muscle}
              </span>
              {detail.secondaryMuscles.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-[rgba(155,174,193,0.1)] px-3 py-1 text-xs font-medium text-[#9BAEC1]"
                >
                  {m}
                </span>
              ))}
              {detail.implement ? (
                <span className="rounded-full bg-[rgba(127,152,255,0.12)] px-3 py-1 text-xs font-semibold text-[#7F98FF]">
                  {detail.implement}
                </span>
              ) : null}
            </div>

            {detail.overview ? (
              <p
                className="mb-5 text-sm leading-relaxed text-[#9BAEC1]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {detail.overview}
              </p>
            ) : null}

            {detail.instructions.length > 0 ? (
              <div className="mb-2">
                <p
                  className="mb-2.5 text-xs font-bold uppercase tracking-widest text-[#9BAEC1]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Instrucciones
                </p>
                <ol className="flex flex-col gap-2.5">
                  {detail.instructions.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(0,201,167,0.15)] text-[10px] font-bold text-[#00C9A7]">
                        {index + 1}
                      </span>
                      <p
                        className="text-sm leading-relaxed text-white"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
