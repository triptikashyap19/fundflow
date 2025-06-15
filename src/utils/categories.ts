export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Rent',
  'Insurance',
  'Investment',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Interest from Mutual Funds',
  'Interest from Fixed Deposits',
  'Interest from Savings Account',
  'Dividend from Stocks',
  'Freelance Income',
  'Business Income',
  'Rental Income',
  'Bonus',
  'Gift Money',
  'Refund',
  'Other Income'
];

export const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Food & Dining': '🍽️',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '💡',
    'Healthcare': '🏥',
    'Education': '📚',
    'Travel': '✈️',
    'Groceries': '🛒',
    'Rent': '🏠',
    'Insurance': '🛡️',
    'Investment': '📈',
    'Salary': '💼',
    'Interest from Mutual Funds': '📊',
    'Interest from Fixed Deposits': '🏦',
    'Interest from Savings Account': '💰',
    'Dividend from Stocks': '📈',
    'Freelance Income': '💻',
    'Business Income': '🏢',
    'Rental Income': '🏘️',
    'Bonus': '🎉',
    'Gift Money': '🎁',
    'Refund': '↩️',
    'Other Income': '💵',
    'Other': '📋'
  };
  
  return iconMap[category] || '📋';
};