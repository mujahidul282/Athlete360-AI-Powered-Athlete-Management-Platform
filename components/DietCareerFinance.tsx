import React, { useEffect, useState } from 'react';
import { MockBackend } from '../services/mockDataService';
import { GeminiService } from '../services/geminiService';
import { DietLog, DietAnalysis, FinancialRecord, CareerGoal } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, Circle, DollarSign, Target, Utensils } from 'lucide-react';

// --- SUB-COMPONENTS FOR CLEANLINESS ---

const DietSection: React.FC = () => {
  const [logs, setLogs] = useState<DietLog[]>([]);
  const [analysis, setAnalysis] = useState<DietAnalysis | null>(null);

  useEffect(() => {
    MockBackend.getDietLogs().then(async (data) => {
        setLogs(data);
        const result = await GeminiService.analyzeDiet(data);
        setAnalysis(result);
    });
  }, []);

  // Simple aggregation for chart
  const data = [
    { name: 'Protein', value: logs.reduce((a,b) => a + b.protein, 0) },
    { name: 'Carbs', value: logs.reduce((a,b) => a + b.carbs, 0) },
    { name: 'Fats', value: logs.reduce((a,b) => a + b.fats, 0) },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <Utensils className="text-emerald-500"/> Nutrition Log
        </h3>
        
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"/> Protein</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"/> Carbs</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded-full"/> Fats</span>
                </div>
            </div>

            <div className="w-full md:w-1/2">
                {analysis ? (
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">AI Assessment: {analysis.status}</p>
                        <p className="text-sm text-slate-500 mb-2">{analysis.macroBalance}</p>
                        <ul className="text-sm space-y-1">
                            {analysis.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="text-emerald-500">•</span> {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : <p className="text-slate-400 text-sm">Loading analysis...</p>}
            </div>
        </div>
    </div>
  );
};

const FinanceCareerSection: React.FC = () => {
    const [finances, setFinances] = useState<FinancialRecord[]>([]);
    const [goals, setGoals] = useState<CareerGoal[]>([]);
    const [advice, setAdvice] = useState<string>('');

    useEffect(() => {
        Promise.all([MockBackend.getFinancialRecords(), MockBackend.getCareerGoals()])
            .then(async ([fData, gData]) => {
                setFinances(fData);
                setGoals(gData);
                const aiAdvice = await GeminiService.analyzeFinances(fData);
                setAdvice(aiAdvice || '');
            });
    }, []);

    const income = finances.filter(f => f.type === 'Income').reduce((a,b) => a + b.amount, 0);
    const expense = finances.filter(f => f.type === 'Expense').reduce((a,b) => a + b.amount, 0);

    return (
        <div className="space-y-6">
            {/* Career Goals */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <Target className="text-blue-500"/> Career Goals
                </h3>
                <div className="space-y-3">
                    {goals.map(g => (
                        <div key={g.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                {g.status === 'Achieved' ? <CheckCircle className="text-green-500" size={18}/> : <Circle className="text-slate-400" size={18}/>}
                                <span className={g.status === 'Achieved' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}>{g.title}</span>
                            </div>
                            <span className="text-xs bg-white dark:bg-slate-600 px-2 py-1 rounded text-slate-500 dark:text-slate-300">{g.targetDate}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Finances */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <DollarSign className="text-emerald-500"/> Financial Tracker
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Income</p>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">₹{income}</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-xs text-red-600 dark:text-red-400">Expenses</p>
                        <p className="text-lg font-bold text-red-700 dark:text-red-300">₹{expense}</p>
                    </div>
                </div>
                {advice && (
                    <div className="text-sm text-slate-600 dark:text-slate-300 italic border-l-2 border-emerald-500 pl-3">
                        "Gemini Tip: {advice}"
                    </div>
                )}
            </div>
        </div>
    );
};

export { DietSection, FinanceCareerSection };