import type { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface ExerciseContextMenuProps {
  items: ContextMenuItem[];
  anchorRect: DOMRect;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export function ExerciseContextMenu({ items, anchorRect, title, subtitle, onClose }: ExerciseContextMenuProps) {
  const menuH = items.length * 48 + (title ? 64 : 8);
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const top =
    spaceBelow >= menuH + 8
      ? anchorRect.bottom + 8
      : Math.max(10, anchorRect.top - menuH - 8);
  const left = Math.max(12, Math.min(anchorRect.right - 288, window.innerWidth - 300));

  return (
    <div className="absolute inset-0 z-40">
      <button
        aria-label="Cerrar menú"
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        type="button"
      />
      <div
        className="fixed z-50 w-[18rem] rounded-3xl border border-[rgba(32,51,71,0.92)] bg-[#13263A] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.42)]"
        style={{ top, left }}
      >
        {(title || subtitle) && (
          <div className="border-b border-white/6 px-2 pb-3">
            {title && (
              <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-xs text-[#90A4B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="mt-2 flex flex-col">
          {items.map(({ label, icon: Icon, onClick, danger, disabled }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={disabled}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors disabled:opacity-45 ${
                danger
                  ? 'text-[#FF5D5D] hover:bg-[rgba(229,57,53,0.08)]'
                  : 'text-white hover:bg-white/5'
              }`}
              type="button"
            >
              <Icon size={17} className={danger ? 'text-[#FF5D5D]' : 'text-white/85'} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
