import React from 'react';
import { Recycle, Shield, Users, BarChart3 } from 'lucide-react';
import { SignupForm } from '../../components/auth/SignupForm';

export const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <SignupForm />
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <Recycle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">EcoTrack</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Join the Green Revolution
          </h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Create your account and start making a positive impact on the environment with our smart waste management platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                <p className="text-sm opacity-80">Monitor waste levels and patterns with advanced data visualization</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Community Impact</h3>
                <p className="text-sm opacity-80">Connect with others and make a collective environmental difference</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure & Reliable</h3>
                <p className="text-sm opacity-80">Enterprise-grade security with 99.9% uptime guarantee</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-600/10 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-20 h-20 bg-emerald-600/10 rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-emerald-600/10 rounded-full"></div>
      </div>
    </div>
  );
};