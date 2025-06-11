'use client';

// components/invoice/InvoiceForm.tsx - Invoice form component

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Plus, Trash2, Calculator } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate, formatCurrency, calculateInvoiceTotals, getCurrentMonth } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { InvoiceFormData } from '@/lib/validations/schemas';
import type { Tenant, Property, Unit, Charge } from '@/types';

interface InvoiceFormProps {
  form: UseFormReturn<InvoiceFormData>;
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  onPropertyChange: (propertyId: string) => void;
}

export function InvoiceForm({ 
  form, 
  tenants, 
  properties, 
  units, 
  onPropertyChange 
}: InvoiceFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const selectedTenantId = form.watch('tenantId');
  const selectedTenant = tenants.find(t => t.id === selectedTenantId);
  const charges = form.watch('charges') || [];
  const previousBalance = form.watch('previousBalance') || 0;

  // Calculate totals for display
  const totals = calculateInvoiceTotals(charges, previousBalance);

  const addCharge = () => {
    const newCharge: Charge = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      type: 'other',
      isVatInclusive: false,
      vatRate: 15,
      description: '',
    };
    
    const currentCharges = form.getValues('charges') || [];
    form.setValue('charges', [...currentCharges, newCharge]);
  };

  const removeCharge = (index: number) => {
    const currentCharges = form.getValues('charges') || [];
    const updatedCharges = currentCharges.filter((_, i) => i !== index);
    form.setValue('charges', updatedCharges);
  };

  const updateCharge = (index: number, field: keyof Charge, value: any) => {
    const currentCharges = form.getValues('charges') || [];
    const updatedCharges = [...currentCharges];
    updatedCharges[index] = {
      ...updatedCharges[index],
      [field]: value,
    };
    form.setValue('charges', updatedCharges);
  };

  const handlePropertyChange = (propertyId: string) => {
    form.setValue('tenantId', ''); // Reset tenant selection
    onPropertyChange(propertyId);
  };

  return (
    <div className="space-y-6">
      {/* Property & Tenant Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Property First</FormLabel>
              <Select onValueChange={handlePropertyChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose property..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tenants.map((tenant) => {
                    const unit = units.find(u => u.id === tenant.unitId);
                    return (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        <div className="flex flex-col">
                          <span>{tenant.firstName} {tenant.lastName}</span>
                          <span className="text-xs text-muted-foreground">
                            Unit {unit?.unitNumber} • {formatCurrency(tenant.monthlyRent)}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing Month</FormLabel>
              <FormControl>
                <Input
                  type="month"
                  {...field}
                  max={getCurrentMonth()}
                />
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
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Previous Balance */}
      <FormField
        control={form.control}
        name="previousBalance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Previous Balance (if any)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      {/* Charges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Charges</h3>
          <Button type="button" onClick={addCharge} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Charge
          </Button>
        </div>

        {charges.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No charges added yet. Click "Add Charge" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {charges.map((charge, index) => (
              <Card key={charge.id || index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Charge {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCharge(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Charge Name</label>
                      <Input
                        value={charge.name}
                        onChange={(e) => updateCharge(index, 'name', e.target.value)}
                        placeholder="e.g., Monthly Rent"
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Amount (ZAR)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={charge.amount}
                        onChange={(e) => updateCharge(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">VAT Rate (%)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={charge.vatRate}
                        onChange={(e) => updateCharge(index, 'vatRate', parseFloat(e.target.value) || 0)}
                        placeholder="15"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id={`vat-inclusive-${index}`}
                        checked={charge.isVatInclusive}
                        onChange={(e) => updateCharge(index, 'isVatInclusive', e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor={`vat-inclusive-${index}`} className="text-sm">
                        VAT Inclusive
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Input
                      value={charge.description || ''}
                      onChange={(e) => updateCharge(index, 'description', e.target.value)}
                      placeholder="Additional details..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Totals Summary */}
      {charges.length > 0 && (
        <>
          <Separator />
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="h-4 w-4" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>VAT:</span>
                <span>{formatCurrency(totals.totalVAT)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current Total:</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
              {previousBalance > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Previous Balance:</span>
                  <span>{formatCurrency(previousBalance)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Grand Total:</span>
                <span>{formatCurrency(totals.grandTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Tenant Information Display */}
      {selectedTenant && (
        <>
          <Separator />
          <Card className="bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-base">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Name:</span> {selectedTenant.firstName} {selectedTenant.lastName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {selectedTenant.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {selectedTenant.phone}
                </div>
                <div>
                  <span className="font-medium">Monthly Rent:</span> {formatCurrency(selectedTenant.monthlyRent)}
                </div>
              </div>
              {selectedTenant.companyName && (
                <div>
                  <span className="font-medium">Company:</span> {selectedTenant.companyName}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}