import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { activityLevelOptions } from '../data/mockData';
import { GOAL_OPTIONS } from '../data/profileInsights';
import { updateUserProfile, useUserProfile } from '../data/userProfileStore';
const trainingLevelOptions = ['Principiante', 'Intermedio', 'Avanzado'];

type ProfileFormState = {
  firstName: string;
  lastName: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
  activityLevel: string;
  trainingLevel: string;
  memberSince: string;
};

function buildFormState(profile: ReturnType<typeof useUserProfile>): ProfileFormState {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    age: profile.age,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    trainingLevel: profile.trainingLevel,
    memberSince: profile.memberSince,
  };
}

function Field({
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
      <span
        className="text-[10px] font-bold uppercase tracking-widest text-[#ADAAAA]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>
      <div className="flex items-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#131313] px-4 py-3">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-base font-medium text-white outline-none"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        />
        {suffix && <span className="text-sm font-bold text-[#12EFD3]">{suffix}</span>}
      </div>
    </label>
  );
}

export default function ProfileEditorPage() {
  const navigate = useNavigate();
  const userProfile = useUserProfile();
  const [formData, setFormData] = useState<ProfileFormState>(() => buildFormState(userProfile));

  useEffect(() => {
    setFormData(buildFormState(userProfile));
  }, [userProfile]);

  const setField = <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const saveProfile = () => {
    updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: formData.age,
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      goal: formData.goal,
      activityLevel: formData.activityLevel,
      trainingLevel: formData.trainingLevel,
      memberSince: formData.memberSince,
    });
    navigate('/profile');
  };

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title="Editar perfil" onBack={() => navigate('/profile')} />

      <div className="flex flex-col gap-6 px-5 py-5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Datos personales</h1>
          <p className="mt-1 text-sm text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Actualizá tu perfil para que GYMUP use tus datos reales en el mockeo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Nombre"
            value={formData.firstName}
            onChange={(value) => setField('firstName', value)}
          />
          <Field
            label="Apellido"
            value={formData.lastName}
            onChange={(value) => setField('lastName', value)}
          />
          <Field
            label="Edad"
            type="number"
            value={formData.age}
            onChange={(value) => setField('age', Number(value) || 0)}
            suffix="años"
          />
          <Field
            label="Miembro desde"
            value={formData.memberSince}
            onChange={(value) => setField('memberSince', value)}
          />
          <Field
            label="Altura"
            type="number"
            value={formData.heightCm}
            onChange={(value) => setField('heightCm', Number(value) || 0)}
            suffix="cm"
          />
          <Field
            label="Peso"
            type="number"
            value={formData.weightKg}
            onChange={(value) => setField('weightKg', Number(value) || 0)}
            suffix="kg"
          />
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]">
            Objetivo
          </p>
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((objective) => (
              <button
                key={objective}
                onClick={() => setField('goal', objective)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  formData.goal === objective
                    ? 'bg-[#12EFD3] text-black'
                    : 'border border-[rgba(255,255,255,0.08)] bg-[#1C2030] text-[#ADAAAA]'
                }`}
              >
                {objective}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]">
            Nivel de entrenamiento
          </p>
          <div className="flex flex-wrap gap-2">
            {trainingLevelOptions.map((level) => (
              <button
                key={level}
                onClick={() => setField('trainingLevel', level)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  formData.trainingLevel === level
                    ? 'bg-[#12EFD3] text-black'
                    : 'border border-[rgba(255,255,255,0.08)] bg-[#1C2030] text-[#ADAAAA]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#131313] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#12EFD3]">
            Nivel de actividad
          </p>
          <div className="flex flex-col gap-2">
            {activityLevelOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setField('activityLevel', option.label)}
                className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                  formData.activityLevel === option.label
                    ? 'border-[rgba(18,239,211,0.35)] bg-[rgba(18,239,211,0.12)]'
                    : 'border-[rgba(255,255,255,0.06)] bg-[#1C2030]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-white">{option.label}</span>
                  <span className="text-xs font-bold text-[#12EFD3]">Factor {option.factor}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-[#ADAAAA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={saveProfile}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#12EFD3] py-4 shadow-[0_0_15px_rgba(18,239,211,0.18)]"
        >
          <Save size={18} className="text-black" />
          <span className="text-base font-extrabold text-black">Guardar cambios</span>
        </button>
      </div>
    </div>
  );
}
