# GYMUP — Figma AI Design Prompt

## Contexto general

Estás trabajando en **GYMUP**, una app mobile de tracking de ejercicios en el gimnasio. El diseño fue iniciado en Stitch y necesita ser extendido, corregido lógicamente y completado en Figma. Mantén siempre coherencia visual y funcional con las pantallas existentes.

---

## Identidad visual (NO modificar)

- **Paleta:** Fondo principal `#0A0D12` (negro profundo). Acento primario `#1FCFBF` / `#24DFCF` (teal/verde agua). Texto principal blanco puro. Texto secundario gris claro `#8A8F9E`. Superficies de cards `#141720` a `#1C2030`.
- **Tipografía:** Display en negrita para títulos grandes (como "Pecho y Tríceps"). UI labels en mayúsculas con tracking amplio. Números de métricas grandes y en bold.
- **Iconografía:** Mancuernas estilizadas como ícono de acción de entrenamiento. Flecha/rayo para "rápido" o "activo". Checkmarks teal para series completadas.
- **Bordes y cards:** Bordes sutiles con color teal en el lado izquierdo para indicar la card activa. Bordes redondeados (`border-radius` generoso, aprox 12–16px en cards).
- **Bottom nav:** 3 ítems — INICIO (casa), ENTRENAMIENTOS/ENTRENAR (mancuernas), PERFIL (persona). El ítem activo tiene fondo oscuro redondeado y texto teal.
- **Logo:** El logo GYMUP usa el isotipo de mancuerna en teal + tipografía "GYMUP" en blanco bold. Siempre en el header centrado o acompañado del menú hamburguesa a la izquierda y avatar/timer a la derecha.

---

## Pantallas existentes (descripción y problemas a resolver)

### 1. INICIO (Home)

**Lo que tiene:**
- Hero card de "Iniciar Entrenamiento" con sesión actual (Empuje A)
- Próximo entrenamiento (Tracción & Bíceps) con barras de músculo y avatares de ejercicios
- Resumen semanal con días L/M/X/J/V/S/D y círculos de estado
- Última sesión con volumen total y tiempo

**Problemas de lógica a resolver:**
- El botón ▶ "Iniciar Entrenamiento" debe navegar a la pantalla de sesión activa (pantalla de ejercicio). Añadir estado hover/pressed con feedback visual.
- La etiqueta "MAÑANA" junto a "Próximo entrenamiento" debe ser dinámica — puede decir HOY, MAÑANA, o el día de la semana.
- Los círculos del Resumen Semanal tienen 3 estados: ✓ verde (completado), ⚡ teal activo (sesión de hoy en curso), ○ gris (sin datos). Agregar un 4to estado: ✗ rojo (día planificado pero no completado, ya pasado).
- El card de "Última Sesión" debe ser tappable → navega a detalle de sesión histórica.
- Agregar un indicador de racha (streak) visible, ej: "🔥 3 días seguidos" debajo del resumen semanal.

**Pantallas nuevas que deben existir a partir de INICIO:**
- Al tocar el card de "Próximo entrenamiento" → ir a Preview de Rutina (ver más abajo)

---

### 2. SESIÓN ACTIVA (Workout Session)

**Lo que tiene:**
- Header con timer activo (42:15), menú hamburguesa y avatar
- Nombre de sesión "Pecho y Tríceps" con botón "Notas"
- Métricas: Volumen Total (12,450 kg) y Series Completas (14/24)
- Card de ejercicio activo: BENCH PRESS (BARRA), ejercicio 2 de 6, pecho
- Tabla de sets con columnas: SET / PREV / KG / REPS / RPE
- Botones "Añadir Serie" y "Siguiente Ejercicio"
- Banner inferior de descanso activo con countdown y botón "OMITIR"
- Botón rojo "FINALIZAR ENTRENAMIENTO" y botón de estadísticas

