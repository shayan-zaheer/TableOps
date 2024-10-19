// import { useDispatch, useSelector } from 'react-redux';
// import { setDeals, removeProductFromDeal } from '../store/dealSlice'; // Assuming you have a dealSlice set up
// import axios from "axios";
// import Deal from '../components/Deal'; // You'd need a Deal component similar to Product
// import { useEffect } from 'react';

// const DealsPage = () => {
//     const dispatch = useDispatch();
//     const deals = useSelector(store => store.deals); // Fetching deals from the Redux store

//     const deleteProductHandler = (productId, dealId) => {
//         dispatch(removeProductFromDeal({ productId, dealId }));

//         axios.delete(`http://localhost:8000/api/products/${productId}`)
//             .then(response => {
//                 console.log("Product deleted:", response.data);
//             })
//             .catch(error => {
//                 console.error("Error deleting product:", error);
//             });
//     };

//     useEffect(() => {
//       const fetchDeals = async () => {
//           try {
//               const response = await axios.get('http://localhost:8000/api/deals/with-products');
//               dispatch(setDeals(response.data)); // Storing fetched deals in Redux
//           } catch (error) {
//               console.error("Error fetching deals:", error);
//           }
//       };

//       fetchDeals();
//   }, [dispatch]);

//     return (
//         <div className="flex flex-col items-center py-8 h-100 bg-[rgb(255,206,146)]">
//             {deals.length > 0 ? (
//                 deals.map((deal) => (
//                     <div key={deal._id} className="w-full max-w-4xl mb-10">
//                         <h2 className="text-2xl font-bold mb-4">{deal.title}</h2>
//                         <div className="flex flex-row justify-center flex-wrap gap-6">
//                             {deal.products.map((product) => (
//                                 <Deal
//                                     key={product._id}
//                                     name={product.name}
//                                     price={product.price}
//                                     image={product.image}
//                                     dealItems={deal.products} // Passing associated products to Deal component
//                                     onDelete={() => deleteProductHandler(product._id, deal._id)}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <p className="text-center text-gray-700">No deals or products available.</p>
//             )}
//         </div>
//     );
// };

// export default DealsPage;

// import { useDispatch, useSelector } from 'react-redux';
// import { setDeals, removeProductFromDeal } from '../store/dealSlice'; // Adjust the path if needed
// import axios from "axios";
// import Deal from '../components/Deal'; // Adjust the path if needed
// import { useEffect } from 'react';

// const DealsPage = () => {
//     const dispatch = useDispatch();
//     const deals = useSelector(store => store.deal.deals); // Fetching deals from the Redux store
//     console.log(deals);

//     const deleteProductHandler = (productId, dealId) => {
//         dispatch(removeProductFromDeal({ productId, dealId }));

//         axios.delete(`http://localhost:8000/api/products/${productId}`)
//             .then(response => {
//                 console.log("Product deleted:", response.data);
//             })
//             .catch(error => {
//                 console.error("Error deleting product:", error);
//             });
//     };

//     useEffect(() => {
//         const fetchDeals = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/deals/with-products');
//                 console.log("Fetched deals:", response.data); // Log the fetched deals
//                 dispatch(setDeals(response.data)); // Ensure this is an array
//             } catch (error) {
//                 console.error("Error fetching deals:", error);
//             }
//         };

//         fetchDeals();
//     }, [dispatch]);

//     return (
//         <div className="flex flex-col items-center py-8 h-100 bg-[rgb(255,206,146)]">
//             {deals && deals.length > 0 ? ( // Check if deals is defined
//                 deals.map((deal) => (
//                     <div key={deal._id} className="w-full max-w-4xl mb-10">
//                         <h2 className="text-2xl font-bold mb-4">{deal.name}</h2>
//                         <div className="flex flex-row justify-center flex-wrap gap-6">
//                             {deal.products.map((product) => (
//                                 <Deal
//                                     key={product._id}
//                                     name={product.name || "Product Name"} // Fallback for missing name
//                                     price={product.price || 0} // Fallback for missing price
//                                     image={product.image || "placeholder-image-url"} // Fallback for missing image
//                                     dealItems={deal.products} // Passing associated products to Deal component
//                                     onDelete={() => deleteProductHandler(product._id, deal._id)}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <p className="text-center text-gray-700">No deals or products available.</p>
//             )}
//         </div>
//     );
// };

// export default DealsPage;

import { useDispatch, useSelector } from 'react-redux';
import { setDeals, removeProductFromDeal } from '../store/dealSlice'; // Adjust the path if needed
import axios from "axios";
import Deal from '../components/Deal'; // Adjust the path if needed
import { useEffect } from 'react';

const DealsPage = () => {
    const dispatch = useDispatch();
    const deals = useSelector(store => store.deal.deals); // Fetching deals from the Redux store
    console.log(deals);

    const deleteProductHandler = (productId, dealId) => {
        dispatch(removeProductFromDeal({ productId, dealId }));

        axios.delete(`http://localhost:8000/api/products/${productId}`)
            .then(response => {
                console.log("Product deleted:", response.data);
            })
            .catch(error => {
                console.error("Error deleting product:", error);
            });
    };

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/deals/with-products');
                console.log("Fetched deals:", response.data); // Log the fetched deals
                dispatch(setDeals(response.data)); // Ensure this is an array
            } catch (error) {
                console.error("Error fetching deals:", error);
            }
        };

        fetchDeals();
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center py-8 h-100 bg-[rgb(255,206,146)]">
            {deals && deals.length > 0 ? ( // Check if deals is defined
                <div key={deals[0]._id} className="w-full max-w-4xl mb-10"> {/* Access the first deal */}
                    <h2 className="text-2xl font-bold mb-4">{deals[0].name}</h2>
                    <div className="flex flex-row justify-center flex-wrap gap-6">
                        {deals[0].products.map((product) => ( // Map through products of the first deal
                            <Deal
                                key={product._id}
                                name={product.name || "Product Name"} // Fallback for missing name
                                price={product.price || 0} // Fallback for missing price
                                image={product.image || "placeholder-image-url"} // Fallback for missing image
                                dealItems={deals[0].products} // Passing associated products to Deal component
                                onDelete={() => deleteProductHandler(product._id, deals[0]._id)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-700">No deals or products available.</p>
            )}
        </div>
    );
};

export default DealsPage;
