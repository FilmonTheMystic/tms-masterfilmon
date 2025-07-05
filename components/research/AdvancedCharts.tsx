'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Sankey,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { Supplier } from '@/lib/data/suppliers';

interface AdvancedChartsProps {
  suppliers: Supplier[];
  title?: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#d084d0', '#ffb347'
];

export function AdvancedCharts({ suppliers, title = "Supplier Analytics" }: AdvancedChartsProps) {
  // Data transformations for different chart types
  const countryData = suppliers.reduce((acc, supplier) => {
    const existing = acc.find(item => item.country === supplier.country);
    if (existing) {
      existing.count += 1;
      existing.avgRating = (existing.avgRating + supplier.rating) / 2;
    } else {
      acc.push({
        country: supplier.country,
        count: 1,
        avgRating: supplier.rating
      });
    }
    return acc;
  }, [] as Array<{ country: string; count: number; avgRating: number }>);

  const typeData = suppliers.reduce((acc, supplier) => {
    acc[supplier.type] = (acc[supplier.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeData).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: ((count / suppliers.length) * 100).toFixed(1)
  }));

  const priceRangeData = suppliers.reduce((acc, supplier) => {
    acc[supplier.priceRange] = (acc[supplier.priceRange] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priceRangeChartData = Object.entries(priceRangeData).map(([range, count]) => ({
    range: range.charAt(0).toUpperCase() + range.slice(1),
    count,
    value: count
  }));

  const ratingDistribution = suppliers.reduce((acc, supplier) => {
    const ratingBucket = Math.floor(supplier.rating);
    const key = `${ratingBucket}.0-${ratingBucket}.9`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ratingChartData = Object.entries(ratingDistribution).map(([range, count]) => ({
    range,
    count,
    percentage: ((count / suppliers.length) * 100).toFixed(1)
  }));

  const featureAnalysis = suppliers.reduce((acc, supplier) => {
    Object.entries(supplier.features).forEach(([feature, value]) => {
      if (!acc[feature]) acc[feature] = { yes: 0, no: 0 };
      acc[feature][value ? 'yes' : 'no'] += 1;
    });
    return acc;
  }, {} as Record<string, { yes: number; no: number }>);

  const featureChartData = Object.entries(featureAnalysis).map(([feature, data]) => ({
    feature: feature.charAt(0).toUpperCase() + feature.slice(1),
    yes: data.yes,
    no: data.no,
    total: data.yes + data.no,
    percentage: ((data.yes / (data.yes + data.no)) * 100).toFixed(1)
  }));

  const deliveryTimeData = suppliers.reduce((acc, supplier) => {
    acc[supplier.deliveryTime] = (acc[supplier.deliveryTime] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deliveryChartData = Object.entries(deliveryTimeData).map(([time, count]) => ({
    deliveryTime: time,
    count,
    suppliers: count
  }));

  // Scatter plot data for rating vs review count
  const scatterData = suppliers.map(supplier => ({
    rating: supplier.rating,
    reviews: supplier.reviewCount,
    name: supplier.name,
    country: supplier.country
  }));

  // Radar chart data for top suppliers
  const topSuppliers = suppliers
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(supplier => ({
      name: supplier.name,
      rating: supplier.rating,
      reviews: Math.min(supplier.reviewCount / 1000, 5), // Normalize to 0-5 scale
      features: Object.values(supplier.features).filter(Boolean).length,
      priceScore: { budget: 5, 'mid-range': 3, premium: 2, enterprise: 1 }[supplier.priceRange],
      deliveryScore: supplier.deliveryTime.includes('1-2') ? 5 : 
                    supplier.deliveryTime.includes('1-3') ? 4 : 
                    supplier.deliveryTime.includes('2-4') ? 3 : 2
    }));

  // Bar chart data for supplier distribution
  const treeMapData = Object.entries(typeData).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    size: count,
    count
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.payload.percentage && ` (${entry.payload.percentage}%)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          Total Suppliers: {suppliers.length}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {suppliers.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Suppliers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {suppliers.reduce((sum, s) => sum + s.reviewCount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(suppliers.map(s => s.country)).size}
            </div>
            <p className="text-sm text-muted-foreground">Countries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Suppliers by Country</CardTitle>
            <CardDescription>Distribution of suppliers across countries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Count" />
                <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#ff7300" name="Avg Rating" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supplier Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Types</CardTitle>
            <CardDescription>Distribution by business type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating vs Reviews Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle>Rating vs Review Count</CardTitle>
            <CardDescription>Supplier credibility analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={scatterData}>
                <CartesianGrid />
                <XAxis type="number" dataKey="rating" domain={[0, 5]} />
                <YAxis type="number" dataKey="reviews" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p>Rating: {data.rating}</p>
                          <p>Reviews: {data.reviews.toLocaleString()}</p>
                          <p>Country: {data.country}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter dataKey="reviews" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Range Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Price Range Distribution</CardTitle>
            <CardDescription>Suppliers by pricing tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceRangeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Features Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Feature Availability Analysis</CardTitle>
            <CardDescription>Percentage of suppliers offering each feature</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, suppliers.length]} />
                <YAxis dataKey="feature" type="category" width={120} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p style={{ color: '#8884d8' }}>Yes: {data.yes} ({data.percentage}%)</p>
                          <p style={{ color: '#82ca9d' }}>No: {data.no}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="yes" stackId="a" fill="#8884d8" />
                <Bar dataKey="no" stackId="a" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Suppliers Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Suppliers Comparison</CardTitle>
            <CardDescription>Multi-dimensional performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={topSuppliers}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar 
                  dataKey="rating" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                  name="Rating"
                />
                <Radar 
                  dataKey="features" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6} 
                  name="Features"
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivery Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Time Distribution</CardTitle>
            <CardDescription>Supplier delivery performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={deliveryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="deliveryTime" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#FFBB28" 
                  fill="#FFBB28" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supplier Type Distribution as Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Supplier Type Distribution</CardTitle>
            <CardDescription>Detailed breakdown of supplier categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={treeMapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p>Suppliers: {data.count}</p>
                          <p>Percentage: {((data.count / suppliers.length) * 100).toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="size" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}