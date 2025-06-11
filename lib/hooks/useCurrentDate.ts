import { useEffect, useState } from "react";
import { useClientOnly } from "./useClientsOnly";

// lib/hooks/useCurrentDate.ts - Consistent date handling
export function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const isClient = useClientOnly();

  useEffect(() => {
    if (isClient) {
      setCurrentDate(new Date());
    }
  }, [isClient]);

  // Return a consistent date for SSR
  return currentDate || new Date('2025-06-11T00:00:00.000Z');
}