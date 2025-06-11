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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Update the user's display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: user.email!,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      return userCredential;
    } catch (error: any) {
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
        return {
          id: currentUser.uid,
          ...userDoc.data(),
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
}

export const authService = new AuthService();
export default authService;