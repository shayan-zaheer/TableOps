// src/pages/MenuPage.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCategories } from '../store/categorySlice';
import Product from "../components/Product";

function MenuPage() {
    const dispatch = useDispatch();
    const categories = useSelector((store) => store.categories);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/with-products');
                dispatch(setCategories(response.data)); // 
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center py-8 h-100 bg-[rgb(255,206,146)]">
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category._id} className="w-full max-w-4xl mb-10">
                        <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                        <div className="flex flex-row justify-center flex-wrap gap-6">
                            {category.products.map((product) => (
                                <Product
                                    key={product._id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image}
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-700">No categories or products available.</p>
            )}
        </div>
    );
}

export default MenuPage;
