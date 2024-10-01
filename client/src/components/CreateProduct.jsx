import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

function CreateProduct() {
    const nameRef = useRef();
    const categoryRef = useRef();
    const priceRef = useRef();
    const [categories, setCategories] = useState([]);

    // Fetch categories to populate the category dropdown
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const name = nameRef.current.value;
            const category = categoryRef.current.value;
            const price = parseFloat(priceRef.current.value); // Ensure price is a number

            console.log("Product Data:", { name, category, price });

            const response = await axios.post('http://localhost:8000/api/products', { name, category, price });
            if (response.status === 201) {
                toast.success(`${name} added as product!`);
            }
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.error?.code === 11000) {
                toast.error(`${name} already exists!`);
            } else {
                toast.error('Error creating product.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Create Product</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        ref={nameRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <select
                        ref={categoryRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    >
                        <option value="" disabled selected>Select a Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.title}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Price"
                        ref={priceRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProduct;
