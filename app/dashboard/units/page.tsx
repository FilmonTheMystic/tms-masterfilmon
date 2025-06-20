'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  Search, 
  Filter,
  Users,
  DollarSign,
  Building2,
  Edit,
  Trash2,
  Plus,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import { unitService, propertyService, tenantQueries } from '@/lib/firebase/db';
import type { Unit, Property, Tenant } from '@/types';
import { useToast } from '@/lib/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface UnitWithDetails extends Unit {
  property?: Property;
  tenant?: Tenant;
}

export default function UnitsPage() {
  const [units, setUnits] = useState<UnitWithDetails[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all units and properties
      const [unitsData, propertiesData] = await Promise.all([
        unitService.getAll(),
        propertyService.getAll()
      ]);
      
      setProperties(propertiesData);
      
      // Enhance units with property and tenant information
      const unitsWithDetails = await Promise.all(
        unitsData.map(async (unit) => {
          const property = propertiesData.find(p => p.id === unit.propertyId);
          let tenant;
          
          if (unit.isOccupied) {
            tenant = await tenantQueries.getByUnitId(unit.id);
          }
          
          return {
            ...unit,
            property,
            tenant
          };
        })
      );
      
      setUnits(unitsWithDetails);
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

  const filteredUnits = units.filter(unit => {
    const matchesSearch = 
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.tenant?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.tenant?.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProperty = selectedProperty === 'all' || unit.propertyId === selectedProperty;
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'occupied' && unit.isOccupied) ||
      (statusFilter === 'available' && !unit.isOccupied);
    
    return matchesSearch && matchesProperty && matchesStatus;
  });

  const getUnitStatus = (unit: UnitWithDetails) => {
    if (unit.isOccupied && unit.tenant) {
      return { status: 'occupied', text: 'Occupied', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { status: 'available', text: 'Available', color: 'bg-green-100 text-green-800' };
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Units</h1>
          <p className="text-muted-foreground">
            Manage all units across your properties
          </p>
        </div>
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
                  {units.filter(u => u.isOccupied).length}
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
                  {units.filter(u => !u.isOccupied).length}
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
                  {formatCurrency(units.reduce((sum, unit) => sum + (unit.baseRent || 0), 0))}
                </p>
                <p className="text-sm text-muted-foreground">Total Rent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search units, properties, or tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="available">Available</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Units Grid */}
      {filteredUnits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || selectedProperty !== 'all' || statusFilter !== 'all' 
                ? 'No units found' 
                : 'No units yet'
              }
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              {searchQuery || selectedProperty !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Units will appear here when you create properties with units.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => (
            <UnitCard 
              key={unit.id} 
              unit={unit} 
              onUpdate={loadData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface UnitCardProps {
  unit: UnitWithDetails;
  onUpdate: () => void;
}

function UnitCard({ unit, onUpdate }: UnitCardProps) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await unitService.delete(unit.id);
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

  const unitStatus = unit.isOccupied && unit.tenant
    ? { status: 'occupied', text: 'Occupied', color: 'bg-blue-100 text-blue-800' }
    : { status: 'available', text: 'Available', color: 'bg-green-100 text-green-800' };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">
              Unit {unit.unitNumber}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={unitStatus.color}>
                {unitStatus.text}
              </Badge>
              {unit.property && (
                <Link 
                  href={`/dashboard/properties/${unit.propertyId}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {unit.property.name}
                </Link>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Link href={`/dashboard/properties/${unit.propertyId}/units`}>
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
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-1 font-medium capitalize">{unit.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>
              <span className="ml-1 font-medium">{unit.size} sqm</span>
            </div>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Base Rent:</span>
            <span className="ml-1 font-medium text-lg">
              {formatCurrency(unit.baseRent || 0)}/month
            </span>
          </div>

          {unit.deposit > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Deposit:</span>
              <span className="ml-1 font-medium">{formatCurrency(unit.deposit)}</span>
            </div>
          )}

          {unit.tenant && (
            <div className="text-sm">
              <span className="text-muted-foreground">Tenant:</span>
              <span className="ml-1 font-medium">
                {unit.tenant.firstName} {unit.tenant.lastName}
              </span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {!unit.isOccupied ? (
              <Link href={`/dashboard/tenants/add?unitId=${unit.id}&propertyId=${unit.propertyId}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="h-3 w-3 mr-1" />
                  Add Tenant
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                toast({
                  title: 'View Tenant',
                  description: 'Tenant view functionality coming soon.',
                });
              }}>
                <Users className="h-3 w-3 mr-1" />
                View Tenant
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1" onClick={() => {
              if (!unit.isOccupied) {
                toast({
                  title: 'No Tenant',
                  description: 'Add a tenant to this unit before generating an invoice.',
                  variant: 'destructive',
                });
              } else {
                toast({
                  title: 'Generate Invoice',
                  description: 'Invoice generation functionality coming soon.',
                });
              }
            }}>
              <Receipt className="h-3 w-3 mr-1" />
              Generate Invoice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}