'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield,
  Mail,
  Calendar,
  UserPlus,
  Settings,
  AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { authService } from '@/lib/firebase/auth';
import { useToast } from '@/lib/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types';

// Form schema for user creation/editing
const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'manager', 'accountant', 'viewer'], {
    required_error: 'Please select a role',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  generatePassword: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export default function AdminUsersPage() {
  const { user: currentUser, isSuperAdmin } = useAdminAuth();
  const { toast } = useToast();
  const [state, setState] = useState<UserManagementState>({
    users: [],
    loading: true,
    error: null,
    searchQuery: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
      password: '',
      generatePassword: true,
    },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('Loading users from Firestore...');
      // Fetch all users from Firestore
      const users = await authService.getAllUsers();
      console.log('Loaded users:', users);
      
      setState(prev => ({
        ...prev,
        users,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load users:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load users from database',
      }));
    }
  };

  const generateTemporaryPassword = () => {
    // Generate a secure 12-character temporary password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddUser = async (data: UserFormData) => {
    try {
      setActionLoading(true);
      
      // Use custom password or generate temporary one
      const password = data.generatePassword ? generateTemporaryPassword() : data.password;
      
      // Create user using admin method (doesn't affect current session)
      await authService.createUserAsAdmin({
        email: data.email,
        password: password,
        name: data.name,
        role: data.role,
      });
      
      toast({
        title: 'User Created Successfully!',
        description: `${data.name} has been added to the system.`,
      });
      
      // Show password in secure dialog if generated
      if (data.generatePassword) {
        setTemporaryPassword(password);
        setShowPasswordDialog(true);
      }
      
      // Refresh users list
      await loadUsers();
      
      setShowAddDialog(false);
      form.reset();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast({
        title: 'Failed to Create User',
        description: error.message || 'There was an error creating the user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      
      // Update user role in Firestore
      await authService.updateUserProfile(selectedUser.id, {
        name: data.name,
        role: data.role,
      });
      
      toast({
        title: 'User Updated Successfully',
        description: `${data.name}'s profile has been updated.`,
      });
      
      setShowEditDialog(false);
      setSelectedUser(null);
      form.reset();
      await loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        title: 'Failed to Update User',
        description: 'There was an error updating the user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.id === currentUser?.id) {
      toast({
        title: 'Cannot Delete Current User',
        description: 'You cannot delete your own account.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      // Delete user from Firestore
      await authService.deleteUser(user.id);
      
      toast({
        title: 'User Deleted Successfully',
        description: `${user.name} has been removed from the system.`,
      });
      
      // Refresh users list
      await loadUsers();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      toast({
        title: 'Failed to Delete User',
        description: error.message || 'There was an error deleting the user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    form.setValue('name', user.name);
    form.setValue('email', user.email);
    form.setValue('role', user.role);
    setShowEditDialog(true);
  };

  const filteredUsers = state.users.filter(user =>
    user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'accountant': return 'outline';
      default: return 'secondary';
    }
  };

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts and role permissions
          </p>
        </div>
        
        {isSuperAdmin && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign their role.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="accountant">Accountant</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            {isSuperAdmin && (
                              <SelectItem value="admin">Administrator</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Options */}
                  <FormField
                    control={form.control}
                    name="generatePassword"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Generate Password
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Automatically generate a secure temporary password
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!form.watch('generatePassword') && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter password (min 6 characters)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={actionLoading} className="flex-1">
                      {actionLoading ? 'Creating...' : 'Create User'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Stats */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or role..."
            value={state.searchQuery}
            onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="pl-10 h-10"
          />
        </div>
        
        <Card className="px-4 py-2">
          <div className="text-center">
            <div className="text-lg font-bold">{state.users.length}</div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </div>
        </Card>
      </div>

      {/* Users List */}
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {state.searchQuery ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              {state.searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Start by adding users to manage the tenant management system.'
              }
            </p>
            {!state.searchQuery && isSuperAdmin && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First User
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                        {user.id === currentUser?.id && (
                          <Badge variant="outline">You</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                      disabled={!isSuperAdmin && user.role === 'admin'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {isSuperAdmin && user.id !== currentUser?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role permissions.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        {isSuperAdmin && (
                          <SelectItem value="admin">Administrator</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={actionLoading} className="flex-1">
                  {actionLoading ? 'Updating...' : 'Update User'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Temporary Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              User Created Successfully
            </DialogTitle>
            <DialogDescription>
              The user has been created. Please share this temporary password securely with the new user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">Temporary Password</span>
              </div>
              <div className="bg-white p-3 rounded border font-mono text-lg tracking-wider">
                {temporaryPassword}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>• The user should change this password on their first login</p>
              <p>• Share this password through a secure channel</p>
              <p>• This password will not be shown again</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(temporaryPassword || '');
                  toast({
                    title: 'Password Copied',
                    description: 'Temporary password copied to clipboard',
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Copy Password
              </Button>
              <Button
                onClick={() => {
                  setShowPasswordDialog(false);
                  setTemporaryPassword(null);
                }}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
