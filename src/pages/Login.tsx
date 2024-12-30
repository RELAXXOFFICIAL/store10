import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await signIn(data.email, data.password);
      
      // Check user role and redirect accordingly
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/account');
      }
      
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  const handleRegister = async (data: { 
    email: string; 
    password: string; 
    full_name: string;
    phone?: string;
  }) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              user_id: authData.user.id,
              full_name: data.full_name,
              phone: data.phone,
              role: 'customer', // Default role for new registrations
            },
          ]);

        if (profileError) throw profileError;
        
        toast.success('Account created successfully! Please check your email for verification.');
      }
    } catch (error) {
      toast.error('Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );
}