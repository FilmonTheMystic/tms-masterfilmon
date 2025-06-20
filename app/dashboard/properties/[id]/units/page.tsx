'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  ArrowLeft,
  Plus,
  Home,
  Users,
  DollarSign,
  Search,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { propertyService } from '@/lib/firebase/db';
import type { Property } from '@/types';
import { useToast } from '@/lib/hooks/use-toast';

interface Unit {
  id: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  rentAmount: number;
  status: 'available' | 'occupied' | 'maintenance';
  tenantId?: string;
  tenantName?: string;
}

export default function PropertyUnitsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (params.id) {
      loadProperty();
      loadUnits();
    }
  }, [params.id]);

  const loadProperty = async () => {
    try {
      const data = await propertyService.getById(params.id as string);
      if (data) {
        setProperty(data);
      } else {
        router.push('/dashboard/properties');
      }
    } catch (error) {
      console.error('Failed to load property:', error);
      router.push('/dashboard/properties');
    }
  };

  const loadUnits = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockUnits: Unit[] = Array.from({ length: property?.totalUnits || 5 }, (_, index) => ({
        id: `unit-${index + 1}`,
        unitNumber: `${index + 1}A`,
        bedrooms: Math.floor(Math.random() * 3) + 1,
        bathrooms: Math.floor(Math.random() * 2) + 1,
        squareFeet: 800 + Math.floor(Math.random() * 400),
        rentAmount: 1200 + Math.floor(Math.random() * 800),
        status: ['available', 'occupied', 'maintenance'][Math.floor(Math.random() * 3)] as any,
        tenantName: Math.random() > 0.5 ? 'John Doe' : undefined
      }));
      
      setUnits(mockUnits);
    } catch (error) {
      console.error('Failed to load units:', error);
      toast({
        title: 'Error',
        description: 'Failed to load units. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUnits = units.filter(unit =>
    unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.tenantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Unit['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Unit['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

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
        <Link href={`/dashboard/properties/${property.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Property
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Manage Units</h1>
          <p className="text-muted-foreground">{property.name} - {units.length} units</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{units.length}</p>
                <p className="text-sm text-muted-foreground">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {units.filter(u => u.status === 'occupied').length}
                </p>
                <p className="text-sm text-muted-foreground">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {units.filter(u => u.status === 'available').length}
                </p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  ${units.reduce((sum, unit) => sum + unit.rentAmount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Rent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Units Grid */}
      {filteredUnits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No units found' : 'No units yet'}
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Start by adding units to this property.'
              }
            </p>
            {!searchQuery && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Unit
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => (
            <UnitCard 
              key={unit.id} 
              unit={unit} 
              propertyId={property.id}
              onUpdate={loadUnits}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface UnitCardProps {
  unit: Unit;
  propertyId: string;
  onUpdate: () => void;
}

function UnitCard({ unit, propertyId, onUpdate }: UnitCardProps) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      // Mock delete - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate();
      toast({
        title: 'Unit deleted',
        description: 'Unit has been deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete unit:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete unit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: Unit['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Unit['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">Unit {unit.unitNumber}</CardTitle>
            <Badge className={getStatusColor(unit.status)}>
              {getStatusText(unit.status)}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Edit className="h-3 w-3" />
            </Button>
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
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Bedrooms:</span>
              <span className="ml-1 font-medium">{unit.bedrooms}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Bathrooms:</span>
              <span className="ml-1 font-medium">{unit.bathrooms}</span>
            </div>
          </div>
          
          {unit.squareFeet && (
            <div className="text-sm">
              <span className="text-muted-foreground">Size:</span>
              <span className="ml-1 font-medium">{unit.squareFeet} sq ft</span>
            </div>
          )}
          
          <div className="text-sm">
            <span className="text-muted-foreground">Rent:</span>
            <span className="ml-1 font-medium text-lg">${unit.rentAmount.toLocaleString()}/month</span>
          </div>

          {unit.tenantName && (
            <div className="text-sm">
              <span className="text-muted-foreground">Tenant:</span>
              <span className="ml-1 font-medium">{unit.tenantName}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {unit.status === 'available' ? (
              <Button variant="outline" size="sm" className="flex-1">
                <Users className="h-3 w-3 mr-1" />
                Add Tenant
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex-1">
                <Users className="h-3 w-3 mr-1" />
                View Tenant
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1">
              <DollarSign className="h-3 w-3 mr-1" />
              Generate Invoice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}