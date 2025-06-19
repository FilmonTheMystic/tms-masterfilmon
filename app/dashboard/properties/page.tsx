'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Edit, 
  Trash2,
  Users,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { propertyService } from '@/lib/firebase/db';
import type { Property } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-muted-foreground">
            Manage your properties and units
          </p>
        </div>
        <Link href="/dashboard/properties/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No properties found' : 'No properties yet'}
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Start by adding your first property to manage tenants and generate invoices.'
              }
            </p>
            {!searchQuery && (
              <Link href="/dashboard/properties/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onUpdate={loadProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
  onUpdate: () => void;
}

function PropertyCard({ property, onUpdate }: PropertyCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await propertyService.delete(property.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{property.name}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {property.city}
            </div>
            <Badge variant="outline" className="text-xs">
              {property.propertyType}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Link href={`/dashboard/properties/${property.id}/edit`}>
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
          <div className="text-sm text-muted-foreground">
            {property.address}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <Home className="h-3 w-3" />
              <span>{property.totalUnits} units</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-3 w-3" />
              <span>0 tenants</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-1">Bank Details</div>
            <div className="text-sm font-medium">{property.bankDetails.accountName}</div>
            <div className="text-xs text-muted-foreground">
              {property.bankDetails.bankName} • {property.bankDetails.accountType}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Link href={`/dashboard/properties/${property.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            <Link href={`/dashboard/properties/${property.id}/units`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Manage Units
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}