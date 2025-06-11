// lib/validations/schemas.ts - Zod validation schemas

import { z } from 'zod';

// Auth schemas
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'manager', 'accountant', 'viewer']).default('viewer'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Property schemas
export const propertySchema = z.object({
  name: z.string().min(2, 'Property name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postalCode: z.string().regex(/^\d{4}$/, 'Postal code must be 4 digits'),
  province: z.string().min(2, 'Province is required'),
  totalUnits: z.number().min(1, 'Must have at least 1 unit'),
  propertyType: z.enum(['residential', 'commercial', 'mixed']),
  bankDetails: z.object({
    bankName: z.string().min(2, 'Bank name is required'),
    accountName: z.string().min(2, 'Account name is required'),
    accountNumber: z.string().regex(/^\d{8,15}$/, 'Account number must be 8-15 digits'),
    branchCode: z.string().regex(/^\d{6}$/, 'Branch code must be 6 digits'),
    accountType: z.enum(['current', 'savings']),
  }),
});

// Unit schemas
export const unitSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  type: z.enum(['studio', '1bed', '2bed', '3bed', 'commercial', 'parking']),
  size: z.number().min(1, 'Size must be greater than 0'),
  baseRent: z.number().min(0, 'Rent cannot be negative'),
  deposit: z.number().min(0, 'Deposit cannot be negative'),
  isOccupied: z.boolean().default(false),
});

// Tenant schemas
export const tenantSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+27|0)[0-9]{9}$/, 'Please enter a valid South African phone number'),
  idNumber: z.string().regex(/^\d{13}$/, 'ID number must be 13 digits'),
  companyName: z.string().optional(),
  unitId: z.string().min(1, 'Unit is required'),
  propertyId: z.string().min(1, 'Property is required'),
  leaseStart: z.date({
    required_error: 'Lease start date is required',
  }),
  leaseEnd: z.date({
    required_error: 'Lease end date is required',
  }),
  monthlyRent: z.number().min(0, 'Monthly rent cannot be negative'),
  deposit: z.number().min(0, 'Deposit cannot be negative'),
  isActive: z.boolean().default(true),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    relationship: z.string().min(2, 'Relationship is required'),
    phone: z.string().regex(/^(\+27|0)[0-9]{9}$/, 'Please enter a valid phone number'),
    email: z.string().email().optional().or(z.literal('')),
  }),
}).refine((data) => data.leaseEnd > data.leaseStart, {
  message: 'Lease end date must be after start date',
  path: ['leaseEnd'],
});

// Charge schemas
export const chargeSchema = z.object({
  name: z.string().min(2, 'Charge name is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  type: z.enum(['rent', 'utility', 'municipal', 'other']),
  isVatInclusive: z.boolean().default(false),
  vatRate: z.number().min(0).max(100).default(15),
  description: z.string().optional(),
});

// Invoice schemas
export const invoiceFormSchema = z.object({
  tenantId: z.string().min(1, 'Tenant is required'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Please select a valid month'),
  charges: z.array(chargeSchema).min(1, 'At least one charge is required'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  includeUtilities: z.boolean().default(true),
  includeMunicipal: z.boolean().default(true),
  previousBalance: z.number().default(0),
});

export const bulkInvoiceSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Please select a valid month'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  tenantIds: z.array(z.string()).min(1, 'Select at least one tenant'),
  includeUtilities: z.boolean().default(true),
  includeMunicipal: z.boolean().default(true),
  chargeTemplateIds: z.array(z.string()).min(1, 'Select at least one charge template'),
});

// Payment schemas
export const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentDate: z.date({
    required_error: 'Payment date is required',
  }),
  paymentMethod: z.enum(['bank_transfer', 'cash', 'card', 'other']),
  reference: z.string().min(1, 'Payment reference is required'),
  notes: z.string().optional(),
});

// Charge template schemas
export const chargeTemplateSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  name: z.string().min(2, 'Template name is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  type: z.enum(['rent', 'utility', 'municipal', 'other']),
  isVatInclusive: z.boolean().default(false),
  vatRate: z.number().min(0).max(100).default(15),
  isActive: z.boolean().default(true),
  appliesTo: z.enum(['all', 'residential', 'commercial']).default('all'),
  description: z.string().optional(),
});

// Utility reading schemas
export const utilityReadingSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  unitId: z.string().min(1, 'Unit is required'),
  type: z.enum(['electricity', 'water', 'gas']),
  previousReading: z.number().min(0, 'Previous reading cannot be negative'),
  currentReading: z.number().min(0, 'Current reading cannot be negative'),
  rate: z.number().min(0, 'Rate cannot be negative'),
  readingDate: z.date({
    required_error: 'Reading date is required',
  }),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Please select a valid month'),
}).refine((data) => data.currentReading >= data.previousReading, {
  message: 'Current reading must be greater than or equal to previous reading',
  path: ['currentReading'],
});

// Bulk utility reading schema
export const bulkUtilityReadingSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Please select a valid month'),
  readingDate: z.date({
    required_error: 'Reading date is required',
  }),
  readings: z.array(z.object({
    unitId: z.string().min(1, 'Unit is required'),
    type: z.enum(['electricity', 'water', 'gas']),
    currentReading: z.number().min(0, 'Reading cannot be negative'),
    rate: z.number().min(0, 'Rate cannot be negative'),
  })).min(1, 'At least one reading is required'),
});

// Email template schemas
export const emailTemplateSchema = z.object({
  name: z.string().min(2, 'Template name is required'),
  subject: z.string().min(2, 'Subject is required'),
  htmlBody: z.string().min(10, 'Email body is required'),
  textBody: z.string().min(10, 'Text body is required'),
  type: z.enum(['invoice', 'reminder', 'welcome', 'notice']),
  isActive: z.boolean().default(true),
});

// Filter schemas
export const tenantFilterSchema = z.object({
  propertyId: z.string().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'unit', 'rent', 'leaseEnd']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const invoiceFilterSchema = z.object({
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  month: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'tenant', 'status']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export type definitions
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type TenantFormData = z.infer<typeof tenantSchema>;
export type ChargeFormData = z.infer<typeof chargeSchema>;
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
export type BulkInvoiceFormData = z.infer<typeof bulkInvoiceSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type ChargeTemplateFormData = z.infer<typeof chargeTemplateSchema>;
export type UtilityReadingFormData = z.infer<typeof utilityReadingSchema>;
export type BulkUtilityReadingFormData = z.infer<typeof bulkUtilityReadingSchema>;
export type EmailTemplateFormData = z.infer<typeof emailTemplateSchema>;
export type TenantFilterFormData = z.infer<typeof tenantFilterSchema>;
export type InvoiceFilterFormData = z.infer<typeof invoiceFilterSchema>;