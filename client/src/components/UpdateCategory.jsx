import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const UpdateCategory = () => {
    const oldTitleRef = useRef();
    const newTitleRef = useRef();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories.');
            }
        };

        fetchCategories();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const oldTitleId = oldTitleRef.current.value;
            const title = newTitleRef.current.value;

            console.log(oldTitleId);

            const response = await axios.put(`http://localhost:8000/api/categories/${oldTitleId}`, { title });
            if (response.status === 200) {
                toast.success(`${title} updated successfully!`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating category.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Update Category</h2>
                <form onSubmit={handleUpdate}>
                    <select 
                        ref={oldTitleRef}
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        required
                    >
                        <option value="" disabled selected>Select a Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.title}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="New Category Name"
                        ref={newTitleRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Update Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategory;
