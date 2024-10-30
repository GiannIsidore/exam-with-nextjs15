import TransactionForm from "@/components/addCustomer";
import CustomerTable from "@/components/new_table";

interface Transaction {
  trans_id: number;
  cust_name: string;
  size_text: string;
  trans_qty: number;
  trans_price: number;
  trans_amount: number;
}

export default async function Page() {
  const response = await fetch('http://localhost/my-app/php/transaction.php?operation=fetchTransaction', {
    cache: 'no-store',
  });

  const jsonData = await response.json();
  const transactions: Transaction[] = jsonData?.data ?? [];

  return (
    <div>
      <TransactionForm />
      <CustomerTable transactions={transactions} />
    </div>
  );
}
