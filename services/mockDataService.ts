import { AthleteProfile, PerformanceLog, InjuryRecord, DietLog, FinancialRecord, CareerGoal, UserRole } from '../types';

// Mock Data Store
const MOCK_ATHLETE: AthleteProfile = {
  id: 'a1',
  name: 'Rohan Gupta',
  sport: 'Athletics (Sprints)',
  age: 22,
  heightCm: 178,
  weightKg: 72,
  role: UserRole.ATHLETE,
  avatarUrl: 'https://picsum.photos/200/200'
};

const MOCK_PERFORMANCE: PerformanceLog[] = [
  { id: 'p1', date: '2023-10-20', metric: '100m Sprint', value: 11.2, unit: 's', strain: 7, durationMin: 60 },
  { id: 'p2', date: '2023-10-22', metric: '100m Sprint', value: 11.0, unit: 's', strain: 8, durationMin: 90 },
  { id: 'p3', date: '2023-10-24', metric: '100m Sprint', value: 10.9, unit: 's', strain: 9, durationMin: 60 },
  { id: 'p4', date: '2023-10-26', metric: 'Squat 1RM', value: 140, unit: 'kg', strain: 9, durationMin: 45 },
  { id: 'p5', date: '2023-10-28', metric: '100m Sprint', value: 10.85, unit: 's', strain: 8, durationMin: 75 },
];

const MOCK_INJURIES: InjuryRecord[] = [
  { id: 'i1', date: '2023-09-10', area: 'Right Hamstring', severity: 'Medium', status: 'Resolved', painLevel: 0 },
  { id: 'i2', date: '2023-10-25', area: 'Left Ankle', severity: 'Low', status: 'Active', painLevel: 3 },
];

const MOCK_DIET: DietLog[] = [
  { id: 'd1', date: '2023-10-28', meal: 'Breakfast', calories: 600, protein: 30, carbs: 80, fats: 15, description: 'Oatmeal with whey and banana' },
  { id: 'd2', date: '2023-10-28', meal: 'Lunch', calories: 850, protein: 45, carbs: 100, fats: 25, description: 'Chicken curry with rice and dal' },
  { id: 'd3', date: '2023-10-28', meal: 'Dinner', calories: 500, protein: 35, carbs: 40, fats: 15, description: 'Grilled paneer salad' },
];

const MOCK_FINANCE: FinancialRecord[] = [
  { id: 'f1', date: '2023-10-01', type: 'Income', category: 'Sponsorship', amount: 25000, description: 'Local Brand Deal' },
  { id: 'f2', date: '2023-10-05', type: 'Expense', category: 'Equipment', amount: 8000, description: 'New Spikes' },
  { id: 'f3', date: '2023-10-15', type: 'Expense', category: 'Travel', amount: 5000, description: 'Transport to State Meet' },
];

const MOCK_GOALS: CareerGoal[] = [
  { id: 'c1', title: 'Qualify for Nationals', targetDate: '2024-03-01', status: 'In Progress' },
  { id: 'c2', title: 'Sub 10.5s 100m', targetDate: '2024-06-01', status: 'Pending' },
];

// Service Methods simulating Backend Endpoints
export const MockBackend = {
  getAthleteProfile: async (): Promise<AthleteProfile> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ATHLETE), 500));
  },
  
  getPerformanceLogs: async (): Promise<PerformanceLog[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PERFORMANCE), 500));
  },

  getInjuryHistory: async (): Promise<InjuryRecord[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_INJURIES), 500));
  },

  getDietLogs: async (): Promise<DietLog[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_DIET), 500));
  },

  getFinancialRecords: async (): Promise<FinancialRecord[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_FINANCE), 500));
  },

  getCareerGoals: async (): Promise<CareerGoal[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_GOALS), 500));
  },

  // Simulated ML Endpoint: Injury Prediction
  // This calculates the baseline risk score locally before asking AI for explanation
  predictInjuryRisk: async (logs: PerformanceLog[], injuries: InjuryRecord[]): Promise<{ score: number, factors: string[] }> => {
    // 1. Calculate Average Strain
    const recentLogs = logs.slice(-5);
    const avgStrain = recentLogs.reduce((acc, curr) => acc + curr.strain, 0) / recentLogs.length;
    
    // 2. Calculate Monotony (Simulated standard deviation of load)
    const loads = recentLogs.map(l => l.strain * l.durationMin);
    const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
    // Simple mock heuristic for monotony
    const riskFactor = avgStrain > 8 ? 0.4 : 0.1;
    
    // 3. Injury History Weight
    const activeInjuries = injuries.filter(i => i.status !== 'Resolved').length;
    
    let totalRisk = 0.2 + riskFactor + (activeInjuries * 0.25);
    totalRisk = Math.min(totalRisk, 0.99); // Cap at 0.99

    return {
      score: totalRisk,
      factors: [
        avgStrain > 7.5 ? "High Recent Strain" : "Moderate Strain",
        activeInjuries > 0 ? "Active Recovery in Progress" : "No Active Injuries",
        "Training Load Monotony Detected"
      ]
    };
  }
};