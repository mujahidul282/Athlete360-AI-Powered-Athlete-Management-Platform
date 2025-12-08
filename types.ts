export enum UserRole {
  ATHLETE = 'ATHLETE',
  COACH = 'COACH',
  PHYSIO = 'PHYSIO'
}

export interface AthleteProfile {
  id: string;
  name: string;
  sport: string;
  age: number;
  heightCm: number;
  weightKg: number;
  role: UserRole;
  avatarUrl: string;
}

export interface PerformanceLog {
  id: string;
  date: string;
  metric: string; // e.g., "100m Sprint", "Bench Press"
  value: number;
  unit: string;
  strain: number; // 1-10 (RPE)
  durationMin: number;
}

export interface InjuryRecord {
  id: string;
  date: string;
  area: string; // e.g., "Hamstring"
  severity: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Recovering' | 'Resolved';
  painLevel: number; // 1-10
}

export interface DietLog {
  id: string;
  date: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string; // e.g., "Sponsorship", "Equipment"
  amount: number;
  description: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  targetDate: string;
  status: 'Pending' | 'In Progress' | 'Achieved';
}

// AI Analysis Types
export interface InjuryRiskAssessment {
  riskScore: number; // 0.0 to 1.0
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  factors: string[];
  explanation: string;
}

export interface DietAnalysis {
  status: 'Optimal' | 'Needs Improvement' | 'Poor';
  macroBalance: string;
  recommendations: string[];
}