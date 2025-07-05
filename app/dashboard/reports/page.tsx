'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, BarChart3 } from 'lucide-react';
import { MonthlyReport, Property } from '@/types';
import { monthlyReportService } from '@/lib/services/monthlyReportService';
import { propertyService } from '@/lib/firebase/db';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ReportSummary } from '@/components/reports/ReportSummary';
import { ReportCharts } from '@/components/reports/ReportCharts';
import { MonthlyReportCard } from '@/components/reports/MonthlyReportCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'single' | 'range'>('single');
  const [startMonth, setStartMonth] = useState<string>(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return `${threeMonthsAgo.getFullYear()}-${String(threeMonthsAgo.getMonth() + 1).padStart(2, '0')}`;
  });
  const [endMonth, setEndMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [collectionRate, setCollectionRate] = useState(0);
  const [overdueData, setOverdueData] = useState({ count: 0, amount: 0 });

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  // Load initial report
  useEffect(() => {
    if (properties.length > 0) {
      generateReport();
    }
  }, [properties]);

  const loadProperties = async () => {
    try {
      const propertiesData = await propertyService.getAll();
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      let reportsData: MonthlyReport[];

      if (selectedPeriod === 'single') {
        const report = await monthlyReportService.generateMonthlyReport(
          selectedMonth,
          selectedPropertyId
        );
        reportsData = [report];
      } else {
        if (!startMonth || !endMonth) {
          toast.error('Please select both start and end months');
          return;
        }
        reportsData = await monthlyReportService.generateMultipleMonthReports(
          startMonth,
          endMonth,
          selectedPropertyId
        );
      }

      setReports(reportsData);

      // Load additional data
      const [collectionRateData, overdueDataRes] = await Promise.all([
        monthlyReportService.getCollectionRate(
          selectedPeriod === 'single' ? selectedMonth : endMonth,
          selectedPropertyId
        ),
        monthlyReportService.getOverdueSummary(selectedPropertyId)
      ]);

      setCollectionRate(collectionRateData);
      setOverdueData({
        count: overdueDataRes.count,
        amount: overdueDataRes.totalAmount
      });

      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const filename = selectedPeriod === 'single' 
        ? `monthly-report-${selectedMonth}.csv`
        : `monthly-reports-${startMonth}-to-${endMonth}.csv`;
      
      monthlyReportService.downloadCSV(reports, filename);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const handleRefresh = () => {
    generateReport();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monthly Reports</h1>
          <p className="text-muted-foreground">
            Generate and analyze financial reports for your properties
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={handleExport}
            disabled={isLoading || reports.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <ReportFilters
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        selectedMonth={selectedMonth}
        selectedPeriod={selectedPeriod}
        startMonth={startMonth}
        endMonth={endMonth}
        onPropertyChange={setSelectedPropertyId}
        onMonthChange={setSelectedMonth}
        onPeriodChange={setSelectedPeriod}
        onStartMonthChange={setStartMonth}
        onEndMonthChange={setEndMonth}
        onExport={handleExport}
        onGenerateReport={generateReport}
        isLoading={isLoading}
      />

      {/* Report Content */}
      {reports.length > 0 ? (
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <ReportSummary
              reports={reports}
              collectionRate={collectionRate}
              overdueCount={overdueData.count}
              overdueAmount={overdueData.amount}
            />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <ReportCharts reports={reports} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6">
              {reports.map((report, index) => (
                <MonthlyReportCard
                  key={report.month}
                  report={report}
                  previousReport={index > 0 ? reports[index - 1] : undefined}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : !isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Generate Report" to create your monthly report
                </p>
                <Button onClick={generateReport}>
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Generating Report</h3>
                <p className="text-muted-foreground">
                  Please wait while we compile your data...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}