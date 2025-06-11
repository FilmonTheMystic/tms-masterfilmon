// lib/hooks/useClientOnly.ts - Fix hydration mismatch

import { useState, useEffect } from 'react';

export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}