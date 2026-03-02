import { auth, db } from '@/src/lib/firebase';
import type { UserProfile } from '@/types';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: Omit<UserProfile, 'uid' | 'email' | 'createdAt'>) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? '';
      if (code === 'auth/user-not-found') {
        setError('Email não cadastrado.');
      } else if (code === 'auth/wrong-password') {
        setError('Senha incorreta.');
      } else if (code === 'auth/invalid-credential') {
        setError('Email ou senha incorretos.');
      } else if (code === 'auth/invalid-email') {
        setError('Email inválido.');
      } else {
        setError('Não foi possível entrar. Tente novamente.');
      }
      throw e;
    }
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      profile: Omit<UserProfile, 'uid' | 'email' | 'createdAt'>
    ) => {
      setError(null);
      try {
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
        const userDoc: UserProfile = {
          uid: newUser.uid,
          email,
          nome: profile.nome,
          cpf: profile.cpf,
          batalhao: profile.batalhao,
          posto: profile.posto,
          regiao: profile.regiao,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', newUser.uid), userDoc);
      } catch (e: unknown) {
        const code = (e as { code?: string })?.code ?? '';
        if (code === 'auth/email-already-in-use') {
          setError('Este email já está em uso.');
        } else if (code === 'auth/weak-password') {
          setError('A senha deve ter pelo menos 6 caracteres.');
        } else if (code === 'auth/invalid-email') {
          setError('Email inválido.');
        } else {
          setError('Não foi possível criar a conta. Tente novamente.');
        }
        throw e;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setError(null);
    await firebaseSignOut(auth);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          setUserProfile(snap.exists() ? (snap.data() as UserProfile) : null);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value: AuthContextValue = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
