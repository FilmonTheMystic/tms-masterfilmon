'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Settings, RefreshCw, Check } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notifications and alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Notifications Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Notification management features are under development
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Real-time Alerts</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Email Notifications</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Notification Preferences</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}