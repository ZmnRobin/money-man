// ExpenseForm.tsx
'use client'
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

interface ExpenseFormProps {
  onClose: () => void;
  fetchExpenses: () => Promise<void>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, fetchExpenses, setLoading }) => {
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/category?email=${email}&type=expense`);
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false)
        toast.error('Error fetching categories!');
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Check if all required fields are filled
    if (!amount || !selectedCategory) {
      console.error('All fields are required.');
      toast.error('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      const formattedMonth = selectedDate.toLocaleString('en', { month: 'long' });
      const response = await axios.post('/api/expense', {
        email,
        category: selectedCategory,
        amount: parseFloat(amount),
        date: selectedDate,
        month: formattedMonth,
      });

      console.log('Expense created successfully:', response.data);
      toast.success('Expense created successfully.');
      // Reset form fields after successful submission
      setAmount('');
      setSelectedCategory('');
      setSelectedDate(new Date()); // Reset date picker to current date
      onClose(); // Close the modal
      fetchExpenses();
    } catch (error) {
      toast.error('Error creating expense!');
      console.error('Error creating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Create Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-1">
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block mb-1">
              Category:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category: any) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block mb-1">
              Date:
            </label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              className="w-full border rounded-md px-3 py-2"
              dateFormat="yyyy-MM-dd"
              minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)} // Start of current month
              maxDate={new Date()} // Current date
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" className="mr-2 px-4 py-2 border rounded-md" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
