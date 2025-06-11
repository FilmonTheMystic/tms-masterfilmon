'use client';

// components/invoice/InvoicePreview.tsx - Invoice preview component

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate, formatMonth, calculateVAT } from '@/lib/utils';
import type { Invoice, Tenant, Property, Unit } from '@/types';

interface InvoicePreviewProps {
  invoice: Invoice;
  tenant: Tenant;
  property: Property;
  unit: Unit;
}

export function InvoicePreview({ invoice, tenant, property, unit }: InvoicePreviewProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      {/* Invoice Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Company Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-primary">
              {property.name}
            </h1>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{property.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{property.city}, {property.postalCode}</span>
            </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="text-right space-y-2">
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Invoice #:</span>{' '}
              <span className="font-mono">{invoice.invoiceNumber || 'INV2025001'}</span>
            </div>
            <div>
              <span className="font-medium">Date:</span>{' '}
              {formatDate(invoice.issueDate)}
            </div>
            <div>
              <span className="font-medium">Due Date:</span>{' '}
              <span className="text-red-600 font-medium">
                {formatDate(invoice.dueDate)}
              </span>
            </div>
            <div>
              <span className="font-medium">Period:</span>{' '}
              {formatMonth(invoice.month)}
            </div>
          </div>
          <Badge variant="secondary" className="mt-2">
            {invoice.status?.toUpperCase() || 'DRAFT'}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Bill To Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Bill To:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="font-medium text-base">
              {tenant.firstName} {tenant.lastName}
            </div>
            {tenant.companyName && (
              <div className="text-muted-foreground">{tenant.companyName}</div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{tenant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{tenant.phone}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Property Details:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="font-medium">Unit {unit.unitNumber}</div>
            <div className="text-muted-foreground">{property.address}</div>
            <div className="text-muted-foreground">{property.city}, {property.province}</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Type: {unit.type}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Size: {unit.size}m²</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Reference - Highlighted */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-yellow-700" />
            <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
              Payment Reference
            </span>
          </div>
          <div className="font-mono text-lg font-bold text-yellow-900">
            {invoice.paymentReference}
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Please use this reference when making payment
          </p>
        </CardContent>
      </Card>

      {/* Previous Balance */}
      {invoice.previousBalance > 0 && (
        <>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-orange-700 font-medium">Previous Balance:</span>
              <span className="text-orange-700 font-bold text-lg">
                {formatCurrency(invoice.previousBalance)}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Invoice Items */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Charges for {formatMonth(invoice.month)}
        </h3>
        
        <div className="overflow-hidden border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Description
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                  VAT
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoice.charges.map((charge, index) => {
                const { subtotal, vatAmount, total } = calculateVAT(
                  charge.amount,
                  charge.vatRate,
                  charge.isVatInclusive
                );
                
                return (
                  <tr key={charge.id || index} className="hover:bg-muted/25">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{charge.name}</div>
                        {charge.description && (
                          <div className="text-sm text-muted-foreground">
                            {charge.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {charge.type}
                          </Badge>
                          {charge.vatRate > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {charge.vatRate}% VAT {charge.isVatInclusive ? 'Inc' : 'Exc'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(subtotal)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {charge.vatRate > 0 ? formatCurrency(vatAmount) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-3">
        <Separator />
        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT:</span>
              <span className="font-mono">{formatCurrency(invoice.vatAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current Charges:</span>
              <span className="font-mono">{formatCurrency(invoice.subtotal + invoice.vatAmount)}</span>
            </div>
            {invoice.previousBalance > 0 && (
              <div className="flex justify-between text-sm text-orange-600">
                <span>Previous Balance:</span>
                <span className="font-mono">{formatCurrency(invoice.previousBalance)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount Due:</span>
              <span className="font-mono text-primary">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Banking Details */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
            Banking Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Bank:</span>{' '}
              {property.bankDetails.bankName}
            </div>
            <div>
              <span className="font-medium text-blue-700">Account Name:</span>{' '}
              {property.bankDetails.accountName}
            </div>
            <div>
              <span className="font-medium text-blue-700">Account Number:</span>{' '}
              <span className="font-mono">{property.bankDetails.accountNumber}</span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Branch Code:</span>{' '}
              <span className="font-mono">{property.bankDetails.branchCode}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="font-medium text-sm">Payment Terms:</div>
        <ul className="space-y-1 pl-4">
          <li>• Payment is due within 30 days of invoice date</li>
          <li>• Late payments may incur interest charges</li>
          <li>• Please use the payment reference when making payment</li>
          <li>• For queries, contact the property manager</li>
        </ul>
      </div>
    </div>
  );
}