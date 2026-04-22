# WOHL – Guía de contexto para Claude Code

App mobile-first de fitness: planificación de rutinas + registro de sesiones + seguimiento de progreso. No es red social ni app de contenido.

- **Deploy:** Vercel (frontend) + Supabase (DB + auth)
- **Estado:** Prototipo funcional, en desarrollo activo

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18.3 + Vite 6.3 + TypeScript 5.9 |
| Estilos | Tailwind CSS v4 + tw-animate-css |
| Animaciones | Motion (Framer Motion v12) |
| Routing | React Router v7 (`createBrowserRouter`) |
| Drag & drop | react-dnd + react-dnd-touch-backend |
| Gráficos | Recharts |
| Iconos | lucide-react 0.487 |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deploy | Vercel SPA (rewrites en vercel.json) |

No hay backend propio. El alias `@/` apunta a `src/`.

---

## Estructura src/

```
src/
├── app/
│   ├── App.tsx                   # RouterProvider + AppSetupScreen (auth gate)
│   ├── Root.tsx                  # Layout shell: guards, BottomNav, ActiveWorkoutDock
│   └── routes.tsx                # Todas las rutas lazy-loaded
├── assets/                       # SVGs del logo
├── core/
│   ├── app-data/AppDataContext.tsx   # Único provider global de estado
│   ├── domain/
│   │   ├── profileInsights.ts        # Harris-Benedict, muscle progress insights
│   │   └── seedData.ts               # Defaults para usuarios nuevos
│   └── repositories/supabaseRepository.ts  # Toda la lógica Supabase (única fuente)
├── features/
│   ├── auth/          # AuthScreen, ChangePasswordPage
│   ├── exercises/     # Catálogo: ExerciseCatalogPage, ExerciseExplorePage, ExerciseDetailSheet
│   │                  # hooks/useExerciseCatalog.ts · lib/exerciseCatalog.ts · types.ts
│   ├── history/       # HistoryPage, SessionHistoryPage, MuscleProgressPage
│   ├── home/          # HomePage (dashboard)
│   ├── onboarding/    # OnboardingPage, WheelPickers, onboardingConfig
│   ├── profile/       # ProfilePage, ProfileEditorPage, UserAvatar
│   ├── routines/      # WorkoutsPage, RoutineDetailPage, RoutineEditorPage, ProgramTemplatesPage
│   │                  # hooks/useProgramTemplates.ts · lib/programTemplates.ts
│   ├── session/       # TrainingSessionPage, PostSessionPage, TrainingExerciseCard
│   │                  # lib/sessionDrafts.ts (helpers de borrador activo)
│   └── settings/      # ConfigPage, HelpCenterPage, SupportContactPage, TermsPage
├── shared/
│   ├── components/layout/  # Header, BottomNav, ActiveWorkoutDock, ActiveWorkoutEditLockModal, AppSetupScreen
│   ├── constants/index.ts
│   ├── lib/
│   │   ├── supabase.ts          # Cliente singleton
│   │   ├── appSettings.ts       # Defaults + merge de AppSettings
│   │   ├── dateUtils.ts         # buildAppContext, buildWeekDayStatus, buildHistoryCalendar
│   │   ├── unitUtils.ts         # Conversión kg ↔ lb, formatters
│   │   └── userProfileUtils.ts  # hasCompletedOnboarding, getUserFirstName
│   └── types/models.ts          # Todos los tipos del dominio
├── styles/                       # index.css, tailwind.css, theme.css, fonts.css
└── main.tsx
```

Datos del catálogo de ejercicios en `wohl_data_excercise/` (public de Vite, cargado en runtime via `loadExerciseCatalog()`).

---

## Modelo de datos

```
Usuario → Rutinas (1 activa) → Días → Ejercicios planificados (sets, kg, reps)
                                           ↓
                                    Sesiones ejecutadas → Sets reales (kg, reps, RPE)
```

**Reglas clave:**
- Una sola rutina activa por usuario
- Plan (rutina) y ejecución (sesión) están **separados** — editar una rutina no rompe historial
- `volume` = suma de `kg × reps` por sesión
- Hay temporizador de descanso integrado al flujo de entrenamiento

---

## Arquitectura global

### AppDataContext
Único provider global (`src/core/app-data/AppDataContext.tsx`). Nunca importar Supabase directamente en componentes.

**Estado expuesto:** `status`, `error`, `userProfile`, `routines`, `sessionHistory`, `appContext`, `weekDays`, `historyDays`, `appSettings`, `activeWorkout`

**Acciones:** `refreshAppData`, `updateUserProfile`, `updateProfileAvatar`, `updateAppSettings`, `setActiveRoutine`, `saveRoutine`, `copyRoutine`, `deleteRoutine`, `completeSession`, `updateSession`, `deleteSession`, `saveActiveWorkout`, `clearActiveWorkout`

### Root (`src/app/Root.tsx`)
- Guard de onboarding → redirige a `/onboarding` si `!hasCompletedOnboarding`
- Nav oculto en `/session`, `/post-session`, `/onboarding`, `/exercise-catalog`, `/exercise-explore`, rutas de edición de rutina
- Tema claro/oscuro via clase `dark` en `documentElement`
- Redirect a `/session` al iniciar si hay `activeWorkout` (solo una vez, con `useRef`)

