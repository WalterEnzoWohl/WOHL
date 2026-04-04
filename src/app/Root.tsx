import { Outlet, useLocation } from 'react-router';
import { BottomNav } from './components/BottomNav';

const HIDE_NAV_PATHS = ['/session', '/post-session'];

export default function Root() {
  const location = useLocation();
  const hideNav = HIDE_NAV_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#050710' }}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: '390px',
          height: '100dvh',
          maxHeight: '844px',
          background: '#0A0D12',
          overflow: 'hidden',
        }}
      >
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <Outlet />
        </div>

        {/* Bottom navigation */}
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}