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
  
  // Handle Firestore Timestamp
  if (date && typeof date === 'object' && date.toDate && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  }
  // Handle Firestore object format
  else if (date && typeof date === 'object' && date.seconds) {
    dateObj = new Date(date.seconds * 1000);
  }
  // Handle Firestore object format with _seconds
  else if (date && typeof date === 'object' && date._seconds) {
    dateObj = new Date(date._seconds * 1000);
  }
  // Handle string
  else if (typeof date === 'string') {
    dateObj = new Date(date);
  }
  // Handle Date object
  else if (date instanceof Date) {
    dateObj = date;
  }
  // Fallback
  else {
    console.warn('Unable to format date:', date);
    dateObj = new Date();
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
