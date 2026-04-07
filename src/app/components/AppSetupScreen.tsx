export function AppSetupScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050710] px-5">
      <div className="w-full max-w-[460px] rounded-[32px] border border-[rgba(18,239,211,0.12)] bg-[#0A0D12] p-6 text-center shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">GYMUP necesita Supabase</h1>
        <p className="mt-3 text-sm leading-6 text-[#ADAAAA]">
          Configura <code className="text-white">VITE_SUPABASE_URL</code> y{' '}
          <code className="text-white">VITE_SUPABASE_ANON_KEY</code> en{' '}
          <code className="text-white">.env.local</code> para activar la integracion real.
        </p>
      </div>
    </div>
  );
}
