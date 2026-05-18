import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Dumbbell, Info, Lightbulb, Plus } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { useAppData } from '@/core/app-data/AppDataContext';
import { useExerciseCatalog } from '@/features/exercises/hooks/useExerciseCatalog';
import { ExerciseDetailSheet, type CatalogExerciseItem } from '@/features/exercises/components/ExerciseDetailSheet';
import {
  ALL_MUSCLE_SVG_IDS,
  BODY_NON_MUSCLE_IDS,
  LOAD_LEGEND,
  MUSCLE_BY_ID,
  MUSCLE_GROUPS,
  MUSCLE_ID_BY_SVG_ID,
  getDirectExercisesForMuscle,
  getIndirectExercisesForMuscle,
  getMuscleColor,
  getMuscleLoadByPeriod,
  getMuscleLoadLevel,
  getSuggestedExercisesForMuscle,
  type ExerciseRelationType,
  type MuscleExerciseMatch,
  type MuscleExerciseSuggestion,
  type MuscleId,
  type MuscleLoadDatum,
  type MuscleLoadPeriod,
} from '@/features/history/lib/muscleLoad';

import pechoUrl from '@/assets/icons/Pecho.svg';
import espaldaUrl from '@/assets/icons/espalda.svg';
import hombrosUrl from '@/assets/icons/hombros.svg';
import brazosUrl from '@/assets/icons/biceps.svg';
import abdominalesUrl from '@/assets/icons/abdominales.svg';
import cuadricepsUrl from '@/assets/icons/Cuadriceps.svg';
import gluteosUrl from '@/assets/icons/gluteos.svg';
import gemelosUrl from '@/assets/icons/gemelos.svg';

const ACCENT = '#00C9A7';
const BODY_SVG_URL = '/cuerpo_completo.svg';

const BODY_VIEWBOX: Record<'front' | 'back', string> = {
  front: '240 110 1000 2420',
  back: '1455 110 1000 2420',
};

const PERIOD_OPTIONS: Array<{ value: MuscleLoadPeriod; label: string; phrase: string }> = [
  { value: 'week', label: 'Esta semana', phrase: 'esta semana' },
  { value: 'month', label: 'Este mes', phrase: 'este mes' },
  { value: 'year', label: 'Este año', phrase: 'este año' },
];

const MUSCLE_ICON_BY_ID: Partial<Record<MuscleId, string>> = {
  pecho: pechoUrl,
  espalda: espaldaUrl,
  espalda_alta: espaldaUrl,
  trapecios: espaldaUrl,
  lumbar: espaldaUrl,
  hombros: hombrosUrl,
  biceps: brazosUrl,
  triceps: brazosUrl,
  antebrazos: brazosUrl,
  abdominales: abdominalesUrl,
  oblicuos: abdominalesUrl,
  cuadriceps: cuadricepsUrl,
  isquios: cuadricepsUrl,
  aductores: cuadricepsUrl,
  abductores: gluteosUrl,
  gluteos: gluteosUrl,
  pantorrillas: gemelosUrl,
};

let bodySvgCache: string | null = null;
let bodySvgPromise: Promise<string> | null = null;
let warnedMissingSvgIds = false;

type DiagramMode = 'diagram' | 'list';

interface DisplayExercise {
  key: string;
  exerciseSlug?: string;
  name: string;
  titleEn?: string;
  muscle: string;
  implement?: string;
  secondaryMuscles: string[];
  relation: ExerciseRelationType;
  series?: number;
  coverImageUrl?: string;
  animationMediaUrl?: string;
  animationMediaType?: CatalogExerciseItem['animationMediaType'];
  instructions?: string[];
  overview?: string;
  searchText?: string;
}

function fetchBodySvg() {
  if (bodySvgCache) return Promise.resolve(bodySvgCache);
  if (!bodySvgPromise) {
    bodySvgPromise = fetch(BODY_SVG_URL)
      .then((response) => response.text())
      .then((text) => {
        bodySvgCache = text;
        return text;
      });
  }
  return bodySvgPromise;
}

function warnMissingSvgIds(svgText: string) {
  if (!import.meta.env.DEV || warnedMissingSvgIds) return;
  warnedMissingSvgIds = true;

  const missing = [...ALL_MUSCLE_SVG_IDS, ...BODY_NON_MUSCLE_IDS].filter((id) => !svgText.includes(`id="${id}"`));
  if (missing.length > 0) {
    console.warn('[MuscleLoadPage] SVG ids not found:', missing);
  }
}

