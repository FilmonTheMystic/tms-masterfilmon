'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  Calculator,
  Download,
  Send
} from 'lucide-react';
import Link from 'next/link';
import { invoiceFormSchema, type InvoiceFormData } from '@/lib/validations/schemas';
import { 
  invoiceService, 
  tenantService, 
  propertyService,
  invoiceQueries 
} from '@/lib/firebase/db';
import { useToast } from '@/lib/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import type { Tenant, Property, Charge } from '@/types';

export default function GenerateInvoicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [invoicePreview, setInvoicePreview] = useState<any>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      tenantId: '',
      month: new Date().toISOString().slice(0, 7), // Current month YYYY-MM
      charges: [],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      includeUtilities: true,
      includeMunicipal: true,
      previousBalance: 0,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Pre-select tenant if passed as parameter
    const tenantParam = searchParams.get('tenant');
    if (tenantParam && tenants.length > 0) {
      const tenant = tenants.find(t => t.id === tenantParam);
      if (tenant) {
        setSelectedTenant(tenant);
        form.setValue('tenantId', tenant.id);
        
        const property = properties.find(p => p.id === tenant.propertyId);
        if (property) {
          setSelectedProperty(property);
        }
      }
    }
  }, [tenants, properties, searchParams, form]);

  useEffect(() => {
    if (selectedTenant) {
      // Add default rent charge
      const rentCharge: Charge = {
        id: 'rent',
        name: 'Monthly Rent',
        amount: selectedTenant.monthlyRent,
        type: 'rent',
        isVatInclusive: false,
        vatRate: 0,
        description: `Rent for ${form.getValues('month')}`,
      };
      
      setCharges([rentCharge]);
      form.setValue('charges', [rentCharge]);
    }
  }, [selectedTenant, form]);

  const loadData = async () => {
    try {
      const [tenantsData, propertiesData] = await Promise.all([
        tenantService.getAll(),
        propertyService.getAll()
      ]);
      setTenants(tenantsData.filter(t => t.isActive));
      setProperties(propertiesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleTenantChange = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    setSelectedTenant(tenant || null);
    
    if (tenant) {
      const property = properties.find(p => p.id === tenant.propertyId);
      setSelectedProperty(property || null);
    }
  };

  const addCharge = () => {
    const newCharge: Charge = {
      id: `charge-${Date.now()}`,
      name: '',
      amount: 0,
      type: 'other',
      isVatInclusive: false,
      vatRate: 15,
      description: '',
    };
    
    const updatedCharges = [...charges, newCharge];
    setCharges(updatedCharges);
    form.setValue('charges', updatedCharges);
  };

  const updateCharge = (index: number, field: keyof Charge, value: any) => {
    const updatedCharges = charges.map((charge, i) => 
      i === index ? { ...charge, [field]: value } : charge
    );
    setCharges(updatedCharges);
    form.setValue('charges', updatedCharges);
  };

  const removeCharge = (index: number) => {
    const updatedCharges = charges.filter((_, i) => i !== index);
    setCharges(updatedCharges);
    form.setValue('charges', updatedCharges);
  };

  const calculateTotals = () => {
    const subtotal = charges.reduce((sum, charge) => sum + charge.amount, 0);
    const vatAmount = charges.reduce((sum, charge) => {
      if (!charge.isVatInclusive && charge.vatRate > 0) {
        return sum + (charge.amount * charge.vatRate / 100);
      }
      return sum;
    }, 0);
    const previousBalance = form.getValues('previousBalance') || 0;
    const totalAmount = subtotal + vatAmount + previousBalance;

    return { subtotal, vatAmount, totalAmount, previousBalance };
  };

  const generatePreview = async () => {
    if (!selectedTenant || !selectedProperty || charges.length === 0) {
      setError('Please select a tenant and add at least one charge');
      return;
    }

    try {
      const invoiceNumber = await invoiceQueries.generateInvoiceNumber();
      const totals = calculateTotals();
      
      const preview = {
        invoiceNumber,
        tenant: selectedTenant,
        property: selectedProperty,
        month: form.getValues('month'),
        issueDate: new Date(),
        dueDate: form.getValues('dueDate'),
        charges,
        ...totals,
      };
      
      setInvoicePreview(preview);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      setError('Failed to generate invoice preview');
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    if (!selectedTenant || !selectedProperty) {
      setError('Please select a tenant');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const invoiceNumber = await invoiceQueries.generateInvoiceNumber();
      const totals = calculateTotals();
      
      const invoiceData = {
        invoiceNumber,
        tenantId: selectedTenant.id,
        propertyId: selectedProperty.id,
        unitId: selectedTenant.unitId,
        month: data.month,
        issueDate: new Date(),
        dueDate: data.dueDate,
        charges: data.charges,
        previousBalance: data.previousBalance,
        subtotal: totals.subtotal,
        vatAmount: totals.vatAmount,
        totalAmount: totals.totalAmount,
        status: 'draft' as const,
        paymentReference: `${invoiceNumber}-${selectedTenant.lastName}`,
        emailSent: false,
      };

      await invoiceService.create(invoiceData);
      
      toast({
        title: 'Invoice generated successfully!',
        description: `Invoice ${invoiceNumber} has been created for ${selectedTenant.firstName} ${selectedTenant.lastName}.`,
      });

      router.push('/dashboard/invoices');
    } catch (error: any) {
      setError(error.message || 'Failed to generate invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Invoice</h1>
          <p className="text-muted-foreground">
            Create a new invoice for your tenant
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Tenant Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tenant & Property</h3>
                    
                    <FormField
                      control={form.control}
                      name="tenantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Tenant</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            handleTenantChange(value);
                          }} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a tenant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tenants.map((tenant) => (
                                <SelectItem key={tenant.id} value={tenant.id}>
                                  <div className="flex flex-col">
                                    <span>{tenant.firstName} {tenant.lastName}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatCurrency(tenant.monthlyRent)}/month
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedProperty && (
                      <div className="p-3 bg-muted rounded-md">
                        <div className="text-sm font-medium">{selectedProperty.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedProperty.address}, {selectedProperty.city}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Invoice Period */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Invoice Period</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Month</FormLabel>
                            <FormControl>
                              <Input type="month" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="previousBalance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Balance (ZAR)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Charges */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Charges</h3>
                      <Button type="button" onClick={addCharge} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Charge
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {charges.map((charge, index) => (
                        <Card key={charge.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="text-sm font-medium">Name</label>
                              <Input
                                value={charge.name}
                                onChange={(e) => updateCharge(index, 'name', e.target.value)}
                                placeholder="Charge name"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Amount</label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={charge.amount}
                                onChange={(e) => updateCharge(index, 'amount', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium">Type</label>
                              <Select 
                                value={charge.type} 
                                onValueChange={(value) => updateCharge(index, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="rent">Rent</SelectItem>
                                  <SelectItem value="utility">Utility</SelectItem>
                                  <SelectItem value="municipal">Municipal</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeCharge(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Input
                              value={charge.description || ''}
                              onChange={(e) => updateCharge(index, 'description', e.target.value)}
                              placeholder="Description (optional)"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generatePreview}
                      className="flex-1"
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Save className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Generate Invoice
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicePreview ? (
                <div className="space-y-4">
                  <div>
                    <div className="font-medium">Invoice #</div>
                    <div className="text-sm text-muted-foreground">{invoicePreview.invoiceNumber}</div>
                  </div>

                  <Separator />

                  <div>
                    <div className="font-medium">Tenant</div>
                    <div className="text-sm">
                      {invoicePreview.tenant.firstName} {invoicePreview.tenant.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{invoicePreview.tenant.email}</div>
                  </div>

                  <div>
                    <div className="font-medium">Property</div>
                    <div className="text-sm">{invoicePreview.property.name}</div>
                    <div className="text-xs text-muted-foreground">{invoicePreview.property.city}</div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    {totals.vatAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>VAT:</span>
                        <span>{formatCurrency(totals.vatAmount)}</span>
                      </div>
                    )}
                    {totals.previousBalance > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Previous Balance:</span>
                        <span>{formatCurrency(totals.previousBalance)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(totals.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Preview" to see invoice summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}