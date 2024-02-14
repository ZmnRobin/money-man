'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Loader from '../Loader';

interface CategoryFormProps {
  onClose: () => void;
  fetchExpenses:()=>void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({onClose,fetchExpenses }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [loading,setLoading]=useState(false);
  const [categories, setCategories] = useState([]);
  const { data: session } = useSession();
  const email=session?.user?.email;

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

  useEffect(() => {
    fetchCategories();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      // Check if all required fields are filled
    if (!email || !name || !type) {
      toast.error("'All fields are required.")
      return;
    }
    try {
      await axios.post('/api/category', {email,name,type});
      toast.success("Category created successfully,now you can add income or expense by using this category.",{duration:3000})
      // Reset form fields after successful submission
      setName('');
      setType('');
      onClose(); // Close the modal
    } catch (error) {
      toast.error("Error creating category.")
      console.error('Error creating category:', error);
    }
  };

  const handleCategoryDelete=async(id:string)=>{
    try {
          await axios.delete(`/api/category?id=${id}&email=${email}`);
          fetchCategories();
          fetchExpenses();
          toast.success("Category and associated expenses deleted successfully.")
      } catch (error) {
          console.error('Error deleting category:', error);
          toast.error('Error deleting category!');
      }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-80">
        {/* Display Categories */}
        {categories?.length>0 && 
         <><h2 className="text-lg font-semibold mb-4 border-b-orange-500">Previous Category</h2><div className="grid grid-cols-3 gap-2">
            {categories?.map((category: any) => (
              <div key={category._id} className="flex items-center justify-between border rounded-md px-4 py-2">
                <p className="flex-grow whitespace-nowrap overflow-hidden overflow-ellipsis">{category.name}</p>
                <span onClick={() => handleCategoryDelete(category._id)} className="cursor-pointer">&times;</span>
              </div>
            ))}
          </div></>}
        <h2 className="text-lg font-semibold my-4">Create New Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">Category Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder='category name ...'
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block mb-1">Type:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select Type</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" className="mr-2 px-4 py-2 border rounded-md" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Create</button>
          </div>
        </form>
      </div>
      {loading && <Loader/>}
    </div>
  );
};

export default CategoryForm;

