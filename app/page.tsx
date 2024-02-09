'use client'
import { useEffect, useState } from "react";
import CategoryForm from "@/components/form/CategoryForm";
import ExpenseForm from "@/components/form/ExpenseForm";
import axios from "axios";
import { useSession } from "next-auth/react";
import ExpenseTable from "@/components/homePage/ExpenseTable";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function Home() {
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en', { month: 'long' });
    return currentMonth;
  }); 
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const { data: session } = useSession();
  const email=session?.user?.email;

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/expense?email=${email}&month=${selectedMonth}`);
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching expenses!");
      setLoading(false);
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [email, selectedMonth]);

  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const response = await axios.get(`/api/months?email=${email}`);
        setAvailableMonths(response.data);
        
      } catch (error) {
        toast.error("Error fetching available months!");
        console.error('Error fetching available months:', error);
      }
    };
    fetchAvailableMonths();
  }, [email]);

  const onClose = () => {
    setShowCategoryForm(false);
    setShowExpenseForm(false);
  };

  return (
    <div className="container m-auto">
      <div className="grid grid-cols-3">
        <button className="border p-1 hover:bg-gray-200" onClick={()=>setShowCategoryForm(true)}>+ Category</button>
        <button className="border p-1 hover:bg-gray-200">+ Income</button>
        <button className="border p-1 hover:bg-gray-200" onClick={()=>setShowExpenseForm(true)}>- Expense</button>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <Card title="Total Income" value={500} />
        <Card title="Total Expense" value={300} />
        <Card title="Current Balance" value={200} />
        <Card title="Profit or Loss" value={-100} />
      </div> */}

        {/* Month dropdown */}
        <div className="my-3">
          <label className="block mb-1">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All Months</option>
            {availableMonths.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {expenses?.length===0 ? <div className="text-center text-3xl font-bold text-red-600">
          <h1>No data found!</h1>
        </div>:
        <div>
            <ExpenseTable expenses={expenses} />
        </div>}
      {loading && <Loader/>}
      {showCategoryForm && <CategoryForm onClose={onClose}/>}
      {showExpenseForm && <ExpenseForm onClose={onClose} fetchExpenses={fetchExpenses} setLoading={setLoading}/>}
    </div>
  );
}
