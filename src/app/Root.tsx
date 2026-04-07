import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ActiveWorkoutDock } from './components/ActiveWorkoutDock';
import { BottomNav } from './components/BottomNav';
import { useAppData } from './data/AppDataContext';

const HIDE_NAV_PATHS = ['/session', '/post-session'];

export default function Root() {
  const location = useLocation();
  const { activeWorkout, appSettings, status, error, refreshAppData } = useAppData();
  const hideNav = HIDE_NAV_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));
  const showActiveWorkoutDock = !hideNav && status === 'ready' && Boolean(activeWorkout);
  const isLightMode = appSettings.theme === 'light';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', appSettings.theme === 'dark');
  }, [appSettings.theme]);

  return (
    <div
      className={`gymup-stage min-h-screen flex items-center justify-center ${isLightMode ? 'gymup-light-stage' : ''}`}
    >
      <div
        className={`gymup-shell relative flex flex-col ${isLightMode ? 'gymup-light-mode' : ''}`}
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100dvh',
          maxHeight: '100dvh',
          overflow: 'hidden',
        }}
      >
        {status === 'loading' ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-[#ADAAAA]">
            Cargando tus datos reales...
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-[#ADAAAA]">{error ?? 'No se pudo cargar la app.'}</p>
            <button
              onClick={() => void refreshAppData()}
              className="rounded-2xl bg-[#12EFD3] px-5 py-3 text-sm font-bold text-black"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
            style={{ paddingBottom: showActiveWorkoutDock ? '7.25rem' : undefined }}
          >
            <Outlet />
          </div>
        )}

        {showActiveWorkoutDock && <ActiveWorkoutDock />}
        {!hideNav && status === 'ready' && <BottomNav />}
      </div>
    </div>
  );
}
