import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const UpdateProduct = () => {
    const oldProductIdRef = useRef();
    const nameRef = useRef();
    const categoryRef = useRef();
    const priceRef = useRef();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // Fetch products to populate the product selection dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products.');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories.');
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const oldProductId = oldProductIdRef.current.value;
            const name = nameRef.current.value;
            const category = categoryRef.current.value;
            const price = parseFloat(priceRef.current.value);

            const response = await axios.put(`http://localhost:8000/api/products/${oldProductId}`, { name, category, price });
            if (response.status === 200) {
                toast.success(`${name} updated successfully!`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating product.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Update Product</h2>
                <form onSubmit={handleUpdate}>
                    <select 
                        ref={oldProductIdRef}
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        required
                    >
                        <option value="" disabled selected>Select a Product</option>
                        {products.map(product => (
                            <option key={product._id} value={product._id}>{product.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="New Product Name"
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
                        placeholder="New Price"
                        ref={priceRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Update Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
