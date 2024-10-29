import { useRouter } from 'next/router';

const TransactionForm = () => {
   const [customers, setCustomers] = useState<Customer[]>([]);
   const [sizes, setSizes] = useState<Size[]>([]);
   const [selectedCustomer, setSelectedCustomer] = useState<number>(0);
   const [selectedSize, setSelectedSize] = useState<number>(0);
   const [qty, setQty] = useState<number>(1);
   const [price, setPrice] = useState<number>(0);
   const [amount, setAmount] = useState<number>(0);

   const router = useRouter(); // To programmatically refresh the page

   useEffect(() => {
     fetchCustomers();
     fetchSizes();
   }, []);

   useEffect(() => {
     const selectedSizeObj = sizes.find(size => size.size_id === selectedSize);
     if (selectedSizeObj) {
       setPrice(selectedSizeObj.size_price);
     } else {
       setPrice(0);
     }
   }, [selectedSize, sizes]);

   useEffect(() => {
     setAmount(price * qty);
   }, [price, qty]);

   const fetchCustomers = async () => {
     try {
       const response = await axios.get('http://localhost/my-app/php/customer.php?operation=fetchCustomers');
       setCustomers(response.data.data);
     } catch (error) {
       console.error('Error fetching customers:', error);
     }
   };

   const fetchSizes = async () => {
     try {
       const response = await axios.get('http://localhost/my-app/php/size.php?operation=fetchSizes');
       setSizes(response.data.data);
     } catch (error) {
       console.error('Error fetching sizes:', error);
     }
   };

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     const formData = new FormData();
     formData.append('operation', 'addTransaction');
     formData.append('json', JSON.stringify({
       cust_id: selectedCustomer,
       size_id: selectedSize,
       qty: qty,
       price: price,
       amount: amount
     }));

     try {
       const response = await axios.post('http://localhost/my-app/php/transaction.php', formData);
       console.log(response.data);
       router.reload(); // Refresh the page after successful submission
     } catch (error) {
       console.error('Error adding transaction:', error);
     }
   };

   return (
     <div className="container mx-auto p-4">
       <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
         {/* Form fields for customer, size, quantity, price, and amount */}
         <div className="flex items-center justify-between">
           <button
             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
             type="submit"
           >
             Submit Transaction
           </button>
         </div>
       </form>
     </div>
   );
};

export default TransactionForm;
