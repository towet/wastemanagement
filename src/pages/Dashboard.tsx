import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DustbinStatus } from '../components/dashboard/DustbinStatus';
import { useWasteStats } from '../hooks/useWasteStats';
import { supabase, type Device } from '../lib/supabase';
import { 
  Recycle, 
  TreePine, 
  Droplets, 
  Wind, 
  Trash2,
  Award,
  Leaf,
  ArrowRight,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTotalStats, getCurrentMonthStats, loading: statsLoading } = useWasteStats();
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      const { data, error } = await supabase.from('devices').select('*');
      if (data) setDevices(data);
      setDevicesLoading(false);
    };

    fetchDevices();

    const subscription = supabase
      .channel('dashboard-devices-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, fetchDevices)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const totalStats = getTotalStats();
  const currentMonthStats = getCurrentMonthStats();
  const activeDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;

  const wasteImpacts = [
    {
      title: "Plastic Pollution",
      description: "8 million tons of plastic enter our oceans annually, harming marine life and ecosystems.",
      impact: "Critical",
      color: "red"
    },
    {
      title: "Greenhouse Gas Emissions",
      description: "Landfills produce 20% of global methane emissions, contributing to climate change.",
      impact: "High",
      color: "orange"
    },
    {
      title: "Resource Depletion",
      description: "Poor waste management leads to unnecessary extraction of natural resources.",
      impact: "Moderate",
      color: "amber"
    }
  ];

  const recyclingTips = [
    {
      category: "Paper & Cardboard",
      tip: "Clean and dry paper before recycling. Remove all plastic components.",
      icon: "📃"
    },
    {
      category: "Plastic Bottles",
      tip: "Remove caps and labels. Rinse containers to remove food residue.",
      icon: "🍶"
    },
    {
      category: "Electronics",
      tip: "Take to certified e-waste centers. Never throw in regular trash.",
      icon: "📱"
    },
    {
      category: "Glass",
      tip: "Separate by color. Remove metal lids and corks before recycling.",
      icon: "🫙"
    }
  ];

  if (statsLoading || devicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.full_name}! 👋
            </h1>
            <p className="text-emerald-100 text-lg">
              Let's make a positive impact on our environment today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Recycle className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="CO₂ Saved"
          value={`${totalStats.co2_saved_kg.toFixed(0)} kg`}
          change={currentMonthStats ? `+${currentMonthStats.co2_saved_kg.toFixed(1)}kg this month` : 'No data this month'}
          changeType="positive"
          icon={TreePine}
        />
        <StatsCard
          title="Waste Recycled"
          value={`${(totalStats.recycled_kg / 1000).toFixed(1)} tons`}
          change={currentMonthStats ? `+${(currentMonthStats.recycled_kg / 1000).toFixed(2)}t this month` : 'No data this month'}
          changeType="positive"
          icon={Recycle}
        />
        <StatsCard
          title="Active Dustbins"
          value={`${activeDevices}`}
          change={offlineDevices > 0 ? `${offlineDevices} offline` : 'All online'}
          changeType={offlineDevices > 0 ? 'negative' : 'positive'}
          icon={Trash2}
        />
        <StatsCard
          title="Trees Saved"
          value={`${totalStats.trees_saved.toFixed(0)}`}
          change={currentMonthStats ? `+${currentMonthStats.trees_saved.toFixed(1)} this month` : 'No data this month'}
          changeType="positive"
          icon={Award}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Environmental Impact Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Environmental Impact of Waste</h2>
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-4">
              {wasteImpacts.map((impact, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{impact.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      impact.color === 'red' ? 'bg-red-100 text-red-700' :
                      impact.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {impact.impact}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{impact.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recycling Tips Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Smart Recycling Tips</h2>
              <Lightbulb className="w-6 h-6 text-amber-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recyclingTips.map((tip, index) => (
                <div key={index} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <h3 className="font-semibold text-emerald-900 mb-1">{tip.category}</h3>
                      <p className="text-emerald-700 text-sm">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Dustbin Status */}
          <DustbinStatus />

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors group">
                <div className="flex items-center">
                  <Recycle className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium text-emerald-700">Schedule Pickup</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <div className="flex items-center">
                  <Leaf className="w-5 h-5 text-slate-600 mr-3" />
                  <span className="font-medium text-slate-700">View Reports</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Environmental Goal */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Monthly Goal</h3>
            <p className="text-green-100 text-sm mb-4">Reduce waste by 15%</p>
            {currentMonthStats && (
              <>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (currentMonthStats.recycled_kg / (currentMonthStats.total_waste_kg || 1)) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-green-100">
                  <span>{((currentMonthStats.recycled_kg / (currentMonthStats.total_waste_kg || 1)) * 100).toFixed(0)}% Recycled</span>
                  <span>{new Date().getDate()} days in</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};