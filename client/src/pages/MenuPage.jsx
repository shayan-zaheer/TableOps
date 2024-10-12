import { useDispatch, useSelector } from 'react-redux';
import { setCategories, removeProductFromCategory } from '../store/categorySlice';
import axios from "axios";
import Product from '../components/Product';
import { useEffect } from 'react';

const MenuPage = () => {
    const dispatch = useDispatch();
    const categories = useSelector(store => store.categories);

    const deleteProductHandler = (productId, categoryId) => {
        dispatch(removeProductFromCategory({ productId, categoryId }));

        axios.delete(`http://localhost:8000/api/products/${productId}`)
            .then(response => {
                console.log("Product deleted:", response.data);
            })
            .catch(error => {
                console.error("Error deleting product:", error);
            });
    };

    useEffect(() => {
      const fetchCategories = async () => {
          try {
              const response = await axios.get('http://localhost:8000/api/categories/with-products');
              dispatch(setCategories(response.data));
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
                                    onDelete={() => deleteProductHandler(product._id, category._id)}
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
};

export default MenuPage;
