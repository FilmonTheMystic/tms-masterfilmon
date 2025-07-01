'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings, 
  Server, 
  Shield, 
  Clock, 
  Bell,
  Mail,
  Database,
  HardDrive,
  Wifi,
  Lock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useToast } from '@/lib/hooks/use-toast';

interface SystemSettings {
  appName: string;
  appVersion: string;
  maxUsers: number;
  sessionTimeout: number;
  emailNotifications: boolean;
  backupFrequency: string;
  logLevel: string;
  maintenanceMode: boolean;
}

export default function AdminSystemPage() {
  const { isSuperAdmin } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    appName: 'TMS Master Filmon',
    appVersion: '1.0.0',
    maxUsers: 1000,
    sessionTimeout: 24,
    emailNotifications: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    maintenanceMode: false,
  });

  const handleSaveSettings = async () => {
    if (!isSuperAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Only super administrators can modify system settings.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // In a real implementation, you would save to your backend/database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Failed to Save Settings',
        description: 'There was an error saving the system settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const systemStats = [
    {
      label: 'System Status',
      value: 'Operational',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Uptime',
      value: '99.9%',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Users',
      value: '1',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Database Size',
      value: '245 MB',
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        </div>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You need super administrator privileges to access system settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            System Settings
          </h1>
          <p className="text-muted-foreground">
            Configure application settings and system parameters
          </p>
        </div>
        
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Application Configuration
          </CardTitle>
          <CardDescription>
            Basic application settings and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input
                id="appName"
                value={settings.appName}
                onChange={(e) => setSettings(prev => ({ ...prev, appName: e.target.value }))}
                placeholder="TMS Master Filmon"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appVersion">Application Version</Label>
              <Input
                id="appVersion"
                value={settings.appVersion}
                onChange={(e) => setSettings(prev => ({ ...prev, appVersion: e.target.value }))}
                placeholder="1.0.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Maximum Users</Label>
              <Input
                id="maxUsers"
                type="number"
                value={settings.maxUsers}
                onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) || 0 }))}
                placeholder="1000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 0 }))}
                placeholder="24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            System-level settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logLevel">Log Level</Label>
              <Select
                value={settings.logLevel}
                onValueChange={(value) => setSettings(prev => ({ ...prev, logLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Send system notifications via email
                  </p>
                </div>
              </div>
              <Badge variant={settings.emailNotifications ? "default" : "secondary"}>
                {settings.emailNotifications ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable access for maintenance
                  </p>
                </div>
              </div>
              <Badge variant={settings.maintenanceMode ? "destructive" : "secondary"}>
                {settings.maintenanceMode ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Monitoring
          </CardTitle>
          <CardDescription>
            Security settings and system monitoring configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Advanced security settings and monitoring features will be available in future updates.
              Current system includes basic authentication and session management.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}