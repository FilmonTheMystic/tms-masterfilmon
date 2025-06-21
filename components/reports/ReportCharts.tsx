'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyReport } from '@/types';
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
  Legend
} from 'recharts';

interface ReportChartsProps {
  reports: MonthlyReport[];
}

export function ReportCharts({ reports }: ReportChartsProps) {
  // Prepare data for charts
  const chartData = reports.map(report => ({
    month: report.month,
    monthLabel: new Date(`${report.month}-01`).toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    }),
    revenue: report.revenue,
    expenses: report.expenses,
    netIncome: report.netIncome,
    occupancyRate: report.occupancyRate,
    invoicesSent: report.invoicesSent,
    paymentsReceived: report.paymentsReceived
  }));

  // Calculate total revenue and expenses for pie chart
  const totalRevenue = reports.reduce((sum, report) => sum + report.revenue, 0);
  const totalExpenses = reports.reduce((sum, report) => sum + report.expenses, 0);
  const pieData = [
    { name: 'Revenue', value: totalRevenue, color: '#10b981' },
    { name: 'Expenses', value: totalExpenses, color: '#ef4444' }
  ];

  // Custom tooltip formatter
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'occupancyRate') {
      return [`${value.toFixed(1)}%`, 'Occupancy Rate'];
    }
    if (typeof value === 'number' && (name === 'revenue' || name === 'expenses' || name === 'netIncome')) {
      return [`R${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)];
    }
    return [value, name.charAt(0).toUpperCase() + name.slice(1)];
  };

  return (
    <div className="grid gap-6">
      {/* Revenue vs Expenses Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" />
              <YAxis tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={formatTooltipValue} />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Net Income Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Net Income Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" />
              <YAxis tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={formatTooltipValue} />
              <Line 
                type="monotone" 
                dataKey="netIncome" 
                stroke="#6366f1" 
                strokeWidth={3}
                name="Net Income"
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Occupancy Rate Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" />
                <YAxis 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={formatTooltipValue} />
                <Line 
                  type="monotone" 
                  dataKey="occupancyRate" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Occupancy Rate"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: R${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`R${value.toLocaleString()}`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoices vs Payments Bar Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Invoices Sent vs Payments Received</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Bar dataKey="invoicesSent" fill="#8b5cf6" name="Invoices Sent" />
                <Bar dataKey="paymentsReceived" fill="#06b6d4" name="Payments Received" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}