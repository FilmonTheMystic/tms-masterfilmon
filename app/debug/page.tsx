'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { authService } from '@/lib/firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function DebugPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('test123456');

  const addResult = (test: string, success: boolean, details: string) => {
    setTestResults(prev => [...prev, { test, success, details, timestamp: new Date() }]);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Check Firebase Config
      addResult('Firebase Config', !!auth && !!db, 
        `Auth: ${!!auth ? 'OK' : 'FAIL'}, Firestore: ${!!db ? 'OK' : 'FAIL'}`);

      // Test 2: Check Environment Variables
      const hasEnvVars = !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      );
      addResult('Environment Variables', hasEnvVars, 
        hasEnvVars ? 'All required env vars present' : 'Missing Firebase env vars');

      // Test 3: Check Current Auth State
      const currentUser = auth.currentUser;
      addResult('Current Auth State', !!currentUser, 
        currentUser ? `Logged in as: ${currentUser.email}` : 'No user logged in');

      // Test 4: Test Firestore Connection
      try {
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        addResult('Firestore Connection', true, 'Successfully connected to Firestore');
      } catch (error: any) {
        addResult('Firestore Connection', false, `Error: ${error.message}`);
      }

      // Test 5: Check Users Collection
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        addResult('Users Collection', true, 
          `Found ${usersSnapshot.docs.length} users in Firestore`);
      } catch (error: any) {
        addResult('Users Collection', false, `Error reading users: ${error.message}`);
      }

      // Test 6: Test User Data Retrieval
      if (currentUser) {
        try {
          const userData = await authService.getCurrentUserData();
          addResult('User Data Retrieval', !!userData, 
            userData ? `Retrieved data for: ${userData.name}` : 'No user data found in Firestore');
        } catch (error: any) {
          addResult('User Data Retrieval', false, `Error: ${error.message}`);
        }
      }

    } catch (error: any) {
      addResult('Diagnostics', false, `General error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    
    try {
      addResult('Test Registration', false, 'Starting registration test...');
      
      const result = await authService.signUp({
        email: testEmail,
        password: testPassword,
        name: 'Test User',
        role: 'viewer'
      });

      addResult('Test Registration', true, 
        `Successfully registered user: ${result.user.email} (UID: ${result.user.uid})`);

      // Wait a moment then check if user was saved to Firestore
      setTimeout(async () => {
        const userData = await authService.getCurrentUserData();
        addResult('Firestore Save Check', !!userData, 
          userData ? 'User data successfully saved to Firestore' : 'User data NOT found in Firestore');
      }, 2000);

    } catch (error: any) {
      addResult('Test Registration', false, `Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testFirestoreWrite = async () => {
    setLoading(true);
    
    try {
      const testDoc = {
        test: true,
        timestamp: new Date(),
        message: 'Test write operation'
      };

      const docRef = await addDoc(collection(db, 'debug'), testDoc);
      addResult('Direct Firestore Write', true, 
        `Successfully wrote test document with ID: ${docRef.id}`);
      
    } catch (error: any) {
      addResult('Direct Firestore Write', false, `Write failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Firebase Debug Console</h1>
        <p className="text-muted-foreground">Diagnose Firebase connection and user registration issues</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runDiagnostics} disabled={loading} className="w-full">
              {loading ? 'Running...' : 'Run Diagnostics'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input 
              placeholder="Test email" 
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Test password" 
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
            />
            <Button onClick={testRegistration} disabled={loading} className="w-full">
              Test Registration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Direct Database Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testFirestoreWrite} disabled={loading} className="w-full">
              Test Firestore Write
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.test}</span>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "PASS" : "FAIL"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environment Check */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY },
              { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN },
              { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID },
              { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', value: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET },
              { key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID },
              { key: 'NEXT_PUBLIC_FIREBASE_APP_ID', value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID },
            ].map((env) => (
              <div key={env.key} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium">{env.key}</span>
                <Badge variant={env.value ? "default" : "destructive"}>
                  {env.value ? "SET" : "MISSING"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> This debug page should only be used in development. 
          Remove or protect this route in production.
        </AlertDescription>
      </Alert>
    </div>
  );
}