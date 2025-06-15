import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/export';
import { Transaction } from '../../types';
import { startOfMonth, endOfMonth } from 'date-fns';

interface StatsCardsProps {
  transactions: Transaction[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ transactions }) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= monthStart && date <= monthEnd;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const stats = [
    {
      title: 'Monthly Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-success-600',
      bgColor: 'bg-success-100 dark:bg-success-900/20',
      change: '+12.5%'
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-danger-600',
      bgColor: 'bg-danger-100 dark:bg-danger-900/20',
      change: '-3.2%'
    },
    {
      title: 'Current Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      color: balance >= 0 ? 'text-primary-600' : 'text-danger-600',
      bgColor: balance >= 0 ? 'bg-primary-100 dark:bg-primary-900/20' : 'bg-danger-100 dark:bg-danger-900/20',
      change: balance >= 0 ? '+5.8%' : '-2.1%'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: '+1.2%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <p className={`text-sm mt-1 ${stat.color}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};