import React, { useEffect, useState } from 'react';
import { MockBackend } from '../services/mockDataService';
import { GeminiService } from '../services/geminiService';
import { AthleteProfile, PerformanceLog } from '../types';
import { TrendingUp, Activity, AlertTriangle, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [performance, setPerformance] = useState<PerformanceLog[]>([]);
  const [insight, setInsight] = useState<{ motivation: string; focusArea: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prof, perf] = await Promise.all([
          MockBackend.getAthleteProfile(),
          MockBackend.getPerformanceLogs()
        ]);
        setProfile(prof);
        setPerformance(perf);
        
        const aiInsight = await GeminiService.generateDashboardInsights(prof.name, perf);
        setInsight(aiInsight);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {profile?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{profile?.sport} • {profile?.role}</p>
        </div>
        <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-400">Next Event</p>
            <p className="font-semibold text-emerald-600">State Championship (14 days)</p>
        </div>
      </div>

      {/* AI Insight Card */}
      {insight && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                    <Zap className="text-yellow-300" size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">AI Coach Insight</h3>
                    <p className="text-emerald-50 opacity-90 mb-2">"{insight.motivation}"</p>
                    <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        Focus Area: {insight.focusArea}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <TrendingUp size={20}/>
                </div>
                <h3 className="font-medium text-slate-700 dark:text-slate-300">Last Session</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {performance[performance.length-1]?.value} {performance[performance.length-1]?.unit}
            </p>
            <p className="text-sm text-slate-500 mt-1">{performance[performance.length-1]?.metric}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <Activity size={20}/>
                </div>
                <h3 className="font-medium text-slate-700 dark:text-slate-300">Training Load</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">High</p>
            <p className="text-sm text-slate-500 mt-1">Strain 8.5/10 (Avg)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                    <AlertTriangle size={20}/>
                </div>
                <h3 className="font-medium text-slate-700 dark:text-slate-300">Injury Risk</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Moderate</p>
            <p className="text-sm text-slate-500 mt-1">Check Rehab Tab</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;