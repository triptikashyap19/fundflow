import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { AIPredictions } from '../components/dashboard/AIPredictions';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { Transaction } from '../types';
import { useTransactions } from '../hooks/useTransactions';

export const Dashboard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const { transactions, isLoading } = useTransactions();

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="bg-primary-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-bounce-subtle">
              <span className="text-white font-bold text-2xl">₹</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Loading your transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your finances with AI-powered insights
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="space-y-8">
        {/* Stats Cards */}
        <StatsCards transactions={transactions} />

        {/* Charts */}
        <ExpenseChart transactions={transactions} />

        {/* AI Predictions */}
        <AIPredictions transactions={transactions} />

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
        />
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTransaction={editingTransaction}
      />
    </div>
  );
};