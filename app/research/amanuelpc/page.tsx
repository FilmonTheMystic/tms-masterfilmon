'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Zap, 
  ExternalLink, 
  ShoppingCart,
  Wifi,
  MemoryStick,
  Settings,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface Component {
  id: string;
  category: string;
  name: string;
  brand: string;
  specs: string[];
  price: number;
  supplier: string;
  supplierUrl: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  performance: 'budget' | 'mid-range' | 'high-end' | 'enthusiast';
  recommended?: boolean;
}

interface BuildConfiguration {
  name: string;
  description: string;
  totalPrice: number;
  components: Component[];
  performance: string;
  useCase: string;
}

const components: Component[] = [
  // Graphics Cards
  {
    id: 'rtx4070-msi',
    category: 'Graphics Card',
    name: 'MSI GeForce RTX 4070 GAMING X TRIO',
    brand: 'MSI',
    specs: ['12GB GDDR6X', '2610MHz Boost Clock', 'Triple Fan Cooling', 'RGB Lighting'],
    price: 18500,
    supplier: 'Evetech',
    supplierUrl: 'https://www.evetech.co.za',
    availability: 'in-stock',
    performance: 'high-end',
    recommended: true
  },
  {
    id: 'rtx4060ti-palit',
    category: 'Graphics Card',
    name: 'Palit GeForce RTX 4060 Ti Dual',
    brand: 'Palit',
    specs: ['8GB GDDR6', '2540MHz Boost Clock', 'Dual Fan Cooling', 'Compact Design'],
    price: 9699,
    supplier: 'Wootware',
    supplierUrl: 'https://www.wootware.co.za',
    availability: 'in-stock',
    performance: 'mid-range'
  },
  {
    id: 'rtx4080-asus',
    category: 'Graphics Card',
    name: 'ASUS ROG Strix RTX 4080 OC',
    brand: 'ASUS',
    specs: ['16GB GDDR6X', '2625MHz Boost Clock', 'Triple Fan Cooling', 'RGB Lighting'],
    price: 28500,
    supplier: 'PC International',
    supplierUrl: 'https://pcinternational.co.za',
    availability: 'low-stock',
    performance: 'enthusiast'
  },

  // Processors
  {
    id: 'ryzen7-7700x',
    category: 'Processor',
    name: 'AMD Ryzen 7 7700X',
    brand: 'AMD',
    specs: ['8 Cores / 16 Threads', '4.5GHz Base / 5.4GHz Boost', 'AM5 Socket', '65W TDP'],
    price: 6500,
    supplier: 'Dreamware',
    supplierUrl: 'https://www.dreamwaretech.co.za',
    availability: 'in-stock',
    performance: 'high-end',
    recommended: true
  },
  {
    id: 'intel-i5-13600k',
    category: 'Processor',
    name: 'Intel Core i5-13600K',
    brand: 'Intel',
    specs: ['14 Cores (6P+8E)', '3.5GHz Base / 5.1GHz Boost', 'LGA1700 Socket', '125W TDP'],
    price: 7200,
    supplier: 'Evetech',
    supplierUrl: 'https://www.evetech.co.za',
    availability: 'in-stock',
    performance: 'high-end'
  },

  // Motherboards
  {
    id: 'b650-msi',
    category: 'Motherboard',
    name: 'MSI B650 GAMING PLUS WIFI',
    brand: 'MSI',
    specs: ['AM5 Socket', 'DDR5 Support', 'WiFi 6E', 'PCIe 5.0', '4x DIMM Slots'],
    price: 3200,
    supplier: 'Wootware',
    supplierUrl: 'https://www.wootware.co.za',
    availability: 'in-stock',
    performance: 'mid-range',
    recommended: true
  },
  {
    id: 'z790-asus',
    category: 'Motherboard',
    name: 'ASUS PRIME Z790-P WIFI',
    brand: 'ASUS',
    specs: ['LGA1700 Socket', 'DDR5 Support', 'WiFi 6', 'PCIe 5.0', '4x DIMM Slots'],
    price: 4500,
    supplier: 'PC International',
    supplierUrl: 'https://pcinternational.co.za',
    availability: 'in-stock',
    performance: 'high-end'
  },

  // RAM
  {
    id: 'corsair-32gb-ddr5',
    category: 'Memory',
    name: 'Corsair Vengeance DDR5-5600 32GB (2x16GB)',
    brand: 'Corsair',
    specs: ['32GB Kit (2x16GB)', 'DDR5-5600', 'CL36', 'Black Heat Spreaders'],
    price: 3500,
    supplier: 'Dreamware',
    supplierUrl: 'https://www.dreamwaretech.co.za',
    availability: 'in-stock',
    performance: 'high-end',
    recommended: true
  },
  {
    id: 'gskill-64gb-ddr5',
    category: 'Memory',
    name: 'G.Skill Trident Z5 DDR5-6000 64GB (2x32GB)',
    brand: 'G.Skill',
    specs: ['64GB Kit (2x32GB)', 'DDR5-6000', 'CL30', 'RGB Lighting'],
    price: 8500,
    supplier: 'Evetech',
    supplierUrl: 'https://www.evetech.co.za',
    availability: 'low-stock',
    performance: 'enthusiast'
  },

  // Storage
  {
    id: 'samsung-2tb-nvme',
    category: 'Storage',
    name: 'Samsung 990 PRO 2TB NVMe SSD',
    brand: 'Samsung',
    specs: ['2TB Capacity', 'PCIe 4.0', '7000MB/s Read', '6900MB/s Write', '5-Year Warranty'],
    price: 4200,
    supplier: 'Wootware',
    supplierUrl: 'https://www.wootware.co.za',
    availability: 'in-stock',
    performance: 'high-end',
    recommended: true
  },
  {
    id: 'wd-4tb-nvme',
    category: 'Storage',
    name: 'WD Black SN850X 4TB NVMe SSD',
    brand: 'Western Digital',
    specs: ['4TB Capacity', 'PCIe 4.0', '7300MB/s Read', '6600MB/s Write', 'Gaming Optimized'],
    price: 8900,
    supplier: 'PC International',
    supplierUrl: 'https://pcinternational.co.za',
    availability: 'in-stock',
    performance: 'enthusiast'
  },

  // Power Supply
  {
    id: 'corsair-850w',
    category: 'Power Supply',
    name: 'Corsair RM850x 850W 80+ Gold',
    brand: 'Corsair',
    specs: ['850W Output', '80+ Gold Efficiency', 'Fully Modular', '10-Year Warranty'],
    price: 2800,
    supplier: 'Dreamware',
    supplierUrl: 'https://www.dreamwaretech.co.za',
    availability: 'in-stock',
    performance: 'high-end',
    recommended: true
  },
  {
    id: 'seasonic-1000w',
    category: 'Power Supply',
    name: 'Seasonic Focus GX-1000 1000W 80+ Gold',
    brand: 'Seasonic',
    specs: ['1000W Output', '80+ Gold Efficiency', 'Fully Modular', '10-Year Warranty'],
    price: 4200,
    supplier: 'Evetech',
    supplierUrl: 'https://www.evetech.co.za',
    availability: 'in-stock',
    performance: 'enthusiast'
  },

  // Cases
  {
    id: 'fractal-meshify',
    category: 'Case',
    name: 'Fractal Design Meshify C',
    brand: 'Fractal Design',
    specs: ['Mid-Tower', 'Tempered Glass', 'Mesh Front Panel', 'Cable Management'],
    price: 1800,
    supplier: 'Wootware',
    supplierUrl: 'https://www.wootware.co.za',
    availability: 'in-stock',
    performance: 'mid-range',
    recommended: true
  },
  {
    id: 'lian-li-dynamic',
    category: 'Case',
    name: 'Lian Li PC-O11 Dynamic',
    brand: 'Lian Li',
    specs: ['Mid-Tower', 'Dual Tempered Glass', 'Water Cooling Ready', 'Premium Build'],
    price: 3200,
    supplier: 'PC International',
    supplierUrl: 'https://pcinternational.co.za',
    availability: 'in-stock',
    performance: 'high-end'
  }
];