function buildInteractiveBodySvg(
  svgText: string,
  view: 'front' | 'back',
  loadByMuscle: Record<MuscleId, MuscleLoadDatum>,
  selectedMuscle: MuscleId,
) {
  warnMissingSvgIds(svgText);

  const rootClass = view === 'front' ? 'wohl-muscle-svg-front' : 'wohl-muscle-svg-back';
  const scope = `.${rootClass}`;
  const rules: string[] = [
    view === 'front'
      ? `${scope} #cuerpo_completo_posterior{display:none}`
      : `${scope} #cuerpo_completo_anterior{display:none}`,
    `${scope} path{transition:fill 160ms ease,stroke 160ms ease,filter 160ms ease}`,
  ];

  for (const id of BODY_NON_MUSCLE_IDS) {
    rules.push(`${scope} #${id} path{fill:#183752;stroke:rgba(8,17,28,0.7);stroke-width:4}`);
  }

  for (const id of ALL_MUSCLE_SVG_IDS) {
    const muscle = MUSCLE_ID_BY_SVG_ID.get(id);
    const series = muscle ? loadByMuscle[muscle]?.totalSeries ?? 0 : 0;
    const selected = muscle === selectedMuscle;

    rules.push(
      `${scope} #${id} path{fill:${getMuscleColor(series)};stroke:${selected ? ACCENT : 'rgba(4,12,22,0.68)'};stroke-width:${selected ? 10 : 5};cursor:pointer;filter:${selected ? 'drop-shadow(0 0 10px rgba(0,201,167,0.55))' : 'none'}}`,
    );
  }

  const styleBlock = `<style>${rules.join('')}</style>`;

  return svgText
    .replace(/(<svg[^>]*)\bwidth="[^"]*"/, '$1width="100%"')
    .replace(/(<svg[^>]*)\bheight="[^"]*"/, '$1height="auto"')
    .replace(/(<svg[^>]*)\bviewBox="[^"]*"/, `$1viewBox="${BODY_VIEWBOX[view]}"`)
    .replace(/<svg\b/, `<svg class="${rootClass}"`)
    .replace(/(<svg[^>]*>)/, `$1${styleBlock}`);
}

function getClickedMuscle(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  let group = target.closest<SVGGElement>('g[id]');
  while (group) {
    const muscle = MUSCLE_ID_BY_SVG_ID.get(group.id);
    if (muscle) return muscle;
    group = group.parentElement?.closest<SVGGElement>('g[id]') ?? null;
  }

  return null;
}

function periodPhrase(period: MuscleLoadPeriod) {
  return PERIOD_OPTIONS.find((option) => option.value === period)?.phrase ?? 'este período';
}

function relationLabel(type: ExerciseRelationType) {
  return type === 'direct' ? 'Directo' : 'Indirecto';
}

function toCatalogExerciseItem(exercise: DisplayExercise): CatalogExerciseItem {
  return {
    exerciseSlug: exercise.exerciseSlug,
    name: exercise.name,
    titleEn: exercise.titleEn,
    muscle: exercise.muscle,
    implement: exercise.implement,
    secondaryMuscles: exercise.secondaryMuscles,
    coverImageUrl: exercise.coverImageUrl,
    animationMediaUrl: exercise.animationMediaUrl,
    animationMediaType: exercise.animationMediaType,
    instructions: exercise.instructions,
    overview: exercise.overview,
    searchText: exercise.searchText,
  };
}

