'use client';

// components/layout/Header.tsx - Dashboard header with search and user menu

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  Plus,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { authService } from '@/lib/firebase/auth';
import { useToast } from '@/lib/hooks/use-toast';
import { ThemeSelector } from '@/components/shared/ThemeSelector';
import type { User } from '@/types';

interface HeaderProps {
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export function Header({ onMenuClick, showMobileMenu = false }: HeaderProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes and update user data accordingly
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      if (firebaseUser) {
        try {
          console.log('Fetching user data for:', firebaseUser.uid);
          const userData = await authService.getCurrentUserData();
          console.log('User data retrieved:', userData);
          setUser(userData);
          
          // If no user data in Firestore, create a basic user record
          if (!userData) {
            console.log('No user data found, creating basic record');
            const basicUserData = {
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              role: 'viewer' as const,
            };
            await authService.updateUserProfile(firebaseUser.uid, basicUserData);
            const newUserData = await authService.getCurrentUserData();
            setUser(newUserData);
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
          // Set basic user info from Firebase Auth as fallback
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
            role: 'viewer',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        console.log('No user authenticated');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUserData();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUser(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'properties': 'Properties',
      'units': 'Units',
      'tenants': 'Tenants',
      'invoices': 'Invoices',
      'generate': 'Generate Invoice',
      'payments': 'Payments',
      'reports': 'Reports',
      'settings': 'Settings',
      'notifications': 'Notifications',
      'help': 'Help & Support',
    };

    return titles[lastSegment] || 'Dashboard';
  };

  const getPageActions = () => {
    const actions: Record<string, JSX.Element[]> = {
      'invoices': [
        <Button key="generate" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>,
        <Button key="export" variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>,
      ],
      'tenants': [
        <Button key="add" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>,
        <Button key="export" variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>,
      ],
      'properties': [
        <Button key="add" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>,
      ],
      'reports': [
        <Button key="refresh" variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>,
        <Button key="export" variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>,
      ],
    };

    const currentPage = pathname.split('/').pop() || 'dashboard';
    return actions[currentPage] || [];
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.name.split(' ')[0]?.[0] || ''}${user.name.split(' ')[1]?.[0] || ''}`.toUpperCase();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement global search functionality
      console.log('Searching for:', searchQuery);
      toast({
        title: 'Search',
        description: `Searching for "${searchQuery}"...`,
      });
    }
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        {showMobileMenu && onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Mobile menu clicked!');
              onMenuClick();
            }}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        {/* Page title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
          
          {/* Breadcrumb for deeper pages (skip property pages as they have custom breadcrumbs) */}
          {pathname.split('/').length > 3 && !pathname.includes('/properties/') && (
            <nav className="text-sm text-muted-foreground">
              <span>/</span>
              <span className="ml-1 capitalize">
                {pathname.split('/').slice(-2, -1)[0]}
              </span>
            </nav>
          )}
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tenants, invoices, properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </form>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Page Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {getPageActions()}
        </div>

        {/* Filter button for mobile */}
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Filter className="h-4 w-4" />
        </Button>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                <div className="font-medium">Invoice Overdue</div>
                <div className="text-muted-foreground text-xs">
                  Unit 12A payment is 5 days overdue
                </div>
                <div className="text-muted-foreground text-xs mt-1">2 hours ago</div>
              </div>
              <div className="text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                <div className="font-medium">New Tenant Application</div>
                <div className="text-muted-foreground text-xs">
                  Sarah Johnson applied for Unit 8B
                </div>
                <div className="text-muted-foreground text-xs mt-1">1 day ago</div>
              </div>
              <div className="text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                <div className="font-medium">Maintenance Request</div>
                <div className="text-muted-foreground text-xs">
                  Unit 5C reported plumbing issue
                </div>
                <div className="text-muted-foreground text-xs mt-1">2 days ago</div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
                <Badge variant="secondary" className="text-xs w-fit mt-1">
                  {user?.role || 'viewer'}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}