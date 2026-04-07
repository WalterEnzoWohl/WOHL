import type { ActivityLevelOption, MuscleGroupRecord } from './models';

export const ACTIVITY_LEVEL_OPTIONS: ActivityLevelOption[] = [
  {
    label: 'Sedentario',
    factor: 1.2,
    description: 'Poco o nada de ejercicio, tipico de trabajo de oficina y muy poco movimiento diario.',
  },
  {
    label: 'Actividad ligera',
    factor: 1.375,
    description: 'Entrenamiento 1 a 3 dias por semana, con caminatas suaves o gimnasio ocasional.',
  },
  {
    label: 'Actividad moderada',
    factor: 1.55,
    description: 'Entrenamiento regular 3 a 5 dias por semana, como un esquema de gym 4 dias.',
  },
  {
    label: 'Actividad intensa',
    factor: 1.725,
    description: 'Entrenamiento exigente 6 a 7 dias por semana.',
  },
  {
    label: 'Muy intensa / atleta',
    factor: 1.9,
    description: 'Trabajo fisico fuerte y entrenamiento doble o de nivel atletico.',
  },
];

export const MUSCLE_GROUPS: MuscleGroupRecord[] = [
  {
    id: 'pecho',
    name: 'Pecho',
    color: '#12EFD3',
    exercises: [
      { name: 'Press banca', pr: 100, unit: 'kg' },
      { name: 'Press inclinado', pr: 36, unit: 'kg' },
      { name: 'Fondos en paralelas', pr: 20, unit: 'kg' },
    ],
  },
  {
    id: 'espalda',
    name: 'Espalda',
    color: '#12EFD3',
    exercises: [
      { name: 'Jalon al pecho', pr: 80, unit: 'kg' },
      { name: 'Remo horizontal', pr: 75, unit: 'kg' },
      { name: 'Remo bajo cerrado', pr: 75, unit: 'kg' },
    ],
  },
  {
    id: 'piernas',
    name: 'Piernas',
    color: '#12EFD3',
    exercises: [
      { name: 'Sentadilla libre', pr: 100, unit: 'kg' },
      { name: 'Hack squat', pr: 160, unit: 'kg' },
      { name: 'Hip thrust', pr: 140, unit: 'kg' },
    ],
  },
  {
    id: 'hombros',
    name: 'Hombros',
    color: '#12EFD3',
    exercises: [
      { name: 'Posteriores (reverse pec deck)', pr: 45, unit: 'kg' },
      { name: 'Elevacion lateral', pr: 12, unit: 'kg' },
      { name: 'Press inclinado', pr: 36, unit: 'kg' },
    ],
  },
  {
    id: 'brazos',
    name: 'Brazos',
    color: '#12EFD3',
    exercises: [
      { name: 'Polea alta con barra V', pr: 42.5, unit: 'kg' },
      { name: 'Curl martillo', pr: 20, unit: 'kg' },
      { name: 'Curl predicador martillo', pr: 18, unit: 'kg' },
    ],
  },
];

export const TRAINING_LEVEL_OPTIONS = ['Principiante', 'Intermedio', 'Avanzado'] as const;
