'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Filter, Download } from 'lucide-react';
import { Property } from '@/types';

interface ReportFiltersProps {
  properties: Property[];
  selectedPropertyId?: string;
  selectedMonth: string;
  selectedPeriod: 'single' | 'range';
  startMonth?: string;
  endMonth?: string;
  onPropertyChange: (propertyId: string | undefined) => void;
  onMonthChange: (month: string) => void;
  onPeriodChange: (period: 'single' | 'range') => void;
  onStartMonthChange: (month: string) => void;
  onEndMonthChange: (month: string) => void;
  onExport: () => void;
  onGenerateReport: () => void;
  isLoading?: boolean;
}

export function ReportFilters({
  properties,
  selectedPropertyId,
  selectedMonth,
  selectedPeriod,
  startMonth,
  endMonth,
  onPropertyChange,
  onMonthChange,
  onPeriodChange,
  onStartMonthChange,
  onEndMonthChange,
  onExport,
  onGenerateReport,
  isLoading = false
}: ReportFiltersProps) {
  // Generate month options for the last 12 months
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthValue = date.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      months.push({ value: monthValue, label: monthLabel });
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Property Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Property</label>
            <Select
              value={selectedPropertyId || 'all'}
              onValueChange={(value) => onPropertyChange(value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Select
              value={selectedPeriod}
              onValueChange={(value: 'single' | 'range') => onPeriodChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Month</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Month Selection */}
          {selectedPeriod === 'single' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select
                value={selectedMonth}
                onValueChange={onMonthChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              {/* Start Month */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Month</label>
                <Select
                  value={startMonth || ''}
                  onValueChange={onStartMonthChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select start month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* End Month */}
              <div className="space-y-2">
                <label className="text-sm font-medium">End Month</label>
                <Select
                  value={endMonth || ''}
                  onValueChange={onEndMonthChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select end month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={onGenerateReport}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
          
          <Button
            variant="outline"
            onClick={onExport}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}