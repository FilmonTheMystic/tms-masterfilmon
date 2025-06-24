export interface TechSpecification {
  id: string;
  name: string;
  generation: string;
  architecture: string;
  node: string;
  releaseYear: number;
  socket?: string;
  coreCount: number;
  threadCount: number;
  baseClock: number;
  boostClock: number;
  cache: string;
  tdp: number;
  msrp: number;
  currentPrice: number;
  performanceScore: number;
  longevityScore: number; // Years expected to remain relevant
  upgradeRecommendation: string;
  supportedMemory: string[];
  pcieSupport: string;
  integratedGraphics: boolean;
  features: string[];
  pros: string[];
  cons: string[];
  bestUseCase: string;
  competitorComparison?: string;
}

export interface MemorySpecification {
  id: string;
  type: 'DDR4' | 'DDR5';
  speed: number;
  latency: string;
  voltage: number;
  capacity: number;
  channels: number;
  bandwidth: number;
  price: number;
  longevityYears: number;
  performanceScore: number;
  gamingPerformance: number;
  workloadPerformance: number;
  futureProofing: number;
  pros: string[];
  cons: string[];
  recommendedFor: string[];
}

export interface StorageSpecification {
  id: string;
  name: string;
  type: 'NVMe' | 'SATA SSD' | 'HDD';
  interface: string;
  capacity: number;
  sequentialRead: number;
  sequentialWrite: number;
  randomRead: number;
  randomWrite: number;
  price: number;
  pricePerGB: number;
  longevityYears: number;
  endurance: string;
  warranty: number;
  loadingTime: number; // seconds for typical game
  transferTime: number; // minutes for 100GB transfer
  bootTime: number; // seconds for Windows boot
  pros: string[];
  cons: string[];
  bestFor: string[];
}

// Intel CPU Generations
export const intelGenerations: TechSpecification[] = [
  {
    id: 'i7-14700k',
    name: 'Intel Core i7-14700K',
    generation: '14th Gen',
    architecture: 'Raptor Lake Refresh',
    node: '10nm',
    releaseYear: 2023,
    socket: 'LGA1700',
    coreCount: 20,
    threadCount: 28,
    baseClock: 3.4,
    boostClock: 5.6,
    cache: '33MB L3',
    tdp: 125,
    msrp: 409,
    currentPrice: 389,
    performanceScore: 92,
    longevityScore: 5,
    upgradeRecommendation: 'Excellent for high-end gaming and productivity',
    supportedMemory: ['DDR5-5600', 'DDR4-3200'],
    pcieSupport: 'PCIe 5.0',
    integratedGraphics: true,
    features: ['Thermal Velocity Boost', 'Intel Thread Director', 'PCIe 5.0'],
    pros: ['Excellent gaming performance', 'Good value', 'DDR4/DDR5 support'],
    cons: ['High power consumption', 'Requires good cooling'],
    bestUseCase: 'High-end gaming and content creation',
    competitorComparison: 'Competes with Ryzen 7 7700X'
  },
  {
    id: 'i5-13600k',
    name: 'Intel Core i5-13600K',
    generation: '13th Gen',
    architecture: 'Raptor Lake',
    node: '10nm',
    releaseYear: 2022,
    socket: 'LGA1700',
    coreCount: 14,
    threadCount: 20,
    baseClock: 3.5,
    boostClock: 5.1,
    cache: '24MB L3',
    tdp: 125,
    msrp: 319,
    currentPrice: 269,
    performanceScore: 88,
    longevityScore: 6,
    upgradeRecommendation: 'Sweet spot for gaming and productivity',
    supportedMemory: ['DDR5-5600', 'DDR4-3200'],
    pcieSupport: 'PCIe 5.0',
    integratedGraphics: true,
    features: ['Hybrid Architecture', 'Intel Thread Director', 'PCIe 5.0'],
    pros: ['Excellent price/performance', 'Hybrid architecture efficiency', 'Great for gaming'],
    cons: ['P+E core complexity', 'Power hungry under load'],
    bestUseCase: 'Mainstream gaming and content creation',
    competitorComparison: 'Better gaming than Ryzen 5 7600X'
  },
  {
    id: 'i5-12600k',
    name: 'Intel Core i5-12600K',
    generation: '12th Gen',
    architecture: 'Alder Lake',
    node: '10nm',
    releaseYear: 2021,
    socket: 'LGA1700',
    coreCount: 10,
    threadCount: 16,
    baseClock: 3.7,
    boostClock: 4.9,
    cache: '20MB L3',
    tdp: 125,
    msrp: 289,
    currentPrice: 199,
    performanceScore: 82,
    longevityScore: 7,
    upgradeRecommendation: 'Excellent value choice, most reliable generation',
    supportedMemory: ['DDR5-4800', 'DDR4-3200'],
    pcieSupport: 'PCIe 5.0',
    integratedGraphics: true,
    features: ['First Hybrid Architecture', 'DDR5 Support', 'PCIe 5.0'],
    pros: ['Revolutionary architecture', 'Great reliability', 'Excellent value now'],
    cons: ['Older than newer gens', 'Lower max clocks'],
    bestUseCase: 'Budget to mid-range gaming builds',
    competitorComparison: 'More efficient than Ryzen 5 5600X'
  }
];

