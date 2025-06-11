'use client';

// components/invoice/InvoiceGenerator.tsx - Main invoice generation component

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Calendar, FileText, Send, Download, Eye } from 'lucide-react';
import { invoiceFormSchema, type InvoiceFormData } from '@/lib/validations/schemas';
import { formatCurrency, generatePaymentReference, calculateInvoiceTotals } from '@/lib/utils';
import { invoiceService, tenantService, propertyService, unitService } from '@/lib/firebase/db';
import { InvoiceForm } from './InvoiceForm';
import { InvoicePreview } from './InvoicePreview';
import type { Invoice, Tenant, Property, Unit, Charge } from '@/types';

interface InvoiceGeneratorProps {
  propertyId?: string;
  tenantId?: string;
  onInvoiceGenerated?: (invoice: Invoice) => void;
}

export function InvoiceGenerator({ 
  propertyId, 
  tenantId, 
  onInvoiceGenerated 
}: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<{
    invoice?: Partial<Invoice>;
    tenant?: Tenant;
    property?: Property;
    unit?: Unit;
  }>({});
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const { toast } = useToast();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      tenantId: tenantId || '',
      month: new Date().toISOString().slice(0, 7), // Current month
      charges: [],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      includeUtilities: true,
      includeMunicipal: true,
      previousBalance: 0,
    },
  });

  // Load initial data
  useEffect(() => {
    loadProperties();
    if (propertyId) {
      loadTenants(propertyId);
    }
  }, [propertyId]);

  // Watch for tenant selection changes
  const selectedTenantId = form.watch('tenantId');
  useEffect(() => {
    if (selectedTenantId) {
      loadTenantData(selectedTenantId);
    }
  }, [selectedTenantId]);

  // Watch for form changes to update preview
  const formValues = form.watch();
  useEffect(() => {
    updatePreview(formValues);
  }, [formValues, previewData.tenant, previewData.property, previewData.unit]);

  const loadProperties = async () => {
    try {
      const propertyList = await propertyService.getAll();
      setProperties(propertyList);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load properties',
        variant: 'destructive',
      });
    }
  };

  const loadTenants = async (propId: string) => {
    try {
      const tenantList = await tenantService.getAll();
      const filteredTenants = tenantList.filter(t => t.propertyId === propId && t.isActive);
      setTenants(filteredTenants);
    } catch (error) {
      console.error('Failed to load tenants:', error);
    }
  };

  const loadTenantData = async (tId: string) => {
    try {
      const tenant = await tenantService.getById(tId);
      if (!tenant) return;

      const property = await propertyService.getById(tenant.propertyId);
      const unit = await unitService.getById(tenant.unitId);

      setPreviewData(prev => ({
        ...prev,
        tenant,
        property,
        unit,
      }));

      // Load units for the property
      if (property) {
        const unitList = await unitService.getAll();
        const propertyUnits = unitList.filter(u => u.propertyId === property.id);
        setUnits(propertyUnits);
      }

      // Auto-populate monthly rent if no charges exist
      const currentCharges = form.getValues('charges');
      if (currentCharges.length === 0) {
        const rentCharge: Charge = {
          id: 'rent',
          name: 'Monthly Rent',
          amount: tenant.monthlyRent,
          type: 'rent',
          isVatInclusive: false,
          vatRate: 0, // Rent is typically VAT exempt
          description: `Monthly rent for unit ${unit?.unitNumber || tenant.unitId}`,
        };
        form.setValue('charges', [rentCharge]);
      }
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    }
  };

  const updatePreview = (formData: InvoiceFormData) => {
    if (!previewData.tenant || !previewData.property || !previewData.unit) return;

    const totals = calculateInvoiceTotals(formData.charges, formData.previousBalance);
    
    const previewInvoice: Partial<Invoice> = {
      tenantId: formData.tenantId,
      propertyId: previewData.tenant.propertyId,
      unitId: previewData.tenant.unitId,
      month: formData.month,
      issueDate: new Date(),
      dueDate: formData.dueDate,
      charges: formData.charges,
      previousBalance: formData.previousBalance,
      subtotal: totals.subtotal,
      vatAmount: totals.totalVAT,
      totalAmount: totals.grandTotal,
      status: 'draft',
      paymentReference: generatePaymentReference(
        formData.tenantId,
        previewData.unit.unitNumber,
        formData.month
      ),
    };

    setPreviewData(prev => ({
      ...prev,
      invoice: previewInvoice,
    }));
  };

  const generateInvoice = async (data: InvoiceFormData) => {
    if (!previewData.tenant || !previewData.property || !previewData.unit) {
      toast({
        title: 'Error',
        description: 'Please select a tenant first',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Generate invoice number
      const invoiceNumber = await invoiceService.generateInvoiceNumber();

      // 2. Calculate totals
      const totals = calculateInvoiceTotals(data.charges, data.previousBalance);

      // 3. Create invoice data
      const invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
        invoiceNumber,
        tenantId: data.tenantId,
        propertyId: previewData.tenant.propertyId,
        unitId: previewData.tenant.unitId,
        month: data.month,
        issueDate: new Date(),
        dueDate: data.dueDate,
        charges: data.charges,
        previousBalance: data.previousBalance,
        subtotal: totals.subtotal,
        vatAmount: totals.totalVAT,
        totalAmount: totals.grandTotal,
        status: 'draft',
        paymentReference: generatePaymentReference(
          data.tenantId,
          previewData.unit.unitNumber,
          data.month
        ),
        emailSent: false,
      };

      // 4. Save to Firestore
      const invoiceId = await invoiceService.create(invoiceData);

      // 5. Get the complete invoice
      const savedInvoice = await invoiceService.getById(invoiceId);
      if (!savedInvoice) throw new Error('Failed to retrieve saved invoice');

      toast({
        title: 'Success',
        description: `Invoice ${invoiceNumber} generated successfully`,
      });

      // 6. Callback
      onInvoiceGenerated?.(savedInvoice);

      // 7. Reset form
      form.reset();
      setPreviewData({});

    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invoice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const previewInvoice = () => {
    // TODO: Open invoice preview in modal or new tab
    console.log('Preview invoice:', previewData.invoice);
  };

  const downloadInvoice = async () => {
    if (!previewData.invoice) return;
    
    try {
      // TODO: Generate and download PDF
      toast({
        title: 'Download',
        description: 'PDF generation coming soon',
      });
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      });
    }
  };

  const sendInvoice = async () => {
    if (!previewData.invoice || !previewData.tenant) return;

    try {
      // TODO: Send invoice via email
      toast({
        title: 'Email',
        description: 'Email functionality coming soon',
      });
    } catch (error) {
      console.error('Failed to send invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invoice',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Invoice Form */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(generateInvoice)} className="space-y-6">
              <InvoiceForm
                form={form}
                tenants={tenants}
                properties={properties}
                units={units}
                onPropertyChange={loadTenants}
              />
              
              <div className="flex flex-col gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isGenerating || !previewData.tenant}
                  className="w-full"
                >
                  {isGenerating ? (
                    'Generating...'
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </>
                  )}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={previewInvoice}
                    disabled={!previewData.invoice}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadInvoice}
                    disabled={!previewData.invoice}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={sendInvoice}
                    disabled={!previewData.invoice || !previewData.tenant}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Right: Live Preview */}
      <Card className="bg-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {previewData.invoice && previewData.tenant && previewData.property && previewData.unit ? (
            <InvoicePreview
              invoice={previewData.invoice as Invoice}
              tenant={previewData.tenant}
              property={previewData.property}
              unit={previewData.unit}
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a tenant to see invoice preview</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}