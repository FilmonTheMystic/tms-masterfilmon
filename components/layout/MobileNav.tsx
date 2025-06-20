'use client';

// components/layout/MobileNav.tsx - Mobile navigation component

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
  Menu,
  X,
  ChevronRight,
  Layers,
  LayoutDashboard,
} from 'lucide-react';
import { authService } from '@/lib/firebase/auth';
import { useToast } from '@/lib/hooks/use-toast';

interface MobileNavProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Properties',
    href: '/dashboard/properties',
    icon: Building2,
    badge: null,
  },
  {
    title: 'Units',
    href: '/dashboard/units',
    icon: Home,
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


export function MobileNav({ children, open = false, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const setOpen = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

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
      setOpen(false);
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

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setOpen(false);
      toast({
        title: 'Search',
        description: `Searching for "${searchQuery}"...`,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-base font-bold text-primary">TMS</h1>
              <p className="text-xs text-muted-foreground">Tenant Management</p>
            </div>
          </div>



          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Navigation
            </h2>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.includes(item.href);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.href}>
                  <div className="flex items-center">
                    <Link 
                      href={hasChildren ? '#' : item.href} 
                      className="flex-1"
                      onClick={(e) => {
                        if (hasChildren) {
                          e.preventDefault();
                          toggleExpanded(item.href);
                        } else {
                          handleLinkClick();
                        }
                      }}
                    >
                      <Button
                        variant={isActiveLink(item.href) ? 'secondary' : 'ghost'}
                        className="w-full justify-start px-3"
                        onClick={(e) => {
                          if (hasChildren) {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleExpanded(item.href);
                          }
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="ml-3">{item.title}</span>
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
                      </Button>
                    </Link>
                  </div>

                  {/* Sub-navigation */}
                  {hasChildren && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link key={child.href} href={child.href} onClick={handleLinkClick}>
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

          {/* Bottom Actions */}
          <div className="p-4 space-y-2">
            <Link href="/dashboard/notifications" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-4 w-4" />
                <span className="ml-3">Notifications</span>
                <Badge variant="destructive" className="ml-auto text-xs">
                  3
                </Badge>
              </Button>
            </Link>
            
            <Link href="/dashboard/help" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <HelpCircle className="h-4 w-4" />
                <span className="ml-3">Help & Support</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/settings" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4" />
                <span className="ml-3">Settings</span>
              </Button>
            </Link>

            <Separator className="my-2" />

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-3">Sign Out</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}