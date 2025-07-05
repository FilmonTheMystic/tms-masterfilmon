'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Database } from 'lucide-react';
import { authService } from '@/lib/firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User as UserType } from '@/types';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user data
      const userData = await authService.getCurrentUserData();
      setCurrentUser(userData);

      // Only load all users if current user is admin or manager
      if (userData && (userData.role === 'admin' || userData.role === 'manager')) {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserType[];
        setAllUsers(users);
      } else {
        setAllUsers([]); // Clear users list for non-admin users
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system settings</p>
      </div>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current User
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Name:</span>
                <span>{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Role:</span>
                <Badge variant="secondary">{currentUser.role}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">User ID:</span>
                <span className="text-sm text-muted-foreground">{currentUser.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Created:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No user data found</p>
          )}
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Users in Database:</span>
              <Badge variant="outline">{allUsers.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Connection Status:</span>
              <Badge variant="default">Connected</Badge>
            </div>
            
            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">All Users (Admin/Manager View):</h4>
                {allUsers.length > 0 ? (
                  <div className="space-y-2">
                    {allUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({user.email})</span>
                        </div>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No users found in database.</p>
                )}
              </div>
            )}
            
            {currentUser && currentUser.role !== 'admin' && currentUser.role !== 'manager' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  User list is only available to Administrators and Managers.
                </p>
              </div>
            )}
          </div>
          
          <Button onClick={loadData} className="mt-4">
            Refresh Data
          </Button>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Version:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Environment:</span>
              <Badge variant="outline">Development</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Firebase Project:</span>
              <span className="text-sm text-muted-foreground">flytms-1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}