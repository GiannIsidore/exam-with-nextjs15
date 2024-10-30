'use client'
import { useState } from 'react';

interface Transaction {
  trans_id: number;
  cust_name: string;
  size_text: string;
  trans_qty: number;
  trans_price: number;
  trans_amount: number;
}

interface CustomerTableProps {
  transactions: Transaction[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ transactions }) => {
  const [sortField, setSortField] = useState<keyof Transaction>('cust_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTransactions = (transactions ?? [])
    .filter(transaction => 
      transaction.cust_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.size_text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  const SortIcon = ({ field }: { field: keyof Transaction }) => (
    <span className="ml-1">
      {sortField === field ? (
        sortDirection === 'asc' ? '↑' : '↓'
      ) : '↕'}
    </span>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('cust_name')}
            >
              Customer <SortIcon field="cust_name" />
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('size_text')}
            >
              Size <SortIcon field="size_text" />
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('trans_qty')}
            >
              Quantity <SortIcon field="trans_qty" />
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('trans_price')}
            >
              Price <SortIcon field="trans_price" />
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('trans_amount')}
            >
              Amount <SortIcon field="trans_amount" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredAndSortedTransactions.map((transaction) => (
            <tr key={transaction.trans_id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.cust_name}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.size_text}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.trans_qty}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.trans_price}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.trans_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
