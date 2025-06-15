import { Transaction } from '../types';
import { format } from 'date-fns';

export const exportToCSV = (transactions: Transaction[], filename?: string) => {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (₹)'];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      format(new Date(transaction.date), 'yyyy-MM-dd'),
      transaction.type,
      transaction.category,
      `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes
      transaction.amount.toString()
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};