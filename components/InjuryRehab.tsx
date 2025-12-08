import React, { useEffect, useState } from 'react';
import { MockBackend } from '../services/mockDataService';
import { GeminiService } from '../services/geminiService';
import { InjuryRiskAssessment, InjuryRecord } from '../types';
import { AlertCircle, CheckCircle, Brain, RefreshCw } from 'lucide-react';

const InjuryRehab: React.FC = () => {
  const [assessment, setAssessment] = useState<InjuryRiskAssessment | null>(null);
  const [history, setHistory] = useState<InjuryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // 1. Fetch Data
      const logs = await MockBackend.getPerformanceLogs();
      const injuries = await MockBackend.getInjuryHistory();
      setHistory(injuries);

      // 2. Run Local ML Simulation (Calculates the Score)
      const prediction = await MockBackend.predictInjuryRisk(logs, injuries);

      // 3. Send to Gemini for Qualitative Analysis
      const aiResponse = await GeminiService.explainInjuryRisk(prediction.score, prediction.factors, logs);

      // 4. Combine
      setAssessment({
        riskScore: prediction.score,
        riskLevel: prediction.score > 0.7 ? 'High' : prediction.score > 0.4 ? 'Moderate' : 'Low',
        factors: prediction.factors,
        explanation: aiResponse.explanation || "Analysis unavailable.",
      });

    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Injury Risk & Rehabilitation</h2>
        <button 
            onClick={runAnalysis} 
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Brain size={18} />}
            <span>Re-Analyze</span>
        </button>
      </div>

      {assessment && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white dark:bg-slate-800 ${
                assessment.riskLevel === 'High' ? 'border-red-500' : 
                assessment.riskLevel === 'Moderate' ? 'border-yellow-500' : 'border-green-500'
            }`}>
                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Predictive Risk Score</h3>
                <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${
                        assessment.riskLevel === 'High' ? 'text-red-500' : 
                        assessment.riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                        {(assessment.riskScore * 100).toFixed(0)}%
                    </span>
                    <span className="text-slate-400 mb-1">{assessment.riskLevel} Risk</span>
                </div>
            </div>

            {/* AI Explanation */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain size={100} />
                </div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Brain size={20} className="text-emerald-400"/> AI Analysis
                </h3>
                <p className="text-slate-300 leading-relaxed">
                    {assessment.explanation}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {assessment.factors.map((f, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-emerald-200 border border-white/10">
                            {f}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Injury History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Injury History</h3>
        <div className="space-y-4">
            {history.map(injury => (
                <div key={injury.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 ${injury.status === 'Resolved' ? 'text-green-500' : 'text-orange-500'}`}>
                            {injury.status === 'Resolved' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{injury.area}</h4>
                            <p className="text-sm text-slate-500">{injury.date} • Severity: {injury.severity}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        injury.status === 'Active' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                        injury.status === 'Recovering' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                        {injury.status}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InjuryRehab;