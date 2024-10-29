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
  const sortedTransactions = (transactions ?? []).sort((a, b) => a.cust_name.localeCompare(b.cust_name));

  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {sortedTransactions.map((transaction) => (
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
  );
};

export default CustomerTable;
