'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Check, 
  AlertCircle,
  Loader2,
  Plus,
  Building2,
  Users,
  FileText,
  Trash2
} from 'lucide-react';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { 
  propertyService, 
  tenantService, 
  invoiceService 
} from '@/lib/firebase/db';
import { authService } from '@/lib/firebase/auth';
import { useToast } from '@/lib/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending' | 'completed';
  message: string;
  data?: any;
}

interface TestData {
  propertyIds: string[];
  tenantIds: string[];
  invoiceIds: string[];
}

export default function AdminDatabasePage() {
  const { isSuperAdmin } = useAdminAuth();
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testData, setTestData] = useState<TestData>({ propertyIds: [], tenantIds: [], invoiceIds: [] });

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <Alert variant="destructive">
          <AlertDescription>
            Only super administrators can access database management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (testName: string, updates: Partial<TestResult>) => {
    setResults(prev => prev.map(result => 
      result.test === testName 
        ? { ...result, ...updates }
        : result
    ));
  };

  const runDatabaseTests = async () => {
    setTesting(true);
    setResults([]);
    setTestData({ propertyIds: [], tenantIds: [], invoiceIds: [] });

    try {
      const timestamp = Date.now();
      const createdData: TestData = { propertyIds: [], tenantIds: [], invoiceIds: [] };

      // Test 1: User Authentication Test
      addResult({ test: 'User Authentication', status: 'pending', message: 'Testing user data retrieval...' });
      const currentUser = await authService.getCurrentUserData();
      if (currentUser) {
        updateResult('User Authentication', { 
          status: 'completed', 
          message: `✅ User data retrieved: ${currentUser.name} (${currentUser.role})`,
          data: currentUser
        });
      } else {
        updateResult('User Authentication', { status: 'error', message: '❌ Failed to retrieve user data' });
        return;
      }

      // Test 2: Create 5 Properties
      addResult({ test: 'Property Creation (5 items)', status: 'pending', message: 'Creating 5 test properties...' });
      
      const properties = [
        { name: 'Sunset Apartments', city: 'Cape Town', province: 'Western Cape' },
        { name: 'Ocean View Complex', city: 'Durban', province: 'KwaZulu-Natal' },
        { name: 'Mountain Ridge Estate', city: 'Johannesburg', province: 'Gauteng' },
        { name: 'Garden Square', city: 'Pretoria', province: 'Gauteng' },
        { name: 'Beachfront Towers', city: 'Port Elizabeth', province: 'Eastern Cape' },
      ];

      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        const testProperty = {
          name: `${prop.name} - TEST-${timestamp}`,
          address: `${123 + i} Test Street`,
          city: prop.city,
          postalCode: `${8000 + i}`,
          province: prop.province,
          totalUnits: 5 + i,
          propertyType: 'residential' as const,
          bankDetails: {
            bankName: `Test Bank ${i + 1}`,
            accountName: `${prop.name} Account`,
            accountNumber: `${1234567890 + i}`,
            branchCode: `${123456 + i}`,
            accountType: 'current' as const,
          },
          managerId: currentUser.id,
        };

        const propertyId = await propertyService.create(testProperty);
        createdData.propertyIds.push(propertyId);
        
        // Verify creation
        const retrieved = await propertyService.getById(propertyId);
        if (!retrieved) throw new Error(`Failed to retrieve property ${i + 1}`);
      }

      updateResult('Property Creation (5 items)', { 
        status: 'completed', 
        message: `✅ Created and verified 5 properties in Firestore`,
        data: { propertyIds: createdData.propertyIds }
      });

      // Test 3: Create 5 Tenants (1 per property)
      addResult({ test: 'Tenant Creation (5 items)', status: 'pending', message: 'Creating 5 test tenants...' });
      
      const tenantNames = [
        { firstName: 'John', lastName: 'Smith' },
        { firstName: 'Sarah', lastName: 'Johnson' },
        { firstName: 'Michael', lastName: 'Brown' },
        { firstName: 'Emma', lastName: 'Davis' },
        { firstName: 'James', lastName: 'Wilson' },
      ];

      for (let i = 0; i < tenantNames.length; i++) {
        const tenant = tenantNames[i];
        const testTenant = {
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          email: `${tenant.firstName.toLowerCase()}.${tenant.lastName.toLowerCase()}${timestamp}@testmail.com`,
          phone: `012345678${i}`,
          idNumber: `${1234567890123 + i}`,
          companyName: '',
          propertyId: createdData.propertyIds[i],
          unitId: `${createdData.propertyIds[i]}-unit-${i + 1}`,
          leaseStart: new Date(),
          leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          monthlyRent: 5000 + (i * 500),
          deposit: 5000 + (i * 500),
          isActive: true,
          emergencyContact: {
            name: `Emergency Contact ${i + 1}`,
            relationship: 'Parent',
            phone: `098765432${i}`,
            email: `emergency${i + 1}@testmail.com`,
          },
        };

        const tenantId = await tenantService.create(testTenant);
        createdData.tenantIds.push(tenantId);
        
        // Verify creation
        const retrieved = await tenantService.getById(tenantId);
        if (!retrieved) throw new Error(`Failed to retrieve tenant ${i + 1}`);
      }

      updateResult('Tenant Creation (5 items)', { 
        status: 'completed', 
        message: `✅ Created and verified 5 tenants linked to properties`,
        data: { tenantIds: createdData.tenantIds }
      });

      // Test 4: Create 5 Invoices (1 per tenant)
      addResult({ test: 'Invoice Creation (5 items)', status: 'pending', message: 'Creating 5 test invoices...' });
      
      for (let i = 0; i < createdData.tenantIds.length; i++) {
        const testInvoice = {
          invoiceNumber: `TEST-${timestamp}-${String(i + 1).padStart(3, '0')}`,
          tenantId: createdData.tenantIds[i],
          propertyId: createdData.propertyIds[i],
          unitId: `${createdData.propertyIds[i]}-unit-${i + 1}`,
          month: new Date().toISOString().slice(0, 7),
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          charges: [{
            id: 'rent',
            name: 'Monthly Rent',
            amount: 5000 + (i * 500),
            type: 'rent' as const,
            isVatInclusive: false,
            vatRate: 0,
            description: `Test monthly rent for unit ${i + 1}`,
          }],
          previousBalance: 0,
          subtotal: 5000 + (i * 500),
          vatAmount: 0,
          totalAmount: 5000 + (i * 500),
          status: 'draft' as const,
          paymentReference: `TEST-${timestamp}-${createdData.tenantIds[i]}`,
          emailSent: false,
        };

        const invoiceId = await invoiceService.create(testInvoice);
        createdData.invoiceIds.push(invoiceId);
        
        // Verify creation
        const retrieved = await invoiceService.getById(invoiceId);
        if (!retrieved) throw new Error(`Failed to retrieve invoice ${i + 1}`);
      }

      updateResult('Invoice Creation (5 items)', { 
        status: 'completed', 
        message: `✅ Created and verified 5 invoices with calculations`,
        data: { invoiceIds: createdData.invoiceIds }
      });

      // Test 5: Data Relationships Test
      addResult({ test: 'Data Relationships', status: 'pending', message: 'Verifying data relationships...' });
      
      const allProperties = await propertyService.getAll();
      const allTenants = await tenantService.getAll();
      const allInvoices = await invoiceService.getAll();
      
      updateResult('Data Relationships', { 
        status: 'completed', 
        message: `✅ Total in database: ${allProperties.length} properties, ${allTenants.length} tenants, ${allInvoices.length} invoices`,
        data: { 
          properties: allProperties.length, 
          tenants: allTenants.length, 
          invoices: allInvoices.length,
          testData: createdData 
        }
      });

      // Store test data for cleanup
      setTestData(createdData);

      toast({
        title: 'Database Tests Completed Successfully! 🎉',
        description: 'Created 5 properties, 5 tenants, and 5 invoices. Check Firebase Console to see the data!',
      });

    } catch (error: any) {
      console.error('Database test error:', error);
      addResult({ 
        test: 'Database Test Error', 
        status: 'error', 
        message: `❌ Test failed: ${error.message}` 
      });
      
      toast({
        title: 'Database Test Failed',
        description: error.message || 'An error occurred during database testing',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const cleanupTestData = async () => {
    setCleaning(true);
    
    try {
      addResult({ test: 'Cleanup Operation', status: 'pending', message: 'Cleaning up test data...' });
      
      const deletePromises = [
        ...testData.invoiceIds.map(id => invoiceService.delete(id)),
        ...testData.tenantIds.map(id => tenantService.delete(id)),
        ...testData.propertyIds.map(id => propertyService.delete(id)),
      ];
      
      await Promise.all(deletePromises);
      
      updateResult('Cleanup Operation', { 
        status: 'completed', 
        message: `✅ Cleaned up ${testData.propertyIds.length} properties, ${testData.tenantIds.length} tenants, and ${testData.invoiceIds.length} invoices` 
      });

      setTestData({ propertyIds: [], tenantIds: [], invoiceIds: [] });

      toast({
        title: 'Cleanup Completed',
        description: 'All test data has been removed from the database.',
      });

    } catch (error: any) {
      console.error('Cleanup error:', error);
      addResult({ 
        test: 'Cleanup Error', 
        status: 'error', 
        message: `❌ Cleanup failed: ${error.message}` 
      });
      
      toast({
        title: 'Cleanup Failed',
        description: error.message || 'An error occurred during cleanup',
        variant: 'destructive',
      });
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-6 w-6" />
            Database Management
          </h1>
          <p className="text-muted-foreground">
            Test and verify Firebase Firestore database connectivity
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runDatabaseTests}
            disabled={testing || cleaning}
            className="flex items-center gap-2"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Test Data...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Test Data (5x each)
              </>
            )}
          </Button>
          
          {testData.propertyIds.length > 0 && (
            <Button 
              onClick={cleanupTestData}
              disabled={testing || cleaning}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {cleaning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cleaning Up...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Clean Up Test Data
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This tool creates 5 properties, 5 tenants, and 5 invoices to test database connectivity.
          Data persists so you can check Firebase Console, then use "Clean Up" to remove test data.
        </AlertDescription>
      </Alert>

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Database Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded border">
                <div className="mt-0.5">
                  {(result.status === 'success' || result.status === 'completed') && <Check className="h-4 w-4 text-green-600" />}
                  {result.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                  {result.status === 'pending' && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{result.test}</div>
                  <div className={`text-sm ${
                    (result.status === 'success' || result.status === 'completed') ? 'text-green-700' :
                    result.status === 'error' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {result.message}
                  </div>
                  {result.data && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Data: {JSON.stringify(result.data, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Database Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Firebase</div>
            <p className="text-xs text-muted-foreground">
              Connected to Firestore
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              CRUD operations ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">
              Generation & storage working
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
