import { GoogleGenAI } from "@google/genai";
import { DietLog, FinancialRecord, PerformanceLog, InjuryRecord } from "../types";

// Initialize Gemini
// NOTE: We assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * Generates a holistic report for the dashboard
   */
  generateDashboardInsights: async (athleteName: string, recentPerformance: PerformanceLog[]) => {
    try {
      const model = ai.models;
      const prompt = `
        Analyze the following recent performance data for athlete ${athleteName}.
        Data: ${JSON.stringify(recentPerformance.slice(0, 3))}
        
        Provide a 2-sentence motivational summary and one key focus area for the week.
        Return in JSON format: { "motivation": "string", "focusArea": "string" }
      `;

      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Dashboard Error:", error);
      return { motivation: "Keep pushing your limits!", focusArea: "Consistency" };
    }
  },

  /**
   * Explains the calculated injury risk
   */
  explainInjuryRisk: async (riskScore: number, factors: string[], logs: PerformanceLog[]) => {
    try {
      const prompt = `
        You are a sports physiotherapist.
        The calculated injury risk score for this athlete is ${riskScore.toFixed(2)} (0-1 scale).
        Risk Factors Identified: ${factors.join(', ')}.
        Recent Training Load: ${JSON.stringify(logs.slice(-3))}

        Provide a short paragraph explaining why the risk is at this level and 3 specific actionable recovery tips.
        Return JSON: { "explanation": "string", "tips": ["string", "string", "string"] }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error(e);
      return { explanation: "Unable to generate detailed analysis.", tips: ["Rest well", "Hydrate", "Stretch"] };
    }
  },

  /**
   * Analyzes Diet Balance
   */
  analyzeDiet: async (logs: DietLog[]) => {
    try {
      const prompt = `
        Analyze the following daily food log:
        ${JSON.stringify(logs)}
        
        Classify the diet as "Optimal", "Needs Improvement", or "Poor".
        Calculate the approximate macro split (Protein/Carb/Fat).
        Provide 3 specific dietary adjustments for an athlete.
        
        Return JSON: { 
          "status": "Optimal" | "Needs Improvement" | "Poor",
          "macroBalance": "string (e.g. 30P/50C/20F)",
          "recommendations": ["string", "string", "string"]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error(e);
        return { status: "Needs Improvement", macroBalance: "Unknown", recommendations: ["Eat more protein"] };
    }
  },

  /**
   * Practice Capture Analysis (Vision)
   */
  analyzePracticeFrame: async (imageBase64: string) => {
    try {
      // Remove data URL prefix if present for clean base64
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

      const prompt = `
        You are an elite sports coach. Analyze this image captured during a practice session.
        Identify the exercise or movement being performed.
        Critique the form/posture if visible.
        Give 2 quick tips to improve technique.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
            { text: prompt }
          ]
        }
      });
      return response.text;
    } catch (e) {
      console.error(e);
      return "Could not analyze the image. Please try again with better lighting.";
    }
  },

  /**
   * Financial Budgeting Advice
   */
  analyzeFinances: async (records: FinancialRecord[]) => {
    try {
      const prompt = `
        Analyze these financial records for a semi-pro athlete:
        ${JSON.stringify(records)}
        
        Provide a brief summary of spending habits and 2 tips for saving money for better equipment or training camps.
      `;
      
      const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: prompt,
      });
      return response.text;
    } catch (e) {
      console.error(e);
      return "Track your expenses closely to save for upcoming tournaments.";
    }
  }
};