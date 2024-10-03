// src/components/UpdateProduct.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { setProducts, setCategories, setSelectedCategory } from '../store/productSlice';

const UpdateProduct = () => {
    const oldProductIdRef = useRef();
    const nameRef = useRef();
    const priceRef = useRef();
    const dispatch = useDispatch();

    const { products, categories, filteredProducts, selectedCategory } = useSelector(state => state.product);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                dispatch(setProducts(response.data));
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products.');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories');
                dispatch(setCategories(response.data));
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories.');
            }
        };

        fetchProducts();
        fetchCategories();
    }, [dispatch]);

    // Handle category selection
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        dispatch(setSelectedCategory(categoryId));
        oldProductIdRef.current.value = ''; // Reset product selection
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const oldProductId = oldProductIdRef.current.value;
            const name = nameRef.current.value;
            const price = parseFloat(priceRef.current.value);

            const response = await axios.put(`http://localhost:8000/api/products/${oldProductId}`, { name, category: selectedCategory, price });
            if (response.status === 200) {
                toast.success(`${name} updated successfully!`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating product.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[rgb(255,206,146)]">
            <div className="bg-[rgb(207,156,90)] shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Update Product</h2>
                <form onSubmit={handleUpdate}>
                    <select 
                        onChange={handleCategoryChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    >
                        <option value="" disabled selected>Select a Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.title}</option>
                        ))}
                    </select>

                    <select 
                        ref={oldProductIdRef}
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        required
                        disabled={!selectedCategory} // Disable until a category is selected
                    >
                        <option value="" disabled selected>Select a Product</option>
                        {filteredProducts.map(product => (
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
