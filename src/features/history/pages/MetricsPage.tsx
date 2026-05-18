import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  BarChart2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Layers,
  RefreshCw,
  Settings,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { useAppData } from '@/core/app-data/AppDataContext';
import { WeeklyMuscleLoad } from '@/features/home/components/WeeklyMuscleLoad';
import {
  buildMetricsSummary,
  buildExercisePRs,
  buildWeeklyFrequency,
  buildMuscleRadar,
} from '@/core/domain/metricsInsights';
import {
  buildCalendarGrid,
  calculateWeekStreak,
  getDominantGroup,
  getSessionMusclesList,
  getSessionsForMonth,
  groupSessionsByDay,
  normalizeMuscleGroup,
  sessionHasPR,
  type MuscleGroupKey,
} from '../lib/historyCalendarHelpers';
import { convertWeightFromKg, formatCompactWeight } from '@/shared/lib/unitUtils';
import type { AppSettings, SessionHistory } from '@/shared/types/models';

import pechoUrl from '@/assets/icons/Pecho.svg';
import espaldaUrl from '@/assets/icons/espalda.svg';
import hombrosUrl from '@/assets/icons/hombros.svg';
import brazosUrl from '@/assets/icons/biceps.svg';
import abdominalesUrl from '@/assets/icons/abdominales.svg';
import cuadricepsUrl from '@/assets/icons/Cuadriceps.svg';
import gluteosUrl from '@/assets/icons/gluteos.svg';
import gemelosUrl from '@/assets/icons/gemelos.svg';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'actividad' | 'resumen' | 'fuerza';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#00C9A7';

const WOHL = {
  accent: ACCENT,
  surface: '#152F48',
  line: 'rgba(144,164,184,0.18)',
  text: '#fff',
  textMuted: '#9BAEC1',
  textDim: '#65758A',
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MONTH_NAMES_SHORT = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];
const DAY_HEADERS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

const MUSCLE_ICON_MAP: Record<MuscleGroupKey, string> = {
  pecho: pechoUrl,
  espalda: espaldaUrl,
  hombros: hombrosUrl,
  brazos: brazosUrl,
  abdomen: abdominalesUrl,
  cuadriceps: cuadricepsUrl,
  gluteos: gluteosUrl,
  gemelos: gemelosUrl,
};

// ─── Body SVG constants & builder ────────────────────────────────────────────

const BODY_SVG_URL = '/cuerpo_completo.svg';
let bodySvgCache: string | null = null;

const MUSCLE_GROUP_TO_SVG: Record<MuscleGroupKey, string[]> = {
  pecho:      ['pecho_posterior'],
  espalda:    ['dorsales_posterior', 'trapecio_medio', 'trapecio_inferior', 'infraespinosos_posterior', 'lumbar_posterior'],
  hombros:    ['hombros_anterior', 'hombros_posterior', 'trapecio_superior_anterior', 'trapecio_superior'],
  brazos:     ['biceps_anterior', 'triceps_anterior', 'triceps_posterior', 'antebrazo_anterior', 'antebrazos_posterior'],
  abdomen:    ['recto_abdominal_anterior', 'oblicuos_anterior', 'oblicuos_externos_posterior'],
  cuadriceps: ['cuadriceps_anterior', 'isquiotibial_posterior'],
  gluteos:    ['Gluteos_posterior'],
  gemelos:    ['gemelos_anterior', 'soleo_anterior_interno_externo', 'gemelos_posterior', 'soleo_posterior_interno_externo'],
};

const BODY_NON_MUSCLE_IDS = [
  'cabeza_anterior', 'manos_anterior', 'rodillas_anterior', 'pies_anteriores', 'cadera',
  'cabeza_posterior', 'manos_posterior', 'rodillas_posterior', 'pies_posteriores', 'codos_posterior', 'talon',
];

const ALL_BODY_MUSCLE_IDS = Object.values(MUSCLE_GROUP_TO_SVG).flat();

const BODY_VIEWBOX: Record<'front' | 'back', string> = {
  front: '240 80 1000 2640',
  back:  '1455 80 1000 2640',
};