### localStorage (por userId)
- `wohl.activeWorkout.<userId>` → `ActiveWorkoutDraft`
- `wohl.appSettings.<userId>` → `AppSettings`

### AppSettings (defaults)
```ts
{ weightUnit: 'kg', theme: 'dark', soundsEnabled: true, vibrationEnabled: true,
  restTimerSeconds: 90, autoWeightIncrement: false, showPreviousWeight: true, notifyGymDays: false }
```

---

## Rutas

| Ruta | Página |
|---|---|
| `/` | HomePage |
| `/session` | TrainingSessionPage |
| `/post-session` | PostSessionPage |
| `/workouts` | WorkoutsPage |
| `/profile` | ProfilePage |
| `/profile/edit` | ProfileEditorPage |
| `/onboarding` | OnboardingPage |
| `/config` | ConfigPage |
| `/config/password` | ChangePasswordPage |
| `/config/help` | HelpCenterPage |
| `/config/support` | SupportContactPage |
| `/config/terms` | TermsPage |
| `/routine/new` | RoutineDetailPage |
| `/routine/:id/edit` | RoutineDetailPage |
| `/routine/:id` | RoutineDetailPage |
| `/session-history/:id` | SessionHistoryPage |
| `/muscle-progress/:id` | MuscleProgressPage |
| `/history` | HistoryPage |
| `/exercise-catalog` | ExerciseCatalogPage |
| `/exercise-explore` | ExerciseExplorePage |
| `/program-templates` | ProgramTemplatesPage |

---

## Schema de Supabase

### Tablas

| Tabla | Columnas clave |
|---|---|
| `profiles` | `id` (=auth.uid), `active_routine_id`, `gender`, `birth_date`, `height_cm`, `weight_kg`, `goal`, `activity_level`, `training_level`, `preferred_training_days` (JSONB), `onboarding_completed_at`, `avatar_path` |
| `routines` | `id`, `owner_id`, `name`, `days_per_week`, `color`, `categories` (JSONB), `avg_minutes` |
| `routine_days` | `id`, `routine_id`, `position`, `name`, `focus`, `description` |
| `routine_day_exercises` | `id`, `routine_day_id`, `position`, `name`, `muscle`, `implement`, `secondary_muscles` (text[]), `sets_json` (JSONB), `exercise_slug` |
| `workout_sessions` | `id`, `owner_id`, `routine_id`, `session_date`, `day_name`, `duration_seconds`, `volume`, `avg_rpe`, `session_focus` |
| `workout_session_exercises` | `id`, `workout_session_id`, `position`, `name`, `muscle`, `max_kg`, `exercise_slug` |
| `workout_session_sets` | `id`, `workout_session_exercise_id`, `position`, `kg`, `reps`, `rpe` |

- RLS habilitado en todas las tablas (`auth.uid()` vs `owner_id` / `id`)
- Storage bucket `profile-avatars` (público, 3 MB, jpg/png/webp)
- `sets_json` = plan de sets JSONB; `categories` = `[{ name, percentage, color }]`

### Migraciones aplicadas
| Archivo | Qué agrega |
|---|---|
| `20260406_initial_schema.sql` | Schema completo + RLS + triggers updated_at |
| `20260409_onboarding_profile_fields.sql` | Campos de onboarding en `profiles` |
| `20260409_profile_avatars.sql` | Avatar path + storage bucket |
| `20260412_add_exercise_slug_references.sql` | `exercise_slug` en ejercicios de rutina y sesión |

---

## Catálogo de ejercicios

- Fuente: `/exercises.json` (en `wohl_data_excercise/`, público)
- Cargado por `loadExerciseCatalog(locale)` en `src/features/exercises/lib/exerciseCatalog.ts` (promesa memoizada)
- Hook: `useExerciseCatalog()` → `{ catalog, isLoading, error }`
- Los ejercicios del catálogo se vinculan a rutinas/sesiones por `exerciseSlug`
- `buildExerciseTemplateFromCatalog(entry)` convierte catálogo → `ExerciseData` para agregar a rutinas

---

## Identidad visual

- **Tema:** oscuro (modo claro disponible pero no es el foco)
- **Paleta:** azul profundo `#0B1F33` / `#13263A` + turquesa `#00C9A7` para acciones + `#7F98FF` para secundario
- Tarjetas grandes, bordes redondeados (`rounded-2xl` / `rounded-3xl`), chips, bottom nav
- Glow en estados activos: `shadow-[0_0_15px_rgba(0,201,167,0.4)]`

**No romper la identidad visual sin motivo explícito.**

---

## Convenciones

- TypeScript estricto — no usar `any`
- Componentes: PascalCase · Hooks: prefijo `use`
- Todo acceso a Supabase pasa por `supabaseRepository.ts`
- Env vars: prefijo `VITE_` en frontend — nunca commitear `.env`
- Comandos: `npm run dev` · `npm run build` · `npm run typecheck`

---

## Lo que NO hacer

- No instalar librerías nuevas sin preguntar
- No cambiar schema de Supabase sin mostrar la migración primero
- No tocar la separación plan/ejecución (corazón del modelo de datos)
- No eliminar métricas de progreso de la UI
- No cambiar el tema base a claro

---

## Problemas conocidos

- Capa nutricional aislada del resto del tracking
- Progreso muscular mensual simplificado
- Lógica de auto-incremento de peso sin reglas visibles
