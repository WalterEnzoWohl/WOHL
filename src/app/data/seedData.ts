import { ACTIVITY_LEVEL_OPTIONS } from './constants';
import type { Routine, UserProfile } from './models';

const DEFAULT_ACTIVITY_LEVEL = ACTIVITY_LEVEL_OPTIONS[0];

export const DEFAULT_USER_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  fullName: 'Tu perfil',
  age: 0,
  heightCm: 0,
  weightKg: 0,
  goal: 'Mantenimiento',
  activityLevel: DEFAULT_ACTIVITY_LEVEL.label,
  activityFactor: DEFAULT_ACTIVITY_LEVEL.factor,
  activityDescription: DEFAULT_ACTIVITY_LEVEL.description,
  trainingLevel: 'Principiante',
  memberSince: '',
  activeRoutineId: null,
};

export const DEFAULT_ROUTINES: Routine[] = [];
