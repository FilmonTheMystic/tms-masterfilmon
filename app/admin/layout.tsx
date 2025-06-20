'use client';

import { Suspense } from 'react';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeSelector } from '@/components/shared/ThemeSelector';
import { 
  Shield, 
  AlertTriangle, 
  Loader2, 
  ArrowLeft,
  Settings,
  Users,
  Palette,
  Database,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold mb-2">Verifying Admin Access</h2>
          <p className="text-muted-foreground text-center">
            Please wait while we verify your administrative privileges...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-700">Access Denied</h2>
          <p className="text-muted-foreground text-center mb-6">
            You don't have administrative privileges to access this area. 
            Please contact a super administrator if you believe this is an error.
          </p>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button>
                Sign In as Admin
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  const { isSuperAdmin } = useAdminAuth();
  
  const menuItems = [
    {
      href: '/admin',
      label: 'Overview',
      icon: BarChart3,
      description: 'System overview and analytics',
    },
    {
      href: '/admin/users',
      label: 'User Management',
      icon: Users,
      description: 'Manage users and roles',
    },
    {
      href: '/admin/theme',
      label: 'Theme Settings',
      icon: Palette,
      description: 'Customize app appearance',
      superAdminOnly: true,
    },
    {
      href: '/admin/system',
      label: 'System Settings',
      icon: Settings,
      description: 'Application configuration',
      superAdminOnly: true,
    },
    {
      href: '/admin/database',
      label: 'Database Management',
      icon: Database,
      description: 'Test connectivity and manage data',
      superAdminOnly: true,
    },
  ];
  
  const visibleItems = menuItems.filter(item => 
    !item.superAdminOnly || isSuperAdmin
  );
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          System Administration
        </p>
      </div>
      
      <nav className="p-4 space-y-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}>
                <Icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
      
    </div>
  );
}

function AdminHeader() {
  const { user, isSuperAdmin } = useAdminAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Administration</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSelector />
          {isSuperAdmin && (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
              Super Admin
            </div>
          )}
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {user?.role}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, loading, error } = useAdminAuth();
  const pathname = usePathname();
  
  if (loading) {
    return <AdminLoadingPage />;
  }
  
  // If not admin and not on login page, redirect to login
  if (!isAdmin && pathname !== '/admin/login') {
    return <AdminUnauthorizedPage />;
  }
  
  // If on login page, just render the children (login form)
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