const buildConfigurations: BuildConfiguration[] = [
  {
    name: 'Balanced Gaming Build',
    description: 'Perfect balance of performance and value for 1440p gaming',
    totalPrice: 31699,
    performance: 'High-End',
    useCase: '1440p Gaming, Content Creation',
    components: [
      components.find(c => c.id === 'rtx4070-msi')!,
      components.find(c => c.id === 'ryzen7-7700x')!,
      components.find(c => c.id === 'b650-msi')!,
      components.find(c => c.id === 'corsair-32gb-ddr5')!,
      components.find(c => c.id === 'samsung-2tb-nvme')!,
      components.find(c => c.id === 'corsair-850w')!,
      components.find(c => c.id === 'fractal-meshify')!,
    ]
  },
  {
    name: 'Budget Gaming Build',
    description: 'Great performance for 1080p gaming without breaking the bank',
    totalPrice: 22899,
    performance: 'Mid-Range',
    useCase: '1080p Gaming, General Use',
    components: [
      components.find(c => c.id === 'rtx4060ti-palit')!,
      components.find(c => c.id === 'ryzen7-7700x')!,
      components.find(c => c.id === 'b650-msi')!,
      components.find(c => c.id === 'corsair-32gb-ddr5')!,
      components.find(c => c.id === 'samsung-2tb-nvme')!,
      components.find(c => c.id === 'corsair-850w')!,
      components.find(c => c.id === 'fractal-meshify')!,
    ]
  },
  {
    name: 'Enthusiast Build',
    description: 'No compromises - ultimate performance for 4K gaming and professional work',
    totalPrice: 59100,
    performance: 'Enthusiast',
    useCase: '4K Gaming, Professional Content Creation',
    components: [
      components.find(c => c.id === 'rtx4080-asus')!,
      components.find(c => c.id === 'intel-i5-13600k')!,
      components.find(c => c.id === 'z790-asus')!,
      components.find(c => c.id === 'gskill-64gb-ddr5')!,
      components.find(c => c.id === 'wd-4tb-nvme')!,
      components.find(c => c.id === 'seasonic-1000w')!,
      components.find(c => c.id === 'lian-li-dynamic')!,
    ]
  }
];

