import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)
}

export function formatDate(date: Date | string | any): string {
  let dateObj: Date;
  
  // Handle undefined or null
  if (!date || date === undefined || date === null) {
    return 'Date not available';
  }
  
  // Handle Firestore Timestamp
  if (typeof date === 'object' && date.toDate && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  }
  // Handle Firestore object format with seconds and nanoseconds
  else if (typeof date === 'object' && typeof date.seconds === 'number') {
    dateObj = new Date(date.seconds * 1000 + (date.nanoseconds || 0) / 1000000);
  }
  // Handle Firestore object format with _seconds
  else if (typeof date === 'object' && typeof date._seconds === 'number') {
    dateObj = new Date(date._seconds * 1000);
  }
  // Handle string
  else if (typeof date === 'string') {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return 'Invalid date';
    }
    dateObj = parsed;
  }
  // Handle Date object
  else if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    dateObj = date;
  }
  // Handle number (timestamp)
  else if (typeof date === 'number') {
    dateObj = new Date(date);
  }
  // Fallback for unknown format
  else {
    console.warn('Unable to format date - unknown format:', date, 'Type:', typeof date);
    return 'Date format error';
  }
  
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}
