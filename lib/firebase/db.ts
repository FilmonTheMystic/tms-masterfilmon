// lib/firebase/db.ts - Firestore database operations

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import {
  Property,
  Tenant,
  Invoice,
  Unit,
  Payment,
  ChargeTemplate,
  UtilityReading,
  PaginatedResponse,
} from '@/types';

// Generic CRUD operations
export class FirestoreService<T extends DocumentData> {
  constructor(private collectionName: string) {}

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  // Subscribe to real-time updates
  onSnapshot(callback: (data: T[]) => void): Unsubscribe {
    return onSnapshot(collection(db, this.collectionName), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      callback(data);
    });
  }
}

// Enhanced property service with unit creation
class PropertyService extends FirestoreService<Property> {
  async create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const propertyId = await super.create(data);
    
    // Create template units for the property
    await this.createTemplateUnits(propertyId, data.totalUnits);
    
    return propertyId;
  }

  private async createTemplateUnits(propertyId: string, totalUnits: number): Promise<void> {
    const unitPromises = [];
    
    for (let i = 1; i <= totalUnits; i++) {
      const unitData = {
        propertyId,
        unitNumber: `${i}A`, // Default naming convention
        type: '1bed' as const,
        size: 50, // Default 50 sqm
        baseRent: 0, // To be set later
        deposit: 0, // To be set later
        isOccupied: false,
      };
      
      unitPromises.push(unitService.create(unitData));
    }
    
    await Promise.all(unitPromises);
  }

  async createUnitsForExistingProperty(propertyId: string, totalUnits: number): Promise<void> {
    // Check if units already exist
    const existingUnits = await unitQueries.getByPropertyId(propertyId);
    if (existingUnits.length === 0) {
      await this.createTemplateUnits(propertyId, totalUnits);
    }
  }
}

// Specialized services for each entity
export const propertyService = new PropertyService('properties');
export const tenantService = new FirestoreService<Tenant>('tenants');
export const invoiceService = new FirestoreService<Invoice>('invoices');
export const unitService = new FirestoreService<Unit>('units');
export const paymentService = new FirestoreService<Payment>('payments');
export const chargeTemplateService = new FirestoreService<ChargeTemplate>('chargeTemplates');
export const utilityReadingService = new FirestoreService<UtilityReading>('utilityReadings');

// Specialized methods for complex queries
export const propertyQueries = {
  async getByManagerId(managerId: string): Promise<Property[]> {
    const q = query(
      collection(db, 'properties'),
      where('managerId', '==', managerId),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[];
  },
};

export const tenantQueries = {
  async getByPropertyId(propertyId: string): Promise<Tenant[]> {
    const q = query(
      collection(db, 'tenants'),
      where('propertyId', '==', propertyId),
      where('isActive', '==', true),
      orderBy('lastName')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Tenant[];
  },

  async getByUnitId(unitId: string): Promise<Tenant | null> {
    const q = query(
      collection(db, 'tenants'),
      where('unitId', '==', unitId),
      where('isActive', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Tenant;
  },

  async getActiveTenants(): Promise<Tenant[]> {
    const q = query(
      collection(db, 'tenants'),
      where('isActive', '==', true),
      orderBy('lastName')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Tenant[];
  },
};

export const invoiceQueries = {
  async getByTenantId(tenantId: string): Promise<Invoice[]> {
    const q = query(
      collection(db, 'invoices'),
      where('tenantId', '==', tenantId),
      orderBy('issueDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Invoice[];
  },

  async getByMonth(month: string): Promise<Invoice[]> {
    const q = query(
      collection(db, 'invoices'),
      where('month', '==', month),
      orderBy('issueDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Invoice[];
  },

  async getOverdueInvoices(): Promise<Invoice[]> {
    const q = query(
      collection(db, 'invoices'),
      where('status', '==', 'overdue'),
      orderBy('dueDate')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Invoice[];
  },

  async getPaginatedInvoices(
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<PaginatedResponse<Invoice>> {
    let q = query(
      collection(db, 'invoices'),
      orderBy('issueDate', 'desc'),
      limit(pageSize + 1) // Get one extra to check if there's a next page
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const hasNext = docs.length > pageSize;
    
    // Remove the extra document if it exists
    if (hasNext) {
      docs.pop();
    }

    const invoices = docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Invoice[];

    return {
      data: invoices,
      total: 0, // Firestore doesn't provide total count efficiently
      page: 0, // Would need to track this in the component
      limit: pageSize,
      hasNext,
      hasPrevious: !!lastDoc,
    };
  },

  async generateInvoiceNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Get the last invoice number for this month
    const q = query(
      collection(db, 'invoices'),
      where('invoiceNumber', '>=', `INV${year}${month}`),
      where('invoiceNumber', '<', `INV${year}${month}Z`),
      orderBy('invoiceNumber', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return `INV${year}${month}001`;
    }
    
    const lastDoc = querySnapshot.docs[0];
    const lastInvoiceNumber = lastDoc.data().invoiceNumber;
    const sequenceNumber = parseInt(lastInvoiceNumber.slice(-3)) + 1;
    
    return `INV${year}${month}${sequenceNumber.toString().padStart(3, '0')}`;
  },
};

export const unitQueries = {
  async getByPropertyId(propertyId: string): Promise<Unit[]> {
    const q = query(
      collection(db, 'units'),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    const units = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Unit[];
    
    // Sort manually to avoid index requirement
    return units.sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));
  },

  async getVacantUnits(propertyId?: string): Promise<Unit[]> {
    let q = query(
      collection(db, 'units'),
      where('isOccupied', '==', false),
      orderBy('unitNumber')
    );

    if (propertyId) {
      q = query(q, where('propertyId', '==', propertyId));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Unit[];
  },
};

export const paymentQueries = {
  async getByInvoiceId(invoiceId: string): Promise<Payment[]> {
    const q = query(
      collection(db, 'payments'),
      where('invoiceId', '==', invoiceId),
      orderBy('paymentDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Payment[];
  },

  async getByTenantId(tenantId: string): Promise<Payment[]> {
    const q = query(
      collection(db, 'payments'),
      where('tenantId', '==', tenantId),
      orderBy('paymentDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Payment[];
  },
};

export const chargeTemplateQueries = {
  async getByPropertyId(propertyId: string): Promise<ChargeTemplate[]> {
    const q = query(
      collection(db, 'chargeTemplates'),
      where('propertyId', '==', propertyId),
      where('isActive', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChargeTemplate[];
  },
};

export const utilityQueries = {
  async getByUnitAndMonth(unitId: string, month: string): Promise<UtilityReading[]> {
    const q = query(
      collection(db, 'utilityReadings'),
      where('unitId', '==', unitId),
      where('month', '==', month),
      orderBy('type')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UtilityReading[];
  },

  async getLatestReading(unitId: string, type: 'electricity' | 'water' | 'gas'): Promise<UtilityReading | null> {
    const q = query(
      collection(db, 'utilityReadings'),
      where('unitId', '==', unitId),
      where('type', '==', type),
      orderBy('readingDate', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as UtilityReading;
  },
};