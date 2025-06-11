'use client';

// components/layout/Sidebar.tsx - Main navigation sidebar

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Calendar,
  Mail,
  Download,
  Search,
  Filter,
  Plus,
  Home,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { authService } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    badge: null,
  },
  {
    title: 'Properties',
    href: '/dashboard/properties',
    icon: Building2,
    badge: null,
  },
  {
    title: 'Tenants',
    href: '/dashboard/tenants',
    icon: Users,
    badge: null,
  },
  {
    title: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
    badge: 'new',
    children: [
      {
        title: 'All Invoices',
        href: '/dashboard/invoices',
        icon: FileText,
      },
      {
        title: 'Generate Invoice',
        href: '/dashboard/invoices/generate',
        icon: Plus,
      },
      {
        title: 'Overdue',
        href: '/dashboard/invoices?status=overdue',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
    badge: null,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    badge: null,
  },
];

const bottomItems = [
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    badge: '3',
  },
  {
    title: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle,
    badge: null,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
];

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['invoices']);
  const { toast } = useToast();

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
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

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-primary">TMS</h1>
              <p className="text-xs text-muted-foreground">Tenant Management</p>
            </div>
          </div>
        )}
        
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          <Button className="w-full justify-start" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Main Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.href);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.href}>
              <Link href={hasChildren ? '#' : item.href}>
                <Button
                  variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start px-3',
                    isCollapsed && 'px-2',
                    hasChildren && 'cursor-pointer'
                  )}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      toggleExpanded(item.href);
                    }
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === 'new' ? 'default' : 'secondary'}
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {hasChildren && (
                        <ChevronRight 
                          className={cn(
                            'h-4 w-4 ml-auto transition-transform',
                            isExpanded && 'rotate-90'
                          )}
                        />
                      )}
                    </>
                  )}
                </Button>
              </Link>

              {/* Sub-navigation */}
              {hasChildren && isExpanded && !isCollapsed && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children!.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <Link key={child.href} href={child.href}>
                        <Button
                          variant={isActiveLink(child.href) ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start px-3"
                        >
                          <ChildIcon className="h-3 w-3" />
                          <span className="ml-2 text-sm">{child.title}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom Navigation */}
      <div className="p-2 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start px-3',
                  isCollapsed && 'px-2'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          );
        })}

        <Separator className="my-2" />

        {/* Sign Out */}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            'w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50',
            isCollapsed && 'px-2'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>

      {/* Collapsed tooltip helper */}
      {isCollapsed && (
        <div className="p-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-xs text-muted-foreground"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}