const serviceProviders = [
  {
    name: 'Custom Build Service',
    description: 'Professional assembly and testing',
    basePrice: 1500,
    percentage: 5,
    provider: 'Local Technician'
  },
  {
    name: 'Evetech Assembly',
    description: 'Factory assembly with warranty',
    basePrice: 2000,
    percentage: 7,
    provider: 'Evetech'
  },
  {
    name: 'Premium Build Service',
    description: 'Assembly + cable management + benchmarking',
    basePrice: 2500,
    percentage: 8,
    provider: 'Specialist Builder'
  }
];

export default function AmanuelPCPage() {
  const [selectedBuild, setSelectedBuild] = useState(buildConfigurations[0]);
  const [selectedService, setSelectedService] = useState(serviceProviders[0]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'budget': return 'bg-blue-100 text-blue-800';
      case 'mid-range': return 'bg-purple-100 text-purple-800';
      case 'high-end': return 'bg-orange-100 text-orange-800';
      case 'enthusiast': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Graphics Card': return Monitor;
      case 'Processor': return Cpu;
      case 'Memory': return MemoryStick;
      case 'Storage': return HardDrive;
      case 'Power Supply': return Zap;
      case 'Motherboard': return Settings;
      case 'Case': return Settings;
      default: return Settings;
    }
  };

  const calculateServiceCost = (buildPrice: number, service: typeof serviceProviders[0]) => {
    const percentageCost = (buildPrice * service.percentage) / 100;
    return Math.max(service.basePrice, percentageCost);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Amanuel's Gaming PC Research</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of modern gaming PC components and pricing in South Africa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Price Tracker
          </Button>
          <Button size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generate Quote
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suppliers Tracked</p>
                <p className="text-2xl font-bold text-blue-600">4</p>
              </div>
              <ExternalLink className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Components Analyzed</p>
                <p className="text-2xl font-bold text-green-600">{components.length}</p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Range</p>
                <p className="text-xl font-bold text-orange-600">R22k - R59k</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assembly Cost</p>
                <p className="text-xl font-bold text-purple-600">5-8%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="builds" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builds">Build Configurations</TabsTrigger>
          <TabsTrigger value="components">Component Analysis</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Comparison</TabsTrigger>
          <TabsTrigger value="services">Assembly Services</TabsTrigger>
        </TabsList>

        <TabsContent value="builds" className="space-y-6">
          <div className="grid gap-6">
            {buildConfigurations.map((build, index) => (
              <Card key={index} className={`${selectedBuild.name === build.name ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {build.name}
                        {index === 0 && <Badge variant="secondary">Recommended</Badge>}
                      </CardTitle>
                      <CardDescription>{build.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R{build.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{build.performance}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Performance Level</h4>
                        <Badge className={getPerformanceColor(build.performance.toLowerCase().replace(' ', '-'))}>
                          {build.performance}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Use Case</h4>
                        <p className="text-sm text-muted-foreground">{build.useCase}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Components</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {build.components.map((component, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = getCategoryIcon(component.category);
                                return <Icon className="h-4 w-4 text-gray-600" />;
                              })()}
                              <span className="text-sm font-medium">{component.category}</span>
                            </div>
                            <span className="text-sm text-green-600 font-medium">
                              R{component.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setSelectedBuild(build)}
                        variant={selectedBuild.name === build.name ? "default" : "outline"}
                      >
                        Select Build
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <div className="grid gap-6">
            {Object.entries(
              components.reduce((acc, component) => {
                if (!acc[component.category]) acc[component.category] = [];
                acc[component.category].push(component);
                return acc;
              }, {} as Record<string, Component[]>)
            ).map(([category, categoryComponents]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const Icon = getCategoryIcon(category);
                      return <Icon className="h-5 w-5" />;
                    })()}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {categoryComponents.map((component) => (
                      <div key={component.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {component.name}
                              {component.recommended && <Badge variant="secondary">Recommended</Badge>}
                            </h4>
                            <p className="text-sm text-muted-foreground">{component.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">
                              R{component.price.toLocaleString()}
                            </p>
                            <Badge className={getAvailabilityColor(component.availability)}>
                              {component.availability.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h5 className="font-medium mb-1">Specifications</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {component.specs.map((spec, idx) => (
                                <li key={idx}>• {spec}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Performance: </span>
                              <Badge className={getPerformanceColor(component.performance)}>
                                {component.performance.replace('-', ' ')}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Supplier: </span>
                              <a 
                                href={component.supplierUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                {component.supplier} <ExternalLink className="h-3 w-3 inline" />
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Build
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Evetech',
                url: 'https://www.evetech.co.za',
                description: 'Leading South African gaming PC specialist',
                strengths: ['Wide product range', 'Gaming focus', 'Competitive pricing', 'Fast delivery'],
                components: components.filter(c => c.supplier === 'Evetech').length,
                avgPrice: Math.round(components.filter(c => c.supplier === 'Evetech').reduce((sum, c) => sum + c.price, 0) / components.filter(c => c.supplier === 'Evetech').length)
              },
              {
                name: 'Wootware',
                url: 'https://www.wootware.co.za',
                description: 'Premium computer hardware retailer',
                strengths: ['Quality products', 'Excellent service', 'Technical expertise', 'Warranty support'],
                components: components.filter(c => c.supplier === 'Wootware').length,
                avgPrice: Math.round(components.filter(c => c.supplier === 'Wootware').reduce((sum, c) => sum + c.price, 0) / components.filter(c => c.supplier === 'Wootware').length)
              },
              {
                name: 'PC International',
                url: 'https://pcinternational.co.za',
                description: 'Comprehensive IT solutions provider',
                strengths: ['Business focus', 'Volume pricing', 'Custom solutions', 'Professional service'],
                components: components.filter(c => c.supplier === 'PC International').length,
                avgPrice: Math.round(components.filter(c => c.supplier === 'PC International').reduce((sum, c) => sum + c.price, 0) / components.filter(c => c.supplier === 'PC International').length)
              },
              {
                name: 'Dreamware Technology',
                url: 'https://www.dreamwaretech.co.za',
                description: 'Online computer components specialist',
                strengths: ['Online focus', 'Competitive pricing', 'Wide selection', 'Quick shipping'],
                components: components.filter(c => c.supplier === 'Dreamware').length,
                avgPrice: Math.round(components.filter(c => c.supplier === 'Dreamware').reduce((sum, c) => sum + c.price, 0) / components.filter(c => c.supplier === 'Dreamware').length)
              }
            ].map((supplier) => (
              <Card key={supplier.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {supplier.name}
                    <a href={supplier.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Store
                      </Button>
                    </a>
                  </CardTitle>
                  <CardDescription>{supplier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Components Listed</p>
                        <p className="text-xl font-bold">{supplier.components}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Price</p>
                        <p className="text-xl font-bold text-green-600">R{supplier.avgPrice.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Key Strengths</p>
                      <div className="flex flex-wrap gap-1">
                        {supplier.strengths.map((strength, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>PC Assembly Services & Labor Costs</CardTitle>
              <CardDescription>
                Analysis of service providers and their pricing structures in South Africa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {serviceProviders.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Provider: {service.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {service.percentage}% or min R{service.basePrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium">Cost for Selected Build:</h5>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-center">
                          <span>Build Cost:</span>
                          <span>R{selectedBuild.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Service Cost ({service.percentage}%):</span>
                          <span className="font-bold text-blue-600">
                            R{calculateServiceCost(selectedBuild.totalPrice, service).toLocaleString()}
                          </span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Cost:</span>
                          <span className="text-green-600">
                            R{(selectedBuild.totalPrice + calculateServiceCost(selectedBuild.totalPrice, service)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant={selectedService === service ? "default" : "outline"} 
                      size="sm" 
                      className="mt-3"
                      onClick={() => setSelectedService(service)}
                    >
                      Select Service
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Service Cost Analysis</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Most service providers charge 5-8% of total build cost</p>
                  <p>• Minimum service fees range from R1,500 to R2,500</p>
                  <p>• Premium services include cable management and benchmarking</p>
                  <p>• Factory assembly typically costs 1-2% more but includes warranty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}