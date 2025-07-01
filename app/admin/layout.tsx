'use client';

import { Suspense, useState, useEffect } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Desktop & Mobile Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-card/95 backdrop-blur-xl border-r border-border 
        transition-all duration-300 ease-in-out
        min-h-screen shadow-xl lg:shadow-none
      `}>
        {/* Header */}
        <div className={`
          p-6 border-b border-border backdrop-blur-sm
          ${isCollapsed ? 'p-4' : 'p-6'}
          transition-all duration-300
        `}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
              <Shield className="h-6 w-6 text-primary flex-shrink-0" />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-xl font-bold text-foreground whitespace-nowrap">
                    Admin Panel
                  </h1>
                </div>
              )}
            </div>
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg 
                className={`w-4 h-4 text-gray-600 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {!isCollapsed && (
            <p className="text-sm text-muted-foreground mt-1 transition-opacity duration-200">
              System Administration
            </p>
          )}
        </div>
        
        {/* Navigation */}
        <nav className={`p-4 space-y-2 ${isCollapsed ? 'p-2' : 'p-4'} transition-all duration-300`}>
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${isCollapsed ? 'justify-center p-3' : 'p-3'}
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/60 shadow-sm' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:shadow-sm'
                  }
                `}>
                  <Icon className={`
                    h-5 w-5 flex-shrink-0 transition-all duration-200
                    ${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-800'}
                  `} />
                  
                  {!isCollapsed && (
                    <div className="overflow-hidden">
                      <div className="font-medium whitespace-nowrap">{item.label}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.description}
                      </div>
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="
                      absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
                      opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200
                      whitespace-nowrap z-50 shadow-lg
                    ">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-300">{item.description}</div>
                      {/* Arrow */}
                      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-200/30">
            <div className="text-xs text-blue-600 font-medium">System Status</div>
            <div className="text-xs text-blue-500">All systems operational</div>
          </div>
        )}
      </div>
      
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}

function AdminHeader() {
  const { user, isSuperAdmin } = useAdminAuth();
  
  return (
    <header className="bg-card/95 backdrop-blur-xl border-b border-border px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="lg:block">
          <h2 className="text-lg font-semibold text-foreground">Administration</h2>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Welcome back, {user?.name}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSelector />
          {isSuperAdmin && (
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-xs font-medium shadow-sm hidden sm:block">
              Super Admin
            </div>
          )}
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
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
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0 ml-0">
          <AdminHeader />
          <main className="p-6 lg:p-8 pt-16 lg:pt-6">
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
