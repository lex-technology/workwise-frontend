'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  userProfile: null,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loading: true,
  getToken: () => null,
  supabase,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const subscribeToProfile = (userId) => {
    console.log('Setting up profile subscription for user:', userId);

    const profileSubscription = supabase
      .channel(`public:user_profiles:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time update received:', {
            event: payload.eventType,
            oldRecord: payload.old,
            newRecord: payload.new,
          });
          setUserProfile(payload.new);
        }
      )
      .on('error', (error) => {
        console.error('Subscription error:', error);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return profileSubscription;
  };

  const handleTokenExpiration = useCallback(() => {
    console.log('Token expired, logging out user');
    setUser(null);
    setUserProfile(null);
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    toast.error('Your session has expired. Please log in again.');
    router.push('/auth');
  }, [router]);

  const isTokenValid = useCallback(
    (token) => {
      try {
        const decoded = jwtDecode(token);
        const isValid = decoded.exp * 1000 > Date.now();
        if (!isValid) {
          handleTokenExpiration();
        }
        return isValid;
      } catch (error) {
        console.error('Token validation failed:', error);
        handleTokenExpiration();
        return false;
      }
    },
    [handleTokenExpiration]
  );

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase session first
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (session) {
          const userData = {
            id: session.user.id,
            email: session.user.email,
            access_token: session.access_token,
          };

          setUser(userData);

          // Fetch and subscribe to profile
          await fetchUserProfile(userData.id);
          const subscription = subscribeToProfile(userData.id);

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Fallback to stored token check
          const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');

          if (token && isTokenValid(token)) {
            const userData = JSON.parse(
              sessionStorage.getItem('user') || localStorage.getItem('user')
            );
            if (userData) {
              setUser(userData);
              await fetchUserProfile(userData.id);
              const subscription = subscribeToProfile(userData.id);
              return () => {
                subscription.unsubscribe();
              };
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        handleTokenExpiration();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [handleTokenExpiration, isTokenValid]);

  const login = async (email, password, rememberMe = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userData = {
        id: data.user.id,
        email: data.user.email,
        access_token: data.session.access_token,
      };

      setUser(userData);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', data.session.access_token);
      storage.setItem('user', JSON.stringify(userData));

      // Fetch profile after successful login
      await fetchUserProfile(userData.id);

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      // Replace direct Supabase call with backend API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });

      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.detail || 'Signup failed');
      // }
      // const data = await response.json();
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getToken = () => {
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    if (token && !isTokenValid(token)) {
      handleTokenExpiration();
      return null;
    }
    return token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        login,
        signup,
        logout,
        loading,
        getToken,
        supabase,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
