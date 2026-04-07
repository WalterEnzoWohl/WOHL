import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { RouterProvider } from 'react-router';
import { AppDataProvider } from './data/AppDataContext';
import { router } from './routes';
import { AuthScreen } from './components/AuthScreen';
import { AppSetupScreen } from './components/AppSetupScreen';
import { getSupabaseClient, isSupabaseConfigured } from './lib/supabase';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050710] px-5">
      <div className="rounded-[32px] border border-[rgba(18,239,211,0.12)] bg-[#0A0D12] px-8 py-6 text-center text-white">
        Cargando GYMUP...
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const client = getSupabaseClient();

    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return <AppSetupScreen />;
  }

  if (!authReady) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <AppDataProvider session={session}>
      <RouterProvider router={router} />
    </AppDataProvider>
  );
}
