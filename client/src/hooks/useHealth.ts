import { useEffect, useState } from 'react';
import { getHealthStatus } from '../api/health';
import type { HealthStatus } from '../types/api';

type UseHealthState = {
  data: HealthStatus | null;
  error: string | null;
  loading: boolean;
};

export function useHealth() {
  const [state, setState] = useState<UseHealthState>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    async function loadHealth() {
      try {
        const data = await getHealthStatus();

        if (!active) {
          return;
        }

        setState({
          data,
          error: null,
          loading: false,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setState({
          data: null,
          error: error instanceof Error ? error.message : 'Unable to reach the API.',
          loading: false,
        });
      }
    }

    loadHealth();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
