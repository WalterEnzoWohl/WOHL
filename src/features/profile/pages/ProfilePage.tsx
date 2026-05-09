import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import {
  Activity,
  BarChart2,
  Beef,
  CalendarDays,
  Camera,
  ChevronRight,
  Clock,
  Droplet,
  Dumbbell,
  Flame,
  Pencil,
  Settings,
  Wheat,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Header } from '@/shared/components/layout/Header';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { calculateNutritionTargets } from '@/core/domain/profileInsights';
import { useAppData } from '@/core/app-data/AppDataContext';
import { formatWeightNumber, getWeightUnitLabel } from '@/shared/lib/unitUtils';
import { buildWeeklyFrequency } from '@/core/domain/metricsInsights';
import type { SessionHistory } from '@/shared/types/models';

const AVATAR_EDITOR_SIZE = 280;
const AVATAR_OUTPUT_SIZE = 512;

type PendingAvatarImage = {
  src: string;
  width: number;
  height: number;
};

type AvatarPointer = {
  x: number;
  y: number;
};

type AvatarGesture =
  | {
      type: 'pan';
      pointerId: number;
      startX: number;
      startY: number;
      startOffsetX: number;
      startOffsetY: number;
    }
  | {
      type: 'pinch';
      startDistance: number;
      startCenterX: number;
      startCenterY: number;
      startZoom: number;
      startOffsetX: number;
      startOffsetY: number;
    };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function canvasToAvatarBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (webpBlob) => {
        if (webpBlob) {
          resolve(webpBlob);
          return;
        }

        canvas.toBlob(
          (jpegBlob) => {
            if (jpegBlob) {
              resolve(jpegBlob);
              return;
            }

            reject(new Error('No se pudo exportar el avatar.'));
          },
          'image/jpeg',
          0.9
        );
      },
      'image/webp',
      0.86
    );
  });
}

function getWeeklySummary(sessions: SessionHistory[], todayIso: string) {
  const today = new Date(`${todayIso}T12:00:00`);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const thisWeek = sessions.filter((s) => {
    const d = new Date(`${s.isoDate}T12:00:00`);
    return d >= weekStart && d <= weekEnd;
  });

  return {
    count: thisWeek.length,
    totalMinutes: thisWeek.reduce((sum, s) => sum + s.duration, 0),
    totalVolume: thisWeek.reduce((sum, s) => sum + s.volume, 0),
  };
}

