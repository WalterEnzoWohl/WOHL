import { useEffect, useState } from 'react';
import { loadProgramTemplates } from '@/features/routines/lib/programTemplates';
import type { ProgramTemplate } from '@/features/routines/lib/programTemplates';

export function useProgramTemplates() {
  const [templates, setTemplates] = useState<ProgramTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadProgramTemplates()
      .then((programs) => {
        if (cancelled) return;
        setTemplates(programs);
        setError(null);
      })
      .catch((loadError) => {
        if (cancelled) return;
        setTemplates([]);
        setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar los programas.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { templates, isLoading, error };
}
