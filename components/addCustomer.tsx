'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Customer {
  cust_id: number;
  cust_name: string;
}

interface Size {
  size_id: number;
  size_text: string;
  size_price: number;
}
import { useRouter } from 'next/navigation';


const TransactionForm = () => {
const [customers, setCustomers] = useState<Customer[]>([]);
   const [sizes, setSizes] = useState<Size[]>([]);
   const [selectedCustomer, setSelectedCustomer] = useState<number>(0);
   const [selectedSize, setSelectedSize] = useState<number>(0);
   const [qty, setQty] = useState<number>(1);
   const [price, setPrice] = useState<number>(0);
   const [amount, setAmount] = useState<number>(0);
const router = useRouter(); 

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
      router.refresh();
      console.log(response.data);
      alert("yes")
  
      setSelectedCustomer(0);
      setSelectedSize(0);
      setQty(0);
      setPrice(0);
      setAmount(0);
    } catch (error) {
      alert(error)
      console.error('Error adding transaction:', error);

    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer">
            Customer:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="customer"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(Number(e.target.value))}
          >
            <option value={0}>Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.cust_id} value={customer.cust_id}>
                {customer.cust_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="size">
            Size:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(Number(e.target.value))}
          >
            <option value={0}>Select a size</option>
            {sizes.map((size) => (
              <option key={size.size_id} value={size.size_id}>
                {size.size_text} 
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="qty">
            Quantity:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            id="qty"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
            type="number"
            id="price"
            value={price}
            readOnly
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
            type="number"
            id="amount"
            value={amount}
            readOnly
          />
        </div>

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