function buildHighlightedBodySvg(
  svgText: string,
  trainedGroups: Set<MuscleGroupKey>,
  view: 'front' | 'back',
): string {
  const ON = ACCENT;
  const OFF = '#152E46';
  const LANDMARK = '#1A3550';
  const rules: string[] = [];

  rules.push(view === 'front'
    ? '#cuerpo_completo_posterior{display:none}'
    : '#cuerpo_completo_anterior{display:none}');

  for (const id of BODY_NON_MUSCLE_IDS) rules.push(`#${id} path{fill:${LANDMARK}}`);
  for (const id of ALL_BODY_MUSCLE_IDS) rules.push(`#${id} path{fill:${OFF}}`);
  for (const group of Object.keys(MUSCLE_GROUP_TO_SVG) as MuscleGroupKey[]) {
    if (trainedGroups.has(group)) {
      for (const id of MUSCLE_GROUP_TO_SVG[group]) rules.push(`#${id} path{fill:${ON}}`);
    }
  }

  const styleBlock = `<style>${rules.join('')}</style>`;
  return svgText
    .replace(/(<svg[^>]*)\bwidth="[^"]*"/, '$1width="100%"')
    .replace(/(<svg[^>]*)\bheight="[^"]*"/, '$1height="auto"')
    .replace(/(<svg[^>]*)\bviewBox="[^"]*"/, `$1viewBox="${BODY_VIEWBOX[view]}"`)
    .replace(/(<svg[^>]*>)/, `$1${styleBlock}`);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stateColor(pct: number) {
  return pct >= 70 ? WOHL.accent : pct >= 40 ? '#F5B942' : '#FF7A8C';
}

function formatDayLabel(isoDate: string): string {
  const [, mo, dy] = isoDate.split('-');
  return `${parseInt(dy)} ${MONTH_NAMES_SHORT[parseInt(mo) - 1]}`;
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function SparklineSvg({ data, color = WOHL.accent }: { data: number[]; color?: string }) {
  if (data.length < 2) return <div style={{ width: 60, height: 24 }} />;
  const w = 60; const h = 24;
  const min = Math.min(...data);
  const span = Math.max(...data) - min || 1;
  const pts = data
    .map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${((1 - (v - min) / span) * h).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.22em', color: WOHL.text, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: WOHL.surface, border: `1px solid ${WOHL.line}`, borderRadius: 18, padding: 14, marginBottom: 14, ...style }}>
      {children}
    </div>
  );
}

// ─── Frequency Bars ──────────────────────────────────────────────────────────

function FrequencyBars({ sessionHistory, todayIso }: { sessionHistory: SessionHistory[]; todayIso: string }) {
  const weeks = buildWeeklyFrequency(sessionHistory, todayIso);
  const max = Math.max(...weeks.map((w) => w.sessions), 1);

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <div style={{
        width: 14, height: 130, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', fontSize: 9, color: WOHL.textDim,
        fontWeight: 700, alignItems: 'flex-end', paddingTop: 2,
      }}>
        {[max + 1, Math.round((max + 1) * 0.75), Math.round((max + 1) * 0.5), Math.round((max + 1) * 0.25), 0].map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 130, position: 'relative' }}>
          {[0, 0.25, 0.5, 0.75].map((g, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${g * 100}%`, height: 1, background: 'rgba(144,164,184,0.10)' }} />
          ))}
          {weeks.map((w, i) => {
            const pct = w.sessions / (max + 1) * 100;
            const isTop = w.sessions === max;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 10, color: isTop ? WOHL.accent : '#fff', fontWeight: 800, fontFamily: "'Plus Jakarta Sans'" }}>
                  {w.sessions > 0 ? w.sessions : ''}
                </div>
                <div style={{
                  width: '78%', height: `${pct}%`, borderRadius: '6px 6px 2px 2px',
                  background: w.sessions > 0 ? `linear-gradient(180deg, ${WOHL.accent}, rgba(0,201,167,0.42))` : 'rgba(144,164,184,0.08)',
                  border: w.sessions > 0 ? '1px solid rgba(0,201,167,0.55)' : '1px solid rgba(144,164,184,0.12)',
                  minHeight: 2,
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {weeks.map((w, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: WOHL.textMuted, lineHeight: 1.25, whiteSpace: 'pre-line', fontWeight: 700 }}>
              {w.week}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Muscle Radar ─────────────────────────────────────────────────────────────

const RADAR_GROUPS_DISPLAY = [
  { id: 'pecho',      label: 'PECHO',       iconUrl: pechoUrl },
  { id: 'espalda',    label: 'ESPALDA',     iconUrl: espaldaUrl },
  { id: 'hombros',    label: 'HOMBROS',     iconUrl: hombrosUrl },
  { id: 'brazos',     label: 'BRAZOS',      iconUrl: brazosUrl },
  { id: 'abdomen',    label: 'ABDOMINALES', iconUrl: abdominalesUrl },
  { id: 'cuadriceps', label: 'CUÁDRICEPS',  iconUrl: cuadricepsUrl },
  { id: 'gluteos',    label: 'GLÚTEOS',     iconUrl: gluteosUrl },
  { id: 'gemelos',    label: 'GEMELOS',     iconUrl: gemelosUrl },
];

function MuscleRadarSvg({ sessionHistory, todayIso }: { sessionHistory: SessionHistory[]; todayIso: string }) {
  const radarData = buildMuscleRadar(sessionHistory, todayIso);
  const cx = 140; const cy = 130; const R = 78;
  const n = RADAR_GROUPS_DISPLAY.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const ringPts = (scale: number) =>
    RADAR_GROUPS_DISPLAY.map((_, i) => {
      const a = angle(i);
      return `${(cx + Math.cos(a) * R * scale).toFixed(1)},${(cy + Math.sin(a) * R * scale).toFixed(1)}`;
    }).join(' ');
  const dataPts = RADAR_GROUPS_DISPLAY.map((g, i) => {
    const entry = radarData.find((d) => d.muscle === g.id || radarData[i]?.muscle === g.label) ?? radarData[i];
    const pct = entry?.value ?? 0;
    const a = angle(i);
    const r = (pct / 100) * R;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, pct, group: g, i };
  });
  const polyPts = dataPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div>
      <svg width="100%" viewBox="0 0 280 260" style={{ display: 'block', overflow: 'visible' }}>
        {[0.25, 0.5, 0.75, 1].map((s, i) => (
          <polygon key={i} points={ringPts(s)} fill={i === 3 ? 'rgba(255,255,255,0.02)' : 'none'} stroke="rgba(144,164,184,0.16)" strokeWidth={1} />
        ))}
        {RADAR_GROUPS_DISPLAY.map((_, i) => {
          const a = angle(i);
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R} stroke="rgba(144,164,184,0.12)" strokeWidth={1} />;
        })}
        {[{ v: 0, y: cy + 3 }, { v: 25, y: cy - R * 0.25 + 3 }, { v: 50, y: cy - R * 0.5 + 3 }].map(({ v, y }) => (
          <text key={v} x={cx} y={y} fill="#65758A" fontSize={8.5} textAnchor="middle" fontWeight={700} fontFamily="'Plus Jakarta Sans'">{v}</text>
        ))}
        <polygon points={polyPts} fill="rgba(0,201,167,0.18)" stroke={WOHL.accent} strokeWidth={1.8} strokeLinejoin="round" />
        {dataPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.2} fill={stateColor(p.pct)} stroke="#0B1F33" strokeWidth={1} />
        ))}
        {RADAR_GROUPS_DISPLAY.map((g, i) => {
          const a = angle(i);
          const lr = R + 32;
          const lx = cx + Math.cos(a) * lr;
          const ly = cy + Math.sin(a) * lr;
          const pct = dataPts[i]?.pct ?? 0;
          const color = stateColor(pct);
          return (
            <g key={g.id}>
              <image href={g.iconUrl} x={lx - 12} y={ly - 30} width={24} height={24} style={{ filter: 'invert(1) opacity(0.75)' }} />
              <text x={lx} y={ly + 4} textAnchor="middle" fill="#C8D1DB" fontSize={8.5} fontWeight={800} fontFamily="'Plus Jakarta Sans'" letterSpacing={0.5}>{g.label}</text>
              <text x={lx} y={ly + 15} textAnchor="middle" fill={color} fontSize={9} fontWeight={800} fontFamily="'Plus Jakarta Sans'">{pct}%</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11, color: WOHL.textMuted, flexWrap: 'wrap' }}>
        {[
          { color: WOHL.accent, label: 'Óptimo (70% o más)' },
          { color: '#F5B942', label: 'En progreso (40–70%)' },
          { color: '#FF7A8C', label: 'Necesita atención (<40%)' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: color, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Progress Podium ──────────────────────────────────────────────────────────

const PODIUM_STYLE: Record<number, { color: string; height: number }> = {
  1: { color: '#F5C24A', height: 138 },
  2: { color: '#C8D1DB', height: 110 },
  3: { color: '#D88A4A', height: 86 },
  4: { color: '#5B7A99', height: 64 },
  5: { color: '#445E78', height: 48 },
};

function ProgressPodium({ sessionHistory }: { sessionHistory: SessionHistory[] }) {
  const prs = buildExercisePRs(sessionHistory);
  const ranked = prs
    .filter((p) => p.volumeProgress !== null)
    .sort((a, b) => (b.volumeProgress ?? 0) - (a.volumeProgress ?? 0))
    .slice(0, 5)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  if (ranked.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0', color: WOHL.textDim, fontSize: 13 }}>
        Registrá más sesiones para ver el podio de progreso.
      </div>
    );
  }

  const VISUAL_ORDER = [5, 3, 1, 2, 4].map((r) => ranked.find((x) => x.rank === r)).filter(Boolean);

  return (
    <div style={{ background: WOHL.surface, border: `1px solid ${WOHL.line}`, borderRadius: 18, padding: '20px 12px 14px', marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, alignItems: 'flex-end' }}>
        {VISUAL_ORDER.map((p) => {
          if (!p) return null;
          const s = PODIUM_STYLE[p.rank];
          const isGold = p.rank === 1;
          const big = p.rank <= 3;
          const pct = p.volumeProgress ?? 0;
          return (
            <div key={p.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ textAlign: 'center', minHeight: 38, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: isGold ? 11.5 : big ? 10 : 9, color: isGold ? '#fff' : big ? '#D7DEE6' : WOHL.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 68 }}>{p.name}</div>
                <div style={{ fontSize: 8.5, color: WOHL.textDim, marginTop: 2 }}>{p.maxKg}×{p.bestReps}</div>
              </div>
              <div style={{
                width: '100%', height: s.height, borderRadius: '8px 8px 3px 3px',
                background: `linear-gradient(180deg, ${s.color}33, ${s.color}10 65%, rgba(11,31,51,0.4))`,
                border: `1px solid ${s.color}66`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                padding: big ? '8px 4px 6px' : '6px 4px 4px',
                boxShadow: isGold ? `0 0 22px ${s.color}55, 0 4px 10px rgba(0,0,0,0.25)` : '0 4px 10px rgba(0,0,0,0.25)',
              }}>
                <div style={{
                  width: isGold ? 28 : big ? 24 : 19, height: isGold ? 28 : big ? 24 : 19, borderRadius: 9999,
                  background: `radial-gradient(circle at 35% 30%, ${s.color}, ${s.color}99)`,
                  border: `1.5px solid ${s.color}`, display: 'grid', placeItems: 'center',
                  fontFamily: "'Plus Jakarta Sans'", fontWeight: 900, fontSize: isGold ? 13 : big ? 11 : 9,
                  color: '#0B1F33', marginBottom: big ? 6 : 4,
                  boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.2), 0 0 10px ${s.color}66`,
                }}>{p.rank}</div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans'", fontWeight: 900, fontSize: isGold ? 21 : big ? 16 : 12.5,
                  letterSpacing: '-0.02em', lineHeight: 1,
                  color: pct >= 0 ? '#54D62C' : '#FF7A8C',
                  textShadow: isGold ? '0 0 10px rgba(84,214,44,0.45)' : 'none',
                }}>{pct >= 0 ? '+' : ''}{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${WOHL.line}`, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: WOHL.textMuted }}>
        <span>Ranking por % progreso · vol = kg × reps</span>
        <span style={{ color: WOHL.textDim }}>todo el historial</span>
      </div>
    </div>
  );
}

// ─── Calendar icons ───────────────────────────────────────────────────────────

function FullBodyCalendarIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.3)} viewBox="0 0 22 29" fill="none">
      <circle cx="11" cy="3" r="2.4" stroke={ACCENT} strokeWidth="1.3" />
      <path d="M8 6C8 6 6 7 5.5 9L5 13H8.5L9.5 11V19H12.5V11L13.5 13H17L16.5 9C16 7 14 6 14 6C13 5.7 11 5.7 11 5.7C11 5.7 9 5.7 8 6Z" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 8.5L3.5 13" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16.5 8.5L18.5 13" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9.5 19L8.5 26" stroke={ACCENT} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12.5 19L13.5 26" stroke={ACCENT} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 26H6.5" stroke={ACCENT} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M13.5 26H15.5" stroke={ACCENT} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function CalendarMuscleIcon({ group, size = 28 }: { group: MuscleGroupKey | 'fullbody'; size?: number }) {
  if (group === 'fullbody') return <FullBodyCalendarIcon size={size} />;
  return (
    <img src={MUSCLE_ICON_MAP[group]} alt={group} width={size} height={size}
      style={{ filter: 'invert(1) opacity(0.92)', objectFit: 'contain' }} draggable={false} />
  );
}

// ─── KgIcon (inline SVG for color control) ────────────────────────────────────

function KgIcon({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
  const color = (style?.color as string) ?? ACCENT;
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024">
      <g transform="translate(0,1024) scale(0.1,-0.1)" fill={color} stroke="none">
        <path d="M4925 8919 c-362 -52 -693 -298 -849 -630 -131 -278 -132 -640 -2 -915 41 -87 108 -194 140 -227 14 -13 -40 -15 -482 -20 -541 -5 -580 -9 -765 -71 -417 -140 -748 -493 -850 -906 -9 -36 -32 -157 -51 -270 -37 -214 -100 -587 -186 -1095 -28 -165 -80 -469 -115 -675 -249 -1454 -245 -1430 -245 -1561 0 -371 137 -698 405 -965 230 -229 491 -358 827 -409 84 -13 417 -15 2365 -15 2444 0 2360 -1 2557 52 612 163 1046 714 1046 1327 0 154 6 114 -240 1536 -61 352 -164 953 -230 1335 -66 382 -128 727 -139 765 -126 447 -488 793 -949 910 -142 36 -289 45 -754 45 l-407 0 55 77 c196 273 247 638 135 967 -129 380 -477 668 -896 740 -96 17 -271 19 -370 5z m334 -474 c78 -19 188 -73 255 -127 278 -220 314 -637 77 -891 -128 -137 -295 -210 -481 -210 -295 0 -541 188 -614 470 -18 70 -21 218 -5 295 6 29 29 91 51 136 74 156 229 279 408 326 72 19 229 19 309 1z m1730 -1819 c293 -61 529 -266 632 -547 30 -83 46 -167 189 -1049 23 -140 118 -714 211 -1275 184 -1098 194 -1176 166 -1321 -64 -340 -330 -611 -697 -713 l-95 -26 -2215 -3 c-2311 -3 -2319 -3 -2472 39 -258 72 -478 256 -589 493 -51 109 -70 191 -76 321 -5 118 -3 134 116 850 66 402 141 854 165 1005 125 775 259 1572 272 1625 24 93 96 233 161 310 144 171 351 285 553 303 41 4 871 6 1844 4 1457 -2 1781 -5 1835 -16z" />
        <path d="M5776 5071 c-223 -49 -415 -193 -502 -376 -67 -140 -69 -160 -69 -570 0 -417 2 -435 75 -580 96 -193 264 -329 479 -387 113 -31 335 -31 446 0 221 63 389 200 480 394 56 119 65 170 65 373 0 206 -8 234 -77 296 -67 60 -89 64 -368 64 -237 0 -252 -1 -290 -22 -86 -46 -135 -123 -135 -213 0 -92 55 -175 145 -216 42 -20 66 -24 148 -24 109 0 112 -2 77 -69 -48 -96 -155 -147 -289 -139 -134 8 -223 66 -275 177 -19 43 -21 65 -24 311 -4 293 3 352 49 425 71 111 219 161 358 119 41 -12 69 -31 130 -89 90 -87 130 -106 216 -107 133 -1 228 96 228 232 0 64 -25 119 -80 181 -77 85 -240 180 -368 214 -97 27 -311 29 -419 6z" />
        <path d="M3645 5056 c-46 -20 -94 -64 -118 -110 l-22 -41 -3 -770 c-2 -534 1 -784 8 -815 25 -100 101 -166 204 -177 92 -10 177 34 228 115 22 36 23 47 28 310 l5 274 205 -219 c458 -487 446 -478 575 -478 119 0 181 38 226 139 25 57 22 131 -6 187 -10 19 -106 124 -214 234 -108 110 -245 251 -306 313 l-110 112 297 298 c198 198 302 309 313 334 45 109 -17 246 -131 294 -48 20 -141 17 -192 -6 -46 -21 -99 -74 -439 -437 -115 -122 -211 -222 -215 -222 -4 -1 -8 120 -10 268 l-3 269 -30 44 c-58 83 -199 124 -290 84z" />
      </g>
    </svg>
  );
}

// ─── Body muscle highlight viewer ────────────────────────────────────────────

function BodyMuscleHighlightViewer({
  trainedGroups, view, onToggleView,
}: {
  trainedGroups: MuscleGroupKey[];
  view: 'front' | 'back';
  onToggleView: () => void;
}) {
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const trainedKey = `${trainedGroups.join(',')}|${view}`;

  useEffect(() => {
    const trained = new Set<MuscleGroupKey>(trainedGroups);
    if (bodySvgCache) {
      setSvgHtml(buildHighlightedBodySvg(bodySvgCache, trained, view));
      return;
    }
    fetch(BODY_SVG_URL)
      .then((r) => r.text())
      .then((text) => {
        bodySvgCache = text;
        setSvgHtml(buildHighlightedBodySvg(text, trained, view));
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainedKey]);

  return (
    <div style={{ flex: '0 0 150px', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.12)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '9px 8px 0' }}>
      {svgHtml ? (
        <div className="pointer-events-none select-none" style={{ width: '100%' }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled SVG injection
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      ) : (
        <div className="animate-pulse h-full" style={{ background: '#13263A' }} />
      )}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleView(); }}
        className="flex items-center gap-1 rounded-full"
        style={{
          position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
          padding: '5px 10px', background: 'rgba(0,0,0,0.32)',
          border: '1px solid rgba(0,201,167,0.45)', backdropFilter: 'blur(4px)',
          zIndex: 2, whiteSpace: 'nowrap',
        }}
        aria-label={view === 'front' ? 'Ver posterior' : 'Ver frontal'}
      >
        <RefreshCw size={10} style={{ color: ACCENT }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.04em' }}>
          {view === 'front' ? 'FRENTE' : 'DORSO'}
        </span>
      </button>
    </div>
  );
}

// ─── Calendar mode switch ─────────────────────────────────────────────────────

function CalendarModeSwitch({ mode, onChange }: { mode: 'icons' | 'numeric'; onChange: (m: 'icons' | 'numeric') => void }) {
  return (
    <div className="flex items-stretch rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,201,167,0.25)', background: 'rgba(0,0,0,0.28)', height: 30 }}>
      <button type="button" onClick={() => onChange('icons')} className="flex items-center justify-center transition-colors" style={{ width: 38, background: mode === 'icons' ? ACCENT : 'transparent' }} aria-label="Vista muscular">
        <img src={brazosUrl} alt="músculos" width={16} height={16}
          style={{ filter: mode === 'icons' ? 'invert(0) brightness(0)' : 'invert(1) opacity(0.65)', objectFit: 'contain' }} draggable={false} />
      </button>
      <button type="button" onClick={() => onChange('numeric')} className="flex items-center justify-center transition-colors" style={{ width: 38, background: mode === 'numeric' ? ACCENT : 'transparent' }} aria-label="Vista numérica">
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '-0.5px', color: mode === 'numeric' ? '#041016' : '#9BAEC1', lineHeight: 1 }}>
          123
        </span>
      </button>
    </div>
  );
}

// ─── Calendar cell ────────────────────────────────────────────────────────────

type CalendarCellProps = {
  isoDate: string; dayNum: number; isCurrentMonth: boolean;
  sessions: SessionHistory[]; isSelected: boolean;
  mode: 'icons' | 'numeric'; onSelect: (iso: string) => void;
};

function CalendarCell({ isoDate, dayNum, isCurrentMonth, sessions, isSelected, mode, onSelect }: CalendarCellProps) {
  const hasSessions = isCurrentMonth && sessions.length > 0;
  const hasPR = hasSessions && sessions.some(sessionHasPR);
  const multiCount = sessions.length > 1 ? sessions.length : null;
  const dominantGroup = hasSessions ? getDominantGroup(sessions) : null;
  const showIcon = mode === 'icons' && hasSessions && dominantGroup != null;

  return (
    <button type="button" onClick={() => hasSessions && onSelect(isoDate)}
      className="flex items-center justify-center"
      style={{ height: 52, cursor: hasSessions ? 'pointer' : 'default' }}
      tabIndex={hasSessions ? 0 : -1}
    >
      <div className="relative flex items-center justify-center" style={{
        width: 42, height: 42, borderRadius: '50%',
        background: hasSessions ? (isSelected ? 'rgba(0,201,167,0.22)' : 'rgba(0,201,167,0.09)') : 'transparent',
        border: hasSessions ? (isSelected ? `2px solid ${ACCENT}` : '1px solid rgba(0,201,167,0.22)') : 'none',
        boxShadow: isSelected && hasSessions ? '0 0 16px rgba(0,201,167,0.38), 0 0 6px rgba(0,201,167,0.2)' : undefined,
        flexShrink: 0, transition: 'box-shadow 0.2s ease',
      }}>
        {showIcon ? (
          <CalendarMuscleIcon group={dominantGroup!} size={28} />
        ) : (
          <span style={{ fontSize: 12.5, fontWeight: hasSessions ? 700 : 400, lineHeight: 1,
            color: !isCurrentMonth ? '#233A50' : hasSessions ? '#FFFFFF' : '#4A6178' }}>
            {dayNum}
          </span>
        )}
        {hasPR && (
          <div className="absolute" style={{ top: -2, right: -2 }}>
            <Star size={11} fill="#F5C24A" color="#F5C24A" />
          </div>
        )}
        {hasSessions && multiCount && (
          <div className="absolute flex items-center justify-center rounded-full"
            style={{ top: -3, left: -3, width: 15, height: 15, background: ACCENT, border: '1.5px solid #0B1F33' }}>
            <span style={{ fontSize: 8, fontWeight: 800, color: '#041016', lineHeight: 1 }}>{multiCount}</span>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Training calendar card ───────────────────────────────────────────────────

function TrainingCalendarCard({
  year, month, todayIso, sessionsByDay, selectedDay, mode, onModeChange, onSelectDay,
}: {
  year: number; month: number; todayIso: string;
  sessionsByDay: Map<string, SessionHistory[]>;
  selectedDay: string | null; mode: 'icons' | 'numeric';
  onModeChange: (m: 'icons' | 'numeric') => void; onSelectDay: (iso: string) => void;
}) {
  const grid = useMemo(() => buildCalendarGrid(year, month, todayIso), [year, month, todayIso]);

  return (
    <div className="rounded-2xl border" style={{ background: '#0D1E30', borderColor: 'rgba(255,255,255,0.07)', padding: '16px 14px 12px' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} style={{ color: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>Historial de entrenamiento</span>
        </div>
        <CalendarModeSwitch mode={mode} onChange={onModeChange} />
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center" style={{ fontSize: 9, fontWeight: 700, color: '#3A5470', letterSpacing: '0.05em' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {grid.map((day) => (
          <CalendarCell key={day.isoDate} isoDate={day.isoDate} dayNum={day.dayNum}
            isCurrentMonth={day.isCurrentMonth} sessions={sessionsByDay.get(day.isoDate) ?? []}
            isSelected={day.isoDate === selectedDay} mode={mode} onSelect={onSelectDay} />
        ))}
      </div>
    </div>
  );
}

// ─── Selected day card ────────────────────────────────────────────────────────

function SelectedDayCard({
  isoDate, sessions, weightUnit, onNavigateToDetail,
}: {
  isoDate: string; sessions: SessionHistory[];
  weightUnit: AppSettings['weightUnit']; onNavigateToDetail: (id: number) => void;
}) {
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');

  const primary = sessions.reduce((a, b) => (a.volume >= b.volume ? a : b));
  const hasPR = sessions.some(sessionHasPR);
  const muscles = getSessionMusclesList(primary);
  const setCount = primary.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const exerciseCount = primary.exercises.length;
  const volStr = primary.volume > 0
    ? `${(convertWeightFromKg(primary.volume, weightUnit) / 1000).toFixed(1)}${weightUnit === 'lb' ? 'LB' : 'KG'}`
    : '—';

  const trainedGroups = useMemo((): MuscleGroupKey[] => {
    const seen = new Set<MuscleGroupKey>();
    const result: MuscleGroupKey[] = [];
    for (const ex of primary.exercises) {
      const g = normalizeMuscleGroup(ex.muscle);
      if (g && !seen.has(g)) { seen.add(g); result.push(g); }
    }
    return result;
  }, [primary.exercises]);

  const durValue = primary.duration < 60
    ? `${primary.duration}`
    : primary.duration % 60 === 0
      ? `${Math.floor(primary.duration / 60)}h`
      : `${Math.floor(primary.duration / 60)}h ${primary.duration % 60}m`;

  const visibleMuscles = muscles.slice(0, 4);
  const extraMuscles = muscles.length > 4 ? muscles.length - 4 : 0;

  const METRICS = [
    { iconNode: <Clock size={19} style={{ color: ACCENT }} />,    value: durValue || '—',                              label: 'Duración'   },
    { iconNode: <Dumbbell size={19} style={{ color: ACCENT }} />, value: exerciseCount > 0 ? `${exerciseCount}` : '—', label: 'Ejercicios' },
    { iconNode: <Layers size={19} style={{ color: ACCENT }} />,   value: setCount > 0 ? `${setCount}` : '—',           label: 'Series'     },
    { iconNode: <KgIcon size={29} style={{ color: ACCENT }} />,   value: volStr,                                        label: 'Volumen'    },
  ];

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      style={{
        display: 'flex', minHeight: 250, borderRadius: 26, overflow: 'hidden',
        background: 'linear-gradient(155deg, #0E2137 0%, #0A1824 100%)',
        border: '1px solid rgba(0,201,167,0.14)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        cursor: 'pointer',
      }}
      onClick={() => onNavigateToDetail(primary.id)}
    >
      <BodyMuscleHighlightViewer trainedGroups={trainedGroups} view={bodyView}
        onToggleView={() => setBodyView((v) => (v === 'front' ? 'back' : 'front'))} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 14px 14px 12px', gap: 10, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <p style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.4px', flex: 1, minWidth: 0 }}>
            <span style={{ color: ACCENT }}>{formatDayLabel(isoDate)}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}> · </span>
            <span style={{ color: '#FFFFFF' }}>{primary.name}</span>
          </p>
          <ChevronRight size={20} style={{ color: 'rgba(180,200,220,0.7)', flexShrink: 0, marginTop: 3 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 14, overflow: 'hidden', background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.06)', flex: 1 }}>
          {METRICS.map(({ iconNode, value, label }, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '10px 12px 10px 15px', gap: 2,
              borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.07)' : undefined,
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : undefined,
            }}>
              {iconNode}
              <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, margin: '5px 0 2px' }}>{value}</span>
              {label && <span style={{ fontSize: 11, fontWeight: 500, color: '#7A96AE' }}>{label}</span>}
            </div>
          ))}
        </div>

        {muscles.length > 0 && (
          <p style={{ fontSize: 13, color: '#9FB2C7', lineHeight: 1.35 }}>
            {visibleMuscles.join(' · ')}
            {extraMuscles > 0 && <span style={{ color: ACCENT, fontWeight: 700 }}> +{extraMuscles}</span>}
          </p>
        )}

        {hasPR && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 12, background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.18)' }}>
            <Star size={13} fill="#F5C24A" color="#F5C24A" />
            <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>Nuevo récord personal en esta sesión</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Empty month state ────────────────────────────────────────────────────────

function EmptyMonthState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border px-6 py-9"
      style={{ background: '#0D1E30', borderColor: 'rgba(255,255,255,0.07)' }}>
      <CalendarDays size={26} style={{ color: ACCENT, opacity: 0.35 }} />
      <p className="text-center text-sm font-semibold text-white">
        No registraste entrenamientos en este mes.
      </p>
    </div>
  );
}

// ─── Summary strip (4-column KPI card) ───────────────────────────────────────

type MetricsSummary = ReturnType<typeof buildMetricsSummary>;

function SummaryStrip({
  sessionCount, totalVolumeKg, totalSeries, streak, weightUnit, summary,
}: {
  sessionCount: number; totalVolumeKg: number; totalSeries: number;
  streak: number; weightUnit: AppSettings['weightUnit']; summary: MetricsSummary;
}) {
  const volConverted = convertWeightFromKg(totalVolumeKg, weightUnit);
  const volStr = volConverted >= 1000 ? `${(volConverted / 1000).toFixed(1)}K` : String(Math.round(volConverted));
  const volUnit = weightUnit === 'lb' ? 'LB' : 'KG';

  const items = [
    { icon: Activity, label: 'SESIONES', value: sessionCount > 0 ? String(sessionCount) : '—', valUnit: undefined as string | undefined, subtitle: undefined as string | undefined, delta: summary.sessionsDelta },
    { icon: Dumbbell, label: 'VOLUMEN',  value: totalVolumeKg > 0 ? volStr : '—', valUnit: totalVolumeKg > 0 ? volUnit : undefined, subtitle: undefined as string | undefined, delta: summary.volumeDelta },
    { icon: Layers,   label: 'SERIES',   value: totalSeries > 0 ? String(totalSeries) : '—', valUnit: undefined as string | undefined, subtitle: undefined as string | undefined, delta: summary.seriesDelta },
    { icon: Flame,    label: 'RACHA',    value: streak > 0 ? String(streak) : '—', valUnit: undefined as string | undefined, subtitle: streak > 0 ? 'semanas' : undefined, delta: null as number | null },
  ];

  return (
    <div style={{ background: '#0D1E30', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {items.map(({ icon: Icon, label, value, valUnit, subtitle, delta }, i) => {
          const positive = (delta ?? 0) >= 0;
          return (
            <div key={label} style={{
              padding: '14px 10px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : undefined,
              display: 'flex', flexDirection: 'column', gap: 3,
            }}>
              <Icon size={13} style={{ color: ACCENT }} />
              <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '.14em', color: '#546880', textTransform: 'uppercase', marginTop: 2 }}>
                {label}
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#FFFFFF' }}>
                {value}
                {valUnit && <span style={{ fontSize: 9, fontWeight: 700, color: WOHL.textMuted, marginLeft: 2, fontStyle: 'italic' }}>{valUnit}</span>}
              </div>
              {delta !== null ? (
                <div style={{ fontSize: 9, fontWeight: 800 }}>
                  <span style={{ color: positive ? '#54D62C' : '#FF7A8C' }}>{positive ? '+' : ''}{delta}%</span>
                  <span style={{ color: WOHL.textDim, fontWeight: 600, marginLeft: 3 }}>vs 4 sem.</span>
                </div>
              ) : subtitle ? (
                <span style={{ fontSize: 10, fontWeight: 600, color: '#7F98FF' }}>{subtitle}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Activity tab ─────────────────────────────────────────────────────────────

function ActivityTab({
  year, month, todayIso, monthSessions, sessionsByDay, selectedDay, onSelectDay,
  calendarMode, onModeChange, weightUnit, onNavigateToDetail,
}: {
  year: number; month: number; todayIso: string;
  monthSessions: SessionHistory[]; sessionsByDay: Map<string, SessionHistory[]>;
  selectedDay: string | null; onSelectDay: (iso: string) => void;
  calendarMode: 'icons' | 'numeric'; onModeChange: (m: 'icons' | 'numeric') => void;
  weightUnit: AppSettings['weightUnit']; onNavigateToDetail: (id: number) => void;
}) {
  const selectedDaySessions = selectedDay ? (sessionsByDay.get(selectedDay) ?? null) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TrainingCalendarCard
        year={year} month={month} todayIso={todayIso}
        sessionsByDay={sessionsByDay} selectedDay={selectedDay}
        mode={calendarMode} onModeChange={onModeChange} onSelectDay={onSelectDay}
      />
      {monthSessions.length === 0 ? (
        <EmptyMonthState />
      ) : selectedDaySessions ? (
        <SelectedDayCard
          isoDate={selectedDay!} sessions={selectedDaySessions}
          weightUnit={weightUnit} onNavigateToDetail={onNavigateToDetail}
        />
      ) : null}
    </div>
  );
}

// ─── Resumen tab (renamed from General) ──────────────────────────────────────

function ResumenTab({
  sessionHistory,
  todayIso,
  onOpenMuscleLoad,
}: {
  sessionHistory: SessionHistory[];
  todayIso: string;
  onOpenMuscleLoad: () => void;
}) {
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <WeeklyMuscleLoad onOpenDetails={onOpenMuscleLoad} />
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.22em' }}>BALANCE MUSCULAR</div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.18em', color: WOHL.accent }}>VOLUMEN EFECTIVO</div>
        </div>
        <MuscleRadarSvg sessionHistory={sessionHistory} todayIso={todayIso} />
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.22em' }}>FRECUENCIA SEMANAL</div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.16em', color: WOHL.accent }}>ÚLTIMAS 8 SEMANAS</div>
        </div>
        <FrequencyBars sessionHistory={sessionHistory} todayIso={todayIso} />
      </Card>
    </>
  );
}

// ─── Fuerza tab ───────────────────────────────────────────────────────────────

function FuerzaTab({ sessionHistory }: { sessionHistory: SessionHistory[] }) {
  const prs = buildExercisePRs(sessionHistory);

  if (prs.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: 32 }}>
        <TrendingUp size={32} style={{ color: WOHL.textDim, margin: '0 auto 12px' }} />
        <p style={{ color: WOHL.textMuted, fontSize: 13 }}>
          Registrá al menos 2 sesiones del mismo ejercicio para ver tus récords.
        </p>
      </Card>
    );
  }

  return (
    <>
      <ProgressPodium sessionHistory={sessionHistory} />
      <SLabel>RÉCORDS PERSONALES</SLabel>
      <div style={{ background: WOHL.surface, border: `1px solid ${WOHL.line}`, borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
        {prs.map((p, i) => (
          <div key={p.name} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            alignItems: 'center', gap: 12, padding: '14px 14px',
            borderBottom: i < prs.length - 1 ? `1px solid ${WOHL.line}` : 'none',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: WOHL.textMuted, marginTop: 2, letterSpacing: '.04em' }}>
                {p.maxKg} kg × {p.bestReps}
                {p.deltaKg !== null && p.deltaKg !== 0 && (
                  <span style={{ color: p.deltaKg > 0 ? '#54D62C' : '#FF7A8C', marginLeft: 6, fontWeight: 700 }}>
                    {p.deltaKg > 0 ? '▲' : '▼'} {p.deltaKg > 0 ? '+' : ''}{p.deltaKg}
                  </span>
                )}
                {p.deltaKg === 0 && <span style={{ color: WOHL.textDim, marginLeft: 6, fontWeight: 700 }}>=  0</span>}
              </div>
            </div>
            <SparklineSvg data={p.sparkline} color={p.deltaKg !== null && p.deltaKg < 0 ? '#FF7A8C' : WOHL.accent} />
            <div style={{ textAlign: 'right', fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
              {p.maxKg}
              <span style={{ fontSize: 11, fontStyle: 'italic', color: '#9BAEC1', fontWeight: 700, marginLeft: 2 }}>kg</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MetricsPage() {
  const navigate = useNavigate();
  const { sessionHistory, appContext, appSettings } = useAppData();

  const todayDate = new Date(`${appContext.todayIso}T12:00:00`);
  const [tab, setTab] = useState<Tab>('actividad');
  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth() + 1);
  const [calendarMode, setCalendarMode] = useState<'icons' | 'numeric'>('icons');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const hasAutoSelected = useRef(false);
  useEffect(() => {
    if (hasAutoSelected.current || !sessionHistory.length) return;
    const sessions = getSessionsForMonth(sessionHistory, viewYear, viewMonth);
    if (!sessions.length) return;
    const latest = sessions.reduce((a, b) => (a.isoDate > b.isoDate ? a : b));
    setSelectedDay(latest.isoDate);
    hasAutoSelected.current = true;
  }, [sessionHistory, viewYear, viewMonth]);

  const monthSessions = useMemo(
    () => getSessionsForMonth(sessionHistory, viewYear, viewMonth),
    [sessionHistory, viewYear, viewMonth],
  );
  const sessionsByDay = useMemo(() => groupSessionsByDay(monthSessions), [monthSessions]);
  const streak = useMemo(
    () => calculateWeekStreak(sessionHistory, appContext.todayIso),
    [sessionHistory, appContext.todayIso],
  );
  const totalVolume = useMemo(
    () => monthSessions.reduce((sum, s) => sum + s.volume, 0),
    [monthSessions],
  );
  const totalSeries = useMemo(
    () => monthSessions.reduce((sum, s) => sum + s.exercises.reduce((es, ex) => es + ex.sets.length, 0), 0),
    [monthSessions],
  );
  const summary = useMemo(
    () => buildMetricsSummary(sessionHistory, appContext.todayIso),
    [sessionHistory, appContext.todayIso],
  );

  const handleMonthChange = (delta: 1 | -1) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setViewYear(y);
    setViewMonth(m);
    const next = getSessionsForMonth(sessionHistory, y, m);
    setSelectedDay(next.length ? next.reduce((a, b) => (a.isoDate > b.isoDate ? a : b)).isoDate : null);
  };

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

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header rightContent={headerSettingsAction} />

      <div style={{ padding: '16px 14px 0' }}>

        {/* Month selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button type="button" onClick={() => handleMonthChange(-1)} style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.09)', background: '#13263A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <ChevronLeft size={18} style={{ color: WOHL.textMuted }} />
          </button>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
            {MONTH_NAMES[viewMonth - 1]} {viewYear}
          </span>
          <button type="button" onClick={() => handleMonthChange(1)} style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.09)', background: '#13263A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <ChevronRight size={18} style={{ color: WOHL.textMuted }} />
          </button>
        </div>

        {/* Summary strip */}
        <div style={{ marginBottom: 14 }}>
          <SummaryStrip
            sessionCount={monthSessions.length}
            totalVolumeKg={totalVolume}
            totalSeries={totalSeries}
            streak={streak}
            weightUnit={appSettings.weightUnit}
            summary={summary}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 12, borderBottom: `1px solid ${WOHL.line}` }}>
          {(['actividad', 'resumen', 'fuerza'] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { actividad: 'Actividad', resumen: 'Resumen', fuerza: 'Fuerza' };
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px 0', background: 'transparent', border: 0, cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 13, letterSpacing: '.06em',
                color: tab === t ? WOHL.accent : WOHL.textMuted,
                borderBottom: tab === t ? `2px solid ${WOHL.accent}` : '2px solid transparent',
                marginBottom: -1,
              }}>
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ paddingBottom: 40 }}>
          {tab === 'actividad' && (
            <ActivityTab
              year={viewYear} month={viewMonth} todayIso={appContext.todayIso}
              monthSessions={monthSessions} sessionsByDay={sessionsByDay}
              selectedDay={selectedDay} onSelectDay={setSelectedDay}
              calendarMode={calendarMode} onModeChange={setCalendarMode}
              weightUnit={appSettings.weightUnit}
              onNavigateToDetail={(id) => navigate(`/session-history/${id}`)}
            />
          )}
          {tab === 'resumen' && (
            <ResumenTab
              sessionHistory={sessionHistory}
              todayIso={appContext.todayIso}
              onOpenMuscleLoad={() => navigate('/metrics/muscle-load')}
            />
          )}
          {tab === 'fuerza' && <FuerzaTab sessionHistory={sessionHistory} />}
        </div>

      </div>
    </div>
  );
}
