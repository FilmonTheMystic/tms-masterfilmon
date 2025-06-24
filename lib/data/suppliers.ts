export interface Supplier {
  id: string;
  name: string;
  country: 'South Africa' | 'China';
  region?: string;
  website: string;
  email?: string;
  phone?: string;
  type: 'retailer' | 'manufacturer' | 'distributor' | 'marketplace';
  specialties: string[];
  certifications: string[];
  paymentMethods: string[];
  shippingRegions: string[];
  minimumOrder?: number;
  establishedYear?: number;
  employeeCount?: string;
  rating: number;
  reviewCount: number;
  features: {
    warranty: boolean;
    technicalSupport: boolean;
    customBuilds: boolean;
    bulkOrders: boolean;
    dropShipping: boolean;
    oem: boolean;
  };
  priceRange: 'budget' | 'mid-range' | 'premium' | 'enterprise';
  deliveryTime: string;
  notes?: string;
}

export interface ComponentPrice {
  supplierId: string;
  componentId: string;
  price: number;
  currency: 'ZAR' | 'USD' | 'CNY';
  availability: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order';
  lastUpdated: string;
  minQuantity: number;
  bulkDiscounts?: Array<{
    quantity: number;
    discountPercent: number;
  }>;
  shippingCost?: number;
  importDuty?: number;
  vatIncluded: boolean;
}

