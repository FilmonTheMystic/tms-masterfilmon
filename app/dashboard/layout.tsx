// app/dashboard/layout.tsx - Clean Dashboard Layout

'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Toaster } from '@/components/ui/toaster';
import { authService } from '@/lib/firebase/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication status
  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, mounted]);

  // Handle responsive sidebar
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect to login
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          showMobileMenu={true}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}