**Problemas de lógica a resolver:**
- **Set completado (✓ teal filled):** Al completar un set, el checkmark se llena de teal y la fila se vuelve sutil/opaca. El siguiente set se activa (resaltado).
- **Set activo:** La fila activa tiene KG y REPS editables (inputs con borde teal). El set activo debe tener el número de set en teal.
- **Set pendiente:** Fila gris, inputs deshabilitados, checkmark vacío.
- **Botón "Siguiente Ejercicio":** Avanza al ejercicio 3 de 6. El nombre y músculo del header del card cambian. La lista de sets se resetea con los datos previos cargados en la columna PREV.
- **Botón "Añadir Serie":** Agrega una fila nueva al final de la tabla con el mismo KG previo y REPS vacío.
- **Los tres puntos ⋮** en la card del ejercicio: abrir un bottom sheet con opciones: "Ver historial de este ejercicio", "Reemplazar ejercicio", "Eliminar ejercicio", "Ver instrucciones / forma correcta".
- **Botón "Notas":** Abrir un modal/bottom sheet con textarea para notas de la sesión.
- **"OMITIR" en descanso:** Cancela el timer y activa el siguiente set inmediatamente.
- **Timer de descanso:** Al completar un set, iniciar automáticamente el countdown. Debe ser configurable (el usuario puede tocar el timer para ajustar el tiempo).
- **"FINALIZAR ENTRENAMIENTO":** Navega a pantalla de Resumen Post-Sesión (nueva pantalla, ver abajo).
- **Ícono de gráfico** (junto al botón finalizar): Abre un panel lateral o modal con las estadísticas en tiempo real de la sesión actual.

**Pantallas nuevas que deben existir:**
- Bottom sheet de opciones del ejercicio
- Modal de notas de sesión
- Pantalla de Resumen Post-Sesión (ver más abajo)

---

### 3. ENTRENAMIENTOS / MIS RUTINAS

**Lo que tiene:**
- Botón "Crear Nueva Rutina" (full width, teal)
- Lista de rutinas con nombre, días/semana, barras de músculo por categoría y % completado
- Métricas globales: Volumen Total (42.5k kg) y Tiempo Semanal (5.2h)
- Tres rutinas: PPL Hypertrophy (6d), Upper/Lower Strength (4d), Full Body Functional (3d)

**Problemas de lógica a resolver:**
- **Íconos de acción en cada rutina (copiar / editar / eliminar):**
  - Copiar: Duplica la rutina con nombre "Copia de [Nombre]"
  - Editar: Navega a pantalla de edición de rutina
  - Eliminar: Muestra modal de confirmación antes de borrar
- **Tap en la card de rutina (área que no sea los íconos):** Navega a Vista Detalle de Rutina (ver abajo)
- **El acento de color lateral en cada card** indica el tipo: Teal para PPL, Púrpura para Upper/Lower, otro color para Full Body. Esto debe ser consistente.
- **Las barras de % completado** representan adherencia semanal — agregar tooltips o etiquetas que expliquen qué significa el porcentaje.
- **"3 ACTIVAS"** debe ser un badge tappable que filtre para mostrar solo rutinas activas.
- **Botón "Crear Nueva Rutina":** Navega a pantalla de creación de rutina (nueva pantalla).

**Pantallas nuevas:**
- Vista Detalle de Rutina
- Editor de Rutina (crear/editar)

---

### 4. PERFIL

**Lo que tiene:**
- Badge "ATLETA ELITE" + nombre "Marcos Davila" + fecha de membresía
- Métricas: Peso, Altura, Edad
- Cards de Nivel (Avanzado) y Objetivo (Hipertrofia)
- Progreso Mensual con barras por grupo muscular (Pecho Niv.8, Espalda Niv.7, Piernas Niv.9)
- Historial de sesiones con selector de días y lista de sesiones recientes con kcal
- Configuración: Ajustes de Cuenta, Notificaciones, Cerrar Sesión

**Problemas de lógica a resolver:**
- **Avatar/foto:** El área del avatar en el header debe ser tappable → abre selector de foto o vista de edición de perfil.
- **Cards de Nivel y Objetivo:** Tappables. Nivel → explicar sistema de niveles. Objetivo → cambiar objetivo (modal con opciones: Hipertrofia, Fuerza, Pérdida de peso, Resistencia, Mantenimiento).
- **Barras de Progreso Mensual:** Tappables por grupo muscular → navega a detalle de progreso de ese músculo con histórico de volumen.
- **Selector de días en Historial:** Los días con sesión registrada deben tener indicador visual (punto teal debajo del número). El día seleccionado tiene fondo teal. Tap en un día → filtra la lista de sesiones de abajo.
- **Cards de sesión en historial (Empuje, HIIT Cardio):** Tappables → navega a Detalle de Sesión Histórica.
- **"VER TODO" en Historial:** Navega a pantalla de historial completo con filtros.
- **Ajustes de Cuenta:** Navega a pantalla de settings (unidades kg/lb, idioma, etc.)
- **Notificaciones:** Navega a configuración de notificaciones push.
- **Cerrar Sesión:** Modal de confirmación antes de desloguear.

