'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, RefreshCw, DollarSign } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">
            Track and manage tenant payments and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Payments Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Payment tracking and management features are under development
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Payment Tracking</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Online Payment Processing</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Payment History Export</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}