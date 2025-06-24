'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Star, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  Truck,
  Shield,
  Award,
  TrendingUp,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';
import { Supplier, southAfricanSuppliers, chineseSuppliers, importCalculator } from '@/lib/data/suppliers';
import CN from 'country-flag-icons/react/3x2/CN';
import ZA from 'country-flag-icons/react/3x2/ZA';

interface SupplierComparisonProps {
  onExport?: () => void;
}

export function SupplierComparison({ onExport }: SupplierComparisonProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'South Africa' | 'China'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'reviewCount' | 'name' | 'establishedYear'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  const allSuppliers = [...southAfricanSuppliers, ...chineseSuppliers];

  const filteredSuppliers = useMemo(() => {
    return allSuppliers
      .filter(supplier => {
        const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            supplier.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCountry = selectedCountry === 'all' || supplier.country === selectedCountry;
        const matchesType = selectedType === 'all' || supplier.type === selectedType;
        const matchesPriceRange = selectedPriceRange === 'all' || supplier.priceRange === selectedPriceRange;
        
        return matchesSearch && matchesCountry && matchesType && matchesPriceRange;
      })
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
  }, [searchTerm, selectedCountry, selectedType, selectedPriceRange, sortBy, sortOrder, allSuppliers]);

  const toggleSupplierSelection = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const getSuppliersBySelection = () => {
    return allSuppliers.filter(supplier => selectedSuppliers.includes(supplier.id));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'retailer': return <Globe className="h-4 w-4" />;
      case 'manufacturer': return <Award className="h-4 w-4" />;
      case 'distributor': return <Truck className="h-4 w-4" />;
      case 'marketplace': return <Users className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const calculateImportCosts = (supplier: Supplier, basePrice: number = 10000) => {
    if (supplier.country === 'China') {
      return importCalculator.calculateImportCost(basePrice / 18.5, 'USD', 2); // Assuming 2kg weight
    }
    return null;
  };

  const CountryFlag = ({ country }: { country: string }) => {
    const flagClass = "inline-block w-5 h-4 rounded-sm border border-gray-200 shadow-sm mr-2 animate-in fade-in duration-300";
    
    if (country === 'China') {
      return <CN title="China" aria-label="China flag" className={flagClass} />;
    }
    if (country === 'South Africa') {
      return <ZA title="South Africa" aria-label="South Africa flag" className={flagClass} />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Supplier Comparison</h2>
          <p className="text-muted-foreground">
            Compare {allSuppliers.length} suppliers across South Africa and China
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search suppliers or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCountry} onValueChange={(value: any) => setSelectedCountry(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="China">China</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid-range">Mid-range</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="reviewCount">Reviews</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="establishedYear">Founded</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredSuppliers.length} of {allSuppliers.length} suppliers
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="comparison">Compare Selected ({selectedSuppliers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card 
                key={supplier.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 ${
                  selectedSuppliers.includes(supplier.id) ? 'ring-2 ring-blue-500 shadow-md' : ''
                }`}
                onClick={() => toggleSupplierSelection(supplier.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getTypeIcon(supplier.type)}
                        {supplier.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3" />
                        <div className="flex items-center">
                          <CountryFlag country={supplier.country} />
                          {supplier.country}
                          {supplier.region && ` • ${supplier.region}`}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${getRatingColor(supplier.rating)}`}>
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-semibold">{supplier.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {supplier.reviewCount.toLocaleString()} reviews
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{supplier.type}</Badge>
                      <Badge variant="secondary">{supplier.priceRange}</Badge>
                      {supplier.country === 'China' && (
                        <Badge variant="destructive">Import Required</Badge>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Specialties</h4>
                      <div className="text-xs text-muted-foreground">
                        {supplier.specialties.slice(0, 3).join(', ')}
                        {supplier.specialties.length > 3 && '...'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-medium">Delivery:</span>
                        <br />
                        {supplier.deliveryTime}
                      </div>
                      <div>
                        <span className="font-medium">Founded:</span>
                        <br />
                        {supplier.establishedYear || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(supplier.features)
                          .filter(([_, value]) => value)
                          .slice(0, 4)
                          .map(([feature, _]) => (
                            <span key={feature} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                      </div>
                    </div>

                    {supplier.country === 'China' && (
                      <div className="p-2 bg-yellow-50 rounded">
                        <h5 className="text-xs font-medium text-yellow-800">Import Cost Estimate (R10k order):</h5>
                        {(() => {
                          const costs = calculateImportCosts(supplier);
                          return costs ? (
                            <div className="text-xs text-yellow-700">
                              Total: R{costs.totalCost.toFixed(0)} 
                              (incl. duties & shipping)
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {supplier.website && (
                        <a 
                          href={supplier.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit
                          </Button>
                        </a>
                      )}
                      {supplier.email && (
                        <a 
                          href={`mailto:${supplier.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredSuppliers.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No suppliers found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Supplier</th>
                      <th className="text-left p-4 font-medium">Country</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Rating</th>
                      <th className="text-left p-4 font-medium">Price Range</th>
                      <th className="text-left p-4 font-medium">Delivery</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b hover:bg-gray-50 transition-all duration-150 hover:shadow-sm">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier.specialties.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <CountryFlag country={supplier.country} />
                            <Badge variant="outline">{supplier.country}</Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(supplier.type)}
                            <span className="capitalize">{supplier.type}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`flex items-center gap-1 ${getRatingColor(supplier.rating)}`}>
                            <Star className="h-4 w-4 fill-current" />
                            <span>{supplier.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({supplier.reviewCount})
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{supplier.priceRange}</Badge>
                        </td>
                        <td className="p-4 text-sm">{supplier.deliveryTime}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSupplierSelection(supplier.id)}
                            >
                              {selectedSuppliers.includes(supplier.id) ? 'Remove' : 'Compare'}
                            </Button>
                            {supplier.website && (
                              <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          {selectedSuppliers.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No suppliers selected</h3>
                  <p className="text-gray-600">
                    Select suppliers from the grid or table view to compare them here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium border-r">Attribute</th>
                      {getSuppliersBySelection().map((supplier) => (
                        <th key={supplier.id} className="text-left p-4 font-medium border-r min-w-[200px]">
                          <div className="flex items-center">
                            <CountryFlag country={supplier.country} />
                            {supplier.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'country', label: 'Country' },
                      { key: 'type', label: 'Type' },
                      { key: 'rating', label: 'Rating' },
                      { key: 'reviewCount', label: 'Reviews' },
                      { key: 'priceRange', label: 'Price Range' },
                      { key: 'deliveryTime', label: 'Delivery Time' },
                      { key: 'establishedYear', label: 'Founded' },
                      { key: 'website', label: 'Website' },
                    ].map((attribute) => (
                      <tr key={attribute.key} className="border-b">
                        <td className="p-4 font-medium bg-gray-50 border-r">{attribute.label}</td>
                        {getSuppliersBySelection().map((supplier) => (
                          <td key={supplier.id} className="p-4 border-r">
                            {attribute.key === 'website' ? (
                              <a 
                                href={supplier[attribute.key] as string} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visit Site
                              </a>
                            ) : attribute.key === 'rating' ? (
                              <div className={`flex items-center gap-1 ${getRatingColor(supplier.rating)}`}>
                                <Star className="h-4 w-4 fill-current" />
                                {supplier.rating}
                              </div>
                            ) : (
                              (supplier as any)[attribute.key]?.toString() || 'N/A'
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}