import { routines as mockRoutines, userProfile as mockUserProfile } from './mockData';
import { repairEncodingValue } from './encoding';
import type { Routine, UserProfile } from './models';

const repairedProfile = repairEncodingValue(mockUserProfile) as UserProfile;
const repairedRoutines = repairEncodingValue(mockRoutines) as Routine[];

export const DEFAULT_USER_PROFILE: UserProfile = {
  ...repairedProfile,
  goal: 'Definición',
  activityLevel: 'Actividad moderada',
  activityFactor: 1.55,
  activityDescription: 'Entrenamiento regular 3 a 5 dias por semana, como un esquema de gym 4 dias.',
};

export const DEFAULT_ROUTINES: Routine[] = repairedRoutines;
