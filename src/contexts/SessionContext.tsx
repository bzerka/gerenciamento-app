import { db } from '@/src/lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/src/contexts/AuthContext';

const SESSION_COLLECTION = 'session';

interface SessionData {
  hasSeenOnboarding: boolean;
  updatedAt?: unknown;
}

interface SessionContextValue {
  hasSeenOnboarding: boolean;
  sessionLoading: boolean;
  setHasSeenOnboarding: (value: boolean) => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasSeenOnboardingState(false);
      setSessionLoading(false);
      return;
    }

    let cancelled = false;
    setSessionLoading(true);

    getDoc(doc(db, SESSION_COLLECTION, user.uid))
      .then((snap) => {
        if (cancelled) return;
        const data = snap.exists() ? (snap.data() as SessionData) : null;
        setHasSeenOnboardingState(data?.hasSeenOnboarding === true);
      })
      .catch(() => {
        if (!cancelled) setHasSeenOnboardingState(false);
      })
      .finally(() => {
        if (!cancelled) setSessionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const setHasSeenOnboarding = useCallback(
    async (value: boolean) => {
      if (!user) return;
      await setDoc(
        doc(db, SESSION_COLLECTION, user.uid),
        { userId: user.uid, hasSeenOnboarding: value, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setHasSeenOnboardingState(value);
    },
    [user]
  );

  const value: SessionContextValue = {
    hasSeenOnboarding,
    sessionLoading,
    setHasSeenOnboarding,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
