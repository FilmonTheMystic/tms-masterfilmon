// lib/utils/index.ts - Utility functions for TMS

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Charge, Invoice } from '@/types';

// Shadcn utility function for className merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting for South African Rand
export function formatCurrency(amount: number, options?: {
  showSymbol?: boolean;
  decimals?: number;
}): string {
  const { showSymbol = true, decimals = 2 } = options || {};
  
  const formatted = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return showSymbol ? formatted : formatted.replace('R', '').trim();
}

// Format numbers without currency symbol
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Date formatting functions
export function formatDate(date: Date | string, options?: {
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
}): string {
  const { format = 'medium', includeTime = false } = options || {};
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : format === 'long' ? 'long' : 'short',
    day: '2-digit',
  };

  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('en-ZA', dateOptions).format(dateObj);
}

export function formatMonth(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

export function getNextMonth(currentMonth: string): string {
  const [year, month] = currentMonth.split('-').map(Number);
  const date = new Date(year, month - 1);
  date.setMonth(date.getMonth() + 1);
  
  const nextYear = date.getFullYear();
  const nextMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${nextYear}-${nextMonth}`;
}

export function getPreviousMonth(currentMonth: string): string {
  const [year, month] = currentMonth.split('-').map(Number);
  const date = new Date(year, month - 1);
  date.setMonth(date.getMonth() - 1);
  
  const prevYear = date.getFullYear();
  const prevMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${prevYear}-${prevMonth}`;
}

// VAT calculation functions
export function calculateVAT(amount: number, vatRate: number, isInclusive: boolean = false): {
  subtotal: number;
  vatAmount: number;
  total: number;
} {
  if (isInclusive) {
    // VAT is included in the amount
    const vatAmount = (amount * vatRate) / (100 + vatRate);
    const subtotal = amount - vatAmount;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      total: amount,
    };
  } else {
    // VAT is exclusive (added to the amount)
    const vatAmount = (amount * vatRate) / 100;
    const total = amount + vatAmount;
    return {
      subtotal: amount,
      vatAmount: Math.round(vatAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }
}

export function calculateInvoiceTotals(charges: Charge[], previousBalance: number = 0): {
  subtotal: number;
  totalVAT: number;
  total: number;
  grandTotal: number;
} {
  let subtotal = 0;
  let totalVAT = 0;

  charges.forEach(charge => {
    const { subtotal: chargeSubtotal, vatAmount } = calculateVAT(
      charge.amount,
      charge.vatRate,
      charge.isVatInclusive
    );
    
    subtotal += chargeSubtotal;
    totalVAT += vatAmount;
  });

  const total = subtotal + totalVAT;
  const grandTotal = total + previousBalance;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalVAT: Math.round(totalVAT * 100) / 100,
    total: Math.round(total * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

// String utilities
export function generatePaymentReference(tenantId: string, unitNumber: string, month: string): string {
  const monthCode = month.replace('-', '');
  const tenantCode = tenantId.slice(0, 4).toUpperCase();
  return `${unitNumber}-${tenantCode}-${monthCode}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Validation utilities
export function isValidSouthAfricanID(idNumber: string): boolean {
  if (!/^\d{13}$/.test(idNumber)) return false;

  // Luhn algorithm for South African ID validation
  const digits = idNumber.split('').map(Number);
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
    }
    sum += digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[12];
}

export function isValidSouthAfricanPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for valid SA phone number patterns
  return /^(27|0)[0-9]{9}$/.test(cleaned);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('27')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+27${cleaned.slice(1)}`;
  }
  
  return phone;
}

// Array utilities
export function groupBy<T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((result, item) => {
    const group = key(item);
    (result[group] = result[group] || []).push(item);
    return result;
  }, {} as Record<K, T[]>);
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// File utilities
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('network') || 
         message.includes('fetch') || 
         message.includes('connection');
}

// Local storage utilities
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Business logic utilities
export function calculateLateFee(
  invoice: Invoice,
  lateFeeRate: number = 0.02, // 2% per month
  gracePeriodDays: number = 7
): number {
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  const graceDate = new Date(dueDate);
  graceDate.setDate(graceDate.getDate() + gracePeriodDays);
  
  if (today <= graceDate) return 0;
  
  const daysLate = Math.floor((today.getTime() - graceDate.getTime()) / (1000 * 60 * 60 * 24));
  const monthsLate = Math.ceil(daysLate / 30);
  
  return Math.round(invoice.totalAmount * lateFeeRate * monthsLate * 100) / 100;
}

export function getInvoiceStatus(invoice: Invoice): Invoice['status'] {
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  
  if (invoice.status === 'paid') return 'paid';
  if (invoice.status === 'cancelled') return 'cancelled';
  if (invoice.status === 'draft') return 'draft';
  
  if (today > dueDate) return 'overdue';
  
  return 'sent';
}