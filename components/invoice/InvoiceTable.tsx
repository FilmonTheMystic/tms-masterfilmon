'use client';

// components/invoice/InvoiceTable.tsx - Invoice table component with filters and actions

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Mail,
  Edit,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { formatCurrency, formatDate, formatMonth } from '@/lib/utils';
import { invoiceService, tenantService, propertyService } from '@/lib/firebase/db';
import { useToast } from '@/hooks/use-toast';
import type { Invoice, Tenant, Property, InvoiceFilters } from '@/types';

interface InvoiceTableProps {
  onInvoiceSelect?: (invoice: Invoice) => void;
  propertyId?: string;
  tenantId?: string;
  showActions?: boolean;
}

export function InvoiceTable({ 
  onInvoiceSelect, 
  propertyId, 
  tenantId,
  showActions = true 
}: InvoiceTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [tenants, setTenants] = useState<Record<string, Tenant>>({});
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Invoice>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: '',
    status: undefined,
    propertyId: propertyId,
    tenantId: tenantId,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [propertyId, tenantId]);

  useEffect(() => {
    applyFilters();
  }, [invoices, filters, sortField, sortDirection]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load invoices based on filters
      let invoiceList: Invoice[] = [];
      if (tenantId) {
        invoiceList = await invoiceService.getByTenantId(tenantId);
      } else {
        invoiceList = await invoiceService.getAll();
        if (propertyId) {
          invoiceList = invoiceList.filter(inv => inv.propertyId === propertyId);
        }
      }

      // Load related data
      const [tenantList, propertyList] = await Promise.all([
        tenantService.getAll(),
        propertyService.getAll(),
      ]);

      // Create lookup maps
      const tenantMap = tenantList.reduce((acc, tenant) => {
        acc[tenant.id] = tenant;
        return acc;
      }, {} as Record<string, Tenant>);

      const propertyMap = propertyList.reduce((acc, property) => {
        acc[property.id] = property;
        return acc;
      }, {} as Record<string, Property>);

      setInvoices(invoiceList);
      setTenants(tenantMap);
      setProperties(propertyMap);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invoices',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(invoice => {
        const tenant = tenants[invoice.tenantId];
        const property = properties[invoice.propertyId];
        
        return (
          invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
          (tenant && `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm)) ||
          (property && property.name.toLowerCase().includes(searchTerm)) ||
          invoice.paymentReference.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'issueDate':
        case 'dueDate':
          aValue = new Date(a[sortField]).getTime();
          bValue = new Date(b[sortField]).getTime();
          break;
        case 'totalAmount':
          aValue = a[sortField];
          bValue = b[sortField];
          break;
        case 'invoiceNumber':
          aValue = a[sortField];
          bValue = b[sortField];
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredInvoices(filtered);
  };

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices(prev => [...prev, invoiceId]);
    } else {
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await invoiceService.delete(invoiceId);
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: 'delete' | 'send' | 'export') => {
    if (selectedInvoices.length === 0) return;

    try {
      switch (action) {
        case 'delete':
          await Promise.all(selectedInvoices.map(id => invoiceService.delete(id)));
          toast({
            title: 'Success',
            description: `${selectedInvoices.length} invoices deleted`,
          });
          break;
        case 'send':
          // TODO: Implement bulk email sending
          toast({
            title: 'Info',
            description: 'Bulk email feature coming soon',
          });
          break;
        case 'export':
          // TODO: Implement bulk export
          toast({
            title: 'Info',
            description: 'Bulk export feature coming soon',
          });
          break;
      }
      
      setSelectedInvoices([]);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'default' as const;
      case 'overdue':
        return 'destructive' as const;
      case 'sent':
        return 'secondary' as const;
      case 'draft':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  const SortIcon = ({ field }: { field: keyof Invoice }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="h-4 w-4 ml-1" /> : 
      <SortDesc className="h-4 w-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Invoices ({filteredInvoices.length})
          </CardTitle>
          
          {showActions && (
            <div className="flex items-center gap-2">
              {selectedInvoices.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions ({selectedInvoices.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('send')}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Emails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDFs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <Link href="/dashboard/invoices/generate">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              status: value === 'all' ? undefined : value as Invoice['status'] 
            }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {showActions && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('invoiceNumber')}
                >
                  <div className="flex items-center">
                    Invoice #
                    <SortIcon field="invoiceNumber" />
                  </div>
                </TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Period</TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Amount
                    <SortIcon field="totalAmount" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">
                    Due Date
                    <SortIcon field="dueDate" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={showActions ? 9 : 7} 
                    className="text-center py-8 text-muted-foreground"
                  >
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No invoices found</p>
                    {!tenantId && !propertyId && (
                      <Link href="/dashboard/invoices/generate">
                        <Button className="mt-4" size="sm">
                          Generate Your First Invoice
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => {
                  const tenant = tenants[invoice.tenantId];
                  const property = properties[invoice.propertyId];
                  
                  return (
                    <TableRow key={invoice.id} className="hover:bg-muted/50">
                      {showActions && (
                        <TableCell>
                          <Checkbox
                            checked={selectedInvoices.includes(invoice.id)}
                            onCheckedChange={(checked) => 
                              handleSelectInvoice(invoice.id, checked as boolean)
                            }
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-mono font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        {tenant ? (
                          <div>
                            <div className="font-medium">
                              {tenant.firstName} {tenant.lastName}
                            </div>
                            {tenant.companyName && (
                              <div className="text-sm text-muted-foreground">
                                {tenant.companyName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {property ? property.name : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {formatMonth(invoice.month)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(invoice.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(invoice.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      {showActions && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/dashboard/invoices/${invoice.id}`}>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}