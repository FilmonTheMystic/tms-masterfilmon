'use client';

// app/dashboard/page.tsx - Main dashboard page

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Plus,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  propertyService, 
  tenantService, 
  invoiceService, 
  paymentService 
} from '@/lib/firebase/db';
import type { DashboardStats, Invoice, Property, Tenant } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    collectionRate: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentTenants, setRecentTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load all data in parallel
      const [
        propertiesData,
        tenantsData,
        invoicesData,
        paymentsData,
      ] = await Promise.all([
        propertyService.getAll(),
        tenantService.getAll(),
        invoiceService.getAll(),
        paymentService.getAll(),
      ]);

      // Calculate statistics
      const activeTenants = tenantsData.filter(t => t.isActive);
      const overdueInvoices = invoicesData.filter(i => 
        i.status === 'overdue' || 
        (i.status === 'sent' && new Date(i.dueDate) < new Date())
      );
      const pendingInvoices = invoicesData.filter(i => 
        i.status === 'sent' || i.status === 'draft'
      );

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentMonthPayments = paymentsData.filter(p => 
        p.paymentDate.toString().slice(0, 7) === currentMonth
      );
      const monthlyRevenue = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);

      // Calculate collection rate
      const currentMonthInvoices = invoicesData.filter(i => i.month === currentMonth);
      const totalInvoiced = currentMonthInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
      const collectionRate = totalInvoiced > 0 ? (monthlyRevenue / totalInvoiced) * 100 : 0;

      // Calculate occupied units
      const totalUnits = propertiesData.reduce((sum, p) => sum + p.totalUnits, 0);
      const occupiedUnits = activeTenants.length;

      setStats({
        totalProperties: propertiesData.length,
        totalUnits,
        occupiedUnits,
        totalTenants: activeTenants.length,
        monthlyRevenue,
        pendingInvoices: pendingInvoices.length,
        overdueInvoices: overdueInvoices.length,
        collectionRate,
      });

      // Set recent data
      setRecentInvoices(invoicesData.slice(0, 5));
      setRecentTenants(activeTenants.slice(0, 5));
      setProperties(propertiesData);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const occupancyRate = stats.totalUnits > 0 
    ? (stats.occupiedUnits / stats.totalUnits) * 100 
    : 0;

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/invoices/generate">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </Link>
          <Link href="/dashboard/tenants">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Tenants
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Properties</p>
                <p className="text-2xl font-bold">{stats.totalProperties}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {stats.totalUnits} total units
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupancy</p>
                <p className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {stats.occupiedUnits} of {stats.totalUnits} units occupied
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">{stats.collectionRate.toFixed(1)}% collection rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">{stats.overdueInvoices}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {stats.pendingInvoices} pending invoices
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
            <Link href="/dashboard/invoices">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices found</p>
                  <Link href="/dashboard/invoices/generate">
                    <Button className="mt-4" size="sm">
                      Generate Your First Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            Due {formatDate(invoice.dueDate)}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            invoice.status === 'paid' ? 'default' :
                            invoice.status === 'overdue' ? 'destructive' : 'secondary'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.totalAmount)}</p>
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Properties Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No properties found</p>
                  <Link href="/dashboard/properties">
                    <Button className="mt-4" size="sm">
                      Add Your First Property
                    </Button>
                  </Link>
                </div>
              ) : (
                properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {property.totalUnits} units • {property.city}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {property.propertyType}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              
              {properties.length > 3 && (
                <div className="pt-2">
                  <Link href="/dashboard/properties">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Properties
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/invoices/generate">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Generate Invoice</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/tenants">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Tenants</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/properties">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Building2 className="h-6 w-6 mb-2" />
                <span className="text-sm">Properties</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/reports">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">View Reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}