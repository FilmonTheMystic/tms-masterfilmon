'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/firebase/auth';
import type { User } from '@/types';

// Super admin emails - can be expanded later through admin interface
const SUPER_ADMINS = [
  'filmonthemystic@gmail.com',
  // Additional super admin emails can be added here
];

export interface AdminAuthState {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    isAdmin: false,
    isSuperAdmin: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const user = await authService.getCurrentUserData();
        
        if (!user) {
          setState({
            isAdmin: false,
            isSuperAdmin: false,
            user: null,
            loading: false,
            error: null,
          });
          return;
        }

        // Check if user is super admin (email whitelist + admin role)
        const isSuperAdmin = SUPER_ADMINS.includes(user.email) && user.role === 'admin';
        
        // Check if user is admin (any admin role)
        const isAdmin = user.role === 'admin' || isSuperAdmin;

        setState({
          isAdmin,
          isSuperAdmin,
          user,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to check admin access:', error);
        setState({
          isAdmin: false,
          isSuperAdmin: false,
          user: null,
          loading: false,
          error: 'Failed to verify admin access',
        });
      }
    };

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged(() => {
      checkAdminAccess();
    });

    return () => unsubscribe();
  }, []);

  return state;
}

// Helper function to check if an email is a super admin
export const isSuperAdminEmail = (email: string): boolean => {
  return SUPER_ADMINS.includes(email);
};

// Helper function to add new super admin (only callable by existing super admins)
export const addSuperAdmin = async (email: string, currentUserEmail: string): Promise<boolean> => {
  if (!isSuperAdminEmail(currentUserEmail)) {
    throw new Error('Only super administrators can add new super admins');
  }
  
  // In a real implementation, this would update a database collection
  // For now, this is a placeholder for the functionality
  console.log(`Adding ${email} as super admin by ${currentUserEmail}`);
  return true;
};