function formatDuration(totalMinutes: number): string {
  if (totalMinutes === 0) return '—';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatVolume(volume: number): string {
  if (volume === 0) return '—';
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k`;
  return volume.toString();
}

function formatSessionDate(isoDate: string): string {
  const [, monthStr, dayStr] = isoDate.split('-');
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return `${parseInt(dayStr)} ${months[parseInt(monthStr) - 1]}`;
}

function FrequencyBarsProfile({ sessionHistory, todayIso }: { sessionHistory: SessionHistory[]; todayIso: string }) {
  const weeks = buildWeeklyFrequency(sessionHistory, todayIso);
  const max = Math.max(...weeks.map((w) => w.sessions), 1);

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <div style={{
        width: 14, height: 120, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', fontSize: 9, color: '#65758A',
        fontWeight: 700, alignItems: 'flex-end', paddingTop: 2,
      }}>
        {[max + 1, Math.round((max + 1) * 0.75), Math.round((max + 1) * 0.5), Math.round((max + 1) * 0.25), 0].map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, position: 'relative' }}>
          {[0, 0.25, 0.5, 0.75].map((g, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${g * 100}%`, height: 1, background: 'rgba(144,164,184,0.10)' }} />
          ))}
          {weeks.map((w, i) => {
            const pct = (w.sessions / (max + 1)) * 100;
            const isTop = w.sessions === max && w.sessions > 0;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 10, color: isTop ? '#00C9A7' : '#fff', fontWeight: 800 }}>
                  {w.sessions > 0 ? w.sessions : ''}
                </div>
                <div style={{
                  width: '78%', height: `${pct}%`, borderRadius: '6px 6px 2px 2px',
                  background: w.sessions > 0 ? 'linear-gradient(180deg, #00C9A7, rgba(0,201,167,0.42))' : 'rgba(144,164,184,0.08)',
                  border: w.sessions > 0 ? '1px solid rgba(0,201,167,0.55)' : '1px solid rgba(144,164,184,0.12)',
                  minHeight: 2,
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {weeks.map((w, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' as const, fontSize: 8, color: '#9BAEC1', lineHeight: 1.25, whiteSpace: 'pre-line' as const, fontWeight: 700 }}>
              {w.week}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarPointersRef = useRef<Map<number, AvatarPointer>>(new Map());
  const avatarGestureRef = useRef<AvatarGesture | null>(null);
  const avatarZoomRef = useRef(1);
  const avatarOffsetRef = useRef({ x: 0, y: 0 });
  const { appContext, appSettings, sessionHistory, updateProfileAvatar, userProfile } = useAppData();
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatarImage | null>(null);
  const [avatarZoom, setAvatarZoom] = useState(1);
  const [avatarOffsetX, setAvatarOffsetX] = useState(0);
  const [avatarOffsetY, setAvatarOffsetY] = useState(0);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const nutritionTargets = calculateNutritionTargets(userProfile);
  const weightUnitLabel = getWeightUnitLabel(appSettings.weightUnit);
  const weeklySummary = useMemo(
    () => getWeeklySummary(sessionHistory, appContext.todayIso),
    [sessionHistory, appContext.todayIso]
  );
  const lastSession = sessionHistory[0] ?? null;

  const avatarBaseScale = useMemo(() => {
    if (!pendingAvatar) return 1;
    return Math.max(AVATAR_EDITOR_SIZE / pendingAvatar.width, AVATAR_EDITOR_SIZE / pendingAvatar.height);
  }, [pendingAvatar]);
  const avatarScale = avatarBaseScale * avatarZoom;
  const avatarDisplayWidth = pendingAvatar ? pendingAvatar.width * avatarScale : AVATAR_EDITOR_SIZE;
  const avatarDisplayHeight = pendingAvatar ? pendingAvatar.height * avatarScale : AVATAR_EDITOR_SIZE;
  const avatarMaxOffsetX = Math.max(0, (avatarDisplayWidth - AVATAR_EDITOR_SIZE) / 2);
  const avatarMaxOffsetY = Math.max(0, (avatarDisplayHeight - AVATAR_EDITOR_SIZE) / 2);

  useEffect(() => {
    if (!pendingAvatar) return;
    setAvatarOffsetX((previous) => clamp(previous, -avatarMaxOffsetX, avatarMaxOffsetX));
    setAvatarOffsetY((previous) => clamp(previous, -avatarMaxOffsetY, avatarMaxOffsetY));
  }, [avatarMaxOffsetX, avatarMaxOffsetY, pendingAvatar]);

  useEffect(() => {
    avatarZoomRef.current = avatarZoom;
    avatarOffsetRef.current = { x: avatarOffsetX, y: avatarOffsetY };
  }, [avatarOffsetX, avatarOffsetY, avatarZoom]);

  const closeAvatarEditor = () => {
    avatarPointersRef.current.clear();
    avatarGestureRef.current = null;
    avatarZoomRef.current = 1;
    avatarOffsetRef.current = { x: 0, y: 0 };
    setShowAvatarEditor(false);
    setPendingAvatar(null);
    setAvatarZoom(1);
    setAvatarOffsetX(0);
    setAvatarOffsetY(0);
    setAvatarError(null);
    setIsSavingAvatar(false);
  };

  const loadPendingAvatar = (src: string) => {
    const image = new Image();
    image.onload = () => {
      setPendingAvatar({ src, width: image.naturalWidth, height: image.naturalHeight });
      setAvatarZoom(1);
      setAvatarOffsetX(0);
      setAvatarOffsetY(0);
      avatarPointersRef.current.clear();
      avatarGestureRef.current = null;
      avatarZoomRef.current = 1;
      avatarOffsetRef.current = { x: 0, y: 0 };
      setAvatarError(null);
      setShowAvatarEditor(true);
    };
    image.onerror = () => {
      setAvatarError('No pudimos abrir esa imagen. Probá con otra foto.');
    };
    image.src = src;
  };

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Elegí un archivo de imagen válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') loadPendingAvatar(reader.result);
    };
    reader.onerror = () => {
      setAvatarError('No pudimos leer esa imagen. Probá de nuevo.');
    };
    reader.readAsDataURL(file);
  };

  const getAvatarGestureMetrics = (element: HTMLDivElement) => {
    const pointerValues = Array.from(avatarPointersRef.current.values());
    const [firstPointer, secondPointer] = pointerValues;
    if (!firstPointer || !secondPointer) return null;
    const rect = element.getBoundingClientRect();
    const centerX = (firstPointer.x + secondPointer.x) / 2 - rect.left - rect.width / 2;
    const centerY = (firstPointer.y + secondPointer.y) / 2 - rect.top - rect.height / 2;
    const distance = Math.hypot(secondPointer.x - firstPointer.x, secondPointer.y - firstPointer.y);
    return { centerX, centerY, distance };
  };

  const applyAvatarZoom = (
    nextZoomValue: number,
    focalX: number,
    focalY: number,
    baseZoom = avatarZoomRef.current,
    baseOffsetX = avatarOffsetRef.current.x,
    baseOffsetY = avatarOffsetRef.current.y
  ) => {
    if (!pendingAvatar) return;
    const clampedZoom = clamp(nextZoomValue, 1, 2.5);
    const zoomRatio = clampedZoom / baseZoom;
    const nextScale = avatarBaseScale * clampedZoom;
    const nextDisplayWidth = pendingAvatar.width * nextScale;
    const nextDisplayHeight = pendingAvatar.height * nextScale;
    const nextMaxOffsetX = Math.max(0, (nextDisplayWidth - AVATAR_EDITOR_SIZE) / 2);
    const nextMaxOffsetY = Math.max(0, (nextDisplayHeight - AVATAR_EDITOR_SIZE) / 2);
    const nextOffsetX = clamp(focalX - (focalX - baseOffsetX) * zoomRatio, -nextMaxOffsetX, nextMaxOffsetX);
    const nextOffsetY = clamp(focalY - (focalY - baseOffsetY) * zoomRatio, -nextMaxOffsetY, nextMaxOffsetY);
    avatarZoomRef.current = clampedZoom;
    avatarOffsetRef.current = { x: nextOffsetX, y: nextOffsetY };
    setAvatarZoom(clampedZoom);
    setAvatarOffsetX(nextOffsetX);
    setAvatarOffsetY(nextOffsetY);
  };

  const handleAvatarPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    avatarPointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    if (avatarPointersRef.current.size === 1) {
      avatarGestureRef.current = {
        type: 'pan',
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startOffsetX: avatarOffsetRef.current.x,
        startOffsetY: avatarOffsetRef.current.y,
      };
      return;
    }
    if (avatarPointersRef.current.size >= 2) {
      const metrics = getAvatarGestureMetrics(event.currentTarget);
      if (!metrics) return;
      avatarGestureRef.current = {
        type: 'pinch',
        startDistance: metrics.distance,
        startCenterX: metrics.centerX,
        startCenterY: metrics.centerY,
        startZoom: avatarZoomRef.current,
        startOffsetX: avatarOffsetRef.current.x,
        startOffsetY: avatarOffsetRef.current.y,
      };
    }
  };

  const handleAvatarPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!avatarPointersRef.current.has(event.pointerId)) return;
    avatarPointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const activeGesture = avatarGestureRef.current;
    if (!activeGesture) return;
    if (activeGesture.type === 'pan' && avatarPointersRef.current.size === 1) {
      const deltaX = event.clientX - activeGesture.startX;
      const deltaY = event.clientY - activeGesture.startY;
      const nextOffsetX = clamp(activeGesture.startOffsetX + deltaX, -avatarMaxOffsetX, avatarMaxOffsetX);
      const nextOffsetY = clamp(activeGesture.startOffsetY + deltaY, -avatarMaxOffsetY, avatarMaxOffsetY);
      avatarOffsetRef.current = { x: nextOffsetX, y: nextOffsetY };
      setAvatarOffsetX(nextOffsetX);
      setAvatarOffsetY(nextOffsetY);
      return;
    }
    if (activeGesture.type === 'pinch' && avatarPointersRef.current.size >= 2) {
      const metrics = getAvatarGestureMetrics(event.currentTarget);
      if (!metrics || activeGesture.startDistance === 0) return;
      const nextZoomValue = clamp(
        activeGesture.startZoom * (metrics.distance / activeGesture.startDistance),
        1,
        2.5
      );
      const zoomRatio = nextZoomValue / activeGesture.startZoom;
      const nextScale = avatarBaseScale * nextZoomValue;
      const nextDisplayWidth = pendingAvatar ? pendingAvatar.width * nextScale : AVATAR_EDITOR_SIZE;
      const nextDisplayHeight = pendingAvatar ? pendingAvatar.height * nextScale : AVATAR_EDITOR_SIZE;
      const nextMaxOffsetX = Math.max(0, (nextDisplayWidth - AVATAR_EDITOR_SIZE) / 2);
      const nextMaxOffsetY = Math.max(0, (nextDisplayHeight - AVATAR_EDITOR_SIZE) / 2);
      const nextOffsetX = clamp(
        metrics.centerX - (activeGesture.startCenterX - activeGesture.startOffsetX) * zoomRatio,
        -nextMaxOffsetX,
        nextMaxOffsetX
      );
      const nextOffsetY = clamp(
        metrics.centerY - (activeGesture.startCenterY - activeGesture.startOffsetY) * zoomRatio,
        -nextMaxOffsetY,
        nextMaxOffsetY
      );
      avatarZoomRef.current = nextZoomValue;
      avatarOffsetRef.current = { x: nextOffsetX, y: nextOffsetY };
      setAvatarZoom(nextZoomValue);
      setAvatarOffsetX(nextOffsetX);
      setAvatarOffsetY(nextOffsetY);
    }
  };

  const handleAvatarPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    avatarPointersRef.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (avatarPointersRef.current.size === 1) {
      const [remainingPointerId, remainingPointer] = Array.from(avatarPointersRef.current.entries())[0];
      avatarGestureRef.current = {
        type: 'pan',
        pointerId: remainingPointerId,
        startX: remainingPointer.x,
        startY: remainingPointer.y,
        startOffsetX: avatarOffsetRef.current.x,
        startOffsetY: avatarOffsetRef.current.y,
      };
      return;
    }
    if (avatarPointersRef.current.size >= 2) {
      const metrics = getAvatarGestureMetrics(event.currentTarget);
      if (!metrics) return;
      avatarGestureRef.current = {
        type: 'pinch',
        startDistance: metrics.distance,
        startCenterX: metrics.centerX,
        startCenterY: metrics.centerY,
        startZoom: avatarZoomRef.current,
        startOffsetX: avatarOffsetRef.current.x,
        startOffsetY: avatarOffsetRef.current.y,
      };
      return;
    }
    avatarGestureRef.current = null;
  };

  const handleAvatarWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const focalX = event.clientX - rect.left - rect.width / 2;
    const focalY = event.clientY - rect.top - rect.height / 2;
    applyAvatarZoom(avatarZoomRef.current * Math.exp(-event.deltaY * 0.0025), focalX, focalY);
  };

  const saveAvatar = async () => {
    if (!pendingAvatar) return;
    setIsSavingAvatar(true);
    setAvatarError(null);
    try {
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('No pudimos guardar la imagen. Probá otra vez.'));
        image.src = pendingAvatar.src;
      });
      const canvas = document.createElement('canvas');
      canvas.width = AVATAR_OUTPUT_SIZE;
      canvas.height = AVATAR_OUTPUT_SIZE;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('No pudimos preparar la imagen para guardarla.');
      const sourceWidth = AVATAR_EDITOR_SIZE / avatarScale;
      const sourceHeight = AVATAR_EDITOR_SIZE / avatarScale;
      const sourceX = clamp(
        (avatarDisplayWidth / 2 - AVATAR_EDITOR_SIZE / 2 - avatarOffsetX) / avatarScale,
        0,
        Math.max(0, pendingAvatar.width - sourceWidth)
      );
      const sourceY = clamp(
        (avatarDisplayHeight / 2 - AVATAR_EDITOR_SIZE / 2 - avatarOffsetY) / avatarScale,
        0,
        Math.max(0, pendingAvatar.height - sourceHeight)
      );
      context.clearRect(0, 0, AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_SIZE);
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_SIZE);
      const avatarBlob = await canvasToAvatarBlob(canvas);
      await updateProfileAvatar(avatarBlob);
      closeAvatarEditor();
    } catch {
      setAvatarError('No pudimos guardar la imagen. Probá otra vez.');
      setIsSavingAvatar(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header
        rightContent={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/config')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,201,167,0.22)] bg-[#13263A] transition-colors hover:bg-white/5"
              aria-label="Ir a ajustes"
            >
              <Settings size={16} className="text-[#00C9A7]" />
            </button>
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,201,167,0.22)] bg-[#13263A] transition-colors hover:bg-white/5"
              aria-label="Editar perfil"
            >
              <Pencil size={16} className="text-[#00C9A7]" />
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-5 px-5 py-5 pb-6">
        {/* Hero */}
        <div className="flex items-center gap-5 py-2">
          <div className="relative h-[88px] w-[88px] flex-shrink-0">
            <UserAvatar
              alt={userProfile.fullName}
              className="h-full w-full overflow-hidden rounded-full bg-[#1A2D42]"
              imageClassName="theme-preserve h-full w-full object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(0,201,167,0.32)] bg-[#0B1F33] shadow-[0_0_10px_rgba(0,201,167,0.18)] transition-colors active:bg-[#1A2D42]"
              type="button"
              aria-label="Cambiar foto de perfil"
            >
              <Camera size={12} className="text-[#00C9A7]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileChange}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-white">
              {userProfile.fullName}
            </h1>
            <p className="text-sm font-semibold text-[#00C9A7]">
              {userProfile.goal} · {userProfile.trainingLevel}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <CalendarDays size={11} className="shrink-0 text-[#546880]" />
              <p className="text-xs text-[#546880]">
                Miembro desde {userProfile.memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Datos físicos */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#13263A] px-4 py-4">
          <div className="mb-3 flex items-center gap-2">
            <Activity size={13} className="text-[#00C9A7]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00C9A7]">
              Datos físicos
            </p>
          </div>
          <div className="grid grid-cols-3">
            {[
              {
                label: 'Peso',
                value: formatWeightNumber(userProfile.weightKg, appSettings.weightUnit),
                unit: weightUnitLabel,
              },
              { label: 'Altura', value: userProfile.heightCm.toString(), unit: 'cm' },
              { label: 'Edad', value: userProfile.age > 0 ? userProfile.age.toString() : '—', unit: 'años' },
            ].map(({ label, value, unit }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center py-1 ${
                  i < 2 ? 'border-r border-[rgba(255,255,255,0.07)]' : ''
                }`}
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">{value}</span>
                  <span className="text-sm font-bold text-[#00C9A7]">{unit}</span>
                </div>
                <p className="mt-0.5 text-xs text-[#546880]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Macros sugeridos */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#13263A] px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={13} className="text-[#00C9A7]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00C9A7]">
                Macros sugeridos
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white">{nutritionTargets.targetCalories}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00C9A7]">kcal</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'PROTEÍNAS', value: nutritionTargets.proteinGrams, icon: <Beef size={13} className="text-[#00C9A7]" /> },
              { label: 'CARBOS', value: nutritionTargets.carbGrams, icon: <Wheat size={13} className="text-[#00C9A7]" /> },
              { label: 'GRASAS', value: nutritionTargets.fatGrams, icon: <Droplet size={13} className="text-[#00C9A7]" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex flex-col gap-2 rounded-xl bg-[#1A2D42] px-3 py-3">
                <div className="flex items-center gap-1.5">
                  {icon}
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#546880]">{label}</p>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-extrabold text-white">{value}</span>
                  <span className="text-xs font-bold text-[#00C9A7]">g</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen semanal */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#13263A] px-4 py-4">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 size={13} className="text-[#00C9A7]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00C9A7]">
              Resumen semanal
            </p>
          </div>
          <div className="grid grid-cols-3">
            {[
              {
                icon: <Dumbbell size={17} className="text-[#00C9A7]" />,
                value: weeklySummary.count > 0 ? weeklySummary.count.toString() : '—',
                label: 'Sesiones\nesta semana',
              },
              {
                icon: <Clock size={17} className="text-[#00C9A7]" />,
                value: formatDuration(weeklySummary.totalMinutes),
                label: 'Tiempo\ntotal',
              },
              {
                icon: <Activity size={17} className="text-[#00C9A7]" />,
                value: weeklySummary.totalVolume > 0 ? `${formatVolume(weeklySummary.totalVolume)} kg` : '—',
                label: 'Volumen\ntotal',
              },
            ].map(({ icon, value, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-2.5 ${
                  i < 2 ? 'border-r border-[rgba(255,255,255,0.07)]' : ''
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,201,167,0.22)] bg-[rgba(0,201,167,0.08)]">
                  {icon}
                </div>
                <span className="text-lg font-extrabold leading-none text-white">{value}</span>
                <p className="whitespace-pre-line text-center text-[10px] leading-tight text-[#546880]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Frecuencia semanal */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#13263A] px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 size={13} className="text-[#00C9A7]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00C9A7]">
                Frecuencia semanal
              </p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.16em', color: '#00C9A7' }}>
              ÚLTIMAS 8 SEMANAS
            </span>
          </div>
          <FrequencyBarsProfile sessionHistory={sessionHistory} todayIso={appContext.todayIso} />
          <button
            type="button"
            onClick={() => navigate('/metrics')}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(0,201,167,0.6)] transition-colors active:bg-[rgba(0,201,167,0.06)]"
          >
            Ver métricas completas
            <ChevronRight size={12} className="text-[rgba(0,201,167,0.6)]" />
          </button>
        </div>
      </div>

      {/* Avatar editor modal */}
      {showAvatarEditor && pendingAvatar && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-3 py-6 sm:px-6">
          <div className="absolute inset-0 bg-[rgba(4,7,18,0.78)] backdrop-blur-[4px]" onClick={closeAvatarEditor} />
          <div className="relative w-full max-w-[640px] rounded-[28px] border border-[rgba(0,201,167,0.18)] bg-[linear-gradient(180deg,rgba(28,32,48,0.98)_0%,rgba(12,15,28,0.98)_100%)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:p-6">
            <button
              onClick={closeAvatarEditor}
              type="button"
              aria-label="Cerrar editor de foto"
              className="absolute right-4 top-4 rounded-full border border-[rgba(0,201,167,0.16)] bg-[rgba(255,255,255,0.04)] p-2 text-[#C7D2E3] shadow-sm transition hover:bg-[rgba(255,255,255,0.08)]"
            >
              <X size={20} />
            </button>
            <div className="mb-5 text-center text-white">
              <h3 className="text-xl font-bold text-white sm:text-2xl">Ajustá tu foto de perfil</h3>
              <p className="mt-2 text-sm text-[#98A2B3] sm:text-[15px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Elegí el encuadre antes de guardarla.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mt-5 flex w-full justify-center">
                <div className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] border border-[rgba(0,201,167,0.12)] bg-[#0F1324] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5">
                  <div
                    className="relative mx-auto cursor-move overflow-hidden rounded-[18px] bg-[#1A2034]"
                    style={{ width: `${AVATAR_EDITOR_SIZE}px`, height: `${AVATAR_EDITOR_SIZE}px`, touchAction: 'none' }}
                    onWheel={handleAvatarWheel}
                    onPointerDown={handleAvatarPointerDown}
                    onPointerMove={handleAvatarPointerMove}
                    onPointerUp={handleAvatarPointerEnd}
                    onPointerCancel={handleAvatarPointerEnd}
                  >
                    <img
                      src={pendingAvatar.src}
                      alt="Vista previa del avatar"
                      className="pointer-events-none absolute max-w-none select-none"
                      draggable={false}
                      style={{
                        width: `${avatarDisplayWidth}px`,
                        height: `${avatarDisplayHeight}px`,
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${avatarOffsetX}px), calc(-50% + ${avatarOffsetY}px))`,
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute inset-y-0 left-0 w-[44px] bg-[rgba(7,10,18,0.74)]" />
                      <div className="absolute inset-y-0 right-0 w-[44px] bg-[rgba(7,10,18,0.74)]" />
                      <div className="absolute left-1/2 top-1/2 h-[248px] w-[248px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[rgba(0,201,167,0.95)] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_22px_rgba(0,201,167,0.18)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 w-full max-w-[560px]">
              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-[#00C9A7]">
                  <span>Zoom</span>
                  <span className="text-[#E5E7EB]">{avatarZoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.01"
                  value={avatarZoom}
                  onChange={(event) => applyAvatarZoom(Number(event.target.value), 0, 0)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#1F2937] accent-[#00C9A7]"
                />
              </label>
            </div>
            {avatarError && (
              <div className="mt-5 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B42318]">
                {avatarError}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={closeAvatarEditor}
                className="w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#161A27] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#1B2133] sm:max-w-[200px]"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={() => void saveAvatar()}
                disabled={isSavingAvatar}
                className="w-full rounded-2xl bg-[#00C9A7] px-6 py-3.5 text-base font-semibold text-[#041016] shadow-[0_0_24px_rgba(0,201,167,0.18)] transition hover:bg-[#2BF5DB] disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-[200px]"
                type="button"
              >
                {isSavingAvatar ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
