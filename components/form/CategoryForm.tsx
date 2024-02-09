'use client'
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const { data: session } = useSession();
  const email=session?.user?.email;

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

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Create Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">Category Name:</label>
            <input
              id="name"
              type="text"
              value={name}
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
    </div>
  );
};

export default CategoryForm;

