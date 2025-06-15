import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import { Transaction } from '../../types';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { getCategoryIcon } from '../../utils/categories';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ExpenseChartProps {
  transactions: Transaction[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  // Monthly expenses for the last 6 months
  const getMonthlyData = () => {
    const months = [];
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.type === 'expense' && 
                 transactionDate >= monthStart && 
                 transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push(format(date, 'MMM yyyy'));
      data.push(monthExpenses);
    }
    
    return { months, data };
  };

  // Category breakdown for current month
  const getCategoryData = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const categoryTotals = new Map<string, number>();
    
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= monthStart && date <= monthEnd;
      })
      .forEach(t => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + t.amount);
      });
    
    const sortedCategories = Array.from(categoryTotals.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8); // Top 8 categories
    
    return {
      labels: sortedCategories.map(([category]) => category),
      data: sortedCategories.map(([,amount]) => amount)
    };
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  const barChartData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Monthly Expense Trend',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  const doughnutChartData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
        backgroundColor: [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
          '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Expense Categories (This Month)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ₹${context.parsed.toLocaleString('en-IN')} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <Bar data={barChartData} options={barChartOptions} />
      </Card>
      
      <Card>
        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        
        {categoryData.labels.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Top Categories</h4>
            {categoryData.labels.slice(0, 5).map((category, index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{categoryData.data[index].toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};