function PeriodSelector({
  period,
  onChange,
}: {
  period: MuscleLoadPeriod;
  onChange: (period: MuscleLoadPeriod) => void;
}) {
  return (
    <div className="flex h-[52px] items-center gap-1 rounded-[26px] border border-[rgba(117,151,183,0.30)] bg-[rgba(7,18,31,0.86)] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)]">
      {PERIOD_OPTIONS.map((option) => {
        const active = period === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`h-full min-w-0 flex-1 rounded-[22px] text-center text-sm font-extrabold leading-none transition-all ${
              active
                ? 'bg-[#00C9A7] text-[#031A1F] shadow-[0_6px_14px_rgba(0,201,167,0.20)]'
                : 'bg-transparent text-[#9BAEC1] active:bg-[rgba(19,38,58,0.72)]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MiniSegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className = '',
  buttonClassName = 'h-10 text-sm',
  gapClassName = 'gap-1',
  paddingClassName = 'p-1',
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  gapClassName?: string;
  paddingClassName?: string;
}) {
  return (
    <div
      className={`grid grid-cols-2 ${gapClassName} rounded-2xl border border-[rgba(117,151,183,0.26)] bg-[rgba(7,18,31,0.74)] ${paddingClassName} ${className}`}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`${buttonClassName} rounded-xl font-extrabold transition-all ${
              active ? 'bg-[#00C9A7] text-[#031A1F] shadow-[0_8px_16px_rgba(0,201,167,0.16)]' : 'text-[#A7B7C8]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function LabelsSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-1 text-[10.5px] font-semibold leading-none text-[#D7E3EE]">
      <span>Mostrar nombres</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-[18px] w-8 shrink-0 rounded-full border p-0 transition-colors duration-200 ${
          checked
            ? 'border-[rgba(0,201,167,0.52)] bg-[#00C9A7]'
            : 'border-[rgba(144,164,184,0.28)] bg-[#10263B]'
        }`}
      >
        <span
          className={`absolute left-[2px] top-[2px] h-3.5 w-3.5 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.28)] transition-transform duration-200 ease-out ${
            checked ? 'translate-x-[14px]' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

interface AnatomyLabel {
  muscle: MuscleId;
  label: string;
  labelX: number;
  labelY: number;
  lineStartX: number;
  anchorX: number;
  anchorY: number;
  textAnchor: 'start' | 'end';
}

const FRONT_LABELS: AnatomyLabel[] = [
  { muscle: 'pecho', label: 'Pecho', labelX: -4, labelY: 82, lineStartX: 33, anchorX: 101, anchorY: 81, textAnchor: 'start' },
  { muscle: 'hombros', label: 'Hombros', labelX: -4, labelY: 104, lineStartX: 48, anchorX: 67, anchorY: 78, textAnchor: 'start' },
  { muscle: 'biceps', label: 'Bíceps', labelX: -4, labelY: 127, lineStartX: 36, anchorX: 64, anchorY: 109, textAnchor: 'start' },
  { muscle: 'abdominales', label: 'Abdominales', labelX: -4, labelY: 152, lineStartX: 65, anchorX: 110, anchorY: 135, textAnchor: 'start' },
  { muscle: 'aductores', label: 'Aductores', labelX: -4, labelY: 190, lineStartX: 53, anchorX: 101, anchorY: 197, textAnchor: 'start' },
  { muscle: 'cuadriceps', label: 'Cuádriceps', labelX: -4, labelY: 222, lineStartX: 63, anchorX: 88, anchorY: 214, textAnchor: 'start' },
  { muscle: 'pantorrillas', label: 'Gemelos', labelX: -4, labelY: 305, lineStartX: 48, anchorX: 89, anchorY: 298, textAnchor: 'start' },
];

const BACK_LABELS: AnatomyLabel[] = [
  { muscle: 'trapecios', label: 'Trapecios', labelX: 180, labelY: 55, lineStartX: 127, anchorX: 71, anchorY: 54, textAnchor: 'end' },
  { muscle: 'espalda', label: 'Espalda', labelX: 180, labelY: 122, lineStartX: 131, anchorX: 63, anchorY: 119, textAnchor: 'end' },
  { muscle: 'hombros', label: 'Hombros', labelX: 180, labelY: 84, lineStartX: 128, anchorX: 111, anchorY: 77, textAnchor: 'end' },
  { muscle: 'triceps', label: 'Tríceps', labelX: 180, labelY: 114, lineStartX: 135, anchorX: 115, anchorY: 107, textAnchor: 'end' },
  { muscle: 'gluteos', label: 'Glúteos', labelX: 180, labelY: 178, lineStartX: 131, anchorX: 81, anchorY: 176, textAnchor: 'end' },
  { muscle: 'isquios', label: 'Isquios', labelX: 180, labelY: 232, lineStartX: 136, anchorX: 85, anchorY: 228, textAnchor: 'end' },
  { muscle: 'pantorrillas', label: 'Pantorrillas', labelX: 180, labelY: 289, lineStartX: 111, anchorX: 86, anchorY: 282, textAnchor: 'end' },
];

function AnatomyLabels({ labels, selectedMuscle }: { labels: AnatomyLabel[]; selectedMuscle: MuscleId }) {
  return (
    <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" viewBox="0 0 176 360">
      {labels.map((item) => {
        const active = item.muscle === selectedMuscle;
        const color = active ? ACCENT : 'rgba(98,224,205,0.82)';
        const lineY = item.labelY - 3;

        return (
          <g key={`${item.label}-${item.anchorX}-${item.anchorY}`}>
            <polyline
              points={`${item.lineStartX},${lineY} ${item.anchorX},${item.anchorY}`}
              fill="none"
              stroke={color}
              strokeWidth={active ? 1.2 : 0.85}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={item.anchorX} cy={item.anchorY} r={active ? 2.25 : 1.65} fill={color} />
            <text
              x={item.labelX}
              y={item.labelY}
              textAnchor={item.textAnchor}
              fill={active ? '#FFFFFF' : '#C7D4E1'}
              fontSize="9.6"
              fontWeight={active ? 800 : 650}
              fontFamily="'Plus Jakarta Sans', sans-serif"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BodyView({
  view,
  loadByMuscle,
  selectedMuscle,
  showLabels,
  onSelectMuscle,
}: {
  view: 'front' | 'back';
  loadByMuscle: Record<MuscleId, MuscleLoadDatum>;
  selectedMuscle: MuscleId;
  showLabels: boolean;
  onSelectMuscle: (muscle: MuscleId) => void;
}) {
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const loadKey = MUSCLE_GROUPS.map((group) => `${group.id}:${loadByMuscle[group.id]?.totalSeries ?? 0}`).join('|');

  useEffect(() => {
    let cancelled = false;

    fetchBodySvg()
      .then((text) => {
        if (cancelled) return;
        setSvgHtml(buildInteractiveBodySvg(text, view, loadByMuscle, selectedMuscle));
      })
      .catch(() => {
        if (!cancelled) setSvgHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [loadByMuscle, loadKey, selectedMuscle, view]);

  const bodyPositionClass = showLabels
    ? view === 'front'
      ? 'left-[61%]'
      : 'left-[39%]'
    : 'left-1/2';

  return (
    <div className="min-w-0">
      <div className="relative mx-auto h-[360px] w-full max-w-[176px]">
        <div
          className={`absolute top-0 z-0 h-[360px] w-[150px] -translate-x-1/2 select-none ${bodyPositionClass}`}
          onClick={(event) => {
            const muscle = getClickedMuscle(event.target);
            if (muscle) onSelectMuscle(muscle);
          }}
          role="img"
          aria-label={view === 'front' ? 'Vista anterior del cuerpo' : 'Vista posterior del cuerpo'}
        >
          {svgHtml ? (
            <div
              className="h-full w-full"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: local SVG, recolored with controlled CSS rules.
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          ) : (
            <div className="h-full w-full animate-pulse rounded-[2rem] bg-[#13263A]" />
          )}
        </div>

        {showLabels ? (
          <AnatomyLabels labels={view === 'front' ? FRONT_LABELS : BACK_LABELS} selectedMuscle={selectedMuscle} />
        ) : null}
      </div>

      <p className="mt-1 text-center text-xs font-medium text-[#91A6B8]">
        {view === 'front' ? 'Vista anterior' : 'Vista posterior'}
      </p>
    </div>
  );
}

function MuscleBodyMap({
  loadByMuscle,
  selectedMuscle,
  showLabels,
  onSelectMuscle,
}: {
  loadByMuscle: Record<MuscleId, MuscleLoadDatum>;
  selectedMuscle: MuscleId;
  showLabels: boolean;
  onSelectMuscle: (muscle: MuscleId) => void;
}) {
  return (
    <div className="mt-3 rounded-[1.5rem] bg-[radial-gradient(circle_at_center,rgba(0,201,167,0.07),transparent_58%),rgba(5,14,25,0.30)] px-0.5 py-2">
      <div className="grid grid-cols-2 gap-2">
        <BodyView
          view="front"
          loadByMuscle={loadByMuscle}
          selectedMuscle={selectedMuscle}
          showLabels={showLabels}
          onSelectMuscle={onSelectMuscle}
        />
        <BodyView
          view="back"
          loadByMuscle={loadByMuscle}
          selectedMuscle={selectedMuscle}
          showLabels={showLabels}
          onSelectMuscle={onSelectMuscle}
        />
      </div>
    </div>
  );
}

function MuscleLoadList({
  loadByMuscle,
  selectedMuscle,
  onSelectMuscle,
}: {
  loadByMuscle: Record<MuscleId, MuscleLoadDatum>;
  selectedMuscle: MuscleId;
  onSelectMuscle: (muscle: MuscleId) => void;
}) {
  const rows = [...MUSCLE_GROUPS].sort((a, b) => {
    const aSeries = loadByMuscle[a.id]?.totalSeries ?? 0;
    const bSeries = loadByMuscle[b.id]?.totalSeries ?? 0;
    if (aSeries !== bSeries) return bSeries - aSeries;
    return a.label.localeCompare(b.label, 'es');
  });

  return (
    <div className="mt-4 flex max-h-[310px] flex-col gap-1.5 overflow-y-auto pr-0.5">
      {rows.map((group) => {
        const datum = loadByMuscle[group.id];
        const active = group.id === selectedMuscle;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onSelectMuscle(group.id)}
            className={`flex h-[52px] items-center gap-3 rounded-2xl border px-3 text-left transition-all ${
              active
                ? 'border-[rgba(0,201,167,0.45)] bg-[rgba(0,201,167,0.12)]'
                : 'border-[rgba(144,164,184,0.12)] bg-[rgba(8,20,34,0.56)] active:bg-[#13263A]'
            }`}
          >
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full border border-[rgba(255,255,255,0.18)]"
              style={{ backgroundColor: getMuscleColor(datum.totalSeries) }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold text-white">{group.label}</span>
              <span className="block truncate text-xs text-[#8CA1B4]">
                {datum.directSeries} directas · {datum.indirectSeries} indirectas
              </span>
            </span>
            <span className="text-sm font-black text-[#00C9A7]">{datum.totalSeries}</span>
          </button>
        );
      })}
    </div>
  );
}

function LoadLegend() {
  return (
    <div className="mt-4 border-t border-[rgba(144,164,184,0.18)] pt-3.5">
      <p className="mb-2.5 text-sm font-extrabold text-white">Carga muscular</p>
      <div className="grid grid-cols-6 gap-1.5">
        {LOAD_LEGEND.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col items-center gap-1.5">
            <span
              className="h-3.5 w-3.5 rounded-full border border-[rgba(255,255,255,0.16)]"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10.5px] font-semibold text-[#D7E3EE]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramCard({
  diagramMode,
  onDiagramModeChange,
  showLabels,
  onShowLabelsChange,
  loadByMuscle,
  selectedMuscle,
  onSelectMuscle,
  hasPeriodData,
  period,
}: {
  diagramMode: DiagramMode;
  onDiagramModeChange: (mode: DiagramMode) => void;
  showLabels: boolean;
  onShowLabelsChange: (checked: boolean) => void;
  loadByMuscle: Record<MuscleId, MuscleLoadDatum>;
  selectedMuscle: MuscleId;
  onSelectMuscle: (muscle: MuscleId) => void;
  hasPeriodData: boolean;
  period: MuscleLoadPeriod;
}) {
  return (
    <section
      className="rounded-[24px] border px-4 pb-4 pt-3"
      style={{
        background: 'linear-gradient(180deg,#0B1F33 0%,#081827 100%)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="max-w-[6rem] pt-px text-[12px] font-black leading-[13.5px] tracking-tight text-white">
          Diagrama muscular
        </h2>
        <div className="w-[7.25rem] shrink-0">
          <MiniSegmentedControl<DiagramMode>
            value={diagramMode}
            options={[
              { value: 'diagram', label: 'Diagrama' },
              { value: 'list', label: 'Lista' },
            ]}
            onChange={onDiagramModeChange}
            className="rounded-[11px]"
            buttonClassName="h-[22px] text-[9.5px]"
            gapClassName="gap-0.5"
            paddingClassName="p-[3px]"
          />
        </div>
      </div>

      <div className="mt-1 flex justify-end">
        <LabelsSwitch checked={showLabels} onChange={onShowLabelsChange} />
      </div>

      {diagramMode === 'diagram' ? (
        <MuscleBodyMap
          loadByMuscle={loadByMuscle}
          selectedMuscle={selectedMuscle}
          showLabels={showLabels}
          onSelectMuscle={onSelectMuscle}
        />
      ) : (
        <MuscleLoadList loadByMuscle={loadByMuscle} selectedMuscle={selectedMuscle} onSelectMuscle={onSelectMuscle} />
      )}

      {!hasPeriodData ? (
        <div className="mt-4 rounded-2xl border border-[rgba(0,201,167,0.16)] bg-[rgba(0,201,167,0.06)] px-4 py-3 text-center text-sm font-semibold text-[#9BAEC1]">
          Todavía no registraste series en {periodPhrase(period)}.
        </div>
      ) : null}

      <LoadLegend />
    </section>
  );
}

function SelectedMusclePanel({
  muscle,
  datum,
  period,
  onDetails,
}: {
  muscle: MuscleId;
  datum: MuscleLoadDatum;
  period: MuscleLoadPeriod;
  onDetails: () => void;
}) {
  const group = MUSCLE_BY_ID.get(muscle);
  const label = group?.label ?? 'Músculo';
  const level = getMuscleLoadLevel(datum.totalSeries);
  const iconUrl = MUSCLE_ICON_BY_ID[muscle];

  return (
    <section className="-mt-1 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[#0D1E30] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.20)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(0,201,167,0.24)] bg-[rgba(0,201,167,0.08)]">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt=""
              className="theme-preserve h-7 w-7 object-contain opacity-95"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          ) : (
            <Dumbbell size={22} className="text-white" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="truncate text-[24px] font-black leading-none tracking-tight text-white">{label}</h3>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-extrabold"
              style={{
                color: datum.totalSeries > 0 ? ACCENT : '#9BAEC1',
                background: datum.totalSeries > 0 ? 'rgba(0,201,167,0.12)' : 'rgba(144,164,184,0.1)',
                border: '1px solid rgba(0,201,167,0.18)',
              }}
            >
              {level}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] font-semibold leading-5 text-[#C8D6E3]">
            {datum.totalSeries} series {periodPhrase(period)} · {datum.directExerciseCount} directas · {datum.indirectExerciseCount} indirectas
          </p>
        </div>

        <button
          type="button"
          onClick={onDetails}
          className="flex h-10 shrink-0 items-center gap-1 rounded-2xl px-2 text-xs font-extrabold text-[#00C9A7] active:bg-[rgba(0,201,167,0.08)] max-[374px]:w-10 max-[374px]:justify-center"
        >
          <span className="max-[374px]:hidden">Ver detalles</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function mapOwnExercise(match: MuscleExerciseMatch, catalogBySlug: Map<string, MuscleExerciseSuggestion>): DisplayExercise {
  const catalog = match.exerciseSlug ? catalogBySlug.get(match.exerciseSlug) : undefined;
  return {
    key: match.key,
    exerciseSlug: match.exerciseSlug,
    name: catalog?.name ?? match.name,
    titleEn: catalog?.titleEn,
    muscle: catalog?.muscle ?? match.muscle,
    implement: catalog?.implement ?? match.implement,
    secondaryMuscles: catalog?.secondaryMuscles ?? match.secondaryMuscles,
    relation: match.relation,
    series: match.series,
    coverImageUrl: catalog?.coverImageUrl,
    animationMediaUrl: catalog?.animationMediaUrl,
    animationMediaType: catalog?.animationMediaType,
    instructions: catalog?.instructions,
    overview: catalog?.overview,
    searchText: catalog?.searchText,
  };
}

function ExerciseThumbnail({ exercise }: { exercise: DisplayExercise }) {
  if (exercise.coverImageUrl) {
    return (
      <img
        src={exercise.coverImageUrl}
        alt=""
        loading="lazy"
        className="theme-preserve h-11 w-11 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,201,167,0.16)] bg-[rgba(0,201,167,0.08)]">
      <Dumbbell size={19} className="text-[#00C9A7]" />
    </div>
  );
}

function ExerciseRow({
  exercise,
  variant,
  onOpen,
  onAdd,
}: {
  exercise: DisplayExercise;
  variant: 'owned' | 'suggested';
  onOpen: (exercise: DisplayExercise) => void;
  onAdd?: (exercise: DisplayExercise) => void;
}) {
  const related = [exercise.muscle, ...exercise.secondaryMuscles.slice(0, 2)].filter(Boolean).join(' · ');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(exercise)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(exercise);
        }
      }}
      className="flex min-h-[68px] w-full cursor-pointer items-center gap-3 rounded-2xl border border-[rgba(91,132,168,0.20)] bg-[rgba(7,18,31,0.58)] px-3 py-2 text-left transition-colors active:bg-[#13263A]"
    >
      <ExerciseThumbnail exercise={exercise} />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-extrabold leading-5 text-white">{exercise.name}</span>
        <span className="mt-0.5 block truncate text-[11.5px] font-medium text-[#91A6B8]">{related}</span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        <span className="hidden rounded-full border border-[rgba(0,201,167,0.20)] bg-[rgba(0,201,167,0.08)] px-2 py-0.5 text-[9.5px] font-black uppercase tracking-[0.08em] text-[#00C9A7] min-[380px]:inline-flex">
          {relationLabel(exercise.relation)}
        </span>

        {variant === 'owned' ? (
          <>
            {exercise.series ? <span className="text-xs font-black text-[#D7E3EE]">{exercise.series}</span> : null}
            <ChevronRight size={19} className="text-[#9BAEC1]" />
          </>
        ) : (
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              onAdd?.(exercise);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                onAdd?.(exercise);
              }
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#00C9A7] transition-colors active:bg-[rgba(0,201,167,0.12)]"
            aria-label={`Agregar ${exercise.name}`}
          >
            <Plus size={22} />
          </span>
        )}
      </span>
    </div>
  );
}

function ExerciseSection({
  title,
  helper,
  emptyMessage,
  exercises,
  variant,
  isLoading,
  onOpen,
  onAdd,
}: {
  title: string;
  helper: string;
  emptyMessage: string;
  exercises: DisplayExercise[];
  variant: 'owned' | 'suggested';
  isLoading?: boolean;
  onOpen: (exercise: DisplayExercise) => void;
  onAdd?: (exercise: DisplayExercise) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleExercises = expanded ? exercises : exercises.slice(0, 3);
  const hiddenCount = Math.max(exercises.length - visibleExercises.length, 0);

  useEffect(() => {
    setExpanded(false);
  }, [exercises, title, variant]);

  return (
    <section>
      <div className="mb-2.5">
        <h3 className="text-[17px] font-black tracking-tight text-white">{title}</h3>
        <p className="mt-0.5 text-[13px] text-[#91A6B8]">{helper}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        {isLoading ? (
          <div className="rounded-2xl border border-[rgba(91,132,168,0.2)] bg-[rgba(7,18,31,0.56)] px-4 py-3.5 text-center text-sm font-semibold text-[#91A6B8]">
            Cargando catálogo de ejercicios...
          </div>
        ) : exercises.length > 0 ? (
          <>
            {visibleExercises.map((exercise) => (
              <ExerciseRow
                key={`${variant}-${exercise.key}`}
                exercise={exercise}
                variant={variant}
                onOpen={onOpen}
                onAdd={onAdd}
              />
            ))}
            {hiddenCount > 0 ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mt-1 h-10 rounded-2xl border border-[rgba(0,201,167,0.18)] bg-[rgba(0,201,167,0.06)] text-sm font-extrabold text-[#00C9A7]"
              >
                {variant === 'owned' ? 'Ver todos' : 'Ver más ejercicios'}
              </button>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-[rgba(91,132,168,0.2)] bg-[rgba(7,18,31,0.5)] px-4 py-3.5 text-center text-sm font-semibold text-[#91A6B8]">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

function InsightCard({
  muscle,
  datum,
  period,
  onMore,
}: {
  muscle: MuscleId;
  datum: MuscleLoadDatum;
  period: MuscleLoadPeriod;
  onMore: () => void;
}) {
  const label = MUSCLE_BY_ID.get(muscle)?.label ?? 'Este músculo';
  const level = getMuscleLoadLevel(datum.totalSeries).toLowerCase();
  const hasLoad = datum.totalSeries > 0;

  return (
    <section className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(7,18,31,0.58)] p-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(0,201,167,0.10)] text-[#00C9A7]">
          <Lightbulb size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-black leading-5 text-white">
            {hasLoad
              ? `${label} tiene una ${level} ${periodPhrase(period)}.`
              : `${label} todavía no tiene carga ${periodPhrase(period)}.`}
          </p>
          <p className="mt-0.5 text-xs leading-[18px] text-[#91A6B8]">
            {hasLoad
              ? 'Buen trabajo. Mantené la consistencia o variá los ejercicios para seguir progresando.'
              : 'Podés sumar ejercicios directos para equilibrar tu semana y completar el estímulo.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onMore}
          className="shrink-0 rounded-2xl border border-[rgba(0,201,167,0.28)] px-3 py-2 text-xs font-extrabold text-[#00C9A7] max-[374px]:hidden"
        >
          Saber más
        </button>
      </div>
      <button
        type="button"
        onClick={onMore}
        className="mt-3 w-full rounded-2xl border border-[rgba(0,201,167,0.28)] py-2 text-xs font-extrabold text-[#00C9A7] min-[375px]:hidden"
      >
        Saber más
      </button>
    </section>
  );
}

export default function MuscleLoadPage() {
  const navigate = useNavigate();
  const { sessionHistory, appContext } = useAppData();
  const { catalog, isLoading } = useExerciseCatalog();
  const exercisesRef = useRef<HTMLDivElement | null>(null);

  const [period, setPeriod] = useState<MuscleLoadPeriod>('week');
  const [diagramMode, setDiagramMode] = useState<DiagramMode>('diagram');
  const [showLabels, setShowLabels] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleId>('pecho');
  const [exerciseTab, setExerciseTab] = useState<ExerciseRelationType>('direct');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<CatalogExerciseItem | null>(null);

  const loadByMuscle = useMemo(
    () => getMuscleLoadByPeriod(sessionHistory, period, appContext.todayIso),
    [appContext.todayIso, period, sessionHistory],
  );

  const selectedDatum = loadByMuscle[selectedMuscle];
  const hasPeriodData = useMemo(
    () => Object.values(loadByMuscle).some((datum) => datum.totalSeries > 0),
    [loadByMuscle],
  );
  const topLoadedMuscle = useMemo<MuscleId>(() => {
    return MUSCLE_GROUPS.reduce((best, group) => {
      const currentSeries = loadByMuscle[group.id]?.totalSeries ?? 0;
      const bestSeries = loadByMuscle[best]?.totalSeries ?? 0;
      return currentSeries > bestSeries ? group.id : best;
    }, 'pecho' as MuscleId);
  }, [loadByMuscle]);

  useEffect(() => {
    if (!hasPeriodData) return;
    if ((loadByMuscle[selectedMuscle]?.totalSeries ?? 0) > 0) return;
    setSelectedMuscle(topLoadedMuscle);
    // Only auto-select when the period data changes; manual zero-load selections should stay respected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPeriodData, period, topLoadedMuscle]);

  const directMatches = useMemo(
    () => getDirectExercisesForMuscle(selectedMuscle, sessionHistory, period, appContext.todayIso),
    [appContext.todayIso, period, selectedMuscle, sessionHistory],
  );

  const indirectMatches = useMemo(
    () => getIndirectExercisesForMuscle(selectedMuscle, sessionHistory, period, appContext.todayIso),
    [appContext.todayIso, period, selectedMuscle, sessionHistory],
  );

  const catalogSuggestionsBySlug = useMemo(() => {
    const suggestions = getSuggestedExercisesForMuscle(selectedMuscle, 'direct', catalog, new Set<string>()).concat(
      getSuggestedExercisesForMuscle(selectedMuscle, 'indirect', catalog, new Set<string>()),
    );
    return new Map(suggestions.map((exercise) => [exercise.exerciseSlug, exercise]));
  }, [catalog, selectedMuscle]);

  const ownedExerciseKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const match of [...directMatches, ...indirectMatches]) {
      keys.add(match.key);
      if (match.exerciseSlug) keys.add(match.exerciseSlug);
    }
    return keys;
  }, [directMatches, indirectMatches]);

  const ownExercises = useMemo(
    () => (exerciseTab === 'direct' ? directMatches : indirectMatches).map((match) => mapOwnExercise(match, catalogSuggestionsBySlug)),
    [catalogSuggestionsBySlug, directMatches, exerciseTab, indirectMatches],
  );

  const suggestedExercises = useMemo<DisplayExercise[]>(
    () =>
      getSuggestedExercisesForMuscle(selectedMuscle, exerciseTab, catalog, ownedExerciseKeys)
        .slice(0, 8)
        .map((exercise) => ({
          key: exercise.key,
          exerciseSlug: exercise.exerciseSlug,
          name: exercise.name,
          titleEn: exercise.titleEn,
          muscle: exercise.muscle,
          implement: exercise.implement,
          secondaryMuscles: exercise.secondaryMuscles,
          relation: exercise.relation,
          coverImageUrl: exercise.coverImageUrl,
          animationMediaUrl: exercise.animationMediaUrl,
          animationMediaType: exercise.animationMediaType,
          instructions: exercise.instructions,
          overview: exercise.overview,
          searchText: exercise.searchText,
        })),
    [catalog, exerciseTab, ownedExerciseKeys, selectedMuscle],
  );

  const handleOpenExercise = (exercise: DisplayExercise) => {
    setSelectedExerciseDetail(toCatalogExerciseItem(exercise));
  };

  const handleAddSuggestedExercise = (exercise: DisplayExercise) => {
    // TODO: conectar con el flujo de agregar/guardar cuando esta pantalla pueda elegir rutina y día destino.
    if (import.meta.env.DEV) {
      console.info('[MuscleLoadPage] add suggested exercise pending flow:', exercise.exerciseSlug ?? exercise.name);
    }
  };

  const scrollToExercises = () => {
    exercisesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headerInfoAction = (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(155,174,193,0.28)] text-[#C8D6E3]"
      aria-label="Información de carga muscular"
    >
      <Info size={19} />
    </button>
  );

  const emptyOwnMessage =
    exerciseTab === 'direct'
      ? 'Todavía no hiciste ejercicios directos para este músculo.'
      : 'Todavía no hiciste ejercicios indirectos para este músculo.';

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title="Carga muscular" rightContent={headerInfoAction} />

      <main className="px-4 pb-8 pt-3">
        <p className="mx-auto mb-4 max-w-[22rem] text-center text-sm leading-5 text-[#9BAEC1]">
          Visualizá el trabajo muscular acumulado y explorá qué ejercicios entrenan cada grupo muscular.
        </p>

        <div className="mb-4">
          <PeriodSelector period={period} onChange={setPeriod} />
        </div>

        <div className="flex flex-col gap-3">
          <DiagramCard
            diagramMode={diagramMode}
            onDiagramModeChange={setDiagramMode}
            showLabels={showLabels}
            onShowLabelsChange={setShowLabels}
            loadByMuscle={loadByMuscle}
            selectedMuscle={selectedMuscle}
            onSelectMuscle={setSelectedMuscle}
            hasPeriodData={hasPeriodData}
            period={period}
          />

          <SelectedMusclePanel
            muscle={selectedMuscle}
            datum={selectedDatum}
            period={period}
            onDetails={scrollToExercises}
          />

          <div ref={exercisesRef} className="scroll-mt-4">
            <MiniSegmentedControl<ExerciseRelationType>
              value={exerciseTab}
              options={[
                { value: 'direct', label: 'Directos' },
                { value: 'indirect', label: 'Indirectos' },
              ]}
              onChange={setExerciseTab}
              className="h-12 rounded-[1.4rem]"
              buttonClassName="text-sm"
            />
          </div>

          <ExerciseSection
            title="Tus ejercicios"
            helper="Ejercicios que ya hacés para este músculo."
            emptyMessage={emptyOwnMessage}
            exercises={ownExercises}
            variant="owned"
            onOpen={handleOpenExercise}
          />

          <ExerciseSection
            title="Podrías hacer"
            helper="Ejercicios del catálogo para este músculo."
            emptyMessage="No encontramos ejercicios sugeridos para este músculo."
            exercises={suggestedExercises}
            variant="suggested"
            isLoading={isLoading}
            onOpen={handleOpenExercise}
            onAdd={handleAddSuggestedExercise}
          />

          <InsightCard
            muscle={selectedMuscle}
            datum={selectedDatum}
            period={period}
            onMore={() => {
              setDiagramMode('list');
              scrollToExercises();
            }}
          />
        </div>
      </main>

      <ExerciseDetailSheet exercise={selectedExerciseDetail} onClose={() => setSelectedExerciseDetail(null)} />
    </div>
  );
}
