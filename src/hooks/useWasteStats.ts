import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { UserWasteStats, WasteCollection } from '../lib/supabase';

export const useWasteStats = () => {
  const [stats, setStats] = useState<UserWasteStats[]>([]);
  const [collections, setCollections] = useState<WasteCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWasteStats();
      fetchWasteCollections();
    }
  }, [user]);

  const fetchWasteStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_waste_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('month', { ascending: false });

      if (error) {
        console.error('Error fetching waste stats:', error);
        return;
      }

      setStats(data || []);
    } catch (error) {
      console.error('Error in fetchWasteStats:', error);
    }
  };

  const fetchWasteCollections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('waste_collections')
        .select(`
          *,
          device:devices(*),
          collector:user_profiles(*)
        `)
        .order('collection_date', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching waste collections:', error);
        return;
      }

      setCollections(data || []);
    } catch (error) {
      console.error('Error in fetchWasteCollections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthStats = (): UserWasteStats | null => {
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
    return stats.find(s => s.month === currentMonth) || null;
  };

  const getTotalStats = () => {
    return stats.reduce(
      (totals, stat) => ({
        total_waste_kg: totals.total_waste_kg + stat.total_waste_kg,
        recycled_kg: totals.recycled_kg + stat.recycled_kg,
        co2_saved_kg: totals.co2_saved_kg + stat.co2_saved_kg,
        trees_saved: totals.trees_saved + stat.trees_saved,
      }),
      {
        total_waste_kg: 0,
        recycled_kg: 0,
        co2_saved_kg: 0,
        trees_saved: 0,
      }
    );
  };

  return {
    stats,
    collections,
    loading,
    getCurrentMonthStats,
    getTotalStats,
    refetch: () => {
      fetchWasteStats();
      fetchWasteCollections();
    },
  };
};