// AMD Ryzen Generations
export const ryzenGenerations: TechSpecification[] = [
  {
    id: 'ryzen7-9700x',
    name: 'AMD Ryzen 7 9700X',
    generation: '9000 Series',
    architecture: 'Zen 5',
    node: '4nm TSMC',
    releaseYear: 2024,
    socket: 'AM5',
    coreCount: 8,
    threadCount: 16,
    baseClock: 3.8,
    boostClock: 5.5,
    cache: '32MB L3',
    tdp: 65,
    msrp: 359,
    currentPrice: 329,
    performanceScore: 89,
    longevityScore: 8,
    upgradeRecommendation: 'Latest generation but modest improvements over 7000',
    supportedMemory: ['DDR5-5600'],
    pcieSupport: 'PCIe 5.0',
    integratedGraphics: true,
    features: ['Zen 5 Architecture', '16% IPC improvement', 'RDNA 2 iGPU'],
    pros: ['Latest architecture', 'Excellent efficiency', 'AM5 longevity'],
    cons: ['Expensive vs 7000 series', 'Modest gaming gains'],
    bestUseCase: 'Future-proofed high-end builds',
    competitorComparison: 'Similar gaming to i7-14700K'
  },
  {
    id: 'ryzen7-7700x',
    name: 'AMD Ryzen 7 7700X',
    generation: '7000 Series',
    architecture: 'Zen 4',
    node: '5nm TSMC',
    releaseYear: 2022,
    socket: 'AM5',
    coreCount: 8,
    threadCount: 16,
    baseClock: 4.5,
    boostClock: 5.4,
    cache: '32MB L3',
    tdp: 105,
    msrp: 399,
    currentPrice: 269,
    performanceScore: 87,
    longevityScore: 8,
    upgradeRecommendation: 'Best value for AM5 platform in 2024',
    supportedMemory: ['DDR5-5200'],
    pcieSupport: 'PCIe 5.0',
    integratedGraphics: true,
    features: ['Zen 4 Architecture', 'DDR5 Exclusive', 'RDNA 2 iGPU'],
    pros: ['Excellent value', 'AM5 longevity', 'Great efficiency'],
    cons: ['DDR5 only', 'Higher memory costs'],
    bestUseCase: 'Best value gaming and productivity',
    competitorComparison: 'Better value than 9700X for gaming'
  },
  {
    id: 'ryzen5-5600x',
    name: 'AMD Ryzen 5 5600X',
    generation: '5000 Series',
    architecture: 'Zen 3',
    node: '7nm TSMC',
    releaseYear: 2020,
    socket: 'AM4',
    coreCount: 6,
    threadCount: 12,
    baseClock: 3.7,
    boostClock: 4.6,
    cache: '32MB L3',
    tdp: 65,
    msrp: 299,
    currentPrice: 129,
    performanceScore: 78,
    longevityScore: 4,
    upgradeRecommendation: 'End of life but excellent budget option',
    supportedMemory: ['DDR4-3200'],
    pcieSupport: 'PCIe 4.0',
    integratedGraphics: false,
    features: ['Zen 3 Architecture', 'AM4 Compatibility', 'Excellent Gaming'],
    pros: ['Incredible value', 'Mature platform', 'Great gaming performance'],
    cons: ['End of platform life', 'No DDR5', 'No iGPU'],
    bestUseCase: 'Budget gaming builds with discrete GPU',
    competitorComparison: 'Cheaper than Intel 12400F'
  }
];

