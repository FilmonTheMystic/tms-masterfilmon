// components/ClientOnly.tsx - Wrapper for client-side only components

'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Example usage in your components:
/*
import { ClientOnly } from '@/components/ClientOnly';

export function SomeComponent() {
  return (
    <div>
      <h1>This renders on server and client</h1>
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>This only renders on client: {new Date().toLocaleString()}</div>
      </ClientOnly>
    </div>
  );
}
*/