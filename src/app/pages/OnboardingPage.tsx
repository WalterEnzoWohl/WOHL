import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Ruler,
  Scale,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { brandLogoWhite } from '@/assets';
import { ACTIVITY_LEVEL_OPTIONS, TRAINING_LEVEL_OPTIONS } from '../data/constants';
import { useAppData } from '../data/AppDataContext';
import { GOAL_OPTIONS } from '../data/profileInsights';

type OnboardingFormState = {
  firstName: string;
  lastName: string;
  trainingLevel: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
  activityLevel: string;
};

function ProgressDots({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const active = index <= currentStep;
        return (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${active ? 'bg-[#12EFD3]' : 'bg-white/10'}`}
            style={{ width: active && index === currentStep ? 32 : 16 }}
          />
        );
      })}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  suffix,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#12EFD3]">{label}</span>
      <div className="flex items-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#131722] px-4 py-3.5">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-base font-semibold text-white outline-none"
          inputMode={type === 'number' ? 'numeric' : undefined}
        />
        {suffix ? <span className="text-sm font-bold text-[#12EFD3]">{suffix}</span> : null}
      </div>
    </label>
  );
}

function HeroGraphic() {
  return (
    <div className="relative mx-auto h-48 w-full max-w-[300px]">
      <div className="absolute inset-x-10 bottom-2 h-24 rounded-full bg-[radial-gradient(circle,rgba(18,239,211,0.2)_0%,rgba(18,239,211,0)_72%)] blur-2xl" />
      <div className="absolute left-4 top-4 flex flex-col gap-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-xl border border-[rgba(18,239,211,0.12)] bg-[#161A27] px-3 py-2 shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
            style={{ transform: `translateX(${item * 10}px)` }}
          >
            <div className="h-2 w-2 rounded-full bg-[#12EFD3]" />
            <div className="h-2 w-20 rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
        {[28, 42, 56, 78, 108].map((height, index) => (
          <div
            key={index}
            className="w-8 rounded-t-xl bg-[linear-gradient(180deg,rgba(18,239,211,0.9)_0%,rgba(18,239,211,0.18)_100%)]"
            style={{ height }}
          />
        ))}
      </div>

      <div className="absolute right-2 top-2 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(18,239,211,0.28)] bg-[rgba(18,239,211,0.12)] shadow-[0_0_24px_rgba(18,239,211,0.2)]">
        <Target size={28} className="text-[#12EFD3]" />
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 280 176" fill="none" aria-hidden="true">
        <path
          d="M40 128C82 120 104 116 132 98C162 79 190 58 236 42"
          stroke="#12EFD3"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateUserProfile, userProfile } = useAppData();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormState>({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    trainingLevel: userProfile.trainingLevel,
    age: userProfile.age,
    heightCm: userProfile.heightCm,
    weightKg: userProfile.weightKg,
    goal: userProfile.goal,
    activityLevel: userProfile.activityLevel,
  });

  const totalSteps = 4;

  const canContinue = useMemo(() => {
    if (step === 0) {
      return formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0;
    }

    if (step === 1) {
      return formData.age > 0 && formData.heightCm > 0 && formData.weightKg > 0;
    }

    return true;
  }, [formData, step]);

  const setField = <K extends keyof OnboardingFormState>(field: K, value: OnboardingFormState[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const goNext = () => {
    if (!canContinue || step === totalSteps - 1) {
      return;
    }

    setStep((previous) => previous + 1);
  };

  const goBack = () => {
    if (step === 0) {
      return;
    }

    setStep((previous) => previous - 1);
  };

  const completeOnboarding = async (destination: 'routine' | 'home') => {
    setSaving(true);

    try {
      await updateUserProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age,
        heightCm: formData.heightCm,
        weightKg: formData.weightKg,
        goal: formData.goal,
        activityLevel: formData.activityLevel,
        trainingLevel: formData.trainingLevel,
      });

      navigate(destination === 'routine' ? '/routine-editor/new' : '/', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-[radial-gradient(circle_at_top,rgba(18,239,211,0.16),transparent_34%),linear-gradient(180deg,#060913_0%,#0B0F19_100%)] px-5 py-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={goBack}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] transition-opacity ${
            step === 0 ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          type="button"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="flex items-center gap-3">
          <img src={brandLogoWhite} alt="GYMUP" className="h-8 w-auto object-contain" />
          <span className="text-sm font-bold uppercase tracking-[0.24em] text-[#12EFD3]">
            Onboarding
          </span>
        </div>

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#98A2B3]">
          {step + 1}/{totalSteps}
        </span>
      </div>

      <ProgressDots currentStep={step} totalSteps={totalSteps} />

      <div className="flex-1 pt-6">
        {step === 0 && (
          <div className="flex h-full flex-col">
            <HeroGraphic />
            <div className="mt-6 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Construyamos tu perfil real</h1>
              <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">
                GYMUP va a usar tus datos, tu objetivo y tu nivel actual para personalizar entrenamientos, progreso y recomendaciones.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <InputField
                label="Nombre"
                value={formData.firstName}
                onChange={(value) => setField('firstName', value)}
              />
              <InputField
                label="Apellido"
                value={formData.lastName}
                onChange={(value) => setField('lastName', value)}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#111522] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Dumbbell size={16} className="text-[#12EFD3]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#12EFD3]">
                  Nivel actual
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRAINING_LEVEL_OPTIONS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setField('trainingLevel', level)}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                      formData.trainingLevel === level
                        ? 'bg-[#12EFD3] text-black'
                        : 'border border-[rgba(255,255,255,0.08)] bg-[#1B2233] text-[#C7D2E3]'
                    }`}
                    type="button"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: 'Objetivo', value: formData.goal },
                { label: 'Nivel', value: formData.trainingLevel },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#111522] px-4 py-3"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#98A2B3]">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex h-full flex-col">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#12EFD3]">Datos fisicos</span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Contame de ti</h1>
              <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">
                Estos datos ayudan a calcular progreso, volumen, calorias y referencias de entrenamiento de forma mas precisa.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4">
              <InputField
                label="Edad"
                type="number"
                value={formData.age || ''}
                onChange={(value) => setField('age', Number(value) || 0)}
                suffix="años"
              />
              <InputField
                label="Altura"
                type="number"
                value={formData.heightCm || ''}
                onChange={(value) => setField('heightCm', Number(value) || 0)}
                suffix="cm"
              />
              <InputField
                label="Peso actual"
                type="number"
                value={formData.weightKg || ''}
                onChange={(value) => setField('weightKg', Number(value) || 0)}
                suffix="kg"
              />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: <UserRound size={18} className="text-[#12EFD3]" />, label: 'Edad' },
                { icon: <Ruler size={18} className="text-[#12EFD3]" />, label: 'Altura' },
                { icon: <Scale size={18} className="text-[#12EFD3]" />, label: 'Peso' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#111522] p-4">
                  <div className="mb-3">{item.icon}</div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex h-full flex-col">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#12EFD3]">Objetivo</span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Ahora definamos tu enfoque</h1>
              <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">
                Esto nos ayuda a mostrar recomendaciones mas utiles y ajustar mejor la experiencia dentro de la app.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#111522] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Target size={16} className="text-[#12EFD3]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#12EFD3]">
                  Tu objetivo principal
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {GOAL_OPTIONS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setField('goal', goal)}
                    className={`rounded-2xl px-4 py-4 text-left text-sm font-bold uppercase tracking-[0.14em] transition-all ${
                      formData.goal === goal
                        ? 'bg-[#12EFD3] text-black'
                        : 'border border-[rgba(255,255,255,0.08)] bg-[#1B2233] text-[#D1D9E6]'
                    }`}
                    type="button"
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#111522] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Flame size={16} className="text-[#12EFD3]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#12EFD3]">
                  Nivel de actividad
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {ACTIVITY_LEVEL_OPTIONS.map((activity) => {
                  const selected = formData.activityLevel === activity.label;

                  return (
                    <button
                      key={activity.label}
                      onClick={() => setField('activityLevel', activity.label)}
                      className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                        selected
                          ? 'border-[rgba(18,239,211,0.32)] bg-[rgba(18,239,211,0.12)]'
                          : 'border-[rgba(255,255,255,0.06)] bg-[#1B2233]'
                      }`}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-white">{activity.label}</span>
                        <span className="text-xs font-bold text-[#12EFD3]">Factor {activity.factor}</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#A7B0C0]">{activity.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex h-full flex-col">
            <HeroGraphic />
            <div className="mt-6 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Tu perfil ya esta listo</h1>
              <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">
                Con esta base ya puedes empezar a crear rutinas, guardar sesiones y usar GYMUP como una cuenta totalmente propia.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {[
                { icon: <UserRound size={16} className="text-[#12EFD3]" />, label: 'Perfil', value: `${formData.firstName} ${formData.lastName}`.trim() },
                { icon: <Target size={16} className="text-[#12EFD3]" />, label: 'Objetivo', value: formData.goal },
                { icon: <Dumbbell size={16} className="text-[#12EFD3]" />, label: 'Nivel', value: formData.trainingLevel },
                { icon: <Flame size={16} className="text-[#12EFD3]" />, label: 'Actividad', value: formData.activityLevel },
                {
                  icon: <Sparkles size={16} className="text-[#12EFD3]" />,
                  label: 'Estado actual',
                  value: `${formData.weightKg} kg - ${formData.heightCm} cm - ${formData.age} años`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#111522] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(18,239,211,0.1)]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#98A2B3]">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-[rgba(18,239,211,0.16)] bg-[linear-gradient(180deg,rgba(18,239,211,0.14)_0%,rgba(18,239,211,0.05)_100%)] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#12EFD3]">
                Entrenamiento personalizado
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                Vas a poder completar tus datos, crear rutinas a medida y guardar cada sesion real desde el primer dia.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-5">
        {step < totalSteps - 1 ? (
          <button
            onClick={goNext}
            disabled={!canContinue}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#12EFD3] py-4 font-extrabold text-black transition-colors disabled:cursor-not-allowed disabled:opacity-40 active:bg-[#0DBDA7]"
            type="button"
          >
            Continuar
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => void completeOnboarding('routine')}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#12EFD3] py-4 font-extrabold text-black transition-colors disabled:cursor-not-allowed disabled:opacity-40 active:bg-[#0DBDA7]"
              type="button"
            >
              Crear mi primera rutina
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => void completeOnboarding('home')}
              disabled={saving}
              className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#131722] py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 active:bg-[#1A2030]"
              type="button"
            >
              Ir al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