// Memory Specifications
export const memorySpecs: MemorySpecification[] = [
  {
    id: 'ddr5-6000-32gb',
    type: 'DDR5',
    speed: 6000,
    latency: 'CL30',
    voltage: 1.35,
    capacity: 32,
    channels: 2,
    bandwidth: 96000,
    price: 180,
    longevityYears: 7,
    performanceScore: 95,
    gamingPerformance: 92,
    workloadPerformance: 98,
    futureProofing: 95,
    pros: ['High bandwidth', 'Future-proof', 'Great for Ryzen 7000'],
    cons: ['Expensive', 'Higher latency than DDR4'],
    recommendedFor: ['High-end gaming', 'Content creation', 'AM5 builds']
  },
  {
    id: 'ddr5-5200-32gb',
    type: 'DDR5',
    speed: 5200,
    latency: 'CL40',
    voltage: 1.25,
    capacity: 32,
    channels: 2,
    bandwidth: 83200,
    price: 140,
    longevityYears: 6,
    performanceScore: 88,
    gamingPerformance: 87,
    workloadPerformance: 90,
    futureProofing: 90,
    pros: ['Good value DDR5', 'Lower power', 'JEDEC standard'],
    cons: ['Lower performance than faster kits', 'Still expensive vs DDR4'],
    recommendedFor: ['Budget DDR5 builds', 'Office work', 'Light gaming']
  },
  {
    id: 'ddr4-3600-32gb',
    type: 'DDR4',
    speed: 3600,
    latency: 'CL16',
    voltage: 1.35,
    capacity: 32,
    channels: 2,
    bandwidth: 57600,
    price: 85,
    longevityYears: 4,
    performanceScore: 82,
    gamingPerformance: 85,
    workloadPerformance: 78,
    futureProofing: 65,
    pros: ['Excellent value', 'Low latency', 'Mature technology'],
    cons: ['Lower bandwidth', 'Platform limitations'],
    recommendedFor: ['Budget builds', 'AM4 platform', 'Intel 12th gen']
  }
];

