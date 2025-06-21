'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyReport } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  CreditCard,
  AlertTriangle 
} from 'lucide-react';

interface ReportSummaryProps {
  reports: MonthlyReport[];
  collectionRate?: number;
  overdueCount?: number;
  overdueAmount?: number;
}

export function ReportSummary({ 
  reports, 
  collectionRate = 0, 
  overdueCount = 0, 
  overdueAmount = 0 
}: ReportSummaryProps) {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No report data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals and averages
  const totalRevenue = reports.reduce((sum, report) => sum + report.revenue, 0);
  const totalExpenses = reports.reduce((sum, report) => sum + report.expenses, 0);
  const totalNetIncome = reports.reduce((sum, report) => sum + report.netIncome, 0);
  const averageOccupancy = reports.reduce((sum, report) => sum + report.occupancyRate, 0) / reports.length;
  const totalInvoices = reports.reduce((sum, report) => sum + report.invoicesSent, 0);
  const totalPayments = reports.reduce((sum, report) => sum + report.paymentsReceived, 0);

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${reports.length} month${reports.length > 1 ? 's' : ''} total`
    },
    {
      title: 'Total Net Income',
      value: formatCurrency(totalNetIncome),
      icon: TrendingUp,
      color: totalNetIncome >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: totalNetIncome >= 0 ? 'bg-green-50' : 'bg-red-50',
      description: `${totalNetIncome >= 0 ? 'Profit' : 'Loss'} after expenses`
    },
    {
      title: 'Average Occupancy',
      value: `${averageOccupancy.toFixed(1)}%`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Average across all months'
    },
    {
      title: 'Total Invoices',
      value: totalInvoices.toString(),
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Invoices sent'
    },
    {
      title: 'Total Payments',
      value: totalPayments.toString(),
      icon: CreditCard,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Payments received'
    },
    {
      title: 'Collection Rate',
      value: `${collectionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: collectionRate >= 80 ? 'text-green-600' : collectionRate >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: collectionRate >= 80 ? 'bg-green-50' : collectionRate >= 60 ? 'bg-yellow-50' : 'bg-red-50',
      description: 'Payment collection efficiency'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Expense Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Monthly</span>
                <span className="font-semibold">
                  {formatCurrency(totalExpenses / reports.length)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expense Ratio</span>
                <span className="font-semibold">
                  {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Outstanding Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overdue Count</span>
                <span className={`font-semibold ${
                  overdueCount > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {overdueCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overdue Amount</span>
                <span className={`font-semibold ${
                  overdueAmount > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(overdueAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  overdueCount === 0 
                    ? 'bg-green-100 text-green-800' 
                    : overdueCount <= 5 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {overdueCount === 0 ? 'All Current' : 
                   overdueCount <= 5 ? 'Moderate Risk' : 'High Risk'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {reports.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Best Month (Revenue)</p>
                <p className="font-semibold">
                  {reports.reduce((best, current) => 
                    current.revenue > best.revenue ? current : best
                  ).month}
                </p>
                <p className="text-sm text-green-600">
                  {formatCurrency(Math.max(...reports.map(r => r.revenue)))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Best Month (Occupancy)</p>
                <p className="font-semibold">
                  {reports.reduce((best, current) => 
                    current.occupancyRate > best.occupancyRate ? current : best
                  ).month}
                </p>
                <p className="text-sm text-blue-600">
                  {Math.max(...reports.map(r => r.occupancyRate)).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Growth Trend</p>
                <p className="font-semibold">
                  {reports.length >= 2 && reports[reports.length - 1].revenue > reports[0].revenue
                    ? 'Positive' : 'Needs Attention'}
                </p>
                <p className={`text-sm ${
                  reports.length >= 2 && reports[reports.length - 1].revenue > reports[0].revenue
                    ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {reports.length >= 2 
                    ? `${((reports[reports.length - 1].revenue - reports[0].revenue) / reports[0].revenue * 100).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}