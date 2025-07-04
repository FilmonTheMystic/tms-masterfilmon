'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, 
  ArrowLeft,
  Plus,
  Home,
  Users,
  DollarSign,
  Search,
  Edit,
  Trash2,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import { propertyService, unitService, unitQueries, tenantQueries } from '@/lib/firebase/db';
import type { Property, Unit, Tenant } from '@/types';
import { useToast } from '@/lib/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface UnitWithTenant extends Unit {
  tenant?: Tenant;
}

export default function PropertyUnitsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<UnitWithTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);
  const [addingUnit, setAddingUnit] = useState(false);
  const [newUnitForm, setNewUnitForm] = useState({
    unitNumber: '',
    type: '1bed' as const,
    size: 50,
    baseRent: 0,
    deposit: 0
  });

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
        // Create units if they don't exist for existing properties
        await propertyService.createUnitsForExistingProperty(data.id, data.totalUnits);
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
      if (!params.id) return;
      
      // Load units from database
      const unitsData = await unitQueries.getByPropertyId(params.id as string);
      
      // Load tenant information for each unit
      const unitsWithTenants = await Promise.all(
        unitsData.map(async (unit) => {
          if (unit.isOccupied) {
            const tenant = await tenantQueries.getByUnitId(unit.id);
            return { ...unit, tenant };
          }
          return { ...unit };
        })
      );
      
      setUnits(unitsWithTenants);
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

  const handleAddUnit = async () => {
    if (!property || !newUnitForm.unitNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setAddingUnit(true);
    try {
      await unitService.create({
        propertyId: property.id,
        unitNumber: newUnitForm.unitNumber,
        type: newUnitForm.type,
        size: newUnitForm.size,
        baseRent: newUnitForm.baseRent,
        deposit: newUnitForm.deposit,
        isOccupied: false,
      });

      toast({
        title: 'Unit added',
        description: 'New unit has been added successfully.',
      });

      setAddUnitDialogOpen(false);
      setNewUnitForm({
        unitNumber: '',
        type: '1bed',
        size: 50,
        baseRent: 0,
        deposit: 0
      });
      loadUnits();
    } catch (error) {
      console.error('Failed to add unit:', error);
      toast({
        title: 'Error',
        description: 'Failed to add unit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAddingUnit(false);
    }
  };

  const filteredUnits = units.filter(unit =>
    unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.tenant?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.tenant?.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUnitStatus = (unit: UnitWithTenant) => {
    if (unit.isOccupied && unit.tenant) {
      return { status: 'occupied', text: 'Occupied', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { status: 'available', text: 'Available', color: 'bg-green-100 text-green-800' };
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
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
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/properties/${property.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Property
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Manage Units</h1>
          <nav className="text-sm text-muted-foreground">
            <Link href="/dashboard/properties" className="hover:text-primary">Properties</Link>
            <span className="mx-2">/</span>
            <Link href={`/dashboard/properties/${property.id}`} className="hover:text-primary">{property.name}</Link>
            <span className="mx-2">/</span>
            <span>Units</span>
          </nav>
        </div>
        <Dialog open={addUnitDialogOpen} onOpenChange={setAddUnitDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  id="unitNumber"
                  value={newUnitForm.unitNumber}
                  onChange={(e) => setNewUnitForm(prev => ({ ...prev, unitNumber: e.target.value }))}
                  placeholder="Enter unit number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Unit Type</Label>
                <Select value={newUnitForm.type} onValueChange={(value: any) => setNewUnitForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1bed">1 Bedroom</SelectItem>
                    <SelectItem value="2bed">2 Bedroom</SelectItem>
                    <SelectItem value="3bed">3 Bedroom</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size (sqm)</Label>
                  <Input
                    id="size"
                    type="number"
                    value={newUnitForm.size}
                    onChange={(e) => setNewUnitForm(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="baseRent">Base Rent (ZAR)</Label>
                  <Input
                    id="baseRent"
                    type="number"
                    value={newUnitForm.baseRent}
                    onChange={(e) => setNewUnitForm(prev => ({ ...prev, baseRent: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deposit">Deposit (ZAR)</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={newUnitForm.deposit}
                  onChange={(e) => setNewUnitForm(prev => ({ ...prev, deposit: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAddUnitDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUnit} disabled={addingUnit}>
                  {addingUnit ? 'Adding...' : 'Add Unit'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
  unit: UnitWithTenant;
  propertyId: string;
  onUpdate: () => void;
}

function UnitCard({ unit, propertyId, onUpdate }: UnitCardProps) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    unitNumber: unit.unitNumber,
    type: unit.type,
    size: unit.size,
    baseRent: unit.baseRent,
    deposit: unit.deposit
  });

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

  const handleEdit = async () => {
    setEditing(true);
    try {
      await unitService.update(unit.id, {
        unitNumber: editForm.unitNumber,
        type: editForm.type,
        size: editForm.size,
        baseRent: editForm.baseRent,
        deposit: editForm.deposit
      });

      toast({
        title: 'Unit updated',
        description: 'Unit has been updated successfully.',
      });

      setEditDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update unit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update unit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setEditing(false);
    }
  };

  const getUnitStatus = (unit: UnitWithTenant) => {
    if (unit.isOccupied && unit.tenant) {
      return { status: 'occupied', text: 'Occupied', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { status: 'available', text: 'Available', color: 'bg-green-100 text-green-800' };
    }
  };

  const unitStatus = getUnitStatus(unit);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">Unit {unit.unitNumber}</CardTitle>
            <Badge className={unitStatus.color}>
              {unitStatus.text}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Unit {unit.unitNumber}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editUnitNumber">Unit Number</Label>
                    <Input
                      id="editUnitNumber"
                      value={editForm.unitNumber}
                      onChange={(e) => setEditForm(prev => ({ ...prev, unitNumber: e.target.value }))}
                      placeholder="Enter unit number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="editType">Unit Type</Label>
                    <Select value={editForm.type} onValueChange={(value: any) => setEditForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="1bed">1 Bedroom</SelectItem>
                        <SelectItem value="2bed">2 Bedroom</SelectItem>
                        <SelectItem value="3bed">3 Bedroom</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editSize">Size (sqm)</Label>
                      <Input
                        id="editSize"
                        type="number"
                        value={editForm.size}
                        onChange={(e) => setEditForm(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editBaseRent">Base Rent (ZAR)</Label>
                      <Input
                        id="editBaseRent"
                        type="number"
                        value={editForm.baseRent}
                        onChange={(e) => setEditForm(prev => ({ ...prev, baseRent: parseInt(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="editDeposit">Deposit (ZAR)</Label>
                    <Input
                      id="editDeposit"
                      type="number"
                      value={editForm.deposit}
                      onChange={(e) => setEditForm(prev => ({ ...prev, deposit: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEdit} disabled={editing}>
                      {editing ? 'Updating...' : 'Update Unit'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
              <Link href={`/dashboard/tenants/add?unitId=${unit.id}&propertyId=${propertyId}`} className="flex-1">
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