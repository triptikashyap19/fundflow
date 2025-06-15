import React, { useState } from 'react';
import { Plus, Calendar, IndianRupee, Tag, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Transaction } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/categories';
import { useTransactions } from '../../hooks/useTransactions';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  editTransaction
}) => {
  const [type, setType] = useState<'income' | 'expense'>(editTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [category, setCategory] = useState(editTransaction?.category || '');
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [date, setDate] = useState(
    editTransaction?.date || new Date().toISOString().split('T')[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { addTransaction, updateTransaction } = useTransactions();

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category: category || categories[0],
      description: description.trim(),
      date,
    };

    try {
      let result;
      if (editTransaction) {
        result = await updateTransaction(editTransaction.id, transactionData);
      } else {
        result = await addTransaction(transactionData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        resetForm();
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setError('');
  };

  const handleClose = () => {
    onClose();
    if (!editTransaction) {
      resetForm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`p-3 rounded-lg border-2 transition-all ${
                type === 'expense'
                  ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">💸</div>
                <div className="font-medium">Expense</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`p-3 rounded-lg border-2 transition-all ${
                type === 'income'
                  ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="font-medium">Income</div>
              </div>
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          type="number"
          label="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          icon={<IndianRupee className="h-4 w-4 text-gray-400" />}
          required
          min="0"
          step="0.01"
        />

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description - Optional */}
        <Input
          type="text"
          label="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter transaction description"
          icon={<FileText className="h-4 w-4 text-gray-400" />}
        />

        {/* Date */}
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={<Calendar className="h-4 w-4 text-gray-400" />}
          required
        />

        {error && (
          <div className="text-danger-600 text-sm bg-danger-50 dark:bg-danger-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            {editTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};