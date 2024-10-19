import mongoose from "mongoose";
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../store/categorySlice'; // Assuming you have products tied to categories

function CreateDeal() {
    const titleRef = useRef();
    const priceRef = useRef();
    const imageRef = useRef();
    const dispatch = useDispatch();
    const categories = useSelector(store => store.categories); // Assuming products are categorized

    const [selectedProducts, setSelectedProducts] = useState([]); // Track selected products
    const [quantities, setQuantities] = useState({}); // Track quantities for selected products

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/with-products');
                dispatch(setCategories(response.data)); // Fetch categories with products
            } catch (error) {
                console.error('Error fetching categories and products:', error);
                toast.error('Error fetching products.');
            }
        };

        fetchCategories();
    }, [dispatch]);

    const handleProductSelection = (productId) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(productId)) {
                const updatedSelected = prevSelected.filter(id => id !== productId);
                const { [productId]: _, ...rest } = quantities; // Remove quantity for unselected product
                setQuantities(rest);
                return updatedSelected; // Remove if already selected
            } else {
                setQuantities(prevQuantities => ({
                    ...prevQuantities,
                    [productId]: 1 // Initialize quantity to 1 for newly selected product
                }));
                return [...prevSelected, productId]; // Add if not selected
            }
        });
    };

    const handleQuantityChange = (productId, value) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: Math.max(1, parseInt(value)) // Ensure quantity is at least 1
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const title = titleRef.current.value;
            const price = parseFloat(priceRef.current.value);
            const image = imageRef.current.files[0]; // If you're using an image
    
            // Validate the price
            if (isNaN(price)) {
                toast.error('Price must be a valid number.');
                return; // Prevent submission if price is invalid
            }
    
            // Prepare the products data correctly as an array of ObjectId strings
            // Ensure selectedProducts contains valid ObjectId strings that exist in your Product collection
            const products = selectedProducts.map(productId => ({
                productId: productId,
                quantity: quantities[productId] // Ensure this value is a number
            }));            
    
            // Log to check values being submitted
            console.log('Submitting deal:', { title, price, products });
    
            const dealData = {
                name: title,
                price, // Make sure this is a number
                products // Send the array of ObjectIds directly
            };
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
    
            // Log to confirm the dealData structure
            console.log('Deal data:', dealData);
    
            // Post the deal data to the server
            const response = await axios.post('http://localhost:8000/api/deals', dealData, config);
    
            if (response.status === 201) {
                toast.success(`${title} deal created successfully!`);
            }
        } catch (error) {
            console.error('Error creating deal:', error);
            toast.error('Error creating deal.');
        }
    };
      

    return (
        <div className="flex items-center justify-center min-h-screen bg-[rgb(255,206,146)]">
            <div className="bg-[rgb(207,156,90)] shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Create Deal</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Deal Title"
                        ref={titleRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        ref={priceRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="file"
                        ref={imageRef}
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        accept="image/*"
                    />

                    <div className="mb-4">
                        <h4 className="font-semibold mb-2">Select Products for Deal:</h4>
                        {categories.map(category => (
                            <div key={category._id} className="mb-2">
                                <h5 className="font-medium">{category.title}</h5>
                                <div className="flex flex-wrap gap-2">
                                    {category.products.map(product => (
                                        <div key={product._id} className="flex items-center mb-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={product._id}
                                                    onChange={() => handleProductSelection(product._id)}
                                                    className="mr-2"
                                                />
                                                {product.name}
                                            </label>
                                            {selectedProducts.includes(product._id) && (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantities[product._id] || 1}
                                                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                                    className="w-16 p-1 border border-gray-300 rounded-md ml-2"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Create Deal
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateDeal;
