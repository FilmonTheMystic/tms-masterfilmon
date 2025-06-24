'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Zap, 
  Clock, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Gauge,
  CheckCircle,
  AlertTriangle,
  Info,
  Timer,
  Download,
  BarChart3,
  Settings
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { 
  intelGenerations, 
  ryzenGenerations, 
  memorySpecs, 
  storageSpecs, 
  performanceCalculator,
  TechSpecification,
  MemorySpecification,
  StorageSpecification
} from '@/lib/data/techSpecs';

export function TechnicalBreakdown() {
  const [selectedCPU, setSelectedCPU] = useState<TechSpecification>(ryzenGenerations[1]);
  const [selectedMemory, setSelectedMemory] = useState<MemorySpecification>(memorySpecs[0]);
  const [selectedStorage, setSelectedStorage] = useState<StorageSpecification>(storageSpecs[0]);
  const [useCase, setUseCase] = useState<'gaming' | 'productivity' | 'mixed'>('gaming');

  // Performance calculations
  const performanceMetrics = performanceCalculator.calculatePerformanceMetrics(
    selectedCPU, selectedMemory, selectedStorage
  );

  const longevityYears = performanceCalculator.calculateLongevity(selectedCPU, useCase);
  const upgradeRecommendation = performanceCalculator.calculateUpgradeRecommendation(selectedCPU, useCase);

  // Animation classes
  const fadeIn = "animate-in slide-in-from-bottom-4 duration-500";
  const scaleIn = "animate-in zoom-in-95 duration-300";
  const slideIn = "animate-in slide-in-from-left-4 duration-400";

  // Chart data for generation comparison
  const cpuComparisonData = [...intelGenerations, ...ryzenGenerations].map(cpu => ({
    name: cpu.name.split(' ').slice(-1)[0], // Get model number
    performance: cpu.performanceScore,
    price: cpu.currentPrice,
    longevity: cpu.longevityScore,
    generation: cpu.generation,
    brand: cpu.name.includes('Intel') ? 'Intel' : 'AMD'
  }));

  // Memory comparison data
  const memoryComparisonData = memorySpecs.map(mem => ({
    name: `${mem.type}-${mem.speed}`,
    bandwidth: mem.bandwidth / 1000, // Convert to GB/s
    price: mem.price,
    gaming: mem.gamingPerformance,
    workload: mem.workloadPerformance,
    futureProof: mem.futureProofing
  }));

  // Performance radar data
  const radarData = [
    { metric: 'Gaming', score: performanceMetrics.gamingScore },
    { metric: 'Productivity', score: performanceMetrics.productivityScore },
    { metric: 'Overall', score: performanceMetrics.overallScore },
    { metric: 'Future-Proof', score: (longevityYears / 8) * 100 },
    { metric: 'Value', score: Math.max(0, 100 - (selectedCPU.currentPrice / 500) * 100) }
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGenerationBadgeColor = (gen: string) => {
    if (gen.includes('14th') || gen.includes('9000')) return 'bg-green-100 text-green-800';
    if (gen.includes('13th') || gen.includes('7000')) return 'bg-blue-100 text-blue-800';
    if (gen.includes('12th') || gen.includes('5000')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${fadeIn} flex items-center justify-between`}>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            Technical Breakdown & Generations
          </h2>
          <p className="text-muted-foreground">
            Analyze CPU generations, memory standards, and storage performance with longevity predictions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare All
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <Card className={slideIn}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Build Configuration
          </CardTitle>
          <CardDescription>
            Select components to analyze performance, longevity, and upgrade paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* CPU Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Processor</label>
              <Select 
                value={selectedCPU.id} 
                onValueChange={(value) => {
                  const cpu = [...intelGenerations, ...ryzenGenerations].find(c => c.id === value);
                  if (cpu) setSelectedCPU(cpu);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem disabled value="intel-header">Intel Processors</SelectItem>
                  {intelGenerations.map(cpu => (
                    <SelectItem key={cpu.id} value={cpu.id}>
                      {cpu.name}
                    </SelectItem>
                  ))}
                  <SelectItem disabled value="amd-header">AMD Processors</SelectItem>
                  {ryzenGenerations.map(cpu => (
                    <SelectItem key={cpu.id} value={cpu.id}>
                      {cpu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Memory Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Memory</label>
              <Select 
                value={selectedMemory.id} 
                onValueChange={(value) => {
                  const memory = memorySpecs.find(m => m.id === value);
                  if (memory) setSelectedMemory(memory);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {memorySpecs.map(memory => (
                    <SelectItem key={memory.id} value={memory.id}>
                      {memory.type}-{memory.speed} {memory.capacity}GB
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Storage Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Storage</label>
              <Select 
                value={selectedStorage.id} 
                onValueChange={(value) => {
                  const storage = storageSpecs.find(s => s.id === value);
                  if (storage) setSelectedStorage(storage);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {storageSpecs.map(storage => (
                    <SelectItem key={storage.id} value={storage.id}>
                      {storage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Use Case */}
            <div>
              <label className="text-sm font-medium mb-2 block">Use Case</label>
              <Select value={useCase} onValueChange={(value: any) => setUseCase(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className={`${scaleIn} grid grid-cols-1 md:grid-cols-5 gap-4`}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Score</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.overallScore)}`}>
                  {performanceMetrics.overallScore}
                </p>
              </div>
              <Gauge className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gaming Score</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.gamingScore)}`}>
                  {performanceMetrics.gamingScore}
                </p>
              </div>
              <Monitor className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Longevity</p>
                <p className="text-2xl font-bold text-purple-600">{longevityYears} years</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-xl font-bold text-green-600">
                  R{(selectedCPU.currentPrice + selectedMemory.price + selectedStorage.price).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Boot Time</p>
                <p className="text-xl font-bold text-orange-600">{selectedStorage.bootTime}s</p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="generations">CPU Generations</TabsTrigger>
          <TabsTrigger value="memory">Memory Analysis</TabsTrigger>
          <TabsTrigger value="storage">Storage Performance</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="longevity">Longevity & Upgrades</TabsTrigger>
        </TabsList>

        <TabsContent value="generations" className="space-y-6">
          {/* CPU Generation Comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CPU Performance by Generation</CardTitle>
                <CardDescription>Performance scores across Intel and AMD generations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cpuComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p>Performance: {data.performance}</p>
                              <p>Price: R{data.price}</p>
                              <p>Generation: {data.generation}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="performance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected CPU Details</CardTitle>
                <CardDescription>{selectedCPU.name} Specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Generation</span>
                    <Badge className={getGenerationBadgeColor(selectedCPU.generation)}>
                      {selectedCPU.generation}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Architecture:</span>
                      <p className="font-semibold">{selectedCPU.architecture}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Process Node:</span>
                      <p className="font-semibold">{selectedCPU.node}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cores/Threads:</span>
                      <p className="font-semibold">{selectedCPU.coreCount}/{selectedCPU.threadCount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Boost Clock:</span>
                      <p className="font-semibold">{selectedCPU.boostClock} GHz</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">TDP:</span>
                      <p className="font-semibold">{selectedCPU.tdp}W</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Socket:</span>
                      <p className="font-semibold">{selectedCPU.socket}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCPU.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-1">Pros</h4>
                      <ul className="text-xs space-y-1">
                        {selectedCPU.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-1">Cons</h4>
                      <ul className="text-xs space-y-1">
                        {selectedCPU.cons.map((con, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>CPU Generation Timeline & Architecture Evolution</CardTitle>
              <CardDescription>Release timeline and key architectural improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Intel Timeline */}
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Intel Core Generations</h4>
                  <div className="grid gap-3">
                    {intelGenerations.map((cpu, idx) => (
                      <div key={cpu.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-center min-w-[80px]">
                          <Badge className={getGenerationBadgeColor(cpu.generation)}>
                            {cpu.generation}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{cpu.releaseYear}</p>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold">{cpu.name}</h5>
                          <p className="text-sm text-muted-foreground">{cpu.architecture} • {cpu.node}</p>
                          <p className="text-xs">{cpu.upgradeRecommendation}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R{cpu.currentPrice.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Score: {cpu.performanceScore}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AMD Timeline */}
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">AMD Ryzen Generations</h4>
                  <div className="grid gap-3">
                    {ryzenGenerations.map((cpu, idx) => (
                      <div key={cpu.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-center min-w-[80px]">
                          <Badge className={getGenerationBadgeColor(cpu.generation)}>
                            {cpu.generation}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{cpu.releaseYear}</p>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold">{cpu.name}</h5>
                          <p className="text-sm text-muted-foreground">{cpu.architecture} • {cpu.node}</p>
                          <p className="text-xs">{cpu.upgradeRecommendation}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R{cpu.currentPrice.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Score: {cpu.performanceScore}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-6">
          {/* Memory Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>DDR4 vs DDR5 Performance</CardTitle>
                <CardDescription>Bandwidth and performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={memoryComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bandwidth" fill="#10b981" name="Bandwidth (GB/s)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Specifications</CardTitle>
                <CardDescription>Detailed specs for {selectedMemory.type}-{selectedMemory.speed}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-semibold">{selectedMemory.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Speed:</span>
                      <p className="font-semibold">{selectedMemory.speed} MT/s</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Latency:</span>
                      <p className="font-semibold">{selectedMemory.latency}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Voltage:</span>
                      <p className="font-semibold">{selectedMemory.voltage}V</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <p className="font-semibold">{selectedMemory.capacity}GB</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bandwidth:</span>
                      <p className="font-semibold">{(selectedMemory.bandwidth / 1000).toFixed(1)} GB/s</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Performance Scores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Gaming:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedMemory.gamingPerformance} className="w-20" />
                          <span className="text-sm font-medium">{selectedMemory.gamingPerformance}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Workload:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedMemory.workloadPerformance} className="w-20" />
                          <span className="text-sm font-medium">{selectedMemory.workloadPerformance}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Future-Proof:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedMemory.futureProofing} className="w-20" />
                          <span className="text-sm font-medium">{selectedMemory.futureProofing}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recommended For</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMemory.recommendedFor.map((use, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DDR Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>DDR4 vs DDR5 Technical Comparison</CardTitle>
              <CardDescription>Key differences and upgrade considerations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Specification</th>
                      <th className="text-left p-3 font-semibold text-blue-600">DDR4</th>
                      <th className="text-left p-3 font-semibold text-green-600">DDR5</th>
                      <th className="text-left p-3 font-semibold">Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Max Speed</td>
                      <td className="p-3">3200-4000 MT/s</td>
                      <td className="p-3">4800-8400 MT/s</td>
                      <td className="p-3 text-green-600">DDR5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Voltage</td>
                      <td className="p-3">1.2V</td>
                      <td className="p-3">1.1V</td>
                      <td className="p-3 text-green-600">DDR5 (Lower power)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Max Capacity</td>
                      <td className="p-3">32GB per module</td>
                      <td className="p-3">128GB per module</td>
                      <td className="p-3 text-green-600">DDR5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Price (32GB)</td>
                      <td className="p-3">R85-120</td>
                      <td className="p-3">R140-180</td>
                      <td className="p-3 text-blue-600">DDR4 (Cheaper)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Gaming Performance</td>
                      <td className="p-3">Excellent</td>
                      <td className="p-3">Slightly better</td>
                      <td className="p-3 text-yellow-600">Minimal difference</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Future Support</td>
                      <td className="p-3">4-5 years</td>
                      <td className="p-3">7+ years</td>
                      <td className="p-3 text-green-600">DDR5 (Future-proof)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          {/* Storage Performance */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Performance Metrics</CardTitle>
                <CardDescription>Real-world performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{selectedStorage.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sequential Read:</span>
                        <p className="font-semibold">{selectedStorage.sequentialRead.toLocaleString()} MB/s</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sequential Write:</span>
                        <p className="font-semibold">{selectedStorage.sequentialWrite.toLocaleString()} MB/s</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Random Read:</span>
                        <p className="font-semibold">{(selectedStorage.randomRead / 1000).toFixed(0)}K IOPS</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Random Write:</span>
                        <p className="font-semibold">{(selectedStorage.randomWrite / 1000).toFixed(0)}K IOPS</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Real-World Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          Game Loading (50GB):
                        </span>
                        <span className="font-semibold">{selectedStorage.loadingTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          File Transfer (100GB):
                        </span>
                        <span className="font-semibold">{selectedStorage.transferTime} min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Windows Boot:
                        </span>
                        <span className="font-semibold">{selectedStorage.bootTime}s</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Specifications</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Interface:</span>
                        <p className="font-semibold">{selectedStorage.interface}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Endurance:</span>
                        <p className="font-semibold">{selectedStorage.endurance}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Warranty:</span>
                        <p className="font-semibold">{selectedStorage.warranty} years</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price/GB:</span>
                        <p className="font-semibold">R{selectedStorage.pricePerGB.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Recommendations</CardTitle>
                <CardDescription>Optimized setup for your use case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Recommended Setup</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <p><strong>C: Drive (OS):</strong> Samsung 990 PRO 2TB NVMe</p>
                      <p><strong>D: Drive (Games/Storage):</strong> Crucial MX4 4TB SATA SSD</p>
                      <p><strong>Total Cost:</strong> R468 for 6TB storage</p>
                      <p><strong>Benefits:</strong> Fast OS performance + High capacity storage</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Performance Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>OS Responsiveness:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={95} className="w-20" />
                          <span className="text-sm font-medium">Excellent</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Game Loading:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20" />
                          <span className="text-sm font-medium">Very Good</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>File Operations:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={90} className="w-20" />
                          <span className="text-sm font-medium">Excellent</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Usage Recommendations</h4>
                    <div className="space-y-1 text-sm">
                      <p>• <strong>2TB NVMe:</strong> OS, main programs, 2-3 current games</p>
                      <p>• <strong>4TB SATA SSD:</strong> Game library, media, backups</p>
                      <p>• <strong>Expected Lifespan:</strong> 6-7 years normal use</p>
                      <p>• <strong>Upgrade Path:</strong> Add more storage as needed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Storage Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Type Performance Comparison</CardTitle>
              <CardDescription>Speed vs capacity vs price analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={storageSpecs.map(storage => ({
                  name: storage.name.split(' ').slice(0, 2).join(' '),
                  speed: storage.sequentialRead,
                  capacity: storage.capacity,
                  price: storage.price,
                  type: storage.type
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p>Speed: {data.speed.toLocaleString()} MB/s</p>
                            <p>Capacity: {data.capacity}GB</p>
                            <p>Price: R{data.price}</p>
                            <p>Type: {data.type}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="speed" fill="#f59e0b" name="Sequential Read (MB/s)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>Multi-dimensional performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      dataKey="score" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name="Performance Score"
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
                <CardDescription>Detailed performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Gaming Performance</span>
                      <span className={`font-bold ${getPerformanceColor(performanceMetrics.gamingScore)}`}>
                        {performanceMetrics.gamingScore}/100
                      </span>
                    </div>
                    <Progress value={performanceMetrics.gamingScore} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      1440p gaming at high settings with good frame rates
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Productivity Score</span>
                      <span className={`font-bold ${getPerformanceColor(performanceMetrics.productivityScore)}`}>
                        {performanceMetrics.productivityScore}/100
                      </span>
                    </div>
                    <Progress value={performanceMetrics.productivityScore} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Content creation, streaming, and multitasking
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Overall Performance</span>
                      <span className={`font-bold ${getPerformanceColor(performanceMetrics.overallScore)}`}>
                        {performanceMetrics.overallScore}/100
                      </span>
                    </div>
                    <Progress value={performanceMetrics.overallScore} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Balanced performance across all workloads
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Performance Recommendations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Excellent for {selectedCPU.bestUseCase}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span>Expected lifespan: {performanceMetrics.expectedLifespan} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span>{upgradeRecommendation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benchmark Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Synthetic Benchmark Estimates</CardTitle>
              <CardDescription>Expected performance in popular benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-center">Gaming Benchmarks</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cyberpunk 2077 (1440p High):</span>
                      <span className="font-semibold">{Math.round(performanceMetrics.gamingScore * 0.8)}fps</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CS2 (1440p Epic):</span>
                      <span className="font-semibold">{Math.round(performanceMetrics.gamingScore * 2.5)}fps</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fortnite (1440p Epic):</span>
                      <span className="font-semibold">{Math.round(performanceMetrics.gamingScore * 1.2)}fps</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-center">Productivity Benchmarks</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cinebench R23:</span>
                      <span className="font-semibold">{Math.round(selectedCPU.performanceScore * 150)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Blender Render:</span>
                      <span className="font-semibold">{Math.round(selectedCPU.performanceScore * 0.8)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">7-Zip Compression:</span>
                      <span className="font-semibold">{Math.round(selectedCPU.performanceScore * 0.9)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-center">Real-World Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chrome Tabs (heavy):</span>
                      <span className="font-semibold">{Math.round(selectedMemory.capacity * 25)} tabs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">4K Video Editing:</span>
                      <span className="font-semibold">{selectedCPU.coreCount > 12 ? 'Smooth' : 'Good'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Streaming Quality:</span>
                      <span className="font-semibold">{selectedCPU.coreCount > 8 ? '1080p60' : '720p60'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="longevity" className="space-y-6">
          {/* Longevity Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Component Longevity</CardTitle>
                <CardDescription>Expected lifespan before needing upgrade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        {selectedCPU.name}
                      </span>
                      <span className="font-bold text-purple-600">{longevityYears} years</span>
                    </div>
                    <Progress value={(longevityYears / 8) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on {useCase} workload and performance requirements
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium flex items-center gap-2">
                        <MemoryStick className="h-4 w-4" />
                        {selectedMemory.type}-{selectedMemory.speed}
                      </span>
                      <span className="font-bold text-purple-600">{selectedMemory.longevityYears} years</span>
                    </div>
                    <Progress value={(selectedMemory.longevityYears / 8) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedMemory.type === 'DDR5' ? 'Future-proof memory standard' : 'Mature but limited lifespan'}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        {selectedStorage.name}
                      </span>
                      <span className="font-bold text-purple-600">{selectedStorage.longevityYears} years</span>
                    </div>
                    <Progress value={(selectedStorage.longevityYears / 8) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Endurance: {selectedStorage.endurance} write cycles
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Overall System Longevity</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Expected Useful Life:</span>
                      <span className="font-bold text-green-600">
                        {performanceMetrics.expectedLifespan} years
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Before significant performance degradation for {useCase} workloads
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upgrade Timeline</CardTitle>
                <CardDescription>Recommended upgrade path over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-semibold">Year 0-2: Peak Performance</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Excellent performance for all current games and applications at high settings
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">Year 2-4: Gradual Decline</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      May need to reduce settings slightly for newest games, still excellent for productivity
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">Year 4-6: Consider Upgrades</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      CPU may struggle with newest games, consider GPU upgrade first
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="font-semibold">Year 6+: Platform Upgrade</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Time for a complete platform refresh (CPU, motherboard, RAM)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Upgrade Strategy</CardTitle>
              <CardDescription>Maximizing performance per dollar over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Short Term (1-2 years)</h4>
                  <div className="space-y-2 text-sm">
                    <p>• <strong>No upgrades needed</strong></p>
                    <p>• Focus on optimizing software</p>
                    <p>• Consider adding more storage if needed</p>
                    <p>• Monitor CPU/GPU temperatures</p>
                    <p>• Keep drivers updated</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Medium Term (3-4 years)</h4>
                  <div className="space-y-2 text-sm">
                    <p>• <strong>Graphics card upgrade</strong> (highest impact)</p>
                    <p>• Add more RAM if doing heavy workloads</p>
                    <p>• Consider faster NVMe for OS drive</p>
                    <p>• CPU still viable for most tasks</p>
                    <p>• Clean and repaste thermal compounds</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">Long Term (5+ years)</h4>
                  <div className="space-y-2 text-sm">
                    <p>• <strong>Platform refresh</strong> (CPU + Motherboard)</p>
                    <p>• New memory standard adoption</p>
                    <p>• Power supply may need replacement</p>
                    <p>• Consider new case with better airflow</p>
                    <p>• Full system rebuild recommended</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips for Longevity</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
                  <div>
                    <p>• <strong>Cooling:</strong> Maintain good temperatures for component health</p>
                    <p>• <strong>Power:</strong> Use a quality PSU with headroom for upgrades</p>
                    <p>• <strong>Software:</strong> Keep OS and drivers updated</p>
                  </div>
                  <div>
                    <p>• <strong>Storage:</strong> Don't fill SSDs beyond 80% capacity</p>
                    <p>• <strong>Cleaning:</strong> Regular dust removal improves performance</p>
                    <p>• <strong>Monitoring:</strong> Track component health with tools</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}