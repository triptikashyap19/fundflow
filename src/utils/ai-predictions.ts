import { Transaction, PredictionData } from '../types';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export class FinanceAI {
  private transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  // Simple linear regression for trend analysis
  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const n = values.length;
    const sumX = values.reduce((sum, _, i) => sum + i, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    if (slope > 0.1) return 'increasing';
    if (slope < -0.1) return 'decreasing';
    return 'stable';
  }

  // Calculate moving average for smoothing
  private movingAverage(values: number[], window: number = 3): number[] {
    const result: number[] = [];
    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - window + 1);
      const slice = values.slice(start, i + 1);
      const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      result.push(avg);
    }
    return result;
  }

  // Get monthly spending by category for the last 6 months
  private getMonthlySpending(): Map<string, number[]> {
    const monthlyData = new Map<string, number[]>();
    const now = new Date();
    
    // Initialize with last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      
      const monthTransactions = this.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate >= monthStart && 
               transactionDate <= monthEnd;
      });
      
      // Group by category
      const categoryTotals = new Map<string, number>();
      monthTransactions.forEach(t => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + t.amount);
      });
      
      // Add to monthly data
      categoryTotals.forEach((amount, category) => {
        if (!monthlyData.has(category)) {
          monthlyData.set(category, new Array(6).fill(0));
        }
        monthlyData.get(category)![5 - i] = amount;
      });
    }
    
    return monthlyData;
  }

  // Predict next month's expenses using simple forecasting
  predictNextMonthExpenses(): PredictionData[] {
    const monthlySpending = this.getMonthlySpending();
    const predictions: PredictionData[] = [];
    
    monthlySpending.forEach((amounts, category) => {
      // Filter out zero values for better prediction
      const nonZeroAmounts = amounts.filter(amount => amount > 0);
      
      if (nonZeroAmounts.length < 2) {
        // Not enough data, use average of available data
        const avg = nonZeroAmounts.reduce((sum, val) => sum + val, 0) / nonZeroAmounts.length;
        predictions.push({
          category,
          predictedAmount: Math.round(avg || 0),
          confidence: nonZeroAmounts.length > 0 ? 0.3 : 0.1,
          trend: 'stable'
        });
        return;
      }
      
      // Apply moving average for smoothing
      const smoothed = this.movingAverage(amounts);
      const trend = this.calculateTrend(smoothed);
      
      // Simple prediction: weighted average of recent months
      const weights = [0.1, 0.15, 0.2, 0.25, 0.3]; // More weight to recent months
      let prediction = 0;
      let totalWeight = 0;
      
      for (let i = Math.max(0, amounts.length - 5); i < amounts.length; i++) {
        const weight = weights[i - Math.max(0, amounts.length - 5)] || 0.2;
        prediction += amounts[i] * weight;
        totalWeight += weight;
      }
      
      prediction = prediction / totalWeight;
      
      // Adjust based on trend
      if (trend === 'increasing') {
        prediction *= 1.1; // 10% increase
      } else if (trend === 'decreasing') {
        prediction *= 0.9; // 10% decrease
      }
      
      // Calculate confidence based on data consistency
      const variance = amounts.reduce((sum, val) => {
        const diff = val - (amounts.reduce((s, v) => s + v, 0) / amounts.length);
        return sum + diff * diff;
      }, 0) / amounts.length;
      
      const avgAmount = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
      const coefficientOfVariation = Math.sqrt(variance) / (avgAmount || 1);
      const confidence = Math.max(0.1, Math.min(0.9, 1 - coefficientOfVariation));
      
      predictions.push({
        category,
        predictedAmount: Math.round(Math.max(0, prediction)),
        confidence: Math.round(confidence * 100) / 100,
        trend
      });
    });
    
    return predictions.sort((a, b) => b.predictedAmount - a.predictedAmount);
  }

  // Analyze spending patterns
  analyzeSpendingPatterns() {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const currentMonthExpenses = this.transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth(now))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthExpenses = this.transactions
      .filter(t => t.type === 'expense' && 
        new Date(t.date) >= startOfMonth(oneMonthAgo) && 
        new Date(t.date) <= endOfMonth(oneMonthAgo))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const changePercent = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;
    
    return {
      currentMonthExpenses,
      lastMonthExpenses,
      changePercent: Math.round(changePercent * 100) / 100,
      trend: changePercent > 5 ? 'increasing' : changePercent < -5 ? 'decreasing' : 'stable'
    };
  }
}