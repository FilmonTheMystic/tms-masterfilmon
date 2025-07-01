// lib/firebase/auth.ts - Firebase authentication service

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from './config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { User } from '@/types';

export interface AuthError {
  code: string;
  message: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'manager' | 'accountant' | 'viewer';
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  // Sign up with email and password
  async signUp({ email, password, name, role = 'viewer' }: SignUpData): Promise<UserCredential> {
    try {
      console.log('Starting user registration for:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      console.log('Firebase Auth user created:', user.uid);

      // Update the user's display name
      await updateProfile(user, { displayName: name });
      console.log('Display name updated');

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: user.email!,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Saving user data to Firestore:', userData);
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('User data saved to Firestore successfully');

      return userCredential;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  async signIn({ email, password }: SignInData): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Get current user data from Firestore
  async getCurrentUserData(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        
        return {
          id: currentUser.uid,
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: data.createdAt || data.updatedAt || null,
          updatedAt: data.updatedAt || data.createdAt || null,
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: new Date(),
      }, { merge: true });

      // Update Firebase Auth profile if name changed
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Check if user has required role
  async hasRole(requiredRole: User['role']): Promise<boolean> {
    const userData = await this.getCurrentUserData();
    if (!userData) return false;

    const roleHierarchy = {
      viewer: 1,
      accountant: 2,
      manager: 3,
      admin: 4,
    };

    return roleHierarchy[userData.role] >= roleHierarchy[requiredRole];
  }

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current Firebase user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Handle authentication errors
  private handleAuthError(error: any): AuthError {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/requires-recent-login': 'Please sign in again to perform this action.',
    };

    return {
      code: error.code || 'auth/unknown-error',
      message: errorMessages[error.code] || error.message || 'An unexpected error occurred.',
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Get user ID token (for API requests)
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  // Refresh user token
  async refreshToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      return await user.getIdToken(true); // Force refresh
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  // Admin-only functions
  async setUserRole(userId: string, role: 'admin' | 'manager' | 'accountant' | 'viewer'): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role,
      updatedAt: new Date(),
    });
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Processing user ${data.email}:`, {
          createdAt: data.createdAt,
          createdAtType: typeof data.createdAt,
          updatedAt: data.updatedAt,
          updatedAtType: typeof data.updatedAt
        });
        
        // Return the data with fallback for missing createdAt
        return {
          id: doc.id,
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: data.createdAt || data.updatedAt || null,
          updatedAt: data.updatedAt || data.createdAt || null,
        };
      }) as User[];
      
      console.log(`Found ${users.length} users in Firestore:`, users.map(u => ({ email: u.email, createdAt: u.createdAt })));
      return users;
    } catch (error) {
      console.error('Error fetching users from Firestore:', error);
      throw error;
    }
  }

  // Admin-only user creation that doesn't affect current session
  async createUserAsAdmin({ email, password, name, role = 'viewer' }: SignUpData): Promise<{ userId: string }> {
    try {
      console.log('Admin creating user for:', email);
      
      // Create a separate Firebase app instance for admin operations
      const adminApp = initializeApp(firebaseConfig, 'admin-' + Date.now());
      const adminAuth = getAuth(adminApp);
      
      // Create user with admin auth instance
      const userCredential = await createUserWithEmailAndPassword(adminAuth, email, password);
      const { user } = userCredential;
      console.log('Firebase Auth user created:', user.uid);

      // Update the user's display name
      await updateProfile(user, { displayName: name });
      console.log('Display name updated');

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: user.email!,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Saving user data to Firestore:', userData);
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('User data saved to Firestore successfully');

      // Sign out from admin instance to not affect current session
      await adminAuth.signOut();

      return { userId: user.uid };
    } catch (error: any) {
      console.error('Admin user creation error:', error);
      throw this.handleAuthError(error);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      // Note: Deleting from Firebase Auth requires Firebase Admin SDK
      // This only removes the user from Firestore
      console.log(`User ${userId} deleted from Firestore`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw this.handleAuthError(error);
    }
  }
}

export const authService = new AuthService();
export default authService;