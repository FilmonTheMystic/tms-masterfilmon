'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyReport } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MonthlyReportCardProps {
  report: MonthlyReport;
  previousReport?: MonthlyReport;
}

export function MonthlyReportCard({ report, previousReport }: MonthlyReportCardProps) {
  const getTrend = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change),
      isPositive: change > 0,
      isNeutral: change === 0
    };
  };

  const revenueTrend = getTrend(report.revenue, previousReport?.revenue);
  const occupancyTrend = getTrend(report.occupancyRate, previousReport?.occupancyRate);
  const netIncomeTrend = getTrend(report.netIncome, previousReport?.netIncome);

  const TrendIcon = ({ trend }: { trend: ReturnType<typeof getTrend> }) => {
    if (!trend) return null;
    if (trend.isNeutral) return <Minus className="h-4 w-4 text-gray-500" />;
    return trend.isPositive ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {formatMonth(report.month)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Revenue */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(report.revenue)}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <TrendIcon trend={revenueTrend} />
            {revenueTrend && (
              <span className={`text-sm ${
                revenueTrend.isPositive ? 'text-green-500' : 
                revenueTrend.isNeutral ? 'text-gray-500' : 'text-red-500'
              }`}>
                {revenueTrend.percentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Net Income */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Income</p>
            <p className={`text-xl font-semibold ${
              report.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(report.netIncome)}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <TrendIcon trend={netIncomeTrend} />
            {netIncomeTrend && (
              <span className={`text-sm ${
                netIncomeTrend.isPositive ? 'text-green-500' : 
                netIncomeTrend.isNeutral ? 'text-gray-500' : 'text-red-500'
              }`}>
                {netIncomeTrend.percentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
            <p className="text-xl font-semibold text-blue-600">
              {report.occupancyRate.toFixed(1)}%
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <TrendIcon trend={occupancyTrend} />
            {occupancyTrend && (
              <span className={`text-sm ${
                occupancyTrend.isPositive ? 'text-green-500' : 
                occupancyTrend.isNeutral ? 'text-gray-500' : 'text-red-500'
              }`}>
                {occupancyTrend.percentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-sm font-medium text-gray-600">Invoices Sent</p>
            <p className="text-lg font-semibold">{report.invoicesSent}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Payments Received</p>
            <p className="text-lg font-semibold">{report.paymentsReceived}</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="pt-2 border-t">
          <p className="text-sm font-medium text-gray-600">Total Expenses</p>
          <p className="text-lg font-semibold text-red-600">
            {formatCurrency(report.expenses)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}