// types/index.ts - Core type definitions for TMS

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'accountant' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  managerId: string;
  totalUnits: number;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial';
  bankDetails: BankDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: 'studio' | '1bed' | '2bed' | '3bed' | 'commercial' | 'parking';
  size: number; // in sqm
  baseRent: number;
  deposit: number;
  isOccupied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  companyName?: string;
  unitId: string;
  propertyId: string;
  leaseStart: Date;
  leaseEnd: Date;
  monthlyRent: number;
  deposit: number;
  isActive: boolean;
  emergencyContact: EmergencyContact;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: 'Checking' | 'Savings' | 'Business';
}

export interface Charge {
  id: string;
  name: string;
  amount: number;
  type: 'rent' | 'utility' | 'municipal' | 'other';
  isVatInclusive: boolean;
  vatRate: number;
  description?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  propertyId: string;
  unitId: string;
  month: string; // YYYY-MM format
  issueDate: Date;
  dueDate: Date;
  charges: Charge[];
  previousBalance: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentReference: string;
  pdfUrl?: string;
  emailSent: boolean;
  emailSentAt?: Date;
  paidAt?: Date;
  paidAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  tenantId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'bank_transfer' | 'cash' | 'card' | 'other';
  reference: string;
  notes?: string;
  createdAt: Date;
}

export interface ChargeTemplate {
  id: string;
  propertyId: string;
  name: string;
  amount: number;
  type: 'rent' | 'utility' | 'municipal' | 'other';
  isVatInclusive: boolean;
  vatRate: number;
  isActive: boolean;
  appliesTo: 'all' | 'residential' | 'commercial';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UtilityReading {
  id: string;
  propertyId: string;
  unitId: string;
  type: 'electricity' | 'water' | 'gas';
  previousReading: number;
  currentReading: number;
  consumption: number;
  rate: number;
  amount: number;
  readingDate: Date;
  month: string; // YYYY-MM format
  createdAt: Date;
}

// UI Component Props Types
export interface InvoiceFormData {
  tenantId: string;
  month: string;
  charges: Charge[];
  dueDate: Date;
  includeUtilities: boolean;
  includeMunicipal: boolean;
}

export interface InvoicePreviewProps {
  invoice: Invoice;
  tenant: Tenant;
  property: Property;
  unit: Unit;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Filter and Search Types
export interface TenantFilters {
  propertyId?: string;
  isActive?: boolean;
  search?: string;
  sortBy?: 'name' | 'unit' | 'rent' | 'leaseEnd';
  sortOrder?: 'asc' | 'desc';
}

export interface InvoiceFilters {
  propertyId?: string;
  tenantId?: string;
  status?: Invoice['status'];
  month?: string;
  search?: string;
  sortBy?: 'date' | 'amount' | 'tenant' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  overdueInvoices: number;
  collectionRate: number;
}

export interface MonthlyReport {
  month: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  occupancyRate: number;
  invoicesSent: number;
  paymentsReceived: number;
}

// Email Templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  type: 'invoice' | 'reminder' | 'welcome' | 'notice';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}