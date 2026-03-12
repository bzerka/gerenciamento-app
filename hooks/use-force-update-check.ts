import { useEffect, useState } from 'react';
import { checkForceUpdate, type ForceUpdateResult } from '@/src/utils/version';

export type ForceUpdateStatus =
  | { status: 'checking' }
  | { status: 'required' }
  | { status: 'ok' };

/**
 * Executa checkForceUpdate uma vez na montagem e retorna o estado.
 * Usado pelo VersionGate no root layout.
 */
export function useForceUpdateCheck(): ForceUpdateStatus {
  const [state, setState] = useState<ForceUpdateStatus>({ status: 'checking' });

  useEffect(() => {
    let cancelled = false;

    checkForceUpdate().then((result: ForceUpdateResult) => {
      if (cancelled) return;
      setState(result.required ? { status: 'required' } : { status: 'ok' });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
