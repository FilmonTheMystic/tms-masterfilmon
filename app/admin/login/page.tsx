'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { signInSchema, type SignInFormData } from '@/lib/validations/schemas';
import { authService } from '@/lib/firebase/auth';
import { useToast } from '@/lib/hooks/use-toast';

function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.getCurrentUserData();
      if (user && user.role === 'admin') {
        const redirectTo = searchParams.get('redirect') || '/admin';
        router.push(redirectTo);
      }
    };

    const unsubscribe = authService.onAuthStateChanged(() => {
      checkAuth();
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await authService.signIn(data);
      const userData = await authService.getCurrentUserData();
      
      // Verify admin access
      if (!userData || userData.role !== 'admin') {
        setError('Access denied. This login is for administrators only.');
        await authService.signOut();
        return;
      }
      
      toast({
        title: 'Admin access granted!',
        description: 'Welcome to the admin panel.',
      });

      // Redirect to admin panel or original destination
      const redirectTo = searchParams.get('redirect') || '/admin';
      router.push(redirectTo);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Welcome */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Secure administrator access</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Administrator Sign In</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the administration panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Enter your admin email"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      href="/reset-password"
                      className="text-slate-600 hover:text-slate-800 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in to Admin Panel'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Back to Main App */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Main App
          </Link>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p>🔒 Administrator access only • All login attempts are monitored</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin login...</p>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}