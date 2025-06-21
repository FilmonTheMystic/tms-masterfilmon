import { 
  invoiceService, 
  paymentService, 
  tenantService, 
  unitService, 
  utilityReadingService 
} from '@/lib/firebase/db';
import { MonthlyReport, Invoice, Payment, Tenant, Unit, UtilityReading } from '@/types';

export class MonthlyReportService {
  /**
   * Generate monthly report for a specific month and optional property filter
   */
  async generateMonthlyReport(
    month: string, // YYYY-MM format
    propertyId?: string
  ): Promise<MonthlyReport> {
    try {
      // Get month boundaries
      const monthStart = new Date(`${month}-01T00:00:00.000Z`);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59, 999);

      // Fetch all required data in parallel
      const [
        allInvoices,
        allPayments,
        allTenants,
        allUnits,
        allUtilityReadings
      ] = await Promise.all([
        invoiceService.getAll(),
        paymentService.getAll(),
        tenantService.getAll(),
        unitService.getAll(),
        utilityReadingService.getAll()
      ]);

      // Filter data by property if specified
      const invoices = propertyId 
        ? allInvoices.filter(i => i.propertyId === propertyId)
        : allInvoices;
      
      const tenants = propertyId 
        ? allTenants.filter(t => t.propertyId === propertyId)
        : allTenants;
      
      const units = propertyId 
        ? allUnits.filter(u => u.propertyId === propertyId)
        : allUnits;
      
      const utilityReadings = propertyId 
        ? allUtilityReadings.filter(u => u.propertyId === propertyId)
        : allUtilityReadings;

      // Filter by month
      const monthlyInvoices = invoices.filter(i => i.month === month);
      
      const monthlyPayments = allPayments.filter(p => {
        const paymentDate = new Date(p.paymentDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const monthlyUtilities = utilityReadings.filter(u => u.month === month);

      // Calculate revenue (from payments received in the month)
      const revenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate expenses (utilities + other expenses)
      const utilityExpenses = monthlyUtilities.reduce((sum, utility) => sum + utility.amount, 0);
      const expenses = utilityExpenses; // Can be extended with other expense types

      // Calculate net income
      const netIncome = revenue - expenses;

      // Calculate occupancy rate
      const activeTenants = tenants.filter(t => t.isActive);
      const totalUnits = units.length;
      const occupancyRate = totalUnits > 0 ? (activeTenants.length / totalUnits) * 100 : 0;

      // Count invoices sent
      const invoicesSent = monthlyInvoices.length;

      // Count payments received
      const paymentsReceived = monthlyPayments.length;

      return {
        month,
        revenue,
        expenses,
        netIncome,
        occupancyRate,
        invoicesSent,
        paymentsReceived
      };

    } catch (error) {
      console.error('Error generating monthly report:', error);
      throw new Error('Failed to generate monthly report');
    }
  }

  /**
   * Generate reports for multiple months
   */
  async generateMultipleMonthReports(
    startMonth: string,
    endMonth: string,
    propertyId?: string
  ): Promise<MonthlyReport[]> {
    const reports: MonthlyReport[] = [];
    const current = new Date(`${startMonth}-01`);
    const end = new Date(`${endMonth}-01`);

    while (current <= end) {
      const monthStr = current.toISOString().slice(0, 7); // YYYY-MM
      const report = await this.generateMonthlyReport(monthStr, propertyId);
      reports.push(report);
      
      current.setMonth(current.getMonth() + 1);
    }

    return reports;
  }

  /**
   * Get collection rate for a specific month
   */
  async getCollectionRate(month: string, propertyId?: string): Promise<number> {
    try {
      const [allInvoices, allPayments] = await Promise.all([
        invoiceService.getAll(),
        paymentService.getAll()
      ]);

      const invoices = propertyId 
        ? allInvoices.filter(i => i.propertyId === propertyId && i.month === month)
        : allInvoices.filter(i => i.month === month);

      const monthStart = new Date(`${month}-01T00:00:00.000Z`);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59, 999);

      const payments = allPayments.filter(p => {
        const paymentDate = new Date(p.paymentDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
      const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

      return totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;
    } catch (error) {
      console.error('Error calculating collection rate:', error);
      return 0;
    }
  }

  /**
   * Get overdue invoices summary
   */
  async getOverdueSummary(propertyId?: string): Promise<{
    count: number;
    totalAmount: number;
    invoices: Invoice[];
  }> {
    try {
      const allInvoices = await invoiceService.getAll();
      const today = new Date();

      const invoices = propertyId 
        ? allInvoices.filter(i => i.propertyId === propertyId)
        : allInvoices;

      const overdueInvoices = invoices.filter(invoice => 
        invoice.status === 'overdue' || 
        (invoice.status === 'sent' && new Date(invoice.dueDate) < today)
      );

      const totalAmount = overdueInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

      return {
        count: overdueInvoices.length,
        totalAmount,
        invoices: overdueInvoices
      };
    } catch (error) {
      console.error('Error getting overdue summary:', error);
      return { count: 0, totalAmount: 0, invoices: [] };
    }
  }

  /**
   * Get top performing properties by revenue
   */
  async getTopPropertiesByRevenue(month: string, limit: number = 5): Promise<Array<{
    propertyId: string;
    revenue: number;
    invoicesSent: number;
    collectionRate: number;
  }>> {
    try {
      const [allInvoices, allPayments, allUnits] = await Promise.all([
        invoiceService.getAll(),
        paymentService.getAll(),
        unitService.getAll()
      ]);

      // Get unique property IDs
      const propertyIds = [...new Set(allUnits.map(u => u.propertyId))];
      
      const propertyReports = await Promise.all(
        propertyIds.map(async (propertyId) => {
          const report = await this.generateMonthlyReport(month, propertyId);
          const collectionRate = await this.getCollectionRate(month, propertyId);
          
          return {
            propertyId,
            revenue: report.revenue,
            invoicesSent: report.invoicesSent,
            collectionRate
          };
        })
      );

      return propertyReports
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top properties:', error);
      return [];
    }
  }

  /**
   * Export monthly report data to CSV format
   */
  exportToCSV(reports: MonthlyReport[]): string {
    const headers = [
      'Month',
      'Revenue',
      'Expenses', 
      'Net Income',
      'Occupancy Rate (%)',
      'Invoices Sent',
      'Payments Received'
    ];

    const csvContent = [
      headers.join(','),
      ...reports.map(report => [
        report.month,
        report.revenue.toFixed(2),
        report.expenses.toFixed(2),
        report.netIncome.toFixed(2),
        report.occupancyRate.toFixed(1),
        report.invoicesSent,
        report.paymentsReceived
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Download CSV file
   */
  downloadCSV(reports: MonthlyReport[], filename: string = 'monthly-reports.csv'): void {
    const csvContent = this.exportToCSV(reports);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export const monthlyReportService = new MonthlyReportService();