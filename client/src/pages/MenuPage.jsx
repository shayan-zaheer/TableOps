import { useDispatch, useSelector } from "react-redux";
import {
    setCategories,
} from "../store/categorySlice";
import axios from "axios";
import Product from "../components/Product";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const MenuPage = () => {
    const dispatch = useDispatch();
    const categories = useSelector((store) => store.categories);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/categories/with-products"
                );
                dispatch(setCategories(response.data));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center py-4 h-auto bg-[rgb(255,206,146)]">
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category._id} className="w-full max-w-4xl mb-6">
                        <h2 className="text-2xl font-bold mb-2 text-center">
                            {category.title}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {category.products.map((product) => (
                                <Product
                                    key={product._id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image}
                                    category={category.title}
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
};

export default MenuPage;
