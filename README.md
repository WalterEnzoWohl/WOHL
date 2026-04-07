# GYMUP

GYMUP es una web app para tracking de entrenamientos de gimnasio, armada con React + Vite.

## Scripts

- `npm install`: instala dependencias
- `npm run dev`: levanta el entorno de desarrollo y abre el proyecto en el navegador
- `npm run build`: genera el build de producción
- `npm run typecheck`: corre chequeo de tipos con TypeScript

## Supabase

La app ya incluye la dependencia `@supabase/supabase-js` y un cliente base en [src/app/lib/supabase.ts](/C:/Users/20432013953/Desktop/GymUP/src/app/lib/supabase.ts).

Para activar la integración real:

1. Copiá `.env.example` a `.env.local`
2. Completá estas variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Ejecutá en el SQL Editor de Supabase el archivo [20260406_initial_schema.sql](/C:/Users/20432013953/Desktop/GymUP/supabase/migrations/20260406_initial_schema.sql)

No hace falta usar la contraseña de la base de datos en el frontend.
