'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Edit, 
  ArrowLeft,
  Home,
  Users,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { propertyService } from '@/lib/firebase/db';
import type { Property } from '@/types';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadProperty();
    }
  }, [params.id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getById(params.id as string);
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
      router.push('/dashboard/properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Property not found</h3>
            <p className="text-muted-foreground mb-4">
              The property you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/dashboard/properties">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-muted-foreground">Property details and management</p>
        </div>
        <Link href={`/dashboard/properties/${property.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Property Name</label>
              <p className="text-lg font-semibold">{property.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Property Type</label>
              <div className="mt-1">
                <Badge variant="outline">{property.propertyType}</Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Units</label>
              <div className="flex items-center gap-2 mt-1">
                <Home className="h-4 w-4" />
                <span className="font-medium">{property.totalUnits} units</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p>{property.address}</p>
                  <p className="text-muted-foreground">
                    {property.city}, {property.province} {property.postalCode}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Name</label>
              <p className="font-medium">{property.bankDetails.accountName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
              <p className="font-medium">{property.bankDetails.bankName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                <p className="font-mono text-sm">{property.bankDetails.accountNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Branch Code</label>
                <p className="font-mono text-sm">{property.bankDetails.branchCode}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Type</label>
              <Badge variant="secondary">{property.bankDetails.accountType}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={`/dashboard/properties/${property.id}/units`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Manage Units
              </Button>
            </Link>
            
            <Link href={`/dashboard/tenants/add?propertyId=${property.id}`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add Tenant
              </Button>
            </Link>
            
            <Link href={`/dashboard/invoices/generate?propertyId=${property.id}`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground">
                Activity will appear here once you start managing tenants
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}