// Storage Specifications
export const storageSpecs: StorageSpecification[] = [
  {
    id: 'samsung-990-pro-2tb',
    name: 'Samsung 990 PRO 2TB',
    type: 'NVMe',
    interface: 'PCIe 4.0 x4',
    capacity: 2048,
    sequentialRead: 7450,
    sequentialWrite: 6900,
    randomRead: 1400000,
    randomWrite: 1550000,
    price: 179,
    pricePerGB: 0.087,
    longevityYears: 7,
    endurance: '1200 TBW',
    warranty: 5,
    loadingTime: 8,
    transferTime: 2.4,
    bootTime: 12,
    pros: ['Fastest consumer SSD', 'Excellent endurance', 'Great for gaming'],
    cons: ['Expensive', 'Runs hot under load'],
    bestFor: ['High-end gaming', 'Content creation', 'OS drive']
  },
  {
    id: 'crucial-mx4-4tb',
    name: 'Crucial MX4 4TB',
    type: 'SATA SSD',
    interface: 'SATA III',
    capacity: 4096,
    sequentialRead: 560,
    sequentialWrite: 510,
    randomRead: 95000,
    randomWrite: 90000,
    price: 289,
    pricePerGB: 0.071,
    longevityYears: 6,
    endurance: '700 TBW',
    warranty: 5,
    loadingTime: 18,
    transferTime: 13.4,
    bootTime: 22,
    pros: ['Excellent value', 'High capacity', 'Reliable'],
    cons: ['SATA bottleneck', 'Slower than NVMe'],
    bestFor: ['Mass storage', 'Secondary drive', 'Budget builds']
  },
  {
    id: 'wd-sn850x-4tb',
    name: 'WD Black SN850X 4TB',
    type: 'NVMe',
    interface: 'PCIe 4.0 x4',
    capacity: 4096,
    sequentialRead: 7300,
    sequentialWrite: 6600,
    randomRead: 1200000,
    randomWrite: 1100000,
    price: 339,
    pricePerGB: 0.083,
    longevityYears: 6,
    endurance: '2400 TBW',
    warranty: 5,
    loadingTime: 9,
    transferTime: 2.8,
    bootTime: 13,
    pros: ['High capacity NVMe', 'Gaming optimized', 'Good endurance'],
    cons: ['Expensive per GB', 'Power hungry'],
    bestFor: ['Gaming library', 'Content creation', 'All-in-one storage']
  }
];

export const performanceCalculator = {
  calculateLongevity: (component: TechSpecification, useCase: 'gaming' | 'productivity' | 'mixed') => {
    const baseScore = component.longevityScore;
    const releaseAge = new Date().getFullYear() - component.releaseYear;
    const adjustedScore = Math.max(1, baseScore - releaseAge);
    
    const useCaseMultiplier = {
      gaming: component.performanceScore > 85 ? 1.1 : 0.9,
      productivity: component.threadCount > 12 ? 1.2 : 0.8,
      mixed: 1.0
    };
    
    return Math.round(adjustedScore * useCaseMultiplier[useCase]);
  },

  calculateUpgradeRecommendation: (currentSpecs: TechSpecification, targetUse: string) => {
    const age = new Date().getFullYear() - currentSpecs.releaseYear;
    const performance = currentSpecs.performanceScore;
    
    if (age > 4 || performance < 70) return 'Immediate upgrade recommended';
    if (age > 2 || performance < 80) return 'Consider upgrading within 1-2 years';
    return 'No immediate upgrade needed';
  },

  calculatePerformanceMetrics: (cpu: TechSpecification, memory: MemorySpecification, storage: StorageSpecification) => {
    const cpuScore = cpu.performanceScore;
    const memoryScore = memory.performanceScore;
    const storageScore = (storage.sequentialRead / 7500) * 100; // Normalized to top NVMe
    
    return {
      overallScore: Math.round((cpuScore * 0.5 + memoryScore * 0.3 + storageScore * 0.2)),
      gamingScore: Math.round((cpuScore * 0.6 + memory.gamingPerformance * 0.3 + storageScore * 0.1)),
      productivityScore: Math.round((cpuScore * 0.4 + memory.workloadPerformance * 0.4 + storageScore * 0.2)),
      expectedLifespan: Math.min(cpu.longevityScore, memory.longevityYears, storage.longevityYears)
    };
  },

  calculateLoadingTimes: (storage: StorageSpecification, gameSize: number = 50) => {
    const baseTime = storage.type === 'NVMe' ? 10 : storage.type === 'SATA SSD' ? 25 : 60;
    const sizeMultiplier = gameSize / 50;
    return Math.round(baseTime * sizeMultiplier);
  },

  calculateTransferTimes: (storage: StorageSpecification, fileSize: number = 100) => {
    const transferSpeed = storage.sequentialWrite;
    const timeInSeconds = (fileSize * 1024) / transferSpeed; // GB to MB, then divide by MB/s
    return Math.round(timeInSeconds / 60 * 100) / 100; // Convert to minutes
  }
};