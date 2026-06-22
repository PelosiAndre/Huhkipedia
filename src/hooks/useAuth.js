import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setShowAuthModal(false);
    return 'toasts.loggedIn';
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setShowAuthModal(false);
    return 'toasts.signedUp';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAuthModal(false);
    return 'toasts.loggedOut';
  };

  return {
    user, email, setEmail, password, setPassword,
    showAuthModal, setShowAuthModal,
    handleLogin, handleSignUp, handleLogout
  };
}