export const southAfricanSuppliers: Supplier[] = [
  {
    id: 'evetech',
    name: 'Evetech',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.evetech.co.za',
    email: 'sales@evetech.co.za',
    phone: '011 262 0909',
    type: 'retailer',
    specialties: ['Gaming PCs', 'Custom Builds', 'High-end Components'],
    certifications: ['Intel Partner', 'AMD Partner', 'NVIDIA Partner'],
    paymentMethods: ['Credit Card', 'EFT', 'Cash', 'Crypto'],
    shippingRegions: ['National', 'SADC'],
    establishedYear: 2008,
    employeeCount: '50-100',
    rating: 4.5,
    reviewCount: 2847,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '1-3 business days',
    notes: 'Leading gaming PC specialist with competitive pricing'
  },
  {
    id: 'wootware',
    name: 'Wootware',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.wootware.co.za',
    email: 'support@wootware.co.za',
    phone: '021 300 3000',
    type: 'retailer',
    specialties: ['Premium Components', 'Enthusiast Hardware', 'Server Equipment'],
    certifications: ['ISO 9001', 'Intel Partner', 'AMD Partner'],
    paymentMethods: ['Credit Card', 'EFT', 'PayFast'],
    shippingRegions: ['National'],
    establishedYear: 2007,
    employeeCount: '20-50',
    rating: 4.7,
    reviewCount: 1923,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'premium',
    deliveryTime: '1-2 business days',
    notes: 'Premium retailer with excellent customer service'
  },
  {
    id: 'pc-international',
    name: 'PC International',
    country: 'South Africa',
    region: 'National',
    website: 'https://pcinternational.co.za',
    email: 'info@pcinternational.co.za',
    phone: '041 374 8462',
    type: 'retailer',
    specialties: ['Laptops', 'Business Solutions', 'Components'],
    certifications: ['Microsoft Partner', 'Intel Partner'],
    paymentMethods: ['Credit Card', 'EFT', 'Finance Options'],
    shippingRegions: ['National', 'International'],
    establishedYear: 2005,
    employeeCount: '20-50',
    rating: 4.2,
    reviewCount: 856,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '2-5 business days',
    notes: 'Strong in business solutions and laptops'
  },
  {
    id: 'dreamware',
    name: 'Dreamware Technology',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.dreamwaretech.co.za',
    email: 'sales@dreamwaretech.co.za',
    phone: '011 886 3162',
    type: 'retailer',
    specialties: ['Gaming Components', 'Custom PCs', 'Monitors'],
    certifications: ['Intel Partner', 'AMD Partner'],
    paymentMethods: ['Credit Card', 'EFT', 'Cash on Delivery'],
    shippingRegions: ['National'],
    establishedYear: 2010,
    employeeCount: '10-20',
    rating: 4.3,
    reviewCount: 647,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '1-3 business days',
    notes: 'Online specialist with competitive pricing'
  },
  {
    id: 'computer-mania',
    name: 'Computer Mania',
    country: 'South Africa',
    region: 'National',
    website: 'https://computermania.co.za',
    email: 'info@computermania.co.za',
    phone: '011 463 8530',
    type: 'retailer',
    specialties: ['Components', 'Repairs', 'Upgrades'],
    certifications: ['Intel Partner'],
    paymentMethods: ['Credit Card', 'EFT', 'Cash'],
    shippingRegions: ['National'],
    establishedYear: 1995,
    employeeCount: '100-200',
    rating: 4.1,
    reviewCount: 1234,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '2-4 business days',
    notes: 'Largest independent tech retailer in SA'
  },
  {
    id: 'titan-ice',
    name: 'Titan Ice',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.titan-ice.co.za',
    email: 'sales@titan-ice.co.za',
    phone: '011 234 5678',
    type: 'retailer',
    specialties: ['Gaming PCs', 'High-end Components', 'Water Cooling'],
    certifications: ['Intel Partner', 'AMD Partner'],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['National'],
    establishedYear: 2012,
    employeeCount: '10-20',
    rating: 4.4,
    reviewCount: 423,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: false,
      dropShipping: false,
      oem: false
    },
    priceRange: 'premium',
    deliveryTime: '1-3 business days',
    notes: 'High-end gaming specialist'
  },
  {
    id: 'chaos-computers',
    name: 'Chaos Computers',
    country: 'South Africa',
    region: 'Cape Town',
    website: 'https://chaoscomputers.co.za',
    email: 'info@chaoscomputers.co.za',
    type: 'retailer',
    specialties: ['Custom Gaming PCs', 'High-end Components', 'Cape Town Local'],
    certifications: ['Intel Partner'],
    paymentMethods: ['Credit Card', 'EFT', 'Cash'],
    shippingRegions: ['Western Cape', 'National'],
    establishedYear: 2015,
    employeeCount: '5-10',
    rating: 4.2,
    reviewCount: 234,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: false,
      dropShipping: false,
      oem: false
    },
    priceRange: 'premium',
    deliveryTime: '2-5 business days',
    notes: 'Cape Town gaming specialist'
  },
  {
    id: 'matrix-warehouse',
    name: 'Matrix Warehouse',
    country: 'South Africa',
    region: 'National',
    website: 'https://matrixwarehouse.co.za',
    type: 'retailer',
    specialties: ['Computer Hardware', 'Electronics', 'Accessories'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['National'],
    establishedYear: 2001,
    employeeCount: '20-50',
    rating: 3.9,
    reviewCount: 567,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '3-7 business days'
  },
  {
    id: 'bob-shop',
    name: 'Bob Shop',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.bobshop.co.za',
    type: 'marketplace',
    specialties: ['Computer Components', 'Electronics', 'General Retail'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT', 'PayFast'],
    shippingRegions: ['National'],
    rating: 3.7,
    reviewCount: 892,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: false,
      dropShipping: true,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '2-7 business days'
  },
  {
    id: 'computer-world',
    name: 'Computer World',
    country: 'South Africa',
    region: 'Multiple Cities',
    website: 'https://computer-world.co.za',
    type: 'retailer',
    specialties: ['Computers', 'Software', 'Business Solutions'],
    certifications: ['Microsoft Partner'],
    paymentMethods: ['Credit Card', 'EFT', 'Finance'],
    shippingRegions: ['National'],
    establishedYear: 1995,
    employeeCount: '50-100',
    rating: 4.0,
    reviewCount: 445,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '1-4 business days'
  },
  {
    id: 'dc3-computers',
    name: 'DC3 Online Computer Store',
    country: 'South Africa',
    region: 'Cape Town',
    website: 'https://www.dc3.co.za',
    phone: '021 914 7833',
    type: 'retailer',
    specialties: ['Computer Hardware', 'Repairs', 'Upgrades'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['Western Cape', 'National'],
    rating: 4.1,
    reviewCount: 234,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: false,
      dropShipping: false,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '1-3 business days'
  },
  {
    id: 'viva-computers',
    name: 'Viva Computers',
    country: 'South Africa',
    region: 'Johannesburg',
    website: 'http://vivacomputers.co.za',
    type: 'retailer',
    specialties: ['PC Hardware', 'Custom Systems', 'Software'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT', 'Cash'],
    shippingRegions: ['Gauteng', 'National'],
    rating: 3.8,
    reviewCount: 156,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: false,
      dropShipping: false,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '2-5 business days'
  },
  {
    id: 'mitabyte',
    name: 'Mitabyte',
    country: 'South Africa',
    region: 'Durban',
    website: 'https://www.mitabyte.co.za',
    type: 'retailer',
    specialties: ['Computer Hardware', 'Affordable Solutions'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['KwaZulu-Natal', 'National'],
    rating: 3.6,
    reviewCount: 89,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: false,
      dropShipping: true,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '3-7 business days'
  },
  {
    id: 'first-shop',
    name: 'FirstShop',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.firstshop.co.za',
    type: 'marketplace',
    specialties: ['IT Equipment', 'Computer Components', 'Electronics'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT', 'PayFast'],
    shippingRegions: ['National'],
    establishedYear: 2008,
    rating: 4.0,
    reviewCount: 1245,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '2-5 business days'
  },
  {
    id: 'comx-computers',
    name: 'ComX Computers',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.comx-computers.co.za',
    type: 'retailer',
    specialties: ['Computers', 'Laptops', 'Software'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['National'],
    rating: 3.9,
    reviewCount: 445,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: false,
      dropShipping: false,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '3-6 business days'
  },
  {
    id: 'phoenix-pc',
    name: 'Phoenix PC',
    country: 'South Africa',
    region: 'National',
    website: 'https://www.phoenixpc.co.za',
    type: 'retailer',
    specialties: ['Gaming PCs', 'Professional Workstations'],
    certifications: ['Intel Partner', 'AMD Partner'],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['National'],
    rating: 4.3,
    reviewCount: 567,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: false,
      dropShipping: false,
      oem: false
    },
    priceRange: 'premium',
    deliveryTime: '1-3 business days'
  },
  {
    id: 'progenix',
    name: 'Progenix',
    country: 'South Africa',
    region: 'National',
    website: 'https://progenix.co.za',
    type: 'retailer',
    specialties: ['Gaming PCs', 'Components', 'Accessories'],
    certifications: ['Intel Partner'],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['National'],
    rating: 4.2,
    reviewCount: 334,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: false,
      dropShipping: false,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '2-4 business days'
  },
  {
    id: 'carbonite',
    name: 'Carbonite',
    country: 'South Africa',
    region: 'National',
    website: 'https://carbonite.co.za',
    type: 'retailer',
    specialties: ['Computer Components', 'IT Solutions'],
    certifications: [],
    paymentMethods: ['Credit Card', 'EFT'],
    shippingRegions: ['National'],
    rating: 3.7,
    reviewCount: 223,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '3-7 business days'
  }
];

export const chineseSuppliers: Supplier[] = [
  {
    id: 'alibaba-computer-parts',
    name: 'Alibaba Computer Parts Hub',
    country: 'China',
    region: 'Guangdong',
    website: 'https://www.alibaba.com',
    type: 'marketplace',
    specialties: ['Wholesale Components', 'OEM Manufacturing', 'Custom Solutions'],
    certifications: ['ISO 9001', 'RoHS', 'CE'],
    paymentMethods: ['T/T', 'L/C', 'PayPal', 'Credit Card'],
    shippingRegions: ['Worldwide'],
    establishedYear: 1999,
    employeeCount: '10000+',
    rating: 4.0,
    reviewCount: 50000,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: true
    },
    priceRange: 'budget',
    deliveryTime: '7-15 business days',
    notes: 'Largest B2B marketplace with 1,311 computer parts suppliers'
  },
  {
    id: 'aliexpress-tech',
    name: 'AliExpress Tech Suppliers',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.aliexpress.com',
    type: 'marketplace',
    specialties: ['Consumer Electronics', 'PC Components', 'Gaming Accessories'],
    certifications: ['Varies by seller'],
    paymentMethods: ['Credit Card', 'PayPal', 'AliPay'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2010,
    employeeCount: '1000+',
    rating: 3.8,
    reviewCount: 100000,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: false,
      dropShipping: true,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '10-30 business days',
    notes: 'Consumer marketplace with individual PC builders success rate of 95%'
  },
  {
    id: 'made-in-china',
    name: 'Made-in-China Computer Hardware',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.made-in-china.com',
    type: 'marketplace',
    specialties: ['Manufacturing', 'Wholesale', 'B2B Components'],
    certifications: ['ISO 9001', 'CE', 'FCC'],
    paymentMethods: ['T/T', 'L/C', 'Western Union'],
    shippingRegions: ['Worldwide'],
    establishedYear: 1996,
    employeeCount: '1000+',
    rating: 4.1,
    reviewCount: 25000,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: true
    },
    priceRange: 'budget',
    deliveryTime: '7-20 business days',
    notes: 'Comprehensive B2B platform for hardware manufacturers'
  },
  {
    id: 'global-sources',
    name: 'Global Sources Hardware',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.globalsources.com',
    type: 'marketplace',
    specialties: ['Electronics Manufacturing', 'OEM/ODM', 'Trade Shows'],
    certifications: ['Verified Suppliers', 'ISO Certified'],
    paymentMethods: ['T/T', 'L/C', 'Trade Assurance'],
    shippingRegions: ['Worldwide'],
    establishedYear: 1971,
    employeeCount: '1000+',
    rating: 4.2,
    reviewCount: 15000,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: true
    },
    priceRange: 'mid-range',
    deliveryTime: '5-15 business days',
    notes: 'Premium B2B platform with verified manufacturers'
  },
  {
    id: 'ecs-motherboards',
    name: 'Elitegroup Computer Systems (ECS)',
    country: 'China',
    region: 'Shenzhen',
    website: 'https://www.ecs.com.tw',
    type: 'manufacturer',
    specialties: ['Motherboards', 'Mini PCs', 'Industrial Computers'],
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    paymentMethods: ['T/T', 'L/C'],
    shippingRegions: ['Worldwide'],
    establishedYear: 1987,
    employeeCount: '1000-5000',
    rating: 4.3,
    reviewCount: 892,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: true
    },
    priceRange: 'budget',
    deliveryTime: '5-10 business days',
    notes: 'Major motherboard manufacturer with global presence'
  },
  {
    id: 'shenzhen-electronics',
    name: 'Shenzhen Electronics Hub',
    country: 'China',
    region: 'Shenzhen',
    website: 'https://www.szelec.com',
    type: 'manufacturer',
    specialties: ['Motherboards', 'Graphics Cards', 'Custom OEM'],
    certifications: ['ISO 9001', 'RoHS', 'CE', 'FCC'],
    paymentMethods: ['T/T', 'L/C', 'PayPal'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2005,
    employeeCount: '500-1000',
    rating: 4.1,
    reviewCount: 3500,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: true
    },
    priceRange: 'budget',
    deliveryTime: '5-12 business days'
  },
  {
    id: 'guangdong-tech',
    name: 'Guangdong Tech Manufacturing',
    country: 'China',
    region: 'Guangdong',
    website: 'https://www.gdtech.com.cn',
    type: 'manufacturer',
    specialties: ['RAM Modules', 'Storage Devices', 'Power Supplies'],
    certifications: ['ISO 9001', 'CE', 'RoHS'],
    paymentMethods: ['T/T', 'L/C', 'Western Union'],
    shippingRegions: ['Worldwide'],
    establishedYear: 1998,
    employeeCount: '1000+',
    rating: 4.0,
    reviewCount: 2800,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: true
    },
    priceRange: 'budget',
    deliveryTime: '7-15 business days'
  },
  {
    id: 'jiangsu-components',
    name: 'Jiangsu Component Solutions',
    country: 'China',
    region: 'Jiangsu',
    website: 'https://www.jscomponents.com',
    type: 'manufacturer',
    specialties: ['Motherboards', 'Mini ITX', 'Industrial Computers'],
    certifications: ['ISO 9001', 'ISO 14001', 'CE'],
    paymentMethods: ['T/T', 'L/C'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2010,
    employeeCount: '200-500',
    rating: 4.2,
    reviewCount: 1567,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: true,
      dropShipping: false,
      oem: true
    },
    priceRange: 'mid-range',
    deliveryTime: '5-10 business days'
  },
  {
    id: 'zhejiang-electronics',
    name: 'Zhejiang Electronics Factory',
    country: 'China',
    region: 'Zhejiang',
    website: 'https://www.zjelec.com',
    type: 'manufacturer',
    specialties: ['Computer Cases', 'Cooling Solutions', 'Accessories'],
    certifications: ['CE', 'RoHS', 'FCC'],
    paymentMethods: ['T/T', 'PayPal', 'Western Union'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2008,
    employeeCount: '100-200',
    rating: 3.9,
    reviewCount: 1234,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: true
    },
    priceRange: 'budget',
    deliveryTime: '10-20 business days'
  },
  {
    id: 'shanghai-memory',
    name: 'Shanghai Memory Technologies',
    country: 'China',
    region: 'Shanghai',
    website: 'https://www.shmemory.com',
    type: 'manufacturer',
    specialties: ['DDR5 Memory', 'Gaming RAM', 'Server Memory'],
    certifications: ['ISO 9001', 'JEDEC', 'RoHS'],
    paymentMethods: ['T/T', 'L/C', 'PayPal'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2012,
    employeeCount: '500-1000',
    rating: 4.3,
    reviewCount: 2890,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: true
    },
    priceRange: 'mid-range',
    deliveryTime: '5-12 business days'
  },
  {
    id: 'beijing-storage',
    name: 'Beijing Storage Solutions',
    country: 'China',
    region: 'Beijing',
    website: 'https://www.bjstorage.com',
    type: 'manufacturer',
    specialties: ['NVMe SSDs', 'SATA SSDs', 'Industrial Storage'],
    certifications: ['ISO 9001', 'CE', 'FCC'],
    paymentMethods: ['T/T', 'L/C'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2015,
    employeeCount: '200-500',
    rating: 4.1,
    reviewCount: 1678,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: false,
      oem: true
    },
    priceRange: 'mid-range',
    deliveryTime: '7-14 business days'
  },
  {
    id: 'dongguan-power',
    name: 'Dongguan Power Systems',
    country: 'China',
    region: 'Dongguan',
    website: 'https://www.dgpower.com',
    type: 'manufacturer',
    specialties: ['Power Supplies', 'Modular PSUs', 'Server PSUs'],
    certifications: ['80 PLUS', 'CE', 'UL', 'TUV'],
    paymentMethods: ['T/T', 'L/C', 'PayPal'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2006,
    employeeCount: '300-500',
    rating: 4.0,
    reviewCount: 2234,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: true,
      bulkOrders: true,
      dropShipping: true,
      oem: true
    },
    priceRange: 'budget',
    deliveryTime: '8-16 business days'
  },
  {
    id: 'taobao-tech',
    name: 'Taobao Tech Marketplace',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.taobao.com',
    type: 'marketplace',
    specialties: ['Consumer Electronics', 'PC Components', 'Accessories'],
    certifications: ['Varies by seller'],
    paymentMethods: ['Alipay', 'T/T'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2003,
    employeeCount: '10000+',
    rating: 3.6,
    reviewCount: 50000,
    features: {
      warranty: false,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: false,
      dropShipping: true,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '15-30 business days'
  },
  {
    id: 'tmall-global',
    name: 'Tmall Global Electronics',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.tmall.com',
    type: 'marketplace',
    specialties: ['Brand Electronics', 'Verified Sellers', 'Consumer Products'],
    certifications: ['Verified Sellers', 'Brand Authorization'],
    paymentMethods: ['Alipay', 'Credit Card'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2008,
    employeeCount: '5000+',
    rating: 3.8,
    reviewCount: 35000,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: false,
      dropShipping: true,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '10-25 business days'
  },
  {
    id: 'jd-electronics',
    name: 'JD.com Electronics',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.jd.com',
    type: 'marketplace',
    specialties: ['Electronics', 'Official Brands', 'Fast Shipping'],
    certifications: ['Official Brand Partners'],
    paymentMethods: ['JD Pay', 'Credit Card', 'PayPal'],
    shippingRegions: ['Worldwide'],
    establishedYear: 1998,
    employeeCount: '10000+',
    rating: 4.0,
    reviewCount: 45000,
    features: {
      warranty: true,
      technicalSupport: true,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: false
    },
    priceRange: 'mid-range',
    deliveryTime: '7-20 business days'
  },
  {
    id: 'dhgate-tech',
    name: 'DHgate Technology Hub',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.dhgate.com',
    type: 'marketplace',
    specialties: ['Wholesale Electronics', 'Bulk Orders', 'Small Quantities'],
    certifications: ['Verified Suppliers'],
    paymentMethods: ['Credit Card', 'PayPal', 'Western Union'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2004,
    employeeCount: '1000+',
    rating: 3.5,
    reviewCount: 28000,
    features: {
      warranty: false,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: true,
      dropShipping: true,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '12-25 business days'
  },
  {
    id: 'banggood-tech',
    name: 'Banggood Technology',
    country: 'China',
    region: 'Multiple',
    website: 'https://www.banggood.com',
    type: 'marketplace',
    specialties: ['Electronics', 'Gadgets', 'Computer Accessories'],
    certifications: [],
    paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer'],
    shippingRegions: ['Worldwide'],
    establishedYear: 2006,
    employeeCount: '1000+',
    rating: 3.7,
    reviewCount: 18900,
    features: {
      warranty: true,
      technicalSupport: false,
      customBuilds: false,
      bulkOrders: false,
      dropShipping: true,
      oem: false
    },
    priceRange: 'budget',
    deliveryTime: '10-30 business days'
  }
];

export const importCalculator = {
  calculateImportCost: (price: number, currency: 'USD' | 'CNY', weight: number) => {
    const exchangeRates = { USD: 18.5, CNY: 2.6 }; // Approximate ZAR exchange rates
    const priceInZAR = price * exchangeRates[currency];
    
    const importDuty = priceInZAR * 0.15; // 15% import duty
    const vat = (priceInZAR + importDuty) * 0.15; // 15% VAT
    const shippingCost = weight * 150; // R150 per kg approximation
    const clearingFees = 500; // Fixed clearing fees
    
    return {
      originalPrice: priceInZAR,
      importDuty,
      vat,
      shippingCost,
      clearingFees,
      totalCost: priceInZAR + importDuty + vat + shippingCost + clearingFees
    };
  }
};

export const supplierAnalytics = {
  getSuppliersByCountry: (suppliers: Supplier[]) => {
    return suppliers.reduce((acc, supplier) => {
      acc[supplier.country] = (acc[supplier.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },
  
  getSuppliersByType: (suppliers: Supplier[]) => {
    return suppliers.reduce((acc, supplier) => {
      acc[supplier.type] = (acc[supplier.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },
  
  getAverageRating: (suppliers: Supplier[]) => {
    return suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / suppliers.length;
  },
  
  getTopRatedSuppliers: (suppliers: Supplier[], count: number = 10) => {
    return suppliers
      .sort((a, b) => b.rating - a.rating)
      .slice(0, count);
  },
  
  getPriceRangeDistribution: (suppliers: Supplier[]) => {
    return suppliers.reduce((acc, supplier) => {
      acc[supplier.priceRange] = (acc[supplier.priceRange] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
};