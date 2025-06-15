import React, { useMemo } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Transaction } from '../../types';
import { FinanceAI } from '../../utils/ai-predictions';
import { formatCurrency } from '../../utils/export';
import { getCategoryIcon } from '../../utils/categories';

interface AIPredictionsProps {
  transactions: Transaction[];
}

export const AIPredictions: React.FC<AIPredictionsProps> = ({ transactions }) => {
  const predictions = useMemo(() => {
    const ai = new FinanceAI(transactions);
    return ai.predictNextMonthExpenses();
  }, [transactions]);

  const analysis = useMemo(() => {
    const ai = new FinanceAI(transactions);
    return ai.analyzeSpendingPatterns();
  }, [transactions]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-danger-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-success-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-danger-600 bg-danger-50 dark:bg-danger-900/20';
      case 'decreasing':
        return 'text-success-600 bg-success-50 dark:bg-success-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-700';
    }
  };

  const totalPredicted = predictions.reduce((sum, p) => sum + p.predictedAmount, 0);
  const highConfidencePredictions = predictions.filter(p => p.confidence > 0.7);

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-primary-100 dark:bg-primary-900/20 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Predictions & Insights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on your spending patterns from the last 6 months
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Predicted Next Month
            </p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(totalPredicted)}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              High Confidence
            </p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {highConfidencePredictions.length} categories
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${getTrendColor(analysis.trend)}`}>
            <p className="text-sm font-medium">
              Spending Trend
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {getTrendIcon(analysis.trend)}
              <span className="text-2xl font-bold capitalize">
                {analysis.trend}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Predictions List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Category Predictions
          </h4>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Next month forecast
          </div>
        </div>

        {predictions.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Add more transactions to get AI predictions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.slice(0, 8).map((prediction, index) => (
              <div
                key={prediction.category}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(prediction.category)}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {prediction.category}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTrendIcon(prediction.trend)}
                      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {prediction.trend} trend
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(prediction.predictedAmount)}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(prediction.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Budget Alerts */}
      {analysis.changePercent > 10 && (
        <Card className="border-orange-200 dark:border-orange-800">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                Spending Alert
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Your spending has increased by {analysis.changePercent.toFixed(1)}% compared to last month. 
                Consider reviewing your budget and identifying areas to optimize.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};