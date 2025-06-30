import React from 'react';
import { Recycle, Leaf } from 'lucide-react';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <Recycle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">EcoTrack</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Smart Waste Management for a Sustainable Future
          </h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Track, manage, and optimize your waste disposal with intelligent IoT solutions and real-time monitoring.
          </p>
          <div className="flex items-center space-x-6 text-sm opacity-80">
            <div className="flex items-center">
              <Leaf className="w-4 h-4 mr-2" />
              <span>Eco-Friendly</span>
            </div>
            <div className="flex items-center">
              <Recycle className="w-4 h-4 mr-2" />
              <span>Smart Recycling</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};