---

## Pantallas nuevas a diseñar (extensiones del sistema)

### A. RESUMEN POST-SESIÓN
Aparece al finalizar un entrenamiento. Debe incluir:
- Header con "¡Sesión Completada!" y confetti/animación sutil
- Duración total de la sesión
- Volumen total levantado y comparativa con sesión anterior (+/- %)
- Series completadas vs planificadas
- RPE promedio de la sesión
- Lista resumida de ejercicios con sets/reps/kg máximo
- Notas de la sesión (si se agregaron)
- Botón "Ver Estadísticas Detalladas"
- Botón "Volver al Inicio" (prominente, teal)

### B. VISTA DETALLE DE RUTINA
Pantalla que muestra el contenido de una rutina específica:
- Nombre de rutina, días/semana, descripción breve
- Tabs o secciones por día (ej: Empuje A / Empuje B / Tirón A / Tirón B / Piernas)
- Lista de ejercicios por día con: nombre, series × reps objetivo, grupo muscular
- Botón "Iniciar esta Sesión" (prominente)
- Botón "Editar Rutina"

### C. EDITOR DE RUTINA (Crear / Editar)
Pantalla para crear o modificar una rutina:
- Campo de nombre de la rutina
- Selector de frecuencia (días por semana)
- Secciones/días colapsables y expandibles
- En cada día: lista de ejercicios con campos de series × reps y botón para agregar ejercicio
- Buscador de ejercicios con filtro por músculo
- Botón "Guardar Rutina" al final

### D. DETALLE DE SESIÓN HISTÓRICA
Pantalla de revisión de una sesión pasada:
- Fecha, duración, volumen total
- Lista de ejercicios con todos los sets registrados (KG × Reps, con RPE si fue registrado)
- Comparativa con la sesión anterior del mismo ejercicio
- Gráfico simple de volumen por ejercicio

### E. PANTALLA DE PROGRESO DE MÚSCULO (desde Perfil)
- Nombre del grupo muscular (ej: Pecho)
- Nivel actual con barra de XP y qué falta para el siguiente nivel
- Gráfico de volumen semanal de las últimas 8 semanas
- Ejercicios principales para ese músculo con record personal (PR)

---

## Flujo de navegación completo

```
INICIO
├── [tap ▶ Iniciar] → SESIÓN ACTIVA
│     ├── [⋮ ejercicio] → Bottom Sheet opciones
│     ├── [Notas] → Modal notas
│     ├── [Siguiente Ejercicio] → mismo screen, ejercicio cambia
│     └── [Finalizar] → RESUMEN POST-SESIÓN → INICIO
├── [tap Próximo Entrenamiento] → VISTA DETALLE DE RUTINA
└── [tap card Última Sesión] → DETALLE DE SESIÓN HISTÓRICA

ENTRENAMIENTOS
├── [tap Crear Nueva Rutina] → EDITOR DE RUTINA (modo crear)
├── [tap card rutina] → VISTA DETALLE DE RUTINA
│     └── [tap Iniciar] → SESIÓN ACTIVA
└── [ícono editar] → EDITOR DE RUTINA (modo editar)

PERFIL
├── [tap avatar] → Editar foto de perfil
├── [tap Objetivo] → Modal cambio de objetivo
├── [tap barra músculo] → PROGRESO DE MÚSCULO
├── [tap sesión historial] → DETALLE DE SESIÓN HISTÓRICA
└── [VER TODO historial] → HISTORIAL COMPLETO
```

---

## Reglas de diseño a mantener en pantallas nuevas

1. Siempre fondo `#0A0D12`. Cards sobre `#141720`.
2. Acento teal `#1FCFBF` para elementos activos, CTAs primarios, y estados seleccionados.
3. Botones primarios: fondo teal, texto negro bold. Botones secundarios: fondo `#1C2030`, texto blanco.
4. Botón destructivo (Finalizar entrenamiento, Cerrar sesión, Eliminar): fondo rojo `#E53935`, texto blanco.
5. Bottom sheets con handle bar visible, fondo `#1C2030`, bordes redondeados en la parte superior.
6. Modales con overlay oscuro semitransparente, card modal centrada con bordes redondeados.
7. Inputs con borde teal cuando están activos, borde gris sutil en estado normal.
8. Siempre incluir el bottom nav con los 3 ítems, marcando el activo.
9. El logo GYMUP aparece en todos los headers.
10. Usar el isotipo (mancuerna teal) como ícono de la app y en cargando/splash screen.