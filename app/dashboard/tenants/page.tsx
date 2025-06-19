'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { tenantService, propertyService } from '@/lib/firebase/db';
import type { Tenant, Property } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tenantsData, propertiesData] = await Promise.all([
        tenantService.getAll(),
        propertyService.getAll()
      ]);
      setTenants(tenantsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.phone.includes(searchQuery)
  );

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-muted-foreground">
            Manage your tenants and lease agreements
          </p>
        </div>
        <Link href="/dashboard/tenants/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </Link>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{tenants.filter(t => t.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active Tenants</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{tenants.filter(t => !t.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </div>
        </Card>
      </div>

      {/* Tenants Grid */}
      {filteredTenants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No tenants found' : 'No tenants yet'}
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Start by adding tenants to your properties to track payments and generate invoices.'
              }
            </p>
            {!searchQuery && (
              <Link href="/dashboard/tenants/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Tenant
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <TenantCard 
              key={tenant.id} 
              tenant={tenant} 
              propertyName={getPropertyName(tenant.propertyId)}
              onUpdate={loadData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TenantCardProps {
  tenant: Tenant;
  propertyName: string;
  onUpdate: () => void;
}

function TenantCard({ tenant, propertyName, onUpdate }: TenantCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this tenant? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await tenantService.delete(tenant.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete tenant:', error);
      alert('Failed to remove tenant. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const isLeaseExpiringSoon = () => {
    const leaseEnd = new Date(tenant.leaseEnd);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isLeaseExpired = () => {
    return new Date(tenant.leaseEnd) < new Date();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">
              {tenant.firstName} {tenant.lastName}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={tenant.isActive ? "default" : "secondary"}>
                {tenant.isActive ? "Active" : "Inactive"}
              </Badge>
              {isLeaseExpired() && (
                <Badge variant="destructive">Lease Expired</Badge>
              )}
              {isLeaseExpiringSoon() && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Expiring Soon
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 className="h-3 w-3 mr-1" />
              {propertyName}
            </div>
          </div>
          <div className="flex gap-1">
            <Link href={`/dashboard/tenants/${tenant.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-3 w-3" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{tenant.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{tenant.phone}</span>
          </div>

          <div className="text-sm">
            <div className="text-muted-foreground">Monthly Rent</div>
            <div className="font-semibold text-lg">{formatCurrency(tenant.monthlyRent)}</div>
          </div>

          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Lease Start</div>
                <div>{formatDate(tenant.leaseStart)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Lease End</div>
                <div>{formatDate(tenant.leaseEnd)}</div>
              </div>
            </div>
          </div>

          {tenant.companyName && (
            <div className="text-sm">
              <div className="text-muted-foreground">Company</div>
              <div className="font-medium">{tenant.companyName}</div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Link href={`/dashboard/tenants/${tenant.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            <Link href={`/dashboard/invoices/generate?tenant=${tenant.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Generate Invoice
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}