'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  FileText, 
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { 
  tenantService, 
  propertyService, 
  invoiceService 
} from '@/lib/firebase/db';
import { authService } from '@/lib/firebase/auth';
import { formatCurrency } from '@/lib/utils';

interface SystemStats {
  totalUsers: number;
  totalProperties: number;
  totalTenants: number;
  activeTenants: number;
  totalInvoices: number;
  pendingInvoices: number;
  monthlyRevenue: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

export default function AdminOverviewPage() {
  const { user, isSuperAdmin } = useAdminAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSystemStats();
  }, []);

  const loadSystemStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load data in parallel
      const [properties, tenants, invoices, users] = await Promise.all([
        propertyService.getAll(),
        tenantService.getAll(),
        invoiceService.getAll(),
        authService.getAllUsers(),
      ]);
      
      // Calculate stats
      const activeTenants = tenants.filter(t => t.isActive).length;
      const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
      const monthlyRevenue = tenants
        .filter(t => t.isActive)
        .reduce((sum, t) => sum + t.monthlyRent, 0);
      
      // Get actual user count
      const totalUsers = users.length;
      
      // Determine system health
      let systemHealth: 'healthy' | 'warning' | 'error' = 'healthy';
      if (pendingInvoices > 5) systemHealth = 'warning';
      if (pendingInvoices > 10) systemHealth = 'error';
      
      setStats({
        totalUsers,
        totalProperties: properties.length,
        totalTenants: tenants.length,
        activeTenants,
        totalInvoices: invoices.length,
        pendingInvoices,
        monthlyRevenue,
        systemHealth,
      });
    } catch (err) {
      console.error('Failed to load system stats:', err);
      setError('Failed to load system statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to Load Statistics</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadSystemStats}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
          <p className="text-muted-foreground">
            Administrative dashboard for tenant management system
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {stats?.systemHealth === 'healthy' && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              System Healthy
            </Badge>
          )}
          {stats?.systemHealth === 'warning' && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Needs Attention
            </Badge>
          )}
          {stats?.systemHealth === 'error' && (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Critical Issues
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered system users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              Managed properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeTenants}</div>
            <p className="text-xs text-muted-foreground">
              of {stats?.totalTenants} total tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.monthlyRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Expected monthly income
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Users & Roles
              </Button>
            </Link>
            
            {isSuperAdmin && (
              <Link href="/admin/theme">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Customize App Theme
                </Button>
              </Link>
            )}
            
            <Link href="/dashboard/properties/add">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </Link>
            
            <Link href="/dashboard/tenants/add">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add New Tenant
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Invoices</span>
              <Badge variant={stats?.pendingInvoices === 0 ? "default" : "secondary"}>
                {stats?.pendingInvoices} pending
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Invoices</span>
              <Badge variant="outline">
                {stats?.totalInvoices} generated
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Status</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            
            <div className="pt-3 border-t">
              <Link href="/dashboard">
                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Main Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message for Super Admin */}
      {isSuperAdmin && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Welcome, Super Administrator!
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  You have full administrative access to the tenant management system. 
                  Use the admin panel to manage users, customize themes, and configure system settings.
                </p>
                <div className="flex gap-2">
                  <Link href="/admin/users">
                    <Button size="sm">
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/admin/theme">
                    <Button size="sm" variant="outline">
                      Customize Theme
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
