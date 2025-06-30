import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, session, profile } = useAuth();
  const navigate = useNavigate();

  // This effect will run when the session or profile changes after login
  useEffect(() => {
    if (session && profile) {
      if (profile.role === 'admin') {
        navigate('/app/admin/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [session, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // The login function in AuthContext needs to be adapted
      // For now, let's assume it handles the login and the useEffect handles redirection.
      const success = await login(email, password); // Assuming login function exists and works
      if (!success) {
        setError('Login failed. Please check your credentials.');
      }
      // The useEffect will handle navigation on successful login
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-600">Sign in to continue to EcoTrack</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-9 w-5 h-5 text-slate-400" />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-9 w-5 h-5 text-slate-400" />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            placeholder="Enter your password"
            required
          />
        </div>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};